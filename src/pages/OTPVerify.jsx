import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/Register.css";

function OTPVerify() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next box
    if (value && index < 5) {
      document
        .getElementById(`otp-${index + 1}`)
        ?.focus();
    }
  };

  const handleKeyDown = (
    e,
    index
  ) => {
    // Backspace -> previous box
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      document
        .getElementById(`otp-${index - 1}`)
        ?.focus();
    }
  };

  const handleVerify = async () => {
    const email =
      sessionStorage.getItem(
        "otpEmail"
      );

    if (!email) {
      toast.error(
        "Email not found. Please register again."
      );
      return;
    }

    const enteredOtp =
      otp.join("");

    if (
      enteredOtp.length !== 6
    ) {
      toast.error(
        "Please enter complete OTP"
      );
      return;
    }

    try {
      const response =
        await fetch(
          "http://localhost:5000/api/verify-otp",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              email,
              otp: enteredOtp,
            }),
          }
        );

      const data =
        await response.json();

      if (
        response.ok &&
        data.status ===
          "success"
      ) {
        toast.success(
          data.message
        );

        sessionStorage.removeItem(
          "otpEmail"
        );

        navigate("/login");
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

        <div className="login-right">

          <div className="login-card">

            <h2>
              OTP Verification
            </h2>

            <p>
              Enter the 6-digit OTP
              sent to your email
            </p>

            <div className="otp-container">

              {otp.map(
                (
                  digit,
                  index
                ) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    className="otp-box"
                    onChange={(e) =>
                      handleChange(
                        e.target
                          .value,
                        index
                      )
                    }
                    onKeyDown={(e) =>
                      handleKeyDown(
                        e,
                        index
                      )
                    }
                  />
                )
              )}

            </div>

            <button
              className="btn btn-primary w-100 mt-3"
              onClick={
                handleVerify
              }
            >
              Verify OTP
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default OTPVerify;
