
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import jobImage from "../assets/jobs.jpg";
import "../styles/Login.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/admin-login",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        }
      );

      const data = await response.json();

      if (
        response.ok &&
        data.status === "success"
      ) {
        // =========================
        // ADMIN LOGIN DATA
        // =========================

        sessionStorage.setItem(
          "admin",
          "true"
        );

        // IMPORTANT:
        // Use same key everywhere
        sessionStorage.setItem(
          "admin_id",
          data.id
        );

        sessionStorage.setItem(
          "admin_name",
          data.username
        );

        toast.success(data.message);

        navigate("/admin");

      } else {
        toast.error(
          data.message || "Login Failed"
        );
      }

    } catch (error) {

      console.error(error);

      toast.error("Server Error");
    }
  };

  return (
    <div className="login-page">

      <div className="login-container">

        {/* =========================
            LEFT SIDE
        ========================= */}

        <div className="login-left">

          <div className="overlay">

            <h1>
              Admin{" "}
              <span
                style={{
                  color: "#60a5fa"
                }}
              >
                Portal
              </span>
            </h1>

            <p>
              Manage jobs, users,
              applications and hiring
              process from one secure
              dashboard.
            </p>

            <img
              src={jobImage}
              alt="Admin Portal"
              className="login-image"
            />

          </div>

        </div>

        {/* =========================
            RIGHT SIDE
        ========================= */}

        <div className="login-right">

          <div className="login-card">

            <h2>Admin Login</h2>

            <form onSubmit={handleSubmit}>

              <div className="mb-3">

                <input
                  type="email"
                  name="email"
                  placeholder="Admin Email"
                  className="form-control"
                  value={form.email}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="mb-3">

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="form-control"
                  value={form.password}
                  onChange={handleChange}
                  required
                />

              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
              >
                Login
              </button>

            </form>

            <p className="register-text">

              Don't have an admin account?

              <Link to="/admin-register">
                {" "}Register
              </Link>

            </p>

            <p className="register-text">

              User Login?

              <Link to="/login">
                {" "}Login Here
              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminLogin;
