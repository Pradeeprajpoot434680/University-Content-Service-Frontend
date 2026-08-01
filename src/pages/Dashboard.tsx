// import React, { useState } from 'react';
// import { 
//   BookOpen, Upload, Settings, LogOut, Globe, User, ShieldCheck, CheckSquare
// } from 'lucide-react';
// import { useNavigate } from "react-router-dom";

// import NavItem from '../components/NavItem';
// import ProfilePage from './ProfilePage';
// import UniversityView from '../components/UniversityView';
// import ContentUpload from './ContentUpload';
// import LibraryDashboard from './LibraryDashboard';
// import { useAuthStore } from '../store/authStore';
// import Header from '../components/Header';

// // --- ROLE-SPECIFIC ADMIN VIEWS ---
// import VerificationQueue from './VerificationQueue'; // For SESSION_REP
// import UniversityRepDashboard from './UniversityRepDashboard'; // For UNIVERSITY_ADMIN (Create this component)
// import GlobalAdminDashboard from './GlobalAdminDashboard'; // For GLOBAL_ADMIN (Create this component)

// const Dashboard: React.FC = () => {
//   const logout = useAuthStore.getState().logout;
//   const { user, hasRole } = useAuthStore();
//   const navigate = useNavigate();

//   const [activeTab, setActiveTab] = useState<
//     'university' | 'library' | 'contribute' | 'profile' | 'admin-panel'
//   >('university');

//   // Determine administrative capability based on your roles mapping
//   const isAdmin = hasRole('GLOBAL_ADMIN') || hasRole('UNIVERSITY_ADMIN') || hasRole('SESSION_REP');
  
//   const getAdminLabel = () => {
//     if (hasRole('GLOBAL_ADMIN')) return 'Global Management';
//     if (hasRole('UNIVERSITY_ADMIN')) return 'University Admin';
//     if (hasRole('SESSION_REP')) return 'Approvals Queue';
//     return 'Admin Panel';
//   };

//   // Dynamically switches the view according to the user's highest role
//   const renderAdminContent = () => {
//   if (hasRole('GLOBAL_ADMIN')) {
//     navigate('/global-admin');
//     return null;
//   }
//   if (hasRole('UNIVERSITY_ADMIN')) {
//     navigate('/university-admin');
//     return null;
//   }
//   if (hasRole('DEPT_REP')) {
//     navigate('/department-admin');
//     return null;
//   }
//   if (hasRole('PROGRAM_REP')) {
//     navigate('/program-admin');
//     return null;
//   }
//   if (hasRole('SESSION_REP')) {
//     navigate('/session-admin');
//     return null;
//   }
//   return <div className="p-6">Unauthorized access segment.</div>;
// };
//   const renderContent = () => {
//     switch (activeTab) {
//       case 'profile': return <ProfilePage />;
//       case 'university': return <UniversityView />;
//       case 'library': return <LibraryDashboard />;
//       case 'contribute': return <ContentUpload />;
//       case 'admin-panel': return renderAdminContent(); // Dynamic layout dispatcher
//       default: return null;
//     }
//   };

//   const handleLogout = async () => {
//     await logout();
//     navigate("/signin");
//   };

//   const userInitials = user?.email ? user.email.substring(0, 2).toUpperCase() : 'ST';

//   return (
//     <div className="pdb-dashboard-container">
//       {/* SIDEBAR NAVIGATION ARCHITECTURE */}
//       <aside className="pdb-sidebar">
//         <div className="pdb-sidebar-main">
          
//           <nav className="pdb-nav-menu">
//             <div className="pdb-nav-group">
//               <span className="pdb-group-label">Explore</span>
//               <NavItem 
//                 icon={<Globe size={18} />} 
//                 label="University" 
//                 active={activeTab === 'university'} 
//                 onClick={() => setActiveTab('university')} 
//               />
//             </div>

//             <div className="pdb-nav-group">
//               <span className="pdb-group-label">Resources</span>
//               <NavItem 
//                 icon={<BookOpen size={18} />} 
//                 label="Library" 
//                 active={activeTab === 'library'} 
//                 onClick={() => setActiveTab('library')} 
//               />
//               <NavItem 
//                 icon={<Upload size={18} />} 
//                 label="Contribute" 
//                 active={activeTab === 'contribute'} 
//                 onClick={() => setActiveTab('contribute')} 
//               />
//             </div>

