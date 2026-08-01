import React, { useState } from 'react';
import { LayoutDashboard, FileText, Upload, LogOut, LogIn } from 'lucide-react';

// 👉 Dummy pages (we'll replace later)
const DashboardHome = () => <div>Dashboard Home</div>;
const GetPapers = () => <div>Get Papers Page</div>;
const UploadContent = () => <div>Upload Content Page</div>;

const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'HOME' | 'PAPERS' | 'UPLOAD'>('HOME');

  // 🔥 Later replace with auth/global state
  const user = {
    name: "Aman Sharma",
    email: "aman@email.com",
    isLoggedIn: true,
  };

  const renderView = () => {
    switch (activeTab) {
      case 'HOME':
        return <DashboardHome />;
      case 'PAPERS':
        return <GetPapers />;
      case 'UPLOAD':
        return <UploadContent />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="user-container">
      
      {/* SIDEBAR */}
      <aside className="user-sidebar">
        
        {/* LOGO */}
        <div className="logo-section">
          <span className="logo-text">PrevPaper</span>
        </div>

        {/* NAV */}
        <nav className="user-nav">
          <NavItem
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            active={activeTab === 'HOME'}
            onClick={() => setActiveTab('HOME')}
          />

          <NavItem
            icon={<FileText size={18} />}
            label="Get Papers"
            active={activeTab === 'PAPERS'}
            onClick={() => setActiveTab('PAPERS')}
          />

          <NavItem
            icon={<Upload size={18} />}
            label="Upload Content"
            active={activeTab === 'UPLOAD'}
            onClick={() => setActiveTab('UPLOAD')}
          />
        </nav>

        {/* BOTTOM SECTION */}
        <div className="sidebar-bottom">
          
          {/* PROFILE */}
          <div className="profile-box">
            <div className="avatar">
              {user.name[0]}
            </div>
            <div>
              <p className="name">{user.name}</p>
              <p className="email">{user.email}</p>
            </div>
          </div>

          {/* AUTH BUTTON */}
          {user.isLoggedIn ? (
            <button className="auth-btn logout">
              <LogOut size={16} /> Logout
            </button>
          ) : (
            <button className="auth-btn login">
              <LogIn size={16} /> Login
            </button>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="user-main">
        {renderView()}
      </main>

      {/* STYLES */}
      <style>{`
        .user-container {
          display: flex;
          min-height: 100vh;
          background: #f4f7f6;
        }

        .user-sidebar {
          width: 260px;
          background: #1e293b;
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 30px 20px;
        }

        .logo-text {
          font-size: 20px;
          font-weight: 800;
        }

        .user-nav {
          margin-top: 40px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 10px;
          cursor: pointer;
          color: #94a3b8;
          margin-bottom: 8px;
          transition: 0.2s;
          font-weight: 500;
        }

        .nav-item:hover {
          background: rgba(255,255,255,0.08);
          color: white;
        }

        .nav-item.active {
          background: rgba(255,255,255,0.12);
          color: #3cd3ad;
        }

        .user-main {
          flex: 1;
          padding: 40px;
        }

        .sidebar-bottom {
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 20px;
        }

        .profile-box {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
        }

        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #3cd3ad20;
          color: #3cd3ad;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .name {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
        }

        .email {
          margin: 0;
          font-size: 12px;
          color: #94a3b8;
        }

        .auth-btn {
          width: 100%;
          padding: 10px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-weight: 600;
        }

        .logout {
          background: #ef4444;
          color: white;
        }

        .login {
          background: #3cd3ad;
          color: white;
        }
      `}</style>
    </div>
  );
};

// ✅ Reusable NavItem
const NavItem = ({ icon, label, active, onClick }: any) => (
  <div className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
    {icon}
    {label}
  </div>
);

export default StudentDashboard;