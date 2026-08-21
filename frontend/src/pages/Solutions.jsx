import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Scale, Truck, Briefcase, Award, ArrowRight, CheckCircle2, Sparkles, PhoneCall } from 'lucide-react';
import SEO from '../components/SEO';

export default function Solutions() {
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/sectors')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSectors(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading solutions list:', err);
        setLoading(false);
      });
  }, []);

  const renderIcon = (iconName, size = 32) => {
    const props = { size, style: { color: 'var(--primary)' } };
    switch (iconName?.toLowerCase()) {
      case 'activity': return <Activity {...props} />;
      case 'scale': return <Scale {...props} />;
      case 'truck': return <Truck {...props} />;
      case 'briefcase': return <Briefcase {...props} />;
      default: return <Award {...props} />;
    }
  };

  const solutionsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "4C Solutions ERPNext Vertical Solutions",
    "description": "Tailored ERPNext and Frappe Framework enterprise solutions for Healthcare, Legal Practice, Logistics, and Contracting sectors.",
    "itemListElement": sectors.map((sec, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": sec.name,
      "url": `https://4csolutions.in/solutions/${sec.slug}`,
      "description": sec.description
    }))
  };

  return (
    <div className="solutions-hub-page">
      <SEO
        title="ERPNext Solutions & Enterprise Verticals"
        description="Explore 4C Solutions custom ERPNext vertical solutions engineered for Healthcare Clinics, Fleet Logistics, Advocate Law Firms, and Project Contracting businesses."
        keywords="ERPNext solutions, healthcare erpnext, logistics dispatch erpnext, law firm erpnext, project contracting erpnext, custom frappe apps"
        canonicalUrl="https://4csolutions.in/solutions"
        schema={solutionsSchema}
      />

      {/* Hero Header */}
      <section className="section page-header" style={{ padding: '120px 0 60px 0', background: 'linear-gradient(180deg, var(--bg-card) 0%, var(--bg-app) 100%)', borderBottom: '1px solid var(--border)' }}>
        <div className="container text-center">
          <div className="inline-flex align-center gap-2" style={{ backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', padding: '6px 16px', borderRadius: '24px', fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>
            <Sparkles size={16} />
            <span>Tailored Domain Architectures</span>
          </div>
          <h1 style={{ fontSize: '44px', color: 'var(--text-main)', marginBottom: '16px', fontWeight: 800, fontFamily: 'var(--font-family-title)' }}>
            Enterprise <span style={{ color: 'var(--primary)' }}>ERPNext Solutions</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto', fontSize: '16px', lineHeight: 1.6 }}>
            Off-the-shelf software often forces you to compromise your workflows. We engineer specialized vertical extensions on top of ERPNext with zero license fees, perfectly fitted to your operational reality.
          </p>
        </div>
      </section>

      {/* Solutions Cards Grid */}
      <section className="section" style={{ padding: '64px 0' }}>
        <div className="container">
          {loading ? (
            <div className="flex flex-column align-center justify-center" style={{ minHeight: '40vh' }}>
              <div className="spinner" style={{ border: '4px solid var(--border)', borderTop: '4px solid var(--primary)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }}></div>
              <p style={{ color: 'var(--text-muted)', marginTop: '16px' }}>Loading solutions blueprint...</p>
            </div>
          ) : (
            <div className="grid grid-2 gap-6">
              {sectors.map((sec) => (
                <div
                  key={sec._id || sec.slug}
                  className="card-item flex flex-column justify-between"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '36px',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    textAlign: 'left'
                  }}
                >
                  <div>
                    <div className="flex align-center justify-between" style={{ marginBottom: '20px' }}>
                      <div style={{ padding: '12px', backgroundColor: 'var(--primary-glow)', borderRadius: '12px', display: 'inline-flex' }}>
                        {renderIcon(sec.icon, 32)}
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
                        Enterprise Vertical
                      </span>
                    </div>

                    <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px' }}>
                      {sec.name}
                    </h2>

                    <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>
                      {sec.description}
                    </p>

                    {Array.isArray(sec.features) && sec.features.length > 0 && (
                      <div style={{ marginBottom: '28px' }}>
                        <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '12px' }}>
                          Key Capabilities Included:
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {sec.features.slice(0, 4).map((feat, i) => (
                            <li key={i} className="flex align-center gap-2" style={{ fontSize: '14px', color: 'var(--text-main)' }}>
                              <CheckCircle2 size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="flex align-center gap-3 pt-4" style={{ borderTop: '1px solid var(--border)', marginTop: '16px' }}>
                    <Link
                      to={`/solutions/${sec.slug}`}
                      className="btn btn-primary flex align-center justify-center gap-2"
                      style={{ flex: 1, padding: '12px 20px', fontSize: '14px', textDecoration: 'none' }}
                    >
                      <span>Explore {sec.name} Solution</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="section" style={{ padding: '60px 0 90px 0' }}>
        <div className="container">
          <div
            className="card-item text-center flex flex-column align-center"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              padding: '48px 24px',
              background: 'linear-gradient(135deg, rgba(231,29,54,0.06) 0%, var(--bg-card) 100%)'
            }}
          >
            <h3 style={{ fontSize: '28px', color: 'var(--text-main)', marginBottom: '12px', fontWeight: 800 }}>
              Need a customized industry solution?
            </h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '560px', marginBottom: '24px', fontSize: '15px' }}>
              We build custom Frappe Framework controllers, doctypes, and tailored ERP workflows for any specialized enterprise or manufacturing business.
            </p>
            <div className="flex gap-4 wrap justify-center">
              <Link to="/contact" className="btn btn-primary flex align-center gap-2">
                <PhoneCall size={16} />
                <span>Request Custom Solution Architecture</span>
              </Link>
              <Link to="/case-studies" className="btn btn-secondary flex align-center gap-2">
                <span>View Case Studies</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
