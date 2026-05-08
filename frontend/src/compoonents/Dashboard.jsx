import React from "react";
import axios from "axios";
import { Routes, Route, Outlet } from "react-router-dom";
import dashboardLogo from "../assets/meethub-logo.png";
import Sidebar from './DashboardComponents/Sidebar';
import HomePage from './DashboardComponents/HomePage';
import ChatPage from "./DashboardComponents/ChatPage";
import VideoCallPage from "./DashboardComponents/VideoCallPage";
import GroupMeeting from "./DashboardComponents/GroupMeeting";
import Status from "./DashboardComponents/Status";
import LogoutIcon from '@mui/icons-material/Logout';
import AiChat from "./DashboardComponents/AiChat";
import PhotoEditor from "./DashboardComponents/editor/PhotoEditor.tsx";
import VideoEditor from "./DashboardComponents/editor/VideoEditor";
import "../index.css";

function Dashboard({ setUser }) {

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/logout", {}, { withCredentials: true });
      localStorage.removeItem("user");
      setUser(null);
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="dashboard-wrapper">

      {/* 🔹 Fixed Navbar */}
      <div className="dashboard-navbar d-flex justify-content-between align-items-center px-3">
        <img src={dashboardLogo} alt="Dashboard Logo" style={{ height: "30px" }} />
        <button className="btn btn-danger" onClick={handleLogout}>
          <LogoutIcon />
        </button>
      </div>

      {/* 🔹 Layout */}
      <div className="dashboard-body">
        
        {/* 🔹 Fixed Sidebar */}
        <div className="dashboard-sidebar">
          <Sidebar />
        </div>

        {/* 🔹 Scrollable Content */}
        <div className="dashboard-content">
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
          <Outlet />
        </div>

      </div>
    </div>
  );
}

export default Dashboard;