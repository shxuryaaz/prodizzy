import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { WebGLMeshBackground } from "@/components/WebGLMeshBackground";

const RED = "#E63946";

const TYPING_LINE_1 = "You already know the right people.";
const TYPING_LINE_2 = "You're just not doing anything with that.";
const CHAR_DELAY_MS = 45;
const PAUSE_BETWEEN_LINES_MS = 400;

// Scroll-in variants for sections
const scrollReveal = {
  hidden: { opacity: 0, y: 36 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};
const scrollRevealViewport = { once: true, margin: "-80px", amount: 0.2 };

export default function Home() {
  const [, setLocation] = useLocation();

  const typingSectionRef = useRef<HTMLElement>(null);
  const [typingStarted, setTypingStarted] = useState(false);
  const [typedLine1, setTypedLine1] = useState("");
  const [typedLine2, setTypedLine2] = useState("");
  const [typingComplete, setTypingComplete] = useState(false);

  // Always start at top
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  // Start typing when divider section enters viewport
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

  // Run typewriter once triggered
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
            <div className="flex items-center gap-6">
              <button
                onClick={() => setLocation("/login")}
                className="text-[13px] font-medium transition-colors duration-200"
                style={{ color: "rgba(255,255,255,0.35)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
              >
                Sign in
              </button>
              <button
                onClick={() => setLocation("/onboard")}
                className="text-[13px] font-medium transition-colors duration-200"
                style={{ color: "rgba(255,255,255,0.4)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
              >
                Get access →
              </button>
            </div>
          </div>
        </header>

        {/* ── HERO ── */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center pt-[58px]">
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
              className="text-[16px] sm:text-[17px] leading-relaxed mb-10 max-w-md mx-auto"
              style={{ color: "rgba(255,255,255,0.40)" }}
            >
              Prodizzy turns your scattered network into warm intros and real outcomes automatically.
            </motion.p>

            {/* CTA */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <button
                onClick={() => setLocation("/onboard")}
                className="h-[46px] px-7 rounded-xl font-semibold text-[15px] text-white transition-opacity hover:opacity-88"
                style={{ background: RED, boxShadow: `0 0 28px -6px rgba(230,57,70,0.5)` }}
              >
                Build your profile →
              </button>
              <button
                onClick={() => setLocation("/login")}
                className="h-[46px] px-6 rounded-xl text-[14px] font-medium transition-colors duration-200"
                style={{ color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.09)" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.7)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.35)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; }}
              >
                Sign in
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

        {/* ── THREE STATS ── */}
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

        {/* ── CTA SECTION ── */}
        <motion.section
          className="px-6 py-28"
          style={{ borderTop: "1px solid rgba(255,255,255,0.055)" }}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="max-w-lg mx-auto text-center">
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4 tracking-[-0.025em]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Ready to put your
              <br />network to work?
            </h2>
            <p className="text-[15px] mb-10" style={{ color: "rgba(255,255,255,0.38)" }}>
              Build your startup profile in 3 minutes.
            </p>
            <button
              onClick={() => setLocation("/onboard")}
              className="h-[50px] px-9 rounded-xl font-semibold text-[15px] text-white transition-opacity hover:opacity-88 mb-5"
              style={{ background: RED, boxShadow: `0 0 32px -6px rgba(230,57,70,0.5)` }}
            >
              Start your profile →
            </button>
            <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.25)" }}>
              Already have an account?{" "}
              <button
                onClick={() => setLocation("/login")}
                className="transition-colors underline underline-offset-2"
                style={{ color: "rgba(255,255,255,0.4)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
              >
                Sign in
              </button>
            </p>
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
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
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
