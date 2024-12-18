import Sider from "antd/es/layout/Sider";
import React, { useState } from "react";
import ROUTE from "../../constants/routes";
import { Flex, Image, Menu, MenuProps } from "antd";
import IMAGES from "../../constants/images";
import {
  CalendarOutlined,
  DashboardOutlined,
  EnvironmentOutlined,
  GiftOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux";
import { ROLE } from "../../constants/role";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

export const menu = [
  {
    title: "Dashboard",
    key: ROUTE.HOME,
    icon: <DashboardOutlined />,
    role: [ROLE.ADMIN, ROLE.FIELD_OWNER, ROLE.REFEREE],
  },
  {
    title: "Quản lý booking",
    key: ROUTE.BOOKING,
    icon: <CalendarOutlined />,
    role: [ROLE.ADMIN, ROLE.FIELD_OWNER, ROLE.REFEREE],
  },
  {
    title: "Quản lý sân",
    key: ROUTE.FIELD,
    icon: <EnvironmentOutlined />,
    role: [ROLE.ADMIN, ROLE.FIELD_OWNER],
  },
  {
    title: "Quản lý người dùng",
    key: ROUTE.USER,
    icon: <UserOutlined />,
    role: [ROLE.ADMIN],
  },
  {
    title: "Quản lý đội",
    key: ROUTE.TEAM,
    icon: <TeamOutlined />,
    role: [ROLE.ADMIN],
  },
  {
    title: "Quản lý khuyến mãi",
    key: ROUTE.PROMOTION,
    icon: <GiftOutlined />,
    role: [ROLE.ADMIN],
  },
];

function AppSidebar() {
  const userInfo = useAppSelector((s) => s.auth.storage);
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  if (!userInfo?.role) {
    return null;
  }

  const items: MenuItem[] = menu
    .filter(
      (item) => !item.role || (item.role && item.role.includes(userInfo?.role))
    )
    .map((item) => getItem(item.title, item.key, item.icon));

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      width={250}
    >
      <Flex justify="center" style={{ padding: 16 }}>
        <Image preview={false} src={IMAGES.logo} height={32} />
      </Flex>
      <Menu
        theme="dark"
        defaultSelectedKeys={[location.pathname]}
        mode="inline"
        onClick={({ key }) => {
          navigate(key);
        }}
        items={items}
      />
    </Sider>
  );
}

export default AppSidebar;
