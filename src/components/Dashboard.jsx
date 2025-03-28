import React from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Dashboard() {
  const navigate = useNavigate();
  const user = auth.currentUser; // Get the current user

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        className="bg-dark text-white p-3"
        style={{ width: "250px", flexShrink: 0 }}
      >
        <h4 className="text-center mb-4">LeetCode Clone</h4>
        <ul className="nav flex-column">
          <li className="nav-item">
            <button
              className="nav-link btn btn-link text-white p-2 text-start"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </button>
          </li>
          <li className="nav-item">
            <button
              className="nav-link btn btn-link text-white p-2 text-start"
              onClick={() => navigate("/add-problem")}
            >
              Add Problem
            </button>
          </li>
          <li className="nav-item">
            <button
              className="nav-link btn btn-link text-white p-2 text-start"
              onClick={() => navigate("/problems")}
            >
              Problem List
            </button>
          </li>
          <li className="nav-item">
            <button
              className="nav-link btn btn-link text-white p-2 text-start"
              onClick={() => navigate("/admin/manage-problems")}
            >
              Manage Problems
            </button>
          </li>
          <li className="nav-item mt-auto">
            <button
              className="nav-link btn btn-danger w-100"
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4 bg-light">
        {/* Header */}
        <header className="mb-4 d-flex justify-content-between align-items-center">
          <h2>Welcome to LeetCode Clone</h2>
          <span className="text-muted">Hello, {user?.email || "User"}!</span>
        </header>

        {/* Main Dashboard Content */}
        <div className="row">
          {/* Welcome Section */}
          <div className="col-md-8">
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title">Get Started</h5>
                <p className="card-text">
                  Welcome to your coding journey! Here you can create coding
                  problems, test your solutions in our editor, and improve your
                  skills. Use the sidebar to navigate to "Add Problem" to
                  contribute a new challenge or "Open Editor" to start coding.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="col-md-4">
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title">Quick Actions</h5>
                <button
                  className="btn btn-primary w-100 mb-2"
                  onClick={() => navigate("/add-problem")}
                >
                  Add a New Problem
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info (e.g., Stats or Recent Activity) */}
        <div className="row">
          <div className="col-md-6">
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title">Your Stats</h5>
                <p className="card-text">
                  Problems Created: <strong>0</strong>
                  <br />
                  Problems Solved: <strong>0</strong>
                </p>
                <small className="text-muted">
                  (Stats coming soon with future updates!)
                </small>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title">Recent Activity</h5>
                <p className="card-text">No recent activity yet.</p>
                <small className="text-muted">
                  (Activity tracking coming soon!)
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
