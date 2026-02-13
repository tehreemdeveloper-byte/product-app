import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import authService from "../services/authService";


const Signup = () => {

  const navigate = useNavigate();

const[formData,setFormData] = useState(
  {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  }
)

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error,setError] = useState({});
  const [apiError, setApiError] = useState(null);



const handleChange = (e) => {

 const name = e.target.name;
 const value = e.target.value

 setFormData((prev)=>({
  ...prev,
  [name]:value
 }))

}


const handleSubmit = async(e) =>{
  
  e.preventDefault()

  let newErrors ={};

 if (!formData.fullName.trim()) {

    newErrors.fullName = "name is required";
  } else if (!/^[a-zA-Z]+$/.test(formData.fullName.trim())) {
    newErrors.fullName = "only letters allowed";
  }


  if (!formData.email.trim()) {
    newErrors.email = "Email is required";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
  ) {
    newErrors.email = "invalid email format";
  }


  if (!formData.password.trim()) {
    newErrors.password = "password is required";
  } else if (formData.password.length < 6) {
    newErrors.password = "password must be at least 8 characters";
  }


  if (!formData.confirmPassword.trim()) {
    newErrors.confirmPassword = "confirm password is required";
  } else if (formData.confirmPassword !== formData.password) {
    newErrors.confirmPassword = "passwords do not match";
  }

  setError(newErrors)

  if(Object.keys(newErrors).length === 0) {
   await handleSignIn();
    console.log("Form submitted successfully");
    
  }
  


}

const handleSignIn = async() =>{
  try {

    const data = await authService.register(formData);
     navigate('/');
  }catch (error) {

      setApiError(
        error.response?.message || "Register fail"
      );
    }
}

 
  return (

    <>
    {/* RIGHT SIDE */}
             <h2 className="fw-bold mb-2">Create Account</h2>
            <p className="text-muted mb-4">Join us and start exploring premium products</p>

            <form onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className={error.fullName ? "mb-2" : "mb-4"}>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  
                />
              </div>
           {error.fullName && <p style={{color:"red"}}>{error.fullName}</p>}



              {/* Email */}
              <div className={error.email ? "mb-2" : "mb-4"}>
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control form-control-lg"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  
                />
              </div>
              {error.email && (
                <p style={{ color: "red" }}>{error.email}</p>
              )}


              {/* Password */}
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

                  {showPassword ? <FaEye/>:<FaEyeSlash/>}

                  
                </span>

                  {error.password && (
                    <p style={{ color: "red" }}>{error.password}</p>
                  )}


              </div>

              {/* Confirm Password */}
              {/* <div className={error.fullName ? "mb-2" : "mb-4"}> */}
                <div className={`position-relative ${error.confirmPassword ? "mb-2" : "mb-4"}`}>

                <label className="form-label">Confirm Password</label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control form-control-lg"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  
                />
                <span
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  style={{
                    position: "absolute",
                    right: "15px",
                    top: "45px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  {showConfirmPassword ? <FaEye/>:<FaEyeSlash/>}
                </span>

                {error.confirmPassword && (
                  <p style={{ color: "red" }}>{error.confirmPassword}</p>
                )}

                
              </div>

                {error.password && <p style={{ color: "red" }}>{error.password}</p>}
                {apiError && <p style={{ color: "red" }}>{apiError}</p>}

              {/* Submit */}
              <button
                type="submit"
                className="btn w-100 text-white"
                style={{
                  background:
                    "linear-gradient(135deg, #f97316, #f59e0b)",
                }}
              >
                Create Account
              </button>
            </form>

            <p className="text-center mt-4 text-muted">
              Already have an account?{" "}

                 <span  >
                               
                    <Link to="/" style={{ cursor: "pointer" }} className="text-warning fw-semibold"> Sign In</Link>
                  </span>


             
            </p>
</>

    
  );
};

export default Signup;

