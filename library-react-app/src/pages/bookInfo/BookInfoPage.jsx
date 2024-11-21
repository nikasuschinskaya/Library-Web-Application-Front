import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Image, Card, Alert, Button, Modal, Form } from "react-bootstrap";

import noImage from "/images/no-image.png";
import { bookStockStatus } from "../../config/bookStockStatus.config";
import { useUserContext } from "../../context/UserContext";
import LibraryApi from "../../api";

import styles from "./bookInfo.module.css";

export const BookInfoPage = () => {
  const { isbn } = useParams();
  const navigate = useNavigate();
  const { user, setUser } = useUserContext();
  
  const [book, setBook] = useState(null);
  const [genreName, setGenreName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [hasTakenBook, setHasTakenBook] = useState(false); 

  const isAdmin = user?.role.name === "Admin";

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
  
        const userBookIds = user?.userBooks?.map((userBook) => userBook.bookId) || [];
        setHasTakenBook(userBookIds.includes(bookData.id));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchBookInfo();
  }, [isbn, user]);


  const handleTakeBook = async () => {
    if (!book) return; 

    try {
      await LibraryApi.takeBook(book.id, user.id);

      setHasTakenBook(true); 

      const updatedUser = {
        ...user,
        userBooks: [
          ...user.userBooks,
          {
            book: {
              name: book.name,
              isbn: isbn,
              authors: [{
                name: book.authors.map((author) => author.name),
                surname: book.authors.map((author) => author.surname)
              }]
            },
            bookId: book.id,
            dateTaken: new Date(),
            status: 0,
            returnDate: (() => {
              const returnDate = new Date();
              returnDate.setDate(returnDate.getDate() + 10);
              return returnDate;
            })() 
          }
        ]
      };
      
      setUser(updatedUser);
    } catch (error) {
      setError("Ошибка при взятии книги."); 
    }
  };

  const handleEditBook = () => {
    navigate(`/book/edit/${book.id}`);
  };

  const handleDeleteBook = async () => {
    try {
      await LibraryApi.deleteBook(book.id);
      alert("Книга удалена.");
      navigate("/books");
    } catch (error) {
      setError("Ошибка при удалении книги.");
    } finally {
      setShowModal(false);
    }
  };

  const handleAddBookImage = async () => {
    try {
      await LibraryApi.addBookImage(book.id, imageURL);
      setBook({ ...book, imageURL });
      setShowImageModal(false);
    } catch (error) {
      setError("Ошибка при добавлении изображения.");
    }
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
          <div className={styles.imageContainer}>
            {book.imageURL ? (
              <Image
                src={book.imageURL ? `https://localhost:7187/${book.imageURL}` : noImage}
                alt={book.name}
                className={styles.image}
                fluid
              />
            ) : (
              <div className={styles.addImageContainer} onClick={() => setShowImageModal(true)}>
                <Image src={noImage} alt="No Image Available" className={styles.image} fluid />
                {/* <Button variant="outline-primary" className={styles.addImageButton}>+</Button> */}
              </div>
            )}
          </div>
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
              {!hasTakenBook && (
                <Card.Text className={book.bookStockStatus === "InStock" ? styles["in-stock"] : styles["not-in-stock"]}>
                  {bookStockStatus[book.bookStockStatus] || "Unknown status"}
                </Card.Text>
              )}
              <div className={styles.groupButton}>
                <div className={styles.userButton}>
                  {book.bookStockStatus === "InStock" && !hasTakenBook && (
                      <Button variant="primary" className={styles.button} onClick={handleTakeBook}>Взять книгу</Button>
                    )}
                    {hasTakenBook && (
                      <span className={styles["taken-book-text"]}>Вы уже взяли эту книгу</span>
                    )}
                </div>
                {isAdmin && (
                  <div className={styles.adminButtonGroup}>
                    <Button variant="secondary" className={styles.button} onClick={handleEditBook}>Редактировать</Button>
                    <Button variant="danger" className={styles.button} onClick={() => setShowModal(true)}>Удалить</Button>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Удаление книги</Modal.Title>
        </Modal.Header>
        <Modal.Body>Вы уверены, что хотите удалить эту книгу?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Нет</Button>
          <Button variant="danger" onClick={handleDeleteBook}>Да</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showImageModal} onHide={() => setShowImageModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Добавить изображение книги</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="imageUrl">
            <Form.Label>Введите URL изображения</Form.Label>
            <Form.Control
              type="text"
              placeholder="URL изображения"
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowImageModal(false)}>Отмена</Button>
          <Button variant="primary" onClick={handleAddBookImage}>Добавить</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};