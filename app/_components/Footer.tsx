import Link from "next/link";

export default function Footer() {
    return (
        <footer className="mt-auto bg-sage-50 text-sage-700">
            <div className="w-full py-16">
                <div className="mt-16 border-t border-sage-200">
                    <div className="mx-auto w-full max-w-[1440px] px-6 pt-8">
                        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                            <p className="text-xs tracking-[0.5px] text-sage-600">
                                © {new Date().getFullYear()} EcoDrop
                            </p>

                            <nav
                                aria-label="Footer links"
                                className="flex flex-wrap items-center gap-4 text-xs tracking-[0.5px] text-sage-600"
                            >
                                <Link href="/" className="transition-colors hover:text-sage-800">
                                    Home
                                </Link>
                                <Link href="/dashboard" className="transition-colors hover:text-sage-800">
                                    Dashboard
                                </Link>
                                <Link href="/register" className="transition-colors hover:text-sage-800">
                                    Register
                                </Link>
                                <Link href="/login" className="transition-colors hover:text-sage-800">
                                    Login
                                </Link>
                            </nav>
                            <p className="text-xs tracking-[0.5px] text-sage-600">EN · Global</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}


