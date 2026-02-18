import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { LogOut, Check, X, ChevronDown, ChevronUp } from "lucide-react";
import type { StartupProfile } from "@shared/schema";

function authHeaders(token: string) {
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

function Tag({ label }: { label: string }) {
  return <span className="px-2 py-0.5 rounded-full text-xs border bg-white/5 text-white/50 border-white/10">{label}</span>;
}

function ProfileRow({ profile, token }: { profile: StartupProfile; token: string }) {
  const [expanded, setExpanded] = useState(false);
  const qc = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: (approved: boolean) => fetch(`/api/admin?id=${profile.id}`, {
      method: "PATCH",
      headers: authHeaders(token),
      body: JSON.stringify({ approved }),
    }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-profiles"] }),
  });

  return (
    <div className={`border rounded-xl transition-colors ${profile.approved ? "border-green-500/20 bg-green-500/5" : "border-white/8 bg-white/[0.02]"}`}>
      <div className="px-5 py-4 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white font-medium text-sm">{profile.company_name}</span>
            <Tag label={profile.industry} />
            <Tag label={profile.stage} />
            {profile.approved
              ? <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/15 text-green-400 border border-green-500/20">Approved</span>
              : <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-500/15 text-yellow-400 border border-yellow-500/20">Pending</span>
            }
          </div>
          <p className="text-white/35 text-xs mt-0.5 truncate">{profile.name} · {profile.email} · {profile.job_title}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!profile.approved ? (
            <button onClick={() => approveMutation.mutate(true)} disabled={approveMutation.isPending}
              className="flex items-center gap-1 bg-green-500/15 text-green-400 border border-green-500/20 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-500/25 transition-colors disabled:opacity-50">
              <Check className="w-3 h-3" /> Approve
            </button>
          ) : (
            <button onClick={() => approveMutation.mutate(false)} disabled={approveMutation.isPending}
              className="flex items-center gap-1 bg-red-500/15 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-500/25 transition-colors disabled:opacity-50">
              <X className="w-3 h-3" /> Revoke
            </button>
          )}
          <button onClick={() => setExpanded(e => !e)} className="text-white/30 hover:text-white/60 transition-colors p-1">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }} className="overflow-hidden">
            <div className="px-5 pb-5 border-t border-white/6 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-white/30 uppercase tracking-wider mb-1">One-liner</p>
                <p className="text-white/65">{profile.company_description}</p>
              </div>
              <div>
                <p className="text-xs text-white/30 uppercase tracking-wider mb-1">Business model</p>
                <p className="text-white/65">{profile.business_model}</p>
              </div>
              <div>
                <p className="text-xs text-white/30 uppercase tracking-wider mb-1">Who pays them</p>
                <p className="text-white/65">{profile.target_customer}</p>
              </div>
              <div>
                <p className="text-xs text-white/30 uppercase tracking-wider mb-1">Problem they solve</p>
                <p className="text-white/65">{profile.primary_problem}</p>
              </div>
              <div>
                <p className="text-xs text-white/30 uppercase tracking-wider mb-1">Goals</p>
                <p className="text-white/65">{profile.goals?.join(", ")}</p>
              </div>
              <div>
                <p className="text-xs text-white/30 uppercase tracking-wider mb-1">Location</p>
                <p className="text-white/65">{profile.location}</p>
              </div>
              {profile.traction_range && (
                <div>
                  <p className="text-xs text-white/30 uppercase tracking-wider mb-1">Traction</p>
                  <p className="text-white/65">{profile.traction_range} users · {profile.revenue_status} · {profile.fundraising_status}</p>
                </div>
              )}
              {profile.specific_ask && (
                <div>
                  <p className="text-xs text-white/30 uppercase tracking-wider mb-1">Specific ask</p>
                  <p className="text-white/65">{profile.specific_ask}</p>
                </div>
              )}
              {/* Contact info — visible to admin only */}
              <div className="sm:col-span-2 pt-2 border-t border-white/6">
                <p className="text-xs text-white/30 uppercase tracking-wider mb-2">Contact (admin only)</p>
                <div className="flex flex-wrap gap-4 text-xs text-white/50">
                  <span>Email: <span className="text-white/75">{profile.email}</span></span>
                  {profile.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">LinkedIn</a>}
                  {profile.deck_link && <a href={profile.deck_link} target="_blank" rel="noreferrer" className="text-white/75 hover:underline">Deck</a>}
                  {profile.website && <a href={profile.website} target="_blank" rel="noreferrer" className="text-white/75 hover:underline">Website</a>}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Admin() {
  const { session } = useAuth();
  const [, setLocation] = useLocation();

  const { data: profiles, isLoading, error } = useQuery<StartupProfile[]>({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const r = await fetch("/api/admin", { headers: authHeaders(session!.access_token) });
      if (r.status === 403) throw new Error("forbidden");
      if (!r.ok) throw new Error("Failed to load");
      return r.json();
    },
    enabled: !!session,
    retry: false,
  });

  async function signOut() {
    await supabase.auth.signOut();
    setLocation("/");
  }

  if (error && (error as Error).message === "forbidden") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white/40 text-sm">
        Access denied.
      </div>
    );
  }

  const pending = profiles?.filter(p => !p.approved) ?? [];
  const approved = profiles?.filter(p => p.approved) ?? [];

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Prodizzy" className="w-7 h-7 rounded-md" />
            <span className="font-semibold tracking-tight">Admin</span>
          </div>
          <button onClick={signOut} className="flex items-center gap-1.5 text-white/35 hover:text-white/70 transition-colors text-sm">
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: "Total profiles", value: profiles?.length ?? "—" },
            { label: "Pending approval", value: pending.length || "—" },
            { label: "Approved", value: approved.length || "—" },
          ].map(s => (
            <div key={s.label} className="bg-white/[0.03] border border-white/8 rounded-xl p-4">
              <div className="text-2xl font-bold tabular-nums">{s.value}</div>
              <div className="text-xs text-white/35 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-white/10 border-t-white/50 rounded-full animate-spin" />
          </div>
        )}

        {/* Pending */}
        {pending.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-white/50 uppercase tracking-wider">Pending approval ({pending.length})</h2>
            {pending.map(p => <ProfileRow key={p.id} profile={p} token={session!.access_token} />)}
          </div>
        )}

        {/* Approved */}
        {approved.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-white/50 uppercase tracking-wider">Approved ({approved.length})</h2>
            {approved.map(p => <ProfileRow key={p.id} profile={p} token={session!.access_token} />)}
          </div>
        )}

        {profiles?.length === 0 && !isLoading && (
          <div className="text-center py-12 text-white/30">No profiles yet.</div>
        )}
      </div>
    </div>
  );
}
