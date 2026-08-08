import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, GripVertical, Info, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuthStore } from '../store/authStore';
import { API_BASE_URL } from '../config';

interface ExamFormat {
  examName: string;
  displayOrder: number;
}

const ExamFormatsView: React.FC<{ universityId: string }> = ({ universityId }) => {
  const [formats, setFormats] = useState<ExamFormat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const token = useAuthStore.getState().accessToken;

  useEffect(() => {
    const fetchFormats = async () => {
      setIsFetching(true);
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/v1/university-rep/${universityId}/exam-formats`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.success) setFormats(res.data.data);
        else toast.error(res.data.message || 'Failed to fetch exam formats');
      } catch (err) {
        toast.error('Server connection error');
      } finally {
        setIsFetching(false);
      }
    };
    fetchFormats();
  }, [universityId]);

  const addRow = () => {
    if (formats.some(f => f.examName === '')) {
      toast.error('Please fill the existing empty format first');
      return;
    }

    const nextOrder = formats.length > 0
      ? Math.max(...formats.map(f => f.displayOrder)) + 1
      : 1;

    setFormats([...formats, { examName: '', displayOrder: nextOrder }]);
  };

  const removeRow = (index: number) => {
    const updated = formats
      .filter((_, i) => i !== index)
      .map((f, i) => ({ ...f, displayOrder: i + 1 }));
    setFormats(updated);
  };

  const handleInputChange = (index: number, value: string) => {
    const updated = [...formats];
    updated[index].examName = value;
    setFormats(updated);
  };

  const saveFormat = async (index: number) => {
    const format = formats[index];

    if (!format.examName.trim()) {
      toast.error('Exam name cannot be empty');
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading('Saving exam format...');

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/university-rep/${universityId}/exam-formats`,
        format,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success('Exam format saved successfully', { id: toastId });
        const refreshed = await axios.get(
          `${API_BASE_URL}/api/v1/university-rep/${universityId}/exam-formats`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFormats(refreshed.data.data);
      } else {
        toast.error(res.data.message || 'Failed to save', { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Server connection error', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="loading-container">
        <Loader2 size={24} className="animate-spin" />
        <p>Loading exam formats...</p>
      </div>
    );
  }

  return (
    <div className="exam-view-container">
      <div className="view-header">
        <h2>Exam Formats</h2>
        <p>Define and order the types of examinations conducted at your institution.</p>
        <div className="info-banner">
          <Info size={16} />
          <span>The order here determines how exams appear to students.</span>
        </div>
      </div>

      <div className="format-list">
        {formats.map((format, index) => (
          <div key={index} className="format-row-wrapper">
            <div className="format-row">
              <div className="drag-handle"><GripVertical size={18} /></div>
              <div className="order-number">{format.displayOrder}</div>
              <input
                type="text"
                placeholder="e.g., Sessional Examination"
                value={format.examName}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className="format-input"
              />
              <div className="row-actions">
                <button onClick={() => saveFormat(index)} disabled={isLoading} className="save-btn">
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                </button>
                <button onClick={() => removeRow(index)} title="Remove format" className="delete-action">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {formats.length === 0 && (
          <div className="empty-formats">
            <p>No formats defined yet. Click below to add your first one.</p>
          </div>
        )}
      </div>

      <button onClick={addRow} className="add-btn">
        <Plus size={18} /> Add New Format
      </button>

      <style>{`
        .exam-view-container { background: white; border-radius: 20px; padding: 32px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .view-header { margin-bottom: 32px; }
        .view-header h2 { font-size: 24px; color: #1e293b; margin: 0; font-weight: 700; }
        .view-header p { color: #64748b; font-size: 15px; margin: 6px 0 16px; }
        .info-banner { display: inline-flex; align-items: center; gap: 8px; background: #eff6ff; color: #1d4ed8; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 500; }
        .format-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px; }
        .format-row { display: flex; align-items: center; gap: 16px; padding: 12px 16px; background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; transition: all 0.2s; }
        .format-row:focus-within { border-color: #3cd3ad; box-shadow: 0 0 0 4px rgba(60,211,173,0.1); background: #f0fffb; }
        .drag-handle { color: #cbd5e1; cursor: grab; }
        .order-number { background: #1e293b; color: white; width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; }
        .format-input { flex: 1; border: none; background: transparent; font-size: 15px; font-weight: 600; color: #334155; outline: none; }
        .row-actions { display: flex; gap: 8px; }
        .save-btn { display: flex; align-items: center; justify-content: center; padding: 6px 10px; border-radius: 8px; border: none; background: #1e293b; color: white; cursor: pointer; transition: 0.2s; }
        .save-btn:hover:not(:disabled) { background: #0f172a; transform: translateY(-1px); }
        .save-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .delete-action { color: #94a3b8; background: none; border: none; cursor: pointer; padding: 8px; border-radius: 8px; transition: 0.2s; }
        .delete-action:hover { color: #ef4444; background: #fee2e2; }
        .add-btn { display: flex; align-items: center; gap: 8px; color: #3cd3ad; background: #3cd3ad10; border: 1.5px dashed #3cd3ad; padding: 10px 20px; border-radius: 12px; font-weight: 600; cursor: pointer; transition: 0.2s; }
        .add-btn:hover { background: #3cd3ad20; }
        .empty-formats { text-align: center; padding: 40px; border: 2px dashed #e2e8f0; border-radius: 16px; color: #94a3b8; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ExamFormatsView;