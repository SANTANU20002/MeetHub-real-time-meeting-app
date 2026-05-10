import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  TextField,
  Autocomplete,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';

/* ─── Global Styles ─── */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(56,182,255,0.4); }
    70% { box-shadow: 0 0 0 16px rgba(56,182,255,0); }
    100% { box-shadow: 0 0 0 0 rgba(56,182,255,0); }
  }
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes overlayIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes modalIn {
    from { opacity: 0; transform: translate(-50%, -48%) scale(0.95); }
    to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  }
  @keyframes modalInMobile {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes popIn {
    0% { transform: scale(0.5); opacity: 0; }
    70% { transform: scale(1.1); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 20px rgba(56,182,255,0.2); }
    50% { box-shadow: 0 0 40px rgba(56,182,255,0.5); }
  }

  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(56,182,255,0.3); border-radius: 4px; }

  body { background: #000; font-family: 'Outfit', sans-serif; }

  /* MUI Overrides */
  .gm-textfield .MuiOutlinedInput-root {
    color: #e8f4ff !important;
    font-family: 'Outfit', sans-serif !important;
    font-size: 14px !important;
    background: rgba(56,182,255,0.04) !important;
  }
  .gm-textfield .MuiOutlinedInput-notchedOutline {
    border-color: rgba(56,182,255,0.2) !important;
    transition: border-color 0.2s !important;
  }
  .gm-textfield .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
    border-color: rgba(56,182,255,0.5) !important;
  }
  .gm-textfield .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: #38b6ff !important;
    box-shadow: 0 0 0 3px rgba(56,182,255,0.1) !important;
  }
  .gm-textfield .MuiInputLabel-root {
    color: rgba(56,182,255,0.5) !important;
    font-family: 'Outfit', sans-serif !important;
    font-size: 14px !important;
  }
  .gm-textfield .MuiInputLabel-root.Mui-focused { color: #38b6ff !important; }
  .gm-textfield .MuiChip-root {
    background: rgba(56,182,255,0.15) !important;
    color: #38b6ff !important;
    border: 1px solid rgba(56,182,255,0.3) !important;
    font-family: 'Outfit', sans-serif !important;
    font-size: 12px !important;
    height: 26px !important;
  }
  .gm-textfield .MuiChip-deleteIcon { color: rgba(56,182,255,0.6) !important; }
  .gm-textfield .MuiAutocomplete-popupIndicator { color: rgba(56,182,255,0.5) !important; }
  .gm-textfield input::placeholder { color: rgba(56,182,255,0.3) !important; }
  .MuiAutocomplete-paper {
    background: #0a0a0a !important;
    border: 1px solid rgba(56,182,255,0.25) !important;
    border-radius: 12px !important;
    color: #e8f4ff !important;
    font-family: 'Outfit', sans-serif !important;
    backdrop-filter: blur(20px) !important;
    box-shadow: 0 8px 32px rgba(0,0,0,0.6) !important;
    overflow: hidden !important;
  }
  .MuiAutocomplete-listbox {
    padding: 6px !important;
    max-height: 220px !important;
  }
  .MuiAutocomplete-option {
    font-family: 'Outfit', sans-serif !important;
    font-size: 13px !important;
    color: #e8f4ff !important;
    border-radius: 8px !important;
    margin-bottom: 2px !important;
    padding: 10px 12px !important;
  }
  .MuiAutocomplete-option:hover,
  .MuiAutocomplete-option.Mui-focused {
    background: rgba(56,182,255,0.12) !important;
    color: #38b6ff !important;
  }
  .MuiAutocomplete-option[aria-selected="true"] {
    background: rgba(56,182,255,0.18) !important;
  }
  .MuiAutocomplete-noOptions {
    color: rgba(56,182,255,0.4) !important;
    font-family: 'Outfit', sans-serif !important;
    font-size: 13px !important;
  }

  /* Responsive sidebar drawer */
  .gm-sidebar-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    z-index: 50;
    backdrop-filter: blur(4px);
  }
  @media (max-width: 768px) {
    .gm-sidebar {
      position: fixed !important;
      left: -100% !important;
      top: 0 !important;
      height: 100% !important;
      z-index: 60 !important;
      transition: left 0.3s ease !important;
      width: 280px !important;
    }
    .gm-sidebar.open {
      left: 0 !important;
    }
    .gm-sidebar-overlay.open {
      display: block !important;
    }
    .gm-modal {
      width: 92vw !important;
      max-width: 420px !important;
      top: auto !important;
      bottom: 0 !important;
      left: 0 !important;
      right: 0 !important;
      transform: none !important;
      margin: 0 auto !important;
      border-radius: 24px 24px 0 0 !important;
      animation: modalInMobile 0.3s ease !important;
      max-height: 92vh !important;
      overflow-y: auto !important;
    }
    .gm-modal-overlay {
      align-items: flex-end !important;
    }
  }
  @media (max-width: 480px) {
    .gm-modal {
      width: 100vw !important;
    }
  }
