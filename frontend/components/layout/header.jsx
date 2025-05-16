"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/visdak-auth/src/hooks/useAuth";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import LogoBlack from "@/components/logo/LogoBlack";
import LogoWhite from "@/components/logo/LogoWhite";

import { MobileNav } from "../dashboard-nav/mobile-nav";
import { UserControls } from "./user-controls";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useAuth();
  const isLoggedIn = !!user;

  if (loading) {
    return (
      <header className="fixed w-full top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-1">
        <div className="flex h-12 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="block ml-2 dark:hidden w-48 h-10">
              <LogoBlack />
            </div>
            <div className="hidden md:-ml-6 dark:block w-48 h-10">
              <LogoWhite />
            </div>
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed w-full top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-1">
      <div className="flex h-12 items-center justify-between px-4 md:px-6">
        <Link
          href={isLoggedIn ? "/dashboard" : "/"}
          className="flex items-center space-x-2"
        >
          <div className="block ml-2 dark:hidden w-48 h-10">
            <LogoBlack />
          </div>
          <div className="hidden md:-ml-6 dark:block w-48 h-10">
            <LogoWhite />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center">
          {isLoggedIn ? (
            <UserControls showLabels={true} />
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-web-orange hover:bg-web-orange/90 text-white">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">
                {isOpen ? "Close menu" : "Open menu"}
              </span>
            </Button>
            <SheetContent side="right" className="w-72 p-0">
              <SheetHeader className="px-4 py-2">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col h-full">
                {isLoggedIn ? (
                  <>
                    <div className="flex-1 overflow-y-auto">
                      <MobileNav />
                    </div>
                    <div className="p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                      <UserControls
                        className="flex-col gap-2"
                        showLabels={true}
                      />
                    </div>
                  </>
                ) : (
                  <div className="p-4 flex flex-col gap-2">
                    <Link href="/login" className="w-full">
                      <Button variant="ghost" className="w-full justify-start">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register" className="w-full">
                      <Button className="w-full justify-start bg-web-orange hover:bg-web-orange/90 text-white">
                        Register
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
