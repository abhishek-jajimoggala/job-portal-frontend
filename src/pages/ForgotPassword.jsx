import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/ForgotPassword.css";
import jobImage from "../assets/jobs.jpg";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter email");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json();

      if (
        response.ok &&
        data.status === "success"
      ) {
        sessionStorage.setItem(
          "resetEmail",
          email
        );

        toast.success(data.message);

        navigate("/reset-password");
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
              Forgot{" "}
              <span style={{ color: "#60a5fa" }}>
                Password
              </span>
            </h1>

            <p>
              Enter your registered email
              address to receive OTP and
              reset your password.
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

            <h2>Forgot Password</h2>

            <p>
              Enter your registered email
            </p>

            <form onSubmit={handleSubmit}>

              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
              >
                Send OTP
              </button>

            </form>

          </div>
        </div>

      </div>
    </div>
  );
}

export default ForgotPassword;