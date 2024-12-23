import { createContext, useContext, useState } from "react";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Simulate OTP sending
  const sendOTP = async (phone) => {
    // In a real app, you would make an API call here
    setPhoneNumber(phone);
    setOtpSent(true);
    return true;
  };

  // Simulate OTP verification
  const verifyOTP = async (otp) => {
    if (otp === "9901") {
      setIsAuthenticated(true);
      setUserRole(import.meta.env.VITE_USER_ROLE);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setPhoneNumber("");
    setOtpSent(false);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        phoneNumber,
        otpSent,
        userRole,
        sendOTP,
        verifyOTP,
        logout,
        setUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
