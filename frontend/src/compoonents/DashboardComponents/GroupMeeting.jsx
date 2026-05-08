import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  TextField,
  Autocomplete,
} from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import VideoCallIcon from '@mui/icons-material/VideoCall';

/* ─── keyframes, style tokens, and styles as before ─── */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  @keyframes pulse {0%{box-shadow:0 0 0 0 rgba(0,230,200,0.4);}70%{box-shadow:0 0 0 18px rgba(0,230,200,0);}100%{box-shadow:0 0 0 0 rgba(0,230,200,0);}}
  @keyframes fadeSlideIn {from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
  @keyframes overlayIn {from{opacity:0;}to{opacity:1;}}
  @keyframes modalIn {from{opacity:0;transform:translate(-50%,-46%) scale(0.96);}to{opacity:1;transform:translate(-50%,-50%) scale(1);}}
  @keyframes spin {to{transform:rotate(360deg);}}
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(0,230,200,0.25); border-radius: 4px; }
  .gm-textfield .MuiOutlinedInput-root { color: #c8f0ec !important; font-family: 'Rajdhani', monospace !important; font-size: 14px !important; }
  .gm-textfield .MuiOutlinedInput-notchedOutline { border-color: rgba(0,230,200,0.2) !important; }
  .gm-textfield .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline { border-color: rgba(0,230,200,0.5) !important; }
  .gm-textfield .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline { border-color: #00e6c8 !important; box-shadow: 0 0 0 2px rgba(0,230,200,0.12);}
  .gm-textfield .MuiInputLabel-root { color: rgba(0,230,200,0.45) !important; font-family: 'Rajdhani', monospace !important; font-size: 13px !important; letter-spacing: 0.5px !important; }
  .gm-textfield .MuiInputLabel-root.Mui-focused { color: #00e6c8 !important; }
  .gm-textfield .MuiChip-root { background: rgba(0,230,200,0.15) !important; color: #00e6c8 !important; border: 1px solid rgba(0,230,200,0.3) !important; font-family: 'Rajdhani', monospace !important; font-size: 12px !important; }
  .gm-textfield .MuiChip-deleteIcon { color: rgba(0,230,200,0.6) !important; }
  .gm-textfield .MuiAutocomplete-popupIndicator { color: rgba(0,230,200,0.5) !important; }
  .gm-textfield input::placeholder { color: rgba(0,230,200,0.3) !important; }
  .MuiAutocomplete-paper {background: #061a20 !important; border: 1px solid rgba(0,230,200,0.2) !important; color: #c8f0ec !important; font-family: 'Rajdhani', monospace !important;}
  .MuiAutocomplete-option {font-family: 'Rajdhani', monospace !important; font-size: 13px !important; color: #c8f0ec !important;}
  .MuiAutocomplete-option:hover,.MuiAutocomplete-option.Mui-focused {background: rgba(0,230,200,0.1) !important;}
  .MuiAutocomplete-noOptions {color: rgba(0,230,200,0.4) !important; font-family: 'Rajdhani', monospace !important;}
`;

const C = {
  bg: '#050d12',
  sidebar: '#061218',
  border: 'rgba(0,230,200,0.13)',
  cyan: '#00e6c8',
  cyanDim: 'rgba(0,230,200,0.4)',
  cyanFaint: 'rgba(0,230,200,0.07)',
  text: '#c8f0ec',
  textMuted: 'rgba(0,230,200,0.4)',
  red: '#e63c4a',
};
const S = {
  root: {
    display: 'flex',
    height: '100vh',
    background: C.bg,
    fontFamily: "'Rajdhani', monospace",
    overflow: 'hidden',
    position: 'relative',
  },
  gridBg: {
    position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
    backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`,
    backgroundSize: '40px 40px',
  },
  glowOrb: (top, left) => ({
    position: 'absolute', width: 500, height: 500, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0,230,200,0.05) 0%, transparent 70%)',
    pointerEvents: 'none', zIndex: 0, top, left,
  }),
  sidebar: {
    width: 290, minWidth: 290, zIndex: 1,
    background: `linear-gradient(180deg, ${C.sidebar} 0%, #040c10 100%)`,
    borderRight: `1px solid ${C.border}`,
    display: 'flex', flexDirection: 'column', overflow: 'hidden',
  },
  sidebarHead: {
    padding: '24px 20px 16px',
    borderBottom: `1px solid ${C.border}`,
  },
  sidebarLabel: {
    color: C.cyan, fontSize: 10, fontWeight: 700,
    letterSpacing: 3, textTransform: 'uppercase', margin: 0,
  },
  sidebarSub: {
    color: C.textMuted, fontSize: 10, letterSpacing: 2, marginTop: 4,
  },
  createBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    margin: '16px', padding: '11px 0',
    background: `linear-gradient(135deg, ${C.cyan}, #009980)`,
    border: 'none', borderRadius: 10, cursor: 'pointer',
    color: '#050d12', fontSize: 12, fontWeight: 700,
    letterSpacing: 2, textTransform: 'uppercase',
    boxShadow: '0 0 20px rgba(0,230,200,0.25)',
    transition: 'all 0.2s ease',
    fontFamily: "'Rajdhani', monospace",
  },
  groupList: {
    flex: 1, overflowY: 'auto', padding: '4px 0',
  },
  groupItem: (active) => ({
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '10px 20px', cursor: 'pointer',
    borderLeft: active ? `2px solid ${C.cyan}` : '2px solid transparent',
    background: active
      ? `linear-gradient(90deg, rgba(0,230,200,0.1) 0%, transparent 100%)`
      : 'transparent',
    transition: 'all 0.18s ease',
    animation: 'fadeSlideIn 0.3s ease both',
  }),
  groupAvatar: {
    width: 42, height: 42,
    background: `linear-gradient(135deg, #0d2a30, #0a1f24)`,
    border: `1px solid rgba(0,230,200,0.2)`,
    color: C.cyan, fontSize: 16, fontWeight: 700,
    flexShrink: 0, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },
  groupName: {
    color: C.text, fontSize: 14, fontWeight: 600, letterSpacing: 0.4,
  },
  groupMeta: {
    color: C.textMuted, fontSize: 11, letterSpacing: 0.3,
    display: 'flex', alignItems: 'center', gap: 4, marginTop: 1,
  },
  emptyGroups: {
    padding: '24px 20px', color: C.textMuted,
    fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', textAlign: 'center',
  },
  main: {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexDirection: 'column', gap: 20, zIndex: 1, position: 'relative',
  },
  emptyMain: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
  },
  emptyIcon: {
    width: 100, height: 100, borderRadius: '50%',
    border: `1px solid rgba(0,230,200,0.2)`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(0,230,200,0.04)',
    boxShadow: '0 0 40px rgba(0,230,200,0.05)',
  },
  emptyText: {
    color: C.textMuted, fontSize: 12, letterSpacing: 2,
    textTransform: 'uppercase', margin: 0,
  },
  overlay: {
    position: 'fixed', inset: 0, zIndex: 9999,
    background: 'rgba(0,0,0,0.75)',
    backdropFilter: 'blur(6px)',
    animation: 'overlayIn 0.2s ease',
  },
  modal: {
    position: 'absolute', top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 440,
    background: 'linear-gradient(145deg, #061a20, #040e12)',
    border: `1px solid rgba(0,230,200,0.22)`,
    borderRadius: 20,
    padding: '32px 32px 28px',
    boxShadow: '0 0 60px rgba(0,230,200,0.08), 0 20px 60px rgba(0,0,0,0.6)',
    animation: 'modalIn 0.25s ease',
  },
  modalHead: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 24,
  },
  modalTitle: {
    color: C.cyan, fontSize: 13, fontWeight: 700,
    letterSpacing: 3, textTransform: 'uppercase', margin: 0,
  },
  closeBtn: {
    width: 32, height: 32, borderRadius: '50%',
    border: `1px solid ${C.border}`,
    background: 'transparent', color: C.textMuted,
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.18s ease',
  },
  divider: {
    height: 1, background: C.border, marginBottom: 20,
  },
  fieldGap: { marginBottom: 16 },
  uploadArea: (hasAvatar) => ({
    marginBottom: 16,
    border: `1px dashed ${hasAvatar ? C.cyan : 'rgba(0,230,200,0.2)'}`,
    borderRadius: 12,
    padding: '16px',
    display: 'flex', alignItems: 'center', gap: 14,
    background: hasAvatar ? 'rgba(0,230,200,0.05)' : 'transparent',
    cursor: 'pointer', transition: 'all 0.2s ease', position: 'relative',
    overflow: 'hidden',
  }),
  uploadInput: {
    position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%',
  },
  uploadPreview: {
    width: 52, height: 52, borderRadius: '50%',
    border: `1px solid rgba(0,230,200,0.35)`,
    objectFit: 'cover', flexShrink: 0,
  },
  uploadIconBox: {
    width: 52, height: 52, borderRadius: '50%',
    background: 'rgba(0,230,200,0.08)',
    border: `1px solid rgba(0,230,200,0.18)`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, color: C.cyanDim,
  },
  uploadLabel: { color: C.text, fontSize: 13, fontWeight: 600, letterSpacing: 0.4 },
  uploadSub: { color: C.textMuted, fontSize: 11, marginTop: 2, letterSpacing: 0.5 },
  submitBtn: (disabled) => ({
    width: '100%', padding: '13px 0', marginTop: 4,
    background: disabled
      ? 'rgba(0,230,200,0.08)'
      : `linear-gradient(135deg, ${C.cyan}, #009980)`,
    border: 'none', borderRadius: 10,
    color: disabled ? C.textMuted : '#050d12',
    fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase',
    cursor: disabled ? 'not-allowed' : 'pointer',
    boxShadow: disabled ? 'none' : '0 0 20px rgba(0,230,200,0.3)',
    transition: 'all 0.2s ease',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    fontFamily: "'Rajdhani', monospace",
  }),
  errorMsg: {
    color: C.red, fontSize: 11, letterSpacing: 0.5,
    marginTop: 10, display: 'flex', alignItems: 'center', gap: 6,
  },
  spinner: {
    width: 18, height: 18, borderRadius: '50%',
    border: `2px solid rgba(0,230,200,0.2)`,
    borderTopColor: C.cyan,
    animation: 'spin 0.7s linear infinite',
    display: 'inline-block',
  },
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

  // Forcing Autocomplete to rerender options when contacts change
  // const autocompleteKey = useRef(0);
  const [autocompleteKey, setAutocompleteKey] = useState(0);

  // so that open/focus on member autocomplete will always trigger refetch
  const autocompleteRef = useRef();

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line
  }, []);

  // Fetch groups only once after authentication
  useEffect(() => {
    if (isAuthenticated) {
      fetchGroups();
    }
    // eslint-disable-next-line
  }, [isAuthenticated]);

  // Only fetch contacts right when modal is opened (so contacts always fresh)
  useEffect(() => {
    if (open && isAuthenticated) {
      fetchContacts();
    }
    // eslint-disable-next-line
  }, [open, isAuthenticated]);

  // Whenever contacts are updated, bump key to force autocomplete to show new options
  useEffect(() => {
    setAutocompleteKey(prev => prev + 1);
  }, [contacts]);

  // When opening the Autocomplete dropdown, always fetch contacts just-in-time
  const handleMembersDropdownOpen = () => {
    if (!contactsLoading && isAuthenticated) {
      fetchContacts();
    }
  };

  const checkAuth = async () => {
    try {
      const res = await axios.get('http://localhost:5000/me', { withCredentials: true });
      if (res.data.loggedIn) {
        setIsAuthenticated(true);
      } else {
        setError('Please log in to create groups');
      }
    } catch (err) {
      setError('Authentication error. Please log in.');
    }
  };

  const fetchContacts = async () => {
    try {
      setContactsLoading(true);

      const res = await axios.get(
        'http://localhost:5000/contacts',
        { withCredentials: true }
      );

      console.log("CONTACT API RESPONSE:", res.data);

      const data = Array.isArray(res.data) ? res.data : [];

      setContacts(
        data.map(c => ({
          label: `${c.name} (${c.email})`,
          value: c.email,
          name: c.name,
        }))
      );

      console.log("FORMATTED CONTACTS:", data);

      if (open && data.length === 0) {
        setError('No contacts found.');
      }

    } catch (err) {
      console.log(err);

      setError('Failed to fetch contacts.');
      setContacts([]);
    } finally {
      setContactsLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      const res = await axios.get('http://localhost:5000/groups', { withCredentials: true });
      setGroups(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError('Failed to fetch groups');
      setGroups([]);
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
      setAvatarUrl(res.data.avatar);
      setAvatarFile(file);
    } catch {
      setError('Failed to upload avatar');
    } finally {
      setUploadLoading(false);
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
      await axios.post(
        'http://localhost:5000/groups/create',
        {
          name: groupName,
          members: selectedMembers.map(m => ({ email: m.value, name: m.name })),
          avatar: avatarUrl,
        },
        { withCredentials: true }
      );
      setGroupName('');
      setSelectedMembers([]);
      setAvatarFile(null);
      setAvatarUrl(null);
      setAvatarPreview(null);
      setOpen(false);
      // After group created, refetch and auto-select the latest group if avatar is present
      await fetchGroups();
      setTimeout(() => {
        setGroups(currentGroups => {
          if (currentGroups.length === 0) return currentGroups;
          const lastGroup = currentGroups[currentGroups.length - 1];
          setSelectedGroup(lastGroup);
          return currentGroups;
        });
      }, 250);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to create group'
      );
    } finally {
      setLoading(false);
    }
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

  const isDisabled = loading || contactsLoading || !isAuthenticated;

  return (
    <>
      <style>{globalStyles}</style>
      <div style={S.root}>
        <div style={S.gridBg} />
        <div style={S.glowOrb('-10%', '-5%')} />
        <div style={S.glowOrb('40%', '30%')} />

        {/* ── SIDEBAR ── */}
        <aside style={S.sidebar}>
          <div style={S.sidebarHead}>
            <p style={S.sidebarLabel}>Group Meetings</p>
            <p style={S.sidebarSub}>
              {groups.length} group{groups.length !== 1 ? 's' : ''}
            </p>
          </div>

          <button
            style={S.createBtn}
            onClick={() => setOpen(true)}
            disabled={!isAuthenticated}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 0 32px rgba(0,230,200,0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0,230,200,0.25)';
            }}
            data-testid="gm-new-group-btn"
          >
            <AddIcon style={{ fontSize: 16 }} />
            New Group
          </button>

          <div style={S.groupList}>
            {groups.length > 0 ? (
              groups.map(group => (
                <div
                  key={group.id}
                  style={S.groupItem(selectedGroup?.id === group.id)}
                  onClick={() => setSelectedGroup(group)}
                  onMouseEnter={e => {
                    if (selectedGroup?.id !== group.id)
                      e.currentTarget.style.background = 'rgba(0,230,200,0.04)';
                  }}
                  onMouseLeave={e => {
                    if (selectedGroup?.id !== group.id)
                      e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div style={S.groupAvatar}>
                    {group.avatar ? (
                      <img
                        src={group.avatar}
                        alt={group.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <GroupsIcon
                        style={{ fontSize: 20, color: 'rgba(0,230,200,0.6)' }}
                      />
                    )}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={S.groupName}>{group.name}</div>
                    <div style={S.groupMeta}>
                      <PersonIcon style={{ fontSize: 11 }} />
                      {group.members.length} member
                      {group.members.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={S.emptyGroups}>No groups yet</div>
            )}
          </div>
        </aside>

        {/* ── MAIN AREA ── */}
        <main style={S.main}>
          {selectedGroup ? (
            <div style={{ zIndex: 1, textAlign: 'center' }}>
              <div
                style={{
                  ...S.groupAvatar,
                  width: 90,
                  height: 90,
                  margin: '0 auto 16px',
                  fontSize: 36,
                }}
              >
                {selectedGroup.avatar ? (
                  <img
                    src={selectedGroup.avatar}
                    alt="Group avatar"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <GroupsIcon
                    style={{ fontSize: 40, color: 'rgba(0,230,200,0.6)' }}
                  />
                )}
              </div>
              <p
                style={{
                  color: '#c8f0ec',
                  fontSize: 20,
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  margin: 0,
                }}
              >
                {selectedGroup.name}
              </p>
              <p
                style={{
                  color: 'rgba(0,230,200,0.4)',
                  fontSize: 11,
                  letterSpacing: 2,
                  margin: '6px 0 24px',
                }}
              >
                {selectedGroup.members.length} members
              </p>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '13px 32px',
                  margin: '0 auto',
                  background: 'linear-gradient(135deg, #00e6c8, #009980)',
                  border: 'none',
                  borderRadius: 40,
                  color: '#050d12',
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  fontFamily: "'Rajdhani', monospace",
                  boxShadow: '0 0 24px rgba(0,230,200,0.35)',
                }}
                data-testid="gm-start-meeting"
              >
                <VideoCallIcon style={{ fontSize: 20 }} />
                Start Meeting
              </button>
            </div>
          ) : (
            <div style={{ ...S.emptyMain, zIndex: 1 }}>
              <div style={S.emptyIcon}>
                <GroupsIcon
                  style={{ fontSize: 44, color: 'rgba(0,230,200,0.3)' }}
                />
              </div>
              <p style={S.emptyText}>Select a group to begin</p>
            </div>
          )}
        </main>
      </div>

      {/* ── MODAL ── */}
      {open && (
        <div
          style={S.overlay}
          onClick={e => e.target === e.currentTarget && handleCloseModal()}
        >
          <div style={S.modal}>
            {/* header */}
            <div style={S.modalHead}>
              <p style={S.modalTitle}>Create New Group</p>
              <button
                style={S.closeBtn}
                onClick={handleCloseModal}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(0,230,200,0.4)';
                  e.currentTarget.style.color = '#00e6c8';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(0,230,200,0.13)';
                  e.currentTarget.style.color = 'rgba(0,230,200,0.4)';
                }}
              >
                <CloseIcon style={{ fontSize: 16 }} />
              </button>
            </div>
            <div style={S.divider} />

            {contactsLoading || loading ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '32px 0',
                }}
              >
                <div style={S.spinner} />
              </div>
            ) : !isAuthenticated ? (
              <p
                style={{
                  color: '#e63c4a',
                  fontSize: 13,
                  letterSpacing: 0.5,
                }}
              >
                Please log in to create a group.
              </p>
            ) : (
              <form onSubmit={handleCreateGroup}>
                {/* group name */}
                <div style={S.fieldGap}>
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

                {/* members autocomplete */}
                <div style={S.fieldGap}>
                <Autocomplete
  multiple
  options={contacts}
  getOptionLabel={(o) => o.label}
  value={selectedMembers}
  openOnFocus
  disableCloseOnSelect
  isOptionEqualToValue={(option, value) =>
    option.value === value.value
  }
  onOpen={handleMembersDropdownOpen}
  filterSelectedOptions
  onChange={(event, value) => setSelectedMembers(value)}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Select Members"
      variant="outlined"
      placeholder={
        contacts.length > 0
          ? 'Type to search...'
          : 'No contacts'
      }
      className="gm-textfield"
      size="small"
      fullWidth
      InputProps={{
        ...params.InputProps,
        endAdornment: (
          <>
            {params.InputProps.endAdornment}

            <button
              type="button"
              style={{
                marginLeft: 6,
                padding: '2px 8px',
                fontSize: 12,
                borderRadius: 4,
                border: '1px solid #16d9e0',
                background: 'rgba(22,217,224,0.07)',
                color: '#16d9e0',
                cursor: 'pointer',
                display:
                  contacts.length > 0 &&
                  selectedMembers.length < contacts.length &&
                  !contactsLoading
                    ? 'inline-block'
                    : 'none',
              }}
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedMembers(contacts);
              }}
              data-testid="apply-all-members"
            >
              Apply All
            </button>
          </>
        ),
      }}
    />
  )}
  noOptionsText={
    contactsLoading
      ? 'Loading contacts...'
      : 'No contacts available'
  }
  className="gm-textfield"
  loading={contactsLoading}
