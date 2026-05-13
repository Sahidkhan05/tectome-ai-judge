"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, LayoutDashboard, Code2, LogOut, User, Menu, X, Sparkles, ChevronDown } from "lucide-react";

export default function Navbar() {
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsProfileOpen(false);
    router.push("/");
  };

  const navLinks = [
    { name: "Problems", href: "/problems", icon: Code2 },
    ...(user ? [{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard }] : []),
  ];

  if (!mounted) return null;

  return (
    <nav className="glass-nav px-6 md:px-10 h-16 flex items-center justify-center">
      <div className="w-full max-w-7xl flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="w-8 h-8 bg-[var(--foreground)] rounded-lg flex items-center justify-center font-black text-[var(--background)] rotate-3 group-hover:rotate-0 transition-all duration-500">
                T
              </div>
              <div className="absolute -inset-1 bg-[var(--accent)] opacity-20 blur-sm rounded-lg group-hover:opacity-40 transition-opacity" />
            </div>
            <span className="text-xl font-black tracking-tighter premium-gradient-text">
              Tectome<span className="text-[var(--accent)]">.</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-bold transition-all duration-300 rounded-xl flex items-center gap-2 ${
                  pathname === link.href ? "text-[var(--foreground)]" : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                <link.icon className={`w-4 h-4 ${pathname === link.href ? "text-[var(--accent)]" : ""}`} />
                {link.name}
                {pathname === link.href && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-[var(--foreground)]/[0.03] dark:bg-white/[0.05] rounded-xl -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2.5 rounded-xl hover:bg-[var(--foreground)]/[0.05] dark:hover:bg-white/[0.05] transition-colors border border-transparent hover:border-[var(--border)] group"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-[var(--gold)] group-hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-blue-600 group-hover:-rotate-12 transition-transform" />
            )}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 pl-4 border-l border-[var(--border)] group"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--accent)] to-[var(--gold)] flex items-center justify-center text-xs font-black text-black">
                  {user.email[0].toUpperCase()}
                </div>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-xs font-black tracking-tight">
                    {user.email.split("@")[0]}
                  </span>
                  <span className="text-[9px] text-[var(--muted)] font-black uppercase tracking-widest leading-none mt-0.5">
                    Pro Plan
                  </span>
                </div>
                <ChevronDown className={`w-3 h-3 text-[var(--muted)] transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-40"
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 glass-card p-2 z-50 premium-shadow"
                    >
                      <div className="px-3 py-2 mb-2 border-b border-[var(--border)]">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)]">Account</p>
                        <p className="text-xs font-bold truncate">{user.email}</p>
                      </div>
                      <Link 
                        href="/dashboard" 
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--foreground)]/[0.05] dark:hover:bg-white/[0.05] transition-colors text-sm font-bold"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[var(--muted)]" />
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/10 transition-colors text-sm font-bold text-red-500 mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-[var(--foreground)] text-[var(--background)] px-6 py-2.5 rounded-xl text-xs font-black hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-black/10 flex items-center gap-2"
            >
              Sign In
              <Sparkles className="w-3 h-3 text-[var(--gold)]" />
            </Link>
          )}

          <button 
            className="md:hidden p-2 rounded-xl hover:bg-[var(--foreground)]/[0.05] dark:hover:bg-white/[0.05]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-16 left-0 right-0 bg-[var(--background)] border-b border-[var(--border)] overflow-hidden z-50"
          >
            <div className="p-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-colors ${
                    pathname === link.href ? "bg-[var(--foreground)]/[0.05] dark:bg-white/[0.05] text-[var(--foreground)]" : "text-[var(--muted)] hover:bg-[var(--foreground)]/[0.03]"
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  <span className="font-bold">{link.name}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}