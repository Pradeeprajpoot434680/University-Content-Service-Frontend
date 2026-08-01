// import { FileText, Calendar, GraduationCap, ExternalLink, CheckCircle2 } from "lucide-react";
// import { Badge } from "../components/ui/badge";

// export default function PaperCard({ content }: { content: any }) {
//   return (
//     <div className="glass-card paper-item-card">
//       <div className="card-top">
//         <Badge className="type-badge">{content.contentType}</Badge>
//         {content.verificationStatus === "VERIFIED" && (
//           <CheckCircle2 size={16} className="text-emerald-500" />
//         )}
//       </div>
      
//       <h3 className="paper-title">{content.title}</h3>
//       <p className="paper-desc">{content.description || "No additional description provided."}</p>

//       <div className="paper-meta">
//         <div className="meta-tag">
//           <GraduationCap size={14} /> Sem {content.semester}
//         </div>
//         <div className="meta-tag">
//           <Calendar size={14} /> {content.academicYear}
//         </div>
//         <div className="meta-tag">
//           <FileText size={14} /> {content.fileType}
//         </div>
//       </div>

//       <button 
//         className="view-btn" 
//         onClick={() => window.open(content.fileUrl, "_blank")}
//       >
//         View Resource <ExternalLink size={14} />
//       </button>

//       <style>{`
//         .paper-item-card { 
//           display: flex; 
//           flex-direction: column; 
//           transition: 0.3s; 
//           padding: 20px !important;
//         }
//         .paper-item-card:hover { transform: translateY(-4px); border-color: var(--brand); }
//         .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
//         .type-badge { background: #f1f5f9; color: #475569; border: none; font-weight: 600; font-size: 10px; text-transform: uppercase; }
//         .paper-title { font-size: 16px; font-weight: 700; color: var(--text-main); margin-bottom: 8px; line-clamp: 1; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
//         .paper-desc { font-size: 13px; color: var(--text-muted); line-height: 1.5; margin-bottom: 20px; height: 40px; overflow: hidden; }
//         .paper-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; margin-top: auto; }
//         .meta-tag { display: flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 600; color: #64748b; background: #f8fafc; padding: 4px 8px; border-radius: 6px; border: 1px solid var(--border); }
//         .view-btn { width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border); background: #fff; color: var(--text-main); font-weight: 600; font-size: 13px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: 0.2s; }
//         .view-btn:hover { background: var(--bg-main); border-color: var(--brand); color: var(--brand); }
//       `}</style>
//     </div>
//   );
// }

// import React from 'react';
// import { ExternalLink, FileText, Calendar, BookOpen, GraduationCap } from 'lucide-react';

// interface ContentItem {
//   id: string;
//   title: string;
//   description: string | null;
//   contentType: string;
//   universityId: string;
//   departmentId: string;
//   programId: string;
//   academicYear: number;
//   semester: number;
//   subjectId: string;
//   examTypeId: string | null;
//   fileUrl: string | null; // 🟢 Cloudinary URL field from ContentSearchResponseDTO
//   fileType: string;
// }

// interface PaperCardProps {
//   content: ContentItem;
// }

// export default function PaperCard({ content }: PaperCardProps) {
//   // 🟢 Extract fileUrl safely
//   const fileUrl = content.fileUrl;

//   const handleViewResource = () => {
//     if (fileUrl) {
//       // Open Cloudinary URL directly in a new browser tab
//       window.open(fileUrl, '_blank', 'noopener,noreferrer');
//     } else {
//       alert("Resource file URL is not available.");
//     }
//   };

//   return (
//     <div className="paper-card-glass">
//       <div className="card-top">
//         <div className={`file-badge ${content.fileType?.toLowerCase() === 'pdf' ? 'pdf' : 'image'}`}>
//           <FileText size={20} />
//           <span>{content.fileType || 'PDF'}</span>
//         </div>
//         <div className="card-title-group">
//           <span className="type-badge">{content.contentType?.replace('_', ' ')}</span>
//           <h3>{content.title}</h3>
//         </div>
//       </div>

//       {content.description && (
//         <p className="card-description">{content.description}</p>
//       )}

//       <div className="card-meta">
//         <div className="meta-pill">
//           <Calendar size={12} />
//           <span>{content.academicYear} • Sem {content.semester}</span>
//         </div>
//       </div>

//       <div className="card-actions">
//         {fileUrl ? (
//           <button 
//             onClick={handleViewResource} 
//             className="btn-view-resource"
//           >
//             <span>View Resource</span>
//             <ExternalLink size={14} />
//           </button>
//         ) : (
//           <span className="disabled-badge">Processing File...</span>
//         )}
//       </div>

