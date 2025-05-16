"use client";

import { FiltersProvider } from "@/contexts/filters-context";
import { GoogleMapsProvider } from "@/contexts/google-maps-context";

import { DashboardNav } from "@/components/dashboard-nav";
import { MainLayout } from "@/components/layout/main-layout";

export default function DashboardLayout({ children }) {
  return (
    <FiltersProvider>
      <GoogleMapsProvider>
        <MainLayout>
          <div className="h-[calc(100vh-3.5rem)] flex">
            <DashboardNav />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </MainLayout>
      </GoogleMapsProvider>
    </FiltersProvider>
  );
}
