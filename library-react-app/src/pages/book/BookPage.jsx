import React, { useEffect, useState } from "react";
import { Container, Row, Col, Pagination, Card } from "react-bootstrap";
import LibraryApi from "../../api"; 
import { Link } from "react-router-dom"; 

export const BookPage = () => {
  const [books, setBooks] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container>
      <h1 className="my-4">Book List</h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-danger">Error: {error}</p>
      ) : books.length === 0 ? (
        <p>No books available</p>
      ) : (
        <Row>
          {books.map((book) => (
            <Col xs={12} sm={6} md={4} lg={3} className="mb-4" key={book.isbn}>
              <Link to={`/book/${book.isbn}`} style={{ textDecoration: "none" }}>
                <Card>
                  <Card.Body>
                    <Card.Title>{book.name}</Card.Title>
                    <Card.Text>
                        {book.authors.map((author) => author.name + " " + author.surname).join(", ")}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      )}

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
    </Container>
  );
};

export default BookPage;