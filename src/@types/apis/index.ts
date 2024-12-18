import { CancelTokenSource, Method } from "axios";
import { EToastType } from "../common";

export type TCancelTokenSource = {
  source: CancelTokenSource;
  id: string;
  name?: string;
};
export enum EApiMethod {
  GET = "GET",
  DELETE = "DELETE",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
}

export type TApiDataCommon = {
  query?: Record<string, any>;
  param?: { [key: string]: string | number | boolean | null | undefined };
  body?: { [key: string]: string | number | boolean | null | undefined | any };
};

export type TResponseErrorCommon<T = undefined> = {
  ec: number;
  msg: string;
  data?: T;
};
export type TResponseDataObj<T> = {
  ec: number;
  total?: number;
  data: T;
  msg?: string;
};
export type TResponseDataArr<T> = {
  ec: number;
  total: number;
  data: T[];
  msg?: string;
};
export type TApiProps<TDataAPI, TResponse, TResponseError> = {
  method?: Method;
  baseUrl?: string;
  servicePath?: string;
  path?: string;
  isAuth?: boolean;
  data?: TDataAPI;
  name?: string;
  retry?: number;
  timeout?: number;
  token?: string;
  errorHandler?: {
    toastOptions?: {
      isToast: boolean;
      type?: EToastType;
      title?: string;
      message?: string;
    };
    callBack?: (error: TResponseError) => void;
  };
  successHandler?: {
    toastOptions?: {
      isToast: boolean;
      type?: EToastType;
      title: string;
      message: string;
    };
    callBack?: (data: TResponse) => void;
  };
};
