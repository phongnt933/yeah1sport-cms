/* eslint-disable default-param-last */
/* eslint-disable no-param-reassign */
const omitBy = (obj = {}, listKeys = [], { deep = false }) => {
  if (typeof obj !== "object" || !obj) return {};
  if (!Array.isArray(listKeys)) return {};

  listKeys.forEach((key) => {
    delete obj[key];
  });

  if (deep) {
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === "object") {
        omitBy(obj[key], listKeys);
      }
    });
  }

  return obj;
};

const omitIsNil = (obj, { deep = false, emptyString = false }) => {
  if (typeof obj !== "object" || !obj) return {};

  Object.keys(obj).forEach((key) => {
    if (
      obj[key] === undefined ||
      obj[key] === null ||
      (!emptyString && obj[key] === "") ||
      Number.isNaN(obj[key])
    ) {
      delete obj[key];
    }
  });

  if (deep) {
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === "object") {
        omitIsNil(obj[key], { deep: true });
      }
    });
  }

  return obj;
};

export { omitBy, omitIsNil };
