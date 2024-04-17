import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { accountService, alertService } from "../../_services";

function ForgotPassword({ history }) {
  const [imageHeight, setImageHeight] = useState(0);
  const imageRef = useRef(null);

  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Email is invalid").required("Email is required"),
  });

  function onSubmit({ email }, { setSubmitting }) {
    alertService.clear();
    accountService
      .forgotPassword(email)
      .then((res) => (window.location.href = res))
      .catch((error) => alertService.error(error))
      .finally(() => setSubmitting(false));
  }

  useEffect(() => {
    const divHeight = document.querySelector(".forgot-password").offsetHeight;
    setImageHeight(divHeight);
  }, []);

  return (
    <div
      className="forgot-password grid grid-cols-1 md:grid-cols-2 px-20"
      style={{ height: "87vh" }}
    >
      <div className=" md:flex justify-center items-center">
        <img
          ref={imageRef}
          src={`${window.location.pathname.split("/")[0]}/bg_chesspanel.png`}
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
          <Form>
            <div className="flex flex-1 flex-col justify-center lg:px-8 px-10 py-10 mt-5">
              <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="text-center text-3xl font-bold leading-9 tracking-tight text-gray-900">
                  Forgot Password
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
                      Submit
                    </button>
                    <Link
                      to="/login"
                      className="flex-col w-full mt-2 text-center justify-center rounded-md bg-indigo-600 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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

export default ForgotPassword;
