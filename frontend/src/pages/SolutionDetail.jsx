import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, Quote, ArrowRight, Calendar, User, Clock, ChevronRight, Activity, Scale, Truck, Briefcase, Award } from 'lucide-react';
import SEO from '../components/SEO';

export default function SolutionDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/sectors/slug/${slug}`)
      .then(res => res.json())
      .then(payload => {
        if (payload.sector) {
          setData(payload);
        } else {
          setData(null);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching solution details:', err);
        setData(null);
        setLoading(false);
      });
  }, [slug]);

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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex flex-column align-center justify-center" style={{ minHeight: '60vh', padding: '80px 0' }}>
        <div className="spinner" style={{ border: '4px solid var(--border)', borderTop: '4px solid var(--primary)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ color: 'var(--text-muted)', marginTop: '16px' }}>Loading solutions blueprint...</p>
      </div>
    );
  }

  if (!data || !data.sector) {
    return (
      <div className="container text-center" style={{ padding: '128px 0 80px 0' }}>
        <SEO title="Solution Not Found" noIndex={true} />
        <h2 style={{ fontSize: '36px', color: 'var(--text-main)', marginBottom: '16px' }}>Solution Profile Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>The requested solution vertical does not exist or has been relocated.</p>
        <div className="flex justify-center gap-4">
          <Link to="/solutions" className="btn btn-primary">Browse All Solutions</Link>
          <Link to="/" className="btn btn-secondary">Return Home Base</Link>
        </div>
      </div>
    );
  }

  const { sector, testimonials, logos, blogs } = data;

  const sectorSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `${sector.name} ERPNext Solutions`,
    "description": sector.description || `Customized ERPNext solutions for ${sector.name} by 4C Solutions.`,
    "provider": {
      "@type": "ProfessionalService",
      "name": "4C Solutions",
      "url": "https://4csolutions.in"
    },
    "areaServed": "IN",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": `${sector.name} Features`,
      "itemListElement": Array.isArray(sector.features) 
        ? sector.features.map(f => ({
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": f
            }
          }))
        : []
    }
  };

  return (
    <div className="solution-details-container">
      <SEO
        title={`${sector.name} ERPNext Solutions & Custom Modules`}
        description={sector.description || `Tailored ERPNext implementation and custom Frappe workflows for ${sector.name} businesses.`}
        keywords={`${sector.name.toLowerCase()} erp, erpnext ${sector.name.toLowerCase()}, 4c solutions, customized enterprise systems, frappe vertical`}
        canonicalUrl={`https://4csolutions.in/solutions/${slug}`}
        schema={sectorSchema}
      />
      
      {/* 1. SECTOR HERO SECTION */}
      <section className="section page-header" style={{ padding: '140px 0 80px 0', background: 'linear-gradient(180deg, var(--bg-card) 0%, var(--bg-app) 100%)', borderBottom: '1px solid var(--border)' }}>
        <div className="container grid grid-2 align-center gap-6">
          <div className="text-left anim-slide-left">
            <span style={{ fontSize: '13px', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', padding: '6px 16px', borderRadius: '24px', fontWeight: 600, display: 'inline-block', marginBottom: '16px' }}>
              Specialized Enterprise Workflows
            </span>
            <div className="flex align-center gap-3" style={{ marginBottom: '20px' }}>
              {renderIcon(sector.icon, 36)}
              <h1 style={{ fontSize: '48px', color: 'var(--text-main)', margin: 0, textTransform: 'uppercase', fontFamily: 'var(--font-family-title)', fontWeight: 800 }}>
                {sector.name}
              </h1>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '17px', lineHeight: 1.7, marginBottom: '32px', maxWidth: '560px' }}>
              {sector.description}
            </p>
            <div className="flex gap-4">
              <a href="#features-target" className="btn btn-primary">
                Explore ERP Features
              </a>
              <Link to="/contact" className="btn btn-secondary">
                Request {sector.name} Demo
              </Link>
            </div>
          </div>
          
          <div className="anim-slide-right flex justify-center">
            {sector.image ? (
              <img 
                src={`data:image/jpeg;base64,${sector.image}`} 
                alt={`${sector.name} ERP Architecture`}
                style={{ width: '100%', maxWidth: '480px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}
              />
            ) : (
              <div 
                className="card-item flex flex-column align-center justify-center text-center"
                style={{ width: '100%', maxWidth: '440px', height: '320px', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-app) 100%)', border: '1px solid var(--border)' }}
              >
                <div style={{ padding: '24px', backgroundColor: 'var(--primary-glow)', borderRadius: '50%', marginBottom: '16px' }}>
                  {renderIcon(sector.icon, 64)}
                </div>
                <h3 style={{ fontSize: '20px', color: 'var(--text-main)', margin: 0 }}>
                  High-Yield {sector.name} Extension
                </h3>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. TAILORED ERPNEXT MODULES GRID */}
      <section id="features-target" className="section" style={{ padding: '80px 0' }}>
        <div className="container text-center">
          <span style={{ fontSize: '13px', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', padding: '6px 16px', borderRadius: '24px', fontWeight: 600, display: 'inline-block', marginBottom: '16px' }}>
            Domain Modules
          </span>
          <h2 style={{ fontSize: '36px', color: 'var(--text-main)', marginBottom: '12px' }}>
            {sector.featuresHeading || `Tailored ERPNext Modules for ${sector.name}`}
          </h2>
          {sector.featuresSubheading && (
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 48px auto', fontSize: '16px' }}>
              {sector.featuresSubheading}
            </p>
          )}

          <div className="grid grid-2 gap-4 text-left" style={{ marginTop: '32px' }}>
            {Array.isArray(sector.features) && sector.features.map((feat, idx) => (
              <div key={idx} className="card-item flex align-start gap-3" style={{ padding: '24px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <CheckCircle size={22} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '16px', color: 'var(--text-main)', marginBottom: '4px', fontWeight: 600 }}>{feat}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.5, margin: 0 }}>
                    Integrated directly into core ledger, user roles, and live reporting workflows.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PROVEN ENTERPRISE IMPACT METRICS */}
      <section className="section" style={{ backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '64px 0' }}>
        <div className="container">
          <div className="grid grid-4 text-center gap-4">
            <div>
              <h3 style={{ fontSize: '40px', color: 'var(--primary)', margin: 0, fontWeight: 800 }}>Zero</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Software License Fees</p>
            </div>
            <div>
              <h3 style={{ fontSize: '40px', color: 'var(--primary)', margin: 0, fontWeight: 800 }}>100%</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Data Sovereignty</p>
            </div>
            <div>
              <h3 style={{ fontSize: '40px', color: 'var(--primary)', margin: 0, fontWeight: 800 }}>40%</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Average Efficiency Gain</p>
            </div>
            <div>
              <h3 style={{ fontSize: '40px', color: 'var(--primary)', margin: 0, fontWeight: 800 }}>24/7</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Cloud Uptime & Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. VERIFIED CLIENT TESTIMONIALS */}
      {Array.isArray(testimonials) && testimonials.length > 0 && (
        <section className="section" style={{ padding: '80px 0' }}>
          <div className="container text-center">
            <span style={{ fontSize: '13px', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', padding: '6px 16px', borderRadius: '24px', fontWeight: 600, display: 'inline-block', marginBottom: '16px' }}>
              Client Trust
            </span>
            <h2 style={{ fontSize: '36px', color: 'var(--text-main)', marginBottom: '40px' }}>
              What Leaders in {sector.name} Say
            </h2>

            <div className="card-item relative" style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 32px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <Quote size={48} style={{ color: 'var(--primary)', opacity: 0.2, position: 'absolute', top: '24px', left: '24px' }} />
              <p style={{ fontSize: '18px', lineHeight: 1.7, color: 'var(--text-main)', fontStyle: 'italic', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
                "{testimonials[activeTestimonial]?.feedback}"
              </p>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                <h4 style={{ margin: 0, fontSize: '16px', color: 'var(--text-main)' }}>{testimonials[activeTestimonial]?.clientName}</h4>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                  {testimonials[activeTestimonial]?.clientPosition}, {testimonials[activeTestimonial]?.companyName}
                </p>
              </div>

              {testimonials.length > 1 && (
                <div className="flex justify-center gap-2" style={{ marginTop: '24px' }}>
                  {testimonials.map((_, i) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveTestimonial(i)}
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        border: 'none',
                        backgroundColor: activeTestimonial === i ? 'var(--primary)' : 'var(--border)',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 5. TRUSTED BRAND LOGOS */}
      {Array.isArray(logos) && logos.length > 0 && (
        <section className="section" style={{ padding: '40px 0', borderTop: '1px solid var(--border)' }}>
          <div className="container text-center">
            <p style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Trusted by {sector.name} Enterprises
            </p>
            <div className="flex justify-center align-center wrap gap-6">
              {logos.map(l => (
                <div key={l._id} style={{ opacity: 0.75, transition: 'opacity 0.2s', padding: '12px' }}>
                  {l.logoData ? (
                    <img 
                      src={`data:${l.logoMimeType || 'image/png'};base64,${l.logoData}`} 
                      alt={l.clientName} 
                      style={{ maxHeight: '36px', maxWidth: '140px', objectFit: 'contain', filter: 'grayscale(100%) brightness(0.9)' }} 
                    />
                  ) : (
                    <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-muted)' }}>{l.clientName}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. RELATED CASE STUDIES */}
      {Array.isArray(blogs) && blogs.length > 0 && (
        <section className="section" style={{ padding: '80px 0', backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
          <div className="container">
            <div className="flex justify-between align-end" style={{ marginBottom: '32px' }}>
              <div className="text-left">
                <span style={{ fontSize: '13px', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', padding: '6px 16px', borderRadius: '24px', fontWeight: 600, display: 'inline-block', marginBottom: '8px' }}>
                  Case Studies
                </span>
                <h2 style={{ fontSize: '32px', color: 'var(--text-main)', margin: 0 }}>
                  Real World Success Stories
                </h2>
              </div>
              <Link to="/case-studies" className="btn btn-secondary flex align-center gap-1">
                View All <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-3 gap-4">
              {blogs.map(b => (
                <div key={b._id} className="card-item flex flex-column justify-between text-left" style={{ padding: '24px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border)' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                      {formatDate(b.datePublished)}
                    </span>
                    <h3 style={{ fontSize: '18px', color: 'var(--text-main)', marginBottom: '8px', lineHeight: 1.4 }}>
                      {b.title}
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.6, marginBottom: '16px' }}>
                      {b.summary}
                    </p>
                  </div>
                  <Link to={`/case-studies/${b.slug}`} className="flex align-center gap-1" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '13px', textDecoration: 'none' }}>
                    Read Case Study <ChevronRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. BOTTOM DEMO CTA */}
      <section className="section" style={{ padding: '80px 0' }}>
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
            <h3 style={{ fontSize: '32px', color: 'var(--text-main)', marginBottom: '12px', fontWeight: 800 }}>
              Modernize Your {sector.name} Operations
            </h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '560px', marginBottom: '28px', fontSize: '15px' }}>
              Schedule a personalized 15-minute live ERP walkthrough tailored specifically to your department workflows and approval protocols.
            </p>
            <Link to="/contact" className="btn btn-primary" style={{ padding: '12px 32px', fontSize: '15px' }}>
              Schedule Free Solution Demo
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
