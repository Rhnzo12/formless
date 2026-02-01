import { useState, useEffect } from 'react';

const ScheduleMeeting = () => {
  const [formData, setFormData] = useState({
    reason: '',
    additionalInfo: '',
    name: '',
    email: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Contact Us | FORMLESS';
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

  // Thank You Screen
  if (isSubmitted) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#191919',
        color: 'white',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        {/* Header */}
        <header style={{
          padding: '16px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <a href="/" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500',
          }}>
            Contact Us
          </a>
        </header>

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
      {/* Header */}
      <header style={{
        padding: '16px 24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        <a href="/" style={{
          color: 'white',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: '500',
        }}>
          Contact Us
        </a>
      </header>

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
