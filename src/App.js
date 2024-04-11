import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Switch,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import { ForgotPassword } from "./components/auth/ForgotPassword";
import { VerifyEmail } from "./components/auth/VerifyEmail";
import { ResetPassword } from "./components/auth/ResetPassword";
import Landing from "./components/layout/Landing";
import Navbar from "./components/layout/Navbar";
import NotFound from "./components/layout/NotFound";
import { Alert } from "./components/Alert";
import { history } from "./_helpers";
import { accountService } from "./_services";

function App() {
  useEffect(() => {
    // redirect to home if already logged in
    if (accountService.userValue) {
      history.push("/");
    }
  }, []);

  return (
    <Provider store={store}>
      <Router history={history}>
        <div
          className="overflow-hidden"
          style={{ backgroundColor: "rgb(244, 247, 250)" }}
        >
          <Navbar />
          <Alert />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/*" element={<NotFound />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login history={history} />} />
            <Route path="/account/verify-email" element={<VerifyEmail />} />
            <Route
              path="/account/forgot-password"
              element={<ForgotPassword />}
            />
            <Route path="/account/reset-password" element={<ResetPassword />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
