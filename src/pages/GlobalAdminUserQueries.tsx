import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '../store/authStore';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { API_BASE_URL } from '../config';

interface Query {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'PENDING' | 'RESOLVED';
  createdAt: string;
}

const GlobalAdminUserQueries: React.FC = () => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  useEscapeKey(() => setSelectedQuery(null), Boolean(selectedQuery));

  const token = useAuthStore.getState().accessToken;

  // ================= FETCH QUERIES =================
  const fetchQueries = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/v1/global-admin/queries`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setQueries(res.data.data);
      } else {
        toast.error(res.data.message || 'Failed to load queries');
      }
    } catch {
      toast.error('Server connection error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  // ================= MARK AS RESOLVED =================
  const handleResolve = async (id: string) => {
    setResolvingId(id);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/global-admin/resolve-query`,
        { queryId: id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        toast.success('Query marked as resolved');
        fetchQueries();
      } else {
        toast.error(res.data.message || 'Failed');
      }
    } catch {
      toast.error('Server error');
    } finally {
      setResolvingId(null);
    }
  };

  return (
    <div className="queries-container">

      {/* HEADER */}
      <div className="header">
        <h2>User Queries</h2>
        <p>Manage and respond to user issues</p>
      </div>

      {/* TABLE */}
      <div className="table-container">
        {loading ? (
          <div className="loading-container">
            <Loader2 size={22} className="animate-spin" />
            <span>Loading queries...</span>
          </div>
        ) : (
          <table className="queries-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Message</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {queries.map((q) => (
                <tr key={q.id}>
                  <td>
                    <strong>{q.name}</strong>
                    <br />
                    <span className="email">{q.email}</span>
                  </td>

                  <td className="message-preview">
                    {q.message.length > 40
                      ? q.message.slice(0, 40) + '...'
                      : q.message}
                  </td>

                  <td>
                    {new Date(q.createdAt).toLocaleDateString()}
                  </td>

                  <td>
                    <span className={`status ${q.status.toLowerCase()}`}>
                      {q.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="view-btn"
                      onClick={() => setSelectedQuery(q)}
                    >
                      View
                    </button>

                    {q.status === 'PENDING' && (
                      <button
                        className="resolve-btn"
                        onClick={() => handleResolve(q.id)}
                        disabled={resolvingId === q.id}
                      >
                        {resolvingId === q.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          'Resolve'
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {selectedQuery && (
        <div className="modal-overlay">
          <div className="modal">

            <div className="modal-header">
              <h3>{selectedQuery.name}</h3>
              <p>{selectedQuery.email}</p>
            </div>

            <div className="modal-body">
              <MessageSquare size={18} />
              <p>{selectedQuery.message}</p>
            </div>

            <button
              className="close-btn"
              onClick={() => setSelectedQuery(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ================= CSS ================= */}
      <style>{`
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
        }

        td {
          padding: 14px;
          border-bottom: 1px solid #eee;
        }

        .email {
          font-size: 12px;
          color: #64748b;
        }

        .message-preview {
          color: #374151;
        }

        .status {
          font-weight: 600;
          font-size: 12px;
        }

        .status.pending {
          color: #f59e0b;
        }

        .status.resolved {
          color: #16a34a;
        }

        .view-btn {
          margin-right: 8px;
          background: #e0f2fe;
          color: #0284c7;
          border: none;
          padding: 5px 10px;
          border-radius: 6px;
          cursor: pointer;
        }

        .resolve-btn {
          background: #ecfdf5;
          color: #10b981;
          border: none;
          padding: 5px 10px;
          border-radius: 6px;
          cursor: pointer;
        }

        /* MODAL */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .modal {
          background: white;
          padding: 24px;
          border-radius: 12px;
          width: 400px;
        }

        .modal-header h3 {
          margin: 0;
        }

        .modal-body {
          display: flex;
          gap: 10px;
          margin-top: 15px;
          color: #374151;
        }

        .close-btn {
          margin-top: 20px;
          width: 100%;
          padding: 8px;
          border: none;
          border-radius: 8px;
          background: #ef4444;
          color: white;
          cursor: pointer;
        }

        .loading-container {
          display: flex;
          gap: 10px;
          justify-content: center;
          align-items: center;
          padding: 20px;
          color: #64748b;
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

export default GlobalAdminUserQueries;
