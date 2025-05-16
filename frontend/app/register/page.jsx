"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/visdak-auth/src/api/auth";
import { useAuth } from "@/visdak-auth/src/hooks/useAuth";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { MainLayout } from "@/components/layout/main-layout";

const validatePasswords = (data) => {
  if (data.password !== data.confirmPassword) {
    return { confirmPassword: "Passwords do not match" };
  }
  return {};
};

export default function RegisterPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: (data) => {
      const errors = {};
      if (!data.name) {
        errors.name = "Name is required";
      }
      if (!data.email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data.email)) {
        errors.email = "Please enter a valid email address";
      }
      if (
        !data.password ||
        data.password.length < 8 ||
        data.password.length > 30
      ) {
        errors.password = "Password must be 8-30 characters";
      }
      if (!data.role) {
        errors.role = "Please select your role";
      }
      return {
        values: data,
        errors: { ...errors, ...validatePasswords(data) },
      };
    },
  });

  const onSubmit = async (data) => {
    try {
      if (!data.role) {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: "Please select your role to continue.",
        });
        return;
      }

      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role === "developer" ? "seller" : "buyer",
      });

      toast({
        title: "Registration Successful",
        description: "Please verify your email.",
      });
      router.push("/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description:
          error.response?.data?.error?.details || "Please try again later.",
      });
    }
  };

  // Show nothing while checking auth status
  if (loading || (!loading && user)) {
    return null;
  }

  return (
    <MainLayout>
      <main className="flex items-center justify-center min-h-[calc(100vh-7rem)] px-4 md:px-8">
        <div className="w-full max-w-md">
          <div className="rounded-lg border bg-card p-8 md:my-10">
            <div className="space-y-2 text-center mb-10">
              <h1 className="text-3xl font-bold">Create an Account</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role">
                    I am a <span className="text-destructive">*</span>
                  </Label>
                  <Select onValueChange={(value) => setValue("role", value)}>
                    <SelectTrigger
                      className={errors.role ? "border-destructive" : ""}
                    >
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="buyer">Housing Association</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <p className="text-sm text-destructive">{errors.role}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    {...register("name")}
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">
                    Password <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    {...register("password")}
                    className={errors.password ? "border-destructive" : ""}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    Confirm Password <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...register("confirmPassword")}
                    className={
                      errors.confirmPassword ? "border-destructive" : ""
                    }
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <Button
                  type="submit"
                  className="w-full bg-web-orange hover:bg-web-orange/90 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Registering..." : "Register"}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-havelock-blue hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>

      <footer className="border-t bg-background/60 backdrop-blur-sm h-14">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-center h-14 text-sm text-muted-foreground">
            © 2024 FGB Acumen. All rights reserved.
          </div>
        </div>
      </footer>
    </MainLayout>
  );
}
