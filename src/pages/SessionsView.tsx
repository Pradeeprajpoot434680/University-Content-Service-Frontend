import React, { useEffect, useState } from 'react';
import { Calendar, UserPlus, MoreVertical, ArrowRight } from 'lucide-react';
import AssignRepModal from '../components/AssignRepModal';
import AddSessionModal from '../components/AddSessionModal';
import { api } from '../store/authStore';
import { toast } from 'sonner';
import { API_BASE_URL } from '../config';

interface SessionsViewProps {
  programId: string;
  programName: string;
  deptName: string;
}

interface Session {
  sessionId: string;
  name: string;
  batchRange: string;
  representativeName?: string;
  representativeEmail?: string;
}

const SessionsView: React.FC<SessionsViewProps> = ({ programId, programName, deptName }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [assigningToSession, setAssigningToSession] = useState<Session | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/api/v1/program-rep/${programId}/dashboard`);
      setSessions(res.data?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load sessions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (programId) loadDashboard();
  }, [programId]);

  return (
    <>
      {/* HEADER */}
      <header className="prog-header">
        <div className="breadcrumb">
          <span>{deptName}</span>
          <ArrowRight size={12} />
          <span>{programName}</span>
        </div>

        <div className="header-main">
          <h1>Session Management</h1>
          <button className="create-btn" onClick={() => setShowCreateModal(true)}>
            + Create Session
          </button>
        </div>

        <p className="subtitle">
          Assign representatives for each academic year/batch
        </p>
      </header>

      {/* LOADING */}
      {isLoading ? (
        <div className="loading">Loading sessions...</div>
      ) : (
        <section className="sessions-grid">
          {sessions.length > 0 ? (
            sessions.map((session) => (
              <div key={session.sessionId} className="session-card">
                
                {/* HEADER */}
                <div className="card-header">
                  <span className="year-label">{session.name}</span>
                  <MoreVertical size={16} color="#94a3b8" />
                </div>

                {/* BATCH */}
                <div className="batch-info">
                  <Calendar size={14} />
                  <span>{session.batchRange}</span>
                </div>

                {/* REP */}
                <div className="rep-box">
                  {session.representativeName ? (
                    <div className="assigned-rep">
                      <div className="avatar">{session.representativeName[0] || '?'}</div>
                      <div>
                        <p className="name">{session.representativeName}</p>
                        <p className="status">{session.representativeEmail || "No Email"}</p>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="empty-assign"
                      onClick={() => setAssigningToSession(session)}
                    >
                      <UserPlus size={16} /> Assign Session Rep
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-data">No sessions found</div>
          )}
        </section>
      )}

      {/* ASSIGN REP MODAL */}
      {assigningToSession && (
        <AssignRepModal
          scopeId={assigningToSession.sessionId}
          scopeName={`${assigningToSession.name} (${programName})`}
          userIdKey="authUserId"
          onClose={() => {
            setAssigningToSession(null);
            loadDashboard();
          }}
          fetchUrl={`${API_BASE_URL}/api/v1/program-rep/${programId}/session/${assigningToSession.sessionId}/students`}
          assignUrl={`${API_BASE_URL}/api/v1/program-rep/${programId}/assign-rep`}
        />
      )}

      {/* CREATE SESSION MODAL */}
      {showCreateModal && (
        <AddSessionModal
          programId={programId}
          onClose={() => setShowCreateModal(false)}
          onSuccess={loadDashboard}
        />
      )}

      {/* STYLES */}
      <style>{`
        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #64748b;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .header-main {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .prog-header h1 {
          font-size: 28px;
          color: #1e293b;
          margin: 0;
        }

        .create-btn {
          background: #3cd3ad;
          color: white;
          border: none;
          padding: 8px 14px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }

        .subtitle {
          color: #64748b;
          margin-top: 5px;
        }

        .sessions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
          margin-top: 30px;
        }

        .session-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 20px;
          transition: 0.2s;
        }

        .session-card:hover {
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
        }

        .year-label {
          font-size: 16px;
          font-weight: 700;
        }

        .batch-info {
          display: flex;
          gap: 6px;
          font-size: 13px;
          color: #64748b;
          margin: 15px 0;
        }

        .assigned-rep {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .avatar {
          width: 32px;
          height: 32px;
          background: #3cd3ad20;
          color: #3cd3ad;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .name {
          margin: 0;
          font-weight: 600;
          font-size: 14px;
        }

        .status {
          margin: 0;
          font-size: 12px;
          color: #64748b;
        }

        .empty-assign {
          width: 100%;
          padding: 10px;
          border: 1px dashed #d1d5db;
          border-radius: 8px;
          cursor: pointer;
          background: #f9fafb;
          font-weight: 600;
          font-size: 13px;
        }

        .empty-assign:hover {
          border-color: #3cd3ad;
          color: #3cd3ad;
        }

        .loading, .no-data {
          text-align: center;
          padding: 40px;
          color: #64748b;
        }
      `}</style>
    </>
  );
};

export default SessionsView;