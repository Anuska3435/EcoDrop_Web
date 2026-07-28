"use client";
import { useForm, useWatch } from "react-hook-form";
import { GENDER_OPTIONS, registerSchema, RegisterFormData } from "@/app/(auth)/_components/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { handleRegisterUser } from "@/lib/actions/auth-action";
import SocialLoginButtons from "@/app/_components/SocialLoginButtons";

export default function RegisterForm() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [isGenderOpen, setIsGenderOpen] = useState(false);
    const genderRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: "",
            email: "",
            gender: undefined,
            password: "",
            confirmPassword: "",
        },
    });

    const selectedGender = useWatch({ control, name: "gender" });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (genderRef.current && !genderRef.current.contains(event.target as Node)) {
                setIsGenderOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const onSubmit = (data: RegisterFormData) => {
        if (!agreedToTerms) return;
        setError("");
        startTransition(async () => {
            try {
                const result = await handleRegisterUser(data);
                if (result.success) {
                    router.push("/login");
                } else {
                    setError(result.message || "Registration failed");
                }
            } catch (err: unknown) {
                const error = err as { message?: string };
                setError(error?.message || "Registration failed");
            }
        });
    };

    const inputClass =
        "h-12 w-full rounded-xl border-0 bg-sage-100 pl-11 pr-4 text-gray-900 placeholder:text-sage-400 outline-none transition-colors focus:bg-sage-50 focus:ring-2 focus:ring-sage-500/20";

    const triggerClass =
        "flex h-12 w-full items-center rounded-xl border-0 bg-sage-100 pl-11 pr-10 text-left outline-none transition-colors focus:bg-sage-50 focus:ring-2 focus:ring-sage-500/20";

    const labelClass = "mb-2 block text-xs font-semibold uppercase tracking-wide text-sage-700";

    return (
        <div className="w-full max-w-md px-6 py-10 sm:px-10">
            <div className="rounded-[2rem] border border-sage-100 bg-white p-8 shadow-[0_30px_60px_rgba(15,23,42,0.08)]">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-sage-900">Create your account</h1>
                    <p className="mt-2 text-sm text-sage-600">
                        Start your journey toward a zero-waste lifestyle today.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                <div>
                    <label className={labelClass}>Full Name</label>
                    <div className="relative">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            {...register("fullName")}
                            placeholder="Enter your name"
                            className={inputClass}
                        />
                    </div>
                    {errors.fullName && (
                        <span className="mt-1 block text-sm text-red-500">{errors.fullName.message}</span>
                    )}
                </div>

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
                            placeholder="example@email.com"
                            className={inputClass}
                        />
                    </div>
                    {errors.email && (
                        <span className="mt-1 block text-sm text-red-500">{errors.email.message}</span>
                    )}
                </div>

                <div>
                    <label className={labelClass} id="gender-label">
                        Gender
                    </label>
                    <div className="relative" ref={genderRef}>
                        <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gray-400">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </span>
                        <button
                            type="button"
                            id="gender"
                            aria-labelledby="gender-label"
                            aria-haspopup="listbox"
                            aria-expanded={isGenderOpen}
                            onClick={() => setIsGenderOpen((open) => !open)}
                            className={triggerClass}
                        >
                            <span className={selectedGender ? "text-gray-900" : "text-sage-400"}>
                                {selectedGender
                                    ? GENDER_OPTIONS.find((option) => option.value === selectedGender)?.label
                                    : "Select gender"}
                            </span>
                        </button>
                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg
                                className={`h-5 w-5 transition-transform ${isGenderOpen ? "rotate-180" : ""}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                            </svg>
                        </span>
                        {isGenderOpen && (
                            <ul
                                role="listbox"
                                aria-labelledby="gender-label"
                                className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-sage-100 bg-white py-1 shadow-lg"
                            >
                                {GENDER_OPTIONS.map((option) => (
                                    <li key={option.value} role="presentation">
                                        <button
                                            type="button"
                                            role="option"
                                            aria-selected={selectedGender === option.value}
                                            onClick={() => {
                                                setValue("gender", option.value, { shouldValidate: true });
                                                setIsGenderOpen(false);
                                            }}
                                            className={`flex h-11 w-full items-center px-4 text-left text-sm transition-colors hover:bg-sage-50 ${
                                                selectedGender === option.value
                                                    ? "bg-sage-50 font-medium text-sage-800"
                                                    : "text-gray-900"
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    {errors.gender && (
                        <span className="mt-1 block text-sm text-red-500">{errors.gender.message}</span>
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
                            placeholder="••••••••"
                            className={`${inputClass} pr-11`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {showPassword ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                )}
                            </svg>
                        </button>
                    </div>
                    {errors.password && (
                        <span className="mt-1 block text-sm text-red-500">{errors.password.message}</span>
                    )}
                </div>

                <div>
                    <label className={labelClass}>Confirm Password</label>
                    <div className="relative">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </span>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            {...register("confirmPassword")}
                            placeholder="Confirm password"
                            className={`${inputClass} pr-11`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {showConfirmPassword ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                )}
                            </svg>
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <span className="mt-1 block text-sm text-red-500">{errors.confirmPassword.message}</span>
                    )}
                </div>

                <div className="flex items-start gap-3">
                    <input
                        id="terms"
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-sage-600 focus:ring-sage-500"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                        I agree to the{" "}
                        <Link href="#" className="font-medium text-sage-700 hover:underline">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="#" className="font-medium text-sage-700 hover:underline">
                            Privacy Policy
                        </Link>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || isPending || !agreedToTerms}
                    className="flex h-12 w-full items-center justify-center rounded-xl bg-sage-800 text-sm font-semibold text-white transition-colors hover:bg-sage-900 disabled:opacity-50"
                >
                    {isPending ? "Creating account..." : "Create Account"}
                </button>
                </form>

                <SocialLoginButtons label="OR SIGN UP WITH" />

                <p className="mt-6 text-center text-sm text-sage-600">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-sage-700 hover:text-sage-800"
                    >
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}

