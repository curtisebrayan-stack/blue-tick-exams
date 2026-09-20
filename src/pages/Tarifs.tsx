import { Link } from "react-router-dom";
import { Check, Info, Clock } from "lucide-react";
import { PLANS } from "@/lib/pricing";
import { Seo } from "@/components/Seo";

export default function Tarifs() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <Seo title="Tarifs" description="Les formules d'abonnement pour accéder à l'ensemble des sujets et méthodologies TCF Canada." />
      <span className="chip">Abonnements</span>
      <h1 className="mt-4 text-3xl font-bold sm:text-5xl">Choisis ton <span className="text-primary">parcours</span></h1>
      <p className="mt-4 max-w-2xl text-base text-muted-foreground">
        Commence gratuitement, passe en Premium quand tu es prêt à t'entraîner sans limite.
      </p>

      <div className="mt-6 flex items-start gap-2 rounded-xl bg-primary/5 p-4 text-sm text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        Le paiement en ligne arrive bientôt. Pour t'abonner à une formule Premium dès maintenant, contacte-nous directement.
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`card-shell flex flex-col p-6 ${plan.highlighted ? "border-2 border-primary shadow-lg" : ""}`}
          >
            {plan.highlighted && <span className="chip mb-4 w-fit">Le plus populaire</span>}
            <h2 className="font-display text-xl font-bold">{plan.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
            <p className="mt-5 flex items-baseline gap-1">
              <span className="text-3xl font-bold">{plan.price}</span>
              <span className="text-sm text-muted-foreground">{plan.period}</span>
            </p>
            {plan.period && (
              <span className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> Accès {plan.period.replace("/ ", "")}
              </span>
            )}

            <ul className="mt-6 flex-1 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>

            {plan.id === "gratuit" ? (
              <Link to="/inscription" className="btn-outline mt-8">
                {plan.cta}
              </Link>
            ) : (
              <>
                <Link to="/contact" className={`mt-8 ${plan.highlighted ? "btn-primary" : "btn-outline"}`}>
                  Nous contacter pour souscrire
                </Link>
                <p className="mt-2 text-center text-xs text-muted-foreground">Un membre de l'équipe te recontacte pour finaliser l'abonnement.</p>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
