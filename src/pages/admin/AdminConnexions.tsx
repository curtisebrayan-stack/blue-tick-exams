import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Seo } from "@/components/Seo";
import { AdminTabs } from "@/components/AdminTabs";
import { supabase } from "@/lib/supabase";

type LoginEvent = {
  id: string;
  email: string;
  ip: string | null;
  country: string | null;
  city: string | null;
  device: string | null;
  created_at: string;
};

// events triés du plus récent au plus ancien : si le même email change de pays
// en moins de 24h, c'est un signal probable de partage de compte.
function detectSuspicious(events: LoginEvent[]): Set<string> {
  const byEmail = new Map<string, LoginEvent[]>();
  for (const e of events) {
    if (!byEmail.has(e.email)) byEmail.set(e.email, []);
    byEmail.get(e.email)!.push(e);
  }

  const suspicious = new Set<string>();
  for (const list of byEmail.values()) {
    for (let i = 0; i < list.length - 1; i++) {
      const a = list[i];
      const b = list[i + 1];
      if (!a.country || !b.country || a.country === b.country) continue;
      const hoursApart = Math.abs(new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) / 3_600_000;
      if (hoursApart <= 24) {
        suspicious.add(a.id);
        suspicious.add(b.id);
      }
    }
  }
  return suspicious;
}

export default function AdminConnexions() {
  const [events, setEvents] = useState<LoginEvent[] | null>(null);

  useEffect(() => {
    supabase
      .from("login_events")
      .select("id, email, ip, country, city, device, created_at")
      .order("created_at", { ascending: false })
      .limit(300)
      .then(({ data }) => setEvents(data ?? []));
  }, []);

  const suspicious = events ? detectSuspicious(events) : new Set<string>();

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
      <Seo title="Connexions" description="Journal des connexions, pour repérer un éventuel partage de compte." />
      <AdminTabs />
      <h1 className="mt-6 text-2xl font-bold sm:text-3xl">Connexions récentes</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Les lignes surlignées correspondent à un même compte connecté depuis deux pays différents en moins de 24h —
        un signal possible de partage de compte, à vérifier au cas par cas (un apprenant en déplacement ou derrière
        un VPN peut aussi déclencher ce signal).
      </p>

      {events === null ? (
        <p className="mt-8 text-sm text-muted-foreground">Chargement...</p>
      ) : events.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">Aucune connexion enregistrée pour le moment.</p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                <th className="py-2 pr-4">Compte</th>
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Pays / ville</th>
                <th className="py-2 pr-4">IP</th>
                <th className="py-2">Appareil</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr
                  key={e.id}
                  className={`border-b border-border/60 align-top ${suspicious.has(e.id) ? "bg-red-50" : ""}`}
                >
                  <td className="py-2 pr-4 font-medium">
                    {suspicious.has(e.id) && <AlertTriangle className="mr-1 inline h-3.5 w-3.5 text-red-600" />}
                    {e.email}
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">{new Date(e.created_at).toLocaleString("fr-FR")}</td>
                  <td className="py-2 pr-4 text-muted-foreground">
                    {[e.city, e.country].filter(Boolean).join(", ") || "—"}
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">{e.ip ?? "—"}</td>
                  <td className="max-w-xs truncate py-2 text-muted-foreground" title={e.device ?? undefined}>
                    {e.device ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
