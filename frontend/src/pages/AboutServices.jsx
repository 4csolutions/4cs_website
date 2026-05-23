import React from 'react';
import { Target, Compass, Award, CheckCircle, BarChart3, Settings2, Users } from 'lucide-react';

export default function AboutServices() {
  const services = [
    {
      title: 'Software Evaluation & Consultation',
      icon: <BarChart3 size={32} style={{ color: 'var(--primary)' }} />,
      desc: 'We assist clients by analyzing exact business workflows, identifying process gaps, evaluating system options, and providing expert technical guidance to select correct digital solutions that align with long-term profitability goals.'
    },
    {
      title: 'Software Implementation',
      icon: <Settings2 size={32} style={{ color: 'var(--primary)' }} />,
      desc: 'We assist clients in implementing customized software solutions by detailing their documentation needs, configuring modules, importing legacy databases securely, testing user profiles, and ensuring a zero-downtime transition.'
    },
    {
      title: 'Software Training & Support',
      icon: <Users size={32} style={{ color: 'var(--primary)' }} />,
      desc: 'We empower operations teams, managers, and admins through comprehensive, hands-on system training. Our customized training ensures high adoption rates, confident data inputs, and prompt resolution of support queries via SLAs.'
    }
  ];

  return (
    <div className="aboutservices-container">
      
      {/* 1. HERO HEADER */}
      <section className="section page-header" style={{ padding: '128px 0 64px 0', background: 'linear-gradient(180deg, var(--bg-card) 0%, var(--bg-app) 100%)', borderBottom: '1px solid var(--border)' }}>
        <div className="container text-center">
          <span style={{ fontSize: '13px', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', padding: '6px 16px', borderRadius: '24px', fontWeight: 600, display: 'inline-block', marginBottom: '16px' }}>
            Empowering Enterprises Globally
          </span>
          <h1 style={{ fontSize: '48px', color: 'var(--text-main)', marginBottom: '16px' }}>
            About 4C Solutions
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto', fontSize: '16px', lineHeight: 1.6 }}>
            We take immense pride in empowering businesses of all sizes by delivering innovative ERPNext and digital solutions. Our core focus is to simplify complex operations, improve productivity, and guarantee customer success.
          </p>
        </div>
      </section>

      {/* 2. SERVICES SECTION */}
      <section className="section services-list-section">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '64px' }}>
            <h2 style={{ fontSize: '36px', marginBottom: '16px' }}>Our Services</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '580px', margin: '0 auto' }}>
              Explore the wide range of services we offer to help your business achieve digital excellence and operational stability.
            </p>
          </div>

          <div className="grid grid-3">
            {services.map((ser, index) => (
              <div key={index} className="card-item flex flex-column text-left justify-between" style={{ minHeight: '340px' }}>
                <div>
                  <div style={{ marginBottom: '20px' }}>{ser.icon}</div>
                  <h3 style={{ fontSize: '20px', color: 'var(--text-main)', marginBottom: '16px' }}>{ser.title}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>{ser.desc}</p>
                </div>
                <div className="flex align-center gap-1 mt-4" style={{ color: 'var(--primary)', fontSize: '13px', fontWeight: 600 }}>
                  <CheckCircle size={16} /> Fully Managed SLA Included
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. MISSION & VISION SECTION */}
      <section className="section mission-vision-section" style={{ backgroundColor: 'var(--bg-app)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'stretch' }}>
            
            {/* Mission Card */}
            <div className="card-item flex flex-column gap-3 text-left" style={{ borderLeft: '4px solid var(--primary)' }}>
              <div style={{ backgroundColor: 'var(--primary-glow)', padding: '16px', borderRadius: '50%', width: 'fit-content' }}>
                <Target size={28} style={{ color: 'var(--primary)' }} />
              </div>
              <h3 style={{ fontSize: '24px', color: 'var(--text-main)' }}>Our Mission</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.7 }}>
                To provide the most comprehensive, high performance, high quality, cost effective, and easy to use ERP solutions and business support services to our customers. Our solutions enable and empower our customers to focus on their core competencies by reducing their operational efforts in accordance to the Pareto Principle (the 80/20 rule).
              </p>
            </div>

            {/* Vision Card */}
            <div className="card-item flex flex-column gap-3 text-left" style={{ borderLeft: '4px solid var(--primary)' }}>
              <div style={{ backgroundColor: 'var(--primary-glow)', padding: '16px', borderRadius: '50%', width: 'fit-content' }}>
                <Compass size={28} style={{ color: 'var(--primary)' }} />
              </div>
              <h3 style={{ fontSize: '24px', color: 'var(--text-main)' }}>Our Vision</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.7 }}>
                The MSME (Micro, Small and Medium Enterprises) sector plays a vital role in any country’s socio-economic transformation and in meeting the objectives of employment generation and reducing rapid urbanization. 4C Solutions wants to actively support MSMEs in becoming high performing organizations and in turn be a key part of the economic transformation they bring to our society.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
