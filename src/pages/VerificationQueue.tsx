

// import React, { useState, useEffect } from 'react';
// import { 
//   FileText, ExternalLink, CheckCircle, 
//   XCircle, Clock, User, BookOpen, Layers,
//   ChevronRight, LayoutGrid, FileSearch, Pencil
// } from 'lucide-react';
// import { api, useAuthStore, } from '../store/authStore';
// import { toast } from 'sonner';

// interface PendingContent {
//   contentId: string;
//   title: string;
//   description: string | null;
//   uploaderName: string;
//   fileUrl: string | null;
//   fileType: string;
//   uploadedAt: string;
//   subjectName: string;
//   contentType: 'PAPER' | 'PAPER_SOLUTION' | 'NOTES';
// }

// const VerificationQueue: React.FC = () => {
//   const [fullList, setFullList] = useState<PendingContent[]>([]);
//   const [filteredList, setFilteredList] = useState<PendingContent[]>([]);
//   const [activeTab, setActiveTab] = useState<'ALL' | 'PAPER' | 'PAPER_SOLUTION' | 'NOTES'>('ALL');
//   const [loading, setLoading] = useState(true);

//   const user = useAuthStore((state) => state.user);
//   const fetchPendingContent = async () => {
//     try {
//       setLoading(true);
//       const response = await api.get(`/api/v1/session-rep/${user?.scopeId}/pending-content`);
//       if (response.data.success) {
//         setFullList(response.data.data);
//         setFilteredList(response.data.data);
//       }
//     } catch (error) {
//       toast.error("Failed to load verification queue");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (user?.scopeId) fetchPendingContent();
//   }, [user]);

//   useEffect(() => {
//     if (activeTab === 'ALL') {
//       setFilteredList(fullList);
//     } else {
//       setFilteredList(fullList.filter(item => item.contentType === activeTab));
//     }
//   }, [activeTab, fullList]);

//   // ✅ FIXED API INTEGRATION
//   const handleAction = async (contentId: string, action: 'APPROVE' | 'REJECT') => {
//     try {
//       if (!user?.scopeId || !user?.id) {
//         toast.error("User session invalid");
//         return;
//       }

//       const status = action === 'APPROVE' ? 'VERIFIED' : 'REJECTED';

//       await api.patch(
//         `/api/v1/session-rep/${user.scopeId}/content/${contentId}/status`,
//         { status }
//       );

//       toast.success(
//         status === 'VERIFIED'
//           ? 'Content approved ✅'
//           : 'Content rejected ❌'
//       );

//       // remove from UI
//       setFullList(prev => prev.filter(item => item.contentId !== contentId));

//     } catch (error) {
//       console.error(error);
//       toast.error("Action failed");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="loading-wrapper">
//         <Layers className="pulsing" />
//       </div>
//     );
//   }

//   return (
//     <div className="modern-queue-wrapper">
//       <header className="premium-header">
//         <div className="header-content">
//           <div className="badge-row">
//             <span className="rep-badge">Session Control</span>
//             <ChevronRight size={14} className="text-slate-400" />
//             <span className="text-slate-400 font-medium">Verification</span>
//           </div>
//           <h1>Verification <span className="text-gradient">Hub</span></h1>
//         </div>
//         <div className="stats-box">
//           <span className="stat-value">{filteredList.length}</span>
//           <span className="stat-label">{activeTab.replace('_', ' ')} items</span>
//         </div>
//       </header>

//       {/* FILTER TABS */}
//       <div className="filter-tabs">
//         <button onClick={() => setActiveTab('ALL')} className={activeTab === 'ALL' ? 'active' : ''}>
//           <LayoutGrid size={16} /> All
//         </button>
//         <button onClick={() => setActiveTab('PAPER')} className={activeTab === 'PAPER' ? 'active' : ''}>
//           <FileSearch size={16} /> Question Papers
//         </button>
//         <button onClick={() => setActiveTab('PAPER_SOLUTION')} className={activeTab === 'PAPER_SOLUTION' ? 'active' : ''}>
//           <CheckCircle size={16} /> Solutions
//         </button>
//         <button onClick={() => setActiveTab('NOTES')} className={activeTab === 'NOTES' ? 'active' : ''}>
//           <Pencil size={16} /> Study Notes
//         </button>
//       </div>

