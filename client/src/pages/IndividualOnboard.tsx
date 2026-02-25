import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
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

export default function IndividualOnboard() {
  const { session } = useAuth();
  const qc = useQueryClient();
  const isLoggedIn = !!session;
  // When already logged in, skip the account-creation step (step 5)
  const EFFECTIVE_STEPS = isLoggedIn ? TOTAL_STEPS - 1 : TOTAL_STEPS;

  const [, setLocation] = useLocation();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Basic Details
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");

  // Step 2: Profile Type
  const [profileType, setProfileType] = useState("");

  // Step 3: Skills
  const [skills, setSkills] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState("");
  const [toolsUsed, setToolsUsed] = useState("");

  // Step 4: Looking For
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [preferredRoles, setPreferredRoles] = useState("");
  const [preferredIndustries, setPreferredIndustries] = useState("");

  // Step 5: Availability
  const [availability, setAvailability] = useState("");
  const [workMode, setWorkMode] = useState("");
  const [expectedPay, setExpectedPay] = useState("");
  const [userLocation, setUserLocation] = useState("");

  // Step 6: Proof + Account
  const [resumeUrl, setResumeUrl] = useState("");
  const [projects, setProjects] = useState("");
  const [achievements, setAchievements] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [password, setPassword] = useState("");

  // If already logged in with a completed profile, send to dashboard
  const { data: existingProfile } = useQuery({
    queryKey: ["individual-profile"],
    queryFn: async () => {
      if (!session?.access_token) return null;
      const r = await fetch("/api/individual", {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
      });
      if (r.status === 404) return null;
      if (!r.ok) throw new Error("Failed to fetch profile");
      return r.json();
    },
    enabled: !!session,
  });
  useEffect(() => {
    if (existingProfile?.onboarding_completed) {
      setLocation("/dashboard");
    }
  }, [existingProfile, setLocation]);

  // Auto-fill email from session for authenticated users
  useEffect(() => {
    if (session?.user?.email && !email) {
      setEmail(session.user.email);
    }
  }, [session, email]);

  function go(next: number) { setDir(next > step ? 1 : -1); setStep(next); }

  function canProceed() {
    switch (step) {
      case 0: return fullName.trim() && email.trim() && phone.trim();
      case 1: return profileType;
      case 2: return skills.length > 0 && experienceLevel;
      case 3: return lookingFor.length > 0;
      case 4: return availability && workMode && userLocation;
      case 5: return password.length >= 6;
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
      // Sign up with email/password
      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) { setError(authError.message); setSubmitting(false); return; }

      const t = authData.session?.access_token;
      if (!t) { setError("Signup succeeded but no session. Check email confirmation settings in Supabase."); setSubmitting(false); return; }
      token = t;
    }

    const res = await fetch("/api/individual", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        full_name: fullName,
        email,
        phone,
        linkedin_url: linkedinUrl || undefined,
        portfolio_url: portfolioUrl || undefined,
        profile_type: profileType,
        skills,
        experience_level: experienceLevel,
        tools_used: toolsUsed || undefined,
        looking_for: lookingFor,
        preferred_roles: preferredRoles || undefined,
        preferred_industries: preferredIndustries || undefined,
        availability,
        work_mode: workMode,
        expected_pay: expectedPay || undefined,
        location: userLocation,
        resume_url: resumeUrl || undefined,
        projects: projects || undefined,
        achievements: achievements || undefined,
        github_url: githubUrl || undefined,
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({ message: "Unknown error" }));
      setError(body.message || "Failed to save profile");
      setSubmitting(false);
      return;
    }

    const savedProfile = await res.json();
    console.log("Individual profile saved successfully:", savedProfile);

    // Verify profile was saved successfully before redirecting
    const verifyRes = await fetch("/api/individual", {
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
    console.log("Individual profile verified:", verifiedProfile);
    // Seed the profile cache so Dashboard sees the profile immediately
    qc.setQueryData(["individual-profile"], verifiedProfile);
    setLocation("/dashboard");
  }

  const steps = [
    <div key="0" className="space-y-5">
      <StepHeader step={0} title="Basic details" subtitle="Tell us about yourself" />
      <Field label="Full name" value={fullName} onChange={setFullName} placeholder="Jane Smith" />
      <Field label="Email" value={email} onChange={setEmail} type="email" placeholder="you@email.com" />
      <Field label="Phone" value={phone} onChange={setPhone} placeholder="+1 234 567 8900" />
      <Field label="LinkedIn URL (optional)" value={linkedinUrl} onChange={setLinkedinUrl} placeholder="https://linkedin.com/in/..." />
      <Field label="Portfolio URL (optional)" value={portfolioUrl} onChange={setPortfolioUrl} placeholder="https://yoursite.com" />
    </div>,

    <div key="1" className="space-y-6">
      <StepHeader step={1} title="Profile type" subtitle="What best describes you?" />
      <div className="space-y-2">
        <p className="text-xs text-white/40 uppercase tracking-wider">Type</p>
        <SinglePill options={["Student", "Freelancer", "Professional", "Content Creator", "Community Admin"]} selected={profileType} onSelect={setProfileType} />
      </div>
    </div>,

    <div key="2" className="space-y-6">
      <StepHeader step={2} title="Your skills" subtitle="What are you good at?" />
      <div className="space-y-2">
        <p className="text-xs text-white/40 uppercase tracking-wider">Skills</p>
        <MultiPill options={["Design", "Development", "Marketing", "Sales", "Writing", "Video Editing", "Community", "Operations"]} selected={skills}
          onToggle={v => setSkills(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v])} />
      </div>
      <div className="space-y-2">
        <p className="text-xs text-white/40 uppercase tracking-wider">Experience level</p>
        <SinglePill options={["Fresher", "0-2 years", "2-4 years", "4+ years"]} selected={experienceLevel} onSelect={setExperienceLevel} />
      </div>
      <Field label="Tools you use (optional)" value={toolsUsed} onChange={setToolsUsed} placeholder="Figma, Photoshop, React..." multiline />
    </div>,

    <div key="3" className="space-y-6">
      <StepHeader step={3} title="What are you looking for?" subtitle="Define your ideal opportunity" />
      <div className="space-y-2">
        <p className="text-xs text-white/40 uppercase tracking-wider">Looking for</p>
        <MultiPill options={["Job", "Internship", "Freelance", "Collaboration"]} selected={lookingFor}
          onToggle={v => setLookingFor(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v])} />
      </div>
      <Field label="Preferred roles (optional)" value={preferredRoles} onChange={setPreferredRoles} placeholder="Product Designer, Frontend Developer..." multiline />
      <Field label="Preferred industries (optional)" value={preferredIndustries} onChange={setPreferredIndustries} placeholder="FinTech, HealthTech..." multiline />
    </div>,

    <div key="4" className="space-y-6">
      <StepHeader step={4} title="Your availability" subtitle="Work preferences and location" />
      <div className="space-y-2">
        <p className="text-xs text-white/40 uppercase tracking-wider">Availability</p>
        <SinglePill options={["Full-time", "Part-time", "Project-based"]} selected={availability} onSelect={setAvailability} />
      </div>
      <div className="space-y-2">
        <p className="text-xs text-white/40 uppercase tracking-wider">Work mode</p>
        <SinglePill options={["Remote", "Hybrid", "Onsite"]} selected={workMode} onSelect={setWorkMode} />
      </div>
      <Field label="Expected pay (optional)" value={expectedPay} onChange={setExpectedPay} placeholder="$50K-$80K or $50/hr" />
      <Field label="Location" value={userLocation} onChange={setUserLocation} placeholder="San Francisco, CA" />
    </div>,

    <div key="5" className="space-y-5">
      <StepHeader step={5} title="Proof of work" subtitle="Showcase your experience and create account" />
      <Field label="Resume URL (optional)" value={resumeUrl} onChange={setResumeUrl} placeholder="https://drive.google.com/..." />
      <Field label="Projects (optional)" value={projects} onChange={setProjects} placeholder="Describe your best projects..." multiline />
      <Field label="Achievements (optional)" value={achievements} onChange={setAchievements} placeholder="Awards, certifications..." multiline />
      <Field label="GitHub URL (optional)" value={githubUrl} onChange={setGithubUrl} placeholder="https://github.com/..." />
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
