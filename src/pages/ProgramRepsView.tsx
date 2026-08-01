// import React, { useEffect, useState } from 'react';
// import { MoreVertical } from 'lucide-react';
// import axios from 'axios';
// import { useAuthStore } from '../store/authStore';

// interface ProgramRep {
//   assignmentId: string;
//   userId: string;
//   fullName: string;
//   email: string;
//   universityId: string;
//   universityName: string;
//   assignedAt: string;
//   isActive: boolean;
// }

// interface Props {
//   departmentId: string;
// }

// const ProgramRepsView: React.FC<Props> = ({ departmentId }) => {
//   const [reps, setReps] = useState<ProgramRep[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const token = useAuthStore.getState().accessToken;

//   const fetchReps = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(
//         `http://localhost:8080/api/v1/department-rep/${departmentId}/program-reps`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (res.data.success) {
//         setReps(res.data.data);
//       } else {
//         setError('Failed to fetch program representatives');
//       }
//     } catch (err) {
//       console.error(err);
//       setError('Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchReps();
//   }, [departmentId]);

//   return (
//     <div className="program-reps-view">
//       <header className="dept-header">
//         <h1>Program Representatives</h1>
//       </header>

//       <section className="table-section">
//         <div className="table-card">
//           <table className="rep-table">
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Program</th>
//                 <th>Assigned At</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan={6}>Loading...</td>
//                 </tr>
//               ) : error ? (
//                 <tr>
//                   <td colSpan={6}>{error}</td>
//                 </tr>
//               ) : reps.length === 0 ? (
//                 <tr>
//                   <td colSpan={6}>No representatives found</td>
//                 </tr>
//               ) : (
//                 reps.map((rep) => (
//                   <tr key={rep.assignmentId}>
//                     <td>{rep.fullName}</td>
//                     <td>{rep.email}</td>
//                     <td>{rep.universityName}</td>
//                     <td>{new Date(rep.assignedAt).toLocaleString()}</td>
//                     <td>{rep.isActive ? 'Active' : 'Inactive'}</td>
//                     <td>
//                       <MoreVertical size={18} color="#cbd5e1" />
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </section>

//       <style>{`
//         .dept-header h1 {
//           font-size: 26px;
//           color: #1e293b;
//           margin-bottom: 20px;
//         }
//         .table-card {
//           background: #fff;
//           border-radius: 16px;
//           border: 1px solid #e2e8f0;
//           overflow: hidden;
//           box-shadow: 0 4px 6px rgba(0,0,0,0.05);
//         }
//         .rep-table {
//           width: 100%;
//           border-collapse: collapse;
//         }
//         th, td {
//           padding: 16px 20px;
//           text-align: left;
//           font-size: 14px;
//         }
//         th {
//           background: #f8fafc;
//           color: #64748b;
//           text-transform: uppercase;
//           border-bottom: 1px solid #e2e8f0;
//         }
//         td {
//           border-bottom: 1px solid #f1f5f9;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ProgramRepsView;


import React, { useEffect, useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { api } from '../store/authStore';

interface ProgramRep {
  assignmentId: string;
  userId: string;
  fullName: string;
  email: string;
  universityId?: string;
  universityName?: string;
  programName?: string;
  assignedAt: string;
  isActive: boolean;
}

interface Props {
  departmentId: string;
}

const ProgramRepsView: React.FC<Props> = ({ departmentId }) => {
  const [reps, setReps] = useState<ProgramRep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReps = async () => {
    if (!departmentId) return;

    try {
      setLoading(true);
      setError(null);
      // Replaced raw axios call with configured api instance
      const res = await api.get(`/api/v1/department-rep/${departmentId}/program-reps`);

      if (res.data?.success) {
        setReps(res.data.data || []);
      } else {
        setError(res.data?.message || 'Failed to fetch program representatives');
      }
    } catch (err: any) {
      console.error('Error fetching reps:', err);
      setError(err.response?.data?.message || 'Something went wrong fetching representatives');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReps();
  }, [departmentId]);

  return (
    <div className="program-reps-view">
      <header className="dept-header">
        <h1>Program Representatives</h1>
      </header>

      <section className="table-section">
        <div className="table-card">
          <table className="rep-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Program / Institution</th>
                <th>Assigned At</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="state-cell">Loading representatives...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="state-cell error">{error}</td>
                </tr>
              ) : reps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="state-cell">No representatives found for this department.</td>
                </tr>
              ) : (
                reps.map((rep) => (
                  <tr key={rep.assignmentId}>
                    <td>
                      <strong>{rep.fullName}</strong>
                    </td>
                    <td>{rep.email}</td>
                    <td>{rep.programName || rep.universityName || 'N/A'}</td>
                    <td>{rep.assignedAt ? new Date(rep.assignedAt).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <span className={`status-pill ${rep.isActive ? 'active' : 'inactive'}`}>
                        {rep.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <MoreVertical size={18} color="#94a3b8" cursor="pointer" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <style>{`
        .dept-header h1 {
          font-size: 26px;
          color: #1e293b;
          margin-bottom: 20px;
          font-weight: 700;
        }
        .table-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .rep-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        th, td {
          padding: 16px 20px;
          font-size: 14px;
        }
        th {
          background: #f8fafc;
          color: #64748b;
          text-transform: uppercase;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.05em;
          border-bottom: 1px solid #e2e8f0;
        }
        td {
          border-bottom: 1px solid #f1f5f9;
        }
        .state-cell {
          text-align: center;
          padding: 30px !important;
          color: #64748b;
        }
        .state-cell.error {
          color: #ef4444;
        }
        .status-pill {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }
        .status-pill.active {
          background: #dcfce7;
          color: #15803d;
        }
        .status-pill.inactive {
          background: #f1f5f9;
          color: #64748b;
        }
      `}</style>
    </div>
  );
};

export default ProgramRepsView;