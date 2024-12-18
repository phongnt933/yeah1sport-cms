import { PUBLIC_URL } from "../configs";

const generateResourcePath = (relativePath: string) => {
  return `${PUBLIC_URL}${relativePath}`;
};
export default generateResourcePath;
