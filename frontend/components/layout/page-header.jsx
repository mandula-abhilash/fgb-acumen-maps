"use client";

import { cn } from "@/lib/utils";

export function PageHeader({ title, children, className }) {
  return (
    <div
      className={cn(
        "sticky mx-6 top-0 bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/80 z-20 py-4 px-6",
        className
      )}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{title}</h2>
        {children}
      </div>
    </div>
  );
}
