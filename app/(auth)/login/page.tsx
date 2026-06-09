import EcoDropLogo from "@/app/_components/EcoDropLogo";
import LoginForm from "@/app/(auth)/_components/LoginForm";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[#F4F7F5] flex items-center justify-center p-6">
            <div className="flex w-full max-w-5xl overflow-hidden rounded-3xl border border-[#C7EED5] bg-white shadow-xl shadow-green-100/50">

                {/* Left Hero Section */}
                <div className="relative hidden lg:flex lg:w-[45%] flex-col justify-between p-10 overflow-hidden">
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(135deg, #3F815A 0%, #24563F 100%)",
                        }}
                    />

                    <div className="relative z-10">
                        <EcoDropLogo href="/" size="md" variant="light" />
                    </div>

                    <div className="relative z-10 space-y-4">
                        <h2 className="text-4xl font-bold text-white leading-tight">
                            Welcome back to your
                            <br />
                            sustainable journey.
                        </h2>

                        <p className="max-w-sm text-green-50/80">
                            Join over 10,000 recyclers today and start making a difference in your community.
                        </p>
                    </div>

                    <div className="relative z-10 flex items-center gap-3">
                        <div className="flex -space-x-2">
                            <div className="h-9 w-9 rounded-full border-2 border-[#24563F] bg-green-300" />
                            <div className="h-9 w-9 rounded-full border-2 border-[#24563F] bg-green-400" />
                            <div className="h-9 w-9 rounded-full border-2 border-[#24563F] bg-green-500" />
                        </div>

                        <span className="text-sm text-green-50/80">
                            Verified Recyclers
                        </span>
                    </div>
                </div>

                {/* Right Form Section */}
                <div className="flex-1 bg-white p-8 md:p-12 flex items-center justify-center">
                    <LoginForm />
                </div>

            </div>
        </div>
    );
}