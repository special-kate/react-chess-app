import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { accountService, alertService } from "../../_services";

function Login({ history }) {
  console.log("hi", history);
  const [imageHeight, setImageHeight] = useState(0);
  const imageRef = useRef(null);

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Email is invalid").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  function onSubmit({ email, password }, { setSubmitting }) {
    alertService.clear();
    accountService
      .login(email, password)
      .then(() => {
        // const { from } = window.location.state || { from: { pathname: "/" } };
        // history.push("/");
        window.location.href = "/";
      })
      .catch((error) => {
        setSubmitting(false);
        alertService.error(error);
      })
      .finally(() => {
        setSubmitting(false);
      });
  }

  useEffect(() => {
    const divHeight = document.querySelector(".login").offsetHeight;
    setImageHeight(divHeight);
  }, []);

  return (
    <div className="login grid grid-cols-2 px-20" style={{ height: "87vh" }}>
      <div className="flex justify-center items-center">
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
        {({ errors, touched, isSubmitting, handleSubmit }) => (
          <Form>
            <div className="flex flex-1 flex-col justify-center lg:px-8 px-10 py-10 mt-5">
              <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="text-center text-3xl font-bold leading-9 tracking-tight text-gray-900">
                  Sign in to your account
                </h2>
              </div>

              <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Email address
                    </label>
                    <div className="mt-2">
                      <Field
                        name="email"
                        type="text"
                        className={
                          "block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" +
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
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Password
                      </label>
                      <div className="text-sm">
                        <Link
                          to="forgot-password"
                          className="font-semibold text-indigo-600 hover:text-indigo-500"
                        >
                          Forgot Password?
                        </Link>
                      </div>
                    </div>
                    <div className="mt-2">
                      <Field
                        name="password"
                        type="password"
                        className={
                          "block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" +
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

                  <div className="flex">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-col w-full mt-2 mr-2 items-center justify-center rounded-md bg-indigo-600 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      {" "}
                      {isSubmitting && (
                        <span className="inline-block animate-spin rounded-full border-t-2 border-white-900 mr-3 w-4 h-4"></span>
                      )}
                      Sign in
                    </button>
                    <Link
                      to="/register"
                      className="flex-col w-full mt-2 text-center justify-center rounded-md bg-indigo-600 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Register
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

export default Login;
