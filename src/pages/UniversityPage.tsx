import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown, ChevronRight, Users, BookOpen } from "lucide-react";
import { useAuthStore } from "../store/authStore";

interface UniversityTeamMemberDTO {
  userId: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string | null;
  roleName: string;
  scopeName: string;
  scopeType: "UNIVERSITY" | "DEPARTMENT" | "PROGRAM" | "SESSION";
}

/* ---------------- MOCK HIERARCHY TYPES ---------------- */
interface Session {
  id: string;
  name: string;
}

interface Program {
  id: string;
  name: string;
  sessions: Session[];
}

interface Department {
  id: string;
  name: string;
  programs: Program[];
}

const UniversityPage: React.FC = () => {
  const [team, setTeam] = useState<UniversityTeamMemberDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const [expandedDept, setExpandedDept] = useState<string | null>(null);
  const [expandedProgram, setExpandedProgram] = useState<string | null>(null);
  const universityId = useAuthStore.getState().user?.universityId
  /* ---------------- FETCH UNIVERSITY DATA ---------------- */
  useEffect(() => {
    axios
      .get(
        `http://localhost:8080/api/v1/get/university-info/${universityId}`
      )
      .then((res) => {
        setTeam(res.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ---------------- DERIVE HIERARCHY FROM FLAT DATA ---------------- */
  const departments: Department[] = React.useMemo(() => {
    const deptMap = new Map<string, Department>();

    team.forEach((t) => {
      if (t.scopeType === "DEPARTMENT") {
        if (!deptMap.has(t.scopeName)) {
          deptMap.set(t.scopeName, {
            id: t.scopeName,
            name: t.scopeName,
            programs: [],
          });
        }
      }
    });

    team.forEach((t) => {
      if (t.scopeType === "PROGRAM") {
        let dept = Array.from(deptMap.values())[0]; // fallback mapping (you can improve later)

        if (!dept) return;

        const existing = dept.programs.find((p) => p.name === t.scopeName);

        if (!existing) {
          dept.programs.push({
            id: t.scopeName,
            name: t.scopeName,
            sessions: [],
          });
        }
      }
    });

    team.forEach((t) => {
      if (t.scopeType === "SESSION") {
        const dept = Array.from(deptMap.values())[0];
        if (!dept || dept.programs.length === 0) return;

        dept.programs[0].sessions.push({
          id: t.scopeName,
          name: t.scopeName,
        });
      }
    });

    return Array.from(deptMap.values());
  }, [team]);

  /* ---------------- UI ---------------- */
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        Loading University Data...
      </div>
    );
  }

  return (
    <div className="university-page">

      {/* ================= STATS ================= */}
      <section className="stats">
        <div className="stat-card">
          <h3>4,820</h3>
          <p>Total Papers</p>
        </div>

        <div className="stat-card">
          <h3>1,240</h3>
          <p>Notes</p>
        </div>

        <div className="stat-card">
          <h3>860</h3>
          <p>Solutions</p>
        </div>

        <div className="stat-card highlight">
          <h3>{team.length}</h3>
          <p>Active Representatives</p>
        </div>
      </section>

      {/* ================= REPRESENTATIVES ================= */}
      <section className="section">
        <div className="section-title">
          <Users size={18} /> University Representatives
        </div>

        <div className="team-grid">
          {team.map((member) => (
            <div key={member.userId} className="team-card">
              <div className="avatar">
                {member.profileImageUrl ? (
                  <img src={member.profileImageUrl} />
                ) : (
                  `${member.firstName?.[0] ?? "U"}${member.lastName?.[0] ?? ""}`
                )}
              </div>

              <div className="info">
                <h4>
                  {member.firstName} {member.lastName}
                </h4>
                <p className="role">{member.roleName}</p>
                <p className="scope">{member.scopeName}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= HIERARCHY TREE ================= */}
      <section className="section">
        <div className="section-title">
          <BookOpen size={18} /> Academic Structure
        </div>

        <div className="tree">
          {departments.map((dept) => (
            <div key={dept.id} className="node">

              {/* DEPARTMENT */}
              <div
                className="node-header"
                onClick={() =>
                  setExpandedDept(expandedDept === dept.id ? null : dept.id)
                }
              >
                {expandedDept === dept.id ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
                <span>{dept.name}</span>
              </div>

              {/* PROGRAMS */}
              {expandedDept === dept.id && (
                <div className="children">
                  {dept.programs.map((prog) => (
                    <div key={prog.id} className="node">

                      <div
                        className="node-header sub"
                        onClick={() =>
                          setExpandedProgram(
                            expandedProgram === prog.id ? null : prog.id
                          )
                        }
                      >
                        {expandedProgram === prog.id ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                        <span>{prog.name}</span>
                      </div>

                      {/* SESSIONS */}
                      {expandedProgram === prog.id && (
                        <div className="sessions">
                          {prog.sessions.map((s) => (
                            <div key={s.id} className="session">
                              🎓 {s.name}
                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              )}

            </div>
          ))}
        </div>
      </section>

      {/* ================= STYLE ================= */}
      <style>{`
        .university-page {
          padding: 30px;
          background: #f8fafc;
          min-height: 100vh;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
        }

        .stat-card h3 {
          margin: 0;
          font-size: 26px;
        }

        .stat-card p {
          margin: 5px 0 0;
          color: #64748b;
        }

        .highlight {
          border-left: 4px solid #3cd3ad;
        }

        .section {
          margin-top: 30px;
          background: white;
          padding: 20px;
          border-radius: 16px;
        }

        .section-title {
          display: flex;
          gap: 10px;
          font-weight: 700;
          margin-bottom: 15px;
          color: #1e293b;
        }

        /* TEAM */
        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 15px;
        }

        .team-card {
          display: flex;
          gap: 12px;
          padding: 12px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #fff;
        }

        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        .role {
          font-size: 12px;
          color: #3cd3ad;
          font-weight: 600;
        }

        .scope {
          font-size: 11px;
          color: #64748b;
        }

        /* TREE */
        .tree {
          margin-top: 10px;
        }

        .node-header {
          display: flex;
          gap: 8px;
          cursor: pointer;
          padding: 10px;
          border-radius: 8px;
          font-weight: 600;
        }

        .node-header:hover {
          background: #f1f5f9;
        }

        .sub {
          margin-left: 20px;
          font-weight: 500;
        }

        .children {
          margin-left: 20px;
        }

        .sessions {
          margin-left: 40px;
          color: #64748b;
        }

        .session {
          padding: 5px 0;
        }

        .loading {
          height: 60vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #64748b;
        }

        .spinner {
          width: 30px;
          height: 30px;
          border: 3px solid #e2e8f0;
          border-top-color: #3cd3ad;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 10px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

    </div>
  );
};

export default UniversityPage;