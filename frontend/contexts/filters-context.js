"use client";

import { createContext, useContext, useState } from "react";

const FiltersContext = createContext(null);

const DEBUG = process.env.NEXT_PUBLIC_DEBUG_MODE === "true";
const log = {
  info: (...args) => DEBUG && console.log("🔵", ...args),
  state: (...args) => DEBUG && console.log("📊", ...args),
  action: (...args) => DEBUG && console.log("🎯", ...args),
};

export function FiltersProvider({ children }) {
  const [filters, setFilters] = useState({
    regions: [],
    plots: {},
    planningStatus: [],
    landPurchaseStatus: [],
    opportunityType: [],
    startDate: {},
    firstHandoverDate: {},
    finalHandoverDate: {},
    siteAddedDate: {},
    showShortlisted: false,
    showDrafts: false,
  });

  const [viewMode, setViewMode] = useState("list");

  const handleFilterChange = (filterKey, value) => {
    log.action("Filter change:", { filterKey, value });
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  const handleViewModeChange = (mode) => {
    log.action("View mode change triggered");
    log.state("Current view mode:", viewMode);

    // If mode is provided, use it directly, otherwise toggle
    const newMode = mode || (viewMode === "list" ? "map" : "list");
    log.action("Setting new view mode:", newMode);

    setViewMode(newMode);
    log.state("Updated view mode:", newMode);
  };

  return (
    <FiltersContext.Provider
      value={{
        filters,
        handleFilterChange,
        viewMode,
        handleViewModeChange,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FiltersContext);
  if (!context) {
    throw new Error("useFilters must be used within a FiltersProvider");
  }
  return context;
}
