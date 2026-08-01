import React, { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'social';
  bgColor?: string;
  width?: string | number;
  height?: string | number;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  bgColor,
  width,
  height,
  style,
  ...props
}) => {
  return (
    <button
      className={`btn ${variant}`}
      style={{
        backgroundColor: bgColor,
        width,
        height,
        ...style,
      }}
      {...props}
    >
      {children}

      <style>{`
        .btn {
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.2s;
        }

        .btn:hover {
          opacity: 0.9;
        }

        .primary {
          width: 100%;
          padding: 12px;
          background-color: #3cd3ad;
          color: white;
          border-radius: 4px;
          font-weight: bold;
          font-size: 16px;
        }

        .social {
          border-radius: 50%;
          color: white;
          font-size: 18px;
          margin-right: 10px;
        }
      `}</style>
    </button>
  );
};

export default Button;