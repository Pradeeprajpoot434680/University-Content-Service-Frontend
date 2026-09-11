import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
import { BookOpen, ShieldCheck, Zap, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  // For animated stats
  const [studentsCount, setStudentsCount] = useState(0);
  const [universitiesCount, setUniversitiesCount] = useState(0);
  const [papersCount, setPapersCount] = useState(0);

  useEffect(() => {
    let s = 0, u = 0, p = 0;
    const interval = setInterval(() => {
      if (s < 10000) s += 250;
      if (u < 50) u += 1;
      if (p < 500) p += 10;
      setStudentsCount(Math.min(s, 10000));
      setUniversitiesCount(Math.min(u, 50));
      setPapersCount(Math.min(p, 500));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="lp-wrapper">
      {/* HERO SECTION */}
      <header className="lp-hero">
        <div className="lp-container lp-hero-inner">
          <div className="lp-badge-wrapper">
            <span className="lp-hero-badge">New: 2024 Semester Papers Added</span>
          </div>
          <h1 className="lp-hero-title">Stop Guessing. <br /><span>Start Scoring.</span></h1>
          <p className="lp-hero-subtitle">Access the largest repository of university previous year papers, sorted by department, year, and difficulty.</p>
          
          <div className="lp-hero-actions">
            <Button onClick={() => { navigate('/signin')}} style={{ padding: '14px 36px', fontSize: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease', borderRadius: '8px' }}>
              Explore Library <ArrowRight size={18} style={{ marginLeft: '8px' }} />
            </Button>
          </div>

          <div className="lp-hero-stats">
            <div className="lp-stat"><strong className="lp-gradient-text">{studentsCount.toLocaleString()}+</strong> <span>Students</span></div>
            <div className="lp-stat"><strong className="lp-gradient-text">{universitiesCount}+</strong> <span>Universities</span></div>
            <div className="lp-stat"><strong className="lp-gradient-text">{papersCount}+</strong> <span>Papers</span></div>
          </div>
        </div>
        <div className="lp-hero-bg-glow" />
      </header>

      {/* FEATURES SECTION */}
      <section id="features" className="lp-features">
        <div className="lp-container">
          <div className="lp-section-header">
            <h2>Why Students Love PrevPaper</h2>
            <p>Everything you need to ace your finals in one place.</p>
          </div>

          <div className="lp-feature-grid">
            <FeatureCard 
              icon={<BookOpen color="#3cd3ad" size={24} />} 
              title="Organized Content" 
              desc="Easily find papers by Department, Batch Year, or Subject Code." 
            />
            <FeatureCard 
              icon={<ShieldCheck color="#3cd3ad" size={24} />} 
              title="Verified Papers" 
              desc="Every document is checked for authenticity by our student community." 
            />
            <FeatureCard 
              icon={<Zap color="#3cd3ad" size={24} />} 
              title="Instant Access" 
              desc="No waiting. Download or view papers instantly with a single click." 
            />
            <FeatureCard 
              icon={<Users color="#3cd3ad" size={24} />} 
              title="Rewards System" 
              desc="Earn points for uploading missing papers and help your peers." 
            />
          </div>
        </div>
      </section>

      {/* CTA FOOTER */}
      <section className="lp-final-cta">
        <div className="lp-container">
          <div className="lp-cta-box">
            <h2>Ready to Ace Your Exams?</h2>
            <p>Join thousands of students who are already studying smarter.</p>
            <div className="lp-cta-button-wrap">
              <Button onClick={() => navigate('/signup')} style={{ background: '#ffffff', color: '#0f172a', width: '100%', maxWidth: '260px', padding: '14px 0', fontSize: '16px', fontWeight: '700', borderRadius: '8px' }}>
                Create Free Account
              </Button>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .lp-wrapper { 
          font-family: 'Geist Variable', system-ui, sans-serif;
          color: #0f172a;
          background: #ffffff;
          overflow-x: hidden;
        }

        /* Container setup */
        .lp-container { 
          width: 100%;
          max-width: 1240px; 
          margin: 0 auto; 
          padding: 0 24px; 
        }

        /* Hero Layout */
        .lp-hero { 
          padding: 140px 0 100px; 
          text-align: center; 
          position: relative; 
          overflow: hidden; 
        }
        .lp-hero-inner { position: relative; z-index: 2; }
        .lp-badge-wrapper { margin-bottom: 24px; }
        .lp-hero-badge { 
          background: rgba(60, 211, 173, 0.12); 
          color: #0f766e; 
          padding: 8px 18px; 
          border-radius: 9999px; 
          font-size: 13px; 
          font-weight: 700;
          letter-spacing: -0.1px;
        }
        .lp-hero-title { 
          font-size: 64px; 
          font-weight: 900; 
          line-height: 1.1; 
          margin: 0 0 24px; 
          letter-spacing: -2px; 
          color: #0f172a;
        }
        .lp-hero-title span { color: #14b8a6; }
        .lp-hero-subtitle { 
          font-size: 19px; 
          color: #475569; 
          max-width: 640px; 
          margin: 0 auto 40px; 
          line-height: 1.6; 
        }
        .lp-hero-actions { 
          display: flex; 
          justify-content: center; 
          align-items: center;
        }
        
        /* Stats Component Grid Layout */
        .lp-hero-stats { 
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          max-width: 600px;
          margin: 80px auto 0; 
          gap: 24px;
        }
        .lp-stat { display: flex; flex-direction: column; gap: 4px; }
        .lp-gradient-text { 
          font-size: 36px; 
          font-weight: 800;
          background: linear-gradient(135deg, #14b8a6, #0f766e); 
          -webkit-background-clip: text; 
          -webkit-text-fill-color: transparent; 
        }
        .lp-stat span { color: #64748b; font-size: 14px; font-weight: 600; }

        .lp-hero-bg-glow { 
          position: absolute; 
          top: -20%; 
          left: 50%; 
          transform: translateX(-50%); 
          width: 1000px; 
          height: 600px; 
          background: radial-gradient(circle, rgba(60,211,173,0.14) 0%, rgba(255,255,255,0) 70%); 
          z-index: 1; 
          pointer-events: none;
        }

        /* Features Section Layout */
        .lp-features { padding: 100px 0; background: #f8fafc; }
        .lp-section-header { text-align: center; margin-bottom: 60px; padding: 0 16px; }
        .lp-section-header h2 { font-size: 36px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; margin-bottom: 12px; }
        .lp-section-header p { font-size: 16px; color: #475569; }
        
        .lp-feature-grid { 
          display: grid; 
          grid-template-columns: repeat(2, 1fr); 
          gap: 24px; 
        }

        /* Feature Cards */
        .lp-f-card { 
          background: #ffffff; 
          padding: 40px; 
          border-radius: 16px; 
          border: 1px solid rgba(15, 23, 42, 0.05); 
          transition: transform 0.2s ease, box-shadow 0.2s ease; 
        }
        .lp-f-card:hover { 
          transform: translateY(-4px); 
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06); 
        }
        .lp-f-icon { 
          background: rgba(60, 211, 173, 0.12); 
          display: inline-flex; 
          align-items: center; 
          justify-content: center; 
          width: 52px; 
          height: 52px; 
          border-radius: 12px; 
          margin-bottom: 24px; 
        }
        .lp-f-card h3 { margin: 0 0 12px; font-size: 20px; font-weight: 700; color: #0f172a; }
        .lp-f-card p { margin: 0; color: #475569; line-height: 1.6; font-size: 15px; }

        /* CTA Section Styling */
        .lp-final-cta { padding: 80px 0; }
        .lp-cta-box { 
          background: linear-gradient(135deg, #0f766e, #14b8a6); 
          padding: 64px 32px; 
          border-radius: 24px; 
          text-align: center; 
          color: #ffffff; 
          box-shadow: 0 20px 40px rgba(20, 184, 166, 0.15);
        }
        .lp-cta-box h2 { font-size: 38px; font-weight: 800; margin: 0 0 16px; letter-spacing: -0.5px; }
        .lp-cta-box p { font-size: 16px; margin: 0 0 32px; opacity: 0.9; font-weight: 500; }
        .lp-cta-button-wrap { display: flex; justify-content: center; }

        /* PRODUCTION RESPONSIVE MEDIA QUERIES */
        @media (max-width: 1024px) {
          .lp-hero-title { font-size: 52px; }
          .lp-f-card { padding: 32px; }
        }

        @media (max-width: 768px) {
          .lp-hero { padding: 100px 0 60px; }
          .lp-hero-title { font-size: 40px; letter-spacing: -1px; }
          .lp-hero-subtitle { font-size: 16px; margin-bottom: 32px; }
          
          .lp-hero-stats { 
            grid-template-columns: 1fr; 
            gap: 20px; 
            margin-top: 50px;
            max-width: 240px;
          }
          .lp-gradient-text { font-size: 32px; }
          
          .lp-feature-grid { grid-template-columns: 1fr; gap: 16px; }
          .lp-features { padding: 60px 0; }
          
          .lp-cta-box { padding: 48px 20px; border-radius: 16px; }
          .lp-cta-box h2 { font-size: 28px; }
          .lp-final-cta { padding: 40px 0; }
        }

        @media (max-width: 480px) {
          .lp-container { padding: 0 16px; }
          .lp-hero-title { max-width: 100%; margin-inline: auto; font-size: 30px; overflow-wrap: anywhere; }
          .lp-hero-badge { font-size: 11px; padding: 6px 12px; }
          .lp-section-header h2 { font-size: 28px; }
          .lp-f-card { padding: 24px; }
        }
      `}</style>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, desc }) => (
  <div className="lp-f-card">
    <div className="lp-f-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{desc}</p>
  </div>
);

export default LandingPage;