//             {/* DYNAMIC ROLE-BASED ADMIN PANEL SECTION */}
//             {isAdmin && (
//               <div className="pdb-nav-group pdb-admin-group">
//                 <span className="pdb-group-label admin-label-color">Control Room</span>
//                 <NavItem 
//                   icon={hasRole('SESSION_REP') ? <CheckSquare size={18} /> : <ShieldCheck size={18} />} 
//                   label={getAdminLabel()} 
//                   active={activeTab === 'admin-panel'} 
//                   className="admin-nav-item"
//                   onClick={() => setActiveTab('admin-panel')} 
//                 />
//               </div>
//             )}

//             {/* RESPONSIVE INJECTED TABS FOR BOTTOM TRACK VIEW (MOBILE) */}
//             <div className="pdb-nav-group pdb-mobile-only-group">
//               {isAdmin && (
//                 <NavItem 
//                   icon={<ShieldCheck size={18} />} 
//                   label="Admin" 
//                   active={activeTab === 'admin-panel'} 
//                   onClick={() => setActiveTab('admin-panel')} 
//                 />
//               )}
//               <NavItem 
//                 icon={<User size={18} />} 
//                 label="Profile" 
//                 active={activeTab === 'profile'} 
//                 onClick={() => setActiveTab('profile')} 
//               />
//               <NavItem 
//                 icon={<LogOut size={18} />} 
//                 label="Logout" 
//                 onClick={handleLogout}
//               />
//             </div>
//           </nav>
//         </div>

//         {/* ACCOUNT NAVIGATION COMPONENT FOOTER */}
//         <div className="pdb-sidebar-footer">
//           <div className="pdb-footer-nav">
//             <NavItem icon={<Settings size={18} />} label="Settings" />
//             <NavItem
//               icon={<LogOut size={18} />}
//               label="Logout"
//               className="pdb-logout-btn"
//               onClick={handleLogout}
//             />
//           </div>
          
//           <div 
//             className={`pdb-profile-trigger ${activeTab === 'profile' ? 'pdb-active' : ''}`} 
//             onClick={() => setActiveTab('profile')}
//           >
//             <div className="pdb-avatar-circle">{userInitials}</div>
//             <div className="pdb-profile-info">
//               <span className="pdb-name">{user?.email.split('@')[0] || "Active User"}</span>
//               <span className="pdb-role">{user?.roles?.[0]?.replace('_', ' ') || "Student"}</span>
//             </div>
//           </div>
//         </div>
//       </aside>

//       {/* VIEWPORT PANEL */}
//       <main className="pdb-main-content">
//         <Header />
//         <div className="pdb-scroll-area view-transition">
//           {renderContent()}
//         </div>
//       </main>

//       <style>{`
//         .pdb-dashboard-container {
//           --sidebar-width: 240px;
//           min-height: 100vh;
//           height: 100vh;
//           background: #f8fafc;
//           color: #1e293b;
//           display: flex;
//           overflow: hidden;
//           font-family: 'Inter', system-ui, sans-serif;
//         }

//         .pdb-mobile-brand-banner {
//           display: none;
//         }

//         /* Fixed Sidebar Context Wrapper styles */
//         .pdb-sidebar {
//           width: var(--sidebar-width);
//           height: 100vh;
//           background: #ffffff;
//           border-right: 1px solid rgba(15, 23, 42, 0.06);
//           display: flex;
//           flex-direction: column;
//           padding: 24px 16px;
//           box-sizing: border-box;
//           flex-shrink: 0;
//           z-index: 40;
//         }

//         .pdb-sidebar-main { 
//           flex: 1; 
//           display: flex;
//           flex-direction: column;
//           min-height: 0; 
//         }

//         .pdb-logo-section { 
//           display: flex; 
//           align-items: center; 
//           justify-content: space-between;
//           gap: 12px; 
//           margin-bottom: 36px; 
//           padding: 0 8px; 
//         }

//         .pdb-logo-text { 
//           font-size: 19px; 
//           font-weight: 800; 
//           letter-spacing: -0.5px; 
//           color: #0f172a;
//         }

//         .pdb-role-badge {
//           font-size: 10px;
//           font-weight: 800;
//           background: rgba(60, 211, 173, 0.12);
//           color: #0f766e;
//           padding: 4px 8px;
//           border-radius: 6px;
//           letter-spacing: 0.2px;
//         }

