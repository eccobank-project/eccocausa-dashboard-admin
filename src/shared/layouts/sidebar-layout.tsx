import { RiMapPinLine, RiScanLine, RiSettings2Line, RiTeamLine, RiUserLine } from "@remixicon/react";
import { Outlet, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/shared/components/app-sidebar";
import FeedbackDialog from "@/shared/components/feedback-dialog";
import UserDropdown from "@/shared/components/user-dropdown";

const getBreadcrumbData = (pathname: string) => {
  switch (pathname) {
    case "/":
      return {
        icon: <RiScanLine aria-hidden="true" size={22} />,
        label: "Dashboard",
        page: "Contacts",
      };
    case "/collectors":
      return {
        icon: <RiTeamLine aria-hidden="true" size={22} />,
        label: "Collectors",
        page: "Management",
      };
    case "/customers":
      return {
        icon: <RiUserLine aria-hidden="true" size={22} />,
        label: "Customers",
        page: "Overview",
      };
    case "/map":
      return {
        icon: <RiMapPinLine aria-hidden="true" size={22} />,
        label: "Map",
        page: "Locations",
      };
    case "/settings":
      return {
        icon: <RiSettings2Line aria-hidden="true" size={22} />,
        label: "Settings",
        page: "User Management",
      };
    default:
      return {
        icon: <RiScanLine aria-hidden="true" size={22} />,
        label: "Dashboard",
        page: "Overview",
      };
  }
};

function SidebarLayout() {
  const location = useLocation();
  const breadcrumbData = getBreadcrumbData(location.pathname);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-hidden px-4 text-white md:px-6 lg:px-8">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger className="-ms-4" />
            <Separator className="mr-2 data-[orientation=vertical]:h-4" orientation="vertical" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    {breadcrumbData.icon}
                    <span className="sr-only">{breadcrumbData.label}</span>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{breadcrumbData.page}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto flex gap-3">
            <FeedbackDialog />
            <UserDropdown />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 py-4 lg:gap-6 lg:py-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default SidebarLayout;
