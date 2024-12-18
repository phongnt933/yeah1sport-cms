import { toast } from "react-toastify";
import { EToastType } from "../@types/common";

const errorHandlerCommon = (
  type: EToastType,
  title?: string | JSX.Element,
  message?: string | JSX.Element
) => {
  message && title && toast(message, { type, data: { title } });
};
export default errorHandlerCommon;
