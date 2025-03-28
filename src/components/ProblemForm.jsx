import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { db, collection, addDoc, getDocs } from "../firebase";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ProblemForm() {
  const [title, setTitle] = useState("Min and Max in Array");
  const [topic, setTopic] = useState("Array");
  const [description, setDescription] = useState(
    "Given an array arr. Your task is to find the minimum and maximum elements in the array."
  );
  const [difficulty, setDifficulty] = useState("1");
  const [constraints, setConstraints] = useState(
    "1 <= arr.size() <= 10^5\n1 <= arr[i] <= 10^9"
  );
  const [examples, setExamples] = useState([
    { input: "", output: "", explanation: "" },
  ]);
  const [sampleCode, setSampleCode] = useState({
    c: "#include <stdio.h>\nint main() { return 0; }",
    cpp: "#include <iostream>\nusing namespace std;\nint main() { return 0; }",
    java: "public class Main { public static void main(String[] args) {} }",
    python: "def find_min_max(arr): pass",
  });
  const [nextId, setNextId] = useState(null);

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

  const languages = ["c", "cpp", "java", "python"];

  const fetchNextAvailableId = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "leetcodequestions"));
      const ids = querySnapshot.docs
        .map((doc) => doc.data().id)
        .filter((id) => id !== undefined && !isNaN(id))
        .sort((a, b) => a - b);
      if (ids.length === 0) {
        setNextId(1);
        return;
      }
      let next = 1;
      for (let i = 0; i < ids.length; i++) {
        if (ids[i] !== next) {
          setNextId(next);
          return;
        }
        next++;
      }
      setNextId(next);
    } catch (error) {
      console.error("Error fetching next ID:", error.message);
      setNextId(26);
    }
  };

  useEffect(() => {
    fetchNextAvailableId();
  }, []);

  const addExample = () => {
    setExamples([...examples, { input: "", output: "", explanation: "" }]);
  };

  const removeExample = (index) => {
    setExamples(examples.filter((_, i) => i !== index));
  };

  // Updated encodeToBase64 function to handle Unicode characters
  const encodeToBase64 = (obj) => {
    const encodeString = (str) => btoa(unescape(encodeURIComponent(str)));
    return {
      sampleCode: {
        c: encodeString(obj.sampleCode.c),
        cpp: encodeString(obj.sampleCode.cpp),
        java: encodeString(obj.sampleCode.java),
        python: encodeString(obj.sampleCode.python),
      },
      constraints: encodeString(obj.constraints),
    };
  };

  const submitForm = async () => {
    try {
      const encodedData = encodeToBase64({ sampleCode, constraints });
      const problemData = {
        id: nextId,
        title,
        topic,
        description,
        difficulty,
        constraints: encodedData.constraints,
        examples,
        sampleCode: encodedData.sampleCode,
      };
      const docRef = await addDoc(
        collection(db, "leetcodequestions"),
        problemData
      );
      alert(
        `Problem added successfully! ID: ${nextId} (Firestore ID: ${docRef.id})`
      );
      setTitle("");
      setTopic("");
      setDescription("");
      setDifficulty("1");
      setConstraints("");
      setExamples([{ input: "", output: "", explanation: "" }]);
      setSampleCode({
        c: "#include <stdio.h>\nint main() { return 0; }",
        cpp: "#include <iostream>\nusing namespace std;\nint main() { return 0; }",
        java: "public class Main { public static void main(String[] args) {} }",
        python: "def find_min_max(arr): pass",
      });
      await fetchNextAvailableId();
    } catch (error) {
      alert("Error adding problem: " + error.message);
    }
  };

  const handleCodeChange = (language, value) => {
    setSampleCode((prev) => ({ ...prev, [language]: value }));
  };

  if (nextId === null) {
    return <div>Loading next ID...</div>;
  }

  return (
    <div className="form-container">
      <style jsx>{`
        .form-container {
          min-height: 100vh;
          background: #f4f7fa;
          padding: 20px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          width: 100vw;
        }

        .form-card {
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          width: 100%;
          padding: 30px;
          margin: 0;
        }

        .form-title-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }

        .form-title {
          font-size: 1.8rem;
          color: #333;
          font-weight: 600;
          margin: 0;
        }

        .form-input,
        .form-textarea,
        .form-select {
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 10px;
          font-size: 14px;
          color: #333;
          width: 100%;
          transition: border-color 0.3s ease;
        }

        .form-input:focus,
        .form-textarea:focus,
        .form-select:focus {
          border-color: #007bff;
          outline: none;
          box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
        }

        .form-select {
          appearance: none;
          background-image: url('data:image/svg+xml;utf8,<svg fill="gray" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
          background-repeat: no-repeat;
          background-position: right 10px center;
        }

        .example-section {
          background: #fafafa;
          border: 1px solid #eee;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 20px;
        }

        .code-section {
          background: #f9f9f9;
          border: 1px solid #eee;
          border-radius: 8px;
          padding: 15px;
          margin-top: 20px;
        }

        .code-block {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 200px;
          margin: 5px;
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 6px;
          padding: 10px;
        }

        .code-title {
          font-size: 14px;
          color: #555;
          font-weight: 500;
          margin-bottom: 5px;
          text-transform: uppercase;
        }

        .code-textarea {
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 6px;
          padding: 10px;
          font-size: 13px;
          color: #333;
          width: 100%;
          height: 150px;
          resize: vertical;
        }

        .code-textarea:focus {
          border-color: #007bff;
          outline: none;
        }

        .code-blocks-container {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: space-between;
        }

        .form-button {
          background: #007bff;
          border: none;
          color: #fff;
          padding: 8px 20px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          transition: background 0.3s ease;
        }

        .form-button:hover {
          background: #0056b3;
        }

        .remove-button {
          background: #ff4d4d;
          padding: 6px;
          font-size: 12px;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .remove-button:hover {
          background: #cc0000;
        }

        .add-button {
          background: #28a745;
          padding: 6px;
          font-size: 12px;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .add-button:hover {
          background: #218838;
        }

        .section-title {
          font-size: 1.2rem;
          color: #444;
          font-weight: 500;
          margin: 20px 0 10px;
        }

        .example-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .description-constraints-row {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
          align-items: stretch;
        }

        .description-container {
          width: 66.67%;
        }

        .constraints-container {
          width: 36.67%;
        }

        .description-textarea {
          height: 60px;
          width: 100%;
        }

        .constraints-textarea {
          width: 100%;
          height: 60px;
        }

        .example-input {
          height: 40px;
        }

        @media (max-width: 768px) {
          .code-block {
            flex: 1 1 45%;
          }
          .description-constraints-row {
            flex-direction: column;
            gap: 10px;
          }
          .description-container {
            width: 100%;
          }
          .constraints-container {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .code-block {
            flex: 1 1 100%;
          }
        }
      `}</style>

      <Card className="form-card">
        <CardContent>
          <div className="form-title-container">
            <h1 className="form-title">Create a New Challenge</h1>
            <Button className="form-button" onClick={submitForm}>
              Submit Problem
            </Button>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Problem Title"
                className="form-input example-input"
              />
            </div>
            <div className="col-md-2">
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="form-input example-input"
              >
                <option value="" disabled>
                  Select Topic
                </option>
                {topics.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="form-input example-input"
              >
                <option value="" disabled>
                  Difficulty
                </option>
                <option value="1">Level 1</option>
                <option value="2">Level 2</option>
                <option value="3">Level 3</option>
                <option value="4">Level 4</option>
              </select>
            </div>
          </div>

          <div className="description-constraints-row">
            <div className="description-container">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Problem Statement"
                className="form-textarea description-textarea"
              />
            </div>
            <div className="constraints-container">
              <Textarea
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                placeholder="Constraints (e.g., 1 <= arr.size() <= 10^5)"
                className="form-textarea constraints-textarea"
              />
            </div>
          </div>

          <h2 className="section-title">Examples</h2>
          {examples.map((ex, index) => (
            <div key={index} className="example-section">
              <div className="example-row">
                <Input
                  value={ex.input}
                  onChange={(e) => {
                    const newExamples = [...examples];
                    newExamples[index].input = e.target.value;
                    setExamples(newExamples);
                  }}
                  placeholder="Input (e.g., 1 2 3)"
                  className="form-input example-input"
                />
                <Input
                  value={ex.output}
                  onChange={(e) => {
                    const newExamples = [...examples];
                    newExamples[index].output = e.target.value;
                    setExamples(newExamples);
                  }}
                  placeholder="Output (e.g., 1 3)"
                  className="form-input example-input"
                />
                <Textarea
                  value={ex.explanation}
                  onChange={(e) => {
                    const newExamples = [...examples];
                    newExamples[index].explanation = e.target.value;
                    setExamples(newExamples);
                  }}
                  placeholder="Explanation"
                  className="form-textarea example-input"
                />
                <div style={{ display: "flex", gap: "10px" }}>
                  <Button
                    className="form-button remove-button"
                    onClick={() => removeExample(index)}
                  >
                    ✗
                  </Button>
                  {index === examples.length - 1 && (
                    <Button
                      className="form-button add-button"
                      onClick={addExample}
                    >
                      +
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}

          <h2 className="section-title">Sample Code</h2>
          <div className="code-section">
            <div className="code-blocks-container">
              {languages.map((lang) => (
                <div key={lang} className="code-block">
                  <label className="code-title">{lang.toUpperCase()}</label>
                  <Textarea
                    value={sampleCode[lang]}
                    onChange={(e) => handleCodeChange(lang, e.target.value)}
                    placeholder={`Write ${lang} sample code`}
                    className="code-textarea"
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
