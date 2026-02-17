import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { insertWaitlistSchema, type InsertWaitlistEntry } from "@shared/schema";
import { api } from "@shared/routes";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, ArrowDown } from "lucide-react";
import { WebGLMeshBackground } from "@/components/WebGLMeshBackground";

const RED = "#E63946";

const TYPING_LINE_1 = "You already know the right people.";
const TYPING_LINE_2 = "You're just not doing anything with that.";
const CHAR_DELAY_MS = 45;
const PAUSE_BETWEEN_LINES_MS = 400;

const ROLES = ["Founder", "Student", "Operator", "Freelancer", "Investor", "Agency", "Other"] as const;

// Slide animation variants
const slide = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 48 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: -dir * 48 }),
};
const slideTransition = { duration: 0.38, ease: [0.22, 1, 0.36, 1] };

// Scroll-in variants for sections
const scrollReveal = {
  hidden: { opacity: 0, y: 36 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};
const scrollRevealNoDelay = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const scrollRevealViewport = { once: true, margin: "-80px", amount: 0.2 };

export default function Home() {
  const { toast } = useToast();
  const [step, setStep] = useState(0); // 0=name, 1=email, 2=role
  const [dir, setDir] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);

  const typingSectionRef = useRef<HTMLElement>(null);
  const [typingStarted, setTypingStarted] = useState(false);
  const [typedLine1, setTypedLine1] = useState("");
  const [typedLine2, setTypedLine2] = useState("");
  const [typingComplete, setTypingComplete] = useState(false);

  const form = useForm<InsertWaitlistEntry>({
    resolver: zodResolver(insertWaitlistSchema),
    defaultValues: { name: "", email: "", role: "Founder" },
    mode: "onChange",
  });

  const name = form.watch("name");
  const email = form.watch("email");
  const role = form.watch("role");

  const mutation = useMutation({
    mutationFn: async (data: InsertWaitlistEntry) => {
      const res = await apiRequest("POST", api.waitlist.create.path, data);
      return res.json();
    },
    onSuccess: () => setIsSuccess(true),
    onError: (error: Error) => {
      toast({ title: "Something went wrong", description: error.message, variant: "destructive" });
    },
  });

  const advance = async (currentField: keyof InsertWaitlistEntry) => {
    const valid = await form.trigger(currentField);
    if (!valid) return;
    setDir(1);
    setStep((s) => s + 1);
  };

  const back = () => {
    setDir(-1);
    setStep((s) => s - 1);
  };

  const scrollToForm = () => {
    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
  };

  // Always start at top when visiting the page (prevents scroll-to-form from hash/restoration/focus)
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  // Start typing when the divider section enters viewport
  useEffect(() => {
    const el = typingSectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setTypingStarted((s) => (s ? s : true));
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Run typewriter once typing has started
  useEffect(() => {
    if (!typingStarted) return;
    let cancelled = false;
    let t1: ReturnType<typeof setTimeout> | null = null;
    let t2: ReturnType<typeof setTimeout> | null = null;

    let i = 0;
    const runLine1 = () => {
      if (cancelled || i >= TYPING_LINE_1.length) {
        t2 = setTimeout(() => runLine2(), PAUSE_BETWEEN_LINES_MS);
        return;
      }
      setTypedLine1(TYPING_LINE_1.slice(0, i + 1));
      i += 1;
      t1 = setTimeout(runLine1, CHAR_DELAY_MS);
    };
    let j = 0;
    const runLine2 = () => {
      if (cancelled) return;
      if (j >= TYPING_LINE_2.length) {
        setTypingComplete(true);
        return;
      }
      setTypedLine2(TYPING_LINE_2.slice(0, j + 1));
      j += 1;
      t2 = setTimeout(runLine2, CHAR_DELAY_MS);
    };

    runLine1();
    return () => {
      cancelled = true;
      if (t1) clearTimeout(t1);
      if (t2) clearTimeout(t2);
    };
  }, [typingStarted]);

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: "#08090A", fontFamily: "'Inter', sans-serif" }}>
      <WebGLMeshBackground />
      {/* Ambient top glow */}
      <div
        className="fixed inset-x-0 top-0 h-[520px] pointer-events-none z-0"
        style={{ background: `radial-gradient(ellipse 60% 50% at 50% -5%, rgba(230,57,70,0.11) 0%, transparent 70%)` }}
      />

      <div className="relative z-10">
        {/* ── NAV ── */}
        <header
          className="fixed top-0 inset-x-0 z-50"
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            backdropFilter: "blur(14px)",
            background: "rgba(8,9,10,0.8)",
          }}
        >
          <div className="mx-auto px-6 h-[58px] flex items-center justify-between max-w-4xl">
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="Prodizzy" className="w-6 h-6 object-contain" />
              <span className="text-[14px] font-semibold tracking-tight">Prodizzy</span>
            </div>
            <button
              onClick={scrollToForm}
              className="text-[13px] font-medium transition-colors duration-200"
              style={{ color: "rgba(255,255,255,0.4)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
            >
              Get access →
            </button>
          </div>
        </header>

        {/* ── HERO ── */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center pt-[58px]">
          {/* Staggered entrance */}
          <motion.div
            className="max-w-2xl"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          >
            {/* Headline */}
            <motion.h1
              variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } }}
              className="font-bold leading-[1.06] tracking-[-0.035em] mb-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.6rem, 6.5vw, 4.75rem)" }}
            >
              Your connections
              <br />
              aren't working for you.
              <br />
              <span style={{ color: RED }}>Yet.</span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }}
              className="text-[16px] sm:text-[17px] leading-relaxed mb-14 max-w-md mx-auto"
              style={{ color: "rgba(255,255,255,0.40)" }}
            >
              Prodizzy turns your scattered network into warm intros and real outcomes automatically.
            </motion.p>

            {/* CTA */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }}
            >
              <button
                onClick={scrollToForm}
                className="inline-flex flex-col items-center gap-2 group"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                <span className="text-[13px] font-medium transition-colors duration-200 group-hover:text-white">
                  Get early access
                </span>
                <ArrowDown
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-y-1"
                />
              </button>
            </motion.div>
          </motion.div>
        </section>

        {/* ── DIVIDER STATEMENT ── */}
        <motion.section
          ref={typingSectionRef}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, margin: "-80px", amount: 0.2 }}
          className="px-6 py-20"
          style={{ borderTop: "1px solid rgba(255,255,255,0.055)" }}
        >
          <p
            className="max-w-2xl mx-auto text-center text-2xl sm:text-3xl font-semibold leading-snug tracking-[-0.02em] min-h-[4.5em] sm:min-h-[5rem] flex flex-col items-center justify-center"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "rgba(255,255,255,0.65)" }}
          >
            <span>
              {typedLine1}
              {!typingComplete && typedLine2.length === 0 && (
                <span className="inline-block w-0.5 h-[1em] align-baseline ml-0.5 bg-white/80 animate-pulse" aria-hidden />
              )}
            </span>
            {typedLine2.length > 0 && (
              <>
                <br />
                <span style={{ color: "#fff" }}>
                  {typedLine2}
                  {!typingComplete && (
                    <span className="inline-block w-0.5 h-[1em] align-baseline ml-0.5 bg-white/80 animate-pulse" aria-hidden />
                  )}
                </span>
              </>
            )}
          </p>
        </motion.section>

        {/* ── THREE STATS / REASONS ── */}
        <motion.section
          className="px-6 pb-24"
          initial="hidden"
          whileInView="visible"
          viewport={scrollRevealViewport}
          variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
        >
          <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-px" style={{ background: "rgba(255,255,255,0.06)", borderRadius: "16px", overflow: "hidden" }}>
            {[
              { stat: "87%", label: "of deals come through warm intros" },
              { stat: "10+", label: "apps your network is scattered across" },
              { stat: "0", label: "of your follow-ups happen automatically" },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={scrollReveal}
                custom={i}
                className="px-7 py-8"
                style={{ background: "#08090A" }}
              >
                <div
                  className="text-4xl font-bold mb-2 tracking-tight"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", color: RED }}
                >
                  {item.stat}
                </div>
                <div className="text-[13px] leading-snug" style={{ color: "rgba(255,255,255,0.38)" }}>
                  {item.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── MULTI-STEP WAITLIST ── */}
        <motion.section
          id="waitlist"
          className="px-6 py-28"
          style={{ borderTop: "1px solid rgba(255,255,255,0.055)" }}
          initial="hidden"
          whileInView="visible"
          viewport={scrollRevealViewport}
          variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } } }}
        >
          <div className="max-w-lg mx-auto">
            {/* Section label */}
            <motion.p
              variants={scrollRevealNoDelay}
              className="text-[11px] uppercase tracking-[0.12em] font-semibold mb-16"
              style={{ color: "rgba(255,255,255,0.22)" }}
            >
              Join the waitlist
            </motion.p>

            {/* Progress dots */}
            {!isSuccess && (
              <motion.div variants={scrollRevealNoDelay} className="flex gap-2 mb-12">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-[3px] rounded-full transition-all duration-400"
                    style={{
                      flex: i <= step ? 2 : 1,
                      background: i <= step ? RED : "rgba(255,255,255,0.1)",
                      transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
                    }}
                  />
                ))}
              </motion.div>
            )}

            <motion.form variants={scrollRevealNoDelay} onSubmit={(e) => { e.preventDefault(); }}>
              <AnimatePresence mode="wait" custom={dir}>
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center py-10"
                  >
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-7"
                      style={{ background: "rgba(230,57,70,0.08)", border: `1px solid rgba(230,57,70,0.22)` }}
                    >
                      <CheckCircle2 size={22} style={{ color: RED }} />
                    </motion.div>
                    <h3
                      className="text-3xl font-bold mb-3"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      You're in, {name}.
                    </h3>
                    <p className="text-[15px] leading-relaxed" style={{ color: "rgba(255,255,255,0.38)" }}>
                      We'll reach out to <span style={{ color: "rgba(255,255,255,0.7)" }}>{email}</span> when
                      your spot opens up.
                    </p>
                  </motion.div>
                ) : step === 0 ? (
                  <motion.div
                    key="step-name"
                    custom={dir}
                    variants={slide}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={slideTransition}
                  >
                    <h2
                      className="text-3xl sm:text-4xl font-bold mb-2 tracking-[-0.025em]"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      What's your name?
                    </h2>
                    <p className="text-[14px] mb-8" style={{ color: "rgba(255,255,255,0.35)" }}>
                      Let's start somewhere.
                    </p>
                    <input
                      placeholder="Jane Doe"
                      {...form.register("name")}
                      onKeyDown={(e) => e.key === "Enter" && advance("name")}
                      className="w-full text-xl sm:text-2xl font-medium outline-none pb-3 mb-2 bg-transparent transition-colors duration-200"
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.14)",
                        color: "#fff",
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.42)")}
                      onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.14)")}
                    />
                    {form.formState.errors.name && (
                      <p className="text-[13px] mb-6" style={{ color: RED }}>
                        {form.formState.errors.name.message}
                      </p>
                    )}
                    <div className="mt-8">
                      <button
                        type="button"
                        onClick={() => advance("name")}
                        className="inline-flex items-center gap-2 font-semibold text-[15px] transition-opacity hover:opacity-70"
                        style={{ color: "#fff" }}
                      >
                        Continue
                        <span style={{ color: RED }}>→</span>
                      </button>
                    </div>
                  </motion.div>
                ) : step === 1 ? (
                  <motion.div
                    key="step-email"
                    custom={dir}
                    variants={slide}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={slideTransition}
                  >
                    <h2
                      className="text-3xl sm:text-4xl font-bold mb-2 tracking-[-0.025em]"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      Hi {name}, where should
                      <br />we send your invite?
                    </h2>
                    <p className="text-[14px] mb-8" style={{ color: "rgba(255,255,255,0.35)" }}>
                      We'll only ever use this to reach you about Prodizzy.
                    </p>
                    <input
                      autoFocus
                      type="email"
                      placeholder="you@company.com"
                      {...form.register("email")}
                      onKeyDown={(e) => e.key === "Enter" && advance("email")}
                      className="w-full text-xl sm:text-2xl font-medium outline-none pb-3 mb-2 bg-transparent transition-colors duration-200"
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.14)",
                        color: "#fff",
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.42)")}
                      onBlur={(e) => (e.currentTarget.style.borderBottomColor = "rgba(255,255,255,0.14)")}
                    />
                    {form.formState.errors.email && (
                      <p className="text-[13px] mb-6" style={{ color: RED }}>
                        {form.formState.errors.email.message}
                      </p>
                    )}
                    <div className="mt-8 flex items-center gap-6">
                      <button
                        type="button"
                        onClick={back}
                        className="text-[14px] transition-colors"
                        style={{ color: "rgba(255,255,255,0.3)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        onClick={() => advance("email")}
                        className="inline-flex items-center gap-2 font-semibold text-[15px] transition-opacity hover:opacity-70"
                        style={{ color: "#fff" }}
                      >
                        Continue
                        <span style={{ color: RED }}>→</span>
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step-role"
                    custom={dir}
                    variants={slide}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={slideTransition}
                  >
                    <h2
                      className="text-3xl sm:text-4xl font-bold mb-2 tracking-[-0.025em]"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      Last one.
                    </h2>
                    <p className="text-[14px] mb-8" style={{ color: "rgba(255,255,255,0.35)" }}>
                      What best describes you?
                    </p>

                    {/* Role pills */}
                    <div className="flex flex-wrap gap-2.5 mb-10">
                      {ROLES.map((r) => {
                        const selected = role === r;
                        return (
                          <button
                            key={r}
                            type="button"
                            onClick={() => form.setValue("role", r)}
                            className="px-4 py-2 rounded-full text-[14px] font-medium transition-all duration-200"
                            style={{
                              background: selected ? RED : "rgba(255,255,255,0.05)",
                              border: selected ? `1px solid ${RED}` : "1px solid rgba(255,255,255,0.09)",
                              color: selected ? "#fff" : "rgba(255,255,255,0.55)",
                              boxShadow: selected ? `0 0 18px -4px rgba(230,57,70,0.45)` : "none",
                            }}
                          >
                            {r}
                          </button>
                        );
                      })}
                    </div>

                    {form.formState.errors.role && (
                      <p className="text-[13px] mb-4" style={{ color: RED }}>
                        {form.formState.errors.role.message}
                      </p>
                    )}

                    <div className="flex items-center gap-6">
                      <button
                        type="button"
                        onClick={back}
                        className="text-[14px] transition-colors"
                        style={{ color: "rgba(255,255,255,0.3)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        disabled={mutation.isPending}
                        onClick={() => form.handleSubmit((d) => mutation.mutate(d))()}
                        className="h-[46px] px-7 rounded-xl font-semibold text-[15px] text-white transition-opacity disabled:opacity-60 hover:opacity-88"
                        style={{ background: RED, boxShadow: `0 0 28px -6px rgba(230,57,70,0.5)` }}
                      >
                        {mutation.isPending ? "Joining..." : "Get early access"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.form>
          </div>
        </motion.section>

        {/* ── FOOTER ── */}
        <motion.footer
          className="px-6 py-7"
          style={{ borderTop: "1px solid rgba(255,255,255,0.055)" }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <div
            className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Prodizzy" className="w-4 h-4 object-contain opacity-35" />
              <span className="text-[12px] font-medium" style={{ color: "rgba(255,255,255,0.25)" }}>
                Prodizzy
              </span>
            </div>
            <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.18)" }}>
              © 2026 Prodizzy, Inc. All rights reserved.
            </p>
            <div className="flex gap-5">
              {["Twitter", "LinkedIn", "Privacy"].map((l) => (
                <a
                  key={l}
                  href="#"
                  className="text-[12px] transition-colors"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
