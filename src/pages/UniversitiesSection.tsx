import React, { useState } from 'react';
import { Search, MoreVertical, Plus } from 'lucide-react';
import Button from '../components/Button';

interface University {
  id: string;
  name: string;
  location: string;
  rep: string;
  status: 'Active' | 'Pending' | 'Inactive';
}

interface UniversitiesSectionProps {
  onAddUniversity: () => void;
  onAssignRep: (id: string, name: string) => void;
}

const UniversitiesSection: React.FC<UniversitiesSectionProps> = ({ 
  onAddUniversity, 
  onAssignRep 
}) => {
  // Sample Data - In production, this would be fetched from your API
  const [universities] = useState<University[]>([
    { id: "uuid-1", name: "Stanford University", location: "California, USA", rep: "Dr. Sarah Connor", status: "Active" },
    { id: "uuid-2", name: "MIT", location: "Massachusetts, USA", rep: "Assign Representative", status: "Pending" },
    { id: "uuid-3", name: "IIT Delhi", location: "New Delhi, India", rep: "Assign Representative", status: "Inactive" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredUnis = universities.filter(uni => 
    uni.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="section-fade-in">
      <header className="admin-header">
        <h1>University Management</h1>
        <Button onClick={onAddUniversity} style={{ width: '220px' }}>
          <Plus size={18} style={{ marginRight: '8px' }} />
          Add New University
        </Button>
      </header>

      {/* STATS OVERVIEW */}
      <div className="admin-stats">
        <div className="stat-card">
          <p>Total Universities</p>
          <h2>{universities.length}</h2>
        </div>
        <div className="stat-card">
          <p>Active Reps</p>
          <h2>128</h2>
        </div>
        <div className="stat-card">
          <p>System Health</p>
          <h2 style={{ color: '#3cd3ad' }}>99.9%</h2>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="table-container">
        <div className="table-header">
          <div className="search-bar">
            <Search size={16} />
            <input 
              placeholder="Filter universities..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

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
            {filteredUnis.map((uni) => (
              <tr key={uni.id}>
                <td><strong>{uni.name}</strong></td>
                <td>{uni.location}</td>
                <td>
                  {uni.rep === "Assign Representative" ? (
                    <button
                      className="assign-btn"
                      onClick={() => onAssignRep(uni.id, uni.name)}
                    >
                      Assign +
                    </button>
                  ) : (
                    <span className="rep-name">{uni.rep}</span>
                  )}
                </td>
                <td>
                  <span className={`status-pill ${uni.status.toLowerCase()}`}>
                    {uni.status}
                  </span>
                </td>
                <td>
                  <button className="action-icon-btn">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .section-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .rep-name { font-weight: 500; color: #334155; }
        .action-icon-btn { background: none; border: none; color: #cbd5e1; cursor: pointer; padding: 4px; border-radius: 4px; }
        .action-icon-btn:hover { background: #f1f5f9; color: #64748b; }
        
        /* Status Pill Colors */
        .status-pill { font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 20px; }
        .status-pill.active { background: #ecfdf5; color: #10b981; }
        .status-pill.pending { background: #fffbeb; color: #f59e0b; }
        .status-pill.inactive { background: #fef2f2; color: #ef4444; }
      `}</style>
    </section>
  );
};

export default UniversitiesSection;