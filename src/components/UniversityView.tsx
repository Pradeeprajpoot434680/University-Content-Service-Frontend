import React, { useEffect, useMemo, useState } from 'react';
import {
  ShieldCheck,
  BookOpen,
  FileCheck,
  Layers,
  Building2,
  GraduationCap,
  Calendar,
  Search,
  Users,
  GraduationCap as GraduationIcon
} from 'lucide-react';

import RepCard from './RepCard';
import type { TeamMember } from '../utils/interfaces';
import {
  api,
  normalizeOptionalId,
  useAuthStore
} from '../store/authStore';

interface ContentStats {
  totalContent: number;
  breakdown: {
    type: string;
    count: number;
  }[];
}

const UniversityView: React.FC = () => {
  const user = useAuthStore(
    state => state.user
  );

  // Directly extract the university id assigned to the user profile
  const activeUniversityId = useMemo(() => {
    return normalizeOptionalId(user?.universityId);
  }, [user?.universityId]);

  const [team, setTeam] = useState<TeamMember[]>([]);
  const [stats, setStats] = useState<ContentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // If the logged in profile has no matching university payload, break execution execution early
    if (!activeUniversityId) {
      setLoading(false);
      return;
    }

    let ignore = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [teamRes, statsRes] = await Promise.all([
          api.get(
            `/api/v1/get/university-info/${activeUniversityId}`
          ),
          api.get(
            `/api/v1/content/internal/stats/university/${activeUniversityId}`
          )
        ]);

        if (ignore) return;

        setTeam(
          Array.isArray(teamRes?.data?.data)
            ? teamRes.data.data
            : []
        );

        setStats(statsRes.data);
      } catch (err) {
        if (!ignore) {
          setError(
            'Unable to load data for your university registry.'
          );
        }
        console.error(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, [activeUniversityId]);

  const getCount = (type: string) => {
    return (
      stats?.breakdown?.find(
        item => item.type === type
      )?.count || 0
    );
  };

  const filteredTeam = useMemo(() => {
    const query = search.toLowerCase();

    return team.filter(member => {
      const name = `${member.firstName || ''} ${
        member.lastName || ''
      }`.toLowerCase();

      return (
        name.includes(query) ||
        member.scopeName?.toLowerCase().includes(query) ||
        member.roleName?.toLowerCase().includes(query)
      );
    });
  }, [team, search]);

  const renderGroup = (
    title: string,
    icon: React.ReactNode,
    members: TeamMember[]
  ) => {
    if (!members.length) return null;

    return (
      <div className="team-group">
        <div className="group-header">
          <div className="group-title">
            {icon}
            <div>
              <h3>{title}</h3>
              <span>
                {members.length}{' '}
                Representative
                {members.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        <div className="members-grid">
          {members.map((member, index) => (
            <RepCard
              key={`${member.userId}-${index}`}
              member={member}
            />
          ))}
        </div>
      </div>
    );
  };

  // Safe Guard: If user profile metadata is loaded, but lacks a valid reference ID tracking assignment.
  if (!loading && !activeUniversityId) {
    return (
      <div className="uni-wrapper flex-center">
        <div className="dashboard-card text-center no-uni-state">
          <GraduationIcon size={48} className="no-uni-icon" />
          <h2>No Associated University Found</h2>
          <p>Your user profile is not linked or registered to any active academic institution yet.</p>
          <span className="contact-subtext">Please contact your system coordinator or administration to modify your registration details.</span>
        </div>
        <style>{`
          .flex-center { display: flex; align-items: center; justify-content: center; min-height: 60vh; }
          .text-center { text-align: center; }
          .no-uni-state { max-width: 480px; padding: 40px 24px !important; }
          .no-uni-icon { color: #94a3b8; margin-bottom: 16px; }
          .no-uni-state h2 { margin: 0 0 12px; font-size: 20px; color: #0f172a; font-weight: 700; }
          .no-uni-state p { margin: 0 0 16px; color: #475569; font-size: 14px; line-height: 1.5; }
          .contact-subtext { font-size: 12px; color: #94a3b8; display: block; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="uni-wrapper">
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon papers">
            <BookOpen size={24} />
          </div>
          <div>
            <span>Total Papers</span>
            <h2>{getCount('PAPER')}</h2>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon notes">
            <Layers size={24} />
          </div>
          <div>
            <span>Study Notes</span>
            <h2>{getCount('NOTES')}</h2>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon solutions">
            <FileCheck size={24} />
          </div>
          <div>
            <span>Solved Papers</span>
            <h2>{getCount('PAPER_SOLUTION')}</h2>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-card">
          <div className="management-header">
            <div className="management-title">
              <Users size={24} className="header-icon" />
              <div>
                <h2>University Management</h2>
                <p>University representatives and academic leadership</p>
              </div>
            </div>

            <div className="count-card">
              <h3>{team.length}</h3>
              <span>Total Reps</span>
            </div>
          </div>

          <div className="search-box">
            <Search size={16} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search representatives..."
            />
          </div>

          {loading ? (
            <div className="empty-state">Loading representatives...</div>
          ) : error ? (
            <div className="empty-state">{error}</div>
          ) : filteredTeam.length === 0 ? (
            <div className="empty-state">
              <Users size={42} />
              <h3>No Representatives Found</h3>
              <p>Representatives will appear here once assigned.</p>
            </div>
          ) : (
            <div className="group-stack">
              {renderGroup(
                'University Admin',
                <ShieldCheck size={18} />,
                filteredTeam.filter(m => m.scopeType === 'UNIVERSITY')
              )}

              {renderGroup(
                'Department Representatives',
                <Building2 size={18} />,
                filteredTeam.filter(m => m.scopeType === 'DEPARTMENT')
              )}

              {renderGroup(
                'Program Representatives',
                <GraduationCap size={18} />,
                filteredTeam.filter(m => m.scopeType === 'PROGRAM')
              )}

              {renderGroup(
                'Session Representatives',
                <Calendar size={18} />,
                filteredTeam.filter(m => m.scopeType === 'SESSION')
              )}
            </div>
          )}
        </section>
      </div>

      <style>{`
        .uni-wrapper { display: flex; flex-direction: column; gap: 24px; padding-bottom: 40px; }
        .metrics-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
        .metric-card { background: white; border-radius: 24px; padding: 22px; display: flex; align-items: center; gap: 16px; border: 1px solid #eef2f6; box-shadow: 0 12px 30px rgba(15,23,42,.04); }
        .metric-card span { font-size: 12px; font-weight: 600; color: #94a3b8; }
        .metric-card h2 { margin: 4px 0 0; font-size: 28px; color: #0f172a; }
        .metric-icon { width: 54px; height: 54px; border-radius: 16px; display: flex; align-items: center; justify-content: center; color: white; }
        .papers { background: #10b981; }
        .notes { background: #3b82f6; }
        .solutions { background: #8b5cf6; }
        .dashboard-grid { display: grid; grid-template-columns: 1fr; }
        .dashboard-card { background: white; border-radius: 28px; padding: 28px; border: 1px solid #eef2f6; box-shadow: 0 20px 40px rgba(15,23,42,.04); }
        .management-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; gap: 20px; }
        .management-title { display: flex; align-items: center; gap: 14px; }
        .header-icon { color: #10b981; }
        .management-title h2 { margin: 0; font-size: 22px; font-weight: 800; color: #0f172a; }
        .management-title p { margin: 4px 0 0; color: #64748b; font-size: 14px; }
        .count-card { width: 90px; height: 90px; border-radius: 20px; background: linear-gradient(135deg, #10b981, #34d399); color: white; display: flex; flex-direction: column; justify-content: center; align-items: center; }
        .count-card h3 { margin: 0; font-size: 28px; }
        .count-card span { font-size: 11px; }
        .search-box { display: flex; align-items: center; gap: 10px; border: 1px solid #e2e8f0; border-radius: 14px; padding: 12px 16px; margin-bottom: 28px; background: #f8fafc; }
        .search-box input { border: none; outline: none; background: transparent; width: 100%; }
        .group-stack { display: flex; flex-direction: column; gap: 36px; }
        .group-title { display: flex; align-items: center; gap: 12px; }
        .group-title h3 { margin: 0; font-size: 16px; font-weight: 700; color: #0f172a; }
        .group-title span { font-size: 12px; color: #94a3b8; }
        .group-header { margin-bottom: 18px; }
        .members-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
        .empty-state { border: 2px dashed #e2e8f0; border-radius: 24px; padding: 60px 24px; text-align: center; color: #64748b; background: #f8fafc; }
        .empty-state h3 { margin: 12px 0 8px; color: #334155; }

        @media (max-width: 900px) {
          .metrics-grid { grid-template-columns: 1fr; }
          .management-header { flex-direction: column; align-items: flex-start; }
          .count-card { width: 100%; height: auto; padding: 16px; flex-direction: row; gap: 8px; }
        }
        @media (max-width: 620px) {
          .dashboard-card { padding: 18px; border-radius: 20px; }
          .members-grid { grid-template-columns: 1fr; }
          .management-title h2 { font-size: 18px; }
        }
      `}</style>
    </div>
  );
};

export default UniversityView;