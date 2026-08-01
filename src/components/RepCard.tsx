import { User as UserIcon, ShieldCheck, Landmark, GraduationCap, Clock } from 'lucide-react';
import type { TeamMember } from '../utils/interfaces';

const RepCard = ({ member }: { member: TeamMember }) => {
  const isUniAdmin = member.roleName === 'UNIVERSITY_ADMIN';

  const getScopeTheme = () => {
    switch (member.scopeType) {
      case 'UNIVERSITY': return { icon: <ShieldCheck size={14} />, color: '#1e293b', label: 'Admin' };
      case 'DEPARTMENT': return { icon: <Landmark size={14} />, color: '#3b82f6', label: 'Dept' };
      case 'PROGRAM': return { icon: <GraduationCap size={14} />, color: '#8b5cf6', label: 'Prog' };
      case 'SESSION': return { icon: <Clock size={14} />, color: '#f59e0b', label: 'Sess' };
      default: return { icon: <UserIcon size={14} />, color: '#64748b', label: 'Rep' };
    }
  };

  const theme = getScopeTheme();

  return (
    <div className={`rep-card ${isUniAdmin ? 'premium' : ''}`}>
      <div className="avatar-wrapper">
        {member.profileImageUrl ? (
          <img src={member.profileImageUrl} alt={member.firstName} />
        ) : (
          <div className="avatar-fallback"><UserIcon size={24} /></div>
        )}
        <div className="theme-badge" style={{ backgroundColor: theme.color }}>
          {theme.icon}
        </div>
      </div>

      <div className="rep-details">
        <span className="role-chip" style={{ color: theme.color, borderColor: `${theme.color}30` }}>
          {member.roleName.replace('_', ' ')}
        </span>
        <h4>{member.firstName} {member.lastName}</h4>
        <p className="scope-text">{member.scopeName}</p>
      </div>

      <style>{`
        .rep-card {
          width: 100%;
          min-width: 0;
          background: white;
          border: 1px solid #eef2f6;
          border-radius: 20px;
          padding: 22px 16px;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          position: relative;
          overflow: hidden;
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.035);
        }
        .rep-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 34px rgba(15, 23, 42, 0.08);
          border-color: #3cd3ad;
        }
        .rep-card.premium {
          background: linear-gradient(to bottom, #ffffff, #f0faf7);
          border-color: #3cd3ad40;
        }
        .rep-card.premium::before {
          content: '';
          position: absolute;
          inset: 0 0 auto;
          height: 3px;
          background: #3cd3ad;
        }

        .avatar-wrapper { position: relative; width: 72px; height: 72px; margin: 0 auto 16px; }
        .avatar-wrapper img, .avatar-fallback { 
          width: 100%; height: 100%; border-radius: 22px; 
          object-fit: cover; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .avatar-fallback { background: #f8fafc; color: #cbd5e1; display: flex; align-items: center; justify-content: center; }

        .theme-badge { 
          position: absolute; bottom: -8px; right: -8px; 
          color: white; padding: 6px; border-radius: 12px;
          border: 3px solid white; display: flex; align-items: center; justify-content: center;
        }

        .rep-details { text-align: center; }
        .role-chip { 
          font-size: 9px; font-weight: 800; text-transform: uppercase; 
          padding: 3px 8px; border: 1px solid; border-radius: 20px;
          letter-spacing: 0.5px; margin-bottom: 8px; display: inline-block;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .rep-details h4 {
          font-size: 15px;
          color: #0f172a;
          margin: 4px 0;
          font-weight: 700;
          line-height: 1.25;
          overflow-wrap: anywhere;
        }
        .scope-text {
          font-size: 12px;
          color: #64748b;
          line-height: 1.4;
          min-height: 34px;
          margin: 8px 0 0;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        @media (max-width: 620px) {
          .rep-card {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 16px;
            text-align: left;
          }
          .avatar-wrapper {
            flex: 0 0 64px;
            width: 64px;
            height: 64px;
            margin: 0;
          }
          .rep-details {
            min-width: 0;
            text-align: left;
          }
          .scope-text {
            min-height: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default RepCard;
