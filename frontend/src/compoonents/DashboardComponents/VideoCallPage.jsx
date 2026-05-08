import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Button, ListGroup, Modal } from "react-bootstrap";
import Avatar from "@mui/material/Avatar";
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import MicOffIcon from '@mui/icons-material/MicOff';
import MicIcon from '@mui/icons-material/Mic';
import CallEndIcon from '@mui/icons-material/CallEnd';
import CallIcon from "@mui/icons-material/Call";
import axios from "axios";
import { io } from "socket.io-client";
import ringtone from "../../assets/tune.mp3";

const socket = io("http://localhost:5000", {
  withCredentials: true,
  transports: ["websocket"],
});

/* ─── inline styles (no external CSS file needed) ─── */
const S = {
  root: {
    height: "91.4vh",
    background: "#050d12",
    display: "flex",
    overflow: "hidden",
    fontFamily: "'Rajdhani', 'Orbitron', monospace",
  },

  /* ── sidebar ── */
  sidebar: {
    width: "280px",
    minWidth: "280px",
    background: "linear-gradient(180deg, #061218 0%, #040c10 100%)",
    borderRight: "1px solid rgba(0,230,200,0.12)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  sidebarHeader: {
    padding: "24px 20px 16px",
    borderBottom: "1px solid rgba(0,230,200,0.1)",
  },
  sidebarTitle: {
    color: "#00e6c8",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "3px",
    textTransform: "uppercase",
    margin: 0,
  },
  sidebarSubtitle: {
    color: "rgba(0,230,200,0.4)",
    fontSize: "10px",
    letterSpacing: "2px",
    marginTop: "4px",
  },
  contactList: {
    flex: 1,
    overflowY: "auto",
    padding: "8px 0",
    scrollbarWidth: "none",
  },
  contactItem: (active) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 20px",
    cursor: "pointer",
    background: active
      ? "linear-gradient(90deg, rgba(0,230,200,0.12) 0%, transparent 100%)"
      : "transparent",
    borderLeft: active ? "2px solid #00e6c8" : "2px solid transparent",
    borderTop: "none",
    borderRight: "none",
    borderBottom: "none",
    transition: "all 0.2s ease",
    position: "relative",
  }),
  contactAvatar: (active) => ({
    width: 40,
    height: 40,
    background: active
      ? "linear-gradient(135deg, #00e6c8, #0099aa)"
      : "linear-gradient(135deg, #0d2a30, #0a1f24)",
    border: active ? "1px solid rgba(0,230,200,0.6)" : "1px solid rgba(0,230,200,0.15)",
    color: active ? "#050d12" : "#00e6c8",
    fontSize: "16px",
    fontWeight: 700,
    flexShrink: 0,
    boxShadow: active ? "0 0 12px rgba(0,230,200,0.3)" : "none",
    transition: "all 0.2s ease",
  }),
  contactName: {
    color: "#c8f0ec",
    fontSize: "14px",
    fontWeight: 600,
    letterSpacing: "0.5px",
  },
  contactEmail: {
    color: "rgba(0,230,200,0.4)",
    fontSize: "11px",
    letterSpacing: "0.3px",
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#00e6c8",
    boxShadow: "0 0 6px #00e6c8",
    marginLeft: "auto",
    flexShrink: 0,
  },

  /* ── main area ── */
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },

  /* idle card */
  idleCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "24px",
    zIndex: 2,
  },
  idleRing: {
    width: 140,
    height: 140,
    borderRadius: "50%",
    border: "1px solid rgba(0,230,200,0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    boxShadow: "0 0 40px rgba(0,230,200,0.06)",
  },
  idleRingInner: {
    width: 110,
    height: 110,
    borderRadius: "50%",
    border: "1px solid rgba(0,230,200,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "inset 0 0 20px rgba(0,230,200,0.05)",
  },
  idleAvatar: {
    width: 80,
    height: 80,
    background: "linear-gradient(135deg, #00e6c8, #007a6e)",
    color: "#050d12",
    fontSize: "30px",
    fontWeight: 800,
    boxShadow: "0 0 20px rgba(0,230,200,0.4)",
  },
  idleName: {
    color: "#c8f0ec",
    fontSize: "22px",
    fontWeight: 700,
    letterSpacing: "2px",
    textTransform: "uppercase",
    margin: 0,
  },
  idleEmail: {
    color: "rgba(0,230,200,0.45)",
    fontSize: "12px",
    letterSpacing: "1.5px",
    margin: 0,
  },
  callBtn: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 36px",
    background: "linear-gradient(135deg, #00e6c8, #009980)",
    border: "none",
    borderRadius: "40px",
    color: "#050d12",
    fontSize: "13px",
    fontWeight: 700,
    letterSpacing: "2px",
    textTransform: "uppercase",
    cursor: "pointer",
    boxShadow: "0 0 24px rgba(0,230,200,0.35), 0 4px 20px rgba(0,0,0,0.4)",
    transition: "all 0.2s ease",
  },

  /* empty state */
  emptyState: {
    color: "rgba(0,230,200,0.3)",
    fontSize: "13px",
    letterSpacing: "2px",
    textTransform: "uppercase",
  },

  /* ── active call ── */
  callWrapper: {
    position: "absolute",
    inset: 0,
    background: "#000",
  },
  remoteVideo: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  remoteAvatar: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    width: 120,
    height: 120,
    background: "linear-gradient(135deg, #00e6c8, #006e63)",
    color: "#050d12",
    fontSize: "48px",
    fontWeight: 800,
    boxShadow: "0 0 40px rgba(0,230,200,0.3)",
  },
  localVideoWrapper: {
    position: "absolute",
    bottom: 90,
    right: 24,
    width: 200,
    height: 150,
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid rgba(0,230,200,0.35)",
    boxShadow: "0 0 24px rgba(0,0,0,0.6), 0 0 12px rgba(0,230,200,0.15)",
    background: "#000",
  },
  localVideo: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  localAvatar: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    width: 48,
    height: 48,
    background: "linear-gradient(135deg, #00e6c8, #006e63)",
    color: "#050d12",
    fontSize: "18px",
    fontWeight: 800,
  },

  /* control bar */
  controls: {
    position: "absolute",
    bottom: 24,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: "16px",
    alignItems: "center",
    background: "rgba(5,13,18,0.7)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(0,230,200,0.15)",
    borderRadius: "50px",
    padding: "12px 24px",
    boxShadow: "0 4px 32px rgba(0,0,0,0.5)",
  },
  ctrlBtn: (variant) => ({
    width: 52,
    height: 52,
    borderRadius: "50%",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
    ...(variant === "end"
      ? {
          background: "linear-gradient(135deg, #e63c4a, #a02030)",
          boxShadow: "0 0 16px rgba(230,60,74,0.4)",
          color: "#fff",
        }
      : variant === "active"
      ? {
          background: "linear-gradient(135deg, #00e6c8, #007a6e)",
          boxShadow: "0 0 12px rgba(0,230,200,0.35)",
          color: "#050d12",
        }
      : {
          background: "rgba(0,230,200,0.08)",
          border: "1px solid rgba(0,230,200,0.2)",
          color: "#00e6c8",
        }),
  }),

  /* grid bg decoration */
  gridBg: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(0,230,200,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,230,200,0.03) 1px, transparent 1px)",
    backgroundSize: "40px 40px",
    pointerEvents: "none",
    zIndex: 0,
  },
  glowOrb: {
    position: "absolute",
    width: 500,
    height: 500,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(0,230,200,0.04) 0%, transparent 70%)",
    pointerEvents: "none",
    zIndex: 0,
  },

  /* ── modal ── */
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.75)",
    backdropFilter: "blur(6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  modalBox: {
    background: "linear-gradient(145deg, #061a20, #040e12)",
    border: "1px solid rgba(0,230,200,0.25)",
    borderRadius: "20px",
    padding: "40px 48px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    boxShadow: "0 0 60px rgba(0,230,200,0.1), 0 20px 60px rgba(0,0,0,0.6)",
    minWidth: 320,
  },
  modalPulseRing: {
    width: 120,
    height: 120,
    borderRadius: "50%",
    border: "1px solid rgba(0,230,200,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    animation: "pulse 1.8s ease-in-out infinite",
    boxShadow: "0 0 30px rgba(0,230,200,0.08)",
  },
  modalAvatar: {
    width: 80,
    height: 80,
    background: "linear-gradient(135deg, #00e6c8, #007a6e)",
    color: "#050d12",
    fontSize: "28px",
    fontWeight: 800,
    boxShadow: "0 0 20px rgba(0,230,200,0.3)",
  },
  modalLabel: {
    color: "rgba(0,230,200,0.5)",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "3px",
    textTransform: "uppercase",
    margin: 0,
  },
  modalCaller: {
    color: "#c8f0ec",
    fontSize: "18px",
    fontWeight: 700,
    letterSpacing: "1px",
    margin: 0,
  },
  modalBtns: {
    display: "flex",
    gap: "20px",
    marginTop: "8px",
  },
  modalAccept: {
    width: 60,
    height: 60,
    borderRadius: "50%",
    border: "none",
    background: "linear-gradient(135deg, #00e6c8, #007a6e)",
    color: "#050d12",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 20px rgba(0,230,200,0.4)",
    transition: "all 0.2s ease",
  },
  modalReject: {
    width: 60,
    height: 60,
    borderRadius: "50%",
    border: "none",
    background: "linear-gradient(135deg, #e63c4a, #a02030)",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 20px rgba(230,60,74,0.4)",
    transition: "all 0.2s ease",
  },
};

