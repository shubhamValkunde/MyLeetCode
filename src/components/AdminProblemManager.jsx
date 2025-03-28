import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";

function AdminProblemManager() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProblem, setEditingProblem] = useState(null);

  // State for all editable fields, including id
  const [updatedId, setUpdatedId] = useState("");
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedTopic, setUpdatedTopic] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [updatedDifficulty, setUpdatedDifficulty] = useState("");
  const [updatedConstraints, setUpdatedConstraints] = useState("");
  const [updatedExamples, setUpdatedExamples] = useState([]);
  const [updatedSampleCode, setUpdatedSampleCode] = useState({
    c: "",
    cpp: "",
    java: "",
    python: "",
  });

  const topics = [
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

  // Fetch all problems and sort by ID
  const fetchProblems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "leetcodequestions"));
      const problemList = querySnapshot.docs.map((doc) => ({
        docId: doc.id,
        ...doc.data(),
        constraints: doc.data().constraints ? atob(doc.data().constraints) : "",
        sampleCode: {
          c: doc.data().sampleCode?.c ? atob(doc.data().sampleCode.c) : "",
          cpp: doc.data().sampleCode?.cpp
            ? atob(doc.data().sampleCode.cpp)
            : "",
          java: doc.data().sampleCode?.java
            ? atob(doc.data().sampleCode.java)
            : "",
          python: doc.data().sampleCode?.python
            ? atob(doc.data().sampleCode.python)
            : "",
        },
      }));
      problemList.sort((a, b) => a.id - b.id); // Sort by ID
      setProblems(problemList);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch problems: " + err.message);
      setLoading(false);
    }
  };

  // Fetch problems on mount
  useEffect(() => {
    fetchProblems();
  }, []);

  // Start editing a problem
  const handleEdit = (problem) => {
    setEditingProblem(problem);
    setUpdatedId(String(problem.id)); // Convert to string for input
    setUpdatedTitle(problem.title || "");
    setUpdatedTopic(problem.topic || "");
    setUpdatedDescription(problem.description || "");
    setUpdatedDifficulty(problem.difficulty || "1");
    setUpdatedConstraints(problem.constraints || "");
    setUpdatedExamples(
      problem.examples || [{ input: "", output: "", explanation: "" }]
    );
    setUpdatedSampleCode({
      c: problem.sampleCode.c || "",
      cpp: problem.sampleCode.cpp || "",
      java: problem.sampleCode.java || "",
      python: problem.sampleCode.python || "",
    });
  };

  // Encode to Base64 before saving
  const encodeToBase64 = (obj) => ({
    sampleCode: {
      c: btoa(obj.sampleCode.c),
      cpp: btoa(obj.sampleCode.cpp),
      java: btoa(obj.sampleCode.java),
      python: btoa(obj.sampleCode.python),
    },
    constraints: btoa(obj.constraints),
  });

  // Reassign IDs to maintain sequential order
  const reassignIds = async (updatedProblems) => {
    try {
      // Sort problems by current ID to maintain order
      updatedProblems.sort((a, b) => a.id - b.id);

      // Reassign IDs starting from 1
      let newId = 1;
      for (const problem of updatedProblems) {
        if (problem.id !== newId) {
          const docRef = doc(db, "leetcodequestions", problem.docId);
          await updateDoc(docRef, { id: newId });
          problem.id = newId; // Update the local problem object
        }
        newId++;
      }

      // Update local state with the reassigned IDs
      setProblems([...updatedProblems].sort((a, b) => a.id - b.id));
    } catch (err) {
      console.error("Error reassigning IDs:", err.message);
      alert("Error reassigning IDs after operation: " + err.message);
    }
  };

  // Update a problem in Firestore, handling ID change
  const handleUpdate = async () => {
    if (!editingProblem) return;
    try {
      const newId = parseInt(updatedId, 10);
      if (isNaN(newId) || newId < 1) {
        alert("Please enter a valid positive integer ID.");
        return;
      }

      const encodedData = encodeToBase64({
        sampleCode: updatedSampleCode,
        constraints: updatedConstraints,
      });
      const updatedData = {
        id: newId,
        title: updatedTitle,
        topic: updatedTopic,
        description: updatedDescription,
        difficulty: updatedDifficulty,
        constraints: encodedData.constraints,
        examples: updatedExamples,
        sampleCode: encodedData.sampleCode,
      };

      // Check for ID conflict
      const existingProblem = problems.find(
        (p) => p.id === newId && p.docId !== editingProblem.docId
      );
      if (existingProblem) {
        alert(
          `ID ${newId} is already in use by "${existingProblem.title}". Please choose a different ID.`
        );
        return;
      }

      const oldDocRef = doc(db, "leetcodequestions", editingProblem.docId);
      if (newId !== editingProblem.id) {
        // Update the document with the new ID
        await setDoc(
          doc(db, "leetcodequestions", editingProblem.docId),
          updatedData
        );
      } else {
        // Update existing document if ID unchanged
        await updateDoc(oldDocRef, updatedData);
      }

      // Update local state
      const updatedProblems = problems.map((p) =>
        p.docId === editingProblem.docId
          ? {
              ...updatedData,
              docId: editingProblem.docId,
              constraints: updatedConstraints,
              sampleCode: updatedSampleCode,
            }
          : p
      );

      // Reassign IDs to maintain sequential order
      await reassignIds(updatedProblems);

      setEditingProblem(null);
      alert("Problem updated successfully!");
    } catch (err) {
      alert("Error updating problem: " + err.message);
    }
  };

  // Delete a problem from Firestore and reassign IDs
  const handleDelete = async (docId) => {
    if (!window.confirm("Are you sure you want to delete this problem?"))
      return;
    try {
      // Delete the problem from Firestore
      await deleteDoc(doc(db, "leetcodequestions", docId));

      // Filter out the deleted problem from local state
      const updatedProblems = problems.filter((p) => p.docId !== docId);

      // Reassign IDs to the remaining problems
      await reassignIds(updatedProblems);

      alert("Problem deleted successfully!");
    } catch (err) {
      alert("Error deleting problem: " + err.message);
    }
  };

  // Add a new example
  const addExample = () => {
    setUpdatedExamples([
      ...updatedExamples,
      { input: "", output: "", explanation: "" },
    ]);
  };

  // Remove an example
  const removeExample = (index) => {
    setUpdatedExamples(updatedExamples.filter((_, i) => i !== index));
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
      <h2 className="text-center mb-4 fw-bold">Admin Problem Manager</h2>

      {/* Problem List */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h4 className="card-title mb-3">All Problems</h4>
          {problems.length === 0 ? (
            <div className="alert alert-info" role="alert">
              No problems found.
            </div>
          ) : (
            <div className="list-group">
              {problems.map((problem) => (
                <div
                  key={problem.docId}
                  className="list-group-item d-flex justify-content-between align-items-center mb-2 rounded"
                >
                  <div>
                    <strong>
                      {problem.id}. {problem.title || "Untitled"}
                    </strong>
                    <br />
                    <small>
                      Topic: {problem.topic || "N/A"} | Difficulty:{" "}
                      {problem.difficulty}
                    </small>
                  </div>
                  <div>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(problem)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(problem.docId)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Form */}
      {editingProblem && (
        <div className="card shadow-sm">
          <div className="card-body">
            <h4 className="card-title mb-3">Edit Problem</h4>
            <div className="mb-3">
              <label className="form-label">Problem ID</label>
              <input
                type="number"
                className="form-control"
                value={updatedId}
                onChange={(e) => setUpdatedId(e.target.value)}
                min="1"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                value={updatedTitle}
                onChange={(e) => setUpdatedTitle(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Topic</label>
              <select
                className="form-select"
                value={updatedTopic}
                onChange={(e) => setUpdatedTopic(e.target.value)}
              >
                <option value="">Select Topic</option>
                {topics.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                value={updatedDescription}
                onChange={(e) => setUpdatedDescription(e.target.value)}
                rows="3"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Difficulty</label>
              <select
                className="form-select"
                value={updatedDifficulty}
                onChange={(e) => setUpdatedDifficulty(e.target.value)}
              >
                <option value="1">Level 1</option>
                <option value="2">Level 2</option>
                <option value="3">Level 3</option>
                <option value="4">Level 4</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Constraints</label>
              <textarea
                className="form-control"
                value={updatedConstraints}
                onChange={(e) => setUpdatedConstraints(e.target.value)}
                rows="2"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Examples</label>
              {updatedExamples.map((ex, index) => (
                <div key={index} className="border p-3 mb-2 rounded">
                  <div className="row g-2 align-items-end">
                    <div className="col-3">
                      <input
                        type="text"
                        className="form-control"
                        value={ex.input}
                        onChange={(e) => {
                          const newExamples = [...updatedExamples];
                          newExamples[index].input = e.target.value;
                          setUpdatedExamples(newExamples);
                        }}
                        placeholder="Input"
                      />
                    </div>
                    <div className="col-3">
                      <input
                        type="text"
                        className="form-control"
                        value={ex.output}
                        onChange={(e) => {
                          const newExamples = [...updatedExamples];
                          newExamples[index].output = e.target.value;
                          setUpdatedExamples(newExamples);
                        }}
                        placeholder="Output"
                      />
                    </div>
                    <div className="col-4">
                      <textarea
                        className="form-control"
                        value={ex.explanation}
                        onChange={(e) => {
                          const newExamples = [...updatedExamples];
                          newExamples[index].explanation = e.target.value;
                          setUpdatedExamples(newExamples);
                        }}
                        placeholder="Explanation"
                        rows="2"
                      />
                    </div>
                    <div className="col-2">
                      <button
                        className="btn btn-danger btn-sm me-2"
                        onClick={() => removeExample(index)}
                      >
                        ✗
                      </button>
                      {index === updatedExamples.length - 1 && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={addExample}
                        >
                          +
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mb-3">
              <label className="form-label">Sample Code</label>
              <div className="row">
                {Object.keys(updatedSampleCode).map((lang) => (
                  <div key={lang} className="col-md-6 mb-3">
                    <label className="form-label">
                      {lang.toUpperCase()} Code
                    </label>
                    <textarea
                      className="form-control"
                      value={updatedSampleCode[lang]}
                      onChange={(e) =>
                        setUpdatedSampleCode({
                          ...updatedSampleCode,
                          [lang]: e.target.value,
                        })
                      }
                      rows="4"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-primary" onClick={handleUpdate}>
                Update Problem
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setEditingProblem(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProblemManager;
