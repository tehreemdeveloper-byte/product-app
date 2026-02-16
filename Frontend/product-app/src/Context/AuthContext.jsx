import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser || storedUser === "undefined") {
      return null;
    }

    try {
      
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(
    localStorage.getItem("authToken") || null
  );

  const login = (userData, tokenData) => {
      
    setUser(userData);
    setToken(tokenData);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("authToken", tokenData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.clear();
    

  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