`;

const C = {
  bg: '#000000',
  surface: '#0a0a0a',
  surfaceHigh: '#111111',
  border: 'rgba(56,182,255,0.12)',
  borderHover: 'rgba(56,182,255,0.3)',
  blue: '#38b6ff',
  blueDark: '#1a8fd1',
  blueGlow: 'rgba(56,182,255,0.15)',
  blueFaint: 'rgba(56,182,255,0.06)',
  text: '#e8f4ff',
  textSub: 'rgba(232,244,255,0.6)',
  textMuted: 'rgba(56,182,255,0.4)',
  red: '#ff4757',
  success: '#2ed573',
};

const getAvatarUrl = (avatar) => {
  if (!avatar) return null;
  if (avatar.startsWith('http://') || avatar.startsWith('https://')) return avatar;
  // Always return url with / prefix
  if (!avatar.startsWith('/')) avatar = '/' + avatar;
  return `http://localhost:5000${avatar}`;
};

const GroupMeeting = () => {
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [autocompleteKey, setAutocompleteKey] = useState(0);
  const [successMsg, setSuccessMsg] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => { checkAuth(); }, []);
  useEffect(() => { if (isAuthenticated) fetchGroups(); }, [isAuthenticated]);
  useEffect(() => { if (open && isAuthenticated) fetchContacts(); }, [open, isAuthenticated]);
  useEffect(() => { setAutocompleteKey(p => p + 1); }, [contacts]);

  // Fix: forcibly reload contacts Autocomplete every time modal opens
  useEffect(() => {
    if (open) {
      fetchContacts();
    }
  }, [open]);

  const checkAuth = async () => {
    try {
      const res = await axios.get('http://localhost:5000/me', { withCredentials: true });
      if (res.data.loggedIn) setIsAuthenticated(true);
      else setError('Please log in to create groups');
    } catch { setError('Authentication error. Please log in.'); }
  };

  // Always return members as array of {name, email}
  const fixMembers = (members) => {
    if (!Array.isArray(members)) return [];
    // Support member either: {name,email} or just email string or {label, value}
    return members.map(m => {
      if (typeof m === 'object' && (m.email || m.value)) {
        return {
          name: m.name || m.label || m.value || m.email || '',
          email: m.email || m.value || '',
        };
      }
      if (typeof m === 'string') {
        return { name: m, email: m };
      }
      return { name: '?', email: '?' };
    });
  };

  // Load contacts (for selection)
  const fetchContacts = async () => {
    try {
      setContactsLoading(true);
      setError(null);
      const res = await axios.get('http://localhost:5000/contacts', { withCredentials: true });
      const data = Array.isArray(res.data) ? res.data : [];
      // Fix: Always build with name & email
      setContacts(data.map(c => ({
        label: `${c.name} (${c.email})`,
        value: c.email,
        name: c.name,
        email: c.email
      })));
    } catch {
      setError('Failed to fetch contacts.');
      setContacts([]);
    } finally {
      setContactsLoading(false);
    }
  };

  // Fetch groups and always normalize members and avatars
  const fetchGroups = async () => {
    try {
      const res = await axios.get('http://localhost:5000/groups', { withCredentials: true });
      let resGroups = Array.isArray(res.data) ? res.data : [];
      resGroups = resGroups.map(g => ({
        ...g,
        avatar: g.avatar ? getAvatarUrl(g.avatar) : null,
        members: fixMembers(g.members),
      }));
      setGroups(resGroups);
      // If no selected group, select first
      if (!selectedGroup && resGroups.length > 0) {
        setSelectedGroup(resGroups[0]);
      } else if (
        selectedGroup &&
        resGroups.find(gr => gr.id === selectedGroup.id)
      ) {
        // Refresh selectedGroup from new list
        setSelectedGroup(resGroups.find(gr => gr.id === selectedGroup.id));
      } else if (resGroups.length === 0) {
        setSelectedGroup(null);
      }
    } catch {
      setGroups([]);
      setSelectedGroup(null);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    setUploadLoading(true);
    const formData = new FormData();
    formData.append('groupAvatar', file);
    try {
      const res = await axios.post('http://localhost:5000/upload-group-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      setAvatarUrl(getAvatarUrl(res.data.avatar));
      setAvatarFile(file);
    } catch { setError('Failed to upload avatar'); }
    finally { setUploadLoading(false); }
  };

  // Delete group
  const handleDeleteGroup = async (group) => {
    if (deleteLoading || !group) return;
    if (!window.confirm(`Delete group "${group.name}"? This cannot be undone.`)) return;
    setDeleteLoading(true);
    setError(null);
    try {
      await axios.delete(`http://localhost:5000/groups/${group.id}`, { withCredentials: true });
      setSuccessMsg(`Group "${group.name}" deleted!`);
      setSelectedGroup(null);
      await fetchGroups();
      setTimeout(() => setSuccessMsg(null), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete group');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e && e.preventDefault();
    if (!groupName || selectedMembers.length === 0) {
      setError('Group name and at least one member required');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      let avatarDbValue = avatarUrl;
      if (avatarUrl && avatarUrl.startsWith("http://localhost:5000")) {
        avatarDbValue = avatarUrl.replace("http://localhost:5000", "");
      }
      const res = await axios.post(
        'http://localhost:5000/groups/create',
        {
          name: groupName,
          members: selectedMembers.map(m => ({ email: m.email, name: m.name })),
          avatar: avatarDbValue,
        },
        { withCredentials: true }
      );
      let newGroup = res.data?.group;
      if (newGroup) {
        // FE friendly props
        newGroup = {
          ...newGroup,
          avatar: getAvatarUrl(newGroup.avatar),
          members: fixMembers(newGroup.members),
        };
      } else {
        newGroup = {
          id: Date.now(),
          name: groupName,
          members: selectedMembers,
          avatar: avatarUrl || avatarPreview,
        }
      }
      setGroupName('');
      setSelectedMembers([]);
      setAvatarFile(null);
      setAvatarUrl(null);
      setAvatarPreview(null);
      setOpen(false);
      setSuccessMsg(`Group "${newGroup.name}" created!`);
      setTimeout(() => setSuccessMsg(null), 3000);
      await fetchGroups();
      setTimeout(() => {
        setGroups(g => {
          const last = g[g.length - 1];
          if (last) setSelectedGroup(last);
          return g;
        });
      }, 300);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create group');
    } finally { setLoading(false); }
  };

  const handleCloseModal = () => {
    setOpen(false);
    setError(null);
    setGroupName('');
    setSelectedMembers([]);
    setAvatarFile(null);
    setAvatarUrl(null);
    setAvatarPreview(null);
  };

  const isDisabled = loading || !isAuthenticated;
  const getInitials = (name = "") => name ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '?';

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{
        display: 'flex',
        height: '100vh',
        height: '100dvh',
        background: C.bg,
        fontFamily: "'Outfit', sans-serif",
        overflow: 'hidden',
        position: 'relative',
      }}>

        {/* Ambient background */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          background: `
            radial-gradient(ellipse 60% 40% at 20% 0%, rgba(56,182,255,0.06) 0%, transparent 70%),
            radial-gradient(ellipse 50% 35% at 80% 100%, rgba(56,182,255,0.04) 0%, transparent 70%)
          `,
        }} />

        {/* Mobile top bar */}
        <div style={{
          display: 'none',
          position: 'fixed', top: 0, left: 0, right: 0,
          height: 60, zIndex: 40,
          background: 'rgba(0,0,0,0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${C.border}`,
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
        }} className="gm-topbar" id="gm-mobile-topbar">
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              background: 'none', border: 'none', color: C.blue,
              cursor: 'pointer', padding: 8, borderRadius: 8,
              display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            <GroupsIcon style={{ fontSize: 22 }} />
            <span style={{ color: C.text, fontSize: 14, fontWeight: 600 }}>
              {selectedGroup ? selectedGroup.name : 'Group Meetings'}
            </span>
          </button>
          <button
            onClick={() => setOpen(true)}
            style={{
              background: C.blue, border: 'none', borderRadius: 8,
              color: '#000', padding: '8px 14px',
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 4,
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            <AddIcon style={{ fontSize: 16 }} /> New
          </button>
        </div>

        {/* Sidebar overlay (mobile) */}
        <div
          className={`gm-sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* ── SIDEBAR ── */}
        <aside
          className={`gm-sidebar ${sidebarOpen ? 'open' : ''}`}
          style={{
            width: 280, minWidth: 280, zIndex: 1,
            background: C.surface,
            borderRight: `1px solid ${C.border}`,
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden', flexShrink: 0,
          }}
        >
          {/* Sidebar header */}
          <div style={{
            padding: '28px 20px 20px',
            borderBottom: `1px solid ${C.border}`,
            position: 'relative',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4,
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: C.blue,
                    boxShadow: `0 0 8px ${C.blue}`,
                    animation: 'pulse 2s infinite',
                  }} />
                  <span style={{
                    color: C.blue, fontSize: 11, fontWeight: 700,
                    letterSpacing: 3, textTransform: 'uppercase',
                  }}>Group Meetings</span>
                </div>
                <span style={{ color: C.textMuted, fontSize: 12 }}>
                  {groups.length} group{groups.length !== 1 ? 's' : ''}
                </span>
              </div>
              {/* Close btn mobile */}
              <button
                onClick={() => setSidebarOpen(false)}
                style={{
                  background: 'none', border: `1px solid ${C.border}`,
                  borderRadius: 8, color: C.textMuted, cursor: 'pointer',
                  width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                className="gm-sidebar-close"
              >
                <CloseIcon style={{ fontSize: 16 }} />
              </button>
            </div>
          </div>

          {/* Create button */}
          <div style={{ padding: '16px 16px 8px' }}>
            <button
              onClick={() => { setOpen(true); setSidebarOpen(false); }}
              disabled={!isAuthenticated}
              data-testid="gm-new-group-btn"
              style={{
                width: '100%', padding: '12px 0',
                background: `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`,
                border: 'none', borderRadius: 12,
                color: '#000', fontSize: 13, fontWeight: 700,
                letterSpacing: 1.5, textTransform: 'uppercase',
                cursor: isAuthenticated ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                fontFamily: "'Outfit', sans-serif",
                boxShadow: `0 4px 20px rgba(56,182,255,0.3)`,
                transition: 'all 0.2s ease',
                opacity: isAuthenticated ? 1 : 0.5,
              }}
              onMouseEnter={e => {
                if (isAuthenticated) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = `0 6px 28px rgba(56,182,255,0.45)`;
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 4px 20px rgba(56,182,255,0.3)`;
              }}
            >
              <AddIcon style={{ fontSize: 18 }} />
              New Group
            </button>
          </div>

          {/* Groups list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 8px' }}>
            {groups.length > 0 ? (
              groups.map((group, i) => {
                const active = selectedGroup?.id === group.id;
                return (
                  <div
                    key={group.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 12px', cursor: 'pointer', borderRadius: 12,
                      background: active ? `rgba(56,182,255,0.1)` : 'transparent',
                      border: active ? `1px solid rgba(56,182,255,0.2)` : '1px solid transparent',
                      marginBottom: 4, transition: 'all 0.18s ease',
                      animation: `fadeSlideIn 0.3s ease ${i * 0.05}s both`,
                    }}
                    onMouseEnter={e => {
                      if (!active) e.currentTarget.style.background = 'rgba(56,182,255,0.05)';
                    }}
                    onMouseLeave={e => {
                      if (!active) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {/* Avatar - always circle */}
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      flexShrink: 0,
                      background: active ? `rgba(56,182,255,0.2)` : C.surfaceHigh,
                      border: `1px solid ${active ? 'rgba(56,182,255,0.4)' : C.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      overflow: 'hidden',
                      fontSize: 14, fontWeight: 700, color: C.blue,
                    }}>
                      {group.avatar ? (
                        <img src={group.avatar} alt={group.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        getInitials(group.name)
                      )}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{
                        color: active ? C.text : C.textSub,
                        fontSize: 14, fontWeight: 600,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>{group.name}</div>
                      <div style={{
                        color: C.textMuted, fontSize: 11,
                        display: 'flex', alignItems: 'center', gap: 4, marginTop: 2,
                      }}>
                        <PersonIcon style={{ fontSize: 11 }} />
                        {group.members && group.members.length > 0
                          ? `${group.members.length} member${group.members.length !== 1 ? 's' : ''}`
                          : '0 members'
                        }
                      </div>
                    </div>
                    {/* Delete button for group */}
                    <Tooltip title="Delete group" arrow placement="top">
                      <span>
                        <IconButton
                          onClick={e => {
                            e.stopPropagation();
                            handleDeleteGroup(group);
                          }}
                          size="small"
                          style={{
                            color: C.red,
                            opacity: 0.85,
                            marginLeft: 8,
                            background: 'rgba(255,71,87,0.05)'
                          }}
                          disabled={deleteLoading}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                    {/* Active indicator */}
                    {active && (
                      <div style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: C.blue, flexShrink: 0,
                        boxShadow: `0 0 8px ${C.blue}`,
                      }} />
                    )}
                    {/* Main clickable action for group selection */}
                    <div onClick={() => { setSelectedGroup(group); setSidebarOpen(false); }} style={{ position: 'absolute', inset: 0, zIndex: 1, cursor: "pointer", background: "transparent" }} tabIndex={-1} />
                  </div>
                );
              })
            ) : (
              <div style={{
                padding: '32px 16px', textAlign: 'center',
                color: C.textMuted, fontSize: 12,
                letterSpacing: 1, textTransform: 'uppercase',
              }}>
                <GroupsIcon style={{ fontSize: 32, display: 'block', margin: '0 auto 10px', opacity: 0.3 }} />
                No groups yet
              </div>
            )}
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', zIndex: 1, position: 'relative',
          padding: '80px 20px 20px',
          minWidth: 0,
        }}>

          {/* Success toast */}
          {successMsg && (
            <div style={{
              position: 'fixed', top: 20, right: 20, zIndex: 9998,
              background: `rgba(46,213,115,0.1)`, border: `1px solid ${C.success}`,
              borderRadius: 12, padding: '12px 18px',
              color: C.success, fontSize: 13, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 8,
              backdropFilter: 'blur(10px)',
              animation: 'fadeSlideIn 0.3s ease',
              boxShadow: `0 4px 20px rgba(46,213,115,0.2)`,
            }}>
              <CheckCircleIcon style={{ fontSize: 18 }} />
              {successMsg}
            </div>
          )}

          {selectedGroup ? (
            <div style={{
              textAlign: 'center', zIndex: 1,
              animation: 'fadeSlideIn 0.4s ease',
              width: '100%', maxWidth: 480, padding: '0 16px',
              position: 'relative',
            }}>
              {/* Group avatar display - always rounded circle */}
              <div style={{
                width: 100, height: 100, borderRadius: '50%',
                background: `rgba(56,182,255,0.1)`,
                border: `2px solid rgba(56,182,255,0.3)`,
                margin: '0 auto 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
                boxShadow: `0 0 40px rgba(56,182,255,0.15)`,
                animation: 'popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                fontSize: 32, fontWeight: 800, color: C.blue,
              }}>
                {selectedGroup.avatar ? (
                  <img
                    src={selectedGroup.avatar}
                    alt={selectedGroup.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                  />
                ) : (
                  getInitials(selectedGroup.name)
                )}
              </div>

              <h2 style={{
                color: C.text, fontSize: 'clamp(20px, 5vw, 28px)',
                fontWeight: 800, letterSpacing: -0.5, margin: '0 0 6px',
              }}>
                {selectedGroup.name}
              </h2>

              <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 28 }}>
                {selectedGroup.members && selectedGroup.members.length > 0
                  ? `${selectedGroup.members.length} member${selectedGroup.members.length !== 1 ? 's' : ''}`
                  : '0 members'}
              </p>

              {/* Members preview - always show latest members */}
              <div style={{
                background: C.surfaceHigh,
                border: `1px solid ${C.border}`,
                borderRadius: 16, padding: '16px', marginBottom: 24,
                textAlign: 'left',
              }}>
                <p style={{ color: C.textMuted, fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
                  Members
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {(selectedGroup.members && selectedGroup.members.length > 0)
                    ? (selectedGroup.members.slice(0, 8).map((m, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: `rgba(56,182,255,0.1)`,
                          border: `1px solid rgba(56,182,255,0.2)`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: C.blue, fontSize: 11, fontWeight: 700,
                        }}>
                          {getInitials(m.name || m.email || '?')}
                        </div>
                        <span style={{ color: C.textSub, fontSize: 13 }}>
                          {m.name}
                        </span>
                        <span style={{ color: C.textMuted, fontSize: 11 }}>
                          {m.email}
                        </span>
                      </div>
                    ))) : (
                      <span style={{ color: C.textMuted, fontSize: 12 }}>
                        No members in group.
                      </span>
                    )}
                  {selectedGroup.members && selectedGroup.members.length > 8 && (
                    <span style={{ color: C.textMuted, fontSize: 12, paddingLeft: 42 }}>
                      +{selectedGroup.members.length - 8} more
                    </span>
                  )}
                </div>
              </div>

              <button
                data-testid="gm-start-meeting"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  width: '100%', padding: '16px',
                  background: `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`,
                  border: 'none', borderRadius: 14,
                  color: '#000', fontSize: 14, fontWeight: 700,
                  letterSpacing: 1, textTransform: 'uppercase',
                  cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
                  boxShadow: `0 8px 32px rgba(56,182,255,0.35)`,
                  transition: 'all 0.2s ease',
                  animation: 'glow 3s ease infinite',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 12px 40px rgba(56,182,255,0.5)`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 8px 32px rgba(56,182,255,0.35)`;
                }}
              >
                <VideoCallIcon style={{ fontSize: 22 }} />
                Start Meeting
              </button>
              {/* Delete Group button on main view */}
              <div style={{ marginTop: 24 }}>
                <button
                  type="button"
                  disabled={deleteLoading}
                  onClick={() => handleDeleteGroup(selectedGroup)}
                  style={{
                    background: 'none',
                    border: `1px solid ${C.red}`,
                    color: C.red,
                    outline: 'none',
                    borderRadius: 8,
                    padding: '10px 18px',
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    cursor: deleteLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                  }}
                >
                  <DeleteIcon fontSize="small" /> Delete Group
                </button>
              </div>
              {error && (
                <p style={{ color: C.red, fontSize: 13, marginTop: 18, marginBottom: 6 }}>{error}</p>
              )}
            </div>
          ) : (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
              zIndex: 1, animation: 'fadeSlideIn 0.5s ease', textAlign: 'center',
              padding: '0 20px',
            }}>
              <div style={{
                width: 96, height: 96, borderRadius: 24,
                border: `1px solid ${C.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: C.blueFaint,
                boxShadow: `0 0 60px rgba(56,182,255,0.06)`,
              }}>
                <GroupsIcon style={{ fontSize: 44, color: 'rgba(56,182,255,0.3)' }} />
              </div>
              <p style={{ color: C.textMuted, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase' }}>
                Select a group to begin
              </p>
              {/* Mobile: create group CTA */}
              <button
                onClick={() => setOpen(true)}
                style={{
                  background: 'none',
                  border: `1px dashed rgba(56,182,255,0.3)`,
                  borderRadius: 12, color: C.blue,
                  padding: '10px 20px', cursor: 'pointer',
                  fontSize: 13, fontFamily: "'Outfit', sans-serif",
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
                className="gm-empty-cta"
              >
                <AddIcon style={{ fontSize: 16 }} />
                Create your first group
              </button>
              {error && (
                <p style={{ color: C.red, fontSize: 13, marginTop: 4 }}>{error}</p>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ── MODAL ── */}
      {open && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            animation: 'overlayIn 0.2s ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          className="gm-modal-overlay"
          onClick={e => e.target === e.currentTarget && handleCloseModal()}
        >
          <div
            className="gm-modal"
            style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 440, maxWidth: '92vw',
              background: `linear-gradient(145deg, #0a0a0a, #050505)`,
              border: `1px solid rgba(56,182,255,0.2)`,
              borderRadius: 20,
              padding: '28px 28px 24px',
              boxShadow: `0 0 80px rgba(56,182,255,0.08), 0 24px 64px rgba(0,0,0,0.7)`,
              animation: 'modalIn 0.25s ease',
            }}
          >
            {/* Modal header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <p style={{ color: C.blue, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 2 }}>
                  Create Group
                </p>
                <p style={{ color: C.textMuted, fontSize: 12 }}>Set up a new meeting group</p>
              </div>
              <button
                onClick={handleCloseModal}
                style={{
                  width: 34, height: 34, borderRadius: 10,
                  border: `1px solid ${C.border}`,
                  background: 'transparent', color: C.textMuted,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.18s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.color = C.blue; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; }}
              >
                <CloseIcon style={{ fontSize: 16 }} />
              </button>
            </div>

            <div style={{ height: 1, background: C.border, marginBottom: 20 }} />

            {!isAuthenticated ? (
              <p style={{ color: C.red, fontSize: 13 }}>Please log in to create a group.</p>
            ) : (
              <form onSubmit={handleCreateGroup}>
                {/* Group name */}
                <div style={{ marginBottom: 14 }}>
                  <TextField
                    label="Group Name"
                    variant="outlined"
                    fullWidth
                    value={groupName}
                    inputProps={{ 'data-testid': 'gm-group-name' }}
                    onChange={e => setGroupName(e.target.value)}
                    className="gm-textfield"
                    size="small"
                    autoFocus
                  />
                </div>

                {/* Members autocomplete */}
                <div style={{ marginBottom: 14 }}>
                  <Autocomplete
                    key={autocompleteKey}
                    multiple
                    open
                    options={contacts}
                    getOptionLabel={(o) => o.label || ''}
                    value={selectedMembers}
                    openOnFocus
                    disableCloseOnSelect
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    filterSelectedOptions
                    loading={contactsLoading}
                    onOpen={() => {
                      if (!contactsLoading && isAuthenticated) fetchContacts();
                    }}
                    onChange={(event, value) => setSelectedMembers(value)}
                    renderOption={(props, option, { selected }) => (
                      <li {...props} key={option.value}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
                          <div style={{
                            width: 30, height: 30, borderRadius: '50%',
                            background: selected ? `rgba(56,182,255,0.2)` : `rgba(56,182,255,0.08)`,
                            border: `1px solid rgba(56,182,255,0.2)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: C.blue, fontSize: 10, fontWeight: 700, flexShrink: 0,
                          }}>
                            {getInitials(option.name || option.label)}
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{option.name}</div>
                            <div style={{ fontSize: 11, color: C.textMuted }}>{option.value}</div>
                          </div>
                          {selected && (
                            <CheckCircleIcon style={{ marginLeft: 'auto', color: C.blue, fontSize: 16 }} />
                          )}
                        </div>
                      </li>
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          key={option.value}
                          label={option.name || option.value}
                          size="small"
                          {...getTagProps({ index })}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Members"
                        variant="outlined"
                        placeholder={contactsLoading
                          ? 'Loading...'
                          : (contacts.length > 0 ? 'Type to search...' : 'No contacts found')}
                        className="gm-textfield"
                        size="small"
                        fullWidth
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {contactsLoading ? (
                                <div style={{
                                  width: 14, height: 14, borderRadius: '50%',
                                  border: `2px solid rgba(56,182,255,0.2)`,
                                  borderTopColor: C.blue,
                                  animation: 'spin 0.7s linear infinite',
                                  marginRight: 4,
                                }} />
                              ) : null}
                              {params.InputProps.endAdornment}
                              {contacts.length > 0 && selectedMembers.length < contacts.length && !contactsLoading && (
                                <button
                                  type="button"
                                  style={{
                                    marginLeft: 4, padding: '2px 8px',
                                    fontSize: 11, borderRadius: 6,
                                    border: `1px solid rgba(56,182,255,0.4)`,
                                    background: 'rgba(56,182,255,0.08)',
                                    color: C.blue, cursor: 'pointer',
                                    fontFamily: "'Outfit', sans-serif",
                                    fontWeight: 600, whiteSpace: 'nowrap',
                                  }}
                                  onMouseDown={e => e.preventDefault()}
                                  onClick={e => { e.stopPropagation(); setSelectedMembers(contacts); }}
                                  data-testid="apply-all-members"
                                >
                                  All
                                </button>
                              )}
                            </>
                          ),
                        }}
                      />
                    )}
                    noOptionsText={contactsLoading ? 'Loading contacts...' : 'No contacts available'}
                    className="gm-textfield"
                    loadingText="Loading contacts..."
                  />
                </div>

                {/* Avatar upload */}
                <div
                  style={{
                    marginBottom: 16,
                    border: `1px dashed ${avatarPreview ? C.blue : 'rgba(56,182,255,0.2)'}`,
                    borderRadius: 14,
                    padding: '14px',
                    display: 'flex', alignItems: 'center', gap: 14,
                    background: avatarPreview ? 'rgba(56,182,255,0.05)' : 'transparent',
                    cursor: 'pointer', transition: 'all 0.2s ease',
                    position: 'relative', overflow: 'hidden',
                  }}
                  onMouseEnter={e => {
                    if (!avatarPreview) e.currentTarget.style.borderColor = 'rgba(56,182,255,0.4)';
                  }}
                  onMouseLeave={e => {
                    if (!avatarPreview) e.currentTarget.style.borderColor = 'rgba(56,182,255,0.2)';
                  }}
                >
                  <input
                    type="file" accept="image/jpeg,image/png"
                    onChange={handleAvatarChange}
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%' }}
                    data-testid="gm-group-avatar"
                  />
                  {/* Preview or icon */}
                  <div style={{
                    width: 50, height: 50, borderRadius: '50%', flexShrink: 0,
                    border: `1px solid rgba(56,182,255,0.25)`,
                    overflow: 'hidden',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(56,182,255,0.07)',
                    color: 'rgba(56,182,255,0.5)',
                  }}>
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                    ) : uploadLoading ? (
                      <div style={{
                        width: 18, height: 18, borderRadius: '50%',
                        border: `2px solid rgba(56,182,255,0.2)`,
                        borderTopColor: C.blue,
                        animation: 'spin 0.7s linear infinite',
                      }} />
                    ) : (
                      <CloudUploadIcon style={{ fontSize: 22 }} />
                    )}
                  </div>
                  <div>
                    <div style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>
                      {avatarPreview ? 'Avatar selected' : 'Upload Group Avatar'}
                    </div>
                    <div style={{ color: C.textMuted, fontSize: 11, marginTop: 2 }}>
                      {avatarPreview ? (avatarFile?.name || 'Selected') : 'JPG or PNG · optional'}
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isDisabled}
                  data-testid="gm-create-group-btn"
                  style={{
                    width: '100%', padding: '14px 0', marginTop: 2,
                    background: isDisabled ? 'rgba(56,182,255,0.08)' : `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`,
                    border: 'none', borderRadius: 12,
                    color: isDisabled ? C.textMuted : '#000',
                    fontSize: 13, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase',
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    boxShadow: isDisabled ? 'none' : `0 4px 24px rgba(56,182,255,0.35)`,
                    transition: 'all 0.2s ease',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    fontFamily: "'Outfit', sans-serif",
                  }}
                  onMouseEnter={e => { if (!isDisabled) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {loading ? (
                    <>
                      <div style={{
                        width: 16, height: 16, borderRadius: '50%',
                        border: `2px solid rgba(0,0,0,0.2)`,
                        borderTopColor: '#000',
                        animation: 'spin 0.7s linear infinite',
                      }} />
                      Creating…
                    </>
                  ) : 'Create Group'}
                </button>

                {error && (
                  <p style={{ color: C.red, fontSize: 12, marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                    ⚠ {error}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      )}

      {/* Responsive tweaks via inline style tag */}
      <style>{`
        @media (max-width: 768px) {
          #gm-mobile-topbar { display: flex !important; }
          .gm-sidebar-close { display: flex !important; }
          .gm-empty-cta { display: flex !important; }
        }
        @media (min-width: 769px) {
          .gm-sidebar-close { display: none !important; }
          .gm-empty-cta { display: flex !important; }
          #gm-mobile-topbar { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default GroupMeeting;