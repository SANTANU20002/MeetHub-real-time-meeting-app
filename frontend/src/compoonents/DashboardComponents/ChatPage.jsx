import React, { useState, useEffect, useRef } from "react";
import Avatar from "@mui/material/Avatar";
import CheckIcon from "@mui/icons-material/Check";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import SendIcon from "@mui/icons-material/Send";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import { io } from "socket.io-client";

// CYAN THEME COLOR
const cyan = "#00cfff";

const socket = io("http://localhost:5000", {
  withCredentials: true,
  transports: ["websocket"],
});

// Responsive helpers
function useIsMobile(breakpoint = 700) {
  const [isMobile, setIsMobile] = React.useState(
    typeof window === "object" ? window.innerWidth < breakpoint : false
  );
  React.useEffect(() => {
    const update = () =>
      setIsMobile(typeof window === "object" && window.innerWidth < breakpoint);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [breakpoint]);
  return isMobile;
}

/* ─── Inline Styles ────────────────────────────────────────────── */
const S = {
  root: (isMobile) => ({
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    height: isMobile ? "100dvh" : "91.4vh",
    minHeight: isMobile ? "100dvh" : "91.4vh",
    maxHeight: isMobile ? "100dvh" : "91.4vh",
    background: "#060D14",
    backgroundImage: `
      linear-gradient(rgba(0,229,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,229,255,0.025) 1px, transparent 1px)
    `,
    backgroundSize: "40px 40px",
    borderRadius: 0,
    overflow: "hidden",
    border: "1px solid rgba(0,229,255,0.12)",
    boxShadow: "0 0 60px rgba(0,0,0,0.6)",
    width: "100%",
    position: "relative",
  }),

  sidebar: (isMobile, show) => ({
    width: isMobile ? "100%" : 280,
    minWidth: isMobile ? "100%" : 280,
    maxWidth: isMobile ? "100%" : 360,
    display: isMobile ? (show ? "flex" : "none") : "flex",
    flexDirection: "column",
    background: "rgba(6,15,22,0.93)",
    borderRight: isMobile ? "none" : "1px solid rgba(0,229,255,0.1)",
    borderBottom: isMobile ? "1px solid rgba(0,229,255,0.14)" : "none",
    position: "relative",
    zIndex: isMobile ? 200 : "auto",
    height: isMobile ? "100%" : "auto",
  }),
  sidebarHeader: (isMobile) => ({
    padding: isMobile ? "18px 10px 13px" : "20px 16px 12px",
    borderBottom: "1px solid rgba(0,229,255,0.08)",
    display: "flex",
    alignItems: "center",
    gap: isMobile ? 5 : 0,
  }),
  backContactBtn: {
    color: cyan,
    background: "rgba(0,229,255,0.09)",
    marginRight: 10,
    borderRadius: 30,
    minWidth: 35,
    minHeight: 35,
  },
  sidebarTitle: (isMobile) => ({
    fontSize: isMobile ? "0.7rem" : "0.65rem",
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: cyan,
    marginBottom: 0,
    marginLeft: isMobile ? 5 : 0,
    display: "flex",
    alignItems: "center",
    gap: 8,
    flex: 1,
  }),
  titleDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: cyan,
    boxShadow: `0 0 8px ${cyan}`,
    animation: "pulse 2s infinite",
    flexShrink: 0,
  },
  searchBox: (isMobile) => ({
    display: "flex",
    alignItems: "center",
    background: "rgba(0, 128, 255, 0.05)",
    border: "1px solid rgba(56, 182, 255, 0.23)",
    borderRadius: 10,
    padding: isMobile ? "7px 6px" : "7px 12px",
    gap: isMobile ? 5 : 8,
    marginTop: isMobile ? 5 : 0,
  }),
  searchInput: (isMobile) => ({
    background: "transparent",
    border: "none",
    outline: "none",
    color: "rgb(178, 210, 242)",
    fontFamily: '"Rajdhani", monospace',
    fontSize: isMobile ? "1em" : "0.82rem",
    letterSpacing: "0.05em",
    flex: 1,
    "::placeholder": { color: cyan },
  }),
  contactList: (isMobile) => ({
    flex: 1,
    overflowY: "auto",
    padding: isMobile ? "2px 0 6px" : "8px 0",
  }),
  contactItem: (active, isMobile) => ({
    display: "flex",
    alignItems: "center",
    gap: isMobile ? 9 : 12,
    padding: isMobile ? "10px 11px" : "11px 16px",
    cursor: "pointer",
    borderLeft: !isMobile
      ? active
        ? `2px solid ${cyan}`
        : "2px solid transparent"
      : "none",
    borderRadius: isMobile ? 9 : 0,
    margin: isMobile ? "2px 6px" : 0,
    background: active
      ? "linear-gradient(90deg, rgba(0,229,255,0.13), transparent)"
      : "transparent",
    transition: "all 0.2s",
    position: "relative",
  }),
  contactAvatar: (active, isMobile) => ({
    width: isMobile ? 37 : 40,
    height: isMobile ? 37 : 40,
    fontSize: isMobile ? "0.98em" : "1rem",
    fontWeight: 700,
    fontFamily: '"Rajdhani", monospace',
    background: active
      ? `linear-gradient(135deg,rgb(0, 106, 168), ${cyan})`
      : "rgba(0, 80, 137, 0.48)",
    border: active
      ? "1.5px solid rgba(56, 182, 255, 0.47)"
      : "1.5px solid rgba(56, 182, 255, 0.13)",
    boxShadow: active ? "0 0 12px rgba(56, 182, 255, 0.4)" : "none",
    transition: "all 0.2s",
    flexShrink: 0,
  }),
  contactName: (active, isMobile) => ({
    fontSize: isMobile ? "1.03em" : "0.88rem",
    fontWeight: 600,
    letterSpacing: "0.04em",
    color: active ? "#E0F7FA" : "rgb(117, 175, 209)",
    marginBottom: isMobile ? 1 : 2,
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
    maxWidth: isMobile ? 120 : 150,
  }),
  contactEmail: (isMobile) => ({
    fontSize: isMobile ? "0.93em" : "0.68rem",
    color: "rgb(156, 219, 255)",
    opacity: 0.6,
    letterSpacing: "0.03em",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: isMobile ? 95 : 160,
  }),
  chatArea: (isMobile, show) => ({
    flex: 1,
    display: isMobile && !show ? "none" : "flex",
    flexDirection: "column",
    background: "transparent",
    position: "relative",
    width: isMobile ? "100%" : undefined,
    minWidth: isMobile ? "100%" : undefined,
    transition: "all 0.14s",
    height: isMobile ? "100%" : "auto",
  }),
  chatHeader: (isMobile) => ({
    padding: isMobile ? "13px 11px 10px" : "14px 20px",
    borderBottom: "1px solid rgba(56, 182, 255, 0.19)",
    background: "rgba(6,15,22,0.8)",
    backdropFilter: "blur(10px)",
    display: "flex",
    alignItems: "center",
    gap: isMobile ? 9 : 14,
    position: "relative",
    minHeight: isMobile ? 48 : 54,
  }),
  backBtnChat: {
    color: cyan,
    background: "rgba(0,229,255,0.09)",
    borderRadius: 35,
    marginRight: 8,
  },
  chatHeaderName: (isMobile) => ({
    fontSize: isMobile ? "1.06em" : "1rem",
    fontWeight: 700,
    letterSpacing: "0.06em",
    color: "rgb(224, 239, 250)",
    margin: 0,
    lineHeight: 1.2,
    maxWidth: isMobile ? 150 : "auto",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  }),
  typingIndicator: (isMobile) => ({
    fontSize: isMobile ? "0.72em" : "0.68rem",
    color: cyan,
    letterSpacing: "0.1em",
    animation: "blink 1.2s ease-in-out infinite",
  }),
  headerGlow: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    background: `linear-gradient(90deg, transparent, ${cyan}44, transparent)`,
  },
  messagesArea: (isMobile) => ({
    flex: 1,
    overflowY: "auto",
    padding: isMobile ? "15px 6px" : "20px 24px",
    display: "flex",
    flexDirection: "column",
    gap: 2,
    minHeight: isMobile ? "170px" : "unset",
  }),
  dateSeparator: (isMobile) => ({
    display: "flex",
    alignItems: "center",
    gap: isMobile ? 5 : 12,
    margin: isMobile ? "8px 0 7px" : "16px 0 10px",
  }),
  dateLine: (isMobile) => ({
    flex: 1,
    height: 1,
    background: "rgba(56, 182, 255, 0.19)",
  }),
  dateLabel: (isMobile) => ({
    fontSize: isMobile ? "0.83em" : "0.6rem",
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "#38b6ff",
    opacity: 0.7,
    padding: isMobile ? "3px 5px" : "3px 10px",
    border: "1px solid rgba(56, 182, 255, 0.21)",
    borderRadius: 20,
    background: "rgba(0,229,255,0.04)",
  }),
  msgWrapper: (isSender, isMobile) => ({
    display: "flex",
    justifyContent: isSender ? "flex-end" : "flex-start",
    marginBottom: isMobile ? 3 : 6,
    animation: "msgIn 0.25s ease both",
  }),
  msgBubble: (isSender, isMobile) => ({
    maxWidth: isMobile ? "88%" : "68%",
    padding: isMobile ? "9px 10px" : "10px 14px",
    borderRadius: isSender
      ? isMobile
        ? "13px 13px 4px 13px"
        : "16px 16px 4px 16px"
      : isMobile
      ? "13px 13px 13px 4px"
      : "16px 16px 16px 4px",
    background: isSender
      ? "linear-gradient(135deg, rgba(0,180,200,0.9), rgba(0,130,180,0.85))"
      : "rgba(13, 27, 42, 0.85)",
    border: isSender
      ? "1px solid rgba(0,229,255,0.3)"
      : "1px solid rgba(0,229,255,0.12)",
    boxShadow: isSender
      ? "0 2px 14px rgba(0,180,200,0.16)"
      : "0 2px 9px rgba(0,0,0,0.19)",
    backdropFilter: "blur(7px)",
    color: isSender ? "#E0F7FA" : "#B2EBF2",
    fontSize: isMobile ? "0.98em" : "0.88rem",
    lineHeight: 1.5,
    letterSpacing: "0.02em",
    fontFamily: '"Rajdhani", monospace',
    wordBreak: "break-word",
  }),
  msgMeta: (isMobile) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 2,
    marginTop: isMobile ? 2 : 4,
  }),
  msgTime: (isMobile) => ({
    fontSize: isMobile ? "0.74em" : "0.6rem",
    letterSpacing: "0.08em",
    opacity: 0.65,
    color: "#80DEEA",
  }),
  inputArea: (isMobile) => ({
    padding: isMobile ? "9px 5px" : "14px 20px",
    borderTop: "1px solid rgba(0,229,255,0.13)",
    background: "rgba(6,15,22,0.85)",
    backdropFilter: "blur(12px)",
    display: "flex",
    alignItems: "center",
    gap: isMobile ? 6 : 12,
    position: "relative",
    minHeight: isMobile ? 48 : 60,
  }),
  emojiBtn: (isMobile) => ({
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: " #38b6ff",
    display: "flex",
    alignItems: "center",
    padding: isMobile ? 1 : 6,
    borderRadius: 8,
    transition: "color 0.2s, background 0.2s",
    flexShrink: 0,
  }),
  inputField: (isMobile) => ({
    flex: 1,
    background: "rgba(0,229,255,0.05)",
    border: "1px solid rgba(0,229,255,0.18)",
    borderRadius: 12,
    padding: isMobile ? "8px 12px" : "10px 16px",
    color: "#E0F7FA",
    fontFamily: '"Rajdhani", monospace',
    fontSize: isMobile ? "1em" : "0.9rem",
    letterSpacing: "0.03em",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  }),
  sendBtn: (isMobile) => ({
    background: "linear-gradient(135deg,rgb(0, 93, 143), #38b6ff)",
    border: "1px solid rgba(0, 145, 255, 0.35)",
    borderRadius: 12,
    width: isMobile ? 37 : 44,
    height: isMobile ? 37 : 44,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#E0F7FA",
    boxShadow: "0 0 10px rgba(0, 162, 255, 0.21)",
    transition: "box-shadow 0.2s, transform 0.15s",
    flexShrink: 0,
    minWidth: isMobile ? 33 : 44,
  }),
  emptyState: (isMobile) => ({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 13,
    color: "#38b6ff",
    fontSize: isMobile ? "1em" : "inherit",
    paddingBottom: isMobile ? 34 : 0,
    width: "100%",
  }),
  emptyIcon: (isMobile) => ({
    width: isMobile ? 52 : 64,
    height: isMobile ? 52 : 64,
    borderRadius: "50%",
    border: "1px solid rgba(0,229,255,0.2)",
    background: "rgba(0,229,255,0.05)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: isMobile ? "1.2rem" : "1.6rem",
    animation: "pulse 2.5s infinite",
  }),
  emojiPickerWrap: (isMobile) => ({
    position: "absolute",
    bottom: "100%",
    left: isMobile ? 2 : 20,
    zIndex: 100,
    borderRadius: 14,
    overflow: "hidden",
    border: "1px solid rgba(0,229,255,0.2)",
    boxShadow: "0 0 30px rgba(0,0,0,0.5)",
  }),
  contactsOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100dvh",
    background: "#060D14",
    zIndex: 150,
  },
};

