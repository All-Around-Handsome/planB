import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainPage from "../pages/MainPage";
import AuthPage from "../pages/AuthPage";
import IdeaPage from "../pages/IdeaPage";
import ExplorePage from "../pages/ExplorePage";
import BMCCreatePage from "../pages/BMCCreatePage";
import BMCAnalyzePage from "../pages/BMCAnalyzePage";
import BMCResultPage from "../pages/BMCResultPage";
import BMCEditPage from "../pages/BMCEditPage";
import MyPage from "../pages/MyPage";

import ScrollToTop from "../components/ScrollToTop";

function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/idea" element={<IdeaPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/bmc/create" element={<BMCCreatePage />} />
        <Route path="/bmc/analyze" element={<BMCAnalyzePage />} />
        <Route path="/bmc/result" element={<BMCResultPage />} />
        <Route path="/bmc/edit" element={<BMCEditPage />} />
        <Route path="/my" element={<MyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;