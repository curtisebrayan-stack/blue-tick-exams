import { NavLink } from "react-router-dom";

const TABS = [
  { to: "/admin", label: "Compréhension orale", end: true },
  { to: "/admin/ce", label: "Compréhension écrite", end: false },
  { to: "/admin/eo", label: "Expression orale", end: false },
  { to: "/admin/ee", label: "Expression écrite", end: false },
  { to: "/admin/connexions", label: "Connexions", end: false },
  { to: "/admin/integrite", label: "Intégrité", end: false },
  { to: "/admin/messages", label: "Messages", end: false },
];

export function AdminTabs() {
  return (
    <nav className="flex flex-wrap gap-4 border-b border-border text-sm font-semibold">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            `border-b-2 pb-3 transition-colors ${isActive ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}
