import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import FluidBackground from './components/FluidBackground';

const Contact = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const formRef = useRef(null);
  const infoRef = useRef(null);

  useEffect(() => {
    document.title = 'Contact Us';
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === formRef.current) {
              setFormVisible(true);
            }
            if (entry.target === infoRef.current) {
              setInfoVisible(true);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (formRef.current) observer.observe(formRef.current);
    if (infoRef.current) observer.observe(infoRef.current);

    return () => observer.disconnect();
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

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In a real implementation, you would send the data to your backend
    // For now, we'll just show a success message
    setSubmitStatus('success');
    setIsSubmitting(false);

    // Reset form after successful submission
    setFormData({
      name: '',
      email: '',
      company: '',
      subject: '',
      message: '',
    });

    // Clear success message after 5 seconds
    setTimeout(() => setSubmitStatus(null), 5000);
  };

  const inputStyle = {
    width: '100%',
    padding: '16px 20px',
    fontSize: '16px',
    fontFamily: '"Inter", sans-serif',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '8px',
    color: 'white',
    outline: 'none',
    transition: 'border-color 0.3s ease, background-color 0.3s ease',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '8px',
    color: 'rgba(255,255,255,0.8)',
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      color: 'white',
      fontFamily: '"Inter", sans-serif',
    }}>
      {/* Fluid Background Animation */}
      <FluidBackground />

      {/* Header/Navigation */}
      <Header activePage="contact" />

      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          zIndex: 2,
          paddingTop: '160px',
          paddingBottom: '80px',
          paddingLeft: 'clamp(16px, 3vw, 40px)',
          paddingRight: 'clamp(16px, 3vw, 40px)',
        }}
      >
        <div style={{
          maxWidth: '1500px',
          margin: '0 auto',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '24px',
            marginBottom: '24px',
          }}>
            {/* Hexagon Shape */}
            <svg
              width="30"
              height="30"
              viewBox="0 0 16 18"
              fill="white"
              style={{
                flexShrink: 0,
                marginTop: '16px',
              }}
            >
              <polygon points="8,0 16,4.5 16,13.5 8,18 0,13.5 0,4.5"/>
            </svg>

            <h1 style={{
              fontSize: 'clamp(42px, 7vw, 80px)',
              fontWeight: '400',
              lineHeight: '1.05',
              margin: 0,
              fontFamily: '"Inter", sans-serif',
              letterSpacing: '-2px',
            }}>
              Let's build<br />together
            </h1>
          </div>

          <p style={{
            fontSize: 'clamp(16px, 2vw, 22px)',
            lineHeight: '1.6',
            fontWeight: '400',
            maxWidth: '600px',
            marginLeft: '54px',
            opacity: 0.8,
          }}>
            Ready to transform your business with blockchain technology?
            We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Form and Info Section */}
      <section
        style={{
          position: 'relative',
          zIndex: 3,
          padding: '80px clamp(16px, 3vw, 40px)',
          backgroundColor: 'transparent',
        }}
      >
        <div style={{
          maxWidth: '1500px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: 'clamp(60px, 8vw, 120px)',
        }}>
          {/* Contact Form */}
          <div
            ref={formRef}
            style={{
              opacity: formVisible ? 1 : 0,
              transform: formVisible ? 'translateY(0)' : 'translateY(40px)',
              transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
            }}
          >
            <h2 style={{
              fontSize: 'clamp(24px, 3vw, 32px)',
              fontWeight: '400',
              marginBottom: '40px',
              letterSpacing: '-0.5px',
            }}>
              Send us a message
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.4)';
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.08)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
                  }}
                  placeholder="Your name"
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.4)';
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.08)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
                  }}
                  placeholder="your@email.com"
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.4)';
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.08)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
                  }}
                  placeholder="Your company name"
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Subject *</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  style={{
                    ...inputStyle,
                    cursor: 'pointer',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 16px center',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.4)';
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.08)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
                  }}
                >
                  <option value="" style={{ backgroundColor: '#1a1a1a' }}>Select a topic</option>
                  <option value="api" style={{ backgroundColor: '#1a1a1a' }}>SHARE Protocol & API</option>
                  <option value="consulting" style={{ backgroundColor: '#1a1a1a' }}>Consulting Services</option>
                  <option value="partnership" style={{ backgroundColor: '#1a1a1a' }}>Partnership Opportunities</option>
                  <option value="investment" style={{ backgroundColor: '#1a1a1a' }}>Investment Inquiries</option>
                  <option value="press" style={{ backgroundColor: '#1a1a1a' }}>Press & Media</option>
                  <option value="other" style={{ backgroundColor: '#1a1a1a' }}>Other</option>
                </select>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label style={labelStyle}>Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="6"
                  style={{
                    ...inputStyle,
                    resize: 'vertical',
                    minHeight: '150px',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.4)';
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.08)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
                  }}
                  placeholder="Tell us about your project or inquiry..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px 40px',
                  fontSize: '16px',
                  fontWeight: '500',
                  fontFamily: '"Inter", sans-serif',
                  backgroundColor: 'white',
                  color: 'black',
                  border: '1px solid white',
                  borderRadius: '50px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: isSubmitting ? 0.7 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'white';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.color = 'black';
                  }
                }}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
                {!isSubmitting && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z"/>
                  </svg>
                )}
              </button>

              {submitStatus === 'success' && (
                <p style={{
                  marginTop: '20px',
                  color: '#4ade80',
                  fontSize: '14px',
                }}>
                  Thank you for your message! We'll get back to you soon.
                </p>
              )}
            </form>
          </div>

          {/* Contact Info */}
          <div
            ref={infoRef}
            style={{
              opacity: infoVisible ? 1 : 0,
              transform: infoVisible ? 'translateY(0)' : 'translateY(40px)',
              transition: 'opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s',
            }}
          >
            <h2 style={{
              fontSize: 'clamp(24px, 3vw, 32px)',
              fontWeight: '400',
              marginBottom: '40px',
              letterSpacing: '-0.5px',
            }}>
              Other ways to connect
            </h2>

            {/* Email */}
            <div style={{ marginBottom: '48px' }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                opacity: 0.6,
                marginBottom: '12px',
              }}>
                Email
              </h3>
              <a
                href="mailto:info@formless.xyz"
                style={{
                  fontSize: 'clamp(18px, 2vw, 24px)',
                  color: 'white',
                  textDecoration: 'none',
                  borderBottom: '1px solid transparent',
                  transition: 'border-color 0.3s ease',
                  paddingBottom: '4px',
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'white'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
              >
                info@formless.xyz
              </a>
            </div>

            {/* For Developers */}
            <div style={{ marginBottom: '48px' }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                opacity: 0.6,
                marginBottom: '12px',
              }}>
                For Developers
              </h3>
              <p style={{
                fontSize: 'clamp(16px, 1.5vw, 18px)',
                lineHeight: '1.6',
                opacity: 0.85,
                marginBottom: '16px',
              }}>
                Explore our API documentation to get started with the SHARE Protocol.
              </p>
              <a
                href="/api-docs"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '16px',
                  borderBottom: '1px solid transparent',
                  transition: 'border-color 0.3s ease',
                  paddingBottom: '4px',
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'white'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
              >
                View API Documentation
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M7 17L17 7M17 7H10M17 7V14"/>
                </svg>
              </a>
            </div>

            {/* Social Media */}
            <div style={{ marginBottom: '48px' }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                opacity: 0.6,
                marginBottom: '20px',
              }}>
                Follow Us
              </h3>
              <div style={{
                display: 'flex',
                gap: '24px',
              }}>
                {/* X (Twitter) */}
                <a
                  href="https://x.com/formless_xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: 'white',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/company/formlessxyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: 'white',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>

                {/* Discord */}
                <a
                  href="#"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: 'white',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Office Info (Optional - can be customized) */}
            <div style={{
              padding: '32px',
              backgroundColor: 'rgba(255,255,255,0.03)',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '500',
                marginBottom: '16px',
              }}>
                Business Inquiries
              </h3>
              <p style={{
                fontSize: '15px',
                lineHeight: '1.7',
                opacity: 0.75,
                margin: 0,
              }}>
                For partnership opportunities, investment inquiries, or press requests,
                please reach out to our team directly. We typically respond within 24-48 hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Spacer */}
      <div style={{ height: '100px' }} />

      {/* Footer */}
      <footer
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '20px 20px 5px 20px',
          background: 'transparent',
        }}
      >
        {/* Social Media Icons */}
        <div style={{
          display: 'flex',
          gap: '80px',
          marginBottom: '30px',
        }}>
          {/* X (Twitter) */}
          <a href="https://x.com/formless_xyz" target="_blank" rel="noopener noreferrer" style={{ color: 'white', transition: 'opacity 0.3s ease' }}
             onMouseEnter={(e) => e.currentTarget.style.opacity = '0.6'}
             onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>

          {/* LinkedIn */}
          <a href="https://www.linkedin.com/company/formlessxyz" target="_blank" rel="noopener noreferrer" style={{ color: 'white', transition: 'opacity 0.3s ease' }}
             onMouseEnter={(e) => e.currentTarget.style.opacity = '0.6'}
             onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>

          {/* Instagram */}
          <a href="#" style={{ color: 'white', transition: 'opacity 0.3s ease' }}
             onMouseEnter={(e) => e.currentTarget.style.opacity = '0.6'}
             onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>

          {/* Discord */}
          <a href="#" style={{ color: 'white', transition: 'opacity 0.3s ease' }}
             onMouseEnter={(e) => e.currentTarget.style.opacity = '0.6'}
             onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/>
            </svg>
          </a>
        </div>

        {/* Large FORMLESS Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          marginBottom: '40px',
        }}>
          {/* Hexagon Logo SVG - matching formless.xyz style */}
          <svg
            viewBox="0 0 100 115"
            fill="none"
            style={{
              height: 'clamp(80px, 12vw, 140px)',
              width: 'auto',
              flexShrink: 0,
            }}
          >
            {/* Hexagon outline */}
            <path
              d="M50 1 L97 29 L97 86 L50 114 L3 86 L3 29 Z"
              stroke="white"
              strokeWidth="2.5"
              fill="none"
            />
            {/* Inner triangle pointing up */}
            <path
              d="M50 30 L78 75 L22 75 Z"
              fill="white"
            />
          </svg>

          {/* Big FORMLESS Text */}
          <h2 style={{
            fontSize: 'clamp(50px, 12vw, 160px)',
            fontWeight: '600',
            letterSpacing: '0px',
            margin: 0,
            color: 'white',
            fontFamily: '"Inter", sans-serif',
          }}>
            FORMLESS<sup style={{
              fontSize: '25%',
              verticalAlign: 'super',
              fontWeight: '400',
            }}>™</sup>
          </h2>
        </div>

        {/* Footer Links */}
        <div style={{
          display: 'flex',
          gap: '130px',
          fontSize: '12px',
          fontFamily: '"Inter", sans-serif',
          marginBottom: '30px',
          color: 'white',
        }}>
          <span>© FORMLESS</span>
          <a href="#" style={{
            color: 'rgba(255,255,255,0.7)',
            textDecoration: 'none',
            transition: 'color 0.3s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
            Privacy Policy
          </a>
          <a href="#" style={{
            color: 'rgba(255,255,255,0.7)',
            textDecoration: 'none',
            transition: 'color 0.3s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
            Terms of Service
          </a>
        </div>
      </footer>

      {/* Responsive Styles */}
      <style>
        {`
          @media (max-width: 768px) {
            input::placeholder, textarea::placeholder {
              color: rgba(255,255,255,0.4);
            }
          }
          input::placeholder, textarea::placeholder {
            color: rgba(255,255,255,0.4);
          }
        `}
      </style>
    </div>
  );
};

export default Contact;
