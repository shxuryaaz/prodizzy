import { useState } from "react";
import { useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { ChevronLeft } from "lucide-react";

const TOTAL_STEPS = 6;

function slideVariants(dir: number) {
  return {
    initial: { x: dir > 0 ? "60px" : "-60px", opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
    exit: { x: dir > 0 ? "-60px" : "60px", opacity: 0, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } },
  };
}

function StepHeader({ step, title, subtitle }: { step: number; title: string; subtitle: string }) {
  return (
    <div className="mb-8">
      <p className="text-xs text-white/25 uppercase tracking-widest mb-3">Step {step + 1}</p>
      <h1 className="text-3xl font-semibold text-white tracking-tight mb-2">{title}</h1>
      <p className="text-white/40 text-base">{subtitle}</p>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", multiline }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; multiline?: boolean;
}) {
  const base = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-white/30 transition-colors resize-none";
  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-white/40 uppercase tracking-wider">{label}</label>
      {multiline
        ? <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={base} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={base} />
      }
    </div>
  );
}

function SinglePill({ options, selected, onSelect }: { options: string[]; selected: string; onSelect: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => (
        <button key={o} type="button" onClick={() => onSelect(o)}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${selected === o ? "bg-white text-black border-white" : "bg-transparent text-white/60 border-white/15 hover:border-white/40 hover:text-white/80"}`}>
          {o}
        </button>
      ))}
    </div>
  );
}

function MultiPill({ options, selected, onToggle }: { options: string[]; selected: string[]; onToggle: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => (
        <button key={o} type="button" onClick={() => onToggle(o)}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${selected.includes(o) ? "bg-white text-black border-white" : "bg-transparent text-white/60 border-white/15 hover:border-white/40 hover:text-white/80"}`}>
          {o}
        </button>
      ))}
    </div>
  );
}

