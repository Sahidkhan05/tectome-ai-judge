"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Terminal, Zap, Cpu, Sparkles, Code2, Trophy, Globe, MousePointer2 } from "lucide-react";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div className="min-h-screen bg-[var(--background)] overflow-hidden selection:bg-[var(--accent)] selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <main className="relative pt-24 pb-40 px-6">
        {/* Animated Background Elements */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[var(--accent)]/10 dark:bg-[var(--accent)]/5 blur-[120px] rounded-full -z-10 animate-pulse-glow" />
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-[var(--gold)]/10 dark:bg-[var(--gold)]/5 blur-[120px] rounded-full -z-10" />

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto text-center space-y-12"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[var(--foreground)]/[0.03] dark:bg-white/[0.03] border border-[var(--border)] text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted)]">
            <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
            Empowering the next generation of engineers
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-7xl md:text-[9rem] font-black tracking-tighter premium-gradient-text leading-[0.85] py-2">
            Code with <br />
            <span className="relative">
              Intelligence
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1, duration: 1.5, ease: "circOut" }}
                className="absolute -bottom-4 left-0 h-3 bg-[var(--accent)]/20 -z-10 rounded-full"
              />
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-[var(--muted)] max-w-2xl mx-auto font-medium leading-relaxed">
            The world's most advanced AI-powered coding platform. Master algorithms with real-time architectural insights.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
            <Link
              href="/problems"
              className="group bg-[var(--foreground)] text-[var(--background)] px-10 py-5 rounded-2xl font-black text-xl flex items-center gap-3 hover:scale-105 transition-all shadow-2xl shadow-black/20 relative overflow-hidden"
            >
              <span className="relative z-10">Explore Challenges</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Link>
            <Link
              href="/signup"
              className="glass-card px-10 py-5 font-black text-xl hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-all flex items-center gap-3"
            >
              Get Started Free
              <Sparkles className="w-5 h-5 text-[var(--gold)]" />
            </Link>
          </motion.div>

          {/* Stats Ticker */}
          <motion.div variants={itemVariants} className="pt-24 grid grid-cols-2 md:grid-cols-4 gap-12 text-center max-w-4xl mx-auto">
            {[
              { label: "Problems", value: "500+", icon: Code2, color: "text-[var(--accent)]" },
              { label: "Submissions", value: "2M+", icon: Zap, color: "text-[var(--gold)]" },
              { label: "Success Rate", value: "94%", icon: Trophy, color: "text-green-500" },
              { label: "Elite Users", value: "10k+", icon: Globe, color: "text-purple-500" },
            ].map((stat, i) => (
              <div key={i} className="space-y-3 group">
                <div className="flex items-center justify-center gap-2 text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</span>
                </div>
                <p className="text-4xl font-black tracking-tight">{stat.value}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </main>

      {/* Features Section */}
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-[var(--secondary)] -z-20 opacity-50" />
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
            <div className="space-y-6">
              <div className="w-12 h-1.5 bg-[var(--accent)] rounded-full" />
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
                Engineered for <br />the elite.
              </h2>
            </div>
            <p className="text-[var(--muted)] font-medium text-xl max-w-md">
              Tools designed to push your boundaries and refine your technical depth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "AI Architect",
                desc: "Real-time structural feedback on your code efficiency and scalability patterns.",
                icon: Cpu,
                color: "from-blue-500 to-cyan-500",
              },
              {
                title: "Multi-Engine",
                desc: "High-performance execution for JS, Python, and C++ with millisecond latency.",
                icon: Terminal,
                color: "from-[var(--gold)] to-orange-500",
              },
              {
                title: "Live Analytics",
                desc: "Beautifully visualized progress with heatmaps and deep skill metrics.",
                icon: Activity,
                color: "from-purple-500 to-pink-500",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -12 }}
                className="glass-card p-12 space-y-8 group overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-0 group-hover:opacity-5 blur-3xl transition-opacity" />
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform duration-500`}>
                  <feature.icon className="w-9 h-9 text-white" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-black tracking-tight">{feature.title}</h3>
                  <p className="text-[var(--muted)] leading-relaxed font-medium text-lg">{feature.desc}</p>
                </div>
                <div className="pt-4">
                  <div className="w-full h-1 bg-[var(--border)] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      transition={{ duration: 1.5, delay: i * 0.2 }}
                      className={`h-full bg-gradient-to-r ${feature.color}`} 
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-40 px-6">
        <div className="max-w-6xl mx-auto glass-card p-16 md:p-32 text-center space-y-12 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/[0.05] via-transparent to-[var(--gold)]/[0.05] -z-10 group-hover:scale-110 transition-transform duration-1000" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-[var(--accent)] to-transparent" />
          
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none">
            Ready to <span className="text-[var(--accent)]">ascend?</span>
          </h2>
          <p className="text-xl md:text-2xl text-[var(--muted)] max-w-2xl mx-auto font-medium">
            Join 10,000+ elite developers leveling up their careers with Tectome.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/signup"
              className="bg-[var(--foreground)] text-[var(--background)] px-16 py-6 rounded-2xl font-black text-2xl hover:scale-105 transition-all shadow-2xl shadow-black/20"
            >
              Join the Elite
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-20 border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[var(--foreground)] rounded-lg flex items-center justify-center font-black text-[var(--background)]">T</div>
            <span className="text-xl font-black tracking-tighter">Tectome.</span>
          </div>
          <p className="text-[var(--muted)] font-black text-[10px] uppercase tracking-[0.4em]">
            © 2026 Tectome AI Judge. Engineered for Excellence.
          </p>
          <div className="flex gap-8">
            {["Twitter", "GitHub", "Discord"].map(link => (
              <a key={link} href="#" className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper for Activity icon which was missing in original list but needed for one feature
const Activity = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);