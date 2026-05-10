// Status.js
import React, { useState, useEffect, useRef } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CircularProgress,
  Fab,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Videocam from "@mui/icons-material/Videocam";
import TextFields from "@mui/icons-material/TextFields";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import PaletteIcon from "@mui/icons-material/Palette";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import io from "socket.io-client";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../index.css";

const socket = io("http://localhost:5000", {
  withCredentials: true,
  transports: ["websocket"],
});

/* ---------- tiny time-ago helper ---------- */
const timeAgo = (date) => {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const diff = Date.now() - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days) return rtf.format(-days, "day");
  if (hours) return rtf.format(-hours, "hour");
  if (minutes) return rtf.format(-minutes, "minute");
  return rtf.format(-seconds, "second");
};

/* ---------- Inline styles ---------- */
const styles = {
  app: {
    minHeight: "86vh",
    paddingBottom: 80,
    background: "#0a0a0f",
    fontFamily: "'Outfit', 'Sora', sans-serif",
  },
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "min(520px, 95vw)",
    maxHeight: "90vh",
    overflowY: "auto",
    background: "linear-gradient(145deg, #0f0f1a 0%, #141428 100%)",
    border: "1px solid rgba(56,182,255,0.2)",
    borderRadius: 5,
    boxShadow: "0 0 60px rgba(56,182,255,0.12), 0 24px 48px rgba(0,0,0,0.7)",
    p: 4,
    outline: "none",
    position: "relative",
    backdropFilter: "blur(20px)",
  },
  viewer: {
    position: "relative",
    width: "min(700px, 96vw)",
    maxHeight: "92vh",
    background: "linear-gradient(180deg, #07070f 0%, #0d0d1f 100%)",
    borderRadius: '10px',
    border: "1px solid rgba(56,182,255,0.15)",
    boxShadow: "0 0 80px rgba(56,182,255,0.1), 0 32px 64px rgba(0,0,0,0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    minHeight: 480,
  },
  card: {
    background: "linear-gradient(135deg, #111122 0%, #0e0e1e 100%)",
    border: "1px solid rgba(56,182,255,0.1)",
    borderRadius: "16px !important",
    transition: "all 0.25s ease",
    "&:hover": {
      border: "1px solid rgba(56,182,255,0.35)",
      boxShadow: "0 0 24px rgba(56,182,255,0.08)",
      transform: "translateY(-2px)",
    },
  },
  sectionLabel: {
    fontWeight: 700,
    fontSize: "0.75rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "#38b6ff",
    mb: 1.5,
  },
  thumbnail: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 80,
    height: 80,
    borderRadius: 14,
    overflow: "hidden",
    border: "2px solid rgba(56,182,255,0.3)",
    cursor: "pointer",
    mr: 1.5,
    verticalAlign: "top",
    flexShrink: 0,
    transition: "all 0.2s ease",
    "&:hover": {
      border: "2px solid #38b6ff",
      boxShadow: "0 0 16px rgba(56,182,255,0.35)",
      transform: "scale(1.05)",
    },
  },
  smallThumbnail: {
    width: 56,
    height: 56,
    borderRadius: 10,
  },
  fab: {
    position: "fixed",
    bottom: 32,
    right: 32,
    background: "linear-gradient(135deg, #38b6ff 0%, #1a8fd4 100%)",
    boxShadow: "0 4px 24px rgba(56,182,255,0.45)",
    "&:hover": {
      background: "linear-gradient(135deg, #5cc5ff 0%, #38b6ff 100%)",
      boxShadow: "0 6px 32px rgba(56,182,255,0.6)",
    },
  },
  typeBtn: (active) => ({
    borderRadius: 50,
    px: 2.5,
    py: 0.8,
    fontSize: "0.82rem",
    fontWeight: 600,
    letterSpacing: "0.03em",
    border: active ? "none" : "1px solid rgba(56,182,255,0.35)",
    background: active
      ? "linear-gradient(135deg, #38b6ff 0%, #1a8fd4 100%)"
      : "rgba(56,182,255,0.05)",
    color: active ? "#fff" : "#38b6ff",
    "&:hover": {
      background: active
        ? "linear-gradient(135deg, #5cc5ff 0%, #38b6ff 100%)"
        : "rgba(56,182,255,0.12)",
      border: active ? "none" : "1px solid rgba(56,182,255,0.6)",
    },
    textTransform: "none",
  }),
  postBtn: {
    borderRadius: 50,
    py: 1.5,
    fontWeight: 700,
    fontSize: "0.95rem",
    letterSpacing: "0.05em",
    textTransform: "none",
    background: "linear-gradient(135deg, #38b6ff 0%, #1a8fd4 100%)",
    boxShadow: "0 4px 20px rgba(56,182,255,0.4)",
    "&:hover": {
      background: "linear-gradient(135deg, #5cc5ff 0%, #38b6ff 100%)",
      boxShadow: "0 6px 28px rgba(56,182,255,0.55)",
    },
    "&:disabled": {
      background: "rgba(56,182,255,0.15)",
      color: "rgba(255,255,255,0.3)",
    },
  },
  textField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: 3,
      background: "rgba(56,182,255,0.04)",
      color: "#e8f4ff",
      fontSize: "0.92rem",
      "& fieldset": {
        borderColor: "rgba(56,182,255,0.2)",
      },
      "&:hover fieldset": {
        borderColor: "rgba(56,182,255,0.45)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#38b6ff",
        boxShadow: "0 0 0 3px rgba(56,182,255,0.12)",
      },
    },
    "& .MuiInputBase-input::placeholder": {
      color: "rgba(56,182,255,0.4)",
    },
  },
  avatarRing: {
    width: 64,
    height: 64,
    mr: 2.5,
    border: "3px solid #38b6ff",
    boxShadow: "0 0 16px rgba(56,182,255,0.4)",
  },
  avatarRingNone: {
    width: 64,
    height: 64,
    mr: 2.5,
    border: "3px solid rgba(255,255,255,0.1)",
  },
};

