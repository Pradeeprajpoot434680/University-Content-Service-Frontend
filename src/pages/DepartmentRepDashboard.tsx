// import React, { useState } from 'react';
// import ProgramsView from './ProgramsView';
// // import ProgramRepsView from './ProgramRepsView';
// // import AcademicCycleView from './AcademicCycleView';
// // import DeptAnalyticsView from './DeptAnalyticsView';

// import { Users, Calendar, BookCopy, Layers } from 'lucide-react';
// import ProgramRepsView from './ProgramRepsView';

// const DepartmentRepDashboard: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<
//     'PROGRAMS' | 'REPS' | 'CYCLE' | 'ANALYTICS'
//   >('PROGRAMS');

//   // ✅ CENTRALIZED DATA (can later come from auth/global state)
//   const department = {
//     id: 'c05ca9d3-b628-4200-b995-513d88e5a67d', // 🔥 IMPORTANT
//     name: 'Computer Science & Engineering',
//     university: 'CURAJ',
//   };

//   const renderActiveView = () => {
//     switch (activeTab) {
//       case 'PROGRAMS':
//         return (
//           <ProgramsView
//             deptName={department.name}
//             universityName={department.university}
//             departmentId={department.id} // ✅ PASS THIS
//           />
//         );


//         case 'REPS':
//           return <ProgramRepsView departmentId={department.id} />;
//       // Future scalability 👇
//       // case 'REPS':
//       //   return <ProgramRepsView departmentId={department.id} />;

//       // case 'CYCLE':
//       //   return <AcademicCycleView departmentId={department.id} />;

//       // case 'ANALYTICS':
//       //   return <DeptAnalyticsView departmentId={department.id} />;

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="dept-container">
      
//       {/* SIDEBAR */}
//       <aside className="dept-sidebar">
//         <div className="logo-section">
//           <div className="role-badge">DEPT REP</div>
//           <span className="logo-text">PrevPaper</span>
//         </div>

//         <nav className="dept-nav">
//           <NavItem
//             icon={<Layers size={18} />}
//             label="Programs"
//             active={activeTab === 'PROGRAMS'}
//             onClick={() => setActiveTab('PROGRAMS')}
//           />

//           <NavItem
//             icon={<Users size={18} />}
//             label="Program Reps"
//             active={activeTab === 'REPS'}
//             onClick={() => setActiveTab('REPS')}
//           />

//           <NavItem
//             icon={<Calendar size={18} />}
//             label="Academic Cycle"
//             active={activeTab === 'CYCLE'}
//             onClick={() => setActiveTab('CYCLE')}
//           />

//           <NavItem
//             icon={<BookCopy size={18} />}
//             label="Dept Analytics"
//             active={activeTab === 'ANALYTICS'}
//             onClick={() => setActiveTab('ANALYTICS')}
//           />
//         </nav>
//       </aside>

//       {/* MAIN CONTENT */}
//       <main className="dept-main">{renderActiveView()}</main>

//       <style>{`
//         .dept-container {
//           display: flex;
//           min-height: 100vh;
//           background: #f4f7f6;
//         }

//         .dept-sidebar {
//           width: 250px;
//           background: #fff;
//           border-right: 1px solid #e2e8f0;
//           padding: 30px 20px;
//         }

//         .role-badge {
//           background: #3cd3ad;
//           color: white;
//           font-size: 10px;
//           font-weight: 900;
//           padding: 2px 8px;
//           border-radius: 4px;
//           margin-bottom: 5px;
//         }

//         .logo-text {
//           display: block;
//           font-weight: 800;
//           font-size: 20px;
//         }

//         .dept-nav {
//           margin-top: 40px;
//         }

//         .dept-main {
//           flex: 1;
//           padding: 40px;
//         }
//       `}</style>
//     </div>
//   );
// };


// // ✅ CLEAN NAV ITEM COMPONENT
// const NavItem = ({ icon, label, active, onClick }: any) => (
//   <div
//     className={`nav-item ${active ? 'active' : ''}`}
//     onClick={onClick}
//   >
//     {icon}
//     {label}

//     <style>{`
//       .nav-item {
//         display: flex;
//         align-items: center;
//         gap: 12px;
//         padding: 12px;
//         border-radius: 10px;
//         cursor: pointer;
//         color: #64748b;
//         margin-bottom: 8px;
//         font-weight: 500;
//         transition: 0.2s;
//       }

//       .nav-item:hover {
//         background: #f8fafc;
//         color: #1a1a1a;
//       }

//       .nav-item.active {
//         background: #1a1a1a;
//         color: #3cd3ad;
//       }
//     `}</style>
//   </div>
// );

// export default DepartmentRepDashboard;


import React, { useEffect, useState } from 'react';
import ProgramsView from './ProgramsView';
import ProgramRepsView from './ProgramRepsView';
import { Users, Calendar, BookCopy, Layers, Loader2 } from 'lucide-react';
import { useAuthStore, api } from '../store/authStore';

interface DepartmentMetadata {
  id: string;
  name: string;
  universityId?: string;
  universityName?: string;
}

const DepartmentRepDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'PROGRAMS' | 'REPS' | 'CYCLE' | 'ANALYTICS'
  >('PROGRAMS');

  const [deptInfo, setDeptInfo] = useState<DepartmentMetadata | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Extract user state from Zustand store
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchDepartmentMetadata = async () => {
      // For DEPT_REP role, scopeId contains the department ID
      const departmentId = user?.scopeId;

      if (!departmentId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Call Backend Controller: GET /api/v1/department/{id}
        const res = await api.get(`/api/v1/department/${departmentId}`);
        
        if (res.data?.success && res.data?.data) {
          const data = res.data.data;
          setDeptInfo({
            id: data.id,
            name: data.name,
            universityId: data.universityId,
            universityName: data.universityName || 'University',
          });
        }
      } catch (err) {
        console.error('Failed to fetch department details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentMetadata();
  }, [user?.scopeId]);

  // Fallback metadata if fetch is pending or fails
  const department = deptInfo || {
    id: user?.scopeId || '',
    name: 'Department',
    universityName: 'University',
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'PROGRAMS':
        return (
          <ProgramsView
            deptName={department.name}
            universityName={department.universityName || 'University'}
            departmentId={department.id}
          />
        );

      case 'REPS':
        return <ProgramRepsView departmentId={department.id} />;

      // Future views
      // case 'CYCLE':
      //   return <AcademicCycleView departmentId={department.id} />;
      // case 'ANALYTICS':
      //   return <DeptAnalyticsView departmentId={department.id} />;

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <Loader2 className="animate-spin" size={32} />
        <span>Loading department workspace...</span>
        <style>{`
          .loading-screen {
            display: flex;
            flex-direction: column;
            gap: 12px;
            height: 100vh;
            justify-content: center;
            align-items: center;
            background: #f4f7f6;
            color: #64748b;
            font-size: 15px;
          }
          .animate-spin {
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="dept-container">
      {/* SIDEBAR */}
      <aside className="dept-sidebar">
        <div className="logo-section">
          <div className="role-badge">DEPT REP</div>
          <span className="logo-text">PrevPaper</span>
        </div>

        <nav className="dept-nav">
          <NavItem
            icon={<Layers size={18} />}
            label="Programs"
            active={activeTab === 'PROGRAMS'}
            onClick={() => setActiveTab('PROGRAMS')}
          />

          <NavItem
            icon={<Users size={18} />}
            label="Program Reps"
            active={activeTab === 'REPS'}
            onClick={() => setActiveTab('REPS')}
          />

          <NavItem
            icon={<Calendar size={18} />}
            label="Academic Cycle"
            active={activeTab === 'CYCLE'}
            onClick={() => setActiveTab('CYCLE')}
          />

          <NavItem
            icon={<BookCopy size={18} />}
            label="Dept Analytics"
            active={activeTab === 'ANALYTICS'}
            onClick={() => setActiveTab('ANALYTICS')}
          />
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dept-main">{renderActiveView()}</main>

      <style>{`
        .dept-container {
          display: flex;
          min-height: 100vh;
          background: #f4f7f6;
        }

        .dept-sidebar {
          width: 250px;
          background: #fff;
          border-right: 1px solid #e2e8f0;
          padding: 30px 20px;
        }

        .role-badge {
          background: #3cd3ad;
          color: white;
          font-size: 10px;
          font-weight: 900;
          padding: 2px 8px;
          border-radius: 4px;
          margin-bottom: 5px;
          display: inline-block;
        }

        .logo-text {
          display: block;
          font-weight: 800;
          font-size: 20px;
        }

        .dept-nav {
          margin-top: 40px;
        }

        .dept-main {
          flex: 1;
          padding: 40px;
        }
        @media (max-width: 820px) {
          .dept-container { display: block; }
          .dept-sidebar { position: sticky; top: 0; z-index: 30; width: 100%; padding: 12px 16px; border-right: 0; border-bottom: 1px solid #e2e8f0; }
          .dept-sidebar .logo-section { display: none; }
          .dept-nav { display: flex; gap: 8px; margin-top: 0; overflow-x: auto; }
          .dept-nav .nav-item { flex: 0 0 auto; margin-bottom: 0; white-space: nowrap; padding: 9px 12px; font-size: 13px; }
          .dept-main { padding: 20px 16px 32px; }
        }
      `}</style>
    </div>
  );
};

// NAV ITEM COMPONENT
const NavItem = ({ icon, label, active, onClick }: any) => (
  <div
    className={`nav-item ${active ? 'active' : ''}`}
    onClick={onClick}
  >
    {icon}
    {label}

    <style>{`
      .nav-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        border-radius: 10px;
        cursor: pointer;
        color: #64748b;
        margin-bottom: 8px;
        font-weight: 500;
        transition: 0.2s;
      }

      .nav-item:hover {
        background: #f8fafc;
        color: #1a1a1a;
      }

      .nav-item.active {
        background: #1a1a1a;
        color: #3cd3ad;
      }
    `}</style>
  </div>
);

export default DepartmentRepDashboard;