/* ─── Pulse keyframes injected once ─── */
const pulseStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&display=swap');
  @keyframes pulse {
    0%   { box-shadow: 0 0 0 0 rgba(0,230,200,0.35); }
    70%  { box-shadow: 0 0 0 20px rgba(0,230,200,0); }
    100% { box-shadow: 0 0 0 0 rgba(0,230,200,0); }
  }
  ::-webkit-scrollbar { width: 0; }
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
        if (contactsRes.data.length > 0) setSelectedContact(contactsRes.data[0]);
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
        } catch (err) {
          console.error("Error setting remote description:", err);
        }
      }
    });

    socket.on("iceCandidate", async ({ candidate }) => {
      if (!candidate || candidate.candidate === "") return;
      if (peerConnection && peerConnection.remoteDescription) {
        try {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error("Error adding ICE candidate:", err);
        }
      } else {
        setIceCandidatesQueue((q) => [...q, candidate]);
      }
    });

    socket.on("toggleVideo", ({ status }) => {
      setRemoteVideoOn(status);
      if (remoteVideoRef.current && remoteStream)
        remoteVideoRef.current.play().catch(() => {});
    });

    socket.on("endCall", () => cleanupCall());
    socket.on("callRejected", () => { alert("Call was rejected"); cleanupCall(); });

    return () => {
      socket.off("incomingCall");
      socket.off("callAccepted");
      socket.off("iceCandidate");
      socket.off("toggleVideo");
      socket.off("endCall");
      socket.off("callRejected");
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
    if (callerContact) setSelectedContact(callerContact);
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
      <style>{pulseStyle}</style>
      <div style={S.root}>
        <audio ref={ringtoneRef} loop>
          <source src={ringtone} type="audio/mp3" />
        </audio>

        {/* ── SIDEBAR ── */}
        <aside style={S.sidebar}>
          <div style={S.sidebarHeader}>
            <p style={S.sidebarTitle}>Contacts</p>
            <p style={S.sidebarSubtitle}>{contacts.length} online</p>
          </div>
          <div style={S.contactList}>
            {contacts.map((c) => {
              const active = selectedContact?.id === c.id;
              return (
                <div
                  key={c.id}
                  style={S.contactItem(active)}
                  onClick={() => { setSelectedContact(c); }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.background = "rgba(0,230,200,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.background = "transparent";
                  }}
                >
                  <div >
                    <Avatar style={S.contactAvatar(active)}>
                      {c.name?.charAt(0).toUpperCase()}
                    </Avatar>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={S.contactName}>{c.name}</div>
                    <div style={S.contactEmail}>{c.email}</div>
                  </div>
                  <div style={S.onlineDot} />
                </div>
              );
            })}
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main style={S.main}>
          {/* background grid */}
          <div style={S.gridBg} />
          <div style={{ ...S.glowOrb, top: "10%", left: "20%" }} />
          <div style={{ ...S.glowOrb, bottom: "-20%", right: "-10%" }} />

          {selectedContact ? (
            isCallActive ? (
              /* ─ Active call ─ */
              <div style={S.callWrapper}>
                {/* remote video */}
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  style={S.remoteVideo}
                />
                {!remoteVideoOn && (
                  <Avatar style={S.remoteAvatar}>
                    {selectedContact.name?.charAt(0).toUpperCase()}
                  </Avatar>
                )}

                {/* local video */}
                <div style={S.localVideoWrapper}>
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    style={S.localVideo}
                  />
                  {!isVideoOn && (
                    <Avatar style={S.localAvatar}>
                      {user?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                  )}
                </div>

                {/* controls */}
                <div style={S.controls}>
                  <button
                    style={S.ctrlBtn("end")}
                    onClick={handleEndCall}
                    title="End Call"
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    <CallEndIcon style={{ fontSize: 22 }} />
                  </button>

                  <button
                    style={S.ctrlBtn(isVideoOn ? "inactive" : "active")}
                    onClick={handleToggleVideo}
                    title={isVideoOn ? "Turn Off Camera" : "Turn On Camera"}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    {isVideoOn
                      ? <VideocamOffIcon style={{ fontSize: 22 }} />
                      : <VideocamIcon style={{ fontSize: 22 }} />}
                  </button>

                  <button
                    style={S.ctrlBtn(isMuted ? "active" : "inactive")}
                    onClick={handleToggleMute}
                    title={isMuted ? "Unmute" : "Mute"}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    {isMuted
                      ? <MicIcon style={{ fontSize: 22 }} />
                      : <MicOffIcon style={{ fontSize: 22 }} />}
                  </button>
                </div>
              </div>
            ) : (
              /* ─ Idle card ─ */
              <div style={S.idleCard}>
                <div style={S.idleRing}>
                  <div style={S.idleRingInner}>
                    <Avatar style={S.idleAvatar}>
                      {selectedContact.name?.charAt(0).toUpperCase()}
                    </Avatar>
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <h3 style={S.idleName}>{selectedContact.name}</h3>
                  <p style={S.idleEmail}>{selectedContact.email}</p>
                </div>
                <button
                  style={S.callBtn}
                  onClick={handleStartCall}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 0 36px rgba(0,230,200,0.5), 0 8px 24px rgba(0,0,0,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 0 24px rgba(0,230,200,0.35), 0 4px 20px rgba(0,0,0,0.4)";
                  }}
                >
                  <VideocamIcon style={{ fontSize: 20 }} />
                  Start Video Call
                </button>
              </div>
            )
          ) : (
            <p style={S.emptyState}>Select a contact to begin</p>
          )}
        </main>
      </div>

      {/* ── INCOMING CALL MODAL ── */}
      {showIncomingModal && (
        <div style={S.modalOverlay}>
          <div style={S.modalBox}>
            <div style={S.modalPulseRing}>
              <Avatar style={S.modalAvatar}>
                {callerEmail?.charAt(0).toUpperCase()}
              </Avatar>
            </div>
            <p style={S.modalLabel}>Incoming Call</p>
            <p style={S.modalCaller}>{callerEmail}</p>
            <div style={S.modalBtns}>
              <button
                style={S.modalAccept}
                onClick={handleAccept}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                title="Accept"
              >
                <CallIcon style={{ fontSize: 26 }} />
              </button>
              <button
                style={S.modalReject}
                onClick={handleReject}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                title="Reject"
              >
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