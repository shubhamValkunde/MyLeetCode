import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { getRedirectResult } from "firebase/auth";
import ProblemForm from "./components/ProblemForm";
import CodeEditor from "./components/CodeEditor";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ProblemList from "./components/ProblemList";
import AdminProblemManager from "./components/AdminProblemManager";

function AppRoutes() {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Handle redirect result for signInWithRedirect
  useEffect(() => {
    setIsRedirecting(true);
    getRedirectResult(auth)
      .then((result) => {
        if (result || auth.currentUser) {
          if (["/login", "/signup"].includes(window.location.pathname)) {
            navigate("/dashboard", { replace: true });
          }
        }
        setIsRedirecting(false);
      })
      .catch((err) => {
        console.error("❌ Redirect error:", err.message);
        setIsRedirecting(false);
      });
  }, [navigate]);

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (user) {
      const publicRoutes = ["/login", "/signup"];
      if (publicRoutes.includes(window.location.pathname)) {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [user, navigate]);

  if (loading || isRedirecting) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Routes>
      <Route
        path="/signup"
        element={!user ? <Signup /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/add-problem"
        element={user ? <ProblemForm /> : <Navigate to="/login" />}
      />
      <Route
        path="/editor/:problemLink"
        element={user ? <CodeEditor /> : <Navigate to="/login" />}
      />
      <Route
        path="/problems"
        element={user ? <ProblemList /> : <Navigate to="/login" />}
      />
      <Route
        path="/admin/manage-problems"
        element={user ? <AdminProblemManager /> : <Navigate to="/login" />}
      />
      <Route
        path="/"
        element={<Navigate to={user ? "/dashboard" : "/login"} />}
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