//         .pdb-nav-menu { 
//           display: flex;
//           flex-direction: column;
//           gap: 20px;
//         }
        
//         .pdb-nav-group { 
//           display: flex;
//           flex-direction: column;
//           gap: 4px;
//         }

//         .pdb-group-label { 
//           font-size: 11px; 
//           font-weight: 700; 
//           color: #94a3b8; 
//           text-transform: uppercase; 
//           letter-spacing: 0.5px; 
//           padding: 0 12px; 
//           margin-bottom: 6px; 
//         }

//         .pdb-mobile-only-group {
//           display: none;
//         }

//         /* Sidebar Bottom Account Footer rules */
//         .pdb-sidebar-footer { 
//           border-top: 1px solid #f1f5f9; 
//           padding-top: 16px; 
//           margin-top: auto;
//           display: flex;
//           flex-direction: column;
//           gap: 12px;
//         }

//         .pdb-footer-nav { 
//           display: flex;
//           flex-direction: column;
//           gap: 4px;
//         }

//         .pdb-profile-trigger { 
//           display: flex; 
//           align-items: center; 
//           gap: 12px; 
//           padding: 10px; 
//           border-radius: 12px; 
//           cursor: pointer; 
//           border: 1px solid transparent;
//           transition: all 0.2s ease; 
//         }

//         .pdb-profile-trigger:hover { 
//           background: #f8fafc; 
//         }

//         .pdb-profile-trigger.pdb-active { 
//           background: rgba(60, 211, 173, 0.08); 
//           border-color: rgba(60, 211, 173, 0.2); 
//         }

//         .pdb-avatar-circle { 
//           width: 38px; 
//           height: 38px; 
//           border-radius: 10px; 
//           background: #0f172a; 
//           color: #ffffff; 
//           display: flex; 
//           align-items: center; 
//           justify-content: center; 
//           font-weight: 700; 
//           font-size: 13px; 
//         }

//         .pdb-profile-info { 
//           display: flex; 
//           flex-direction: column; 
//           gap: 2px;
//           min-width: 0; 
//         }

//         .pdb-name { 
//           font-size: 13px; 
//           font-weight: 700; 
//           color: #0f172a;
//           white-space: nowrap;
//           overflow: hidden;
//           text-overflow: ellipsis;
//         }

//         .pdb-role { 
//           font-size: 11px; 
//           color: #64748b; 
//           font-weight: 500;
//         }

//         /* Main Screen Layout Container viewport */
//         .pdb-main-content {
//           flex: 1;
//           min-width: 0;
//           height: 100vh;
//           display: flex;
//           flex-direction: column;
//           overflow: hidden;
//         }

//         .pdb-scroll-area {
//           flex: 1;
//           min-width: 0;
//           overflow-y: auto;
//           overflow-x: hidden;
//           padding: clamp(20px, 3vw, 40px);
//         }

//         .view-transition { 
//           animation: pdb-slideUp 0.3s ease-out; 
//         }

//         @keyframes pdb-slideUp { 
//           from { opacity: 0; transform: translateY(8px); } 
//           to { opacity: 1; transform: translateY(0); } 
//         }

//         /* HIGH-FIDELITY RESPONSIVE TARGET LAYOUT BREAKPOINTS */
//         @media (max-width: 1024px) {
//           .pdb-dashboard-container { --sidebar-width: 210px; }
//         }

//         @media (max-width: 820px) {
//           .pdb-dashboard-container {
//             flex-direction: column;
//             height: auto;
//             min-height: 100vh;
//             overflow: visible;
//           }

//           /* Top brand block visibility toggles on handheld arrays */
//           .pdb-mobile-brand-banner {
//             display: flex;
//             align-items: center;
//             justify-content: space-between;
//             padding: 16px 20px;
//             background: #ffffff;
//             border-bottom: 1px solid rgba(15, 23, 42, 0.05);
//           }

//           .pdb-main-content {
//             width: 100%;
//             height: auto;
//             overflow: visible;
//           }

//           .pdb-scroll-area {
//             overflow: visible;
//             padding: 16px 16px 100px; /* Excess bottom track threshold prevents navigation clipping */
//           }

