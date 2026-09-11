import React, { useEffect, useState } from 'react';
import { ChevronRight, Plus, BookOpen, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { api, normalizeOptionalId, useAuthStore } from '../store/authStore';
import AddSubjectModal from '../components/AddSubjectModal';

const SubjectsView: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const sessionId = normalizeOptionalId(user?.scopeId);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [activeSemester, setActiveSemester] = useState<any>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ✅ FETCH DASHBOARD
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get(`/api/v1/session-rep/${sessionId}/dashboard`);
        const sems = res.data.data.semesterStats;

        setSemesters(sems);
        if (sems.length > 0) setActiveSemester(sems[0]);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboard();
  }, []);

  // ✅ FETCH SUBJECTS
  const fetchSubjects = async () => {
    if (!activeSemester) return;

    setLoading(true);
    try {
      const res = await api.get(
        `/api/v1/session-rep/${sessionId}/semesters/${activeSemester.semesterId}/subjects`
      );
      setSubjects(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [activeSemester]);

  // ✅ DELETE SUBJECT
  const handleDelete = async (subjectId: string) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) return;

    setDeletingId(subjectId);
    try {
      const res = await api.delete(
        `/api/v1/session-rep/${sessionId}/semesters/${activeSemester.semesterId}/subjects/${subjectId}`
      );
      if (res.data.success) {
        toast.success(res.data.message || 'Subject deleted');
        // Keep the header stat count in sync without waiting for a dashboard refetch
        setActiveSemester((prev: any) =>
          prev ? { ...prev, subjectCount: Math.max(0, (prev.subjectCount || 1) - 1) } : prev
        );
        await fetchSubjects();
      } else {
        toast.error(res.data.message || 'Failed to delete subject');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Server connection error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="subjects-view">

      {/* HEADER */}
      <header className="header">
        <div>
          <h1>Subjects Management</h1>
          <p className="sub-text">
            Semester {activeSemester?.semesterNumber || '-'}
          </p>
        </div>

        <div className="sem-selector">
          {semesters.map((sem) => (
            <button
              key={sem.semesterId}
              className={activeSemester?.semesterId === sem.semesterId ? 'active' : ''}
              onClick={() => setActiveSemester(sem)}
            >
              Sem {sem.semesterNumber}
            </button>
          ))}
        </div>
      </header>

      {/* STATS */}
      <div className="stats">
        <StatCard title="Subjects" value={activeSemester?.subjectCount} />
        <StatCard title="Pending" value={activeSemester?.pendingVerifications} />
        <StatCard title="Resources" value={activeSemester?.totalResources} />
      </div>

      {/* SUBJECT LIST */}
      <div className="table-card">
        <div className="table-header">
          <h3>Subjects</h3>

          <button className="add-btn" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Add Subject
          </button>
        </div>

        {loading ? (
          <p className="empty">Loading subjects...</p>
        ) : subjects.length === 0 ? (
          <p className="empty">No subjects found</p>
        ) : (
          <div className="subject-list">
            {subjects.map((s) => (
              <SubjectRow
                key={s.subjectId}
                name={s.subjectName}
                code={s.subjectCode}
                deleting={deletingId === s.subjectId}
                onDelete={() => handleDelete(s.subjectId)}
              />
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && activeSemester && (
        <AddSubjectModal
          semesterId={activeSemester.semesterId}
          sessionId={sessionId || ""}
          onClose={() => setShowModal(false)}
          onSuccess={fetchSubjects}
        />
      )}

      {/* STYLES */}
      <style>{`
        .subjects-view {
          padding: 30px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }

        .header h1 {
          margin: 0;
          font-size: 24px;
          color: #1e293b;
        }

        .sub-text {
          font-size: 13px;
          color: #64748b;
          margin-top: 4px;
        }

        .sem-selector {
          background: #e2e8f0;
          padding: 4px;
          border-radius: 10px;
          display: flex;
        }

        .sem-selector button {
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          background: transparent;
          font-weight: 600;
          color: #64748b;
        }

        .sem-selector button.active {
          background: white;
          color: #1e293b;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 20px;
          margin-bottom: 25px;
        }

        .mini-card {
          background: white;
          padding: 18px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .mini-card p {
          margin: 0;
          font-size: 12px;
          color: #64748b;
        }

        .mini-card h3 {
          margin-top: 6px;
          font-size: 22px;
        }

        .table-card {
          background: white;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          padding: 20px;
        }

        .table-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
        }

        .add-btn {
          background: #3cd3ad;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
        }

        .subject-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          border: 1px solid #f1f5f9;
          border-radius: 10px;
          margin-bottom: 10px;
          cursor: pointer;
          transition: 0.2s;
        }

        .subject-row:hover {
          border-color: #3cd3ad;
          background: #f8fffd;
        }

        .left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .icon {
          background: #f1f5f9;
          padding: 8px;
          border-radius: 8px;
        }

        .code {
          font-size: 12px;
          color: #94a3b8;
        }

        .row-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .delete-btn {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .delete-btn:hover:not(:disabled) {
          color: #ef4444;
          background: #fee2e2;
        }

        .delete-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .sv-spin {
          animation: sv-spin 1s linear infinite;
        }

        @keyframes sv-spin {
          to { transform: rotate(360deg); }
        }

        .empty {
          text-align: center;
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
};

// ✅ COMPONENTS

const StatCard = ({ title, value }: any) => (
  <div className="mini-card">
    <p>{title}</p>
    <h3>{value || 0}</h3>
  </div>
);

const SubjectRow = ({ name, code, deleting, onDelete }: any) => (
  <div className="subject-row">
    <div className="left">
      <div className="icon">
        <BookOpen size={16} />
      </div>
      <div>
        <strong>{name}</strong>
        <div className="code">{code}</div>
      </div>
    </div>

    <div className="row-actions">
      <button
        className="delete-btn"
        title="Delete subject"
        disabled={deleting}
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.();
        }}
      >
        {deleting ? <Loader2 size={18} className="sv-spin" /> : <Trash2 size={18} />}
      </button>
      <ChevronRight size={18} />
    </div>
  </div>
);

export default SubjectsView;