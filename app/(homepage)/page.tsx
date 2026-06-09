import Link from "next/link";
import EcoDropLogo from "@/app/_components/EcoDropLogo";

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-sage-50 to-white px-4">
            <div className="w-full max-w-2xl text-center">
                <div className="mb-8 flex justify-center">
                    <EcoDropLogo href="/" size="lg" />
                </div>

                <h1 className="text-4xl font-black leading-tight tracking-tight text-gray-900 sm:text-5xl">
                    The Smart Way to Recycle Your{" "}
                    <span className="text-sage-600">E-Waste</span>
                </h1>

                <p className="mx-auto mt-6 max-w-md text-lg text-gray-600">
                    Join EcoDrop today to safely dispose of your electronics, track your
                    environmental impact, and build a sustainable future.
                </p>

                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link
                        href="/login"
                        className="w-full rounded-xl bg-sage-600 px-8 py-3 text-center font-semibold text-white shadow-md shadow-sage-100 transition-all hover:bg-sage-700 sm:w-auto"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/register"
                        className="w-full rounded-xl bg-sage-100 px-8 py-3 text-center font-semibold text-sage-700 transition-all hover:bg-sage-200 sm:w-auto"
                    >
                        Create Account
                    </Link>
                </div>
            </div>
        </div>
    );
}


