import { Link } from "react-router-dom";
import logoImage from "@/assets/logo-blue-tick-exams.jpg";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2 ${className}`}>
      <img src={logoImage} alt="Blue Tick Project" className="h-10 w-auto shrink-0" />
    </Link>
  );
}
