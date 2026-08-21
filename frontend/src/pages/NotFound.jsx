import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass, Layers, Phone, ArrowRight, HelpCircle } from 'lucide-react';
import SEO from '../components/SEO';

export default function NotFound() {
  return (
    <div className="not-found-page flex flex-column align-center justify-center text-center" style={{ minHeight: '75vh', padding: '120px 24px 80px 24px' }}>
      <SEO
        title="404 - Page Not Found"
        description="The page you are looking for does not exist or has been moved. Explore 4C Solutions ERPNext services, industry verticals, and case studies."
        noIndex={true}
      />

      <div
        className="card-item"
        style={{
          maxWidth: '680px',
          width: '100%',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '48px 32px',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div style={{ display: 'inline-flex', padding: '16px', backgroundColor: 'rgba(231, 29, 54, 0.1)', borderRadius: '50%', color: 'var(--primary)', marginBottom: '20px' }}>
          <HelpCircle size={44} />
        </div>

        <h1 style={{ fontSize: '64px', fontWeight: 900, color: 'var(--primary)', margin: '0 0 8px 0', lineHeight: 1 }}>
          404
        </h1>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px' }}>
          Page Not Found
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6, maxWidth: '480px', margin: '0 auto 32px auto' }}>
          The page or industry solution link you requested might have been moved, renamed, or is temporarily unavailable.
        </p>

        <h3 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '16px', textAlign: 'left' }}>
          Quick Navigation:
        </h3>

        <div className="grid grid-2 gap-3" style={{ marginBottom: '32px', textAlign: 'left' }}>
          <Link
            to="/"
            className="flex align-center gap-3 p-3"
            style={{
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              color: 'var(--text-main)',
              fontSize: '14px',
              fontWeight: 600
            }}
          >
            <Home size={18} style={{ color: 'var(--primary)' }} />
            <span>Home Base</span>
          </Link>

          <Link
            to="/solutions"
            className="flex align-center gap-3 p-3"
            style={{
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              color: 'var(--text-main)',
              fontSize: '14px',
              fontWeight: 600
            }}
          >
            <Layers size={18} style={{ color: 'var(--primary)' }} />
            <span>ERPNext Solutions</span>
          </Link>

          <Link
            to="/whyerpnext"
            className="flex align-center gap-3 p-3"
            style={{
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              color: 'var(--text-main)',
              fontSize: '14px',
              fontWeight: 600
            }}
          >
            <Compass size={18} style={{ color: 'var(--primary)' }} />
            <span>Why ERPNext</span>
          </Link>

          <Link
            to="/contact"
            className="flex align-center gap-3 p-3"
            style={{
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              color: 'var(--text-main)',
              fontSize: '14px',
              fontWeight: 600
            }}
          >
            <Phone size={18} style={{ color: 'var(--primary)' }} />
            <span>Contact Support</span>
          </Link>
        </div>

        <Link to="/" className="btn btn-primary flex align-center justify-center gap-2" style={{ width: '100%', padding: '12px' }}>
          <span>Return to Homepage</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
