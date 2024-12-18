import { isArray, isEqual, isObject, transform } from "lodash";

export const jsonStringify = (obj: any) => {
  try {
    if (obj) {
      return JSON.stringify(obj);
    }
    return undefined;
  } catch (e) {
    return undefined;
  }
};

export const jsonParse = <T>(objStr: string | undefined) => {
  try {
    if (objStr) {
      return JSON.parse(objStr) as T;
    }
    return undefined;
  } catch (e) {
    return undefined;
  }
};

export const cloneAndDeleteProperty = <T, K extends keyof T>(
  obj: T,
  propToDelete: K
): Omit<T, K> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [propToDelete]: _, ...clonedObj } = obj;
  return clonedObj;
};

export const differenceObject = (origObj: any, newObj: any): any => {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const changes = (newObj: any, origObj: any) => {
    let arrayIndexCounter = 0;
    return transform(newObj, (result: any, value: any, key: string) => {
      if (!isEqual(value, origObj[key])) {
        // eslint-disable-next-line no-plusplus
        const resultKey = isArray(origObj) ? arrayIndexCounter++ : key;
        result[resultKey] =
          isObject(value) && isObject(origObj[key])
            ? changes(value, origObj[key])
            : value;
      }
    });
  };
  return changes(newObj, origObj);
};

type KeyValue = {
  key: string;
  value: any; // Bạn có thể thay 'any' bằng kiểu dữ liệu cụ thể nếu biết trước kiểu của các giá trị trong đối tượng
};

export const convertObjectToArray = (
  obj: Record<string, any> | null | undefined
): KeyValue[] => {
  const result: KeyValue[] = [];

  if (obj) {
    Object.keys(obj).forEach((key) => {
      result.push({
        key,
        value: obj[key],
      });
    });
  }

  return result;
};
