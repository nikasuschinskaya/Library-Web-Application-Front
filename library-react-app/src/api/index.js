import axios from "axios";

const baseUrl = `https://localhost:7187/api`;

class LibraryApi {
    
    async register(username, email, password) {
        try {
          const response = await axios.post(`${baseUrl}/authentication/register`, {
            name: username,
            email: email,
            password: password,
          });
          console.log(JSON.stringify(response.data));
          return response.data; 
        } catch (error) {
          console.error("Registration failed:", error);
          throw error.response ? error.response.data : error.message;
        }
    }

    async login(email, password) {
        try {
          const response = await axios.post(`${baseUrl}/authentication/login`, {
            email: email,
            password: password,
          });
          console.log(JSON.stringify(response.data));
          return response.data; 
        } catch (error) {
          console.error("Login failed:", error);
          throw error.response ? error.response.data : error.message;
        }
    }

    async refreshAccessToken(accessToken, refreshToken) {
        try {
          const response = await axios.post(`${baseUrl}/authentication/refresh-access-token`, {
            accessToken: accessToken,
            refreshToken: refreshToken,
          });
          return response.data; 
        } catch (error) {
          console.error("Token refresh failed:", error);
          throw error.response ? error.response.data : error.message;
        }
    }

    async getUser(userId) {
        try {
            const response = await axios.get(`${baseUrl}/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Failed to fetch user data:", error);
            throw error.response ? error.response.data : error.message;
        }
    }

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
            throw new Error("An error occurred while searching for books.");
        }
      }
    
      
    async filterBooks(genre, authorName) {
        try {
            const response = await axios.get(`${baseUrl}/book/filter?genre=${genre}&authorName=${authorName}`);
            return response.data; 
        } catch (error) {
            console.error("Error filtering books:", error);
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
            console.error("API Error:", error);
            if (error.response) {
                console.error("Server responded with status:", error.response.status);
                console.error("Response data:", error.response.data);
                throw error.response.data.message || "Failed to update book";
            } else {
                throw "Network error occurred. Please try again.";
            }
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

    async uploadImage(formData) {
        try {
            const response = await axios.post(`${baseUrl}/image/upload`, formData
                // headers: { "Content-Type": "application/json" },
            );
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || "Failed to add book image";
        }
    }
      
    async returnBook(bookId, userId) {
        try {
            await axios.put(`${baseUrl}/book/return-book`, {
                usedId: userId,
                bookId: bookId
            });
            console.log("Book returned successfully:");
        } catch (error) {
            console.error("Error returning book:", error);
            throw error.message;
        }
    }

    async takeBook(bookId, userId) {
        try {
            await axios.put(`${baseUrl}/book/take-book`, {
                bookId: bookId,
                usedId: userId
            });
            console.log("Book taken successfully:");
        } catch (error) {
            console.error("Error taking book:", error);
            throw error.message;
        }
    }
}

export default new LibraryApi();