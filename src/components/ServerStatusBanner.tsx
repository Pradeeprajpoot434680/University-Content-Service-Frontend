import React from "react";
import { AlertTriangle, X } from "lucide-react";

const ServerStatusBanner: React.FC = () => {
  const [dismissed, setDismissed] = React.useState(false);

  if (dismissed) return null;

  return (
    <div className="server-status-banner">
      <div className="server-status-banner__content">
        <AlertTriangle size={30} className="server-status-banner__icon" />
        <div className="server-status-banner__text">
          <strong>Server is currently stopped</strong>
          <span>due to unpaid charges. When Servers Will Up then All Features will Available</span>
        </div>
      </div>
      <button
        className="server-status-banner__close"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss notice"
      >
        <X size={16} />
      </button>

      <style>{`
        .server-status-banner {
          background: #fffbeb;
          border-bottom: 1px solid #fde68a;
          color: #92400e;
          font-size: 14px;
          padding: 10px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .server-status-banner__content {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .server-status-banner__icon {
          flex-shrink: 0;
          color: #f59e0b;
        }

        .server-status-banner__text {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .server-status-banner__text strong {
          font-weight: 600;
        }

        .server-status-banner__close {
          background: none;
          border: none;
          color: #92400e;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.7;
          transition: opacity 0.15s ease, background 0.15s ease;
        }

        .server-status-banner__close:hover {
          opacity: 1;
          background: rgba(0,0,0,0.06);
        }

        @media (max-width: 600px) {
          .server-status-banner {
            padding: 10px 16px;
          }
          .server-status-banner__text {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
};

export default ServerStatusBanner;