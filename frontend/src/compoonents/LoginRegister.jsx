import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/meethub-logo.png";
import Particles from "./bg-animation/Particles";

const cyan = "#00d4ff";
const dark = "#0d0f14";
const panel = "#111318";

const styles = {
  root: {
    minHeight: "100vh",
    width: "100vw",
    display: "flex",
    background: dark,
    fontFamily: "'DM Sans', sans-serif",
    overflow: "hidden",
    position: "relative",
  },
  left: {
    width: "42%",
    minWidth: 280,
    background: dark,
    borderRight: "0.5px solid rgba(255,255,255,0.08)",
    padding: "48px 40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
    overflow: "hidden",
  },
  leftGlow: {
    position: "absolute",
    top: -80,
    left: -80,
    width: 320,
    height: 320,
    background: "radial-gradient(circle, rgba(0,212,255,0.13) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  // logoBox: {
  //   width: 100,
  //   height: 100,
  //   background: cyan,
  //   borderRadius: 8,
  //   display: "flex",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   flexShrink: 0,
  // },
  leftBody: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "32px 0",
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: "2.5px",
    textTransform: "uppercase",
    color: cyan,
    fontWeight: 600,
    marginBottom: 14,
  },
  bigTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 38,
    fontWeight: 800,
    color: "#ffffff",
    lineHeight: 1.1,
    marginBottom: 18,
  },
  bigTitleSpan: { color: cyan },
  desc: {
    fontSize: 14,
    color: "rgba(255,255,255,0.4)",
    lineHeight: 1.7,
    maxWidth: 220,
  },
  features: {
    marginTop: 36,
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  feat: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontSize: 13,
    color: "rgba(255,255,255,0.55)",
  },
  featDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: cyan,
    flexShrink: 0,
  },
  toggleRow: {
    fontSize: 13,
    color: "rgba(255,255,255,0.38)",
  },
  toggleLink: {
    color: cyan,
    fontWeight: 700,
    marginLeft: 6,
    cursor: "pointer",
    background: "none",
    border: "none",
    fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
  },
  right: {
    flex: 1,
    background: panel,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 32px",
    position: "relative",
  },
  formWrap: {
    width: "100%",
    maxWidth: 340,
    position: 'relative',
    zIndex: "100",
  },
  formTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 26,
    fontWeight: 800,
    color: "#fff",
    marginBottom: 6,
  },
  formSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.32)",
    marginBottom: 28,
  },
  stepIndicator: {
    display: "flex",
    gap: 6,
    marginBottom: 24,
  },
  stepBase: {
    height: 3,
    borderRadius: 2,
    flex: 1,
    transition: "background 0.3s",
  },
  label: {
    display: "block",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.32)",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    height: 44,
    background: "rgba(255,255,255,0.04)",
    border: "0.5px solid rgba(255,255,255,0.1)",
    borderRadius: 6,
    padding: "0 14px",
    fontSize: 14,
    color: "#fff",
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    marginBottom: 14,
    transition: "border-color 0.2s, background 0.2s",
    boxSizing: "border-box",
  },
  btn: {
    width: "100%",
    height: 46,
    background: cyan,
    border: "none",
    borderRadius: 6,
    color: dark,
    fontWeight: 700,
    fontSize: 14,
    letterSpacing: "0.3px",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    marginTop: 6,
    transition: "opacity 0.15s, transform 0.1s",
  },
  btnGhost: {
    width: "100%",
    height: 46,
    background: "rgba(255,255,255,0.05)",
    border: "0.5px solid rgba(255,255,255,0.11)",
    borderRadius: 6,
    color: "rgba(255,255,255,0.65)",
    fontWeight: 500,
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    marginTop: 8,
    transition: "background 0.15s",
  },
  alertBase: {
    borderRadius: 6,
    padding: "10px 14px",
    fontSize: 13,
    marginBottom: 18,
    fontWeight: 500,
  },
  otpHint: {
    fontSize: 12,
    color: "rgba(255,255,255,0.28)",
    marginBottom: 16,
    lineHeight: 1.6,
  },
};

const STEP_COLORS = {
  inactive: "rgba(255,255,255,0.1)",
  active: cyan,
  done: "rgba(0,212,255,0.38)",
};

const GoogleFontsLink = () => (
  <link
    href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap"
    rel="stylesheet"
  />
);

