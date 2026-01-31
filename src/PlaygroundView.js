import { useState } from 'react';

const PlaygroundView = ({
  playgroundEndpoint,
  playgroundEndpoints,
  currentEndpointConfig,
  playgroundBearerToken,
  setPlaygroundBearerToken,
  playgroundJsonrpc,
  setPlaygroundJsonrpc,
  playgroundId,
  setPlaygroundId,
  playgroundParams,
  setPlaygroundParams,
  playgroundResponse,
  playgroundLoading,
  handlePlaygroundSend,
  handlePlaygroundEndpointChange,
  onClose,
  isOpen,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState('curl');
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [activeResponseTab, setActiveResponseTab] = useState('200');
  const [copied, setCopied] = useState(false);
  const [responseCopied, setResponseCopied] = useState(false);

  const languages = [
    { id: 'curl', name: 'cURL', icon: 'https://d3gk2c5xim1je2.cloudfront.net/devicon/bash.svg' },
    { id: 'javascript', name: 'JavaScript', icon: 'https://d3gk2c5xim1je2.cloudfront.net/devicon/javascript.svg' },
    { id: 'python', name: 'Python', icon: 'https://d3gk2c5xim1je2.cloudfront.net/devicon/python.svg' },
    { id: 'go', name: 'Go', icon: 'https://d3gk2c5xim1je2.cloudfront.net/devicon/go.svg' },
  ];

  const generateCode = (lang) => {
    const baseUrl = 'https://share-ddn.formless.xyz';
    const path = currentEndpointConfig.path;
    const method = currentEndpointConfig.method;

    const paramsObj = {};
    currentEndpointConfig.params.forEach(param => {
      paramsObj[param.key] = playgroundParams[param.key] || param.default;
    });

    const requestBody = {
      jsonrpc: playgroundJsonrpc,
      id: playgroundId,
      method: method,
      params: paramsObj,
    };

    if (lang === 'curl') {
      return `curl --request POST \\
  --url '${baseUrl}${path}' \\
  --header 'Authorization: Bearer <token>' \\
  --header 'Content-Type: application/json' \\
  --data '
${JSON.stringify(requestBody, null, 2)}
'`;
    }

    if (lang === 'javascript') {
      return `const response = await fetch('${baseUrl}${path}', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(${JSON.stringify(requestBody, null, 4).split('\n').join('\n  ')})
});

const data = await response.json();
console.log(data);`;
    }

    if (lang === 'python') {
      return `import requests

response = requests.post(
    '${baseUrl}${path}',
    headers={
        'Authorization': 'Bearer <token>',
        'Content-Type': 'application/json',
    },
    json=${JSON.stringify(requestBody, null, 4).replace(/"/g, "'").replace(/: true/g, ': True').replace(/: false/g, ': False').replace(/: null/g, ': None')}
)

print(response.json())`;
    }

    if (lang === 'go') {
      return `package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "net/http"
)

func main() {
    body := map[string]interface{}{
        "jsonrpc": "${playgroundJsonrpc}",
        "id":      "${playgroundId}",
        "method":  "${method}",
        "params":  map[string]interface{}{
${Object.entries(paramsObj).map(([k, v]) => `            "${k}": "${v}",`).join('\n')}
        },
    }

    jsonBody, _ := json.Marshal(body)
    req, _ := http.NewRequest("POST", "${baseUrl}${path}", bytes.NewBuffer(jsonBody))
    req.Header.Set("Authorization", "Bearer <token>")
    req.Header.Set("Content-Type", "application/json")

    client := &http.Client{}
    resp, _ := client.Do(req)
    defer resp.Body.Close()

    fmt.Println(resp)
}`;
    }

    return '';
  };

  const generateResponse = () => {
    if (playgroundResponse) {
      return JSON.stringify(playgroundResponse, null, 2);
    }

    // Default example response
    const exampleResponse = {
      jsonrpc: "2.0",
      id: "<string>",
      result: {
        success: true,
        user_unique_id: "<string>",
        email_address: "jsmith@example.com",
        display_name: "<string>",
        verified_identity: true,
        financial_accounts: [{}],
        verifications: [{}]
      }
    };

    return JSON.stringify(exampleResponse, null, 2);
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'response') {
        setResponseCopied(true);
        setTimeout(() => setResponseCopied(false), 2000);
      } else {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const selectedLang = languages.find(l => l.id === selectedLanguage);

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        .pg-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .pg-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .pg-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.15);
          border-radius: 9999px;
        }
        .pg-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.2);
        }
        .dark .pg-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
        }
        .dark .pg-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.25);
        }
        .pg-code-block {
          font-variant-ligatures: none;
        }
        .pg-dropdown-item:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }
        .dark .pg-dropdown-item:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        .pg-copy-btn:hover {
          color: #6b7280;
        }
        .dark .pg-copy-btn:hover {
          color: rgba(255, 255, 255, 0.6);
        }
        .pg-tab-active {
          color: var(--primary-color, #000);
        }
        .dark .pg-tab-active {
          color: var(--primary-light, #525252);
        }
        .pg-tab-indicator {
          background-color: var(--primary-color, #000);
        }
        .dark .pg-tab-indicator {
          background-color: var(--primary-light, #525252);
        }
      `}</style>

      {/* Blurred backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          zIndex: 1000,
        }}
      />

      {/* Modal container */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '95%',
          maxWidth: '900px',
          maxHeight: '90vh',
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          overflowY: 'auto',
          padding: '24px',
        }}
      >
        {/* Header Card - API Endpoint */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--bg-color, #fff)',
            borderRadius: '16px',
            border: '1px solid var(--border-color, rgba(0,0,0,0.1))',
            padding: '6px',
          }}
          className="dark:bg-[#0a0a0c] dark:border-white/10"
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {/* Endpoint URL display */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 0 6px 6px',
                borderRadius: '12px',
                border: '1px solid var(--border-color, rgba(0,0,0,0.1))',
                overflow: 'hidden',
              }}
              className="dark:border-white/10"
            >
              {/* POST badge */}
              <span
                style={{
                  backgroundColor: '#3064E3',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '700',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                }}
              >
                POST
              </span>

              {/* Path */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                  fontSize: '14px',
                  flex: 1,
                  overflow: 'hidden',
                }}
              >
                <span style={{ color: 'var(--text-muted, #9ca3af)' }}>/</span>
                <span
                  style={{
                    fontWeight: '500',
                    color: 'var(--text-color, #1f2937)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  className="dark:text-white"
                >
                  {currentEndpointConfig.path.replace(/^\//, '')}
                </span>
              </div>
            </div>

            {/* Try it button */}
            <button
              onClick={handlePlaygroundSend}
              disabled={playgroundLoading}
              aria-label="Try it"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '0 12px',
                height: '36px',
                backgroundColor: '#3064E3',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: playgroundLoading ? 'wait' : 'pointer',
                opacity: playgroundLoading ? 0.7 : 1,
                transition: 'opacity 0.15s',
              }}
            >
              <span>{playgroundLoading ? 'Sending...' : 'Try it'}</span>
              <svg
                style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#fff',
                  WebkitMaskImage: 'url(https://d3gk2c5xim1je2.cloudfront.net/v7.1.0/solid/play.svg)',
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskImage: 'url(https://d3gk2c5xim1je2.cloudfront.net/v7.1.0/solid/play.svg)',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center',
                }}
              />
            </button>
          </div>
        </div>

        {/* Code Example Card */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--bg-color, #f9fafb)',
            borderRadius: '16px',
            border: '1px solid var(--border-color, rgba(0,0,0,0.1))',
            padding: '2px',
            overflow: 'hidden',
          }}
          className="dark:bg-white/5 dark:border-white/10"
        >
          {/* Code header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              padding: '0 10px',
            }}
          >
            {/* Title */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: '500',
                color: 'var(--text-color, #1f2937)',
                padding: '8px 0',
              }}
              className="dark:text-gray-50"
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentEndpointConfig.name}
              </span>
            </div>

            {/* Right controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {/* Language selector */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '5px 6px 5px 10px',
                    backgroundColor: 'transparent',
                    border: '1px solid transparent',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: 'var(--text-muted, #6b7280)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  className="hover:bg-gray-200/50 dark:hover:bg-gray-700/70 dark:text-gray-400"
                >
                  <span
                    style={{
                      width: '14px',
                      height: '14px',
                      backgroundColor: 'currentColor',
                      WebkitMaskImage: `url(${selectedLang?.icon})`,
                      WebkitMaskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center',
                      WebkitMaskSize: '100%',
                      maskImage: `url(${selectedLang?.icon})`,
                      maskRepeat: 'no-repeat',
                      maskPosition: 'center',
                      maskSize: '100%',
                    }}
                  />
                  <span style={{ fontWeight: '500' }}>{selectedLang?.name}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m7 15 5 5 5-5" />
                    <path d="m7 9 5-5 5 5" />
                  </svg>
                </button>

                {languageDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '4px',
                      backgroundColor: 'var(--bg-color, #fff)',
                      border: '1px solid var(--border-color, rgba(0,0,0,0.1))',
                      borderRadius: '12px',
                      padding: '4px',
                      minWidth: '140px',
                      zIndex: 100,
                      boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                    }}
                    className="dark:bg-[#1a1a1a] dark:border-white/10"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.id}
                        className="pg-dropdown-item"
                        onClick={() => {
                          setSelectedLanguage(lang.id);
                          setLanguageDropdownOpen(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          width: '100%',
                          padding: '8px 12px',
                          backgroundColor: selectedLanguage === lang.id ? 'rgba(0,0,0,0.05)' : 'transparent',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '13px',
                          color: 'var(--text-color, #1f2937)',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                        className={`dark:text-gray-200 ${selectedLanguage === lang.id ? 'dark:bg-white/10' : ''}`}
                      >
                        <span
                          style={{
                            width: '14px',
                            height: '14px',
                            backgroundColor: 'currentColor',
                            WebkitMaskImage: `url(${lang.icon})`,
                            WebkitMaskRepeat: 'no-repeat',
                            WebkitMaskPosition: 'center',
                            WebkitMaskSize: '100%',
                            maskImage: `url(${lang.icon})`,
                            maskRepeat: 'no-repeat',
                            maskPosition: 'center',
                            maskSize: '100%',
                          }}
                        />
                        {lang.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Copy button */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => copyToClipboard(generateCode(selectedLanguage), 'code')}
                  className="pg-copy-btn"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '26px',
                    height: '26px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    color: 'var(--text-muted, #9ca3af)',
                  }}
                  aria-label="Copy the contents from the code block"
                >
                  {copied ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.25 5.25H7.25C6.14543 5.25 5.25 6.14543 5.25 7.25V14.25C5.25 15.3546 6.14543 16.25 7.25 16.25H14.25C15.3546 16.25 16.25 15.3546 16.25 14.25V7.25C16.25 6.14543 15.3546 5.25 14.25 5.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M2.80103 11.998L1.77203 5.07397C1.61003 3.98097 2.36403 2.96397 3.45603 2.80197L10.38 1.77297C11.313 1.63397 12.19 2.16297 12.528 3.00097" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Code content */}
          <div
            className="pg-scrollbar pg-code-block"
            style={{
              padding: '14px 16px',
              backgroundColor: '#fff',
              borderRadius: '12px',
              overflow: 'auto',
              maxHeight: '280px',
            }}
            tabIndex={0}
          >
            <pre
              style={{
                margin: 0,
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                fontSize: '12px',
                lineHeight: '1.35rem',
                whiteSpace: 'pre',
                color: '#1f2328',
              }}
              className="dark:bg-[#0B0C0E] dark:text-[#D4D4D4]"
            >
              <code>{generateCode(selectedLanguage)}</code>
            </pre>
          </div>
        </div>

        {/* Response Card */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--bg-color, #f9fafb)',
            borderRadius: '16px',
            border: '1px solid var(--border-color, rgba(0,0,0,0.1))',
            padding: '2px',
            overflow: 'hidden',
          }}
          className="dark:bg-white/5 dark:border-white/10"
        >
          {/* Response header with tabs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              padding: '0 10px',
            }}
          >
            {/* Tabs */}
            <div
              role="tablist"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                lineHeight: '1.5rem',
              }}
            >
              <button
                role="tab"
                aria-selected={activeResponseTab === '200'}
                onClick={() => setActiveResponseTab('200')}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 6px',
                  marginBottom: '-1px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontWeight: '600',
                  fontSize: '12px',
                  cursor: 'pointer',
                  color: activeResponseTab === '200' ? 'var(--primary-color, #000)' : 'var(--text-muted, #6b7280)',
                }}
                className={activeResponseTab === '200' ? 'pg-tab-active' : 'dark:text-gray-400'}
              >
                200
                {activeResponseTab === '200' && (
                  <div
                    className="pg-tab-indicator"
                    style={{
                      position: 'absolute',
                      bottom: '-6px',
                      left: 0,
                      right: 0,
                      height: '2px',
                      borderRadius: '9999px',
                    }}
                  />
                )}
              </button>
            </div>

            {/* Copy button */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => copyToClipboard(generateResponse(), 'response')}
                className="pg-copy-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '26px',
                  height: '26px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: 'var(--text-muted, #9ca3af)',
                }}
                aria-label="Copy the contents from the code block"
              >
                {responseCopied ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.25 5.25H7.25C6.14543 5.25 5.25 6.14543 5.25 7.25V14.25C5.25 15.3546 6.14543 16.25 7.25 16.25H14.25C15.3546 16.25 16.25 15.3546 16.25 14.25V7.25C16.25 6.14543 15.3546 5.25 14.25 5.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2.80103 11.998L1.77203 5.07397C1.61003 3.98097 2.36403 2.96397 3.45603 2.80197L10.38 1.77297C11.313 1.63397 12.19 2.16297 12.528 3.00097" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Response content */}
          <div
            className="pg-scrollbar pg-code-block"
            style={{
              padding: '14px 16px',
              backgroundColor: '#fff',
              borderRadius: '12px',
              overflow: 'auto',
              maxHeight: '280px',
            }}
            tabIndex={0}
          >
            <pre
              style={{
                margin: 0,
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                fontSize: '12px',
                lineHeight: '1.35rem',
                whiteSpace: 'pre',
                color: '#1f2328',
              }}
              className="dark:bg-[#0B0C0E] dark:text-[#D4D4D4]"
            >
              <code>{generateResponse()}</code>
            </pre>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            backgroundColor: 'rgba(0,0,0,0.5)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            color: '#fff',
            fontSize: '18px',
          }}
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </>
  );
};

export default PlaygroundView;
