import { createContext, useContext, useState } from "react";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // Simulate OTP sending
  const sendOTP = async (phone) => {
    // In a real app, you would make an API call here
    setPhoneNumber(phone);
    setOtpSent(true);
    return true;
  };

  // Simulate OTP verification
  const verifyOTP = async (otp) => {
    // In a real app, you would verify the OTP with your backend
    if (otp === "9901") {
      // Demo OTP
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setPhoneNumber("");
    setOtpSent(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        phoneNumber,
        otpSent,
        sendOTP,
        verifyOTP,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