//       <style>{`
//         .paper-card-glass {
//           background: white;
//           border: 1px solid #e2e8f0;
//           border-radius: 16px;
//           padding: 20px;
//           display: flex;
//           flex-direction: column;
//           justify-content: space-between;
//           transition: all 0.2s ease;
//         }
//         .paper-card-glass:hover {
//           transform: translateY(-4px);
//           box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.08);
//           border-color: #cbd5e1;
//         }
//         .card-top { display: flex; gap: 14px; align-items: flex-start; margin-bottom: 12px; }
//         .file-badge {
//           width: 44px; height: 44px; border-radius: 12px; background: #f1f5f9;
//           display: flex; flex-direction: column; align-items: center; justify-content: center;
//           color: #475569; font-size: 8px; font-weight: 800; flex-shrink: 0;
//         }
//         .file-badge.pdf { background: #fff1f2; color: #e11d48; }
//         .card-title-group h3 { font-size: 16px; font-weight: 700; color: #0f172a; margin-top: 2px; }
//         .type-badge { font-size: 10px; font-weight: 800; color: #6366f1; text-transform: uppercase; letter-spacing: 0.5px; }
//         .card-description { font-size: 13px; color: #64748b; margin-bottom: 16px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
//         .card-meta { display: flex; gap: 10px; margin-bottom: 16px; }
//         .meta-pill { font-size: 12px; font-weight: 600; color: #64748b; background: #f8fafc; padding: 4px 10px; border-radius: 20px; display: flex; align-items: center; gap: 6px; }
//         .card-actions { border-top: 1px solid #f1f5f9; padding-top: 14px; display: flex; justify-content: flex-end; }
//         .btn-view-resource {
//           background: #6366f1; color: white; border: none; padding: 8px 16px; border-radius: 10px;
//           font-size: 13px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px;
//           transition: 0.2s;
//         }
//         .btn-view-resource:hover { background: #4f46e5; }
//         .disabled-badge { font-size: 12px; color: #94a3b8; font-weight: 600; }
//       `}</style>
//     </div>
//   );
// }

import { FileText, Calendar, GraduationCap, ExternalLink, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "../components/ui/badge";

interface PaperCardProps {
  content: {
    id?: string;
    title?: string;
    description?: string | null;
    contentType?: string;
    verificationStatus?: string;
    semester?: number;
    academicYear?: number;
    fileType?: string;
    fileUrl?: string | null;
  };
}

export default function PaperCard({ content }: PaperCardProps) {
  // 🟢 Safely extract and validate fileUrl
  const fileUrl = content?.fileUrl;

  const handleViewResource = () => {
    if (fileUrl && fileUrl.startsWith("http")) {
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    } else {
      alert("Resource file is currently processing or unavailable.");
    }
  };

  const formatContentType = (type?: string) => {
    if (!type) return "RESOURCE";
    return type.replace(/_/g, " ");
  };

  return (
    <div className="glass-card paper-item-card">
      <div className="card-top">
        <Badge className="type-badge">{formatContentType(content?.contentType)}</Badge>
      {content?.verificationStatus === "VERIFIED" && (
      <span title="Verified Resource">
        <CheckCircle2
          size={16}
          className="text-emerald-500"
          aria-label="Verified Resource"
        />
      </span>
    )}
      </div>

      <h3 className="paper-title">{content?.title || "Untitled Resource"}</h3>
      <p className="paper-desc">{content?.description || "No additional description provided."}</p>

      <div className="paper-meta">
        {content?.semester && (
          <div className="meta-tag">
            <GraduationCap size={14} /> Sem {content.semester}
          </div>
        )}
        {content?.academicYear && (
          <div className="meta-tag">
            <Calendar size={14} /> {content.academicYear}
          </div>
        )}
        {content?.fileType && (
          <div className="meta-tag">
            <FileText size={14} /> {content.fileType}
          </div>
        )}
      </div>

      {fileUrl ? (
        <button className="view-btn" onClick={handleViewResource}>
          View Resource <ExternalLink size={14} />
        </button>
      ) : (
        <button className="view-btn disabled-btn" disabled>
          <Clock size={14} /> Processing File...
        </button>
      )}

      <style>{`
        .paper-item-card { 
          display: flex; 
          flex-direction: column; 
          transition: 0.3s; 
          padding: 20px !important;
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid var(--border, #e2e8f0);
        }
        .paper-item-card:hover { transform: translateY(-4px); border-color: var(--brand, #6366f1); }
        .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .type-badge { background: #f1f5f9; color: #475569; border: none; font-weight: 600; font-size: 10px; text-transform: uppercase; }
        .paper-title { font-size: 16px; font-weight: 700; color: var(--text-main, #0f172a); margin-bottom: 8px; line-clamp: 1; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
        .paper-desc { font-size: 13px; color: var(--text-muted, #64748b); line-height: 1.5; margin-bottom: 20px; height: 40px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
        .paper-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; margin-top: auto; }
        .meta-tag { display: flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 600; color: #64748b; background: #f8fafc; padding: 4px 8px; border-radius: 6px; border: 1px solid var(--border, #e2e8f0); }
        .view-btn { width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border, #e2e8f0); background: #fff; color: var(--text-main, #0f172a); font-weight: 600; font-size: 13px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: 0.2s; }
        .view-btn:hover:not(:disabled) { background: var(--bg-main, #f8fafc); border-color: var(--brand, #6366f1); color: var(--brand, #6366f1); }
        .disabled-btn { opacity: 0.6; cursor: not-allowed; background: #f1f5f9; color: #94a3b8; }
      `}</style>
    </div>
  );
}