import Link from "next/link";

export default function Logo({ href = "/" }: { href?: string }) {
    return (
        <Link href={href} className="flex items-center gap-2" aria-label="EcoDrop">
            <span className="text-lg font-bold uppercase tracking-[1.5px] text-sage-900">
                EcoDrop
            </span>
        </Link>
    );
}


