import { createBrowserRouter, Navigate } from "react-router";
import AuthLayout from "@/features/authentication/layouts/auth-layout";
import AuthErrorView from "@/features/authentication/views/auth-error-view";
import LoginView from "@/features/authentication/views/login-view";
import RegisterView from "@/features/authentication/views/register-view";
import { RouteErrorBoundary } from "@/shared/components/route-error-boundary";
import SidebarLayout from "@/shared/layouts/sidebar-layout";
import { customersLoader } from "@/shared/router/loaders/customers-loader";
import { dashboardLoader } from "@/shared/router/loaders/dashboard-loader";
import {
  collectorsLoader,
  mapLoader,
  sectorsLoader,
  settingsLoader,
} from "@/shared/router/loaders/protected-routes-loader";
import { authProtectedMiddleware } from "@/shared/router/middlewares/auth-protected";
import { authPublicMiddleware } from "@/shared/router/middlewares/auth-public";
import {
  CollectorsRoute,
  CustomersRoute,
  DashboardRoute,
  MapRoute,
  SectorsRoute,
  SettingsRoute,
} from "./components/route-components";

export const router = createBrowserRouter([
  {
    path: "/",
    loader: dashboardLoader,
    middleware: [authProtectedMiddleware],
    element: <SidebarLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <DashboardRoute />,
      },
      {
        path: "collectors",
        loader: collectorsLoader,
        element: <CollectorsRoute />,
      },
      {
        path: "customers",
        loader: customersLoader,
        element: <CustomersRoute />,
      },
      {
        path: "map",
        loader: mapLoader,
        element: <MapRoute />,
      },
      {
        path: "map/:clientId",
        loader: mapLoader,
        element: <MapRoute />,
      },
      {
        path: "sectors",
        loader: sectorsLoader,
        element: <SectorsRoute />,
      },
      {
        path: "settings",
        loader: settingsLoader,
        element: <SettingsRoute />,
      },
    ],
  },
  {
    path: "/auth",
    middleware: [authPublicMiddleware],
    element: <AuthLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate replace to="login" />,
      },
      {
        path: "register",
        element: <RegisterView />,
      },
      {
        path: "login",
        element: <LoginView />,
      },
      {
        path: "error",
        element: <AuthErrorView />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate replace to="/" />,
  },
]);
