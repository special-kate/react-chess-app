import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { accountService, alertService } from "../../_services";
import toastr from "toastr";

function Register({ darkMode }) {
  const [imageHeight, setImageHeight] = useState(0);
  const imageRef = useRef(null);
  const navigate = useNavigate();
  const initialValues = {
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Email is invalid").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  function onSubmit(fields, { setStatus, setSubmitting }) {
    setStatus();
    accountService
      .register(fields)
      .then((res) => {
        setSubmitting(false);
        if (res.already) {
          toastr.error(res.msg);
        } else {
          accountService
            .verifyEmail(res.msg.split("=")[1])
            .then(() => {
              navigate("/login");
              toastr.success("Successfully registered.");
            })
            .catch((err) => {
              toastr.error("Email verification failed. Please try again.");
              toastr.error(err);
            });
        }
      })
      .catch((error) => {
        setSubmitting(false);
        toastr.error("first step", error);
      });
  }

  useEffect(() => {
    const divHeight = document.querySelector(".register").offsetHeight;
    setImageHeight(divHeight);
  }, []);

  return (
    <div
      className="register grid grid-cols-1 md:grid-cols-2 px-20"
      style={{ height: "87vh" }}
    >
      <div className="md:flex justify-center items-center">
        <img
          ref={imageRef}
          src="bg_chesspanel.png"
          alt="chesspanel"
          className="rounded-lg p-9 ml-10"
          style={{ height: imageHeight, objectFit: "cover" }}
        />
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="md:mx-auto md:w-full md:max-w-md">
            <div className="flex flex-1 flex-col justify-center lg:px-8 px-10 py-10 md:mt-5">
              <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2
                  className={`${
                    darkMode ? "text-white" : "text-gray-900"
                  } text-center text-3xl font-bold leading-9 tracking-tight `}
                >
                  Create a new account
                </h2>
              </div>

              <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className={`block text-sm font-medium leading-6 ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Email address
                    </label>
                    <div>
                      <Field
                        name="email"
                        type="text"
                        className={
                          "block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" +
                          (errors.email && touched.email ? " is-invalid" : "")
                        }
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="invalid-feedback text-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className={`block text-sm font-medium leading-6 ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Password
                      </label>
                    </div>
                    <div>
                      <Field
                        name="password"
                        type="password"
                        className={
                          "block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" +
                          (errors.password && touched.password
                            ? " is-invalid"
                            : "")
                        }
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="invalid-feedback text-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className={`block text-sm font-medium leading-6 ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Confirm Password
                      </label>
                    </div>
                    <div>
                      <Field
                        name="confirmPassword"
                        type="password"
                        className={
                          "block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" +
                          (errors.confirmPassword && touched.confirmPassword
                            ? " is-invalid"
                            : "")
                        }
                      />
                      <ErrorMessage
                        name="confirmPassword"
                        component="div"
                        className="invalid-feedback text-red-500"
                      />
                    </div>
                  </div>

                  <div className="flex">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`flex-col w-full mr-2 items-center justify-center rounded-md bg-indigo-600 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                        isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSubmitting && (
                        <span className="inline-block animate-spin rounded-full border-t-2 border-white-900 mr-3 w-4 h-4"></span>
                      )}
                      Register
                    </button>
                    <Link
                      to="/login"
                      className={`flex-col w-full text-center justify-center rounded-md bg-indigo-600 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                        isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      Cancel
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Register;
