import React, { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { emailOrPhoneSchema, handleValidationErrors, resetPasswordSchema } from '../utils/zodSchemas';
import { AuthBaseURL } from '../utils/URL';
import { useNavigate } from 'react-router-dom';

type ForgetStep = 'EMAIL_INPUT' | 'OTP_VERIFY' | 'RESET_PASSWORD';

// Common weak password array for quick client-side checks
const weakPasswords = ['123456', 'password', 'password123', 'qwerty', '123456789'];

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<ForgetStep>('EMAIL_INPUT');
  const [formData, setFormData] = useState({
    identifier: '', // email or phone
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Live password validation checklist rules
  const passwordChecks = [
    { label: "At least 6 characters", test: (p: string) => p.length >= 6 },
    { label: "Contains uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
    { label: "Contains special character", test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
    { label: "Not a common weak password", test: (p: string) => !weakPasswords.includes(p.toLowerCase()) },
  ];

  const isPasswordValid = passwordChecks.every(check => check.test(formData.newPassword));

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 'EMAIL_INPUT') {
      if (!formData.identifier.trim()) return toast.error('Enter your email or phone');
      const result = emailOrPhoneSchema.safeParse({ identifier: formData.identifier });
      if (handleValidationErrors(result)) return;
      
      setIsLoading(true);
      try {
        const res = await axios.post(`${AuthBaseURL}/forgot-password`, {
          recipient: formData.identifier
        });
        toast.success(res.data.message || 'OTP sent to your email/phone');
        setStep('OTP_VERIFY');
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to send OTP');
      } finally {
        setIsLoading(false);
      }

    } else if (step === 'OTP_VERIFY') {
      if (!formData.otp.trim()) return toast.error('Enter the OTP');
      const otp = formData.otp.trim();
      const otpRegex = /^[0-9]{6}$/;

      if (!otpRegex.test(otp)) {
        toast.error("OTP must be exactly 6 digits");
        return;
      }
      setIsLoading(true);
      try {
        const res = await axios.post(`${AuthBaseURL}/verify-otp`, {
          recipient: formData.identifier,
          otp: formData.otp,
          type: 'PASSWORD_RESET'
        });
        toast.success(res.data.message || 'OTP verified successfully');
        setStep('RESET_PASSWORD');
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'OTP verification failed');
      } finally {
        setIsLoading(false);
      }

    } else if (step === 'RESET_PASSWORD') {
      if (!formData.newPassword || !formData.confirmPassword)
        return toast.error('Enter all fields');

      if (!isPasswordValid) {
        return toast.error('Please fulfill all security requirements');
      }

      if (formData.newPassword !== formData.confirmPassword)
        return toast.error('Passwords do not match');

      const result = resetPasswordSchema.safeParse({ 
        newPassword: formData.newPassword, 
        confirmPassword: formData.confirmPassword 
      });
      if (handleValidationErrors(result)) return;

      setIsLoading(true);
      try {
        const res = await axios.post(`${AuthBaseURL}/reset-password`, {
          recipient: formData.identifier,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword
        });
        toast.success(res.data.message || 'Password reset successful');
        setStep('EMAIL_INPUT');
        setFormData({ identifier: '', otp: '', newPassword: '', confirmPassword: '' });
        navigate("/signin");
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to reset password');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="fpp-page-container">
      <div className="fpp-card">
        <div className="fpp-form-section">
          <h2 className="fpp-title">Reset Password</h2>
          <p className="fpp-subtitle">
            {step === 'EMAIL_INPUT' && 'Enter your registered email or phone number.'}
            {step === 'OTP_VERIFY' && `We've sent a 6-digit OTP to ${formData.identifier}.`}
            {step === 'RESET_PASSWORD' && 'Enter your new password below.'}
          </p>

          <form onSubmit={handleNextStep} className="fpp-form">
            {step === 'EMAIL_INPUT' && (
              <div className="fpp-input-group">
                <Input
                  type="text"
                  label="Email or Phone"
                  required
                  value={formData.identifier}
                  onChange={e => setFormData(prev => ({ ...prev, identifier: e.target.value }))}
                />
              </div>
            )}

            {step === 'OTP_VERIFY' && (
              <div className="fpp-input-group">
                <Input
                  type="text"
                  label="Enter OTP"
                  maxLength={6}
                  required
                  value={formData.otp}
                  onChange={e => setFormData(prev => ({ ...prev, otp: e.target.value }))}
                />
              </div>
            )}

            {step === 'RESET_PASSWORD' && (
              <>
                <div className="fpp-input-wrapper">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    label="New Password"
                    required
                    value={formData.newPassword}
                    onChange={e => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                  />
                  <button
                    type="button"
                    className="fpp-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Live Requirements Checklist */}
                {formData.newPassword.length > 0 && (
                  <div className="fpp-checklist">
                    {passwordChecks.map((check, index) => {
                      const passed = check.test(formData.newPassword);
                      return (
                        <div key={index} className={`fpp-checklist-item ${passed ? 'passed' : 'failed'}`}>
                          {passed ? <Check size={14} className="fpp-check-icon" /> : <X size={14} className="fpp-x-icon" />}
                          <span>{check.label}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="fpp-input-wrapper">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    label="Confirm Password"
                    required
                    value={formData.confirmPassword}
                    onChange={e => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  />
                </div>
              </>
            )}

            <Button type="submit" disabled={isLoading || (step === 'RESET_PASSWORD' && !isPasswordValid)}>
              {isLoading ? (
                <span className="fpp-spinner-text">Processing...</span>
              ) : (
                <>
                  {step === 'EMAIL_INPUT' && 'Send OTP'}
                  {step === 'OTP_VERIFY' && 'Verify OTP'}
                  {step === 'RESET_PASSWORD' && 'Reset Password'}
                </>
              )}
            </Button>
          </form>

          <div className="fpp-back-login">
            <p>
              Remember your password? <a href="/signin">Log in here</a>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .fpp-page-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f8fafc;
          font-family: 'Inter', system-ui, sans-serif;
          padding: 20px;
          box-sizing: border-box;
        }

        .fpp-card {
          background: #ffffff;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
          border: 1px solid rgba(15, 23, 42, 0.05);
          max-width: 420px;
          width: 100%;
          box-sizing: border-box;
          transition: transform 0.2s ease;
        }

        .fpp-form-section {
          width: 100%;
        }

        .fpp-title {
          font-size: 26px;
          font-weight: 800;
          margin: 0 0 8px 0;
          color: #0f172a;
          letter-spacing: -0.5px;
        }

        .fpp-subtitle {
          font-size: 14px;
          color: #64748b;
          margin: 0 0 28px 0;
          line-height: 1.5;
        }

        .fpp-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .fpp-input-group {
          width: 100%;
        }

        /* Improved Input Wrapper for Password Icons */
        .fpp-input-wrapper {
          position: relative;
          width: 100%;
        }

        .fpp-password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 4px;
          transition: color 0.2s, background 0.2s;
        }

        .fpp-password-toggle:hover {
          color: #475569;
          background: rgba(15, 23, 42, 0.05);
        }

        /* Requirements Realtime Checklist Styles */
        .fpp-checklist {
          background: #f8fafc;
          border-radius: 8px;
          padding: 12px 14px;
          border: 1px solid rgba(15, 23, 42, 0.05);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .fpp-checklist-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .fpp-checklist-item.failed {
          color: #94a3b8;
        }

        .fpp-checklist-item.passed {
          color: #0f766e;
        }

        .fpp-check-icon {
          color: #14b8a6;
          flex-shrink: 0;
        }

        .fpp-x-icon {
          color: #cbd5e1;
          flex-shrink: 0;
        }

        .fpp-back-login {
          margin-top: 24px;
          text-align: center;
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
        }

        .fpp-back-login a {
          color: #14b8a6;
          text-decoration: none;
          font-weight: 700;
          transition: color 0.2s ease;
        }

        .fpp-back-login a:hover {
          color: #0f766e;
        }

        .fpp-spinner-text {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        /* Responsive Breakpoints */
        @media (max-width: 480px) {
          .fpp-card {
            padding: 28px 20px;
            border-radius: 16px;
            box-shadow: none;
            border: none;
            background: transparent;
          }
          .fpp-page-container {
            background: #ffffff;
            align-items: flex-start;
            padding-top: 40px;
          }
          .fpp-title {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default ForgotPasswordPage;