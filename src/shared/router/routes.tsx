import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthLayout from "@/features/authentication/layouts/auth-layout";
import AuthErrorView from "@/features/authentication/views/auth-error-view";
import LoginView from "@/features/authentication/views/login-view";
import RegisterView from "@/features/authentication/views/register-view";
import { DashboardView } from "@/features/dashboard/dashboard-view";
import { ProtectedRoute } from "@/shared/components/protected-route";
import { PublicRoute } from "@/shared/components/public-route";
import SidebarLayout from "@/shared/layouts/sidebar-layout";

const CollectorsView = lazy(() => import("../../features/collectors/collectors-view"));
const CustomersView = lazy(() => import("../../features/customers/customers-view"));
const MapView = lazy(() => import("../../features/map/map-view"));
const SettingsView = lazy(() => import("../../features/settings/settings-view"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <SidebarLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardView />,
      },
      {
        path: "collectors",
        element: <CollectorsView />,
      },
      {
        path: "customers",
        element: <CustomersView />,
      },
      {
        path: "map",
        element: <MapView />,
      },
      {
        path: "map/:clientId",
        element: <MapView />,
      },
      {
        path: "settings",
        element: <SettingsView />,
      },
    ],
  },
  {
    path: "/auth",
    element: (
      <PublicRoute>
        <AuthLayout />
      </PublicRoute>
    ),
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
