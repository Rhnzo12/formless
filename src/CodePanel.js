import { useState } from 'react';

// Syntax highlighting for code snippets
const syntaxHighlight = (code, language) => {
  if (!code) return '';

  let highlighted = code
    // Strings (single and double quotes)
    .replace(/(["'])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span style="color: #a5d6ff">$1$2$3</span>')
    // Keywords
    .replace(/\b(curl|import|from|def|const|let|var|function|return|await|async|new|class|public|private|package|main|func|require|puts|echo|if|else|defer)\b/g, '<span style="color: #ff7b72">$1</span>')
    // CLI flags
    .replace(/(--\w+)/g, '<span style="color: #79c0ff">$1</span>')
    // Brackets
    .replace(/(\{|\}|\[|\])/g, '<span style="color: #8b949e">$1</span>');

  return highlighted;
};

// Syntax highlighting for JSON
const jsonSyntaxHighlight = (json) => {
  if (typeof json !== 'string') {
    json = JSON.stringify(json, null, 2);
  }
  return json
    .replace(/(".*?")(?=\s*:)/g, '<span style="color: #7ee787">$1</span>')
    .replace(/:\s*(".*?")/g, ': <span style="color: #a5d6ff">$1</span>')
    .replace(/:\s*(true|false)/g, ': <span style="color: #79c0ff">$1</span>')
    .replace(/:\s*(\d+)/g, ': <span style="color: #79c0ff">$1</span>')
    .replace(/(\{|\}|\[|\])/g, '<span style="color: #8b949e">$1</span>');
};

// Language icons
const LanguageIcon = ({ language }) => {
  switch (language) {
    case 'curl':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
      );
    case 'Python':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#3776AB">
          <path d="M12 0C5.372 0 5.729 2.597 5.729 2.597l.007 2.69h6.395v.808H3.894S0 5.611 0 12.021c0 6.41 3.397 6.181 3.397 6.181h2.027v-2.975s-.109-3.397 3.342-3.397h5.755s3.232.052 3.232-3.125V3.054S18.24 0 12 0zm-3.2 1.76a1.043 1.043 0 110 2.086 1.043 1.043 0 010-2.086z"/>
          <path d="M12 24c6.628 0 6.271-2.597 6.271-2.597l-.007-2.69h-6.395v-.808h8.237S24 18.389 24 11.979c0-6.41-3.397-6.181-3.397-6.181h-2.027v2.975s.109 3.397-3.342 3.397H9.479s-3.232-.052-3.232 3.125v5.651S5.76 24 12 24zm3.2-1.76a1.043 1.043 0 110-2.086 1.043 1.043 0 010 2.086z"/>
        </svg>
      );
    case 'JavaScript':
      return <span style={{ color: '#f7df1e', fontWeight: 'bold', fontSize: '10px' }}>JS</span>;
    case 'PHP':
      return <span style={{ color: '#8892be', fontWeight: 'bold', fontSize: '10px' }}>PHP</span>;
    case 'Go':
      return <span style={{ color: '#00add8', fontWeight: 'bold', fontSize: '10px' }}>Go</span>;
    case 'Java':
      return <span style={{ color: '#ed8b00', fontWeight: 'bold', fontSize: '10px' }}>Java</span>;
    case 'Ruby':
      return <span style={{ color: '#cc342d', fontWeight: 'bold', fontSize: '10px' }}>Ruby</span>;
    default:
      return null;
  }
};

// Copy icon
const CopyIcon = ({ copied }) => {
  if (copied) {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  );
};

// Chevron icon
const ChevronIcon = ({ isOpen }) => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    style={{
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.2s ease'
    }}
  >
    <path d="M6 9l6 6 6-6"/>
  </svg>
);

const languages = ['curl', 'Python', 'JavaScript', 'PHP', 'Go', 'Java', 'Ruby'];

