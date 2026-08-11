import React, { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { LayoutGrid, Quote, Image, Mail, Plus, Trash2, Edit3, CheckCircle2, AlertCircle, X, BookOpen, Upload, Eye } from 'lucide-react';

export default function AdminDashboard({ token }) {
  const [activeTab, setActiveTab] = useState('inbox');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Data lists
  const [inbox, setInbox] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [logos, setLogos] = useState([]);
  const [blogs, setBlogs] = useState([]);

  // Multiselect state for inbox
  const [selectedEnquiries, setSelectedEnquiries] = useState([]);

  // Modal control states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editItem, setEditItem] = useState(null);

  // Form states
  const [sectorForm, setSectorForm] = useState({ name: '', description: '', icon: 'activity', featuresHeading: 'Tailored ERPNext Modules', featuresSubheading: '', features: '' });
  const [testimonialForm, setTestimonialForm] = useState({ clientName: '', clientPosition: '', companyName: '', feedback: '', sectorId: '' });
  const [logoForm, setLogoForm] = useState({ clientName: '', logoData: '', logoMimeType: 'image/png', websiteUrl: '', sectorId: '', previewUrl: '' });
  const [blogForm, setBlogForm] = useState({ title: '', summary: '', content: '', author: 'S. M. Hashmi', sectorId: '', metaKeywords: '' });

  const fileInputRef = useRef(null);

  // Get token safely
  const localToken = token || localStorage.getItem('adminToken');

  if (!localToken) {
    return <Navigate to="/login" replace />;
  }

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localToken}`
  });

  const fetchAllData = () => {
    setLoading(true);
    setErrorMsg('');
    Promise.all([
      fetch('/api/contact/admin/inbox', { headers: getHeaders() }).then(r => r.json()),
      fetch('/api/sectors').then(r => r.json()),
      fetch('/api/testimonials').then(r => r.json()),
      fetch('/api/logos').then(r => r.json()),
      fetch('/api/blogs').then(r => r.json())
    ])
      .then(([inboxData, sectorsData, testimonialsData, logosData, blogsData]) => {
        setInbox(Array.isArray(inboxData) ? inboxData : []);
        setSectors(Array.isArray(sectorsData) ? sectorsData : []);
        setTestimonials(Array.isArray(testimonialsData) ? testimonialsData : []);
        setLogos(Array.isArray(logosData) ? logosData : []);
        setBlogs(Array.isArray(blogsData) ? blogsData : []);
        setSelectedEnquiries([]);
        setLoading(false);
      })
      .catch(() => {
        setErrorMsg('Failed to load data. Token may be expired.');
        setLoading(false);
      });
  };

  useEffect(() => { fetchAllData(); }, [localToken]);

  const triggerSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Multiselect helper functions
  const toggleSelectAllEnquiries = () => {
    if (selectedEnquiries.length === inbox.length) {
      setSelectedEnquiries([]);
    } else {
      setSelectedEnquiries(inbox.map(m => m._id));
    }
  };

  const toggleSelectEnquiry = (id) => {
    setSelectedEnquiries(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkDeleteEnquiries = () => {
    if (selectedEnquiries.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedEnquiries.length} selected enquiries?`)) return;

    fetch('/api/contact/admin/inbox/bulk-delete', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ ids: selectedEnquiries })
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) setErrorMsg(data.error);
        else {
          triggerSuccess(data.message || `${selectedEnquiries.length} enquiries deleted.`);
          fetchAllData();
        }
      })
      .catch(() => setErrorMsg('Failed to delete selected enquiries.'));
  };

  // Handle logo file pick → convert to base64
  const handleLogoFilePick = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target.result;
      const mime = file.type || 'image/png';
      const base64 = dataUrl.split(',')[1]; // strip data:mime/type;base64, prefix
      setLogoForm(prev => ({ ...prev, logoData: base64, logoMimeType: mime, previewUrl: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  // DELETE dispatcher
  const handleDelete = (type, id) => {
    if (!window.confirm(`Delete this ${type}?`)) return;
    const endpoints = {
      sector: `/api/sectors/${id}`,
      testimonial: `/api/testimonials/${id}`,
      logo: `/api/logos/${id}`,
      blog: `/api/blogs/${id}`,
      enquiry: `/api/contact/admin/inbox/${id}`
    };
    fetch(endpoints[type], { method: 'DELETE', headers: getHeaders() })
      .then(r => r.json())
      .then(data => {
        if (data.error) setErrorMsg(data.error);
        else { triggerSuccess(`${type} deleted.`); fetchAllData(); }
      })
      .catch(console.error);
  };

  // Toggle enquiry status
  const toggleEnquiryStatus = (id, current) => {
    const next = current === 'New' ? 'Read' : current === 'Read' ? 'Replied' : 'New';
    fetch(`/api/contact/admin/inbox/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status: next })
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) setErrorMsg(data.error);
        else { triggerSuccess('Status updated.'); fetchAllData(); }
      });
  };

  // Open modal
  const launchModal = (type, item = null) => {
    setModalType(type);
    setEditItem(item);
    setShowModal(true);

    if (type === 'sector') {
      setSectorForm({
        name: item?.name ?? '',
        description: item?.description ?? '',
        icon: item?.icon ?? 'activity',
        featuresHeading: item?.featuresHeading ?? 'Tailored ERPNext Modules',
        featuresSubheading: item?.featuresSubheading ?? '',
        features: item ? item.features.join('\n') : ''
      });
    } else if (type === 'testimonial') {
      setTestimonialForm({
        clientName: item?.clientName ?? '',
        clientPosition: item?.clientPosition ?? '',
        companyName: item?.companyName ?? '',
        feedback: item?.feedback ?? '',
        sectorId: item?.sector?._id ?? ''
      });
    } else if (type === 'logo') {
      const preview = item ? `data:${item.logoMimeType};base64,${item.logoData}` : '';
      setLogoForm({
        clientName: item?.clientName ?? '',
        logoData: item?.logoData ?? '',
        logoMimeType: item?.logoMimeType ?? 'image/png',
        websiteUrl: item?.websiteUrl ?? '',
        sectorId: item?.sector?._id ?? '',
        previewUrl: preview
      });
    } else if (type === 'blog') {
      setBlogForm({
        title: item?.title ?? '',
        summary: item?.summary ?? '',
        content: item?.content ?? '',
        author: item?.author ?? 'S. M. Hashmi',
        sectorId: item?.sector?._id ?? '',
        metaKeywords: item?.metaKeywords ? item.metaKeywords.join(', ') : ''
      });
    }
  };

  // Submit form
  const handleFormSubmit = (e) => {
    e.preventDefault();
    let body = {};
    let endpoint = '';
    const method = editItem ? 'PUT' : 'POST';

    if (modalType === 'sector') {
      endpoint = editItem ? `/api/sectors/${editItem._id}` : '/api/sectors';
      const featuresArray = sectorForm.features.split('\n').map(f => f.trim()).filter(Boolean);
      body = { ...sectorForm, features: featuresArray };
    } else if (modalType === 'testimonial') {
      endpoint = editItem ? `/api/testimonials/${editItem._id}` : '/api/testimonials';
      body = testimonialForm;
    } else if (modalType === 'logo') {
      endpoint = editItem ? `/api/logos/${editItem._id}` : '/api/logos';
      if (!logoForm.logoData && !editItem) {
        setErrorMsg('Please select a logo image to upload.');
        return;
      }
      body = { clientName: logoForm.clientName, logoData: logoForm.logoData, logoMimeType: logoForm.logoMimeType, websiteUrl: logoForm.websiteUrl, sectorId: logoForm.sectorId };
    } else if (modalType === 'blog') {
      endpoint = editItem ? `/api/blogs/${editItem._id}` : '/api/blogs';
      body = blogForm;
    }

    fetch(endpoint, { method, headers: getHeaders(), body: JSON.stringify(body) })
      .then(r => r.json())
      .then(data => {
        if (data.error) setErrorMsg(data.error);
        else {
          triggerSuccess(`${modalType} saved successfully!`);
          setShowModal(false);
          setEditItem(null);
          fetchAllData();
        }
      })
      .catch(() => setErrorMsg('Error saving data.'));
  };

  // ─── Sidebar nav items ───────────────────────────────────────────────────────
  const navItems = [
    { key: 'inbox', icon: <Mail size={18} />, label: `Inbox (${inbox.filter(m => m.status === 'New').length})` },
    { key: 'sectors', icon: <LayoutGrid size={18} />, label: 'Solutions' },
    { key: 'testimonials', icon: <Quote size={18} />, label: 'Testimonials' },
    { key: 'logos', icon: <Image size={18} />, label: 'Client Logos' },
    { key: 'blogs', icon: <BookOpen size={18} />, label: 'Case Studies' }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', paddingTop: '72px' }}>

      {/* ── FIXED LEFT SIDEBAR ──────────────────────────────────────────────── */}
      <aside style={{
        position: 'fixed',
        top: '72px',
        left: 0,
        bottom: 0,
        width: '240px',
        backgroundColor: 'var(--bg-card)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '28px 16px',
        zIndex: 100,
        overflowY: 'auto'
      }}>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: '20px', paddingLeft: '10px' }}>
          Dashboard Console
        </p>

        {navItems.map(({ key, icon, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '11px 14px',
              borderRadius: '8px',
              border: 'none',
              textAlign: 'left',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              marginBottom: '4px',
              backgroundColor: activeTab === key ? 'var(--primary)' : 'transparent',
              color: activeTab === key ? 'white' : 'var(--text-muted)',
              transition: 'all 0.15s ease'
            }}
          >
            {icon} {label}
          </button>
        ))}
      </aside>

      {/* ── MAIN CONTENT AREA ─────────────────────────────────────────────────── */}
      <main style={{ marginLeft: '240px', flex: 1, padding: '40px 48px', minWidth: 0 }}>

        {/* Toast alerts */}
        {successMsg && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--primary-glow)', border: '1px solid var(--primary)', borderRadius: '8px', padding: '14px 20px', marginBottom: '24px', color: 'var(--primary)' }}>
            <CheckCircle2 size={20} /> <span style={{ fontSize: '14px', fontWeight: 500 }}>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(231,29,54,0.1)', border: '1px solid var(--error)', borderRadius: '8px', padding: '14px 20px', marginBottom: '24px', color: 'var(--error)' }}>
            <AlertCircle size={20} /> <span style={{ fontSize: '14px', fontWeight: 500 }}>{errorMsg}</span>
            <button onClick={() => setErrorMsg('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}><X size={16} /></button>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <span className="spinner" />
            <p style={{ color: 'var(--text-muted)', marginTop: '12px' }}>Loading console data…</p>
          </div>
        ) : (
          <div className="card-item" style={{ padding: '36px', textAlign: 'left' }}>

            {/* ─── INBOX ─────────────────────────────────────────────────────── */}
            {activeTab === 'inbox' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                  <h2 style={{ ...h2Style, margin: 0 }}>Web Form Enquiry Inbox</h2>
                  {selectedEnquiries.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'rgba(231,29,54,0.08)', border: '1px solid rgba(231,29,54,0.2)', padding: '6px 14px', borderRadius: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--error)' }}>
                        {selectedEnquiries.length} selected
                      </span>
                      <button
                        onClick={handleBulkDeleteEnquiries}
                        className="btn btn-danger"
                        style={{ padding: '6px 12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Trash2 size={14} /> Delete Selected
                      </button>
                    </div>
                  )}
                </div>

                {inbox.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)' }}>No messages yet.</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={tableStyle}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--border)' }}>
                          <th style={{ ...thStyle, width: '40px', textAlign: 'center' }}>
                            <input
                              type="checkbox"
                              checked={inbox.length > 0 && selectedEnquiries.length === inbox.length}
                              onChange={toggleSelectAllEnquiries}
                              style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                              title="Select All"
                            />
                          </th>
                          {['Date', 'Client Details', 'Subject', 'Message', 'Status', 'Actions'].map(h => (
                            <th key={h} style={thStyle}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {inbox.map(msg => {
                          const isSelected = selectedEnquiries.includes(msg._id);
                          return (
                            <tr
                              key={msg._id}
                              style={{
                                borderBottom: '1px solid var(--border)',
                                opacity: msg.status === 'Replied' ? 0.6 : 1,
                                backgroundColor: isSelected ? 'var(--primary-glow)' : 'transparent',
                                transition: 'background-color 0.15s ease'
                              }}
                            >
                              <td style={{ ...tdStyle, textAlign: 'center' }}>
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleSelectEnquiry(msg._id)}
                                  style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                                />
                              </td>
                              <td style={tdStyle}>{new Date(msg.createdAt).toLocaleDateString()}</td>
                              <td style={tdStyle}>
                                <div style={{ fontWeight: 600 }}>{msg.name}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{msg.email}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{msg.phone || '—'}</div>
                              </td>
                              <td style={tdStyle}>{msg.subject}</td>
                              <td style={{ ...tdStyle, maxWidth: '220px', wordBreak: 'break-word' }}>{msg.message}</td>
                              <td style={tdStyle}>
                                <button
                                  onClick={() => toggleEnquiryStatus(msg._id, msg.status)}
                                  style={{
                                    padding: '4px 10px', fontSize: '11px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                                    backgroundColor: msg.status === 'New' ? 'var(--primary)' : msg.status === 'Read' ? 'var(--warning)' : 'var(--border)',
                                    color: msg.status === 'New' ? 'white' : 'var(--text-main)'
                                  }}
                                >{msg.status}</button>
                              </td>
                              <td style={tdStyle}>
                                <button onClick={() => handleDelete('enquiry', msg._id)} className="btn btn-danger" style={{ padding: '6px 10px' }} title="Delete">
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ─── SECTORS ────────────────────────────────────────────────────── */}
            {activeTab === 'sectors' && (
              <div>
                <div style={sectionHeaderStyle}>
                  <h2 style={h2Style}>Manage Sectors (Solutions)</h2>
                  <button onClick={() => launchModal('sector')} className="btn btn-primary" style={addBtnStyle}>
                    <Plus size={16} /> Add Sector
                  </button>
                </div>
                {sectors.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No sectors yet.</p> : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={tableStyle}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--border)' }}>
                          {['Solution Name', 'Description', 'Icon', 'Features Count', 'Actions'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {sectors.map(sec => (
                          <tr key={sec._id} style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ ...tdStyle, fontWeight: 600 }}>{sec.name}</td>
                            <td style={{ ...tdStyle, maxWidth: '260px' }}>{sec.description.substring(0, 90)}…</td>
                            <td style={tdStyle}><code>{sec.icon}</code></td>
                            <td style={tdStyle}>{sec.features.length} features</td>
                            <td style={tdStyle}>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => launchModal('sector', sec)} className="btn btn-secondary" style={{ padding: '6px 10px' }}><Edit3 size={14} /></button>
                                <button onClick={() => handleDelete('sector', sec._id)} className="btn btn-danger" style={{ padding: '6px 10px' }}><Trash2 size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ─── TESTIMONIALS ───────────────────────────────────────────────── */}
            {activeTab === 'testimonials' && (
              <div>
                <div style={sectionHeaderStyle}>
                  <h2 style={h2Style}>Manage Client Testimonials</h2>
                  <button onClick={() => launchModal('testimonial')} className="btn btn-primary" style={addBtnStyle}>
                    <Plus size={16} /> Add Testimonial
                  </button>
                </div>
                {testimonials.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No testimonials yet.</p> : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={tableStyle}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--border)' }}>
                          {['Client', 'Feedback', 'Solution', 'Actions'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {testimonials.map(t => (
                          <tr key={t._id} style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={tdStyle}>
                              <div style={{ fontWeight: 600 }}>{t.clientName}</div>
                              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.clientPosition}, {t.companyName}</div>
                            </td>
                            <td style={{ ...tdStyle, maxWidth: '280px' }}>"{t.feedback}"</td>
                            <td style={tdStyle}>{t.sector?.name || 'General'}</td>
                            <td style={tdStyle}>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => launchModal('testimonial', t)} className="btn btn-secondary" style={{ padding: '6px 10px' }}><Edit3 size={14} /></button>
                                <button onClick={() => handleDelete('testimonial', t._id)} className="btn btn-danger" style={{ padding: '6px 10px' }}><Trash2 size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ─── LOGOS ──────────────────────────────────────────────────────── */}
            {activeTab === 'logos' && (
              <div>
                <div style={sectionHeaderStyle}>
                  <h2 style={h2Style}>Manage Client Logos</h2>
                  <button onClick={() => launchModal('logo')} className="btn btn-primary" style={addBtnStyle}>
                    <Plus size={16} /> Add Logo
                  </button>
                </div>
                {logos.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No logos yet.</p> : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginTop: '16px' }}>
                    {logos.map(logo => (
                      <div key={logo._id} style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', textAlign: 'center', backgroundColor: 'var(--bg-app)' }}>
                        {logo.logoData ? (
                          <img
                            src={`data:${logo.logoMimeType};base64,${logo.logoData}`}
                            alt={logo.clientName}
                            style={{ maxHeight: '60px', maxWidth: '100%', objectFit: 'contain', marginBottom: '10px' }}
                          />
                        ) : (
                          <div style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>No image</span>
                          </div>
                        )}
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>{logo.clientName}</div>
                        {logo.sector && (
                          <div style={{ fontSize: '11px', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '10px', display: 'inline-block', marginBottom: '4px' }}>
                            {logo.sector.name}
                          </div>
                        )}
                        {logo.websiteUrl && <div style={{ fontSize: '11px', color: 'var(--text-muted)', wordBreak: 'break-all', marginTop: '2px' }}>{logo.websiteUrl}</div>}
                        <div style={{ display: 'flex', gap: '8px', marginTop: '10px', justifyContent: 'center' }}>
                          <button onClick={() => launchModal('logo', logo)} className="btn btn-secondary" style={{ padding: '5px 10px' }}><Edit3 size={13} /></button>
                          <button onClick={() => handleDelete('logo', logo._id)} className="btn btn-danger" style={{ padding: '5px 10px' }}><Trash2 size={13} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─── BLOGS ──────────────────────────────────────────────────────── */}
            {activeTab === 'blogs' && (
              <div>
                <div style={sectionHeaderStyle}>
                  <h2 style={h2Style}>Manage Case Studies & Blog Posts</h2>
                  <button onClick={() => launchModal('blog')} className="btn btn-primary" style={addBtnStyle}>
                    <Plus size={16} /> Publish Post
                  </button>
                </div>
                {blogs.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No posts yet.</p> : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={tableStyle}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--border)' }}>
                          {['Title', 'Summary', 'Industry', 'Author & Date', 'Actions'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {blogs.map(b => (
                          <tr key={b._id} style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ ...tdStyle, fontWeight: 600 }}>{b.title}</td>
                            <td style={{ ...tdStyle, maxWidth: '220px' }}>{b.summary}</td>
                            <td style={tdStyle}>{b.sector?.name || 'General'}</td>
                            <td style={tdStyle}>
                              <div>{b.author}</div>
                              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{new Date(b.datePublished).toLocaleDateString()}</div>
                            </td>
                            <td style={tdStyle}>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => launchModal('blog', b)} className="btn btn-secondary" style={{ padding: '6px 10px' }}><Edit3 size={14} /></button>
                                <button onClick={() => handleDelete('blog', b._id)} className="btn btn-danger" style={{ padding: '6px 10px' }}><Trash2 size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

          </div>
        )}
      </main>

      {/* ── MODAL ─────────────────────────────────────────────────────────────── */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.65)', zIndex: 20000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div className="glass anim-fade-in" style={{ backgroundColor: 'var(--bg-card)', padding: '40px', borderRadius: '16px', maxWidth: '720px', width: '100%', position: 'relative', maxHeight: '90vh', overflowY: 'auto', textAlign: 'left' }}>
            <button onClick={() => { setShowModal(false); setEditItem(null); setErrorMsg(''); }} style={{ position: 'absolute', top: '18px', right: '18px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <X size={22} />
            </button>

            <h2 style={{ fontSize: '22px', color: 'var(--text-main)', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              {editItem ? 'Edit' : 'Create New'} {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
            </h2>

            <form onSubmit={handleFormSubmit}>

              {/* SECTOR FORM */}
              {modalType === 'sector' && (
                <div>
                  <div className="form-group">
                    <label className="form-label">Sector / Solution Name</label>
                    <input type="text" value={sectorForm.name} onChange={e => setSectorForm({ ...sectorForm, name: e.target.value })} required className="form-control" placeholder="HEALTHCARE" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea value={sectorForm.description} onChange={e => setSectorForm({ ...sectorForm, description: e.target.value })} required className="form-control" rows="3" placeholder="Brief description…" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Lucide Icon Name</label>
                    <input type="text" value={sectorForm.icon} onChange={e => setSectorForm({ ...sectorForm, icon: e.target.value })} required className="form-control" placeholder="activity, scale, truck, briefcase…" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Features Section Heading</label>
                    <input type="text" value={sectorForm.featuresHeading} onChange={e => setSectorForm({ ...sectorForm, featuresHeading: e.target.value })} className="form-control" placeholder="Tailored ERPNext Modules, Core Features & Capabilities..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Features Subheading / Description</label>
                    <textarea value={sectorForm.featuresSubheading} onChange={e => setSectorForm({ ...sectorForm, featuresSubheading: e.target.value })} className="form-control" rows="2" placeholder="Leave empty for auto-generated description..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Features <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(one per line)</span></label>
                    <textarea
                      value={sectorForm.features}
                      onChange={e => setSectorForm({ ...sectorForm, features: e.target.value })}
                      className="form-control"
                      rows="8"
                      placeholder={"Patient Registration\nAppointment Scheduling\nBilling & Insurance Claims\nPharmacy Management"}
                      style={{ fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.6' }}
                    />
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>Enter each feature on its own line. No commas needed.</p>
                  </div>
                </div>
              )}

              {/* TESTIMONIAL FORM */}
              {modalType === 'testimonial' && (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Client Name</label>
                      <input type="text" value={testimonialForm.clientName} onChange={e => setTestimonialForm({ ...testimonialForm, clientName: e.target.value })} required className="form-control" placeholder="Dr. Abdul Qadir" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Client Position</label>
                      <input type="text" value={testimonialForm.clientPosition} onChange={e => setTestimonialForm({ ...testimonialForm, clientPosition: e.target.value })} required className="form-control" placeholder="Medical Director" />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Company Name</label>
                      <input type="text" value={testimonialForm.companyName} onChange={e => setTestimonialForm({ ...testimonialForm, companyName: e.target.value })} required className="form-control" placeholder="Adarsh Clinic" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Associated Sector</label>
                      <select value={testimonialForm.sectorId} onChange={e => setTestimonialForm({ ...testimonialForm, sectorId: e.target.value })} className="form-control" style={{ height: '53px' }}>
                        <option value="">General Review</option>
                        {sectors.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Testimonial Feedback</label>
                    <textarea value={testimonialForm.feedback} onChange={e => setTestimonialForm({ ...testimonialForm, feedback: e.target.value })} required className="form-control" rows="4" placeholder="Their ERPNext implementation transformed our operations…" />
                  </div>
                </div>
              )}

              {/* LOGO FORM */}
              {modalType === 'logo' && (
                <div>
                  <div className="form-group">
                    <label className="form-label">Client Name</label>
                    <input type="text" value={logoForm.clientName} onChange={e => setLogoForm({ ...logoForm, clientName: e.target.value })} required className="form-control" placeholder="SLA Group" />
                  </div>

                  {/* Image Upload Area */}
                  <div className="form-group">
                    <label className="form-label">Logo Image</label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        border: '2px dashed var(--border)',
                        borderRadius: '12px',
                        padding: '24px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: 'var(--bg-app)',
                        transition: 'border-color 0.15s',
                        position: 'relative'
                      }}
                    >
                      {logoForm.previewUrl ? (
                        <div>
                          <img src={logoForm.previewUrl} alt="Preview" style={{ maxHeight: '80px', maxWidth: '100%', objectFit: 'contain', marginBottom: '10px' }} />
                          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Click to change image</p>
                        </div>
                      ) : (
                        <div>
                          <Upload size={32} style={{ color: 'var(--text-muted)', marginBottom: '10px' }} />
                          <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>Click to upload logo image</p>
                          <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px' }}>PNG, JPG, SVG, WebP supported</p>
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoFilePick}
                      style={{ display: 'none' }}
                    />
                    {!logoForm.logoData && editItem && (
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                        <Eye size={12} style={{ display: 'inline', marginRight: '4px' }} />
                        Leave empty to keep the existing logo image.
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Assigned Sector</label>
                      <select
                        value={logoForm.sectorId}
                        onChange={e => setLogoForm({ ...logoForm, sectorId: e.target.value })}
                        className="form-control"
                        style={{ height: '53px' }}
                      >
                        <option value="">All Sectors / General</option>
                        {sectors.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Client Website URL (Optional)</label>
                      <input type="url" value={logoForm.websiteUrl} onChange={e => setLogoForm({ ...logoForm, websiteUrl: e.target.value })} className="form-control" placeholder="https://sla.in" />
                    </div>
                  </div>
                </div>
              )}

              {/* BLOG / CASE STUDY FORM */}
              {modalType === 'blog' && (
                <div>
                  <div className="form-group">
                    <label className="form-label">Case Study Title</label>
                    <input type="text" value={blogForm.title} onChange={e => setBlogForm({ ...blogForm, title: e.target.value })} required className="form-control" placeholder="Case Study: Automating Clinic Operations with ERPNext" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Summary</label>
                      <input type="text" value={blogForm.summary} onChange={e => setBlogForm({ ...blogForm, summary: e.target.value })} required className="form-control" placeholder="Brief summary…" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Associated Sector</label>
                      <select value={blogForm.sectorId} onChange={e => setBlogForm({ ...blogForm, sectorId: e.target.value })} className="form-control" style={{ height: '53px' }}>
                        <option value="">General Post</option>
                        {sectors.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">SEO / AEO Meta Keywords <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(comma-separated)</span></label>
                    <input type="text" value={blogForm.metaKeywords} onChange={e => setBlogForm({ ...blogForm, metaKeywords: e.target.value })} className="form-control" placeholder="healthcare erp, hospital software, erpnext healthcare…" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Rich Content <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Markdown supported)</span></label>
                    <textarea value={blogForm.content} onChange={e => setBlogForm({ ...blogForm, content: e.target.value })} required className="form-control" rows="14" placeholder={"# Heading\n## Subheading\n\nUse **bold**, *italic*, or:\n- Bullet list item\n- Another item"} style={{ fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.5' }} />
                  </div>
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '50px', marginTop: '16px', fontSize: '15px' }}>
                Save &amp; Publish
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// Shared style tokens
const h2Style = { fontSize: '22px', color: 'var(--text-main)', marginBottom: '24px' };
const sectionHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' };
const addBtnStyle = { display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', fontSize: '14px' };

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  textAlign: 'left',
  fontSize: '14px'
};

const thStyle = {
  padding: '14px 12px',
  color: 'var(--text-main)',
  fontWeight: 600,
  whiteSpace: 'nowrap'
};

const tdStyle = {
  padding: '14px 12px',
  color: 'var(--text-muted)',
  verticalAlign: 'middle'
};
