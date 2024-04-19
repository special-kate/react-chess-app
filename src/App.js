import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Switch,
  useNavigate,
} from "react-router-dom";
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
  useEffect(() => {
    const subscription = accountService.user.subscribe((x) => setUser(x));
    return subscription.unsubscribe();
  }, []);

  return (
    <Provider store={store}>
      <div
        className="overflow-hidden container bg-cover"
        style={{
          backgroundColor: "rgb(244, 247, 250)",
          backgroundImage: "url('./bg4.png')",
        }}
      >
        <Navbar />
        <Alert />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/*" element={<NotFound />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account/verify-email" element={<VerifyEmail />} />
          <Route path="/account/forgot-password" element={<ForgotPassword />} />
          <Route path="/account/reset-password" element={<ResetPassword />} />
          <Route path="/multiplayer" element={<Multiplayer />} />
          <Route path="/stockfish" element={<Demo />} />
          <Route path="/bot" element={<Bot />} />
          <Route path="/user-play" element={<UserPlay />} />
        </Routes>
      </div>
    </Provider>
  );
}

export default App;
