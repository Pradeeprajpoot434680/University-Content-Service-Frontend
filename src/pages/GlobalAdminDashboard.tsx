// import React, { useState } from 'react';
// import Button from '../components/Button';
// import {
//   School,
//   Users,
//   Activity,
//   Plus,
//   Search,
//   MoreVertical,
//   Mail,
// } from 'lucide-react';

// import AddUniversityModal from '../components/AddUniversityModal';
// import AssignRepModal from '../components/AssignRepModal';

// // 👉 IMPORT YOUR PAGES
// // import Universities from './pages/Universities';
// // import Representatives from './Representatives';
// import Universities from './Universities';
// import UniRepsView from './UniRepsView';
// import GlobalAdminUserQueries from './GlobalAdminUserQueries';
// import Header from '../components/Header';

// const GlobalAdminDashboard: React.FC = () => {
//   const [activePage, setActivePage] = useState('universities');

//   const [showUniModal, setShowUniModal] = useState(false);

//   const [assigningTo, setAssigningTo] = useState<{
//     id: string;
//     name: string;
//   } | null>(null);

//   // ================= PAGE RENDER =================
//   const renderPage = () => {
//     switch (activePage) {
//       case 'universities':
//         return (
//           <>
          

//             <Universities />
//           </>
//         );

//       case 'representatives':
//         return <UniRepsView />;

//       case 'queries':
//         return <GlobalAdminUserQueries />;

//       case 'logs':
//         return (
//           <div style={{ padding: '20px' }}>
//             <h2>System Logs</h2>
//             <p>Coming soon...</p>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="admin-container">

//       {/* SIDEBAR */}
//       <aside className="admin-sidebar">
//         <div className="logo-section">
//           <div className="admin-badge">GLOBAL</div>
//           <span className="logo-text">ADMIN</span>
//         </div>

//         <nav className="admin-nav">

//           <div
//             className={`nav-item ${activePage === 'universities' ? 'active' : ''}`}
//             onClick={() => setActivePage('universities')}
//           >
//             <School size={18} /> Universities
//           </div>

//           <div
//             className={`nav-item ${activePage === 'representatives' ? 'active' : ''}`}
//             onClick={() => setActivePage('representatives')}
//           >
//             <Users size={18} /> Representatives
//           </div>

//           <div
//             className={`nav-item ${activePage === 'logs' ? 'active' : ''}`}
//             onClick={() => setActivePage('logs')}
//           >
//             <Activity size={18} /> System Logs
//           </div>

//           <div
//             className={`nav-item ${activePage === 'queries' ? 'active' : ''}`}
//             onClick={() => setActivePage('queries')}
//           >
//             <Mail size={18} /> User Queries
//           </div>

//         </nav>
//       </aside>

//       {/* MAIN */}
//       <main className="admin-main">
//         <Header/>
        
//         {renderPage()}
//       </main>

//       {/* MODALS (only for university page) */}
//       {showUniModal && activePage === 'universities' && (
//         <AddUniversityModal onClose={() => setShowUniModal(false)} />
//       )}

//      {assigningTo && activePage === 'universities' && (
//         <AssignRepModal
//           scopeId={assigningTo.id}
//           scopeName={assigningTo.name}

//           fetchUrl={`/api/v1/auth/internal/${assigningTo.id}/students`}   // ✅ students of university
//           assignUrl={`/api/v1/global-admin/assign-rep`}                   // ✅ global admin API

//           userIdKey="userId" // optional (default anyway)

//           onClose={() => setAssigningTo(null)}
//         />
//       )}

//       {/* STYLES (same as yours) */}
//       <style>{`
//         .admin-container {
//           display: flex;
//           min-height: 100vh;
//           background: #f4f7f6;
//         }

//         .admin-sidebar {
//           width: 240px;
//           background: #fff;
//           color: white;
//           padding: 30px 20px;
//         }

//         .admin-badge {
//           background: #3cd3ad;
//           padding: 2px 6px;
//           border-radius: 4px;
//           font-size: 10px;
//           font-weight: 900;
//         }

//         .logo-text {
//           color:black;
//           display: block;
//           font-weight: 800;
//           font-size: 20px;
//         }

//         .admin-nav {
//           margin-top: 40px;
//         }

//         .nav-item {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           padding: 12px;
//           border-radius: 8px;
//           cursor: pointer;
//           color: #999;
//         }

//         .nav-item.active {
//           background: #3cd3ad;
//           color: white;
//         }

//         .admin-main {
//           flex: 1;
//           padding: 40px;
//         }

//         .admin-header {
//           display: flex;
//           justify-content: space-between;
//           margin-bottom: 20px;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default GlobalAdminDashboard;


import React, { useState } from 'react';
import { School, Users, Activity, Mail } from 'lucide-react';

import Universities from './Universities';
import UniRepsView from './UniRepsView';
import GlobalAdminUserQueries from './GlobalAdminUserQueries';
import UniversityDetailView from './UniversityDetailView'; // 🟢 IMPORTED
import Header from '../components/Header';
import AddUniversityModal from '../components/AddUniversityModal';
import AssignRepModal from '../components/AssignRepModal';

