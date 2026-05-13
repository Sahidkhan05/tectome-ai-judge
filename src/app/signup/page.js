"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, ChevronRight, GitBranch, Sparkles } from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
    });
    if (error) setError(error.message);
    else alert("Check your email for confirmation!");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6 relative overflow-hidden selection:bg-[var(--accent)] selection:text-white">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--accent)]/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--gold)]/5 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[450px] space-y-10"
      >
        <div className="text-center space-y-4">
          <Link href="/" className="inline-block group">
            <div className="w-16 h-16 bg-[var(--foreground)] rounded-3xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-all duration-500 shadow-2xl">
              <UserPlus className="w-8 h-8 text-[var(--background)]" />
            </div>
          </Link>
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter">New Credentials.</h1>
            <p className="text-[var(--muted)] font-medium">Join the elite architectural collective.</p>
          </div>
        </div>

        <div className="glass-card p-10 space-y-8 relative overflow-hidden border-[var(--border)]">
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted)] ml-1">Primary Identifier</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)] group-focus-within:text-[var(--accent)] transition-colors" />
                  <input
                    type="email"
                    placeholder="architect@nexus.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[var(--foreground)]/[0.03] dark:bg-white/[0.03] border border-transparent focus:border-[var(--border)] rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-4 focus:ring-[var(--accent)]/5 outline-none transition-all placeholder:text-[var(--muted)] font-bold"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted)] ml-1">Access Protocol</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)] group-focus-within:text-[var(--accent)] transition-colors" />
                  <input
                    type="password"
                    placeholder="Establish complex pattern..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

            <button
              disabled={loading}
              className="w-full bg-[var(--foreground)] text-[var(--background)] py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 shadow-2xl shadow-black/20 flex items-center justify-center gap-3 group"
            >
              {loading ? <div className="w-4 h-4 border-2 border-[var(--background)] border-t-transparent rounded-full animate-spin" /> : "Establish Entity"}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[var(--border)]" /></div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest"><span className="bg-[var(--background)] px-4 text-[var(--muted)]">Federated Access</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-[var(--foreground)]/[0.03] dark:bg-white/[0.03] border border-[var(--border)] hover:bg-[var(--foreground)]/[0.05] transition-all font-black text-[10px] uppercase tracking-widest">
              <GitBranch className="w-4 h-4" /> Github
            </button>
            <button className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-[var(--foreground)]/[0.03] dark:bg-white/[0.03] border border-[var(--border)] hover:bg-[var(--foreground)]/[0.05] transition-all font-black text-[10px] uppercase tracking-widest">
              <Sparkles className="w-4 h-4" /> Google
            </button>
          </div>
        </div>

        <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)]">
          Already established?{" "}
          <Link href="/login" className="text-[var(--accent)] hover:underline">
            Initiate Session
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
