import { useState, useEffect, useRef } from 'react';

const ScheduleMeeting = () => {
  const [formData, setFormData] = useState({
    reason: '',
    additionalInfo: '',
    name: '',
    email: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef(null);
  const shareModalRef = useRef(null);

  useEffect(() => {
    document.title = 'Contact Us | FORMLESS';
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
      if (shareModalRef.current && !shareModalRef.current.contains(event.target)) {
        setShowShareModal(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const isFormValid = () => {
    return (
      formData.reason &&
      formData.additionalInfo.trim() &&
      formData.name.trim() &&
      formData.email.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    );
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  // Header component with share and menu
  const Header = () => (
    <header style={{
      padding: '16px 24px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <a href="/" style={{
        color: 'white',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '500',
      }}>
        Contact Us
      </a>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Share Button */}
        <div style={{ position: 'relative' }} ref={shareModalRef}>
          <button
            onClick={() => { setShowShareModal(!showShareModal); setShowMenu(false); }}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </button>

          {/* Share Modal */}
          {showShareModal && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              backgroundColor: '#2f2f2f',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
              padding: '16px',
              minWidth: '320px',
              zIndex: 1000,
            }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '16px',
                textAlign: 'center',
                color: 'white',
              }}>
                Share site
              </h3>

              <div style={{
                backgroundColor: '#191919',
                borderRadius: '6px',
                padding: '80px 20px',
                marginBottom: '16px',
                textAlign: 'center',
              }}>
                <p style={{
                  fontSize: '16px',
                  fontWeight: '500',
                  color: 'white',
                }}>
                  Contact Us
                </p>
              </div>

              <div style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
              }}>
                <input
                  type="text"
                  readOnly
                  value={window.location.href}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    fontSize: '13px',
                    backgroundColor: '#191919',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    outline: 'none',
                  }}
                />
                <button
                  onClick={handleCopyUrl}
                  style={{
                    padding: '10px 16px',
                    fontSize: '13px',
                    fontWeight: '500',
                    backgroundColor: '#0077FF',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  {copied ? 'Copied!' : 'Copy URL'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Menu Button */}
        <div style={{ position: 'relative' }} ref={menuRef}>
          <button
            onClick={() => { setShowMenu(!showMenu); setShowShareModal(false); }}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              backgroundColor: '#2f2f2f',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
              padding: '8px 0',
              minWidth: '180px',
              zIndex: 1000,
            }}>
              <button
                onClick={() => setShowMenu(false)}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  fontSize: '14px',
                  color: 'white',
                  backgroundColor: 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" y1="22" x2="4" y2="15" />
                </svg>
                Report form
              </button>
              <button
                onClick={() => setShowMenu(false)}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  fontSize: '14px',
                  color: 'white',
                  backgroundColor: 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                Cookie settings
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );

  // Thank You Screen
  if (isSubmitted) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#191919',
        color: 'white',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        <Header />

        {/* Thank You Content */}
        <div style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: '80px 24px',
          textAlign: 'center',
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '16px',
          }}>
            Thank you!
          </h1>
          <p style={{
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.7)',
          }}>
            Your submission has been received. We'll be in touch soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#191919',
      color: 'white',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <Header />

      {/* Form Content */}
      <div style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: '60px 24px 80px',
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          marginBottom: '48px',
        }}>
          Contact Us
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Reason for contacting */}
          <div style={{ marginBottom: '40px' }}>
            <label style={{
              display: 'block',
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '16px',
            }}>
              What best describes your reason for contacting us?
              <span style={{ color: '#ff6b6b', marginLeft: '2px' }}>*</span>
            </label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { value: 'collaborating', label: "I'm interested in collaborating" },
                { value: 'investing', label: "I'm interested in investing" },
                { value: 'sdk-api', label: "I'm interested in using the SHARE Protocol SDK or API" },
                { value: 'general', label: "I have a general question" },
              ].map((option) => (
                <label
                  key={option.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    padding: '8px 0',
                  }}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: formData.reason === option.value
                      ? '6px solid white'
                      : '2px solid rgba(255, 255, 255, 0.4)',
                    backgroundColor: 'transparent',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                  }} />
                  <input
                    type="radio"
                    name="reason"
                    value={option.value}
                    checked={formData.reason === option.value}
                    onChange={handleInputChange}
                    style={{ display: 'none' }}
                  />
                  <span style={{
                    fontSize: '15px',
                    color: 'rgba(255, 255, 255, 0.9)',
                  }}>
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Information */}
          <div style={{ marginBottom: '40px' }}>
            <label style={{
              display: 'block',
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '12px',
            }}>
              Please provide additional information below
              <span style={{ color: '#ff6b6b', marginLeft: '2px' }}>*</span>
            </label>
            <textarea
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleInputChange}
              placeholder="Your answer"
              rows={4}
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '15px',
                fontFamily: 'inherit',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                color: 'white',
                resize: 'vertical',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            />
          </div>

          {/* Name */}
          <div style={{ marginBottom: '40px' }}>
            <label style={{
              display: 'block',
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '12px',
            }}>
              Name
              <span style={{ color: '#ff6b6b', marginLeft: '2px' }}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your answer"
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '15px',
                fontFamily: 'inherit',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                color: 'white',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: '40px' }}>
            <label style={{
              display: 'block',
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '12px',
            }}>
              Email
              <span style={{ color: '#ff6b6b', marginLeft: '2px' }}>*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Your answer"
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '15px',
                fontFamily: 'inherit',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                color: 'white',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid() || isSubmitting}
            style={{
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '500',
              fontFamily: 'inherit',
              backgroundColor: isFormValid() ? 'white' : 'rgba(255, 255, 255, 0.3)',
              color: isFormValid() ? '#191919' : 'rgba(25, 25, 25, 0.5)',
              border: 'none',
              borderRadius: '4px',
              cursor: isFormValid() ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (isFormValid()) {
                e.currentTarget.style.opacity = '0.9';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>

      {/* Responsive Styles */}
      <style>
        {`
          input::placeholder,
          textarea::placeholder {
            color: rgba(255, 255, 255, 0.4);
          }

          @media (max-width: 768px) {
            h1 {
              font-size: 24px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ScheduleMeeting;
