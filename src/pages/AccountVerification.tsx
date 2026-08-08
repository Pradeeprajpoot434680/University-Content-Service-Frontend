import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Mail, ShieldCheck, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import Input from '../components/Input';
import Button from '../components/Button';
import { api } from '../store/authStore';

const AccountVerification: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Pre-fill email if it comes from the Login page error redirect
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'REQUEST' | 'VERIFY'>(email ? 'VERIFY' : 'REQUEST');
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Request OTP for an existing unverified account
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post('/api/v1/auth/resend-otp', {
        recipient: email,
        type: "EMAIL_VERIFY"
      });

      if (res.data.success) {
        toast.success("Verification code sent!");
        setStep('VERIFY');
      } else {
        toast.error(res.data.message);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Account not found or already verified");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP and activate account
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post('/api/v1/auth/verify-otp', {
        recipient: email,
        otp: otp,
        type: "EMAIL_VERIFY"
      });

      if (res.data.success) {
        toast.success("Account activated! You can now log in.");
        navigate('/signin'); 
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid or expired code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="verify-card">
        <div className="form-section">
          <button className="back-btn" onClick={() => navigate('/signin')}>
            <ChevronLeft size={18} /> Back to Sign In
          </button>

          {step === 'REQUEST' ? (
            <form onSubmit={handleRequestOtp} className="fade-in">
              <div className="icon-header">
                <div className="icon-circle">
                  <Mail size={28} color="#3cd3ad" />
                </div>
              </div>
              <h2>Verify Account</h2>
              <p className="subtitle">
                Enter your registered email address to receive a new verification code.
              </p>
              
              <Input 
                type="email" 
                label="Email Address" 
                placeholder="university-email@edu.in"
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
              
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Checking..." : "Send Code"} <ArrowRight size={18} style={{marginLeft: '8px'}} />
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="fade-in">
              <div className="icon-header">
                <div className="icon-circle">
                  <ShieldCheck size={28} color="#3cd3ad" />
                </div>
              </div>
              <h2>Enter Code</h2>
              <p className="subtitle">
                We've sent a 6-digit verification code to <br />
                <strong>{email}</strong>
              </p>
              
              <Input 
                type="text" 
                label="Verification Code" 
                maxLength={6} 
                placeholder="· · · · · ·"
                style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '20px' }}
                value={otp} 
                onChange={e => setOtp(e.target.value)} 
                required 
              />
              
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify & Activate"}
              </Button>

              <div className="helper-links">
                <p>Didn't get the code? <span onClick={() => setStep('REQUEST')}>Resend Email</span></p>
              </div>
            </form>
          )}
        </div>

        <div className="image-section">
          <div className="illustration-wrapper">
             <img src="/sidebar.svg" alt="Verification Illustration" />
          </div>
        </div>
      </div>

      <style>{`
        .container { 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          min-height: 100vh; 
          background: #ffffff; 
          font-family: 'Inter', sans-serif; 
        }
        .verify-card { 
          display: flex; 
          max-width: 1000px; 
          width: 90%; 
          padding: 40px; 
          gap: 80px; 
          border-radius: 24px; 
          box-shadow: 0 10px 40px rgba(0,0,0,0.04); 
        }
        .form-section { 
          flex: 1; 
          min-width: 350px; 
          display: flex; 
          flex-direction: column; 
          justify-content: center; 
        }
        .image-section { 
          flex: 1.2; 
          background: #f8fafc; 
          border-radius: 32px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          padding: 40px; 
        }
        .illustration-wrapper img { 
          width: 100%; 
          max-width: 380px; 
          height: auto; 
        }
        .icon-header { margin-bottom: 24px; }
        .icon-circle { 
          width: 56px; 
          height: 56px; 
          background: rgba(60, 211, 173, 0.1); 
          border-radius: 14px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
        }
        .back-btn { 
          background: none; 
          border: none; 
          color: #64748b; 
          display: flex; 
          align-items: center; 
          gap: 6px; 
          cursor: pointer; 
          font-weight: 600; 
          font-size: 14px; 
          margin-bottom: 40px; 
          padding: 0; 
          transition: color 0.2s;
        }
        .back-btn:hover { color: #1e293b; }
        h2 { font-size: 32px; font-weight: 700; color: #1e293b; margin: 0 0 12px; }
        .subtitle { color: #64748b; margin-bottom: 32px; font-size: 15px; line-height: 1.6; }
        .helper-links { margin-top: 24px; text-align: center; font-size: 14px; color: #64748b; }
        .helper-links span { 
          color: #3cd3ad; 
          font-weight: 600; 
          cursor: pointer; 
          text-decoration: underline; 
          text-underline-offset: 4px;
        }
        .fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { 
          from { opacity: 0; transform: translateY(10px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
      `}</style>
    </div>
  );
};

export default AccountVerification;