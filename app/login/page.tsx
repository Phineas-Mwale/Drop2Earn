"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [logoutMessage, setLogoutMessage] = useState("");

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("loggedOut") === "1") {
      queueMicrotask(() => {
        setLogoutMessage(
          "You have been signed out safely. We look forward to seeing you again."
        );
      });
      window.history.replaceState({}, "", "/login");
    }
  }, []);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const normalizedPhone = phone.trim();
    if (!/^\d{10}$/.test(normalizedPhone)) {
      setError("Enter your 10-digit Zambian phone number.");
      setLoading(false);
      return;
    }

    const email = `${normalizedPhone}@drop2earn.app`;

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      const userRole = profile?.role;

      if (userRole === "recycler") {
        router.push("/recycler");
      } else if (userRole === "verifier" || userRole === "admin") {
        router.push("/verification");
      } else if (userRole === "collector") {
        router.push("/dashboard");
      } else {
        await supabase.auth.signOut();
        setError("Your account role is not configured. Please contact an administrator.");
        setLoading(false);
      }
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12">
        <div className="grid w-full overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-2">
          
          {/* Left side */}
          <div className="hidden bg-green-600 p-12 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl font-bold text-green-600">
                  D
                </div>
                <span className="text-xl font-bold">Drop2Earn</span>
              </Link>

              <div className="mt-24">
                <p className="text-sm font-semibold uppercase tracking-wider text-green-100">
                Zambia&apos;s recycling value chain
                </p>

                <h1 className="mt-4 text-4xl font-bold leading-tight">
                  Turn recyclable waste into value.
                </h1>

                <p className="mt-6 max-w-md text-lg leading-8 text-green-50">
                  Connect with the recycling economy, track verified
                  collections and create measurable environmental impact.
                </p>
              </div>
            </div>

            <p className="text-sm text-green-100">
              Collect. Verify. Earn. Recycle.
            </p>
          </div>

          {/* Right side */}
          <div className="p-8 sm:p-12">
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link href="/" className="text-sm font-medium text-gray-500 hover:text-gray-900">
                Home
              </Link>
            </div>

            <div className="mt-10">
              <h2 className="text-3xl font-bold text-gray-900">
                Welcome to Drop2Earn
              </h2>

              <p className="mt-2 text-gray-600">
                Your account role is detected automatically from your phone number.
              </p>
            </div>

            {logoutMessage && (
              <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                {logoutMessage}
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleLogin}>
              {error && (
                <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-200">
                  {error}
                </div>
              )}

              {/* Contact details */}
              <div className="mt-8 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Phone number
                  </label>

                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    autoComplete="username"
                    required
                    minLength={10}
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="097 000 0000"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3.5 text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Password
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3.5 pr-12 text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-lg"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 4.3A10.8 10.8 0 0112 4c5 0 8.5 4 9.8 6a11.7 11.7 0 01-3.1 3.5M6.2 6.2A12.3 12.3 0 002.2 10c1.3 2 4.8 6 9.8 6 1 0 1.9-.2 2.7-.5" />
                        </svg>
                      ) : (
                        <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.2 10s3.5-6 9.8-6 9.8 6 9.8 6-3.5 6-9.8 6-9.8-6-9.8-6z" />
                          <circle cx="12" cy="10" r="2.5" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full rounded-xl bg-green-600 py-4 font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
              >
                {loading
                  ? "Signing in..."
                  : "Sign in securely"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-green-600 hover:text-green-700"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}