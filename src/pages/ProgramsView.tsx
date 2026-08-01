
import React, { useEffect, useState } from 'react';
import { Plus, GraduationCap, MoreVertical, CheckCircle2, UserPlus } from 'lucide-react';
import Button from '../components/Button';
import AssignRepModal from '../components/AssignRepModal';
import AddProgramModal from '../components/AddProgramModal';
import { api } from '../store/authStore';

interface Props {
  deptName: string;
  universityName: string;
  departmentId: string;
}

interface Program {
  id: string;
  name: string;
  duration?: string;
  // Handle various potential JSON field names from backend
  representativeName?: string | null;
  representative?: string | null;
  repName?: string | null;
  studentCount?: number;
}

const ProgramsView: React.FC<Props> = ({
  deptName,
  universityName,
  departmentId,
}) => {
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [assigningToProgram, setAssigningToProgram] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // FETCH FUNCTION
  const fetchPrograms = async () => {
    if (!departmentId) return;
    
    try {
      setLoading(true);
      setError(null);

      const res = await api.get(`/api/v1/get/programs/${departmentId}`);
      const data = res.data;

      if (data.success) {
        setPrograms(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch programs');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong fetching programs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, [departmentId]);

  return (
    <div className="programs-view">
      {/* HEADER */}
      <header className="dept-header">
        <div className="breadcrumb">
          <span>{universityName}</span> &rarr; <span>{deptName}</span>
        </div>

        <div className="header-flex">
          <div>
            <h1>Academic Programs</h1>
            <p className="subtitle">Manage department programs and program representatives</p>
          </div>

          <Button
            onClick={() => setShowProgramModal(true)}
            style={{ width: '200px' }}
          >
            <Plus size={18} style={{ marginRight: '8px' }} />
            Create Program
          </Button>
        </div>
      </header>

      {/* TABLE */}
      <section className="program-section">
        <div className="table-card">
          <table className="program-table">
            <thead>
              <tr>
                <th>Program Name</th>
                <th>Duration</th>
                <th>Representative Status</th>
                <th>Current Intake</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="state-cell">Loading programs...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="state-cell error">{error}</td>
                </tr>
              ) : programs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="state-cell">No programs found for this department.</td>
                </tr>
              ) : (
                programs.map((program) => {
                  // Fallback checking across typical DTO property names
                  const repDisplay =
                    program.representativeName ||
                    program.representative ||
                    program.repName ||
                    null;

                  return (
                    <ProgramRow
                      key={program.id}
                      name={program.name}
                      duration={program.duration}
                      rep={repDisplay}
                      intake={program.studentCount}
                      onAssign={() =>
                        setAssigningToProgram({
                          id: program.id,
                          name: program.name,
                        })
                      }
                    />
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* MODALS */}
      {assigningToProgram && (
        <AssignRepModal
          scopeId={assigningToProgram.id}
          scopeName={assigningToProgram.name}
          onClose={() => setAssigningToProgram(null)}
          onSuccess={() => {
            setAssigningToProgram(null);
            // Slight delay ensures database transaction settles before re-fetching
            setTimeout(() => {
              fetchPrograms();
            }, 300);
          }}
          fetchUrl={`/api/v1/get/program/${assigningToProgram.id}/students`}
          assignUrl={`/api/v1/department-rep/${departmentId}/assign-rep`}
          userIdKey="authUserId"
        />
      )}

      {showProgramModal && (
        <AddProgramModal
          departmentId={departmentId}
          onClose={() => setShowProgramModal(false)}
          onSuccess={() => {
            setShowProgramModal(false);
            fetchPrograms();
          }}
        />
      )}

      <style>{`
        .dept-header { margin-bottom: 24px; }
        .breadcrumb {
          font-size: 12px;
          color: #94a3b8;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .header-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .header-flex h1 {
          font-size: 26px;
          color: #0f172a;
          margin: 0;
          font-weight: 700;
        }
        .subtitle {
          font-size: 14px;
          color: #64748b;
          margin: 4px 0 0 0;
        }
        .table-card {
          background: white;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .program-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        th {
          padding: 16px 24px;
          background: #f8fafc;
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid #e2e8f0;
        }
        .state-cell {
          text-align: center;
          padding: 40px !important;
          color: #64748b;
          font-size: 14px;
        }
        .state-cell.error { color: #ef4444; }
      `}</style>
    </div>
  );
};

interface ProgramRowProps {
  name: string;
  duration?: string;
  rep?: string | null;
  intake?: number;
  onAssign: () => void;
}

const ProgramRow: React.FC<ProgramRowProps> = ({ name, duration, rep, intake, onAssign }) => {
  // Truthy check: verify 'rep' contains an actual non-empty string
  const hasRepresentative = Boolean(rep && rep.trim().length > 0);

  return (
    <tr className="row-style">
      <td>
        <div className="name-cell">
          <div className="icon-box">
            <GraduationCap size={18} />
          </div>
          <strong>{name}</strong>
        </div>
      </td>

      <td>
        <span className="duration-tag">{duration || 'N/A'}</span>
      </td>

      <td>
        {hasRepresentative ? (
          <div className="assigned-badge" onClick={onAssign} title="Click to reassign representative">
            <div className="avatar-xs">{rep!.charAt(0).toUpperCase()}</div>
            <span className="rep-name">{rep}</span>
            <CheckCircle2 size={14} className="check-icon" />
          </div>
        ) : (
          <button className="assign-btn" onClick={onAssign}>
            <UserPlus size={14} />
            Assign Rep +
          </button>
        )}
      </td>

      <td>
        <span className="intake-count">{intake || 0} Students</span>
      </td>

      <td style={{ textAlign: 'right' }}>
        <button className="action-btn" aria-label="More options">
          <MoreVertical size={18} />
        </button>
      </td>

      <style>{`
        .row-style td {
          padding: 16px 24px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 14px;
          vertical-align: middle;
        }
        .row-style:hover { background-color: #f8fafc; }
        .name-cell {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #1e293b;
        }
        .icon-box {
          background: #f1f5f9;
          padding: 8px;
          border-radius: 8px;
          color: #0f172a;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .duration-tag {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 12px;
          color: #475569;
          font-weight: 500;
        }
        .assigned-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          color: #047857;
          padding: 4px 12px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .assigned-badge:hover {
          background: #d1fae5;
          border-color: #6ee7b7;
        }
        .avatar-xs {
          width: 20px;
          height: 20px;
          background: #10b981;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
        }
        .check-icon {
          color: #10b981;
          margin-left: 2px;
        }
        .assign-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: 1px dashed #cbd5e1;
          color: #0284c7;
          padding: 6px 12px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s ease;
        }
        .assign-btn:hover {
          background: #f0f9ff;
          border-color: #0284c7;
          border-style: solid;
        }
        .intake-count {
          color: #475569;
          font-weight: 500;
        }
        .action-btn {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: color 0.2s;
        }
        .action-btn:hover {
          color: #1e293b;
          background: #e2e8f0;
        }
      `}</style>
    </tr>
  );
};

export default ProgramsView;