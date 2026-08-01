import React, { useState } from 'react';
import { Grid, Users, Settings, Layout } from 'lucide-react';

// Import your new page components
import DepartmentsView from './DepartmentsView';
import DeptRepsView from './DeptRepsView';
import ExamFormatsView from './ExamFormatsView';
import Header from '../components/Header';
import { useAuthStore } from '../store/authStore';
// import UniSettingsView from './UniSettingsView';

const UniversityRepDashboard: React.FC = () => {
  // Navigation state
  const [activeTab, setActiveTab] = useState<'DEPT' | 'EXAM' | 'REPS' | 'SETTINGS'>('DEPT');

  const universityName = "Central University of Rajasthan";
  const universityId = useAuthStore.getState().user?.universityId; // In production, get this from your Auth context

  // Helper to render the active component
  const renderActiveView = () => {
    switch (activeTab) {
      case 'DEPT': return <DepartmentsView universityId={universityId!} />;
      case 'EXAM': return <ExamFormatsView universityId={universityId!} />;
      case 'REPS': return <DeptRepsView universityId={universityId!} />;
      // case 'SETTINGS': return <UniSettingsView universityId={universityId} />;
      default: return <DepartmentsView universityId={universityId!} />;
    }
  };

  return (
    <div className="rep-container">
      {/* SIDEBAR */}
      <aside className="rep-sidebar">
        <div className="logo-section">
          <div className="role-badge">UNI REP</div>
          <span className="logo-text">PrevPaper</span>
        </div>
        
        <nav className="rep-nav">
          <div 
            className={`nav-item ${activeTab === 'DEPT' ? 'active' : ''}`}
            onClick={() => setActiveTab('DEPT')}
          >
            <Grid size={18} /> Departments
          </div>
          <div 
            className={`nav-item ${activeTab === 'EXAM' ? 'active' : ''}`}
            onClick={() => setActiveTab('EXAM')}
          >
            <Layout size={18} /> Exam Formats
          </div>
          <div 
            className={`nav-item ${activeTab === 'REPS' ? 'active' : ''}`}
            onClick={() => setActiveTab('REPS')}
          >
            <Users size={18} /> Dept Representatives
          </div>
          <div 
            className={`nav-item ${activeTab === 'SETTINGS' ? 'active' : ''}`}
            onClick={() => setActiveTab('SETTINGS')}
          >
            <Settings size={18} /> Uni Settings
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="rep-main">
        <Header/>
        <header className="rep-header">
          <div>
            <h1>{universityName}</h1>
            <p className="subtitle">
              {activeTab === 'DEPT' && "Manage university departments and codes"}
              {activeTab === 'EXAM' && "Configure global exam types and ordering"}
              {activeTab === 'REPS' && "Manage departmental administrative access"}
              {activeTab === 'SETTINGS' && "Update university profile and preferences"}
            </p>
          </div>
        </header>

        {/* Dynamic View Rendering */}
        <div className="view-content">
          {renderActiveView()}
        </div>
      </main>

      <style>{`
        .rep-container { display: flex; min-height: 100vh; background: #f8fafc; }
        .rep-sidebar { width: 260px; background: #fff; border-right: 1px solid #e2e8f0; padding: 30px 20px; position: sticky; top: 0; height: 100vh; }
        .logo-section { margin-bottom: 40px; }
        .rep-nav { display: flex; flex-direction: column; gap: 5px; }
        .nav-item { 
          display: flex; align-items: center; gap: 12px; padding: 12px; 
          border-radius: 10px; cursor: pointer; color: #64748b; 
          font-weight: 500; transition: all 0.2s ease;
        }
        .nav-item:hover { background: #f1f5f9; color: #1e293b; }
        .nav-item.active { background: #3cd3ad15; color: #3cd3ad; }
        
        .rep-main { flex: 1; padding: 40px; overflow-y: auto; }
        .rep-header { margin-bottom: 30px; }
        .rep-header h1 { font-size: 26px; color: #1e293b; margin: 0; }
        .subtitle { color: #64748b; margin-top: 4px; font-size: 14px; }
        .view-content { animation: fadeIn 0.3s ease; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 820px) {
          .rep-container { display: block; }
          .rep-sidebar { position: sticky; top: 0; z-index: 30; width: 100%; height: auto; padding: 12px 16px; border-right: 0; border-bottom: 1px solid #e2e8f0; }
          .rep-sidebar .logo-section { display: none; }
          .rep-nav { flex-direction: row; overflow-x: auto; gap: 8px; }
          .rep-nav .nav-item { flex: 0 0 auto; white-space: nowrap; padding: 9px 12px; font-size: 13px; }
          .rep-main { padding: 20px 16px 32px; overflow: visible; }
          .rep-header { margin-bottom: 20px; }
        }
      `}</style>
    </div>
  );
};

export default UniversityRepDashboard;
