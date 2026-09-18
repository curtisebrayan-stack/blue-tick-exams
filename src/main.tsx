import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles.css";
import App from "./App";
import { AuthProvider } from "./lib/AuthContext";
import { ErrorBoundary } from "./components/ErrorBoundary";

const rootElement = document.getElementById("root")!;

createRoot(rootElement).render(
  <ErrorBoundary>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </ErrorBoundary>,
);
