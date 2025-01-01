import { createContext, useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import jwtEncode from "jwt-encode";

const AuthContext = createContext({});

export function generateToken(user) {
  const secret = "your-secret-key";
  const expirationTime = Math.floor(Date.now() / 1000) + 3600;

  const payload = {
    ...user,
    exp: expirationTime,
  };

  return jwtEncode(payload, secret);
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const login = async (phone) => {
    try {
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/rest/subziwale/api/v1/user?mobileNo=%2B${phone}`
      );
      console.log(data);
      const token = generateToken(data);
      setIsAuthenticated(true);
      setUserRole(data.userType);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("userRole", data.userType);
      localStorage.setItem("isAuthenticated", "true");

      toast.success("Logged in successfully");
      return data.userType;
    } catch (error) {
      toast.error(error.response?.data || "Login failed");
      console.error(error);
      return null;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    localStorage.removeItem("isAuthenticated");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        login,
        logout,
        setUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