/>
             
                </div>

                {/* avatar upload */}
                <div
                  style={S.uploadArea(!!avatarPreview)}
                  onMouseEnter={e => {
                    if (!avatarPreview)
                      e.currentTarget.style.borderColor =
                        'rgba(0,230,200,0.4)';
                  }}
                  onMouseLeave={e => {
                    if (!avatarPreview)
                      e.currentTarget.style.borderColor =
                        'rgba(0,230,200,0.2)';
                  }}
                >
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleAvatarChange}
                    style={S.uploadInput}
                    data-testid="gm-group-avatar"
                  />
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="preview"
                      style={S.uploadPreview}
                    />
                  ) : (
                    <div style={S.uploadIconBox}>
                      {uploadLoading ? (
                        <div style={S.spinner} />
                      ) : (
                        <CloudUploadIcon style={{ fontSize: 22 }} />
                      )}
                    </div>
                  )}
                  <div>
                    <div style={S.uploadLabel}>
                      {avatarPreview ? 'Avatar selected' : 'Upload Group Avatar'}
                    </div>
                    <div style={S.uploadSub}>
                      {avatarPreview
                        ? avatarFile?.name
                        : 'JPG or PNG · Click to browse'}
                    </div>
                  </div>
                </div>

                {/* submit */}
                <button
                  style={S.submitBtn(isDisabled)}
                  type="submit"
                  disabled={isDisabled}
                  onMouseEnter={e => {
                    if (!isDisabled)
                      e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  data-testid="gm-create-group-btn"
                >
                  {loading ? (
                    <>
                      <div style={S.spinner} /> Creating…
                    </>
                  ) : (
                    'Create Group'
                  )}
                </button>

                {error && (
                  <p style={S.errorMsg}>⚠ {error}</p>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default GroupMeeting;