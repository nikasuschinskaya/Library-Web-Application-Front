import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "./components/header";

import { BookPage } from "./pages/book";
import { BookInfoPage } from "./pages/bookInfo";
import { BookEditorPage } from "./pages/bookEditor";

const App = () => {
  // const { isAuth } = useUserContext();

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* {!isAuth ? (
          <>
            <Route path="/sign-up" element={<RegistrationPage />} />
            <Route path="/sign-in" element={<LoginPage />} />
          </>
        ) : (
          <>
            <Route index path="/" element={<UserPage />} />
            <Route path="/" element={<BookPage />} />
            <Route path="/book/:isbn" element={<BookInfoPage />} />
          </>
        )} */}
        <Route path="/books" element={<BookPage />} />
        <Route path="/book/:isbn" element={<BookInfoPage />} />
        <Route path="/book/edit" element={<BookEditorPage />} /> 
        <Route path="/book/edit/:id" element={<BookEditorPage />} />

        <Route path="*" element={<div>404 Not found page</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;