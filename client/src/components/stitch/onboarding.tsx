import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";

export function OnboardingShell({
  children,
  step,
  totalSteps,
  onBackHome,
  footer,
}: {
  children: ReactNode;
  step: number;
  totalSteps: number;
  onBackHome: () => void;
  footer: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-white/5 z-50">
        <div className="h-full bg-[#E63946] transition-all duration-300" style={{ width: `${((step + 1) / totalSteps) * 100}%` }} />
      </div>
      <div className="flex items-center justify-between px-6 pt-8 pb-4">
        <button onClick={onBackHome} className="flex items-center gap-2">
          <img src="/logo.png" alt="Prodizzy" className="w-7 h-7 rounded-md" />
          <span className="text-white font-semibold tracking-tight">Prodizzy</span>
        </button>
        <span className="text-white/25 text-xs tabular-nums">{step + 1} / {totalSteps}</span>
      </div>
      <div className="flex-1 flex items-start justify-center px-6 pt-10 pb-32">
        <div className="w-full max-w-xl">{children}</div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 px-6 pb-8 pt-4 bg-gradient-to-t from-black via-black/95 to-transparent">
        <div className="max-w-xl mx-auto">{footer}</div>
      </div>
    </div>
  );
}

export function OnboardingBackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center w-11 h-11 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/25 transition-colors"
    >
      <ChevronLeft className="w-5 h-5" />
    </button>
  );
}

export function StepTitle({ step, title, subtitle }: { step: number; title: string; subtitle: string }) {
  return (
    <div className="mb-8">
      <p className="text-xs text-[#E63946]/70 uppercase tracking-[0.18em] mb-3">Step {step + 1}</p>
      <h1 className="text-3xl font-semibold text-white tracking-tight mb-2">{title}</h1>
      <p className="text-white/45 text-base">{subtitle}</p>
    </div>
  );
}
