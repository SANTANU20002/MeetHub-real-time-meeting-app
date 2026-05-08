import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const cyan = " #38b6ff";
const dark = " #0d0f14";
const panel = " #111318";

const NAV_ITEMS = [
  {
    index: 0,
    label: "Home",
    path: "/dashboard/home",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
        <path d="M9 21V12h6v9"/>
      </svg>
    ),
  },
  {
    index: 1,
    label: "Chat",
    path: "/dashboard/chat",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    index: 2,
    label: "Video Call",
    path: "/dashboard/video-call",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7"/>
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
      </svg>
    ),
  },
  {
    index: 3,
    label: "Group Meeting",
    path: "/dashboard/meeting",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="7" r="3"/>
        <circle cx="15" cy="7" r="3"/>
        <path d="M3 20c0-3.3 2.7-6 6-6h6c3.3 0 6 2.7 6 6"/>
      </svg>
    ),
  },
  {
    index: 4,
    label: "Status",
    path: "/dashboard/status",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M8 13s1.5 2 4 2 4-2 4-2"/>
        <line x1="9" y1="9" x2="9.01" y2="9"/>
        <line x1="15" y1="9" x2="15.01" y2="9"/>
      </svg>
    ),
  },
  {
    index: 5,
    label: "Chat With AI",
    path: "/dashboard/chat-with-ai",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
        <path d="M9 8h.01M12 8h.01M15 8h.01"/>
      </svg>
    ),
    badge: "AI",
  },
  // Removed Photo Editor and Video Editor tabs
];

const SECTION_DIVIDER_AFTER = 3;

const styles = {
  sidebar: {
    width: "100%",
    height: "100%",
    background: dark,
    borderRight: "0.5px solid rgba(255,255,255,0.07)",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'DM Sans', sans-serif",
    padding: "8px 0",
    boxSizing: "border-box",
    overflowY: "auto",
    overflowX: "hidden",
  },
  section: {
    padding: "0 10px",
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.2)",
    padding: "14px 10px 6px 10px",
    userSelect: "none",
  },
  divider: {
    height: "0.5px",
    background: "rgba(255,255,255,0.06)",
    margin: "8px 10px",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 11,
    padding: "9px 12px",
    borderRadius: 7,
    cursor: "pointer",
    fontSize: 13.5,
    fontWeight: 400,
    transition: "background 0.15s, color 0.15s",
    userSelect: "none",
    position: "relative",
    marginBottom: 2,
    textDecoration: "none",
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 7,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "background 0.15s",
  },
  badge: {
    marginLeft: "auto",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.5px",
    padding: "2px 7px",
    borderRadius: 4,
    background: "rgba(0,212,255,0.12)",
    color: cyan,
    flexShrink: 0,
  },
  activeBar: {
    position: "absolute",
    left: 0,
    top: "50%",
    transform: "translateY(-50%)",
    width: 3,
    height: 18,
    borderRadius: "0 3px 3px 0",
    background: cyan,
  },
};

const NavItem = ({ item, isActive, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.navItem,
        background: isActive
          ? "rgba(0,212,255,0.08)"
          : hovered
          ? "rgba(255,255,255,0.04)"
          : "transparent",
        color: isActive
          ? "#ffffff"
          : hovered
          ? "rgba(255,255,255,0.8)"
          : "rgba(255,255,255,0.45)",
      }}
      onClick={() => onClick(item.index, item.path)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {isActive && <div style={styles.activeBar} />}

      <div
        style={{
          ...styles.iconBox,
          background: isActive
            ? "rgba(56, 182, 255, 0.14)"
            : hovered
            ? "rgba(255,255,255,0.06)"
            : "rgba(255,255,255,0.03)",
          color: isActive ? cyan : "inherit",
        }}
      >
        {item.icon}
      </div>

      <span style={{ flex: 1, fontWeight: isActive ? 500 : 400 }}>
        {item.label}
      </span>

      {item.badge && (
        <span style={styles.badge}>{item.badge}</span>
      )}
    </div>
  );
};

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const activeIndex = NAV_ITEMS.findIndex(
    (item) => location.pathname === item.path
  );
  const [selectedIndex, setSelectedIndex] = useState(
    activeIndex >= 0 ? activeIndex : 0
  );

  const handleClick = (index, path) => {
    setSelectedIndex(index);
    navigate(path);
  };

  const mainItems = NAV_ITEMS.slice(0, SECTION_DIVIDER_AFTER + 1);
  const toolItems = NAV_ITEMS.slice(SECTION_DIVIDER_AFTER + 1);

  // Add custom CSS for .sidebar_section_idicate
  React.useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `.sidebar_section_idicate { padding-left: 10px !important; }`;
    document.head.appendChild(styleTag);
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      <div style={styles.sidebar}>
 


        <div style={styles.sectionLabel} className='sidebar_section_idicate'>&nbsp;&nbsp;Navigation</div>

        <div style={styles.section}>
          {mainItems.map((item) => (
            <NavItem
              key={item.index}
              item={item}
              isActive={selectedIndex === item.index}
              onClick={handleClick}
            />
          ))}
        </div>

        <div style={styles.divider} />

        <div style={styles.sectionLabel} className='sidebar_section_idicate'>&nbsp;&nbsp;Tools</div>

        <div style={styles.section}>
          {toolItems.map((item) => (
            <NavItem
              key={item.index}
              item={item}
              isActive={selectedIndex === item.index}
              onClick={handleClick}
            />
          ))}
        </div>

      </div>
    </>
  );
}

export default Sidebar;