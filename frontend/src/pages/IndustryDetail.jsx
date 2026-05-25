import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, Quote, ArrowRight, Calendar, User, Clock, ChevronRight, Activity, Scale, Truck, Briefcase, Award } from 'lucide-react';

export default function IndustryDetail() {
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
        console.error('Error fetching industry details:', err);
        setData(null);
        setLoading(false);
      });
  }, [slug]);

  // SEO & AEO dynamic headers injection
  useEffect(() => {
    if (data && data.sector) {
      const sectorName = data.sector.name;
      const originalTitle = document.title;
      
      // 1. Dynamic document title
      document.title = `${sectorName} ERPNext Solutions | 4C Solutions`;

      // 2. Dynamic keywords meta
      let metaKeywordsEl = document.querySelector('meta[name="keywords"]');
      let originalKeywords = '';
      if (metaKeywordsEl) {
        originalKeywords = metaKeywordsEl.getAttribute('content') || '';
      }
      const sectorKeywords = `${sectorName.toLowerCase()} erp, erpnext ${sectorName.toLowerCase()}, 4c solutions, customized enterprise systems`;
      if (metaKeywordsEl) {
        metaKeywordsEl.setAttribute('content', sectorKeywords);
      } else {
        metaKeywordsEl = document.createElement('meta');
        metaKeywordsEl.setAttribute('name', 'keywords');
        metaKeywordsEl.setAttribute('content', sectorKeywords);
        document.head.appendChild(metaKeywordsEl);
      }

      // 3. Dynamic description meta
      let metaDescEl = document.querySelector('meta[name="description"]');
      let originalDesc = '';
      if (metaDescEl) {
        originalDesc = metaDescEl.getAttribute('content') || '';
      }
      const sectorDesc = data.sector.description || `Premium customized ERPNext solutions for ${sectorName} businesses by 4C Solutions.`;
      if (metaDescEl) {
        metaDescEl.setAttribute('content', sectorDesc);
      } else {
        metaDescEl = document.createElement('meta');
        metaDescEl.setAttribute('name', 'description');
        metaDescEl.setAttribute('content', sectorDesc);
        document.head.appendChild(metaDescEl);
      }

      return () => {
        document.title = originalTitle;
        if (metaKeywordsEl) {
          if (originalKeywords) {
            metaKeywordsEl.setAttribute('content', originalKeywords);
          } else {
            metaKeywordsEl.remove();
          }
        }
        if (metaDescEl) {
          if (originalDesc) {
            metaDescEl.setAttribute('content', originalDesc);
          } else {
            metaDescEl.remove();
          }
        }
      };
    }
  }, [data]);

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
        <h2 style={{ fontSize: '36px', color: 'var(--text-main)', marginBottom: '16px' }}>Industry Profile Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>The requested business sector does not exist or has been relocated.</p>
        <Link to="/" className="btn btn-primary">Return Home Base</Link>
      </div>
    );
  }

  const { sector, testimonials, logos, blogs } = data;

  return (
    <div className="industry-details-container">
      
      {/* 1. SECTOR HERO SECTION */}
      <section className="section page-header" style={{ padding: '140px 0 80px 0', background: 'linear-gradient(180deg, var(--bg-card) 0%, var(--bg-app) 100%)', borderBottom: '1px solid var(--border)' }}>
        <div className="container grid grid-2 align-center gap-6">
          <div className="text-left anim-slide-left">
            <span style={{ fontSize: '13px', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', padding: '6px 16px', borderRadius: '24px', fontWeight: 600, display: 'inline-block', marginBottom: '16px' }}>
              Specialized Industry Workflows
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
                Request Demo
              </Link>
            </div>
          </div>

          <div className="flex justify-center anim-slide-right">
            {sector.image ? (
              <div style={{ width: '100%', maxWidth: '440px', padding: '24px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '24px', boxShadow: 'var(--shadow-lg)' }}>
                <img src={sector.image} alt={sector.name} style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
              </div>
            ) : (
              <div className="glass flex align-center justify-center" style={{ width: '100%', maxWidth: '440px', height: '340px', borderRadius: '24px', color: 'var(--primary-glow)' }}>
                {renderIcon(sector.icon, 96)}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. ERPNEXT FEATURES BLUEPRINT */}
      <section id="features-target" className="section features-list-section" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '36px', marginBottom: '16px' }}>Tailored ERPNext Modules</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '580px', margin: '0 auto' }}>
              Built specifically to modernize operational procedures and automate compliance reporting in the {sector.name} space.
            </p>
          </div>

          <div className="grid grid-3 gap-6">
            {sector.features && sector.features.length > 0 ? (
              sector.features.map((feature, index) => (
                <div key={index} className="card-item flex align-start gap-4 text-left" style={{ padding: '32px' }}>
                  <div style={{ backgroundColor: 'var(--primary-glow)', padding: '10px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle size={20} style={{ color: 'var(--primary)' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', color: 'var(--text-main)', marginBottom: '8px', marginTop: '2px', fontWeight: 600 }}>{feature}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                      Fully custom fields, operational security permissions, and native dashboard reporting integrated out-of-the-box.
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center" style={{ padding: '24px', color: 'var(--text-muted)' }}>
                No specific ERPNext workflow features declared for this sector.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. SECTOR TESTIMONIALS */}
      {testimonials && testimonials.length > 0 && (
        <section className="section testimonials-section" style={{ backgroundColor: 'var(--bg-app)', borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            <div className="text-center" style={{ marginBottom: '60px' }}>
              <h2 style={{ fontSize: '36px', marginBottom: '16px' }}>Client Endorsements</h2>
              <p style={{ color: 'var(--text-muted)', maxWidth: '580px', margin: '0 auto' }}>
                Hear directly from {sector.name} industry leaders who optimized their operational speed using our customized ERPNext implementations.
              </p>
            </div>

            <div className="flex justify-center">
              <div className="glass text-left" style={{ maxWidth: '800px', padding: '48px', borderRadius: '24px', position: 'relative', boxShadow: 'var(--shadow-md)' }}>
                <div style={{ position: 'absolute', top: '24px', right: '32px', color: 'var(--primary-glow)', opacity: 0.8 }}>
                  <Quote size={56} />
                </div>
                
                <p style={{ fontSize: '18px', color: 'var(--text-main)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '32px', position: 'relative', zIndex: 2 }}>
                  "{testimonials[activeTestimonial].feedback}"
                </p>

                <div className="flex align-center gap-3">
                  {testimonials[activeTestimonial].avatarPath ? (
                    <img src={testimonials[activeTestimonial].avatarPath} alt={testimonials[activeTestimonial].clientName} style={{ height: '52px', width: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} />
                  ) : (
                    <div className="flex align-center justify-center" style={{ height: '52px', width: '52px', borderRadius: '50%', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', fontWeight: 700, fontSize: '18px' }}>
                      {testimonials[activeTestimonial].clientName[0]}
                    </div>
                  )}
                  <div>
                    <h4 style={{ fontSize: '16px', color: 'var(--text-main)', margin: 0, fontWeight: 700 }}>
                      {testimonials[activeTestimonial].clientName}
                    </h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, marginTop: '2px' }}>
                      {testimonials[activeTestimonial].clientPosition}, <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{testimonials[activeTestimonial].companyName}</span>
                    </p>
                  </div>
                </div>

                {testimonials.length > 1 && (
                  <div className="flex gap-2 mt-6 justify-end" style={{ marginTop: '24px' }}>
                    {testimonials.map((_, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setActiveTestimonial(idx)}
                        style={{ 
                          height: '10px', 
                          width: activeTestimonial === idx ? '24px' : '10px', 
                          borderRadius: '5px', 
                          backgroundColor: activeTestimonial === idx ? 'var(--primary)' : 'var(--border)', 
                          border: 'none', 
                          cursor: 'pointer', 
                          transition: 'all var(--transition-fast)' 
                        }}
                      ></button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. CLIENT LOGOS & BRAND TICKER */}
      {logos && logos.length > 0 && (
        <section className="section logos-section" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            <div className="text-center" style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '20px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Trusted By</h3>
            </div>
            
            <div className="flex wrap justify-center align-center gap-6">
              {logos.map((logo) => (
                <a
                  href={logo.websiteUrl || '#'}
                  key={logo._id}
                  target={logo.websiteUrl && logo.websiteUrl !== '#' ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className="glass flex flex-column align-center justify-center"
                  style={{
                    padding: '16px 28px',
                    borderRadius: '12px',
                    gap: '8px',
                    minWidth: '160px',
                    textDecoration: 'none',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'transform var(--transition-fast), border-color var(--transition-fast)'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = 'var(--primary)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                >
                  {logo.logoData ? (
                    <>
                      <img
                        src={`data:${logo.logoMimeType || 'image/png'};base64,${logo.logoData}`}
                        alt={logo.clientName}
                        title={logo.clientName}
                        style={{ maxHeight: '40px', maxWidth: '140px', objectFit: 'contain' }}
                      />
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.02em' }}>
                        {logo.clientName}
                      </span>
                    </>
                  ) : (
                    <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '16px', letterSpacing: '0.05em' }}>
                      {logo.clientName}
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. LATEST 3 CASE STUDIES */}
      <section className="section case-studies-section" style={{ backgroundColor: 'var(--bg-app)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '36px', marginBottom: '16px' }}>Latest {sector.name} Case Studies</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '580px', margin: '0 auto' }}>
              Real execution results demonstrating zero licensing bottlenecks and high ROI software shifts.
            </p>
          </div>

          {blogs && blogs.length > 0 ? (
            <div className="grid grid-3 gap-6">
              {blogs.map((blog) => (
                <div key={blog._id} className="card-item flex flex-column justify-between text-left" style={{ padding: '0', overflow: 'hidden' }}>
                  <div className="flex flex-column">
                    {/* Blog Cover Placeholder / Image */}
                    <div style={{ height: '180px', backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {blog.coverImage ? (
                        <img src={blog.coverImage} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ color: 'var(--primary-glow)', opacity: 0.6 }}>
                          {renderIcon(sector.icon, 48)}
                        </div>
                      )}
                    </div>

                    <div style={{ padding: '24px 24px 12px 24px' }}>
                      <div className="flex align-center gap-3" style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                        <span className="flex align-center gap-1"><Calendar size={14} /> {formatDate(blog.datePublished)}</span>
                        <span className="flex align-center gap-1"><Clock size={14} /> 5 min read</span>
                      </div>
                      
                      <h3 style={{ fontSize: '18px', color: 'var(--text-main)', marginBottom: '12px', marginTop: 0, fontWeight: 700, lineHeight: 1.4 }}>
                        {blog.title.length > 60 ? `${blog.title.substring(0, 57)}...` : blog.title}
                      </h3>
                      <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                        {blog.summary.length > 100 ? `${blog.summary.substring(0, 95)}...` : blog.summary}
                      </p>
                    </div>
                  </div>

                  <div style={{ padding: '0 24px 24px 24px' }}>
                    <Link to={`/case-studies/${blog.slug}`} className="flex align-center gap-1" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '13px', textDecoration: 'none' }}>
                      Read Case Study <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass flex flex-column align-center justify-center text-center" style={{ padding: '64px', borderRadius: '24px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px', margin: 0, marginBottom: '20px' }}>
                No success stories have been published for this industry sector yet.
              </p>
              <Link to="/case-studies" className="btn btn-secondary">
                View All Case Studies
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CSS keyframe animations override */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
    </div>
  );
}
