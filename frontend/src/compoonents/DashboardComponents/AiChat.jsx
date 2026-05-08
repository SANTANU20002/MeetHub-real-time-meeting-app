import React, { useState, useEffect, useRef } from "react";

// --- Color Styles & Icons remain unchanged, omitted for brevity ---
// (You can keep all the color, style, and icon definitions the same as before)

const ACCENT = "#37b5fe";
const ACCENT_DARK = "#1a9de8";
const BG_PRIMARY = "#0d1117";
const BG_SECONDARY = "#161b22";
const BG_TERTIARY = "#1c2128";
const BG_MSG_USER = "#1a3a5c";
const BG_MSG_AI = "#1c2128";
const TEXT_PRIMARY = "#e6edf3";
const TEXT_SECONDARY = "#8b949e";
const BORDER = "#30363d";

const styles = {
  root: {
    display: "flex",
    flexDirection: "column",
    height: "91.4vh",
    width: "100%",
    background: BG_PRIMARY,
    fontFamily: "'SF Pro Display', 'Segoe UI', system-ui, sans-serif",
    color: TEXT_PRIMARY,
    overflow: "hidden",
  },

  header: {
    background: BG_SECONDARY,
    borderBottom: `1px solid ${BORDER}`,
    padding: "14px 20px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexShrink: 0,
    backdropFilter: "blur(12px)",
    zIndex: 10,
  },

  avatarWrap: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: `linear-gradient(135deg, ${ACCENT} 0%, #1a6fc4 100%)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxShadow: `0 0 0 2px ${BG_SECONDARY}, 0 0 0 3px ${ACCENT}44`,
  },

  headerText: {
    flex: 1,
  },

  headerTitle: {
    margin: 0,
    fontSize: 15,
    fontWeight: 600,
    color: TEXT_PRIMARY,
    letterSpacing: "-0.01em",
  },

  headerSub: {
    margin: 0,
    fontSize: 12,
    color: ACCENT,
    marginTop: 1,
  },

  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#3fb950",
    display: "inline-block",
    marginRight: 5,
    boxShadow: "0 0 6px #3fb95088",
  },

  messagesArea: {
    flex: 1,
    overflowY: "auto",
    padding: "20px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 4,
    scrollbarWidth: "thin",
    scrollbarColor: `${BORDER} transparent`,
  },

  dateDivider: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    margin: "12px 0",
  },

  dateLine: {
    flex: 1,
    height: 1,
    background: BORDER,
  },

  dateText: {
    fontSize: 11,
    color: TEXT_SECONDARY,
    whiteSpace: "nowrap",
    background: BG_PRIMARY,
    padding: "0 8px",
  },

  msgRow: (isUser) => ({
    display: "flex",
    justifyContent: isUser ? "flex-end" : "flex-start",
    alignItems: "flex-end",
    gap: 8,
    marginBottom: 2,
  }),

  msgAvatar: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: `linear-gradient(135deg, ${ACCENT} 0%, #1a6fc4 100%)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    fontSize: 12,
    fontWeight: 700,
    color: "#fff",
  },

  msgBubble: (isUser) => ({
    maxWidth: "72%",
    padding: "10px 14px",
    borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
    background: isUser ? BG_MSG_USER : BG_MSG_AI,
    border: `1px solid ${isUser ? ACCENT + "33" : BORDER}`,
    color: TEXT_PRIMARY,
    fontSize: 14,
    lineHeight: 1.55,
    wordBreak: "break-word",
    position: "relative",
    boxShadow: isUser
      ? `0 2px 12px ${ACCENT}15`
      : "0 2px 8px rgba(0,0,0,0.3)",
  }),

  msgText: {
    margin: 0,
    whiteSpace: "pre-wrap",
  },

  msgMeta: (isUser) => ({
    display: "flex",
    alignItems: "center",
    gap: 4,
    marginTop: 5,
    justifyContent: isUser ? "flex-end" : "flex-start",
  }),

  msgTime: {
    fontSize: 10,
    color: TEXT_SECONDARY,
  },

  checkIcon: (status) => ({
    fontSize: 12,
    color: status === "read" ? ACCENT : TEXT_SECONDARY,
    display: "inline-flex",
  }),

  typingBubble: {
    display: "flex",
    alignItems: "flex-end",
    gap: 8,
    marginBottom: 2,
  },

  typingInner: {
    padding: "12px 16px",
    borderRadius: "18px 18px 18px 4px",
    background: BG_MSG_AI,
    border: `1px solid ${BORDER}`,
    display: "flex",
    gap: 4,
    alignItems: "center",
  },

  dot: (delay) => ({
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: ACCENT,
    animation: "bounce 1.2s infinite ease-in-out",
    animationDelay: delay,
    opacity: 0.8,
  }),

  inputArea: {
    background: BG_SECONDARY,
    borderTop: `1px solid ${BORDER}`,
    padding: "12px 16px",
    display: "flex",
    alignItems: "flex-end",
    gap: 10,
    flexShrink: 0,
  },

  textarea: {
    flex: 1,
    background: BG_TERTIARY,
    border: `1px solid ${BORDER}`,
    borderRadius: 12,
    padding: "10px 14px",
    color: TEXT_PRIMARY,
    fontSize: 14,
    lineHeight: 1.5,
    resize: "none",
    outline: "none",
    fontFamily: "inherit",
    maxHeight: 120,
    minHeight: 42,
    transition: "border-color 0.2s",
  },

  sendBtn: (enabled) => ({
    width: 42,
    height: 42,
    borderRadius: "50%",
    background: enabled
      ? `linear-gradient(135deg, ${ACCENT} 0%, ${ACCENT_DARK} 100%)`
      : BG_TERTIARY,
    border: `1px solid ${enabled ? ACCENT : BORDER}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: enabled ? "pointer" : "not-allowed",
    flexShrink: 0,
    transition: "all 0.2s",
    boxShadow: enabled ? `0 0 16px ${ACCENT}40` : "none",
  }),

  clearBtn: {
    background: "none",
    border: "none",
    color: TEXT_SECONDARY,
    fontSize: 12,
    cursor: "pointer",
    padding: "4px 8px",
    borderRadius: 6,
    transition: "color 0.2s",
    flexShrink: 0,
    alignSelf: "center",
  },

  errorBanner: {
    background: "#3d1a1a",
    border: "1px solid #f8514933",
    color: "#ff6b6b",
    padding: "8px 14px",
    fontSize: 13,
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  emptyState: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    opacity: 0.5,
    pointerEvents: "none",
    userSelect: "none",
  },

  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: `${ACCENT}22`,
    border: `2px solid ${ACCENT}44`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTitle: {
    margin: 0,
    fontSize: 16,
    fontWeight: 600,
    color: TEXT_PRIMARY,
  },

  emptySub: {
    margin: 0,
    fontSize: 13,
    color: TEXT_SECONDARY,
    textAlign: "center",
    maxWidth: 260,
    lineHeight: 1.5,
  },
};

const BotIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2"/>
    <circle cx="12" cy="5" r="2"/>
    <path d="M12 7v4"/>
    <line x1="8" y1="16" x2="8" y2="16"/>
    <line x1="16" y1="16" x2="16" y2="16"/>
  </svg>
);

const SendIcon = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color || "white"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const CheckIcon = ({ double, color }) => (
  <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
    {double && <polyline points="1,5 4,8 9,1" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>}
    <polyline points={double ? "5,5 8,8 13,1" : "1,5 5,9 13,1"} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4h6v2"/>
  </svg>
);

const formatTime = (date) => {
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatDate = (date) => {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
};

const TypingIndicator = () => (
  <div style={styles.typingBubble}>
    <div style={styles.msgAvatar}>
      <BotIcon />
    </div>
    <div style={styles.typingInner}>
      <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}`}</style>
      <div style={styles.dot("0s")} />
      <div style={styles.dot("0.16s")} />
      <div style={styles.dot("0.32s")} />
    </div>
  </div>
);

export default function AiChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Ensure textarea height adjusts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  const adjustTextarea = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    // Generate a truly unique id as string
    const userMsgId = Date.now().toString() + Math.random();

    const userMsg = {
      id: userMsgId,
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
      status: "sent",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setError(null);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setIsLoading(true);

    try {
      // Always use up-to-date state
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // -- PATCH: Use proper API endpoint and ensure compatibility

      // If your backend expects /api/chat or /api/ai/chat, set URL accordingly.
      // You might also want to test/fix CORS backend-side as needed.

      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: history,
        }),
      });

      if (!response.ok) {
        // Try to extract error details if available
        let errText = "";
        try {
          errText = await response.text();
        } catch (_) {}
        console.error("API Error", errText);

        throw new Error(`API error: ${response.status}`);
      }

      // Try to parse the data; show user-friendly error if response is not as expected
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Failed to parse JSON response", parseError);
        throw new Error("Server error: Invalid response");
      }

      // The expected API response shape is: { content: [{ type: "text", text: "..." }, ...] }
      // Validate response and fallback gracefully
      let aiText = "";
      if (
        data &&
        Array.isArray(data.content) &&
        data.content.length > 0 &&
        typeof data.content[0] === "object"
      ) {
        aiText = data.content
          .filter((b) => b.type === "text" && typeof b.text === "string")
          .map((b) => b.text)
          .join("");
      } else if (typeof data.content === "string") {
        aiText = data.content;
      } else if (typeof data.message === "string") {
        aiText = data.message;
      } else {
        aiText = "Sorry, I couldn't understand the response from the server.";
      }

      // Mark user message as delivered/read
      setMessages((prev) =>
        prev.map((m) =>
          m.id === userMsgId ? { ...m, status: "read" } : m
        )
      );

      // Add AI message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + Math.random(),
          role: "assistant",
          content: aiText,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      setError("Failed to get a response from AI. Please try again.");
      setMessages((prev) =>
        prev.map((m) =>
          m.id === userMsgId ? { ...m, status: "error" } : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  // Fix: ensure timestamp can be parsed correctly in formatDate/formatTime
  const grouped = messages.reduce((acc, msg) => {
    const day = formatDate(msg.timestamp);
    if (!acc[day]) acc[day] = [];
    acc[day].push(msg);
    return acc;
  }, {});

  const hasMessages = messages.length > 0;

  return (
    <div style={styles.root}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.avatarWrap}>
          <BotIcon />
        </div>
        <div style={styles.headerText}>
          <p style={styles.headerTitle}>Meet AI</p>
          <p style={styles.headerSub}>
            <span style={styles.onlineDot} />
            Always here to help
          </p>
        </div>
        {hasMessages && (
          <button
            onClick={clearChat}
            style={styles.clearBtn}
            title="Clear chat"
          >
            <TrashIcon />
          </button>
        )}
      </div>

      {/* Messages */}
      <div style={styles.messagesArea}>
        {!hasMessages && !isLoading && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <BotIcon />
            </div>
            <p style={styles.emptyTitle}>How can I help you?</p>
            <p style={styles.emptySub}>
              Ask me anything — I'm powered by MeetHub and ready to assist.
            </p>
          </div>
        )}

        {Object.entries(grouped).map(([day, msgs]) => (
          <React.Fragment key={day}>
            <div style={styles.dateDivider}>
              <div style={styles.dateLine} />
              <span style={styles.dateText}>{day}</span>
              <div style={styles.dateLine} />
            </div>
            {msgs.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div key={msg.id} style={styles.msgRow(isUser)}>
                  {!isUser && (
                    <div style={styles.msgAvatar}>
                      <BotIcon />
                    </div>
                  )}
                  <div style={styles.msgBubble(isUser)}>
                    <p style={styles.msgText}>{msg.content}</p>
                    <div style={styles.msgMeta(isUser)}>
                      <span style={styles.msgTime}>
                        {formatTime(msg.timestamp)}
                      </span>
                      {isUser && (
                        <span style={styles.checkIcon(msg.status)}>
                          <CheckIcon
                            double={true}
                            color={
                              msg.status === "read"
                                ? ACCENT
                                : msg.status === "error"
                                ? "#ff6b6b"
                                : TEXT_SECONDARY
                            }
                          />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ))}

        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Error */}
      {error && (
        <div style={styles.errorBanner}>
          <span>⚠</span> {error}
        </div>
      )}

      {/* Input */}
      <div style={styles.inputArea}>
        <textarea
          ref={textareaRef}
          rows={1}
          style={styles.textarea}
          placeholder="Message Claude..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            adjustTextarea();
          }}
          onKeyDown={handleKeyDown}
          onFocus={(e) => {
            e.target.style.borderColor = ACCENT + "88";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = BORDER;
          }}
          disabled={isLoading}
        />
        <button
          style={styles.sendBtn(!!input.trim() && !isLoading)}
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          title="Send message"
        >
          <SendIcon color={input.trim() && !isLoading ? "white" : TEXT_SECONDARY} />
        </button>
      </div>
    </div>
  );
}