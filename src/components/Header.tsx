import React from "react";
import { Trophy, Bell } from "lucide-react";
import Logo from "./Logo";

interface HeaderProps {
  points?: number;
}

const Header: React.FC<HeaderProps> = ({ points = 120 }) => {
  return (
    <>
      <header className="app-header">
        <Logo />

        <div className="header-actions">
          <div className="points-pill">
            <Trophy size={14} />
            <span>{points} pts</span>
          </div>

          <button className="notif-btn">
            <Bell size={20} />
          </button>
        </div>
      </header>

      <style>{`
        .app-header {
          min-height: 72px;
          display: flex;
          padding-top: 12px;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #f1f5f9;
          margin-bottom: 20px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .points-pill {
          background: #3cd3ad;
          color: white;
          padding: 6px 14px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 700;
          font-size: 13px;
          box-shadow: 0 4px 10px rgba(60, 211, 173, 0.3);
        }

        .notif-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: white;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        @media (max-width: 820px) {
          .app-header {
            padding: 12px 16px;
          }

          .points-pill,
          .notif-btn {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default Header;