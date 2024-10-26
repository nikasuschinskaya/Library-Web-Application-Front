import { useLocation, useNavigate } from "react-router-dom";
import { Button, Container, Navbar, Form, Nav } from "react-bootstrap";
// import { useUserContext } from "../context/UserContext";
import styles from "./header.module.css";

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/sign-in');
  };

  // const isLoginOrRegisterPage = location.pathname === "/sign-up" || location.pathname === "/sign-in";

  return (
    <>
      <Navbar
        collapseOnSelect
        expand="md"
        className={`w-100 d-flex align-items-center justify-content-between fixed-top ${styles.navbar}`}
      >
        <Container>
          {/* {isLoginOrRegisterPage ? (
            <Navbar.Brand className={`d-flex align-items-center gap-3 ${styles.brand}`}>
              <img src="/images/library-logo.png" height="40" width="40" alt="Logo" />
              Library
            </Navbar.Brand>
          ) : (
            <> */}
              <Navbar.Brand href='/' className={`d-flex align-items-center gap-3 ${styles.brand}`}>
                <img src="/images/library-logo.png" height="40" width="40" alt="Logo" />
                 Library
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id='responsive-navbar-nav'>
                <Nav className='me-auto'>
                  <Nav.Link href='/books' className={styles.navlink}> Каталог книг </Nav.Link>
                  <Nav.Link href='/book/edit' className={styles.navlink}> Добавить книгу </Nav.Link>
                </Nav>
                <Form className='d-flex'>
                  <Button variant="outline-info" onClick={handleLogout} className={styles.customButton}>
                    Выйти
                  </Button>
                </Form>
              </Navbar.Collapse>
            {/* </>
          )}
          <Form className="d-flex">
            {location.pathname === "/sign-up" && (
              <Button variant="outline-info" href="/login" className={styles.customButton}>
                Войти
              </Button>
            )}
            {location.pathname === "/sign-in" && (
              <Button variant="outline-info" href="/" className={styles.customButton}>
                Регистрация
              </Button>
            )}
          </Form> */}
        </Container>
      </Navbar>
    </>
  );
};

// import React from 'react';
// import { Link } from 'react-router-dom';

// import styles from './header.module.css';

// export const Header = () => {
//   return (
//     <header className={styles.header}>
//       <h1 className={styles.title}>Book Library</h1>
//       {/* <nav className='nav'>
//         <Link to='/'>Главная страница</Link>
//         <Link to='todo'>Список дел</Link>
//       </nav> */}
//     </header>
//   );
// }