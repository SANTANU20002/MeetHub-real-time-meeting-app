import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import '../../index.css';

/* ─── Dark Cyan MUI Theme ─────────────────────────────────────── */
const darkCyanTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#38b6ff' },
    background: { default: '#060D14', paper: '#0D1B2A' },
    text: { primary: '#E0F7FA', secondary: '#80DEEA' },
  },
  typography: {
    fontFamily: '"Rajdhani", "Share Tech Mono", monospace',
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    }
  }
});

const GlassCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(13, 27, 42, 0.75)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(0, 229, 255, 0.15)',
  borderRadius: '16px',
  padding: '24px',
  color: '#E0F7FA',
  position: 'relative',
  overflow: 'hidden',
  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
  boxSizing: 'border-box',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #38b6ff, transparent)',
  },
  '&:hover': {
    borderColor: 'rgba(0, 229, 255, 0.45)',
    boxShadow: '0 0 28px rgba(0, 229, 255, 0.12)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '12px',
    borderRadius: '10px'
  },
}));

const SectionTitle = styled('h5')(({ theme }) => ({
  fontFamily: '"Rajdhani", monospace',
  fontWeight: 700,
  fontSize: '0.88rem',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: '#38b6ff',
  margin: '0 0 20px 0',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  '&::after': {
    content: '""',
    flex: 1,
    height: '1px',
    background: 'linear-gradient(90deg, rgba(0,229,255,0.4), transparent)',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem',
    marginBottom: 16
  }
}));

