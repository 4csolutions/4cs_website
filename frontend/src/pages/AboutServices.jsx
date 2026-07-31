import React, { useEffect } from 'react';
import { Target, Compass, CheckCircle, BarChart3, Settings2, Users, Cpu, Link2, Database } from 'lucide-react';

export default function AboutServices() {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'About Us & Services | Custom ERPNext Solutions | 4C Solutions';

    let metaDescEl = document.querySelector('meta[name="description"]');
    let originalDesc = '';
    if (metaDescEl) {
      originalDesc = metaDescEl.getAttribute('content') || '';
      metaDescEl.setAttribute('content', 'Learn more about 4C Solutions. We provide custom Frappe app development, ERPNext core implementation, database migrations, third-party integrations, and SLA-driven maintenance.');
    }

    let metaKeywordsEl = document.querySelector('meta[name="keywords"]');
    let originalKeywords = '';
    if (metaKeywordsEl) {
      originalKeywords = metaKeywordsEl.getAttribute('content') || '';
      metaKeywordsEl.setAttribute('content', 'about 4c solutions, custom frappe development, erpnext migrations, biometric integrations, erpnext training SLA');
    }

    return () => {
      document.title = originalTitle;
      if (metaDescEl && originalDesc) metaDescEl.setAttribute('content', originalDesc);
      if (metaKeywordsEl && originalKeywords) metaKeywordsEl.setAttribute('content', originalKeywords);
    };
  }, []);

  const services = [
    {
      title: 'Frappe Custom App Development',
      icon: <Cpu size={32} style={{ color: 'var(--primary)' }} />,
      desc: 'We build bespoke, production-grade custom applications from scratch using the Frappe Framework. From writing custom Python backend controllers to building interactive single-page apps (SPAs) and secure REST API models, we deliver high-performance logic tailored exactly to your workflows.'
    },
    {
      title: 'ERPNext Core Implementation',
      icon: <Settings2 size={32} style={{ color: 'var(--primary)' }} />,
      desc: 'We map your operational guidelines directly to standard ERPNext modules (Accounting, Procurement, Sales, HR & Payroll, Warehouses, Projects). We handle role-based user authorization, customize dynamic print formats, and configure approval workflows to secure your processes.'
    },
    {
      title: 'Risk-Free Legacy Database Migration',
      icon: <Database size={32} style={{ color: 'var(--primary)' }} />,
      desc: 'We execute secure, zero-downtime master and transaction data migrations from Busy, Tally Prime, Zoho Books, Odoo, SAP, or manual Excel files to ERPNext. We audit historical ledgers, suppliers, and items list structures to guarantee data integrity.'
    },
    {
      title: 'Advanced Third-Party API Integrations',
      icon: <Link2 size={32} style={{ color: 'var(--primary)' }} />,
      desc: 'We connect your ERPNext setup with vital external systems: biometric attendance devices (ZKTeco), instant WhatsApp alerts, SMS notification gateways, Razorpay or Stripe payment portals, and local tax nodes like the Indian GST and e-invoicing portals.'
    },
    {
      title: 'Operational Diagnostics & Consultation',
      icon: <BarChart3 size={32} style={{ color: 'var(--primary)' }} />,
      desc: 'Before writing any code, our domain experts conduct thorough operational audits of your departments. We locate double-entry friction, isolate cash and material leakages, and outline a detailed ERP blueprint designed to maximize operational yield.'
    },
    {
      title: 'SLA-Driven Training & Maintenance',
      icon: <Users size={32} style={{ color: 'var(--primary)' }} />,
      desc: 'We empower operations heads, staff, and system admins with comprehensive, hands-on user adoption clinics. We safeguard your environment under rigid SLAs, executing monthly secure backups, performance optimizations, and major version upgrades.'
    }
  ];

  return (
    <div className="aboutservices-container">
      
      {/* 1. HERO HEADER */}
      <section className="section page-header" style={{ padding: '128px 0 64px 0', background: 'linear-gradient(180deg, var(--bg-card) 0%, var(--bg-app) 100%)', borderBottom: '1px solid var(--border)' }}>
        <div className="container text-center">
          <span style={{ fontSize: '13px', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', padding: '6px 16px', borderRadius: '24px', fontWeight: 600, display: 'inline-block', marginBottom: '16px' }}>
            Enterprise Systems Integrator
          </span>
          <h1 style={{ fontSize: '48px', color: 'var(--text-main)', marginBottom: '16px' }}>
            About 4C Solutions
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto', fontSize: '16px', lineHeight: 1.6 }}>
            With over 5+ years of dedicated custom software experience, we take immense pride in empowering growing businesses and enterprises by delivering high-domain, robust digital transformations. Our core focus is to simplify complex operations, eliminate software license bottlenecks, and guarantee long-term operational success.
          </p>
        </div>
      </section>

      {/* 2. SERVICES SECTION */}
      <section className="section services-list-section">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '64px' }}>
            <h2 style={{ fontSize: '36px', marginBottom: '16px' }}>Our Services</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '580px', margin: '0 auto' }}>
              Explore the comprehensive, unbundled services we engineer to help your business achieve complete operational command and unified data control.
            </p>
          </div>

          <div className="grid grid-3">
            {services.map((ser, index) => (
              <div key={index} className="card-item flex flex-column text-left justify-between" style={{ minHeight: '380px' }}>
                <div>
                  <div style={{ marginBottom: '20px' }}>{ser.icon}</div>
                  <h3 style={{ fontSize: '19px', color: 'var(--text-main)', marginBottom: '12px', fontWeight: 700 }}>{ser.title}</h3>
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
                To provide comprehensive, high-performance, cost-effective, and intuitive ERP solutions and specialized support services. Our customized systems enable and empower growing organizations to simplify operational complexities, eliminate digital friction, and focus entirely on their core competencies, driving sustainable growth.
              </p>
            </div>

            {/* Vision Card */}
            <div className="card-item flex flex-column gap-3 text-left" style={{ borderLeft: '4px solid var(--primary)' }}>
              <div style={{ backgroundColor: 'var(--primary-glow)', padding: '16px', borderRadius: '50%', width: 'fit-content' }}>
                <Compass size={28} style={{ color: 'var(--primary)' }} />
              </div>
              <h3 style={{ fontSize: '24px', color: 'var(--text-main)' }}>Our Vision</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.7 }}>
                To be a premier global systems integrator that empowers businesses and growing enterprises to achieve complete digital transformation. By replacing disjointed legacy software with unified, zero-license cloud ERP systems, we aim to accelerate operational efficiency, foster continuous innovation, and be a catalyst for long-term corporate success.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
