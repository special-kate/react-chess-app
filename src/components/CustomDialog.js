import React from "react";

export default function CustomDialog({
  open,
  children,
  title,
  contentText,
  handleContinue,
}) {
  return (
    <div
      className={`${
        open ? "block" : "hidden"
      } fixed z-10 inset-0 overflow-y-auto`}
    >
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg w-full">
          <div className="bg-white px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {title}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {contentText}
            </p>
          </div>
          <div className="px-4 py-4 sm:px-6">{children}</div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={handleContinue}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