// Make all styles responsive for mobile and desktop
const styles = {
  root: {
    minHeight: '100vh',
    background: '#060D14',
    backgroundImage: `
      linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
    padding: '32px',
    fontFamily: '"Rajdhani", monospace',
    position: 'relative',
    boxSizing: 'border-box'
  },
  rootMobile: {
    minHeight: '100vh',
    background: '#060D14',
    backgroundImage: `
      linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)
    `,
    backgroundSize: '28px 28px',
    padding: '8px 0 16px 0',
    fontFamily: '"Rajdhani", monospace',
    position: 'relative',
    boxSizing: 'border-box'
  },
  mainWrapper: {
    maxWidth: '1280px',
    margin: '0 auto'
  },
  mainWrapperMobile: {
    width: '100%',
    padding: '0 3vw'
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '32px',
    padding: '0 4px',
  },
  topBarMobile: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
    padding: '0 8px'
  },
  logo: {
    fontFamily: '"Rajdhani", monospace',
    fontWeight: 700,
    fontSize: '1.3rem',
    letterSpacing: '0.2em',
    color: '#38b6ff',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoMobile: {
    fontFamily: '"Rajdhani", monospace',
    fontWeight: 700,
    fontSize: '1.06rem',
    letterSpacing: '0.16em',
    color: '#38b6ff',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  logoDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#38b6ff',
    boxShadow: '0 0 10px #38b6ff',
    animation: 'pulse 2s infinite',
    flexShrink: 0
  },
  statusBadge: {
    fontSize: '0.7rem',
    letterSpacing: '0.12em',
    color: '#38b6ff',
    border: '1px solid rgba(0,229,255,0.3)',
    borderRadius: '20px',
    padding: '4px 14px',
    background: 'rgba(0,229,255,0.06)',
    whiteSpace: 'nowrap'
  },
  statusBadgeMobile: {
    fontSize: '0.62rem',
    letterSpacing: '0.11em',
    color: '#38b6ff',
    border: '1px solid rgba(0,229,255,0.18)',
    borderRadius: '16px',
    padding: '3px 8px',
    background: 'rgba(0,229,255,0.045)'
  },
  greetingLabel: {
    fontSize: '0.68rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    marginBottom: '4px',
    opacity: 0.7,
  },
  greetingLabelMobile: {
    fontSize: '0.7em'
  },
  userName: {
    fontSize: '1.6rem',
    fontWeight: 700,
    letterSpacing: '0.05em',
    color: '#E0F7FA',
    margin: '0 0 4px',
    lineHeight: 1.2,
  },
  userNameMobile: {
    fontSize: '1.13rem',
    fontWeight: 700,
    letterSpacing: '0.03em',
    color: '#E0F7FA',
    margin: '0 0 2px',
    lineHeight: 1.15,
  },
  userEmail: {
    fontSize: '0.78rem',
    color: '#38b6ff',
    letterSpacing: '0.08em',
    marginBottom: '24px',
    opacity: 0.8,
  },
  userEmailMobile: {
    fontSize: '0.73rem',
    color: '#38b6ff',
    letterSpacing: '0.08em',
    marginBottom: '14px',
    opacity: 0.85,
  },
  avatarWrapper: {
    position: 'relative',
    width: 90,
    height: 90,
    margin: '0 auto 24px',
    cursor: 'pointer'
  },
  avatarWrapperMobile: {
    position: 'relative',
    width: 62,
    height: 62,
    margin: '0 auto 12px',
    cursor: 'pointer'
  },
  avatarRing: {
    position: 'absolute',
    inset: -4,
    borderRadius: '50%',
    background: 'conic-gradient(#38b6ff, #006064, #38b6ff)',
    animation: 'spin 4s linear infinite',
    zIndex: 0,
  },
  avatarRingMobile: {
    position: 'absolute',
    left: '-4px',
    top: '-4px',
    right: '-4px',
    bottom: '-4px',
    borderRadius: '50%',
    background: 'conic-gradient(#38b6ff, #006064, #38b6ff)',
    animation: 'spin 4s linear infinite',
    zIndex: 0,
  },
  avatarInner: {
    position: 'absolute',
    inset: 2,
    borderRadius: '50%',
    background: '#060D14',
    zIndex: 1,
  },
  avatarInnerMobile: {
    position: 'absolute',
    left: '2px',
    top: '2px',
    right: '2px',
    bottom: '2px',
    borderRadius: '50%',
    background: '#060D14',
    zIndex: 1,
  },
  statRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
  },
  statRowMobile: {
    display: 'flex',
    gap: '8px',
    marginTop: '11px'
  },
  statBox: {
    flex: 1,
    background: 'rgba(0,229,255,0.05)',
    border: '1px solid rgba(0,229,255,0.15)',
    borderRadius: '10px',
    padding: '12px',
    textAlign: 'center',
  },
  statBoxMobile: {
    flex: 1,
    background: 'rgba(0,229,255,0.08)',
    border: '1px solid rgba(0,229,255,0.14)',
    borderRadius: '8px',
    padding: '7px',
    textAlign: 'center',
  },
  statNumber: {
    fontSize: '1.4rem',
    fontWeight: 700,
    color: '#38b6ff',
    lineHeight: 1,
    marginBottom: '4px',
  },
  statNumberMobile: {
    fontSize: '1.02rem',
    fontWeight: 700,
    color: '#38b6ff',
    lineHeight: 1,
    marginBottom: '2.5px'
  },
  statLabel: {
    fontSize: '0.62rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    opacity: 0.55,
  },
  statLabelMobile: {
    fontSize: '0.58rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    opacity: 0.59
  },
  activityDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#38b6ff',
    boxShadow: '0 0 6px #38b6ff',
    display: 'inline-block',
    marginRight: 8,
    animation: 'pulse 1.8s infinite',
  },
  activityDotMobile: {
    width: 5,
    height: 5,
    borderRadius: '50%',
    background: '#38b6ff',
    boxShadow: '0 0 4px #38b6ff',
    display: 'inline-block',
    marginRight: 5,
    animation: 'pulse 1.8s infinite',
  },
  contactRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(0,229,255,0.07)',
    padding: '6px 0',
  },
  contactName: {
    fontSize: '1rem',
    color: '#E0F7FA',
    wordBreak: 'break-all'
  },
  contactNameMobile: {
    fontSize: '0.95rem',
    color: '#E0F7FA',
    wordBreak: 'break-all'
  },
  contactEmail: {
    fontSize: '0.84rem',
    color: '#38b6ff',
    opacity: 0.7,
    wordBreak: 'break-all'
  },
  contactEmailMobile: {
    fontSize: '0.74rem',
    color: '#38b6ff',
    opacity: 0.72,
    wordBreak: 'break-all'
  },
  deleteBtn: {
    color: '#FF5252',
    padding: 5,
    marginLeft: 8
  },
  noContacts: {
    color: '#80DEEA',
    opacity: 0.72,
    textAlign: 'center',
    padding: '8px 0',
    fontSize: '0.95rem',
    letterSpacing: '0.08em'
  },
  noContactsMobile: {
    color: '#80DEEA',
    opacity: 0.72,
    textAlign: 'center',
    padding: '8px 0',
    fontSize: '0.88rem',
    letterSpacing: '0.07em'
  },
  contactItemContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(0,229,255,0.07)',
    padding: '10px 0',
    width: '100%'
  },
  contactItemContainerMobile: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(0,229,255,0.08)',
    padding: '7px 0',
    width: '100%'
  },
  contactInfoCol: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minWidth: 0,
    marginRight: 10,
  },
  contactInfoColMobile: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minWidth: 0,
    marginRight: 7,
  },
  cyanButton: {
    background: '#38b6ff',
    color: '#060D14',
    fontWeight: 700,
    textTransform: 'uppercase',
    fontFamily: '"Rajdhani", monospace',
    letterSpacing: '0.1em',
    '&:hover': {
      background: '#26C6DA'
    }
  },
  cyanButtonMobile: {
    background: '#38b6ff',
    color: '#060D14',
    fontWeight: 700,
    textTransform: 'uppercase',
    fontFamily: '"Rajdhani", monospace',
    letterSpacing: '0.1em',
    fontSize: '0.96em',
    paddingTop: '10px',
    paddingBottom: '10px',
    '&:hover': {
      background: '#26C6DA'
    }
  },
  inputDark: {
    '& .MuiInputBase-root': {
      background: '#142037',
      color: '#E0F7FA',
      borderRadius: 1
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#38b6ff'
    },
    '& label': {
      color: '#80DEEA'
    },
    '& label.Mui-focused': {
      color: '#38b6ff'
    }
  },
  inputDarkMobile: {
    '& .MuiInputBase-root': {
      background: '#142037',
      color: '#E0F7FA',
      borderRadius: 1,
      fontSize: '0.96em'
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#38b6ff'
    },
    '& label': {
      color: '#80DEEA',
      fontSize: '0.99em'
    },
    '& label.Mui-focused': {
      color: '#38b6ff'
    }
  },
  contactAvatar: {
    width: 36,
    height: 36,
    fontSize: '1rem',
    fontWeight: 700,
    background: 'linear-gradient(135deg,rgb(0, 107, 169), #38b6ff)',
    marginRight: '10px',
    color: '#E0F7FA',
    border: '1.5px solid rgba(0,229,255,0.16)',
  },
  contactAvatarMobile: {
    width: 28,
    height: 28,
    fontSize: '0.87rem',
    fontWeight: 700,
    background: 'linear-gradient(135deg,rgb(0, 107, 169), #38b6ff)',
    marginRight: '7px',
    color: '#E0F7FA',
    border: '1.3px solid rgba(0,229,255,0.14)',
  },
  contactAvatarWrapper: {
    display: 'flex',
    alignItems: 'center',
    minWidth: 36
  },
  contactAvatarWrapperMobile: {
    display: 'flex',
    alignItems: 'center',
    minWidth: 28
  }
};

/* ─── Greeting helper ─────────────────────────────────────────── */
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return { label: 'Good Morning', color: '#38b6ff' };
  if (h < 18) return { label: 'Good Afternoon', color: '#38b6ff' };
  return { label: 'Good Evening', color: '#38b6ff' };
};

/* ─── AddContact  ─────────────────────────────────────────────── */
function AddContactDark({ onAdd, isMobile }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSubmitting(true);
    await onAdd({ name: name.trim(), email: email.trim() });
    setName('');
    setEmail('');
    setSubmitting(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? 11 : 18
      }}
    >
      <TextField
        label="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        variant="outlined"
        fullWidth
        size="small"
        sx={isMobile ? styles.inputDarkMobile : styles.inputDark}
        InputLabelProps={{ style: { fontFamily: '"Rajdhani", monospace' } }}
        inputProps={{ style: { fontFamily: '"Rajdhani", monospace' } }}
        required
      />
      <TextField
        label="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        variant="outlined"
        fullWidth
        size="small"
        type="email"
        sx={isMobile ? styles.inputDarkMobile : styles.inputDark}
        InputLabelProps={{ style: { fontFamily: '"Rajdhani", monospace' } }}
        inputProps={{ style: { fontFamily: '"Rajdhani", monospace' } }}
        required
      />
      <Button
        variant="contained"
        type="submit"
        disabled={submitting}
        sx={isMobile ? styles.cyanButtonMobile : styles.cyanButton}
      >
        {submitting ? 'Adding...' : 'Add Contact'}
      </Button>
    </form>
  );
}

/* ─── Contact avatar utility ───────────────────────────────────── */
function getContactInitials(contact) {
  if (!contact?.name) return 'N/A';
  return contact.name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0].toUpperCase())
    .join('')
    .slice(0, 2);
}

/* ─── Component ───────────────────────────────────────────────── */
function HomePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [imageError, setImageError] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef(null);
  const greeting = getGreeting();

  // Responsive hooks
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1199px)");

  const BASE_URL = 'http://localhost:5000';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${BASE_URL}/me`, { credentials: 'include' });
        if (!res.ok) { setUser(null); return; }
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    axios.get(`${BASE_URL}/contacts`, { withCredentials: true })
      .then((res) => setContacts(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleAddContact = async (form) => {
    try {
      await axios.post(`${BASE_URL}/contacts/add`, form, { withCredentials: true });
      const updated = await axios.get(`${BASE_URL}/contacts`, { withCredentials: true });
      setContacts(updated.data);
      setSnackbar({ open: true, message: 'Contact added successfully', severity: 'success' });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to add contact', severity: 'error' });
    }
  };

  const handleDeleteContact = async (contactId) => {
    setDeleting(true);
    try {
      await axios.delete(`${BASE_URL}/contacts/${contactId}`, { withCredentials: true });
      const updated = await axios.get(`${BASE_URL}/contacts`, { withCredentials: true });
      setContacts(updated.data);
      setSnackbar({ open: true, message: 'Contact deleted', severity: 'success' });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Delete failed', severity: 'error' });
    }
    setDeleting(false);
  };

  const handleAvatarClick = () => user && fileInputRef.current.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setSnackbar({ open: true, message: 'File size exceeds 5MB', severity: 'error' });
      return;
    }
    const formData = new FormData();
    formData.append('profilePicture', file);
    try {
      const res = await axios.post(`${BASE_URL}/upload-profile-picture`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUser({ ...user, profile_picture: res.data.profile_picture });
      setImageError(false);
      setSnackbar({ open: true, message: 'Profile picture updated', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Upload failed', severity: 'error' });
    }
  };

  if (loading) return (
    <div style={{
      minHeight: '100vh', background: '#060D14', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      color: '#38b6ff', fontFamily: 'Rajdhani, monospace',
      letterSpacing: '0.2em', fontSize: isMobile ? '0.98rem' : '0.9rem',
      paddingLeft: isMobile ? '12px' : undefined,
      paddingRight: isMobile ? '12px' : undefined
    }}>
      <span style={isMobile ? styles.activityDotMobile : styles.activityDot} />
      INITIALIZING DASHBOARD...
    </div>
  );

  const initials = user
    ? user.name.split(' ').map((n) => n[0].toUpperCase()).join('')
    : 'X';

  // Responsive grid props
  //  - mobile: stack all
  //  - tablet: 2 cards per row (Profile & Invite), then Contact List full width
  //  - desktop: Profile (4cols), Invite (8cols), List (4cols)
  const getCardGridProps = () => {
    if (isMobile) return {
      profile: { xs: 12, style: { marginBottom: '15px' } },
      add: { xs: 12, style: { marginBottom: '15px' } },
      list: { xs: 12 }
    };
    if (isTablet) return {
      profile: { md: 6, style: {} },
      add: { md: 6, style: {} },
      list: { md: 12 }
    };
    return {
      // Desktop layout
      profile: { md: 4, style: {} },
      add: { md: 8, style: {} },
      list: { md: 4 }
    };
  };
  const gridProps = getCardGridProps();

  return (
    <ThemeProvider theme={darkCyanTheme}>
      {/* Responsive and accessibility CSS-in-JS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Share+Tech+Mono&display=swap');
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px currentColor; }
          50% { opacity: 0.5; box-shadow: 0 0 2px currentColor; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .dash-card { animation: fadeUp 0.5s ease both; }
        .dash-card:nth-child(1) { animation-delay: 0.07s; }
        .dash-card:nth-child(2) { animation-delay: 0.13s; }
        .dash-card:nth-child(3) { animation-delay: 0.20s; }
        /* Responsive tweaks: */
        @media (max-width: 767px) {
          .dash-card { width: 100% !important; max-width: none !important; margin: 0 0 12px 0 !important;}
        }
        @media (min-width: 768px) and (max-width: 1199px) {
          .dash-card { width: 100% !important; max-width: none !important;}
        }
        @media (min-width: 1200px) {
          .dash-card { width: auto !important;}
        }
      `}</style>
      <Box sx={isMobile ? styles.rootMobile : styles.root}>
        <div style={isMobile ? styles.mainWrapperMobile : styles.mainWrapper}>
          {/* ── Top Bar ── */}
          <div style={isMobile ? styles.topBarMobile : styles.topBar}>
            <div style={isMobile ? styles.logoMobile : styles.logo}>
              <div style={styles.logoDot} />
              MEETHUB DASHBOARD
            </div>
            <div style={isMobile ? styles.statusBadgeMobile : styles.statusBadge}>● SYSTEM ONLINE</div>
          </div>
          <Grid container spacing={isMobile ? 1.3 : 3}>
            {/* ── Profile Card ── */}
            <Grid item {...gridProps.profile} className="dash-card" style={gridProps.profile?.style}>
              <GlassCard>
                <SectionTitle>Profile</SectionTitle>
                {user ? (
                  <>
                    <div style={{ textAlign: 'center' }}>
                      {/* Spinning ring avatar */}
                      <div
                        style={
                          isMobile
                            ? styles.avatarWrapperMobile
                            : styles.avatarWrapper
                        }
                        onClick={handleAvatarClick}
                        title="Change photo"
                        tabIndex={0}
                        onKeyDown={e => { if (e.key === 'Enter') handleAvatarClick(); }}
                        role="button"
                        aria-label="Upload profile picture"
                      >
                        <div style={isMobile ? styles.avatarRingMobile : styles.avatarRing} />
                        <div style={isMobile ? styles.avatarInnerMobile : styles.avatarInner} />
                        <Avatar
                          alt={user.name}
                          src={user?.profile_picture && !imageError ? `${BASE_URL}${user.profile_picture}` : undefined}
                          sx={{
                            width: isMobile ? 54 : 82,
                            height: isMobile ? 54 : 82,
                            position: 'absolute',
                            top: isMobile ? 4 : 4,
                            left: isMobile ? 4 : 4,
                            zIndex: 2,
                            fontSize: isMobile ? '1rem' : '1.5rem',
                            fontFamily: 'Rajdhani, monospace',
                            fontWeight: 700,
                            background: 'linear-gradient(135deg,rgb(0, 93, 147), #38b6ff)',
                            cursor: 'pointer',
                            border: '2px solid rgba(0,229,255,0.2)',
                            transition: 'opacity 0.2s',
                            '&:hover': { opacity: 0.85 },
                          }}
                          onError={() => setImageError(true)}
                        >
                          {(!user?.profile_picture || imageError) && initials}
                        </Avatar>
                      </div>
                      <div style={{ ...styles.greetingLabel, ...(isMobile && styles.greetingLabelMobile), color: greeting.color }}>
                        {greeting.label}
                      </div>
                      <h3 style={isMobile ? styles.userNameMobile : styles.userName}>{user.name}</h3>
                      {user.email && (
                        <div style={isMobile ? styles.userEmailMobile : styles.userEmail}>{user.email}</div>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      accept="image/jpeg,image/png"
                      onChange={handleFileChange}
                    />
                    <div style={isMobile ? styles.statRowMobile : styles.statRow}>
                      <div style={isMobile ? styles.statBoxMobile : styles.statBox}>
                        <div style={isMobile ? styles.statNumberMobile : styles.statNumber}>{contacts.length}</div>
                        <div style={isMobile ? styles.statLabelMobile : styles.statLabel}>Contacts</div>
                      </div>
                      <div style={isMobile ? styles.statBoxMobile : styles.statBox}>
                        <div style={isMobile ? styles.statNumberMobile : styles.statNumber}>{new Date().getDate()}</div>
                        <div style={isMobile ? styles.statLabelMobile : styles.statLabel}>Today</div>
                      </div>
                      <div style={isMobile ? styles.statBoxMobile : styles.statBox}>
                        <div style={{
                          ...(isMobile ? styles.statNumberMobile : styles.statNumber),
                          fontSize: isMobile ? '0.73rem' : '0.85rem',
                          paddingTop: isMobile ? 2 : 4
                        }}>
                          <span style={isMobile ? styles.activityDotMobile : styles.activityDot} />
                          ON
                        </div>
                        <div style={isMobile ? styles.statLabelMobile : styles.statLabel}>Status</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: isMobile ? '15px 0' : '24px 0' }}>
                    <div style={{ fontSize: isMobile ? '0.85rem' : '0.92rem', color: '#4DD0E1', marginBottom: 16 }}>
                      Not authenticated
                    </div>
                    <a
                      href="/login"
                      style={{
                        color: '#38b6ff',
                        border: '1px solid rgba(0,229,255,0.4)',
                        borderRadius: 8,
                        padding: isMobile ? '7px 16px' : '8px 20px',
                        textDecoration: 'none',
                        fontSize: isMobile ? '0.95rem' : '0.8rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        background: 'rgba(0,229,255,0.07)',
                        transition: 'background 0.2s',
                        display: 'inline-block'
                      }}
                    >
                      Login →
                    </a>
                  </div>
                )}
              </GlassCard>
            </Grid>
            {/* ── Add Contact Card ── */}
            <Grid item {...gridProps.add} className="dash-card" style={gridProps.add?.style}>
              <GlassCard>
                <SectionTitle>Invite Friends</SectionTitle>
                <AddContactDark onAdd={handleAddContact} isMobile={isMobile} />
              </GlassCard>
            </Grid>
            {/* ── Contact List Card ── */}
            <Grid item {...gridProps.list} className="dash-card">
              <GlassCard>
                <SectionTitle>Contact List</SectionTitle>
                {contacts.length === 0 ? (
                  <div style={isMobile ? styles.noContactsMobile : styles.noContacts}>Contact not available</div>
                ) : (
                  <div>
                    {contacts.map((contact) => (
                      <div
                        key={contact._id || contact.id}
                        style={isMobile ? styles.contactItemContainerMobile : styles.contactItemContainer}
                      >
                        {/* Contact avatar and info */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          flex: 1,
                          minWidth: 0
                        }}>
                          <div style={isMobile ? styles.contactAvatarWrapperMobile : styles.contactAvatarWrapper}>
                            <Avatar
                              sx={isMobile ? styles.contactAvatarMobile : styles.contactAvatar}
                              alt={contact.name}
                            >
                              {getContactInitials(contact)}
                            </Avatar>
                          </div>
                          <div style={isMobile ? styles.contactInfoColMobile : styles.contactInfoCol}>
                            <span style={isMobile ? styles.contactNameMobile : styles.contactName}>{contact.name}</span>
                            <span style={isMobile ? styles.contactEmailMobile : styles.contactEmail}>{contact.email}</span>
                          </div>
                        </div>
                        <IconButton
                          aria-label="delete"
                          size="small"
                          style={styles.deleteBtn}
                          onClick={() => handleDeleteContact(contact._id || contact.id)}
                          disabled={deleting}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>
            </Grid>
          </Grid>
        </div>
        {/* ── Snackbar ── */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: isMobile ? 'center' : 'right' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{
              background: snackbar.severity === 'success'
                ? 'rgba(0, 100, 100, 0.9)'
                : 'rgba(100, 20, 20, 0.9)',
              color: '#E0F7FA',
              border: `1px solid ${snackbar.severity === 'success' ? 'rgba(0,229,255,0.4)' : 'rgba(255,80,80,0.4)'}`,
              backdropFilter: 'blur(12px)',
              fontFamily: 'Rajdhani, monospace',
              letterSpacing: '0.06em',
              '& .MuiAlert-icon': { color: snackbar.severity === 'success' ? '#38b6ff' : '#FF5252' },
              fontSize: isMobile ? '0.95em' : '1.04em',
              margin: isMobile ? '0 6px' : undefined,
              minWidth: isMobile ? '220px' : undefined
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default HomePage;
