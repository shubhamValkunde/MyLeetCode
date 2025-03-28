import React from "react";
import { auth, googleProvider } from "../firebase"; // Make sure to import googleProvider
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Signup() {
  const navigate = useNavigate();

  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/dashboard");
    } catch (error) {
      alert("Error signing up with Google: " + error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Sign Up</h2>
      <div className="d-flex justify-content-center">
        <button onClick={handleGoogleSignup} className="btn btn-primary">
          Sign Up with Google
        </button>
      </div>
      <p className="text-center mt-3">
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}

export default Signup;
