import React from "react";
import { Avatar, Dropdown, Flex, Layout, Typography, theme } from "antd";
import { useLocation } from "react-router-dom";
import { menu } from "./Sidebar";
import { useStyle } from "./styles";
import { useAppDispatch, useAppSelector } from "../../redux";
import { clearData } from "../../redux/slices/authSlice";
import { redirectToLogin } from "../../helpers";
import { ROLE } from "../../constants/role";

const { Header } = Layout;
function AppHeader() {
  const { styles } = useStyle();
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((s) => s.auth.storage);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(clearData());
    redirectToLogin();
  };

  return (
    <Header
      style={{
        padding: 0,
        background: colorBgContainer,
        height: 56,
      }}
    >
      <Flex
        align="center"
        justify="space-between"
        style={{ padding: "0 36px", height: "100%" }}
      >
        <Typography style={{ fontSize: 14, fontWeight: 500 }}>
          {menu.find((item) => item.key === location.pathname)?.title}
        </Typography>
        <Flex gap={8}>
          <Avatar
            className={styles.avatar}
            style={{ backgroundColor: "#f56a00", verticalAlign: "middle" }}
            size="large"
          >
            <Typography.Text
              style={{
                fontSize: 20,
                fontWeight: 600,
                margin: 0,
                color: "inherit",
                lineHeight: "normal",
              }}
            >
              {userInfo?.username[0].toUpperCase()}
            </Typography.Text>
          </Avatar>
          <Dropdown
            menu={{
              items: [
                {
                  key: "1",
                  label: <Typography.Text>Chỉnh sửa thông tin</Typography.Text>,
                },
                {
                  key: "2",
                  label: (
                    <Typography.Text
                      style={{
                        fontSize: 12,
                        margin: 0,
                      }}
                    >
                      Đăng xuất
                    </Typography.Text>
                  ),
                  onClick: handleLogout,
                },
              ],
            }}
          >
            <Flex vertical style={{ cursor: "pointer" }}>
              <Typography.Text
                style={{ fontSize: 14, fontWeight: 600, margin: 0 }}
              >
                {userInfo?.username}
              </Typography.Text>
              <Typography.Text
                style={{
                  fontSize: 12,
                  margin: 0,
                }}
              >
                {userInfo?.role === ROLE.ADMIN
                  ? "Quản trị"
                  : userInfo?.role === ROLE.FIELD_OWNER
                    ? "Chủ sân"
                    : "Trọng tài"}
              </Typography.Text>
            </Flex>
          </Dropdown>
        </Flex>
      </Flex>
    </Header>
  );
}

export default AppHeader;