/* ─── Helpers ─────────────────────────────────────────────────── */
const formatTime = (ts) =>
  new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const formatDateSep = (ts) => {
  const d = new Date(ts);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  const diff = Math.floor((today - d) / 86400000);
  if (diff <= 7) return `${diff} days ago`;
  return d.toLocaleDateString();
};

const groupByDate = (msgs) => {
  const out = [];
  let last = null;
  msgs.forEach((m, i) => {
    const cur = new Date(m.created_at).toDateString();
    if (cur !== last) {
      out.push({ type: "sep", date: m.created_at, id: `s${i}` });
      last = cur;
    }
    out.push({ type: "msg", data: m });
  });
  return out;
};

const StatusIcon = ({ status }) => {
  if (status === "sent")
    return (
      <CheckIcon
        style={{
          color: "rgba(176,224,230,0.5)",
          fontSize: 13,
          marginLeft: 2,
        }}
      />
    );
  if (status === "delivered")
    return (
      <DoneAllIcon
        style={{
          color: "rgba(176,224,230,0.7)",
          fontSize: 13,
          marginLeft: 2,
        }}
      />
    );
  if (status === "read")
    return (
      <DoneAllIcon
        style={{
          color: cyan,
          fontSize: 13,
          marginLeft: 2,
        }}
      />
    );
  return null;
};

