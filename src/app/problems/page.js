"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { problems } from "@/data/problems";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ChevronRight, Trophy, Code2, Sparkles, LayoutGrid, List as ListIcon, Command } from "lucide-react";

export default function ProblemsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [selectedTag, setSelectedTag] = useState("All");
  const [viewMode, setViewMode] = useState("list"); // list or grid

  const allTags = ["All", ...new Set(problems.flatMap((p) => p.tags || []))].sort(
    (a, b) => (a === "All" ? -1 : b === "All" ? 1 : a.localeCompare(b))
  );

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === "All" || problem.difficulty === difficultyFilter;
    const matchesTag = selectedTag === "All" || problem.tags?.includes(selectedTag);
    return matchesSearch && matchesDifficulty && matchesTag;
  });

  return (
    <div className="min-h-screen bg-[var(--background)] selection:bg-[var(--accent)] selection:text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-20 space-y-16">
        {/* Header Section */}
        <header className="relative space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[var(--accent)]/[0.05] border border-[var(--accent)]/10 text-[var(--accent)] text-[10px] font-black uppercase tracking-[0.2em]">
            <Trophy className="w-3.5 h-3.5" />
            Algorithm Mastery
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter premium-gradient-text leading-[0.85]">
            Refine your <br />
            technical edge.
          </h1>
          <p className="text-[var(--muted)] font-medium text-xl leading-relaxed">
            A curated selection of elite challenges designed to test architectural depth and algorithmic efficiency.
          </p>
        </header>

        {/* Filter Bar */}
        <section className="sticky top-20 z-40 glass-card p-2 md:p-3 flex flex-col lg:flex-row items-center justify-between gap-4 premium-shadow">
          <div className="relative w-full lg:w-[450px] group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
              <Search className="w-4 h-4 text-[var(--muted)] group-focus-within:text-[var(--accent)] transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search challenges by title or pattern..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--foreground)]/[0.03] dark:bg-white/[0.03] border border-transparent focus:border-[var(--border)] rounded-2xl pl-12 pr-12 py-4 text-sm focus:ring-4 focus:ring-[var(--accent)]/5 outline-none transition-all placeholder:text-[var(--muted)] font-bold"
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1.5 px-2 py-1 bg-[var(--border)] rounded-lg text-[9px] font-black text-[var(--muted)]">
              <Command className="w-3 h-3" /> K
            </div>
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="flex bg-[var(--foreground)]/[0.03] dark:bg-white/[0.03] p-1 rounded-2xl border border-[var(--border)] flex-1 lg:flex-none">
              {["All", "Easy", "Medium", "Hard"].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficultyFilter(diff)}
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    difficultyFilter === diff
                      ? "bg-[var(--foreground)] text-[var(--background)] shadow-2xl"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            <div className="hidden md:flex bg-[var(--foreground)]/[0.03] dark:bg-white/[0.03] p-1 rounded-2xl border border-[var(--border)]">
              {[
                { id: "list", icon: ListIcon },
                { id: "grid", icon: LayoutGrid }
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id)}
                  className={`p-2.5 rounded-xl transition-all ${
                    viewMode === mode.id
                      ? "bg-[var(--foreground)] text-[var(--background)] shadow-lg"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <mode.icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="space-y-8">
          {/* Tags */}
          <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
            <div className="flex items-center gap-2 text-[var(--muted)] mr-2">
              <Filter className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Filters:</span>
            </div>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`whitespace-nowrap px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                  selectedTag === tag
                    ? "bg-[var(--accent)] border-[var(--accent)] text-black shadow-lg shadow-[var(--accent)]/20"
                    : "bg-transparent border-[var(--border)] text-[var(--muted)] hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Problem List */}
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "grid gap-4"}>
            <AnimatePresence mode="popLayout">
              {filteredProblems.map((problem, index) => (
                <motion.div
                  key={problem.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Link
                    href={`/problems/${problem.id}`}
                    className={`group glass-card flex flex-col lg:flex-row items-start lg:items-center justify-between hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/[0.01] dark:hover:bg-[var(--accent)]/[0.02] transition-all p-6 lg:p-8 ${
                      viewMode === "grid" ? "h-full" : ""
                    }`}
                  >
                    <div className="flex items-start lg:items-center gap-6 lg:gap-10">
                      <div className="relative shrink-0">
                        <span className="text-xl font-black text-[var(--border)] group-hover:text-[var(--accent)] transition-colors duration-500 tabular-nums">
                          {problem.id.toString().padStart(2, '0')}
                        </span>
                        <div className="absolute -inset-2 bg-[var(--accent)]/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <h2 className="text-2xl font-black tracking-tight group-hover:translate-x-1 transition-transform">
                            {problem.title}
                          </h2>
                          {index < 3 && (
                            <div className="p-1 rounded-lg bg-red-500/10 text-red-500">
                              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {problem.tags?.map((tag) => (
                            <span key={tag} className="text-[9px] font-black uppercase tracking-widest text-[var(--muted)] border border-[var(--border)] px-2 py-1 rounded-md bg-[var(--foreground)]/[0.02]">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 lg:mt-0 flex items-center gap-10 w-full lg:w-auto border-t lg:border-none pt-6 lg:pt-0 border-[var(--border)]">
                      <div className="flex-1 lg:flex-none text-right">
                        <div className={`inline-flex px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border ${
                          problem.difficulty === "Easy" ? "bg-green-500/5 text-green-500 border-green-500/10" :
                          problem.difficulty === "Medium" ? "bg-[var(--gold)]/5 text-[var(--gold)] border-[var(--gold)]/10" :
                          "bg-red-500/5 text-red-500 border-red-500/10"
                        }`}>
                          {problem.difficulty}
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-[var(--foreground)]/[0.03] dark:bg-white/[0.03] border border-[var(--border)] flex items-center justify-center group-hover:bg-[var(--accent)] group-hover:border-[var(--accent)] group-hover:text-black transition-all duration-500 rotate-3 group-hover:rotate-0">
                        <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredProblems.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="py-32 text-center glass-card border-dashed flex flex-col items-center justify-center gap-6"
              >
                <div className="w-20 h-20 bg-[var(--foreground)]/[0.03] rounded-3xl flex items-center justify-center">
                  <Code2 className="w-10 h-10 text-[var(--muted)]" />
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-black">No matching challenges</p>
                  <p className="text-[var(--muted)] font-medium">Try adjusting your filters or search query.</p>
                </div>
                <button 
                  onClick={() => { setSearchQuery(""); setDifficultyFilter("All"); setSelectedTag("All"); }}
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent)] hover:underline"
                >
                  Reset all filters
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}