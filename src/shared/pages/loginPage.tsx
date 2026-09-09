import React from "react";
import "../../styles/loginPage.style.css";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/asti-india-logo.png";
import { loginAdmin } from "../services/authService";
import bgImage from "/login-bg.png";

function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [loginError, setLoginError] = useState("");

  const validateEmail = (email: string) => {
    if (!email || email.trim() === "") {
      return "Email cannot be empty";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") {
      const errorMsg = validateEmail(value);
      setEmailError(errorMsg);
    }
    if (name === "password") {
      if (!value || value.length < 1) {
        setIsPasswordValid(true);
      } else {
        setIsPasswordValid(false);
      }
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setLoginError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const errorMsg = validateEmail(formData.email);
    if (errorMsg) {
      setEmailError(errorMsg);
      return;
    }
    if (!formData.password) {
      setIsPasswordValid(true);
      return;
    }

    try {
      const res = await loginAdmin(formData.email, formData.password);
      console.log("Login response:", res);
      if (res?.success) {
        navigate("/admin-portals");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.response?.data?.message) {
        setLoginError(err.response.data.message);
      } else {
        setLoginError("Login failed. Please check your credentials.");
      }
    }
  };

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
          width: "100%",
        }}
        className="d-flex flex-column align-items-center justify-content-center"
      >
        <div className="row g-0 w-100 h-100">
          <div className="col-lg-6 col-md-6 col-sm-12 d-flex flex-column align-items-end justify-content-top pt-5 mt-5">
            <div className="d-flex flex-column align-items-start justify-content-center p-2 rounded-4">
              <img
                className="h-70px"
                src="/asti-india-logo.png"
                alt="asti india logo"
              />
              <h3 className="fw-bold mt-3">Manage People.</h3>
              <h3 className="fw-bold mt-3 gradient-text">Build Skills.</h3>
              <h3 className="fw-bold mt-3 gradient-text">
                Organise Knowledge.
              </h3>
              <h5 className="text-body-tertiary mt-3">
                One platform for a smarter workforce.
              </h5>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 d-flex flex-column align-items-center justify-content-center">
            <div className="fade-white d-flex flex-column align-items-center justify-content-center p-2 rounded-4">
              <form
                onSubmit={handleLogin}
                className="form card border p-5 w-400px rounded-3 m-5"
              >
                <h1 className="fw-bold mb-3">Welcome Back</h1>
                <p className="form-label mt-3 d-flex align-items-center">
                  Email <span className="text-danger ms-1">*</span>
                </p>
                <input
                  name="email"
                  className="form-control"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                {emailError && (
                  <p className="text-danger mt-1 mb-0">{emailError}</p>
                )}

                <p className="form-label mt-3 d-flex align-items-center">
                  Password <span className="text-danger ms-1">*</span>
                </p>
                <div className="d-flex align-items-center">
                  <input
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-control"
                    type={showPassword ? "text" : "password"}
                    placeholder="password"
                  />
                  <button
                    type="button"
                    className="btn text-secondary p-1"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      /* Eye-off icon (password visible → click to hide) */
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      /* Eye icon (password hidden → click to show) */
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {isPasswordValid && (
                  <p className="text-danger mt-1 mb-0">
                    Password cannot be empty
                  </p>
                )}

                {loginError && (
                  <div className="alert alert-danger mt-3 mb-0" role="alert">
                    {loginError}
                  </div>
                )}

                <button
                  className="gradient-bg btn text-white my-3"
                  type="submit"
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default LoginPage;
