import React, { useState } from 'react';
import Button from '../components/Button';
import OtpInput from '../components/OtpInput';

const VerifyOtpPage: React.FC = () => {
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = (code: string) => {
    console.log("Verifying OTP:", code);
    setIsVerifying(true);
    // Add your API call logic here
  };

  return (
    <div className="page-wrapper">
      <div className="main-card">
        <div className="content-side">
          <div className="header">
            <h1>Verify your account</h1>
            <p>We've sent a code to <strong>+1 (555) 000-1234</strong></p>
          </div>

          <OtpInput length={4} onComplete={handleVerify} />

          <div className="actions">
            <Button disabled={isVerifying}>
              {isVerifying ? 'Verifying...' : 'Verify Now'}
            </Button>
            
            <div className="resend-section">
              <span>Didn't receive a code?</span>
              <button className="resend-btn">Resend Code</button>
            </div>
          </div>
        </div>

        {/* Sidebar (Visual Side) */}
        <div className="visual-side">
          <div className="glass-overlay">
            <img src="/sidebar.svg" alt="security" />
            <div className="floating-badge">
              <span className="icon">🔒</span>
              <div>
                <p className="badge-title">Secure Access</p>
                <p className="badge-sub">256-bit Encryption</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .page-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: 'Inter', sans-serif;
        }
        .main-card {
          background: white;
          width: 100%;
          max-width: 1000px;
          display: flex;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .content-side {
          flex: 1.2;
          padding: 60px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .visual-side {
          flex: 1;
          background: #3cd3ad;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 40px;
        }
        h1 { font-size: 32px; color: #1a1a1a; margin-bottom: 12px; }
        p { color: #666; font-size: 15px; }
        .resend-section {
          margin-top: 25px;
          text-align: center;
          font-size: 14px;
        }
        .resend-btn {
          background: none;
          border: none;
          color: #3cd3ad;
          font-weight: 600;
          margin-left: 5px;
          cursor: pointer;
        }
        .glass-overlay {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 20px;
          width: 100%;
          border: 1px solid rgba(255,255,255,0.3);
        }
        .floating-badge {
          position: absolute;
          bottom: 40px;
          right: -20px;
          background: white;
          padding: 12px 20px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        .badge-title { font-weight: bold; margin: 0; color: #333; font-size: 13px; }
        .badge-sub { margin: 0; font-size: 11px; color: #888; }

        /* Responsive Styles */
        @media (max-width: 768px) {
          .main-card {
            flex-direction: column;
            gap: 30px;
          }

          .content-side {
            padding: 40px 20px;
            width: 100%;
          }

          /* Hide the sidebar (visual side) on mobile */
          .visual-side {
            display: none;
          }

          .floating-badge {
            display: none; /* Hide floating badge on mobile */
          }

          .actions {
            text-align: center;
          }

          .resend-btn {
            margin-top: 10px;
            font-size: 14px;
          }

          .header h1 {
            font-size: 24px;
            margin-bottom: 10px;
          }

          .header p {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default VerifyOtpPage;