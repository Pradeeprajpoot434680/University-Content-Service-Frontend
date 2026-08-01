
function Logo() {
  return (
      <div className="logo-section">
            <div className="logo-icon">P</div>
            <span className="logo-text">PrevPaper</span>
            <style>
                {`
                   .logo-section {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 0 8px;
                    
                }
                        
                    .logo-icon {
                        width: 32px;
                        height: 32px;
                        background: #3cd3ad;
                        color: white;
                        border-radius: 8px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: 800;
                    }
                    .logo-text {
                        font-size: 19px;
                        font-weight: 800;
                        letter-spacing: -0.5px;
                    }
                `}
            </style>
        </div>
  )
}

export default Logo