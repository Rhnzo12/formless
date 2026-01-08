import { useState, useEffect } from 'react';

// Custom scrollbar styles for left-side scrollbar
const scrollbarStyles = `
  /* Allow vertical scroll on page, hide horizontal */
  html, body {
    overflow-x: hidden;
    overflow-y: auto;
  }

  .left-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .left-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .left-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
  .left-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  /* Horizontal scrollbar for code blocks - always visible */
  .code-scroll {
    overflow-x: scroll;
    overflow-y: hidden;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1);
  }
  .code-scroll::-webkit-scrollbar {
    height: 8px;
  }
  .code-scroll::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
  .code-scroll::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }
  .code-scroll::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.4);
  }

  /* Both scrollbars for code panel - always visible and fixed */
  .code-panel-scroll {
    overflow: scroll;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1);
  }
  .code-panel-scroll::-webkit-scrollbar {
    width: 6px;
    height: 8px;
  }
  .code-panel-scroll::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  .code-panel-scroll::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }
  .code-panel-scroll::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.4);
  }
  .code-panel-scroll::-webkit-scrollbar-corner {
    background: rgba(255, 255, 255, 0.05);
  }

  /* Hide scrollbar on right panel */
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

const ApiDocs = () => {
  const [activeSection, setActiveSection] = useState('welcome');
  const [copiedCode, setCopiedCode] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showParamsChildren, setShowParamsChildren] = useState(false);
  const [showResultChildren, setShowResultChildren] = useState(true);
  const [activeResponseOption, setActiveResponseOption] = useState(1);
  // Set page title based on active section
  useEffect(() => {
    const titles = {
      'welcome': 'Welcome to the SHARE Protocol API',
      'identity-lookup': 'Identity Lookup - Account Management',
      'create-contract': 'Create Contract - Revenue Sharing',
      'fetch-split-data': 'Fetch Split Data - Revenue Sharing',
      'execute-payout': 'Execute Payout - Payouts',
      'query-batch-status': 'Query Batch Status - Payouts',
    };
    document.title = titles[activeSection] || 'Welcome to the SHARE Protocol API';
  }, [activeSection]);

  // Handle Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const scrollToSection = (sectionId) => {
    // For main page sections (what-is, core-features, etc.), scroll within the welcome page
    const welcomeSubsections = ['what-is', 'core-features', 'quick-start', 'api-endpoint', 'authentication', 'request-format', 'need-help'];

    if (welcomeSubsections.includes(sectionId)) {
      // First ensure we're on the welcome page
      setActiveSection('welcome');
      // Then scroll to the subsection
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 0);
    } else {
      // For main sections, just switch the view and scroll to top
      setActiveSection(sectionId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Theme colors
  const theme = {
    bg: isDarkMode ? '#0a0a0a' : '#ffffff',
    bgSecondary: isDarkMode ? '#0f0f0f' : '#f5f5f5',
    bgTertiary: isDarkMode ? '#1a1a1a' : '#e5e5e5',
    bgCard: isDarkMode ? '#141414' : '#f9f9f9',
    bgHover: isDarkMode ? '#1a1a1a' : '#e8e8e8',
    bgActive: isDarkMode ? '#1f1f1f' : '#e0e0e0',
    border: isDarkMode ? '#1a1a1a' : '#e0e0e0',
    text: isDarkMode ? 'white' : '#1a1a1a',
    textSecondary: isDarkMode ? '#ccc' : '#444',
    textMuted: isDarkMode ? '#888' : '#666',
    textDimmed: isDarkMode ? '#666' : '#999',
  };

  // Sidebar link component with hover and active states
  const SidebarLink = ({ href, section, children, badge = null }) => {
    const isActive = activeSection === section;
    return (
      <a
        href={href}
        onClick={(e) => { e.preventDefault(); scrollToSection(section); }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 12px',
          color: isActive ? theme.text : theme.textMuted,
          textDecoration: 'none',
          fontSize: '14px',
          backgroundColor: isActive ? (isDarkMode ? '#1a1a1a' : '#e8e8e8') : 'transparent',
          borderRadius: '8px',
          margin: '2px 8px',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = isDarkMode ? '#141414' : '#f0f0f0';
            e.currentTarget.style.color = theme.text;
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = theme.textMuted;
          }
        }}
      >
        {badge && (
          <span style={{
            backgroundColor: isDarkMode ? 'transparent' : '#dbeafe',
            color: isDarkMode ? '#60a5fa' : '#2563eb',
            fontSize: '10px',
            fontWeight: '600',
            padding: '2px 6px',
            borderRadius: '4px',
          }}>{badge}</span>
        )}
        {children}
      </a>
    );
  };

  // Right sidebar link component
  const RightSidebarLink = ({ href, section, children, indented = false }) => {
    const isActive = activeSection === section;
    return (
      <a
        href={href}
        onClick={(e) => { e.preventDefault(); scrollToSection(section); }}
        style={{
          fontSize: '13px',
          color: isActive ? theme.text : theme.textDimmed,
          fontWeight: isActive ? '600' : '400',
          textDecoration: 'none',
          padding: indented ? '4px 0 4px 16px' : '4px 0',
          transition: 'color 0.15s ease',
          display: 'block',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = theme.text;
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.color = theme.textDimmed;
          }
        }}
      >
        {children}
      </a>
    );
  };

  // Search items for filtering
  const searchItems = [
    { title: 'Welcome to the SHARE Protocol API', section: 'welcome' },
    { title: 'What is the SHARE Protocol API?', section: 'what-is' },
    { title: 'Core Features', section: 'core-features' },
    { title: 'Quick Start', section: 'quick-start' },
    { title: 'API Endpoint', section: 'api-endpoint' },
    { title: 'Authentication', section: 'authentication' },
    { title: 'Request Format', section: 'request-format' },
    { title: 'Need Help?', section: 'need-help' },
    { title: 'Identity Lookup', section: 'identity-lookup' },
    { title: 'Create Contract', section: 'create-contract' },
    { title: 'Fetch Split Data', section: 'fetch-split-data' },
    { title: 'Execute Payout', section: 'execute-payout' },
    { title: 'Query Batch Status', section: 'query-batch-status' },
  ];

  const filteredSearchItems = searchItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
    <style>{scrollbarStyles}</style>
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: theme.bg,
      color: theme.text,
      fontFamily: '"Inter", sans-serif',
    }}>
      {/* Search Modal */}
      {searchOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '100px',
            zIndex: 2000,
          }}
          onClick={() => setSearchOpen(false)}
        >
          <div
            style={{
              backgroundColor: theme.bgSecondary,
              borderRadius: '12px',
              width: '100%',
              maxWidth: '600px',
              border: `1px solid ${theme.border}`,
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 20px',
              borderBottom: `1px solid ${theme.border}`,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  fontSize: '16px',
                  color: theme.text,
                }}
              />
              <span style={{
                color: theme.textMuted,
                fontSize: '12px',
                backgroundColor: theme.bgTertiary,
                padding: '4px 8px',
                borderRadius: '4px',
              }}>ESC</span>
            </div>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {filteredSearchItems.length > 0 ? (
                filteredSearchItems.map((item) => (
                  <div
                    key={item.section}
                    onClick={() => {
                      scrollToSection(item.section);
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    style={{
                      padding: '12px 20px',
                      cursor: 'pointer',
                      borderBottom: `1px solid ${theme.border}`,
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.bgTertiary}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div style={{ fontSize: '14px', color: theme.text }}>{item.title}</div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: theme.textMuted }}>
                  No results found
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Fixed Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        backgroundColor: theme.bg,
        borderBottom: `1px solid ${theme.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 1000,
      }}>
        {/* Logo */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img
            src="/logomain.png"
            alt="Formless Logo"
            style={{ height: '28px', width: 'auto', filter: isDarkMode ? 'none' : 'invert(1)' }}
          />
          <span style={{
            color: theme.text,
            fontSize: '16px',
            fontWeight: '600',
            letterSpacing: '0.5px',
          }}>
            FORMLESS<sup style={{ fontSize: '8px', marginLeft: '2px' }}>™</sup>
          </span>
        </a>

        {/* Search Bar - Center */}
        <div
          onClick={() => setSearchOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 16px',
            backgroundColor: theme.bgTertiary,
            borderRadius: '8px',
            border: `1px solid ${theme.border}`,
            minWidth: '300px',
            cursor: 'pointer',
            transition: 'border-color 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = theme.textMuted}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = theme.border}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <span style={{ color: theme.textMuted, fontSize: '14px', flex: 1 }}>Search...</span>
          <span style={{
            color: theme.textMuted,
            fontSize: '12px',
            backgroundColor: theme.bgSecondary,
            padding: '2px 6px',
            borderRadius: '4px',
          }}>Ctrl K</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            background: 'none',
            border: 'none',
            color: theme.textMuted,
            cursor: 'pointer',
            padding: '8px',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = theme.text}
          onMouseLeave={(e) => e.currentTarget.style.color = theme.textMuted}
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/>
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
          )}
        </button>
      </header>

      {/* Left Sidebar */}
      <aside style={{
        width: '280px',
        backgroundColor: theme.bgSecondary,
        borderRight: `1px solid ${theme.border}`,
        padding: '24px 0',
        paddingTop: '104px',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        overflowY: 'auto',
      }}>
        {/* Documentation Title */}
        <div style={{ padding: '0 20px', marginBottom: '16px' }}>
          <h2 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: theme.text,
            margin: 0,
          }}>Documentation</h2>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          backgroundColor: theme.border,
          margin: '16px 20px',
        }} />

        {/* Website Link */}
        <div style={{ padding: '0 20px', marginBottom: '24px' }}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: theme.textMuted,
              textDecoration: 'none',
              fontSize: '14px',
              padding: '8px 0',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            Website
          </a>
        </div>

        {/* Getting Started Section */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            padding: '0 20px',
            marginBottom: '12px',
            fontSize: '12px',
            fontWeight: '600',
            color: theme.text,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Getting Started
          </div>
          <SidebarLink href="#welcome" section="welcome">
            Welcome to the SHARE Protocol API
          </SidebarLink>
        </div>

        {/* Account Management Section */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            padding: '0 20px',
            marginBottom: '12px',
            fontSize: '12px',
            fontWeight: '600',
            color: theme.text,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Account Management
          </div>
          <SidebarLink href="#identity-lookup" section="identity-lookup" badge="POST">
            Identity Lookup
          </SidebarLink>
        </div>

        {/* Revenue Sharing Section */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            padding: '0 20px',
            marginBottom: '12px',
            fontSize: '12px',
            fontWeight: '600',
            color: theme.text,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Revenue Sharing
          </div>
          <SidebarLink href="#create-contract" section="create-contract" badge="POST">
            Create Contract
          </SidebarLink>
          <SidebarLink href="#fetch-split-data" section="fetch-split-data" badge="POST">
            Fetch Split Data
          </SidebarLink>
        </div>

        {/* Payouts Section */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            padding: '0 20px',
            marginBottom: '12px',
            fontSize: '12px',
            fontWeight: '600',
            color: theme.text,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Payouts
          </div>
          <SidebarLink href="#execute-payout" section="execute-payout" badge="POST">
            Execute Payout
          </SidebarLink>
          <SidebarLink href="#query-batch-status" section="query-batch-status" badge="POST">
            Query Batch Status
          </SidebarLink>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        marginLeft: '280px',
        marginRight: activeSection === 'identity-lookup' ? '20px' : '260px',
        padding: '40px 60px',
        paddingTop: '120px',
        transition: 'margin-right 0.2s ease',
      }}>
        {/* Welcome Page Content */}
        {activeSection === 'welcome' && (
          <>
            {/* Breadcrumb */}
            <div style={{
              fontSize: '14px',
              color: theme.textDimmed,
              marginBottom: '16px',
            }}>
              Getting Started
            </div>

            {/* Title Section */}
            <div id="welcome" style={{ marginBottom: '40px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}>
            <h1 style={{
              fontSize: '36px',
              fontWeight: '700',
              margin: 0,
              lineHeight: '1.2',
            }}>
              Welcome to the SHARE Protocol API
            </h1>
            <button
              onClick={() => copyToClipboard(window.location.href, 'page')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: theme.bgTertiary,
                border: `1px solid ${theme.border}`,
                borderRadius: '6px',
                color: theme.textMuted,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              {copiedCode === 'page' ? 'Copied!' : 'Copy page'}
            </button>
          </div>
          <p style={{
            fontSize: '18px',
            color: theme.textMuted,
            margin: 0,
          }}>
            Micropayments, revenue sharing and distribution.
          </p>
        </div>

        {/* SHARE Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '60px',
        }}>
          <img
            src="/logomain.png"
            alt="SHARE Logo"
            style={{ height: '40px', width: 'auto' }}
          />
          <span style={{
            fontSize: '32px',
            fontWeight: '600',
            letterSpacing: '2px',
          }}>SHARE</span>
        </div>

        {/* What is the SHARE Protocol API? */}
        <section id="what-is" style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '16px',
          }}>
            What is the SHARE Protocol API?
          </h2>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.7',
            color: theme.textSecondary,
          }}>
            SHARE Protocol API helps you offer flexible revenue sharing to your products and experiences. It's built for creators, businesses and developers.
          </p>
        </section>

        {/* Core Features */}
        <section id="core-features" style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '24px',
          }}>
            Core Features
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
          }}>
            {/* Account Management Card */}
            <div style={{
              backgroundColor: theme.bgCard,
              borderRadius: '12px',
              padding: '24px',
              border: `1px solid ${theme.border}`,
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" style={{ marginBottom: '16px' }}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '8px',
              }}>
                Account Management
              </h3>
              <p style={{
                fontSize: '14px',
                color: theme.textMuted,
                margin: 0,
                lineHeight: '1.5',
              }}>
                Manage user identities and accounts
              </p>
            </div>

            {/* Revenue Sharing Card */}
            <div style={{
              backgroundColor: theme.bgCard,
              borderRadius: '12px',
              padding: '24px',
              border: `1px solid ${theme.border}`,
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" style={{ marginBottom: '16px' }}>
                <circle cx="18" cy="5" r="3"/>
                <circle cx="6" cy="12" r="3"/>
                <circle cx="18" cy="19" r="3"/>
                <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>
              </svg>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '8px',
              }}>
                Revenue Sharing
              </h3>
              <p style={{
                fontSize: '14px',
                color: theme.textMuted,
                margin: 0,
                lineHeight: '1.5',
              }}>
                Create contracts to split payments
              </p>
            </div>

            {/* Payouts Card */}
            <div style={{
              backgroundColor: theme.bgCard,
              borderRadius: '12px',
              padding: '24px',
              border: `1px solid ${theme.border}`,
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" style={{ marginBottom: '16px' }}>
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <circle cx="12" cy="12" r="4"/>
                <path d="M2 10h2M20 10h2M2 14h2M20 14h2"/>
              </svg>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '8px',
              }}>
                Payouts
              </h3>
              <p style={{
                fontSize: '14px',
                color: theme.textMuted,
                margin: 0,
                lineHeight: '1.5',
              }}>
                Distribute revenue automatically
              </p>
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section id="quick-start" style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '16px',
          }}>
            Quick Start
          </h2>
          <p style={{
            fontSize: '16px',
            color: theme.textSecondary,
            marginBottom: '32px',
          }}>
            Please <a href="mailto:contact@formless.xyz" style={{ color: 'white', textDecoration: 'underline' }}>contact us</a> for a sandbox API key.
          </p>

          {/* 1. API Endpoint */}
          <div id="api-endpoint" style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '12px',
            }}>
              1. API Endpoint
            </h3>
            <p style={{
              fontSize: '15px',
              color: theme.textMuted,
              marginBottom: '16px',
            }}>
              All requests go to:
            </p>
            <div style={{
              backgroundColor: theme.bgCard,
              borderRadius: '8px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: `1px solid ${theme.border}`,
            }}>
              <code style={{
                fontSize: '14px',
                color: theme.textSecondary,
                fontFamily: 'Monaco, Consolas, monospace',
              }}>
                <span style={{ color: '#22c55e' }}>POST</span> https://share-ddn.formless.xyz/v1
              </code>
              <button
                onClick={() => copyToClipboard('POST https://share-ddn.formless.xyz/v1', 'endpoint')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: theme.textDimmed,
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                {copiedCode === 'endpoint' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* 2. Authentication */}
          <div id="authentication" style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '12px',
            }}>
              2. Authentication
            </h3>
            <p style={{
              fontSize: '15px',
              color: theme.textMuted,
              marginBottom: '16px',
            }}>
              Include your JWT token in every request:
            </p>
            <div style={{
              backgroundColor: theme.bgCard,
              borderRadius: '8px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: `1px solid ${theme.border}`,
            }}>
              <code style={{
                fontSize: '14px',
                color: theme.textSecondary,
                fontFamily: 'Monaco, Consolas, monospace',
              }}>
                <span style={{ color: theme.textMuted }}>Authorization:</span> <span style={{ color: '#f472b6' }}>Bearer</span> <span style={{ color: '#60a5fa' }}>&lt;your-jwt-token&gt;</span>
              </code>
              <button
                onClick={() => copyToClipboard('Authorization: Bearer <your-jwt-token>', 'auth')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: theme.textDimmed,
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                {copiedCode === 'auth' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* 3. Request Format */}
          <div id="request-format" style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '12px',
            }}>
              3. Request Format
            </h3>
            <p style={{
              fontSize: '15px',
              color: theme.textMuted,
              marginBottom: '16px',
            }}>
              SHARE Protocol uses JSON-RPC 2.0:
            </p>
            <div style={{
              backgroundColor: theme.bgCard,
              borderRadius: '8px',
              padding: '20px',
              position: 'relative',
              border: `1px solid ${theme.border}`,
            }}>
              <button
                onClick={() => copyToClipboard(`{
  "jsonrpc": "2.0",
  "id": "1",
  "method": "method_name",
  "params": {
    // your parameters here
  }
}`, 'format')}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'none',
                  border: 'none',
                  color: theme.textDimmed,
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                {copiedCode === 'format' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                )}
              </button>
              <pre style={{
                fontSize: '14px',
                fontFamily: 'Monaco, Consolas, monospace',
                margin: 0,
                lineHeight: '1.6',
                color: theme.textSecondary,
              }}>
{`{
  `}<span style={{ color: '#60a5fa' }}>"jsonrpc"</span>{`: `}<span style={{ color: '#22c55e' }}>"2.0"</span>{`,
  `}<span style={{ color: '#60a5fa' }}>"id"</span>{`: `}<span style={{ color: '#22c55e' }}>"1"</span>{`,
  `}<span style={{ color: '#60a5fa' }}>"method"</span>{`: `}<span style={{ color: '#22c55e' }}>"method_name"</span>{`,
  `}<span style={{ color: '#60a5fa' }}>"params"</span>{`: {
    `}<span style={{ color: theme.textDimmed }}>// your parameters here</span>{`
  }
}`}
              </pre>
            </div>
          </div>
        </section>

        {/* Need Help? */}
        <section id="need-help" style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '16px',
          }}>
            Need Help?
          </h2>
          <p style={{
            fontSize: '16px',
            color: theme.textSecondary,
            lineHeight: '1.7',
          }}>
            Visit{' '}
            <a href="https://formless.xyz" target="_blank" rel="noopener noreferrer" style={{ color: 'white', fontWeight: '600', textDecoration: 'none' }}>
              formless.xyz
            </a>
            {' '}to learn more about Formless.
          </p>
        </section>

        {/* Next Page Navigation for Welcome */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          paddingTop: '24px',
          borderTop: `1px solid ${theme.border}`,
          marginBottom: '60px',
        }}>
          <a
            href="#identity-lookup"
            onClick={(e) => { e.preventDefault(); scrollToSection('identity-lookup'); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: theme.text,
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            Identity Lookup
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </a>
        </div>

        {/* Footer for Welcome */}
        <footer style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '24px',
          borderTop: `1px solid ${theme.border}`,
        }}>
          <a
            href="https://github.com/formless"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: theme.textDimmed, transition: 'color 0.2s ease' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          <span style={{ color: theme.textDimmed, fontSize: '14px' }}>
            Powered by{' '}
            <a
              href="https://mintlify.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'white', fontWeight: '600', textDecoration: 'none' }}
            >
              mintlify
            </a>
          </span>
        </footer>
          </>
        )}

        {/* Identity Lookup Page Content */}
        {activeSection === 'identity-lookup' && (
          <>
            {/* Two Column Layout */}
            <div style={{ display: 'flex', gap: '40px' }}>
              {/* Left Column - Documentation */}
              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                  marginRight: '460px',
                }}>
                {/* Inner content wrapper */}
                <div>
                {/* Breadcrumb */}
                <div style={{
                  fontSize: '14px',
                  color: theme.textDimmed,
                  marginBottom: '16px',
                }}>
                  Account Management
                </div>

                {/* Title with Copy page button */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}>
                <h2 style={{
                  fontSize: '36px',
                  fontWeight: '700',
                  margin: 0,
                  lineHeight: '1.2',
                }}>
                  Identity Lookup
                </h2>
                <button
                  onClick={() => copyToClipboard(window.location.href + '#identity-lookup', 'identity-page')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    backgroundColor: theme.bgTertiary,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '6px',
                    color: theme.textMuted,
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                  {copiedCode === 'identity-page' ? 'Copied!' : 'Copy page'}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
              </div>

              {/* Description */}
              <p style={{
                fontSize: '18px',
                color: theme.textMuted,
                marginBottom: '24px',
              }}>
                Retrieve user identity information by email address
              </p>

              {/* API Endpoint Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '32px',
              }}>
                <span style={{
                  backgroundColor: 'transparent',
                  color: '#60a5fa',
                  fontSize: '14px',
                  fontWeight: '700',
                  padding: '8px 16px',
                  borderRadius: '6px',
                }}>POST</span>
                <code style={{
                  fontSize: '14px',
                  color: theme.textSecondary,
                  fontFamily: 'Monaco, Consolas, monospace',
                  backgroundColor: theme.bgCard,
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: `1px solid ${theme.border}`,
                }}>
                  /v1#identity_get_by_email_address
                </code>
                <button style={{
                  backgroundColor: '#3064e3',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  padding: '8px 20px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  Try it
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              </div>

              {/* Method Description */}
              <p style={{
                fontSize: '16px',
                color: theme.textSecondary,
                marginBottom: '40px',
                lineHeight: '1.7',
              }}>
                Retrieve user identity information based on an email address using the{' '}
                <code style={{
                  backgroundColor: theme.bgCard,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '14px',
                  border: `1px solid ${theme.border}`,
                }}>identity_get_by_email_address</code> method.
              </p>

          {/* Authorizations Section */}
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '24px',
              paddingBottom: '12px',
              borderBottom: `1px solid ${theme.border}`,
            }}>
              Authorizations
            </h3>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '12px',
            }}>
              <span style={{ color: theme.text, fontWeight: '500' }}>Authorization</span>
              <span style={{
                backgroundColor: theme.bgTertiary,
                color: theme.text,
                fontSize: '12px',
                padding: '2px 8px',
                borderRadius: '4px',
              }}>string</span>
              <span style={{
                backgroundColor: theme.bgTertiary,
                color: theme.text,
                fontSize: '12px',
                padding: '2px 8px',
                borderRadius: '4px',
              }}>header</span>
              <span style={{
                backgroundColor: 'rgba(220, 38, 38, 0.15)',
                color: '#f25c5c',
                fontSize: '12px',
                fontWeight: '600',
                padding: '2px 8px',
                borderRadius: '4px',
              }}>required</span>
            </div>
            <p style={{
              fontSize: '14px',
              color: theme.textMuted,
            }}>
              JWT token with Unique ID identification
            </p>
          </div>

          {/* Body Section */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              paddingBottom: '12px',
              borderBottom: `1px solid ${theme.border}`,
            }}>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                margin: 0,
              }}>
                Body
              </h3>
              <span style={{
                color: theme.textMuted,
                fontSize: '14px',
              }}>application/json</span>
            </div>

            {/* jsonrpc field */}
            <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '8px',
              }}>
                <span style={{ color: theme.text, fontWeight: '500' }}>jsonrpc</span>
                <span style={{
                  backgroundColor: theme.bgTertiary,
                  color: theme.text,
                  fontSize: '12px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}>enum&lt;string&gt;</span>
                <span style={{
                  backgroundColor: theme.bgTertiary,
                  fontSize: '12px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}><span style={{ color: theme.textMuted }}>default:</span><span style={{ color: theme.text }}>2.0</span></span>
                <span style={{
                  backgroundColor: 'rgba(220, 38, 38, 0.15)',
                  color: '#f25c5c',
                  fontSize: '12px',
                  fontWeight: '600',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}>required</span>
              </div>
              <p style={{ fontSize: '14px', color: theme.textMuted }}>
                Available options: <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px', color: theme.text }}>2.0</code>
              </p>
            </div>

            {/* id field */}
            <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '8px',
              }}>
                <span style={{ color: theme.text, fontWeight: '500' }}>id</span>
                <span style={{
                  backgroundColor: theme.bgTertiary,
                  color: theme.text,
                  fontSize: '12px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}>string</span>
                <span style={{
                  backgroundColor: theme.bgTertiary,
                  fontSize: '12px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}><span style={{ color: theme.textMuted }}>default:</span><span style={{ color: theme.text }}>1</span></span>
                <span style={{
                  backgroundColor: 'rgba(220, 38, 38, 0.15)',
                  color: '#f25c5c',
                  fontSize: '12px',
                  fontWeight: '600',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}>required</span>
              </div>
            </div>

            {/* method field */}
            <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '8px',
                flexWrap: 'wrap',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                <span style={{ color: theme.text, fontWeight: '500' }}>method</span>
                <span style={{
                  backgroundColor: theme.bgTertiary,
                  color: theme.text,
                  fontSize: '12px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}>enum&lt;string&gt;</span>
                <span style={{
                  backgroundColor: theme.bgTertiary,
                  fontSize: '12px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}><span style={{ color: theme.textMuted }}>default:</span><span style={{ color: theme.text }}>identity_get_by_email_address</span></span>
                <span style={{
                  backgroundColor: 'rgba(220, 38, 38, 0.15)',
                  color: '#f25c5c',
                  fontSize: '12px',
                  fontWeight: '600',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}>required</span>
              </div>
              <p style={{ fontSize: '14px', color: theme.textMuted }}>
                Available options: <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px', color: theme.text }}>identity_get_by_email_address</code>
              </p>
            </div>

            {/* params field */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px',
              }}>
                <span style={{ color: theme.text, fontWeight: '500' }}>params</span>
                <span style={{
                  backgroundColor: theme.bgTertiary,
                  color: theme.text,
                  fontSize: '12px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}>object</span>
                <span style={{
                  backgroundColor: 'rgba(220, 38, 38, 0.15)',
                  color: '#f25c5c',
                  fontSize: '12px',
                  fontWeight: '600',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}>required</span>
              </div>

              {/* Collapsible params container */}
              <div style={{
                backgroundColor: theme.bgCard,
                borderRadius: '8px',
                border: `1px solid ${theme.border}`,
                overflow: 'hidden',
              }}>
                {/* Show/Hide child attributes toggle */}
                <div
                  onClick={() => setShowParamsChildren(!showParamsChildren)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '16px 20px',
                    color: theme.textMuted,
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.bgHover}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{
                      transform: showParamsChildren ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                  {showParamsChildren ? 'Hide child attributes' : 'Show child attributes'}
                </div>

                {/* Nested params.email_address - shown when expanded */}
                {showParamsChildren && (
                  <div style={{
                    padding: '0 20px 20px 20px',
                    borderTop: `1px solid ${theme.border}`,
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      paddingTop: '16px',
                      flexWrap: 'wrap',
                    }}>
                      <span style={{ color: theme.textMuted, fontSize: '14px' }}>params.</span>
                      <span style={{ color: theme.text, fontWeight: '500' }}>email_address</span>
                      <span style={{
                        backgroundColor: theme.bgTertiary,
                        color: theme.text,
                        fontSize: '12px',
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}>string&lt;email&gt;</span>
                      <span style={{
                        backgroundColor: theme.bgTertiary,
                        fontSize: '12px',
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}><span style={{ color: theme.textMuted }}>default:</span><span style={{ color: theme.text }}>user@example.com</span></span>
                      <span style={{
                        backgroundColor: 'rgba(220, 38, 38, 0.15)',
                        color: '#f25c5c',
                        fontSize: '12px',
                        fontWeight: '600',
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}>required</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Response Section */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              paddingBottom: '12px',
              borderBottom: `1px solid ${theme.border}`,
            }}>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                margin: 0,
              }}>
                Response
              </h3>
              <span style={{
                color: theme.textMuted,
                fontSize: '14px',
              }}>200 - application/json</span>
            </div>

            <p style={{
              fontSize: '14px',
              color: theme.textMuted,
              marginBottom: '24px',
            }}>
              Successful response
            </p>

            {/* Response jsonrpc field */}
            <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '8px',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                <span style={{ color: theme.text, fontWeight: '500' }}>jsonrpc</span>
                <span style={{
                  backgroundColor: theme.bgTertiary,
                  color: theme.text,
                  fontSize: '12px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}>enum&lt;string&gt;</span>
                <span style={{
                  backgroundColor: 'rgba(220, 38, 38, 0.15)',
                  color: '#f25c5c',
                  fontSize: '12px',
                  fontWeight: '600',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}>required</span>
              </div>
              <p style={{ fontSize: '14px', color: theme.textMuted }}>
                Available options: <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px', color: theme.text }}>2.0</code>
              </p>
            </div>

            {/* Response id field */}
            <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                <span style={{ color: theme.text, fontWeight: '500' }}>id</span>
                <span style={{
                  backgroundColor: theme.bgTertiary,
                  color: theme.text,
                  fontSize: '12px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}>string</span>
                <span style={{
                  backgroundColor: 'rgba(220, 38, 38, 0.15)',
                  color: '#f25c5c',
                  fontSize: '12px',
                  fontWeight: '600',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}>required</span>
              </div>
            </div>

            {/* Response result field */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                <span style={{ color: theme.text, fontWeight: '500' }}>result</span>
                <span style={{
                  backgroundColor: theme.bgTertiary,
                  color: theme.text,
                  fontSize: '12px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}>object</span>
                <span style={{
                  backgroundColor: 'rgba(220, 38, 38, 0.15)',
                  color: '#f25c5c',
                  fontSize: '12px',
                  fontWeight: '600',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}>required</span>
              </div>

              {/* Option Tabs */}
              <div style={{
                backgroundColor: theme.bgCard,
                borderRadius: '8px',
                border: `1px solid ${theme.border}`,
                overflow: 'hidden',
              }}>
                {/* Tab Headers */}
                <div style={{
                  display: 'flex',
                  borderBottom: `1px solid ${theme.border}`,
                }}>
                  <button
                    onClick={() => setActiveResponseOption(1)}
                    style={{
                      padding: '12px 20px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: activeResponseOption === 1 ? theme.text : theme.textMuted,
                      fontSize: '14px',
                      fontWeight: activeResponseOption === 1 ? '500' : '400',
                      cursor: 'pointer',
                      borderBottom: activeResponseOption === 1 ? `2px solid ${theme.text}` : '2px solid transparent',
                      marginBottom: '-1px',
                    }}
                  >Option 1</button>
                  <button
                    onClick={() => setActiveResponseOption(2)}
                    style={{
                      padding: '12px 20px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: activeResponseOption === 2 ? theme.text : theme.textMuted,
                      fontSize: '14px',
                      fontWeight: activeResponseOption === 2 ? '500' : '400',
                      cursor: 'pointer',
                      borderBottom: activeResponseOption === 2 ? `2px solid ${theme.text}` : '2px solid transparent',
                      marginBottom: '-1px',
                    }}
                  >Option 2</button>
                </div>

                <div style={{ padding: '20px' }}>
                  {/* Show/Hide child attributes toggle */}
                  <div
                    onClick={() => setShowResultChildren(!showResultChildren)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '20px',
                      color: theme.textMuted,
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{
                        transform: showResultChildren ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                      }}
                    >
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                    {showResultChildren ? 'Hide child attributes' : 'Show child attributes'}
                  </div>

                  {/* Content shown when expanded */}
                  {showResultChildren && (
                    <>
                      {/* Option 1 Content - Success Response */}
                      {activeResponseOption === 1 && (
                        <>
                          {/* result.success */}
                          <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              marginBottom: '8px',
                              flexWrap: 'wrap',
                            }}>
                              <span style={{ color: theme.textMuted, fontSize: '14px' }}>result.</span>
                              <span style={{ color: theme.text, fontWeight: '500' }}>success</span>
                              <span style={{
                                backgroundColor: theme.bgTertiary,
                                color: theme.text,
                                fontSize: '12px',
                                padding: '2px 8px',
                                borderRadius: '4px',
                              }}>enum&lt;boolean&gt;</span>
                              <span style={{
                                backgroundColor: 'rgba(220, 38, 38, 0.15)',
                                color: '#f25c5c',
                                fontSize: '12px',
                                fontWeight: '600',
                                padding: '2px 8px',
                                borderRadius: '4px',
                              }}>required</span>
                            </div>
                            <p style={{ fontSize: '14px', color: theme.textMuted, marginBottom: '8px' }}>
                              Indicates if the request was successful
                            </p>
                            <p style={{ fontSize: '14px', color: theme.textMuted }}>
                              Available options: <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px' }}>true</code> , <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px' }}>false</code>
                            </p>
                          </div>

                          {/* result.user_unique_id */}
                          <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              marginBottom: '8px',
                              flexWrap: 'wrap',
                            }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth="2">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                              </svg>
                              <span style={{ color: theme.textMuted, fontSize: '14px' }}>result.</span>
                              <span style={{ color: theme.text, fontWeight: '500' }}>user_unique_id</span>
                              <span style={{
                                backgroundColor: theme.bgTertiary,
                                color: theme.text,
                                fontSize: '12px',
                                padding: '2px 8px',
                                borderRadius: '4px',
                              }}>string</span>
                              <span style={{
                                backgroundColor: 'rgba(220, 38, 38, 0.15)',
                                color: '#f25c5c',
                                fontSize: '12px',
                                fontWeight: '600',
                                padding: '2px 8px',
                                borderRadius: '4px',
                              }}>required</span>
                            </div>
                            <p style={{ fontSize: '14px', color: theme.textMuted }}>
                              The Unique ID of the user
                            </p>
                          </div>

                          {/* result.email_address */}
                          <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              marginBottom: '8px',
                              flexWrap: 'wrap',
                            }}>
                              <span style={{ color: theme.textMuted, fontSize: '14px' }}>result.</span>
                              <span style={{ color: theme.text, fontWeight: '500' }}>email_address</span>
                              <span style={{
                                backgroundColor: theme.bgTertiary,
                                color: theme.text,
                                fontSize: '12px',
                                padding: '2px 8px',
                                borderRadius: '4px',
                              }}>string&lt;email&gt;</span>
                              <span style={{
                                backgroundColor: 'rgba(220, 38, 38, 0.15)',
                                color: '#f25c5c',
                                fontSize: '12px',
                                fontWeight: '600',
                                padding: '2px 8px',
                                borderRadius: '4px',
                              }}>required</span>
                            </div>
                            <p style={{ fontSize: '14px', color: theme.textMuted }}>
                              The email address of the user
                            </p>
                          </div>

                          {/* result.display_name */}
                          <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              marginBottom: '8px',
                              flexWrap: 'wrap',
                            }}>
                              <span style={{ color: theme.textMuted, fontSize: '14px' }}>result.</span>
                              <span style={{ color: theme.text, fontWeight: '500' }}>display_name</span>
                              <span style={{
                                backgroundColor: theme.bgTertiary,
                                color: theme.text,
                                fontSize: '12px',
                                padding: '2px 8px',
                                borderRadius: '4px',
                              }}>string</span>
                            </div>
                            <p style={{ fontSize: '14px', color: theme.textMuted }}>
                              The display name of the user
                            </p>
                          </div>

                          {/* result.verified_identity */}
                          <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              marginBottom: '8px',
                              flexWrap: 'wrap',
                            }}>
                              <span style={{ color: theme.textMuted, fontSize: '14px' }}>result.</span>
                              <span style={{ color: theme.text, fontWeight: '500' }}>verified_identity</span>
                              <span style={{
                                backgroundColor: theme.bgTertiary,
                                color: theme.text,
                                fontSize: '12px',
                                padding: '2px 8px',
                                borderRadius: '4px',
                              }}>boolean</span>
                            </div>
                            <p style={{ fontSize: '14px', color: theme.textMuted }}>
                              Whether the user's identity has been verified
                            </p>
                          </div>

                          {/* result.financial_accounts */}
                          <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              marginBottom: '8px',
                              flexWrap: 'wrap',
                            }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth="2">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                              </svg>
                              <span style={{ color: theme.textMuted, fontSize: '14px' }}>result.</span>
                              <span style={{ color: theme.text, fontWeight: '500' }}>financial_accounts</span>
                              <span style={{
                                backgroundColor: theme.bgTertiary,
                                color: theme.text,
                                fontSize: '12px',
                                padding: '2px 8px',
                                borderRadius: '4px',
                              }}>object[]</span>
                            </div>
                            <p style={{ fontSize: '14px', color: theme.textMuted }}>
                              Array of the user's linked financial accounts
                            </p>
                          </div>

                          {/* result.verifications */}
                          <div>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              marginBottom: '8px',
                              flexWrap: 'wrap',
                            }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth="2">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                              </svg>
                              <span style={{ color: theme.textMuted, fontSize: '14px' }}>result.</span>
                              <span style={{ color: theme.text, fontWeight: '500' }}>verifications</span>
                              <span style={{
                                backgroundColor: theme.bgTertiary,
                                color: theme.text,
                                fontSize: '12px',
                                padding: '2px 8px',
                                borderRadius: '4px',
                              }}>object[]</span>
                            </div>
                            <p style={{ fontSize: '14px', color: theme.textMuted }}>
                              Array of verification records for the user
                            </p>
                          </div>
                        </>
                      )}

                      {/* Option 2 Content - Error Response */}
                      {activeResponseOption === 2 && (
                        <>
                          {/* result.success */}
                          <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              marginBottom: '8px',
                              flexWrap: 'wrap',
                            }}>
                              <span style={{ color: theme.textMuted, fontSize: '14px' }}>result.</span>
                              <span style={{ color: theme.text, fontWeight: '500' }}>success</span>
                              <span style={{
                                backgroundColor: theme.bgTertiary,
                                color: theme.text,
                                fontSize: '12px',
                                padding: '2px 8px',
                                borderRadius: '4px',
                              }}>enum&lt;boolean&gt;</span>
                              <span style={{
                                backgroundColor: 'rgba(220, 38, 38, 0.15)',
                                color: '#f25c5c',
                                fontSize: '12px',
                                fontWeight: '600',
                                padding: '2px 8px',
                                borderRadius: '4px',
                              }}>required</span>
                            </div>
                            <p style={{ fontSize: '14px', color: theme.textMuted, marginBottom: '8px' }}>
                              Indicates the request failed
                            </p>
                            <p style={{ fontSize: '14px', color: theme.textMuted }}>
                              Available options: <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px' }}>true</code> , <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px' }}>false</code>
                            </p>
                          </div>

                          {/* result.message */}
                          <div>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              marginBottom: '8px',
                              flexWrap: 'wrap',
                            }}>
                              <span style={{ color: theme.textMuted, fontSize: '14px' }}>result.</span>
                              <span style={{ color: theme.text, fontWeight: '500' }}>message</span>
                              <span style={{
                                backgroundColor: theme.bgTertiary,
                                color: theme.text,
                                fontSize: '12px',
                                padding: '2px 8px',
                                borderRadius: '4px',
                              }}>string</span>
                              <span style={{
                                backgroundColor: 'rgba(220, 38, 38, 0.15)',
                                color: '#f25c5c',
                                fontSize: '12px',
                                fontWeight: '600',
                                padding: '2px 8px',
                                borderRadius: '4px',
                              }}>required</span>
                            </div>
                            <p style={{ fontSize: '14px', color: theme.textMuted }}>
                              Error message describing why the request failed
                            </p>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation inside left column */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: '24px',
            borderTop: `1px solid ${theme.border}`,
            marginTop: '40px',
            marginBottom: '40px',
          }}>
            <a
              href="#welcome"
              onClick={(e) => { e.preventDefault(); scrollToSection('welcome'); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: theme.text,
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
              Welcome to the SHARE Protocol API
            </a>
            <a
              href="#create-contract"
              onClick={(e) => { e.preventDefault(); scrollToSection('create-contract'); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: theme.text,
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Create Contract
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </a>
          </div>

          {/* Footer inside left column */}
          <footer style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '24px',
            borderTop: `1px solid ${theme.border}`,
          }}>
            <a
              href="https://github.com/formless"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: theme.textDimmed, transition: 'color 0.2s ease' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <span style={{ color: theme.textDimmed, fontSize: '14px' }}>
              Powered by{' '}
              <a
                href="https://mintlify.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'white', fontWeight: '600', textDecoration: 'none' }}
              >
                mintlify
              </a>
            </span>
          </footer>
                </div>
                {/* End inner content wrapper */}
              </div>
              {/* End Left Column */}

            {/* Right Column - Code Panels (Fixed) */}
            <div
              style={{
                width: '420px',
                flexShrink: 0,
                position: 'fixed',
                top: '120px',
                right: '40px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
              }}>

              {/* First Panel - cURL Request */}
              <div style={{
                backgroundColor: theme.bgCard,
                borderRadius: '12px',
                border: `1px solid ${theme.border}`,
                overflow: 'hidden',
              }}>
                {/* Panel Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderBottom: `1px solid ${theme.border}`,
                  backgroundColor: theme.bgSecondary,
                }}>
                  <span style={{ fontWeight: '600', color: theme.text, fontSize: '14px' }}>Identity Lookup</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: theme.bgTertiary,
                      padding: '4px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth="2">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                        <line x1="8" y1="21" x2="16" y2="21"/>
                        <line x1="12" y1="17" x2="12" y2="21"/>
                      </svg>
                      <span style={{ color: theme.textMuted, fontSize: '12px' }}>cURL</span>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth="2">
                        <path d="M6 9l6 6 6-6"/>
                      </svg>
                    </div>
                    <button
                      onClick={() => copyToClipboard(`curl --request POST \\
  --url 'https://share-ddn.formless.xyz/v1#identity_get_by_email_address' \\
  --header 'Authorization: Bearer <token>' \\
  --header 'Content-Type: application/json' \\
  --data '
{
  "jsonrpc": "2.0",
  "id": "1",
  "method": "identity_get_by_email_address",
  "params": {
    "email_address": "user@example.com"
  }
}
'`, 'curl-identity')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: theme.textMuted,
                        cursor: 'pointer',
                        padding: '4px',
                      }}
                    >
                      {copiedCode === 'curl-identity' ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* cURL Code with both scrollbars fixed */}
                <div className="code-panel-scroll" style={{ maxHeight: '160px', padding: '14px' }}>
                  <pre style={{
                    fontSize: '11px',
                    fontFamily: 'Monaco, Consolas, monospace',
                    margin: 0,
                    lineHeight: '1.5',
                    color: theme.textSecondary,
                    whiteSpace: 'pre',
                  }}>
{`curl `}<span style={{ color: '#f472b6' }}>--request</span>{` POST \\
  `}<span style={{ color: '#f472b6' }}>--url</span>{` `}<span style={{ color: '#fbbf24' }}>'https://share-ddn.formless.xyz/v1#identity_get_by_email_address'</span>{` \\
  `}<span style={{ color: '#f472b6' }}>--header</span>{` `}<span style={{ color: '#fbbf24' }}>'Authorization: Bearer &lt;token&gt;'</span>{` \\
  `}<span style={{ color: '#f472b6' }}>--header</span>{` `}<span style={{ color: '#fbbf24' }}>'Content-Type: application/json'</span>{` \\
  `}<span style={{ color: '#f472b6' }}>--data</span>{` `}<span style={{ color: '#fbbf24' }}>'</span>{`
{
  `}<span style={{ color: '#60a5fa' }}>"jsonrpc"</span>: <span style={{ color: '#fbbf24' }}>"2.0"</span>,{`
  `}<span style={{ color: '#60a5fa' }}>"id"</span>: <span style={{ color: '#fbbf24' }}>"1"</span>,{`
  `}<span style={{ color: '#60a5fa' }}>"method"</span>: <span style={{ color: '#fbbf24' }}>"identity_get_by_email_address"</span>,{`
  `}<span style={{ color: '#60a5fa' }}>"params"</span>: {`{
    `}<span style={{ color: '#60a5fa' }}>"email_address"</span>: <span style={{ color: '#fbbf24' }}>"user@example.com"</span>{`
  }
}
`}<span style={{ color: '#fbbf24' }}>'</span>
                  </pre>
                </div>
              </div>

              {/* Second Panel - Response */}
              <div style={{
                backgroundColor: theme.bgCard,
                borderRadius: '12px',
                border: `1px solid ${theme.border}`,
                overflow: 'hidden',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 16px',
                  backgroundColor: theme.bgSecondary,
                }}>
                  <span style={{ color: theme.textMuted, fontSize: '13px' }}>200</span>
                  <button
                    onClick={() => copyToClipboard(`{
  "jsonrpc": "2.0",
  "id": "<string>",
  "result": {
    "success": true,
    "user_unique_id": "<string>",
    "email_address": "jsmith@example.com",
    "display_name": "<string>",
    "verified_identity": true,
    "financial_accounts": [
      {}
    ],
    "verifications": [
      {}
    ]
  }
}`, 'response-identity')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: theme.textMuted,
                      cursor: 'pointer',
                      padding: '4px',
                    }}
                  >
                    {copiedCode === 'response-identity' ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                      </svg>
                    )}
                  </button>
                </div>

                {/* Response Code with both scrollbars fixed */}
                <div className="code-panel-scroll" style={{ maxHeight: '160px', padding: '14px' }}>
                  <pre style={{
                    fontSize: '11px',
                    fontFamily: 'Monaco, Consolas, monospace',
                    margin: 0,
                    lineHeight: '1.5',
                    color: theme.textSecondary,
                    whiteSpace: 'pre',
                  }}>
{`{
  `}<span style={{ color: '#60a5fa' }}>"jsonrpc"</span>: <span style={{ color: '#fbbf24' }}>"2.0"</span>,{`
  `}<span style={{ color: '#60a5fa' }}>"id"</span>: <span style={{ color: '#fbbf24' }}>"&lt;string&gt;"</span>,{`
  `}<span style={{ color: '#60a5fa' }}>"result"</span>: {`{
    `}<span style={{ color: '#60a5fa' }}>"success"</span>: <span style={{ color: '#4ade80' }}>true</span>,{`
    `}<span style={{ color: '#60a5fa' }}>"user_unique_id"</span>: <span style={{ color: '#fbbf24' }}>"&lt;string&gt;"</span>,{`
    `}<span style={{ color: '#60a5fa' }}>"email_address"</span>: <span style={{ color: '#fbbf24' }}>"jsmith@example.com"</span>,{`
    `}<span style={{ color: '#60a5fa' }}>"display_name"</span>: <span style={{ color: '#fbbf24' }}>"&lt;string&gt;"</span>,{`
    `}<span style={{ color: '#60a5fa' }}>"verified_identity"</span>: <span style={{ color: '#4ade80' }}>true</span>,{`
    `}<span style={{ color: '#60a5fa' }}>"financial_accounts"</span>: {`[
      {}
    ]`},{`
    `}<span style={{ color: '#60a5fa' }}>"verifications"</span>: {`[
      {}
    ]
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
            {/* End Right Column */}
          </div>
          {/* End Two Column Layout */}

          </>
        )}
      </main>

      {/* Right Sidebar - On This Page (hidden on Identity Lookup) */}
      {activeSection !== 'identity-lookup' && (
        <aside style={{
          width: '240px',
          position: 'fixed',
          top: '80px',
          right: 0,
          height: 'calc(100vh - 80px)',
          borderLeft: `1px solid ${theme.border}`,
          backgroundColor: theme.bg,
          overflowY: 'auto',
          padding: '40px 20px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.textDimmed} strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
            <span style={{ fontSize: '14px', fontWeight: '600', color: theme.textMuted }}>
              On this page
            </span>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <RightSidebarLink href="#what-is" section="what-is">
              What is the SHARE Protocol API?
            </RightSidebarLink>
            <RightSidebarLink href="#core-features" section="core-features">
              Core Features
            </RightSidebarLink>
            <RightSidebarLink href="#quick-start" section="quick-start">
              Quick Start
            </RightSidebarLink>
            <RightSidebarLink href="#api-endpoint" section="api-endpoint" indented>
              1. API Endpoint
            </RightSidebarLink>
            <RightSidebarLink href="#authentication" section="authentication" indented>
              2. Authentication
            </RightSidebarLink>
            <RightSidebarLink href="#request-format" section="request-format" indented>
              3. Request Format
            </RightSidebarLink>
            <RightSidebarLink href="#need-help" section="need-help">
              Need Help?
            </RightSidebarLink>
          </nav>
        </aside>
      )}

      {/* Responsive Styles */}
      <style>
        {`
          /* Custom Scrollbar */
          aside::-webkit-scrollbar {
            width: 6px;
          }
          aside::-webkit-scrollbar-track {
            background: transparent;
          }
          aside::-webkit-scrollbar-thumb {
            background: ${isDarkMode ? '#333' : '#ccc'};
            border-radius: 3px;
          }
          aside::-webkit-scrollbar-thumb:hover {
            background: ${isDarkMode ? '#444' : '#aaa'};
          }

          /* Firefox scrollbar */
          aside {
            scrollbar-width: thin;
            scrollbar-color: ${isDarkMode ? '#333 transparent' : '#ccc transparent'};
          }

          @media (max-width: 1200px) {
            aside:last-child {
              display: none;
            }
            main {
              margin-right: 0 !important;
            }
          }

          @media (max-width: 768px) {
            aside:first-child {
              display: none;
            }
            main {
              margin-left: 0 !important;
              padding: 24px !important;
            }
          }
        `}
      </style>
    </div>
    </>
  );
};

export default ApiDocs;
