import { supabase } from "./supabase";

// Suivi minimal auto-hébergé (pas de service tiers) : chaque événement va dans la table
// analytics_events sur Supabase. Volontairement silencieux en cas d'échec — un problème
// d'analytics ne doit jamais casser l'expérience utilisateur.
export function trackEvent(eventType: string, path?: string) {
  void supabase
    .from("analytics_events")
    .insert({ event_type: eventType, path: path ?? window.location.pathname })
    .then(() => {});
}
