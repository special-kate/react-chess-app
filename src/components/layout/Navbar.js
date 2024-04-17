import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { accountService } from "../../_services";
import toastr from "toastr";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const subscription = accountService.user.subscribe((x) => setUser(x));
    console.log("nav", accountService.userValue);
    console.log(window.location.pathname, accountService.userValue);
    if (window.location.pathname !== "/" && !!user) {
      toastr.error("Please sign in to play the game");
      navigate("/");
    }
    return subscription.unsubscribe();
  }, []);

  const authLinks = (
    <ul className="flex items-center">
      <li>
        <a
          href="#!"
          className="text-black hover:text-gray-300"
          onClick={() => {
            accountService.logout();
          }}
        >
          <i className="fas fa-sign-out-alt" />{" "}
          <span className="text-black hover:text-gray-300 mr-4 px-2">
            Logout
          </span>
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
          <button
            onClick={() => (window.location.href = "/")}
            className="text-black text-4xl font-bold"
          >
            <i className="fas fa-code" /> Chess
          </button>
        </h1>
        <div>{user ? authLinks : guestLinks}</div>
      </div>
    </nav>
  );
};

export default Navbar;
