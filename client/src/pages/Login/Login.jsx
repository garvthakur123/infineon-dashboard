import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const FOOTER_LOGO = 'https://sso.infineon.com/assets/images/footer_logo.svg';

const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" width="20" height="20">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.0 24.0 0 0 0 0 21.56l7.98-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 48 48" width="20" height="20">
    <path fill="#0077B5" d="M44.45 0H3.55A3.5 3.5 0 0 0 0 3.46v41.08A3.5 3.5 0 0 0 3.55 48h40.9A3.5 3.5 0 0 0 48 44.54V3.46A3.5 3.5 0 0 0 44.45 0zM14.24 40.9H7.12V18h7.12zm-3.56-26.04a4.13 4.13 0 1 1 0-8.26 4.13 4.13 0 0 1 0 8.26zM40.9 40.9h-7.1V29.77c0-2.66-.05-6.08-3.7-6.08-3.7 0-4.27 2.9-4.27 5.89V40.9h-7.1V18h6.82v3.12h.1c.95-1.8 3.27-3.7 6.73-3.7 7.2 0 8.53 4.74 8.53 10.91z" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M20 21a8 8 0 1 0-16 0" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

function Login() {
  const navigate = useNavigate();

  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleNext = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setEmailError('Please enter your email or username.');
      return;
    }
    setEmailError('');
    setStep('password');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setPasswordError('Please enter your password.');
      return;
    }
    setPasswordError('');
    navigate('/dashboard');
  };

  const handleBack = () => {
    setStep('email');
    setPassword('');
    setPasswordError('');
  };

  return (
    <div className="login-page">
      <div className="login-content">
        <div className="login-card">
          <h1>myInfineon Login</h1>

          {step === 'email' ? (
            <form onSubmit={handleNext}>
              <label className="field-label">
                E-Mail / Username (without preceding domain)
              </label>
              <div className={'input-wrapper' + (emailError ? ' input-wrapper--error' : '')}>
                <span className="input-icon"><UserIcon /></span>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                  autoFocus
                />
              </div>
              {emailError && <p className="field-error">{emailError}</p>}

              <button type="submit" className="login-btn">Next</button>

              <div className="register-row">
                Don&apos;t have an account?{' '}
                <a href="#register">Register</a>
              </div>

              <div className="divider"><span>or sign up with</span></div>

              <div className="social-buttons">
                <button type="button" className="social-btn">
                  <GoogleIcon /> Google
                </button>
                <button type="button" className="social-btn">
                  <LinkedInIcon /> LinkedIn
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLogin}>
              <div className="email-display">
                <span>{email}</span>
                <a href="#change" className="change-link" onClick={handleBack}>
                  Change
                </a>
              </div>

              <label className="field-label">Password</label>
              <div className={'input-wrapper' + (passwordError ? ' input-wrapper--error' : '')}>
                <span className="input-icon"><LockIcon /></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }}
                  autoFocus
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {passwordError && <p className="field-error">{passwordError}</p>}

              <div className="checkbox-row">
                <input
                  type="checkbox"
                  id="keepLoggedIn"
                  checked={keepLoggedIn}
                  onChange={(e) => setKeepLoggedIn(e.target.checked)}
                />
                <label htmlFor="keepLoggedIn">Keep me logged in</label>
              </div>

              <button type="submit" className="login-btn">Log in</button>

              <div className="links-row">
                <a href="#change-password">Change password?</a>
                <span className="separator">|</span>
                <a href="#forgot-password">Forgot password?</a>
              </div>

              <div className="register-row">
                Don&apos;t have an account?{' '}
                <a href="#register">Register now</a>
              </div>

              <div className="divider"><span>or log in with</span></div>

              <div className="social-buttons">
                <button type="button" className="social-btn">
                  <GoogleIcon /> Google
                </button>
                <button type="button" className="social-btn">
                  <LinkedInIcon /> LinkedIn
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <footer className="login-footer">
        <div className="footer-logo">
          <img src={FOOTER_LOGO} alt="Infineon" />
        </div>
        <div className="footer-links">
          <a href="#terms">Terms of use</a>
          <a href="#imprint">Imprint</a>
          <a href="#contact">Contact</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#glossary">Glossary</a>
        </div>
        <span className="footer-copy">&copy; 1999 - 2026 Infineon Technologies AG</span>
      </footer>
    </div>
  );
}

export default Login;
