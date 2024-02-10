import { Route, Routes } from "react-router-dom";
import { MainPage } from "./pages/main/main";
import { ProtectedRoute } from "./protector-router";

export const AppRoutes = ({ ads, isLoading, setAds }) => {
  return (
    <Routes>
      <Route
        path="/"
        element={<MainPage ads={ads} isLoading={isLoading} setAds={setAds} />}
      />
      <Route
        element={
          <ProtectedRoute isAllowed={Boolean(localStorage.getItem("token"))} />
        }
      ></Route>
    </Routes>
  );
};
