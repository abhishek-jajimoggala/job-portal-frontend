import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/ResetPassword.css";
import jobImage from "../assets/jobs.jpg";

function ResetPassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    otp: "",
    newPassword: "",
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

    const email = sessionStorage.getItem("resetEmail");

    if (!email) {
      toast.error("Email not found");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error("Passwords Do Not Match");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp: form.otp,
            newPassword: form.newPassword,
            confirmPassword: form.confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (
        response.ok &&
        data.status === "success"
      ) {
        toast.success(data.message);

        sessionStorage.removeItem(
          "resetEmail"
        );

        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Server Error");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        {/* Left Side */}
        <div className="login-left">
          <div className="overlay">

            <h1>
              Reset{" "}
              <span style={{ color: "#60a5fa" }}>
                Password
              </span>
            </h1>

            <p>
              Verify your OTP and create
              a new secure password.
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

            <h2>Reset Password</h2>

            <form onSubmit={handleSubmit}>

              <div className="mb-3">
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  className="form-control"
                  value={form.otp}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  className="form-control"
                  value={form.newPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="form-control"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
              >
                Reset Password
              </button>

            </form>

          </div>
        </div>

      </div>
    </div>
  );
}

export default ResetPassword;