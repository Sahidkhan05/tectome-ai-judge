"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { problems } from "@/data/problems";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Cpu, Code2, Award, Zap, Star, Flame, TrendingUp, ChevronRight, Sparkles, Target, Calendar, LayoutDashboard, Search, Clock } from "lucide-react";

export default function DashboardPage() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [difficultyStats, setDifficultyStats] = useState([]);
  const [heatmapData, setHeatmapData] = useState({});
  const [aiInsight, setAiInsight] = useState("");
  const [userRank, setUserRank] = useState({ points: 0, level: 1, badges: 0 });

  useEffect(() => {
    const fetchDashboardData = async (userId) => {
      const { data: submissions, error } = await supabase
        .from("submissions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching dashboard data:", error);
        return;
      }

      const solvedSubmissions = submissions.filter((s) => s.status === "Accepted");
      const solvedIds = new Set(solvedSubmissions.map((s) => s.problem_id));
      const solvedCount = solvedIds.size;

      const diffCounts = { Easy: 0, Medium: 0, Hard: 0 };
      const solvedTags = new Set();
      let totalPoints = 0;

      solvedIds.forEach((id) => {
        const prob = problems.find((p) => p.id === id);
        if (prob) {
          diffCounts[prob.difficulty]++;
          prob.tags?.forEach((t) => solvedTags.add(t));
          totalPoints += prob.difficulty === "Easy" ? 10 : prob.difficulty === "Medium" ? 30 : 100;
        }
      });

      setDifficultyStats([
        { label: "Foundation", count: diffCounts.Easy, total: problems.filter(p => p.difficulty === "Easy").length, color: "bg-green-500", icon: Zap },
        { label: "Core Patterns", count: diffCounts.Medium, total: problems.filter(p => p.difficulty === "Medium").length, color: "bg-[var(--gold)]", icon: Target },
        { label: "Elite Architect", count: diffCounts.Hard, total: problems.filter(p => p.difficulty === "Hard").length, color: "bg-red-500", icon: Flame },
      ]);

      const uniqueDays = [...new Set(submissions.map(s => new Date(s.created_at).toISOString().split('T')[0]))].sort().reverse();
      let streak = 0;
      if (uniqueDays.length > 0) {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (uniqueDays[0] === today || uniqueDays[0] === yesterday) {
          streak = 1;
          for (let i = 0; i < uniqueDays.length - 1; i++) {
            const d1 = new Date(uniqueDays[i]);
            const d2 = new Date(uniqueDays[i + 1]);
            const diff = (d1 - d2) / (1000 * 60 * 60 * 24);
            if (diff === 1) streak++;
            else break;
          }
        }
      }

      const totalSubmissions = submissions.length;
      const acceptedCount = solvedSubmissions.length;
      const acceptanceRate = totalSubmissions > 0 ? Math.round((acceptedCount / totalSubmissions) * 100) : 0;
      const langCounts = submissions.reduce((acc, s) => { acc[s.language] = (acc[s.language] || 0) + 1; return acc; }, {});
      const topLang = Object.entries(langCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

      setStats([
        { label: "Challenges Solved", value: solvedCount.toString(), icon: Star, color: "text-[var(--gold)]", trend: `+${solvedSubmissions.filter(s => new Date(s.created_at) > new Date(Date.now() - 7 * 86400000)).length} this week` },
        { label: "Precision Rate", value: `${acceptanceRate}%`, icon: Activity, color: "text-blue-500", trend: `Across ${totalSubmissions} attempts` },
        { label: "Active Streak", value: `${streak}`, icon: Flame, color: "text-orange-500", trend: "Days in consistent flow" },
        { label: "Primary Engine", value: topLang.charAt(0).toUpperCase() + topLang.slice(1), icon: TrendingUp, color: "text-purple-500", trend: "Optimized performance" },
      ]);

      const heatMap = submissions.reduce((acc, s) => { const day = new Date(s.created_at).toISOString().split('T')[0]; acc[day] = (acc[day] || 0) + 1; return acc; }, {});
      setHeatmapData(heatMap);

      const level = Math.floor(totalPoints / 100) + 1;
      let badges = 0;
      if (solvedCount >= 1) badges++;
      if (streak >= 3) badges++;
      if (Object.keys(langCounts).length >= 2) badges++;
      setUserRank({ points: totalPoints, level, badges });

      const allTags = [...new Set(problems.flatMap(p => p.tags))];
      const unSolvedTags = allTags.filter(t => !solvedTags.has(t));
      const mostSolvedTag = Object.entries(solvedSubmissions.reduce((acc, s) => {
        const prob = problems.find(p => p.id === s.problem_id);
        prob?.tags?.forEach(t => acc[t] = (acc[t] || 0) + 1);
        return acc;
      }, {})).sort((a, b) => b[1] - a[1])[0]?.[0] || "Arrays";

      setAiInsight(`Your proficiency in ${mostSolvedTag} is exceptional. To reach the next level, I recommend focusing on ${unSolvedTags[0] || "System Design"} patterns.`);

      setRecentSubmissions(submissions.slice(0, 8).map(s => ({
        id: s.id,
        problemId: s.problem_id,
        title: s.problem_title,
        status: s.status,
        language: s.language,
        time: new Date(s.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
      })));
    };

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push("/login");
      else { setUser(session.user); await fetchDashboardData(session.user.id); setLoading(false); }
    };
    checkUser();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin shadow-2xl shadow-[var(--accent)]/20" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] pb-40 selection:bg-[var(--accent)] selection:text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-20 space-y-20">
        {/* Profile Hero Section */}
        <section className="relative glass-card p-10 md:p-16 overflow-hidden group">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--accent)]/5 blur-[120px] -z-10 group-hover:bg-[var(--accent)]/10 transition-all duration-1000" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[var(--gold)]/5 blur-[100px] -z-10" />

          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="relative">
              <div className="w-44 h-44 rounded-[3rem] bg-gradient-to-br from-[var(--foreground)] to-[var(--muted)] flex items-center justify-center text-6xl font-black text-[var(--background)] shadow-2xl rotate-3 group-hover:rotate-0 transition-all duration-700">
                {user.email[0].toUpperCase()}
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute -bottom-4 -right-4 bg-[var(--background)] p-4 rounded-3xl border border-[var(--border)] shadow-xl"
              >
                <Award className="w-8 h-8 text-[var(--gold)]" />
              </motion.div>
            </div>

            <div className="flex-1 text-center lg:text-left space-y-8">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                  <h1 className="text-5xl md:text-7xl font-black tracking-tighter">{user.email.split("@")[0]}</h1>
                  <div className="flex gap-2">
                    <span className="px-4 py-1.5 rounded-xl bg-[var(--foreground)]/[0.03] dark:bg-white/[0.03] text-[10px] font-black uppercase tracking-[0.2em] border border-[var(--border)]">
                      Lvl {userRank.level}
                    </span>
                    <span className="px-4 py-1.5 rounded-xl bg-[var(--accent)] text-black text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[var(--accent)]/20">
                      {userRank.points > 500 ? "Elite Engineer" : "Active Member"}
                    </span>
                  </div>
                </div>
                <p className="text-[var(--muted)] font-medium text-xl">System Architect since {new Date(user.created_at).getFullYear()}</p>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-12 lg:gap-20 pt-4">
                <div className="space-y-2">
                  <p className="text-4xl font-black tracking-tight tabular-nums">{userRank.points.toLocaleString()}</p>
                  <p className="text-[10px] text-[var(--muted)] font-black uppercase tracking-[0.3em]">Experience Points</p>
                </div>
                <div className="w-px h-12 bg-[var(--border)] hidden sm:block" />
                <div className="space-y-2">
                  <p className="text-4xl font-black tracking-tight tabular-nums">#{Math.max(1, 100 - userRank.level)}</p>
                  <p className="text-[10px] text-[var(--muted)] font-black uppercase tracking-[0.3em]">Global Percentile</p>
                </div>
                <div className="w-px h-12 bg-[var(--border)] hidden sm:block" />
                <div className="space-y-2">
                  <p className="text-4xl font-black tracking-tight tabular-nums">{userRank.badges}</p>
                  <p className="text-[10px] text-[var(--muted)] font-black uppercase tracking-[0.3em]">System Credentials</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="glass-card p-8 space-y-6 hover:border-[var(--accent)]/30 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-current to-transparent opacity-[0.02] group-hover:opacity-[0.05] transition-opacity" />
              <div className={`w-14 h-14 rounded-2xl bg-[var(--foreground)]/[0.03] dark:bg-white/[0.03] flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform duration-500 border border-[var(--border)]`}>
                <stat.icon className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <p className="text-4xl font-black tracking-tight tabular-nums">{stat.value}</p>
                <p className="text-[10px] text-[var(--muted)] font-black uppercase tracking-[0.2em]">{stat.label}</p>
              </div>
              <div className="pt-5 border-t border-[var(--border)] flex items-center justify-between">
                <span className="text-[10px] font-black text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors">{stat.trend}</span>
                <TrendingUp className="w-3.5 h-3.5 text-green-500 opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </section>

        {/* Analytics & Patterns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Difficulty Mastery */}
          <section className="glass-card p-10 space-y-10 border-[var(--border)]">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black flex items-center gap-4">
                <Activity className="w-6 h-6 text-[var(--accent)]" />
                Mastery
              </h3>
              <div className="w-8 h-8 rounded-lg bg-[var(--foreground)]/[0.03] flex items-center justify-center">
                <Target className="w-4 h-4 text-[var(--muted)]" />
              </div>
            </div>
            <div className="space-y-8">
              {difficultyStats.map((item, i) => (
                <div key={i} className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${item.color}`} />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)]">{item.label}</span>
                    </div>
                    <span className="text-lg font-black">{item.count}<span className="text-[var(--muted)] font-bold ml-1.5 text-sm">/ {item.total}</span></span>
                  </div>
                  <div className="h-3 bg-[var(--foreground)]/[0.03] dark:bg-white/[0.03] rounded-full overflow-hidden border border-[var(--border)]/50 p-[2px]">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.max(12, (item.count / item.total) * 100)}%` }}
                      transition={{ duration: 1, delay: i * 0.2 }}
                      className={`h-full ${item.color} rounded-full shadow-lg shadow-black/5`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-10 border-t border-[var(--border)]">
              <div className="bg-[var(--accent)]/[0.02] border border-[var(--accent)]/10 p-6 rounded-[1.5rem] relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Sparkles className="w-16 h-16 text-[var(--accent)]" />
                </div>
                <p className="text-[10px] font-black text-[var(--accent)] uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5" />
                  Architect Insight
                </p>
                <p className="text-base text-[var(--muted)] leading-relaxed font-medium">
                  "{aiInsight}"
                </p>
              </div>
            </div>
          </section>

          {/* Activity Heatmap */}
          <section className="lg:col-span-2 glass-card p-10 flex flex-col border-[var(--border)]">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black flex items-center gap-4">
                <Calendar className="w-6 h-6 text-orange-500" />
                System Flow
              </h3>
              <div className="flex gap-2 items-center text-[9px] text-[var(--muted)] font-black uppercase tracking-[0.2em]">
                <span>Dormant</span>
                {[0, 1, 2, 3].map(lvl => (
                  <div key={lvl} className={`w-3.5 h-3.5 rounded-[4px] ${["bg-[var(--foreground)]/[0.03] dark:bg-white/[0.03]", "bg-[var(--accent)]/20", "bg-[var(--accent)]/50", "bg-[var(--accent)]"][lvl]}`} />
                ))}
                <span>Peak</span>
              </div>
            </div>

            <div className="flex-1 overflow-x-auto no-scrollbar py-2">
              <div className="flex gap-2 min-w-max">
                {Array.from({ length: 35 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    {Array.from({ length: 7 }).map((_, j) => {
                      const date = new Date();
                      date.setDate(date.getDate() - (34 - i) * 7 - j);
                      const dateStr = date.toISOString().split('T')[0];
                      const count = heatmapData[dateStr] || 0;
                      const level = count === 0 ? 0 : count === 1 ? 1 : count < 3 ? 2 : 3;
                      const colors = ["bg-[var(--foreground)]/[0.03] dark:bg-white/[0.03]", "bg-[var(--accent)]/20", "bg-[var(--accent)]/50", "bg-[var(--accent)]"];
                      return (
                        <motion.div
                          key={j}
                          whileHover={{ scale: 1.3, zIndex: 10, borderRadius: "6px" }}
                          className={`w-4.5 h-4.5 ${colors[level]} rounded-[4px] border border-[var(--border)]/30 transition-all cursor-crosshair`}
                          title={`${dateStr}: ${count} interactions`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex justify-between text-[9px] text-[var(--muted)] font-black uppercase tracking-[0.4em] border-t border-[var(--border)] pt-6">
              {["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"].map(m => <span key={m}>{m}</span>)}
            </div>
          </section>
        </div>

        {/* Execution Log */}
        <section className="glass-card overflow-hidden border-[var(--border)]">
          <div className="p-10 border-b border-[var(--border)] flex items-center justify-between bg-[var(--foreground)]/[0.01] dark:bg-white/[0.01]">
            <h3 className="text-2xl font-black flex items-center gap-4">
              <LayoutDashboard className="w-6 h-6 text-blue-400" />
              Submission Log
            </h3>
            <Link href="/problems" className="group flex items-center gap-3 text-[10px] font-black text-[var(--muted)] hover:text-[var(--foreground)] uppercase tracking-[0.2em] transition-all">
              Initiate New Challenge
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.3em] border-b border-[var(--border)]">
                  <th className="px-10 py-6">Operational Context</th>
                  <th className="px-10 py-6">Outcome</th>
                  <th className="px-10 py-6">Runtime Engine</th>
                  <th className="px-10 py-6 text-right">Sequence Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {recentSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[var(--foreground)]/[0.02] dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="px-10 py-7">
                      <Link href={`/problems/${sub.problemId}`} className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[var(--foreground)]/[0.03] flex items-center justify-center text-[10px] font-black group-hover:bg-[var(--accent)] group-hover:text-black transition-all">
                          {sub.problemId.toString().padStart(2, '0')}
                        </div>
                        <span className="font-black text-lg tracking-tight group-hover:text-[var(--accent)] transition-colors">
                          {sub.title}
                        </span>
                      </Link>
                    </td>
                    <td className="px-10 py-7">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] border ${sub.status === "Accepted" ? "bg-green-500/5 text-green-500 border-green-500/10" : "bg-red-500/5 text-red-500 border-red-500/10"
                        }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${sub.status === "Accepted" ? "bg-green-500" : "bg-red-500"}`} />
                        {sub.status}
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-2 text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.3em]">
                        <Code2 className="w-3.5 h-3.5" />
                        {sub.language}
                      </div>
                    </td>
                    <td className="px-10 py-7 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-[var(--foreground)] uppercase tracking-widest">{sub.time.split(',')[0]}</span>
                        <span className="text-[9px] font-bold text-[var(--muted)] mt-1">{sub.time.split(',')[1]}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {recentSubmissions.length === 0 && (
            <div className="p-20 text-center space-y-4">
              <Search className="w-12 h-12 text-[var(--border)] mx-auto" />
              <p className="text-[var(--muted)] font-black uppercase tracking-[0.2em] text-xs">No execution history found</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
