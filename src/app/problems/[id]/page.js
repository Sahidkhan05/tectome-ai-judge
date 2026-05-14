"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Navbar from "@/components/Navbar";
import Editor from "@monaco-editor/react";
import { problems } from "@/data/problems";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Play,
  Send,
  ChevronRight,
  MessageSquare,
  Terminal,
  Layout,
  ChevronDown,
  Sparkles,
  Zap,
  FileCode,
  ShieldCheck,
  RotateCcw,
  BookOpen,
  Code2,
  Settings,
  Cpu,
  AlertCircle,
  CheckCircle2,
  Star,
  Lightbulb
} from "lucide-react";

const LANGUAGE_CONFIG = {
  javascript: { label: "JavaScript", monaco: "javascript" },
  python: { label: "Python", monaco: "python" },
  cpp: { label: "C++", monaco: "cpp" },
};

export default function ProblemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [activeTab, setActiveTab] = useState("description"); // description, result
  const [aiExpanded, setAiExpanded] = useState(false);

  const currentProblem = problems.find((p) => p.id === parseInt(params.id)) || problems[0];
  const [status, setStatus] = useState("ready"); // ready, running, success, error
  const [executionData, setExecutionData] = useState({ stdout: "", stderr: "", error: "" });
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  // Sync code with problem and language
  useEffect(() => {
    if (currentProblem?.starterCode?.[language]) {
      setCode(currentProblem.starterCode[language]);
    }
  }, [currentProblem.id, language]);

  // Chat state
  const [messages, setMessages] = useState([
    { role: "assistant", content: `Hello! I'm your AI Architect. Stuck on **${currentProblem.title}**? I can help with logic or time complexity.` },
  ]);
  // Input removed for structured actions
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      setUser(session.user);

      // Check if favorited
      const { data: favorite } = await supabase
        .from("favorite_problems")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("problem_id", currentProblem.id)
        .maybeSingle();

      setIsFavorite(!!favorite);
    };
    checkUser();
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [supabase, router, messages, currentProblem.id]);

  const handleNextProblem = () => {
    const currentIndex = problems.findIndex((p) => p.id === currentProblem.id);
    const nextProblem = problems[currentIndex + 1];
    if (nextProblem) {
      router.push(`/problems/${nextProblem.id}`);
      setShowNextButton(false);
      setStatus("ready");
      setExecutionData({ stdout: "", stderr: "", error: "" });
      setLanguage("javascript");
      // useEffect handles code reset
    } else {
      router.push("/problems");
    }
  };

  const handleRunCode = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setStatus("running");
    setActiveTab("result");
    setExecutionData({ stdout: "", stderr: "", error: "" });

    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code, problemId: currentProblem.id }),
      });
      const data = await res.json();

      setStatus(data.status === "success" ? "success" : "error");
      setExecutionData({
        stdout: data.stdout || "",
        stderr: data.stderr || "",
        error: data.error || ""
      });
      return data;
    } catch (err) {
      setStatus("error");
      setExecutionData({
        stdout: "",
        stderr: "Network failure. Unable to reach execution engine.",
        error: "Execution Failed"
      });
      return { status: "error" };
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    try {
      setIsSubmitting(true);
      const result = await handleRunCode();
      if (result.status === "success") setShowNextButton(true);
      await supabase.from("submissions").insert([{
        user_id: user.id,
        problem_id: currentProblem.id,
        problem_title: currentProblem.title,
        language,
        code,
        status: result.status === "success" ? "Accepted" : "Wrong Answer",
      }]);

      if (result.status === "success") {
        await supabase.from("solved_problems").upsert([{
          user_id: user.id,
          problem_id: currentProblem.id,
        }], { onConflict: 'user_id,problem_id' });
      }
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) return router.push("/login");

    try {
      if (isFavorite) {
        await supabase
          .from("favorite_problems")
          .delete()
          .eq("user_id", user.id)
          .eq("problem_id", currentProblem.id);
        setIsFavorite(false);
      } else {
        await supabase
          .from("favorite_problems")
          .insert([{ user_id: user.id, problem_id: currentProblem.id }]);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Favorite toggle error:", err);
    }
  };

  const sendMessage = async (message) => {
    if (!message || !message.trim()) return;

    setMessages(prev => [...prev, { role: "user", content: message }]);
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message,
          problemContext: currentProblem.title + ": " + currentProblem.description,
          code: code,
          language: language
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, my neural links are lagging. Try again?" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAIHint = async () => {
    if (!aiExpanded) setAiExpanded(true);
    await sendMessage("Can you give me a small hint for this problem?");
  };

  return (
    <div className="h-screen flex flex-col bg-[var(--background)] overflow-hidden selection:bg-[var(--accent)] selection:text-white">
      <Navbar />

      <main className="flex-1 flex overflow-hidden p-2 md:p-4 gap-2 md:gap-4">
        {/* Left Panel: Problem Context */}
        <div className="w-[45%] flex flex-col gap-2 md:gap-4 overflow-hidden">
          <div className="flex-1 glass-card overflow-hidden flex flex-col border-[var(--border)]">
            <div className="flex items-center px-4 border-b border-[var(--border)] bg-[var(--foreground)]/[0.02] dark:bg-white/[0.02] shrink-0">
              {[
                { id: "description", label: "Description", icon: BookOpen },
                { id: "result", label: "Test Results", icon: Terminal }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab.id ? "text-[var(--foreground)]" : "text-[var(--muted)] hover:text-[var(--foreground)]"
                    }`}
                >
                  <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? "text-[var(--accent)]" : ""}`} />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--accent)]" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar bg-[var(--foreground)]/[0.01] dark:bg-white/[0.01]">
              <AnimatePresence mode="wait">
                {activeTab === "description" ? (
                  <motion.div
                    key="desc"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="p-8 md:p-12 space-y-10"
                  >
                    <div className="space-y-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <h1 className="text-5xl font-black tracking-tighter leading-none">{currentProblem.title}</h1>
                            <button
                              onClick={handleToggleFavorite}
                              className={`p-3 rounded-2xl border transition-all ${isFavorite
                                ? "bg-[var(--gold)]/10 border-[var(--gold)]/20 text-[var(--gold)]"
                                : "bg-[var(--foreground)]/[0.03] border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
                                }`}
                            >
                              <Star className={`w-6 h-6 ${isFavorite ? "fill-current" : ""}`} />
                            </button>
                            <button
                              onClick={handleAIHint}
                              className="px-6 py-3 rounded-2xl bg-[var(--accent)] text-black text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-lg shadow-[var(--accent)]/20 flex items-center gap-2"
                            >
                              <Sparkles className="w-4 h-4" /> AI Hint
                            </button>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border ${currentProblem.difficulty === "Easy" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                              currentProblem.difficulty === "Medium" ? "bg-[var(--gold)]/10 text-[var(--gold)] border-[var(--gold)]/20" :
                                "bg-red-500/10 text-red-500 border-red-500/20"
                              }`}>
                              {currentProblem.difficulty}
                            </div>
                            <div className="flex items-center gap-2 text-[var(--muted)] bg-[var(--foreground)]/[0.03] dark:bg-white/[0.03] px-3 py-1.5 rounded-xl border border-[var(--border)]">
                              <Zap className="w-3.5 h-3.5 text-[var(--gold)]" />
                              <span className="text-[9px] font-black uppercase tracking-widest">1.2k Submissions</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {currentProblem.tags?.map(tag => (
                          <span key={tag} className="text-[8px] font-black uppercase tracking-[0.2em] text-[var(--muted)] bg-[var(--foreground)]/[0.03] px-3 py-1 rounded-lg border border-[var(--border)]/50">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="prose prose-invert max-w-none">
                      <div className="text-[var(--foreground)]/90 text-lg font-medium leading-[1.8] space-y-6">
                        {currentProblem?.description?.split("\n").map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </div>
                    </div>

                    {currentProblem.examples && (
                      <div className="space-y-8 pt-8 border-t border-[var(--border)]/50">
                        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-[var(--muted)] flex items-center gap-3">
                          <Code2 className="w-5 h-5 text-[var(--accent)]" />
                          Algorithmic Proofs
                        </h3>
                        {currentProblem.examples.map((ex, i) => (
                          <div key={i} className="space-y-4">
                            <div className="bg-[var(--foreground)]/[0.03] dark:bg-white/[0.03] border border-[var(--border)] rounded-[1.5rem] p-8 font-mono text-sm space-y-4 relative overflow-hidden group hover:border-[var(--accent)]/30 transition-colors">
                              <div className="absolute top-0 right-0 p-4 text-[9px] font-black text-[var(--muted)] uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">Example 0{i + 1}</div>
                              <div className="flex gap-6">
                                <span className="text-[var(--accent)] shrink-0 w-20 uppercase text-[10px] font-black mt-1 tracking-widest opacity-60">Input</span>
                                <code className="text-[var(--foreground)] font-bold">{ex.input}</code>
                              </div>
                              <div className="flex gap-6">
                                <span className="text-green-500 shrink-0 w-20 uppercase text-[10px] font-black mt-1 tracking-widest opacity-60">Output</span>
                                <code className="text-[var(--foreground)] font-black">{ex.output}</code>
                              </div>
                              {ex.explanation && (
                                <div className="pt-4 mt-4 border-t border-[var(--border)]/50 flex gap-6 italic text-[var(--muted)]">
                                  <span className="w-20 text-[9px] font-black uppercase tracking-widest mt-1 shrink-0">Analysis</span>
                                  <p className="text-xs leading-relaxed">{ex.explanation}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {currentProblem.constraints && (
                      <div className="space-y-6 pt-8 border-t border-[var(--border)]/50">
                        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-[var(--muted)] flex items-center gap-3">
                          <Settings className="w-5 h-5 text-[var(--gold)]" />
                          Boundary Conditions
                        </h3>
                        <ul className="grid grid-cols-1 gap-3">
                          {currentProblem.constraints.map((c, i) => (
                            <li key={i} className="flex items-center gap-4 text-xs font-bold text-[var(--muted)] bg-[var(--foreground)]/[0.02] dark:bg-white/[0.02] p-4 rounded-xl border border-[var(--border)]/30">
                              <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                              <code>{c}</code>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="res"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col p-8 md:p-12"
                  >
                    <div className="flex items-center justify-between mb-10">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-xl transition-all ${status === "running" ? "bg-[var(--gold)]/10 text-[var(--gold)]" :
                          status === "success" ? "bg-green-500/10 text-green-500" :
                            status === "error" ? "bg-red-500/10 text-red-500" :
                              "bg-[var(--foreground)]/[0.05] text-[var(--muted)]"
                          }`}>
                          {status === "success" ? <CheckCircle2 className="w-5 h-5" /> : status === "error" ? <AlertCircle className="w-5 h-5" /> : <Terminal className="w-5 h-5" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted)]">Execution Status</span>
                          <span className="text-sm font-black uppercase tracking-[0.1em]">
                            {status === "ready" ? "Awaiting Input" : status === "running" ? "Processing Vector..." : status === "success" ? "Solution Verified" : "Logic Exception"}
                          </span>
                        </div>
                      </div>
                      {showNextButton && (
                        <button
                          onClick={handleNextProblem}
                          className="bg-[var(--accent)] text-black px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 animate-bounce shadow-xl shadow-[var(--accent)]/30"
                        >
                          Next Evolution <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="flex-1 bg-black rounded-[2rem] p-10 font-mono text-sm border border-white/5 overflow-hidden flex flex-col premium-shadow relative group">
                      <div className="absolute top-6 right-8 flex gap-2 opacity-20 group-hover:opacity-100 transition-opacity">
                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                      </div>

                      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6">
                        {status === "ready" && (
                          <div className="flex flex-col items-center justify-center h-full space-y-6 opacity-20">
                            <Cpu className="w-16 h-16 animate-pulse" />
                            <p className="text-xs font-black uppercase tracking-[0.4em]">Initialize Execution Sequence</p>
                          </div>
                        )}

                        {status === "running" && (
                          <div className="space-y-6 h-full flex flex-col justify-center">
                            <div className="flex items-center gap-4 text-[var(--gold)]">
                              <span className="animate-pulse text-lg font-black">{">"}</span>
                              <span className="text-xs font-black uppercase tracking-widest">allocating neural resources...</span>
                            </div>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 5, ease: "linear" }}
                                className="h-full bg-[var(--gold)] shadow-[0_0_15px_rgba(250,204,21,0.5)]"
                              />
                            </div>
                          </div>
                        )}

                        {(status === "success" || status === "error") && (
                          <div className="space-y-8 animate-in fade-in duration-700">
                            {executionData.stdout && (
                              <div className="space-y-3">
                                <div className="text-[10px] font-black uppercase tracking-widest text-green-500/50 flex items-center gap-2">
                                  <div className="w-1 h-1 rounded-full bg-green-500" /> STDOUT
                                </div>
                                <pre className="text-green-400 whitespace-pre-wrap leading-relaxed opacity-90">{executionData.stdout}</pre>
                              </div>
                            )}

                            {(executionData.stderr || executionData.error) && (
                              <div className="space-y-3">
                                <div className="text-[10px] font-black uppercase tracking-widest text-red-500/50 flex items-center gap-2">
                                  <div className="w-1 h-1 rounded-full bg-red-500" /> {executionData.error ? "EXCEPTION" : "STDERR"}
                                </div>
                                <pre className="text-red-400 whitespace-pre-wrap leading-relaxed bg-red-500/5 p-4 rounded-xl border border-red-500/10">
                                  {executionData.error && <div className="font-black mb-1">[{executionData.error}]</div>}
                                  {executionData.stderr}
                                </pre>
                              </div>
                            )}

                            {!executionData.stdout && !executionData.stderr && !executionData.error && (
                              <div className="text-[var(--muted)] italic text-xs">Process terminated with no output.</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* AI Architect Panel */}
          <div className={`glass-card transition-all duration-700 flex flex-col overflow-hidden border-[var(--border)] group ${aiExpanded ? "h-[65%]" : "h-16"} premium-shadow`}>
            <button
              onClick={() => setAiExpanded(!aiExpanded)}
              className="px-6 h-16 flex items-center justify-between hover:bg-[var(--foreground)]/[0.03] dark:hover:bg-white/[0.03] transition-colors shrink-0 border-b border-[var(--border)]/50"
            >
              <div className="flex items-center gap-4">
                <div className={`p-1.5 rounded-lg transition-all duration-500 ${aiExpanded ? "bg-[var(--accent)] text-black shadow-[0_0_20px_rgba(59,130,246,0.3)]" : "bg-[var(--foreground)]/[0.05] text-[var(--muted)]"}`}>
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-start">
                  <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${aiExpanded ? "text-[var(--foreground)]" : "text-[var(--muted)]"}`}>
                    AI Architect Insight
                  </span>
                  {aiExpanded && <span className="text-[8px] text-[var(--muted)] font-bold uppercase tracking-wider">Neural Engine Active</span>}
                </div>
                {isTyping && (
                  <div className="flex gap-1 ml-2">
                    <div className="w-1 h-1 bg-[var(--accent)] rounded-full animate-bounce [animation-duration:0.6s]" />
                    <div className="w-1 h-1 bg-[var(--accent)] rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.2s]" />
                    <div className="w-1 h-1 bg-[var(--accent)] rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.4s]" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4">
                {!aiExpanded && messages.length > 0 && (
                  <div className="px-2 py-0.5 rounded-md bg-[var(--accent)]/10 text-[var(--accent)] text-[8px] font-black uppercase">
                    {messages.length} Units
                  </div>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform duration-500 text-[var(--muted)] ${aiExpanded ? "rotate-180" : ""}`} />
              </div>
            </button>

            <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-b from-transparent to-[var(--foreground)]/[0.02]">
              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar scroll-smooth">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-20">
                    <Cpu className="w-12 h-12" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em]">Awaiting Neural Input</p>
                  </div>
                ) : (
                  messages.map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                      className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[90%] md:max-w-[80%] px-6 py-5 rounded-[2rem] text-sm leading-relaxed shadow-2xl transition-all duration-300 hover:scale-[1.01] ${m.role === "user"
                        ? "bg-white dark:bg-zinc-100 text-black font-bold rounded-tr-none border border-white/20"
                        : "bg-[#0c0c0e] dark:bg-[#0c0c0e] border border-white/5 text-zinc-300 font-medium rounded-tl-none markdown-content"
                        }`}>
                        {m.role === "assistant" ? (
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {m.content}
                          </ReactMarkdown>
                        ) : (
                          m.content
                        )}
                        <div className={`text-[8px] mt-3 font-black uppercase tracking-widest opacity-30 ${m.role === "user" ? "text-black/60" : "text-white/60"}`}>
                          {m.role === "user" ? "User Sync" : "Architect System"}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-6 border-t border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-2xl flex flex-col gap-4">
                <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto w-full">
                  <button
                    disabled={isTyping}
                    onClick={() => sendMessage("Can you give me a small hint for this problem?")}
                    className="flex-1 min-w-[140px] px-4 py-3 rounded-xl bg-[var(--foreground)]/[0.03] dark:bg-white/[0.03] border border-[var(--border)]/50 hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/5 transition-all text-xs font-bold text-[var(--foreground)] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 premium-shadow hover:-translate-y-0.5"
                  >
                    <Lightbulb className="w-4 h-4 text-[var(--gold)]" />
                    💡 Hint
                  </button>
                  
                  <button
                    disabled={isTyping}
                    onClick={() => sendMessage("Explain this problem in beginner-friendly language. No code solutions.")}
                    className="flex-1 min-w-[140px] px-4 py-3 rounded-xl bg-[var(--foreground)]/[0.03] dark:bg-white/[0.03] border border-[var(--border)]/50 hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/5 transition-all text-xs font-bold text-[var(--foreground)] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 premium-shadow hover:-translate-y-0.5"
                  >
                    <BookOpen className="w-4 h-4 text-[var(--accent)]" />
                    📘 Explain Question
                  </button>

                  <button
                    disabled={isTyping}
                    onClick={() => sendMessage("Analyze my current code and suggest optimization ideas only. No full code.")}
                    className="flex-1 min-w-[140px] px-4 py-3 rounded-xl bg-[var(--foreground)]/[0.03] dark:bg-white/[0.03] border border-[var(--border)]/50 hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/5 transition-all text-xs font-bold text-[var(--foreground)] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 premium-shadow hover:-translate-y-0.5"
                  >
                    <Zap className="w-4 h-4 text-purple-500" />
                    ⚡ Optimize Solution
                  </button>
                </div>
                <div className="text-[8px] text-center mt-4 font-black uppercase tracking-[0.3em] text-[var(--muted)] opacity-50">
                  Secured Neural Link • End-to-End Encryption
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Editor Area */}
        <div className="flex-1 glass-card overflow-hidden flex flex-col border-[var(--border)]">
          <div className="flex items-center justify-between px-8 h-20 border-b border-[var(--border)] bg-[var(--foreground)]/[0.02] dark:bg-white/[0.02] shrink-0">
            <div className="flex items-center gap-10">
              <div className="flex items-center gap-4">
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                <span className="text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-3">
                  <FileCode className="w-5 h-5 text-[var(--muted)]" />
                  solution_context.env
                </span>
              </div>

              <div className="flex items-center gap-2 bg-[var(--foreground)]/[0.05] dark:bg-white/[0.05] p-1.5 rounded-2xl border border-[var(--border)]">
                {Object.keys(LANGUAGE_CONFIG).map(lang => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                    }}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${language === lang ? "bg-[var(--foreground)] text-[var(--background)] shadow-xl" : "text-[var(--muted)] hover:text-[var(--foreground)]"
                      }`}
                  >
                    {LANGUAGE_CONFIG[lang].label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setCode(currentProblem?.starterCode?.[language] || "")}
                className="p-3 hover:bg-[var(--foreground)]/[0.05] dark:hover:bg-white/[0.05] rounded-2xl transition-colors border border-transparent hover:border-[var(--border)] group"
                title="Reset Workspace"
              >
                <RotateCcw className="w-5 h-5 text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors" />
              </button>
              <button className="p-3 hover:bg-[var(--foreground)]/[0.05] dark:hover:bg-white/[0.05] rounded-2xl transition-colors border border-transparent hover:border-[var(--border)] group">
                <Settings className="w-5 h-5 text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors" />
              </button>
            </div>
          </div>

          <div className="flex-1 relative group bg-[#0a0a0a]">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/[0.03] to-transparent pointer-events-none z-10" />
            <Editor
              height="100%"
              theme="vs-dark"
              language={LANGUAGE_CONFIG[language].monaco}
              value={code}
              onChange={(val) => setCode(val)}
              options={{
                fontSize: 18,
                fontFamily: "var(--font-geist-mono)",
                minimap: { enabled: false },
                padding: { top: 40, bottom: 40 },
                lineNumbersMinChars: 4,
                glyphMargin: false,
                folding: true,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                cursorBlinking: "expand",
                cursorSmoothCaretAnimation: "on",
                renderLineHighlight: "all",
                lineHeight: 30,
                letterSpacing: 0.5,
                roundedSelection: true,
                scrollbar: {
                  vertical: 'hidden',
                  horizontal: 'hidden'
                }
              }}
            />
          </div>

          <div className="p-8 border-t border-[var(--border)] bg-[var(--background)]/50 backdrop-blur-xl flex items-center justify-between shrink-0">
            <div className="flex items-center gap-8 pl-4">
              <div className="flex items-center gap-3 text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.2em]">
                <ShieldCheck className="w-5 h-5 text-green-500/70" />
                Persistence Layer Active
              </div>
              <div className="w-px h-6 bg-[var(--border)]/50" />
              <div className="flex items-center gap-3 text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.2em]">
                <Zap className="w-4 h-4 text-[var(--gold)]/70" />
                V8 Optimized
              </div>
            </div>
            <div className="flex gap-5">
              <button
                onClick={handleRunCode}
                disabled={status === "running"}
                className="flex items-center gap-4 px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] bg-[var(--foreground)]/[0.05] dark:bg-white/[0.05] border border-[var(--border)] hover:bg-[var(--foreground)]/[0.1] dark:hover:bg-white/[0.1] transition-all active:scale-95 disabled:opacity-50 group"
              >
                <Play className="w-4 h-4 fill-current group-hover:text-[var(--accent)] transition-colors" />
                Compile & Run
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-4 px-16 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 shadow-2xl shadow-black/40 group"
              >
                {isSubmitting ? <div className="w-5 h-5 border-2 border-[var(--background)] border-t-transparent rounded-full animate-spin" /> : <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                Submit Result
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
