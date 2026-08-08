import React, { useState, useEffect } from 'react';
import { 
  UploadCloud, GraduationCap, 
  CheckCircle2, 
  ChevronRight, ClipboardList
} from 'lucide-react';
import { api, normalizeOptionalId, useAuthStore } from '../store/authStore';
import { toast } from 'sonner';

interface IdName { id: string; name: string; }
interface ExamType { id: string; examName: string; }

const ContentUpload: React.FC = () => {
  const user = useAuthStore.getState().user;
  const universityId = normalizeOptionalId(user?.universityId);

  const [departments, setDepartments] = useState<IdName[]>([]);
  const [programs, setPrograms] = useState<IdName[]>([]);
  const [semesters, setSemesters] = useState<IdName[]>([]);
  const [_, setSessions] = useState<IdName[]>([]);
  const [subjects, setSubjects] = useState<IdName[]>([]);
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);

  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Available academic years list
  const currentYear = new Date().getFullYear();
  const availableYears = Array.from({ length: 6 }, (_, i) => currentYear - i); // e.g. [2026, 2025, 2024, 2023, 2022, 2021]

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contentType: 'PAPER', // Default
    examTypeId: '',
    universityId: universityId,
    departmentId: '',
    programId: '',
    semesterId: '',
    sessionId: '',
    subjectId: '',
    academicYear: currentYear, // 🟢 Default to current year
    fileType: 'PDF'
  });

  // Logic: Show Exam Type when uploading Papers or Paper Solutions
  const showExamTypeField = formData.contentType === 'PAPER' || formData.contentType === 'PAPER_SOLUTION';

  // Fetch initial department and exam format data
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!universityId) {
        toast.error("University ID is missing. Please login again.");
        return;
      }
      try {
        const [deptRes, examRes] = await Promise.all([
          api.get(`/api/v1/get/departments/${universityId}`),
          api.get(`/api/v1/get/exam-formats/${universityId}`)
        ]);
        if (deptRes.data.success) setDepartments(deptRes.data.data);
        if (examRes.data.success) setExamTypes(examRes.data.data);
      } catch (err) { console.error("Initial fetch error:", err); }
    };
    fetchInitialData();
  }, [universityId]);

  // Fetch programs on department selection
  useEffect(() => {
    if (!formData.departmentId) { setPrograms([]); return; }
    api.get(`/api/v1/get/programs/${formData.departmentId}`)
       .then(res => { if (res.data.success) setPrograms(res.data.data); });
  }, [formData.departmentId]);

  // Fetch structure (semesters & sessions) on program selection
  useEffect(() => {
    if (!formData.programId) { setSemesters([]); setSessions([]); return; }
    api.get(`/api/v1/get/programs/${formData.programId}/structure`)
       .then(res => {
          const data = res.data.success ? res.data.data : res.data;
          setSemesters(data.semesters || []);
          setSessions(data.sessions || []);
       });
  }, [formData.programId]);

  // Fetch subjects on semester selection
  useEffect(() => {
    if (!formData.semesterId) { setSubjects([]); return; }
    api.get(`/api/v1/get/semesters/${formData.semesterId}/subjects`)
       .then(res => {
         const data = res.data.success ? res.data.data : res.data;
         setSubjects(data || []);
       });
  }, [formData.semesterId]);

  // Validate File Magic Bytes
  const readFileSignature = async (file: File) => {
    const buffer = await file.slice(0, 4).arrayBuffer();
    const bytes = new Uint8Array(buffer);

    if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) return "pdf";
    if (bytes[0] === 0x89 && bytes[1] === 0x50) return "png";
    if (bytes[0] === 0xff && bytes[1] === 0xd8) return "jpeg";

    return "unknown";
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const allowedMimeTypes = ["application/pdf", "image/png", "image/jpeg"];
    const allowedExtensions = [".pdf", ".png", ".jpg", ".jpeg"];
    const maxSize = 20 * 1024 * 1024; // 20MB
    const fileName = selectedFile.name.toLowerCase();

    if (fileName.split('.').length > 2) return toast.error("Invalid file name (double extension detected)");
    if (!allowedExtensions.some(ext => fileName.endsWith(ext))) return toast.error("Invalid file extension");
    if (!allowedMimeTypes.includes(selectedFile.type)) return toast.error("Invalid file type");
    if (selectedFile.size > maxSize) return toast.error("File exceeds 20MB limit");

    const type = await readFileSignature(selectedFile);
    if (
      (type === "pdf" && !fileName.endsWith(".pdf")) ||
      (type === "png" && !fileName.endsWith(".png")) ||
      (type === "jpeg" && !(fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")))
    ) {
      return toast.error("File type mismatch");
    }

    if (type === "unknown") return toast.error("File content is not valid");

    setFile(selectedFile);
    setFormData(prev => ({ ...prev, fileType: type === "pdf" ? "PDF" : "IMAGE" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a file");
    if (!universityId) return toast.error("University ID is missing. Please login again.");

    setIsUploading(true);
    const uploadData = new FormData();
    const selectedSemester = semesters.find(s => s.id === formData.semesterId);

    // 🟢 Build metadata payload including academicYear
    const metadataPayload = {
      title: formData.title,
      description: formData.description,
      contentType: formData.contentType,
      examTypeId: showExamTypeField ? formData.examTypeId : null,
      universityId: formData.universityId,
      departmentId: formData.departmentId,
      programId: formData.programId,
      academicYear: formData.academicYear, // 🟢 MANDATORY FIELD FOR SESSION REPS
      semester: selectedSemester ? parseInt(selectedSemester.name.replace(/\D/g, "")) : null,
      subjectId: formData.subjectId,
      fileType: formData.fileType
    };

    // Append JSON blob cleanly without filename parameter
    const jsonBlob = new Blob([JSON.stringify(metadataPayload)], { type: 'application/json' });
    uploadData.append('metadata', jsonBlob); 
    uploadData.append('file', file);

    try {
      await api.post('/api/v1/content/upload', uploadData);
      toast.success("Resource uploaded successfully!");
      setFile(null);
      setFormData(prev => ({ ...prev, title: '', description: '' }));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="modern-upload-wrapper">
      <div className="upload-max-width">
        <header className="page-header">
          <div className="breadcrumb">Resources <ChevronRight size={14} /> <span>Upload New</span></div>
          <h1>Contribute to Library</h1>
          <p>Provide accurate details to help your fellow students find your resources easily.</p>
        </header>

        <form onSubmit={handleSubmit} className="bento-grid">
          <div className="grid-left-main">
            {/* File Upload Card */}
            <div className={`glass-card dropzone-container ${file ? 'file-ready' : ''} ${dragActive ? 'drag-active' : ''}`}
                 onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                 onDragLeave={() => setDragActive(false)}
                 onDrop={(e) => { e.preventDefault(); setDragActive(false); if(e.dataTransfer.files[0]) handleFileChange({target: {files: e.dataTransfer.files}} as any); }}
            >
              <input type="file" id="file-up" onChange={handleFileChange} hidden accept=".pdf,image/*" />
              <label htmlFor="file-up" className="dropzone-label">
                <div className="icon-box">
                  {file ? <CheckCircle2 size={32} className="success-icon" /> : <UploadCloud size={32} />}
                </div>
                {file ? (
                  <div className="file-info">
                    <h3>{file.name}</h3>
                    <p>{(file.size / (1024 * 1024)).toFixed(2)} MB • {formData.fileType}</p>
                    <button type="button" className="btn-text" onClick={(e) => { e.preventDefault(); setFile(null); }}>Change File</button>
                  </div>
                ) : (
                  <div className="upload-prompt">
                    <h3>Click or drag to upload</h3>
                    <p>Support PDF, PNG, JPG (Max 20MB)</p>
                  </div>
                )}
              </label>
            </div>

            {/* Content Details Card */}
            <div className="glass-card details-card">
              <div className="section-header">
                <ClipboardList size={18} className="text-primary" />
                <h2>Content Details</h2>
              </div>
              
              <div className="form-group">
                <label>What are you uploading?</label>
                <select 
                  className="modern-select highlight-select"
                  value={formData.contentType}
                  onChange={(e) => setFormData({...formData, contentType: e.target.value, examTypeId: ''})}
                  required
                >
                  <option value="PAPER">Previous Year Paper</option>
                  <option value="PAPER_SOLUTION">Paper Solution</option>
                  <option value="NOTES">Lecture Notes / Study Material</option>
                </select>
              </div>

              <div className="form-group">
                <label>Resource Title</label>
                <input 
                  className="modern-input"
                  placeholder="e.g. Operating Systems Mid-Sem 2024" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required 
                />
              </div>

              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea 
                  className="modern-input"
                  placeholder="Mention units covered or specific topics..."
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="grid-right-sidebar">
            <div className="glass-card sidebar-card sticky-sidebar">
              <div className="section-header">
                <GraduationCap size={18} className="text-primary" />
                <h2>Academic Meta</h2>
              </div>

              <div className="sidebar-form">
                <div className="form-group">
                  <label>Department</label>
                  <select 
                    className="modern-select"
                    value={formData.departmentId} 
                    onChange={(e) => setFormData({...formData, departmentId: e.target.value, programId: '', semesterId: '', subjectId: ''})}
                    required
                  >
                    <option value="">Choose Dept</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Program</label>
                  <select 
                    className="modern-select"
                    disabled={!formData.departmentId}
                    value={formData.programId} 
                    onChange={(e) => setFormData({...formData, programId: e.target.value, semesterId: '', subjectId: ''})}
                    required
                  >
                    <option value="">Choose Program</option>
                    {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>

                {/* 🟢 FIXED: Semester & Academic Year side-by-side (ALWAYS VISIBLE) */}
                <div className="side-row">
                  <div className="form-group">
                    <label>Semester</label>
                    <select 
                      className="modern-select"
                      disabled={!formData.programId}
                      value={formData.semesterId} 
                      onChange={(e) => setFormData({...formData, semesterId: e.target.value, subjectId: ''})}
                      required
                    >
                      <option value="">Sem</option>
                      {semesters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Content Year</label>
                    <select 
                      className="modern-select"
                      value={formData.academicYear}
                      onChange={(e) => setFormData({...formData, academicYear: parseInt(e.target.value)})}
                      required
                    >
                      {availableYears.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Conditional Exam Format Selection */}
                {showExamTypeField && (
                  <div className="form-group animate-in">
                    <label>Exam Type</label>
                    <select 
                      className="modern-select"
                      value={formData.examTypeId} 
                      onChange={(e) => setFormData({...formData, examTypeId: e.target.value})}
                      required
                    >
                      <option value="">Choose Exam Type</option>
                      {examTypes.map(t => <option key={t.id} value={t.id}>{t.examName}</option>)}
                    </select>
                  </div>
                )}

                <div className="form-group">
                  <label>Subject</label>
                  <select 
                    className="modern-select"
                    disabled={!formData.semesterId}
                    value={formData.subjectId} 
                    onChange={(e) => setFormData({...formData, subjectId: e.target.value})}
                    required
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>

                <button type="submit" className="primary-submit-btn" disabled={isUploading || !file}>
                  {isUploading ? <div className="loader"></div> : "Publish Content"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <style>{`
        :root {
          --brand: #6366f1;
          --brand-hover: #4f46e5;
          --bg-main: #f8fafc;
          --card-bg: #ffffff;
          --text-main: #0f172a;
          --text-muted: #64748b;
          --border: #e2e8f0;
          --radius: 16px;
        }

        .modern-upload-wrapper { background: var(--bg-main); min-height: 100vh; padding: 40px 20px; font-family: 'Inter', sans-serif; }
        .upload-max-width { max-width: 1040px; margin: 0 auto; }

        .page-header { margin-bottom: 40px; }
        .breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-muted); margin-bottom: 12px; font-weight: 500; }
        .page-header h1 { font-size: 32px; font-weight: 800; color: var(--text-main); letter-spacing: -0.02em; margin-bottom: 8px; }
        .page-header p { color: var(--text-muted); font-size: 15px; max-width: 600px; }

        .bento-grid { display: grid; grid-template-columns: 1fr 340px; gap: 24px; }
        .glass-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; box-shadow: 0 4px 20px -5px rgba(0,0,0,0.05); }
        .section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
        .section-header h2 { font-size: 16px; font-weight: 700; color: var(--text-main); }
        .text-primary { color: var(--brand); }

        .dropzone-container { border: 2px dashed var(--border); transition: 0.2s ease-in-out; background: #fff; display: flex; align-items: center; justify-content: center; min-height: 200px; margin-bottom: 24px; }
        .dropzone-container:hover { border-color: var(--brand); background: #f5f7ff; }
        .drag-active { border-color: var(--brand); background: #f5f7ff; transform: scale(1.01); }
        .file-ready { border-style: solid; border-color: #10b98120; background: #f0fdf4; }
        .dropzone-label { cursor: pointer; text-align: center; width: 100%; }
        .icon-box { margin-bottom: 12px; color: var(--text-muted); }
        .success-icon { color: #10b981; }
        .upload-prompt h3 { font-size: 16px; font-weight: 600; color: var(--text-main); }
        .upload-prompt p { font-size: 13px; color: var(--text-muted); margin-top: 4px; }
        .file-info h3 { font-size: 15px; font-weight: 700; color: #065f46; margin-bottom: 4px; }
        .file-info p { font-size: 12px; color: #059669; }

        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; font-size: 13px; font-weight: 600; color: var(--text-main); margin-bottom: 8px; }
        .modern-input, .modern-select { width: 100%; padding: 12px 16px; border-radius: 10px; border: 1px solid var(--border); background: #fff; font-size: 14px; transition: 0.2s; color: var(--text-main); }
        .modern-input:focus, .modern-select:focus { outline: none; border-color: var(--brand); box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1); }
        .highlight-select { border-color: var(--brand); background: #f5f7ff; font-weight: 700; }
        .side-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        .sticky-sidebar { position: sticky; top: 20px; }
        .primary-submit-btn { width: 100%; padding: 14px; border-radius: 12px; border: none; background: var(--brand); color: white; font-weight: 700; cursor: pointer; transition: 0.2s; display: flex; justify-content: center; align-items: center; }
        .primary-submit-btn:hover:not(:disabled) { background: var(--brand-hover); transform: translateY(-1px); }
        .primary-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-text { background: none; border: none; color: var(--brand); font-weight: 600; font-size: 12px; cursor: pointer; margin-top: 8px; text-decoration: underline; }

        .animate-in { animation: slideDown 0.3s ease-out; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
        .loader { width: 20px; height: 20px; border: 3px solid #ffffff30; border-top: 3px solid #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 850px) {
          .bento-grid { grid-template-columns: 1fr; }
          .sticky-sidebar { position: static; }
        }
      `}</style>
    </div>
  );
};

export default ContentUpload;