import { createContext, useContext, useState } from "react";

const LoginContext = createContext();

export function LoginProvider({ children }) {

  const [isLogin, setIsLogin] = useState(
    !!localStorage.getItem("accessToken")
  );


  const login = (accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    setIsLogin(true);
  };


  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    setIsLogin(false);
  };


  return (
    <LoginContext.Provider
      value={{
        isLogin,
        login,
        logout
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}


export function useLogin() {
  return useContext(LoginContext);
}