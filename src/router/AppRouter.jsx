import { BrowserRouter, Routes, Route } from "react-router-dom";

import GuestRoute from "../components/GuestRoute";
import MemberRoute from "../components/MemberRoute";

import MainPage from "../pages/MainPage";
import AuthPage from "../pages/AuthPage";
import IdeaPage from "../pages/IdeaPage";
import ExplorePage from "../pages/ExplorePage";
import BMCCreatePage from "../pages/BMCCreatePage";
import BMCAnalyzePage from "../pages/BMCAnalyzePage";
import BMCResultPage from "../pages/BMCResultPage";
import BMCAnalyzeResultPage from "../pages/BMCAnalyzeResultPage";
import MyPage from "../pages/MyPage";
import BMCEditPage from "../pages/BMCEditPage";

import KakaoCallback from "../pages/oauth/KakaoCallback";
import GoogleCallback from "../pages/oauth/GoogleCallback";

import ScrollToTop from "../components/ScrollToTop";

// 테스트용
import MyPageApiTest from "../pages/MyPageApiTest";


function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<MainPage />} />

        <Route
          path="/auth"
          element={
            <GuestRoute>
              <AuthPage />
            </GuestRoute>
          }
        />

        {/* OAuth */}
        <Route path="/oauth/kakao" element={<KakaoCallback />} />
        <Route path="/oauth/google" element={<GoogleCallback />} />

        <Route
          path="/idea"
          element={
            <MemberRoute>
              <IdeaPage />
            </MemberRoute>
          }
        />

        <Route
          path="/explore"
          element={
            <MemberRoute>
              <ExplorePage />
            </MemberRoute>
          }
        />

        <Route
          path="/bmc/create"
          element={
            <MemberRoute>
              <BMCCreatePage />
            </MemberRoute>
          }
        />

        <Route
          path="/bmc/analyze"
          element={
            <MemberRoute>
              <BMCAnalyzePage />
            </MemberRoute>
          }
        />

        {/* 제거 예정 */}
        <Route
          path="/bmc/result"
          element={
            <MemberRoute>
              <BMCResultPage />
            </MemberRoute>
          }
        />

        <Route
          path="/bmc/result/:bmcRecordId"
          element={
            <MemberRoute>
              <BMCResultPage />
            </MemberRoute>
          }
        />

        {/* 제거 예정 */}
        <Route
          path="/bmc/analyze/result"
          element={
            <MemberRoute>
              <BMCAnalyzeResultPage />
            </MemberRoute>
          }
        />

        <Route
          path="/bmc/analyze/result/:bmcRecordId"
          element={
            <MemberRoute>
              <BMCAnalyzeResultPage />
            </MemberRoute>
          }
        />

        <Route
          path="/bmc/edit/:bmcRecordId"
          element={
            <MemberRoute>
              <BMCEditPage />
            </MemberRoute>
          }
        />

        <Route
          path="/my"
          element={
            <MemberRoute>
              <MyPage />
            </MemberRoute>
          }
        />

        {/* 실전 */}
        <Route
          path="/my/test"
          element={
            <MemberRoute>
              <MyPageApiTest />
            </MemberRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;