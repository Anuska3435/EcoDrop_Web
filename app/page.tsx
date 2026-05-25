import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex flex-col justify-center items-center px-4">
      <div className="max-w-2xl text-center space-y-6">
        {/* Logo */}
        <span className="text-5xl font-extrabold text-emerald-600 tracking-tight block">
          🌱 EcoDrop
        </span>
        
        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight">
          The Smart Way to Recycle Your{" "}
          <span className="text-emerald-600">E-Waste</span>
        </h1>
        
        {/* Description */}
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Join EcoDrop today to safely dispose of your electronics, track your environmental impact, and build a sustainable future.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href="/login"
            className="px-8 py-3 font-semibold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-100 transition-all text-center"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 font-semibold rounded-xl text-emerald-700 bg-emerald-100 hover:bg-emerald-200 transition-all text-center"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}