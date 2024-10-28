import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "./components/header";

import { RegistrationPage } from "./pages/registration";
import { LoginPage } from "./pages/login";
import { UserBookPage } from "./pages/userBook";
import { BookPage } from "./pages/book";
import { BookInfoPage } from "./pages/bookInfo";
import { BookEditorPage } from "./pages/bookEditor";

import { useUserContext } from "./context/UserContext";

const App = () => {
  const { isAuth } = useUserContext();

  return (
    <BrowserRouter>
      <Header />
        <Routes>
          {!isAuth ? (
            <>
              <Route index path="/" element={<RegistrationPage />} />
              <Route path="/sign-in" element={<LoginPage />} />
            </>
          ) : (
            <>
              <Route path="/userbooks" element={<UserBookPage />} />
              <Route path="/books" element={<BookPage />} />
              <Route path="/book/:isbn" element={<BookInfoPage />} />
              <Route path="/book/edit" element={<BookEditorPage />} /> 
              <Route path="/book/edit/:id" element={<BookEditorPage />} />
            </>
          )}

         <Route path="*" element={<div>404 Not found page</div>} />
       </Routes>
    </BrowserRouter>
  );
};

export default App;