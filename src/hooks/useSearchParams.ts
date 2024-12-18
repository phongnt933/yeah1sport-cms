import { useEffect, useState } from "react";
import { useNavigate, useLocation, createSearchParams } from "react-router-dom";
import queryString from "query-string";

import { omitIsNil } from "../utils/omit";
import { TAnyObject } from "../@types/common";

const useSearchParams = (init?: TAnyObject) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [allParams, setAllParams] = useState<TAnyObject>({ ...init });

  const addParams = <
    T extends Record<
      string,
      string | number | boolean | Array<string | number>
    >,
  >(
    params: T
  ) => {
    const searchParams = queryString.parse(location.search);
    const newSearchParams = { ...searchParams, ...params };

    const searchString = queryString.stringify(
      omitIsNil(newSearchParams, { deep: false })
    );
    navigate(`${location.pathname}?${searchString}`);
  };

  const removeParam = (paramName: string | string[]) => {
    if (!paramName || paramName.length === 0) return;
    const searchParams = queryString.parse(location.search);
    if (Array.isArray(paramName)) {
      paramName.forEach((item) => {
        delete searchParams[item];
      });
    } else {
      delete searchParams[paramName];
    }
    const searchString = queryString.stringify(searchParams);
    navigate(`${location.pathname}?${searchString}`);
  };

  const removeAllParams = () => {
    if (!location.search) return;
    navigate(location.pathname);
  };
  const getAllParams = <T>(initData: T) => {
    const params = { ...initData, ...queryString.parse(location.search) };
    return params as unknown as T;
  };
  const getParam = (value: string) => {
    return value;
  };
  const setParams = <T extends Record<string, string | number | boolean>>(
    params: T
  ) => {
    setAllParams({ ...params });
    const searchString = queryString.stringify(params);
    navigate(`${location.pathname}?${searchString}`);
  };
  useEffect(() => {
    setAllParams(getAllParams({}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);
  return {
    allParams,
    addParams,
    setParams,
    removeParam,
    removeAllParams,
    getAllParams,
    getParam,
    navigate,
    pathName: location.pathname,
    createSearchParams,
  };
};

export default useSearchParams;
