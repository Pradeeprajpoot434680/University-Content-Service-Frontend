import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Box, Hash, Plus, Loader2, Search } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { API_BASE_URL } from '../config';

interface Department {
  id: string;
  name: string;
  code: string;
  createdAt: string;
}

const DepartmentsView: React.FC<{ universityId: string }> = ({ universityId }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [formData, setFormData] = useState({ name: '', code: '' });
  const [searchTerm, setSearchTerm] = useState("");
  const token = useAuthStore.getState().accessToken;

  // Fetch Departments
  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/v1/university-rep/${universityId}/departments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(res);
      
      if (res.data.success) setDepartments(res.data.data);
    } catch {
      toast.error("Failed to fetch departments");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchDepartments(); }, [universityId]);

  // Create Department
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Creating department...");
    try {
      const res = await axios.post(`${API_BASE_URL}/api/v1/university-rep/${universityId}/create-department`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.data.success) {
        toast.success("Department created!", { id: toastId });
        setFormData({ name: '', code: '' });
        setIsAdding(false);
        fetchDepartments();
      }
    } catch {
      toast.error("Failed to create department", { id: toastId });
    }
  };

  const filteredDepts = departments.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="view-container">
      {/* HEADER */}
      <div className="view-header-row">
        <div className="header-text">
          <h2>Departments</h2>
          <p>Organize and manage your university's academic divisions</p>
        </div>
        <button className={`primary-btn ${isAdding ? 'active' : ''}`} onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? "Close Panel" : <><Plus size={18}/> New Department</>}
        </button>
      </div>

      {/* ADD FORM PANEL */}
      <div className={`add-form-panel ${isAdding ? 'open' : ''}`}>
        <form className="add-form-card" onSubmit={handleCreate}>
          <h3>Create New Department</h3>
          <div className="form-grid">
            <div className="input-group">
              <label>Department Name</label>
              <div className="input-wrapper">
                <Box size={18} className="input-icon"/>
                <input placeholder="e.g. Computer Science & Engineering" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required/>
              </div>
            </div>
            <div className="input-group">
              <label>Department Code</label>
              <div className="input-wrapper">
                <Hash size={18} className="input-icon"/>
                <input placeholder="e.g. CSE" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} required/>
              </div>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => setIsAdding(false)}>Cancel</button>
            <button type="submit" className="save-btn">Create Department</button>
          </div>
        </form>
      </div>

      {/* SEARCH */}
      <div className="filter-bar">
        <div className="search-wrapper">
          <Search size={18}/>
          <input placeholder="Search by name or code..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
        </div>
        <div className="dept-count">Showing <strong>{filteredDepts.length}</strong> Departments</div>
      </div>

      {/* DEPARTMENTS GRID */}
      {loading ? (
        <div className="loading-state"><Loader2 className="spinner"/><p>Loading departments...</p></div>
      ) : (
        <div className="dept-grid">
          {filteredDepts.map(dept => (
            <div key={dept.id} className="dept-card">
              <div className="dept-card-header">
                <div className="dept-badge">{dept.code}</div>
              </div>
              <h3>{dept.name}</h3>
              <div className="dept-footer">
                <span className="date">Added {new Date(dept.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
          {filteredDepts.length === 0 && <div className="empty-state"><p>No departments found.</p></div>}
        </div>
      )}

      {/* STYLES */}
      <style>{`
        .primary-btn { display: flex; align-items: center; gap: 8px; background: #1e293b; color: white; padding: 10px 20px; border-radius: 10px; border: none; cursor: pointer; transition: 0.3s; }
        .primary-btn.active { background: #f1f5f9; color: #64748b; border: 1px solid #e2e8f0; }
        .add-form-panel { max-height: 0; overflow: hidden; transition: max-height 0.35s ease; margin-bottom: 20px; }
        .add-form-panel.open { max-height: 400px; }
        .add-form-card { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 10px 30px rgba(60, 211, 173, 0.08); }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px; }
        .input-wrapper { display: flex; align-items: center; gap: 8px; background: #f8fafc; padding: 8px 12px; border-radius: 10px; border: 1px solid #e2e8f0; }
        .input-wrapper input { border: none; outline: none; flex: 1; background: transparent; padding: 6px 0; }
        .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px; }
        .cancel-btn { background: #e2e8f0; border-radius: 8px; padding: 8px 14px; cursor: pointer; border: none; }
        .save-btn { background: #1e293b; color: white; border-radius: 8px; padding: 8px 14px; border: none; cursor: pointer; }
        .search-wrapper { position: relative; max-width: 400px; margin-bottom: 20px; }
        .search-wrapper svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8; }
        .search-wrapper input { width: 100%; padding: 10px 10px 10px 36px; border-radius: 10px; border: 1px solid #e2e8f0; }
        .dept-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
        .dept-card { background: white; padding: 20px; border-radius: 16px; border: 1px solid #e2e8f0; transition: transform 0.2s; }
        .dept-card:hover { transform: translateY(-4px); border-color: #3cd3ad; }
        .dept-badge { background: #f1f5f9; padding: 4px 10px; border-radius: 6px; font-weight: 700; color: #475569; }
        .dept-card h3 { margin: 10px 0; color: #1e293b; font-size: 18px; }
        .dept-footer .date { font-size: 11px; color: #94a3b8; }
        .loading-state { text-align: center; padding: 60px; color: #64748b; }
        .spinner { animation: rotate 1s linear infinite; margin-bottom: 10px; color: #3cd3ad; }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default DepartmentsView;