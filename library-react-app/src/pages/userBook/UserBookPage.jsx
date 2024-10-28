import React, { useEffect } from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import { useUserContext } from "../../context/UserContext";
import styles from "./userbook.module.css";
import { Link } from "react-router-dom";

export const UserBookPage = () => {
  const { user } = useUserContext();

  return (
    <Container className={styles.pageContainer}>
      <div className={styles.userInfo}>
        <h2>Информация о пользователе</h2>
        <p><strong>Username: </strong>{user.name}</p>
        <p><strong>Email: </strong>{user.email}</p>
        <p><strong>Role: </strong>{user.role.name}</p>
      </div>

      <h3 className={styles.sectionTitle}>Мои книги</h3>
      <Row className={styles.bookList}>
        {user.userBooks && user.userBooks.length > 0 ? (
          user.userBooks.map((userBook) => (
            <Col key={userBook.id} xs={12} md={6} lg={4}>
              <Link to={`/book/${userBook.book.isbn}`} style={{ textDecoration: "none" }}>
              <Card className={styles.bookCard} >
                <Card.Body>
                  <Card.Title className={styles["card-title"]}>{userBook.book.name}</Card.Title>
                  <Card.Text className={styles["card-text"]}><strong>Автор: </strong> 
                    {userBook.book.authors.map((author) => author.name + " " + author.surname).join(", ")}
                  </Card.Text>
                  <Card.Text className={styles["card-text"]}><strong>Дата взятия: </strong> {new Date(userBook.dateTaken).toLocaleDateString()}</Card.Text>
                  <Card.Text className={styles["card-text"]}><strong>Дата возвращения: </strong> {new Date(userBook.returnDate).toLocaleDateString()}</Card.Text>
                  <Card.Text className={styles["card-text"]}>
                    <strong>Статус: </strong> {userBook.status === "Returned" ? "возвращена" : "не возвращена"}
                  </Card.Text>
                </Card.Body>
              </Card>
              </Link>
            </Col>
          ))
        ) : (
          <p>Пока что у вас нет книг</p>
        )}
      </Row>
    </Container>
  );
};
