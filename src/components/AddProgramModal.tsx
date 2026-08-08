import React, { useState } from 'react';
import axios from 'axios';
import Button from './Button';
import { useAuthStore } from '../store/authStore';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { API_BASE_URL } from '../config';

interface AddProgramModalProps {
  departmentId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddProgramModal: React.FC<AddProgramModalProps> = ({
  departmentId,
  onClose,
  onSuccess,
}) => {
  useEscapeKey(onClose);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    code: '',
    durationYears: 4,
    totalSemesters: 8,
    description: '',
  });
  const token = useAuthStore.getState().accessToken;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'durationYears') {
      const years = Number(value);
      setForm({
        ...form,
        durationYears: years,
        totalSemesters: years * 2, // auto calculate
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/department-rep/${departmentId}/create-program`,
        form,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onClose();
      onSuccess?.();
    } catch (err) {
      console.error(err);
      alert('Failed to create program');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">

        {/* HEADER */}
        <header className="modal-header">
          <div>
            <h2>Create Program</h2>
            <p>Define a new academic program</p>
          </div>
          <button className="close-x" onClick={onClose}>&times;</button>
        </header>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="modal-form">

          <div className="grid-2">
            <div className="form-section">
              <label>Program Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="B.Tech Computer Science"
                required
              />
            </div>

            <div className="form-section">
              <label>Program Code</label>
              <input
                type="text"
                name="code"
                value={form.code}
                onChange={handleChange}
                placeholder="CS101"
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-section">
              <label>Duration (Years)</label>
              <select
                name="durationYears"
                value={form.durationYears}
                onChange={handleChange}
              >
                <option value={2}>2 Years</option>
                <option value={3}>3 Years</option>
                <option value={4}>4 Years</option>
                <option value={5}>5 Years</option>
              </select>
            </div>

            <div className="form-section">
              <label>Total Semesters</label>
              <input
                type="number"
                name="totalSemesters"
                value={form.totalSemesters}
                readOnly
              />
            </div>
          </div>

          <div className="form-section">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Brief about the program..."
              rows={3}
            />
          </div>

          {/* FOOTER */}
          <div className="modal-footer">
            <button type="button" className="btn-ghost" onClick={onClose}>
              Cancel
            </button>

            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Program'}
            </Button>
          </div>
        </form>
      </div>

      {/* STYLES */}
      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-card {
          background: white;
          width: 100%;
          max-width: 520px;
          border-radius: 18px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
          overflow: hidden;
        }

        .modal-header {
          padding: 20px 25px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 22px;
        }

        .modal-header p {
          font-size: 13px;
          color: #64748b;
        }

        .close-x {
          background: none;
          border: none;
          font-size: 22px;
          cursor: pointer;
        }

        .modal-form {
          padding: 20px 25px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .form-section {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .form-section label {
          font-size: 12px;
          font-weight: 600;
          color: #475569;
        }

        .form-section input,
        .form-section select,
        .form-section textarea {
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          font-size: 14px;
        }

        .form-section textarea {
          resize: none;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 10px;
        }

        .btn-ghost {
          border: 1px solid #cbd5e1;
          padding: 8px 14px;
          border-radius: 8px;
          background: none;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default AddProgramModal;