//       {filteredList.length === 0 ? (
//         <div className="empty-state-glass">
//           <h3>No {activeTab.toLowerCase().replace('_', ' ')} pending</h3>
//           <p>Everything is cleared for this category.</p>
//         </div>
//       ) : (
//         <div className="queue-grid">
//           {filteredList.map((item) => (
//             <div key={item.contentId} className="hifi-card">
//               <div className="card-top">
//                 <div className={`doc-thumb ${item.fileType.toLowerCase()}`}>
//                   <FileText size={20} />
//                   <span className="type-tag">{item.fileType}</span>
//                 </div>
//                 <div className="card-headings">
//                   <span className="type-badge-small">
//                     {item.contentType.replace('_', ' ')}
//                   </span>
//                   <h3>{item.title}</h3>
//                   <span className="subject-pill">
//                     <BookOpen size={12} /> {item.subjectName.replace("Subject: ", "")}
//                   </span>
//                 </div>
//               </div>

//               <div className="card-middle">
//                 <div className="meta-row">
//                   <div className="meta-pair">
//                     <User size={14} /> 
//                     <span>{item.uploaderName.split('-')[0]}</span>
//                   </div>
//                   <div className="meta-pair">
//                     <Clock size={14} /> 
//                     <span>{new Date(item.uploadedAt).toLocaleDateString()}</span>
//                   </div>
//                 </div>

//                 {item.description && (
//                   <p className="description-text">{item.description}</p>
//                 )}
//               </div>

//               <div className="card-bottom">
//                 {item.fileUrl && (
//                   <a 
//                     href={item.fileUrl} 
//                     target="_blank" 
//                     rel="noreferrer" 
//                     className="btn-secondary"
//                   >
//                     <ExternalLink size={14} /> Preview
//                   </a>
//                 )}

//                 <div className="action-group">
//                   <button 
//                     onClick={() => handleAction(item.contentId, 'REJECT')} 
//                     className="btn-danger-icon"
//                   >
//                     <XCircle size={20} />
//                   </button>

//                   <button 
//                     onClick={() => handleAction(item.contentId, 'APPROVE')} 
//                     className="btn-approve-hifi"
//                   >
//                     Verify
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* KEEP YOUR EXISTING STYLES SAME */}
//       <style>{`
//         .filter-tabs { 
//           display: flex; 
//           gap: 10px; 
//           margin-bottom: 30px; 
//           background: #f1f5f9; 
//           padding: 6px; 
//           border-radius: 14px; 
//           width: fit-content;
//         }
//         .filter-tabs button {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           padding: 10px 20px;
//           border-radius: 10px;
//           border: none;
//           font-weight: 600;
//           font-size: 14px;
//           cursor: pointer;
//           color: #64748b;
//           background: transparent;
//           transition: all 0.2s;
//         }
//         .filter-tabs button.active {
//           background: white;
//           color: #0f172a;
//           box-shadow: 0 4px 12px rgba(0,0,0,0.05);
//         }
//         .type-badge-small {
//           font-size: 10px;
//           font-weight: 800;
//           color: #94a3b8;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//           display: block;
//           margin-bottom: 2px;
//         }


//         .filter-tabs { 
//           display: flex; 
//           gap: 10px; 
//           margin-bottom: 30px; 
//           background: #f1f5f9; 
//           padding: 6px; 
//           border-radius: 14px; 
//           width: fit-content;
//         }
//         .filter-tabs button {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           padding: 10px 20px;
//           border-radius: 10px;
//           border: none;
//           font-weight: 600;
//           font-size: 14px;
//           cursor: pointer;
//           color: #64748b;
//           background: transparent;
//           transition: all 0.2s;
//         }
//         .filter-tabs button.active {
//           background: white;
//           color: #0f172a;
//           box-shadow: 0 4px 12px rgba(0,0,0,0.05);
//         }
//         .type-badge-small {
//           font-size: 10px;
//           font-weight: 800;
//           color: #94a3b8;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//           display: block;
//           margin-bottom: 2px;
//         }
//         /* Reuse existing modern styles from previous response... */

