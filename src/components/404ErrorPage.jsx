import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for does not exist or might have been removed.</p>
      <button
        onClick={() => navigate("/")}
        style={{ marginTop: "20px", padding: "10px 20px" }}
      >
        Go Back to Home
      </button>
    </div>
  );
};

export default NotFoundPage;
