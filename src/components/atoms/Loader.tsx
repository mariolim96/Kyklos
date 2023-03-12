import React from "react";

const Loader = () => (
  <span className="absolute left-1/2 top-1/2 block h-4 w-4 -translate-x-1/2 -translate-y-1/2">
    <svg
      className="animate-spin"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="fill-current"
        d="M7.229 1.173a9.25 9.25 0 1011.655 11.412 1.25 1.25 0 10-2.4-.698 6.75 6.75 0 11-8.506-8.329 1.25 1.25 0 10-.75-2.385z"
      ></path>
    </svg>
    <span className="sr-only">Loading</span>
  </span>
);

export default Loader;
