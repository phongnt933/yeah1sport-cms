import { useEffect, useState } from "react";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import isEmpty from "lodash/isEmpty";

// import { User } from 'src/@types/entities/User';
import { PAGE_SIZE } from "../configs";

import { TResponseDataArr, TResponseErrorCommon } from "../@types/apis";
import { TAnyObject } from "../@types/common";
import { differenceObject } from "../utils/object";
import useCallApi from "./useCallApi";
import useSearchParams from "./useSearchParams";

const usePagination = <TData, TQuery, TErrorData = undefined>(
  initData: TData[],
  apiConfig: (query: TQuery) => Promise<{
    resData?: TResponseDataArr<TData>;
    resError?: TResponseErrorCommon<TErrorData>;
  }>,
  name?: string
) => {
  const { isLoading, api } = useCallApi({ apiConfig, name });
  const [data, setData] = useState(initData);
  const [total, setTotal] = useState(0);

  const location = useLocation();
  const { addParams, removeAllParams } = useSearchParams();

  const parseSearch = (searchString: string) => {
    const searchParams = queryString.parse(searchString);
    const pageNumber = searchParams.page
      ? parseInt(searchParams.page as string, 10)
      : 1;
    const currentPage = pageNumber >= 1 ? pageNumber : 1;
    const offset = (currentPage - 1) * PAGE_SIZE;

    return {
      currentPage,
      offset,
      searchParams: { ...searchParams, page: pageNumber },
    };
  };
  const getCurrentPage = () => {
    const { currentPage } = parseSearch(location.search);
    return currentPage;
  };
  const getOffset = () => {
    const { offset } = parseSearch(location.search);
    return offset;
  };
  const handleCallApi = async (urlQuery: TQuery) => {
    await api(
      urlQuery,
      (res: {
        resData?: TResponseDataArr<TData>;
        resError?: TResponseErrorCommon<TErrorData>;
      }) => {
        if (res.resData && res.resData.data) {
          if (Math.ceil(res.resData.total / PAGE_SIZE) < getCurrentPage()) {
            setData([]);
            addParams({
              page: Math.ceil(res.resData.total / PAGE_SIZE),
            });
          } else {
            setTotal(res.resData.total);
            setData(res.resData.data);
          }
        } else {
          setTotal(0);
          setData([]);
        }
      }
    );
  };

  const handleChangePagination = (page: number) => {
    if (page !== getCurrentPage()) {
      addParams({ page });
    }
  };

  useEffect(() => {
    const { searchParams } = parseSearch(location.search);
    handleCallApi({
      ...searchParams,
      record: PAGE_SIZE,
      page: getCurrentPage(),
    } as TQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);
  // }, [location.search, user]);

  const reloadData = async (queryOption?: TAnyObject) => {
    if (!isEmpty(queryOption)) {
      const { searchParams } = parseSearch(location.search);
      if (isEmpty(differenceObject(searchParams, queryOption))) {
        await handleCallApi({ record: PAGE_SIZE, ...queryOption } as TQuery);
      } else {
        removeAllParams();
        addParams({ ...queryOption });
      }
    } else {
      const { searchParams } = parseSearch(location.search);
      await handleCallApi({
        record: PAGE_SIZE,
        ...searchParams,
        page: getCurrentPage(),
      } as TQuery);
    }
  };
  return {
    data,
    setData,
    offset: getOffset(),
    currentPage: getCurrentPage(),
    total,
    onPaginationChange: handleChangePagination,
    handleCallApi,
    isLoading,
    reloadData,
  };
};
export default usePagination;