//         :root {
//           --primary: #10b981;
//           --primary-soft: #ecfdf5;
//           --slate-900: #0f172a;
//           --slate-600: #475569;
//           --slate-400: #94a3b8;
//           --bg: #f8fafc;
//         }

//         .modern-queue-wrapper { max-width: 1100px; margin: 0 auto; padding-bottom: 50px; }

//         /* Header Styling */
//         .premium-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
//         .badge-row { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
//         .rep-badge { background: var(--slate-900); color: white; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
//         .premium-header h1 { font-size: 36px; font-weight: 800; color: var(--slate-900); letter-spacing: -1px; }
//         .text-gradient { background: linear-gradient(to right, #10b981, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
//         .premium-header p { color: var(--slate-600); font-size: 16px; margin-top: 4px; }
        
//         .stats-box { background: white; padding: 20px 30px; border-radius: 20px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); text-align: center; border: 1px solid #eef2f6; }
//         .stat-value { display: block; font-size: 28px; font-weight: 800; color: var(--primary); }
//         .stat-label { font-size: 12px; font-weight: 600; color: var(--slate-400); text-transform: uppercase; }

//         /* Utility Bar */
//         .utility-bar { display: flex; gap: 15px; margin-bottom: 30px; }
//         .search-pill { flex: 1; background: white; border-radius: 12px; display: flex; align-items: center; padding: 0 15px; border: 1px solid #e2e8f0; color: var(--slate-400); }
//         .search-pill input { border: none; padding: 12px; width: 100%; outline: none; font-size: 14px; color: var(--slate-900); }
//         .filter-btn { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0 20px; font-weight: 600; color: var(--slate-600); display: flex; align-items: center; gap: 8px; cursor: pointer; }

//         /* Grid & Cards */
//         .queue-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px; }
        
//         .hifi-card { 
//           background: white; border-radius: 24px; padding: 24px; border: 1px solid #f1f5f9;
//           display: flex; flex-direction: column; justify-content: space-between;
//           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; overflow: hidden;
//         }
//         .hifi-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px -12px rgba(0,0,0,0.08); border-color: var(--primary-soft); }
        
//         .card-top { display: flex; gap: 16px; align-items: flex-start; margin-bottom: 20px; }
//         .doc-thumb { 
//           width: 52px; height: 52px; border-radius: 14px; background: #f1f5f9; 
//           display: flex; flex-direction: column; align-items: center; justify-content: center;
//           color: var(--slate-600); flex-shrink: 0; position: relative;
//         }
//         .doc-thumb.pdf { background: #fff1f2; color: #e11d48; }
//         .type-tag { font-size: 8px; font-weight: 900; position: absolute; bottom: 6px; }

//         .card-headings h3 { font-size: 18px; font-weight: 700; color: var(--slate-900); margin-bottom: 6px; }
//         .subject-pill { font-size: 12px; font-weight: 600; color: var(--primary); background: var(--primary-soft); padding: 4px 10px; border-radius: 20px; display: inline-flex; align-items: center; gap: 6px; }

//         .card-middle { margin-bottom: 24px; }
//         .meta-row { display: flex; gap: 15px; margin-bottom: 12px; }
//         .meta-pair { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--slate-400); font-weight: 500; }
//         .description-text { font-size: 14px; color: var(--slate-600); line-height: 1.5; background: #f8fafc; padding: 12px; border-radius: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

//         .card-bottom { display: flex; justify-content: space-between; align-items: center; padding-top: 15px; border-top: 1px solid #f1f5f9; }
//         .btn-secondary { color: var(--slate-600); font-size: 13px; font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 6px; padding: 8px 12px; border-radius: 8px; transition: 0.2s; }
//         .btn-secondary:hover { background: #f1f5f9; }