//           /* Transition fixed navigation element to sticky bottom application rack view */
//           .pdb-sidebar {
//             position: fixed;
//             inset: auto 0 0 0;
//             width: 100%;
//             height: auto;
//             background: rgba(255, 255, 255, 0.96);
//             backdrop-filter: blur(16px);
//             -webkit-backdrop-filter: blur(16px);
//             border-right: none;
//             border-top: 1px solid rgba(15, 23, 42, 0.08);
//             padding: 8px 12px calc(8px + env(safe-area-inset-bottom));
//             box-shadow: 0 -8px 24px rgba(15, 23, 42, 0.04);
//             overflow: visible;
//           }

//           .pdb-logo-section,
//           .pdb-group-label,
//           .pdb-sidebar-footer {
//             display: none !important;
//           }

//           .pdb-nav-menu {
//             flex-direction: row;
//             width: 100%;
//             justify-content: space-between;
//             gap: 4px;
//           }

//           .pdb-nav-group {
//             flex-direction: row;
//             flex: 1;
//             justify-content: space-around;
//             gap: 4px;
//           }

//           .pdb-mobile-only-group {
//             display: flex;
//           }
//         }

//         @media (max-width: 480px) {
//           .pdb-nav-menu {
//             gap: 0;
//           }
//           /* Component override layout structures contextually inside bottom tracking tabs */
//           .pdb-sidebar :global(.nav-item-class) {
//             flex-direction: column;
//             gap: 4px;
//             font-size: 10px;
//             padding: 6px 4px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Dashboard;


import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Upload, Settings, LogOut, Globe, User, ShieldCheck, CheckSquare, Building2
} from 'lucide-react';
import { useNavigate } from "react-router-dom";

import NavItem from '../components/NavItem';
import ProfilePage from './ProfilePage';
import UniversityView from '../components/UniversityView';
import ContentUpload from './ContentUpload';
import LibraryDashboard from './LibraryDashboard';
import { useAuthStore } from '../store/authStore';
import Header from '../components/Header';

