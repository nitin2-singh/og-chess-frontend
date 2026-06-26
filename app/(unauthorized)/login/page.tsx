"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// Using the NEW shadcn UI pattern
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { AxiosError } from "axios";
import { axiosInstance } from "@/lib/axios-instance";
import { cookies } from "@/lib/cookie";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." }),
});

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof loginSchema>) {
    setIsLoading(true);

    try {
      const res = await axiosInstance.post("auth/login", data);

      if (res.data) {
        cookies.setAccessToken(res.data.access_token);
        cookies.setRefreshToken(res.data.refresh_token);

        toast.success("Welcome back!", {
          description: "You have successfully signed in.",
        });

        router.push("/rooms");
      }
    } catch (error) {
      if (error instanceof AxiosError)
        toast.error("Authentication Failed", {
          description:
            error?.response?.data?.message || "Something went wrong.",
        });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex flex-col items-center justify-center p-4 selection:bg-indigo-500/30 transition-colors duration-300 relative overflow-hidden">
      {/* Background Grid & Glow */}
      <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]">
        <div className="absolute left-1/2 top-1/2 -z-10 h-77.5 w-77.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-400 dark:bg-indigo-500 opacity-20 blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-xl shadow-slate-200/20 dark:shadow-none"
        >
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-linear-to-tr from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-purple-600 mb-4 shadow-lg shadow-indigo-500/30">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
              Welcome back
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Enter your credentials to access your account.
            </p>
          </div>

          {/* Form - NEW SHADCN PATTERN */}
          <form
            id="login-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="w-full">
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-slate-700 dark:text-slate-300"
                  >
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="email"
                    placeholder="you@example.com"
                    aria-invalid={fieldState.invalid}
                    className="h-12 bg-slate-50 dark:bg-[#020617]/50 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400"
                  />
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="text-red-500 dark:text-red-400"
                    />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="w-full">
                  <div className="flex items-center justify-between w-full">
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-slate-700 dark:text-slate-300"
                    >
                      Password
                    </FieldLabel>
                    <Link
                      href="#"
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative w-full">
                    <Input
                      {...field}
                      id={field.name}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      aria-invalid={fieldState.invalid}
                      className="h-12 bg-slate-50 dark:bg-[#020617]/50 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="text-red-500 dark:text-red-400"
                    />
                  )}
                </Field>
              )}
            />

            <Button
              type="submit"
              form="login-form"
              disabled={isLoading}
              className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 font-medium rounded-xl transition-all shadow-md mt-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              href="#"
              className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-white dark:hover:text-slate-300 transition-colors"
            >
              Sign up
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
