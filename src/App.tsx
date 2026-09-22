import { Route, Routes } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { RequireAuth } from "@/components/RequireAuth";
import { RequireAdmin } from "@/components/RequireAdmin";
import AdminSujets from "@/pages/admin/AdminSujets";
import AdminSujetNouveau from "@/pages/admin/AdminSujetNouveau";
import AdminSujetModifier from "@/pages/admin/AdminSujetModifier";
import AdminConnexions from "@/pages/admin/AdminConnexions";
import AdminCe from "@/pages/admin/AdminCe";
import AdminCeNouveau from "@/pages/admin/AdminCeNouveau";
import AdminCeModifier from "@/pages/admin/AdminCeModifier";
import AdminCeSujets from "@/pages/admin/AdminCeSujets";
import AdminCeSujetNouveau from "@/pages/admin/AdminCeSujetNouveau";
import AdminCeSujetModifier from "@/pages/admin/AdminCeSujetModifier";
import AdminEo from "@/pages/admin/AdminEo";
import AdminEoNouveau from "@/pages/admin/AdminEoNouveau";
import AdminEoModifier from "@/pages/admin/AdminEoModifier";
import AdminEe from "@/pages/admin/AdminEe";
import AdminEeNouveau from "@/pages/admin/AdminEeNouveau";
import AdminEeModifier from "@/pages/admin/AdminEeModifier";
import AdminIntegrite from "@/pages/admin/AdminIntegrite";
import AdminMessages from "@/pages/admin/AdminMessages";
import Home from "@/pages/Home";
import TcfCanada from "@/pages/TcfCanada";
import Profil from "@/pages/Profil";
import ComprehensionOrale from "@/pages/ComprehensionOrale";
import PracticeCo from "@/pages/PracticeCo";
import PracticeCoSujet from "@/pages/PracticeCoSujet";
import ComprehensionEcrite from "@/pages/ComprehensionEcrite";
import PracticeCe from "@/pages/PracticeCe";
import PracticeCeSujet from "@/pages/PracticeCeSujet";
import ExpressionOrale from "@/pages/ExpressionOrale";
import PracticeEo from "@/pages/PracticeEo";
import ExpressionEcrite from "@/pages/ExpressionEcrite";
import PracticeEe from "@/pages/PracticeEe";
import Tarifs from "@/pages/Tarifs";
import Blog from "@/pages/Blog";
import BlogArticle from "@/pages/BlogArticle";
import CalculatriceNclc from "@/pages/CalculatriceNclc";
import Connexion from "@/pages/Connexion";
import Inscription from "@/pages/Inscription";
import MotDePasseOublie from "@/pages/MotDePasseOublie";
import ReinitialiserMotDePasse from "@/pages/ReinitialiserMotDePasse";
import APropos from "@/pages/APropos";
import Contact from "@/pages/Contact";
import Confidentialite from "@/pages/Confidentialite";
import Cgu from "@/pages/Cgu";
import PolitiqueRemboursement from "@/pages/PolitiqueRemboursement";
import PolitiqueCookies from "@/pages/PolitiqueCookies";
import MentionsLegales from "@/pages/MentionsLegales";
import Faq from "@/pages/Faq";
import ImmigrationCanada from "@/pages/ImmigrationCanada";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="tcf-canada" element={<TcfCanada />} />
        <Route path="comprehension-orale" element={<ComprehensionOrale />} />
        <Route path="comprehension-orale/examens/:slug" element={<PracticeCoSujet />} />
        <Route path="comprehension-orale/:slug" element={<PracticeCo />} />
        <Route path="comprehension-ecrite" element={<ComprehensionEcrite />} />
        <Route path="comprehension-ecrite/examens/:slug" element={<PracticeCeSujet />} />
        <Route path="comprehension-ecrite/:slug" element={<PracticeCe />} />
        <Route path="expression-orale" element={<ExpressionOrale />} />
        <Route path="expression-orale/:slug" element={<PracticeEo />} />
        <Route path="expression-ecrite" element={<ExpressionEcrite />} />
        <Route path="expression-ecrite/:slug" element={<PracticeEe />} />
        <Route path="tarifs" element={<Tarifs />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogArticle />} />
        <Route path="calculatrice-nclc" element={<CalculatriceNclc />} />
        <Route path="profil" element={<RequireAuth><Profil /></RequireAuth>} />
        <Route path="admin" element={<RequireAdmin><AdminSujets /></RequireAdmin>} />
        <Route path="admin/sujets/nouveau" element={<RequireAdmin><AdminSujetNouveau /></RequireAdmin>} />
        <Route path="admin/sujets/modifier/:slug" element={<RequireAdmin><AdminSujetModifier /></RequireAdmin>} />
        <Route path="admin/connexions" element={<RequireAdmin><AdminConnexions /></RequireAdmin>} />
        <Route path="admin/ce" element={<RequireAdmin><AdminCe /></RequireAdmin>} />
        <Route path="admin/ce/nouveau" element={<RequireAdmin><AdminCeNouveau /></RequireAdmin>} />
        <Route path="admin/ce/modifier/:slug" element={<RequireAdmin><AdminCeModifier /></RequireAdmin>} />
        <Route path="admin/ce-sujets" element={<RequireAdmin><AdminCeSujets /></RequireAdmin>} />
        <Route path="admin/ce-sujets/nouveau" element={<RequireAdmin><AdminCeSujetNouveau /></RequireAdmin>} />
        <Route path="admin/ce-sujets/modifier/:slug" element={<RequireAdmin><AdminCeSujetModifier /></RequireAdmin>} />
        <Route path="admin/eo" element={<RequireAdmin><AdminEo /></RequireAdmin>} />
        <Route path="admin/eo/nouveau" element={<RequireAdmin><AdminEoNouveau /></RequireAdmin>} />
        <Route path="admin/eo/modifier/:slug" element={<RequireAdmin><AdminEoModifier /></RequireAdmin>} />
        <Route path="admin/ee" element={<RequireAdmin><AdminEe /></RequireAdmin>} />
        <Route path="admin/ee/nouveau" element={<RequireAdmin><AdminEeNouveau /></RequireAdmin>} />
        <Route path="admin/ee/modifier/:slug" element={<RequireAdmin><AdminEeModifier /></RequireAdmin>} />
        <Route path="admin/integrite" element={<RequireAdmin><AdminIntegrite /></RequireAdmin>} />
        <Route path="admin/messages" element={<RequireAdmin><AdminMessages /></RequireAdmin>} />
        <Route path="connexion" element={<Connexion />} />
        <Route path="inscription" element={<Inscription />} />
        <Route path="mot-de-passe-oublie" element={<MotDePasseOublie />} />
        <Route path="reinitialiser-mot-de-passe" element={<ReinitialiserMotDePasse />} />
        <Route path="a-propos" element={<APropos />} />
        <Route path="contact" element={<Contact />} />
        <Route path="confidentialite" element={<Confidentialite />} />
        <Route path="cgu" element={<Cgu />} />
        <Route path="politique-remboursement" element={<PolitiqueRemboursement />} />
        <Route path="politique-cookies" element={<PolitiqueCookies />} />
        <Route path="mentions-legales" element={<MentionsLegales />} />
        <Route path="faq" element={<Faq />} />
        <Route path="immigration-canada" element={<ImmigrationCanada />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
