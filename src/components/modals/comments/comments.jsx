import * as T from "./comments.styled";
import noAvatar from "../../../img/myprofile.png";
import { useAddCommentMutation } from "../../../store/services/auth";
import { useEffect, useState } from "react";
import { getTokenFromLocalStorage } from "../../../api/api";
import { Link, useParams } from "react-router-dom";

export const Comments = ({ setOpenFormComments, comments, setAdsComments }) => {
  const closeForm = () => {
    setOpenFormComments(false);
  };
  const { id } = useParams();
  const [addComment, { data, isLoading }] = useAddCommentMutation(id);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState(null);
  const auth = JSON.parse(localStorage.getItem("auth"));
  const [saveButton, setSaveButton] = useState(true);

  const handleAddComment = async (event) => {
    event.preventDefault();
    if (!newComment) {
      setError("Пожалуйста, введите отзыв");
    }

    try {
      await addComment({
        token: getTokenFromLocalStorage(),
        text: newComment,
        id: id,
      });
      closeForm();
      setNewComment("");
      setSaveButton(true);
    } catch (error) {
      console.error("Ошибка при добавлении комментария", error);
    }
  };

  useEffect(() => {
    if (newComment !== "") {
      setAdsComments((prevComments) => [data, ...prevComments]);
    }
  }, [data, setAdsComments]);

  return (
    <T.Wrapper>
      <T.ContainerBg>
        <T.ModalBlock>
          {!isLoading ? (
            <T.ModalContent>
              <T.ModalTitle>Отзывы о товаре</T.ModalTitle>
              <T.ModalBtnClose>
                <T.ModalBtnCloseLine onClick={closeForm}></T.ModalBtnCloseLine>
              </T.ModalBtnClose>
              <T.ModalInner>
                {!auth?.isAuth ? (
                  <T.FormNewArt>
                    Для того чтобы оставить отзыв,{" "}
                    <Link to={"/login"}>авторизуйтесь </Link>
                  </T.FormNewArt>
                ) : (
                  <T.ModalFormNewArt id="formNewArt" action="#">
                    <T.FormNewArtBlock>
                      <T.FormNewArt htmlFor="text">Добавить отзыв</T.FormNewArt>
                      <T.FormNewArtArea
                        name="text"
                        id="formArea"
                        cols="auto"
                        rows="5"
                        placeholder="Введите отзыв"
                        value={newComment}
                        onChange={(event) => setNewComment(event.target.value)}
                      ></T.FormNewArtArea>
                    </T.FormNewArtBlock>
                    <T.FormNewArtBtnPub
                      id="btnPublish"
                      disabled={!newComment?.length}
                      onClick={(event) => handleAddComment(event)}
                    >
                      Опубликовать
                    </T.FormNewArtBtnPub>
                    {!saveButton ? (
                      <T.FormNewArt>Комментарий добавлен</T.FormNewArt>
                    ) : (
                      ""
                    )}
                    {error && <T.Error>{error}</T.Error>}
                  </T.ModalFormNewArt>
                )}
                <T.ModalReviews>
                  <T.ReviewsReview>
                    {comments &&
                      comments.map((item, index) => (
                        <T.ReviewItem key={index}>
                          <T.ReviewLeft>
                            <T.ReviewImg>
                              {item.author?.avatar ? (
                                <T.ReviewImgImg
                                  src={`http://localapiHost:8090/${item.author?.avatar}`}
                                  alt=""
                                />
                              ) : (
                                <T.ReviewImgImg src={noAvatar} alt="" />
                              )}
                            </T.ReviewImg>
                          </T.ReviewLeft>
                          <T.ReviewRight>
                            <T.ReviewName>
                              {item.author?.name}
                              <T.ReviewNameSpan>
                                {new Date(item.created_on).toLocaleString(
                                  "ru",
                                  {
                                    addSuffix: true,
                                  }
                                )}
                              </T.ReviewNameSpan>
                            </T.ReviewName>
                            <T.ReviewTitle>Комментарий</T.ReviewTitle>
                            <T.ReviewText>{item?.text}</T.ReviewText>
                          </T.ReviewRight>
                        </T.ReviewItem>
                      ))}
                  </T.ReviewsReview>
                </T.ModalReviews>
              </T.ModalInner>
            </T.ModalContent>
          ) : (
            <T.ModalTitle>Отзывы загружаются...</T.ModalTitle>
          )}
        </T.ModalBlock>
      </T.ContainerBg>
    </T.Wrapper>
  );
};
