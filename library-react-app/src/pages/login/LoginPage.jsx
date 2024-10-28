import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Form, InputGroup, FormControl, Alert } from "react-bootstrap";

import { useUserContext } from "../../context/UserContext";
import LibraryApi from "../../api";

import { decodeJwt } from "../../utils/jwtDecode";

import styles from "./login.module.css";


export const LoginPage = () => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const { setTokens, setUser } = useUserContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !pwd) {
      setErrMsg("Поля не могут быть пустыми");
      return;
    }

    try {
      const { accessToken, refreshToken } = await LibraryApi.login(email, pwd);
      setTokens({ accessToken, refreshToken });

      const { id: userId } = decodeJwt(accessToken);
      const userData = await LibraryApi.getUser(userId);
      setUser(userData);

      setSuccess(true);
      setEmail("");
      setPwd("");
      navigate("/userbooks");
    } catch (error) {
      setErrMsg(error.message || "Login failed");
    }
  };

  const validateForm = () => {
    setIsFormValid(email.trim() !== "" && pwd.trim() !== "");
  };

  useEffect(() => {
    validateForm();
  }, [email, pwd]);



  return (
    <Container className="d-flex align-items-center justify-content-center">
      {success ? (
        navigate("/user")
      ) : (
        <section className={styles.root}>
          <Alert variant="danger" show={errMsg !== ""}>
            {errMsg}
          </Alert>
          <h2 className={styles.logLabel}>Вход</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="loginEmail">
              <Form.Label className={styles.formLabel}>Электронная почта:</Form.Label>
              <InputGroup>
                <FormControl
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3" controlId="loginPassword">
              <Form.Label className={styles.formLabel}>Пароль:</Form.Label>
              <InputGroup>
                <FormControl
                  type="password"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                />
              </InputGroup>
            </Form.Group>
            <Button
              className={`${styles.customButton} ${!isFormValid ? styles.secondary : styles.primary} w-100`}
              type="submit" 
              disabled={!isFormValid}>
              Войти
            </Button>
          </Form>
        </section>
      )}
    </Container>
  );
};
