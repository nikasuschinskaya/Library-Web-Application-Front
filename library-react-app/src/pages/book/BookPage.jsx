import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import { Container, Row, Col, Pagination, Card, Form, Button } from "react-bootstrap";

import LibraryApi from "../../api"; 
import { bookStockStatus } from "../../config/bookStockStatus.config";
import styles from "./book.module.css";

export const BookPage = () => {
  const [books, setBooks] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTitle, setSearchTitle] = useState(''); 
  const [selectedGenre, setSelectedGenre] = useState(''); 
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [genres, setGenres] = useState([]); 
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    const fetchGenresAndAuthors = async () => {
      try {
        const genresResponse = await LibraryApi.getAllGenres(); 
        const authorsResponse = await LibraryApi.getAllAuthors(); 
        setGenres(genresResponse);
        setAuthors(authorsResponse);
      } catch (err) {
        console.error("Error fetching genres/authors", err);
      }
    };

    fetchGenresAndAuthors();
  }, []);


  useEffect(() => {
    const fetchBooks = async (pageNumber) => {
      setLoading(true);
      setError(null);
      try {
        const response = await LibraryApi.getAllBooksOnPage(pageNumber);
        setBooks(response.items); 
        setTotalPages(response.totalPages); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks(currentPage);
  }, [currentPage]);

 
  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await LibraryApi.searchBooksByTitle(searchTitle);
      setBooks(response);
      setTotalPages(1); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const handleFilter = async () => {
    try {
      setLoading(true);
      const response = await LibraryApi.filterBooks(selectedGenre, selectedAuthor);
      setBooks(response);
      setTotalPages(1); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container>
      <h2 className="my-4">Каталог книг</h2>

      <Form className="mb-4">
        <Row>
          <Col xs={12} sm={6} md={4}>
            <Form.Group>
              <Form.Label>Поиск по названию</Form.Label>
              <Form.Control
                type="text"
                placeholder="Введите название книги"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                onKeyDown={(e) => { 
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
              />
            </Form.Group>
          </Col>
          <Col xs={12} sm={3}>
            <Form.Group>
              <Form.Label>Жанр</Form.Label>
              <Form.Control
                as="select"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                <option value="">Все жанры</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.name}>{genre.name}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col xs={12} sm={3}>
            <Form.Group>
              <Form.Label>Автор</Form.Label>
              <Form.Control
                as="select"
                value={selectedAuthor}
                onChange={(e) => setSelectedAuthor(e.target.value)}
              >
                <option value="">Все авторы</option>
                {authors.map((author) => (
                  <option key={author.id} value={author.surname}>{author.name + " " + author.surname}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col xs={12} sm={6} md={4} className="mt-2">
            <Button variant="primary" onClick={handleSearch}>
              Поиск
            </Button>
            <Button variant="secondary" className="ml-2" onClick={handleFilter}>
              Фильтровать
            </Button>
          </Col>
        </Row>
      </Form>

      {loading ? (
        <p className={styles.loading}>Загрузка...</p>
      ) : error ? (
        <p className={styles.error}>Ошибка: {error}</p>
      ) : books.length === 0 ? (
        <p>Книги не найдены</p>
      ) : (
        <Row>
          {books.map((book) => (
            <Col xs={12} sm={6} md={4} className="mb-4" key={book.isbn}> 
              <Link to={`/book/${book.isbn}`} style={{ textDecoration: "none" }}>
                <Card className={styles.card}>
                  <Card.Body className={styles["card-body"]}>
                    <Card.Title>{book.name}</Card.Title>
                    <Card.Text className={styles.authors}>
                      {book.authors.map((author) => author.name + " " + author.surname).join(", ")}
                    </Card.Text>
                    <Card.Text className={book.bookStockStatus === "InStock" ? styles.inStock : styles.notInStock}>
                      {bookStockStatus[book.bookStockStatus] || "Неизвестный статус"}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      )}

    
      <div className={styles["pagination-container"]}>
        <Pagination className="justify-content-center">
          <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
          <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
          
          {[...Array(totalPages).keys()].map((page) => (
            <Pagination.Item
              key={page + 1}
              active={page + 1 === currentPage}
              onClick={() => handlePageChange(page + 1)}
            >
              {page + 1}
            </Pagination.Item>
          ))}
          
          <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
          <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
        </Pagination>
      </div>
    </Container>
  );
};