import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  GraduationCap, Building2, BookOpen, Award, 
  Edit3, Loader2, Globe, Palette, ChevronRight, Sun, Moon
} from 'lucide-react';
import { toast } from 'sonner';
import { normalizeOptionalId, useAuthStore } from '../store/authStore';
import { useTheme } from '../components/theme-provider';
import { Switch } from '../components/ui/switch';

interface FullProfile {
  firstName: string;
  lastName: string;
  bio: string;
  totalPoints: number;
  theme: string;
  language: string;
  batchYear: number;
  universityName: string;
  departmentName: string;
  programName: string;
  profileImageUrl: string | null;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<FullProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const token = useAuthStore.getState().accessToken;
  const user = useAuthStore.getState().user;
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchCompleteProfile = async () => {
      if (!token) {
        toast.error("Authentication token missing");
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const userRes = await axios.get('http://localhost:8080/api/v1/users/me/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const rawData = userRes.data?.data || userRes.data;

        const universityId =
          normalizeOptionalId(rawData?.universityId) ||
          normalizeOptionalId(user?.universityId);
        const departmentId = normalizeOptionalId(rawData?.departmentId);
        const programId = normalizeOptionalId(rawData?.programId);

        if (universityId && departmentId && programId) {
          const namesRes = await axios.post('http://localhost:8080/api/v1/get/academic-names', {
            universityId,
            departmentId,
            programId
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const academicData = namesRes.data?.data || {};
          setProfile({ ...rawData, ...academicData });
        } else {
          setProfile(rawData);
        }
      } catch (error) {
        console.error("Profile sync error:", error);
        toast.error("Failed to sync profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchCompleteProfile();
  }, [token, user]);

  if (loading) return (
    <div className="ppp-profile-loading">
      <Loader2 className="ppp-animate-spin" size={40} color="#3cd3ad" />
      <p>Synchronizing your academic identity...</p>
    </div>
  );

  // Fallback initial string constructors derived dynamically from active data payload
  const fallbackInitials = `${profile?.firstName?.charAt(0) || ''}${profile?.lastName?.charAt(0) || ''}`.toUpperCase() || 'P';

  return (
    <div className="ppp-profile-container">
      {/* HERO HEADER */}
      <header className="ppp-profile-hero">
        <div className="ppp-profile-cover"></div>
        <div className="ppp-profile-header-content">
          <div className="ppp-avatar-wrapper">
            {profile?.profileImageUrl ? (
              <img 
                src={profile.profileImageUrl} 
                alt="Profile Avatar" 
                className="ppp-profile-img"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallbackBox = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallbackBox) fallbackBox.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className="ppp-avatar-big"
              style={{ display: profile?.profileImageUrl ? 'none' : 'flex' }}
            >
              {fallbackInitials}
            </div>
            <button className="ppp-edit-overlay" aria-label="Edit Profile Picture">
              <Edit3 size={16} />
            </button>
          </div>
          
          <div className="ppp-profile-meta">
            <div className="ppp-name-box">
              <h1>{profile?.firstName || 'User'} {profile?.lastName || ''}</h1>
              <div className="ppp-points-pill">
                <Award size={16} />
                <span>{profile?.totalPoints ?? 0} Points</span>
              </div>
            </div>
            <p className="ppp-bio-text">{profile?.bio || "Academic enthusiast and PrevPaper contributor."}</p>
          </div>
        </div>
      </header>

      {/* INFORMATION GRID */}
      <div className="ppp-profile-grid">
        {/* ACADEMIC CARD */}
        <section className="ppp-info-card">
          <div className="ppp-card-header">
            <GraduationCap size={20} className="ppp-icon-green" />
            <h3>Academic Details</h3>
          </div>
          <div className="ppp-info-list">
            <InfoItem label="University" value={profile?.universityName} icon={<Building2 size={16}/>} />
            <InfoItem label="Department" value={profile?.departmentName} icon={<BookOpen size={16}/>} />
            <InfoItem label="Program" value={profile?.programName ? `${profile.programName} ${profile.batchYear ? `• Class of ${profile.batchYear}` : ''}` : undefined} icon={<GraduationCap size={16}/>} />
          </div>
        </section>

        {/* PREFERENCES CARD */}
        <section className="ppp-info-card">
          <div className="ppp-card-header">
            <Palette size={20} className="ppp-icon-green" />
            <h3>App Preferences</h3>
          </div>
          <div className="ppp-info-list">
            {mounted && (
              <div className="ppp-setting-row ppp-theme-row">
                <div className="ppp-row-info">
                  {theme === 'dark' ? <Moon size={16} style={{ color: '#60a5fa' }} /> : <Sun size={16} style={{ color: '#fbbf24' }} />}
                  <div>
                    <label>Interface Theme</label>
                    <p>{theme === 'dark' ? 'Dark' : 'Light'} Mode</p>
                  </div>
                </div>
                <div className="ppp-theme-toggle-wrapper" onClick={(e) => e.stopPropagation()}>
                  <Sun className={`ppp-toggle-icon ${theme !== 'dark' ? 'active' : ''}`} size={16} onClick={() => setTheme("light")} />
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                    aria-label="Toggle interface theme mode"
                  />
                  <Moon className={`ppp-toggle-icon ${theme === 'dark' ? 'active' : ''}`} size={16} onClick={() => setTheme("dark")} />
                </div>
              </div>
            )}
            
            <button className="ppp-setting-row">
              <div className="ppp-row-info">
                <Globe size={16} />
                <div>
                  <label>Language</label>
                  <p>{profile?.language === 'en' ? 'English (US)' : (profile?.language || 'English')}</p>
                </div>
              </div>
              <ChevronRight size={18} color="#cbd5e1" />
            </button>
          </div>
        </section>
      </div>

      <style>{`
        .ppp-profile-container { animation: ppp-fadeIn 0.4s ease-out; width: 100%; box-sizing: border-box; }
        
        .ppp-profile-hero { background: #ffffff; border-radius: 24px; border: 1px solid #edf2f0; overflow: hidden; margin-bottom: 30px; }
        .ppp-profile-cover { height: 160px; background: linear-gradient(135deg, #3cd3ad 0%, #2bb08f 100%); }
        
        .ppp-profile-header-content { padding: 0 40px 30px; display: flex; align-items: flex-end; gap: 30px; margin-top: -60px; }
        
        .ppp-avatar-wrapper { position: relative; border: 6px solid #ffffff; border-radius: 24px; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08); background: #ffffff; width: 120px; height: 120px; flex-shrink: 0; }
        .ppp-avatar-big { width: 100%; height: 100%; background: #f0fdf9; color: #14b8a6; display: flex; align-items: center; justify-content: center; font-size: 36px; font-weight: 800; border-radius: 18px; }
        .ppp-profile-img { width: 100%; height: 100%; border-radius: 18px; object-fit: cover; display: block; }
        .ppp-edit-overlay { position: absolute; bottom: -8px; right: -8px; background: #0f172a; color: #ffffff; border: none; width: 34px; height: 34px; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.15); transition: background 0.2s; }
        .ppp-edit-overlay:hover { background: #1e293b; }

        .ppp-profile-meta { flex: 1; padding-bottom: 5px; min-width: 0; }
        .ppp-name-box { display: flex; align-items: center; flex-wrap: wrap; gap: 16px; margin-bottom: 8px; }
        .ppp-name-box h1 { font-size: 30px; font-weight: 800; color: #0f172a; margin: 0; letter-spacing: -0.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ppp-points-pill { background: rgba(60, 211, 173, 0.1); color: #0f766e; padding: 6px 14px; border-radius: 9999px; font-weight: 700; font-size: 13px; display: inline-flex; align-items: center; gap: 6px; border: 1px solid rgba(60, 211, 173, 0.2); }
        .ppp-bio-text { color: #475569; font-size: 15px; margin: 0; line-height: 1.5; }

        .ppp-profile-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 24px; }
        .ppp-info-card { background: #ffffff; border-radius: 24px; border: 1px solid #edf2f0; padding: 32px; box-shadow: 0 4px 20px rgba(15, 23, 42, 0.02); }
        .ppp-card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; border-bottom: 1px solid #f1f5f9; padding-bottom: 14px; }
        .ppp-card-header h3 { font-size: 17px; font-weight: 800; color: #0f172a; margin: 0; }
        .ppp-icon-green { color: #14b8a6; }

        .ppp-info-list { display: flex; flex-direction: column; gap: 20px; }
        .ppp-info-item-row { display: flex; align-items: flex-start; gap: 16px; }
        .ppp-icon-bg { width: 40px; height: 40px; background: #f8fafc; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #64748b; flex-shrink: 0; border: 1px solid rgba(15, 23, 42, 0.03); }
        .ppp-item-content { min-width: 0; flex: 1; }
        .ppp-item-content label { display: block; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.5px; }
        .ppp-item-content p { margin: 0; font-size: 14px; font-weight: 600; color: #334155; line-height: 1.4; overflow: hidden; text-overflow: ellipsis; }

        .ppp-setting-row { display: flex; justify-content: space-between; align-items: center; width: 100%; background: none; border: 1px solid transparent; padding: 14px; border-radius: 16px; transition: all 0.2s ease; cursor: pointer; text-align: left; box-sizing: border-box; }
        .ppp-setting-row:hover { background: #f0fdf9; border-color: rgba(60, 211, 173, 0.25); }
        .ppp-row-info { display: flex; align-items: center; gap: 16px; color: #475569; min-width: 0; }
        .ppp-row-info label { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #94a3b8; cursor: pointer; margin-bottom: 2px; }
        .ppp-row-info p { margin: 0; font-size: 14px; font-weight: 600; color: #1e293b; }

        .ppp-theme-row { cursor: default; }
        .ppp-theme-row:hover { background: none; border-color: transparent; }
        .ppp-theme-toggle-wrapper { display: flex; align-items: center; gap: 12px; background: #f8fafc; padding: 6px 12px; border-radius: 999px; border: 1px solid #e2e8f0; }
        .ppp-toggle-icon { color: #94a3b8; cursor: pointer; transition: color 0.2s; }
        .ppp-toggle-icon:hover { color: #475569; }
        .ppp-toggle-icon.active { color: #14b8a6; }

        .ppp-profile-loading { min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; color: #64748b; font-weight: 500; }
        .ppp-animate-spin { animation: ppp-spin 1s linear infinite; }

        @keyframes ppp-spin { to { transform: rotate(360deg); } }
        @keyframes ppp-fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

        /* RESPONSIVE LAYOUT CONSTRAINTS */
        @media (max-width: 768px) {
          .ppp-profile-header-content { flex-direction: column; align-items: center; text-align: center; margin-top: -50px; padding: 0 20px 24px; gap: 16px; }
          .ppp-name-box { justify-content: center; gap: 10px; }
          .ppp-name-box h1 { font-size: 26px; }
          .ppp-profile-hero { border-radius: 16px; }
          .ppp-info-card { padding: 24px; border-radius: 16px; }
        }
        
      `}</style>
    </div>
  );
};

interface InfoItemProps {
  label: string;
  value?: string;
  icon: React.ReactNode;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value, icon }) => (
  <div className="ppp-info-item-row">
    <div className="ppp-icon-bg">{icon}</div>
    <div className="ppp-item-content">
      <label>{label}</label>
      <p>{value || "Not synchronized"}</p>
    </div>
  </div>
);

export default ProfilePage;
