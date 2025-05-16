"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/visdak-auth/src/hooks/useAuth";

import { Spinner } from "@/components/ui/spinner";

export default function MapPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Spinner size="lg" className="text-web-orange" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="h-full p-6">
      <h1 className="text-2xl font-bold mb-4">Map</h1>
      <div className="h-[calc(100vh-10rem)] bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">Map will be implemented here</p>
      </div>
    </div>
  );
}
