import { Footer } from "../../components/footer/footer";
import { HeaderAuth } from "../../components/header/header";
import { MainMenu } from "../../components/menu/menu";
import * as S from "../../App.style";
import * as T from "./profile.style";
import { ContentCard } from "../../components/cards/cards";
import { useEffect, useState } from "react";
import {
  getTokenFromLocalStorage,
  updateUser,
  uploadUserAvatar,
} from "../../api/api";
import { useRef } from "react";
import noPhoto from "../../img/myprofile.png";
import { EditPassword } from "../../components/modals/edit-password/editPassword";
import { apiHost } from "../../api/constants";

export const MyProfile = ({ userProfile, setUserProfile, isLoading }) => {
  const [currentProfile, setCurrentProfile] = useState(userProfile);
  const [img, setImg] = useState(null);
  const nameRef = useRef();
  const surnameRef = useRef();
  const cityRef = useRef();
  const phoneRef = useRef();
  const [openFormChangePassword, setOpenFormChangePassword] = useState(false);
  const [isDisabledButton, setDisabledButton] = useState(true);

  const handleName = (event) => {
    event.preventDefault();
    setCurrentProfile({ ...currentProfile, name: event.target.value });
  };
  const handleSurname = (event) => {
    event.preventDefault();
    setCurrentProfile({ ...currentProfile, surname: event.target.value });
  };
  const handleCity = (event) => {
    event.preventDefault();
    setCurrentProfile({ ...currentProfile, city: event.target.value });
  };
  const handlePhone = (event) => {
    event.preventDefault();
    setCurrentProfile({ ...currentProfile, phone: event.target.value });
  };

  const handleAvatarClick = (event) => {
    const fileUpload = document.getElementById("file-upload");
    fileUpload.click();
    setCurrentProfile({ ...currentProfile, avatar: event.target.value });
  };

  const handleAvatarUpload = (file) => {
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
      uploadUserAvatar(formData, getTokenFromLocalStorage())
        .then((data) => {
          setUserProfile(data);
        })
        .catch((error) => {
          console.error("Error fetching workout data:", error);
        });
    } else {
      console.log("Файл не найден");
    }
  };

  const handleSaveChanges = (event) => {
    if (isDisabledButton) {
      return;
    }

    event.preventDefault();
    updateUser(currentProfile, getTokenFromLocalStorage())
      .then((data) => {
        setUserProfile(data);
      })
      .catch((error) => {
        console.error("Error fetching workout data:", error);
      });
  };

  const isProfileValuesEqual = (array1, array2) => {
    if (array1.length !== array2.length) {
      return false;
    }

    if (
      !nameRef.current.value.length &&
      !surnameRef.current.value.length &&
      !cityRef.current.value.length &&
      !phoneRef.current.value.length
    ) {
      return true;
    }

    return array1.every((item, index) => array2[index] === item);
  };

  useEffect(() => {
    const userProfileValues = Object.values(userProfile);
    const currentProfileValues = Object.values(currentProfile);

    setDisabledButton(
      isProfileValuesEqual(userProfileValues, currentProfileValues)
    );
  }, [userProfile, currentProfile, isDisabledButton]);

  return (
    <>
      {openFormChangePassword && (
        <EditPassword setOpenFormChangePassword={setOpenFormChangePassword} />
      )}
      <HeaderAuth />
      <S.Main>
        {isLoading ? (
          <T.MainContainer>
            <T.MainCenterBlock>
              <MainMenu />
              <T.MainH2>
                Здравствуйте, {userProfile.name || userProfile.email}!
              </T.MainH2>
              <T.MainProfile>
                <T.ProfileContent>
                  <T.ProfileTitle>Настройки профиля</T.ProfileTitle>
                  <T.ProfileSettings>
                    <T.SettingsLeft>
                      <T.SettingsImg>
                        {userProfile.avatar ? (
                          <T.Img
                            src={
                              img
                                ? URL.createObjectURL(img)
                                : `${apiHost}/${userProfile.avatar}`
                            }
                          />
                        ) : (
                          <T.Img src={noPhoto} />
                        )}
                      </T.SettingsImg>
                      <T.SettingsImgInput
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          event.preventDefault();
                          const file = event.target.files?.[0];
                          if (file) {
                            setImg(file);
                            handleAvatarUpload(file);
                          }
                        }}
                      ></T.SettingsImgInput>
                      <T.SettingsChangePhoto onClick={handleAvatarClick}>
                        Заменить
                      </T.SettingsChangePhoto>
                    </T.SettingsLeft>
                    <T.SettingsRight>
                      <T.SettingsForm>
                        <T.SettingsDiv>
                          <T.SettingsFormLabel htmlFor="name">
                            Имя
                          </T.SettingsFormLabel>
                          <T.SettingsFormInput
                            id="settings-name"
                            name="name"
                            type="text"
                            value={currentProfile.name}
                            placeholder="Input name"
                            ref={nameRef}
                            onChange={(event) => handleName(event)}
                          />
                        </T.SettingsDiv>

                        <T.SettingsDiv>
                          <T.SettingsFormLabel htmlFor="surname">
                            Фамилия
                          </T.SettingsFormLabel>
                          <T.SettingsFormInput
                            id="settings-name"
                            name="surname"
                            type="text"
                            value={currentProfile.surname}
                            placeholder="Input surname"
                            ref={surnameRef}
                            onChange={(event) => {
                              handleSurname(event);
                            }}
                          />
                        </T.SettingsDiv>

                        <T.SettingsDiv>
                          <T.SettingsFormLabel htmlFor="city">
                            Город
                          </T.SettingsFormLabel>
                          <T.SettingsFormInput
                            id="settings-city"
                            name="city"
                            type="text"
                            value={currentProfile.city}
                            placeholder="Input city"
                            ref={cityRef}
                            onChange={(event) => {
                              handleCity(event);
                            }}
                          />
                        </T.SettingsDiv>

                        <T.SettingsDiv>
                          <T.SettingsFormLabel htmlFor="phone">
                            Телефон
                          </T.SettingsFormLabel>
                          <T.SettingsFormInput
                            id="settings-phone"
                            name="phone"
                            type="tel"
                            width={614}
                            value={currentProfile.phone}
                            placeholder="Input phone"
                            ref={phoneRef}
                            onChange={(event) => {
                              handlePhone(event);
                            }}
                          />
                        </T.SettingsDiv>
                        <T.SettingsBtn
                          id="settings-btn"
                          disabled={isDisabledButton}
                          onClick={(event) => handleSaveChanges(event)}
                        >
                          Сохранить
                        </T.SettingsBtn>
                        <T.SettingsBtn
                          onClick={(event) => {
                            event.preventDefault();
                            setOpenFormChangePassword(true);
                          }}
                        >
                          Изменить пароль
                        </T.SettingsBtn>
                      </T.SettingsForm>
                    </T.SettingsRight>
                  </T.ProfileSettings>
                </T.ProfileContent>
              </T.MainProfile>
              <T.MainTitle>Мои товары</T.MainTitle>
            </T.MainCenterBlock>
            <T.MainContent>
              <ContentCard userId={userProfile.id} />
            </T.MainContent>
          </T.MainContainer>
        ) : (
          <T.ProfileTitle>Профиль загружается...</T.ProfileTitle>
        )}
      </S.Main>
      <Footer />
    </>
  );
};
