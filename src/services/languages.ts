import en from "../languages/en";

export const getApiErrorMess = (value: string) => {
  if (value in en) {
    return en[value as keyof typeof en];
  }
  return undefined;
};
