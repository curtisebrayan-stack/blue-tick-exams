// Journal des connexions : sert à repérer un éventuel partage de compte entre
// apprenants (voir supabase-login-events.sql et la page admin /admin/connexions).

import { supabase } from "./supabase";

type GeoInfo = { ip: string | null; country: string | null; city: string | null };

async function lookupGeo(): Promise<GeoInfo> {
  try {
    const res = await fetch("https://ipwho.is/");
    const data = await res.json();
    if (!data?.success) return { ip: null, country: null, city: null };
    return { ip: data.ip ?? null, country: data.country ?? null, city: data.city ?? null };
  } catch {
    return { ip: null, country: null, city: null };
  }
}

export async function recordLoginEvent(userId: string, email: string): Promise<void> {
  const geo = await lookupGeo();
  await supabase.from("login_events").insert({
    user_id: userId,
    email,
    ip: geo.ip,
    country: geo.country,
    city: geo.city,
    device: navigator.userAgent.slice(0, 200),
  });
}
