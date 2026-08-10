import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LogIn, LogOut, ShieldCheck, Menu, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

type DashboardLink = {
  label: string;
  path: string;
};

const roleDashboards: Array<{ matches: string[]; link: DashboardLink }> = [
  {
    matches: ['GLOBAL_ADMIN', 'ADMIN', 'GLOBAL'],
    link: { label: 'Admin Panel', path: '/global-admin' },
  },
  {
    matches: ['UNIVERSITY_ADMIN', 'UNIVERSITY_REP', 'UNIVERSITY'],
    link: { label: 'Admin Panel', path: '/university-admin' },
  },
  {
    matches: ['DEPARTMENT_ADMIN', 'DEPARTMENT_REP', 'DEPARTMENT'],
    link: { label: 'Admin Panel', path: '/department-admin' },
  },
  {
    matches: ['PROGRAM_ADMIN', 'PROGRAM_REP', 'PROGRAM'],
    link: { label: 'Admin Panel', path: '/program-admin' },
  },
  {
    matches: ['SESSION_ADMIN', 'SESSION_REP', 'SESSION'],
    link: { label: 'Admin Panel', path: '/session-admin' },
  },
];

const normalizeRole = (role: string) =>
  role.trim().toUpperCase().replace(/^ROLE_/, '').replace(/[\s-]+/g, '_');

const getRoleDashboard = (roles: string[] = []) => {
  const normalizedRoles = roles.map(normalizeRole);
  return roleDashboards.find(({ matches }) =>
    matches.some((role) => normalizedRoles.includes(role))
  )?.link;
};

