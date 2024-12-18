import React from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import HomePage from "../pages/home";
import PrivateRoute from "../components/Route/PrivateRoute";
import PublicRoute from "../components/Route/PublicRoute";
import ROUTE from "../constants/routes";
import UserPage from "../pages/user";
import TeamPage from "../pages/team";
import PromotionPage from "../pages/promotion";
import AuthPage from "../pages/auth";
import BookingPage from "../pages/booking";
import FieldPage from "../pages/field";

interface AppRoute {
  path: ROUTE;
  title: string;
  element: React.ComponentType;
  isPrivate: boolean;
}

// Cấu hình route với isPrivate và PublicRoute/PrivateRoute
const routes: AppRoute[] = [
  {
    path: ROUTE.HOME,
    title: "Dashboard",
    element: HomePage,
    isPrivate: true,
  },
  {
    path: ROUTE.USER,
    title: "Quản lý người dùng",
    element: UserPage,
    isPrivate: true,
  },
  {
    path: ROUTE.TEAM,
    title: "Quản lý đội",
    element: TeamPage,
    isPrivate: true,
  },
  {
    path: ROUTE.PROMOTION,
    title: "Quản lý khuyến mãi",
    element: PromotionPage,
    isPrivate: true,
  },
  {
    path: ROUTE.BOOKING,
    title: "Quản lý booking sân",
    element: BookingPage,
    isPrivate: true,
  },
  {
    path: ROUTE.FIELD,
    title: "Quản lý sân",
    element: FieldPage,
    isPrivate: true,
  },

  {
    path: ROUTE.AUTH,
    title: "Xác thực người dùng",
    element: AuthPage,
    isPrivate: false,
  },
];

// Tạo router với createBrowserRouter
const router = createHashRouter(
  routes.map(({ path, element: Component, isPrivate, title }) => ({
    path,
    element: isPrivate ? (
      <PrivateRoute title={title}>
        <Component />
      </PrivateRoute>
    ) : (
      <PublicRoute title={title}>
        <Component />
      </PublicRoute>
    ),
  }))
);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
