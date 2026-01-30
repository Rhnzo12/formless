import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
}) => {
  const navigate = useNavigate();
  const [endpointDropdownOpen, setEndpointDropdownOpen] = useState(false);
  const [jsonrpcDropdownOpen, setJsonrpcDropdownOpen] = useState(false);
  const [methodDropdownOpen, setMethodDropdownOpen] = useState(false);
  const [bodyExpanded, setBodyExpanded] = useState(true);
  const [paramsExpanded, setParamsExpanded] = useState(false);

  const pathMap = {
    'identity-lookup': '/api-docs/account-management/identity-lookup',
    'create-contract': '/api-docs/revenue-sharing/create-contract',
    'fetch-split-data': '/api-docs/revenue-sharing/fetch-split-data',
    'execute-payout': '/api-docs/payouts/execute-payout',
    'query-batch-status': '/api-docs/payouts/query-batch-status',
  };

  // Close modal
  const closeModal = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/api-docs');
    }
  };

  return (
    <>
      <style>{`
        .pg-dropdown-item:hover { background-color: rgba(255,255,255,0.08) !important; }
        .pg-field-row:hover .pg-trash { opacity: 0.6 !important; }
        .pg-trash:hover { opacity: 1 !important; color: #ef4444 !important; }
        .pg-input:focus { border-color: #444 !important; }

        /* Custom scrollbar for left panel - on right edge */
        .pg-left-panel::-webkit-scrollbar {
          width: 6px;
        }
        .pg-left-panel::-webkit-scrollbar-track {
          background: transparent;
        }
        .pg-left-panel::-webkit-scrollbar-thumb {
          background-color: #333;
          border-radius: 3px;
        }
        .pg-left-panel::-webkit-scrollbar-thumb:hover {
          background-color: #444;
        }

        /* Custom scrollbar for right panel - on right edge */
        .pg-right-panel::-webkit-scrollbar {
          width: 6px;
        }
        .pg-right-panel::-webkit-scrollbar-track {
          background: transparent;
        }
        .pg-right-panel::-webkit-scrollbar-thumb {
          background-color: #333;
          border-radius: 3px;
        }
        .pg-right-panel::-webkit-scrollbar-thumb:hover {
          background-color: #444;
        }
      `}</style>

      {/* Blurred backdrop */}
      <div
        onClick={closeModal}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 1000,
        }}
      />

      {/* Modal container */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: '1400px',
        height: '85vh',
        maxHeight: '800px',
        backgroundColor: '#0f0f0f',
        borderRadius: '12px',
        overflow: 'hidden',
        zIndex: 1001,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        border: '1px solid #1a1a1a',
      }}>
        {/* Header Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '14px 20px',
          gap: '14px',
          borderBottom: '1px solid #1a1a1a',
          backgroundColor: '#0f0f0f',
          flexShrink: 0,
        }}>
          {/* Left - Endpoint Selector Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setEndpointDropdownOpen(!endpointDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                backgroundColor: 'transparent',
                border: '1px solid #2a2a2a',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              <span style={{
                backgroundColor: '#1d4ed8',
                color: '#fff',
                fontSize: '11px',
                fontWeight: '700',
                padding: '4px 8px',
                borderRadius: '4px',
              }}>POST</span>
              <span style={{ fontWeight: '500' }}>{currentEndpointConfig.name}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>
            {endpointDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '4px',
                backgroundColor: '#141414',
                border: '1px solid #2a2a2a',
                borderRadius: '8px',
                padding: '4px',
                minWidth: '220px',
                zIndex: 1100,
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              }}>
                {Object.entries(playgroundEndpoints).map(([key, config]) => (
                  <button
                    key={key}
                    className="pg-dropdown-item"
                    onClick={() => {
                      handlePlaygroundEndpointChange(key);
                      setEndpointDropdownOpen(false);
                      navigate(pathMap[key]);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      width: '100%',
                      padding: '10px 12px',
                      background: playgroundEndpoint === key ? 'rgba(59, 130, 246, 0.15)' : 'none',
                      border: 'none',
                      color: '#fff',
                      fontSize: '14px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      borderRadius: '6px',
                    }}
                  >
                    <span style={{
                      backgroundColor: '#1d4ed8',
                      color: '#fff',
                      fontSize: '10px',
                      fontWeight: '700',
                      padding: '3px 7px',
                      borderRadius: '4px',
                    }}>POST</span>
                    {config.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Center - URL Display */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            backgroundColor: 'transparent',
            border: '1px solid #2a2a2a',
            borderRadius: '8px',
            overflow: 'hidden',
          }}>
            <span style={{
              backgroundColor: '#1d4ed8',
              color: '#fff',
              fontSize: '12px',
              fontWeight: '700',
              padding: '12px 14px',
            }}>POST</span>
            <code style={{
              flex: 1,
              fontSize: '14px',
              color: '#888',
              fontFamily: 'Monaco, Menlo, Consolas, "Courier New", monospace',
              padding: '12px 16px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>{currentEndpointConfig.path}</code>
          </div>

          {/* Right - Send button */}
          <button
            onClick={handlePlaygroundSend}
            disabled={playgroundLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: '#2563eb',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '15px',
              fontWeight: '600',
              cursor: playgroundLoading ? 'wait' : 'pointer',
              opacity: playgroundLoading ? 0.7 : 1,
            }}
          >
            {playgroundLoading ? 'Sending...' : 'Send'}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
        </div>

        {/* Main Content - Two Column Layout */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Left Panel - Form */}
          <div
            className="pg-left-panel"
            style={{
              width: '45%',
              overflowY: 'auto',
              padding: '24px 28px',
              borderRight: '1px solid #1a1a1a',
            }}
          >
            {/* Required badge */}
            <span style={{
              display: 'inline-block',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              color: '#f87171',
              fontSize: '12px',
              padding: '5px 12px',
              borderRadius: '4px',
              fontWeight: '500',
              marginBottom: '12px',
            }}>required</span>

            {/* Description */}
            <p style={{
              fontSize: '14px',
              color: '#888',
              margin: '0 0 20px 0',
              lineHeight: '1.5',
            }}>JWT token with Unique ID identification</p>

            {/* Bearer token input */}
            <input
              type="text"
              placeholder=""
              value={playgroundBearerToken}
              onChange={(e) => setPlaygroundBearerToken(e.target.value)}
              className="pg-input"
              style={{
                width: '100%',
                padding: '14px 16px',
                backgroundColor: '#111',
                border: '1px solid #2a2a2a',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                marginBottom: '28px',
                boxSizing: 'border-box',
              }}
            />

            {/* Body Section Header */}
            <button
              onClick={() => setBodyExpanded(!bodyExpanded)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '14px 0',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: '1px solid #1a1a1a',
                cursor: 'pointer',
                marginBottom: '20px',
              }}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#666"
                strokeWidth="3"
                style={{ transform: bodyExpanded ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.15s' }}
              >
                <path d="M6 9l6 6 6-6"/>
              </svg>
              <span style={{ fontWeight: '600', fontSize: '15px', color: '#fff' }}>Body</span>
            </button>

            {bodyExpanded && (
              <div>
                {/* jsonrpc field */}
                <div className="pg-field-row" style={{ display: 'flex', alignItems: 'center', marginBottom: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '220px' }}>
                    <span style={{ fontWeight: '600', fontSize: '14px', color: '#fff', fontFamily: 'Monaco, Menlo, monospace' }}>jsonrpc</span>
                    <span style={{ backgroundColor: '#1f1f1f', color: '#777', fontSize: '12px', padding: '3px 8px', borderRadius: '4px', fontFamily: 'Monaco, Menlo, monospace' }}>enum{'<string>'}</span>
                    <span style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#f87171', fontSize: '12px', padding: '3px 8px', borderRadius: '4px', fontWeight: '500' }}>required</span>
                  </div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <button
                        onClick={() => setJsonrpcDropdownOpen(!jsonrpcDropdownOpen)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          padding: '12px 14px',
                          backgroundColor: '#111',
                          border: '1px solid #2a2a2a',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '14px',
                          cursor: 'pointer',
                          fontFamily: 'Monaco, Menlo, monospace',
                        }}
                      >
                        {playgroundJsonrpc}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                          <path d="M6 9l6 6 6-6"/>
                        </svg>
                      </button>
                      {jsonrpcDropdownOpen && (
                        <div style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          marginTop: '4px',
                          backgroundColor: '#141414',
                          border: '1px solid #2a2a2a',
                          borderRadius: '8px',
                          zIndex: 100,
                          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                          overflow: 'hidden',
                        }}>
                          <button
                            className="pg-dropdown-item"
                            onClick={() => { setPlaygroundJsonrpc('2.0'); setJsonrpcDropdownOpen(false); }}
                            style={{
                              display: 'block',
                              width: '100%',
                              padding: '12px 14px',
                              background: playgroundJsonrpc === '2.0' ? '#2563eb' : 'none',
                              border: 'none',
                              color: '#fff',
                              fontSize: '14px',
                              cursor: 'pointer',
                              textAlign: 'left',
                              fontFamily: 'Monaco, Menlo, monospace',
                            }}
                          >
                            2.0
                          </button>
                        </div>
                      )}
                    </div>
                    <button className="pg-trash" style={{ padding: '8px', backgroundColor: 'transparent', border: 'none', color: '#555', cursor: 'pointer', opacity: 0, transition: 'opacity 0.15s' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* id field */}
                <div className="pg-field-row" style={{ display: 'flex', alignItems: 'center', marginBottom: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '220px' }}>
                    <span style={{ fontWeight: '600', fontSize: '14px', color: '#fff', fontFamily: 'Monaco, Menlo, monospace' }}>id</span>
                    <span style={{ backgroundColor: '#1f1f1f', color: '#777', fontSize: '12px', padding: '3px 8px', borderRadius: '4px', fontFamily: 'Monaco, Menlo, monospace' }}>string</span>
                    <span style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#f87171', fontSize: '12px', padding: '3px 8px', borderRadius: '4px', fontWeight: '500' }}>required</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <input
                      type="text"
                      value={playgroundId}
                      onChange={(e) => setPlaygroundId(e.target.value)}
                      className="pg-input"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        backgroundColor: '#111',
                        border: '1px solid #2a2a2a',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none',
                        fontFamily: 'Monaco, Menlo, monospace',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                {/* method field */}
                <div className="pg-field-row" style={{ display: 'flex', alignItems: 'center', marginBottom: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '220px' }}>
                    <span style={{ fontWeight: '600', fontSize: '14px', color: '#fff', fontFamily: 'Monaco, Menlo, monospace' }}>method</span>
                    <span style={{ backgroundColor: '#1f1f1f', color: '#777', fontSize: '12px', padding: '3px 8px', borderRadius: '4px', fontFamily: 'Monaco, Menlo, monospace' }}>enum{'<string>'}</span>
                    <span style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#f87171', fontSize: '12px', padding: '3px 8px', borderRadius: '4px', fontWeight: '500' }}>required</span>
                  </div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <button
                        onClick={() => setMethodDropdownOpen(!methodDropdownOpen)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          padding: '12px 14px',
                          backgroundColor: '#111',
                          border: '1px solid #2a2a2a',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '14px',
                          cursor: 'pointer',
                          fontFamily: 'Monaco, Menlo, monospace',
                        }}
                      >
                        {currentEndpointConfig.method}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                          <path d="M6 9l6 6 6-6"/>
                        </svg>
                      </button>
                      {methodDropdownOpen && (
                        <div style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          marginTop: '4px',
                          backgroundColor: '#141414',
                          border: '1px solid #2a2a2a',
                          borderRadius: '8px',
                          zIndex: 100,
                          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                          overflow: 'hidden',
                        }}>
                          <button
                            className="pg-dropdown-item"
                            onClick={() => setMethodDropdownOpen(false)}
                            style={{
                              display: 'block',
                              width: '100%',
                              padding: '12px 14px',
                              background: '#2563eb',
                              border: 'none',
                              color: '#fff',
                              fontSize: '14px',
                              cursor: 'pointer',
                              textAlign: 'left',
                              fontFamily: 'Monaco, Menlo, monospace',
                            }}
                          >
                            {currentEndpointConfig.method}
                          </button>
                        </div>
                      )}
                    </div>
                    <button className="pg-trash" style={{ padding: '8px', backgroundColor: 'transparent', border: 'none', color: '#555', cursor: 'pointer', opacity: 0, transition: 'opacity 0.15s' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* params field */}
                <div style={{ marginBottom: '18px' }}>
                  <button
                    onClick={() => setParamsExpanded(!paramsExpanded)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '0',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontWeight: '600', fontSize: '14px', color: '#fff', fontFamily: 'Monaco, Menlo, monospace' }}>params</span>
                    <span style={{ backgroundColor: '#1f1f1f', color: '#777', fontSize: '12px', padding: '3px 8px', borderRadius: '4px', fontFamily: 'Monaco, Menlo, monospace' }}>object</span>
                    <span style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#f87171', fontSize: '12px', padding: '3px 8px', borderRadius: '4px', fontWeight: '500' }}>required</span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#666"
                      strokeWidth="2"
                      style={{ marginLeft: 'auto', transform: paramsExpanded ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.15s' }}
                    >
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </button>

                  {paramsExpanded && (
                    <div style={{ marginTop: '16px', marginLeft: '16px', paddingLeft: '16px', borderLeft: '2px solid #222' }}>
                      {currentEndpointConfig.params.map((param) => (
                        <div key={param.key} style={{ marginBottom: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <span style={{ fontWeight: '600', fontSize: '13px', color: '#fff', fontFamily: 'Monaco, Menlo, monospace' }}>{param.key}</span>
                            <span style={{ backgroundColor: '#1f1f1f', color: '#777', fontSize: '11px', padding: '2px 6px', borderRadius: '4px', fontFamily: 'Monaco, Menlo, monospace' }}>{param.type}</span>
                            {param.required && (
                              <span style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#f87171', fontSize: '11px', padding: '2px 6px', borderRadius: '4px', fontWeight: '500' }}>required</span>
                            )}
                          </div>
                          <input
                            type="text"
                            value={playgroundParams[param.key] || ''}
                            onChange={(e) => setPlaygroundParams({ ...playgroundParams, [param.key]: e.target.value })}
                            className="pg-input"
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              backgroundColor: '#111',
                              border: '1px solid #2a2a2a',
                              borderRadius: '8px',
                              color: '#fff',
                              fontSize: '13px',
                              outline: 'none',
                              fontFamily: 'Monaco, Menlo, monospace',
                              boxSizing: 'border-box',
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Response and Code */}
          <div
            className="pg-right-panel"
            style={{
              width: '55%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              backgroundColor: '#0a0a0a',
            }}
          >
            {/* Response Section */}
            <div style={{
              flex: 1,
              padding: '20px',
              overflowY: 'auto',
              borderBottom: '1px solid #1a1a1a',
            }}>
              <pre style={{
                margin: 0,
                padding: '20px',
                backgroundColor: '#0f0f0f',
                borderRadius: '8px',
                fontSize: '13px',
                fontFamily: 'Monaco, Menlo, Consolas, monospace',
                lineHeight: '1.7',
                overflow: 'auto',
              }}>
                <code>
                  <span style={{ color: '#888' }}>{'{'}</span>{'\n'}
                  {'  '}<span style={{ color: '#79c0ff' }}>"jsonrpc"</span><span style={{ color: '#888' }}>:</span> <span style={{ color: '#a5d6ff' }}>"2.0"</span><span style={{ color: '#888' }}>,</span>{'\n'}
                  {'  '}<span style={{ color: '#79c0ff' }}>"id"</span><span style={{ color: '#888' }}>:</span> <span style={{ color: '#a5d6ff' }}>"1"</span><span style={{ color: '#888' }}>,</span>{'\n'}
                  {'  '}<span style={{ color: '#79c0ff' }}>"error"</span><span style={{ color: '#888' }}>:</span> <span style={{ color: '#888' }}>{'{'}</span>{'\n'}
                  {'    '}<span style={{ color: '#79c0ff' }}>"code"</span><span style={{ color: '#888' }}>:</span> <span style={{ color: '#fff' }}>0</span><span style={{ color: '#888' }}>,</span>{'\n'}
                  {'    '}<span style={{ color: '#79c0ff' }}>"message"</span><span style={{ color: '#888' }}>:</span> <span style={{ color: '#ffa657' }}>"jwt must be provided"</span>{'\n'}
                  {'  '}<span style={{ color: '#888' }}>{'}'}</span>{'\n'}
                  <span style={{ color: '#888' }}>{'}'}</span>
                </code>
              </pre>
            </div>

            {/* cURL Section */}
            <div
              className="pg-right-panel"
              style={{
                flex: 1,
                padding: '20px',
                overflowY: 'auto',
              }}
            >
              <pre style={{
                margin: 0,
                fontSize: '13px',
                fontFamily: 'Monaco, Menlo, Consolas, monospace',
                lineHeight: '1.7',
                overflow: 'auto',
                color: '#888',
              }}>
                <code>
                  {'  '}--header <span style={{ color: '#a5d6ff' }}>'Authorization: Bearer {'<token>'}'</span> \{'\n'}
                  {'  '}--header <span style={{ color: '#a5d6ff' }}>'Content-Type: application/json'</span> \{'\n'}
                  {'  '}--data <span style={{ color: '#a5d6ff' }}>'</span>{'\n'}
                  <span style={{ color: '#888' }}>{'{'}</span>{'\n'}
                  {'  '}<span style={{ color: '#79c0ff' }}>"jsonrpc"</span><span style={{ color: '#888' }}>:</span> <span style={{ color: '#a5d6ff' }}>"2.0"</span><span style={{ color: '#888' }}>,</span>{'\n'}
                  {'  '}<span style={{ color: '#79c0ff' }}>"id"</span><span style={{ color: '#888' }}>:</span> <span style={{ color: '#a5d6ff' }}>"1"</span><span style={{ color: '#888' }}>,</span>{'\n'}
                  {'  '}<span style={{ color: '#79c0ff' }}>"method"</span><span style={{ color: '#888' }}>:</span> <span style={{ color: '#a5d6ff' }}>"{currentEndpointConfig.method}"</span><span style={{ color: '#888' }}>,</span>{'\n'}
                  {'  '}<span style={{ color: '#79c0ff' }}>"params"</span><span style={{ color: '#888' }}>:</span> <span style={{ color: '#888' }}>{'{'}</span>{'\n'}
                  {currentEndpointConfig.params.map((param, i) => (
                    <span key={param.key}>
                      {'    '}<span style={{ color: '#79c0ff' }}>"{param.key}"</span><span style={{ color: '#888' }}>:</span> <span style={{ color: '#a5d6ff' }}>"{playgroundParams[param.key] || param.default}"</span>{i < currentEndpointConfig.params.length - 1 ? <span style={{ color: '#888' }}>,</span> : ''}{'\n'}
                    </span>
                  ))}
                  {'  '}<span style={{ color: '#888' }}>{'}'}</span>{'\n'}
                  <span style={{ color: '#888' }}>{'}'}</span>{'\n'}
                  <span style={{ color: '#a5d6ff' }}>'</span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaygroundView;
