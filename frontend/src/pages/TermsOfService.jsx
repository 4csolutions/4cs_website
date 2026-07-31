import React, { useEffect } from 'react';
import { Scale } from 'lucide-react';

export default function TermsOfService() {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'Terms of Service | 4C Solutions';

    let metaDescEl = document.querySelector('meta[name="description"]');
    let originalDesc = '';
    if (metaDescEl) {
      originalDesc = metaDescEl.getAttribute('content') || '';
      metaDescEl.setAttribute('content', 'Terms of Service for 4C Solutions. Review our service level agreements, consulting terms, and licensing policies.');
    }

    return () => {
      document.title = originalTitle;
      if (metaDescEl && originalDesc) metaDescEl.setAttribute('content', originalDesc);
    };
  }, []);

  return (
    <div className="terms-container" style={{ padding: '120px 24px 80px 24px', maxWidth: '800px', margin: '0 auto' }}>
      <div className="card-item" style={{ padding: '40px', borderRadius: 'var(--radius-lg)', textAlign: 'left' }}>
        <div className="flex align-center gap-3" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '20px', marginBottom: '32px' }}>
          <Scale size={36} style={{ color: 'var(--primary)' }} />
          <h1 style={{ fontSize: '32px', color: 'var(--text-main)', margin: 0 }}>Terms of Service</h1>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>
          Last Updated: July 31, 2026
        </p>

        <section style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '20px', color: 'var(--text-main)', marginBottom: '12px' }}>1. Scope of Service</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6 }}>
            4C Solutions provides ERPNext integration, implementation consulting, customized Frappe applications, data migration, and technical training. All services are governed by signed Service Level Agreements (SLAs).
          </p>
        </section>

        <section style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '20px', color: 'var(--text-main)', marginBottom: '12px' }}>2. Open Source Licensing</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6 }}>
            ERPNext and the Frappe framework are distributed under GNU GPL v3 or other open-source licenses. Clients own their database contents, configuration files, and custom components according to their SLA.
          </p>
        </section>

        <section style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '20px', color: 'var(--text-main)', marginBottom: '12px' }}>3. Limitation of Liability</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6 }}>
            4C Solutions works to ensure database integrity and secure installations but is not liable for data loss or operational down-times arising from hosting environments, network failures, or unapproved custom scripts.
          </p>
        </section>
      </div>
    </div>
  );
}
