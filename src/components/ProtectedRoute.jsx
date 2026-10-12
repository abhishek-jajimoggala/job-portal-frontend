import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const loggedUser = JSON.parse(
    sessionStorage.getItem("loggedUser")
  );

  if (!loggedUser) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;