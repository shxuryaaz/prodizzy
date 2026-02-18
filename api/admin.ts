import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

function isAdmin(email: string | undefined): boolean {
  if (!email) return false;
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .includes(email.toLowerCase());
}

function serviceClient() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const token = req.headers.authorization?.slice(7);
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const authClient = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
  const { data: { user } } = await authClient.auth.getUser(token);
  if (!user) return res.status(401).json({ message: "Unauthorized" });
  if (!isAdmin(user.email)) return res.status(403).json({ message: "Forbidden" });

  const supabase = serviceClient();

  // GET /api/admin — list all profiles (unapproved first)
  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("startup_profiles")
      .select("*")
      .order("approved", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ message: error.message });
    return res.json(data);
  }

  // PATCH /api/admin?id=<profile_id> — approve or reject
  if (req.method === "PATCH") {
    const profileId = req.query.id as string;
    if (!profileId) return res.status(400).json({ message: "Profile id required" });

    const { approved } = req.body as { approved: boolean };
    if (typeof approved !== "boolean") return res.status(400).json({ message: "approved (boolean) required" });

    const { data, error } = await supabase
      .from("startup_profiles")
      .update({ approved })
      .eq("id", profileId)
      .select()
      .single();

    if (error) return res.status(500).json({ message: error.message });
    return res.json(data);
  }

  return res.status(405).json({ message: "Method not allowed" });
}
