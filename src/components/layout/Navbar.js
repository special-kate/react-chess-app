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
        <Link
          to="/register"
          className="text-black hover:text-gray-300 mr-4 px-2"
        >
          Register
        </Link>
      </li>
      <li>
        <Link to="/login" className="text-black hover:text-gray-300 px-2">
          Sign In
        </Link>
      </li>
    </ul>
  );

  return (
    <nav
      className="p-4 bg-white text-black shadow-md"
      style={{ height: "13vh" }}
    >
      <div className="container mx-auto px-20 flex justify-between items-center">
        <h1 className="text-black">
          <Link to="/" className="text-black text-4xl font-bold">
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
