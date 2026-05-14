"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, ChevronRight, KeyRound } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Check if the user has a valid session (arrived via email link)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Wait briefly to see if the session is still establishing via the hash
        setTimeout(async () => {
          const { data: { session: delayedSession } } = await supabase.auth.getSession();
          if (!delayedSession) {
            router.push("/login?error=Invalid+or+expired+reset+link.");
          }
        }, 1000);
      }
    };
    
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        // User is ready to set a new password
      } else if (event === "SIGNED_OUT") {
        router.push("/login");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router, supabase.auth]);

  const handleReset = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password: password });

    if (error) {
      setError(error.message || "Link expired. Request a new one.");
    } else {
      setSuccess("Credentials updated successfully. Redirecting...");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6 relative overflow-hidden selection:bg-[var(--accent)] selection:text-white">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--accent)]/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--gold)]/5 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[450px] space-y-10"
      >
        <div className="text-center space-y-4">
          <Link href="/" className="inline-block group">
            <div className="w-16 h-16 bg-[var(--foreground)] rounded-3xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-all duration-500 shadow-2xl">
              <KeyRound className="w-8 h-8 text-[var(--background)]" />
            </div>
          </Link>
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter">Reset Protocol.</h1>
            <p className="text-[var(--muted)] font-medium">Establish new security credentials.</p>
          </div>
        </div>

        <div className="glass-card p-10 space-y-8 relative overflow-hidden border-[var(--border)]">
          <form onSubmit={handleReset} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted)] ml-1">New Access Key</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)] group-focus-within:text-[var(--accent)] transition-colors" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[var(--foreground)]/[0.03] dark:bg-white/[0.03] border border-transparent focus:border-[var(--border)] rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-4 focus:ring-[var(--accent)]/5 outline-none transition-all placeholder:text-[var(--muted)] font-bold"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted)] ml-1">Confirm Access Key</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)] group-focus-within:text-[var(--accent)] transition-colors" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[var(--foreground)]/[0.03] dark:bg-white/[0.03] border border-transparent focus:border-[var(--border)] rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-4 focus:ring-[var(--accent)]/5 outline-none transition-all placeholder:text-[var(--muted)] font-bold"
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest text-center">
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 rounded-2xl bg-green-500/5 border border-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest text-center">
                {success}
              </motion.div>
            )}

            <button
              disabled={loading || !!success}
              className="w-full bg-[var(--foreground)] text-[var(--background)] py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 shadow-2xl shadow-black/20 flex items-center justify-center gap-3 group"
            >
              {loading ? <div className="w-4 h-4 border-2 border-[var(--background)] border-t-transparent rounded-full animate-spin" /> : "Update Credentials"}
              {!loading && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--border)]" /></div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest"><span className="bg-[var(--background)] px-4 text-[var(--muted)]">Secure Integration</span></div>
          </div>
        </div>

        <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)]">
          Remembered your key?{" "}
          <Link href="/login" className="text-[var(--accent)] hover:underline">
            Return to Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
