"use client";

import { useAuth } from "@/visdak-auth/src/hooks/useAuth";

import { BuyerSidebar } from "@/components/filters/sidebar/buyer-sidebar";
import { SellerSidebar } from "@/components/filters/sidebar/seller-sidebar";

export function MobileNav() {
  const { user } = useAuth();

  if (user?.role === "buyer") {
    return <BuyerSidebar />;
  }

  if (user?.role === "seller") {
    return <SellerSidebar />;
  }

  // Default to buyer view
  return <BuyerSidebar />;
}
