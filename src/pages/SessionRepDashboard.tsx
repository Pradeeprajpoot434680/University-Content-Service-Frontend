



import React, { useState } from 'react';
import { Book, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import SubjectsView from './SubjectsView';
import VerificationQueue from './VerificationQueue';

const SessionRepDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'SUBJECTS' | 'VERIFY' | 'APPROVED' | 'DISPUTED'
  >('SUBJECTS');

  const renderView = () => {
    switch (activeTab) {
      case 'SUBJECTS':
        return <SubjectsView />;

      case 'VERIFY':
        return <VerificationQueue/>

      case 'APPROVED':
        return <div>Approved Papers Page</div>;

      case 'DISPUTED':
        return <div>Disputed Content Page</div>;

      default:
        return <SubjectsView />;
    }
  };

  return (
    <div className="session-container">
      {/* SIDEBAR */}
      <aside className="session-sidebar">
        <div className="logo-section">
          <div className="role-badge">SESSION REP</div>
          <span className="logo-text">PrevPaper</span>
        </div>

        <nav className="session-nav">
          <div
            className={`nav-item ${activeTab === 'SUBJECTS' ? 'active' : ''}`}
            onClick={() => setActiveTab('SUBJECTS')}
          >
            <Book size={18} /> Subjects
          </div>

          <div
            className={`nav-item ${activeTab === 'VERIFY' ? 'active' : ''}`}
            onClick={() => setActiveTab('VERIFY')}
          >
            <Clock size={18} /> Verification Queue
          </div>

          <div
            className={`nav-item ${activeTab === 'APPROVED' ? 'active' : ''}`}
            onClick={() => setActiveTab('APPROVED')}
          >
            <CheckCircle size={18} /> Approved Papers
          </div>

          <div
            className={`nav-item ${activeTab === 'DISPUTED' ? 'active' : ''}`}
            onClick={() => setActiveTab('DISPUTED')}
          >
            <AlertCircle size={18} /> Disputed Content
          </div>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="session-main">
        {renderView()}
      </main>

      {/* STYLES (reuse yours) */}
      <style>{`
        .session-container {
          --session-sidebar-width: 260px;
          min-height: 100vh;
          background: #f1f5f9;
          overflow: hidden;
        }
        .session-sidebar {
          position: fixed;
          inset: 0 auto 0 0;
          width: var(--session-sidebar-width);
          height: 100vh;
          background: #fff;
          border-right: 1px solid #e2e8f0;
          padding: 30px 20px;
          box-sizing: border-box;
          overflow: hidden;
        }
        .role-badge { background: #1e293b; color: #3cd3ad; font-size: 10px; font-weight: 900; padding: 2px 8px; border-radius: 4px; display: inline-block; margin-bottom: 5px; }
        .logo-text { display: block; font-weight: 800; font-size: 20px; color: #1e293b; }

        .session-nav { margin-top: 40px; }
        .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 10px; cursor: pointer; color: #64748b; margin-bottom: 8px; font-weight: 600; }
        .nav-item.active { background: #3cd3ad15; color: #3cd3ad; }

        .session-main {
          width: calc(100vw - var(--session-sidebar-width));
          height: 100vh;
          margin-left: var(--session-sidebar-width);
          padding: 40px;
          box-sizing: border-box;
          overflow-y: auto;
          overflow-x: hidden;
        }

        @media (max-width: 820px) {
          .session-container {
            overflow: visible;
          }
          .session-sidebar {
            position: sticky;
            inset: auto;
            bottom: 0;
            z-index: 30;
            width: 100%;
            height: auto;
            padding: 12px;
            border-right: 0;
            border-top: 1px solid #e2e8f0;
          }
          .logo-section {
            display: none;
          }
          .session-nav {
            margin-top: 0;
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px;
          }
          .nav-item {
            justify-content: center;
            margin-bottom: 0;
            font-size: 13px;
          }
          .session-main {
            width: 100%;
            height: auto;
            min-height: 100vh;
            margin-left: 0;
            padding: 20px 16px 96px;
            overflow: visible;
          }
        }
      `}</style>
    </div>
  );
};

export default SessionRepDashboard;
