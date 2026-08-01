



import React, { type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => {
  return (
      <div className="input-group">
      <input 
        
        className="custom-input" 
        placeholder={label} // Using placeholder to match the image style
        {...props} 
      />
      <style >{`
        .input-group {
          margin-bottom: 20px;
          width: 100%;
        }
        .custom-input {
          width: 100%;
          border: none;
          border-bottom: 1px solid #ccc;
          padding: 10px 0;
          font-size: 14px;
          outline: none;
          transition: border-color 0.3s;
        }
        .custom-input:focus {
          border-bottom: 2px solid #3cd3ad;
        }
      `}</style>
    </div>
  );
};

export default Input;