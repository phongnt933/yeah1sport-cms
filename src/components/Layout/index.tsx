import React, { PropsWithChildren } from "react";
import { Flex, Layout } from "antd";
import AppSidebar from "./Sidebar";
import AppHeader from "./Header";

const { Content } = Layout;

function AppLayout(props: PropsWithChildren) {
  const { children } = props;

  return (
    <Layout style={{ height: "100vh" }}>
      <AppSidebar />
      <Flex vertical style={{ overflow: "hidden" }} flex={1}>
        <AppHeader />
        <Content style={{ overflowY: "auto", padding: 16 }}>{children}</Content>
      </Flex>
    </Layout>
  );
}

export default AppLayout;
