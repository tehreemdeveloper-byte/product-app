


import React, { useState } from "react";
import { Link,useNavigate  } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import authService from "../services/authService";

import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

const LoginForm = () => {
  
  const navigate = useNavigate();
  const {login} = useContext(AuthContext)
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState({});
  const [apiError, setApiError] = useState(""); // string, not object

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    setError(newErrors);

    if (Object.keys(newErrors).length === 0) {
      await handleLogin(formData);
    }
  };

  const handleLogin = async (formData) => {
    try {
      const response = await authService.login(formData);

      // localStorage.setItem("authToken", data.token);
      // localStorage.setItem(
      //   "user",
      //   JSON.stringify({
      //     name: data.name,
      //     email: data.email
      //   })
      // );

      
      login(response.data, response.token);
      
      navigate('/dashboard', { replace: true });
    // navigate("/dashboard");

    } catch (error) {
      setApiError(
        error.response?.message || "Login failed"
      );
    }
  };





  // const handleLogin = async () => {
  //   try {
  //     const data = await authService.login(formData);

  //     if (data.status === 200) { // PUT CHECK HERE.....for success case
  //     localStorage.setItem("authToken", data.token);
  //     localStorage.setItem(
  //       "user",
  //       JSON.stringify({
  //         name: data.name,
  //         email: data.email
  //       })
  //     );

  //     window.location.href = "/dashboard";
  //     } else { // HANDLE ERROR for failure from API
  //       setApiError(data.message || "Login failed");
  //     }
  //   } catch (error) { // THIS IS TO CATCH ANY OTHER UNHANDLED ERRORS
  //     setApiError(
  //       error || "Login failed"
  //     );
  //   }
  // };



  return (
    <>
      {/* API Error */}
    

      <h2 className="fw-bold mb-2">Sign In</h2>
      <p className="text-muted mb-4">
        Enter your credentials to access your account
      </p>

      <form onSubmit={handleSubmit}>
        <div className={error.email ? "mb-2" : "mb-4"}>
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control form-control-lg"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        {error.email && <p style={{ color: "red" }}>{error.email}</p>}

        <div className={`position-relative ${error.password ? "mb-2" : "mb-4"}`}>
          <label className="form-label">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            className="form-control form-control-lg"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "15px",
              top: "45px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>

        {error.password && <p style={{ color: "red" }}>{error.password}</p>}
          {apiError && <p style={{ color: "red" }}>{apiError}</p>}

        <button
          type="submit"
          className="btn w-100 text-white"
          style={{
            background: "linear-gradient(135deg, #f97316, #f59e0b)"
          }}
        >
          Sign In
        </button>
      </form>

      <p className="text-center mt-4 text-muted">
        Don’t have an account?{" "}
        <Link
          to="/signup"
          style={{ cursor: "pointer" }}
          className="text-warning fw-semibold"
        >
          Sign Up
        </Link>
      </p>
    </>
  );
};

export default LoginForm;

