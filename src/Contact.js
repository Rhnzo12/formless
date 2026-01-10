import { useState, useEffect, useRef } from 'react';

const Contact = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [formData, setFormData] = useState({
    collaboration: '',
    name: '',
    email: '',
    company: '',
    hearAboutUs: '',
    subscribe: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const inputRefs = useRef([]);

  const questions = [
    {
      id: 'collaboration',
      label: 'Please describe the type of collaboration you\'re interested in (e.g. partnership, technical integration, or a release using SHARE).',
      placeholder: 'Type your answer here...',
      type: 'text',
      required: true,
    },
    {
      id: 'name',
      label: 'Name',
      placeholder: 'Type your answer here...',
      type: 'text',
      required: true,
    },
    {
      id: 'email',
      label: 'Email',
      placeholder: 'name@example.com',
      type: 'email',
      required: true,
    },
    {
      id: 'company',
      label: 'Name of your Company or Organization',
      placeholder: 'Type your answer here...',
      type: 'text',
      required: false,
    },
    {
      id: 'hearAboutUs',
      label: 'How did you hear about us?',
      type: 'choice',
      required: true,
      options: [
        { key: 'A', value: 'twitter', label: 'X (Formerly Twitter)' },
        { key: 'B', value: 'instagram', label: 'Instagram' },
        { key: 'C', value: 'linkedin', label: 'LinkedIn' },
        { key: 'D', value: 'google', label: 'Google/Search Engine' },
        { key: 'E', value: 'referral', label: 'Referral' },
        { key: 'F', value: 'other', label: 'Other' },
      ],
    },
    {
      id: 'subscribe',
      label: 'Stay connected with us! Subscribe to our email list to receive updates on our latest products, promotions, and news.',
      subtext: '(You can change your preferences at any time. Read our Privacy Policy here.)',
      type: 'choice',
      required: true,
      options: [
        { key: 'A', value: 'yes', label: 'Yes, I would like to subscribe.' },
        { key: 'B', value: 'no', label: 'No thanks, I prefer not to subscribe.' },
      ],
    },
  ];

  useEffect(() => {
    document.title = 'Contact Us';
  }, []);

  // Loading animation
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setIsLoading(false), 300);
            return 100;
          }
          return prev + 2;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  // Focus input when step changes
  useEffect(() => {
    if (!isLoading && !isTransitioning && inputRefs.current[currentStep]) {
      setTimeout(() => {
        inputRefs.current[currentStep]?.focus();
      }, 400);
    }
  }, [currentStep, isLoading, isTransitioning]);

  // Handle keyboard shortcuts for choices
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (isLoading || isTransitioning || isSubmitted) return;

      const currentQuestion = questions[currentStep];
      if (currentQuestion.type === 'choice') {
        const key = e.key.toUpperCase();
        const option = currentQuestion.options.find(opt => opt.key === key);
        if (option) {
          handleChoiceSelect(option.value);
        }
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [currentStep, isLoading, isTransitioning, isSubmitted]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChoiceSelect = (value) => {
    const currentQuestion = questions[currentStep];
    setFormData(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));

    // Auto-advance after selection
    setTimeout(() => {
      handleNext(true);
    }, 300);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleNext();
    }
  };

  const canProceed = () => {
    const currentQuestion = questions[currentStep];
    const value = formData[currentQuestion.id];

    if (currentQuestion.required) {
      if (currentQuestion.type === 'email') {
        return value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      }
      return value && value.trim().length > 0;
    }
    return true;
  };

  const handleNext = (skipCheck = false) => {
    if (!skipCheck && !canProceed()) return;

    if (currentStep < questions.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsTransitioning(false);
      }, 300);
    } else {
      // Submit form
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleSubmit = async () => {
    setIsTransitioning(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSubmitted(true);
    setIsTransitioning(false);
  };

  // Loading Screen
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#000',
        color: 'white',
        fontFamily: '"Inter", sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Logo and Brand */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '40px',
        }}>
          <img
            src="/logomain.png"
            alt="Formless Logo"
            style={{
              height: '32px',
              width: 'auto',
            }}
          />
          <span style={{
            fontSize: '20px',
            fontWeight: '500',
            letterSpacing: '2px',
          }}>
            FORMLESS<sup style={{ fontSize: '10px', marginLeft: '2px' }}>™</sup>
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{
          width: '200px',
          height: '2px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '1px',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${loadingProgress}%`,
            height: '100%',
            backgroundColor: 'white',
            transition: 'width 0.1s ease-out',
          }} />
        </div>
      </div>
    );
  }

  // Thank You Screen
  if (isSubmitted) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#000',
        color: 'white',
        fontFamily: '"Inter", sans-serif',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <header style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          padding: '24px 32px',
          zIndex: 100,
        }}>
          <a href="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            color: 'white',
          }}>
            <img
              src="/logomain.png"
              alt="Formless Logo"
              style={{
                height: '24px',
                width: 'auto',
              }}
            />
            <span style={{
              fontSize: '16px',
              fontWeight: '500',
              letterSpacing: '2px',
            }}>
              FORMLESS<sup style={{ fontSize: '8px', marginLeft: '2px' }}>™</sup>
            </span>
          </a>
        </header>

        {/* Thank You Content */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '100px 40px',
          textAlign: 'center',
        }}>
          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: '400',
            marginBottom: '0',
            letterSpacing: '-0.5px',
            lineHeight: '1.4',
          }}>
            Thanks for connecting with us.<br />
            We'll be in touch soon.
          </h1>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentStep];

  // Render Choice Options
  const renderChoiceOptions = () => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      marginBottom: '32px',
    }}>
      {currentQuestion.options.map((option) => {
        const isSelected = formData[currentQuestion.id] === option.value;
        return (
          <button
            key={option.value}
            onClick={() => handleChoiceSelect(option.value)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '14px 20px',
              backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: isSelected ? '1px solid rgba(255, 255, 255, 0.5)' : '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'left',
              width: '100%',
              maxWidth: '400px',
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }
            }}
          >
            <span style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              backgroundColor: isSelected ? 'white' : 'transparent',
              border: isSelected ? 'none' : '1px solid rgba(255, 255, 255, 0.5)',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '600',
              color: isSelected ? 'black' : 'white',
              flexShrink: 0,
            }}>
              {option.key}
            </span>
            <span style={{
              color: 'white',
              fontSize: '16px',
              fontFamily: '"Inter", sans-serif',
            }}>
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );

  // Render Text Input
  const renderTextInput = () => (
    <div style={{ marginBottom: '32px' }}>
      <input
        ref={el => inputRefs.current[currentStep] = el}
        type={currentQuestion.type}
        name={currentQuestion.id}
        value={formData[currentQuestion.id]}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={currentQuestion.placeholder}
        style={{
          width: '100%',
          padding: '16px 0',
          fontSize: 'clamp(18px, 3vw, 24px)',
          fontFamily: '"Inter", sans-serif',
          backgroundColor: 'transparent',
          border: 'none',
          borderBottom: '2px solid rgba(255, 255, 255, 0.3)',
          color: 'white',
          outline: 'none',
          transition: 'border-color 0.3s ease',
        }}
        onFocus={(e) => {
          e.target.style.borderBottomColor = 'rgba(255, 255, 255, 0.8)';
        }}
        onBlur={(e) => {
          e.target.style.borderBottomColor = 'rgba(255, 255, 255, 0.3)';
        }}
      />
    </div>
  );

  // Main Form
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      color: 'white',
      fontFamily: '"Inter", sans-serif',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '24px 32px',
        zIndex: 100,
      }}>
        <a href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textDecoration: 'none',
          color: 'white',
        }}>
          <img
            src="/logomain.png"
            alt="Formless Logo"
            style={{
              height: '24px',
              width: 'auto',
            }}
          />
          <span style={{
            fontSize: '16px',
            fontWeight: '500',
            letterSpacing: '2px',
          }}>
            FORMLESS<sup style={{ fontSize: '8px', marginLeft: '2px' }}>™</sup>
          </span>
        </a>
      </header>

      {/* Form Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 40px',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '720px',
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? 'translateY(20px)' : 'translateY(0)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}>
          {/* Question Label */}
          <h2 style={{
            fontSize: 'clamp(24px, 4vw, 32px)',
            fontWeight: '400',
            lineHeight: '1.4',
            marginBottom: currentQuestion.subtext ? '12px' : '40px',
            letterSpacing: '-0.5px',
          }}>
            {currentQuestion.label}
            {currentQuestion.required && <span style={{ marginLeft: '4px' }}>*</span>}
          </h2>

          {/* Subtext if exists */}
          {currentQuestion.subtext && (
            <p style={{
              fontSize: '16px',
              opacity: 0.7,
              marginBottom: '32px',
              lineHeight: '1.5',
            }}>
              {currentQuestion.subtext.replace('here', '')}
              <a
                href="/privacy"
                style={{
                  color: 'white',
                  textDecoration: 'underline',
                }}
              >
                here
              </a>
              .)
            </p>
          )}

          {/* Input Field or Choices */}
          {currentQuestion.type === 'choice' ? renderChoiceOptions() : renderTextInput()}

          {/* OK Button - only for text inputs */}
          {currentQuestion.type !== 'choice' && (
            <>
              <button
                onClick={() => handleNext()}
                disabled={!canProceed()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  fontFamily: '"Inter", sans-serif',
                  backgroundColor: canProceed() ? 'white' : 'rgba(255, 255, 255, 0.3)',
                  color: canProceed() ? 'black' : 'rgba(0, 0, 0, 0.5)',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: canProceed() ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (canProceed()) {
                    e.currentTarget.style.opacity = '0.9';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                OK
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </button>

              {/* Press Enter hint */}
              <span style={{
                marginLeft: '16px',
                fontSize: '13px',
                opacity: 0.5,
              }}>
                press <strong>Enter ↵</strong>
              </span>
            </>
          )}

          {/* OK Button for choices - shows after selection */}
          {currentQuestion.type === 'choice' && formData[currentQuestion.id] && (
            <button
              onClick={() => handleNext()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: '500',
                fontFamily: '"Inter", sans-serif',
                backgroundColor: 'white',
                color: 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              {currentStep === questions.length - 1 ? 'Submit' : 'OK'}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Arrows */}
      <div style={{
        position: 'fixed',
        bottom: '32px',
        right: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        zIndex: 100,
      }}>
        {/* Up Arrow */}
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          style={{
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: currentStep === 0 ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '4px 4px 0 0',
            cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (currentStep > 0) {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = currentStep === 0 ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)';
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke={currentStep === 0 ? 'rgba(255, 255, 255, 0.3)' : 'white'}
            strokeWidth="2"
          >
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </button>

        {/* Down Arrow */}
        <button
          onClick={() => handleNext()}
          disabled={!canProceed()}
          style={{
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: !canProceed() ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '0 0 4px 4px',
            cursor: !canProceed() ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (canProceed()) {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = !canProceed() ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)';
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke={!canProceed() ? 'rgba(255, 255, 255, 0.3)' : 'white'}
            strokeWidth="2"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>

      {/* Progress Indicator */}
      <div style={{
        position: 'fixed',
        bottom: '32px',
        left: '32px',
        fontSize: '13px',
        opacity: 0.5,
        zIndex: 100,
      }}>
        {currentStep + 1} / {questions.length}
      </div>

      {/* Responsive Styles */}
      <style>
        {`
          input::placeholder {
            color: rgba(255, 255, 255, 0.4);
          }

          @media (max-width: 768px) {
            header {
              padding: 16px 20px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Contact;
