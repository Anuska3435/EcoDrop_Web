import Link from "next/link";
import Logo from "./Logo";

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-sage-200 bg-sage-50">
            <nav className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6">
                <Logo />

                <div className="flex items-center gap-4">
                    <Link
                        href="/login"
                        className="hidden text-sm tracking-[0.5px] text-sage-700 transition-colors hover:text-sage-900 sm:block"
                    >
                        Login
                    </Link>
                    <Link
                        href="/register"
                        className="flex h-10 items-center border border-sage-700 px-5 text-xs font-bold uppercase tracking-[1.5px] text-sage-700 transition-colors hover:bg-sage-700 hover:text-sage-50"
                    >
                        Register
                    </Link>
                </div>
            </nav>
        </header>
    );
}


