import Link from "next/link";

type EcoDropLogoProps = {
    href?: string;
    size?: "sm" | "md" | "lg";
    variant?: "light" | "dark";
};

export default function EcoDropLogo({
    href = "/",
    size = "md",
    variant = "dark",
}: EcoDropLogoProps) {
    const sizeClasses = {
        sm: { icon: "text-xl", text: "text-xl" },
        md: { icon: "text-2xl", text: "text-2xl" },
        lg: { icon: "text-3xl", text: "text-3xl" },
    };

    const textColor = variant === "light" ? "text-white" : "text-sage-700";

    const content = (
        <span className="inline-flex items-center gap-2">
            <span className={sizeClasses[size].icon} aria-hidden="true">
                🌱
            </span>
            <span className={`${sizeClasses[size].text} font-extrabold tracking-tight ${textColor}`}>
                EcoDrop
            </span>
        </span>
    );

    if (href) {
        return (
            <Link href={href} className="inline-flex" aria-label="EcoDrop home">
                {content}
            </Link>
        );
    }

    return content;
}


