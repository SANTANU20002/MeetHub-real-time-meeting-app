import React, { useState, useEffect, useRef } from "react";
import Avatar from "@mui/material/Avatar";
import CheckIcon from "@mui/icons-material/Check";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import SendIcon from "@mui/icons-material/Send";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import { io } from "socket.io-client";

// Replace cyan theme color
const cyan = " #00cfff"; // NEW CYAN COLOR

const socket = io("http://localhost:5000", {
  withCredentials: true,
  transports: ["websocket"],
});

/* ─── Inline Styles ────────────────────────────────────────────── */
const S = {
  root: {
    display: "flex",
    height: "86vh",
    background: " #060D14",
    backgroundImage: `
      linear-gradient(rgba(0,229,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,229,255,0.025) 1px, transparent 1px)
    `,
    backgroundSize: "40px 40px",
    // fontFamily: '"Rajdhani", monospace',
    borderRadius: 0,
    height: '91.4vh',
    overflow: "hidden",
    border: "1px solid rgba(0,229,255,0.12)",
    boxShadow: "0 0 60px rgba(0,0,0,0.6)",
  },

  /* Sidebar */
  sidebar: {
    width: 280,
    minWidth: 280,
    display: "flex",
    flexDirection: "column",
    background: "rgba(6,15,22,0.95)",
    borderRight: "1px solid rgba(0,229,255,0.1)",
    position: "relative",
  },
  sidebarHeader: {
    padding: "20px 16px 12px",
    borderBottom: "1px solid rgba(0,229,255,0.08)",
  },
  sidebarTitle: {
    fontSize: "0.65rem",
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: cyan,
    marginBottom: 14,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  titleDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: cyan,
    boxShadow: `0 0 8px ${cyan}`,
    animation: "pulse 2s infinite",
    flexShrink: 0,
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    background: "rgba(0, 128, 255, 0.05)",
    border: "1px solid rgba(56, 182, 255, 0.23)",
    borderRadius: 10,
    padding: "7px 12px",
    gap: 8,
  },
  searchInput: {
    background: "transparent",
    border: "none",
    outline: "none",
    color: "rgb(178, 210, 242)",
    fontFamily: '"Rajdhani", monospace',
    fontSize: "0.82rem",
    letterSpacing: "0.05em",
    flex: 1,
    "::placeholder": { color: cyan },
  },
  contactList: {
    flex: 1,
    overflowY: "auto",
    padding: "8px 0",
  },
  contactItem: (active) => ({
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "11px 16px",
    cursor: "pointer",
    borderLeft: active ? `2px solid ${cyan}` : "2px solid transparent",
    background: active
      ? "linear-gradient(90deg, rgba(0,229,255,0.1), transparent)"
      : "transparent",
    transition: "all 0.2s",
    position: "relative",
  }),
  contactAvatar: (active) => ({
    width: 40,
    height: 40,
    fontSize: "1rem",
    fontWeight: 700,
    fontFamily: '"Rajdhani", monospace',
    background: active
      ? `linear-gradient(135deg,rgb(0, 106, 168), ${cyan})`
      : "rgba(0, 80, 137, 0.48)",
    border: active ? "1.5px solid rgba(56, 182, 255, 0.47)" : "1.5px solid rgba(56, 182, 255, 0.13)",
    boxShadow: active ? "0 0 12px rgba(56, 182, 255, 0.4)" : "none",
    transition: "all 0.2s",
    flexShrink: 0,
  }),
  contactName: (active) => ({
    fontSize: "0.88rem",
    fontWeight: 600,
    letterSpacing: "0.04em",
    color: active ? " #E0F7FA" : "rgb(117, 175, 209)",
    marginBottom: 2,
  }),
  contactEmail: {
    fontSize: "0.68rem",
    color: "rgb(156, 219, 255)",
    opacity: 0.6,
    letterSpacing: "0.03em",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: 160,
  },

  /* Chat area */
  chatArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    background: "transparent",
    position: "relative",
  },
  chatHeader: {
    padding: "14px 20px",
    borderBottom: "1px solid rgba(56, 182, 255, 0.19)",
    background: "rgba(6,15,22,0.7)",
    backdropFilter: "blur(10px)",
    display: "flex",
    alignItems: "center",
    gap: 14,
    position: "relative",
  },
  chatHeaderName: {
    fontSize: "1rem",
    fontWeight: 700,
    letterSpacing: "0.06em",
    color: "rgb(224, 239, 250)",
    margin: 0,
    lineHeight: 1.2,
  },
  typingIndicator: {
    fontSize: "0.68rem",
    color: cyan,
    letterSpacing: "0.1em",
    animation: "blink 1.2s ease-in-out infinite",
  },
  headerGlow: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    background: `linear-gradient(90deg, transparent, ${cyan}44, transparent)`,
  },

  messagesArea: {
    flex: 1,
    overflowY: "auto",
    padding: "20px 24px",
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },

  dateSeparator: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    margin: "16px 0 10px",
  },
  dateLine: {
    flex: 1,
    height: 1,
    background: "rgba(56, 182, 255, 0.19)",
  },
  dateLabel: {
    fontSize: "0.6rem",
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "#38b6ff",
    opacity: 0.7,
    padding: "3px 10px",
    border: "1px solid rgba(56, 182, 255, 0.21)",
    borderRadius: 20,
    background: "rgba(0,229,255,0.04)",
  },

  msgWrapper: (isSender) => ({
    display: "flex",
    justifyContent: isSender ? "flex-end" : "flex-start",
    marginBottom: 6,
    animation: "msgIn 0.25s ease both",
  }),
  msgBubble: (isSender) => ({
    maxWidth: "68%",
    padding: "10px 14px",
    borderRadius: isSender ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
    background: isSender
      ? "linear-gradient(135deg, rgba(0,180,200,0.9), rgba(0,130,180,0.85))"
      : "rgba(13, 27, 42, 0.85)",
    border: isSender
      ? "1px solid rgba(0,229,255,0.3)"
      : "1px solid rgba(0,229,255,0.12)",
    boxShadow: isSender
      ? "0 2px 16px rgba(0,180,200,0.2)"
      : "0 2px 12px rgba(0,0,0,0.3)",
    backdropFilter: "blur(8px)",
    color: isSender ? "#E0F7FA" : "#B2EBF2",
    fontSize: "0.88rem",
    lineHeight: 1.5,
    letterSpacing: "0.02em",
    fontFamily: '"Rajdhani", monospace',
    wordBreak: "break-word",
  }),
  msgMeta: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 2,
    marginTop: 4,
  },
  msgTime: {
    fontSize: "0.6rem",
    letterSpacing: "0.08em",
    opacity: 0.65,
    color: "#80DEEA",
  },

  /* Input area */
  inputArea: {
    padding: "14px 20px",
    borderTop: "1px solid rgba(0,229,255,0.1)",
    background: "rgba(6,15,22,0.8)",
    backdropFilter: "blur(10px)",
    display: "flex",
    alignItems: "center",
    gap: 12,
    position: "relative",
  },
  emojiBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: " #38b6ff",
    display: "flex",
    alignItems: "center",
    padding: 6,
    borderRadius: 8,
    transition: "color 0.2s, background 0.2s",
    flexShrink: 0,
  },
  inputField: {
    flex: 1,
    background: "rgba(0,229,255,0.05)",
    border: "1px solid rgba(0,229,255,0.18)",
    borderRadius: 12,
    padding: "10px 16px",
    color: "#E0F7FA",
    fontFamily: '"Rajdhani", monospace',
    fontSize: "0.9rem",
    letterSpacing: "0.03em",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  sendBtn: {
    background: "linear-gradient(135deg,rgb(0, 93, 143), #38b6ff)",
    border: "1px solid rgba(0, 145, 255, 0.35)",
    borderRadius: 12,
    width: 44,
    height: 44,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#E0F7FA",
    boxShadow: "0 0 14px rgba(0, 162, 255, 0.2)",
    transition: "box-shadow 0.2s, transform 0.15s",
    flexShrink: 0,
  },
  emptyState: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    color: "#38b6ff",
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: "50%",
    border: "1px solid rgba(0,229,255,0.2)",
    background: "rgba(0,229,255,0.05)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.6rem",
    animation: "pulse 2.5s infinite",
  },
  emojiPickerWrap: {
    position: "absolute",
    bottom: "100%",
    left: 20,
    zIndex: 100,
    borderRadius: 14,
    overflow: "hidden",
    border: "1px solid rgba(0,229,255,0.2)",
    boxShadow: "0 0 30px rgba(0,0,0,0.5)",
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
    if (cur !== last) { out.push({ type: "sep", date: m.created_at, id: `s${i}` }); last = cur; }
    out.push({ type: "msg", data: m });
  });
  return out;
};

