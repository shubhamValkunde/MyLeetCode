import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";

function ProblemList() {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All");

  const topics = [
    "All",
    "Array",
    "Linked List",
    "Binary Search",
    "Greedy Algorithm",
    "Recursion and Backtracking",
    "Stack & Queue",
    "String",
    "Binary Tree",
    "Dynamic Programming",
    "Graph",
    "Hash Table",
    "Heap",
    "Sorting",
    "Math",
    "Bit Manipulation",
    "Two Pointers",
    "Sliding Window",
  ];

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "leetcodequestions")
        );
        // Map problems using the numeric 'id' field instead of Firestore doc.id
        const problemList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: data.id, // Use the numeric ID field (e.g., 1, 2, 3)
            title: data.title,
            difficulty: data.difficulty,
            topic: data.topic,
            link: data.link,
          };
        });
        // Sort by numeric ID to ensure consistent order
        problemList.sort((a, b) => a.id - b.id);
        setProblems(problemList);
        setFilteredProblems(problemList); // Initially show all problems
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch problems: " + err.message);
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  // Filter problems based on search term and selected topic
  useEffect(() => {
    let filtered = problems;

    // Filter by search term (case-insensitive)
    if (searchTerm) {
      filtered = filtered.filter((problem) =>
        problem.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by topic
    if (selectedTopic !== "All") {
      filtered = filtered.filter((problem) => problem.topic === selectedTopic);
    }

    setFilteredProblems(filtered);
  }, [searchTerm, selectedTopic, problems]);

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case "1":
        return "bg-success";
      case "2":
        return "bg-warning";
      case "3":
        return "bg-danger";
      case "4":
        return "bg-danger text-white";
      default:
        return "bg-secondary";
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ minHeight: "100vh" }}>
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h2 className="card-title text-center mb-4 fw-bold text-dark">
            Problem List
          </h2>

          {/* Search and Filter Controls */}
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by problem title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-light">
                  Filter by Topic
                </span>
                <select
                  className="form-select"
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                >
                  {topics.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Problem List */}
          {filteredProblems.length === 0 ? (
            <div className="alert alert-info text-center" role="alert">
              No problems found matching your criteria.
            </div>
          ) : (
            <div className="list-group">
              {filteredProblems.map((problem) => (
                <div
                  key={problem.id} // Use numeric ID as key
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center mb-2 rounded shadow-sm"
                >
                  <div>
                    <Link
                      to={`/editor/${problem.id}`} // Use numeric ID in URL
                      className="text-decoration-none text-dark fw-medium"
                    >
                      {problem.id}. {problem.title || "Untitled Problem"}
                    </Link>
                    <span
                      className={`badge ${getDifficultyBadge(
                        problem.difficulty
                      )} ms-2`}
                    >
                      {problem.difficulty === "1"
                        ? "Easy"
                        : problem.difficulty === "2"
                        ? "Medium"
                        : problem.difficulty === "3"
                        ? "Hard"
                        : problem.difficulty === "4"
                        ? "Very Hard"
                        : "Unknown"}
                    </span>
                    <small className="d-block text-muted mt-1">
                      Topic: {problem.topic || "N/A"}
                    </small>
                  </div>
                  {problem.link && (
                    <a
                      href={problem.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-primary btn-sm"
                    >
                      Solve on LeetCode
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProblemList;
