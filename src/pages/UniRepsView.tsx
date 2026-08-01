import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '../store/authStore';

// ================= TYPES =================
interface UniversityRep {
  assignmentId: string;
  userId: string;
  fullName: string;
  email: string;
  universityId: string | null;
  universityName: string;
  universityCode: string;
  assignedAt: string;
  isActive: boolean;
}

const UniRepsView: React.FC = () => {
  const [reps, setReps] = useState<UniversityRep[]>([]);
  const [loading, setLoading] = useState(true);

  const token = useAuthStore.getState().accessToken;

  // ================= FETCH REPS =================
  const fetchReps = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/get/all-university-reps`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setReps(res.data.data);
      } else {
        toast.error(res.data.message || 'Failed to load reps');
      }
    } catch (err) {
      toast.error('Server error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReps();
  }, []);

  return (
    <div className="rep-container">

      {/* HEADER */}
      <div className="header">
        <h2>University Representatives</h2>
        <p>List of all assigned university representatives</p>
      </div>

      {/* TABLE */}
      <div className="table-container">
        {loading ? (
          <div className="loading-container">
            <Loader2 size={22} className="animate-spin" />
            <span>Loading representatives...</span>
          </div>
        ) : (
          <table className="rep-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>University</th>
                <th>Code</th>
                <th>Status</th>
                <th>Assigned At</th>
              </tr>
            </thead>

            <tbody>
              {reps.length > 0 ? (
                reps.map((rep) => (
                  <tr key={rep.assignmentId}>
                    <td className="name">{rep.fullName || 'N/A'}</td>
                    <td>{rep.email || 'N/A'}</td>
                    <td>{rep.universityName}</td>
                    <td>{rep.universityCode}</td>

                    <td>
                      <span className={`status ${rep.isActive ? 'active' : 'inactive'}`}>
                        {rep.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    <td>
                      {new Date(rep.assignedAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="no-data">
                    No representatives found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ================= CSS ================= */}
      <style>{`
        .rep-container {
          width: 100%;
        }

        .header h2 {
          margin: 0;
          font-size: 22px;
        }

        .header p {
          color: #64748b;
          margin-bottom: 20px;
        }

        .table-container {
          background: white;
          border-radius: 12px;
          overflow: hidden;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          background: #f9fafb;
          padding: 14px;
          font-size: 13px;
          color: #6b7280;
          text-align: left;
        }

        td {
          padding: 14px;
          border-bottom: 1px solid #eee;
        }

        .name {
          font-weight: 600;
        }

        .status {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .status.active {
          background: #dcfce7;
          color: #16a34a;
        }

        .status.inactive {
          background: #fee2e2;
          color: #dc2626;
        }

        .loading-container {
          display: flex;
          gap: 10px;
          justify-content: center;
          align-items: center;
          padding: 20px;
          color: #64748b;
        }

        .no-data {
          text-align: center;
          padding: 20px;
          color: #9ca3af;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default UniRepsView;