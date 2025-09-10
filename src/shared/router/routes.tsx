import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import SidebarLayout from "@/shared/layouts/sidebar-layout";
import AuthLayout from "@/features/authentication/layouts/auth-layout";
import { ProtectedRoute } from "@/shared/components/protected-route";
import { PublicRoute } from "@/shared/components/public-route";

import AuthErrorView from "@/features/authentication/views/auth-error-view";
import LoginView from "@/features/authentication/views/login-view";
import RegisterView from "@/features/authentication/views/register-view";
import { DashboardView } from "@/features/dashboard/dashboard-view";

const CollectorsView = lazy(() => import("../../features/collectors/collectors-view"));
const CustomersView = lazy(() => import("../../features/customers/customers-view"));

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
