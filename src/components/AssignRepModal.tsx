


import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import { Search, UserCheck, Calendar, X, Shield } from 'lucide-react';
import { api, useAuthStore } from '../store/authStore';
import { useEscapeKey } from '../hooks/useEscapeKey';

interface AssignRepProps {
  scopeId: string;
  scopeName: string;
  fetchUrl: string;
  assignUrl: string;
  onSuccess?: () => void;
  userIdKey?: string;
  onClose: () => void;
}

const AssignRepModal: React.FC<AssignRepProps> = ({
  scopeId,
  scopeName,
  fetchUrl,
  assignUrl,
  userIdKey = 'userId',
  onClose
}) => {
  useEscapeKey(onClose);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [expiryDate, setExpiryDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<any[]>([]);

  const token = useAuthStore.getState().accessToken;

  // ================= FETCH STUDENTS =================
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get(fetchUrl);

        setStudents(res.data?.data || []);
      } catch (err) {
        console.error('Error fetching students:', err);
      }
    };

    fetchStudents();
  }, [fetchUrl, token]);

  // ================= ASSIGN =================
  const handleAssign = async () => {
    if (!selectedUser) return;

    setLoading(true);

    const payload = {
      userId: selectedUser[userIdKey],
      scopeId,
      expiresAt: expiryDate ? new Date(expiryDate).toISOString() : null
    };

    try {
      await api.post(assignUrl, payload);

      onClose();
    } catch (err) {
      console.error('Error assigning rep:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">

        {/* HEADER */}
        <header className="modal-header">
          <div className="header-left">
            <div className="header-icon">
              <Shield size={18} color="white" />
            </div>
            <div>
              <h3>Assign Representative</h3>
              <p>Promoting user for <strong>{scopeName}</strong></p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </header>

        {/* BODY */}
        <div className="modal-body">
          {!selectedUser ? (
            <>
              <div className="search-box">
                <Search size={16} className="search-icon" />
                <input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="results-list">
                {students
                  .filter(u =>
                    u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map(user => (
                    <div
                      key={user[userIdKey]}
                      className="user-item"
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="avatar">
                        {user.fullName?.[0] || '?'}
                      </div>

                      <div className="meta">
                        <p className="name">{user.fullName}</p>
                        <p className="email">{user.email}</p>
                      </div>

                      <UserCheck size={16} className="check" />
                    </div>
                  ))}
              </div>
            </>
          ) : (
            <div className="confirm-section">
              <div className="selected-card">
                <div className="avatar big">
                  {selectedUser.fullName?.[0] || '?'}
                </div>
                <h4>{selectedUser.fullName}</h4>
                <p>{selectedUser.email}</p>

                <button onClick={() => setSelectedUser(null)} className="change-btn">
                  Change User
                </button>
              </div>

              <div className="expiry">
                <label>
                  <Calendar size={14} />
                  Expiry (optional)
                </label>
                <input
                  type="datetime-local"
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <footer className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>

          <Button
            disabled={!selectedUser || loading}
            onClick={handleAssign}
          >
            {loading ? 'Processing...' : 'Confirm'}
          </Button>
        </footer>
      </div>

      {/* ================= CSS ================= */}
      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }

        .modal-card {
          width: 420px;
          background: white;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }

        /* HEADER */
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #f1f5f9;
        }

        .header-left {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .header-icon {
          background: #3cd3ad;
          padding: 8px;
          border-radius: 10px;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 16px;
        }

        .modal-header p {
          margin: 0;
          font-size: 12px;
          color: #64748b;
        }

        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #94a3b8;
        }

        /* BODY */
        .modal-body {
          padding: 20px;
        }

        .search-box {
          position: relative;
          margin-bottom: 15px;
        }

        .search-box input {
          width: 100%;
          padding: 10px 10px 10px 35px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
        }

        .search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .results-list {
          max-height: 260px;
          overflow-y: auto;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
        }

        .user-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          cursor: pointer;
        }

        .user-item:hover {
          background: #f0faf7;
        }

        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar.big {
          width: 60px;
          height: 60px;
          margin: 0 auto;
        }

        .meta .name {
          margin: 0;
          font-weight: 600;
        }

        .meta .email {
          margin: 0;
          font-size: 12px;
          color: #64748b;
        }

        .check {
          margin-left: auto;
          color: #3cd3ad;
          opacity: 0;
        }

        .user-item:hover .check {
          opacity: 1;
        }

        /* CONFIRM */
        .selected-card {
          text-align: center;
          margin-bottom: 15px;
        }

        .change-btn {
          margin-top: 10px;
          background: none;
          border: none;
          color: #3cd3ad;
          cursor: pointer;
        }

        .expiry label {
          display: flex;
          gap: 6px;
          font-size: 13px;
          margin-bottom: 5px;
        }

        .expiry input {
          width: 100%;
          padding: 8px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        /* FOOTER */
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 15px 20px;
          border-top: 1px solid #f1f5f9;
        }

        .cancel-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #64748b;
        }
      `}</style>
    </div>
  );
};

export default AssignRepModal;
