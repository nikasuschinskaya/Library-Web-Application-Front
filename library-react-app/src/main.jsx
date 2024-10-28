import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import { UserProvider } from "./context/UserContext.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/styles/main.global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);
