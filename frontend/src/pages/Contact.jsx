import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'ERPNext Setup Demo',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.error) {
          setErrorMsg(data.error);
        } else {
          setSuccessMsg(data.message);
          setFormData({
            name: '',
            email: '',
            phone: '',
            subject: 'ERPNext Setup Demo',
            message: ''
          });
        }
      })
      .catch(err => {
        setLoading(false);
        setErrorMsg('Connection error. Please try again later.');
        console.error('Inquiry Submission Error:', err);
      });
  };

  return (
    <div className="contact-container">
      
      {/* 1. HERO HEADER */}
      <section className="section page-header" style={{ padding: '128px 0 64px 0', background: 'linear-gradient(180deg, var(--bg-card) 0%, var(--bg-app) 100%)', borderBottom: '1px solid var(--border)' }}>
        <div className="container text-center">
          <span style={{ fontSize: '13px', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', padding: '6px 16px', borderRadius: '24px', fontWeight: 600, display: 'inline-block', marginBottom: '16px' }}>
            Get In Touch Today
          </span>
          <h1 style={{ fontSize: '48px', color: 'var(--text-main)', marginBottom: '16px' }}>
            Contact 4C Solutions
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto', fontSize: '16px', lineHeight: 1.6 }}>
            Have questions about ERPNext implementation, custom module creation, or local hosting? Drop us a line and let our experts help you!
          </p>
        </div>
      </section>

      {/* 2. FORM & INFO GRID */}
      <section className="section contact-form-section">
        <div className="container grid grid-2">
          
          {/* Contact Details Card */}
          <div className="flex flex-column gap-6 text-left" style={{ padding: '24px' }}>
            <div>
              <h2 style={{ fontSize: '32px', color: 'var(--text-main)', marginBottom: '16px' }}>Let's Talk Business</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6 }}>
                We are committed to helping MSMEs scale seamlessly. Whether you want to request a free interactive ERPNext demo or discuss complex custom database integrations, we are here to support you.
              </p>
            </div>

            <div className="flex flex-column gap-4">
              
              <a 
                href="https://www.google.com/maps/place/4C+Solutions+-+ERPNext+Services+and+Consultation,+Software+Development/@17.3350179,76.8613332,17z/data=!4m6!3m5!1s0x3bc8c7319ded473b:0x610e34759ec89438!8m2!3d17.3350179!4d76.8613332!16s%2Fg%2F11fr494j74!5m1!1e1?entry=ttu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex align-center gap-4 transition-all duration-300 hover:scale-[1.02]"
                style={{ ...infoRowStyle, textDecoration: 'none', cursor: 'pointer' }}
              >
                <div style={iconBoxStyle}><MapPin size={22} /></div>
                <div>
                  <h4 style={{ fontSize: '15px', color: 'var(--text-main)', fontWeight: 600 }}>Our Office</h4>
                  <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>MIG-22, 1st Phase, Adarsh Nagar, Kalaburagi - 585105, Karnataka</span>
                </div>
              </a>

              <div className="flex align-center gap-4" style={infoRowStyle}>
                <div style={iconBoxStyle}><Mail size={22} /></div>
                <div>
                  <h4 style={{ fontSize: '15px', color: 'var(--text-main)', fontWeight: 600 }}>Email Address</h4>
                  <a href="mailto:info@4csolutions.in" style={{ fontSize: '14px', color: 'var(--text-muted)', textDecoration: 'underline' }}>info@4csolutions.in</a>
                </div>
              </div>

              <div className="flex align-center gap-4" style={infoRowStyle}>
                <div style={iconBoxStyle}><Phone size={22} /></div>
                <div>
                  <h4 style={{ fontSize: '15px', color: 'var(--text-main)', fontWeight: 600 }}>Call Center</h4>
                  <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>+91 98865 79707</span>
                </div>
              </div>

            </div>
          </div>

          {/* Form Interactive Card */}
          <div className="card-item relative" style={{ borderRadius: 'var(--radius-lg)', padding: '40px' }}>
            <h3 style={{ fontSize: '24px', color: 'var(--text-main)', marginBottom: '24px', textAlign: 'left' }}>Send An Inquiry</h3>
            
            {successMsg && (
              <div className="flex align-center gap-2 anim-fade-in" style={{ backgroundColor: 'var(--primary-glow)', border: '1px solid var(--primary)', borderRadius: 'var(--radius-sm)', padding: '16px', marginBottom: '24px', color: 'var(--primary)', textAlign: 'left' }}>
                <CheckCircle2 size={24} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '14px', fontWeight: 500 }}>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="flex align-center gap-2 anim-fade-in" style={{ backgroundColor: 'rgba(231,29,54,0.1)', border: '1px solid var(--error)', borderRadius: 'var(--radius-sm)', padding: '16px', marginBottom: '24px', color: 'var(--error)', textAlign: 'left' }}>
                <AlertCircle size={24} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '14px', fontWeight: 500 }}>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-2" style={{ gap: '16px' }}>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="form-control" placeholder="John Doe" />
                </div>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className="form-control" placeholder="john@example.com" />
                </div>
              </div>

              <div className="grid grid-2" style={{ gap: '16px' }}>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Phone Number (Optional)</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-control" placeholder="+91 9999999999" />
                </div>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Subject</label>
                  <select name="subject" value={formData.subject} onChange={handleChange} className="form-control" style={{ height: '53px' }}>
                    <option value="ERPNext Setup Demo">ERPNext Setup Demo</option>
                    <option value="Custom Module Integration">Custom Module Integration</option>
                    <option value="Cloud Migration / Hosting">Cloud Migration / Hosting</option>
                    <option value="Enterprise Consultancy">Enterprise Consultancy</option>
                    <option value="General Enquiry">General Enquiry</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Detailed Message</label>
                <textarea name="message" value={formData.message} onChange={handleChange} required className="form-control" rows="5" placeholder="Hi, we would like to evaluate ERPNext for our logistics warehouse operations. We want a custom dashboard..." style={{ resize: 'none' }}></textarea>
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary flex align-center justify-center gap-2" style={{ width: '100%', height: '52px' }}>
                {loading ? (
                  <span>Submitting Inquiry...</span>
                ) : (
                  <>
                    Send Message <Send size={16} />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* 3. INTERACTIVE GOOGLE MAPS EMBED */}
      <section className="section map-section animate-fade-in" style={{ padding: '0 0 80px 0' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          <div style={{ textAlign: 'left', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '24px', color: 'var(--text-main)', marginBottom: '8px' }}>Locate Our Office</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Visit us for in-person consultations, interactive product demos, and strategic system discussions.</p>
          </div>
          
          <div style={{ 
            borderRadius: 'var(--radius-lg)', 
            overflow: 'hidden', 
            border: '1px solid var(--border)', 
            boxShadow: 'var(--shadow-md)',
            height: '450px',
            width: '100%',
            position: 'relative',
            backgroundColor: 'var(--bg-card)'
          }}>
            <iframe 
              src="https://maps.google.com/maps?q=4C%20Solutions%20-%20ERPNext%20Services%20and%20Consultation,%20Kalaburagi&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="4C Solutions Office Location Map"
            ></iframe>
          </div>
          <div className="flex justify-center mt-6">
            <a 
              href="https://www.google.com/maps/place/4C+Solutions+-+ERPNext+Services+and+Consultation,+Software+Development/@17.3350179,76.8613332,17z/data=!4m6!3m5!1s0x3bc8c7319ded473b:0x610e34759ec89438!8m2!3d17.3350179!4d76.8613332!16s%2Fg%2F11fr494j74!5m1!1e1?entry=ttu" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-secondary flex align-center gap-2"
              style={{ width: 'fit-content', padding: '12px 28px', fontSize: '14px', textDecoration: 'none', fontWeight: 600 }}
            >
              <MapPin size={16} /> Navigate in Google Maps
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}

const infoRowStyle = {
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-md)',
  padding: '20px',
  boxShadow: 'var(--shadow-sm)',
  width: '100%'
};

const iconBoxStyle = {
  backgroundColor: 'var(--primary-glow)',
  color: 'var(--primary)',
  padding: '12px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0
};