const StatusIcon = ({ status }) => {
  if (status === "sent")
    return <CheckIcon style={{ color: "rgba(176,224,230,0.5)", fontSize: 13, marginLeft: 2 }} />;
  if (status === "delivered")
    return <DoneAllIcon style={{ color: "rgba(176,224,230,0.7)", fontSize: 13, marginLeft: 2 }} />;
  if (status === "read")
    return <DoneAllIcon style={{ color: cyan, fontSize: 13, marginLeft: 2 }} />;
  return null;
};

/* ─── Component ───────────────────────────────────────────────── */
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

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    const init = async () => {
      try {
        const s = await axios.get("http://localhost:5000/me", { withCredentials: true });
        if (!s.data.loggedIn) { window.location.href = "/login"; return; }
        setUser(s.data.user);
        socket.emit("registerUser", { email: s.data.user.email });
        const c = await axios.get("http://localhost:5000/contacts", { withCredentials: true });
        setContacts(c.data);
        if (c.data.length > 0) setSelectedContact(c.data[0]);
      } catch (e) { console.error(e); }
    };
    init();
  }, []);

  useEffect(() => {
    if (!selectedContact || !user) return;
    axios.get("http://localhost:5000/messages", {
      params: { receiver_email: selectedContact.email },
      withCredentials: true,
    }).then(r => setMessages(r.data)).catch(() => setMessages([]));
    socket.emit("messagesRead", { sender_email: selectedContact.email, receiver_email: user.email });
  }, [selectedContact, user]);

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      if (!user || !selectedContact) return;
      const relevant =
        (msg.sender_email === user.email && msg.receiver_email === selectedContact.email) ||
        (msg.sender_email === selectedContact.email && msg.receiver_email === user.email);
      if (relevant) setMessages(p => p.some(m => m.id === msg.id) ? p : [...p, msg]);
    });
    socket.on("newContactAdded", (c) =>
      setContacts(p => p.some(x => x.email === c.email) ? p : [...p, c]));
    socket.on("typing", ({ sender_email }) => {
      if (sender_email === selectedContact?.email) {
        setTyping(true);
        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setTyping(false), 2000);
      }
    });
    socket.on("messageStatusUpdate", ({ messageId, status }) =>
      setMessages(p => p.map(m => m.id === messageId ? { ...m, status } : m)));
    return () => {
      socket.off("receiveMessage"); socket.off("newContactAdded");
      socket.off("typing"); socket.off("messageStatusUpdate");
      clearTimeout(typingTimeout.current);
    };
  }, [user, selectedContact]);

  const handleTyping = () => {
    if (!selectedContact || !user) return;
    socket.emit("typing", { sender_email: user.email, receiver_email: selectedContact.email });
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

  const filteredContacts = contacts.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&display=swap');

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

        /* Scrollbar styling */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0, 136, 255, 0.2); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(0, 157, 255, 0.4); }

        .chat-contact-item:hover {
          background: linear-gradient(90deg, rgba(0, 166, 255, 0.07), transparent) !important;
          border-left-color: rgba(0, 157, 255, 0.4) !important;
        }
        .emoji-btn:hover { color: ${cyan} !important; background: rgba(0, 157, 255, 0.1) !important; }
        .send-btn:hover { box-shadow: 0 0 22px rgba(0, 157, 255, 0.45) !important; transform: scale(1.05); }
        .send-btn:active { transform: scale(0.97); }
        .chat-input:focus {
          border-color: rgba(0, 153, 255, 0.45) !important;
          box-shadow: 0 0 0 3px rgba(0, 136, 255, 0.08) !important;
        }
        .search-input::placeholder { color: rgba(77, 163, 225, 0.45); }
        .contact-anim { animation: slideIn 0.3s ease both; }
      `}</style>

      <div style={S.root}>

        {/* ── Sidebar ── */}
        <div style={S.sidebar}>
          <div style={S.sidebarHeader}>
            <div style={S.sidebarTitle}>
              <div style={S.titleDot} />
              Contacts
              <span style={{
                marginLeft: "auto", fontSize: "0.6rem",
                background: "rgba(0, 157, 255, 0.1)", border: "1px solid rgba(0, 140, 255, 0.25)",
                borderRadius: 10, padding: "2px 8px", color: cyan,
              }}>
                {contacts.length}
              </span>
            </div>

            {/* Search */}
            <div style={S.searchBox}>
              <SearchIcon style={{ color: " #38b6ff", fontSize: 16, flexShrink: 0 }} />
              <input
                className="search-input"
                style={{ ...S.searchInput, width: "100%" }}
                placeholder="Search contacts..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div style={S.contactList}>
            {filteredContacts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 16px", color: " #38b6ff", fontSize: "0.75rem", opacity: 0.6, letterSpacing: "0.1em" }}>
                NO CONTACTS FOUND
              </div>
            ) : filteredContacts.map((c, i) => {
              const active = selectedContact?.id === c.id;
              return (
                <div
                  key={c.id}
                  className="chat-contact-item contact-anim"
                  style={{ ...S.contactItem(active), animationDelay: `${i * 0.04}s` }}
                  onClick={() => setSelectedContact(c)}
                >
                  <Avatar sx={S.contactAvatar(active)}>
                    {c.name?.charAt(0).toUpperCase()}
                  </Avatar>
                  <div style={{ overflow: "hidden", flex: 1 }}>
                    <div style={S.contactName(active)}>{c.name}</div>
                    <div style={S.contactEmail}>{c.email}</div>
                  </div>
                  {active && (
                    <div style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: cyan, boxShadow: `0 0 8px ${cyan}`,
                      flexShrink: 0, animation: "pulse 2s infinite",
                    }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom user badge */}
          {user && (
            <div style={{
              padding: "12px 16px",
              borderTop: "1px solid rgba(0,229,255,0.08)",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <Avatar sx={{
                width: 32, height: 32, fontSize: "0.75rem", fontWeight: 700,
                background: "linear-gradient(135deg,rgb(0, 104, 165), #38b6ff)",
                border: "1px solid rgba(0, 149, 255, 0.3)",
              }}>
                {user.name?.charAt(0).toUpperCase()}
              </Avatar>
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontSize: "0.78rem", fontWeight: 600, color: " #E0F7FA", letterSpacing: "0.04em" }}>
                  {user.name}
                </div>
                <div style={{ fontSize: "0.6rem", color: " #38b6ff", opacity: 0.6, letterSpacing: "0.08em" }}>
                  ONLINE
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Chat Area ── */}
        <div style={S.chatArea}>
          {selectedContact ? (
            <>
              {/* Header */}
              <div style={S.chatHeader}>
                <Avatar sx={{
                  width: 42, height: 42, fontSize: "1rem", fontWeight: 700,
                  fontFamily: '"Rajdhani", monospace',
                  background: "linear-gradient(135deg,rgb(0, 101, 160), #38b6ff)",
                  border: "1.5px solid rgba(0, 149, 255, 0.4)",
                  boxShadow: "0 0 14px rgba(0, 162, 255, 0.2)",
                }}>
                  {selectedContact.name?.charAt(0).toUpperCase()}
                </Avatar>
                <div>
                  <div style={S.chatHeaderName}>{selectedContact.name}</div>
                  {typing
                    ? <div style={S.typingIndicator}>● typing...</div>
                    : <div style={{ fontSize: "0.65rem", color: "rgb(119, 205, 255)", opacity: 0.55, letterSpacing: "0.1em" }}>
                        {selectedContact.email}
                      </div>
                  }
                </div>
                <div style={S.headerGlow} />
              </div>

              {/* Messages */}
              <div style={S.messagesArea}>
                {groupByDate(messages).map((item, idx) => {
                  if (item.type === "sep") return (
                    <div key={item.id} style={S.dateSeparator}>
                      <div style={S.dateLine} />
                      <div style={S.dateLabel}>{formatDateSep(item.date)}</div>
                      <div style={S.dateLine} />
                    </div>
                  );
                  const msg = item.data;
                  const isSender = msg.sender_email === user?.email;
                  return (
                    <div key={msg.id} style={S.msgWrapper(isSender)}>
                      <div style={S.msgBubble(isSender)}>
                        <div>{msg.message}</div>
                        <div style={S.msgMeta}>
                          <span style={S.msgTime}>{formatTime(msg.created_at)}</span>
                          {isSender && <StatusIcon status={msg.status} />}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div style={S.inputArea}>
                {showEmoji && (
                  <div style={S.emojiPickerWrap}>
                    <EmojiPicker
                      onEmojiClick={e => setNewMessage(p => p + e.emoji)}
                      height={340} width={300}
                      theme="dark"
                      searchDisabled={false}
                      skinTonesDisabled
                    />
                  </div>
                )}

                <button
                  className="emoji-btn"
                  style={S.emojiBtn}
                  onClick={() => setShowEmoji(v => !v)}
                  title="Emoji"
                >
                  <EmojiEmotionsIcon style={{ fontSize: 22, color: showEmoji ? cyan : undefined }} />
                </button>

                <input
                  ref={inputRef}
                  className="chat-input"
                  style={S.inputField}
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={e => { setNewMessage(e.target.value); handleTyping(); }}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                />

                <button className="send-btn" style={S.sendBtn} onClick={handleSend} title="Send">
                  <SendIcon style={{ fontSize: 20 }} />
                </button>
              </div>
            </>
          ) : (
            /* Empty state */
            <div style={S.emptyState}>
              <div style={S.emptyIcon}>💬</div>
              <div style={{ fontSize: "0.72rem", letterSpacing: "0.16em", textTransform: "uppercase", opacity: 0.7 }}>
                Select a contact to begin
              </div>
              <div style={{
                fontSize: "0.6rem", letterSpacing: "0.1em", opacity: 0.4, color: "#80DEEA",
              }}>
                {contacts.length} contact{contacts.length !== 1 ? "s" : ""} available
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatPage;