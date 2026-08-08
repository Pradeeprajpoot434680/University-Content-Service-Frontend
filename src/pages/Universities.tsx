

import React, { useEffect, useState } from 'react';
import { Plus, Search, Eye } from 'lucide-react';
import AddUniversityModal from '../components/AddUniversityModal';
import AssignRepModal from '../components/AssignRepModal';
import Button from '../components/Button';
import { toast } from 'sonner';
import { api } from '../store/authStore';
import { API_BASE_URL } from '../config';

type University = {
  id: string;
  name: string;
  location: string;
  rep: string | null;
  status: string;
};

type UniversityRowProps = {
  id: string;
  name: string;
  location: string;
  rep: string;
  status: string;
  onAssignClick: (id: string, name: string) => void;
  onManageClick: (id: string, name: string) => void; // 🟢 NEW PROPS
};

const UniversityRow: React.FC<UniversityRowProps> = ({
  id,
  name,
  location,
  rep,
  status,
  onAssignClick,
  onManageClick,
}) => (
  <tr>
    <td><strong>{name}</strong></td>
    <td>{location}</td>
    <td>
      {rep === "Assign Representative" ? (
        <button
          className="assign-btn"
          onClick={(e) => { e.stopPropagation(); onAssignClick(id, name); }}
        >
          Assign +
        </button>
      ) : (
        <span>{rep}</span>
      )}
    </td>
    <td>
      <span className={`status-pill ${status.toLowerCase()}`}>
        {status}
      </span>
    </td>
    <td>
      {/* 🟢 NEW ACTION TRIGGER: Allows drill-down straight into the institution tree hierarchy layout */}
      <button 
        className="manage-layout-btn"
        onClick={() => onManageClick(id, name)}
      >
        <Eye size={14} /> Manage Layout
      </button>
    </td>
  </tr>
);

// 🟢 PROP INTERFACE EXPECTATION ADDED TO WIRE BACK TO THE PARENT CONTROLLER
interface UniversitiesProps {
  onSelectUniversity?: (id: string, name: string) => void;
}

const Universities: React.FC<UniversitiesProps> = ({ onSelectUniversity }) => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [stats, setStats] = useState({ total: 0, reps: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [showUniModal, setShowUniModal] = useState(false);
  const [assigningTo, setAssigningTo] = useState<{ id: string; name: string; } | null>(null);

  const loadData = async () => {
    try {
      const [uniRes, statsRes] = await Promise.all([
        api.get('/api/v1/global-admin/get-universities'),
        api.get('/api/v1/global-admin/stats'),
      ]);

      setUniversities(
        uniRes.data.data.map((u: any) => ({
          id: u.id,
          name: u.name,
          location: u.location,
          rep: u.representativeName,
          status: u.status,
        }))
      );

      setStats({
        total: statsRes.data.data.totalUniversities,
        reps: statsRes.data.data.totalRepresentatives,
      });
    } catch (err) {
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredUniversities = universities.filter((uni) =>
    (uni.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (uni.location || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="universities-container">
      <div className="universities-header">
        <h1>University Management</h1>
        <Button onClick={() => setShowUniModal(true)} style={{ width: '220px' }}>
          <Plus size={18} style={{ marginRight: '8px' }} />
          Add New University
        </Button>
      </div>

      <section className="universities-stats">
        <div className="stat-card">
          <p>Total Universities</p>
          <h2>{stats.total}</h2>
        </div>
        <div className="stat-card">
          <p>Active Reps</p>
          <h2>{stats.reps}</h2>
        </div>
        <div className="stat-card">
          <p>Storage Used</p>
          <h2>--</h2>
        </div>
      </section>

      <div className="table-container">
        <div className="table-header">
          <div className="search-bar">
            <Search size={16} />
            <input
              placeholder="Filter universities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="loading">Loading...</div>
        ) : (
          <table className="uni-table">
            <thead>
              <tr>
                <th>University</th>
                <th>Location</th>
                <th>Representative</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUniversities.length > 0 ? (
                filteredUniversities.map((uni) => (
                  <UniversityRow
                    key={uni.id}
                    id={uni.id}
                    name={uni.name}
                    location={uni.location}
                    rep={uni.rep || "Assign Representative"}
                    status={uni.status}
                    onAssignClick={(id, name) => setAssigningTo({ id, name })}
                    onManageClick={(id, name) => onSelectUniversity?.(id, name)} // 🟢 LINKED
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="no-data">No universities found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showUniModal && <AddUniversityModal onClose={() => setShowUniModal(false)} />}

      {assigningTo && (
        <AssignRepModal
          scopeId={assigningTo.id}
          scopeName={assigningTo.name}
          onClose={() => { setAssigningTo(null); loadData(); }}
          fetchUrl={`${API_BASE_URL}/api/v1/auth/internal/${assigningTo.id}/students`}
          assignUrl={`${API_BASE_URL}/api/v1/global-admin/assign-rep`}
          userIdKey="authUserId" 
        />
      )}

      <style>{`
        .universities-container { width: 100%; }
        .universities-header { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .universities-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; }
        .table-container { background: white; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; }
        .table-header { padding: 20px; }
        .search-bar { display: flex; align-items: center; gap: 10px; background: #f8fafc; padding: 10px; border-radius: 8px; width: 300px; border: 1px solid #e2e8f0; }
        .search-bar input { border: none; outline: none; background: transparent; width: 100%; }
        .uni-table { width: 100%; border-collapse: collapse; }
        th { background: #f8fafc; padding: 15px; font-size: 13px; color: #64748b; text-align: left; font-weight: 600; border-bottom: 1px solid #e2e8f0; }
        td { padding: 15px; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #334155; }
        .assign-btn { background: #e6f9f4; color: #3cd3ad; border: none; padding: 5px 12px; border-radius: 6px; cursor: pointer; font-weight: 600; }
        
        /* New manage layout action button rule styles */
        .manage-layout-btn { display: inline-flex; align-items: center; gap: 6px; background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.2s; }
        .manage-layout-btn:hover { background: #1e293b; color: white; border-color: #1e293b; }

        .status-pill { font-weight: 500; font-size: 13px; }
        .status-pill.active { color: #16a34a; }
        .status-pill.pending { color: #d97706; }
        .loading, .no-data { padding: 20px; text-align: center; color: #64748b; }
      `}</style>
    </div>
  );
};

export default Universities;