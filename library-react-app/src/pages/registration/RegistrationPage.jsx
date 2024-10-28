import { useState, useEffect } from "react";
import { Button, Container, Form, InputGroup, FormControl, Alert } from "react-bootstrap";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useUserContext } from "../../context/UserContext";

import { USER_REGEX, PWD_REGEX, EMAIL_REGEX } from "../../utils/validation"; 
import LibraryApi from "../../api";

import styles from "./registration.module.css";

export const RegistrationPage = () => {
  const { setTokens } = useUserContext();
  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validName || !validEmail || !validPwd || !validMatch) {
      setErrMsg("Неверный ввод");
      return;
    }

    try {
      const { accessToken, refreshToken } = await LibraryApi.register(user, email, pwd);
      setTokens({ accessToken, refreshToken });
      setSuccess(true);
      setUser("");
      setEmail("");
      setPwd("");
      setMatchPwd("");
    } catch (error) {
      setErrMsg(error);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center">
      {success ? (
        <Alert variant="success" className={styles.successAlert}>
          <img src="/images/success.png" alt="Успешно!" />
          <p>Вы успешно зарегистрированы!</p>
          <Alert.Heading>Для входа в приложение нажмите на кнопку {"Войти"}</Alert.Heading>
        </Alert>
      ) : (
        <section className={styles.root}>
          <Alert variant="danger" show={errMsg !== ""}>
            {errMsg}
          </Alert>
          <h2 className={styles.regLabel}>Регистрация</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label className={styles.formLabel}>Имя пользователя:</Form.Label>
              <InputGroup>
                <FormControl
                  type="text"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  onFocus={() => setUserFocus(true)}
                  onBlur={() => setUserFocus(false)}
                  isInvalid={userFocus && user && !validName}
                />
                <Button variant="outline-secondary" disabled={!validName}>
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={validName ? styles.valid : styles.hide}
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={validName || !user ? styles.hide : styles.invalid}
                  />
                </Button>
              </InputGroup>
              <Form.Text className={`text-muted ${styles.formText}`}>
                {userFocus && user && !validName && (
                  <span>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    От 4 до 24 символов. Должно начинаться с буквы. Допускаются буквы, цифры,
                    подчеркивания, дефисы.
                  </span>
                )}
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label className={styles.formLabel}>Электронная почта:</Form.Label>
              <InputGroup>
                <FormControl
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                  isInvalid={emailFocus && email && !validEmail}
                />
                <Button variant="outline-secondary" disabled={!validEmail}>
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={validEmail ? styles.valid : styles.hide}
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={validEmail || !email ? styles.hide : styles.invalid}
                  />
                </Button>
              </InputGroup>
              <Form.Text className={`text-muted ${styles.formText}`}>
                {emailFocus && email && !validEmail && (
                  <span>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Пожалуйста, введите действительный адрес электронной почты.
                  </span>
                )}
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label className={styles.formLabel}>Пароль:</Form.Label>
              <InputGroup>
                <FormControl
                  type="password"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  onFocus={() => setPwdFocus(true)}
                  onBlur={() => setPwdFocus(false)}
                  isInvalid={pwdFocus && !validPwd}
                />
                <Button variant="outline-secondary" disabled={!validPwd}>
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={validPwd ? styles.valid : styles.hide}
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={validPwd || !pwd ? styles.hide : styles.invalid}
                  />
                </Button>
              </InputGroup>
              <Form.Text className={`text-muted ${styles.formText}`}>
                {pwdFocus && !validPwd && (
                  <span>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    От 8 до 24 символов. Должно содержать прописные и строчные буквы, цифры и
                    специальные символы. Разрешенные специальные символы:
                    <span aria-label="exclamation mark">!</span>
                    <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span>
                    <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                  </span>
                )}
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="confirm_pwd">
              <Form.Label className={styles.formLabel}>Подтвердите пароль:</Form.Label>
              <InputGroup>
                <FormControl
                  type="password"
                  value={matchPwd}
                  onChange={(e) => setMatchPwd(e.target.value)}
                  onFocus={() => setMatchFocus(true)}
                  onBlur={() => setMatchFocus(false)}
                  isInvalid={matchFocus && !validMatch}
                />
                <Button variant="outline-secondary" disabled={!validMatch}>
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={validMatch && matchPwd ? styles.valid : styles.hide}
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={validMatch || !matchPwd ? styles.hide : styles.invalid}
                  />
                </Button>
              </InputGroup>
              <Form.Text className={`text-muted ${styles.formText}`}>
                {matchFocus && !validMatch && (
                  <span>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Должно соответствовать первому полю ввода пароля.
                  </span>
                )}
              </Form.Text>
            </Form.Group>
            <Button
              className={`${styles.customButton} ${(!validName || !validEmail || !validPwd || !validMatch) ? styles.secondary : styles.primary}`}
              type="submit"
              disabled={!validName || !validEmail || !validPwd || !validMatch}
            >
              Зарегистрироваться
            </Button>
          </Form>
        </section>
      )}
    </Container>
  );
};