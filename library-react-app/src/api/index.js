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
}

export default new LibraryApi();