export default function PartnerOnboard() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Basic Details
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  // Step 2: Partner Type
  const [partnerType, setPartnerType] = useState("");

  // Step 3: Offerings
  const [servicesOffered, setServicesOffered] = useState<string[]>([]);
  const [industriesServed, setIndustriesServed] = useState<string[]>([]);
  const [stagesServed, setStagesServed] = useState<string[]>([]);
  const [pricingModel, setPricingModel] = useState("");
  const [averageDealSize, setAverageDealSize] = useState("");

  // Step 4: Capability
  const [teamSize, setTeamSize] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [toolsTechStack, setToolsTechStack] = useState("");
  const [workMode, setWorkMode] = useState("");

  // Step 5: Proof
  const [portfolioLinks, setPortfolioLinks] = useState("");
  const [caseStudies, setCaseStudies] = useState("");
  const [pastClients, setPastClients] = useState("");
  const [certifications, setCertifications] = useState("");

  // Step 6: Intent + Account
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [monthlyCapacity, setMonthlyCapacity] = useState("");
  const [preferredBudgetRange, setPreferredBudgetRange] = useState("");
  const [password, setPassword] = useState("");

  function go(next: number) { setDir(next > step ? 1 : -1); setStep(next); }

  function canProceed() {
    switch (step) {
      case 0: return fullName.trim() && companyName.trim() && email.trim() && phone.trim();
      case 1: return partnerType;
      case 2: return servicesOffered.length > 0 && industriesServed.length > 0 && stagesServed.length > 0;
      case 3: return teamSize && yearsExperience && workMode;
      case 4: return true; // Proof section is optional
      case 5: return lookingFor.length > 0 && password.length >= 6;
      default: return true;
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError("");

    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) { setError(authError.message); setSubmitting(false); return; }

    const token = authData.session?.access_token;
    if (!token) { setError("Signup succeeded but no session. Check email confirmation settings in Supabase."); setSubmitting(false); return; }

    const res = await fetch("/api/partner", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        full_name: fullName,
        company_name: companyName,
        email,
        phone,
        website: website || undefined,
        linkedin_url: linkedinUrl || undefined,
        partner_type: partnerType,
        services_offered: servicesOffered,
        industries_served: industriesServed,
        stages_served: stagesServed,
        pricing_model: pricingModel || undefined,
        average_deal_size: averageDealSize || undefined,
        team_size: teamSize,
        years_experience: yearsExperience,
        tools_tech_stack: toolsTechStack || undefined,
        work_mode: workMode,
        portfolio_links: portfolioLinks || undefined,
        case_studies: caseStudies || undefined,
        past_clients: pastClients || undefined,
        certifications: certifications || undefined,
        looking_for: lookingFor,
        monthly_capacity: monthlyCapacity || undefined,
        preferred_budget_range: preferredBudgetRange || undefined,
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({ message: "Unknown error" }));
      setError(body.message || "Failed to save profile");
      setSubmitting(false);
      return;
    }

    setLocation("/dashboard");
  }

  const steps = [
    <div key="0" className="space-y-5">
      <StepHeader step={0} title="Basic details" subtitle="Tell us about your organization" />
      <Field label="Full name" value={fullName} onChange={setFullName} placeholder="John Doe" />
      <Field label="Company name" value={companyName} onChange={setCompanyName} placeholder="Acme Agency" />
      <Field label="Email" value={email} onChange={setEmail} type="email" placeholder="you@company.com" />
      <Field label="Phone" value={phone} onChange={setPhone} placeholder="+1 234 567 8900" />
      <Field label="Website (optional)" value={website} onChange={setWebsite} placeholder="https://acme.com" />
      <Field label="LinkedIn URL (optional)" value={linkedinUrl} onChange={setLinkedinUrl} placeholder="https://linkedin.com/in/..." />
    </div>,

    <div key="1" className="space-y-6">
      <StepHeader step={1} title="Partner type" subtitle="What best describes your organization?" />
      <div className="space-y-2">
        <p className="text-xs text-white/40 uppercase tracking-wider">Type</p>
        <SinglePill options={["Agency", "Investor", "Service Provider", "Institutional Firm"]} selected={partnerType} onSelect={setPartnerType} />
      </div>
    </div>,

    <div key="2" className="space-y-6">
      <StepHeader step={2} title="Your offerings" subtitle="What services do you provide?" />
      <div className="space-y-2">
        <p className="text-xs text-white/40 uppercase tracking-wider">Services offered</p>
        <MultiPill options={["Development", "Design", "Marketing", "Sales", "Operations", "Funding", "Consulting", "Other"]} selected={servicesOffered}
          onToggle={v => setServicesOffered(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v])} />
      </div>
      <div className="space-y-2">
        <p className="text-xs text-white/40 uppercase tracking-wider">Industries you serve</p>
        <MultiPill options={["FinTech", "HealthTech", "AI/ML", "SaaS B2B", "Consumer", "Marketplace", "DeepTech", "Other"]} selected={industriesServed}
          onToggle={v => setIndustriesServed(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v])} />
      </div>
      <div className="space-y-2">
        <p className="text-xs text-white/40 uppercase tracking-wider">Stages you work with</p>
        <MultiPill options={["Idea", "Pre-Product", "Pre-Revenue", "Early Revenue", "Scaling"]} selected={stagesServed}
          onToggle={v => setStagesServed(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v])} />
      </div>
      <Field label="Pricing model (optional)" value={pricingModel} onChange={setPricingModel} placeholder="Fixed, Hourly, Commission, Retainer" />
      <Field label="Average deal size (optional)" value={averageDealSize} onChange={setAverageDealSize} placeholder="$5K-$50K" />
    </div>,

    <div key="3" className="space-y-6">
      <StepHeader step={3} title="Your capability" subtitle="What's your team and experience?" />
      <div className="space-y-2">
        <p className="text-xs text-white/40 uppercase tracking-wider">Team size</p>
        <SinglePill options={["Solo", "2-10", "11-50", "51-100", "100+"]} selected={teamSize} onSelect={setTeamSize} />
      </div>
      <div className="space-y-2">
        <p className="text-xs text-white/40 uppercase tracking-wider">Years of experience</p>
        <SinglePill options={["<1 year", "1-3 years", "3-5 years", "5-10 years", "10+ years"]} selected={yearsExperience} onSelect={setYearsExperience} />
      </div>
      <Field label="Tools / Tech stack (optional)" value={toolsTechStack} onChange={setToolsTechStack} placeholder="React, Figma, Notion..." multiline />
      <div className="space-y-2">
        <p className="text-xs text-white/40 uppercase tracking-wider">Work mode</p>
        <SinglePill options={["Remote", "Hybrid", "Onsite"]} selected={workMode} onSelect={setWorkMode} />
      </div>
    </div>,

    <div key="4" className="space-y-5">
      <StepHeader step={4} title="Proof of work" subtitle="Help startups trust you" />
      <Field label="Portfolio links (optional)" value={portfolioLinks} onChange={setPortfolioLinks} placeholder="https://..." multiline />
      <Field label="Case studies (optional)" value={caseStudies} onChange={setCaseStudies} placeholder="Describe your best work..." multiline />
      <Field label="Past clients (optional)" value={pastClients} onChange={setPastClients} placeholder="Company A, Company B..." multiline />
      <Field label="Certifications (optional)" value={certifications} onChange={setCertifications} placeholder="AWS Certified, Google Partner..." multiline />
    </div>,

    <div key="5" className="space-y-6">
      <StepHeader step={5} title="What are you looking for?" subtitle="Create your account and set preferences" />
      <div className="space-y-2">
        <p className="text-xs text-white/40 uppercase tracking-wider">Looking for</p>
        <MultiPill options={["Clients", "Deal flow", "Partnerships"]} selected={lookingFor}
          onToggle={v => setLookingFor(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v])} />
      </div>
      <Field label="Monthly capacity (optional)" value={monthlyCapacity} onChange={setMonthlyCapacity} placeholder="2-3 new clients" />
      <Field label="Preferred budget range (optional)" value={preferredBudgetRange} onChange={setPreferredBudgetRange} placeholder="$10K-$100K" />
      <Field label="Password" value={password} onChange={setPassword} type="password" placeholder="Min 6 characters" />
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>,
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Progress */}
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-white/5 z-50">
        <motion.div className="h-full bg-white" animate={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} />
      </div>

      <div className="flex items-center justify-between px-6 pt-8 pb-4">
        <button onClick={() => setLocation("/")} className="flex items-center gap-2">
          <img src="/logo.png" alt="Prodizzy" className="w-7 h-7 rounded-md" />
          <span className="text-white font-semibold tracking-tight">Prodizzy</span>
        </button>
        <span className="text-white/25 text-xs tabular-nums">{step + 1} / {TOTAL_STEPS}</span>
      </div>

      <div className="flex-1 flex items-start justify-center px-6 pt-10 pb-32">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait" initial={false} custom={dir}>
            <motion.div key={step} custom={dir} variants={slideVariants(dir)} initial="initial" animate="animate" exit="exit">
              {steps[step]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-gradient-to-t from-black via-black/90 to-transparent">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          {step > 0 && (
            <button onClick={() => go(step - 1)} className="flex items-center justify-center w-11 h-11 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/25 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          {step < TOTAL_STEPS - 1 ? (
            <button onClick={() => { if (canProceed()) go(step + 1); }} disabled={!canProceed()}
              className="flex-1 bg-white text-black font-semibold py-3 rounded-xl text-sm hover:bg-white/90 transition-colors disabled:opacity-25 disabled:cursor-not-allowed">
              Continue
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={!canProceed() || submitting}
              className="flex-1 bg-white text-black font-semibold py-3 rounded-xl text-sm hover:bg-white/90 transition-colors disabled:opacity-25 disabled:cursor-not-allowed">
              {submitting ? "Creating account…" : "Create account"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
