import React, { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { API_BASE_URL } from '../config';

interface AddUniversityModalProps {
  onClose: () => void;
}

const AddUniversityModal: React.FC<AddUniversityModalProps> = ({ onClose }) => {
  useEscapeKey(onClose);
  const token = useAuthStore.getState().accessToken; // Get auth token
  const [loading, setLoading] = useState(false);

  // State for all fields
  const [form, setForm] = useState({
    name: '',
    code: '',
    slug: '',
    description: '',
    country: '',
    state: '',
    city: '',
    websiteUrl: '',
    emailDomain: '',
    logoUrl: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/global-admin/create-university`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setLoading(false);
      onClose();
    } catch (error) {
      console.error('Failed to create university:', error);
      setLoading(false);
      alert('Failed to create university. Check console for details.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        {/* Modal Header */}
        <header className="modal-header">
          <div>
            <h2>Register University</h2>
            <p>Create a new tenant in the PrevPaper ecosystem.</p>
          </div>
          <button className="close-x" onClick={onClose}>&times;</button>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} className="uni-form">
          {/* General Info */}
          <div className="form-section">
            <h4 className="section-label">General Information</h4>
            <Input
              name="name"
              label="University Name"
              placeholder="e.g. Central University of Rajasthan"
              value={form.name}
              onChange={handleChange}
              required
            />
            <div className="row">
              <Input
                name="code"
                label="University Code"
                placeholder="e.g. CURAJ"
                value={form.code}
                onChange={handleChange}
                required
              />
              <Input
                name="slug"
                label="URL Slug"
                placeholder="Slug (e.g. curaj)"
                value={form.slug}
                onChange={handleChange}
              />
            </div>
            <textarea
              name="description"
              className="custom-textarea"
              placeholder="University Description (Max 1000 chars)"
              rows={3}
              value={form.description}
              onChange={handleChange}
            />
          </div>

          {/* Geographic & Web Info */}
          <div className="form-section">
            <h4 className="section-label">Geographic & Web Info</h4>
            <div className="row">
              <Input
                name="country"
                label="Country"
                placeholder="India"
                value={form.country}
                onChange={handleChange}
              />
              <Input
                name="state"
                label="State"
                placeholder="Rajasthan"
                value={form.state}
                onChange={handleChange}
              />
              <Input
                name="city"
                label="City"
                placeholder="Ajmer"
                value={form.city}
                onChange={handleChange}
              />
            </div>
            <div className="row">
              <Input
                name="websiteUrl"
                label="Website URL"
                placeholder="https://curaj.ac.in"
                value={form.websiteUrl}
                onChange={handleChange}
              />
              <Input
                name="emailDomain"
                label="Email Domain"
                placeholder="curaj.ac.in"
                value={form.emailDomain}
                onChange={handleChange}
              />
            </div>
            <Input
              name="logoUrl"
              label="Logo URL"
              placeholder="https://storage.minio/logos/curaj.png"
              value={form.logoUrl}
              onChange={handleChange}
            />
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Save University'}
            </Button>
          </div>
        </form>
      </div>

      {/* CSS */}
      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        .modal-card {
          background: white;
          width: 100%;
          max-width: 700px;
          border-radius: 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          max-height: 90vh;
          overflow-y: auto;
        }
        .modal-header {
          padding: 30px 40px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .modal-header h2 { margin: 0; font-size: 24px; color: #1e293b; }
        .modal-header p { margin: 5px 0 0; font-size: 14px; color: #64748b; }
        .close-x { background: none; border: none; font-size: 28px; color: #94a3b8; cursor: pointer; }
        .uni-form { padding: 30px 40px; }
        .form-section { margin-bottom: 25px; }
        .section-label { 
          font-size: 12px; 
          text-transform: uppercase; 
          letter-spacing: 1px; 
          color: #3cd3ad; 
          margin-bottom: 15px; 
          font-weight: 800;
        }
        .row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .row:has(input:nth-child(3)) { grid-template-columns: 1fr 1fr 1fr; }
        .custom-textarea {
          width: 100%;
          padding: 12px 0;
          border: none;
          border-bottom: 1px solid #e2e8f0;
          font-family: inherit;
          font-size: 14px;
          outline: none;
          resize: none;
          margin-top: 10px;
        }
        .custom-textarea:focus { border-bottom: 2px solid #3cd3ad; }
        .modal-footer {
          padding-top: 20px;
          display: flex;
          justify-content: flex-end;
          gap: 15px;
        }
        .btn-ghost { background: none; border: none; color: #64748b; font-weight: 600; cursor: pointer; }
      `}</style>
    </div>
  );
};

export default AddUniversityModal;
