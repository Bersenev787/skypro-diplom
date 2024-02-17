import { Link, useNavigate } from "react-router-dom";
import * as S from "./header.styled";
import img from "../../img/logo.png";
import { removeTokenFromLocalStorage } from "../../api/api";
import { useState } from "react";
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

export const HeaderAuth = ({ ads, setAds }) => {
  const navigate = useNavigate();
  const handleClickLogout = () => {
    removeTokenFromLocalStorage();
    navigate("/");
  };
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
            <S.HeaderBtnPutAd onClick={() => navigate("/profile/me")}>
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
