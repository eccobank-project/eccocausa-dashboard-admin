import { lazy } from "react";
import { CollectorsSkeleton } from "@/shared/components/loading/collectors-skeleton";
import { CustomersSkeleton } from "@/shared/components/loading/customers-skeleton";
import { DashboardSkeleton } from "@/shared/components/loading/dashboard-skeleton";
import { MapSkeleton } from "@/shared/components/loading/map-skeleton";
import { SectorsSkeleton } from "@/shared/components/loading/sectors-skeleton";
import { SettingsSkeleton } from "@/shared/components/loading/settings-skeleton";
import { RouteWrapper } from "../wrappers/route-wrapper";

// Lazy loaded components
const DashboardView = lazy(() =>
  import("../../../features/dashboard/dashboard-view").then((module) => ({
    default: module.DashboardView,
  }))
);

const CollectorsView = lazy(() => import("../../../features/collectors/collectors-view"));

const CustomersView = lazy(() => import("../../../features/customers/customers-view"));

const MapView = lazy(() =>
  import("../../../features/map/map-view").then((module) => ({
    default: module.MapView,
  }))
);

const SectorsView = lazy(() =>
  import("../../../features/sectors/sectors-view").then((module) => ({
    default: module.SectorsView,
  }))
);

const SettingsView = lazy(() => import("../../../features/settings/settings-view"));

// Route components with Suspense + Skeletons
export const DashboardRoute = () => (
  <RouteWrapper fallback={<DashboardSkeleton />}>
    <DashboardView />
  </RouteWrapper>
);

export const CustomersRoute = () => (
  <RouteWrapper fallback={<CustomersSkeleton />}>
    <CustomersView />
  </RouteWrapper>
);

export const CollectorsRoute = () => (
  <RouteWrapper fallback={<CollectorsSkeleton />}>
    <CollectorsView />
  </RouteWrapper>
);

export const MapRoute = () => (
  <RouteWrapper fallback={<MapSkeleton />}>
    <MapView />
  </RouteWrapper>
);

export const SectorsRoute = () => (
  <RouteWrapper fallback={<SectorsSkeleton />}>
    <SectorsView />
  </RouteWrapper>
);

export const SettingsRoute = () => (
  <RouteWrapper fallback={<SettingsSkeleton />}>
    <SettingsView />
  </RouteWrapper>
);
