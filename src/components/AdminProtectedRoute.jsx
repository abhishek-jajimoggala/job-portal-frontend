import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function AdminProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin-profile",
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (
        response.ok &&
        data.status === "success"
      ) {
        setIsAdmin(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <h4>Loading...</h4>
      </div>
    );
  }

  return isAdmin ? (
    children
  ) : (
    <Navigate
      to="/admin-login"
      replace
    />
  );
}

export default AdminProtectedRoute;