//         .action-group { display: flex; align-items: center; gap: 10px; }
//         .btn-danger-icon { color: #f43f5e; background: none; border: none; cursor: pointer; transition: 0.2s; opacity: 0.7; }
//         .btn-danger-icon:hover { opacity: 1; transform: scale(1.1); }
//         .btn-approve-hifi { background: var(--slate-900); color: white; border: none; padding: 10px 18px; border-radius: 12px; font-size: 13px; font-weight: 700; cursor: pointer; transition: 0.2s; }
//         .btn-approve-hifi:hover { background: var(--primary); transform: scale(1.02); }

//         /* States */
//         .empty-state-glass { text-align: center; padding: 80px; background: white; border-radius: 32px; border: 1px solid #eef2f6; }
//         .icon-wrap-success { width: 80px; height: 80px; background: var(--primary-soft); color: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
        
//         .loading-wrapper { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 400px; color: var(--slate-400); font-weight: 600; }
//         .pulsing-logo { animation: pulse 2s infinite; margin-bottom: 15px; }

//         @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.7; } 100% { transform: scale(1); opacity: 1; } }
//         @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

//       `}</style>
//     </div>
//   );
// };

// export default VerificationQueue;



import React, { useState, useEffect } from 'react';
import { 
  FileText, ExternalLink, CheckCircle, 
  XCircle, Clock, User, BookOpen, Layers,
  ChevronRight, LayoutGrid, FileSearch, Pencil, Eye, X
} from 'lucide-react';
import { api, useAuthStore } from '../store/authStore';
import { toast } from 'sonner';
import { useEscapeKey } from '../hooks/useEscapeKey';

interface PendingContent {
  contentId: string;
  title: string;
  description: string | null;
  uploaderName: string;
  fileUrl: string | null;
  fileType: string;
  uploadedAt: string;
  subjectName: string;
  contentType: 'PAPER' | 'PAPER_SOLUTION' | 'NOTES';
}

