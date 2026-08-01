import React from 'react';
import Button from '../components/Button';
import { Users, Globe, Heart } from 'lucide-react';
import heroImage from '../assets/hero.png';

const AboutUsPage: React.FC = () => {
  return (
    <div className="about-wrapper">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-inner">
          <h1>About PrevPaper</h1>
          <p>Our mission is to empower students with easy access to previous year university papers, helping them study smarter and achieve better results.</p>
          <Button onClick={() => window.location.assign('/signup')} style={{ padding: '15px 40px', fontSize: '18px', marginTop: '20px' }}>
            Get Started
          </Button>
        </div>
      </section>

      {/* Our Story */}
      <section className="story">
        <div className="container story-inner">
          <div className="story-text">
            <h2>Our Story</h2>
            <p>
              PrevPaper started as a student initiative to make learning resources accessible to everyone.
              From scanning and organizing old exams to creating a searchable repository, our goal is to save students time and effort.
            </p>
            <p>
              Today, thousands of students across multiple universities rely on PrevPaper for exam preparation.
              We continue to expand our library, ensuring quality and verified content.
            </p>
          </div>
          <div className="story-image">
            <img src={heroImage} alt="Students preparing with PrevPaper" />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values">
        <div className="container">
          <h2>Our Values</h2>
          <div className="values-grid">
            <ValueCard icon={<Users color="#3cd3ad" />} title="Community" desc="We believe in building a supportive student community." />
            <ValueCard icon={<Globe color="#3cd3ad" />} title="Accessibility" desc="Education should be accessible to everyone, everywhere." />
            <ValueCard icon={<Heart color="#3cd3ad" />} title="Integrity" desc="All our papers are verified for authenticity and reliability." />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Join PrevPaper Today</h2>
          <p>Start accessing thousands of verified past papers and improve your exam preparation.</p>
          <Button onClick={() => window.location.assign('/signup')} style={{ padding: '15px 50px', fontSize: '18px' }}>Create Free Account</Button>
        </div>
      </section>

      {/* Styles */}
      <style>{`
        .about-wrapper { font-family: 'Geist Variable', system-ui, sans-serif; color: #1a1a1a; line-height: 1.6; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

        /* Hero */
        .hero { padding: 120px 0 80px; text-align: center; background: #f4f4f4; }
        .hero-inner h1 { font-size: 56px; font-weight: 900; margin-bottom: 20px; }
        .hero-inner p { font-size: 20px; color: #666; max-width: 700px; margin: 0 auto 20px; }

        /* Story */
        .story { padding: 100px 0; display: flex; justify-content: center; background: #fff; }
        .story-inner { display: flex; gap: 60px; flex-wrap: wrap; align-items: center; }
        .story-text { flex: 1; min-width: 300px; }
        .story-text h2 { font-size: 36px; font-weight: 800; margin-bottom: 20px; }
        .story-text p { font-size: 16px; color: #555; margin-bottom: 15px; }
        .story-image { flex: 1; text-align: center; }
        .story-image img { max-width: 100%; height: auto; }

        /* Values */
        .values { padding: 100px 0; background: #fafafa; text-align: center; }
        .values h2 { font-size: 36px; font-weight: 800; margin-bottom: 50px; }
        .values-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; }
        .value-card { background: #fff; padding: 40px; border-radius: 20px; border: 1px solid #eee; transition: 0.3s; }
        .value-card:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.05); }
        .value-card .icon { margin-bottom: 20px; }
        .value-card h3 { font-size: 20px; margin-bottom: 10px; }
        .value-card p { font-size: 14px; color: #666; }

        /* CTA */
        .cta { padding: 100px 0; text-align: center; background: #3cd3ad; color: #fff; }
        .cta h2 { font-size: 42px; margin-bottom: 20px; }
        .cta p { margin-bottom: 40px; opacity: 0.9; font-size: 18px; }

        /* Responsive */
        @media(max-width: 768px) {
          .story-inner { flex-direction: column; gap: 40px; }
          .hero-inner h1 { font-size: 42px; }
          .values-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

const ValueCard = ({ icon, title, desc }: { icon: any; title: string; desc: string }) => (
  <div className="value-card">
    <div className="icon">{icon}</div>
    <h3>{title}</h3>
    <p>{desc}</p>
  </div>
);

export default AboutUsPage;
