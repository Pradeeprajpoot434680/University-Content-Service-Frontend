import React, { useState } from "react";
import { api } from "../store/authStore";
import { toast } from "sonner";
import { useEscapeKey } from '../hooks/useEscapeKey';

interface Props {
  programId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const AddSessionModal: React.FC<Props> = ({ programId, onClose, onSuccess }) => {
  useEscapeKey(onClose);
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!startYear || !endYear) {
      toast.error("All fields required");
      return;
    }

    if (Number(endYear) <= Number(startYear)) {
      toast.error("End year must be greater than start year");
      return;
    }

    try {
      setLoading(true);

      await api.post(
        `/api/v1/program-rep/${programId}/create-session`,
        {
          programId,
          startYear: Number(startYear),
          endYear: Number(endYear),
        }
      );

      toast.success("Session created ✅");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">

        <h2>Create Session</h2>

        <div className="form-group">
          <label>Start Year</label>
          <input
            type="number"
            value={startYear}
            onChange={(e) => setStartYear(e.target.value)}
            placeholder="2022"
          />
        </div>

        <div className="form-group">
          <label>End Year</label>
          <input
            type="number"
            value={endYear}
            onChange={(e) => setEndYear(e.target.value)}
            placeholder="2026"
          />
        </div>

        <div className="actions">
          <button className="cancel" onClick={onClose}>
            Cancel
          </button>

          <button className="submit" onClick={handleSubmit}>
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal {
          background: white;
          padding: 25px;
          border-radius: 12px;
          width: 350px;
        }

        h2 {
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        label {
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
        }

        input {
          width: 100%;
          padding: 8px;
          margin-top: 5px;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
        }

        .actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }

        .cancel {
          background: #f1f5f9;
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
        }

        .submit {
          background: #3cd3ad;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default AddSessionModal;
