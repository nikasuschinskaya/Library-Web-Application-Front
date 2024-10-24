import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Image, Card, Alert } from "react-bootstrap";

import noImage from "/images/no-image.png";

import { bookStockStatus } from "../../config/bookStockStatus.config";

import LibraryApi from "../../api"; 


export const BookInfoPage = () => {
  const { isbn } = useParams(); 
  const [book, setBook] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchBookInfo = async () => {
      setLoading(true);
      setError(null);

      try {
        const bookData = await LibraryApi.getBookInfoByISBN(isbn);
        setBook(bookData);
      } catch (err) {
        setError(err.message); 
      } finally {
        setLoading(false); 
      }
    };

    fetchBookInfo(); 
  }, [isbn]);

  if (loading) {
    return <p>Loading...</p>; 
  }

  if (error) {
    return <Alert variant="danger">Error: {error}</Alert>; 
  }

  if (!book) {
    return <p>No book found.</p>; 
  }

  return (
    <Container className="my-4">
      <Row>
        <Col md={4}>
          {/* Отображаем картинку, если URL не пустой */}
          {book.imageURL ? (
            <Image src={book.imageURL} alt={book.name} fluid />
          ) : (
            <Image src={noImage} alt="No Image Available" fluid />
          )}
        </Col>
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>{book.name}</Card.Title>
              <Card.Text>
                <strong>Автор:</strong> {book.authors.map((author) => author.name + " " + author.surname).join(", ")}
              </Card.Text>
              <Card.Text><strong>ISBN:</strong> {book.isbn}</Card.Text>
              <Card.Text><strong>Жанр:</strong> {book.genre}</Card.Text>
              <Card.Text><strong>Описание:</strong> {book.description}</Card.Text>
              <Card.Text>
                 {bookStockStatus[book.bookStockStatus] || "Unknown status"}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};