import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Cpu, HeartHandshake, BadgePercent, ArrowRight, Library, HardDrive, DollarSign, RefreshCw } from 'lucide-react';

export default function WhyERPNext() {
  const modules = [
    { title: 'Financial Accounting', icon: <DollarSign size={24} />, desc: 'Real-time bookkeeping, automated general ledger, tax accounts reconciliation, asset depreciation tracking, and multi-currency billing.' },
    { title: 'Procurement & Sales', icon: <HeartHandshake size={24} />, desc: 'Automate sales orders, request for quotations (RFQs), supplier agreements, dynamic pricing rules, and seamless customer invoicing.' },
    { title: 'Supply Chain & Inventory', icon: <Cpu size={24} />, desc: 'Multi-warehouse stock control, automated reorder thresholds, batch and serial tracking, FIFO valuations, and real-time shipping logs.' },
    { title: 'HR & Payroll', icon: <BadgePercent size={24} />, desc: 'Manage complete employee lifecycle, biometric attendance integration, leave allocations, dynamic tax tables, and direct bank payroll ledger exports.' }
  ];

  return (
    <div className="whyerpnext-container">
      
      {/* 1. HERO HEADER */}
      <section className="section page-header" style={{ padding: '128px 0 64px 0', background: 'linear-gradient(180deg, var(--bg-card) 0%, var(--bg-app) 100%)', borderBottom: '1px solid var(--border)' }}>
        <div className="container text-center">
          <span style={{ fontSize: '13px', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', padding: '6px 16px', borderRadius: '24px', fontWeight: 600, display: 'inline-block', marginBottom: '16px' }}>
            Unifying Business Operations
          </span>
          <h1 style={{ fontSize: '48px', color: 'var(--text-main)', marginBottom: '16px' }}>
            Why Choose <span style={{ color: 'var(--primary)' }}>ERPNext</span> for Your Business?
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto', fontSize: '16px', lineHeight: 1.6 }}>
            At 4C Solutions, we believe that unified businesses are successful businesses. We advocate for ERPNext as the ultimate open-source system that drives massive efficiency improvements.
          </p>
        </div>
      </section>

      {/* 2. CORE BENEFITS GRID */}
      <section className="section core-benefits">
        <div className="container">
          <div className="grid grid-2 align-center">
            <div className="text-left anim-slide-left">
              <h2 style={{ fontSize: '32px', color: 'var(--text-main)', marginBottom: '20px' }}>
                Unified Integration of All Processes
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '16px', lineHeight: 1.7, marginBottom: '24px' }}>
                Imagine sunsetting multiple disparate desktop software. ERPNext integrates every critical component—Accounting, CRM, HR & Payroll, Procurement, Warehouses, Projects, and Shipping—under a single cloud terminal. 
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '16px', lineHeight: 1.7, marginBottom: '32px' }}>
                With a unified platform, data flows instantly: a completed shipment automatically triggers warehouse updates, posts accounts receivable entries, and alerts the customer relationship manager in real-time.
              </p>
              <Link to="/contact" className="btn btn-primary">
                Consult with an Expert <ArrowRight size={18} />
              </Link>
            </div>
            
            <div className="flex flex-column gap-4 anim-slide-right">
              {modules.map((mod, idx) => (
                <div key={idx} className="glass" style={{ display: 'flex', gap: '20px', padding: '24px', borderRadius: 'var(--radius-md)', textAlign: 'left' }}>
                  <div style={{ backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', padding: '12px', borderRadius: '8px', height: 'fit-content' }}>
                    {mod.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', color: 'var(--text-main)', marginBottom: '8px' }}>{mod.title}</h3>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{mod.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. COST COMPARISON INFOGRAPHIC */}
      <section className="section cost-infographic" style={{ backgroundColor: 'var(--bg-app)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '64px' }}>
            <h2 style={{ fontSize: '36px', marginBottom: '16px' }}>Cost-Effective Solution With No License Fees</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '580px', margin: '0 auto' }}>
              proprietary legacy systems burden growing companies with expensive licensing. ERPNext changes the equation.
            </p>
          </div>

          <div className="grid grid-2 gap-6" style={{ alignItems: 'stretch' }}>
            
            {/* Box 1: ERPNext Zero License */}
            <div className="card-item flex flex-column justify-between" style={{ borderLeft: '4px solid var(--primary)', textAlign: 'left' }}>
              <div>
                <span style={{ color: 'var(--primary)', fontSize: '48px', fontWeight: 800, display: 'block', marginBottom: '8px' }}>$0</span>
                <h3 style={{ fontSize: '20px', color: 'var(--text-main)', marginBottom: '12px' }}>ERPNext Open Source Model</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6, marginBottom: '20px' }}>
                  ERPNext is 100% open-source software. You save completely on recurring user license costs, enabling unlimited scaling for all administrators, warehouse handlers, and project supervisors.
                </p>
              </div>
              <div style={{ backgroundColor: 'var(--primary-glow)', padding: '12px 18px', borderRadius: '8px', color: 'var(--primary)', fontWeight: 600, fontSize: '14px' }}>
                ✓ Only pay for Implementation & Cloud Hosting.
              </div>
            </div>

            {/* Box 2: Traditional ERP Costs */}
            <div className="card-item flex flex-column justify-between" style={{ borderLeft: '4px solid var(--error)', textAlign: 'left' }}>
              <div>
                <span style={{ color: 'var(--error)', fontSize: '48px', fontWeight: 800, display: 'block', marginBottom: '8px' }}>$$$$</span>
                <h3 style={{ fontSize: '20px', color: 'var(--text-main)', marginBottom: '12px' }}>Legacy Proprietary ERPs</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6, marginBottom: '20px' }}>
                  Traditional ERP systems charge expensive monthly subscription fees per user seat. As your company hires more managers and dispatch workers, license costs explode exponentially.
                </p>
              </div>
              <div style={{ backgroundColor: 'rgba(231,29,54,0.1)', padding: '12px 18px', borderRadius: '8px', color: 'var(--error)', fontWeight: 600, fontSize: '14px' }}>
                ✗ Expensive annual renewals & vendor lock-in.
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. OTHER HIGHLIGHTS */}
      <section className="section highlights-grid">
        <div className="container">
          <div className="grid grid-3">
            
            <div className="card-item text-center flex flex-column align-center">
              <div style={iconContainerStyle}>
                <HardDrive size={24} style={{ color: 'var(--primary)' }} />
              </div>
              <h3 style={{ fontSize: '18px', color: 'var(--text-main)', marginBottom: '12px' }}>Secure Cloud Hosting</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Host your solution in real-time on highly secure, automated server backups. Access business analytics, dispatch status, and purchase orders from anywhere.
              </p>
            </div>

            <div className="card-item text-center flex flex-column align-center">
              <div style={iconContainerStyle}>
                <RefreshCw size={24} style={{ color: 'var(--primary)' }} />
              </div>
              <h3 style={{ fontSize: '18px', color: 'var(--text-main)', marginBottom: '12px' }}>Optimized Process Automation</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Automate your core procurement alerts, recurring billing invoices, driver Ledgers, and bank reconciliations to eliminate costly human data entry mistakes.
              </p>
            </div>

            <div className="card-item text-center flex flex-column align-center">
              <div style={iconContainerStyle}>
                <ShieldAlert size={24} style={{ color: 'var(--primary)' }} />
              </div>
              <h3 style={{ fontSize: '18px', color: 'var(--text-main)', marginBottom: '12px' }}>Full Customization Agility</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Open source means custom logic. Create your own sector documents, print templates, and API integrations with external local government modules seamlessly.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}

const iconContainerStyle = {
  backgroundColor: 'var(--primary-glow)',
  padding: '16px',
  borderRadius: '50%',
  width: 'fit-content',
  marginBottom: '20px'
};
