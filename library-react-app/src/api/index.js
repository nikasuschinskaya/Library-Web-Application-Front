import axios from "axios";

const baseUrl = `https://localhost:7187/api`;

class LibraryApi {
    
    async getAllBooksOnPage(pageNumber) {
        try {
            const response = await axios.get(`${baseUrl}/book/all/${pageNumber}`);
            console.log(JSON.stringify(response));
            return response.data; 
        } catch (error) {
            console.error("Error fetching books for the page:", error);
            if (error.response && error.response.status === 400) {
                throw new Error("No books found on the requested page.");
            }
            throw new Error("An error occurred while fetching books.");
        }
    }

    
    async getBookInfoByISBN(ISBN) {
        try {
            const response = await axios.get(`${baseUrl}/book/book-info/${ISBN}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching book info:", error);
            if (error.response && error.response.status === 400) {
                throw new Error("Book not found.");
            }
            throw new Error("An error occurred while fetching book information.");
        }
    }

    async getBookById(id) {
        try {
            const response = await axios.get(`${baseUrl}/book/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching book:", error);
            if (error.response && error.response.status === 400) {
                throw new Error("Book not found.");
            }
            throw new Error("An error occurred while fetching book.");
        }
    }


    async getAllAuthors() {
        try {
            const response = await axios.get(`${baseUrl}/author/all`);
            return response.data; 
        } catch (error) {
            console.error("Ошибка при получении списка авторов:", error);
            throw error;
        }
    }

    async getAllGenres() {
        try {
            const response = await axios.get(`${baseUrl}/genre/all`);
            return response.data; 
        } catch (error) {
            console.error("Ошибка при получении списка жанров:", error);
            throw error;
        }
    }

    async getGenreById(id) {
        try {
            const response = await axios.get(`${baseUrl}/genre/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching genre:", error);
            if (error.response && error.response.status === 400) {
                throw new Error("Genre not found.");
            }
            throw new Error("An error occurred while fetching genre.");
        }
    }


    async searchBooksByTitle(title) {
        try {
            const response = await axios.get(`${baseUrl}/book/search/${title}`);
            return response.data; 
        } catch (error) {
            console.error("Error searching books by title:", error);
            if (error.response && error.response.status === 400) {
                throw new Error("No books found with the given title.");
            }
            throw new Error("An error occurred while searching for books.");
        }
      }
    
      
    async filterBooks(genre, authorName) {
        try {
            const response = await axios.get(`${baseUrl}/book/filter?genre=${genre}&authorName=${authorName}`);
            return response.data; 
        } catch (error) {
            console.error("Error filtering books:", error);
            if (error.response && error.response.status === 400) {
                throw new Error("No books found matching the criteria.");
            }
            throw new Error("An error occurred while filtering books.");
        }
    }

    async addBook(bookRequest) {
        try {
          const response = await axios.post(`${baseUrl}/book/add`, bookRequest, {
            headers: { "Content-Type": "application/json" },
          });
          return response.data;
        } catch (error) {
          throw error.response?.data?.message || "Failed to add book";
        }
    }
    
    async updateBook(id, bookRequest) {
        try {
          await axios.put(`${baseUrl}/book/update/${id}`, bookRequest, {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          throw error.response?.data?.message || "Failed to update book";
        }
    }
    
    async deleteBook(id) {
        try {
          await axios.delete(`${baseUrl}/book/delete/${id}`);
        } catch (error) {
          throw error.response?.data?.message || "Failed to delete book";
        }
    }
    
    async addBookImage(id, imageUrl) {
        try {
          await axios.put(`${baseUrl}/book/add-image/${id}`, imageUrl, {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          throw error.response?.data?.message || "Failed to add book image";
        }
    }
}

export default new LibraryApi();