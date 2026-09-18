import { Link } from "react-router-dom";
import { MessageCircle, Headphones, BookOpen, Mic, PenLine, Phone, Mail } from "lucide-react";
import { Logo } from "./Logo";

const SKILL_LINKS = [
  { to: "/comprehension-orale", label: "Compréhension orale", icon: Headphones, color: "var(--co)" },
  { to: "/comprehension-ecrite", label: "Compréhension écrite", icon: BookOpen, color: "var(--ce)" },
  { to: "/expression-orale", label: "Expression orale", icon: Mic, color: "var(--eo)" },
  { to: "/expression-ecrite", label: "Expression écrite", icon: PenLine, color: "var(--ee)" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary text-secondary-foreground">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-secondary-foreground/60">
              Préparation structurée aux quatre épreuves du TCF Canada.
            </p>
            <div className="mt-4 space-y-1.5 text-sm text-secondary-foreground/70">
              <a href="tel:+447440328777" className="flex items-center gap-2 hover:text-secondary-foreground">
                <Phone className="h-3.5 w-3.5" /> +44 7440 328 777
              </a>
              <a href="mailto:contact@blueticksproject.com" className="flex items-center gap-2 hover:text-secondary-foreground">
                <Mail className="h-3.5 w-3.5" /> contact@blueticksproject.com
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary-foreground/50">Liens</p>
            <ul className="mt-4 space-y-2 text-sm text-secondary-foreground/70">
              <li><Link className="hover:text-secondary-foreground" to="/">Accueil</Link></li>
              <li><Link className="hover:text-secondary-foreground" to="/tarifs">Tarifs</Link></li>
              <li><Link className="hover:text-secondary-foreground" to="/blog">Blog</Link></li>
              <li><Link className="hover:text-secondary-foreground" to="/a-propos">À propos de nous</Link></li>
              <li><Link className="hover:text-secondary-foreground" to="/contact">Contact</Link></li>
              <li><Link className="hover:text-secondary-foreground" to="/confidentialite">Politique de confidentialité</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary-foreground/50">Épreuves</p>
            <ul className="mt-4 space-y-2 text-sm text-secondary-foreground/70">
              {SKILL_LINKS.map((link) => (
                <li key={link.to}>
                  <Link className="flex items-center gap-2 hover:text-secondary-foreground" to={link.to}>
                    <span style={{ color: link.color }}><link.icon className="h-3.5 w-3.5" /></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-col gap-2">
              <Link to="/calculatrice-nclc" className="btn-outline !py-2 text-xs">Calculatrice NCLC</Link>
              <Link to="/tarifs" className="btn-primary !py-2 text-xs">Tarifs</Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary-foreground/50">Suivre</p>
            <div className="mt-4 flex gap-3">
              <a
                href="https://wa.me/447440328777"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="grid h-10 w-10 place-items-center rounded-full border border-secondary-foreground/20 transition hover:border-primary hover:text-primary"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
            <Link to="/contact" className="btn-outline mt-4 !py-2 text-xs">Contact</Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-secondary-foreground/10 pt-6 text-xs text-secondary-foreground/40 sm:flex-row">
          <p>© {new Date().getFullYear()} Blue Tick Exams. Site indépendant, non affilié à France Éducation international.</p>
          <Link to="/confidentialite" className="hover:text-secondary-foreground/70">Confidentialité</Link>
        </div>
      </div>
    </footer>
  );
}
