import DashboardNav from "@/app/dashboard/_components/DashboardNav";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-sage-50 to-white">
            <DashboardNav />
            {children}
        </div>
    );
}
