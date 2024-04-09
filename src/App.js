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
import Landing from "./components/layout/Landing";
import Navbar from "./components/layout/Navbar";
import NotFound from "./components/layout/NotFound";

function App() {
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
