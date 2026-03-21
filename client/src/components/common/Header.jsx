import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Header.css';

const INFINEON_LOGO =
  'https://www.infineon.com/etc.clientlibs/ifx/components/common/mainnavigation/clientlibs/resources/logo.svg';

const ChevronDown = () => (
  <svg className="ifx-header__chevron" viewBox="0 0 24 24">
    <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" fill="currentColor" />
  </svg>
);

const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

function Header() {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <header className="ifx-header">
      <div className="ifx-header__left">
        <div className="ifx-header__logo">
          <img src={INFINEON_LOGO} alt="Infineon" />
        </div>

        <nav className="ifx-header__nav">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              'ifx-header__nav-item' + (isActive ? ' active' : '')
            }
          >
            Dashboard
          </NavLink>
        </nav>
      </div>

      <div className="ifx-header__spacer" />

      <div className="ifx-header__right">
        <a href="#help" className="ifx-header__link">Help</a>

        <div className="ifx-header__avatar-wrapper" ref={menuRef}>
          <button
            className="ifx-header__avatar-btn"
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {!imgError ? (
              <img
                className="ifx-header__avatar-img"
                src="/avatar.png"
                alt=""
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="ifx-header__avatar-initials">GS</div>
            )}
            <ChevronDown />
          </button>

          {menuOpen && (
            <div className="ifx-header__dropdown">
              <button
                className="ifx-header__dropdown-item"
                onClick={() => { setMenuOpen(false); navigate('/login'); }}
              >
                <LogoutIcon />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
