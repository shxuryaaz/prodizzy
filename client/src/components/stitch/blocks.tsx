import type { ReactNode } from "react";

interface SurfaceCardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function SurfaceCard({ title, subtitle, children, className = "" }: SurfaceCardProps) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.03] p-6 ${className}`}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-white text-lg font-semibold">{title}</h3>}
          {subtitle && <p className="text-white/45 text-sm mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  center?: boolean;
}

export function SectionHeading({ eyebrow, title, description, center = false }: SectionHeadingProps) {
  return (
    <div className={center ? "text-center max-w-3xl mx-auto" : "max-w-3xl"}>
      {eyebrow && <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E63946] mb-3">{eyebrow}</p>}
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">{title}</h2>
      {description && <p className="text-white/45 text-base mt-3">{description}</p>}
    </div>
  );
}

interface TimelineStepProps {
  index: number;
  title: string;
  description: string;
}

export function TimelineStep({ index, title, description }: TimelineStepProps) {
  return (
    <div className="flex gap-4 items-start">
      <div className="w-10 h-10 rounded-full border border-[#E63946]/60 text-[#E63946] font-semibold text-sm flex items-center justify-center shrink-0">{index}</div>
      <div>
        <h4 className="text-white font-semibold">{title}</h4>
        <p className="text-white/45 text-sm mt-1 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

interface ObjectiveTileProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
}

export function ObjectiveTile({ title, subtitle, icon }: ObjectiveTileProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4 hover:border-[#E63946]/35 transition-colors">
      <div className="w-10 h-10 rounded-lg border border-[#E63946]/30 bg-[#E63946]/10 text-[#E63946] flex items-center justify-center mb-3">
        {icon}
      </div>
      <h4 className="text-white font-semibold">{title}</h4>
      <p className="text-white/45 text-xs mt-1">{subtitle}</p>
    </div>
  );
}
