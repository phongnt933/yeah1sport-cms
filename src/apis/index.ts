import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

import { store } from "../redux/store";
import errorHandlerCommon from "./errorCommonHandler";
import { EToastType } from "../@types/common";
import {
  EApiMethod,
  TApiDataCommon,
  TApiProps,
  TCancelTokenSource,
  TResponseErrorCommon,
} from "../@types/apis";
import apiUrlCreator from "../services/apiUrlCreator";
import { API_TIMEOUT, API_URL } from "../configs";
import { clearData } from "../redux/slices/authSlice";
import { getApiErrorMess } from "../services/languages";
import en from "../languages/en";
import { redirectToLogin } from "../helpers";

let cancelTokenSources: TCancelTokenSource[] = [];
let getAccessTokenStatus: "init" | "waiting" | "fail" | "success" = "init";
const statusCodeRetry = [500, 502, 503, 504, 408, 410, 429];
const axiosCodeRetry = ["ERR_NETWORK", "ECONNABORTED"];
const TOKEN_EXPIRED_CANCEL_MSG = "Code 419";
const DUPLICATE_API_CANCEL_MSG = "Duplicate api";

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function callApi<
  TConfigApiData extends TApiDataCommon,
  TResponseData,
  TResponseErrorData = undefined,
>(
  props: TApiProps<
    TConfigApiData,
    TResponseData,
    TResponseErrorCommon<TResponseErrorData>
  >
): Promise<{
  resData?: TResponseData;
  resError?: TResponseErrorCommon<TResponseErrorData>;
}> {
  const {
    method = EApiMethod.GET,
    baseUrl = API_URL,
    path,
    isAuth = false,
    data,
    name,
    token,
    errorHandler = {
      toastOptions: {
        isToast: true,
        title: en.error,
        type: EToastType.error,
      },
      callBack: undefined,
    },
    retry = 0,
    timeout = Number(API_TIMEOUT),
    successHandler,
  } = props;
  const cancelToken = axios.CancelToken.source();
  const id = uuidv4();
  if (!isAuth) {
    cancelTokenSources = cancelTokenSources.filter((item) => {
      if (name && item?.name === name) {
        item.source.cancel(DUPLICATE_API_CANCEL_MSG);
      }
      return name && item.name !== name;
    });
    cancelTokenSources.push({ source: cancelToken, id, name });
  }

  const storage = store.getState().auth.storage;

  const authorizationToken = token || storage?.accessToken;

  try {
    const response = await axios({
      method,
      url: apiUrlCreator(baseUrl, path, data?.query, data?.param),
      data: data?.body,
      headers: {
        "Content-Type": "application/json",
        ...(!isAuth && authorizationToken
          ? {
              Authorization: `Bearer ${authorizationToken}`,
            }
          : {}),
      },
      timeout,
      cancelToken: cancelToken.token,
      validateStatus(status) {
        return status >= 200 && status < 300;
      },
    });
    cancelTokenSources = cancelTokenSources.filter((item) => item.id !== id);
    if (response.data.ec === 0) {
      const resData = response.data as TResponseData;

      if (successHandler) {
        successHandler?.toastOptions?.isToast &&
          errorHandlerCommon(
            successHandler?.toastOptions?.type || EToastType.success,
            successHandler?.toastOptions.title || "Success",
            successHandler?.toastOptions.message || ""
          );
        successHandler?.callBack && successHandler?.callBack(resData);
      }

      return {
        resData: { ...resData },
      };
    }
    const resError = {
      ec: response.data.ec,
      msg: response.data.msg,
      data: response.data.data,
    };
    if (errorHandler) {
      errorHandler?.toastOptions?.isToast &&
        errorHandlerCommon(
          errorHandler?.toastOptions?.type || EToastType.error,
          errorHandler.toastOptions.title,
          resError.msg
        );
      errorHandler?.callBack && errorHandler?.callBack(resError);
    }
    return {
      resError: {
        ...resError,
      },
    };
  } catch (error) {
    const err = error as any;

    // case cancel
    if (axios.isCancel(err)) {
      if (err.message === TOKEN_EXPIRED_CANCEL_MSG) {
        while (!isAuth && getAccessTokenStatus === "waiting") {
          // eslint-disable-next-line no-await-in-loop
          await sleep(500);
        }
        if (getAccessTokenStatus === "success") {
          cancelTokenSources = cancelTokenSources.filter(
            (item) => item.id !== id
          );
          // eslint-disable-next-line no-return-await
          return await callApi<
            TConfigApiData,
            TResponseData,
            TResponseErrorData
          >(props);
        }

        if (getAccessTokenStatus === "fail") {
          const resError = {
            ec: -1,
            msg: en["-1"],
          };
          if (errorHandler) {
            errorHandler?.callBack && errorHandler?.callBack(resError);
          }
          cancelTokenSources = cancelTokenSources.filter(
            (item) => item.id !== id
          );
          return {
            resError,
          };
        }
      }
      if (err.message === DUPLICATE_API_CANCEL_MSG) {
        const resError = {
          ec: -2,
          msg: en["-2"],
        };
        return { resError };
      }
    }

    // case 419
    if (
      !isAuth &&
      err.response &&
      err.response.status &&
      err.response.status === 419
    ) {
      cancelTokenSources
        .filter((ct) => ct.id !== id)
        .forEach((ct) => ct.source.cancel(TOKEN_EXPIRED_CANCEL_MSG));

      toast("Token expired", { type: "error" });
      store.dispatch(clearData());
      redirectToLogin();
    }
    // retry case: HTTP CODE in statusCodeRetry,
    if (
      !isAuth &&
      ((err.response &&
        err.response.status &&
        statusCodeRetry.includes(err.response.status)) ||
        axiosCodeRetry.includes(err.code)) &&
      retry > 0
    ) {
      await sleep(500);
      const newRetry = retry - 1;
      cancelTokenSources = cancelTokenSources.filter((item) => item.id !== id);
      // eslint-disable-next-line no-return-await
      return await callApi<TConfigApiData, TResponseData, TResponseErrorData>({
        ...props,
        retry: newRetry,
      });
    }

    // return err case: Handle data in try error, other HTTP CODE
    const resError = {
      ec: err?.response?.data?.ec || err?.response?.code || -1,
      msg:
        getApiErrorMess(err?.response?.data?.ec || err?.response?.code) ||
        (err.response?.data.msg as string) ||
        en["-1"],
      data: err?.response?.data?.data,
    };

    if (errorHandler) {
      errorHandler?.toastOptions?.isToast &&
        errorHandler?.toastOptions?.isToast &&
        errorHandlerCommon(
          EToastType.error,
          errorHandler.toastOptions.title,
          resError.msg
        );
      errorHandler?.callBack && errorHandler?.callBack(resError);
    }
    cancelTokenSources = cancelTokenSources.filter((item) => item.id !== id);
    return {
      resError: {
        ...resError,
      },
    };
  }
}
