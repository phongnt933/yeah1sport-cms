/* eslint-disable no-restricted-syntax */

import queryString from "query-string";

const apiUrlCreator = (
  baseUrl?: string,
  pathBase?: string,
  query?: Record<string, any>,
  param?: { [key: string]: string | number | boolean | null | undefined }
) => {
  let path = pathBase;
  let queryParsed = "";
  if (baseUrl) {
    if (param) {
      try {
        if (pathBase) {
          path = pathBase.replace(/:([a-zA-Z0-9_]+)/g, (_match, p1) => {
            const found = param[p1];
            if (found) {
              return found.toString();
            }
            return "";
          });
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log("query parsed error", e);
        path = "";
      }
    }
    if (query) {
      queryParsed = `?${queryString.stringify(query, { encode: true })}`;
    }
    return baseUrl + path + queryParsed;
  }
  return "";
};

export default apiUrlCreator;
