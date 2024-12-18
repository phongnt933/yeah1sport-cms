import { useState } from "react";

const useCallApi = <TParamApi, TResponseData, TResponseError>({
  apiConfig,
  name,
}: {
  apiConfig: (
    param: TParamApi,
    name?: string
  ) => Promise<{
    resData?: TResponseData;
    resError?: TResponseError & { ec?: number | string };
  }>;
  name?: string;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const api = async (
    param: TParamApi,
    callbackHandleSusses?: (res: Awaited<ReturnType<typeof apiConfig>>) => void
  ) => {
    setIsLoading(true);
    try {
      const response = await apiConfig({ ...param }, name);
      if (response) {
        if (response.resError && response?.resError?.ec === -2) {
          return;
        }
        callbackHandleSusses && callbackHandleSusses(response);
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  };
  return { isLoading, api };
};
export default useCallApi;
