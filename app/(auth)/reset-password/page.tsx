import EcoDropLogo from '@/app/_components/EcoDropLogo';
import PasswordResetForm from '@/app/(auth)/_components/PasswordResetForm';

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#F4F7F5] flex items-center justify-center p-6">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-3xl border border-[#C7EED5] bg-white shadow-xl shadow-green-100/50">
        <div className="relative hidden lg:flex lg:w-[45%] flex-col justify-between p-10 overflow-hidden">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #3F815A 0%, #24563F 100%)' }} />
          <div className="relative z-10">
            <EcoDropLogo href="/" size="md" variant="light" />
          </div>
          <div className="relative z-10 space-y-4">
            <h2 className="text-4xl font-bold text-white leading-tight">Create a new password.</h2>
            <p className="max-w-sm text-green-50/80">Enter your new password below to regain access to your account.</p>
          </div>
        </div>
        <div className="flex-1 bg-white p-8 md:p-12 flex items-center justify-center">
          <PasswordResetForm />
        </div>
      </div>
    </div>
  );
}
