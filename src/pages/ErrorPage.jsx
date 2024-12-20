import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const [simulateError, setSimulateError] = useState(false);
  const navigate = useNavigate();

  if (simulateError) {
    // Simulate an error to trigger ErrorBoundary
    throw new Error("This is a simulated error for testing Error Boundary!");
  }

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Error Page</h1>
      <p>This page is designed to test error handling scenarios.</p>

      {/* Button to test Error Boundary */}
      <button
        onClick={() => setSimulateError(true)}
        style={{ margin: "10px", padding: "10px 20px" }}
      >
        Test Error Boundary
      </button>

      {/* Button to test 404 Page */}
      <button
  onClick={() => navigate("/non-existent-path")}
  style={{ margin: "10px", padding: "10px 20px" }}
>
  Test 404 Page
</button>

    </div>
  );
};

export default ErrorPage;
