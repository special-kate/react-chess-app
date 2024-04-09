import React, { useEffect, useState, useRef } from "react";
import { Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { login } from "../../actions/auth";

function Login() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [imageHeight, setImageHeight] = useState(0);
  const imageRef = useRef(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  useEffect(() => {
    const divHeight = document.querySelector(".landing").offsetHeight;
    setImageHeight(divHeight);
  }, []);

  return (
    <div className="landing grid grid-cols-2 px-20" style={{ height: "87vh" }}>
      <div className="flex justify-center items-center">
        <img
          ref={imageRef}
          src="bg_chesspanel.png"
          alt="chesspanel"
          className="rounded-lg py-3 ml-10"
          style={{ height: imageHeight, objectFit: "cover" }}
        />
      </div>
      <div className="flex flex-col justify-center p-10">
        <section className="container">
          <h1 className="large text-primary">Sign In</h1>
          <p className="lead">
            <i className="fas fa-user" /> Sign Into Your Account
          </p>
          <form className="form" onSubmit={onSubmit}>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email Address"
                name="email"
                value={email}
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={onChange}
                minLength="6"
              />
            </div>
            <input type="submit" className="btn btn-primary" value="Login" />
          </form>
          <p className="my-1">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>
        </section>
      </div>
    </div>
  );
}

export default Login;
