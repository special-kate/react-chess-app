import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { accountService } from "../../_services";
import toastr from "toastr";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const subscription = accountService.user.subscribe((x) => setUser(x));

    // Check if the user is authenticated
    if (
      (window.location.pathname === "/bot" ||
        window.location.pathname === "/multiplayer") &&
      !accountService.userValue
    ) {
      toastr.error("Please sign in to play the game");
      navigate("/");
      return; // Exit early if user is not authenticated
    }

    return subscription.unsubscribe();
  }, [window.location.pathname]);

  const authLinks = (
    <ul
      className={`flex items-center ${darkMode ? "text-white" : "text-black"}`}
    >
      <li>
        <a
          href="#!"
          className="hover:text-gray-300"
          onClick={() => {
            accountService.logout();
          }}
        >
          <i className="fas fa-sign-out-alt" />{" "}
          <span className="hover:text-gray-300 mr-4 px-2">Logout</span>
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul
      className={`flex items-center ${darkMode ? "text-white" : "text-black"}`}
    >
      <li>
        <Link to="/register" className="hover:text-gray-300 mr-4 px-2">
          Register
        </Link>
      </li>
      <li>
        <Link to="/login" className="hover:text-gray-300 px-2">
          Sign In
        </Link>
      </li>
    </ul>
  );

  return (
    <nav
      className={`p-4 ${
        darkMode ? "text-white bg-black shadow-blue-500" : "text-black bg-white"
      } shadow-md`}
      style={{ height: "13vh" }}
    >
      <div className="container mx-auto px-20 flex justify-between items-center">
        <h1 className={darkMode ? "text-white" : "text-black"}>
          <button
            onClick={() => navigate("/")}
            className={`text-4xl font-bold ${
              darkMode ? "text-white" : "text-black"
            }`}
          >
            <i className="fas fa-code" /> Chess
          </button>
        </h1>
        <div className="flex">
          <button className="px-3 rounded-md" onClick={toggleDarkMode}>
            {darkMode ? (
              <FontAwesomeIcon
                icon={faSun}
                className="mr-2 text-yellow-300 text-lg"
              />
            ) : (
              <FontAwesomeIcon icon={faMoon} className="mr-2" />
            )}
          </button>
          <div>{user ? authLinks : guestLinks}</div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
