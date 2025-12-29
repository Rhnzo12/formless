import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const blobRef = useRef(null);

  useEffect(() => {
    let animationId;
    let currentX = 50;
    let currentY = 50;
    let targetX = 50;
    let targetY = 50;

    const handleMouseMove = (e) => {
      targetX = (e.clientX / window.innerWidth) * 100;
      targetY = (e.clientY / window.innerHeight) * 100;
    };

    const animate = () => {
      // Smooth interpolation for fluid movement
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      setMousePosition({ x: currentX, y: currentY });
      animationId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="App">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-brand">
          <img src="/logomain.png" alt="Formless" className="nav-logo" />
          <span className="brand-text">FORMLESS<sup className="brand-tm">TM</sup></span>
        </div>
        <div className="nav-links">
          <a href="#api-docs" className="nav-link">API Docs</a>
          <a href="#case-studies" className="nav-link">Case Studies</a>
          <a href="#about" className="nav-link">About</a>
          <a href="#contact" className="nav-link">Contact Us</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-left">
            <h1 className="hero-title">
              Welcome to the future<br />of the internet
            </h1>
            <div className="hero-buttons">
              <a href="#api-docs" className="btn btn-outline">
                View API Documentation
              </a>
              <a href="https://share.stream" className="btn btn-filled" target="_blank" rel="noopener noreferrer">
                Visit share.stream
              </a>
            </div>
          </div>
          <div className="hero-right">
            <p className="hero-description">
              From cutting edge smart contracts to stablecoin payments and revenue sharing technology, our services help you reimagine monetization and community ownership in the new digital economy.
            </p>
          </div>
        </div>
      </section>

      {/* Large Logo Section */}
      <section className="logo-section">
        <div className="logo-container">
          <img src="/logomain.png" alt="Formless" className="large-logo" />
          <div className="logo-text">
            <span className="formless-text">FORMLESS</span>
            <sup className="tm-text">TM</sup>
          </div>
        </div>
      </section>

      {/* Water-like gradient blobs that follow mouse */}
      <div className="gradient-container">
        <div
          className="gradient-blob blob-1"
          style={{
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
          }}
        ></div>
        <div
          className="gradient-blob blob-2"
          style={{
            left: `${mousePosition.x + 10}%`,
            top: `${mousePosition.y - 10}%`,
          }}
        ></div>
        <div
          className="gradient-blob blob-3"
          style={{
            left: `${mousePosition.x - 15}%`,
            top: `${mousePosition.y + 15}%`,
          }}
        ></div>
      </div>
    </div>
  );
}

export default App;
