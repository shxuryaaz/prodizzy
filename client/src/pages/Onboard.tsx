import { useState } from "react";
import { useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { ChevronLeft } from "lucide-react";

const TOTAL_STEPS = 8;

// ─── Slide variants ────────────────────────────────────────────────────────────
function slideVariants(dir: number) {
  return {
    initial: { x: dir > 0 ? "60px" : "-60px", opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
    exit: { x: dir > 0 ? "-60px" : "60px", opacity: 0, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } },
  };
}

// ─── Pill selector ─────────────────────────────────────────────────────────────
function Pill({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
        selected
          ? "bg-white text-black border-white"
          : "bg-transparent text-white/60 border-white/15 hover:border-white/40 hover:text-white/80"
      }`}
    >
      {label}
    </button>
  );
}

// ─── Text input ────────────────────────────────────────────────────────────────
function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  maxLength,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  maxLength?: number;
  multiline?: boolean;
}) {
  const base =
    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-white/30 transition-colors resize-none";
  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-white/40 uppercase tracking-wider">{label}</label>
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className={base}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className={base}
        />
      )}
      {maxLength && (
        <p className="text-xs text-white/25 text-right">{value.length}/{maxLength}</p>
      )}
    </div>
  );
}

// ─── Multi-select pills ────────────────────────────────────────────────────────
function MultiPill({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => (
        <Pill key={o} label={o} selected={selected.includes(o)} onClick={() => onToggle(o)} />
      ))}
    </div>
  );
}

// ─── Single-select pills ───────────────────────────────────────────────────────
function SinglePill({
  options,
  selected,
  onSelect,
}: {
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => (
        <Pill key={o} label={o} selected={selected === o} onClick={() => onSelect(o)} />
      ))}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function Onboard() {
  const { session } = useAuth();
  const isLoggedIn = !!session;
  // When already logged in, skip the account-creation step (step 7)
  const EFFECTIVE_STEPS = isLoggedIn ? TOTAL_STEPS - 1 : TOTAL_STEPS;

  const [, setLocation] = useLocation();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [name, setName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyDesc, setCompanyDesc] = useState("");
  const [industry, setIndustry] = useState("");
  const [stage, setStage] = useState("");
  const [bizModel, setBizModel] = useState("");
  const [targetCustomer, setTargetCustomer] = useState("");
  const [primaryProblem, setPrimaryProblem] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [specificAsk, setSpecificAsk] = useState("");
  const [location, setLocation2] = useState("");
  const [tractionRange, setTractionRange] = useState("");
  const [revenueStatus, setRevenueStatus] = useState("");
  const [fundraisingStatus, setFundraisingStatus] = useState("");
  const [capitalUse, setCapitalUse] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function go(next: number) {
    setDir(next > step ? 1 : -1);
    setStep(next);
  }

  function canProceed() {
    switch (step) {
      case 0: return name.trim() && jobTitle.trim();
      case 1: return companyName.trim() && companyDesc.trim();
      case 2: return industry && stage && bizModel;
      case 3: return targetCustomer.trim() && primaryProblem.trim();
      case 4: return goals.length > 0;
      case 5: return location.trim();
      case 6: return true; // traction is optional
      case 7: return email.trim() && password.length >= 6;
      default: return true;
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError("");

    let token: string;

    if (isLoggedIn) {
      // Already authenticated — skip signUp, just save the profile
      token = session!.access_token;
    } else {
      // 1. Sign up
      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) {
        setError(authError.message);
        setSubmitting(false);
        return;
      }

      const t = authData.session?.access_token;
      if (!t) {
        setError("Signup succeeded but no session. Check email confirmation settings in Supabase.");
        setSubmitting(false);
        return;
      }
      token = t;
    }

    // 2. Save profile
    const profilePayload = {
      name,
      job_title: jobTitle,
      company_name: companyName,
      company_description: companyDesc,
      industry,
      stage,
      business_model: bizModel,
      target_customer: targetCustomer,
      primary_problem: primaryProblem,
      goals,
      specific_ask: specificAsk,
      location: location,
      traction_range: tractionRange || undefined,
      revenue_status: revenueStatus || undefined,
      fundraising_status: fundraisingStatus || undefined,
      capital_use: capitalUse,
    };

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profilePayload),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({ message: "Unknown error" }));
      console.error("Profile save failed:", res.status, body);
      setError(`Save failed (${res.status}): ${body.message || "Unknown error"}`);
      setSubmitting(false);
      return;
    }

    const savedProfile = await res.json();
    console.log("Profile saved successfully:", savedProfile);

    // Verify profile was saved successfully before redirecting
    const verifyRes = await fetch("/api/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!verifyRes.ok) {
      const verifyBody = await verifyRes.json().catch(() => ({ message: "Unknown" }));
      console.error("Profile verification failed:", verifyRes.status, verifyBody);
      setError(`Verification failed (${verifyRes.status}): ${verifyBody.message}. Try signing in again.`);
      setSubmitting(false);
      return;
    }

    const verifiedProfile = await verifyRes.json();
    console.log("Profile verified:", verifiedProfile);
    setLocation("/dashboard");
  }

  const allSteps = [
    // Step 0: Identity
    <div key="0" className="space-y-5">
      <StepHeader
        step={0}
        title="Let's start with you."
        subtitle="Who's building this?"
      />
      <Field label="Full name" value={name} onChange={setName} placeholder="Alex Chen" />
      <Field label="Job title" value={jobTitle} onChange={setJobTitle} placeholder="Co-founder & CEO" />
    </div>,

    // Step 1: Company
    <div key="1" className="space-y-5">
      <StepHeader
        step={1}
        title="Your company."
        subtitle="One-liner that captures it all."
      />
      <Field label="Company name" value={companyName} onChange={setCompanyName} placeholder="Acme Inc." />
      <Field
        label="What do you do? (130 chars)"
        value={companyDesc}
        onChange={setCompanyDesc}
        placeholder="AI-powered supply chain for Southeast Asian SMEs."
        maxLength={130}
        multiline
      />
    </div>,

    // Step 2: Category
    <div key="2" className="space-y-6">
      <StepHeader
        step={2}
        title="Category."
        subtitle="Help us understand where you play."
      />
      <div className="space-y-2">
        <p className="text-xs text-white/40 uppercase tracking-wider">Industry</p>
        <SinglePill
          options={["FinTech", "HealthTech", "AI/ML", "SaaS B2B", "Consumer", "Marketplace", "DeepTech", "Other"]}
          selected={industry}
          onSelect={setIndustry}
        />
      </div>
      <div className="space-y-2">
        <p className="text-xs text-white/40 uppercase tracking-wider">Stage</p>
        <SinglePill
          options={["Idea", "Pre-Product", "Pre-Revenue", "Early Revenue", "Scaling"]}
          selected={stage}
          onSelect={setStage}
        />
      </div>
      <div className="space-y-2">
        <p className="text-xs text-white/40 uppercase tracking-wider">Business model</p>
        <SinglePill
          options={["B2B", "B2C", "Marketplace", "SaaS", "D2C", "Other"]}
          selected={bizModel}
          onSelect={setBizModel}
        />
      </div>
    </div>,

    // Step 3: Clarity
    <div key="3" className="space-y-5">
      <StepHeader
        step={3}
        title="Precision."
        subtitle="Forced clarity — one sentence each."
      />
      <Field
        label="Who pays you?"
        value={targetCustomer}
        onChange={setTargetCustomer}
        placeholder="Mid-market logistics companies in India"
        multiline
      />
      <Field
        label="What problem do you solve?"
        value={primaryProblem}
        onChange={setPrimaryProblem}
        placeholder="Manual freight tracking causes 30% revenue leakage"
        multiline
      />
    </div>,

    // Step 4: Goals
    <div key="4" className="space-y-6">
      <StepHeader
        step={4}
        title="What do you need?"
        subtitle="Select everything that applies."
      />
      <div className="space-y-2">
        <p className="text-xs text-white/40 uppercase tracking-wider">Networking goals</p>
        <MultiPill
          options={["Investors", "Customers", "Co-founders", "Partners", "Enterprise Clients", "Mentors", "Talent"]}
          selected={goals}
          onToggle={v => setGoals(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])}
        />
      </div>
      <Field
        label="Specific ask (optional)"
        value={specificAsk}
        onChange={setSpecificAsk}
        placeholder="Looking for a Series A lead who knows SaaS B2B"
        multiline
      />
    </div>,

    // Step 5: Location
    <div key="5" className="space-y-5">
      <StepHeader
        step={5}
        title="Where are you based?"
        subtitle="We use this for geography-aware matching."
      />
      <Field label="Location" value={location} onChange={setLocation2} placeholder="Bangalore, India" />
    </div>,

    // Step 6: Traction
    <div key="6" className="space-y-6">
      <StepHeader
        step={6}
        title="Traction & fundraising."
        subtitle="The highest-signal data for your matches. All optional."
      />
      <div className="space-y-2">
        <p className="text-xs text-white/40 uppercase tracking-wider">Monthly users / customers</p>
        <SinglePill
          options={["0", "<100", "100-1k", "1k-10k", "10k+"]}
          selected={tractionRange}
          onSelect={setTractionRange}
        />
      </div>
      <div className="space-y-2">
        <p className="text-xs text-white/40 uppercase tracking-wider">Revenue status</p>
        <SinglePill
          options={["Pre-revenue", "Early revenue", "Scaling revenue"]}
          selected={revenueStatus}
          onSelect={setRevenueStatus}
        />
      </div>
      <div className="space-y-2">
        <p className="text-xs text-white/40 uppercase tracking-wider">Fundraising status</p>
        <SinglePill
          options={["Not raising", "Planning", "Actively raising", "Closed recently"]}
          selected={fundraisingStatus}
          onSelect={setFundraisingStatus}
        />
      </div>
      <div className="space-y-2">
        <p className="text-xs text-white/40 uppercase tracking-wider">Capital use (multi-select)</p>
        <MultiPill
          options={["Hiring", "Product", "Growth", "Ops", "Market expansion"]}
          selected={capitalUse}
          onToggle={v => setCapitalUse(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])}
        />
      </div>
    </div>,

    // Step 7: Account (only shown when NOT already logged in)
    <div key="7" className="space-y-5">
      <StepHeader
        step={7}
        title="Create your account."
        subtitle="This is where everything gets saved."
      />
      <Field label="Email" value={email} onChange={setEmail} type="email" placeholder="you@startup.com" />
      <Field label="Password" value={password} onChange={setPassword} type="password" placeholder="Min 6 characters" />
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>,
  ];

  // When logged in, skip the account-creation step
  const steps = isLoggedIn ? allSteps.slice(0, 7) : allSteps;

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-white/5 z-50">
        <motion.div
          className="h-full bg-white"
          animate={{ width: `${((step + 1) / EFFECTIVE_STEPS) * 100}%` }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between px-6 pt-8 pb-4">
        <button onClick={() => setLocation("/")} className="flex items-center gap-2">
          <img src="/logo.png" alt="Prodizzy" className="w-7 h-7 rounded-md" />
          <span className="text-white font-semibold tracking-tight">Prodizzy</span>
        </button>
        <span className="text-white/25 text-xs tabular-nums">
          {step + 1} / {EFFECTIVE_STEPS}
        </span>
      </div>

      {/* Step content */}
      <div className="flex-1 flex items-start justify-center px-6 pt-10 pb-32">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait" initial={false} custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={slideVariants(dir)}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {steps[step]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-gradient-to-t from-black via-black/90 to-transparent">
        {error && isLoggedIn && (
          <p className="max-w-lg mx-auto text-red-400 text-sm mb-3">{error}</p>
        )}
        <div className="max-w-lg mx-auto flex items-center gap-3">
          {step > 0 && (
            <button
              onClick={() => go(step - 1)}
              className="flex items-center justify-center w-11 h-11 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/25 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          {step < EFFECTIVE_STEPS - 1 ? (
            <button
              onClick={() => { if (canProceed()) go(step + 1); }}
              disabled={!canProceed()}
              className="flex-1 bg-white text-black font-semibold py-3 rounded-xl text-sm hover:bg-white/90 transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canProceed() || submitting}
              className="flex-1 bg-white text-black font-semibold py-3 rounded-xl text-sm hover:bg-white/90 transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
            >
              {submitting
                ? (isLoggedIn ? "Saving…" : "Creating your account…")
                : (isLoggedIn ? "Save & go to dashboard" : "Create account & go to dashboard")
              }
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Step header ───────────────────────────────────────────────────────────────
function StepHeader({ step, title, subtitle }: { step: number; title: string; subtitle: string }) {
  return (
    <div className="mb-8">
      <p className="text-xs text-white/25 uppercase tracking-widest mb-3">Step {step + 1}</p>
      <h1 className="text-3xl font-semibold text-white tracking-tight mb-2">{title}</h1>
      <p className="text-white/40 text-base">{subtitle}</p>
    </div>
  );
}
