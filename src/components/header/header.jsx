import { Link, useNavigate } from "react-router-dom";
import * as S from "./header.styled";
import img from "../../img/logo.png";
import { removeTokenFromLocalStorage } from "../../api/api";
import { useEffect, useState } from "react";
import { AddAds } from "../modals/add-ads/addAds";

export const Header = () => {
  const navigate = useNavigate();
  return (
    <S.Header>
      <S.HeaderNav>
        <S.HeaderBtnMainEnter onClick={() => navigate("/login")}>
          Вход в личный кабинет
        </S.HeaderBtnMainEnter>
      </S.HeaderNav>
    </S.Header>
  );
};

export const HeaderAuth = ({ ads, setAds, handleClickLogout }) => {
  const navigate = useNavigate();

  const [openFormAddAds, setOpenFormAddAds] = useState(false);
  return (
    <>
      {openFormAddAds && (
        <AddAds
          setOpenFormAddAds={setOpenFormAddAds}
          ads={ads}
          setAds={setAds}
        />
      )}
      <S.Header>
        <S.HeaderNav>
          <S.HeaderLogo>
            <S.LogoMobLink>
              <Link to="/">
                <S.LogoMobImg src={img} alt="logo" />
              </Link>
            </S.LogoMobLink>
          </S.HeaderLogo>
          <S.HeaderBtnContainer>
            <S.HeaderBtnPutAd onClick={() => setOpenFormAddAds(true)}>
              Разместить объявление
            </S.HeaderBtnPutAd>
            <S.HeaderBtnPutAd
              onClick={() => {
                navigate("/profile/me", { replace: true });
              }}
            >
              Личный кабинет
            </S.HeaderBtnPutAd>
            <S.HeaderBtnPutAd onClick={() => handleClickLogout()}>
              Выход
            </S.HeaderBtnPutAd>
          </S.HeaderBtnContainer>
        </S.HeaderNav>
      </S.Header>
    </>
  );
};

export const MainHeader = ({ ads, setAds }) => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(
    auth?.isAuth || false
  );
  const navigate = useNavigate();

  const updateAuthenticationStatus = () => {
    const updatedAuth = JSON.parse(localStorage.getItem("auth"));
    setIsUserAuthenticated(updatedAuth?.isAuth || false);
  };

  const handleClickLogout = () => {
    removeTokenFromLocalStorage();
    updateAuthenticationStatus();
    navigate("/", { replace: true });
  };

  return isUserAuthenticated ? (
    <HeaderAuth
      ads={ads}
      setAds={setAds}
      handleClickLogout={handleClickLogout}
    />
  ) : (
    <Header />
  );
};
