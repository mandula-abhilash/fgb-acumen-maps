"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/visdak-auth/src/hooks/useAuth";

import { DesktopNav } from "./desktop-nav";

const DEBUG = process.env.NEXT_PUBLIC_DEBUG_MODE === "true";
const log = {
  info: (...args) => DEBUG && console.log("🧭", ...args),
  auth: (...args) => DEBUG && console.log("🔐", ...args),
};

export function DashboardNav() {
  const { user, loading } = useAuth();
  const router = useRouter();

  log.auth("Auth state:", { user: !!user, loading });

  useEffect(() => {
    if (!loading && !user) {
      log.auth("No authenticated user, redirecting to login");
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    log.info("Loading or no user, rendering nothing");
    return null;
  }

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden lg:block h-full border-r">
        <DesktopNav />
      </div>
    </>
  );
}
