import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [selectedSectorId, setSelectedSectorId] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'ERPNext Case Studies & Success Stories | 4C Solutions';

    let metaDescEl = document.querySelector('meta[name="description"]');
    let originalDesc = '';
    if (metaDescEl) {
      originalDesc = metaDescEl.getAttribute('content') || '';
      metaDescEl.setAttribute('content', 'Explore our collection of ERPNext case studies. Learn how we optimize logistics fleet management, medical invoicing, law firm document systems, and contracting budgeting.');
    }

    let metaKeywordsEl = document.querySelector('meta[name="keywords"]');
    let originalKeywords = '';
    if (metaKeywordsEl) {
      originalKeywords = metaKeywordsEl.getAttribute('content') || '';
      metaKeywordsEl.setAttribute('content', 'erpnext case studies, erpnext success stories, healthcare erp results, logistics fleet optimization case study');
    }

    return () => {
      document.title = originalTitle;
      if (metaDescEl && originalDesc) metaDescEl.setAttribute('content', originalDesc);
      if (metaKeywordsEl && originalKeywords) metaKeywordsEl.setAttribute('content', originalKeywords);
    };
  }, []);

  useEffect(() => {
    // 1. Fetch Blogs
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => {
        setBlogs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching blogs:', err);
        setLoading(false);
      });

    // 2. Fetch Sectors for Filter buttons
    fetch('/api/sectors')
      .then(res => res.json())
      .then(data => setSectors(data))
      .catch(err => console.error('Error fetching sectors:', err));
  }, []);

  const filteredBlogs = selectedSectorId === 'all'
    ? blogs
    : blogs.filter(blog => blog.sector && blog.sector._id === selectedSectorId);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bloglist-container">
      
      {/* 1. HERO HEADER */}
      <section className="section page-header" style={{ padding: '128px 0 64px 0', background: 'linear-gradient(180deg, var(--bg-card) 0%, var(--bg-app) 100%)', borderBottom: '1px solid var(--border)' }}>
        <div className="container text-center">
          <span style={{ fontSize: '13px', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', padding: '6px 16px', borderRadius: '24px', fontWeight: 600, display: 'inline-block', marginBottom: '16px' }}>
            ERPNext Customer Success Stories
          </span>
          <h1 style={{ fontSize: '48px', color: 'var(--text-main)', marginBottom: '16px' }}>
            Success Case Studies
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto', fontSize: '16px', lineHeight: 1.6 }}>
            Explore how 4C Solutions engineered successful digital transformations for businesses, improving fleet logs, clinic billing, and project budgets.
          </p>
        </div>
      </section>

      {/* 2. LIVE FILTER TABS */}
      <section style={{ backgroundColor: 'var(--bg-card)', padding: '24px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container flex justify-center wrap gap-2">
          <button
            onClick={() => setSelectedSectorId('all')}
            className={`btn`}
            style={{
              padding: '8px 20px',
              fontSize: '14px',
              backgroundColor: selectedSectorId === 'all' ? 'var(--primary)' : 'var(--bg-app)',
              color: selectedSectorId === 'all' ? 'white' : 'var(--text-main)',
              borderRadius: '24px'
            }}
          >
            All Industries
          </button>
          
          {sectors.map((sec) => (
            <button
              key={sec._id}
              onClick={() => setSelectedSectorId(sec._id)}
              className={`btn`}
              style={{
                padding: '8px 20px',
                fontSize: '14px',
                backgroundColor: selectedSectorId === sec._id ? 'var(--primary)' : 'var(--bg-app)',
                color: selectedSectorId === sec._id ? 'white' : 'var(--text-main)',
                borderRadius: '24px'
              }}
            >
              {sec.name}
            </button>
          ))}
        </div>
      </section>

      {/* 3. CASE STUDIES GRID */}
      <section className="section blogs-grid-section">
        <div className="container">
          
          {loading ? (
            <div className="text-center" style={{ padding: '64px 0' }}>
              <span className="spinner"></span>
              <p style={{ color: 'var(--text-muted)', marginTop: '12px' }}>Loading case studies...</p>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center" style={{ padding: '64px 0', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>No case studies published yet for this sector.</p>
            </div>
          ) : (
            <div className="grid grid-3">
              {filteredBlogs.map((blog) => (
                <article key={blog._id} className="card-item flex flex-column justify-between text-left" style={{ minHeight: '380px' }}>
                  <div>
                    {/* Sector Tag badge */}
                    {blog.sector && (
                      <span style={{ fontSize: '11px', fontWeight: 600, backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '12px', display: 'inline-block', marginBottom: '16px', textTransform: 'uppercase' }}>
                        {blog.sector.name}
                      </span>
                    )}

                    <h3 style={{ fontSize: '20px', color: 'var(--text-main)', marginBottom: '12px', lineHeight: 1.3 }}>
                      {blog.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
                      {blog.summary}
                    </p>
                  </div>

                  <div>
                    {/* Meta information */}
                    <div className="flex align-center gap-4" style={{ fontSize: '12px', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '16px', marginBottom: '20px' }}>
                      <span className="flex align-center gap-1"><Calendar size={14} /> {formatDate(blog.datePublished)}</span>
                      <span className="flex align-center gap-1"><User size={14} /> {blog.author}</span>
                    </div>

                    <Link to={`/case-studies/${blog.slug}`} className="btn btn-primary flex align-center justify-center gap-1" style={{ width: '100%', padding: '10px 16px', fontSize: '14px' }}>
                      Read Case Study <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

        </div>
      </section>

    </div>
  );
}
