import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import FluidBackground from './components/FluidBackground';

const PrivacyPolicy = () => {
  const [contentVisible, setContentVisible] = useState(false);
  const [joinVisible, setJoinVisible] = useState(false);
  const contentRef = useRef(null);
  const joinRef = useRef(null);

  useEffect(() => {
    document.title = 'Privacy Policy';
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === contentRef.current) {
              setContentVisible(true);
            }
            if (entry.target === joinRef.current) {
              setJoinVisible(true);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }
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
        className="privacy-hero-section"
        style={{
          position: 'relative',
          zIndex: 2,
          minHeight: '50vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: '120px',
          paddingBottom: '40px',
          paddingLeft: 'clamp(16px, 3vw, 40px)',
          paddingRight: 'clamp(16px, 3vw, 40px)',
        }}
      >
        <div style={{
          width: '100%',
          maxWidth: '900px',
          margin: '0 auto',
        }}>
          {/* Large Italic Title */}
          <h1 style={{
            fontSize: 'clamp(48px, 8vw, 100px)',
            fontWeight: '300',
            fontStyle: 'italic',
            lineHeight: '1.05',
            margin: '0 0 40px 0',
            fontFamily: '"Inter", sans-serif',
            letterSpacing: '-2px',
          }}>
            Privacy Policy
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

      {/* Gradient Fade to Black (after hero) */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          height: '300px',
          background: 'linear-gradient(to bottom, transparent 0%, #000 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Privacy Policy Content */}
      <section
        ref={contentRef}
        className="privacy-content-section"
        style={{
          position: 'relative',
          zIndex: 3,
          padding: '40px clamp(16px, 3vw, 40px) 100px',
          backgroundColor: '#000',
          marginTop: '-150px',
          opacity: contentVisible ? 1 : 0,
          transform: contentVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
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
            Formless, Inc. ("Formless," "we", "us", or "our") is committed to protecting your privacy. We have prepared this Privacy Policy to describe to you our practices regarding the data we collect, use, and share in connection with the Formless website, and other software provided on or in connection with our services, as described in our Terms of Service (collectively, the "Service").
          </p>

          {/* Main Numbered List */}
          <ol style={{
            ...contentStyle,
            paddingLeft: '24px',
            margin: 0,
          }}>
            {/* 1. Types of Data We Collect */}
            <li style={listItemStyle}>
              <strong>Types of Data We Collect.</strong> "Personal Data" means data that allows someone to identify you individually, including, for example, your name, email address, as well as any other non-public information about you that is associated with or linked to any of the foregoing. "Anonymous Data" means data, including aggregated and de-identified data, that is not associated with or linked to any personal data; Anonymous Data does not, by itself, permit the identification of individual persons. We collect Anonymous Data as described below.

              {/* Information Collected via Technology - Sub-paragraph */}
              <p style={{ margin: '20px 0 16px 0' }}>
                <strong>Information Collected via Technology.</strong> As you navigate through and interact with our Service, we may use automatic data collection technologies to collect certain information about your equipment, browsing actions, and patterns, including:
              </p>

              {/* Nested numbered list for technology items */}
              <ol style={{
                paddingLeft: '24px',
                margin: '0 0 0 0',
              }}>
                <li style={{ marginBottom: '16px' }}>
                  <strong>Information Collected by Our Servers.</strong> To provide our Service and make it more useful to you, we (or a third-party service provider) collect information from you, including, but not limited to, your browser type, operating system, Internet Protocol ("IP") address, mobile device ID, blockchain address, wallet type, and date/time stamps.
                </li>
                <li style={{ marginBottom: '16px' }}>
                  <strong>Log Files.</strong> As is true of most websites and applications, we gather certain information automatically and store it in log files. This information includes IP addresses, browser type, Internet service provider ("ISP"), referring/exit pages, operating system, date/time stamps, and clickstream data. We use this information to analyze trends, administer the Service, track users' movements around the Service, and better tailor our Services to our users' needs. For example, some of the information may be collected so that when you visit the Service, it will recognize you and the information can be used to personalize your experience.
                </li>
                <li style={{ marginBottom: '16px' }}>
                  <strong>Cookies.</strong> Like many online services, we use cookies to collect information. We may use both session Cookies (which expire once you close your web browser) and persistent Cookies (which stay on your computer until you delete them) to analyze how users interact with our Service, make improvements to our product quality, and provide users with a more personalized experience.
                </li>
                <li style={{ marginBottom: '16px' }}>
                  <strong>Pixel Tag.</strong> In addition, we use "Pixel Tags" (also referred to as clear Gifs, Web beacons, or Web bugs). Pixel Tags allow us to analyze how users find our Service, make the Service more useful to you, and tailor your experience with us to meet your particular interests and needs.
                </li>
                <li style={{ marginBottom: '16px' }}>
                  <strong>How We Respond to Do Not Track Signals.</strong> Our systems do not currently recognize "do not track" signals or other mechanisms that might enable Users to opt-out of tracking on our site.
                </li>
                <li style={{ marginBottom: '0' }}>
                  <strong>Analytics Services.</strong> In addition to the tracking technologies we place like Cookies and Pixel Tags, other companies may set their own cookies or similar tools when you visit our Service. This includes third-party analytics services ("Analytics Services") that we engage to help analyze how users use the Service. The information generated by the Cookies or other technologies about your use of our Service (the "Analytics Information") is transmitted to the Analytics Services. The Analytics Services use Analytics Information to compile reports on user activity, which we may receive on an individual or aggregate basis. We use the information we get from Analytics Services to improve our Service. The Analytics Services may also transfer information to third parties where required to do so by law, or where such third parties process Analytics Information on their behalf. Each Analytics Services' ability to use and share Analytics Information is restricted by such Analytics Services' terms of use and privacy policy. By using our Service, you consent to the processing of data about you by Analytics Services in the manner and for the purposes set out above.
                </li>
              </ol>
            </li>

            {/* 2. Information Collected from Third-Party Companies */}
            <li style={listItemStyle}>
              <strong>Information Collected from Third-Party Companies.</strong> We may receive Anonymous Data about you from companies that offer their products and/or services for use in conjunction with our Service or whose products and/or services may be linked from our Service. For example, third-party wallet providers provide us with your blockchain address and certain other information you choose to share with those wallet providers. We may add this to the data we have already collected from or about you through our Service.
            </li>

            {/* 3. Public Information Observed from Blockchains */}
            <li style={listItemStyle}>
              <strong>Public Information Observed from Blockchains.</strong> We collect data from activity that is publicly visible and/or accessible on blockchains. This may include blockchain addresses and information regarding purchases, sales, or transfers of NFTs, which may then be associated with other data you have provided to us.
            </li>

            {/* 4. Third-Party Websites */}
            <li style={listItemStyle}>
              <strong>Third-Party Websites.</strong> Our Service may contain links to third-party websites. When you click on a link to any other website or location, you will leave our Service and go to another site, and another entity may collect Personal Data from you. We have no control over, do not review, and cannot be responsible for these third-party websites or their content. Please be aware that the terms of this Privacy Policy do not apply to these third-party websites or their content, or to any collection of your data after you click on links to such third-party websites. We encourage you to read the privacy policies of every website you visit. Any links to third-party websites or locations are for your convenience and do not signify our endorsement of such third parties or their products, content, or websites.
            </li>

            {/* 5. Cookie Settings */}
            <li style={listItemStyle}>
              If you decide at any time that you no longer wish to accept Cookies from our Service for any of the purposes described above, then you can instruct your browser, by changing its settings, to stop accepting Cookies or to prompt you before accepting a Cookie from the websites you visit. Consult your browser's technical information. If you do not accept Cookies, however, you may not be able to use all portions of the Service or all functionality of the Service.
            </li>

            {/* 6. Data Access and Control */}
            <li style={listItemStyle}>
              <strong>Data Access and Control.</strong> We cannot edit or delete any information that is stored on a blockchain, for example the Ethereum blockchain, as we do not have custody or control over any blockchains. The information stored on the blockchain may include purchases, sales, and transfers related to your blockchain address and NFTs held at that address. "NFT" in this Privacy Policy means a non-fungible token or similar digital item implemented on a blockchain (such as the Ethereum blockchain), which uses smart contracts to link to or otherwise be associated with certain content or data.
            </li>

            {/* 7. Data Protection */}
            <li style={listItemStyle}>
              <strong>Data Protection.</strong> We care about the security of your information and use physical, administrative, and technological safeguards to preserve the integrity and security of information collected through our Service. However, no security system is impenetrable and we cannot guarantee the security of our systems. In the event that any information under our custody and control is compromised as a result of a breach of security, we will take steps to investigate and remediate the situation and, in accordance with applicable laws and regulations, notify those individuals whose information may have been compromised. You are responsible for the security of your digital wallet, and we urge you to take steps to ensure it is and remains secure. If you discover an issue related to your wallet, please contact your wallet provider.
            </li>

            {/* 8. Minors */}
            <li style={listItemStyle}>
              <strong>Minors.</strong> Our Terms of Service require all users to be at least 18 years old.
            </li>

            {/* 9. Users Outside of the United States */}
            <li style={listItemStyle}>
              <strong>Users Outside of the United States.</strong> If you are a non-U.S. user of the Service, by visiting the Service and providing us with data, you acknowledge and agree that your Anonymous Data may be processed for the purposes identified in the Privacy Policy. In addition, your Anonymous Data may be processed in the country in which it was collected and in other countries, including the United States, where laws regarding the processing of Anonymous Data may be less stringent than the laws in your country. By providing your Anonymous Data, you consent to such transfer.
            </li>

            {/* 10. Changes to This Privacy Policy */}
            <li style={listItemStyle}>
              <strong>Changes to This Privacy Policy.</strong> This Privacy Policy may be updated from time to time for any reason. We will notify you of any changes to our Privacy Policy by posting the new Privacy Policy at{' '}
              <a
                href="https://formless.xyz/privacy"
                style={{
                  color: 'white',
                  textDecoration: 'underline',
                  transition: 'opacity 0.3s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                https://formless.xyz/privacy
              </a>
              . The date the Privacy Policy was last revised is identified at the beginning of this Privacy Policy. You are responsible for periodically visiting our Service and this Privacy Policy to check for any changes.
            </li>

            {/* 11. Questions, Contacting Formless and Reporting Violations */}
            <li style={{ marginBottom: '0' }}>
              <strong>Questions, Contacting Formless and Reporting Violations.</strong> If you have any questions or concerns or complaints about our Privacy Policy or our data collection or processing practices, or if you want to report any security violations to us, please contact us by using the "Connect" link{' '}
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
          /* Tablet breakpoint */
          @media (max-width: 1024px) {
            .join-section {
              padding: 80px 40px !important;
            }
          }

          /* Mobile breakpoint */
          @media (max-width: 768px) {
            .privacy-hero-section {
              padding-top: 100px !important;
              padding-bottom: 40px !important;
              min-height: auto !important;
            }
            .privacy-content-section {
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
            .privacy-hero-section {
              padding-left: 12px !important;
              padding-right: 12px !important;
            }
            .privacy-hero-section h1 {
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

export default PrivacyPolicy;
