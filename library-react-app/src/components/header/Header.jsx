import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Container, Navbar, Form, Nav } from "react-bootstrap";

import { useUserContext } from "../../context/UserContext";

import styles from "./header.module.css";

const getUserFromLocalStorage = () => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
};

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser, setIsAuth, setTokens } = useUserContext();

  useEffect(() => {
    if (!user?.email) {
      const storedUser = getUserFromLocalStorage();
      if (storedUser) {
        setUser(storedUser);
      }
    }
  }, [user, setUser]);

  const userEmail = user?.email || getUserFromLocalStorage()?.email || "";

  const handleLogout = () => {
    setIsAuth(false);
    setUser({});
    setTokens({ accessToken: "", refreshToken: "" });

    localStorage.removeItem("user");
    localStorage.removeItem("tokens");

    navigate("/sign-in");
  };

  const isLoginOrRegisterPage = location.pathname === "/" || location.pathname === "/sign-in";

  return (
    <Navbar
      collapseOnSelect
      expand="md"
      className={`w-100 d-flex align-items-center justify-content-between fixed-top ${styles.navbar}`}
    >
      <Container>
        {isLoginOrRegisterPage ? (
          <Navbar.Brand className={`d-flex align-items-center gap-3 ${styles.brand}`}>
            <img src="/images/library-logo.png" height="40" width="40" alt="Logo" />
            Library
          </Navbar.Brand>
        ) : (
          <>
            <Navbar.Brand href="/userbooks" className={`d-flex align-items-center gap-3 ${styles.brand}`}>
              <img src="/images/library-logo.png" height="40" width="40" alt="Logo" />
              Library
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/books" className={styles.navlink}>Каталог книг</Nav.Link>
                <Nav.Link href="/userbooks" className={styles.navlink}>Мои книги</Nav.Link>
              </Nav>
              <Form className="d-flex align-items-center">
                <span className={styles.userEmail}>{userEmail}</span>
                <Button variant="outline-info" onClick={handleLogout} className={styles.customButton}>
                  Выйти
                </Button>
              </Form>
            </Navbar.Collapse>
          </>
        )}
        <Form className="d-flex">
          {location.pathname === "/" && (
            <Button variant="outline-info" href="/sign-in" className={styles.customButton}>
              Войти
            </Button>
          )}
          {location.pathname === "/sign-in" && (
            <Button variant="outline-info" href="/" className={styles.customButton}>
              Регистрация
            </Button>
          )}
        </Form>
      </Container>
    </Navbar>
  );
};