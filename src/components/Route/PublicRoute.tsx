import React, { PropsWithChildren, useEffect } from "react";

interface PublicRouteProps {
  title: string;
}

function PublicRoute(props: PropsWithChildren<PublicRouteProps>) {
  const { title, children } = props;

  useEffect(() => {
    document.title = title;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}

export default PublicRoute;
