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
  const [endpointDropdownOpen, setEndpointDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('curl');
  const [authExpanded, setAuthExpanded] = useState(true);
  const [bodyExpanded, setBodyExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const languages = [
    { id: 'curl', name: 'cURL' },
    { id: 'javascript', name: 'JavaScript' },
    { id: 'python', name: 'Python' },
    { id: 'go', name: 'Go' },
  ];

  const generateCurlCode = () => {
    const baseUrl = 'https://share-ddn.formless.xyz';
    const path = currentEndpointConfig?.path || '/v1';
    const method = currentEndpointConfig?.method || '';

    const paramsObj = {};
    if (currentEndpointConfig?.params) {
      currentEndpointConfig.params.forEach(param => {
        paramsObj[param.key] = playgroundParams[param.key] || param.default;
      });
    }

    const requestBody = {
      jsonrpc: playgroundJsonrpc,
      id: playgroundId,
      method: method,
      params: paramsObj,
    };

    if (selectedLanguage === 'curl') {
      return `curl --request POST \\
     --url '${baseUrl}${path}' \\
     --header 'Authorization: Bearer <token>' \\
     --header 'Content-Type: application/json' \\
     --data '
${JSON.stringify(requestBody, null, 2)}
'`;
    }

    if (selectedLanguage === 'javascript') {
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

    if (selectedLanguage === 'python') {
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

    if (selectedLanguage === 'go') {
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

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!isOpen) return null;

  const selectedLang = languages.find(l => l.id === selectedLanguage);

  return (
    <>
      <style>{`
        .playground-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .playground-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .playground-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        .playground-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        .playground-input::placeholder {
          color: #6b7280;
        }
        .playground-input:focus {
          outline: none;
          border-color: #3b82f6;
        }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          zIndex: 1000,
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '95%',
          maxWidth: '1100px',
          maxHeight: '85vh',
          backgroundColor: '#0f0f10',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Left side - Endpoint selector and URL */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            {/* Endpoint selector dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setEndpointDropdownOpen(!endpointDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                <span
                  style={{
                    backgroundColor: '#3b82f6',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '2px 6px',
                    borderRadius: '4px',
                  }}
                >
                  POST
                </span>
                <span>{currentEndpointConfig?.name || 'Select Endpoint'}</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ marginLeft: '4px' }}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {endpointDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: '4px',
                    backgroundColor: '#1a1a1c',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '4px',
                    minWidth: '250px',
                    zIndex: 100,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                    maxHeight: '300px',
                    overflowY: 'auto',
                  }}
                  className="playground-scrollbar"
                >
                  {playgroundEndpoints?.map((endpoint, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        handlePlaygroundEndpointChange(endpoint.method);
                        setEndpointDropdownOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        width: '100%',
                        padding: '8px 12px',
                        backgroundColor: playgroundEndpoint === endpoint.method ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#fff',
                        fontSize: '13px',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: '#3b82f6',
                          color: '#fff',
                          fontSize: '10px',
                          fontWeight: '700',
                          padding: '2px 5px',
                          borderRadius: '3px',
                        }}
                      >
                        POST
                      </span>
                      <span>{endpoint.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* URL display */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                fontSize: '13px',
              }}
            >
              <span
                style={{
                  backgroundColor: '#3b82f6',
                  color: '#fff',
                  fontSize: '10px',
                  fontWeight: '700',
                  padding: '2px 5px',
                  borderRadius: '3px',
                }}
              >
                POST
              </span>
              <span style={{ color: '#9ca3af' }}>/v1</span>
              <span style={{ color: '#6b7280' }}>#</span>
              <span style={{ color: '#fff' }}>{currentEndpointConfig?.method || ''}</span>
            </div>
          </div>

          {/* Send button */}
          <button
            onClick={handlePlaygroundSend}
            disabled={playgroundLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: playgroundLoading ? 'wait' : 'pointer',
              opacity: playgroundLoading ? 0.7 : 1,
            }}
          >
            {playgroundLoading ? 'Sending...' : 'Send'}
            <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
              <path d="M0 0v12l10-6z" />
            </svg>
          </button>
        </div>

        {/* Main content - Two panel layout */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            overflow: 'hidden',
          }}
        >
          {/* Left Panel - Form */}
          <div
            className="playground-scrollbar"
            style={{
              width: '45%',
              borderRight: '1px solid rgba(255, 255, 255, 0.1)',
              overflowY: 'auto',
              padding: '20px',
            }}
          >
            {/* Title and description */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
                {currentEndpointConfig?.name || 'API Endpoint'}
              </h3>
              <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>
                {currentEndpointConfig?.description || 'Make an API request to this endpoint.'}
              </p>
            </div>

            {/* Authorization Section */}
            <div style={{ marginBottom: '16px' }}>
              <button
                onClick={() => setAuthExpanded(!authExpanded)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '12px 0',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{
                    transform: authExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }}
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
                <span>Authorization</span>
              </button>

              {authExpanded && (
                <div style={{ padding: '16px 0' }}>
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ color: '#fff', fontSize: '13px', fontWeight: '500' }}>Bearer</span>
                      <span
                        style={{
                          color: '#3b82f6',
                          fontSize: '11px',
                          padding: '2px 6px',
                          backgroundColor: 'rgba(59, 130, 246, 0.15)',
                          borderRadius: '4px',
                        }}
                      >
                        string&lt;bearer&gt;
                      </span>
                      <span
                        style={{
                          color: '#ef4444',
                          fontSize: '11px',
                          padding: '2px 6px',
                          backgroundColor: 'rgba(239, 68, 68, 0.15)',
                          borderRadius: '4px',
                        }}
                      >
                        required
                      </span>
                    </div>
                    <input
                      type="text"
                      value={playgroundBearerToken}
                      onChange={(e) => setPlaygroundBearerToken(e.target.value)}
                      placeholder="Bearer token"
                      className="playground-input"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '14px',
                        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Body Section */}
            <div>
              <button
                onClick={() => setBodyExpanded(!bodyExpanded)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '12px 0',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{
                    transform: bodyExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }}
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
                <span>Body</span>
              </button>

              {bodyExpanded && (
                <div style={{ padding: '16px 0' }}>
                  {/* jsonrpc field */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ color: '#fff', fontSize: '13px', fontWeight: '500' }}>jsonrpc</span>
                      <span
                        style={{
                          color: '#a855f7',
                          fontSize: '11px',
                          padding: '2px 6px',
                          backgroundColor: 'rgba(168, 85, 247, 0.15)',
                          borderRadius: '4px',
                        }}
                      >
                        enum&lt;string&gt;
                      </span>
                      <span
                        style={{
                          color: '#ef4444',
                          fontSize: '11px',
                          padding: '2px 6px',
                          backgroundColor: 'rgba(239, 68, 68, 0.15)',
                          borderRadius: '4px',
                        }}
                      >
                        required
                      </span>
                    </div>
                    <select
                      value={playgroundJsonrpc}
                      onChange={(e) => setPlaygroundJsonrpc(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '14px',
                        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                        cursor: 'pointer',
                        boxSizing: 'border-box',
                      }}
                    >
                      <option value="2.0" style={{ backgroundColor: '#1a1a1c' }}>2.0</option>
                    </select>
                  </div>

                  {/* id field */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ color: '#fff', fontSize: '13px', fontWeight: '500' }}>id</span>
                      <span
                        style={{
                          color: '#3b82f6',
                          fontSize: '11px',
                          padding: '2px 6px',
                          backgroundColor: 'rgba(59, 130, 246, 0.15)',
                          borderRadius: '4px',
                        }}
                      >
                        string
                      </span>
                      <span
                        style={{
                          color: '#ef4444',
                          fontSize: '11px',
                          padding: '2px 6px',
                          backgroundColor: 'rgba(239, 68, 68, 0.15)',
                          borderRadius: '4px',
                        }}
                      >
                        required
                      </span>
                    </div>
                    <input
                      type="text"
                      value={playgroundId}
                      onChange={(e) => setPlaygroundId(e.target.value)}
                      placeholder="Request ID"
                      className="playground-input"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '14px',
                        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {/* Dynamic params */}
                  {currentEndpointConfig?.params?.map((param, idx) => (
                    <div key={idx} style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span style={{ color: '#fff', fontSize: '13px', fontWeight: '500' }}>{param.key}</span>
                        <span
                          style={{
                            color: '#3b82f6',
                            fontSize: '11px',
                            padding: '2px 6px',
                            backgroundColor: 'rgba(59, 130, 246, 0.15)',
                            borderRadius: '4px',
                          }}
                        >
                          {param.type || 'string'}
                        </span>
                        {param.required && (
                          <span
                            style={{
                              color: '#ef4444',
                              fontSize: '11px',
                              padding: '2px 6px',
                              backgroundColor: 'rgba(239, 68, 68, 0.15)',
                              borderRadius: '4px',
                            }}
                          >
                            required
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        value={playgroundParams[param.key] || ''}
                        onChange={(e) => setPlaygroundParams({ ...playgroundParams, [param.key]: e.target.value })}
                        placeholder={param.placeholder || param.default || ''}
                        className="playground-input"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '14px',
                          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Code */}
          <div
            style={{
              width: '55%',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#0a0a0c',
            }}
          >
            {/* Code header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                  <polyline points="4 17 10 11 4 5" />
                  <line x1="12" y1="19" x2="20" y2="19" />
                </svg>
                <span style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>
                  {currentEndpointConfig?.name || 'API Request'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Language selector */}
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 10px',
                      backgroundColor: 'transparent',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '6px',
                      color: '#9ca3af',
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    <span>{selectedLang?.name}</span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>

                  {languageDropdownOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: '4px',
                        backgroundColor: '#1a1a1c',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        padding: '4px',
                        minWidth: '120px',
                        zIndex: 100,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                      }}
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang.id}
                          onClick={() => {
                            setSelectedLanguage(lang.id);
                            setLanguageDropdownOpen(false);
                          }}
                          style={{
                            display: 'block',
                            width: '100%',
                            padding: '8px 12px',
                            backgroundColor: selectedLanguage === lang.id ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                            border: 'none',
                            borderRadius: '6px',
                            color: '#fff',
                            fontSize: '13px',
                            cursor: 'pointer',
                            textAlign: 'left',
                          }}
                        >
                          {lang.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Copy button */}
                <button
                  onClick={() => copyToClipboard(generateCurlCode())}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#9ca3af',
                    cursor: 'pointer',
                  }}
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Code content */}
            <div
              className="playground-scrollbar"
              style={{
                flex: 1,
                padding: '16px',
                overflowY: 'auto',
              }}
            >
              <pre
                style={{
                  margin: 0,
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  color: '#e5e5e5',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                <code>{generateCurlCode()}</code>
              </pre>
            </div>

            {/* Response section (if there's a response) */}
            {playgroundResponse && (
              <div
                style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <span style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>Response</span>
                </div>
                <div
                  className="playground-scrollbar"
                  style={{
                    padding: '16px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                  }}
                >
                  <pre
                    style={{
                      margin: 0,
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                      fontSize: '13px',
                      lineHeight: '1.6',
                      color: '#22c55e',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    <code>{JSON.stringify(playgroundResponse, null, 2)}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaygroundView;
