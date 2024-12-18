export const d3Splitting = (num: any) => {
  try {
    return num
      ? num
          .toString()
          .split(/(?=(?:\d{3})+(?:\.|$))/g)
          .join(".")
      : 0;
  } catch (e) {
    return "";
  }
};
