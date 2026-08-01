import React, { useRef, useState } from 'react';

interface OtpProps {
  length: number;
  onComplete: (code: string) => void;
}

const OtpInput: React.FC<OtpProps> = ({ length, onComplete }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    // Ensure only numeric input is allowed
    const value = element.value;
    if (!/^\d*$/.test(value)) return; // only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to next input field if current one is filled
    if (value !== "" && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }

    // If OTP is complete, trigger onComplete with the joined OTP
    if (newOtp.every((v) => v !== "")) {
      onComplete(newOtp.join(""));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    // Focus previous input if Backspace is pressed
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="otp-container">
      {otp.map((data, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          ref={(el:any) => (inputs.current[index] = el)}
          value={data}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="otp-box"
        />
      ))}
      <style>{`
        .otp-container {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin: 30px 0;
        }
        .otp-box {
          width: 50px;
          height: 60px;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          text-align: center;
          font-size: 24px;
          font-weight: bold;
          color: #333;
          transition: all 0.2s ease;
          outline: none;
        }
        .otp-box:focus {
          border-color: #3cd3ad;
          box-shadow: 0 0 8px rgba(60, 211, 173, 0.3);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

export default OtpInput;