const GlobalAdminDashboard: React.FC = () => {
  // Navigation state supports direct tabs or sub-routes pattern like 'university-detail:UUID:Name'
  const [activePage, setActivePage] = useState('universities');
  const [showUniModal, setShowUniModal] = useState(false);
  const [assigningTo, setAssigningTo] = useState<{ id: string; name: string; } | null>(null);

  // ================= PAGE RENDER ROUTING PARSER =================
  const renderPage = () => {
    // 🟢 DYNAMIC ROUTE EVALUATOR CHECK
    if (activePage.startsWith('university-detail:')) {
      const [_, uniId, uniName] = activePage.split(':');
      return (
        <UniversityDetailView 
          universityId={uniId}
          universityName={uniName}
          onBack={() => setActivePage('universities')} // Navigate back safely
        />
      );
    }

    switch (activePage) {
      case 'universities':
        return (
          <Universities 
            // 🟢 INTERACTION HOOK: Triggers navigation tracking state instantly upon row click select
            onSelectUniversity={(id, name) => setActivePage(`university-detail:${id}:${name}`)}
          />
        );

      case 'representatives':
        return <UniRepsView />;

      case 'queries':
        return <GlobalAdminUserQueries />;

      case 'logs':
        return (
          <div style={{ padding: '20px' }}>
            <h2>System Logs</h2>
            <p>Coming soon...</p>
          </div>
        );

      default:
        return <Universities onSelectUniversity={(id, name) => setActivePage(`university-detail:${id}:${name}`)} />;
    }
  };

  return (
    <div className="admin-container">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="logo-section">
          <div className="admin-badge">GLOBAL</div>
          <span className="logo-text">ADMIN</span>
        </div>

        <nav className="admin-nav">
          <div
            className={`nav-item ${activePage === 'universities' || activePage.startsWith('university-detail:') ? 'active' : ''}`}
            onClick={() => setActivePage('universities')}
          >
            <School size={18} /> Universities
          </div>

          <div
            className={`nav-item ${activePage === 'representatives' ? 'active' : ''}`}
            onClick={() => setActivePage('representatives')}
          >
            <Users size={18} /> Representatives
          </div>

          <div
            className={`nav-item ${activePage === 'logs' ? 'active' : ''}`}
            onClick={() => setActivePage('logs')}
          >
            <Activity size={18} /> System Logs
          </div>

          <div
            className={`nav-item ${activePage === 'queries' ? 'active' : ''}`}
            onClick={() => setActivePage('queries')}
          >
            <Mail size={18} /> User Queries
          </div>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="admin-main">
        <Header/>
        <div className="view-content-wrapper" style={{ marginTop: '20px' }}>
          {renderPage()}
        </div>
      </main>

      {/* MODALS */}
      {showUniModal && activePage === 'universities' && (
        <AddUniversityModal onClose={() => setShowUniModal(false)} />
      )}

      {assigningTo && activePage === 'universities' && (
        <AssignRepModal
          scopeId={assigningTo.id}
          scopeName={assigningTo.name}
          fetchUrl={`http://localhost:8080/api/v1/auth/internal/${assigningTo.id}/students`}
          assignUrl={`http://localhost:8080/api/v1/global-admin/assign-rep`}
          userIdKey="authUserId"
          onClose={() => setAssigningTo(null)}
        />
      )}

      <style>{`
        .admin-container { display: flex; min-height: 100vh; background: #f8fafc; }
        .admin-sidebar { width: 250px; background: #fff; border-right: 1px solid #e2e8f0; padding: 30px 20px; position: sticky; top: 0; height: 100vh; }
        .logo-section { margin-bottom: 35px; display: flex; align-items: center; gap: 8px; }
        .admin-badge { background: #3cd3ad15; color: #3cd3ad; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 800; }
        .logo-text { color: #1e293b; font-weight: 800; font-size: 20px; letter-spacing: -0.5px; }
        .admin-nav { display: flex; flex-direction: column; gap: 4px; }
        .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 10px; cursor: pointer; color: #64748b; font-weight: 500; transition: all 0.2s; }
        .nav-item:hover { background: #f1f5f9; color: #1e293b; }
        .nav-item.active { background: #3cd3ad; color: white; }
        .admin-main { flex: 1; padding: 40px; overflow-y: auto; background: #f8fafc; }
        .view-content-wrapper { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 820px) {
          .admin-container { display: block; }
          .admin-sidebar { position: sticky; top: 0; z-index: 30; width: 100%; height: auto; padding: 12px 16px; border-right: 0; border-bottom: 1px solid #e2e8f0; }
          .admin-sidebar .logo-section { display: none; }
          .admin-nav { flex-direction: row; overflow-x: auto; gap: 8px; }
          .admin-nav .nav-item { flex: 0 0 auto; padding: 9px 12px; font-size: 13px; white-space: nowrap; }
          .admin-main { padding: 16px; overflow: visible; }
        }
      `}</style>
    </div>
  );
};

export default GlobalAdminDashboard;
