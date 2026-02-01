import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import FluidBackground from './components/FluidBackground';

const TermsOfService = () => {
  const [joinVisible, setJoinVisible] = useState(false);
  const joinRef = useRef(null);

  useEffect(() => {
    document.title = 'Terms of Service';
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === joinRef.current) {
              setJoinVisible(true);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (joinRef.current) {
      observer.observe(joinRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const contentStyle = {
    fontSize: 'clamp(14px, 1.3vw, 16px)',
    lineHeight: '1.7',
    fontWeight: '400',
    fontFamily: '"Inter", sans-serif',
  };

  const listItemStyle = {
    marginBottom: '24px',
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
      <Header activePage="" />

      {/* Hero Section */}
      <section
        className="terms-hero-section"
        style={{
          position: 'relative',
          zIndex: 2,
          minHeight: '50vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: '230px',
          paddingBottom: '40px',
          paddingLeft: 'clamp(16px, 3vw, 40px)',
          paddingRight: 'clamp(16px, 3vw, 40px)',
          backgroundColor: '#000',
        }}
      >
        <div style={{
          width: '100%',
          maxWidth: '900px',
          margin: '0 auto',
        }}>
          {/* Large Title */}
          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 72px)',
            fontWeight: '300',
            lineHeight: '1.1',
            margin: '0 0 40px 0',
            fontFamily: '"Inter", sans-serif',
            letterSpacing: '-1px',
          }}>
            Terms of Service
          </h1>

          {/* Effective Date Badge */}
          <div style={{
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '4px',
            fontSize: 'clamp(14px, 1.2vw, 16px)',
            fontWeight: '400',
          }}>
            Effective Date: Aug 3, 2022
          </div>
        </div>
      </section>

      {/* Terms of Service Content */}
      <section
        className="terms-content-section"
        style={{
          position: 'relative',
          zIndex: 3,
          padding: '40px clamp(16px, 3vw, 40px) 100px',
          backgroundColor: '#000',
        }}
      >
        <div style={{
          width: '100%',
          maxWidth: '900px',
          margin: '0 auto',
        }}>
          {/* Introduction */}
          <p style={{
            ...contentStyle,
            margin: '0 0 30px 0',
          }}>
            Welcome to Formless. These Terms of Service ("Terms") govern your access to and use of the Formless website, products, and services (collectively, the "Service"). Please read these Terms carefully before using our Service. By accessing or using our Service, you agree to be bound by these Terms and our Privacy Policy.
          </p>

          {/* Main Numbered List */}
          <ol style={{
            ...contentStyle,
            paddingLeft: '24px',
            margin: 0,
          }}>
            {/* 1. Acceptance of Terms */}
            <li style={listItemStyle}>
              <strong>Acceptance of Terms.</strong> By accessing or using the Service, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Service. We reserve the right to modify these Terms at any time, and such modifications will be effective immediately upon posting. Your continued use of the Service after any modifications indicates your acceptance of the modified Terms.
            </li>

            {/* 2. Eligibility */}
            <li style={listItemStyle}>
              <strong>Eligibility.</strong> You must be at least 18 years of age to use the Service. By using the Service, you represent and warrant that you are at least 18 years old and have the legal capacity to enter into these Terms. If you are using the Service on behalf of a company or other legal entity, you represent that you have the authority to bind such entity to these Terms.
            </li>

            {/* 3. User Accounts */}
            <li style={listItemStyle}>
              <strong>User Accounts.</strong> To access certain features of the Service, you may be required to connect a digital wallet or create an account. You are responsible for maintaining the confidentiality of your wallet credentials and account information, and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.
            </li>

            {/* 4. Use of Service */}
            <li style={listItemStyle}>
              <strong>Use of Service.</strong> You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:

              <ol style={{
                paddingLeft: '24px',
                margin: '16px 0 0 0',
              }}>
                <li style={{ marginBottom: '12px' }}>
                  Use the Service in any way that violates any applicable federal, state, local, or international law or regulation;
                </li>
                <li style={{ marginBottom: '12px' }}>
                  Engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Service;
                </li>
                <li style={{ marginBottom: '12px' }}>
                  Use the Service to transmit any advertising or promotional material without our prior written consent;
                </li>
                <li style={{ marginBottom: '12px' }}>
                  Impersonate or attempt to impersonate Formless, a Formless employee, another user, or any other person or entity;
                </li>
                <li style={{ marginBottom: '0' }}>
                  Attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of the Service.
                </li>
              </ol>
            </li>

            {/* 5. Intellectual Property */}
            <li style={listItemStyle}>
              <strong>Intellectual Property.</strong> The Service and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by Formless, its licensors, or other providers of such material and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
            </li>

            {/* 6. Digital Assets and NFTs */}
            <li style={listItemStyle}>
              <strong>Digital Assets and NFTs.</strong> The Service may involve the use of blockchain technology, digital assets, and non-fungible tokens ("NFTs"). You acknowledge and agree that:

              <ol style={{
                paddingLeft: '24px',
                margin: '16px 0 0 0',
              }}>
                <li style={{ marginBottom: '12px' }}>
                  Blockchain transactions are irreversible and Formless has no ability to reverse any transactions on the blockchain;
                </li>
                <li style={{ marginBottom: '12px' }}>
                  The value of digital assets and NFTs is highly volatile and may fluctuate significantly;
                </li>
                <li style={{ marginBottom: '12px' }}>
                  You are solely responsible for the security of your digital wallet and private keys;
                </li>
                <li style={{ marginBottom: '0' }}>
                  Formless is not responsible for any losses you may incur as a result of blockchain transactions or the loss of access to your digital wallet.
                </li>
              </ol>
            </li>

            {/* 7. SHARE Protocol */}
            <li style={listItemStyle}>
              <strong>SHARE Protocol.</strong> Our SHARE Protocol enables revenue sharing through smart contracts. By using the SHARE Protocol, you agree to the terms and conditions of the smart contracts involved. You acknowledge that smart contracts operate autonomously on the blockchain and Formless cannot modify or reverse transactions once they are executed.
            </li>

            {/* 8. Fees and Payments */}
            <li style={listItemStyle}>
              <strong>Fees and Payments.</strong> Certain features of the Service may be subject to fees. All fees are denominated and payable in the currency specified at the time of payment. You are responsible for paying all fees and applicable taxes associated with your use of the Service. Fees may be changed at any time with reasonable notice.
            </li>

            {/* 9. Disclaimer of Warranties */}
            <li style={listItemStyle}>
              <strong>Disclaimer of Warranties.</strong> THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. NEITHER FORMLESS NOR ANY PERSON ASSOCIATED WITH FORMLESS MAKES ANY WARRANTY OR REPRESENTATION WITH RESPECT TO THE COMPLETENESS, SECURITY, RELIABILITY, QUALITY, ACCURACY, OR AVAILABILITY OF THE SERVICE.
            </li>

            {/* 10. Limitation of Liability */}
            <li style={listItemStyle}>
              <strong>Limitation of Liability.</strong> IN NO EVENT WILL FORMLESS, ITS AFFILIATES, OR THEIR LICENSORS, SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS, OR DIRECTORS BE LIABLE FOR DAMAGES OF ANY KIND, UNDER ANY LEGAL THEORY, ARISING OUT OF OR IN CONNECTION WITH YOUR USE, OR INABILITY TO USE, THE SERVICE, INCLUDING ANY DIRECT, INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
            </li>

            {/* 11. Indemnification */}
            <li style={listItemStyle}>
              <strong>Indemnification.</strong> You agree to defend, indemnify, and hold harmless Formless, its affiliates, licensors, and service providers, and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of the Service.
            </li>

            {/* 12. Governing Law */}
            <li style={listItemStyle}>
              <strong>Governing Law.</strong> These Terms and any dispute or claim arising out of or related to them, their subject matter, or their formation shall be governed by and construed in accordance with the laws of the State of Delaware, without giving effect to any choice or conflict of law provision or rule.
            </li>

            {/* 13. Dispute Resolution */}
            <li style={listItemStyle}>
              <strong>Dispute Resolution.</strong> Any dispute arising out of or relating to these Terms or the Service shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. The arbitration shall take place in Delaware, and the arbitrator's decision shall be final and binding.
            </li>

            {/* 14. Termination */}
            <li style={listItemStyle}>
              <strong>Termination.</strong> We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms. Upon termination, your right to use the Service will immediately cease.
            </li>

            {/* 15. Contact Information */}
            <li style={{ marginBottom: '0' }}>
              <strong>Contact Information.</strong> If you have any questions about these Terms, please contact us by using the "Connect" link{' '}
              <a
                href="/contact"
                style={{
                  color: 'white',
                  textDecoration: 'underline',
                  transition: 'opacity 0.3s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                here
              </a>.
            </li>
          </ol>
        </div>
      </section>

      {/* Gradient Fade from Black (before Join section) */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          height: '300px',
          background: 'linear-gradient(to bottom, #000 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Join the Network Section */}
      <section
        ref={joinRef}
        className="join-section"
        style={{
          position: 'relative',
          zIndex: 2,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '100px 60px',
          overflow: 'hidden',
          background: 'transparent',
          marginTop: '-150px',
        }}
      >
        <div style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          opacity: joinVisible ? 1 : 0,
          transform: joinVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'opacity 0.8s ease-out 0.3s, transform 0.8s ease-out 0.3s',
        }}>
          <h2 style={{
            fontSize: 'clamp(48px, 8vw, 100px)',
            fontWeight: '300',
            lineHeight: '1.1',
            fontFamily: '"Inter", sans-serif',
            margin: '0 0 60px 0',
            letterSpacing: '-2px',
          }}>
            Join the network today.
          </h2>

          <a
            href="/schedule-meeting/27886cd3ac3481bdb0f0c5a0d46242b5"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              color: 'white',
              textDecoration: 'none',
              fontSize: '18px',
              fontWeight: '400',
              fontFamily: '"Inter", sans-serif',
              paddingBottom: '8px',
              borderBottom: '1px solid transparent',
              transition: 'border-color 0.4s ease-in',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            Schedule a Meeting
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M7 17L17 7M17 7H10M17 7V14"/>
            </svg>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="footer"
        style={{
          position: 'relative',
          zIndex: 2,
          padding: '60px 60px 40px 60px',
          background: 'transparent',
        }}
      >
        {/* Social Media Icons */}
        <div className="social-icons" style={{
          display: 'flex',
          gap: '80px',
          marginBottom: '60px',
        }}>
          {/* X (Twitter) */}
          <a href="#" style={{ color: 'white', transition: 'opacity 0.3s ease' }}
             onMouseEnter={(e) => e.currentTarget.style.opacity = '0.6'}
             onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>

          {/* LinkedIn */}
          <a href="#" style={{ color: 'white', transition: 'opacity 0.3s ease' }}
             onMouseEnter={(e) => e.currentTarget.style.opacity = '0.6'}
             onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>

          {/* Instagram */}
          <a href="#" style={{ color: 'white', transition: 'opacity 0.3s ease' }}
             onMouseEnter={(e) => e.currentTarget.style.opacity = '0.6'}
             onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>

          {/* Discord */}
          <a href="#" style={{ color: 'white', transition: 'opacity 0.3s ease' }}
             onMouseEnter={(e) => e.currentTarget.style.opacity = '0.6'}
             onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/>
            </svg>
          </a>
        </div>

        {/* Large FORMLESS Logo */}
        <div className="footer-logo" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '40px',
          marginBottom: '60px',
        }}>
          {/* Logo PNG */}
          <img
            src="/logomain.png"
            alt="Formless Logo"
            style={{
              height: 'clamp(120px, 18vw, 200px)',
              width: 'auto',
            }}
          />

          {/* Big FORMLESS Text */}
          <h2 style={{
            fontSize: 'clamp(80px, 15vw, 200px)',
            fontWeight: '500',
            letterSpacing: '-4px',
            margin: 0,
            color: 'white',
            fontFamily: '"Inter", sans-serif',
            lineHeight: 1,
            textTransform: 'uppercase',
          }}>
            FORMLESS<sup style={{
              fontSize: '14%',
              verticalAlign: 'super',
              fontWeight: '400',
              marginLeft: '8px',
              position: 'relative',
              top: '-0.2em',
            }}>TM</sup>
          </h2>
        </div>

        {/* Footer Links */}
        <div className="footer-links" style={{
          display: 'flex',
          justifyContent: 'flex-start',
          gap: '0',
          fontSize: '14px',
          fontFamily: '"Inter", sans-serif',
          paddingBottom: '20px',
          color: 'rgba(255,255,255,0.7)',
        }}>
          <span style={{ marginRight: '200px' }}>&copy; FORMLESS</span>
          <a href="/privacy-policy" style={{
            color: 'rgba(255,255,255,0.7)',
            textDecoration: 'none',
            transition: 'color 0.3s ease',
            marginRight: '200px',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
            Privacy Policy
          </a>
          <a href="/terms-of-service" style={{
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
          /* Tablet breakpoint */
          @media (max-width: 1024px) {
            .join-section {
              padding: 80px 40px !important;
            }
          }

          /* Mobile breakpoint */
          @media (max-width: 768px) {
            .terms-hero-section {
              padding-top: 100px !important;
              padding-bottom: 40px !important;
              min-height: auto !important;
            }
            .terms-content-section {
              padding: 40px 16px 60px !important;
            }
            .join-section {
              padding: 60px 20px !important;
              min-height: 60vh !important;
              margin-top: -80px !important;
            }
            .join-section h2 {
              font-size: 32px !important;
              margin-bottom: 40px !important;
              letter-spacing: -1px !important;
            }
            .footer {
              padding: 40px 16px 20px !important;
            }
            .social-icons {
              gap: 30px !important;
              flex-wrap: wrap !important;
            }
            .footer-logo {
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: 16px !important;
            }
            .footer-logo img {
              height: 60px !important;
            }
            .footer-logo h2 {
              font-size: 48px !important;
            }
            .footer-links {
              gap: 20px !important;
              flex-wrap: wrap !important;
            }
            .footer-links span,
            .footer-links a {
              margin-right: 0 !important;
            }
          }

          /* Small mobile */
          @media (max-width: 480px) {
            .terms-hero-section {
              padding-left: 12px !important;
              padding-right: 12px !important;
            }
            .terms-hero-section h1 {
              font-size: 36px !important;
              letter-spacing: -1px !important;
            }
            .join-section h2 {
              font-size: 28px !important;
            }
            .footer-logo h2 {
              font-size: 36px !important;
            }
            .footer-links {
              flex-direction: column !important;
              gap: 12px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default TermsOfService;