const Status = () => {
  /* ------------------- state ------------------- */
  const [statusType, setStatusType] = useState("text");
  const [statusText, setStatusText] = useState("");
  const [statusFile, setStatusFile] = useState(null);
  const [bgColor, setBgColor] = useState("#0d1b2a");
  const [textColor, setTextColor] = useState("#38b6ff");
  const [uploading, setUploading] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [statuses, setStatuses] = useState([]);
  const [user, setUser] = useState(null);
  const [viewer, setViewer] = useState({ open: false, group: null, index: 0 });
  const [currentProgress, setCurrentProgress] = useState(0);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  /* ------------------- auth ------------------- */
  useEffect(() => {
    fetch("http://localhost:5000/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.loggedIn) {
          setUser(d.user);
          socket.emit("registerUser", { email: d.user.email });
        }
      })
      .catch(console.error);
  }, []);

  /* ------------------- load + realtime ------------------- */
  useEffect(() => {
    if (!user) return;
    fetchStatuses();

    socket.on("newStatus", (newStatus) => {
      setStatuses((prev) => {
        const filtered = prev.filter((s) => s.id !== newStatus.id);
        return [newStatus, ...filtered];
      });
    });
    return () => socket.off("newStatus");
  }, [user]);

  const fetchStatuses = async () => {
    try {
      const r = await fetch("http://localhost:5000/statuses", {
        credentials: "include",
      });
      const data = await r.json();
      setStatuses(data);
    } catch (e) {
      console.error(e);
    }
  };

  /* ------------------- file ------------------- */
  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) {
      setStatusFile(f);
      setStatusType(f.type.startsWith("video") ? "video" : "image");
    }
  };

  /* ------------------- post ------------------- */
  const postStatus = async () => {
    if (!statusText.trim() && !statusFile) return;
    setUploading(true);
    const fd = new FormData();
    fd.append(
      "type",
      statusFile
        ? statusFile.type.startsWith("video")
          ? "video"
          : "image"
        : "text"
    );
    if (statusText) fd.append("text", statusText);
    if (statusFile) fd.append("file", statusFile);
    if (statusType === "text") {
      fd.append("bgColor", bgColor);
      fd.append("textColor", textColor);
    }

    try {
      const r = await fetch("http://localhost:5000/status", {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      if (!r.ok) throw new Error((await r.json()).message || "Failed");
      setStatusText("");
      setStatusFile(null);
      setStatusType("text");
      setBgColor("#0d1b2a");
      setTextColor("#38b6ff");
      setShowAddCard(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (e) {
      alert(e.message || "Network error");
    } finally {
      setUploading(false);
    }
  };

  /* ------------------- grouping ------------------- */
  const grouped = (() => {
    const map = {};
    statuses.forEach((s) => {
      const k = s.user_id;
      if (!map[k]) {
        map[k] = {
          user: { id: s.user_id, name: s.name, pic: s.profile_picture },
          items: [],
        };
      }
      map[k].items.push(s);
    });
    return Object.values(map)
      .map((g) => ({
        ...g,
        latest: Math.max(...g.items.map((i) => new Date(i.created_at).getTime())),
      }))
      .sort((a, b) => b.latest - a.latest);
  })();

  const myGroup = grouped.find((g) => g.user.id === user?.id);
  const contacts = grouped.filter((g) => g.user.id !== user?.id);

  /* ------------------- viewer helpers ------------------- */
  const openViewer = (group, idx = 0) => setViewer({ open: true, group, index: idx });
  const closeViewer = () => setViewer({ open: false, group: null, index: 0 });
  const next = () =>
    setViewer((v) => ({ ...v, index: (v.index + 1) % v.group.items.length }));
  const prev = () =>
    setViewer((v) => ({ ...v, index: (v.index - 1 + v.group.items.length) % v.group.items.length }));
  const current = viewer.group?.items[viewer.index];

  /* ------------------- viewer auto-advance and progress ------------------- */
  useEffect(() => {
    if (!viewer.open || !current) return;
    setCurrentProgress(0);

    let intervalId;
    if (current.type === "video") {
      const video = videoRef.current;
      if (video) {
        video.play();
        const updateProgress = () => {
          if (video.duration) {
            setCurrentProgress((video.currentTime / video.duration) * 100);
          }
        };
        video.addEventListener("timeupdate", updateProgress);
        video.addEventListener("ended", next);
        return () => {
          video.pause();
          video.removeEventListener("timeupdate", updateProgress);
          video.removeEventListener("ended", next);
        };
      }
    } else {
      const duration = 5000;
      const updateInterval = 20;
      const step = 100 / (duration / updateInterval);
      intervalId = setInterval(() => {
        setCurrentProgress((prev) => {
          const newProg = prev + step;
          if (newProg >= 100) {
            clearInterval(intervalId);
            next();
            return 100;
          }
          return newProg;
        });
      }, updateInterval);
      return () => clearInterval(intervalId);
    }
  }, [viewer.open, viewer.index, current]);

  /* ------------------- render ------------------- */
  return (
    <Box sx={styles.app}>

      {/* ---------- Add Status Modal ---------- */}
      <Modal open={showAddCard} onClose={() => setShowAddCard(false)}>
        <Box sx={styles.modal}>
          {/* Glow top accent */}
          <Box sx={{
            position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
            width: "60%", height: 2,
            background: "linear-gradient(90deg, transparent, #38b6ff, transparent)",
            borderRadius: "0 0 4px 4px",
          }} />

          <IconButton
            onClick={() => setShowAddCard(false)}
            sx={{ position: "absolute", top: 12, right: 12, color: "rgba(56,182,255,0.6)",
              "&:hover": { color: "#38b6ff", background: "rgba(56,182,255,0.1)" } }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          <Typography variant="h6" gutterBottom sx={{
            fontWeight: 800,
            fontSize: "1.2rem",
            letterSpacing: "-0.01em",
            color: "#e8f4ff",
            mb: 2.5,
          }}>
            New Status
          </Typography>

          {/* Type Buttons */}
          <Box sx={{ display: "flex", gap: 1.5, mb: 3, flexWrap: "wrap" }}>
            <Button
              variant={statusType === "text" ? "contained" : "outlined"}
              startIcon={<TextFields sx={{ fontSize: "1rem !important" }} />}
              onClick={() => { setStatusType("text"); setStatusFile(null); }}
              sx={styles.typeBtn(statusType === "text")}
            >
              Text
            </Button>
            <Button
              variant={statusType === "image" ? "contained" : "outlined"}
              startIcon={<PhotoCamera sx={{ fontSize: "1rem !important" }} />}
              component="label"
              sx={styles.typeBtn(statusType === "image")}
            >
              Photo
              <input ref={fileInputRef} hidden accept="image/*" type="file" onChange={handleFile} />
            </Button>
            <Button
              variant={statusType === "video" ? "contained" : "outlined"}
              startIcon={<Videocam sx={{ fontSize: "1rem !important" }} />}
              component="label"
              sx={styles.typeBtn(statusType === "video")}
            >
              Video
              <input ref={fileInputRef} hidden accept="video/*" type="file" onChange={handleFile} />
            </Button>
          </Box>

          {/* Color Pickers */}
          {statusType === "text" && (
            <Box sx={{ display: "flex", gap: 2, mb: 3, justifyContent: "center",
              background: "rgba(56,182,255,0.05)", borderRadius: 3, p: 2,
              border: "1px solid rgba(56,182,255,0.1)" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PaletteIcon fontSize="small" sx={{ color: "#38b6ff" }} />
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem" }}>
                  Background
                </Typography>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  style={{
                    width: 36, height: 36, border: "2px solid rgba(56,182,255,0.3)",
                    borderRadius: 8, cursor: "pointer", background: "transparent", padding: 2,
                  }}
                />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FormatColorTextIcon fontSize="small" sx={{ color: "#38b6ff" }} />
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem" }}>
                  Text
                </Typography>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  style={{
                    width: 36, height: 36, border: "2px solid rgba(56,182,255,0.3)",
                    borderRadius: 8, cursor: "pointer", background: "transparent", padding: 2,
                  }}
                />
              </Box>
            </Box>
          )}

          <TextField
            fullWidth
            multiline
            rows={statusType === "text" ? 4 : 2}
            placeholder={statusType === "text" ? "What's on your mind?" : "Add a caption..."}
            value={statusText}
            onChange={(e) => setStatusText(e.target.value)}
            sx={{ ...styles.textField, mb: 3 }}
          />

          {/* Preview */}
          <Box sx={{
            mt: 1, mb: 3,
            display: "flex", justifyContent: "center", alignItems: "center", minHeight: 180,
            background: "rgba(56,182,255,0.03)", borderRadius: 4,
            border: "1px dashed rgba(56,182,255,0.15)",
          }}>
            {statusType === "text" ? (
              <Box sx={{
                bgcolor: bgColor, color: textColor,
                p: 4, borderRadius: 4, maxWidth: "88%",
                textAlign: "center", fontSize: "1.2em", fontWeight: 500,
                minHeight: 100, display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
                border: "1px solid rgba(56,182,255,0.1)",
              }}>
                {statusText || (
                  <Typography sx={{ opacity: 0.4, fontSize: "0.95rem" }}>
                    Your status preview
                  </Typography>
                )}
              </Box>
            ) : statusFile ? (
              <Box sx={{ position: "relative", borderRadius: 4, overflow: "hidden",
                boxShadow: "0 4px 24px rgba(0,0,0,0.5)" }}>
                {statusType === "image" ? (
                  <img src={URL.createObjectURL(statusFile)} alt="preview"
                    style={{ maxWidth: "100%", maxHeight: 220, display: "block" }} />
                ) : (
                  <video controls src={URL.createObjectURL(statusFile)}
                    style={{ maxWidth: "100%", maxHeight: 220, display: "block" }} />
                )}
                {statusText && (
                  <Typography sx={{
                    position: "absolute", bottom: 12, left: 0, right: 0,
                    color: "white", textAlign: "center",
                    textShadow: "0 1px 6px rgba(0,0,0,0.9)", px: 3, fontWeight: 600,
                  }}>
                    {statusText}
                  </Typography>
                )}
              </Box>
            ) : (
              <Typography sx={{ color: "rgba(56,182,255,0.35)", fontSize: "0.88rem" }}>
                Choose a photo or video to preview
              </Typography>
            )}
          </Box>

          <Button
            fullWidth
            variant="contained"
            disabled={uploading || (!statusText.trim() && !statusFile)}
            onClick={postStatus}
            startIcon={uploading ? <CircularProgress size={18} sx={{ color: "rgba(255,255,255,0.5)" }} /> : null}
            sx={styles.postBtn}
          >
            {uploading ? "Uploading..." : "Post Status"}
          </Button>
        </Box>
      </Modal>

      {/* ---------- Full-screen Viewer ---------- */}
      <Modal
        open={viewer.open}
        onClose={closeViewer}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(12px)", background: "rgba(0,0,0,0.85)" }}
      >
        <Box sx={styles.viewer}>
          {/* Close */}
          <IconButton
            onClick={closeViewer}
            sx={{ position: "absolute", top: 16, right: 16, color: "#fff", zIndex: 10,
              bgcolor: "rgba(56,182,255,0.15)", border: "1px solid rgba(56,182,255,0.25)",
              "&:hover": { bgcolor: "rgba(56,182,255,0.3)" } }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          {/* Prev */}
          <IconButton
            onClick={prev}
            sx={{ position: "absolute", left: 16, color: "#fff", zIndex: 10,
              bgcolor: "rgba(56,182,255,0.12)", border: "1px solid rgba(56,182,255,0.2)",
              "&:hover": { bgcolor: "rgba(56,182,255,0.28)" } }}
          >
            <ArrowBackIos fontSize="small" />
          </IconButton>

          {/* Next */}
          <IconButton
            onClick={next}
            sx={{ position: "absolute", right: 16, color: "#fff", zIndex: 10,
              bgcolor: "rgba(56,182,255,0.12)", border: "1px solid rgba(56,182,255,0.2)",
              "&:hover": { bgcolor: "rgba(56,182,255,0.28)" } }}
          >
            <ArrowForwardIos fontSize="small" />
          </IconButton>

          {/* Progress Bars */}
          <Box sx={{ position: "absolute", top: 0, left: "5%", right: "5%",
            display: "flex", gap: 0.8, zIndex: 10 }}>
            {viewer.group?.items.map((_, i) => (
              <Box key={i} sx={{
                flex: 1, height: 3, bgcolor: "rgba(255,255,255,0.15)",
                position: "relative", borderRadius: 4, overflow: "hidden",
              }}>
                <Box sx={{
                  width: `${i < viewer.index ? 100 : i > viewer.index ? 0 : currentProgress}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #38b6ff, #7dd9ff)",
                  position: "absolute", left: 0, top: 0,
                  transition: "width 0.1s linear",
                  boxShadow: "0 0 8px rgba(56,182,255,0.6)",
                }} />
              </Box>
            ))}
          </Box>

          {/* User name */}
          <Box sx={{ position: "absolute", top: 28, left: 20, display: "flex",
            alignItems: "center", gap: 1.5, zIndex: 10 }}>
            <Avatar
              src={viewer.group?.user.pic ? `http://localhost:5000${viewer.group.user.pic}` : undefined}
              sx={{ width: 32, height: 32, border: "2px solid #38b6ff",
                boxShadow: "0 0 10px rgba(56,182,255,0.4)" }}
            >
              {viewer.group?.user.name?.[0]?.toUpperCase()}
            </Avatar>
            <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "0.9rem",
              textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}>
              {viewer.group?.user.name}
            </Typography>
          </Box>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={viewer.index}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.25 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, { offset, velocity }) => {
                if (offset.x < -100 || velocity.x < -100) next();
                else if (offset.x > 100 || velocity.x > 100) prev();
              }}
              style={{
                maxWidth: "100%", maxHeight: "90%",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {current?.type === "text" && (
                <Box sx={{
                  bgcolor: current.bg_color || "#0d1b2a",
                  color: current.text_color || "#38b6ff",
                  p: 6, borderRadius: 5,
                  maxWidth: "80%", textAlign: "center",
                  fontSize: "1.7rem", fontWeight: 500, lineHeight: 1.4,
                  boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
                  border: "1px solid rgba(56,182,255,0.15)",
                }}>
                  {current.content}
                </Box>
              )}
              {current?.type === "image" && (
                <Box sx={{ position: "relative", borderRadius: 5, overflow: "hidden",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.7)",
                  border: "1px solid rgba(56,182,255,0.1)" }}>
                  <img
                    src={`http://localhost:5000${current.content}`}
                    alt=""
                    style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }}
                  />
                  {current.text && (
                    <Typography sx={{
                      position: "absolute", bottom: 20, left: 0, right: 0,
                      color: "#fff", textAlign: "center",
                      textShadow: "0 1px 6px rgba(0,0,0,0.9)", px: 3, fontSize: "1.1em", fontWeight: 600,
                    }}>
                      {current.text}
                    </Typography>
                  )}
                </Box>
              )}
              {current?.type === "video" && (
                <Box sx={{ position: "relative", borderRadius: 5, overflow: "hidden",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.7)",
                  border: "1px solid rgba(56,182,255,0.1)" }}>
                  <video
                    ref={videoRef}
                    controls
                    autoPlay
                    src={`http://localhost:5000${current.content}`}
                    style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }}
                  />
                  {current.text && (
                    <Typography sx={{
                      position: "absolute", bottom: 20, left: 0, right: 0,
                      color: "#fff", textAlign: "center",
                      textShadow: "0 1px 6px rgba(0,0,0,0.9)", px: 3, fontSize: "1.1em", fontWeight: 600,
                    }}>
                      {current.text}
                    </Typography>
                  )}
                </Box>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Time */}
          <Typography sx={{
            position: "absolute", bottom: 16, color: "rgba(56,182,255,0.6)",
            fontSize: "0.8rem", letterSpacing: "0.05em",
          }}>
            {current && timeAgo(current.created_at)}
          </Typography>
        </Box>
      </Modal>

      {/* ---------- Main List ---------- */}
      <Box sx={{ pt: 3, px: 2, maxWidth: 640, mx: "auto" }}>

        {/* ---- My Status ---- */}
        <Box sx={{ mb: 4 }}>
          <Typography sx={styles.sectionLabel}>
            My Status
          </Typography>

          <Card
            sx={{
              ...styles.card,
              p: 2,
              cursor: myGroup ? "pointer" : "default",
              mb: 2,
            }}
            onClick={() => myGroup && openViewer(myGroup)}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                src={user?.profile_picture ? `http://localhost:5000${user.profile_picture}` : undefined}
                sx={myGroup ? styles.avatarRing : styles.avatarRingNone}
              >
                {user?.name?.[0]?.toUpperCase() || "?"}
              </Avatar>

              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" sx={{
                  fontWeight: 700, fontSize: "1rem", color: "#e8f4ff",
                }}>
                  My Status
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(56,182,255,0.6)", fontSize: "0.82rem" }}>
                  {myGroup
                    ? `${myGroup.items.length} update${myGroup.items.length > 1 ? "s" : ""}`
                    : "Add your first status"}
                </Typography>
              </Box>

              {!myGroup && (
                <IconButton
                  onClick={() => setShowAddCard(true)}
                  sx={{
                    color: "#38b6ff",
                    bgcolor: "rgba(56,182,255,0.1)",
                    border: "1px solid rgba(56,182,255,0.25)",
                    "&:hover": { bgcolor: "rgba(56,182,255,0.2)" },
                  }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Card>

          {/* My thumbnails */}
          {myGroup && (
            <Box sx={{
              overflowX: "auto", whiteSpace: "nowrap", pb: 1.5,
              "&::-webkit-scrollbar": { height: 3 },
              "&::-webkit-scrollbar-thumb": {
                background: "rgba(56,182,255,0.3)", borderRadius: 4
              },
            }}>
              {myGroup.items.map((s, i) => (
                <Box
                  key={s.id}
                  onClick={() => openViewer(myGroup, i)}
                  sx={{
                    ...styles.thumbnail,
                    bgcolor: s.type === "text" ? (s.bg_color || "#0d1b2a") : undefined,
                    color: s.type === "text" ? (s.text_color || "#38b6ff") : undefined,
                  }}
                >
                  {s.type === "text" ? (
                    <Box sx={{
                      width: "100%", height: "100%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, p: 0.5, textAlign: "center", overflow: "hidden", fontWeight: 500,
                    }}>
                      {s.content.slice(0, 20) + (s.content.length > 20 ? "…" : "")}
                    </Box>
                  ) : s.type === "image" ? (
                    <img src={`http://localhost:5000${s.content}`} alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <video src={`http://localhost:5000${s.content}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* ---- Recent Updates ---- */}
        <Typography sx={styles.sectionLabel}>
          Recent Updates
        </Typography>

        {contacts.length === 0 ? (
          <Box sx={{
            my: 6, textAlign: "center",
            py: 5, borderRadius: 4,
            border: "1px dashed rgba(56,182,255,0.15)",
            background: "rgba(56,182,255,0.03)",
          }}>
            <Typography sx={{ color: "rgba(56,182,255,0.4)", fontSize: "0.9rem", fontStyle: "italic" }}>
              No recent updates from contacts
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.2)", fontSize: "0.8rem", mt: 0.5 }}>
              Check back later!
            </Typography>
          </Box>
        ) : (
          contacts.map((g) => (
            <motion.div
              key={g.user.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <Card
                sx={{
                  ...styles.card,
                  p: 2,
                  cursor: "pointer",
                  mb: 1.5,
                }}
                onClick={() => openViewer(g)}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    src={g.user.pic ? `http://localhost:5000${g.user.pic}` : undefined}
                    sx={styles.avatarRing}
                  >
                    {g.user.name[0].toUpperCase()}
                  </Avatar>

                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{
                      fontWeight: 700, fontSize: "1rem", color: "#e8f4ff",
                    }}>
                      {g.user.name}
                    </Typography>
                    <Typography variant="body2" sx={{
                      color: "rgba(56,182,255,0.55)", fontSize: "0.82rem",
                    }}>
                      {timeAgo(g.latest)}
                    </Typography>
                  </Box>

                  {/* Item count badge */}
                  <Box sx={{
                    px: 1.5, py: 0.3, borderRadius: 20,
                    background: "rgba(56,182,255,0.12)",
                    border: "1px solid rgba(56,182,255,0.2)",
                  }}>
                    <Typography sx={{ fontSize: "0.75rem", color: "#38b6ff", fontWeight: 600 }}>
                      {g.items.length}
                    </Typography>
                  </Box>
                </Box>
              </Card>

              {/* Thumbnails for contact */}
              <Box sx={{
                ml: 9, mt: -1, mb: 2.5,
                overflowX: "auto", whiteSpace: "nowrap", pb: 1,
                "&::-webkit-scrollbar": { height: 3 },
                "&::-webkit-scrollbar-thumb": {
                  background: "rgba(56,182,255,0.25)", borderRadius: 4
                },
              }}>
                {g.items.slice(0, 5).map((s, i) => (
                  <Box
                    key={s.id}
                    onClick={(e) => { e.stopPropagation(); openViewer(g, i); }}
                    sx={{
                      ...styles.thumbnail,
                      ...styles.smallThumbnail,
                      bgcolor: s.type === "text" ? (s.bg_color || "#0d1b2a") : undefined,
                      color: s.type === "text" ? (s.text_color || "#38b6ff") : undefined,
                    }}
                  >
                    {s.type === "text" ? (
                      <Box sx={{
                        width: "100%", height: "100%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10, p: 0.5, textAlign: "center", fontWeight: 500,
                      }}>
                        {s.content.slice(0, 15) + (s.content.length > 15 ? "…" : "")}
                      </Box>
                    ) : s.type === "image" ? (
                      <img src={`http://localhost:5000${s.content}`} alt=""
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <video src={`http://localhost:5000${s.content}`}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    )}
                  </Box>
                ))}
                {g.items.length > 5 && (
                  <Box
                    onClick={() => openViewer(g)}
                    sx={{
                      ...styles.thumbnail,
                      ...styles.smallThumbnail,
                      bgcolor: "rgba(56,182,255,0.08)",
                      color: "#38b6ff",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      border: "2px dashed rgba(56,182,255,0.35)",
                    }}
                  >
                    +{g.items.length - 5}
                  </Box>
                )}
              </Box>
            </motion.div>
          ))
        )}
      </Box>

      {/* ---------- FAB ---------- */}
      <Fab
        sx={styles.fab}
        onClick={() => setShowAddCard(true)}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default Status;