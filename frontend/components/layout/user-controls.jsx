"use client";

import Link from "next/link";
import { useAuth } from "@/visdak-auth/src/hooks/useAuth";
import { CirclePower, Moon, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function UserControls({ className, showLabels = true }) {
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="flex items-center gap-2 w-full justify-start"
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        {showLabels && <span>Toggle Theme</span>}
      </Button>

      <Link href="/dashboard/profile" className="w-full">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 w-full justify-start"
        >
          <User className="h-4 w-4" />
          {showLabels && <span>View Profile</span>}
        </Button>
      </Link>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleLogout}
        className="flex items-center gap-2 w-full justify-start"
      >
        <CirclePower className="h-4 w-4" />
        {showLabels && <span>Logout</span>}
      </Button>
    </div>
  );
}
