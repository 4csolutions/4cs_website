import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { LayoutGrid, Quote, Tag, Image, Mail, ArrowRight, Plus, Trash2, Edit3, CheckCircle2, AlertCircle, X } from 'lucide-react';

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

  // Modal control states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'sector', 'testimonial', 'logo', 'blog'
  const [editItem, setEditItem] = useState(null); // Item to edit, null for create

  // Form states
  const [sectorForm, setSectorForm] = useState({ name: '', description: '', icon: 'activity', features: '' });
  const [testimonialForm, setTestimonialForm] = useState({ clientName: '', clientPosition: '', companyName: '', feedback: '', sectorId: '' });
  const [logoForm, setLogoForm] = useState({ clientName: '', logoPath: '', websiteUrl: '' });
  const [blogForm, setBlogForm] = useState({ title: '', summary: '', content: '', author: 'S. M. Hashmi', sectorId: '', metaKeywords: '' });

  // Get token safely
  const localToken = token || localStorage.getItem('adminToken');

  // Verify access
  if (!localToken) {
    return <Navigate to="/login" replace />;
  }

  // Helper fetch Headers
  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localToken}`
  });

  // Fetch all dashboard datasets
  const fetchAllData = () => {
    setLoading(true);
    setErrorMsg('');
    
    Promise.all([
      fetch('/api/contact/admin/inbox', { headers: getHeaders() }).then(res => res.json()),
      fetch('/api/sectors').then(res => res.json()),
      fetch('/api/testimonials').then(res => res.json()),
      fetch('/api/logos').then(res => res.json()),
      fetch('/api/blogs').then(res => res.json())
    ])
      .then(([inboxData, sectorsData, testimonialsData, logosData, blogsData]) => {
        setInbox(Array.isArray(inboxData) ? inboxData : []);
        setSectors(Array.isArray(sectorsData) ? sectorsData : []);
        setTestimonials(Array.isArray(testimonialsData) ? testimonialsData : []);
        setLogos(Array.isArray(logosData) ? logosData : []);
        setBlogs(Array.isArray(blogsData) ? blogsData : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching dashboard datasets:', err);
        setErrorMsg('Failed to load data. Token might be expired.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAllData();
  }, [localToken]);

  // Flash temporary success toast
  const triggerSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // 1. DELETE ACTION DISPATCHER
  const handleDelete = (type, id) => {
    if (!window.confirm(`Are you absolutely sure you want to delete this ${type}?`)) return;

    let endpoint = '';
    if (type === 'sector') endpoint = `/api/sectors/${id}`;
    else if (type === 'testimonial') endpoint = `/api/testimonials/${id}`;
    else if (type === 'logo') endpoint = `/api/logos/${id}`;
    else if (type === 'blog') endpoint = `/api/blogs/${id}`;
    else if (type === 'enquiry') endpoint = `/api/contact/admin/inbox/${id}`;

    fetch(endpoint, {
      method: 'DELETE',
      headers: getHeaders()
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setErrorMsg(data.error);
        } else {
          triggerSuccess(`${type.toUpperCase()} deleted successfully!`);
          fetchAllData();
        }
      })
      .catch(err => console.error(err));
  };

  // 2. TOGGLE ENQUIRY INBOX STATUS
  const toggleEnquiryStatus = (id, currentStatus) => {
    const nextStatus = currentStatus === 'New' ? 'Read' : currentStatus === 'Read' ? 'Replied' : 'New';
    
    fetch(`/api/contact/admin/inbox/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status: nextStatus })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setErrorMsg(data.error);
        } else {
          triggerSuccess('Inbox status updated successfully!');
          fetchAllData();
        }
      })
      .catch(err => console.error(err));
  };

  // 3. LAUNCH CREATE/EDIT DIALOG
  const launchModal = (type, item = null) => {
    setModalType(type);
    setEditItem(item);
    setShowModal(true);

    if (type === 'sector') {
      setSectorForm({
        name: item ? item.name : '',
        description: item ? item.description : '',
        icon: item ? item.icon : 'activity',
        features: item ? item.features.join(', ') : ''
      });
    } else if (type === 'testimonial') {
      setTestimonialForm({
        clientName: item ? item.clientName : '',
        clientPosition: item ? item.clientPosition : '',
        companyName: item ? item.companyName : '',
        feedback: item ? item.feedback : '',
        sectorId: item && item.sector ? item.sector._id : ''
      });
    } else if (type === 'logo') {
      setLogoForm({
        clientName: item ? item.clientName : '',
        logoPath: item ? item.logoPath : '',
        websiteUrl: item ? item.websiteUrl : ''
      });
    } else if (type === 'blog') {
      setBlogForm({
        title: item ? item.title : '',
        summary: item ? item.summary : '',
        content: item ? item.content : '',
        author: item ? item.author : 'S. M. Hashmi',
        sectorId: item && item.sector ? item.sector._id : '',
        metaKeywords: item && item.metaKeywords ? item.metaKeywords.join(', ') : ''
      });
    }
  };

  // 4. SUBMIT FORM CONTROLLER
  const handleFormSubmit = (e) => {
    e.preventDefault();
    let body = {};
    let endpoint = '';
    let method = editItem ? 'PUT' : 'POST';

    if (modalType === 'sector') {
      endpoint = editItem ? `/api/sectors/${editItem._id}` : '/api/sectors';
      const featuresArray = sectorForm.features.split(',').map(f => f.trim()).filter(Boolean);
      body = { ...sectorForm, features: featuresArray };
    } else if (modalType === 'testimonial') {
      endpoint = editItem ? `/api/testimonials/${editItem._id}` : '/api/testimonials';
      body = testimonialForm;
    } else if (modalType === 'logo') {
      endpoint = editItem ? `/api/logos/${editItem._id}` : '/api/logos';
      body = logoForm;
    } else if (modalType === 'blog') {
      endpoint = editItem ? `/api/blogs/${editItem._id}` : '/api/blogs';
      body = blogForm;
    }

    fetch(endpoint, {
      method,
      headers: getHeaders(),
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setErrorMsg(data.error);
        } else {
          triggerSuccess(`${modalType.toUpperCase()} saved successfully!`);
          setShowModal(false);
          setEditItem(null);
          fetchAllData();
        }
      })
      .catch(err => {
        console.error(err);
        setErrorMsg('Error saving form data.');
      });
  };

  return (
    <div className="dashboard-container" style={{ padding: '120px 0 80px 0', minHeight: '85vh' }}>
      <div className="container flex gap-6 wrap" style={{ alignItems: 'flex-start' }}>
        
        {/* SIDEBAR TABS */}
        <aside className="glass" style={{ width: '260px', padding: '24px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
          <h3 style={{ fontSize: '15px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.05em', textAlign: 'left' }}>Dashboard Console</h3>
          
          <button onClick={() => setActiveTab('inbox')} style={tabBtnStyle(activeTab === 'inbox')}>
            <Mail size={18} /> Inbox ({inbox.filter(m => m.status === 'New').length})
          </button>
          
          <button onClick={() => setActiveTab('sectors')} style={tabBtnStyle(activeTab === 'sectors')}>
            <LayoutGrid size={18} /> Solutions
          </button>

          <button onClick={() => setActiveTab('testimonials')} style={tabBtnStyle(activeTab === 'testimonials')}>
            <Quote size={18} /> Testimonials
          </button>

          <button onClick={() => setActiveTab('logos')} style={tabBtnStyle(activeTab === 'logos')}>
            <Image size={18} /> Client Logos
          </button>

          <button onClick={() => setActiveTab('blogs')} style={tabBtnStyle(activeTab === 'blogs')}>
            <Tag size={18} /> Case Studies
          </button>
        </aside>

        {/* WORKSPACE CONTENT BOARD */}
        <div style={{ flexGrow: 1, minWidth: '320px' }}>
          
          {/* TOAST SYSTEM ALERTS */}
          {successMsg && (
            <div className="flex align-center gap-2 anim-fade-in" style={{ backgroundColor: 'var(--primary-glow)', border: '1px solid var(--primary)', borderRadius: 'var(--radius-sm)', padding: '14px 20px', marginBottom: '24px', color: 'var(--primary)' }}>
              <CheckCircle2 size={22} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '14px', fontWeight: 500 }}>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="flex align-center gap-2 anim-fade-in" style={{ backgroundColor: 'rgba(231,29,54,0.1)', border: '1px solid var(--error)', borderRadius: 'var(--radius-sm)', padding: '14px 20px', marginBottom: '24px', color: 'var(--error)' }}>
              <AlertCircle size={22} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '14px', fontWeight: 500 }}>{errorMsg}</span>
            </div>
          )}

          {loading ? (
            <div className="text-center card-item" style={{ padding: '64px 0' }}>
              <span className="spinner"></span>
              <p style={{ color: 'var(--text-muted)', marginTop: '12px' }}>Loading Console dataset...</p>
            </div>
          ) : (
            <div className="card-item" style={{ padding: '36px', textAlign: 'left' }}>
              
              {/* TABS: 1. INBOX ENQUIRIES */}
              {activeTab === 'inbox' && (
                <div>
                  <h2 style={{ fontSize: '24px', color: 'var(--text-main)', marginBottom: '24px' }}>Web Forms Enquiry Inbox</h2>
                  {inbox.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>No messages received yet.</p>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table className="dash-table" style={tableStyle}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid var(--border)' }}>
                            <th style={thStyle}>Date</th>
                            <th style={thStyle}>Client Details</th>
                            <th style={thStyle}>Subject</th>
                            <th style={thStyle}>Message</th>
                            <th style={thStyle}>Status</th>
                            <th style={thStyle}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {inbox.map((msg) => (
                            <tr key={msg._id} style={{ borderBottom: '1px solid var(--border)', opacity: msg.status === 'Replied' ? 0.6 : 1 }}>
                              <td style={tdStyle}>{new Date(msg.createdAt).toLocaleDateString()}</td>
                              <td style={tdStyle}>
                                <div style={{ fontWeight: 600 }}>{msg.name}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{msg.email}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{msg.phone || 'No Phone'}</div>
                              </td>
                              <td style={tdStyle}>{msg.subject}</td>
                              <td style={{ ...tdStyle, maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal' }}>{msg.message}</td>
                              <td style={tdStyle}>
                                <button
                                  onClick={() => toggleEnquiryStatus(msg._id, msg.status)}
                                  className="btn"
                                  style={{
                                    padding: '4px 10px',
                                    fontSize: '11px',
                                    borderRadius: '12px',
                                    backgroundColor: msg.status === 'New' ? 'var(--primary)' : msg.status === 'Read' ? 'var(--warning)' : 'var(--border)',
                                    color: msg.status === 'New' ? 'white' : 'var(--text-main)',
                                    cursor: 'pointer'
                                  }}
                                >
                                  {msg.status}
                                </button>
                              </td>
                              <td style={tdStyle}>
                                <button onClick={() => handleDelete('enquiry', msg._id)} className="btn btn-danger" style={{ padding: '6px 10px' }} title="Delete Enquiry">
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TABS: 2. SECTORS */}
              {activeTab === 'sectors' && (
                <div>
                  <div className="flex justify-between align-center" style={{ marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '24px', color: 'var(--text-main)' }}>Manage Sectors (Solutions)</h2>
                    <button onClick={() => launchModal('sector')} className="btn btn-primary flex align-center gap-1" style={{ padding: '8px 16px', fontSize: '14px' }}>
                      <Plus size={16} /> Add Sector
                    </button>
                  </div>
                  {sectors.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>No sectors added. Click 'Add Sector' to create one.</p>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={tableStyle}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid var(--border)' }}>
                            <th style={thStyle}>Solution Name</th>
                            <th style={thStyle}>Description</th>
                            <th style={thStyle}>Icon</th>
                            <th style={thStyle}>Features Count</th>
                            <th style={thStyle}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sectors.map((sec) => (
                            <tr key={sec._id} style={{ borderBottom: '1px solid var(--border)' }}>
                              <td style={{ ...tdStyle, fontWeight: 600 }}>{sec.name}</td>
                              <td style={{ ...tdStyle, maxWidth: '280px' }}>{sec.description.substring(0, 100)}...</td>
                              <td style={tdStyle}><code>{sec.icon}</code></td>
                              <td style={tdStyle}>{sec.features.length} features</td>
                              <td style={tdStyle}>
                                <div className="flex gap-2">
                                  <button onClick={() => launchModal('sector', sec)} className="btn btn-secondary" style={{ padding: '6px 10px' }} title="Edit">
                                    <Edit3 size={14} />
                                  </button>
                                  <button onClick={() => handleDelete('sector', sec._id)} className="btn btn-danger" style={{ padding: '6px 10px' }} title="Delete">
                                    <Trash2 size={14} />
                                  </button>
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

              {/* TABS: 3. TESTIMONIALS */}
              {activeTab === 'testimonials' && (
                <div>
                  <div className="flex justify-between align-center" style={{ marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '24px', color: 'var(--text-main)' }}>Manage Client Testimonials</h2>
                    <button onClick={() => launchModal('testimonial')} className="btn btn-primary flex align-center gap-1" style={{ padding: '8px 16px', fontSize: '14px' }}>
                      <Plus size={16} /> Add Testimonial
                    </button>
                  </div>
                  {testimonials.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>No testimonials added. Click 'Add Testimonial'.</p>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={tableStyle}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid var(--border)' }}>
                            <th style={thStyle}>Client</th>
                            <th style={thStyle}>Feedback Quotes</th>
                            <th style={thStyle}>Solution Link</th>
                            <th style={thStyle}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {testimonials.map((t) => (
                            <tr key={t._id} style={{ borderBottom: '1px solid var(--border)' }}>
                              <td style={tdStyle}>
                                <div style={{ fontWeight: 600 }}>{t.clientName}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.clientPosition}, {t.companyName}</div>
                              </td>
                              <td style={{ ...tdStyle, maxWidth: '280px' }}>"{t.feedback}"</td>
                              <td style={tdStyle}>{t.sector ? t.sector.name : 'General'}</td>
                              <td style={tdStyle}>
                                <div className="flex gap-2">
                                  <button onClick={() => launchModal('testimonial', t)} className="btn btn-secondary" style={{ padding: '6px 10px' }} title="Edit">
                                    <Edit3 size={14} />
                                  </button>
                                  <button onClick={() => handleDelete('testimonial', t._id)} className="btn btn-danger" style={{ padding: '6px 10px' }} title="Delete">
                                    <Trash2 size={14} />
                                  </button>
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

              {/* TABS: 4. CLIENT LOGOS */}
              {activeTab === 'logos' && (
                <div>
                  <div className="flex justify-between align-center" style={{ marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '24px', color: 'var(--text-main)' }}>Manage Clients Scrolling Logos</h2>
                    <button onClick={() => launchModal('logo')} className="btn btn-primary flex align-center gap-1" style={{ padding: '8px 16px', fontSize: '14px' }}>
                      <Plus size={16} /> Add Client Logo
                    </button>
                  </div>
                  {logos.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>No client logos added.</p>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={tableStyle}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid var(--border)' }}>
                            <th style={thStyle}>Client Name</th>
                            <th style={thStyle}>Logo Path</th>
                            <th style={thStyle}>Website URL</th>
                            <th style={thStyle}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {logos.map((logo) => (
                            <tr key={logo._id} style={{ borderBottom: '1px solid var(--border)' }}>
                              <td style={{ ...tdStyle, fontWeight: 600 }}>{logo.clientName}</td>
                              <td style={tdStyle}><code>{logo.logoPath}</code></td>
                              <td style={tdStyle}>{logo.websiteUrl || 'N/A'}</td>
                              <td style={tdStyle}>
                                <div className="flex gap-2">
                                  <button onClick={() => launchModal('logo', logo)} className="btn btn-secondary" style={{ padding: '6px 10px' }} title="Edit">
                                    <Edit3 size={14} />
                                  </button>
                                  <button onClick={() => handleDelete('logo', logo._id)} className="btn btn-danger" style={{ padding: '6px 10px' }} title="Delete">
                                    <Trash2 size={14} />
                                  </button>
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

              {/* TABS: 5. CASE STUDIES (BLOGS) */}
              {activeTab === 'blogs' && (
                <div>
                  <div className="flex justify-between align-center" style={{ marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '24px', color: 'var(--text-main)' }}>Manage Case Studies & Blog Posts</h2>
                    <button onClick={() => launchModal('blog')} className="btn btn-primary flex align-center gap-1" style={{ padding: '8px 16px', fontSize: '14px' }}>
                      <Plus size={16} /> Publish Post
                    </button>
                  </div>
                  {blogs.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>No case studies published yet.</p>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={tableStyle}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid var(--border)' }}>
                            <th style={thStyle}>Case Study Title</th>
                            <th style={thStyle}>Summary</th>
                            <th style={thStyle}>Associated Industry</th>
                            <th style={thStyle}>Author & Date</th>
                            <th style={thStyle}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {blogs.map((b) => (
                            <tr key={b._id} style={{ borderBottom: '1px solid var(--border)' }}>
                              <td style={{ ...tdStyle, fontWeight: 600 }}>{b.title}</td>
                              <td style={{ ...tdStyle, maxWidth: '220px' }}>{b.summary}</td>
                              <td style={tdStyle}>{b.sector ? b.sector.name : 'General'}</td>
                              <td style={tdStyle}>
                                <div>{b.author}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{new Date(b.datePublished).toLocaleDateString()}</div>
                              </td>
                              <td style={tdStyle}>
                                <div className="flex gap-2">
                                  <button onClick={() => launchModal('blog', b)} className="btn btn-secondary" style={{ padding: '6px 10px' }} title="Edit">
                                    <Edit3 size={14} />
                                  </button>
                                  <button onClick={() => handleDelete('blog', b._id)} className="btn btn-danger" style={{ padding: '6px 10px' }} title="Delete">
                                    <Trash2 size={14} />
                                  </button>
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

        </div>
      </div>

      {/* SECURE POPUP EDIT FORM MODAL CONTAINER */}
      {showModal && (
        <div className="modal-overlay flex align-center justify-center" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 2000, padding: '24px' }}>
          <div className="modal-content glass anim-fade-in" style={{ backgroundColor: 'var(--bg-card)', padding: '40px', borderRadius: 'var(--radius-lg)', maxWidth: '680px', width: '100%', position: 'relative', maxHeight: '90vh', overflowY: 'auto', textAlign: 'left' }}>
            <button onClick={() => { setShowModal(false); setEditItem(null); }} className="btn-icon" style={{ position: 'absolute', top: '20px', right: '20px' }}>
              <X size={20} />
            </button>

            <h2 style={{ fontSize: '24px', color: 'var(--text-main)', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              {editItem ? 'Edit' : 'Create New'} {modalType.toUpperCase()}
            </h2>

            <form onSubmit={handleFormSubmit}>
              
              {/* MODAL VIEW: SECTOR FORM */}
              {modalType === 'sector' && (
                <div>
                  <div className="form-group">
                    <label className="form-label">Sector / Solution Name</label>
                    <input type="text" value={sectorForm.name} onChange={(e) => setSectorForm({ ...sectorForm, name: e.target.value })} required className="form-control" placeholder="HEALTHCARE" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description Summary</label>
                    <textarea value={sectorForm.description} onChange={(e) => setSectorForm({ ...sectorForm, description: e.target.value })} required className="form-control" rows="4" placeholder="Brief copy summary..."></textarea>
                  </div>
                  <div className="grid grid-2" style={{ gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Lucide Icon Name</label>
                      <input type="text" value={sectorForm.icon} onChange={(e) => setSectorForm({ ...sectorForm, icon: e.target.value })} required className="form-control" placeholder="activity, scale, truck, briefcase..." />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Features (comma-separated)</label>
                      <input type="text" value={sectorForm.features} onChange={(e) => setSectorForm({ ...sectorForm, features: e.target.value })} className="form-control" placeholder="Billing, Inventory, Logistics..." />
                    </div>
                  </div>
                </div>
              )}

              {/* MODAL VIEW: TESTIMONIAL FORM */}
              {modalType === 'testimonial' && (
                <div>
                  <div className="grid grid-2" style={{ gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Client Representative Name</label>
                      <input type="text" value={testimonialForm.clientName} onChange={(e) => setTestimonialForm({ ...testimonialForm, clientName: e.target.value })} required className="form-control" placeholder="Dr. Abdul Qadir" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Client Position</label>
                      <input type="text" value={testimonialForm.clientPosition} onChange={(e) => setTestimonialForm({ ...testimonialForm, clientPosition: e.target.value })} required className="form-control" placeholder="Medical Director" />
                    </div>
                  </div>
                  <div className="grid grid-2" style={{ gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Company Name</label>
                      <input type="text" value={testimonialForm.companyName} onChange={(e) => setTestimonialForm({ ...testimonialForm, companyName: e.target.value })} required className="form-control" placeholder="Adarsh Multispecialty Clinic" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Associated Sector / Solution</label>
                      <select value={testimonialForm.sectorId} onChange={(e) => setTestimonialForm({ ...testimonialForm, sectorId: e.target.value })} className="form-control" style={{ height: '53px' }}>
                        <option value="">General Review</option>
                        {sectors.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Testimonial feedback quotes</label>
                    <textarea value={testimonialForm.feedback} onChange={(e) => setTestimonialForm({ ...testimonialForm, feedback: e.target.value })} required className="form-control" rows="4" placeholder="Their ERPNext implementation transformed our operations..."></textarea>
                  </div>
                </div>
              )}

              {/* MODAL VIEW: LOGO FORM */}
              {modalType === 'logo' && (
                <div>
                  <div className="form-group">
                    <label className="form-label">Client Name</label>
                    <input type="text" value={logoForm.clientName} onChange={(e) => setLogoForm({ ...logoForm, clientName: e.target.value })} required className="form-control" placeholder="SLA Group" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Logo Icon URL / Local Path</label>
                    <input type="text" value={logoForm.logoPath} onChange={(e) => setLogoForm({ ...logoForm, logoPath: e.target.value })} required className="form-control" placeholder="/assets/logos/client_sla.png" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Client Website URL (Optional)</label>
                    <input type="url" value={logoForm.websiteUrl} onChange={(e) => setLogoForm({ ...logoForm, websiteUrl: e.target.value })} className="form-control" placeholder="https://sla.in" />
                  </div>
                </div>
              )}

              {/* MODAL VIEW: BLOG / CASE STUDY FORM */}
              {modalType === 'blog' && (
                <div>
                  <div className="form-group">
                    <label className="form-label">Case Study Title</label>
                    <input type="text" value={blogForm.title} onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })} required className="form-control" placeholder="Case Study: Automating Clinic operations" />
                  </div>
                  <div className="grid grid-2" style={{ gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Case Study Summary</label>
                      <input type="text" value={blogForm.summary} onChange={(e) => setBlogForm({ ...blogForm, summary: e.target.value })} required className="form-control" placeholder="Brief summary of efficiency improvements..." />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Associated Solution Sector</label>
                      <select value={blogForm.sectorId} onChange={(e) => setBlogForm({ ...blogForm, sectorId: e.target.value })} className="form-control" style={{ height: '53px' }}>
                        <option value="">General Post</option>
                        {sectors.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">SEO/AEO Meta Keywords (comma-separated)</label>
                    <input type="text" value={blogForm.metaKeywords} onChange={(e) => setBlogForm({ ...blogForm, metaKeywords: e.target.value })} className="form-control" placeholder="healthcare erp, hospital software, erpnext healthcare..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Case Study Rich Content (Markdown format supported)</label>
                    <textarea value={blogForm.content} onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })} required className="form-control" rows="12" placeholder="# Header 1\n## Subheader\nUse **bold** or bullet lists (- item)..." style={{ fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.4' }}></textarea>
                  </div>
                </div>
              )}

              <button type="submit" className="btn btn-primary flex align-center gap-1" style={{ width: '100%', height: '48px', marginTop: '16px' }}>
                Save & Publish
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// Side Navigation buttons style
const tabBtnStyle = (isActive) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  width: '100%',
  padding: '12px 18px',
  borderRadius: '8px',
  border: 'none',
  textAlign: 'left',
  fontWeight: '600',
  fontSize: '14px',
  cursor: 'pointer',
  backgroundColor: isActive ? 'var(--primary)' : 'transparent',
  color: isActive ? 'white' : 'var(--text-muted)',
  transition: 'all var(--transition-fast)'
});

// Admin listings table layouts
const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  textAlign: 'left',
  fontSize: '14px',
  marginTop: '12px'
};

const thStyle = {
  padding: '16px 12px',
  color: 'var(--text-main)',
  fontWeight: '600'
};

const tdStyle = {
  padding: '16px 12px',
  color: 'var(--text-muted)',
  verticalAlign: 'middle'
};
