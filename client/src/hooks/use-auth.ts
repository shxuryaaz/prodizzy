import { useState, useEffect, useCallback } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSession = useCallback(async () => {
    const { data, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      setError(sessionError.message);
    }
    setSession(data.session);
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      // Handle different auth events
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        setSession(null);
        setError(null);
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setSession(s);
        setError(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [refreshSession]);

  return { session, user: session?.user ?? null, loading, error, refreshSession };
}
