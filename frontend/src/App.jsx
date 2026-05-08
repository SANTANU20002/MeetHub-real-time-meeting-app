import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import LoginRegister from "./compoonents/LoginRegister";
import Dashboard from "./compoonents/Dashboard";
import loadinng from "../src/assets/loading.mp4";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check session on app load
  useEffect(() => {
    axios
      .get("http://localhost:5000/me", { withCredentials: true })
      .then((res) => {
        if (res.data.loggedIn) {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        } else {
          setUser(null);
          localStorage.removeItem("user");
        }
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 5000); // 1 minute = 60,000 ms
      return () => clearTimeout(timer);
    } else {
      setShowLoading(false);
    }
  }, [loading]);

  if (showLoading) {
    return (
      <div className="loading-video-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100vw" }}>
        <video
          src={loadinng}
          autoPlay
          loop
          muted
          style={{ width: "320px", height: "auto" }}
        />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard/home" /> : <LoginRegister />}
        />
        <Route path="/login" element={<LoginRegister />} />

        {/* 🔹 Dashboard routes with nested pages */}
        <Route
          path="/dashboard/*"
          element={user ? <Dashboard setUser={setUser} /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
