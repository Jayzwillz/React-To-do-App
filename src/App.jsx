import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TodoDetail from "./pages/TodoDetail";
import ErrorPage from "./pages/ErrorPage";
import Navbar from "./components/Navbar";
import NotFoundPage from "./components/404ErrorPage"; // Import 404ErrorPage
import ErrorBoundary from "./utils/ErrorBoundary";

const App = () => {
  return (
    <Router>
      <Navbar />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/todos/:id" element={<TodoDetail />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<NotFoundPage />} />{" "}
          {/* Render 404ErrorPage */}
        </Routes>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
