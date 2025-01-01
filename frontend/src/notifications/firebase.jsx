// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC7c7yKBaNd3J_KALkqsI8D7tlxSHv3iBc",
  authDomain: "subjiwalenotifications.firebaseapp.com",
  projectId: "subjiwalenotifications",
  storageBucket: "subjiwalenotifications.firebasestorage.app",
  messagingSenderId: "907754311770",
  appId: "1:907754311770:web:e90582c1ab41aa9c3a4863",
  measurementId: "G-73G5TF4DP2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
// const analytics = getAnalytics(app);

export const generateToken = async () => {
  const permission = await Notification.requestPermission();
  // console.log(permission);

  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey:
        "BCjyBJMCyivLkykk_lQ9Cwm6DdeKI7H1wjWdDwdUS7T_2iy2uXMnhJmLhPRm-HngbEFxkutmzGXVqvwXdrnWIzg",
    });

    // console.log(token);
  }
};
