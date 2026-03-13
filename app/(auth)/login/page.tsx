"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      router.push("/");
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side */}
      <div className="hidden lg:flex w-1/2 bg-blue-600 items-center justify-center text-white p-10">
        <div className="space-y-6">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
            <span className="text-blue-600 text-3xl font-bold">R</span>
          </div>
          <h2 className="text-4xl font-bold">Welcome to RMS</h2>
          <p className="text-blue-100 text-lg">
            Manage resources efficiently based on your role.
          </p>
          <div className="space-y-3 mt-6">
            <div className="flex items-center gap-3 bg-blue-500 rounded-lg px-4 py-3">
              <span className="text-xl">🏢</span>
              <span className="text-blue-100 text-sm">Manage Buildings & Resources</span>
            </div>
            <div className="flex items-center gap-3 bg-blue-500 rounded-lg px-4 py-3">
              <span className="text-xl">📅</span>
              <span className="text-blue-100 text-sm">Book & Track Reservations</span>
            </div>
            <div className="flex items-center gap-3 bg-blue-500 rounded-lg px-4 py-3">
              <span className="text-xl">🔧</span>
              <span className="text-blue-100 text-sm">Monitor Maintenance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex flex-1 items-center justify-center bg-blue-50 p-6">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-blue-100">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl font-bold">R</span>
            </div>
            <h1 className="text-3xl font-bold text-blue-700">Sign In</h1>
            <p className="text-blue-400 text-sm mt-1">Enter your credentials to continue</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-blue-700 text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-blue-50 placeholder-blue-300"
              />
            </div>

            <div>
              <label className="block text-blue-700 text-sm font-medium mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-blue-50 placeholder-blue-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600 text-sm font-medium"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-semibold text-sm"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Register link */}
          <p className="text-center mt-6 text-blue-400 text-sm">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-600 font-semibold hover:underline">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}