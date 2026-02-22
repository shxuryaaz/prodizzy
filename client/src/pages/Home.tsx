import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { WebGLMeshBackground } from "@/components/WebGLMeshBackground";

const RED = "#E63946";

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
  const [showRoleModal, setShowRoleModal] = useState(false);

  // Always start at top
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  const scrollToHow = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: "#08090A", fontFamily: "'Inter', sans-serif" }}>
      <WebGLMeshBackground />
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
          <div className="mx-auto px-6 h-[58px] flex items-center justify-between max-w-5xl">
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="Prodizzy" className="w-6 h-6 object-contain" />
              <span className="text-[14px] font-semibold tracking-tight">Prodizzy</span>
            </div>
            <button
              onClick={() => setShowRoleModal(true)}
              className="h-[38px] px-6 rounded-lg font-medium text-[13px] text-white transition-all hover:opacity-90"
              style={{ background: RED, boxShadow: `0 0 20px -6px rgba(230,57,70,0.4)` }}
            >
              Join now
            </button>
          </div>
        </header>

        {/* ── HERO ── */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center pt-[58px]">
          <motion.div
            className="max-w-3xl"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          >
            <motion.h1
              variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } }}
              className="font-bold leading-[1.08] tracking-[-0.035em] mb-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.8rem, 7vw, 5.2rem)" }}
            >
              Turn Intent into
              <br />
              <span style={{ color: RED }}>Outcomes</span>
            </motion.h1>

            <motion.p
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }}
              className="text-[17px] sm:text-[18px] leading-relaxed mb-10 max-w-2xl mx-auto"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              Stop relying on random connections. Get matched with the right people for hiring, partnerships, growth, and fundraising.
            </motion.p>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <button
                onClick={() => setShowRoleModal(true)}
                className="h-[50px] px-9 rounded-xl font-semibold text-[15px] text-white transition-opacity hover:opacity-90"
                style={{ background: RED, boxShadow: `0 0 32px -6px rgba(230,57,70,0.5)` }}
              >
                Get Started →
              </button>
              <button
                onClick={scrollToHow}
                className="h-[50px] px-8 rounded-xl text-[14px] font-medium transition-colors duration-200"
                style={{ color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.8)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
              >
                How it works
              </button>
            </motion.div>
          </motion.div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <motion.section
          id="how-it-works"
          className="px-6 py-24"
          style={{ borderTop: "1px solid rgba(255,255,255,0.055)" }}
          initial="hidden"
          whileInView="visible"
          viewport={scrollRevealViewport}
          variants={{ visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } } }}
        >
          <motion.h2
            variants={scrollReveal}
            className="text-3xl sm:text-4xl font-bold text-center mb-16 tracking-[-0.025em]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            How it works
          </motion.h2>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Define your needs",
                desc: "Tell us your startup stage and current needs — hiring, partnerships, growth, or fundraising.",
              },
              {
                step: "2",
                title: "Get matched",
                desc: "We connect you with the right people and collaborators actively looking for startups like yours.",
              },
              {
                step: "3",
                title: "Track & automate",
                desc: "Track conversations, get insights, and automate follow-ups — all in one place.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={scrollReveal}
                custom={i}
                className="px-6 py-7 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div
                  className="text-5xl font-bold mb-4 tracking-tight"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", color: RED, opacity: 0.3 }}
                >
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-[14px] leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── ROLE CARDS ── */}
        <motion.section
          className="px-6 py-24"
          style={{ borderTop: "1px solid rgba(255,255,255,0.055)" }}
          initial="hidden"
          whileInView="visible"
          viewport={scrollRevealViewport}
          variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}
        >
          <motion.h2
            variants={scrollReveal}
            className="text-3xl sm:text-4xl font-bold text-center mb-4 tracking-[-0.025em]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Who is Prodizzy for?
          </motion.h2>
          <motion.p
            variants={scrollReveal}
            custom={1}
            className="text-center text-[15px] mb-16 max-w-xl mx-auto"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Whether you're building, investing, or looking for opportunities — we have a place for you.
          </motion.p>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Join as Startup",
                desc: "Build and scale your startup with the right people, partners, and capital. For founders from idea to growth stage.",
                action: () => setLocation("/onboard"),
              },
              {
                title: "Join as Partner",
                desc: "Access high-intent startups actively looking for your expertise. For agencies, service providers, investors, and institutional firms.",
                action: () => setLocation("/partner-onboard"),
              },
              {
                title: "Join as Individual",
                desc: "Receive curated opportunities based on your profile and preferences. For job seekers, freelancers, creators, and community admins.",
                action: () => setLocation("/individual-onboard"),
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                variants={scrollReveal}
                custom={i + 2}
                className="px-7 py-8 rounded-2xl cursor-pointer transition-all group"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}
                onClick={card.action}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(230,57,70,0.3)";
                  e.currentTarget.style.background = "rgba(230,57,70,0.04)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                }}
              >
                <h3 className="text-xl font-semibold mb-3 group-hover:text-[#E63946] transition-colors">{card.title}</h3>
                <p className="text-[14px] leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {card.desc}
                </p>
                <span
                  className="text-[13px] font-medium inline-flex items-center gap-1.5 transition-colors"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  Get started <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── VALUE STRIP ── */}
        <motion.section
          className="px-6 py-16"
          style={{ borderTop: "1px solid rgba(255,255,255,0.055)", borderBottom: "1px solid rgba(255,255,255,0.055)" }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, margin: "-80px" }}
        >
          <p
            className="text-center text-2xl sm:text-3xl font-semibold tracking-[-0.02em]"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "rgba(255,255,255,0.7)" }}
          >
            Built for <span style={{ color: RED }}>high-intent networking</span>,
            <br />
            not passive browsing.
          </p>
        </motion.section>

        {/* ── FINAL CTA ── */}
        <motion.section
          className="px-6 py-28"
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
              Start building with the
              <br />right people, not just
              <br />more connections.
            </h2>
            <p className="text-[15px] mb-10" style={{ color: "rgba(255,255,255,0.38)" }}>
              Join Prodizzy today and turn your intent into real outcomes.
            </p>
            <button
              onClick={() => setShowRoleModal(true)}
              className="h-[52px] px-10 rounded-xl font-semibold text-[15px] text-white transition-opacity hover:opacity-90"
              style={{ background: RED, boxShadow: `0 0 32px -6px rgba(230,57,70,0.5)` }}
            >
              Join now →
            </button>
            <p className="text-[13px] mt-6" style={{ color: "rgba(255,255,255,0.25)" }}>
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
              <a href="#" className="text-[12px] transition-colors" style={{ color: "rgba(255,255,255,0.25)" }}>
                Contact
              </a>
              <a href="#" className="text-[12px] transition-colors" style={{ color: "rgba(255,255,255,0.25)" }}>
                Privacy
              </a>
            </div>
          </div>
        </motion.footer>
      </div>

      {/* ── ROLE SELECTION MODAL ── */}
      {showRoleModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-6"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
          onClick={() => setShowRoleModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-3xl rounded-2xl p-8"
            style={{ background: "#0D0E0F", border: "1px solid rgba(255,255,255,0.1)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              className="text-2xl font-bold mb-2 text-center"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Choose your role
            </h2>
            <p className="text-center text-[14px] mb-8" style={{ color: "rgba(255,255,255,0.4)" }}>
              Select the option that best describes you
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                { title: "Startup", desc: "I'm a founder", action: () => setLocation("/onboard") },
                { title: "Partner", desc: "Agency, investor, or firm", action: () => setLocation("/partner-onboard") },
                { title: "Individual", desc: "Job seeker or freelancer", action: () => setLocation("/individual-onboard") },
              ].map((role, i) => (
                <button
                  key={i}
                  onClick={role.action}
                  className="px-6 py-6 rounded-xl text-left transition-all"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(230,57,70,0.4)";
                    e.currentTarget.style.background = "rgba(230,57,70,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  }}
                >
                  <h3 className="text-lg font-semibold mb-1">{role.title}</h3>
                  <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.4)" }}>{role.desc}</p>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowRoleModal(false)}
              className="w-full py-3 rounded-lg text-[14px] font-medium transition-colors"
              style={{ color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
