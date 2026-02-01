import { useState } from 'react';

// Icon Components
const ChevronDown = ({ className, isOpen, style }) => (
  <svg
    className={className}
    style={{
      transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
      transition: 'transform 0.2s ease',
      ...style
    }}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const CopyIcon = ({ className }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const DownloadIcon = ({ className }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const CheckIcon = ({ className, style }) => (
  <svg className={className} style={style} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const PlayIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

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
  const [selectedLanguage, setSelectedLanguage] = useState('cURL');
  const [authExpanded, setAuthExpanded] = useState(true);
  const [bodyExpanded, setBodyExpanded] = useState(true);
  const [paramsExpanded, setParamsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);
  const [responseCopied, setResponseCopied] = useState(false);
  const [responseViewType, setResponseViewType] = useState('Body');
  const [responseHeaders, setResponseHeaders] = useState(null);
  const [responseViewDropdownOpen, setResponseViewDropdownOpen] = useState(false);
  const [addingPropertyTo, setAddingPropertyTo] = useState(null);
  const [newPropertyKey, setNewPropertyKey] = useState('');
  const [customProperties, setCustomProperties] = useState({});

  const languages = ['cURL', 'Python', 'JavaScript', 'PHP', 'Go', 'Java', 'Ruby'];

  // Handle adding new custom property
  const handleAddProperty = (path) => {
    if (newPropertyKey.trim()) {
      setCustomProperties(prev => ({
        ...prev,
        [path]: [...(prev[path] || []), { key: newPropertyKey.trim(), value: '' }]
      }));
      setNewPropertyKey('');
      setAddingPropertyTo(null);
    }
  };

  // Handle clearing a field value - set to empty string to show "select" placeholder
  const handleClearField = (paramKey) => {
    setPlaygroundParams(prev => ({
      ...prev,
      [paramKey]: ''
    }));
  };

  const generateCodeSnippet = () => {
    const baseUrl = 'https://share-ddn.formless.xyz';
    const path = currentEndpointConfig?.path || '/v1';
    const method = currentEndpointConfig?.method || '';
    const token = playgroundBearerToken || '<token>';

    const paramsObj = {};
    if (currentEndpointConfig?.params) {
      currentEndpointConfig.params.forEach(param => {
        paramsObj[param.key] = playgroundParams[param.key] || param.default || '';
      });
    }

    const fullUrl = `${baseUrl}${path}`;

    switch (selectedLanguage) {
      case 'cURL':
        return `curl --request POST \\
  --url '${fullUrl}' \\
  --header 'Authorization: Bearer ${token}' \\
  --header 'Content-Type: application/json' \\
  --data '
{
  "jsonrpc": "${playgroundJsonrpc}",
  "id": "${playgroundId}",
  "method": "${method}",
  "params": ${JSON.stringify(paramsObj, null, 4).split('\n').join('\n  ')}
}
'`;
      case 'Python':
        return `import requests

url = "${fullUrl}"
headers = {
    "Authorization": "Bearer ${token}",
    "Content-Type": "application/json"
}
payload = {
    "jsonrpc": "${playgroundJsonrpc}",
    "id": "${playgroundId}",
    "method": "${method}",
    "params": ${JSON.stringify(paramsObj, null, 8).split('\n').join('\n    ')}
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`;
      case 'JavaScript':
        return `const response = await fetch("${fullUrl}", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ${token}",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    jsonrpc: "${playgroundJsonrpc}",
    id: "${playgroundId}",
    method: "${method}",
    params: ${JSON.stringify(paramsObj, null, 6).split('\n').join('\n    ')}
  })
});

const data = await response.json();
console.log(data);`;
      case 'PHP':
        return `<?php
$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "${fullUrl}",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_POST => true,
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer ${token}",
    "Content-Type: application/json"
  ],
  CURLOPT_POSTFIELDS => json_encode([
    "jsonrpc" => "${playgroundJsonrpc}",
    "id" => "${playgroundId}",
    "method" => "${method}",
    "params" => ${JSON.stringify(paramsObj, null, 4).split('\n').join('\n    ')}
  ])
]);

$response = curl_exec($curl);
curl_close($curl);
echo $response;`;
      case 'Go':
        return `package main

import (
  "bytes"
  "encoding/json"
  "net/http"
)

func main() {
  payload := map[string]interface{}{
    "jsonrpc": "${playgroundJsonrpc}",
    "id": "${playgroundId}",
    "method": "${method}",
    "params": map[string]interface{}{
${Object.entries(paramsObj).map(([k, v]) => `      "${k}": "${v}",`).join('\n')}
    },
  }

  body, _ := json.Marshal(payload)
  req, _ := http.NewRequest("POST", "${fullUrl}", bytes.NewBuffer(body))
  req.Header.Set("Authorization", "Bearer ${token}")
  req.Header.Set("Content-Type", "application/json")

  client := &http.Client{}
  resp, _ := client.Do(req)
  defer resp.Body.Close()
}`;
      case 'Java':
        return `import java.net.http.*;
import java.net.URI;

HttpClient client = HttpClient.newHttpClient();

String payload = """
{
  "jsonrpc": "${playgroundJsonrpc}",
  "id": "${playgroundId}",
  "method": "${method}",
  "params": ${JSON.stringify(paramsObj, null, 4).split('\n').join('\n  ')}
}
""";

HttpRequest request = HttpRequest.newBuilder()
  .uri(URI.create("${fullUrl}"))
  .header("Authorization", "Bearer ${token}")
  .header("Content-Type", "application/json")
  .POST(HttpRequest.BodyPublishers.ofString(payload))
  .build();

HttpResponse<String> response = client.send(request,
  HttpResponse.BodyHandlers.ofString());`;
      case 'Ruby':
        return `require 'net/http'
require 'json'
require 'uri'

uri = URI("${fullUrl}")
http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = true

request = Net::HTTP::Post.new(uri)
request["Authorization"] = "Bearer ${token}"
request["Content-Type"] = "application/json"
request.body = {
  jsonrpc: "${playgroundJsonrpc}",
  id: "${playgroundId}",
  method: "${method}",
  params: ${JSON.stringify(paramsObj, null, 4).split('\n').join('\n  ')}
}.to_json

response = http.request(request)
puts response.body`;
      default:
        return '';
    }
  };

  const copyToClipboard = async (text, isResponse = false) => {
    try {
      await navigator.clipboard.writeText(text);
      if (isResponse) {
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

  const syntaxHighlight = (code) => {
    return code
      .replace(/(["'])((?:(?!\1)[^\\]|\\.)*)(\1)/g, '<span style="color: #a5d6ff">$1$2$3</span>')
      .replace(/\b(curl|import|from|def|const|let|var|function|return|await|async|new|class|public|private|package|main|func|require|puts|echo)\b/g, '<span style="color: #ff7b72">$1</span>')
      .replace(/(--\w+)/g, '<span style="color: #79c0ff">$1</span>')
      .replace(/(\{|\}|\[|\])/g, '<span style="color: #8b949e">$1</span>');
  };

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

  const getDefaultResponse = () => {
    // Get default 200 response schema based on endpoint
    if (currentEndpointConfig?.method === 'identity_get_by_email_address') {
      return {
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
    }
    return {
      jsonrpc: "2.0",
      id: "<string>",
      result: {
        success: true
      }
    };
  };

  const getEndpointHeaders = () => {
    const method = currentEndpointConfig?.method;

    if (method === 'contracts_create') {
      return [
        { key: 'x-powered-by', value: 'Express' },
        { key: 'set-cookie', value: 'share_ephemeral_identity=Fe26.2*1*2d06a5cc7d7102ad04e86db8539e53c4a92ea630db0b41bc567079b2b47d23c8*qU8jSG9N3QWM_5oa9IHO_A*FNtz8b1uWsqJF6VARWE23CiP27fumM958euA1h0t8iImR-yA4O6uBk728t13dh8qOuElEKGoBYnhM_wIepvMHg*3917392895270*ed53e8ca16a7edd590e816b3819c80b4c3e01576428b334e63cc89907264cb7a*My5P3fxHAnl__EzpOgDqwCQYwQYDDNdGu1nX346C2Hw~2; Max-Age=2147483587; Path=/; HttpOnly; Secure; SameSite=None' },
        { key: 'content-type', value: 'application/json; charset=utf-8' },
        { key: 'etag', value: 'W/"69-Zo5esXZNyXWOIIn/tI+qID6NVHc"' },
        { key: 'x-cloud-trace-context', value: '01a3b2ed59189dd3f1100fcd4a5b242e;o=1' },
        { key: 'date', value: 'Sun, 01 Feb 2026 01:27:28 GMT' },
        { key: 'server', value: 'Google Frontend' },
        { key: 'content-length', value: '105' },
        { key: 'via', value: '1.1 google' },
        { key: 'alt-svc', value: 'h3=":443"; ma=2592000,h3-29=":443"; ma=2592000' },
        { key: 'connection', value: 'close' },
      ];
    }

    if (method === 'splits_fetch_data') {
      return [
        { key: 'x-powered-by', value: 'Express' },
        { key: 'set-cookie', value: 'share_ephemeral_identity=Fe26.2*1*e88a5b21b7a0d96b3e89ee438e08c30c02b68da91d2bd88058e4bf86a4e3b7bd*9AepPu8pOEWsxyA8ZjgrWg*pByP-ueetQ-bscGoPSd8__nQGPTpqlhd_mKPsypLz74vLB_NbX4PBQEqac3SLvzOtwsSf0mR9wGokAD7RPrTSQ*3917392960683*f5798b1a74b4e00a2f862d41cb902036aa3898ba811e04df3011a032e84fdcae*Bxz2LW5TN_Nb0g4eo8mOJu1BncbXGFK6iC4jDWasaRw~2; Max-Age=2147483587; Path=/; HttpOnly; Secure; SameSite=None' },
        { key: 'content-type', value: 'application/json; charset=utf-8' },
        { key: 'etag', value: 'W/"4e-YHOKiuvx4uQFxAOpJhvIvsJHezk"' },
        { key: 'x-cloud-trace-context', value: '2887a23a82cea0be1cfb300d98ea2495;o=1' },
        { key: 'date', value: 'Sun, 01 Feb 2026 01:28:33 GMT' },
        { key: 'server', value: 'Google Frontend' },
        { key: 'content-length', value: '78' },
        { key: 'via', value: '1.1 google' },
        { key: 'alt-svc', value: 'h3=":443"; ma=2592000,h3-29=":443"; ma=2592000' },
        { key: 'connection', value: 'close' },
      ];
    }

    if (method === 'payouts') {
      return [
        { key: 'x-powered-by', value: 'Express' },
        { key: 'set-cookie', value: 'share_ephemeral_identity=Fe26.2*1*eaf13454a5f5a298b793e51cc3f9225bc97dff911c5ec778a2568378e96d2c2e*yD1WQd4svTr5reBc1RLZSQ*V5ss0Mys5EnGPVSOP0u6Fo_6hFEBXtFRhS1M9fH_wbADGsW-uLXm8YHm-s-bboBg2Ck3HctukWgj45363LkwaQ*3917393018570*c73ccdd5048bd01c3917c2911e49d4f84ce2df8557d4e5d6984947d876dfd0d4*QZ_KQ_qCz4mGDy4Vs5XKQ1fQO_h7qXvI3bOdBQaQd4Q~2; Max-Age=2147483587; Path=/; HttpOnly; Secure; SameSite=None' },
        { key: 'content-type', value: 'application/json; charset=utf-8' },
        { key: 'etag', value: 'W/"7b-7ZldQTbD/ryH+nNtz2lbRd4EoNk"' },
        { key: 'x-cloud-trace-context', value: 'ec3c704c2eaa204061add5f068851ffc;o=1' },
        { key: 'date', value: 'Sun, 01 Feb 2026 01:29:31 GMT' },
        { key: 'server', value: 'Google Frontend' },
        { key: 'content-length', value: '123' },
        { key: 'via', value: '1.1 google' },
        { key: 'alt-svc', value: 'h3=":443"; ma=2592000,h3-29=":443"; ma=2592000' },
        { key: 'connection', value: 'close' },
      ];
    }

    if (method === 'payouts_query_batch') {
      return [
        { key: 'x-powered-by', value: 'Express' },
        { key: 'set-cookie', value: 'share_ephemeral_identity=Fe26.2*1*612313fcc7b5b1e6953f6cb080fb62ad20bd4329bd4576666698d99c5486957d*Fni1naaPI1KkosDgBGHvUA*l9_6mNf7lIalSuaCcKj7updZVo4HdERSocmqoJxkJAy-3ciU6--CMixLUBGylFh6KkV0DAiZvea3tbY_bXjq4Q*3917393046892*505c7027d2854e61a72d7bda44723e3f3959f558b54135a3aa16f6851c383e6e*UUnUY2XLD3tkOzce6HOgPGs1aq75-_Fp6GAxhAvc5Cs~2; Max-Age=2147483587; Path=/; HttpOnly; Secure; SameSite=None' },
        { key: 'content-type', value: 'application/json; charset=utf-8' },
        { key: 'etag', value: 'W/"120-WoxsmOVCwZF4k4uG9OkqmkMUcxs"' },
        { key: 'x-cloud-trace-context', value: 'aed8c001ac9942d3d86ce815a4102b6e;o=1' },
        { key: 'date', value: 'Sun, 01 Feb 2026 01:29:59 GMT' },
        { key: 'server', value: 'Google Frontend' },
        { key: 'content-length', value: '288' },
        { key: 'via', value: '1.1 google' },
        { key: 'alt-svc', value: 'h3=":443"; ma=2592000,h3-29=":443"; ma=2592000' },
        { key: 'connection', value: 'close' },
      ];
    }

    // Default headers for identity_get_by_email_address
    return [
      { key: 'x-powered-by', value: 'Express' },
      { key: 'set-cookie', value: 'share_ephemeral_identity=Fe26.2*1*63be8225043bdb93c62f910f40bfbf3edf9c0ec98e9cbaaff0915b5c765a616c*3cC7v7Hus3Zib0AK8d15UQ*ZctAdDoaWTXXrgm-NzjbPQyLoZ-NqNUJUchvdvVUX-WD0RgIRyDsKd_O26hvwfO5v5sf4CMzMpgiRi6XqDJaXg*3917391897120*0dd55271bb70f56a04846877d92c89200ee0a44079a0571978550cfb8fbcc01e*T-mNxYwvTsqzsDW7C-dfA5bOH0b5IqIO1TzxpHKJ1cs~2; Max-Age=2147483587; Path=/; HttpOnly; Secure; SameSite=None' },
      { key: 'content-type', value: 'application/json; charset=utf-8' },
      { key: 'etag', value: 'W/"4e-YHOKiuvx4uQFxAOpJhvIvsJHezk"' },
      { key: 'x-cloud-trace-context', value: '406fb685f773d39f627c672205614e86;o=1' },
      { key: 'date', value: new Date().toUTCString() },
      { key: 'server', value: 'Google Frontend' },
      { key: 'content-length', value: '78' },
      { key: 'via', value: '1.1 google' },
      { key: 'alt-svc', value: 'h3=":443"; ma=2592000,h3-29=":443"; ma=2592000' },
      { key: 'connection', value: 'close' },
    ];
  };

  // State to track expanded nested objects
  const [expandedObjects, setExpandedObjects] = useState({});

  const toggleObjectExpanded = (path) => {
    setExpandedObjects(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  // Recursive function to render params with nested children
  const renderParam = (param, parentPath = 'params', depth = 0) => {
    const fullPath = `${parentPath}.${param.key}`;
    const isExpanded = expandedObjects[fullPath] !== false; // Default to expanded

    if (param.type === 'object' && param.children) {
      return (
        <div key={fullPath} style={{ marginBottom: '16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: '#161b22',
              borderRadius: '8px',
              border: '1px solid #21262d',
              cursor: 'pointer',
              marginBottom: isExpanded ? '12px' : '0',
            }}
            onClick={() => toggleObjectExpanded(fullPath)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#8b949e' }}>{parentPath}.</span>
              <span style={{ fontWeight: 500, color: '#e6edf3' }}>{param.key}</span>
              <span className="playground-badge playground-badge-type">object</span>
              {param.required && (
                <span className="playground-badge playground-badge-required">required</span>
              )}
            </div>
            <ChevronDown isOpen={isExpanded} style={{ color: '#8b949e' }} />
          </div>
          {isExpanded && (
            <div style={{ paddingLeft: '20px', borderLeft: '2px solid #21262d' }}>
              {param.children.map((child, idx) => renderParam(child, fullPath, depth + 1))}
              {/* Custom properties added by user */}
              {customProperties[fullPath]?.map((prop, idx) => (
                <div key={`custom-${idx}`} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ color: '#8b949e' }}>{fullPath}.</span>
                    <span style={{ fontWeight: 500, color: '#e6edf3' }}>{prop.key}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span className="playground-badge playground-badge-type">string</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      className="playground-input-field playground-input"
                      value={prop.value}
                      onChange={(e) => {
                        setCustomProperties(prev => ({
                          ...prev,
                          [fullPath]: prev[fullPath].map((p, i) => i === idx ? { ...p, value: e.target.value } : p)
                        }));
                      }}
                      placeholder=""
                      style={{ flex: 1 }}
                    />
                    <button
                      className="playground-icon-button"
                      onClick={() => {
                        setCustomProperties(prev => ({
                          ...prev,
                          [fullPath]: prev[fullPath].filter((_, i) => i !== idx)
                        }));
                      }}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              ))}
              {/* Add new property input or button */}
              {addingPropertyTo === fullPath ? (
                <div style={{ marginTop: '8px' }}>
                  <input
                    type="text"
                    className="playground-input-field playground-input"
                    value={newPropertyKey}
                    onChange={(e) => setNewPropertyKey(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddProperty(fullPath);
                      if (e.key === 'Escape') { setAddingPropertyTo(null); setNewPropertyKey(''); }
                    }}
                    onBlur={() => { if (!newPropertyKey.trim()) { setAddingPropertyTo(null); setNewPropertyKey(''); }}}
                    placeholder="Enter key of new property"
                    autoFocus
                    style={{ width: '100%' }}
                  />
                </div>
              ) : (
                <button
                  onClick={() => setAddingPropertyTo(fullPath)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    background: 'transparent',
                    border: '1px dashed #30363d',
                    borderRadius: '6px',
                    color: '#8b949e',
                    fontSize: '13px',
                    cursor: 'pointer',
                    marginTop: '8px',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#58a6ff';
                    e.currentTarget.style.color = '#58a6ff';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#30363d';
                    e.currentTarget.style.color = '#8b949e';
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span>Add new property</span>
                </button>
              )}
            </div>
          )}
        </div>
      );
    }

    if (param.type === 'object') {
      return (
        <div key={fullPath} style={{ marginBottom: '16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: '#161b22',
              borderRadius: '8px',
              border: '1px solid #21262d',
              cursor: 'pointer',
            }}
            onClick={() => toggleObjectExpanded(fullPath)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#8b949e' }}>{parentPath}.</span>
              <span style={{ fontWeight: 500, color: '#e6edf3' }}>{param.key}</span>
              <span className="playground-badge playground-badge-type">object</span>
              {param.required && (
                <span className="playground-badge playground-badge-required">required</span>
              )}
            </div>
            <ChevronDown isOpen={expandedObjects[fullPath]} style={{ color: '#8b949e' }} />
          </div>
        </div>
      );
    }

    return (
      <div key={fullPath} style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ color: '#8b949e' }}>{parentPath}.</span>
          <span style={{ fontWeight: 500, color: '#e6edf3' }}>{param.key}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span className="playground-badge playground-badge-type">{param.type || 'string'}</span>
          {param.required && (
            <span className="playground-badge playground-badge-required">required</span>
          )}
        </div>
        {(param.type === 'enum<string>' || param.type === 'enum<integer>') && param.options ? (
          <div style={{ display: 'flex', gap: '8px' }}>
            <select
              className="playground-input-field playground-select-field"
              value={playgroundParams[param.key] !== undefined ? playgroundParams[param.key] : (param.default || '')}
              onChange={(e) => setPlaygroundParams({ ...playgroundParams, [param.key]: e.target.value })}
              style={{ flex: 1 }}
            >
              <option value="">select {param.key}</option>
              {param.options.map((opt, optIdx) => (
                <option key={optIdx} value={opt}>{opt}</option>
              ))}
            </select>
            <button className="playground-icon-button" onClick={() => handleClearField(param.key)}>
              <TrashIcon />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type={param.type === 'string<email>' ? 'email' : 'text'}
              className="playground-input-field playground-input"
              value={playgroundParams[param.key] !== undefined ? playgroundParams[param.key] : ''}
              onChange={(e) => setPlaygroundParams({ ...playgroundParams, [param.key]: e.target.value })}
              placeholder={param.placeholder || param.default || ''}
              style={{ flex: 1 }}
            />
            <button className="playground-icon-button" onClick={() => handleClearField(param.key)}>
              <TrashIcon />
            </button>
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

        .playground-container * { box-sizing: border-box; }

        .playground-container::-webkit-scrollbar,
        .playground-container *::-webkit-scrollbar {
          width: 14px;
          height: 14px;
        }
        .playground-container::-webkit-scrollbar-track,
        .playground-container *::-webkit-scrollbar-track {
          background: #0d1117;
        }
        .playground-container::-webkit-scrollbar-thumb,
        .playground-container *::-webkit-scrollbar-thumb {
          background: #484f58;
          border-radius: 7px;
          border: 3px solid #0d1117;
        }
        .playground-container::-webkit-scrollbar-thumb:hover,
        .playground-container *::-webkit-scrollbar-thumb:hover {
          background: #6e7681;
        }

        .playground-input::placeholder {
          color: #484f58;
        }

        .playground-badge {
          display: inline-flex;
          align-items: center;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;
        }

        .playground-badge-post {
          background: linear-gradient(135deg, #2f81f7 0%, #58a6ff 100%);
          color: #fff;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .playground-badge-required {
          background: rgba(248, 81, 73, 0.15);
          color: #f85149;
          border: 1px solid rgba(248, 81, 73, 0.4);
        }

        .playground-badge-type {
          background: rgba(139, 148, 158, 0.15);
          color: #8b949e;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          font-weight: 400;
        }

        .playground-section-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          cursor: pointer;
          user-select: none;
          border-bottom: 1px solid #21262d;
          transition: background 0.15s ease;
        }

        .playground-section-header:hover {
          background: rgba(56, 139, 253, 0.04);
        }

        .playground-input-field {
          width: 100%;
          background: #0d1117;
          border: 1px solid #30363d;
          border-radius: 6px;
          padding: 10px 12px;
          color: #e6edf3;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          outline: none;
        }

        .playground-input-field:focus {
          border-color: #58a6ff;
          box-shadow: 0 0 0 3px rgba(56, 139, 253, 0.15);
        }

        .playground-select-field {
          appearance: none;
          background: #0d1117 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238b949e' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 12px center;
          cursor: pointer;
        }

        .playground-send-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: linear-gradient(135deg, #2f81f7 0%, #58a6ff 100%);
          border: none;
          border-radius: 6px;
          color: #fff;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }

        .playground-send-button:hover {
          background: linear-gradient(135deg, #58a6ff 0%, #79c0ff 100%);
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(47, 129, 247, 0.4);
        }

        .playground-send-button:active {
          transform: translateY(0);
        }

        .playground-send-button:disabled {
          opacity: 0.7;
          cursor: wait;
        }

        .playground-code-block {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          line-height: 1.6;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .playground-language-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          background: transparent;
          border: 1px solid #30363d;
          border-radius: 6px;
          color: #8b949e;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .playground-language-button:hover {
          border-color: #484f58;
          color: #e6edf3;
        }

        .playground-language-menu {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 4px;
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
          overflow: hidden;
          z-index: 100;
          min-width: 140px;
        }

        .playground-language-option {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          cursor: pointer;
          transition: background 0.1s ease;
          font-size: 13px;
          color: #e6edf3;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
        }

        .playground-language-option:hover {
          background: rgba(56, 139, 253, 0.1);
        }

        .playground-language-option.selected {
          background: rgba(56, 139, 253, 0.15);
          color: #58a6ff;
        }

        .playground-icon-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: transparent;
          border: 1px solid #30363d;
          border-radius: 6px;
          color: #8b949e;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .playground-icon-button:hover {
          border-color: #484f58;
          color: #e6edf3;
          background: rgba(56, 139, 253, 0.04);
        }

        .playground-response-status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          background: rgba(46, 160, 67, 0.1);
          border: 1px solid rgba(46, 160, 67, 0.3);
          border-radius: 6px;
          color: #3fb950;
          font-weight: 500;
          font-size: 13px;
        }

        .playground-response-status-icon {
          width: 16px;
          height: 16px;
          background: #3fb950;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .playground-header-value {
          max-width: 350px;
          overflow-x: auto;
          white-space: nowrap;
          scrollbar-width: thin;
          scrollbar-color: #484f58 transparent;
          display: block;
        }

        .playground-header-value::-webkit-scrollbar {
          height: 8px;
        }

        .playground-header-value::-webkit-scrollbar-track {
          background: transparent;
        }

        .playground-header-value::-webkit-scrollbar-thumb {
          background: #484f58;
          border-radius: 4px;
        }

        .playground-header-value::-webkit-scrollbar-thumb:hover {
          background: #6e7681;
        }

        @keyframes playground-spin {
          to { transform: rotate(360deg); }
        }

        .playground-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: playground-spin 0.8s linear infinite;
        }

        @keyframes playground-fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .playground-fade-in {
          animation: playground-fadeIn 0.3s ease forwards;
        }

        .playground-close-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: transparent;
          border: 1px solid #30363d;
          border-radius: 6px;
          color: #8b949e;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .playground-close-button:hover {
          border-color: #f85149;
          color: #f85149;
          background: rgba(248, 81, 73, 0.1);
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
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          zIndex: 1000,
        }}
      />

      {/* Modal */}
      <div
        className="playground-container"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '95%',
          maxWidth: '1200px',
          height: '90vh',
          backgroundColor: '#010409',
          borderRadius: '12px',
          border: '1px solid #21262d',
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif",
          fontSize: '14px',
          color: '#e6edf3',
        }}
      >
        {/* Header Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 24px',
          borderBottom: '1px solid #21262d',
          background: 'linear-gradient(180deg, #0d1117 0%, #010409 100%)',
        }}>
          {/* Left side - Endpoint selector */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setEndpointDropdownOpen(!endpointDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                background: '#21262d',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              <span className="playground-badge playground-badge-post">POST</span>
              <span style={{ color: '#8b949e', fontWeight: 500 }}>
                {currentEndpointConfig?.name || 'Select Endpoint'}
              </span>
              <ChevronDown isOpen={endpointDropdownOpen} style={{ color: '#8b949e' }} />
            </button>

            {endpointDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '4px',
                  background: '#161b22',
                  border: '1px solid #30363d',
                  borderRadius: '8px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                  overflow: 'hidden',
                  zIndex: 100,
                  minWidth: '280px',
                }}
                className="playground-fade-in"
              >
                {Array.isArray(playgroundEndpoints) && playgroundEndpoints.map((endpoint, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      handlePlaygroundEndpointChange(endpoint.method);
                      setEndpointDropdownOpen(false);
                    }}
                    className={`playground-language-option ${playgroundEndpoint === endpoint.method ? 'selected' : ''}`}
                  >
                    <span className="playground-badge playground-badge-post" style={{ fontSize: '10px', padding: '1px 5px' }}>POST</span>
                    <span>{endpoint.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Center - URL display */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, maxWidth: '600px', margin: '0 24px' }}>
            <span className="playground-badge playground-badge-post">POST</span>
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: '#e6edf3',
              fontSize: '13px',
              background: '#21262d',
              padding: '8px 16px',
              borderRadius: '6px',
              flex: 1,
            }}>
              /v1#{currentEndpointConfig?.method || ''}
            </span>
          </div>

          {/* Right side - Send button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              className="playground-send-button"
              onClick={handlePlaygroundSend}
              disabled={playgroundLoading}
            >
              {playgroundLoading ? (
                <div className="playground-spinner" />
              ) : (
                <>
                  <span>Send</span>
                  <PlayIcon />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Left Panel - Request Builder */}
          <div style={{
            width: '45%',
            borderRight: '1px solid #21262d',
            overflow: 'auto',
          }}>
            <div style={{ padding: '24px' }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 600,
                marginBottom: '8px',
                color: '#e6edf3',
                margin: '0 0 8px 0',
              }}>
                {currentEndpointConfig?.name || 'API Endpoint'}
              </h2>
              <p style={{ color: '#8b949e', marginBottom: '24px', margin: '0', lineHeight: 1.5 }}>
                {currentEndpointConfig?.description || 'Make an API request to this endpoint.'}
              </p>
            </div>

            {/* Authorization Section */}
            <div style={{ borderTop: '1px solid #21262d' }}>
              <div
                className="playground-section-header"
                onClick={() => setAuthExpanded(!authExpanded)}
              >
                <ChevronDown isOpen={authExpanded} style={{ color: '#8b949e' }} />
                <span style={{ fontWeight: 500 }}>Authorization</span>
              </div>

              {authExpanded && (
                <div style={{ padding: '20px 24px' }} className="playground-fade-in">
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 500, color: '#e6edf3' }}>Authorization</span>
                      <span className="playground-badge playground-badge-type">string&lt;bearer&gt;</span>
                    </div>
                    <span className="playground-badge playground-badge-required" style={{ marginBottom: '12px', display: 'inline-block' }}>required</span>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: '#0d1117',
                      border: '1px solid #30363d',
                      borderRadius: '6px',
                      marginTop: '8px',
                      overflow: 'hidden',
                    }}>
                      <span style={{
                        padding: '10px 12px',
                        color: '#8b949e',
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: '13px',
                        borderRight: '1px solid #30363d',
                        background: '#161b22',
                      }}>Bearer</span>
                      <input
                        type="text"
                        className="playground-input-field playground-input"
                        value={playgroundBearerToken}
                        onChange={(e) => setPlaygroundBearerToken(e.target.value)}
                        placeholder="enter bearer token"
                        style={{ border: 'none', borderRadius: 0 }}
                      />
                    </div>
                    <p style={{ color: '#8b949e', fontSize: '12px', marginTop: '8px', margin: '8px 0 0 0' }}>
                      JWT token with Unique ID identification
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Body Section */}
            <div style={{ borderTop: '1px solid #21262d' }}>
              <div
                className="playground-section-header"
                onClick={() => setBodyExpanded(!bodyExpanded)}
              >
                <ChevronDown isOpen={bodyExpanded} style={{ color: '#8b949e' }} />
                <span style={{ fontWeight: 500 }}>Body</span>
              </div>

              {bodyExpanded && (
                <div style={{ padding: '20px 24px' }} className="playground-fade-in">
                  {/* jsonrpc */}
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <span style={{ fontWeight: 500, color: '#e6edf3' }}>jsonrpc</span>
                      <span className="playground-badge playground-badge-type">enum&lt;string&gt;</span>
                      <span className="playground-badge playground-badge-required">required</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <select
                        className="playground-input-field playground-select-field"
                        value={playgroundJsonrpc}
                        onChange={(e) => setPlaygroundJsonrpc(e.target.value)}
                        style={{ flex: 1 }}
                      >
                        <option value="">select jsonrpc</option>
                        <option value="2.0">2.0</option>
                        <option value="1">1</option>
                      </select>
                      <button className="playground-icon-button" onClick={() => setPlaygroundJsonrpc('')}>
                        <TrashIcon />
                      </button>
                    </div>
                  </div>

                  {/* id */}
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <span style={{ fontWeight: 500, color: '#e6edf3' }}>id</span>
                      <span className="playground-badge playground-badge-type">string</span>
                      <span className="playground-badge playground-badge-required">required</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        className="playground-input-field playground-input"
                        value={playgroundId}
                        onChange={(e) => setPlaygroundId(e.target.value)}
                        placeholder="Request ID"
                        style={{ flex: 1 }}
                      />
                      <button className="playground-icon-button" onClick={() => setPlaygroundId('')}>
                        <TrashIcon />
                      </button>
                    </div>
                  </div>

                  {/* method */}
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <span style={{ fontWeight: 500, color: '#e6edf3' }}>method</span>
                      <span className="playground-badge playground-badge-type">enum&lt;string&gt;</span>
                      <span className="playground-badge playground-badge-required">required</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <select
                        className="playground-input-field playground-select-field"
                        value={currentEndpointConfig?.method || ''}
                        onChange={(e) => handlePlaygroundEndpointChange(e.target.value)}
                        style={{ flex: 1 }}
                      >
                        <option value="">select method</option>
                        <option value={currentEndpointConfig?.method}>{currentEndpointConfig?.method}</option>
                      </select>
                      <button className="playground-icon-button" onClick={() => handlePlaygroundEndpointChange('')}>
                        <TrashIcon />
                      </button>
                    </div>
                  </div>

                  {/* params */}
                  {currentEndpointConfig?.params && currentEndpointConfig.params.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '12px',
                        padding: '12px 16px',
                        background: '#161b22',
                        borderRadius: '8px',
                        border: '1px solid #21262d',
                        cursor: 'pointer',
                      }}
                      onClick={() => setParamsExpanded(!paramsExpanded)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 500, color: '#e6edf3' }}>params</span>
                          <span className="playground-badge playground-badge-type">object</span>
                          <span className="playground-badge playground-badge-required">required</span>
                        </div>
                        <ChevronDown isOpen={paramsExpanded} style={{ color: '#8b949e' }} />
                      </div>

                      {paramsExpanded && (
                        <div style={{ paddingLeft: '20px', borderLeft: '2px solid #21262d' }} className="playground-fade-in">
                          {currentEndpointConfig.params.map((param, idx) => renderParam(param, 'params', 0))}
                          {/* Custom properties added by user at params level */}
                          {customProperties['params']?.map((prop, idx) => (
                            <div key={`custom-params-${idx}`} style={{ marginBottom: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <span style={{ color: '#8b949e' }}>params.</span>
                                <span style={{ fontWeight: 500, color: '#e6edf3' }}>{prop.key}</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                <span className="playground-badge playground-badge-type">string</span>
                              </div>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                  type="text"
                                  className="playground-input-field playground-input"
                                  value={prop.value}
                                  onChange={(e) => {
                                    setCustomProperties(prev => ({
                                      ...prev,
                                      params: prev.params.map((p, i) => i === idx ? { ...p, value: e.target.value } : p)
                                    }));
                                  }}
                                  placeholder=""
                                  style={{ flex: 1 }}
                                />
                                <button
                                  className="playground-icon-button"
                                  onClick={() => {
                                    setCustomProperties(prev => ({
                                      ...prev,
                                      params: prev.params.filter((_, i) => i !== idx)
                                    }));
                                  }}
                                >
                                  <TrashIcon />
                                </button>
                              </div>
                            </div>
                          ))}
                          {/* Add new property input or button */}
                          {addingPropertyTo === 'params' ? (
                            <div style={{ marginTop: '8px' }}>
                              <input
                                type="text"
                                className="playground-input-field playground-input"
                                value={newPropertyKey}
                                onChange={(e) => setNewPropertyKey(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleAddProperty('params');
                                  if (e.key === 'Escape') { setAddingPropertyTo(null); setNewPropertyKey(''); }
                                }}
                                onBlur={() => { if (!newPropertyKey.trim()) { setAddingPropertyTo(null); setNewPropertyKey(''); }}}
                                placeholder="Enter key of new property"
                                autoFocus
                                style={{ width: '100%' }}
                              />
                            </div>
                          ) : (
                            <button
                              onClick={() => setAddingPropertyTo('params')}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 12px',
                                background: 'transparent',
                                border: '1px dashed #30363d',
                                borderRadius: '6px',
                                color: '#8b949e',
                                fontSize: '13px',
                                cursor: 'pointer',
                                marginTop: '8px',
                                transition: 'all 0.15s ease',
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.borderColor = '#58a6ff';
                                e.currentTarget.style.color = '#58a6ff';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.borderColor = '#30363d';
                                e.currentTarget.style.color = '#8b949e';
                              }}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                              </svg>
                              <span>Add new property</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Code & Response */}
          <div style={{
            width: '55%',
            overflow: 'auto',
            background: '#0d1117',
          }}>
            {/* Response Section (if exists) - shows above code */}
            {playgroundResponse && (
              <div style={{
                margin: '12px 0 12px 12px',
                border: '1px solid #30363d',
                borderRight: 'none',
                borderRadius: '8px 0 0 8px',
                overflow: 'hidden',
              }} className="playground-fade-in">
                <div style={{
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #30363d',
                  background: '#0d1117',
                }}>
                  <div className="playground-response-status">
                    <div className="playground-response-status-icon">
                      <CheckIcon style={{ width: '10px', height: '10px', color: '#0d1117' }} />
                    </div>
                    <span>200 - OK</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ position: 'relative' }}>
                      <button
                        className="playground-language-button"
                        onClick={() => setResponseViewDropdownOpen(!responseViewDropdownOpen)}
                        style={{ background: '#21262d', border: '1px solid #30363d' }}
                      >
                        <span>{responseViewType}</span>
                        <ChevronDown isOpen={responseViewDropdownOpen} style={{ width: '12px', height: '12px' }} />
                      </button>

                      {responseViewDropdownOpen && (
                        <div className="playground-language-menu playground-fade-in" style={{ minWidth: '100px' }}>
                          <button
                            className={`playground-language-option ${responseViewType === 'Body' ? 'selected' : ''}`}
                            onClick={() => {
                              setResponseViewType('Body');
                              setResponseViewDropdownOpen(false);
                            }}
                          >
                            <span>Body</span>
                          </button>
                          <button
                            className={`playground-language-option ${responseViewType === 'Headers' ? 'selected' : ''}`}
                            onClick={() => {
                              setResponseViewType('Headers');
                              setResponseViewDropdownOpen(false);
                            }}
                          >
                            <span>Headers</span>
                          </button>
                        </div>
                      )}
                    </div>
                    <button className="playground-icon-button" title="Download">
                      <DownloadIcon />
                    </button>
                    <button
                      className="playground-icon-button"
                      title="Copy"
                      onClick={() => copyToClipboard(JSON.stringify(playgroundResponse, null, 2), true)}
                      style={{ color: responseCopied ? '#3fb950' : undefined }}
                    >
                      {responseCopied ? <CheckIcon /> : <CopyIcon />}
                    </button>
                  </div>
                </div>
                <div style={{
                  background: '#161b22',
                  maxHeight: '300px',
                  overflowY: 'auto',
                }}>
                  {responseViewType === 'Headers' ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <tbody>
                        {(responseHeaders || getEndpointHeaders()).map((header, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #21262d' }}>
                            <td style={{
                              padding: '12px 16px',
                              color: '#8b949e',
                              fontSize: '13px',
                              fontFamily: "'IBM Plex Mono', monospace",
                              verticalAlign: 'top',
                              width: '180px',
                              minWidth: '180px',
                            }}>
                              {header.key}
                            </td>
                            <td style={{
                              padding: '12px 16px',
                              color: '#e6edf3',
                              fontSize: '13px',
                              fontFamily: "'IBM Plex Mono', monospace",
                            }}>
                              <div className="playground-header-value">
                                {header.value}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ padding: '16px' }}>
                      <pre
                        className="playground-code-block"
                        style={{ margin: 0, color: '#e6edf3' }}
                        dangerouslySetInnerHTML={{ __html: jsonSyntaxHighlight(playgroundResponse) }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Code Snippet Section */}
            <div style={{
              margin: '12px 0 12px 12px',
              border: '1px solid #30363d',
              borderRight: 'none',
              borderRadius: '8px 0 0 8px',
              overflow: 'hidden',
            }}>
              <div style={{
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #30363d',
                background: '#0d1117',
              }}>
                <span style={{ fontWeight: 500, color: '#e6edf3' }}>{currentEndpointConfig?.name || 'API Request'}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ position: 'relative' }}>
                    <button
                      className="playground-language-button"
                      onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="4 17 10 11 4 5" />
                        <line x1="12" y1="19" x2="20" y2="19" />
                      </svg>
                      <span>{selectedLanguage}</span>
                      <ChevronDown isOpen={languageDropdownOpen} style={{ width: '12px', height: '12px' }} />
                    </button>

                    {languageDropdownOpen && (
                      <div className="playground-language-menu playground-fade-in">
                        {languages.map((lang) => (
                          <button
                            key={lang}
                            className={`playground-language-option ${lang === selectedLanguage ? 'selected' : ''}`}
                            onClick={() => {
                              setSelectedLanguage(lang);
                              setLanguageDropdownOpen(false);
                            }}
                          >
                            {lang === 'cURL' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></svg>}
                            {lang === 'Python' && <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>}
                            {lang === 'JavaScript' && <span style={{ color: '#f7df1e', fontWeight: 'bold', fontSize: '10px' }}>JS</span>}
                            {lang === 'PHP' && <span style={{ color: '#8892be', fontWeight: 'bold', fontSize: '10px' }}>PHP</span>}
                            {lang === 'Go' && <span style={{ color: '#00add8', fontWeight: 'bold', fontSize: '10px' }}>Go</span>}
                            {lang === 'Java' && <span style={{ color: '#ed8b00', fontWeight: 'bold', fontSize: '10px' }}>☕</span>}
                            {lang === 'Ruby' && <span style={{ color: '#cc342d', fontWeight: 'bold', fontSize: '10px' }}>💎</span>}
                            <span>{lang}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    className="playground-icon-button"
                    title="Copy code"
                    onClick={() => copyToClipboard(generateCodeSnippet())}
                    style={{ color: copied ? '#3fb950' : undefined }}
                  >
                    {copied ? <CheckIcon /> : <CopyIcon />}
                  </button>
                </div>
              </div>

              <div style={{
                padding: '16px',
                background: '#161b22',
                maxHeight: '400px',
                overflowY: 'auto',
              }}>
                <pre
                  className="playground-code-block"
                  style={{ margin: 0, color: '#e6edf3' }}
                  dangerouslySetInnerHTML={{ __html: syntaxHighlight(generateCodeSnippet()) }}
                />
              </div>
            </div>

            {/* 200 Response Schema (always visible) */}
            <div style={{
              margin: '12px 0 12px 12px',
              border: '1px solid #30363d',
              borderRight: 'none',
              borderRadius: '8px 0 0 8px',
              overflow: 'hidden',
            }}>
              <div style={{
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#0d1117',
                borderBottom: '1px solid #30363d',
              }}>
                <span style={{ color: '#8b949e', fontSize: '13px' }}>200</span>
                <button className="playground-icon-button" style={{ border: 'none', width: '28px', height: '28px' }} title="Copy">
                  <CopyIcon />
                </button>
              </div>
              <div style={{
                padding: '16px',
                background: '#161b22',
                maxHeight: '400px',
                overflowY: 'auto',
              }}>
                <pre
                  className="playground-code-block"
                  style={{ margin: 0, color: '#e6edf3' }}
                  dangerouslySetInnerHTML={{ __html: jsonSyntaxHighlight(getDefaultResponse()) }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaygroundView;
