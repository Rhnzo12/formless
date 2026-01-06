import { useState } from 'react';

const ApiDocs = () => {
  const [activeSection, setActiveSection] = useState('welcome');
  const [copiedCode, setCopiedCode] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      color: 'white',
      fontFamily: '"Inter", sans-serif',
    }}>
      {/* Fixed Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        backgroundColor: '#0a0a0a',
        borderBottom: '1px solid #1a1a1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 1000,
      }}>
        {/* Logo */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img
            src="/logomain.png"
            alt="Formless Logo"
            style={{ height: '28px', width: 'auto' }}
          />
        </a>

        {/* Search Bar - Center */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 16px',
          backgroundColor: '#1a1a1a',
          borderRadius: '8px',
          border: '1px solid #2a2a2a',
          minWidth: '300px',
          cursor: 'pointer',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <span style={{ color: '#666', fontSize: '14px', flex: 1 }}>Search...</span>
          <span style={{
            color: '#666',
            fontSize: '12px',
            backgroundColor: '#252525',
            padding: '2px 6px',
            borderRadius: '4px',
          }}>Ctrl K</span>
        </div>

        {/* Theme Toggle */}
        <button
          style={{
            background: 'none',
            border: 'none',
            color: '#666',
            cursor: 'pointer',
            padding: '8px',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
        </button>
      </header>

      {/* Left Sidebar */}
      <aside style={{
        width: '280px',
        backgroundColor: '#0f0f0f',
        borderRight: '1px solid #1a1a1a',
        padding: '24px 0',
        paddingTop: '88px',
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
            color: 'white',
            margin: 0,
          }}>Documentation</h2>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          backgroundColor: '#1a1a1a',
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
              color: '#888',
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
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            padding: '0 20px',
            marginBottom: '8px',
            fontSize: '12px',
            fontWeight: '600',
            color: '#888',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Getting Started
          </div>
          <a
            href="#welcome"
            onClick={(e) => { e.preventDefault(); scrollToSection('welcome'); }}
            style={{
              display: 'block',
              padding: '8px 20px',
              color: activeSection === 'welcome' ? 'white' : '#888',
              textDecoration: 'none',
              fontSize: '14px',
              backgroundColor: activeSection === 'welcome' ? '#1a1a1a' : 'transparent',
              borderLeft: activeSection === 'welcome' ? '2px solid white' : '2px solid transparent',
              transition: 'all 0.2s ease',
            }}
          >
            Welcome to the SHARE Protocol API
          </a>
        </div>

        {/* Account Management Section */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            padding: '0 20px',
            marginBottom: '8px',
            fontSize: '12px',
            fontWeight: '600',
            color: '#888',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Account Management
          </div>
          <a
            href="#identity-lookup"
            onClick={(e) => { e.preventDefault(); scrollToSection('identity-lookup'); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 20px',
              color: '#888',
              textDecoration: 'none',
              fontSize: '14px',
            }}
          >
            <span style={{
              backgroundColor: '#22c55e',
              color: 'white',
              fontSize: '10px',
              fontWeight: '600',
              padding: '2px 6px',
              borderRadius: '4px',
            }}>POST</span>
            Identity Lookup
          </a>
        </div>

        {/* Revenue Sharing Section */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            padding: '0 20px',
            marginBottom: '8px',
            fontSize: '12px',
            fontWeight: '600',
            color: '#888',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Revenue Sharing
          </div>
          <a
            href="#create-contract"
            onClick={(e) => { e.preventDefault(); scrollToSection('create-contract'); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 20px',
              color: '#888',
              textDecoration: 'none',
              fontSize: '14px',
            }}
          >
            <span style={{
              backgroundColor: '#22c55e',
              color: 'white',
              fontSize: '10px',
              fontWeight: '600',
              padding: '2px 6px',
              borderRadius: '4px',
            }}>POST</span>
            Create Contract
          </a>
          <a
            href="#fetch-split-data"
            onClick={(e) => { e.preventDefault(); scrollToSection('fetch-split-data'); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 20px',
              color: '#888',
              textDecoration: 'none',
              fontSize: '14px',
            }}
          >
            <span style={{
              backgroundColor: '#22c55e',
              color: 'white',
              fontSize: '10px',
              fontWeight: '600',
              padding: '2px 6px',
              borderRadius: '4px',
            }}>POST</span>
            Fetch Split Data
          </a>
        </div>

        {/* Payouts Section */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            padding: '0 20px',
            marginBottom: '8px',
            fontSize: '12px',
            fontWeight: '600',
            color: '#888',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Payouts
          </div>
          <a
            href="#execute-payout"
            onClick={(e) => { e.preventDefault(); scrollToSection('execute-payout'); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 20px',
              color: '#888',
              textDecoration: 'none',
              fontSize: '14px',
            }}
          >
            <span style={{
              backgroundColor: '#22c55e',
              color: 'white',
              fontSize: '10px',
              fontWeight: '600',
              padding: '2px 6px',
              borderRadius: '4px',
            }}>POST</span>
            Execute Payout
          </a>
          <a
            href="#query-batch-status"
            onClick={(e) => { e.preventDefault(); scrollToSection('query-batch-status'); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 20px',
              color: '#888',
              textDecoration: 'none',
              fontSize: '14px',
            }}
          >
            <span style={{
              backgroundColor: '#22c55e',
              color: 'white',
              fontSize: '10px',
              fontWeight: '600',
              padding: '2px 6px',
              borderRadius: '4px',
            }}>POST</span>
            Query Batch Status
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        marginLeft: '280px',
        marginRight: '260px',
        padding: '40px 60px',
        paddingTop: '104px',
        maxWidth: '900px',
      }}>
        {/* Breadcrumb */}
        <div style={{
          fontSize: '14px',
          color: '#666',
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
                backgroundColor: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: '6px',
                color: '#888',
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
            color: '#888',
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
            color: '#ccc',
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
              backgroundColor: '#141414',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #1a1a1a',
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
                color: '#888',
                margin: 0,
                lineHeight: '1.5',
              }}>
                Manage user identities and accounts
              </p>
            </div>

            {/* Revenue Sharing Card */}
            <div style={{
              backgroundColor: '#141414',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #1a1a1a',
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
                color: '#888',
                margin: 0,
                lineHeight: '1.5',
              }}>
                Create contracts to split payments
              </p>
            </div>

            {/* Payouts Card */}
            <div style={{
              backgroundColor: '#141414',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #1a1a1a',
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
                color: '#888',
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
            color: '#ccc',
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
              color: '#888',
              marginBottom: '16px',
            }}>
              All requests go to:
            </p>
            <div style={{
              backgroundColor: '#141414',
              borderRadius: '8px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: '1px solid #1a1a1a',
            }}>
              <code style={{
                fontSize: '14px',
                color: '#ccc',
                fontFamily: 'Monaco, Consolas, monospace',
              }}>
                <span style={{ color: '#22c55e' }}>POST</span> https://share-ddn.formless.xyz/v1
              </code>
              <button
                onClick={() => copyToClipboard('POST https://share-ddn.formless.xyz/v1', 'endpoint')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#666',
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
              color: '#888',
              marginBottom: '16px',
            }}>
              Include your JWT token in every request:
            </p>
            <div style={{
              backgroundColor: '#141414',
              borderRadius: '8px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: '1px solid #1a1a1a',
            }}>
              <code style={{
                fontSize: '14px',
                color: '#ccc',
                fontFamily: 'Monaco, Consolas, monospace',
              }}>
                <span style={{ color: '#888' }}>Authorization:</span> <span style={{ color: '#f472b6' }}>Bearer</span> <span style={{ color: '#60a5fa' }}>&lt;your-jwt-token&gt;</span>
              </code>
              <button
                onClick={() => copyToClipboard('Authorization: Bearer <your-jwt-token>', 'auth')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#666',
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
              color: '#888',
              marginBottom: '16px',
            }}>
              SHARE Protocol uses JSON-RPC 2.0:
            </p>
            <div style={{
              backgroundColor: '#141414',
              borderRadius: '8px',
              padding: '20px',
              position: 'relative',
              border: '1px solid #1a1a1a',
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
                  color: '#666',
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
                color: '#ccc',
              }}>
{`{
  `}<span style={{ color: '#60a5fa' }}>"jsonrpc"</span>{`: `}<span style={{ color: '#22c55e' }}>"2.0"</span>{`,
  `}<span style={{ color: '#60a5fa' }}>"id"</span>{`: `}<span style={{ color: '#22c55e' }}>"1"</span>{`,
  `}<span style={{ color: '#60a5fa' }}>"method"</span>{`: `}<span style={{ color: '#22c55e' }}>"method_name"</span>{`,
  `}<span style={{ color: '#60a5fa' }}>"params"</span>{`: {
    `}<span style={{ color: '#666' }}>// your parameters here</span>{`
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
            color: '#ccc',
            lineHeight: '1.7',
          }}>
            Visit{' '}
            <a href="https://formless.xyz" target="_blank" rel="noopener noreferrer" style={{ color: 'white', fontWeight: '600', textDecoration: 'none' }}>
              formless.xyz
            </a>
            {' '}to learn more about Formless.
          </p>
        </section>

        {/* Next Page Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          paddingTop: '24px',
          borderTop: '1px solid #1a1a1a',
          marginBottom: '60px',
        }}>
          <a
            href="#identity-lookup"
            onClick={(e) => { e.preventDefault(); scrollToSection('identity-lookup'); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'white',
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

        {/* Footer */}
        <footer style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '24px',
          borderTop: '1px solid #1a1a1a',
        }}>
          <a
            href="https://github.com/formless"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#666', transition: 'color 0.2s ease' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          <span style={{ color: '#666', fontSize: '14px' }}>
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
      </main>

      {/* Right Sidebar - On This Page */}
      <aside style={{
        width: '240px',
        position: 'fixed',
        top: '64px',
        right: 0,
        height: 'calc(100vh - 64px)',
        padding: '40px 20px',
        borderLeft: '1px solid #1a1a1a',
        backgroundColor: '#0a0a0a',
        overflowY: 'auto',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#888' }}>
            On this page
          </span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <a
            href="#what-is"
            onClick={(e) => { e.preventDefault(); scrollToSection('what-is'); }}
            style={{
              fontSize: '13px',
              color: '#666',
              textDecoration: 'none',
              padding: '4px 0',
              transition: 'color 0.2s ease',
            }}
          >
            What is the SHARE Protocol API?
          </a>
          <a
            href="#core-features"
            onClick={(e) => { e.preventDefault(); scrollToSection('core-features'); }}
            style={{
              fontSize: '13px',
              color: '#666',
              textDecoration: 'none',
              padding: '4px 0',
              transition: 'color 0.2s ease',
            }}
          >
            Core Features
          </a>
          <a
            href="#quick-start"
            onClick={(e) => { e.preventDefault(); scrollToSection('quick-start'); }}
            style={{
              fontSize: '13px',
              color: '#666',
              textDecoration: 'none',
              padding: '4px 0',
              transition: 'color 0.2s ease',
            }}
          >
            Quick Start
          </a>
          <a
            href="#api-endpoint"
            onClick={(e) => { e.preventDefault(); scrollToSection('api-endpoint'); }}
            style={{
              fontSize: '13px',
              color: '#666',
              textDecoration: 'none',
              padding: '4px 0 4px 16px',
              transition: 'color 0.2s ease',
            }}
          >
            1. API Endpoint
          </a>
          <a
            href="#authentication"
            onClick={(e) => { e.preventDefault(); scrollToSection('authentication'); }}
            style={{
              fontSize: '13px',
              color: '#666',
              textDecoration: 'none',
              padding: '4px 0 4px 16px',
              transition: 'color 0.2s ease',
            }}
          >
            2. Authentication
          </a>
          <a
            href="#request-format"
            onClick={(e) => { e.preventDefault(); scrollToSection('request-format'); }}
            style={{
              fontSize: '13px',
              color: '#666',
              textDecoration: 'none',
              padding: '4px 0 4px 16px',
              transition: 'color 0.2s ease',
            }}
          >
            3. Request Format
          </a>
          <a
            href="#need-help"
            onClick={(e) => { e.preventDefault(); scrollToSection('need-help'); }}
            style={{
              fontSize: '13px',
              color: '#666',
              textDecoration: 'none',
              padding: '4px 0',
              transition: 'color 0.2s ease',
            }}
          >
            Need Help?
          </a>
        </nav>
      </aside>

      {/* Responsive Styles */}
      <style>
        {`
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
  );
};

export default ApiDocs;