const Alert = ({ type, message }) => {
  if (!message) return null;
  const isSuccess = type === "success";
  return (
    <div
      style={{
        ...styles.alertBase,
        background: isSuccess ? "rgba(0,212,255,0.09)" : "rgba(255,80,80,0.09)",
        color: isSuccess ? cyan : "#ff6b6b",
        borderLeft: `3px solid ${isSuccess ? cyan : "#ff6b6b"}`,
      }}
    >
      {message}
    </div>
  );
};

const PrimaryButton = ({ children, onClick, style }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      style={{
        ...styles.btn,
        opacity: hovered ? 0.85 : 1,
        ...style,
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </button>
  );
};

const GhostButton = ({ children, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      style={{
        ...styles.btnGhost,
        background: hovered ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.05)",
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </button>
  );
};

const FocusInput = ({ type = "text", placeholder, value, onChange }) => {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        ...styles.input,
        borderColor: focused ? cyan : "rgba(255,255,255,0.1)",
        background: focused ? "rgba(0,212,255,0.04)" : "rgba(255,255,255,0.04)",
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
};

const StepDots = ({ step }) => (
  <div style={styles.stepIndicator}>
    {[1, 2, 3].map((n) => (
      <div
        key={n}
        style={{
          ...styles.stepBase,
          background:
            n < step
              ? STEP_COLORS.done
              : n === step
              ? STEP_COLORS.active
              : STEP_COLORS.inactive,
        }}
      />
    ))}
  </div>
);

const LoginRegister = () => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(true);

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regStep, setRegStep] = useState(1);

  const [logEmail, setLogEmail] = useState("");
  const [logPassword, setLogPass] = useState("");

  const [alert, setAlert] = useState({ type: "", message: "" });

  const showAlert = (type, message) => setAlert({ type, message });
  const clearAlert = () => setAlert({ type: "", message: "" });

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());

  const checkDuplicateEmail = async (email) => {
    try {
      const res = await axios.post("http://localhost:5000/check-email", { email }, { withCredentials: true });
      return res.data.exists;
    } catch {
      return false;
    }
  };

  const handleGetOtp = async () => {
    clearAlert();
    if (!regName.trim()) return showAlert("error", "Please enter your name");
    if (!regEmail.trim() || !validateEmail(regEmail)) return showAlert("error", "Enter a valid email address");
    const exists = await checkDuplicateEmail(regEmail);
    if (exists) return showAlert("error", "This email is already registered");
    try {
      const res = await axios.post("http://localhost:5000/get-otp", { name: regName, email: regEmail }, { withCredentials: true });
      showAlert("success", res.data.message);
      setRegStep(2);
    } catch (err) {
      showAlert("error", err.response?.data?.message || "Failed to send code");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) return showAlert("error", "Please enter the verification code");
    try {
      const res = await axios.post("http://localhost:5000/verify-otp", { email: regEmail, otp }, { withCredentials: true });
      showAlert("success", res.data.message);
      setRegStep(3);
    } catch (err) {
      showAlert("error", err.response?.data?.message || "Verification failed");
    }
  };

  const handleRegister = async () => {
    if (!regPassword.trim()) return showAlert("error", "Please create a password");
    try {
      const res = await axios.post("http://localhost:5000/register", { email: regEmail, password: regPassword }, { withCredentials: true });
      showAlert("success", res.data.message);
      setRegStep(1);
      setRegName(""); setRegEmail(""); setRegPassword(""); setOtp("");
      setShowLogin(true);
    } catch (err) {
      showAlert("error", err.response?.data?.message || "Registration failed");
    }
  };

  const handleLogin = async () => {
    clearAlert();
    if (!logEmail.trim() || !logPassword.trim()) return showAlert("error", "Please fill in all fields");
    if (!validateEmail(logEmail)) return showAlert("error", "Invalid email format");
    try {
      const res = await axios.post("http://localhost:5000/login", { email: logEmail, password: logPassword }, { withCredentials: true });
      if (res.data?.user) {
        showAlert("success", res.data.message);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/dashboard", { replace: true });
      } else {
        showAlert("error", res.data.message || "Invalid credentials");
      }
    } catch (err) {
      showAlert("error", err.response?.data?.message || "Login failed");
    }
  };

  const switchMode = () => {
    clearAlert();
    setRegStep(1);
    setShowLogin(!showLogin);
  };

  const isMobile = window.innerWidth <= 767;

  return (
    <>
      <GoogleFontsLink />
      <div style={styles.root}>
        {/* Left Panel */}
        {!isMobile && (
          <div style={styles.left}>
            <div style={styles.leftGlow} />

            {/* Logo */}
            <div style={styles.logoBox}>
              <img src={logo} alt="logo" style={{ width: '250px', objectFit: "contain" }} />
            </div>

            {/* Body */}
            <div style={styles.leftBody}>
              <div style={styles.eyebrow}>Team Communication</div>
              <div style={styles.bigTitle}>
                Connect.<br />
                Collab.<br />
                <span style={styles.bigTitleSpan}>Communicate.</span>
              </div>
              <div style={styles.desc}>
                Secure video calls and instant messaging built for modern teams.
              </div>
              <div style={styles.features}>
                {["End-to-end encrypted calls", "Real-time team messaging", "Cross-platform sync"].map((f) => (
                  <div key={f} style={styles.feat}>
                    <div style={styles.featDot} />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Toggle */}
            <div style={styles.toggleRow}>
              <span>{showLogin ? "New here?" : "Already registered?"}</span>
              <button style={styles.toggleLink} onClick={switchMode}>
                {showLogin ? "Sign Up" : "Sign In"}
              </button>
            </div>
          </div>
        )}

        {/* Right Panel */}
        <div style={styles.right}>
        <Particles
          particleColors={["#00d4ff"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover
          alphaParticles={false}
          disableRotation={false}
          pixelRatio={1}
        />
          <div style={styles.formWrap}>
            {showLogin ? (
              <>
                <div style={styles.formTitle}>Welcome back</div>
                <div style={styles.formSub}>Sign in to your workspace</div>

                <Alert {...alert} />

                <label style={styles.label}>Work Email</label>
                <FocusInput type="email" placeholder="you@company.com" value={logEmail} onChange={(e) => setLogEmail(e.target.value)} />

                <label style={styles.label}>Password</label>
                <FocusInput type="password" placeholder="Enter your password" value={logPassword} onChange={(e) => setLogPass(e.target.value)} />

                <PrimaryButton onClick={handleLogin}>Sign In →</PrimaryButton>

                {isMobile && (
                  <div style={{ textAlign: "center", marginTop: 20, ...styles.toggleRow }}>
                    New here?
                    <button style={styles.toggleLink} onClick={switchMode}>Sign Up</button>
                  </div>
                )}
              </>
            ) : (
              <>
                <div style={styles.formTitle}>Create account</div>
                <div style={styles.formSub}>Set up your workspace in seconds</div>

                <StepDots step={regStep} />
                <Alert {...alert} />

                {regStep === 1 && (
                  <>
                    <label style={styles.label}>Full Name</label>
                    <FocusInput placeholder="Your full name" value={regName} onChange={(e) => setRegName(e.target.value)} />

                    <label style={styles.label}>Work Email</label>
                    <FocusInput type="email" placeholder="you@company.com" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />

                    <PrimaryButton onClick={handleGetOtp}>Get Verification Code →</PrimaryButton>
                  </>
                )}

                {regStep === 2 && (
                  <>
                    <label style={styles.label}>Verification Code</label>
                    <FocusInput placeholder="Enter 4-digit code" value={otp} onChange={(e) => setOtp(e.target.value)} />
                    <div style={styles.otpHint}>
                      Sent to <span style={{ color: "rgba(255,255,255,0.6)" }}>{regEmail}</span>
                    </div>

                    <PrimaryButton onClick={handleVerifyOtp}>Verify Code →</PrimaryButton>
                    <GhostButton onClick={() => { setRegStep(1); clearAlert(); }}>← Change email</GhostButton>
                  </>
                )}

                {regStep === 3 && (
                  <>
                    <label style={styles.label}>Create Password</label>
                    <FocusInput type="password" placeholder="Choose a strong password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} />

                    <PrimaryButton onClick={handleRegister}>Create Account →</PrimaryButton>
                    <GhostButton onClick={() => { setRegStep(2); clearAlert(); }}>← Back</GhostButton>
                  </>
                )}

                {isMobile && (
                  <div style={{ textAlign: "center", marginTop: 20, ...styles.toggleRow }}>
                    Already registered?
                    <button style={styles.toggleLink} onClick={switchMode}>Sign In</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginRegister;