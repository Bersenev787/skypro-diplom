import * as S from "./auth.style";
import img from "../../img/logo-modal.png";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser, saveTokenToLocalStorage } from "../../api/api";
import { setAuth } from "../../store/slices/auth";
import { useNavigate } from "react-router-dom";
import { saveUserIdToState } from "../../App";

export const Login = ({ isLoginMode = true }) => {
  const [login, setLogin] = useState(false);
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (email, password) => {
    if (!email) {
      setError("Не заполнена почта");
      return;
    } else if (!password) {
      setError("Не введён пароль");
      return;
    }
    setLogin(true);
    try {
      await loginUser(email, password).then((data) => {
        dispatch(
          setAuth({
            email: email,
            password: password,
            id: data.id,
            user: JSON.parse(localStorage.getItem("user")),
          })
        );
        navigate("/");
        saveTokenToLocalStorage(data);
        saveUserIdToState(data);
      });
    } catch (erro) {
      setError(erro.message);
    } finally {
      setLogin(false);
    }
  };
  useEffect(() => {
    setError(null);
  }, [isLoginMode, email, password]);

  return (
    <S.ContainerEnter>
      <S.ModalBlock>
        <S.ModalFormLogin id="formLogIn" action="#">
          <S.ModalLogo to="/">
            <S.ModalLogoImg src={img} alt="logo" />
          </S.ModalLogo>
          <S.ModalInputLogin
            type="text"
            name="login"
            id="formlogin"
            placeholder="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          <S.ModalInputPassword
            type="password"
            name="password"
            id="formpassword"
            placeholder="Пароль"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
          {error && <S.Error>{error}</S.Error>}
          <S.ModalBtnEnter id="btnEnter">
            <S.ModalBtnEnterLink onClick={() => handleLogin(email, password)}>
              Войти
            </S.ModalBtnEnterLink>
          </S.ModalBtnEnter>
          <S.ModalBtnSignup id="btnSignUp">
            <S.ModalBtnSignupLink to={"/registration"}>
              Зарегистрироваться
            </S.ModalBtnSignupLink>
          </S.ModalBtnSignup>
        </S.ModalFormLogin>
      </S.ModalBlock>
    </S.ContainerEnter>
  );
};