// Code Panel Component for request snippets
export const CodeRequestPanel = ({
  title,
  codeByLanguage, // Object with language keys and code values
  theme,
  copiedCode,
  copyToClipboard,
  copyId,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState('curl');
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  const currentCode = codeByLanguage[selectedLanguage] || codeByLanguage['curl'] || '';

  return (
    <div style={{
      backgroundColor: theme.bgCard || '#161b22',
      borderRadius: '12px',
      border: `1px solid ${theme.border || '#30363d'}`,
      overflow: 'visible',
    }}>
      {/* Panel Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        borderBottom: `1px solid ${theme.border || '#30363d'}`,
        backgroundColor: theme.bgSecondary || '#0d1117',
        borderRadius: '12px 12px 0 0',
      }}>
        <span style={{ fontWeight: '600', color: theme.text || '#e6edf3', fontSize: '14px' }}>{title}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Language Dropdown */}
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: theme.bgTertiary || '#21262d',
                padding: '4px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={theme.textMuted || '#8b949e'} strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
              <span style={{ color: theme.textMuted || '#8b949e', fontSize: '12px' }}>
                {selectedLanguage === 'curl' ? 'cURL' : selectedLanguage}
              </span>
              <ChevronIcon isOpen={languageDropdownOpen} />
            </div>

            {languageDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '4px',
                backgroundColor: theme.bgSecondary || '#161b22',
                border: `1px solid ${theme.border || '#30363d'}`,
                borderRadius: '8px',
                padding: '4px 0',
                minWidth: '140px',
                maxHeight: '280px',
                overflowY: 'auto',
                zIndex: 1000,
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              }}>
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setSelectedLanguage(lang);
                      setLanguageDropdownOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '8px 12px',
                      background: selectedLanguage === lang ? 'rgba(56, 139, 253, 0.15)' : 'none',
                      border: 'none',
                      color: selectedLanguage === lang ? '#58a6ff' : (theme.text || '#e6edf3'),
                      fontSize: '13px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.1s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedLanguage !== lang) {
                        e.currentTarget.style.background = 'rgba(56, 139, 253, 0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedLanguage !== lang) {
                        e.currentTarget.style.background = 'none';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <LanguageIcon language={lang} />
                      <span>{lang === 'curl' ? 'cURL' : lang}</span>
                    </div>
                    {selectedLanguage === lang && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Copy Button */}
          <button
            onClick={() => copyToClipboard(currentCode, copyId)}
            style={{
              background: 'none',
              border: 'none',
              color: theme.textMuted || '#8b949e',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <CopyIcon copied={copiedCode === copyId} />
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div
        className="code-panel-scroll"
        style={{
          maxHeight: '220px',
          padding: '14px',
          borderRadius: '0 0 12px 12px',
          overflow: 'auto',
          backgroundColor: theme.bgCard || '#161b22',
        }}
      >
        <pre style={{
          fontSize: '11px',
          fontFamily: "'IBM Plex Mono', Monaco, Consolas, monospace",
          margin: 0,
          lineHeight: '1.6',
          color: theme.textSecondary || '#e6edf3',
          whiteSpace: 'pre',
        }}
        dangerouslySetInnerHTML={{ __html: syntaxHighlight(currentCode, selectedLanguage) }}
        />
      </div>
    </div>
  );
};

// Response Panel Component (for 200 response schema)
export const CodeResponsePanel = ({
  statusCode = '200',
  responseJson, // Object to be JSON stringified
  theme,
  copiedCode,
  copyToClipboard,
  copyId,
}) => {
  const jsonString = typeof responseJson === 'string'
    ? responseJson
    : JSON.stringify(responseJson, null, 2);

  return (
    <div style={{
      backgroundColor: theme.bgCard || '#161b22',
      borderRadius: '12px',
      border: `1px solid ${theme.border || '#30363d'}`,
      overflow: 'hidden',
    }}>
      {/* Panel Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 16px',
        backgroundColor: theme.bgSecondary || '#0d1117',
        borderRadius: '12px 12px 0 0',
        borderBottom: `1px solid ${theme.border || '#30363d'}`,
      }}>
        <span style={{ color: theme.textMuted || '#8b949e', fontSize: '13px' }}>{statusCode}</span>
        <button
          onClick={() => copyToClipboard(jsonString, copyId)}
          style={{
            background: 'none',
            border: 'none',
            color: theme.textMuted || '#8b949e',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          <CopyIcon copied={copiedCode === copyId} />
        </button>
      </div>

      {/* Response Code */}
      <div
        className="code-panel-scroll"
        style={{
          maxHeight: '220px',
          padding: '14px',
          overflow: 'auto',
          backgroundColor: theme.bgCard || '#161b22',
        }}
      >
        <pre style={{
          fontSize: '11px',
          fontFamily: "'IBM Plex Mono', Monaco, Consolas, monospace",
          margin: 0,
          lineHeight: '1.6',
          color: theme.textSecondary || '#e6edf3',
          whiteSpace: 'pre',
        }}
        dangerouslySetInnerHTML={{ __html: jsonSyntaxHighlight(responseJson) }}
        />
      </div>
    </div>
  );
};

// Combined Right Panel Component (contains both code and response panels)
export const RightCodePanel = ({
  title,
  codeByLanguage,
  responseJson,
  theme,
  copiedCode,
  copyToClipboard,
  codeId,
  responseId,
  className = 'right-code-panel',
}) => {
  return (
    <div
      className={className}
      style={{
        width: '420px',
        flexShrink: 0,
        position: 'fixed',
        top: '120px',
        right: '40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      {/* Code Request Panel */}
      <CodeRequestPanel
        title={title}
        codeByLanguage={codeByLanguage}
        theme={theme}
        copiedCode={copiedCode}
        copyToClipboard={copyToClipboard}
        copyId={codeId}
      />

      {/* Response Panel */}
      <CodeResponsePanel
        statusCode="200"
        responseJson={responseJson}
        theme={theme}
        copiedCode={copiedCode}
        copyToClipboard={copyToClipboard}
        copyId={responseId}
      />
    </div>
  );
};

// CSS styles to be added to your app
export const codePanelStyles = `
  /* Code panel scrollbar - matches original UI */
  .code-panel-scroll {
    overflow: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1);
  }

  .code-panel-scroll::-webkit-scrollbar {
    width: 14px;
    height: 14px;
  }

  .code-panel-scroll::-webkit-scrollbar-track {
    background: #0d1117;
  }

  .code-panel-scroll::-webkit-scrollbar-thumb {
    background: #484f58;
    border-radius: 7px;
    border: 3px solid #0d1117;
  }

  .code-panel-scroll::-webkit-scrollbar-thumb:hover {
    background: #6e7681;
  }

  .code-panel-scroll::-webkit-scrollbar-corner {
    background: #0d1117;
  }
`;

export default RightCodePanel;
