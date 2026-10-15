
import { useState } from "react";
import { ShieldCheck, ArrowRight, LoaderCircle } from "lucide-react";
import supabase from "../services/supabase";

const Login = () => {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    setError("");

    try {
      setGoogleLoading(true);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
    } catch (err) {
      setError(err.message || "Unable to connect to Google. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f8fa] px-4 py-12">
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-slate-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-slate-200/40 blur-3xl" />

      <section className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_20px_70px_-30px_rgba(15,23,42,0.16)]">
        <div className="px-6 py-10 sm:px-12 sm:py-14">
          <div className="mb-9 flex justify-center">
            <div className="flex h-[76px] w-[76px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 shadow-sm">
              <ShieldCheck size={36} strokeWidth={1.7} />
            </div>
          </div>

          <div className="mb-9 text-center">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-slate-500 sm:text-base">
              Profile Management System
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Welcome
            </h1>

            <p className="mx-auto mt-4 max-w-sm text-xs leading-6 text-slate-500 sm:text-sm">
              Sign in securely with your Google account to continue.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
            >
              {error}
            </div>
          )}

          <div className="mx-auto w-full max-w-sm">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="group flex min-h-[64px] w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {googleLoading ? (
                <LoaderCircle
                  size={20}
                  className="animate-spin text-slate-500"
                />
              ) : (
                <svg
                  className="h-5 w-5 shrink-0"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.06 13.22l7.98 6.19C11.96 13.72 17.45 9.5 24 9.5Z"
                    transform="translate(0 4)"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.72 7.18l7.62 5.91c4.45-4.11 7.14-10.17 7.14-17.56Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.04 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a24 24 0 0 0 0 21.56l7.98-6.19Z"
                    transform="translate(0 4)"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.9-5.89l-7.62-5.91c-2.12 1.42-4.84 2.26-8.28 2.26-6.55 0-12.04-4.22-14.02-10.09l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
                  />
                </svg>
              )}

              <span>
                {googleLoading
                  ? "Connecting to Google..."
                  : "Continue with Google"}
              </span>

              {!googleLoading && (
                <ArrowRight
                  size={18}
                  className="ml-auto text-slate-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-slate-700"
                />
              )}
            </button>
          </div>

          <div className="mt-7 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck size={15} strokeWidth={1.8} />
            <span>Secure authentication powered by Google</span>
          </div>

          <p className="mt-9 border-t border-slate-100 pt-6 text-center text-xs leading-6 text-slate-400">
            Your privacy and security are important to us.
          </p>
        </div>
      </section>

      <span className="absolute bottom-4 text-xs tracking-wide text-slate-400">
        © {new Date().getFullYear()} ProfileHub
      </span>
    </main>
  );
};

export default Login;
