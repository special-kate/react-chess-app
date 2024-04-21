import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import queryString from "query-string";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { accountService, alertService } from "../../_services";
import toastr from "toastr";

function ResetPassword({ darkMode }) {
  const TokenStatus = {
    Validating: "Validating",
    Valid: "Valid",
    Invalid: "Invalid",
  };

  const [token, setToken] = useState(null);
  const [tokenStatus, setTokenStatus] = useState(TokenStatus.Validating);
  const navigate = useNavigate();

  function getForm() {
    const initialValues = {
      password: "",
      confirmPassword: "",
    };

    const validationSchema = Yup.object().shape({
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
    });

    function onSubmit({ password, confirmPassword }, { setSubmitting }) {
      alertService.clear();
      accountService
        .resetPassword({ token, password, confirmPassword })
        .then(() => {
          toastr.success("Successfully reset your password.");
          navigate("/login");
        })
        .catch((error) => {
          setSubmitting(false);
          toastr.error(error);
        });
    }

    return (
      <div
        className={`reset-password grid grid-cols-1 md:grid-cols-2 px-20 ${
          darkMode ? "dark" : ""
        }`}
        style={{ height: "87vh" }}
      >
        <div className=" md:flex justify-center items-center">
          <img
            src={`${window.location.pathname.split("/")[0]}/bg_chesspanel.png`}
            alt="chesspanel"
            className="rounded-lg p-9 ml-10"
            style={{ height: "87vh", objectFit: "cover" }}
          />
        </div>
        <div className="flex flex-col justify-center lg:px-8 px-10 py-10 mt-5">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2
              className={`${
                darkMode ? "text-white" : "text-gray-900"
              } text-center text-3xl font-bold leading-9 tracking-tight `}
            >
              Reset Password
            </h2>
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6">
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
                        htmlFor="confirmPassword"
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
                      className={`flex-col w-full mt-2 mr-2 items-center justify-center rounded-md bg-indigo-600 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                        isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSubmitting && (
                        <span className="inline-block animate-spin rounded-full border-t-2 border-white-900 mr-3 w-4 h-4"></span>
                      )}
                      Reset
                    </button>
                    <Link
                      to="/login"
                      className={`flex-col w-full mt-2 text-center justify-center rounded-md bg-indigo-600 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                        isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      Cancel
                    </Link>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const { token } = queryString.parse(window.location.search);

    accountService
      .validateResetToken(token)
      .then(() => {
        setToken(token);
        setTokenStatus(TokenStatus.Valid);
      })
      .catch(() => {
        setTokenStatus(TokenStatus.Invalid);
      });
  }, []);

  function getBody() {
    switch (tokenStatus) {
      case TokenStatus.Valid:
        return getForm();
      case TokenStatus.Invalid:
        return (
          <div>
            Token validation failed, if the token has expired you can get a new
            one at the <Link to="forgot-password">forgot password</Link> page.
          </div>
        );
      case TokenStatus.Validating:
        return <div>Validating token...</div>;
      default:
        return null;
    }
  }

  return <div>{getBody()}</div>;
}

export default ResetPassword;