const VerificationQueue: React.FC = () => {
  const [fullList, setFullList] = useState<PendingContent[]>([]);
  const [filteredList, setFilteredList] = useState<PendingContent[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PAPER' | 'PAPER_SOLUTION' | 'NOTES'>('ALL');
  const [loading, setLoading] = useState(true);
  
  // 🟢 State for Inline Document Preview Modal
  const [previewItem, setPreviewItem] = useState<PendingContent | null>(null);
  useEscapeKey(() => setPreviewItem(null), Boolean(previewItem));

  const user = useAuthStore((state) => state.user);

  const fetchPendingContent = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/v1/session-rep/${user?.scopeId}/pending-content`);
      if (response.data.success) {
        setFullList(response.data.data);
        setFilteredList(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to load verification queue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.scopeId) fetchPendingContent();
  }, [user]);

  useEffect(() => {
    if (activeTab === 'ALL') {
      setFilteredList(fullList);
    } else {
      setFilteredList(fullList.filter(item => item.contentType === activeTab));
    }
  }, [activeTab, fullList]);

  const handleAction = async (contentId: string, action: 'APPROVE' | 'REJECT') => {
    try {
      if (!user?.scopeId || !user?.id) {
        toast.error("User session invalid");
        return;
      }

      const status = action === 'APPROVE' ? 'VERIFIED' : 'REJECTED';

      await api.patch(
        `/api/v1/session-rep/${user.scopeId}/content/${contentId}/status`,
        { status }
      );

      toast.success(
        status === 'VERIFIED' ? 'Content approved ✅' : 'Content rejected ❌'
      );

      // Close modal if reviewing this item
      if (previewItem?.contentId === contentId) setPreviewItem(null);

      // Remove from list in UI
      setFullList(prev => prev.filter(item => item.contentId !== contentId));

    } catch (error) {
      console.error(error);
      toast.error("Action failed");
    }
  };

  if (loading) {
    return (
      <div className="loading-wrapper">
        <Layers className="pulsing" />
      </div>
    );
  }

  return (
    <div className="modern-queue-wrapper">
      <header className="premium-header">
        <div className="header-content">
          <div className="badge-row">
            <span className="rep-badge">Session Control</span>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="text-slate-400 font-medium">Verification</span>
          </div>
          <h1>Verification <span className="text-gradient">Hub</span></h1>
        </div>
        <div className="stats-box">
          <span className="stat-value">{filteredList.length}</span>
          <span className="stat-label">{activeTab.replace('_', ' ')} items</span>
        </div>
      </header>

      {/* FILTER TABS */}
      <div className="filter-tabs">
        <button onClick={() => setActiveTab('ALL')} className={activeTab === 'ALL' ? 'active' : ''}>
          <LayoutGrid size={16} /> All
        </button>
        <button onClick={() => setActiveTab('PAPER')} className={activeTab === 'PAPER' ? 'active' : ''}>
          <FileSearch size={16} /> Question Papers
        </button>
        <button onClick={() => setActiveTab('PAPER_SOLUTION')} className={activeTab === 'PAPER_SOLUTION' ? 'active' : ''}>
          <CheckCircle size={16} /> Solutions
        </button>
        <button onClick={() => setActiveTab('NOTES')} className={activeTab === 'NOTES' ? 'active' : ''}>
          <Pencil size={16} /> Study Notes
        </button>
      </div>

      {filteredList.length === 0 ? (
        <div className="empty-state-glass">
          <h3>No {activeTab.toLowerCase().replace('_', ' ')} pending</h3>
          <p>Everything is cleared for this category.</p>
        </div>
      ) : (
        <div className="queue-grid">
          {filteredList.map((item) => (
            <div key={item.contentId} className="hifi-card">
              <div className="card-top">
                <div className={`doc-thumb ${item.fileType.toLowerCase()}`}>
                  <FileText size={20} />
                  <span className="type-tag">{item.fileType}</span>
                </div>
                <div className="card-headings">
                  <span className="type-badge-small">
                    {item.contentType.replace('_', ' ')}
                  </span>
                  <h3>{item.title}</h3>
                  <span className="subject-pill">
                    <BookOpen size={12} /> {item.subjectName.replace("Subject: ", "")}
                  </span>
                </div>
              </div>

              <div className="card-middle">
                <div className="meta-row">
                  <div className="meta-pair">
                    <User size={14} /> 
                    <span>{item.uploaderName.split('-')[0]}</span>
                  </div>
                  <div className="meta-pair">
                    <Clock size={14} /> 
                    <span>{new Date(item.uploadedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {item.description && (
                  <p className="description-text">{item.description}</p>
                )}
              </div>

              <div className="card-bottom">
                <div className="view-group">
                  {/* 🟢 VIEW: opens the actual content URL in a new tab so the rep can inspect it */}
                  {item.fileUrl ? (
                    <>
                      <button
                        onClick={() => window.open(item.fileUrl!, '_blank', 'noopener,noreferrer')}
                        className="btn-view"
                        title="Open the paper in a new tab"
                      >
                        <Eye size={14} /> View
                      </button>
                      <button
                        onClick={() => setPreviewItem(item)}
                        className="btn-preview"
                        title="Quick inline preview"
                      >
                        <FileText size={14} />
                      </button>
                    </>
                  ) : (
                    <span className="no-url-badge">Processing URL...</span>
                  )}
                </div>

                <div className="action-group">
                  <button 
                    onClick={() => handleAction(item.contentId, 'REJECT')} 
                    className="btn-danger-icon"
                    title="Reject Content"
                  >
                    <XCircle size={20} />
                  </button>

                  <button 
                    onClick={() => handleAction(item.contentId, 'APPROVE')} 
                    className="btn-approve-hifi"
                  >
                    Verify
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🟢 MODAL FOR PREVIEWING CLOUDINARY CONTENT BEFORE VERIFICATION */}
      {previewItem && (
        <div className="modal-overlay" onClick={() => setPreviewItem(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <div>
                <h3>{previewItem.title}</h3>
                <p className="modal-subtitle">{previewItem.subjectName} • {previewItem.contentType}</p>
              </div>
              <button className="btn-close" onClick={() => setPreviewItem(null)}>
                <X size={20} />
              </button>
            </header>

            <div className="modal-body">
              {previewItem.fileUrl ? (
                previewItem.fileType === 'PDF' || previewItem.fileUrl.endsWith('.pdf') ? (
                  <iframe 
                    src={previewItem.fileUrl} 
                    title={previewItem.title} 
                    className="pdf-viewer" 
                  />
                ) : (
                  <div className="image-viewer-container">
                    <img src={previewItem.fileUrl} alt={previewItem.title} className="image-preview" />
                  </div>
                )
              ) : (
                <div className="empty-preview">File URL unavailable</div>
              )}
            </div>

            <footer className="modal-footer">
              <a 
                href={previewItem.fileUrl || '#'} 
                target="_blank" 
                rel="noreferrer" 
                className="btn-secondary flex items-center gap-2"
              >
                <ExternalLink size={14} /> Open Full Screen
              </a>

              <div className="action-group">
                <button 
                  onClick={() => handleAction(previewItem.contentId, 'REJECT')} 
                  className="btn-danger-text"
                >
                  Reject
                </button>
                <button 
                  onClick={() => handleAction(previewItem.contentId, 'APPROVE')} 
                  className="btn-approve-hifi"
                >
                  Approve & Verify
                </button>
              </div>
            </footer>
          </div>
        </div>
      )}

      <style>{`
        /* Existing Filter & Header Styles */
        .filter-tabs { display: flex; gap: 10px; margin-bottom: 30px; background: #f1f5f9; padding: 6px; border-radius: 14px; width: fit-content; }
        .filter-tabs button { display: flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 10px; border: none; font-weight: 600; font-size: 14px; cursor: pointer; color: #64748b; background: transparent; transition: all 0.2s; }
        .filter-tabs button.active { background: white; color: #0f172a; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .type-badge-small { font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 2px; }

        :root { --primary: #10b981; --primary-soft: #ecfdf5; --slate-900: #0f172a; --slate-600: #475569; --slate-400: #94a3b8; --bg: #f8fafc; }
        .modern-queue-wrapper { max-width: 1100px; margin: 0 auto; padding-bottom: 50px; }
        .premium-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        .badge-row { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
        .rep-badge { background: var(--slate-900); color: white; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
        .premium-header h1 { font-size: 36px; font-weight: 800; color: var(--slate-900); letter-spacing: -1px; }
        .text-gradient { background: linear-gradient(to right, #10b981, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        
        .stats-box { background: white; padding: 20px 30px; border-radius: 20px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); text-align: center; border: 1px solid #eef2f6; }
        .stat-value { display: block; font-size: 28px; font-weight: 800; color: var(--primary); }
        .stat-label { font-size: 12px; font-weight: 600; color: var(--slate-400); text-transform: uppercase; }

        .queue-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px; }
        .hifi-card { background: white; border-radius: 24px; padding: 24px; border: 1px solid #f1f5f9; display: flex; flex-direction: column; justify-content: space-between; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; overflow: hidden; }
        .hifi-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px -12px rgba(0,0,0,0.08); border-color: var(--primary-soft); }
        
        .card-top { display: flex; gap: 16px; align-items: flex-start; margin-bottom: 20px; }
        .doc-thumb { width: 52px; height: 52px; border-radius: 14px; background: #f1f5f9; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--slate-600); flex-shrink: 0; position: relative; }
        .doc-thumb.pdf { background: #fff1f2; color: #e11d48; }
        .type-tag { font-size: 8px; font-weight: 900; position: absolute; bottom: 6px; }

        .card-headings h3 { font-size: 18px; font-weight: 700; color: var(--slate-900); margin-bottom: 6px; }
        .subject-pill { font-size: 12px; font-weight: 600; color: var(--primary); background: var(--primary-soft); padding: 4px 10px; border-radius: 20px; display: inline-flex; align-items: center; gap: 6px; }

        .card-middle { margin-bottom: 24px; }
        .meta-row { display: flex; gap: 15px; margin-bottom: 12px; }
        .meta-pair { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--slate-400); font-weight: 500; }
        .description-text { font-size: 14px; color: var(--slate-600); line-height: 1.5; background: #f8fafc; padding: 12px; border-radius: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

        .card-bottom { display: flex; justify-content: space-between; align-items: center; padding-top: 15px; border-top: 1px solid #f1f5f9; gap: 10px; flex-wrap: wrap; }
        .view-group { display: flex; align-items: center; gap: 8px; }
        .btn-view { background: #ecfdf5; color: #0d9488; border: 1.5px solid #10b981; padding: 9px 16px; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s; }
        .btn-view:hover { background: #10b981; color: white; box-shadow: 0 6px 14px -4px rgba(16, 185, 129, 0.4); transform: translateY(-1px); }
        .btn-preview { color: var(--slate-400); background: none; border: none; cursor: pointer; padding: 8px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; transition: 0.2s; }
        .btn-preview:hover { color: var(--slate-900); background: #f1f5f9; }
        .btn-secondary { color: var(--slate-600); font-size: 13px; font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 6px; padding: 8px 12px; border-radius: 8px; border: none; background: #f1f5f9; cursor: pointer; transition: 0.2s; }
        .btn-secondary:hover { background: #e2e8f0; }
        .no-url-badge { font-size: 11px; font-weight: 600; color: #f59e0b; background: #fef3c7; padding: 4px 8px; border-radius: 6px; }

        .action-group { display: flex; align-items: center; gap: 10px; }
        .btn-danger-icon { color: #f43f5e; background: none; border: none; cursor: pointer; transition: 0.2s; opacity: 0.7; }
        .btn-danger-icon:hover { opacity: 1; transform: scale(1.1); }
        .btn-danger-text { color: #ef4444; background: #fee2e2; border: none; padding: 10px 18px; border-radius: 12px; font-size: 13px; font-weight: 700; cursor: pointer; }
        .btn-approve-hifi { background: var(--slate-900); color: white; border: none; padding: 10px 18px; border-radius: 12px; font-size: 13px; font-weight: 700; cursor: pointer; transition: 0.2s; }
        .btn-approve-hifi:hover { background: var(--primary); transform: scale(1.02); }

        /* Modal Styles */
        .modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(4px); z-index: 999; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .modal-container { background: white; border-radius: 20px; width: 100%; max-width: 900px; height: 85vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
        .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #e2e8f0; }
        .modal-header h3 { font-size: 20px; font-weight: 800; color: var(--slate-900); }
        .modal-subtitle { font-size: 13px; color: var(--slate-400); margin-top: 2px; }
        .btn-close { background: none; border: none; color: var(--slate-400); cursor: pointer; padding: 4px; border-radius: 8px; }
        .btn-close:hover { color: var(--slate-900); background: #f1f5f9; }

        .modal-body { flex: 1; background: #f8fafc; overflow: hidden; display: flex; align-items: center; justify-content: center; position: relative; }
        .pdf-viewer { width: 100%; height: 100%; border: none; }
        .image-viewer-container { width: 100%; height: 100%; overflow: auto; padding: 20px; display: flex; align-items: center; justify-content: center; }
        .image-preview { max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); }
        .empty-preview { color: var(--slate-400); font-weight: 600; }

        .modal-footer { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; border-top: 1px solid #e2e8f0; background: white; }

        .empty-state-glass { text-align: center; padding: 80px; background: white; border-radius: 32px; border: 1px solid #eef2f6; }
        .loading-wrapper { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 400px; color: var(--slate-400); font-weight: 600; }
      `}</style>
    </div>
  );
};

export default VerificationQueue;
