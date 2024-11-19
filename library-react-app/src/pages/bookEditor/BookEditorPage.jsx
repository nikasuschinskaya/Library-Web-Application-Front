import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";
import LibraryApi from "../../api";
import styles from "./bookEditor.module.css";

export const BookEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // const [bookData, setBookData] = useState({
  //   name: "",
  //   isbn: "",
  //   description: "",
  //   genre: "",
  //   count: 1,
  //   authors: [],
  // });

  const [bookData, setBookData] = useState({
    name: "",
    isbn: "",
    description: "",
    genre: "",
    count: 1,
    authors: [],
    imageUrl: ""
  });
  

  const [originalBookData, setOriginalBookData] = useState(null);
  const [allAuthors, setAllAuthors] = useState([]);
  const [allGenres, setAllGenres] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const authors = await LibraryApi.getAllAuthors();
        setAllAuthors(authors);
      } catch (err) {
        setError("Не удалось загрузить авторов.");
      }
    };

    const fetchGenres = async () => {
      try {
        const genres = await LibraryApi.getAllGenres();
        setAllGenres(genres);
      } catch (err) {
        setError("Не удалось загрузить жанры.");
      }
    };

    fetchAuthors();
    fetchGenres();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchBook = async () => {
        try {
          const book = await LibraryApi.getBookById(id);
          const authors = (book.authors || []).map((author) => author.id);

          setBookData({
            name: book.name || "",
            isbn: book.isbn || "",
            description: book.description || "",
            genre: book.genreId || "", 
            count: book.count || 1,
            authors: authors,
          });

          setOriginalBookData({ ...bookData });
          setSelectedAuthors(authors);

        } catch (err) {
          setError("Не удалось загрузить информацию о книге.");
        }
      };
      fetchBook();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const hasChanges = JSON.stringify(bookData) !== JSON.stringify(originalBookData);
    if (!hasChanges) {
      alert("Нет изменений для сохранения.");
      setLoading(false);
      return;
    }

    const bookUpdateRequest = {
      name: bookData.name,
      isbn: bookData.isbn,
      description: bookData.description,
      genreId: bookData.genre,
      count: bookData.count,
      authors: selectedAuthors.map(id => allAuthors.find(author => author.id === id))
    };

    const bookAddRequest = {
      name: bookData.name,
      isbn: bookData.isbn,
      description: bookData.description,
      imageURL: bookData.imageUrl,
      genreId: bookData.genre,
      count: bookData.count,
      authorIds: selectedAuthors
    };

    console.log("Selected Authors:", selectedAuthors);
    console.log("Book Update Request Data:", bookUpdateRequest);
    console.log("Book Add Request Data:", bookAddRequest);

    try {
      if (id) {
        await LibraryApi.updateBook(id, bookUpdateRequest);
        alert("Книга успешно обновлена.");
      } else {
        await LibraryApi.addBook(bookAddRequest);
        alert("Книга успешно добавлена.");
      }
      navigate("/books");
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAuthorSelect = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedAuthors(selectedOptions); 
  };  

  const isFormValid = () => {
    return (
      bookData.name &&
      bookData.isbn &&
      bookData.genre &&
      bookData.count > 0 &&
      selectedAuthors.length > 0
    );
  };

  const isSubmitDisabled = !isFormValid() || loading;

  return (
    <Container className={styles.formContainer}>
      <h2>{id ? "Редактирование книги" : "Добавление новой книги"}</h2>
      {error && <Alert variant="danger" className={styles.alert}>{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="name" className="mb-3">
          <Form.Label className={styles.formLabel}>Название книги</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={bookData.name}
            onChange={handleChange}
            className={styles.formControl}
            placeholder="Введите название книги"
            required
          />
        </Form.Group>

        <Form.Group controlId="isbn" className="mb-3">
          <Form.Label className={styles.formLabel}>ISBN</Form.Label>
          <Form.Control
            type="text"
            name="isbn"
            value={bookData.isbn}
            onChange={handleChange}
            className={styles.formControl}
            placeholder="Введите ISBN книги. Пример: 978-5-389-09917-3"
            required
          />
        </Form.Group>

        <Form.Group controlId="description" className="mb-3">
          <Form.Label className={styles.formLabel}>Описание</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={bookData.description}
            onChange={handleChange}
            rows={3}
            className={styles.formControl}
            placeholder="Введите подробное описание / аннотацию книги"
          />
        </Form.Group>

        <Form.Group controlId="genre" className="mb-3">
          <Form.Label className={styles.formLabel}>Жанр</Form.Label>
          <Form.Control
            as="select"
            name="genre"
            value={bookData.genre}
            onChange={handleChange}
            className={styles.formControl}
            required
          >
            <option value="" disabled>
              Выберите жанр
            </option>
            {allGenres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="count" className="mb-3">
          <Form.Label className={styles.formLabel}>Количество экземпляров</Form.Label>
          <Form.Control
            type="number"
            name="count"
            value={bookData.count}
            onChange={handleChange}
            min="1"
            className={styles.formControl}
            required
          />
        </Form.Group>

        <Form.Group controlId="authors" className="mb-3">
          <Form.Label className={styles.formLabel}>Авторы</Form.Label>
          <Form.Control
            as="select"
            multiple
            value={selectedAuthors}
            onChange={handleAuthorSelect}
            className={styles.selectAuthor}
            required
          >
            {allAuthors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name} {author.surname}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        {id === undefined && (
          <Form.Group controlId="imageUrl" className="mb-3">
            <Form.Label className={styles.formLabel}>Ссылка на изображение</Form.Label>
            <Form.Control
              type="url"
              name="imageUrl"
              value={bookData.imageUrl || ""}
              onChange={handleChange}
              className={styles.formControl}
              placeholder="Введите URL изображения книги (необязательно)"
            />
          </Form.Group>
        )}

        <Button variant="primary" type="submit" className={styles.submitButton} disabled={isSubmitDisabled}>
          {loading ? "Сохранение..." : id ? "Сохранить изменения" : "Добавить книгу"}
        </Button>
      </Form>
    </Container>
  );
};