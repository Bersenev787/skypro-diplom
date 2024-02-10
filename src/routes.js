import { Route, Routes } from "react-router-dom";
import { MainPage } from "./pages/main/main";
import { ProtectedRoute } from "./protector-router";
import { Login } from "./pages/auth/login";
import { Registration } from "./pages/auth/registration";
import { NotFound } from "./pages/not-found/notFound";
import { Article } from "./pages/article/article";

export const AppRoutes = ({ ads, isLoading, setAds }) => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registration" element={<Registration />} />
      <Route
        path="/"
        element={<MainPage ads={ads} isLoading={isLoading} setAds={setAds} />}
      />
      <Route
        element={
          <ProtectedRoute isAllowed={Boolean(localStorage.getItem("token"))} />
        }
      >
        <Route path="/ads/me" element={<Article ads={ads} setAds={setAds} />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
