import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Image, Card, Alert, Button } from "react-bootstrap";

import noImage from "/images/no-image.png";
import { bookStockStatus } from "../../config/bookStockStatus.config";
import LibraryApi from "../../api";

import styles from "./bookInfo.module.css";

export const BookInfoPage = () => {
  const { isbn } = useParams();
  const [book, setBook] = useState(null);
  const [genreName, setGenreName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookInfo = async () => {
      setLoading(true);
      setError(null);

      try {
        const bookData = await LibraryApi.getBookInfoByISBN(isbn);
        setBook(bookData);

        if (bookData.genreId) {
          const genre = await LibraryApi.getGenreById(bookData.genreId);
          setGenreName(genre.name);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookInfo();
  }, [isbn]);

  const handleTakeBook = () => {
    console.log("Взять книгу:", book.name); //зашлушка
  };

  const handleEditBook = () => {
    console.log("Редактировать книгу:", book.name); //зашлушка
  };

  const handleDeleteBook = () => {
    console.log("Удалить книгу:", book.name); //зашлушка
  };

  if (loading) {
    return <p className={styles.loading}>Loading...</p>;
  }

  if (error) {
    return <Alert variant="danger" className={styles["alert-danger"]}>Error: {error}</Alert>;
  }

  if (!book) {
    return <p className={styles.error}>No book found.</p>;
  }

  return (
    <Container className="my-4">
      <Row>
        <Col md={4}>
          {book.imageURL ? (
            <Image src={book.imageURL} alt={book.name} className={styles.image} fluid />
          ) : (
            <Image src={noImage} alt="No Image Available" className={styles.image} fluid />
          )}
        </Col>
        <Col md={8}>
          <Card className={styles.card}>
            <Card.Body>
              <Card.Title className={styles["card-title"]}>{book.name}</Card.Title>
              <Card.Text className={styles["card-text"]}>
                <strong>Автор:</strong> {book.authors.map((author) => author.name + " " + author.surname).join(", ")}
              </Card.Text>
              <Card.Text className={styles["card-text"]}>
                <strong>ISBN:</strong> {book.isbn}
              </Card.Text>
              <Card.Text className={styles["card-text"]}>
                <strong>Жанр:</strong> {genreName || "Unknown genre"}
              </Card.Text>
              <Card.Text className={styles["card-text"]}>
                <strong>Описание:</strong> {book.description}
              </Card.Text>
              <Card.Text className={book.bookStockStatus === "InStock" ? styles["in-stock"] : styles["not-in-stock"]}>
                {bookStockStatus[book.bookStockStatus] || "Unknown status"}
              </Card.Text>

              <div className={styles.buttonGroup}>
                <Button variant="primary" className={styles.button} onClick={handleTakeBook}>Взять книгу</Button>
                <Button variant="secondary" className={styles.button} onClick={handleEditBook}>Редактировать</Button>
                <Button variant="danger" className={styles.button} onClick={handleDeleteBook}>Удалить</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};