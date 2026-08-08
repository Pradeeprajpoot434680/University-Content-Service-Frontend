


import  { useCallback, useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  Search, RotateCcw, 
  Filter, ChevronRight,
   ClipboardList
} from "lucide-react";

import PaperCard from "../components/PaperCard"; 
import { useAuthStore, api, normalizeOptionalId } from "../store/authStore";

interface IdName { id: string; name: string; }
interface ExamType { id: string; examName: string; }

interface SearchFilters {
  departmentId: string;
  programId: string;
  semesterId: string;
  subjectId: string;
  examTypeId: string;
  academicYear: string;
  contentType: string; // Added Content Type to filters
}

export default function LibraryDashboard() {
  const user = useAuthStore.getState().user;
  const universityId = normalizeOptionalId(user?.universityId);

  const [departments, setDepartments] = useState<IdName[]>([]);
  const [programs, setPrograms] = useState<IdName[]>([]);
  const [semesters, setSemesters] = useState<IdName[]>([]);
  const [subjects, setSubjects] = useState<IdName[]>([]);
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [contents, setContents] = useState<any[]>([]);
  const [isDataFetching, setIsDataFetching] = useState<boolean>(false);
  
  const [filters, setFilters] = useState<SearchFilters>({
    departmentId: "",
    programId: "",
    semesterId: "",
    subjectId: "",
    examTypeId: "",
    academicYear: "2026",
    contentType: "PAPER" // Default to Paper
  });

  const cache = useRef<Record<string, any[]>>({});
  const resultsRef = useRef<HTMLDivElement>(null);
  const years = Array.from({ length: 6 }, (_, i) => (2026 - i).toString());

  // Logic to determine if Exam Type should be shown
  const showExamType = filters.contentType === "PAPER" || filters.contentType === "PAPER_SOLUTION";

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!universityId) {
        toast.error("University ID is missing. Please login again.");
        return;
      }
      console.log(isDataFetching);
      
      setIsDataFetching(true);
      try {
        const [deptRes, examRes] = await Promise.all([
          api.get(`/api/v1/get/departments/${universityId}`),
          api.get(`/api/v1/get/exam-formats/${universityId}`)
        ]);
        if (deptRes.data.success) setDepartments(deptRes.data.data);
        if (examRes.data.success) setExamTypes(examRes.data.data);
      } catch (err) {
        toast.error("Failed to load initial data");
      } finally {
        setIsDataFetching(false);
      }
    };
    fetchInitialData();
  }, [universityId]);

  useEffect(() => {
    if (!filters.departmentId) { setPrograms([]); return; }
    api.get(`/api/v1/get/programs/${filters.departmentId}`)
       .then(res => { if (res.data.success) setPrograms(res.data.data); });
  }, [filters.departmentId]);

  useEffect(() => {
    if (!filters.programId) { setSemesters([]); return; }
    api.get(`/api/v1/get/programs/${filters.programId}/structure`)
       .then(res => {
          const data = res.data.success ? res.data.data : res.data;
          setSemesters(data.semesters || []);
       });
  }, [filters.programId]);

  useEffect(() => {
    if (!filters.semesterId) { setSubjects([]); return; }
    api.get(`/api/v1/get/semesters/${filters.semesterId}/subjects`)
       .then(res => {
         const data = res.data.success ? res.data.data : res.data;
         setSubjects(data || []);
       });
  }, [filters.semesterId]);

  const fetchResources = useCallback(async () => {
    if (!universityId) {
      toast.error("University ID is missing. Please login again.");
      return;
    }
    setLoading(true);
    const selectedSemObj = semesters.find(s => s.id === filters.semesterId);
    
    const payload = {
      universityId,
      departmentId: filters.departmentId || null,
      programId: filters.programId || null,
      semester: selectedSemObj ? parseInt(selectedSemObj.name.replace(/\D/g, "")) : null,
      subjectId: filters.subjectId || null,
      examTypeId: showExamType ? (filters.examTypeId || null) : null, // Clean examTypeId if hidden
      academicYear: filters.academicYear ? parseInt(filters.academicYear) : null,
      contentType: filters.contentType
    };

    const cacheKey = JSON.stringify(payload);
    if (cache.current[cacheKey]) {
      setContents(cache.current[cacheKey]);
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.post(`/api/v1/content/search`, payload);
      const results = data.success ? data.data : data;
      const finalData = Array.isArray(results) ? results : [];
      
      setContents(finalData);
      cache.current[cacheKey] = finalData;
      
      if (finalData.length === 0) toast.info("No resources found");
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      toast.error("Error searching library");
    } finally {
      setLoading(false);
    }
  }, [filters, semesters, universityId, showExamType]);

  const resetFilters = () => {
    setFilters({
      departmentId: "",
      programId: "",
      semesterId: "",
      subjectId: "",
      examTypeId: "",
      academicYear: "2026",
      contentType: "PAPER"
    });
    setContents([]);
  };

  return (
    <div className="modern-upload-wrapper">
      <div className="upload-max-width">
        
        <header className="page-header">
          <div className="breadcrumb">
            Library <ChevronRight size={14} /> <span>Browse Archive</span>
          </div>
          <div className="flex-header">
            <div>
              <h1>Academic Resources</h1>
              <p>Filter by content type to find papers, solutions, or lecture notes.</p>
            </div>
            <button className="btn-text flex items-center gap-2" onClick={resetFilters}>
              <RotateCcw size={14} /> Reset Filters
            </button>
          </div>
        </header>

        <div className="bento-grid">
          
          {/* Left Sidebar: Filters */}
          <aside className="grid-right-sidebar order-2 md:order-1">
            <div className="glass-card sticky-sidebar">
              <div className="section-header">
                <Filter size={18} className="text-primary" />
                <h2>Search Filters</h2>
              </div>

              <div className="sidebar-form">
                {/* 1. Content Type Selector - ALWAYS SHOWN */}
                <div className="form-group">
                  <label>I am looking for</label>
                  <select 
                    className="modern-select content-type-select"
                    value={filters.contentType}
                    onChange={(e) => setFilters({...filters, contentType: e.target.value, examTypeId: ''})}
                  >
                    <option value="PAPER">Exam Papers</option>
                    <option value="PAPER_SOLUTION">Paper Solutions</option>
                    <option value="NOTES">Lecture Notes</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Department</label>
                  <select 
                    className="modern-select"
                    value={filters.departmentId}
                    onChange={(e) => setFilters({...filters, departmentId: e.target.value, programId: '', semesterId: '', subjectId: ''})}
                  >
                    <option value="">All Departments</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Program</label>
                  <select 
                    className="modern-select"
                    disabled={!filters.departmentId}
                    value={filters.programId}
                    onChange={(e) => setFilters({...filters, programId: e.target.value, semesterId: '', subjectId: ''})}
                  >
                    <option value="">Select Program</option>
                    {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>

                <div className="side-row">
                  <div className="form-group">
                    <label>Semester</label>
                    <select 
                      className="modern-select"
                      disabled={!filters.programId}
                      value={filters.semesterId}
                      onChange={(e) => setFilters({...filters, semesterId: e.target.value, subjectId: ''})}
                    >
                      <option value="">Sem</option>
                      {semesters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Year</label>
                    <select 
                      className="modern-select"
                      value={filters.academicYear}
                      onChange={(e) => setFilters({...filters, academicYear: e.target.value})}
                    >
                      {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>

                {/* 2. Conditional Exam Type Logic */}monnp
                {showExamType && (
                  <div className="form-group animate-in fade-in duration-300">
                    <label>Exam Type</label>
                    <select 
                      className="modern-select"
                      value={filters.examTypeId}
                      onChange={(e) => setFilters({...filters, examTypeId: e.target.value})}
                    >
                      <option value="">All Types</option>
                      {examTypes.map(t => <option key={t.id} value={t.id}>{t.examName}</option>)}
                    </select>
                  </div>
                )}

                <div className="form-group">
                  <label>Subject</label>
                  <select 
                    className="modern-select"
                    disabled={!filters.semesterId}
                    value={filters.subjectId}
                    onChange={(e) => setFilters({...filters, subjectId: e.target.value})}
                  >
                    <option value="">All Subjects</option>
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>

                <button 
                  onClick={fetchResources} 
                  className="primary-submit-btn mt-4" 
                  disabled={loading}
                >
                  {loading ? <div className="loader"></div> : <><Search size={18} className="mr-2"/> Search</>}
                </button>
              </div>
            </div>
          </aside>

          {/* Right Main Content */}
          <main className="grid-left-main order-1 md:order-2" ref={resultsRef}>
            {contents.length > 0 ? (
              <div className="results-container">
                <div className="results-header">
                  <ClipboardList size={18} className="text-primary" />
                  <h2>Found {contents.length} {filters.contentType.replace("_", " ").toLowerCase()}(s)</h2>
                </div>
                <div className="papers-grid">
                  {contents.map((item) => (
                    <PaperCard key={item.id} content={item} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="empty-state-container glass-card">
                <div className="icon-box-large">
                  <Search size={48} strokeWidth={1.5} />
                </div>
                <h3>Start your search</h3>
                <p>Select your {filters.contentType.toLowerCase()} filters on the left to browse the library.</p>
              </div>
            )}
          </main>
        </div>
      </div>

      <style>{`
        /* Include the CSS from the previous response here to maintain styling */
        .content-type-select {
          border-color: var(--brand);
          background-color: #f5f7ff;
          font-weight: 700;
        }
        .animate-in {
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
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

        .flex-header { display: flex; justify-content: space-between; align-items: flex-end; }
        .papers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        
        .empty-state-container { 
          text-align: center; 
          padding: 80px 40px; 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          justify-content: center;
        }
        .icon-box-large { color: var(--border); margin-bottom: 20px; }
        .empty-state-container h3 { font-size: 20px; font-weight: 700; color: var(--text-main); margin-bottom: 8px; }
        .empty-state-container p { color: var(--text-muted); font-size: 14px; max-width: 320px; }

        .results-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
        .results-header h2 { font-size: 18px; font-weight: 700; color: var(--text-main); }

        /* Reuse your styles */
        .modern-upload-wrapper { background: var(--bg-main); min-height: 100vh; padding: 40px 20px; font-family: 'Inter', sans-serif; }
        .upload-max-width { max-width: 1200px; margin: 0 auto; }
        .page-header { margin-bottom: 40px; }
        .breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-muted); margin-bottom: 12px; font-weight: 500; }
        .page-header h1 { font-size: 32px; font-weight: 800; color: var(--text-main); letter-spacing: -0.02em; margin-bottom: 8px; }
        .page-header p { color: var(--text-muted); font-size: 15px; max-width: 600px; }
        .bento-grid { display: grid; grid-template-columns: 320px 1fr; gap: 32px; align-items: start; }
        .glass-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; box-shadow: 0 4px 20px -5px rgba(0,0,0,0.05); }
        .section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
        .section-header h2 { font-size: 16px; font-weight: 700; color: var(--text-main); }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; font-size: 12px; font-weight: 700; color: var(--text-main); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.02em; }
        .modern-select { width: 100%; padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border); background: #fff; font-size: 14px; transition: 0.2s; color: var(--text-main); cursor: pointer; }
        .modern-select:focus { outline: none; border-color: var(--brand); box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1); }
        .side-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .sticky-sidebar { position: sticky; top: 20px; }
        .primary-submit-btn { width: 100%; padding: 14px; border-radius: 12px; border: none; background: var(--brand); color: white; font-weight: 700; cursor: pointer; transition: 0.2s; display: flex; justify-content: center; align-items: center; gap: 8px; }
        .primary-submit-btn:hover { background: var(--brand-hover); transform: translateY(-1px); }
        .btn-text { background: none; border: none; color: var(--brand); font-weight: 600; font-size: 13px; cursor: pointer; }
        .info-alert { display: flex; gap: 10px; padding: 12px; background: #eff6ff; border-radius: 10px; border: 1px solid #dbeafe; }
        .info-alert span { font-size: 11px; color: #1e40af; line-height: 1.4; font-weight: 500; }
        .loader { width: 20px; height: 20px; border: 3px solid #ffffff30; border-top: 3px solid #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 1000px) {
          .bento-grid { grid-template-columns: 1fr; }
          .sticky-sidebar { position: static; }
        }
      `}</style>
    </div>
  );
}