import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, UserCircle, Shield, Headphones, BookOpen, Mic, PenLine, ChevronDown } from "lucide-react";
import { Logo } from "./Logo";
import { useAuth } from "@/lib/AuthContext";

const SKILL_LINKS = [
  { to: "/comprehension-orale", label: "Compréhension orale", icon: Headphones, color: "var(--co)" },
  { to: "/comprehension-ecrite", label: "Compréhension écrite", icon: BookOpen, color: "var(--ce)" },
  { to: "/expression-orale", label: "Expression orale", icon: Mic, color: "var(--eo)" },
  { to: "/expression-ecrite", label: "Expression écrite", icon: PenLine, color: "var(--ee)" },
] as const;

const UTILITY_LINKS = [
  { to: "/tarifs", label: "Tarifs" },
  { to: "/blog", label: "Blog" },
  { to: "/calculatrice-nclc", label: "Calculatrice NCLC" },
  { to: "/faq", label: "FAQ" },
];

function navLinkClass({ isActive }: { isActive: boolean }) {
  return `transition-colors hover:text-primary ${isActive ? "text-primary" : "text-foreground/80"}`;
}

function UserMenu({ onNavigate }: { onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;
  const initial = user.email?.[0]?.toUpperCase() ?? "?";

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
    onNavigate();
    navigate("/");
  };

  return (
    <div className="relative" onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full border border-border py-1 pl-1 pr-3 text-sm font-medium transition hover:border-primary"
      >
        <span className="relative grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {initial}
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-green-500" />
        </span>
        <span className="max-w-[10rem] truncate">{user.email}</span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-40 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-card py-1 shadow-lg">
          <div className="border-b border-border px-3 py-2">
            <p className="truncate text-sm font-semibold">{user.email}</p>
            <p className="text-xs text-muted-foreground">Compte connecté</p>
          </div>
          <NavLink
            to="/profil"
            onClick={() => {
              setOpen(false);
              onNavigate();
            }}
            className="flex items-center gap-2 px-3 py-2 text-sm text-foreground/90 transition hover:bg-muted"
          >
            <UserCircle className="h-4 w-4" /> Mon profil
          </NavLink>
          {isAdmin && (
            <NavLink
              to="/admin"
              onClick={() => {
                setOpen(false);
                onNavigate();
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-foreground/90 transition hover:bg-muted"
            >
              <Shield className="h-4 w-4" /> Espace admin
            </NavLink>
          )}
          <div className="my-1 border-t border-border" />
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-red-500 transition hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" /> Déconnexion
          </button>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur">
      <div className="hidden border-b border-border bg-secondary text-secondary-foreground lg:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 text-xs">
          <span className="text-secondary-foreground/60">Plateforme de préparation au TCF Canada</span>
          <nav className="flex items-center gap-5 font-medium" aria-label="Navigation utilitaire">
            {UTILITY_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={navLinkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      <div className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Logo />

          <nav className="hidden items-center gap-1 text-sm font-medium lg:flex" aria-label="Navigation principale">
            {SKILL_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${isActive ? "bg-muted text-foreground" : "text-foreground/80 hover:text-foreground"}`
                }
              >
                <span style={{ color: link.color }}>
                  <link.icon className="h-4 w-4" />
                </span>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {user ? (
              <UserMenu onNavigate={() => {}} />
            ) : (
              <>
                <NavLink to="/connexion" className="btn-outline !px-4 !py-2 text-sm">Connexion</NavLink>
                <NavLink to="/inscription" className="btn-primary !px-4 !py-2 text-sm">Créer un compte gratuit</NavLink>
              </>
            )}
          </div>

          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-lg border border-border lg:hidden"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-b border-border bg-background px-4 py-4 lg:hidden" aria-label="Navigation mobile">
          <ul className="flex flex-col gap-3 text-sm font-medium">
            {SKILL_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className={navLinkClass} onClick={() => setOpen(false)}>
                  <span className="mr-1.5 inline-flex" style={{ color: link.color }}>
                    <link.icon className="inline h-4 w-4" />
                  </span>
                  {link.label}
                </NavLink>
              </li>
            ))}
            {UTILITY_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className={navLinkClass} onClick={() => setOpen(false)}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2">
            {user ? (
              <>
                <NavLink to="/profil" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary" onClick={() => setOpen(false)}>
                  <UserCircle className="h-4 w-4" /> Mon profil
                </NavLink>
                {isAdmin && (
                  <NavLink to="/admin" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary" onClick={() => setOpen(false)}>
                    <Shield className="h-4 w-4" /> Espace admin
                  </NavLink>
                )}
                <button type="button" onClick={handleSignOut} className="btn-outline w-full">
                  <LogOut className="h-4 w-4" /> Déconnexion
                </button>
              </>
            ) : (
              <>
                <NavLink to="/connexion" className="btn-outline w-full" onClick={() => setOpen(false)}>Connexion</NavLink>
                <NavLink to="/inscription" className="btn-primary w-full" onClick={() => setOpen(false)}>Créer un compte gratuit</NavLink>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
