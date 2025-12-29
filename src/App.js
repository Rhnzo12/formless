import './App.css';
import FormlessLogo from './components/FormlessLogo';

function App() {
  return (
    <div className="App">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-brand">
          <FormlessLogo size={32} />
          <span className="brand-text">FORMLESS<sup>TM</sup></span>
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
          <FormlessLogo size={200} className="large-logo" />
          <div className="logo-text">
            <span className="formless-text">FORMLESS</span>
            <sup className="tm-text">TM</sup>
          </div>
        </div>
      </section>

      {/* Background glow effect */}
      <div className="background-glow"></div>
    </div>
  );
}

export default App;
