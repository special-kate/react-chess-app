import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const authLinks = (
    <ul className="flex items-center">
      <li>
        <a
          href="#!"
          className="text-white hover:text-gray-300"
          onClick={() => {}}
        >
          <i className="fas fa-sign-out-alt" />{" "}
          <span className="hidden sm:inline">Logout</span>
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul className="flex items-center">
      <li>
        <Link to="/register" className="text-white hover:text-gray-300 mr-4">
          Register
        </Link>
      </li>
      <li>
        <Link to="/login" className="text-white hover:text-gray-300">
          Login
        </Link>
      </li>
    </ul>
  );

  return (
    <nav className="bg-gray-800 p-4" style={{ height: "13vh" }}>
      <div className="container mx-auto px-20 flex justify-between items-center">
        <h1 className="text-white">
          <Link to="/" className="text-white text-3xl font-bold">
            <i className="fas fa-code" /> Chess
          </Link>
        </h1>
        <div>{guestLinks}</div>
        {/* <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment> */}
      </div>
    </nav>
  );
};

export default Navbar;
