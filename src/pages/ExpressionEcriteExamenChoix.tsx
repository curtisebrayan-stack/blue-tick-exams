import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ClipboardList, Mail, FileEdit, MessagesSquare, Clock, Sparkles, History } from "lucide-react";
import { Seo } from "@/components/Seo";
import { useAuth } from "@/lib/AuthContext";
import { AuthRequired } from "@/components/AuthRequired";
import { PremiumUpsell } from "@/components/PremiumUpsell";
import { getRemainingExams, MONTHLY_EXAM_QUOTA } from "@/lib/examQuota";

const MODES = [
  {
    to: "/expression-ecrite/examen/complet",
    icon: ClipboardList,
    title: "Examen complet",
    desc: "Les 3 tâches enchaînées, chronomètre global de 60 minutes — comme le jour J.",
    duration: "60 min",
    detail: "3 tâches",
  },
  {
    to: "/expression-ecrite/examen/tache-1",
    icon: Mail,
    title: "Tâche 1",
    desc: "Vous devez écrire un message simple (courriel, note) pour demander ou donner des informations, inviter, remercier, vous excuser, féliciter, etc.",
    duration: "12 min",
    detail: "60-120 mots",
  },
  {
    to: "/expression-ecrite/examen/tache-2",
    icon: FileEdit,
    title: "Tâche 2",
    desc: "Vous devez décrire une expérience ou un événement, raconter un fait ou un lieu, donner vos impressions sur une situation que vous avez vécue.",
    duration: "18 min",
    detail: "120-150 mots",
  },
  {
    to: "/expression-ecrite/examen/tache-3",
    icon: MessagesSquare,
    title: "Tâche 3",
    desc: "Vous devez exposer et défendre votre point de vue sur un sujet de société, sur l'environnement, sur une question d'actualité, etc.",
    duration: "30 min",
    detail: "120-180 mots",
  },
];

export default function ExpressionEcriteExamenChoix() {
  const { user, isPremium, isAdmin } = useAuth();
  const locked = !isPremium && !isAdmin;
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (!user || locked) return;
    let cancelled = false;
    getRemainingExams(user.id).then((n) => {
      if (!cancelled) setRemaining(n);
    });
    return () => {
      cancelled = true;
    };
  }, [user, locked]);

  const quotaReached = remaining === 0;

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
      <Seo title="Simulation d'expression écrite" description="Entraîne-toi en conditions d'examen : tâche isolée ou épreuve complète, avec chronomètre et clavier à accents." />
      <Link to="/expression-ecrite" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        <ArrowLeft className="h-4 w-4" /> Retour à l'épreuve
      </Link>

      <div className="mt-6 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">Simulation d'expression écrite — TCF Canada</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Entraîne-toi dans des conditions proches de l'examen officiel : chronomètre, clavier à accents,
          pas de correction automatique de saisie. Choisis une tâche isolée ou l'épreuve complète.
        </p>
      </div>

      {!user ? (
        <AuthRequired title="la simulation d'examen" />
      ) : locked ? (
        <PremiumUpsell title="la simulation d'examen" />
      ) : (
        <>
          {remaining !== null && (
            <div className={`mx-auto mt-8 flex max-w-md items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${quotaReached ? "bg-red-500/10 text-red-600" : "bg-primary/10 text-primary"}`}>
              <Sparkles className="h-4 w-4" />
              {quotaReached
                ? "Quota d'examens corrigés atteint pour ce mois-ci."
                : `Examens corrigés restants ce mois-ci : ${remaining}/${MONTHLY_EXAM_QUOTA}`}
            </div>
          )}
          {quotaReached && (
            <p className="mx-auto mt-2 max-w-md text-center text-xs text-muted-foreground">
              Le quota se réinitialise le 1er du mois prochain.
            </p>
          )}
          <div className="mt-4 flex justify-center">
            <Link to="/profil#redactions" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
              <History className="h-4 w-4" /> Mes examens précédents
            </Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MODES.map(({ to, icon: Icon, title, desc, duration, detail }) => {
              const cardClass = `card-shell flex flex-col gap-3 p-5 transition ${quotaReached ? "opacity-50" : "hover:-translate-y-0.5 hover:shadow-lg"}`;
              const cardContent = (
                <>
                  <span className="grid h-10 w-10 place-items-center rounded-lg" style={{ backgroundColor: "color-mix(in oklch, var(--ee) 18%, transparent)", color: "var(--ee)" }}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="font-display text-base font-bold">{title}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                  <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-xs font-semibold text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {duration}</span>
                    <span>{detail}</span>
                  </div>
                </>
              );
              return quotaReached ? (
                <div key={to} className={cardClass}>{cardContent}</div>
              ) : (
                <Link key={to} to={to} className={cardClass}>{cardContent}</Link>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
