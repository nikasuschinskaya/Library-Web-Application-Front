import { createContext, useContext, useEffect, useState } from "react";

const INITIAL_STATE = {
  isAuth: false,
  setIsAuth: () => {},
  user: {},
  setUser: () => {},
  tokens: { accessToken: "", refreshToken: "" },
  setTokens: () => {},
};

const UserContext = createContext(INITIAL_STATE);

export function UserProvider({ children }) {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState({ accessToken: "", refreshToken: "" });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedTokens = localStorage.getItem("tokens");

    if (storedUser && storedTokens) {
      setUser(JSON.parse(storedUser));
      setTokens(JSON.parse(storedTokens));
      setIsAuth(true);
    }
  }, []);

  const updateTokens = (newTokens) => {
    setTokens(newTokens);
    localStorage.setItem("tokens", JSON.stringify(newTokens));
  };

  const updateUser = (newUser) => {
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    setIsAuth(true);
  };

  const value = {
    isAuth,
    setIsAuth,
    user,
    setUser: updateUser,
    tokens,
    setTokens: updateTokens,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUserContext = () => useContext(UserContext);