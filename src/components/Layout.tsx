import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { trackEvent } from "@/lib/analytics";

export function Layout() {
  const location = useLocation();

  useEffect(() => {
    trackEvent("page_view", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
