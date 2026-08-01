import React, { useEffect, useState } from 'react';
import { MoreVertical } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

interface SessionRep {
  assignmentId: string;
  userId: string;
  fullName: string;
  email: string;
  sessionId: string;
  sessionName: string;
  batchRange: string;
  assignedAt: string;
  isActive: boolean;
}

interface Props {
  programId: string;
}

const SessionRepsView: React.FC<Props> = ({ programId }) => {
  const [reps, setReps] = useState<SessionRep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = useAuthStore.getState().accessToken;

  const fetchReps = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:8080/api/v1/program-rep/${programId}/all-session-reps`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setReps(res.data.data);
      } else {
        setError('Failed to fetch session representatives');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (programId) fetchReps();
  }, [programId]);

  return (
    <div className="session-reps-view">
      <header className="header">
        <h1>Session Representatives</h1>
      </header>

      <section className="table-section">
        <div className="table-card">
          <table className="rep-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Session</th>
                <th>Batch</th>
                <th>Assigned At</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7}>Loading...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7}>{error}</td>
                </tr>
              ) : reps.length === 0 ? (
                <tr>
                  <td colSpan={7}>No session representatives found</td>
                </tr>
              ) : (
                reps.map((rep) => (
                  <tr key={rep.assignmentId}>
                    <td>{rep.fullName}</td>
                    <td>{rep.email}</td>
                    <td>{rep.sessionName}</td>
                    <td>{rep.batchRange}</td>
                    <td>{new Date(rep.assignedAt).toLocaleString()}</td>
                    <td>{rep.isActive ? 'Active' : 'Inactive'}</td>
                    <td>
                      <MoreVertical size={18} color="#cbd5e1" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <style>{`
        .header h1 {
          font-size: 26px;
          color: #1e293b;
          margin-bottom: 20px;
        }
        .table-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }
        .rep-table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          padding: 16px 20px;
          text-align: left;
          font-size: 14px;
        }
        th {
          background: #f8fafc;
          color: #64748b;
          text-transform: uppercase;
          border-bottom: 1px solid #e2e8f0;
        }
        td {
          border-bottom: 1px solid #f1f5f9;
        }
      `}</style>
    </div>
  );
};

export default SessionRepsView;