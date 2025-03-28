import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AceEditor from "react-ace";
import { db, collection, getDocs } from "../firebase";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaPlay } from "react-icons/fa"; // For icons

function CodeEditor() {
  const { problemLink } = useParams();
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [loadingRun, setLoadingRun] = useState(false);
  const [problem, setProblem] = useState(null);
  const [loadingProblem, setLoadingProblem] = useState(true);
  const [error, setError] = useState("");

  const languages = [
    { value: "c", label: "C", mode: "c_cpp" },
    { value: "cpp", label: "C++", mode: "c_cpp" },
    { value: "java", label: "Java", mode: "java" },
    { value: "python", label: "Python3", mode: "python" },
  ];

  const safeDecodeBase64 = (str) => {
    try {
      return decodeURIComponent(escape(atob(str)));
    } catch (e) {
      console.error("Error decoding Base64 string:", e.message);
      return str;
    }
  };

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "leetcodequestions")
        );
        const problemDoc = querySnapshot.docs.find(
          (doc) => String(doc.data().id) === problemLink
        );
        if (problemDoc) {
          const firstProblem = problemDoc.data();
          const decodedSampleCode = {
            c: safeDecodeBase64(firstProblem.sampleCode.c),
            cpp: safeDecodeBase64(firstProblem.sampleCode.cpp),
            java: safeDecodeBase64(firstProblem.sampleCode.java),
            python: safeDecodeBase64(firstProblem.sampleCode.python),
          };
          const decodedConstraints = safeDecodeBase64(firstProblem.constraints);
          setProblem({
            ...firstProblem,
            sampleCode: decodedSampleCode,
            constraints: decodedConstraints,
          });
          setCode(decodedSampleCode[language]);
        } else {
          setError(`No problem found with ID ${problemLink}.`);
        }
      } catch (err) {
        setError("Error fetching problem: " + err.message);
      } finally {
        setLoadingProblem(false);
      }
    };
    fetchProblem();
  }, [problemLink, language]);

  const runCode = async () => {
    setLoadingRun(true);
    setOutput("");
    try {
      const response = await axios.post(
        `https://my-cloud-compiler-run-app-168268204735.asia-south1.run.app/run-${language}`,
        { code, input: "" }, // No input needed
        { headers: { "Content-Type": "application/json" } }
      );
      const result = (response.data.output || response.data.error || "").trim();
      setOutput(result);
    } catch (error) {
      setOutput("Error: " + error.message);
    } finally {
      setLoadingRun(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "1":
        return "bg-success text-white";
      case "2":
        return "bg-warning text-dark";
      case "3":
        return "bg-danger text-white";
      case "4":
        return "bg-danger text-white";
      default:
        return "bg-secondary text-white";
    }
  };

  if (loadingProblem)
    return (
      <div className="text-center mt-5 text-white">Loading problem...</div>
    );
  if (error) return <div className="alert alert-danger m-5">{error}</div>;

  return (
    <div className="container-fluid p-0 vh-100 d-flex flex-column bg-dark text-white">
      <div className="bg-black p-2 d-flex justify-content-between align-items-center border-bottom border-secondary">
        <div className="d-flex align-items-center">
          <span className="text-white me-2">Problem List</span>
        </div>
        <div>
          <select
            className="form-select form-select-sm d-inline-block w-auto text-white bg-dark border-dark me-2"
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              setCode(problem?.sampleCode[e.target.value] || "");
            }}
          >
            {languages.map((lang) => (
              <option
                key={lang.value}
                value={lang.value}
                className="bg-dark text-white"
              >
                {lang.label}
              </option>
            ))}
          </select>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={runCode}
            disabled={loadingRun}
          >
            <FaPlay className="me-1" /> {loadingRun ? "Running..." : "Run"}
          </button>
        </div>
      </div>

      <div className="row flex-grow-1 m-0" style={{ overflow: "hidden" }}>
        <div
          className="col-md-6 p-3 bg-dark border-end border-secondary"
          style={{ overflowY: "auto", height: "calc(100vh - 60px)" }}
        >
          <h4>
            {problem?.id}. {problem?.title}
          </h4>
          <p className="mb-2">
            <span
              className={`px-1 py-0 rounded d-inline-block ${getDifficultyColor(
                problem?.difficulty
              )}`}
              style={{ fontSize: "0.8rem", lineHeight: "1.2" }}
            >
              {problem?.difficulty === "1"
                ? "Easy"
                : problem?.difficulty === "2"
                ? "Medium"
                : problem?.difficulty === "3"
                ? "Hard"
                : "Very Hard"}
            </span>
          </p>
          <div className="mb-5">
            <p>{problem?.description}</p>
          </div>
          <div className="mb-5">
            {problem?.examples.map((ex, i) => (
              <div key={i} className="mb-3">
                <h6 className="text-white">Example {i + 1}:</h6>
                <p className="mb-1">
                  <strong>Input:</strong> {ex.input}
                </p>
                <p className="mb-1">
                  <strong>Output:</strong> {ex.output}
                </p>
                <p className="mb-0">
                  <strong>Explanation:</strong> {ex.explanation}
                </p>
              </div>
            ))}
          </div>
          <div className="mb-3">
            <h6 className="text-white">Constraints:</h6>
            <ul className="list-unstyled">
              {problem?.constraints
                .split("\n")
                .filter((c) => c.trim())
                .map((c, i) => (
                  <li key={i} className="mb-1">
                    <span
                      className="bg-secondary px-2 py-1 rounded d-inline-block"
                      style={{ lineHeight: "1.5" }}
                    >
                      • {c}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div
          className="col-md-6 p-0 d-flex flex-column"
          style={{ height: "calc(100vh - 60px)" }}
        >
          <div className="bg-dark p-2 border-bottom border-secondary d-flex justify-content-between align-items-center">
            <span className="text-white">Code</span>
            <span className="text-muted">Ln 1, Col 1</span>
          </div>
          <div className="flex-grow-1" style={{ height: "60%" }}>
            <AceEditor
              mode={languages.find((lang) => lang.value === language).mode}
              theme="monokai"
              value={code}
              onChange={setCode}
              name="code-editor"
              editorProps={{ $blockScrolling: true }}
              width="100%"
              height="100%"
              fontSize={14}
              showPrintMargin={false}
              setOptions={{ showLineNumbers: true, tabSize: 2 }}
            />
          </div>

          <div
            className="p-3 bg-dark border-top border-secondary"
            style={{ height: "40%" }}
          >
            <h6 className="text-white mb-2">Output</h6>
            <div
              className="bg-secondary p-2 rounded"
              style={{ height: "calc(100% - 40px)", overflowY: "auto" }}
            >
              <pre className="mb-0 text-white">
                {output || "Run your code to see the output..."}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodeEditor;
