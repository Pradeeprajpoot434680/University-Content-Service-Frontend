import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Loader2, 
  Search, 
  Plus, 
  UserCheck, 
  UserPlus
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '../store/authStore';
import { useEscapeKey } from '../hooks/useEscapeKey';

interface Program {
  id: string;
  name: string;
  code: string; // e.g., CS101
  repName: string | null;
  studentCount: number;
}

interface Student {
  authUserId: string;
  fullName: string;
  email: string;
}

const ProgramsSection: React.FC<{ departmentId: string }> = ({ departmentId }) => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal states
  const [_ , setShowAddModal] = useState(false);
  const [assigningProgram, setAssigningProgram] = useState<Program | null>(null);
  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  useEscapeKey(() => setAssigningProgram(null), Boolean(assigningProgram));

  const token = useAuthStore.getState().accessToken;

  // 1. Fetch Programs for this Department
  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/v1/dept-rep/${departmentId}/programs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) setPrograms(res.data.data);
    } catch {
      toast.error("Failed to load programs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPrograms(); }, [departmentId]);

  // 2. Fetch Students for Assignment
  const fetchStudents = async () => {
    setLoadingStudents(true);
    try {
      // Fetch students belonging to this specific department
      const res = await axios.get(`http://localhost:8080/api/v1/get/${departmentId}/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) setAvailableStudents(res.data.data);
    } catch {
      toast.error("Error fetching students");
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleAssignRep = async (studentId: string) => {
    if (!assigningProgram) return;
    try {
      const res = await axios.post(`http://localhost:8080/api/v1/dept-rep/assign-program-rep`, {
        userId: studentId,
        scopeId: assigningProgram.id // The Program ID
      }, { headers: { Authorization: `Bearer ${token}` } });

      if (res.data.success) {
        toast.success("Program Representative assigned!");
        setAssigningProgram(null);
        fetchPrograms();
      }
    } catch {
      toast.error("Assignment failed");
    }
  };

  const filteredPrograms = programs.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="section-container">
      <header className="admin-header">
        <div>
          <h1>Department Programs</h1>
          <p>Manage academic courses and designate program leads.</p>
        </div>
        <button className="primary-btn" onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> Add Program
        </button>
      </header>

      <div className="table-controls">
        <div className="search-bar">
          <Search size={18} />
          <input 
            placeholder="Search programs..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading-placeholder"><Loader2 className="animate-spin" /> Loading...</div>
        ) : (
          <table className="uni-table">
            <thead>
              <tr>
                <th>Program Code</th>
                <th>Program Name</th>
                <th>Representative</th>
                <th>Enrollment</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPrograms.map((program) => (
                <tr key={program.id}>
                  <td><span className="code-badge">{program.code}</span></td>
                  <td><strong>{program.name}</strong></td>
                  <td>
                    {program.repName ? (
                      <div className="rep-info"><UserCheck size={14} color="#3cd3ad" /> {program.repName}</div>
                    ) : (
                      <span className="text-muted">No Rep Assigned</span>
                    )}
                  </td>
                  <td>{program.studentCount} Students</td>
                  <td>
                    <button className="assign-btn" onClick={() => {
                        setAssigningProgram(program);
                        fetchStudents();
                    }}>
                      Assign Rep
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ASSIGN MODAL */}
      {assigningProgram && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Assign Program Rep</h3>
              <p>For: {assigningProgram.name}</p>
            </div>
            <div className="modal-body">
              {loadingStudents ? <Loader2 className="animate-spin center" /> : 
               availableStudents.map(student => (
                <div key={student.authUserId} className="user-card-mini">
                  <div className="user-details">
                    <div className="avatar-small">{student.fullName.charAt(0)}</div>
                    <div>
                      <h5>{student.fullName}</h5>
                      <p>{student.email}</p>
                    </div>
                  </div>
                  <button onClick={() => handleAssignRep(student.authUserId)} className="icon-action-btn">
                    <UserPlus size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button className="close-btn" onClick={() => setAssigningProgram(null)}>Cancel</button>
          </div>
        </div>
      )}

      <style>{`
        .code-badge { background: #f1f5f9; padding: 4px 8px; border-radius: 6px; font-family: monospace; font-weight: bold; font-size: 12px; }
        .rep-info { display: flex; align-items: center; gap: 6px; font-weight: 500; color: #1e293b; }
        .text-muted { color: #94a3b8; font-size: 13px; }
        
        .user-card-mini {
          display: flex; justify-content: space-between; align-items: center;
          padding: 10px; border-bottom: 1px solid #f1f5f9;
        }
        .user-details { display: flex; align-items: center; gap: 10px; }
        .avatar-small { width: 28px; height: 28px; background: #eff6ff; color: #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; }
        .user-details h5 { margin: 0; font-size: 14px; }
        .user-details p { margin: 0; font-size: 11px; color: #64748b; }
        
        .icon-action-btn { background: #1e293b; color: white; border: none; padding: 6px; border-radius: 6px; cursor: pointer; }
        .loading-placeholder { padding: 50px; text-align: center; color: #64748b; }
      `}</style>
    </div>
  );
};

export default ProgramsSection;
