import React, { PropsWithChildren, useEffect } from "react";
import { useAppSelector } from "../../redux";
import AppLayout from "../Layout";
import { redirectToLogin } from "../../helpers";

interface PrivateRouteProps {
  title: string;
}

function PrivateRoute(props: PropsWithChildren<PrivateRouteProps>) {
  const { title, children } = props;

  const isLogin = useAppSelector((s) => s.auth.authenticated);

  useEffect(() => {
    document.title = title;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isLogin) {
    redirectToLogin();
    return null;
  }

  return <AppLayout>{children}</AppLayout>;
}

export default PrivateRoute;
