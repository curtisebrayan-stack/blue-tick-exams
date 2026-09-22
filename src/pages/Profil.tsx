import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { UserCircle, ArrowRight, Mic, PenLine, Lock, CheckCircle2, Target, BarChart3 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/AuthContext";
import { SKILL_LABELS, type TcfSkill } from "@/lib/nclc";
import { Seo } from "@/components/Seo";

const NCLC_OPTIONS = [4, 5, 6, 7, 8, 9, 10];

type PracticeResult = {
  id: string;
  skill: TcfSkill;
  topic_slug: string;
  score: number;
  max_score: number;
  created_at: string;
};

type SpeakingSubmission = {
  id: string;
  topic_slug: string;
  storage_path: string;
  created_at: string;
  signedUrl?: string;
};

type WritingSubmission = {
  id: string;
  topic_slug: string;
  content: string;
  word_count: number;
  created_at: string;
};

const TOPIC_LABELS: Record<string, string> = {
  "petites-annonces": "Petites annonces",
  "annonces-publiques": "Annonces publiques",
  "messages-vocaux": "Messages vocaux",
  "conversations-informelles": "Conversations informelles",
  "interviews": "Interviews",
  "bulletins-information": "Bulletins d'information",
  "emissions-radio": "Émissions de radio",
  "articles-de-presse": "Articles de presse",
  "message-court": "Message court",
  "recit-personnel": "Récit personnel",
  "description-lieu": "Description d'un lieu",
  "opinion-argumentee": "Opinion argumentée",
  "comparaison-points-vue": "Comparaison de points de vue",
  "lettres-formelles": "Lettres formelles",
  "courriers-formels": "Courriers formels",
  "notices-et-modes-emploi": "Notices et modes d'emploi",
  "textes-opinion": "Textes d'opinion",
  "extraits-litteraires": "Extraits littéraires",
  "se-presenter": "Se présenter",
  "sujets-de-societe": "Sujets de société",
  "vie-quotidienne": "Vie quotidienne",
  "environnement": "Environnement",
  "technologies": "Technologies",
  "travail-et-etudes": "Travail et études",
};

export default function Profil() {
  const { user, updatePassword } = useAuth();
  const [results, setResults] = useState<PracticeResult[] | null>(null);
  const [recordings, setRecordings] = useState<SpeakingSubmission[] | null>(null);
  const [writings, setWritings] = useState<WritingSubmission[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [objectifNclc, setObjectifNclc] = useState<number | "">("");
  const [dateExamen, setDateExamen] = useState("");
  const [goalSaving, setGoalSaving] = useState(false);
  const [goalSaved, setGoalSaved] = useState(false);

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);
    if (newPassword.length < 6) {
      setPasswordError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Les deux mots de passe ne correspondent pas.");
      return;
    }
    setPasswordSaving(true);
    const { error: updateError } = await updatePassword(newPassword);
    setPasswordSaving(false);
    if (updateError) {
      setPasswordError(updateError);
      return;
    }
    setNewPassword("");
    setConfirmPassword("");
    setPasswordSuccess(true);
  };

  useEffect(() => {
    if (!user) return;
    supabase
      .from("practice_results")
      .select("id, skill, topic_slug, score, max_score, created_at")
      .order("created_at", { ascending: false })
      .then(({ data, error: fetchError }) => {
        if (fetchError) setError(fetchError.message);
        else setResults(data as PracticeResult[]);
      });

    supabase
      .from("speaking_submissions")
      .select("id, topic_slug, storage_path, created_at")
      .order("created_at", { ascending: false })
      .then(async ({ data, error: fetchError }) => {
        if (fetchError || !data) {
          setRecordings([]);
          return;
        }
        const withUrls = await Promise.all(
          data.map(async (r) => {
            const { data: signed } = await supabase.storage
              .from("eo-recordings")
              .createSignedUrl(r.storage_path, 3600);
            return { ...r, signedUrl: signed?.signedUrl };
          }),
        );
        setRecordings(withUrls);
      });

    supabase
      .from("writing_submissions")
      .select("id, topic_slug, content, word_count, created_at")
      .order("created_at", { ascending: false })
      .then(({ data, error: fetchError }) => {
        if (!fetchError && data) setWritings(data as WritingSubmission[]);
      });

    supabase
      .from("learner_goals")
      .select("objectif_nclc, date_examen")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setObjectifNclc(data.objectif_nclc ?? "");
          setDateExamen(data.date_examen ?? "");
        }
      });
  }, [user]);

  const handleSaveGoal = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setGoalSaving(true);
    setGoalSaved(false);
    const { error: goalError } = await supabase.from("learner_goals").upsert({
      id: user.id,
      objectif_nclc: objectifNclc === "" ? null : objectifNclc,
      date_examen: dateExamen === "" ? null : dateExamen,
      updated_at: new Date().toISOString(),
    });
    setGoalSaving(false);
    if (!goalError) setGoalSaved(true);
  };

  const skillAverages = useMemo(() => {
    if (!results) return [];
    const bySkill: Partial<Record<TcfSkill, { total: number; max: number; count: number }>> = {};
    for (const r of results) {
      const entry = bySkill[r.skill] ?? { total: 0, max: 0, count: 0 };
      entry.total += r.score;
      entry.max += r.max_score;
      entry.count += 1;
      bySkill[r.skill] = entry;
    }
    return (Object.entries(bySkill) as [TcfSkill, { total: number; max: number; count: number }][]).map(
      ([skill, { total, max, count }]) => ({
        skill,
        percent: max > 0 ? Math.round((total / max) * 100) : 0,
        count,
      }),
    );
  }, [results]);

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
      <Seo title="Ma progression" description="Ton historique de résultats aux sujets pratiques TCF Canada." />
      <span className="chip"><UserCircle className="h-3.5 w-3.5" /> Compte</span>
      <h1 className="mt-4 text-3xl font-bold sm:text-5xl">Ma progression</h1>
      <p className="mt-4 text-sm text-muted-foreground">{user?.email}</p>

      <div className="mt-10 card-shell p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <Target className="h-4 w-4 text-primary" /> Mon objectif
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">Le niveau que tu vises et la date prévue de ton examen TCF Canada.</p>
        <form onSubmit={handleSaveGoal} className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold">Objectif NCLC</span>
            <select
              value={objectifNclc}
              onChange={(e) => setObjectifNclc(e.target.value === "" ? "" : Number(e.target.value))}
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="">Non défini</option>
              {NCLC_OPTIONS.map((n) => (
                <option key={n} value={n}>{n === 10 ? "NCLC 10+" : `NCLC ${n}`}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Date prévue de l'examen</span>
            <input
              type="date"
              value={dateExamen}
              onChange={(e) => setDateExamen(e.target.value)}
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </label>
          {goalSaved && (
            <p className="flex items-center gap-1.5 text-sm text-green-500 sm:col-span-2">
              <CheckCircle2 className="h-4 w-4" /> Objectif enregistré.
            </p>
          )}
          <button type="submit" disabled={goalSaving} className="btn-primary sm:col-span-2 sm:w-fit disabled:opacity-60">
            {goalSaving ? "Enregistrement..." : "Enregistrer mon objectif"}
          </button>
        </form>
      </div>

      {skillAverages.length > 0 && (
        <div className="mt-10 card-shell p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <BarChart3 className="h-4 w-4 text-primary" /> Mes compétences
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Score moyen par épreuve, sur tes sujets déjà réalisés.</p>
          <div className="mt-4 space-y-4">
            {skillAverages.map(({ skill, percent, count }) => (
              <div key={skill}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">{SKILL_LABELS[skill]}</span>
                  <span className="text-muted-foreground">{percent}% · {count} sujet{count > 1 ? "s" : ""}</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 card-shell p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <Lock className="h-4 w-4 text-primary" /> Sécurité
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">Change ton mot de passe.</p>
        <form onSubmit={handlePasswordChange} className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold">Nouveau mot de passe</span>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">Confirmer le mot de passe</span>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </label>
          {passwordError && <p className="text-sm text-red-500 sm:col-span-2">{passwordError}</p>}
          {passwordSuccess && (
            <p className="flex items-center gap-1.5 text-sm text-green-500 sm:col-span-2">
              <CheckCircle2 className="h-4 w-4" /> Mot de passe mis à jour.
            </p>
          )}
          <button type="submit" disabled={passwordSaving} className="btn-primary sm:col-span-2 sm:w-fit disabled:opacity-60">
            {passwordSaving ? "Enregistrement..." : "Mettre à jour le mot de passe"}
          </button>
        </form>
      </div>

      <div className="mt-10">
        {error && <p className="text-sm text-red-500">{error}</p>}

        {results === null && !error && (
          <p className="text-sm text-muted-foreground">Chargement de tes résultats...</p>
        )}

        {results?.length === 0 && (
          <div className="card-shell p-6">
            <p className="text-sm text-muted-foreground">Tu n'as encore fait aucun sujet pratique.</p>
            <Link to="/comprehension-ecrite/petites-annonces" className="btn-primary mt-4 inline-flex">
              Commencer un sujet <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {results && results.length > 0 && (
          <div className="overflow-x-auto card-shell">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Épreuve</th>
                  <th className="px-4 py-3">Sujet</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.id} className="border-t border-border">
                    <td className="px-4 py-3">{SKILL_LABELS[r.skill]}</td>
                    <td className="px-4 py-3">{TOPIC_LABELS[r.topic_slug] ?? r.topic_slug}</td>
                    <td className="px-4 py-3 font-bold">{r.score} / {r.max_score}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(r.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {recordings && recordings.length > 0 && (
        <div className="mt-10">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Mic className="h-4 w-4 text-primary" /> Enregistrements Expression orale
          </h2>
          <div className="mt-4 space-y-3">
            {recordings.map((r) => (
              <div key={r.id} className="card-shell flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold">{TOPIC_LABELS[r.topic_slug] ?? r.topic_slug}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                </div>
                {r.signedUrl && <audio controls src={r.signedUrl} className="w-full sm:w-64" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {writings && writings.length > 0 && (
        <div className="mt-10">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <PenLine className="h-4 w-4 text-primary" /> Rédactions Expression écrite
          </h2>
          <div className="mt-4 space-y-3">
            {writings.map((w) => (
              <details key={w.id} className="card-shell p-4">
                <summary className="flex cursor-pointer items-center justify-between gap-2 text-sm font-semibold">
                  <span>{TOPIC_LABELS[w.topic_slug] ?? w.topic_slug}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {w.word_count} mots · {new Date(w.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                  </span>
                </summary>
                <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">{w.content}</p>
              </details>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
