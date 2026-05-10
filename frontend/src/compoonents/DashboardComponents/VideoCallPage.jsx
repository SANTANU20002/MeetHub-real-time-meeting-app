import React, { useState, useEffect, useRef } from "react";
import Avatar from "@mui/material/Avatar";
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import MicOffIcon from '@mui/icons-material/MicOff';
import MicIcon from '@mui/icons-material/Mic';
import CallEndIcon from '@mui/icons-material/CallEnd';
import CallIcon from "@mui/icons-material/Call";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { io } from "socket.io-client";
import ringtone from "../../assets/tune.mp3";

const socket = io("http://localhost:5000", {
  withCredentials: true,
  transports: ["websocket"],
});

/* ─── Injected global styles ─── */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --accent: #38b6ff;
    --accent-dim: rgba(56,182,255,0.18);
    --accent-glow: rgba(56,182,255,0.35);
    --accent-dark: #1a7fbf;
    --bg: #000000;
    --bg-2: #0a0a0a;
    --bg-3: #111111;
    --bg-4: #181818;
    --text-primary: #e8f4ff;
    --text-secondary: rgba(232,244,255,0.5);
    --border: rgba(56,182,255,0.14);
    --border-hover: rgba(56,182,255,0.35);
    --danger: #ff3b5c;
    --danger-dim: rgba(255,59,92,0.2);
    --font-mono: 'Space Mono', monospace;
    --font-body: 'DM Sans', sans-serif;
  }

  ::-webkit-scrollbar { width: 0; height: 0; }

  @keyframes pulse-ring {
    0%   { box-shadow: 0 0 0 0 var(--accent-glow); }
    70%  { box-shadow: 0 0 0 22px rgba(56,182,255,0); }
    100% { box-shadow: 0 0 0 0 rgba(56,182,255,0); }
  }

  @keyframes float-in {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes scan-line {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.3; }
  }

  @keyframes slide-up {
    from { opacity: 0; transform: translateY(30px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .vc-root {
    height: 100dvh;
    background: var(--bg);
    display: flex;
    overflow: hidden;
    font-family: var(--font-body);
    position: relative;
  }

  /* ─ Scanline overlay ─ */
  .vc-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(56,182,255,0.012) 2px,
      rgba(56,182,255,0.012) 4px
    );
    pointer-events: none;
    z-index: 9998;
  }

  /* ══════════════ SIDEBAR ══════════════ */
  .vc-sidebar {
    width: 320px;
    min-width: 320px;
    height: 100%;
    background: var(--bg-2);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 10;
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .vc-sidebar-header {
    padding: 28px 24px 20px;
    border-bottom: 1px solid var(--border);
    background: linear-gradient(180deg, rgba(56,182,255,0.04) 0%, transparent 100%);
  }

  .vc-sidebar-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 6px;
  }

  .vc-logo-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 10px var(--accent);
    animation: blink 2s ease-in-out infinite;
  }

  .vc-sidebar-title {
    font-family: var(--font-mono);
    color: var(--accent);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
  }

  .vc-sidebar-subtitle {
    color: var(--text-secondary);
    font-size: 12px;
    letter-spacing: 0.5px;
    padding-left: 18px;
  }

  .vc-contact-list {
    flex: 1;
    overflow-y: auto;
    padding: 10px 0;
  }

  .vc-contact-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 24px;
    cursor: pointer;
    border-left: 2px solid transparent;
    transition: all 0.2s ease;
    position: relative;
    background: transparent;
  }

  .vc-contact-item:hover {
    background: var(--accent-dim);
    border-left-color: rgba(56,182,255,0.4);
  }

  .vc-contact-item.active {
    background: linear-gradient(90deg, rgba(56,182,255,0.14) 0%, transparent 100%);
    border-left-color: var(--accent);
  }

  .vc-contact-avatar {
    width: 44px !important;
    height: 44px !important;
    font-size: 17px !important;
    font-weight: 700 !important;
    font-family: var(--font-mono) !important;
    flex-shrink: 0;
    transition: all 0.2s ease;
  }

  .vc-contact-item.active .vc-contact-avatar {
    background: linear-gradient(135deg, var(--accent), var(--accent-dark)) !important;
    color: #000 !important;
    box-shadow: 0 0 14px var(--accent-glow) !important;
  }

  .vc-contact-item:not(.active) .vc-contact-avatar {
    background: var(--bg-4) !important;
    color: var(--accent) !important;
    border: 1px solid var(--border) !important;
  }

  .vc-contact-name {
    color: var(--text-primary);
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .vc-contact-email {
    color: var(--text-secondary);
    font-size: 11px;
    font-family: var(--font-mono);
    letter-spacing: 0.2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .vc-online-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 6px var(--accent);
    margin-left: auto;
    flex-shrink: 0;
    animation: blink 3s ease-in-out infinite;
  }

  /* ══════════════ MAIN PANEL ══════════════ */
  .vc-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    background: var(--bg);
  }

  .vc-grid-bg {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(56,182,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(56,182,255,0.03) 1px, transparent 1px);
    background-size: 44px 44px;
    pointer-events: none;
  }

  .vc-glow-orb {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(56,182,255,0.06) 0%, transparent 70%);
    pointer-events: none;
  }

  /* ─ Idle card ─ */
  .vc-idle-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 28px;
    z-index: 2;
    animation: float-in 0.5s ease both;
  }

  .vc-idle-ring-outer {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    border: 1px solid rgba(56,182,255,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 50px rgba(56,182,255,0.05);
  }

  .vc-idle-ring-inner {
    width: 118px;
    height: 118px;
    border-radius: 50%;
    border: 1px solid rgba(56,182,255,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .vc-idle-avatar {
    width: 86px !important;
    height: 86px !important;
    font-size: 32px !important;
    font-weight: 800 !important;
    font-family: var(--font-mono) !important;
    background: linear-gradient(135deg, var(--accent), var(--accent-dark)) !important;
    color: #000 !important;
    box-shadow: 0 0 28px var(--accent-glow) !important;
  }

  .vc-idle-name {
    font-family: var(--font-mono);
    color: var(--text-primary);
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    text-align: center;
  }

  .vc-idle-email {
    color: var(--text-secondary);
    font-size: 12px;
    font-family: var(--font-mono);
    letter-spacing: 1px;
    text-align: center;
    margin-top: 4px;
  }

  .vc-call-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 36px;
    background: linear-gradient(135deg, var(--accent), var(--accent-dark));
    border: none;
    border-radius: 50px;
    color: #000;
    font-size: 12px;
    font-weight: 700;
    font-family: var(--font-mono);
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    box-shadow: 0 0 28px var(--accent-glow), 0 4px 20px rgba(0,0,0,0.5);
    transition: all 0.2s ease;
  }

  .vc-call-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 42px var(--accent-glow), 0 8px 28px rgba(0,0,0,0.5);
  }

  /* ─ Empty state ─ */
  .vc-empty-state {
    font-family: var(--font-mono);
    color: rgba(56,182,255,0.25);
    font-size: 12px;
    letter-spacing: 3px;
    text-transform: uppercase;
    text-align: center;
    z-index: 2;
    padding: 20px;
  }

  /* ══════════════ ACTIVE CALL ══════════════ */
  .vc-call-wrapper {
    position: absolute;
    inset: 0;
    background: #000;
  }

  .vc-remote-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .vc-remote-avatar {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120px !important;
    height: 120px !important;
    font-size: 48px !important;
    font-weight: 800 !important;
    font-family: var(--font-mono) !important;
    background: linear-gradient(135deg, var(--accent), var(--accent-dark)) !important;
    color: #000 !important;
    box-shadow: 0 0 40px var(--accent-glow) !important;
  }

  .vc-local-wrapper {
    position: absolute;
    bottom: 90px;
    right: 20px;
    width: 180px;
    height: 135px;
    border-radius: 14px;
    overflow: hidden;
    border: 1px solid rgba(56,182,255,0.4);
    box-shadow: 0 0 24px rgba(0,0,0,0.7), 0 0 14px var(--accent-glow);
    background: #000;
    z-index: 10;
  }

  .vc-local-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .vc-local-avatar {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 48px !important;
    height: 48px !important;
    font-size: 18px !important;
    font-family: var(--font-mono) !important;
    background: linear-gradient(135deg, var(--accent), var(--accent-dark)) !important;
    color: #000 !important;
  }

  /* ─ Controls ─ */
  .vc-controls {
    position: absolute;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 14px;
    align-items: center;
    background: rgba(0,0,0,0.75);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(56,182,255,0.15);
    border-radius: 60px;
    padding: 12px 24px;
    box-shadow: 0 4px 32px rgba(0,0,0,0.6);
    z-index: 20;
    white-space: nowrap;
  }

  .vc-ctrl-btn {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .vc-ctrl-btn:hover { transform: scale(1.1); }

  .vc-ctrl-end {
    background: linear-gradient(135deg, var(--danger), #a01830);
    box-shadow: 0 0 16px rgba(255,59,92,0.4);
    color: #fff;
  }

  .vc-ctrl-active {
    background: linear-gradient(135deg, var(--accent), var(--accent-dark));
    box-shadow: 0 0 14px var(--accent-glow);
    color: #000;
  }

  .vc-ctrl-inactive {
    background: rgba(56,182,255,0.08);
    border: 1px solid rgba(56,182,255,0.2) !important;
    color: var(--accent);
  }

  /* ══════════════ INCOMING MODAL ══════════════ */
  .vc-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.82);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 20px;
  }

  .vc-modal-box {
    background: linear-gradient(145deg, #0d0d0d, #060606);
    border: 1px solid rgba(56,182,255,0.25);
    border-radius: 24px;
    padding: 40px 44px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    box-shadow: 0 0 60px rgba(56,182,255,0.1), 0 20px 60px rgba(0,0,0,0.7);
    min-width: 300px;
    max-width: 90vw;
    animation: slide-up 0.35s cubic-bezier(0.4,0,0.2,1) both;
  }

  .vc-modal-pulse {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 1px solid rgba(56,182,255,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    animation: pulse-ring 1.8s ease-in-out infinite;
  }

  .vc-modal-avatar {
    width: 80px !important;
    height: 80px !important;
    font-size: 28px !important;
    font-weight: 800 !important;
    font-family: var(--font-mono) !important;
    background: linear-gradient(135deg, var(--accent), var(--accent-dark)) !important;
    color: #000 !important;
    box-shadow: 0 0 20px var(--accent-glow) !important;
  }

  .vc-modal-label {
    font-family: var(--font-mono);
    color: var(--text-secondary);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
  }

  .vc-modal-caller {
    font-family: var(--font-mono);
    color: var(--text-primary);
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-align: center;
  }

  .vc-modal-btns {
    display: flex;
    gap: 22px;
    margin-top: 8px;
  }

  .vc-modal-accept {
    width: 62px;
    height: 62px;
    border-radius: 50%;
    border: none;
    background: linear-gradient(135deg, var(--accent), var(--accent-dark));
    color: #000;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 20px var(--accent-glow);
    transition: all 0.2s ease;
  }

  .vc-modal-reject {
    width: 62px;
    height: 62px;
    border-radius: 50%;
    border: none;
    background: linear-gradient(135deg, var(--danger), #a01830);
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 20px rgba(255,59,92,0.4);
    transition: all 0.2s ease;
  }

  .vc-modal-accept:hover,
  .vc-modal-reject:hover { transform: scale(1.12); }

  /* ══════════════ MOBILE BACK BUTTON ══════════════ */
  .vc-back-btn {
    display: none;
    align-items: center;
    gap: 8px;
    padding: 10px 16px 10px 12px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--accent);
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-bottom: 16px;
    align-self: flex-start;
  }

  .vc-back-btn:hover {
    background: var(--accent-dim);
    border-color: var(--border-hover);
  }

  /* ══════════════ CALL HEADER (mobile in-call) ══════════════ */
  .vc-call-header {
    display: none;
    position: absolute;
    top: 16px;
    left: 16px;
    z-index: 20;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(12px);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 8px 14px;
    gap: 8px;
    align-items: center;
  }

  .vc-call-header-name {
    font-family: var(--font-mono);
    color: var(--text-primary);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1px;
  }

  /* ══════════════ RESPONSIVE ══════════════ */

  /* Tablet */
  @media (max-width: 768px) {
    .vc-sidebar {
      width: 100%;
      min-width: unset;
      position: absolute;
      inset: 0;
      border-right: none;
    }

    .vc-sidebar.hidden {
      transform: translateX(-100%);
      pointer-events: none;
    }

    .vc-main {
      width: 100%;
      position: absolute;
      inset: 0;
      transform: translateX(100%);
      transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
    }

    .vc-main.visible {
      transform: translateX(0);
    }

    .vc-back-btn { display: flex; }

    .vc-idle-card {
      padding: 20px;
      gap: 22px;
      width: 100%;
    }

    .vc-local-wrapper {
      bottom: 80px;
      right: 12px;
      width: 130px;
      height: 100px;
    }

    .vc-controls {
      bottom: 16px;
      padding: 10px 18px;
      gap: 10px;
    }

    .vc-ctrl-btn {
      width: 46px;
      height: 46px;
    }

    .vc-call-header { display: flex; }
  }

  /* Small phones */
  @media (max-width: 400px) {
    .vc-sidebar-header { padding: 20px 16px 14px; }
    .vc-contact-item { padding: 12px 16px; }

    .vc-modal-box { padding: 32px 28px; }

    .vc-idle-ring-outer { width: 130px; height: 130px; }
    .vc-idle-ring-inner { width: 102px; height: 102px; }
    .vc-idle-avatar { width: 74px !important; height: 74px !important; font-size: 28px !important; }
    .vc-idle-name { font-size: 17px; }

    .vc-local-wrapper {
      width: 110px;
      height: 84px;
    }

    .vc-ctrl-btn { width: 42px; height: 42px; }
    .vc-controls { gap: 8px; padding: 8px 14px; }
  }
`;

/* ─── Component ─── */
const VideoCallPage = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [user, setUser] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showIncomingModal, setShowIncomingModal] = useState(false);
  const [incomingOffer, setIncomingOffer] = useState(null);
  const [callerEmail, setCallerEmail] = useState('');
  const [callPeerEmail, setCallPeerEmail] = useState('');
  const [remoteVideoOn, setRemoteVideoOn] = useState(true);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [iceCandidatesQueue, setIceCandidatesQueue] = useState([]);
  const [showMain, setShowMain] = useState(false); // mobile: show main panel

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const ringtoneRef = useRef(null);

  useEffect(() => {
    if (ringtoneRef.current) ringtoneRef.current.load();
  }, []);

  useEffect(() => {
    let handleCanPlay;
    if (ringtoneRef.current) {
      handleCanPlay = () => {
        if (showIncomingModal && ringtoneRef.current) {
          ringtoneRef.current.play().catch((err) => console.error("Ringtone error:", err));
        }
      };
      ringtoneRef.current.addEventListener('canplay', handleCanPlay);
    }
    return () => {
      if (ringtoneRef.current && handleCanPlay) {
        ringtoneRef.current.removeEventListener('canplay', handleCanPlay);
        ringtoneRef.current.pause();
        ringtoneRef.current.currentTime = 0;
      }
    };
  }, [showIncomingModal]);

  useEffect(() => {
    const fetchSessionAndContacts = async () => {
      try {
        const sessionRes = await axios.get("http://localhost:5000/me", { withCredentials: true });
        if (sessionRes.data.loggedIn) {
          setUser(sessionRes.data.user);
          socket.emit("registerUser", { email: sessionRes.data.user.email });
        } else {
          window.location.href = "/login";
        }
        const contactsRes = await axios.get("http://localhost:5000/contacts", { withCredentials: true });
        setContacts(contactsRes.data);
        // Don't auto-select on mobile; let the user tap
        const isMobile = window.innerWidth <= 768;
        if (!isMobile && contactsRes.data.length > 0) setSelectedContact(contactsRes.data[0]);
      } catch (err) {
        console.error("Error fetching session/contacts:", err);
      }
    };
    fetchSessionAndContacts();
  }, []);

  useEffect(() => {
    if (!user) return;
    socket.on("incomingCall", ({ from, offer }) => {
      setCallerEmail(from);
      setIncomingOffer(offer);
      setShowIncomingModal(true);
    });
    socket.on("callAccepted", async ({ answer }) => {
      if (peerConnection) {
        try {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
          await processIceQueue();
        } catch (err) { console.error("Error setting remote description:", err); }
      }
    });
    socket.on("iceCandidate", async ({ candidate }) => {
      if (!candidate || candidate.candidate === "") return;
      if (peerConnection && peerConnection.remoteDescription) {
        try { await peerConnection.addIceCandidate(new RTCIceCandidate(candidate)); }
        catch (err) { console.error("Error adding ICE candidate:", err); }
      } else {
        setIceCandidatesQueue((q) => [...q, candidate]);
      }
    });
    socket.on("toggleVideo", ({ status }) => {
      setRemoteVideoOn(status);
      if (remoteVideoRef.current && remoteStream) remoteVideoRef.current.play().catch(() => {});
    });
    socket.on("endCall", () => cleanupCall());
    socket.on("callRejected", () => { alert("Call was rejected"); cleanupCall(); });

    return () => {
      socket.off("incomingCall"); socket.off("callAccepted");
      socket.off("iceCandidate"); socket.off("toggleVideo");
      socket.off("endCall"); socket.off("callRejected");
    };
  }, [user, peerConnection, remoteStream]);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.play().catch(() => {});
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.play().catch(() => {});
    }
  }, [remoteStream]);

  const processIceQueue = async () => {
    for (const candidate of iceCandidatesQueue) {
      if (!candidate || candidate.candidate === "") continue;
      if (peerConnection && peerConnection.remoteDescription) {
        try { await peerConnection.addIceCandidate(new RTCIceCandidate(candidate)); }
        catch (err) { console.error("Error processing queued ICE:", err); }
      }
    }
    setIceCandidatesQueue([]);
  };

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:3478" },
        {
          urls: ["turn:openrelay.metered.ca:80", "turn:openrelay.metered.ca:443"],
          username: "openrelay.project",
          credential: "openrelayproject",
        },
      ],
    });
    pc.onicecandidate = (event) => {
      if (event.candidate && event.candidate.candidate !== "" && event.candidate.port !== 9)
        socket.emit("iceCandidate", { to: callPeerEmail, candidate: event.candidate });
    };
    pc.ontrack = (event) => setRemoteStream(event.streams[0]);
    pc.oniceconnectionstatechange = () => {
      if (["failed", "disconnected"].includes(pc.iceConnectionState)) pc.restartIce();
      if (pc.iceConnectionState === "connected" && remoteVideoRef.current && remoteStream)
        remoteVideoRef.current.play().catch(() => {});
    };
    return pc;
  };

  const handleSelectContact = (c) => {
    setSelectedContact(c);
    setShowMain(true);
  };

  const handleBack = () => {
    setShowMain(false);
  };

  const handleStartCall = async () => {
    if (!selectedContact || !user) return;
    const to = selectedContact.email;
    setCallPeerEmail(to);
    setIsCallActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      const pc = createPeerConnection();
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      setPeerConnection(pc);
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("startCall", { to, offer, from: user.email });
    } catch (err) {
      console.error("Error starting call:", err);
      alert("Failed to access media devices.");
      cleanupCall();
    }
  };

  const handleAccept = async () => {
    setShowIncomingModal(false);
    if (ringtoneRef.current) { ringtoneRef.current.pause(); ringtoneRef.current.currentTime = 0; }
    const callerContact = contacts.find((c) => c.email === callerEmail);
    if (callerContact) { setSelectedContact(callerContact); setShowMain(true); }
    setCallPeerEmail(callerEmail);
    setIsCallActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      const pc = createPeerConnection();
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      setPeerConnection(pc);
      await pc.setRemoteDescription(new RTCSessionDescription(incomingOffer));
      await processIceQueue();
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("callAccepted", { to: callerEmail, answer });
    } catch (err) {
      console.error("Error accepting call:", err);
      alert("Failed to access media devices.");
      cleanupCall();
    }
  };

  const handleReject = () => {
    setShowIncomingModal(false);
    if (ringtoneRef.current) { ringtoneRef.current.pause(); ringtoneRef.current.currentTime = 0; }
    socket.emit("callRejected", { to: callerEmail });
    cleanupCall();
  };

  const handleToggleVideo = () => {
    if (!localStream) return;
    const newVal = !isVideoOn;
    localStream.getVideoTracks().forEach((t) => (t.enabled = newVal));
    setIsVideoOn(newVal);
    socket.emit("toggleVideo", { to: callPeerEmail, status: newVal });
  };

  const handleToggleMute = () => {
    if (!localStream) return;
    const newVal = !isMuted;
    localStream.getAudioTracks().forEach((t) => (t.enabled = !newVal));
    setIsMuted(newVal);
  };

  const handleEndCall = () => {
    socket.emit("endCall", { to: callPeerEmail });
    cleanupCall();
  };

  const cleanupCall = () => {
    if (localStream) localStream.getTracks().forEach((t) => t.stop());
    if (peerConnection) peerConnection.close();
    if (ringtoneRef.current) { ringtoneRef.current.pause(); ringtoneRef.current.currentTime = 0; }
    setLocalStream(null); setRemoteStream(null); setPeerConnection(null);
    setIsCallActive(false); setIsVideoOn(true); setIsMuted(false);
    setRemoteVideoOn(true); setCallPeerEmail(''); setIceCandidatesQueue([]);
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
  };

  return (
    <>
      <style>{globalStyles}</style>
      <div className="vc-root">
        <audio ref={ringtoneRef} loop>
          <source src={ringtone} type="audio/mp3" />
        </audio>

        {/* ── SIDEBAR ── */}
        <aside className={`vc-sidebar${showMain ? " hidden" : ""}`}>
          <div className="vc-sidebar-header">
            <div className="vc-sidebar-logo">
              <div className="vc-logo-dot" />
              <span className="vc-sidebar-title">Contacts</span>
            </div>
            <div className="vc-sidebar-subtitle">{contacts.length} online</div>
          </div>
          <div className="vc-contact-list">
            {contacts.map((c) => {
              const active = selectedContact?.id === c.id;
              return (
                <div
                  key={c.id}
                  className={`vc-contact-item${active ? " active" : ""}`}
                  onClick={() => handleSelectContact(c)}
                >
                  <Avatar className="vc-contact-avatar">
                    {c.name?.charAt(0).toUpperCase()}
                  </Avatar>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className="vc-contact-name">{c.name}</div>
                    <div className="vc-contact-email">{c.email}</div>
                  </div>
                  <div className="vc-online-dot" />
                </div>
              );
            })}
          </div>
        </aside>

        {/* ── MAIN PANEL ── */}
        <main className={`vc-main${showMain ? " visible" : ""}`}>
          <div className="vc-grid-bg" />
          <div className="vc-glow-orb" style={{ width: 520, height: 520, top: "5%", left: "15%" }} />
          <div className="vc-glow-orb" style={{ width: 400, height: 400, bottom: "-15%", right: "-5%" }} />

          {selectedContact ? (
            isCallActive ? (
              /* ─ Active call ─ */
              <div className="vc-call-wrapper">
                {/* Remote video */}
                <video ref={remoteVideoRef} autoPlay playsInline className="vc-remote-video" />
                {!remoteVideoOn && (
                  <Avatar className="vc-remote-avatar">
                    {selectedContact.name?.charAt(0).toUpperCase()}
                  </Avatar>
                )}

                {/* Caller name badge (mobile) */}
                <div className="vc-call-header" style={{ display: 'flex' }}>
                  <div className="vc-online-dot" style={{ marginLeft: 0, marginRight: 2 }} />
                  <span className="vc-call-header-name">{selectedContact.name}</span>
                </div>

                {/* Local video */}
                <div className="vc-local-wrapper">
                  <video ref={localVideoRef} autoPlay muted playsInline className="vc-local-video" />
                  {!isVideoOn && (
                    <Avatar className="vc-local-avatar">
                      {user?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                  )}
                </div>

                {/* Controls */}
                <div className="vc-controls">
                  <button className="vc-ctrl-btn vc-ctrl-end" onClick={handleEndCall} title="End Call">
                    <CallEndIcon style={{ fontSize: 22 }} />
                  </button>
                  <button
                    className={`vc-ctrl-btn ${isVideoOn ? "vc-ctrl-inactive" : "vc-ctrl-active"}`}
                    onClick={handleToggleVideo}
                    title={isVideoOn ? "Turn Off Camera" : "Turn On Camera"}
                  >
                    {isVideoOn
                      ? <VideocamOffIcon style={{ fontSize: 22 }} />
                      : <VideocamIcon style={{ fontSize: 22 }} />}
                  </button>
                  <button
                    className={`vc-ctrl-btn ${isMuted ? "vc-ctrl-active" : "vc-ctrl-inactive"}`}
                    onClick={handleToggleMute}
                    title={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted
                      ? <MicIcon style={{ fontSize: 22 }} />
                      : <MicOffIcon style={{ fontSize: 22 }} />}
                  </button>
                </div>
              </div>
            ) : (
              /* ─ Idle card ─ */
              <div className="vc-idle-card">
                <button className="vc-back-btn" onClick={handleBack}>
                  <ArrowBackIcon style={{ fontSize: 16 }} />
                  Back
                </button>
                <div className="vc-idle-ring-outer">
                  <div className="vc-idle-ring-inner">
                    <Avatar className="vc-idle-avatar">
                      {selectedContact.name?.charAt(0).toUpperCase()}
                    </Avatar>
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <h3 className="vc-idle-name">{selectedContact.name}</h3>
                  <p className="vc-idle-email">{selectedContact.email}</p>
                </div>
                <button className="vc-call-btn" onClick={handleStartCall}>
                  <VideocamIcon style={{ fontSize: 20 }} />
                  Start Video Call
                </button>
              </div>
            )
          ) : (
            <p className="vc-empty-state">Select a contact to begin</p>
          )}
        </main>
      </div>

      {/* ── INCOMING CALL MODAL ── */}
      {showIncomingModal && (
        <div className="vc-modal-overlay">
          <div className="vc-modal-box">
            <div className="vc-modal-pulse">
              <Avatar className="vc-modal-avatar">
                {callerEmail?.charAt(0).toUpperCase()}
              </Avatar>
            </div>
            <p className="vc-modal-label">Incoming Call</p>
            <p className="vc-modal-caller">{callerEmail}</p>
            <div className="vc-modal-btns">
              <button className="vc-modal-accept" onClick={handleAccept} title="Accept">
                <CallIcon style={{ fontSize: 26 }} />
              </button>
              <button className="vc-modal-reject" onClick={handleReject} title="Reject">
                <CallEndIcon style={{ fontSize: 26 }} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoCallPage;