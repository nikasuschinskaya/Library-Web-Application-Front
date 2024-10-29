import React from "react";
import { Link } from "react-router-dom";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import LibraryApi from "../../api";
import { useUserContext } from "../../context/UserContext";
import styles from "./userbook.module.css";

export const UserBookPage = () => {
  const { user, setUser } = useUserContext();

  const handleReturnBook = async (bookId) => {
    try {
      await LibraryApi.returnBook(bookId, user.id);

      console.log("Book returned successfully");
  
      const updatedUserBooks = user.userBooks.map((ub) =>
        ub.bookId === bookId ? { ...ub, status: 1 } : ub
      );
      setUser({ ...user, userBooks: updatedUserBooks });
  
    } catch (error) {
      console.error("Error in handleReturnBook:", error.response || error.message || error);
    }
  };
  
  const activeBooks = user.userBooks.filter((userBook) => userBook.status !== 1);
  const archivedBooks = user.userBooks.filter((userBook) => userBook.status === 1);

  return (
    <Container fluid="md" className={styles.pageContainer}>
      <h3 className={styles.sectionTitle}>Мои книги</h3>
      <Row className="g-4">
        {activeBooks.length > 0 ? (
          activeBooks.map((userBook) => (
            <Col key={userBook.id} xs={12} sm={6} md={4}>
              <Link to={`/book/${userBook.book.isbn}`} style={{ textDecoration: "none" }}>
                <Card className={styles.bookCard}>
                  <Card.Body>
                    <Card.Title className={styles["card-title"]}>{userBook.book.name}</Card.Title>
                    <Card.Text className={styles["card-text"]}>
                      <strong>Автор: </strong>
                      {userBook.book.authors.map((author) => `${author.name} ${author.surname}`).join(", ")}
                    </Card.Text>
                    <Card.Text className={styles["card-text"]}>
                      <strong>Дата взятия: </strong> {new Date(userBook.dateTaken).toLocaleDateString()}
                    </Card.Text>
                    <Card.Text className={styles["card-text"]}>
                      <strong>Дата возвращения: </strong> {new Date(userBook.returnDate).toLocaleDateString()}
                    </Card.Text>
                    <Card.Text className={styles["card-text"]}>
                      <strong>Статус: </strong> {userBook.status === 1 ? "возвращена" : "не возвращена"}
                    </Card.Text>
                    {userBook.status !== 1 && (
                      <Button
                        variant="outline-danger"
                        className={styles.returnButton}
                        onClick={() => handleReturnBook(userBook.book.id)}
                      >
                        Вернуть книгу
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))
        ) : (
          <p>Пока что у вас нет активных книг</p>
        )}
      </Row>

      <h3 className={styles.sectionTitle}>Архив</h3>
      <Row className="g-4">
        {archivedBooks.length > 0 ? (
          archivedBooks.map((userBook) => (
            <Col key={userBook.id} xs={12} sm={6} md={4}>
              <Link to={`/book/${userBook.book.isbn}`} style={{ textDecoration: "none" }}>
                <Card className={styles.bookCard}>
                  <Card.Body>
                    <Card.Title className={styles["card-title"]}>{userBook.book.name}</Card.Title>
                    <Card.Text className={styles["card-text"]}>
                      <strong>Автор: </strong>
                      {userBook.book.authors.map((author) => `${author.name} ${author.surname}`).join(", ")}
                    </Card.Text>
                    <Card.Text className={styles["card-text"]}>
                      <strong>Дата взятия: </strong> {new Date(userBook.dateTaken).toLocaleDateString()}
                    </Card.Text>
                    <Card.Text className={styles["card-text"]}>
                      <strong>Дата возврата: </strong> {new Date(userBook.returnDate).toLocaleDateString()}
                    </Card.Text>
                    <Card.Text className={styles["card-text"]}>
                      <strong>Статус: </strong> возвращена
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))
        ) : (
          <p>У вас нет книг в архиве</p>
        )}
      </Row>
    </Container>
  );
};