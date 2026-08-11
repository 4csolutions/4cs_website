import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, Scale, Truck, Briefcase, ChevronRight, MessageSquare, Quote, X, Award, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [sectors, setSectors] = useState([]);
  const [logos, setLogos] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedSector, setSelectedSector] = useState(null);
  const [sectorTestimonials, setSectorTestimonials] = useState([]);
  const [loadingSectors, setLoadingSectors] = useState(true);

  // Methodology steps info
  const steps = [
    { title: 'Study & Discovery', desc: 'We detail your operational gaps, analyze manual process bottlenecks, and outline optimal system flows.', icon: '🔍' },
    { title: 'Setup & Configure', desc: 'We install the core ERPNext instance, map custom documents, and configure access authorization protocols.', icon: '⚙️' },
    { title: 'Customization & Migration', desc: 'We customize standard ERPNext forms, build specific print formats, write workflows, and securely migrate your legacy master data (items, customers, suppliers).', icon: '🛠️' },
    { title: 'Hands-on Training', desc: 'We empower users, department heads, and managers with thorough system walk-through runs.', icon: '🎓' },
    { title: 'Go-Live & Support', desc: 'We execute absolute data migration audits, launch production instances, and provide ongoing SLAs.', icon: '🚀' }
  ];

  // Set SEO metadata
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '4C Solutions | Premium ERPNext Solution Provider';

    let metaDescEl = document.querySelector('meta[name="description"]');
    let originalDesc = '';
    if (metaDescEl) {
      originalDesc = metaDescEl.getAttribute('content') || '';
      metaDescEl.setAttribute('content', '4C Solutions is a premier B2B ERPNext solution provider specializing in custom ERP implementations for Healthcare, Legal, Logistics, and Project Contracting.');
    }

    let metaKeywordsEl = document.querySelector('meta[name="keywords"]');
    let originalKeywords = '';
    if (metaKeywordsEl) {
      originalKeywords = metaKeywordsEl.getAttribute('content') || '';
      metaKeywordsEl.setAttribute('content', '4C Solutions, ERPNext, ERPNext Solution Provider, Healthcare ERP, Hospital Management System, Radiology Information System, RIS Software, Laboratory Management Software, LIS Software, HMS ERPNext, Legal Case Management, Law Firm Management, Law Management, Advocate Case Software, Legal Practice ERP, Logistics Dispatch, Project Budgeting ERP');
    }

    return () => {
      document.title = originalTitle;
      if (metaDescEl && originalDesc) metaDescEl.setAttribute('content', originalDesc);
      if (metaKeywordsEl && originalKeywords) metaKeywordsEl.setAttribute('content', originalKeywords);
    };
  }, []);

  useEffect(() => {
    // 1. Fetch Sectors
    fetch('/api/sectors')
      .then(res => res.json())
      .then(data => {
        setSectors(data);
        setLoadingSectors(false);
      })
      .catch(err => {
        console.error('Error fetching sectors:', err);
        setLoadingSectors(false);
      });

    // 2. Fetch Logos
    fetch('/api/logos')
      .then(res => res.json())
      .then(data => setLogos(data))
      .catch(err => console.error('Error fetching logos:', err));
  }, []);

  const selectSector = (sector) => {
    setSelectedSector(sector);
    // Fetch associated testimonials
    fetch(`/api/sectors/slug/${sector.slug}`)
      .then(res => res.json())
      .then(data => {
        setSectorTestimonials(data.testimonials || []);
      })
      .catch(err => {
        console.error('Error fetching sector details:', err);
        setSectorTestimonials([]);
      });
  };

  // Maps Lucide icon name dynamically
  const renderIcon = (iconName, size = 20) => {
    const props = { size, style: { color: 'var(--primary)' } };
    switch (iconName?.toLowerCase()) {
      case 'activity': return <Activity {...props} />;
      case 'scale': return <Scale {...props} />;
      case 'truck': return <Truck {...props} />;
      case 'briefcase': return <Briefcase {...props} />;
      default: return <Award {...props} />;
    }
  };

  return (
    <div className="home-container">
      
      {/* 1. HERO BANNER */}
      <section className="section hero-section flex align-center" style={{ minHeight: '85vh', background: 'linear-gradient(135deg, rgba(24, 210, 110, 0.05) 0%, rgba(18, 40, 58, 0.05) 100%)', padding: '128px 0 80px 0' }}>
        <div className="container grid grid-2 align-center">
          <div className="text-left anim-slide-left">
            <span style={{ fontSize: '14px', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', padding: '6px 16px', borderRadius: '24px', fontWeight: 600, display: 'inline-block', marginBottom: '16px' }}>
              ERPNext Experts | 5+ Years Experience
            </span>
            <h1 style={{ fontSize: '56px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '24px', lineHeight: 1.15 }}>
              Scale Without Limits: Zero-License <span style={{ color: 'var(--primary)' }}>ERPNext</span> Solutions
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-muted)', marginBottom: '32px', maxWidth: '520px', lineHeight: 1.6 }}>
              We are a certified enterprise systems integrator specializing in high-domain custom modules. We automate operations in Healthcare, Logistics, Legal, and Project Contracting with zero software user license fees.
            </p>
            <div className="flex gap-4 wrap">
              <Link to="/whyerpnext" className="btn btn-primary">
                Why ERPNext <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="btn btn-secondary">
                Get Free Demo
              </Link>
            </div>
          </div>
          
          <div className="anim-slide-right flex justify-center align-center">
            <img 
              src="/hero-illustration.png" 
              alt="4C Solutions ERPNext Dashboard Illustration" 
              style={{ 
                width: '100%', 
                maxWidth: '560px', 
                height: 'auto', 
                objectFit: 'contain'
              }} 
            />
          </div>
        </div>
      </section>

      {/* 2. INFINITE LOGO SLIDER */}
      {logos.length > 0 && (
        <section className="ticker-container">
          <div className="ticker-wrapper">
            {/* Double the list to make ticker infinite */}
            {[...logos, ...logos].map((logo, index) => (
              <div className="ticker-item" key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                {logo.logoData ? (
                  <>
                    <img
                      src={`data:${logo.logoMimeType || 'image/png'};base64,${logo.logoData}`}
                      alt={logo.clientName}
                      style={{ height: '32px', maxWidth: '120px', objectFit: 'contain', filter: 'grayscale(0.3)', opacity: 0.85 }}
                    />
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.03em' }}>
                      {logo.clientName}
                    </span>
                  </>
                ) : (
                  <span style={{ fontWeight: 700, fontSize: '18px', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                    {logo.clientName}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 2.5 TRUSTED STATISTICS GRID */}
      <section className="section stats-section" style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '56px 0', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="grid grid-4 text-center" style={{ gap: '24px' }}>
            <div className="flex flex-column align-center">
              <span style={{ fontSize: '42px', fontWeight: 800, color: 'var(--primary)', display: 'block', lineHeight: 1.1 }}>5+ Years</span>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ERPNext Engineering</span>
            </div>
            <div className="flex flex-column align-center">
              <span style={{ fontSize: '42px', fontWeight: 800, color: 'var(--primary)', display: 'block', lineHeight: 1.1 }}>15+</span>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Enterprise Shifts</span>
            </div>
            <div className="flex flex-column align-center">
              <span style={{ fontSize: '42px', fontWeight: 800, color: 'var(--primary)', display: 'block', lineHeight: 1.1 }}>40%</span>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Average Efficiency Gain</span>
            </div>
            <div className="flex flex-column align-center">
              <span style={{ fontSize: '42px', fontWeight: 800, color: 'var(--primary)', display: 'block', lineHeight: 1.1 }}>₹0</span>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User License Overhead</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE METHODOLOGY FLOW */}
      <section className="section methodology-section" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '64px' }}>
            <h2 style={{ fontSize: '36px', marginBottom: '16px' }}>Our Implementation Methodology</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '580px', margin: '0 auto' }}>
              We don't just configure software—we study your operational DNA to architect the perfect ERPNext setup.
            </p>
          </div>

          <div className="grid grid-2 align-center" style={{ marginBottom: '48px' }}>
            {/* Interactive Timeline Tabs */}
            <div className="flex flex-column gap-4">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`flex align-center gap-4`}
                  style={{
                    padding: '20px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    backgroundColor: activeStep === idx ? 'var(--bg-card)' : 'transparent',
                    borderColor: activeStep === idx ? 'var(--primary)' : 'var(--border)',
                    boxShadow: activeStep === idx ? 'var(--shadow-md)' : 'none',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <span style={{ fontSize: '32px' }}>{step.icon}</span>
                  <div style={{ textAlign: 'left' }}>
                    <h3 style={{ fontSize: '18px', color: activeStep === idx ? 'var(--primary)' : 'var(--text-main)', margin: 0 }}>
                      0{idx + 1}. {step.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px', margin: 0 }}>
                      Click to review detail scope
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Display Active Details Card */}
            <div className="glass anim-fade-in" style={{ padding: '48px', borderRadius: 'var(--radius-lg)', textAlign: 'left', minHeight: '340px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }} key={activeStep}>
              <span style={{ fontSize: '64px', marginBottom: '16px', display: 'block' }}>{steps[activeStep].icon}</span>
              <h3 style={{ fontSize: '28px', color: 'var(--primary)', marginBottom: '16px', margin: 0 }}>{steps[activeStep].title}</h3>
              <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '24px', marginTop: '12px' }}>
                {steps[activeStep].desc}
              </p>
              <div className="flex align-center gap-2" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                <CheckCircle2 size={18} /> High-Quality SLA Standards Guaranteed
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. DYNAMIC SECTORS GRID */}
      <section className="section sectors-section" style={{ backgroundColor: 'var(--bg-app)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '64px' }}>
            <h2 style={{ fontSize: '36px', marginBottom: '16px' }}>Industries We Serve</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '580px', margin: '0 auto' }}>
              At 4C Solutions, we deliver tailored ERPNext solutions optimized specifically for the unique workflows of your business sector.
            </p>
          </div>

          {loadingSectors ? (
            <div className="text-center" style={{ padding: '40px 0' }}>
              <span className="spinner"></span>
              <p style={{ color: 'var(--text-muted)', marginTop: '12px' }}>Loading solutions grid...</p>
            </div>
          ) : (
            <div className="grid grid-4">
              {sectors.map((sector) => (
                <div key={sector._id} className="card-item flex flex-column justify-between text-left" style={{ minHeight: '440px', padding: 0, overflow: 'hidden' }}>
                  <div className="flex flex-column">
                    {/* Illustration Header */}
                    {sector.image && (
                      <div style={{ width: '100%', height: '180px', backgroundColor: 'var(--bg-app)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '16px' }}>
                        <img src={sector.image} alt={sector.name} style={{ height: '100%', width: 'auto', objectFit: 'contain', transition: 'transform var(--transition-normal)' }} />
                      </div>
                    )}
                    
                    <div style={{ padding: '24px 24px 12px 24px' }}>
                      <div className="flex align-center gap-2" style={{ marginBottom: '12px' }}>
                        {renderIcon(sector.icon, 20)}
                        <h3 style={{ fontSize: '18px', color: 'var(--text-main)', letterSpacing: '0.02em', margin: 0 }}>
                          {sector.name}
                        </h3>
                      </div>
                      <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                        {sector.description.length > 100 ? `${sector.description.substring(0, 95)}...` : sector.description}
                      </p>
                    </div>
                  </div>

                  <div style={{ padding: '0 24px 24px 24px' }}>
                    <Link to={`/industries/${sector.slug}`} className="btn btn-secondary flex align-center justify-center gap-1" style={{ padding: '8px 18px', fontSize: '13px', width: '100%', textDecoration: 'none' }}>
                      Explore Features <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. SECTOR DETAILS POPUP MODAL */}
      {selectedSector && (
        <div className="modal-overlay flex align-center justify-center" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 20000, padding: '24px' }}>
          <div className="modal-content glass anim-fade-in" style={{ backgroundColor: 'var(--bg-card)', padding: '40px', borderRadius: 'var(--radius-lg)', maxWidth: '780px', width: '100%', position: 'relative', maxHeight: '90vh', overflowY: 'auto', textAlign: 'left' }}>
            <button onClick={() => setSelectedSector(null)} className="btn-icon" style={{ position: 'absolute', top: '20px', right: '20px' }}>
              <X size={20} />
            </button>

            <div className="flex align-center gap-3" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '24px' }}>
              {renderIcon(selectedSector.icon, 32)}
              <h2 style={{ fontSize: '28px', color: 'var(--text-main)', margin: 0 }}>{selectedSector.name} ERP Solutions</h2>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '16px', lineHeight: 1.6, marginBottom: '28px' }}>
              {selectedSector.description}
            </p>

            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', color: 'var(--text-main)', marginBottom: '16px' }}>Core ERPNext Features</h3>
              <div className="grid grid-2" style={{ gap: '12px' }}>
                {selectedSector.features.map((feature, idx) => (
                  <div key={idx} className="flex align-center gap-2" style={{ fontSize: '14px', color: 'var(--text-main)' }}>
                    <span style={{ color: 'var(--primary)', fontSize: '18px', fontWeight: 'bold' }}>✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Render Testimonials belonging to this sector */}
            {sectorTestimonials.length > 0 && (
              <div style={{ backgroundColor: 'var(--bg-app)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '24px', marginTop: '24px' }}>
                <h3 style={{ fontSize: '16px', color: 'var(--text-main)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageSquare size={16} style={{ color: 'var(--primary)' }} /> Success Stories
                </h3>
                {sectorTestimonials.map((t) => (
                  <div key={t._id} style={{ position: 'relative', paddingLeft: '24px' }}>
                    <Quote size={18} style={{ color: 'var(--primary)', position: 'absolute', top: 0, left: 0, opacity: 0.3 }} />
                    <p style={{ fontStyle: 'italic', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                      "{t.feedback}"
                    </p>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main)' }}>
                      {t.clientName} - {t.clientPosition}, <span style={{ color: 'var(--primary)' }}>{t.companyName}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

