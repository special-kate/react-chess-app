import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Switch,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Landing from "./components/layout/Landing";
import Navbar from "./components/layout/Navbar";
import NotFound from "./components/layout/NotFound";
import { LOGOUT } from "./actions/types";

function App() {
  useEffect(() => {
    // check for token in LS when app first runs
    if (localStorage.token) {
      // if there is a token set axios headers for all requests
      setAuthToken(localStorage.token);
    }
    // try to fetch a user, if no token or invalid token we
    // will get a 401 response from our API
    store.dispatch(loadUser());

    // log user out from all tabs if they log out in one tab
    window.addEventListener("storage", () => {
      if (!localStorage.token) store.dispatch({ type: LOGOUT });
    });
  }, []);

  return (
    <Provider store={store}>
      <div
        className="overflow-hidden"
        style={{ backgroundColor: "rgb(244, 247, 250)" }}
      >
        <Router>
          <Navbar />
          <Routes>
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="/" element={<Landing />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </Router>
      </div>
    </Provider>
  );
}

export default App;
