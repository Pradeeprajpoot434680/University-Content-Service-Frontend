import React, { useState, useEffect } from 'react';
import { Milestone, Users, ClipboardCheck, Loader2 } from 'lucide-react';
import SessionsView from './SessionsView';
import SessionRepsView from './SessionRepsView';
import Header from '../components/Header';
import { useAuthStore, api } from '../store/authStore';

interface ProgramDetails {
  id: string;
  name: string;
  deptName: string;
  durationYears: number;
}

const ProgramRepDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'SESSIONS' | 'REPS' | 'VERIFY'>('SESSIONS');
  const [programDetails, setProgramDetails] = useState<ProgramDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 🟢 Read user and scopeId (programId for PROG_REP) from Zustand store
  const user = useAuthStore((state) => state.user);
  const programId = user?.scopeId || '';

  useEffect(() => {
    const fetchProgramDetails = async () => {
      if (!programId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await api.get(`/api/v1/program/${programId}`);
        const data = res.data?.data || res.data;

        setProgramDetails({
          id: programId,
          name: data?.name || 'Program',
          deptName: data?.departmentName || 'Department',
          durationYears: data?.durationYears || 4,
        });
      } catch (err) {
        console.error('Failed to fetch program metadata:', err);
        // Fallback state on error
        setProgramDetails({
          id: programId,
          name: 'Program',
          deptName: 'Department',
          durationYears: 4,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProgramDetails();
  }, [programId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center', padding: '100px' }}>
        <Loader2 className="animate-spin" size={28} />
        <span>Loading program workspace...</span>
      </div>
    );
  }

  const program = programDetails || {
    id: programId,
    name: 'Program',
    deptName: 'Department',
    durationYears: 4,
  };

  const renderView = () => {
    switch (activeTab) {
      case 'SESSIONS':
        return (
          <SessionsView 
            programId={program.id}  
            programName={program.name} 
            deptName={program.deptName} 
          />
        );
      case 'REPS':
        return <SessionRepsView programId={program.id} />;
      case 'VERIFY':
        return <div>Verification Queue Coming Soon</div>;
      default:
        return (
          <SessionsView 
            programId={program.id} 
            programName={program.name} 
            deptName={program.deptName} 
          />
        );
    }
  };

  return (
    <div className="prog-container">
      {/* SIDEBAR */}
      <aside className="prog-sidebar">
        <div className="logo-section">
          <div className="role-badge">PROG REP</div>
          <span className="logo-text">PrevPaper</span>
        </div>
        
        <nav className="prog-nav">
          <div
            className={`nav-item ${activeTab === 'SESSIONS' ? 'active' : ''}`}
            onClick={() => setActiveTab('SESSIONS')}
          >
            <Milestone size={18} /> Sessions (Years)
          </div>

          <div
            className={`nav-item ${activeTab === 'REPS' ? 'active' : ''}`}
            onClick={() => setActiveTab('REPS')}
          >
            <Users size={18} /> Year Leaders
          </div>

          <div
            className={`nav-item ${activeTab === 'VERIFY' ? 'active' : ''}`}
            onClick={() => setActiveTab('VERIFY')}
          >
            <ClipboardCheck size={18} /> Verification Queue
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="prog-main">
        <Header />
        {renderView()}
      </main>

      <style>{`
        .prog-container { display: flex; min-height: 100vh; background: #f9fafb; }
        .prog-sidebar { width: 250px; background: #1e293b; color: white; padding: 30px 20px; }
        .role-badge { background: #3cd3ad; color: white; font-size: 10px; font-weight: 900; padding: 2px 8px; border-radius: 4px; display: inline-block; margin-bottom: 5px; }
        .logo-text { display: block; font-weight: 800; font-size: 20px; }
        
        .prog-nav { margin-top: 40px; }
        .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 10px; cursor: pointer; color: #94a3b8; margin-bottom: 8px; transition: 0.2s; }
        .nav-item.active { background: rgba(255,255,255,0.1); color: #3cd3ad; }

        .prog-main { flex: 1; padding: 40px; }
        @media (max-width: 820px) {
          .prog-container { display: block; }
          .prog-sidebar { position: sticky; top: 0; z-index: 30; width: 100%; padding: 12px 16px; }
          .prog-sidebar .logo-section { display: none; }
          .prog-nav { display: flex; gap: 8px; margin-top: 0; overflow-x: auto; }
          .prog-nav .nav-item { flex: 0 0 auto; margin-bottom: 0; white-space: nowrap; padding: 9px 12px; font-size: 13px; }
          .prog-main { padding: 20px 16px 32px; }
        }
      `}</style>
    </div>
  );
};

export default ProgramRepDashboard;
