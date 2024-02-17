import { Route, Routes } from "react-router-dom";
import { MainPage } from "./pages/main/main";
import { ProtectedRoute } from "./protector-router";
import { Login } from "./pages/auth/login";
import { Registration } from "./pages/auth/registration";
import { NotFound } from "./pages/not-found/notFound";
import { Article } from "./pages/article/article";
import { Profile } from "./pages/profile/profile";

export const AppRoutes = ({ ads, isLoading, setAds }) => {
  const token = JSON.parse(localStorage.getItem("token"));
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registration" element={<Registration />} />
      <Route
        path="/"
        element={<MainPage ads={ads} isLoading={isLoading} setAds={setAds} />}
      />
      <Route
        path="/profile/:id"
        element={<Profile ads={ads} setAds={setAds} isLoading={isLoading} />}
      />
      <Route path="/ads/:id" element={<Article ads={ads} setAds={setAds} />} />
      <Route
        element={<ProtectedRoute isAllowed={Boolean(token?.access_token)} />}
      >
        <Route path="/ads/me" element={<Article ads={ads} setAds={setAds} />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
