import { Footer } from "../../components/footer/footer";
import { Link, useParams } from "react-router-dom";
import { HeaderAuth, Header } from "../../components/header/header";
import { MainMenu } from "../../components/menu/menu";
import * as S from "../../App.style";
import * as T from "./article.styled";
import { useEffect, useState } from "react";
import noPhoto from "../../img/no-photo.png";
import noAvatar from "../../img/myprofile.png";
import {
  useGetAdsByIdQuery,
  useDeleteAdsMutation,
  useGetAllCommentsQuery,
} from "../../store/services/auth";
import { useAuthSelector } from "../../store/slices/auth";
import { EditAds } from "../../components/modals/add-ads/editAds";
import { Comments } from "../../components/modals/comments/comments";
import { getTokenFromLocalStorage } from "../../api/api";
import { apiHost } from "../../api/constants";
import { useNavigate } from "react-router-dom";

export const Article = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetAdsByIdQuery(id);
  const [showPhone, setShowPhone] = useState(false);
  const auth = JSON.parse(localStorage.getItem("auth"));
  const [openFormEditAds, setOpenFormEditAds] = useState(false);
  const [openFormComments, setOpenFormComments] = useState(false);
  const [deleteAds, { isError }] = useDeleteAdsMutation(id);
  const [comments, setAdsComments] = useState([]);
  const { data: adsComments } = useGetAllCommentsQuery(id);
  const [saveButton, setSaveButton] = useState(true);
  const [currAds, setCurrAds] = useState(null);
  const navigate = useNavigate();

  const clickShowPhone = () => {
    if (data.user.phone) {
      return setShowPhone(true);
    }
    return setShowPhone(false);
  };

  const handleDeleteAds = async () => {
    deleteAds({
      token: getTokenFromLocalStorage(),
      id: id,
    }).then(() => navigate("/"));
    setSaveButton(false);
  };

  useEffect(() => {
    if (isError.status === 401) {
      deleteAds({
        token: getTokenFromLocalStorage(),
        id: id,
      });
      setSaveButton(false);
    }
  }, [isError]); // eslint-disable-line

  useEffect(() => {
    if (adsComments) {
      setAdsComments(adsComments);
    }
  }, [adsComments]);

  const [selectedCard, setSelectedCard] = useState(null);
  const [ind, setInd] = useState(null);

  const handleCardClick = (card, i) => {
    setSelectedCard(card);
    setInd(i);
  };

  const commentsTitle = () => {
    if (adsComments?.length === 1) {
      return "отзыв";
    }

    if (adsComments?.length > 1 && adsComments?.length < 5) {
      return "отзыва";
    }

    if (adsComments?.length < 5) {
      return "отзывов";
    }

    return "отзывов";
  };

  return (
    <>
      {openFormEditAds && (
        <EditAds
          setOpenFormEditAds={setOpenFormEditAds}
          currAds={data}
          setCurrAds={setCurrAds}
        />
      )}
      {openFormComments && (
        <Comments
          setOpenFormComments={setOpenFormComments}
          comments={comments}
          setAdsComments={setAdsComments}
        />
      )}
      {auth?.isAuth ? <HeaderAuth ads={data} setAds={currAds} /> : <Header />}
      <S.Main>
        <T.MainContainer>
          {isLoading ? (
            <T.ArticleTitle>Объявление загружается...</T.ArticleTitle>
          ) : (
            <T.MainCenterBlock>
              <MainMenu />
              <T.MainArtic>
                <T.ArticContent>
                  <T.ArticleLeft>
                    <T.ArticleFillImg>
                      <T.ArticleImg>
                        {data?.images.length !== 0 ? (
                          !selectedCard ? (
                            <T.ArticleImgImg
                              src={`${apiHost}/${data.images[0].url}`}
                            />
                          ) : (
                            <T.ArticleImgImg
                              id={ind}
                              src={`${apiHost}/${selectedCard.url}`}
                            />
                          )
                        ) : (
                          <T.ArticleImgImg src={noPhoto} alt="noPhoto" />
                        )}
                      </T.ArticleImg>
                      <T.ArticleImgBar>
                        {data.images.map((imag, index) => (
                          <T.ArticleImgBarDiv
                            key={index}
                            onClick={() => handleCardClick(imag, index)}
                          >
                            <T.ArticleImgBarDivImg
                              src={`${apiHost}/${imag.url}`}
                              alt=""
                            />
                          </T.ArticleImgBarDiv>
                        ))}
                      </T.ArticleImgBar>
                      <T.ArticleImgBarMob>
                        <T.ImgBarMobCircleActive></T.ImgBarMobCircleActive>
                        <T.ImgBarMobCircle></T.ImgBarMobCircle>
                      </T.ArticleImgBarMob>
                    </T.ArticleFillImg>
                  </T.ArticleLeft>
                  <T.ArticleRight>
                    <T.ArticleBlock>
                      <T.ArticleTitle>{data.title}</T.ArticleTitle>
                      <T.ArticleInfo>
                        <T.ArticleDate>
                          {new Date(data.created_on).toLocaleString("ru", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </T.ArticleDate>
                        <T.ArticleCity>{data.user.city}</T.ArticleCity>
                        <T.ArticleLink
                          onClick={() => setOpenFormComments(true)}
                        >
                          {adsComments ? adsComments.length : "..."}{" "}
                          {commentsTitle()}
                        </T.ArticleLink>
                      </T.ArticleInfo>
                      <T.ArticlePrice>{data.price} ₽</T.ArticlePrice>
                      {auth?.email === data.user.email ? (
                        <T.ArticleBtnBlock>
                          <T.ArticleBtnReduct
                            onClick={() => setOpenFormEditAds(true)}
                          >
                            Редактировать
                          </T.ArticleBtnReduct>
                          <T.ArticleBtnRemove onClick={handleDeleteAds}>
                            Снять с публикации
                          </T.ArticleBtnRemove>
                          {!saveButton ? (
                            <T.MainText>Объявление удалено</T.MainText>
                          ) : (
                            ""
                          )}
                        </T.ArticleBtnBlock>
                      ) : (
                        <T.ArticleBtn onClick={clickShowPhone}>
                          Показать телефон
                          <T.ArticleBtnSpan>
                            {!showPhone ? `+X XXX XXX XX XX` : data.user.phone}
                          </T.ArticleBtnSpan>
                        </T.ArticleBtn>
                      )}
                      <T.ArticleAuthor>
                        <T.AuthorImg>
                          {data.user.avatar ? (
                            <T.AuthorImgImg
                              src={`${apiHost}/${data.user.avatar}`}
                              alt=""
                            />
                          ) : (
                            <T.AuthorImgImg src={noAvatar} alt="" />
                          )}
                        </T.AuthorImg>
                        <T.AuthorCont key={data.user.id}>
                          <Link to={`/profile/${data.user.id}`}>
                            <T.AuthorName>{data.user.name}</T.AuthorName>
                            <T.AuthorAbout>
                              Продает товары с{" "}
                              {new Date(data.user.sells_from).toLocaleString(
                                "ru",
                                {
                                  month: "long",
                                  year: "numeric",
                                }
                              )}
                            </T.AuthorAbout>
                          </Link>
                        </T.AuthorCont>
                      </T.ArticleAuthor>
                    </T.ArticleBlock>
                  </T.ArticleRight>
                </T.ArticContent>
              </T.MainArtic>
              <T.MainTitle>Описание товара</T.MainTitle>
              <T.MainContent>
                <T.MainText>{data.description}</T.MainText>
              </T.MainContent>
            </T.MainCenterBlock>
          )}
        </T.MainContainer>
      </S.Main>
      <Footer />
    </>
  );
};
