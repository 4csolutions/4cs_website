import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, LogOut, ShieldCheck, Mail, MapPin, Phone } from 'lucide-react';

// Pages Import
import Home from './pages/Home';
import WhyERPNext from './pages/WhyERPNext';
import AboutServices from './pages/AboutServices';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import IndustryDetail from './pages/IndustryDetail';

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || null);
  const [sectors, setSectors] = useState([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    fetch('/api/sectors')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSectors(data);
        }
      })
      .catch(err => console.error('Error loading industries list for dropdown:', err));
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken(null);
    window.location.href = '/';
  };

  return (
    <Router>
      <div className="app-wrapper flex flex-column" style={{ minHeight: '100vh' }}>
        
        {/* Sticky Dynamic Glass Navbar */}
        <header className="glass sticky-nav" style={{ position: 'sticky', top: 0, zIndex: 9999, height: '72px', borderBottom: '1px solid var(--border)' }}>
          <div className="container flex align-center justify-between" style={{ height: '100%' }}>
            
            {/* Logo space */}
            <Link to="/" className="flex align-center gap-1" style={{ textDecoration: 'none' }}>
              <span style={{ fontWeight: 800, fontSize: '24px', fontFamily: 'var(--font-family-title)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 900 }}>4C</span>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  Soluti
                  <img src="/4c-logo.png" alt="O" style={{ height: '24px', width: 'auto', margin: '0 1px', display: 'inline-block', verticalAlign: 'middle' }} />
                  ns
                </span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="desktop-nav flex align-center gap-6" style={{ display: 'flex' }}>
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`} style={navLinkStyle}>Home</NavLink>
              
              {/* Dynamic Industries Dropdown */}
              <div className="dropdown" style={{ display: 'inline-block' }}>
                <span className="nav-link flex align-center" style={{ ...navLinkStyle, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Industries <span style={{ fontSize: '9px' }}>▼</span>
                </span>
                <div className="dropdown-content">
                  {sectors.map(sec => (
                    <NavLink 
                      key={sec._id} 
                      to={`/industries/${sec.slug}`} 
                      className={({ isActive }) => isActive ? 'active-link' : ''}
                    >
                      {sec.name}
                    </NavLink>
                  ))}
                </div>
              </div>

              <NavLink to="/whyerpnext" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`} style={navLinkStyle}>Why ERPNext</NavLink>
              <NavLink to="/about-us" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`} style={navLinkStyle}>About & Services</NavLink>
              <NavLink to="/case-studies" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`} style={navLinkStyle}>Case Studies</NavLink>
              <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`} style={navLinkStyle}>Contact Us</NavLink>
              
              {adminToken && (
                <NavLink to="/admin" className={({ isActive }) => `nav-link flex align-center gap-1 ${isActive ? 'active-link' : ''}`} style={{ ...navLinkStyle, color: 'var(--primary)' }}>
                  <ShieldCheck size={16} /> Console
                </NavLink>
              )}
            </nav>

            {/* Header Right Action Items */}
            <div className="flex align-center gap-3">
              {/* Dark mode toggle */}
              <button onClick={toggleTheme} className="btn-icon" style={iconBtnStyle} title="Toggle Theme">
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>

              {adminToken ? (
                <button onClick={handleLogout} className="btn btn-secondary flex align-center gap-1" style={{ padding: '8px 16px', fontSize: '14px' }}>
                  <LogOut size={16} /> Logout
                </button>
              ) : (
                <Link to="/contact" className="btn btn-primary desktop-only" style={{ padding: '10px 22px', fontSize: '14px' }}>
                  Get Started
                </Link>
              )}

              {/* Mobile Menu Icon Toggle */}
              <button onClick={() => setMobileMenuOpen(prev => !prev)} className="mobile-menu-btn" style={{ ...iconBtnStyle, display: 'none' }}>
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-drawer glass anim-fade-in" style={{ position: 'fixed', top: '72px', left: 0, right: 0, padding: '24px', zIndex: 10000, borderBottom: '1px solid var(--border)', maxHeight: 'calc(100vh - 72px)', overflowY: 'auto' }}>
            <nav className="flex flex-column gap-4" style={{ textAlign: 'center' }}>
              <Link to="/" onClick={() => setMobileMenuOpen(false)} style={mobileLinkStyle}>Home</Link>
              
              {/* Dynamic Mobile Industries Drawer */}
              <div className="flex flex-column gap-2" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Industries We Serve</span>
                <div className="flex flex-column gap-2" style={{ paddingLeft: '8px' }}>
                  {sectors.map(sec => (
                    <Link 
                      key={sec._id} 
                      to={`/industries/${sec.slug}`} 
                      onClick={() => setMobileMenuOpen(false)} 
                      style={{ ...mobileLinkStyle, fontSize: '14px', padding: '4px 0' }}
                    >
                      {sec.name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link to="/whyerpnext" onClick={() => setMobileMenuOpen(false)} style={mobileLinkStyle}>Why ERPNext</Link>
              <Link to="/about-us" onClick={() => setMobileMenuOpen(false)} style={mobileLinkStyle}>About & Services</Link>
              <Link to="/case-studies" onClick={() => setMobileMenuOpen(false)} style={mobileLinkStyle}>Case Studies</Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} style={mobileLinkStyle}>Contact Us</Link>
              {adminToken && <Link to="/admin" onClick={() => setMobileMenuOpen(false)} style={{ ...mobileLinkStyle, color: 'var(--primary)' }}>Admin Dashboard</Link>}
              {!adminToken && (
                <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>
                  Get Started
                </Link>
              )}
            </nav>
          </div>
        )}

        {/* Main Application Body */}
        <main className="main-content" style={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/industries/:slug" element={<IndustryDetail />} />
            <Route path="/whyerpnext" element={<WhyERPNext />} />
            <Route path="/about-us" element={<AboutServices />} />
            <Route path="/case-studies" element={<BlogList />} />
            <Route path="/case-studies/:slug" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login setToken={setAdminToken} />} />
            <Route path="/admin" element={<AdminDashboard token={adminToken} />} />
          </Routes>
        </main>

        {/* Premium Styled Footer */}
        <footer className="footer-section" style={{ backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border)', padding: '64px 0 24px 0', marginTop: 'auto' }}>
          <div className="container">
            <div className="grid grid-3" style={{ marginBottom: '48px' }}>
              
              {/* Col 1: Branding and Core Description */}
              <div className="flex flex-column gap-3" style={{ textAlign: 'left' }}>
                <div className="flex align-center gap-2" style={{ fontWeight: 800, fontSize: '22px', fontFamily: 'var(--font-family-title)', color: 'var(--text-main)' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: 900 }}>4C</span>
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    Soluti
                    <img src="/4c-logo.png" alt="O" style={{ height: '20px', width: 'auto', margin: '0 1px', display: 'inline-block', verticalAlign: 'middle' }} />
                    ns
                  </span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
                  Empowering MSMEs and enterprise industries with premium ERPNext cloud implementations. We streamline your logistics, contracting, legal, and healthcare workflows.
                </p>
                <div className="flex align-center gap-2 mt-2">
                  <span style={{ fontSize: '13px', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', padding: '6px 12px', borderRadius: '24px', fontWeight: 600 }}>
                    Official Solution Provider
                  </span>
                </div>
              </div>

              {/* Col 2: Quick Links */}
              <div className="flex flex-column gap-3" style={{ textAlign: 'left' }}>
                <h4 style={{ fontSize: '16px', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Useful Links</h4>
                <div className="flex flex-column gap-2" style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                  <Link to="/" className="footer-hover-link">Home Base</Link>
                  <Link to="/whyerpnext" className="footer-hover-link">Why Choose ERPNext</Link>
                  <Link to="/about-us" className="footer-hover-link">About Our Company</Link>
                  <Link to="/case-studies" className="footer-hover-link">Success Stories</Link>
                  <Link to="/login" className="footer-hover-link">Employee Portal</Link>
                </div>
              </div>

              {/* Col 3: Address and Contact information */}
              <div className="flex flex-column gap-3" style={{ textAlign: 'left' }}>
                <h4 style={{ fontSize: '16px', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact Office</h4>
                <div className="flex flex-column gap-3" style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                  <div className="flex align-center gap-2">
                    <MapPin size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                    <span>MIG-22, 1st Phase, Adarsh Nagar, Kalaburagi - 585105, Karnataka, India</span>
                  </div>
                  <div className="flex align-center gap-2">
                    <Mail size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                    <a href="mailto:info@4csolutions.in" className="footer-hover-link">info@4csolutions.in</a>
                  </div>
                  <div className="flex align-center gap-2">
                    <Phone size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                    <span>+91 8472 254105</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Copyright statement */}
            <div className="flex justify-between align-center wrap gap-4" style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', fontSize: '13px', color: 'var(--text-muted)' }}>
              <span>© {new Date().getFullYear()} 4C Solutions. All rights reserved.</span>
              <div className="flex gap-4">
                <a href="#" className="footer-hover-link">Privacy Policy</a>
                <a href="#" className="footer-hover-link">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>

      </div>

      <style>{`
        .sticky-nav {
          box-shadow: var(--shadow-sm);
        }
        .nav-link {
          font-weight: 500;
          font-size: 15px;
          color: var(--text-muted);
          position: relative;
          padding: 4px 0;
        }
        .nav-link:hover, .nav-link.active-link {
          color: var(--text-main);
        }
        .nav-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: 0;
          left: 0;
          background-color: var(--primary);
          transition: width var(--transition-fast);
        }
        .nav-link.active-link::after, .nav-link:hover::after {
          width: 100%;
        }
        .btn-icon {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-main);
          padding: 8px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color var(--transition-fast);
        }
        .btn-icon:hover {
          background-color: var(--border);
        }
        .footer-hover-link:hover {
          color: var(--primary);
          text-decoration: underline;
        }
        @media (max-width: 768px) {
          .desktop-nav, .desktop-only {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }
      `}</style>
    </Router>
  );
}

const navLinkStyle = {
  textDecoration: 'none',
  transition: 'color var(--transition-fast)'
};

const iconBtnStyle = {
  outline: 'none'
};

const mobileLinkStyle = {
  fontSize: '16px',
  fontWeight: '600',
  padding: '8px 0',
  color: 'var(--text-main)'
};
