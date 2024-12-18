import { LOGIN_PATH } from "../configs";

export const redirectToLogin = () => {
  window.location.assign(LOGIN_PATH || "");
};
