import { toast } from "react-toastify";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import jobImage from "../assets/jobs.jpg";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (
        response.ok &&
        data.status === "success"
      ) {
        const userData = {
          id:
            data.id ||
            data.user?.id,

          username:
            data.username ||
            data.user?.username ||
            "User",

          email:
            data.email ||
            form.email,
        };

        sessionStorage.setItem(
          "loggedUser",
          JSON.stringify(userData)
        );

        sessionStorage.setItem(
          "userId",
          userData.id
        );

        sessionStorage.setItem(
          "email",
          userData.email
        );

        sessionStorage.setItem(
          "username",
          userData.username
        );

        sessionStorage.setItem(
          "isLoggedIn",
          "true"
        );

        toast.success(
          data.message ||
            "Login Successful"
        );

        navigate("/");
      } else {
        toast.error(
          data.message ||
            "Invalid Email or Password"
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        {/* Left Side */}
        <div className="login-left">
          <div className="overlay">

            <h1>
              Find Your
              <span
                style={{
                  color: "#60a5fa",
                }}
              >
                {" "}
                Dream Job
              </span>
            </h1>

            <p>
              Search thousands of jobs
              from top companies and
              apply instantly.
            </p>

            <img
              src={jobImage}
              alt="Job Portal"
              className="login-image"
            />

          </div>
        </div>

        {/* Right Side */}
        <div className="login-right">
          <div className="login-card">

            <h2>User Login</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  value={form.email}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="password"
                  name="password"
                  placeholder="Enter Password"
                  value={form.password}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading
                  ? "Logging in..."
                  : "Login"}
              </button>
            </form>

            <p className="register-text mt-3">
              Don't have an account?
              <Link to="/register">
                {" "}
                Register
              </Link>
            </p>

            <p className="text-center mt-2">
              <Link to="/forgot-password">
                Forgot Password?
              </Link>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;