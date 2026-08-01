import React from 'react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

const NavItem = ({ icon, label, active = false, onClick, className = "" }: NavItemProps) => (
  <div 
    className={`nav-item ${active ? 'active' : ''} ${className}`} 
    onClick={onClick}
  >
    {icon}
    <span>{label}</span>
<style>{`
     .nav-item { 
       display: flex; 
       align-items: center; 
       gap: 12px; 
       min-width: 0;
       padding: 12px 14px; 
       border-radius: 12px; 
       cursor: pointer; 
       color: #666; 
       transition: 0.2s; 
       margin-bottom: 5px; 
       user-select: none;
     }
     .nav-item span {
       min-width: 0;
       overflow: hidden;
       text-overflow: ellipsis;
       white-space: nowrap;
     }
     .nav-item svg {
       flex: 0 0 auto;
     }
     .nav-item:hover { 
       background: #f0faf7; 
       color: #3cd3ad; 
     }
     .active { 
       background: #3cd3ad; 
       color: white !important; 
       font-weight: 600; 
       box-shadow: 0 4px 15px rgba(60, 211, 173, 0.3); 
     }
     @media (max-width: 820px) {
       .nav-item {
         justify-content: center;
         gap: 8px;
         margin-bottom: 0;
         padding: 10px 8px;
         border-radius: 10px;
         font-size: 13px;
       }
     }
     @media (max-width: 420px) {
       .nav-item {
         flex-direction: column;
         gap: 4px;
         padding: 8px 4px;
         font-size: 11px;
       }
     }
   `}</style>
  </div>
);

export default NavItem;