const hiddenNavbarRoutes = [
  '/dashboard',
  '/session-admin',
  '/department-admin',
  '/program-admin',
  '/university-admin',
  '/global-admin',
];

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  
  const roleDashboard = getRoleDashboard(user?.roles);

  if (hiddenNavbarRoutes.includes(location.pathname)) return null;

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
    navigate('/signin');
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="pp-navbar-container">
      <div className="pp-nav-content">
        {/* Brand Logo Layout */}
        <div className="pp-logo" onClick={() => { navigate('/'); closeMobileMenu(); }}>
          <div className="pp-logo-box">P</div>
          <span className="pp-logo-text">PrevPaper</span>
        </div>

        {/* Action Elements Wrapper */}
        <div className="pp-nav-actions-wrapper">
          
          {/* Main Desktop Navigation Links */}
          <div className="pp-desktop-links-group">
             <a
              href="https://docs.prevpaper.fun"
              target="_blank"
              rel="noopener noreferrer"
              className="pp-text-link"
            >
              Docs
            </a>
            {/* <Link to="/#features" className="pp-text-link">Features</Link> */}
            <Link to="/about-us" className="pp-text-link">About</Link>
          </div>

          {/* Desktop Right Button Row */}
          <div className="pp-nav-links desktop-only">
            {isAuthenticated && roleDashboard && (
              <button className="pp-nav-pill pp-admin" onClick={() => navigate(roleDashboard.path)}>
                <ShieldCheck size={16} />
                <span>{roleDashboard.label}</span>
              </button>
            )}

            {isAuthenticated ? (
              <button className="pp-nav-pill pp-danger" onClick={handleLogout}>
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            ) : (
              <div className="pp-desktop-auth-cluster">
                <button className="pp-nav-pill pp-dark" onClick={() => navigate('/signin')}>
                  <LogIn size={16} />
                  <span>Login</span>
                </button>
                <button className="pp-nav-pill pp-primary" onClick={() => navigate('/signup')}>
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Dedicated Small Mobile Target Primary Action Button */}
          {!isAuthenticated && (
            <button className="pp-nav-pill pp-primary mobile-cta-only" onClick={() => navigate('/signup')}>
              Get Started
            </button>
          )}

          {/* Menu Drawer Toggle Link */}
          <button 
            className="pp-mobile-menu-toggle" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer Modal Container */}
      {isMobileMenuOpen && (
        <div className="pp-mobile-drawer">
          <a href="https://docs.prevpaper.fun" target="_blank" rel="noopener noreferrer">Docs</a>
          <Link to="/about-us" onClick={closeMobileMenu}>About</Link>
          
          <div className="pp-mobile-divider" />

          {isAuthenticated && roleDashboard && (
            <button className="pp-nav-pill pp-admin pp-w-full" onClick={() => { navigate(roleDashboard.path); closeMobileMenu(); }}>
              <ShieldCheck size={16} />
              <span>{roleDashboard.label}</span>
            </button>
          )}

          {isAuthenticated ? (
            <button className="pp-nav-pill pp-danger pp-w-full" onClick={handleLogout}>
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          ) : (
            <div className="pp-mobile-auth-stack">
              <button className="pp-nav-pill pp-dark pp-w-full" onClick={() => { navigate('/signin'); closeMobileMenu(); }}>
                <LogIn size={16} />
                <span>Login</span>
              </button>
              <button className="pp-nav-pill pp-primary pp-w-full" onClick={() => { navigate('/signup'); closeMobileMenu(); }}>
                Get Started
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        .pp-navbar-container {
          font-family: 'Geist Variable', system-ui, sans-serif;
          height: 70px;
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          position: sticky;
          top: 0;
          z-index: 200;
          border-bottom: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
          width: 100%;
          box-sizing: border-box;
        }

        .pp-nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 32px;
          box-sizing: border-box;
        }

        .pp-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 800;
          font-size: 20px;
          color: #0f172a;
          cursor: pointer;
          white-space: nowrap;
          user-select: none;
        }

        .pp-logo-box {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #3cd3ad, #14b8a6);
          color: white;
          border-radius: 8px;
          box-shadow: 0 10px 24px rgba(20, 184, 166, 0.24);
          font-weight: 900;
        }

        .pp-nav-actions-wrapper {
          display: flex;
          align-items: center;
          gap: 32px; /* Increased padding gap context for professional spacing */
        }

        .pp-desktop-links-group {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .pp-text-link {
          text-decoration: none;
          color: #475569 !important;
          font-size: 14px;
          font-weight: 700;
          white-space: nowrap;
          transition: color 0.2s ease;
        }

        .pp-text-link:hover {
          color: #0f766e !important;
        }

        .pp-nav-links {
          display: flex;
          align-items: center;
        }

        .pp-desktop-auth-cluster {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .pp-nav-pill {
          height: 38px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 1px solid transparent;
          border-radius: 8px;
          padding: 0 14px;
          font-size: 14px;
          font-weight: 800;
          line-height: 1;
          white-space: nowrap;
          cursor: pointer;
          box-sizing: border-box;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }

        .pp-nav-pill:hover {
          transform: translateY(-1px);
        }

        .pp-nav-pill.pp-dark {
          background: #0f172a;
          color: #ffffff;
          box-shadow: 0 10px 20px rgba(15, 23, 42, 0.16);
        }

        .pp-nav-pill.pp-primary {
          background: #3cd3ad;
          color: #ffffff;
          box-shadow: 0 10px 20px rgba(60, 211, 173, 0.22);
        }

        .pp-nav-pill.pp-admin {
          background: #0f766e;
          color: #ffffff;
          box-shadow: 0 10px 20px rgba(15, 118, 110, 0.22);
        }

        .pp-nav-pill.pp-danger {
          background: #ffffff;
          color: #be123c;
          border-color: #fecdd3;
          box-shadow: 0 8px 18px rgba(190, 18, 60, 0.08);
        }

        .mobile-cta-only {
          display: none;
        }

        .pp-mobile-menu-toggle {
          display: none;
          background: none;
          border: none;
          color: #0f172a;
          cursor: pointer;
          padding: 6px;
        }

        /* Responsive Breakpoints definitions */
        @media (max-width: 900px) {
          .pp-nav-content {
            padding: 0 16px;
          }

          .pp-nav-actions-wrapper { gap: 8px; }

          .desktop-only, .pp-desktop-links-group {
            display: none !important;
          }

          .mobile-cta-only {
            display: inline-flex;
            height: 32px;
            font-size: 12px;
            padding: 0 10px;
            font-weight: 700;
          }

          .pp-mobile-menu-toggle {
            display: block;
          }

          .pp-mobile-drawer {
            position: absolute;
            top: 70px;
            left: 0;
            width: 100%;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(15, 23, 42, 0.08);
            padding: 20px 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08);
            z-index: 199;
          }

          .pp-mobile-drawer a {
            text-decoration: none;
            color: #475569;
            font-size: 15px;
            font-weight: 700;
            padding: 10px 8px;
            border-radius: 6px;
          }

          .pp-mobile-divider {
            height: 1px;
            background: rgba(15, 23, 42, 0.06);
            margin: 4px 0;
          }

          .pp-mobile-auth-stack {
            display: flex;
            flex-direction: column;
            gap: 10px;
            width: 100%;
          }

          .pp-nav-pill.pp-w-full {
            width: 100%;
            height: 42px;
          }
        }

        @media (max-width: 375px) {
          .pp-logo-text {
            display: none;
          }
          .pp-nav-actions-wrapper {
            gap: 8px;
          }
        }

        @media (max-width: 540px) {
          .mobile-cta-only { display: none; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
