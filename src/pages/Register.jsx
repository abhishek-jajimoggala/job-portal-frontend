import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/Register.css";
import jobImage from "../assets/jobs.jpg";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      toast.warning("Please fill all fields");
      return;
    }

    if (form.password.length < 6) {
      toast.warning(
        "Password must be at least 6 characters"
      );
      return;
    }

    if (
      form.password !== form.confirmPassword
    ) {
      toast.warning(
        "Passwords do not match"
      );
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/register",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
            confirmPassword:
              form.confirmPassword,
          }),
        }
      );

      const data =
        await response.json();

      if (
        response.ok &&
        data.status === "success"
      ) {
        sessionStorage.setItem(
          "otpEmail",
          form.email
        );

        toast.success(
          data.message
        );

        navigate("/verify-otp");
      } else {
        toast.error(
          data.message
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(
        "Server Error"
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        {/* Left Side */}
        <div className="login-left">
          <div className="overlay">

            <h1>
              Job{" "}
              <span
                style={{
                  color:
                    "#60a5fa",
                }}
              >
                Portal
              </span>
            </h1>

            <p>
              Join thousands
              of job seekers
              and find your
              dream career
              today.
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

            <h2>
              Create Account
            </h2>

            <form
              onSubmit={
                handleSubmit
              }
            >

              <div className="mb-3">
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Full Name"
                  value={
                    form.name
                  }
                  onChange={
                    handleChange
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Email Address"
                  value={
                    form.email
                  }
                  onChange={
                    handleChange
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Password"
                  value={
                    form.password
                  }
                  onChange={
                    handleChange
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control"
                  placeholder="Confirm Password"
                  value={
                    form.confirmPassword
                  }
                  onChange={
                    handleChange
                  }
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
              >
                Register
              </button>

            </form>

            <p className="register-text mt-3">
              Already have an
              account?
              <Link to="/login">
                {" "}
                Login
              </Link>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Register;