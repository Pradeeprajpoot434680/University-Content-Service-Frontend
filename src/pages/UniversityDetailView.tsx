import React, { useEffect, useState } from 'react';
import { Loader2, Plus, ArrowLeft, Layers, GraduationCap, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../store/authStore';

interface UniversityDetailViewProps {
  universityId: string;
  universityName: string;
  onBack: () => void;
}

type Dept = { id: string; name: string; code: string; };
type Prog = { id: string; name: string; code: string; totalSemesters: number; };
type Sess = { id: string; startYear: number; endYear: number; };

export default function UniversityDetailView({ universityId, universityName, onBack }: UniversityDetailViewProps) {
  const [subTab, setSubTab] = useState<'DEPT' | 'PROG' | 'SESS'>('DEPT');
  const [loading, setLoading] = useState(false);

  // Core Data Pool Arrays State
  const [departments, setDepartments] = useState<Dept[]>([]);
  const [programs, setPrograms] = useState<Prog[]>([]);
  const [sessions, setSessions] = useState<Sess[]>([]);

  // Cross-Referencing Filter Selectors for Tab Display
  const [selectedDeptId, setSelectedDeptId] = useState<string>('');
  const [selectedProgId, setSelectedProgId] = useState<string>('');

  // Form Field Input States
  const [deptForm, setDeptForm] = useState({ name: '', code: '' });
  const [progForm, setProgForm] = useState({ name: '', code: '', durationYears: 4, totalSemesters: 8, description: '' });
  const [sessForm, setSessForm] = useState({ startYear: 2026, endYear: 2030 });

  // ================= 1. FETCH DEPARTMENTS (BASELINE) =================
  const fetchDepartments = async () => {
    try {
      const res = await api.get(`/api/v1/get/departments/${universityId}`);
      if (res.data.success) {
        const deptData = res.data.data || [];
        setDepartments(deptData);
        if (deptData.length > 0 && !selectedDeptId) {
          setSelectedDeptId(deptData[0].id); // Default dynamic grouping selection context
        }
      }
    } catch {
      toast.error("Failed to load departments roster");
    }
  };

  // ================= 2. FETCH PROGRAMS CASCADE =================
  const fetchPrograms = async (deptId: string) => {
    if (!deptId) return;
    setLoading(true);
    try {
      const res = await api.get(`/api/v1/get/programs/${deptId}`);
      if (res.data.success) {
        const progData = res.data.data || [];
        setPrograms(progData);
        if (progData.length > 0) {
          setSelectedProgId(progData[0].id);
        } else {
          setSelectedProgId('');
          setSessions([]);
        }
      }
    } catch {
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= 3. FETCH SESSIONS CASCADE =================
  const fetchSessions = async (progId: string) => {
    if (!progId) { setSessions([]); return; }
    setLoading(true);
    try {
      const res = await api.get(`/api/v1/get/sessions/${progId}`);
      if (res.data.success) {
        setSessions(res.data.data || []);
      }
    } catch {
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle baseline dependency tracking on layout change triggers
  useEffect(() => {
    fetchDepartments();
  }, [universityId]);

  useEffect(() => {
    if (subTab === 'PROG' || subTab === 'SESS') {
      fetchPrograms(selectedDeptId);
    }
  }, [selectedDeptId, subTab]);

  useEffect(() => {
    if (subTab === 'SESS') {
      fetchSessions(selectedProgId);
    }
  }, [selectedProgId, subTab]);


  // ================= ACTION SUBMISSIONS & STATE RESET INPUTS =================
  
  const handleAddDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptForm.name.trim() || !deptForm.code.trim()) return toast.error("Please provide both name and code");
    
    try {
      const res = await api.post(`/api/v1/global-admin/university/${universityId}/create-department`, deptForm);
      if (res.data.success) {
        toast.success("Department registered successfully!");
        
        // 🟢 FIX: Empty the text states instantly
        setDeptForm({ name: '', code: '' }); 
        
        await fetchDepartments();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error registering department node");
    }
  };

  const handleAddProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeptId) return toast.error("Please verify or add a department node first");
    if (!progForm.name.trim() || !progForm.code.trim()) return toast.error("Missing program title credentials");

    try {
      const res = await api.post(`/api/v1/global-admin/department/${selectedDeptId}/create-program`, {
        name: progForm.name,
        code: progForm.code,
        durationYears: Number(progForm.durationYears),
        totalSemesters: Number(progForm.totalSemesters),
        description: progForm.description
      });
      if (res.data.success) {
        toast.success("Degree program attached successfully!");
        
        // 🟢 FIX: Reset input parameters back to defaults completely
        setProgForm({ name: '', code: '', durationYears: 4, totalSemesters: 8, description: '' }); 
        
        await fetchPrograms(selectedDeptId);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error constructing program tree");
    }
  };

  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgId) return toast.error("Please select a valid target degree path program layer");

    try {
      const res = await api.post(`/api/v1/global-admin/program/${selectedProgId}/create-session`, {
        programId: selectedProgId,
        startYear: Number(sessForm.startYear),
        endYear: Number(sessForm.endYear)
      });
      if (res.data.success) {
        toast.success("Admission session range inserted successfully!");
        
        // 🟢 FIX: Empty and reset form state attributes cleanly
        setSessForm({ startYear: 2026, endYear: 2030 }); 
        
        await fetchSessions(selectedProgId);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error appending active timeline batch boundary");
    }
  };

  return (
    <div className="detail-workspace">
      <button className="back-breadcrumb-btn" onClick={onBack}>
        <ArrowLeft size={16} /> Back to Universities Management Directory
      </button>

      <div className="workspace-header">
        <h2>{universityName}</h2>
        <span className="id-badge">TENANT UUID: {universityId}</span>
      </div>

      {/* SUB-TABS ENGINE HEADER CONTROL STRIP */}
      <div className="subnav-tabs">
        <button className={`sub-tab ${subTab === 'DEPT' ? 'active' : ''}`} onClick={() => setSubTab('DEPT')}>
          <Layers size={16} /> 1. Departments Registry
        </button>
        <button className={`sub-tab ${subTab === 'PROG' ? 'active' : ''}`} onClick={() => setSubTab('PROG')}>
          <GraduationCap size={16} /> 2. Programs Portfolio
        </button>
        <button className={`sub-tab ${subTab === 'SESS' ? 'active' : ''}`} onClick={() => setSubTab('SESS')}>
          <Calendar size={16} /> 3. Academic Sessions
        </button>
      </div>

      {/* CONTEXT FILTERS STRIPBAR: Updates grouping cascading pools dynamically */}
      {(subTab === 'PROG' || subTab === 'SESS') && (
        <div className="context-filter-bar">
          <div className="filter-select-item">
            <label>Select Target Department Workspace Scope Context:</label>
            <select value={selectedDeptId} onChange={e => setSelectedDeptId(e.target.value)}>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name} ({d.code})</option>)}
            </select>
          </div>

          {subTab === 'SESS' && programs.length > 0 && (
            <div className="filter-select-item">
              <label>Select Associated Program Track Alignment:</label>
              <select value={selectedProgId} onChange={e => setSelectedProgId(e.target.value)}>
                {programs.map(p => <option key={p.id} value={p.id}>{p.name} ({p.code})</option>)}
              </select>
            </div>
          )}
        </div>
      )}

      {/* OPERATIONS WORKSPACE PANELS SPLIT GRID */}
      <div className="workspace-grid">
        
        {/* LEFT COMPONENT: REUSABLE CONTEXT FORM BUILDER */}
        <div className="form-panel-card">
          {subTab === 'DEPT' && (
            <form onSubmit={handleAddDepartment}>
              <h3>Forcibly Inject Department Node</h3>
              <div className="input-group">
                <label>Department Name Title</label>
                <input placeholder="e.g., Department of Computer Science" value={deptForm.name} onChange={e => setDeptForm({ ...deptForm, name: e.target.value })} />
              </div>
              <div className="input-group">
                <label>Department Identification Code</label>
                <input placeholder="e.g., DCS" value={deptForm.code} onChange={e => setDeptForm({ ...deptForm, code: e.target.value })} />
              </div>
              <button type="submit" className="submit-form-btn"><Plus size={16} /> Save Department</button>
            </form>
          )}

          {subTab === 'PROG' && (
            <form onSubmit={handleAddProgram}>
              <h3>Forcibly Attach Degree Program Track</h3>
              <div className="input-group">
                <label>Program Specification Name</label>
                <input placeholder="e.g., Bachelor of Science in AI" value={progForm.name} onChange={e => setProgForm({ ...progForm, name: e.target.value })} />
              </div>
              <div className="input-group-row">
                <div className="input-group">
                  <label>Code Tag (e.g., BSAI)</label>
                  <input placeholder="BSAI" value={progForm.code} onChange={e => setProgForm({ ...progForm, code: e.target.value })} />
                </div>
                <div className="input-group">
                  <label>Total Semesters</label>
                  <input type="number" min={1} max={12} value={progForm.totalSemesters} onChange={e => setProgForm({ ...progForm, totalSemesters: Number(e.target.value), durationYears: Math.ceil(Number(e.target.value)/2) })} />
                </div>
              </div>
              <div className="input-group">
                <label>Track Profile Brief Description</label>
                <input placeholder="Optional metadata notes..." value={progForm.description} onChange={e => setProgForm({ ...progForm, description: e.target.value })} />
              </div>
              <button type="submit" className="submit-form-btn"><Plus size={16} /> Append Program Track</button>
            </form>
          )}

          {subTab === 'SESS' && (
            <form onSubmit={handleAddSession}>
              <h3>Forcibly Configure Operational Batch Timeline</h3>
              <div className="input-group-row">
                <div className="input-group">
                  <label>Admission Start Year</label>
                  <input type="number" value={sessForm.startYear} onChange={e => setSessForm({ ...sessForm, startYear: Number(e.target.value) })} />
                </div>
                <div className="input-group">
                  <label>Expected Graduation Year</label>
                  <input type="number" value={sessForm.endYear} onChange={e => setSessForm({ ...sessForm, endYear: Number(e.target.value) })} />
                </div>
              </div>
              <button type="submit" className="submit-form-btn"><Plus size={16} /> Inject Active Timeline Batch</button>
            </form>
          )}
        </div>

        {/* RIGHT COMPONENT: LIVE QUERY TREE DATA TABLES VIEWPORT */}
        <div className="display-list-card">
          {loading ? (
            <div className="view-loading"><Loader2 className="animate-spin" /> Querying structural database entries...</div>
          ) : (
            <div className="table-wrapper">
              {subTab === 'DEPT' && (
                <table className="workspace-table">
                  <thead><tr><th>Entity Code</th><th>Institutional Department Structural Nodes</th></tr></thead>
                  <tbody>
                    {departments.length === 0 ? <tr><td colSpan={2} className="empty-row">No core departments created for this institution yet.</td></tr> : departments.map(d => <tr key={d.id}><td><span className="code-tag">{d.code}</span></td><td>{d.name}</td></tr>)}
                  </tbody>
                </table>
              )}

              {subTab === 'PROG' && (
                <table className="workspace-table">
                  <thead><tr><th>Track Code</th><th>Affiliated Degree Tracks Portfolio</th><th>Academic Span</th></tr></thead>
                  <tbody>
                    {programs.length === 0 ? <tr><td colSpan={3} className="empty-row">No active programs discovered under this specific department portfolio index.</td></tr> : programs.map(p => <tr key={p.id}><td><span className="code-tag">{p.code}</span></td><td>{p.name}</td><td>{p.totalSemesters} Semesters</td></tr>)}
                  </tbody>
                </table>
              )}

              {subTab === 'SESS' && (
                <table className="workspace-table">
                  <thead><tr><th>Operational Batch Range Span</th><th>Registration Workflow Routing Status</th></tr></thead>
                  <tbody>
                    {sessions.length === 0 ? <tr><td colSpan={2} className="empty-row">No admission batches mapped to this program track yet.</td></tr> : sessions.map(s => <tr key={s.id}><td><span className="code-tag">{s.startYear} — {s.endYear}</span></td><td style={{color:'#16a34a', fontWeight:600}}>✓ Live and Discoverable</td></tr>)}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

      </div>

      <style>{`
        .detail-workspace { width:100%; animation: fadeIn 0.25s ease; }
        .back-breadcrumb-btn { display:inline-flex; align-items:center; gap:8px; background:none; border:none; color:#64748b; font-weight:600; cursor:pointer; font-size:14px; margin-bottom:20px; transition: color 0.2s; }
        .back-breadcrumb-btn:hover { color:#1e293b; }
        .workspace-header { display:flex; align-items:center; gap:16px; margin-bottom:30px; }
        .workspace-header h2 { margin:0; font-size:24px; color:#1e293b; }
        .id-badge { background:#e2e8f0; color:#475569; font-size:12px; font-weight:500; padding:4px 8px; border-radius:6px; font-family:monospace; }
        
        .subnav-tabs { display:flex; gap:10px; border-bottom:2px solid #e2e8f0; padding-bottom:1px; margin-bottom:20px; }
        .sub-tab { display:inline-flex; align-items:center; gap:8px; padding:12px 18px; border:none; background:none; color:#64748b; font-weight:600; font-size:14px; cursor:pointer; position:relative; transition:all 0.2s; }
        .sub-tab:hover { color:#1e293b; }
        .sub-tab.active { color:#3cd3ad; }
        .sub-tab.active::after { content:''; position:absolute; bottom:-2px; left:0; right:0; height:2px; background:#3cd3ad; }

        .context-filter-bar { display:flex; gap:20px; background:#f1f5f9; padding:16px; border-radius:10px; border:1px solid #e2e8f0; margin-bottom:25px; }
        .filter-select-item { display:flex; flex-direction:column; gap:6px; flex:1; }
        .filter-select-item label { font-size:12px; font-weight:700; color:#475569; text-transform:uppercase; letter-spacing:0.3px; }
        .filter-select-item select { padding:10px; border-radius:8px; border:1px solid #cbd5e1; font-size:14px; outline:none; background:white; }

        .workspace-grid { display:grid; grid-template-columns: 420px 1fr; gap:25px; align-items:start; }
        .form-panel-card { background:white; border-radius:12px; border:1px solid #e2e8f0; padding:24px; box-shadow:0 1px 3px rgba(0,0,0,0.02); }
        .form-panel-card h3 { margin:0 0 20px 0; font-size:16px; color:#1e293b; font-weight:700; border-bottom:1px solid #f1f5f9; padding-bottom:10px; }
        
        .input-group { display:flex; flex-direction:column; gap:6px; margin-bottom:16px; }
        .input-group label { font-size:13px; font-weight:600; color:#475569; }
        .input-group input, .input-group select { padding:10px; border-radius:8px; border:1px solid #cbd5e1; outline:none; font-size:14px; width:100%; transition: border 0.2s; }
        .input-group input:focus, .input-group select:focus { border-color:#3cd3ad; }
        .input-group-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }

        .submit-form-btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; width:100%; background:#1e293b; color:white; border:none; padding:12px; font-weight:600; border-radius:8px; cursor:pointer; font-size:14px; transition:background 0.2s; margin-top:8px; }
        .submit-form-btn:hover { background:#0f172a; }

        .display-list-card { background:white; border-radius:12px; border:1px solid #e2e8f0; min-height:420px; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.02); }
        .table-wrapper { width:100%; overflow-x:auto; }
        .workspace-table { width:100%; border-collapse:collapse; }
        .workspace-table th { background:#f8fafc; padding:14px; font-size:13px; color:#64748b; font-weight:600; border-bottom:1px solid #e2e8f0; text-align:left; }
        .workspace-table td { padding:14px; border-bottom:1px solid #f1f5f9; font-size:14px; color:#334155; }
        .code-tag { background:#f1f5f9; color:#475569; font-weight:600; font-size:12px; padding:3px 8px; border-radius:4px; font-family:monospace; border:1px solid #e2e8f0; }
        .empty-row { text-align:center; padding:50px; color:#94a3b8; font-size:14px; background:#fff; }
        .view-loading { display:flex; align-items:center; justify-content:center; gap:10px; padding:80px; color:#64748b; font-size:14px; width:100%; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}