const Dashboard: React.FC = () => {
  const logout = useAuthStore.getState().logout;
  const { user, hasRole } = useAuthStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<
    'university' | 'library' | 'contribute' | 'profile' | 'admin-panel'
  >('university');

  // Included DEPT_REP and PROGRAM_REP to display the Control Room section in sidebar
  const isAdmin = 
    hasRole('GLOBAL_ADMIN') || 
    hasRole('UNIVERSITY_ADMIN') || 
    hasRole('DEPT_REP') || 
    hasRole('PROGRAM_REP') || 
    hasRole('SESSION_REP');

  // Dynamic admin label mapping based on role hierarchy
  const getAdminLabel = () => {
    if (hasRole('GLOBAL_ADMIN')) return 'Global Management';
    if (hasRole('UNIVERSITY_ADMIN')) return 'University Admin';
    if (hasRole('DEPT_REP')) return 'Department Admin';
    if (hasRole('PROGRAM_REP')) return 'Program Admin';
    if (hasRole('SESSION_REP')) return 'Approvals Queue';
    return 'Admin Panel';
  };

  // Safe side-effect redirection when admin tab is selected
  useEffect(() => {
    if (activeTab === 'admin-panel') {
      if (hasRole('GLOBAL_ADMIN')) navigate('/global-admin');
      else if (hasRole('UNIVERSITY_ADMIN')) navigate('/university-admin');
      else if (hasRole('DEPT_REP')) navigate('/department-admin');
      else if (hasRole('PROGRAM_REP')) navigate('/program-admin');
      else if (hasRole('SESSION_REP')) navigate('/session-admin');
    }
  }, [activeTab, hasRole, navigate]);

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return <ProfilePage />;
      case 'university': return <UniversityView />;
      case 'library': return <LibraryDashboard />;
      case 'contribute': return <ContentUpload />;
      case 'admin-panel': return <div className="p-6">Redirecting to Admin Control Room...</div>;
      default: return null;
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  const userInitials = user?.email ? user.email.substring(0, 2).toUpperCase() : 'ST';

  return (
    <div className="pdb-dashboard-container">
      {/* SIDEBAR NAVIGATION ARCHITECTURE */}
      <aside className="pdb-sidebar">
        <div className="pdb-sidebar-main">
          
          <nav className="pdb-nav-menu">
            <div className="pdb-nav-group">
              <span className="pdb-group-label">Explore</span>
              <NavItem 
                icon={<Globe size={18} />} 
                label="University" 
                active={activeTab === 'university'} 
                onClick={() => setActiveTab('university')} 
              />
            </div>

            <div className="pdb-nav-group">
              <span className="pdb-group-label">Resources</span>
              <NavItem 
                icon={<BookOpen size={18} />} 
                label="Library" 
                active={activeTab === 'library'} 
                onClick={() => setActiveTab('library')} 
              />
              <NavItem 
                icon={<Upload size={18} />} 
                label="Contribute" 
                active={activeTab === 'contribute'} 
                onClick={() => setActiveTab('contribute')} 
              />
            </div>

            {/* DYNAMIC ROLE-BASED ADMIN PANEL SECTION */}
            {isAdmin && (
              <div className="pdb-nav-group pdb-admin-group">
                <span className="pdb-group-label admin-label-color">Control Room</span>
                <NavItem 
                  icon={
                    hasRole('SESSION_REP') ? (
                      <CheckSquare size={18} />
                    ) : hasRole('DEPT_REP') ? (
                      <Building2 size={18} />
                    ) : (
                      <ShieldCheck size={18} />
                    )
                  } 
                  label={getAdminLabel()} 
                  active={activeTab === 'admin-panel'} 
                  className="admin-nav-item"
                  onClick={() => setActiveTab('admin-panel')} 
                />
              </div>
            )}

            {/* RESPONSIVE INJECTED TABS FOR BOTTOM TRACK VIEW (MOBILE) */}
            <div className="pdb-nav-group pdb-mobile-only-group">
              {isAdmin && (
                <NavItem 
                  icon={<ShieldCheck size={18} />} 
                  label="Admin" 
                  active={activeTab === 'admin-panel'} 
                  onClick={() => setActiveTab('admin-panel')} 
                />
              )}
              <NavItem 
                icon={<User size={18} />} 
                label="Profile" 
                active={activeTab === 'profile'} 
                onClick={() => setActiveTab('profile')} 
              />
              <NavItem 
                icon={<LogOut size={18} />} 
                label="Logout" 
                onClick={handleLogout}
              />
            </div>
          </nav>
        </div>

        {/* ACCOUNT NAVIGATION COMPONENT FOOTER */}
        <div className="pdb-sidebar-footer">
          <div className="pdb-footer-nav">
            <NavItem icon={<Settings size={18} />} label="Settings" />
            <NavItem
              icon={<LogOut size={18} />}
              label="Logout"
              className="pdb-logout-btn"
              onClick={handleLogout}
            />
          </div>
          
          <div 
            className={`pdb-profile-trigger ${activeTab === 'profile' ? 'pdb-active' : ''}`} 
            onClick={() => setActiveTab('profile')}
          >
            <div className="pdb-avatar-circle">{userInitials}</div>
            <div className="pdb-profile-info">
              <span className="pdb-name">{user?.email.split('@')[0] || "Active User"}</span>
              <span className="pdb-role">{user?.roles?.[0]?.replace('_', ' ') || "Student"}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* VIEWPORT PANEL */}
      <main className="pdb-main-content">
        <Header />
        <div className="pdb-scroll-area view-transition">
          {renderContent()}
        </div>
      </main>

      <style>{`
        .pdb-dashboard-container {
          --sidebar-width: 240px;
          min-height: 100vh;
          height: 100vh;
          background: #f8fafc;
          color: #1e293b;
          display: flex;
          overflow: hidden;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .pdb-mobile-brand-banner {
          display: none;
        }

        /* Fixed Sidebar Context Wrapper styles */
        .pdb-sidebar {
          width: var(--sidebar-width);
          height: 100vh;
          background: #ffffff;
          border-right: 1px solid rgba(15, 23, 42, 0.06);
          display: flex;
          flex-direction: column;
          padding: 24px 16px;
          box-sizing: border-box;
          flex-shrink: 0;
          z-index: 40;
        }

        .pdb-sidebar-main { 
          flex: 1; 
          display: flex;
          flex-direction: column;
          min-height: 0; 
        }

        .pdb-logo-section { 
          display: flex; 
          align-items: center; 
          justify-content: space-between;
          gap: 12px; 
          margin-bottom: 36px; 
          padding: 0 8px; 
        }

        .pdb-logo-text { 
          font-size: 19px; 
          font-weight: 800; 
          letter-spacing: -0.5px; 
          color: #0f172a;
        }

        .pdb-role-badge {
          font-size: 10px;
          font-weight: 800;
          background: rgba(60, 211, 173, 0.12);
          color: #0f766e;
          padding: 4px 8px;
          border-radius: 6px;
          letter-spacing: 0.2px;
        }

        .pdb-nav-menu { 
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .pdb-nav-group { 
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .pdb-group-label { 
          font-size: 11px; 
          font-weight: 700; 
          color: #94a3b8; 
          text-transform: uppercase; 
          letter-spacing: 0.5px; 
          padding: 0 12px; 
          margin-bottom: 6px; 
        }

        .pdb-mobile-only-group {
          display: none;
        }

        /* Sidebar Bottom Account Footer rules */
        .pdb-sidebar-footer { 
          border-top: 1px solid #f1f5f9; 
          padding-top: 16px; 
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .pdb-footer-nav { 
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .pdb-profile-trigger { 
          display: flex; 
          align-items: center; 
          gap: 12px; 
          padding: 10px; 
          border-radius: 12px; 
          cursor: pointer; 
          border: 1px solid transparent;
          transition: all 0.2s ease; 
        }

        .pdb-profile-trigger:hover { 
          background: #f8fafc; 
        }

        .pdb-profile-trigger.pdb-active { 
          background: rgba(60, 211, 173, 0.08); 
          border-color: rgba(60, 211, 173, 0.2); 
        }

        .pdb-avatar-circle { 
          width: 38px; 
          height: 38px; 
          border-radius: 10px; 
          background: #0f172a; 
          color: #ffffff; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-weight: 700; 
          font-size: 13px; 
        }

        .pdb-profile-info { 
          display: flex; 
          flex-direction: column; 
          gap: 2px;
          min-width: 0; 
        }

        .pdb-name { 
          font-size: 13px; 
          font-weight: 700; 
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .pdb-role { 
          font-size: 11px; 
          color: #64748b; 
          font-weight: 500;
        }

        /* Main Screen Layout Container viewport */
        .pdb-main-content {
          flex: 1;
          min-width: 0;
          height: 100vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .pdb-scroll-area {
          flex: 1;
          min-width: 0;
          overflow-y: auto;
          overflow-x: hidden;
          padding: clamp(20px, 3vw, 40px);
        }

        .view-transition { 
          animation: pdb-slideUp 0.3s ease-out; 
        }

        @keyframes pdb-slideUp { 
          from { opacity: 0; transform: translateY(8px); } 
          to { opacity: 1; transform: translateY(0); } 
        }

        /* HIGH-FIDELITY RESPONSIVE TARGET LAYOUT BREAKPOINTS */
        @media (max-width: 1024px) {
          .pdb-dashboard-container { --sidebar-width: 210px; }
        }

        @media (max-width: 820px) {
          .pdb-dashboard-container {
            flex-direction: column;
            height: auto;
            min-height: 100vh;
            overflow: visible;
          }

          .pdb-mobile-brand-banner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 20px;
            background: #ffffff;
            border-bottom: 1px solid rgba(15, 23, 42, 0.05);
          }

          .pdb-main-content {
            width: 100%;
            height: auto;
            overflow: visible;
          }

          .pdb-scroll-area {
            overflow: visible;
            padding: 16px 16px 100px;
          }

          .pdb-sidebar {
            position: fixed;
            inset: auto 0 0 0;
            width: 100%;
            height: auto;
            background: rgba(255, 255, 255, 0.96);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-right: none;
            border-top: 1px solid rgba(15, 23, 42, 0.08);
            padding: 8px 12px calc(8px + env(safe-area-inset-bottom));
            box-shadow: 0 -8px 24px rgba(15, 23, 42, 0.04);
            overflow: visible;
          }

          .pdb-logo-section,
          .pdb-group-label,
          .pdb-sidebar-footer {
            display: none !important;
          }

          .pdb-nav-menu {
            flex-direction: row;
            width: 100%;
            justify-content: space-between;
            gap: 4px;
          }

          .pdb-nav-group {
            flex-direction: row;
            flex: 1;
            justify-content: space-around;
            gap: 4px;
          }

          .pdb-mobile-only-group {
            display: flex;
          }
        }

        @media (max-width: 480px) {
          .pdb-nav-menu {
            gap: 0;
          }
          .pdb-sidebar :global(.nav-item-class) {
            flex-direction: column;
            gap: 4px;
            font-size: 10px;
            padding: 6px 4px;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;