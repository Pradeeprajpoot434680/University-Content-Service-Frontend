import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2, Users, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '../store/authStore';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { API_BASE_URL } from '../config';

interface Department {
  id: string;
  name: string;
}

interface Assignment {
  email: string;
  fullName: string;
  departmentId: string;   // 🟢 Changed from departmentName to ID for bulletproof tracking
  departmentName: string; 
}

interface Student {
  authUserId: string;
  fullName: string;
  email: string | null;
}

const DeptRepsView: React.FC<{ universityId: string }> = ({ universityId }) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  const [assigningDept, setAssigningDept] = useState<Department | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [assigningStudentId, setAssigningStudentId] = useState<string | null>(null);
  useEscapeKey(() => setAssigningDept(null), Boolean(assigningDept));

  const token = useAuthStore.getState().accessToken;

  // ================= FETCH DEPARTMENTS & ASSIGNMENTS =================
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch baseline departments
      const deptRes = await axios.get(
        `${API_BASE_URL}/api/v1/university-rep/${universityId}/departments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 2. Fetch baseline active assignments details
      const repRes = await axios.get(
        `${API_BASE_URL}/api/v1/university-rep/${universityId}/department-rep`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (deptRes.data.success) {
        setDepartments(deptRes.data.data);
      }
      if (repRes.data.success) {
        setAssignments(repRes.data.data);
      }
    } catch (err) {
      toast.error('Error connecting to security services pipeline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [universityId]);

  // 🟢 FIXED: Fallback lookup matching sequence checks ID bounds dynamically first
  const getRepForDepartment = (dept: Department): Assignment | undefined => {
    return assignments.find(
      (assign) => 
        assign.departmentId === dept.id || 
        assign.departmentName.trim().toLowerCase() === dept.name.trim().toLowerCase()
    );
  };

  // ================= FETCH STUDENTS =================
  const fetchStudents = async (deptId: string) => {
    setLoadingStudents(true);
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/v1/get/department/${deptId}/students`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setStudents(res.data.data);
      } else {
        toast.error(res.data.message || 'Failed to load students');
      }
    } catch {
      toast.error('Server connection error');
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleAssignClick = async (dept: Department) => {
    setAssigningDept(dept);
    await fetchStudents(dept.id);
  };

  // ================= ASSIGN STUDENT =================
  const handleAssignStudent = async (studentId: string) => {
    if (!assigningDept) return;
    setAssigningStudentId(studentId);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/university-rep/${universityId}/assign-rep`,
        {
          userId: studentId,        
          scopeId: assigningDept.id,        
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success('Representative assigned successfully!');
        setAssigningDept(null);
        await fetchData(); // 🟢 Forces data re-fetch and updates UI views instantly
      } else {
        toast.error(res.data.message || 'Failed to assign rep');
      }
    } catch (err) {
      toast.error('Server connection error');
    } finally {
      setAssigningStudentId(null);
    }
  };

  return (
    <div className="view-container">
      <div className="header">
        <h2>Department Representatives</h2>
        <p>Assign representatives to each department.</p>
      </div>

      {/* TABLE */}
      <div className="table-container">
        {loading ? (
          <div className="loading-container">
            <Loader2 size={22} className="animate-spin" />
            <span>Loading deployment registries...</span>
          </div>
        ) : (
          <table className="dept-table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Representative</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {departments.map((dept) => {
                // 🟢 FIXED: Now passing the entire dept object map layer context to ensure tracking match accuracy
                const assignment = getRepForDepartment(dept);

                return (
                  <tr key={dept.id}>
                    <td className="dept-name">{dept.name}</td>

                    <td>
                      {assignment ? (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span className="rep-name">{assignment.fullName}</span>
                          <span style={{ fontSize: '11px', color: '#64748b' }}>{assignment.email}</span>
                        </div>
                      ) : (
                        <span className="no-rep">Not Assigned</span>
                      )}
                    </td>

                    <td>
                      {assignment ? (
                        <span className="assigned-badge">
                          <CheckCircle size={14} /> Assigned
                        </span>
                      ) : (
                        <button
                          className="assign-btn"
                          onClick={() => handleAssignClick(dept)}
                        >
                          Assign +
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {assigningDept && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Assign Representative</h3>
              <p>{assigningDept.name} Department</p>
            </div>

            {loadingStudents ? (
              <div className="loading-container">
                <Loader2 size={20} className="animate-spin" />
                Loading students...
              </div>
            ) : students.length === 0 ? (
              <div className="empty-state">
                <Users size={20} />
                <p>No students found in this department portfolio registry</p>
              </div>
            ) : (
              <div className="student-list">
                {students.map((student) => (
                  <div key={student.authUserId} className="student-card">
                    <div className="student-info">
                      <div className="avatar">
                        {student.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4>{student.fullName}</h4>
                        <p>{student.email || "No email available"}</p>
                      </div>
                    </div>

                    <button
                      className="assign-action"
                      onClick={() => handleAssignStudent(student.authUserId)}
                      disabled={assigningStudentId !== null}
                    >
                      {assigningStudentId === student.authUserId ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        'Assign'
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button className="close-btn" onClick={() => setAssigningDept(null)}>
              Close
            </button>
          </div>
        </div>
      )}

      <style>{`
        .header h2 { margin: 0; font-size: 22px; color: #1e293b; }
        .header p { color: #64748b; margin-bottom: 20px; font-size: 14px; }
        .table-container { background: white; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; overflow: hidden; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #f8fafc; padding: 14px; font-size: 13px; color: #64748b; text-align: left; font-weight: 600; border-bottom: 1px solid #e2e8f0; }
        td { padding: 14px; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #334155; }
        .dept-name { font-weight: 600; color: #1e293b; }
        .rep-name { color: #16a34a; font-weight: 600; }
        .no-rep { color: #f59e0b; background: #fffbeb; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 500; }
        .assign-btn { background: #3cd3ad15; color: #3cd3ad; border: none; padding: 6px 14px; font-weight: 600; border-radius: 6px; cursor: pointer; transition: 0.2s; }
        .assign-btn:hover { background: #3cd3ad; color: white; }
        
        .assigned-badge { display: inline-flex; align-items: center; gap: 6px; background: #f1f5f9; color: #64748b; padding: 6px 14px; border-radius: 6px; font-size: 13px; font-weight: 600; border: 1px solid #e2e8f0; user-select: none; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(4px); display: flex; justify-content: center; align-items: center; z-index: 999; }
        .modal { background: white; padding: 24px; border-radius: 16px; width: 460px; max-height: 80vh; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
        .modal-header h3 { margin: 0; font-size: 18px; color: #1e293b; }
        .modal-header p { font-size: 13px; color: #64748b; margin: 4px 0 0 0; }
        .student-list { display: flex; flex-direction: column; gap: 8px; margin-top: 10px; }
        .student-card { display: flex; justify-content: space-between; align-items: center; padding: 12px; border-radius: 10px; border: 1px solid #e2e8f0; }
        .student-info { display: flex; align-items: center; gap: 12px; }
        .avatar { width: 36px; height: 36px; background: #3cd3ad15; color: #3cd3ad; font-weight: bold; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; }
        .student-info h4 { margin: 0; font-size: 14px; color: #1e293b; }
        .student-info p { margin: 0; font-size: 12px; color: #64748b; }
        .assign-action { background: #1e293b; color: white; border: none; padding: 6px 14px; font-weight: 500; font-size: 13px; border-radius: 6px; cursor: pointer; }
        .assign-action:hover { background: #0f172a; }
        .assign-action:disabled { background: #94a3b8; cursor: not-allowed; }
        .close-btn { margin-top: 10px; padding: 10px; border-radius: 8px; border: none; background: #f1f5f9; color: #64748b; font-weight: 600; cursor: pointer; }
        .close-btn:hover { background: #e2e8f0; color: #1e293b; }
        .loading-container { display: flex; gap: 10px; justify-content: center; align-items: center; padding: 30px; color: #64748b; font-size: 14px; }
        .empty-state { text-align: center; padding: 30px; color: #94a3b8; display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default DeptRepsView;
