"use client";
import { useForm } from "react-hook-form";
import { LoginFormData, loginSchema } from "@/app/(auth)/_components/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { handleLoginUser } from "@/lib/actions/auth-action";
import SocialLoginButtons from "@/app/_components/SocialLoginButtons";

export default function LoginForm() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (data: LoginFormData) => {
        setError("");
        startTransition(async () => {
            try {
                const result = await handleLoginUser(data);
                if (result.success) {
                    router.push("/dashboard");
                } else {
                    setError(result.message || "Login failed");
                }
            } catch (err: unknown) {
                const error = err as { message?: string };
                setError(error?.message || "Login failed");
            }
        });
    };

    const inputClass =
        "h-12 w-full rounded-xl border-0 bg-sage-100 pl-11 pr-4 text-gray-900 placeholder:text-sage-400 outline-none transition-colors focus:bg-sage-50 focus:ring-2 focus:ring-sage-500/20";

    const labelClass = "mb-2 block text-xs font-semibold uppercase tracking-wide text-sage-700";

    return (
        <div className="w-full max-w-md px-6 py-10 sm:px-10">
            <div className="rounded-[2rem] border border-sage-100 bg-white p-8 shadow-[0_30px_60px_rgba(15,23,42,0.08)]">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-sage-900">Sign in</h1>
                    <p className="mt-2 text-sm text-sage-600">
                        Welcome back to your sustainable journey.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className={labelClass}>Email Address</label>
                        <div className="relative">
                            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </span>
                            <input
                                type="email"
                                {...register("email")}
                                placeholder="Enter your email"
                                className={inputClass}
                            />
                        </div>
                        {errors.email && (
                            <span className="mt-1 block text-sm text-red-500">{errors.email.message}</span>
                        )}
                    </div>

                    <div>
                        <label className={labelClass}>Password</label>
                        <div className="relative">
                            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("password")}
                                placeholder="Enter your password"
                                className={inputClass}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <span className="mt-1 block text-sm text-red-500">{errors.password.message}</span>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <Link
                            href="#"
                            className="text-sm font-medium text-sage-600 transition-colors hover:text-sage-700"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || isPending}
                        className="flex h-12 w-full items-center justify-center rounded-xl bg-sage-700 text-sm font-semibold text-white transition-colors hover:bg-sage-800 disabled:opacity-50"
                    >
                        {isPending ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <SocialLoginButtons />

                <p className="mt-6 text-center text-sm text-sage-600">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/register"
                        className="font-semibold text-sage-700 hover:text-sage-800"
                    >
                        Create Account
                    </Link>
                </p>
            </div>
        </div>
    );
}


