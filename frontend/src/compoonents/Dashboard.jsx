import React, { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";

import dashboardLogo from "../assets/meethub-logo.png";

import Sidebar from "./DashboardComponents/Sidebar";
import HomePage from "./DashboardComponents/HomePage";
import ChatPage from "./DashboardComponents/ChatPage";
import VideoCallPage from "./DashboardComponents/VideoCallPage";
import GroupMeeting from "./DashboardComponents/GroupMeeting";
import Status from "./DashboardComponents/Status";
import AiChat from "./DashboardComponents/AiChat";
import PhotoEditor from "./DashboardComponents/editor/PhotoEditor.tsx";
import VideoEditor from "./DashboardComponents/editor/VideoEditor";

import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

import "../index.css";

function Dashboard({ setUser }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when screen size becomes large
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 500) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/logout",
        {},
        { withCredentials: true }
      );

      localStorage.removeItem("user");
      setUser(null);
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <>
      {/* Add style tag for custom CSS */}
      <style>
        {`
          .dashboard-wrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dashboard-navbar {
  height: 65px;
  background:rgb(0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  border-bottom: 1px solid #333;
  z-index: 100;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.8rem;
  cursor: pointer;
  padding: 8px;
}

.dashboard-logo {
  height: 30px;
  width: auto;
}

.navbar-right {
  display: flex;
  align-items: center;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ff4757;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.logout-btn:hover {
  background: #ff3742;
  transform: translateY(-2px);
}

.logout-text {
  display: none;
}

/* ================= Responsive Sidebar ================= */
.dashboard-body {
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
}

.dashboard-sidebar {
  width: 260px;
  background: #1e1e2f;
  border-right: 1px solid #333;
  transition: transform 0.4s ease;
  z-index: 90;
}

.dashboard-content {
  flex: 1;
  overflow-y: auto;
  background:rgb(0, 0, 0);
}

/* Mobile Behavior */
@media (max-width: 420px) {
  .mobile-menu-btn {
    display: block;
  }

  .dashboard-sidebar {
    position: fixed;
    top: 65px;
    left: 0;
    bottom: 0;
    transform: translateX(-100%);
    box-shadow: 4px 0 15px rgba(0, 0, 0, 0.5);
    z-index: 9999 !important;
  }

  .dashboard-sidebar.show-sidebar {
    transform: translateX(0);
  }

  .sidebar-overlay {
    position: fixed;
    top: 65px;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 80;
  }

  .logout-text {
    display: inline;
  }
}

/* Desktop */
@media (min-width: 501px) {
  .dashboard-sidebar {
    position: relative;
    transform: none !important;
  }
}
        `}
      </style>
      <div className="dashboard-wrapper">
        {/* ================= NAVBAR ================= */}
        <nav className="dashboard-navbar">
          <div className="navbar-left">
            {/* Mobile Menu Button - Only visible under 500px */}
            <button
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
            </button>

            <img
              src={dashboardLogo}
              alt="MeetHub Logo"
              className="dashboard-logo"
            />
          </div>

          <div className="navbar-right">
            <button className="logout-btn" onClick={handleLogout} title="Logout">
              <LogoutIcon />
            </button>
          </div>
        </nav>

        {/* ================= BODY ================= */}
        <div className="dashboard-body">
          {/* Mobile Overlay */}
          {sidebarOpen && (
            <div
              className="sidebar-overlay"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* SIDEBAR */}
          <aside className={`dashboard-sidebar ${sidebarOpen ? "show-sidebar" : ""}`}>
            <Sidebar />
          </aside>

          {/* MAIN CONTENT */}
          <main className="dashboard-content">
            <Routes>
              <Route path="home" element={<HomePage />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="video-call" element={<VideoCallPage />} />
              <Route path="meeting" element={<GroupMeeting />} />
              <Route path="status" element={<Status />} />
              <Route path="chat-with-ai" element={<AiChat />} />
              <Route path="photo-editor" element={<PhotoEditor />} />
              <Route path="video-editor" element={<VideoEditor />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
}

export default Dashboard;