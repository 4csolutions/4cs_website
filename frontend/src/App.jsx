import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
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

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

  return (
    <Router>
      <ScrollToTop />
      <div className="app-wrapper flex flex-column" style={{ minHeight: '100vh' }}>
        
        {/* Sticky Dynamic Glass Navbar */}
        <header className="glass sticky-nav" style={{ position: 'sticky', top: 0, zIndex: 9999, height: '72px', borderBottom: '1px solid var(--border)' }}>
          <div className="container flex align-center justify-between" style={{ height: '100%' }}>
            
            {/* Logo space */}
            <Link to="/" className="flex align-center gap-2" style={{ textDecoration: 'none' }}>
              <img src="/logo.png" alt="4C Solutions Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
              <span style={{ fontWeight: 800, fontSize: '24px', fontFamily: 'var(--font-family-title)', color: 'var(--text-main)' }}>
                Solutions
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
                  <img src="/logo.png" alt="4C Solutions Logo" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                  <span>Solutions</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
                  With 5+ years of dedicated, independent ERPNext & Frappe implementation experience, we build high-domain vertical extensions to modernize clinical hospital operations, fleet logistics, advocate case files, and project cost controls. We help you scale without restrictive software licensing fees.
                </p>
                <div className="flex align-center gap-2 mt-2 wrap">
                  <span style={{ fontSize: '12px', backgroundColor: 'rgba(231,29,54,0.1)', color: 'var(--error)', padding: '4px 10px', borderRadius: '12px', fontWeight: 600 }}>
                    ERPNext Integrator
                  </span>
                  <span style={{ fontSize: '12px', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '12px', fontWeight: 600 }}>
                    5+ Years Experience
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
                  <a 
                    href="https://www.google.com/maps/place/4C+Solutions+-+ERPNext+Services+and+Consultation,+Software+Development/@17.3350179,76.8613332,17z/data=!4m6!3m5!1s0x3bc8c7319ded473b:0x610e34759ec89438!8m2!3d17.3350179!4d76.8613332!16s%2Fg%2F11fr494j74!5m1!1e1?entry=ttu" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="footer-hover-link flex align-start gap-2"
                  >
                    <MapPin size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                    <span>MIG-22, 1st Phase, Adarsh Nagar, Kalaburagi - 585105, Karnataka, India</span>
                  </a>
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

        {/* Floating WhatsApp chat widget */}
        <WhatsAppChat />

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

// Interactive, Tailwind-styled Floating WhatsApp Chat Widget
function WhatsAppChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [customText, setCustomText] = useState("");
  const [hasNewMessage, setHasNewMessage] = useState(true);
  const phoneNumber = "919886579707";

  const options = [
    { label: "🏥 Healthcare HIS Suite", text: "Hi, I would like to discuss a demo of your ERPNext Healthcare and 4CS custom hospital extension." },
    { label: "🚚 Fleet VMS & Logistics", text: "Hi, I'd like to learn more about VMS, Tyre Rotation tracking, and Driver Settlements." },
    { label: "⚖️ CaseCentral Legal Suite", text: "Hi, I am interested in CaseCentral legal practice matter and timesheet tracking." },
    { label: "🏗️ Project BOQ Controls", text: "Hi, I'd like to discuss project BOQ budgets and cash flow mapping on ERPNext." }
  ];

  const handleStartChat = (text) => {
    const message = encodeURIComponent(text || customText || "Hi 4C Solutions, I'd like to learn more about your custom ERPNext implementations.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (hasNewMessage) setHasNewMessage(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[10002] font-sans">
      {/* Floating Action Button */}
      <button 
        onClick={toggleOpen}
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 shadow-xl flex items-center justify-center text-white relative transition-all duration-300 transform hover:scale-110 active:scale-95 focus:outline-none"
        title="Chat on WhatsApp"
        style={{ outline: 'none', border: 'none', cursor: 'pointer' }}
      >
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.46L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 1.977 14.053.953 11.425.951 5.993.951 1.566 5.323 1.562 10.751c-.001 1.693.45 3.344 1.305 4.793l-.99 3.614 3.71-.973c1.378.75 2.822 1.15 4.54 1.151h-.002zm10.136-7.37c-.302-.152-1.79-.885-2.068-.986-.278-.101-.482-.152-.684.152-.202.303-.78.986-.957 1.189-.176.202-.353.228-.655.076-.301-.152-1.272-.469-2.422-1.494-.894-.797-1.498-1.782-1.674-2.085-.176-.302-.019-.467.132-.617.136-.134.302-.354.453-.531.152-.177.202-.303.303-.506.101-.202.051-.38-.025-.531-.076-.152-.684-1.648-.938-2.257-.247-.597-.499-.516-.684-.526-.176-.01-.379-.012-.582-.012-.202 0-.531.076-.81.38-.278.303-1.062 1.037-1.062 2.529 0 1.493 1.087 2.935 1.239 3.137.152.202 2.14 3.264 5.182 4.577.724.312 1.29.499 1.732.639.728.231 1.39.198 1.916.12.585-.088 1.79-.733 2.043-1.442.253-.71.253-1.317.177-1.442-.077-.127-.278-.203-.58-.354z"/>
        </svg>
        {hasNewMessage && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border border-white flex items-center justify-center animate-pulse"></span>
        )}
      </button>

      {/* Floating Chat Drawer Box */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 max-w-[90vw] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300 ease-out transform scale-100 origin-bottom-right">
          {/* Header */}
          <div className="bg-emerald-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white text-emerald-600 font-black flex items-center justify-center text-sm shadow-inner">
                4CS
              </div>
              <div className="text-left">
                <h4 className="font-bold text-sm leading-tight text-white m-0">4C Solutions Specialist</h4>
                <span className="text-xs text-emerald-100 flex items-center gap-1" style={{ marginTop: '2px', display: 'flex', alignItems: 'center' }}>
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse inline-block"></span>
                  Active | 5+ Years ERPNext Experts
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-emerald-100 hover:text-white transition-colors duration-200 focus:outline-none" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 max-h-[360px] overflow-y-auto bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
            {/* System Info */}
            <div className="bg-emerald-50 dark:bg-slate-900/50 border border-emerald-100 dark:border-slate-800 rounded-xl p-3 mb-3 text-xs text-slate-600 dark:text-slate-400 text-left leading-relaxed">
              <strong>Enterprise Systems Integrator:</strong> We possess 5+ years of custom implementation expertise. We build customized workflows to help you scale without per-user licensing fees.
            </div>

            {/* Welcome Bubble */}
            <div className="bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 rounded-2xl p-3 mb-3 text-xs text-slate-800 dark:text-slate-200 text-left rounded-tl-none relative">
              <div className="font-bold text-[10px] text-emerald-600 mb-1">Consulting Team</div>
              Hi there! 👋 How can we help you automate your operational workflows today? Select a custom blueprint below or type a custom message.
            </div>

            {/* Quick Options */}
            <div className="flex flex-col gap-2 mb-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 text-left">Quick Blueprints</span>
              {options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleStartChat(opt.text)}
                  className="w-full text-left p-2 bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 rounded-xl text-[11px] text-slate-700 dark:text-slate-300 font-medium transition-all duration-200 shadow-sm"
                  style={{ cursor: 'pointer', textAlign: 'left' }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="mt-2">
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Type your custom requirements here..."
                rows="2"
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[11px] text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
              ></textarea>
              <button
                onClick={() => handleStartChat()}
                className="w-full mt-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-xl flex items-center justify-center gap-1.5 text-xs transition-all duration-200 shadow-md"
                style={{ cursor: 'pointer', border: 'none' }}
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

