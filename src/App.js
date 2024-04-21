import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/ForgotPassword";
import { VerifyEmail } from "./components/auth/VerifyEmail";
import ResetPassword from "./components/auth/ResetPassword";
import Landing from "./components/layout/Landing";
import Navbar from "./components/layout/Navbar";
import NotFound from "./components/layout/NotFound";
import { Alert } from "./components/Alert";
import Multiplayer from "./components/chess/multiplayer/Multiplayer";
import Demo from "./components/chess/stockfishBot/Demo";
import { accountService } from "./_services";
import Bot from "./components/chess/bot/Bot";
import UserPlay from "./components/chess/user/UserPlay";

function App() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    return savedDarkMode ? JSON.parse(savedDarkMode) : false;
  });

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
  };

  useEffect(() => {
    const subscription = accountService.user.subscribe((x) => setUser(x));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <Provider store={store}>
      <div className={darkMode ? "dark" : ""}>
        <div
          className="overflow-hidden container bg-cover"
          style={{
            backgroundColor: darkMode ? "rgb(0, 0, 0)" : "rgb(244, 247, 250)",
            backgroundImage: darkMode
              ? "url('./dark-bg.png')"
              : "url('./light-bg.png')",
          }}
        >
          <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <Alert />
          <Routes>
            <Route
              path="/"
              element={
                <Landing darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              }
            />
            <Route
              path="/register"
              element={
                <Register darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              }
            />
            <Route
              path="/login"
              element={
                <Login darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              }
            />
            <Route
              path="/account/verify-email"
              element={
                <VerifyEmail
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                />
              }
            />
            <Route
              path="/account/forgot-password"
              element={
                <ForgotPassword
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                />
              }
            />
            <Route
              path="/account/reset-password"
              element={
                <ResetPassword
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                />
              }
            />
            <Route
              path="/multiplayer"
              element={
                <Multiplayer
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                />
              }
            />
            <Route
              path="/stockfish"
              element={
                <Demo darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              }
            />
            <Route
              path="/bot"
              element={
                <Bot darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              }
            />
            <Route
              path="/user-play"
              element={
                <UserPlay darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              }
            />
            <Route
              path="*"
              element={
                <NotFound darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              }
            />
          </Routes>
        </div>
      </div>
    </Provider>
  );
}

export default App;