/* ─── Main COMPONENT ──────────────────────────────────────────── */
const ChatPage = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);
  const [typing, setTyping] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [search, setSearch] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);
  const inputRef = useRef(null);
  const isMobile = useIsMobile();
  const [showContactsMobile, setShowContactsMobile] = useState(true); // control sidebar <-> chat

  // On desktop: both show; on mobile: show contacts or chat based on showContactsMobile.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const init = async () => {
      try {
        const s = await axios.get("http://localhost:5000/me", {
          withCredentials: true,
        });
        if (!s.data.loggedIn) {
          window.location.href = "/login";
          return;
        }
        setUser(s.data.user);
        socket.emit("registerUser", { email: s.data.user.email });
        const c = await axios.get("http://localhost:5000/contacts", {
          withCredentials: true,
        });
        setContacts(c.data);
        if (c.data.length > 0) setSelectedContact(c.data[0]);
      } catch (e) {
        console.error(e);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!selectedContact || !user) return;
    axios
      .get("http://localhost:5000/messages", {
        params: { receiver_email: selectedContact.email },
        withCredentials: true,
      })
      .then((r) => setMessages(r.data))
      .catch(() => setMessages([]));
    socket.emit("messagesRead", {
      sender_email: selectedContact.email,
      receiver_email: user.email,
    });
  }, [selectedContact, user]);

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      if (!user || !selectedContact) return;
      const relevant =
        (msg.sender_email === user.email &&
          msg.receiver_email === selectedContact.email) ||
        (msg.sender_email === selectedContact.email &&
          msg.receiver_email === user.email);
      if (relevant)
        setMessages((p) =>
          p.some((m) => m.id === msg.id) ? p : [...p, msg]
        );
    });
    socket.on("newContactAdded", (c) =>
      setContacts((p) => (p.some((x) => x.email === c.email) ? p : [...p, c]))
    );
    socket.on("typing", ({ sender_email }) => {
      if (sender_email === selectedContact?.email) {
        setTyping(true);
        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setTyping(false), 2000);
      }
    });
    socket.on("messageStatusUpdate", ({ messageId, status }) =>
      setMessages((p) =>
        p.map((m) => (m.id === messageId ? { ...m, status } : m))
      )
    );
    return () => {
      socket.off("receiveMessage");
      socket.off("newContactAdded");
      socket.off("typing");
      socket.off("messageStatusUpdate");
      clearTimeout(typingTimeout.current);
    };
    // eslint-disable-next-line
  }, [user, selectedContact]);

  const handleTyping = () => {
    if (!selectedContact || !user) return;
    socket.emit("typing", {
      sender_email: user.email,
      receiver_email: selectedContact.email,
    });
  };

  const handleSend = () => {
    if (!newMessage.trim() || !selectedContact || !user) return;
    socket.emit("sendMessage", {
      sender_email: user.email,
      receiver_email: selectedContact.email,
      message: newMessage,
      status: "sent",
      created_at: new Date().toISOString(),
    });
    setNewMessage("");
    setShowEmoji(false);
    inputRef.current?.focus();
  };

  const filteredContacts = contacts.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
  );

  // Effect: when mobile and contact selected, hide contacts
  useEffect(() => {
    if (isMobile && selectedContact) setShowContactsMobile(false);
  }, [isMobile, selectedContact]);

  // On mobile, if de-selected, go back to contacts
  const handleBackToContacts = () => setShowContactsMobile(true);

  return (
    <>
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&display=swap');
        html, body, #root {
          height: 100%;
          margin: 0;
        }
        body {
          background: #060D14;
        }
        @keyframes pulse {
          0%,100% { opacity:1; box-shadow:0 0 6px currentColor; }
          50% { opacity:0.45; box-shadow:0 0 2px currentColor; }
        }
        @keyframes blink {
          0%,100% { opacity:1; }
          50% { opacity:0.4; }
        }
        @keyframes msgIn {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes slideIn {
          from { opacity:0; transform:translateX(-12px); }
          to   { opacity:1; transform:translateX(0); }
        }
        ::-webkit-scrollbar { width: 4px;}
        ::-webkit-scrollbar-track { background: transparent;}
        ::-webkit-scrollbar-thumb { background: rgba(0, 136, 255, 0.18); border-radius: 4px;}
        ::-webkit-scrollbar-thumb:hover { background: rgba(0, 157, 255, 0.4);}
        .chat-contact-item:hover {
          background: linear-gradient(90deg, rgba(0, 166, 255, 0.10), transparent) !important;
          border-left-color: rgba(0, 157, 255, 0.4) !important;
        }
        .emoji-btn:hover { color: ${cyan} !important; background: rgba(0, 157, 255, 0.08) !important;}
        .send-btn:hover { box-shadow: 0 0 22px rgba(0, 157, 255, 0.30) !important; transform: scale(1.055);}
        .send-btn:active { transform: scale(0.97);}
        .chat-input:focus {
          border-color: rgba(0, 153, 255, 0.45) !important;
          box-shadow: 0 0 0 3px rgba(0, 136, 255, 0.07) !important;
        }
        .search-input::placeholder { color: rgba(77, 163, 225, 0.41); }
        .contact-anim { animation: slideIn 0.3s ease both; }
        @media (max-width: 700px) {
          ::-webkit-scrollbar { width: 3px;}
        }
        `}
      </style>

      <div style={S.root(isMobile)}>
        {/* ── Sidebar (Contact List) ── */}
        <div style={S.sidebar(isMobile, !selectedContact || showContactsMobile)}>
          <div style={S.sidebarHeader(isMobile)}>
            {/* Mobile: back button in header when inside chat */}
            {isMobile && selectedContact && !showContactsMobile && (
              <IconButton
                aria-label="Back to contacts"
                size="small"
                onClick={handleBackToContacts}
                style={S.backContactBtn}
              >
                <ArrowBackIosNewIcon fontSize="small" />
              </IconButton>
            )}
            <div style={S.sidebarTitle(isMobile)}>
              <div style={S.titleDot} />
              Contacts
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: "0.63rem",
                  background: "rgba(0, 157, 255, 0.1)",
                  border: "1px solid rgba(0, 140, 255, 0.22)",
                  borderRadius: 10,
                  padding: isMobile ? "2px 6px" : "2px 8px",
                  color: cyan,
                }}
              >
                {contacts.length}
              </span>
            </div>
          </div>
          {/* Search */}
          <div style={S.searchBox(isMobile)}>
            <SearchIcon
              style={{ color: "#38b6ff", fontSize: isMobile ? 17 : 16, flexShrink: 0 }}
            />
            <input
              className="search-input"
              style={{ ...S.searchInput(isMobile), width: "100%" }}
              placeholder="Search contacts…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div style={S.contactList(isMobile)}>
            {filteredContacts.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: isMobile ? "26px 6px" : "32px 16px",
                  color: "#38b6ff",
                  fontSize: isMobile ? "0.92em" : "0.75rem",
                  opacity: 0.62,
                  letterSpacing: "0.09em",
                }}
              >
                NO CONTACTS FOUND
              </div>
            ) : (
              filteredContacts.map((c, i) => {
                const active = selectedContact?.id === c.id;
                return (
                  <div
                    key={c.id}
                    className="chat-contact-item contact-anim"
                    style={{
                      ...S.contactItem(active, isMobile),
                      animationDelay: `${i * 0.035}s`,
                    }}
                    onClick={() => {
                      setSelectedContact(c);
                      if (isMobile) setShowContactsMobile(false);
                    }}
                  >
                    <Avatar sx={S.contactAvatar(active, isMobile)}>
                      {c.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <div style={{ overflow: "hidden", flex: 1 }}>
                      <div style={S.contactName(active, isMobile)}>{c.name}</div>
                      <div style={S.contactEmail(isMobile)}>{c.email}</div>
                    </div>
                    {active && !isMobile && (
                      <div
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: cyan,
                          boxShadow: `0 0 8px ${cyan}`,
                          flexShrink: 0,
                          animation: "pulse 2s infinite",
                        }}
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>
          {/* Bottom user badge */}
          {user && (
            <div
              style={{
                padding: isMobile ? "7px 12px" : "12px 16px",
                borderTop: "1px solid rgba(0,229,255,0.08)",
                display: "flex",
                alignItems: "center",
                gap: isMobile ? 8 : 10,
                minHeight: isMobile ? 42 : 48,
              }}
            >
              <Avatar
                sx={{
                  width: isMobile ? 28 : 32,
                  height: isMobile ? 28 : 32,
                  fontSize: isMobile ? "0.78em" : "0.75rem",
                  fontWeight: 700,
                  background:
                    "linear-gradient(135deg,rgb(0, 104, 165), #38b6ff)",
                  border: "1px solid rgba(0, 149, 255, 0.3)",
                }}
              >
                {user.name?.charAt(0).toUpperCase()}
              </Avatar>
              <div style={{ overflow: "hidden" }}>
                <div
                  style={{
                    fontSize: isMobile ? "1em" : "0.78rem",
                    fontWeight: 600,
                    color: " #E0F7FA",
                    letterSpacing: "0.04em",
                  }}
                >
                  {user.name}
                </div>
                <div
                  style={{
                    fontSize: isMobile ? "0.78em" : "0.6rem",
                    color: "#38b6ff",
                    opacity: 0.64,
                    letterSpacing: "0.08em",
                  }}
                >
                  ONLINE
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Chat Area ── */}
        <div style={S.chatArea(isMobile, !isMobile || (selectedContact && !showContactsMobile))}>
          {selectedContact && (!isMobile || !showContactsMobile) ? (
            <>
              {/* Chat Header */}
              <div style={S.chatHeader(isMobile)}>
                {/* Mobile: Back button for chat area */}
                {isMobile && (
                  <IconButton
                    aria-label="Back to contacts"
                    size="small"
                    style={S.backBtnChat}
                    onClick={handleBackToContacts}
                  >
                    <ArrowBackIosNewIcon fontSize="small" />
                  </IconButton>
                )}
                <Avatar
                  sx={{
                    width: isMobile ? 37 : 42,
                    height: isMobile ? 37 : 42,
                    fontSize: isMobile ? "0.98em" : "1rem",
                    fontWeight: 700,
                    fontFamily: '"Rajdhani", monospace',
                    background:
                      "linear-gradient(135deg,rgb(0, 101, 160), #38b6ff)",
                    border: "1.5px solid rgba(0, 149, 255, 0.4)",
                    boxShadow: "0 0 14px rgba(0, 162, 255, 0.23)",
                  }}
                >
                  {selectedContact.name?.charAt(0).toUpperCase()}
                </Avatar>
                <div style={{flex:1, overflow:"hidden"}}>
                  <div style={S.chatHeaderName(isMobile)}>
                    {selectedContact.name}
                  </div>
                  {typing ? (
                    <div style={S.typingIndicator(isMobile)}>
                      ● typing...
                    </div>
                  ) : (
                    <div
                      style={{
                        fontSize: isMobile ? "0.81em" : "0.65rem",
                        color: "rgb(119, 205, 255)",
                        opacity: 0.56,
                        letterSpacing: "0.10em",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        maxWidth: isMobile ? 160 : 230
                      }}
                    >
                      {selectedContact.email}
                    </div>
                  )}
                </div>
                <div style={S.headerGlow} />
              </div>
              {/* Messages area */}
              <div style={S.messagesArea(isMobile)}>
                {groupByDate(messages).map((item, idx) => {
                  if (item.type === "sep")
                    return (
                      <div key={item.id} style={S.dateSeparator(isMobile)}>
                        <div style={S.dateLine(isMobile)} />
                        <div style={S.dateLabel(isMobile)}>
                          {formatDateSep(item.date)}
                        </div>
                        <div style={S.dateLine(isMobile)} />
                      </div>
                    );
                  const msg = item.data;
                  const isSender = msg.sender_email === user?.email;
                  return (
                    <div key={msg.id} style={S.msgWrapper(isSender, isMobile)}>
                      <div style={S.msgBubble(isSender, isMobile)}>
                        <div>{msg.message}</div>
                        <div style={S.msgMeta(isMobile)}>
                          <span style={S.msgTime(isMobile)}>
                            {formatTime(msg.created_at)}
                          </span>
                          {isSender && <StatusIcon status={msg.status} />}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <div style={S.inputArea(isMobile)}>
                {showEmoji && (
                  <div style={S.emojiPickerWrap(isMobile)}>
                    <EmojiPicker
                      onEmojiClick={(e) => setNewMessage((p) => p + e.emoji)}
                      height={isMobile ? 270 : 340}
                      width={isMobile ? 250 : 300}
                      theme="dark"
                      searchDisabled={false}
                      skinTonesDisabled
                    />
                  </div>
                )}
                <button
                  className="emoji-btn"
                  style={S.emojiBtn(isMobile)}
                  onClick={() => setShowEmoji((v) => !v)}
                  title="Emoji"
                  tabIndex={-1}
                >
                  <EmojiEmotionsIcon
                    style={{
                      fontSize: isMobile ? 21 : 22,
                      color: showEmoji ? cyan : undefined,
                    }}
                  />
                </button>
                <input
                  ref={inputRef}
                  className="chat-input"
                  style={S.inputField(isMobile)}
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping();
                  }}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />
                <button
                  className="send-btn"
                  style={S.sendBtn(isMobile)}
                  onClick={handleSend}
                  title="Send"
                >
                  <SendIcon style={{ fontSize: isMobile ? 17 : 20 }} />
                </button>
              </div>
            </>
          ) : (
            <div style={S.emptyState(isMobile)}>
              <div style={S.emptyIcon(isMobile)}>💬</div>
              <div
                style={{
                  fontSize: isMobile ? "0.92em" : "0.72rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  opacity: 0.73,
                  color: "#c8f3ff",
                  marginBottom: 1,
                }}
              >
                {isMobile
                  ? "Select a contact to begin"
                  : "Select a contact to begin"}
              </div>
              <div
                style={{
                  fontSize: isMobile ? "0.85em" : "0.61rem",
                  letterSpacing: "0.11em",
                  opacity: 0.41,
                  color: "#80DEEA",
                }}
              >
                {contacts.length} contact
                {contacts.length !== 1 ? "s" : ""} available
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatPage;