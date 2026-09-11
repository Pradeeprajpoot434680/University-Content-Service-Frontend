import React, { useState, useEffect, useRef } from 'react';
import {
  GraduationCap, Building2, BookOpen, Award,
  Edit3, Loader2, Globe, Palette, Sun, Moon,
  X, Save, User as UserIcon, PencilLine, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { api, normalizeOptionalId, useAuthStore } from '../store/authStore';
import { useTheme } from '../components/theme-provider';
import { Switch } from '../components/ui/switch';

interface FullProfile {
  userId?: string;
  firstName: string;
  lastName: string;
  bio: string;
  totalPoints: number;
  theme: string;
  language: string;
  batchYear: number | null;
  universityName: string;
  departmentName: string;
  programName: string;
  profileImageUrl: string | null;
  universityId?: string;
  departmentId?: string;
  programId?: string;
}

interface IdName {
  id: string;
  name: string;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<FullProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [savingBasic, setSavingBasic] = useState(false);
  const [savingAcademic, setSavingAcademic] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Edit modals
  const [editingBasic, setEditingBasic] = useState(false);
  const [editingAcademic, setEditingAcademic] = useState(false);
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', bio: '' });

  // Academic info form
  const [universities, setUniversities] = useState<IdName[]>([]);
  const [departments, setDepartments] = useState<IdName[]>([]);
  const [programs, setPrograms] = useState<IdName[]>([]);
  const [academicForm, setAcademicForm] = useState({
    universityId: '',
    departmentId: '',
    programId: '',
    batchYear: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const token = useAuthStore.getState().accessToken;
  const user = useAuthStore.getState().user;
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // 🔄 Fetch the full profile (basic + academic names) on mount
  useEffect(() => {
    const fetchCompleteProfile = async () => {
      if (!token) {
        toast.error("Authentication token missing");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const userRes = await api.get('/api/v1/users/me/profile');
        const rawData = userRes.data?.data || userRes.data;

        const universityId =
          normalizeOptionalId(rawData?.universityId) ||
          normalizeOptionalId(user?.universityId);
        const departmentId = normalizeOptionalId(rawData?.departmentId);
        const programId = normalizeOptionalId(rawData?.programId);

        // Apply persisted theme from the backend (if any)
        if (rawData?.theme && rawData.theme !== theme) {
          setTheme(rawData.theme);
        }

        if (universityId && departmentId && programId) {
          const namesRes = await api.post('/api/v1/get/academic-names', {
            universityId,
            departmentId,
            programId
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
  }, [token, user]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------------------------------------------------------------
  // ✏️ BASIC INFO (name + bio)
  // ---------------------------------------------------------------
  const openBasicEditor = () => {
    setEditForm({
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      bio: profile?.bio || '',
    });
    setEditingBasic(true);
  };

  const saveBasicInfo = async () => {
    if (!editForm.firstName.trim()) {
      toast.error("First name is required");
      return;
    }
    setSavingBasic(true);
    try {
      const res = await api.patch('/api/v1/users/me/profile', {
        firstName: editForm.firstName.trim(),
        lastName: editForm.lastName.trim(),
        bio: editForm.bio.trim(),
      });
      const updated = res.data?.data || res.data;
      setProfile((prev) => prev ? { ...prev, ...updated } : prev);
      setEditingBasic(false);
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSavingBasic(false);
    }
  };

  // ---------------------------------------------------------------
  // 🖼️ PROFILE PICTURE (upload → save URL)
  // ---------------------------------------------------------------
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image exceeds 5MB limit");
      e.target.value = '';
      return;
    }

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      // ⚠️ Do NOT set Content-Type manually — axios/browser must generate the
      // multipart boundary, otherwise Spring rejects the request.
      const uploadRes = await api.post('/api/v1/upload', formData);

      const fileUrl = uploadRes.data?.fileUrl;
      if (!fileUrl) throw new Error('Upload response missing fileUrl');

      const res = await api.patch('/api/v1/users/me/profile', { profileImageUrl: fileUrl });
      const updated = res.data?.data || res.data;
      setProfile((prev) => prev ? { ...prev, ...updated } : prev);
      toast.success("Profile picture updated");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to upload profile picture");
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ---------------------------------------------------------------
  // 🎓 ACADEMIC INFO (university → department → program + batch)
  // ---------------------------------------------------------------
  const openAcademicEditor = async () => {
    // Pre-fill from the saved profile, falling back to the auth user's university
    // (the saved profile may lack academic ids if it was never completed at signup).
    const uniId = profile?.universityId || user?.universityId || '';
    const deptId = profile?.departmentId || '';
    const progId = profile?.programId || '';

    setAcademicForm({
      universityId: uniId,
      departmentId: deptId,
      programId: progId,
      batchYear: profile?.batchYear ? String(profile.batchYear) : '',
    });
    setEditingAcademic(true);

    try {
      if (universities.length === 0) {
        const res = await api.get('/api/v1/get/universities');
        setUniversities(res.data?.data || []);
      }
      if (uniId) {
        const deptRes = await api.get(`/api/v1/get/departments/${uniId}`);
        setDepartments(deptRes.data?.data || []);
      }
      if (deptId) {
        const progRes = await api.get(`/api/v1/get/programs/${deptId}`);
        setPrograms(progRes.data?.data || []);
      }
    } catch (err) {
      console.error("Failed to load academic options", err);
      toast.error("Failed to load academic options");
    }
  };

  const onUniversityChange = async (uniId: string) => {
    setAcademicForm((f) => ({ ...f, universityId: uniId, departmentId: '', programId: '' }));
    setDepartments([]);
    setPrograms([]);
    if (!uniId) return;
    try {
      const res = await api.get(`/api/v1/get/departments/${uniId}`);
      setDepartments(res.data?.data || []);
    } catch (err) {
      toast.error("Failed to load departments");
    }
  };

  const onDepartmentChange = async (deptId: string) => {
    setAcademicForm((f) => ({ ...f, departmentId: deptId, programId: '' }));
    setPrograms([]);
    if (!deptId) return;
    try {
      const res = await api.get(`/api/v1/get/programs/${deptId}`);
      setPrograms(res.data?.data || []);
    } catch (err) {
      toast.error("Failed to load programs");
    }
  };

  const saveAcademicInfo = async () => {
    const { universityId, departmentId, programId, batchYear } = academicForm;
    if (!universityId || !departmentId || !programId || !batchYear) {
      toast.error("Please complete university, department, program and batch year");
      return;
    }
    if (!Number.isInteger(Number(batchYear))) {
      toast.error("Please enter a valid batch year");
      return;
    }

    setSavingAcademic(true);
    try {
      await api.patch('/api/v1/accounts/me/academic-info', {
        universityId,
        departmentId,
        programId,
        batchYear: Number(batchYear),
      });

      // Refresh profile + academic names to reflect the new structure
      const userRes = await api.get('/api/v1/users/me/profile');
      const rawData = userRes.data?.data || userRes.data;
      const namesRes = await api.post('/api/v1/get/academic-names', {
        universityId,
        departmentId,
        programId,
      });
      setProfile({ ...rawData, ...(namesRes.data?.data || {}) });

      setEditingAcademic(false);
      toast.success("Academic info updated successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update academic info");
    } finally {
      setSavingAcademic(false);
    }
  };

  // ---------------------------------------------------------------
  // ⚙️ PREFERENCES (theme + language persist to backend)
  // ---------------------------------------------------------------
  const persistTheme = (nextTheme: 'dark' | 'light') => {
    setTheme(nextTheme);
    api.patch('/api/v1/users/me/profile', { theme: nextTheme }).catch(() => {
      // Silent — theme still applies locally even if persistence fails
    });
    setProfile((prev) => prev ? { ...prev, theme: nextTheme } : prev);
  };

  const persistLanguage = (lang: string) => {
    setProfile((prev) => prev ? { ...prev, language: lang } : prev);
    api.patch('/api/v1/users/me/profile', { language: lang })
      .then(() => toast.success(`Language set to ${lang === 'en' ? 'English' : 'Hindi'}`))
      .catch(() => toast.error("Failed to update language"));
  };

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
            <button
              className="ppp-edit-overlay"
              aria-label="Edit Profile Picture"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
            >
              {uploadingAvatar ? <Loader2 size={16} className="ppp-animate-spin" /> : <Edit3 size={16} />}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
          </div>

          <div className="ppp-profile-meta">
            <div className="ppp-name-box">
              <h1>{profile?.firstName || 'User'} {profile?.lastName || ''}</h1>
              <button className="ppp-inline-edit-btn" onClick={openBasicEditor} aria-label="Edit name and bio">
                <PencilLine size={13} />
                <span>Edit</span>
              </button>
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
            <button className="ppp-card-edit-btn" onClick={openAcademicEditor}>
              <Edit3 size={13} />
              <span>Edit</span>
            </button>
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
                  <Sun className={`ppp-toggle-icon ${theme !== 'dark' ? 'active' : ''}`} size={16} onClick={() => persistTheme("light")} />
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => persistTheme(checked ? "dark" : "light")}
                    aria-label="Toggle interface theme mode"
                  />
                  <Moon className={`ppp-toggle-icon ${theme === 'dark' ? 'active' : ''}`} size={16} onClick={() => persistTheme("dark")} />
                </div>
              </div>
            )}

            <div className="ppp-setting-row ppp-language-row">
              <div className="ppp-row-info">
                <Globe size={16} />
                <div>
                  <label>Language</label>
                  <p>{profile?.language === 'en' ? 'English (US)' : (profile?.language === 'hi' ? 'Hindi (हिन्दी)' : (profile?.language || 'English'))}</p>
                </div>
              </div>
              <select
                className="ppp-language-select"
                value={profile?.language === 'hi' ? 'hi' : 'en'}
                onChange={(e) => persistLanguage(e.target.value)}
                aria-label="Select language"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
              </select>
            </div>
          </div>
        </section>
      </div>

      {/* ✏️ BASIC INFO EDIT MODAL */}
      {editingBasic && (
        <div className="ppp-modal-overlay" onClick={() => setEditingBasic(false)}>
          <div className="ppp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ppp-modal-header">
              <div className="ppp-modal-title">
                <UserIcon size={18} className="ppp-icon-green" />
                <h3>Edit Profile</h3>
              </div>
              <button className="ppp-modal-close" onClick={() => setEditingBasic(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="ppp-modal-body">
              <div className="ppp-field">
                <label>First Name</label>
                <input
                  type="text"
                  value={editForm.firstName}
                  onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                  placeholder="Your first name"
                />
              </div>
              <div className="ppp-field">
                <label>Last Name</label>
                <input
                  type="text"
                  value={editForm.lastName}
                  onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                  placeholder="Your last name"
                />
              </div>
              <div className="ppp-field">
                <label>Bio</label>
                <textarea
                  rows={4}
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder="Tell others about yourself…"
                />
              </div>
            </div>

            <div className="ppp-modal-footer">
              <button className="ppp-btn-ghost" onClick={() => setEditingBasic(false)}>Cancel</button>
              <button className="ppp-btn-primary" onClick={saveBasicInfo} disabled={savingBasic}>
                {savingBasic ? <Loader2 size={16} className="ppp-animate-spin" /> : <Save size={16} />}
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🎓 ACADEMIC INFO EDIT MODAL */}
      {editingAcademic && (
        <div className="ppp-modal-overlay" onClick={() => setEditingAcademic(false)}>
          <div className="ppp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ppp-modal-header">
              <div className="ppp-modal-title">
                <GraduationCap size={18} className="ppp-icon-green" />
                <h3>Edit Academic Details</h3>
              </div>
              <button className="ppp-modal-close" onClick={() => setEditingAcademic(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="ppp-modal-body">
              <div className="ppp-field">
                <label>University</label>
                <select
                  value={academicForm.universityId}
                  onChange={(e) => onUniversityChange(e.target.value)}
                >
                  <option value="">Select University</option>
                  {universities.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div className="ppp-field">
                <label>Department</label>
                <select
                  value={academicForm.departmentId}
                  onChange={(e) => onDepartmentChange(e.target.value)}
                  disabled={!academicForm.universityId}
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div className="ppp-field">
                <label>Program</label>
                <select
                  value={academicForm.programId}
                  onChange={(e) => setAcademicForm({ ...academicForm, programId: e.target.value })}
                  disabled={!academicForm.departmentId}
                >
                  <option value="">Select Program</option>
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="ppp-field">
                <label>Batch Year</label>
                <input
                  type="number"
                  min={2000}
                  max={2100}
                  value={academicForm.batchYear}
                  onChange={(e) => setAcademicForm({ ...academicForm, batchYear: e.target.value })}
                  placeholder="e.g. 2026"
                />
              </div>
              <p className="ppp-modal-hint">
                <RefreshCw size={13} />
                Changing your academic details updates which subjects and content you see in the library.
              </p>
            </div>

            <div className="ppp-modal-footer">
              <button className="ppp-btn-ghost" onClick={() => setEditingAcademic(false)}>Cancel</button>
              <button className="ppp-btn-primary" onClick={saveAcademicInfo} disabled={savingAcademic}>
                {savingAcademic ? <Loader2 size={16} className="ppp-animate-spin" /> : <Save size={16} />}
                <span>Save Academic Info</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .ppp-profile-container { animation: ppp-fadeIn 0.4s ease-out; width: 100%; box-sizing: border-box; }

        .ppp-profile-hero { background: #ffffff; border-radius: 24px; border: 1px solid #edf2f0; overflow: hidden; margin-bottom: 30px; }
        .ppp-profile-cover { height: 160px; background: linear-gradient(135deg, #3cd3ad 0%, #2bb08f 100%); }

        .ppp-profile-header-content { padding: 0 40px 30px; display: flex; align-items: flex-end; gap: 30px; margin-top: -60px; }

        .ppp-avatar-wrapper { position: relative; border: 6px solid #ffffff; border-radius: 24px; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08); background: #ffffff; width: 120px; height: 120px; flex-shrink: 0; }
        .ppp-avatar-big { width: 100%; height: 100%; background: #f0fdf9; color: #14b8a6; display: flex; align-items: center; justify-content: center; font-size: 36px; font-weight: 800; border-radius: 18px; }
        .ppp-profile-img { width: 100%; height: 100%; border-radius: 18px; object-fit: cover; display: block; }
        .ppp-edit-overlay { position: absolute; bottom: -8px; right: -8px; background: #0f172a; color: #ffffff; border: none; width: 34px; height: 34px; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.15); transition: background 0.2s, transform 0.2s; }
        .ppp-edit-overlay:hover { background: #1e293b; transform: scale(1.08); }
        .ppp-edit-overlay:disabled { opacity: 0.7; cursor: wait; }

        .ppp-profile-meta { flex: 1; padding-bottom: 5px; min-width: 0; }
        .ppp-name-box { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 8px; }
        .ppp-name-box h1 { font-size: 30px; font-weight: 800; color: #0f172a; margin: 0; letter-spacing: -0.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ppp-inline-edit-btn { display: inline-flex; align-items: center; gap: 5px; background: #f0fdf9; color: #0f766e; border: 1px solid rgba(60, 211, 173, 0.3); padding: 5px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .ppp-inline-edit-btn:hover { background: rgba(60, 211, 173, 0.15); transform: translateY(-1px); }
        .ppp-points-pill { background: rgba(60, 211, 173, 0.1); color: #0f766e; padding: 6px 14px; border-radius: 9999px; font-weight: 700; font-size: 13px; display: inline-flex; align-items: center; gap: 6px; border: 1px solid rgba(60, 211, 173, 0.2); }
        .ppp-bio-text { color: #475569; font-size: 15px; margin: 0; line-height: 1.5; }

        .ppp-profile-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 24px; }
        .ppp-info-card { background: #ffffff; border-radius: 24px; border: 1px solid #edf2f0; padding: 32px; box-shadow: 0 4px 20px rgba(15, 23, 42, 0.02); }
        .ppp-card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; border-bottom: 1px solid #f1f5f9; padding-bottom: 14px; }
        .ppp-card-header h3 { font-size: 17px; font-weight: 800; color: #0f172a; margin: 0; flex: 1; }
        .ppp-icon-green { color: #14b8a6; }

        .ppp-card-edit-btn { display: inline-flex; align-items: center; gap: 5px; background: #f8fafc; color: #475569; border: 1px solid #e2e8f0; padding: 5px 11px; border-radius: 9999px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .ppp-card-edit-btn:hover { background: #f0fdf9; color: #0f766e; border-color: rgba(60, 211, 173, 0.4); }

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

        .ppp-language-row { cursor: default; }
        .ppp-language-row:hover { background: #f0fdf9; border-color: rgba(60, 211, 173, 0.25); }
        .ppp-language-select { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 999px; padding: 7px 14px; font-size: 13px; font-weight: 600; color: #0f172a; cursor: pointer; outline: none; transition: border-color 0.2s; }
        .ppp-language-select:focus { border-color: #3cd3ad; }

        /* ── MODALS ─────────────────────────────────────────── */
        .ppp-modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.45); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px; animation: ppp-fadeIn 0.2s ease-out; }
        .ppp-modal { background: #ffffff; border-radius: 24px; width: 100%; max-width: 460px; box-shadow: 0 25px 60px rgba(15, 23, 42, 0.25); overflow: hidden; animation: ppp-slideUp 0.25s ease-out; }
        .ppp-modal-header { display: flex; align-items: center; justify-content: space-between; padding: 22px 28px 16px; border-bottom: 1px solid #f1f5f9; }
        .ppp-modal-title { display: flex; align-items: center; gap: 10px; }
        .ppp-modal-title h3 { margin: 0; font-size: 17px; font-weight: 800; color: #0f172a; }
        .ppp-modal-close { background: #f8fafc; border: 1px solid #e2e8f0; width: 32px; height: 32px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #64748b; cursor: pointer; transition: all 0.2s; }
        .ppp-modal-close:hover { background: #fee2e2; color: #dc2626; border-color: #fecaca; }

        .ppp-modal-body { padding: 24px 28px; display: flex; flex-direction: column; gap: 18px; }
        .ppp-field { display: flex; flex-direction: column; gap: 7px; }
        .ppp-field label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; }
        .ppp-field input, .ppp-field select, .ppp-field textarea { width: 100%; border: 1px solid #e2e8f0; border-radius: 12px; padding: 11px 14px; font-size: 14px; color: #0f172a; background: #ffffff; outline: none; font-family: inherit; transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box; resize: vertical; }
        .ppp-field input:focus, .ppp-field select:focus, .ppp-field textarea:focus { border-color: #3cd3ad; box-shadow: 0 0 0 3px rgba(60, 211, 173, 0.12); }
        .ppp-field select:disabled { background: #f8fafc; color: #94a3b8; cursor: not-allowed; }
        .ppp-modal-hint { display: flex; align-items: center; gap: 7px; font-size: 12px; color: #94a3b8; margin: 0; background: #f8fafc; border-radius: 10px; padding: 10px 12px; }

        .ppp-modal-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 16px 28px 24px; border-top: 1px solid #f1f5f9; }
        .ppp-btn-ghost { display: inline-flex; align-items: center; gap: 6px; background: #f8fafc; border: 1px solid #e2e8f0; color: #475569; padding: 10px 18px; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .ppp-btn-ghost:hover { background: #f1f5f9; }
        .ppp-btn-primary { display: inline-flex; align-items: center; gap: 7px; background: #0f766e; border: 1px solid #0f766e; color: #ffffff; padding: 10px 20px; border-radius: 12px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .ppp-btn-primary:hover { background: #115e59; transform: translateY(-1px); box-shadow: 0 6px 16px rgba(15, 118, 110, 0.25); }
        .ppp-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none; }

        .ppp-profile-loading { min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; color: #64748b; font-weight: 500; }
        .ppp-animate-spin { animation: ppp-spin 1s linear infinite; }

        @keyframes ppp-spin { to { transform: rotate(360deg); } }
        @keyframes ppp-fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ppp-slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

        /* RESPONSIVE LAYOUT CONSTRAINTS */
        @media (max-width: 768px) {
          .ppp-profile-header-content { flex-direction: column; align-items: center; text-align: center; margin-top: -50px; padding: 0 20px 24px; gap: 16px; }
          .ppp-name-box { justify-content: center; gap: 10px; }
          .ppp-name-box h1 { font-size: 26px; }
          .ppp-profile-hero { border-radius: 16px; }
          .ppp-info-card { padding: 24px; border-radius: 16px; }
          .ppp-modal { max-width: 100%; border-radius: 18px; }
          .ppp-modal-body { padding: 20px; }
          .ppp-modal-footer { padding: 14px 20px 20px; }
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
