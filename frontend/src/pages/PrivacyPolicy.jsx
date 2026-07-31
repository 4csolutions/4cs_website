import React, { useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyPolicy() {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'Privacy Policy | 4C Solutions';

    let metaDescEl = document.querySelector('meta[name="description"]');
    let originalDesc = '';
    if (metaDescEl) {
      originalDesc = metaDescEl.getAttribute('content') || '';
      metaDescEl.setAttribute('content', 'Privacy Policy for 4C Solutions. Learn how we collect, protect, and handle your corporate and master data.');
    }

    return () => {
      document.title = originalTitle;
      if (metaDescEl && originalDesc) metaDescEl.setAttribute('content', originalDesc);
    };
  }, []);

  return (
    <div className="privacy-container" style={{ padding: '120px 24px 80px 24px', maxWidth: '800px', margin: '0 auto' }}>
      <div className="card-item" style={{ padding: '40px', borderRadius: 'var(--radius-lg)', textAlign: 'left' }}>
        <div className="flex align-center gap-3" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '20px', marginBottom: '32px' }}>
          <ShieldCheck size={36} style={{ color: 'var(--primary)' }} />
          <h1 style={{ fontSize: '32px', color: 'var(--text-main)', margin: 0 }}>Privacy Policy</h1>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>
          Last Updated: July 31, 2026
        </p>

        <section style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '20px', color: 'var(--text-main)', marginBottom: '12px' }}>1. Information We Collect</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6 }}>
            We only collect company information, name, email address, and phone number when you submit a demo request or a consultation form. We do not sell or rent this information to third parties.
          </p>
        </section>

        <section style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '20px', color: 'var(--text-main)', marginBottom: '12px' }}>2. Data Migration & Security</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6 }}>
            During ERPNext database migrations, client master data (e.g., customers, ledgers, items list) is handled under strict non-disclosure agreements (NDAs) and transferred securely to local or dedicated cloud instances.
          </p>
        </section>

        <section style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '20px', color: 'var(--text-main)', marginBottom: '12px' }}>3. Contact Us</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6 }}>
            If you have any questions about this Privacy Policy, please contact us at info@4csolutions.in.
          </p>
        </section>
      </div>
    </div>
  );
}
