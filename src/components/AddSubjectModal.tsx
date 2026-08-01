import React, { useState } from 'react';
import { api } from '../store/authStore';
import { useEscapeKey } from '../hooks/useEscapeKey';

interface Props {
  semesterId: string;
  sessionId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const AddSubjectModal: React.FC<Props> = ({
  semesterId,
  sessionId,
  onClose,
  onSuccess,
}) => {
  useEscapeKey(onClose);
  const [name, setName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !subjectCode) return;

    try {
      setLoading(true);

      await api.post(
        `/api/v1/session-rep/${sessionId}/semesters/${semesterId}/subjects`,
        {
          name,
          subjectCode,
        }
      );

      onSuccess(); // refresh subjects
      onClose();
    } catch (err) {
      console.error("Add subject error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h2>Add Subject</h2>

        <input
          placeholder="Subject Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Subject Code"
          value={subjectCode}
          onChange={(e) => setSubjectCode(e.target.value)}
        />

        <div className="modal-actions">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>
      </div>

      <style>{`
        .btn {
          padding: 10px 15px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn:hover {
          background: rgba(60, 211, 173, 0.1);
        
        }

        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-card {
          background: white;
          padding: 25px;
          border-radius: 12px;
          width: 350px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        input {
          padding: 10px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .modal-actions button:last-child {
          background: #3cd3ad;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default AddSubjectModal;
