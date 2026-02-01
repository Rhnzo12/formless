import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import PlaygroundView from './PlaygroundView';
import { RightCodePanel } from './CodePanel';
import {
  identityLookupCode,
  createContractCode,
  fetchSplitDataCode,
  executePayoutCode,
  queryBatchStatusCode,
  responseSchemas
} from './codeGenerator';

// Custom scrollbar styles for left-side scrollbar
const scrollbarStyles = `
  /* Allow vertical scroll on page, hide horizontal */
  html, body {
    overflow-x: hidden;
    overflow-y: auto;
  }

  .left-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .left-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .left-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
  .left-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  /* Horizontal scrollbar for code blocks - always visible */
  .code-scroll {
    overflow-x: scroll;
    overflow-y: hidden;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1);
  }
  .code-scroll::-webkit-scrollbar {
    height: 8px;
  }
  .code-scroll::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
  .code-scroll::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }
  .code-scroll::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.4);
  }

  /* Dropdown menu item hover */
  .dropdown-item:hover {
    background-color: rgba(255, 255, 255, 0.1) !important;
  }

  /* Both scrollbars for code panel - always visible and fixed */
  .code-panel-scroll {
    overflow: scroll;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1);
  }
  .code-panel-scroll::-webkit-scrollbar {
    width: 6px;
    height: 8px;
  }
  .code-panel-scroll::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  .code-panel-scroll::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }
  .code-panel-scroll::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.4);
  }
  .code-panel-scroll::-webkit-scrollbar-corner {
    background: rgba(255, 255, 255, 0.05);
  }

  /* Hide scrollbar on right panel */
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

const ApiDocs = () => {
  const [activeSection, setActiveSection] = useState('welcome');
  const [copiedCode, setCopiedCode] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showParamsChildren, setShowParamsChildren] = useState(false);
  const [showResultChildren, setShowResultChildren] = useState(true);
  const [activeResponseOption, setActiveResponseOption] = useState(1);
  const [copyDropdownOpen, setCopyDropdownOpen] = useState(null); // 'welcome' or 'identity' or null
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tryItOpen, setTryItOpen] = useState(false);
  // Playground states
  const [playgroundEndpoint, setPlaygroundEndpoint] = useState('identity_get_by_email_address');
  const [playgroundBearerToken, setPlaygroundBearerToken] = useState('');
  const [playgroundJsonrpc, setPlaygroundJsonrpc] = useState('2.0');
  const [playgroundId, setPlaygroundId] = useState('1');
  const [playgroundParams, setPlaygroundParams] = useState({ email_address: 'user@example.com' });
  const [playgroundResponse, setPlaygroundResponse] = useState(null);
  const [playgroundLoading, setPlaygroundLoading] = useState(false);
  const [playgroundEndpointDropdownOpen, setPlaygroundEndpointDropdownOpen] = useState(false);
  const [playgroundJsonrpcDropdownOpen, setPlaygroundJsonrpcDropdownOpen] = useState(false);
  const [playgroundMethodDropdownOpen, setPlaygroundMethodDropdownOpen] = useState(false);
  // Create Contract section states
  const [showCreateContractParamsChildren, setShowCreateContractParamsChildren] = useState(false);
  const [showCreateContractResultChildren, setShowCreateContractResultChildren] = useState(true);
  const [createContractResponseOption, setCreateContractResponseOption] = useState(1);
  // Nested collapsible states for Create Contract params
  const [showRevenueShareChildren, setShowRevenueShareChildren] = useState(true);
  const [showRecipientsChildren, setShowRecipientsChildren] = useState(true);
  const [showDistributionUnitChildren, setShowDistributionUnitChildren] = useState(true);
  const [showRevenueSourceChildren, setShowRevenueSourceChildren] = useState(true);
  const [showRevenueSourceProductChildren, setShowRevenueSourceProductChildren] = useState(true);
  // Fetch Split Data section states
  const [showFetchSplitParamsChildren, setShowFetchSplitParamsChildren] = useState(false);
  const [showFetchSplitResultChildren, setShowFetchSplitResultChildren] = useState(true);
  const [fetchSplitResponseOption, setFetchSplitResponseOption] = useState(1);
  const [showFetchSplitSplitsDataChildren, setShowFetchSplitSplitsDataChildren] = useState(false);
  const [showFetchSplitPaginationChildren, setShowFetchSplitPaginationChildren] = useState(false);
  // Execute Payout section states
  const [showExecutePayoutParamsChildren, setShowExecutePayoutParamsChildren] = useState(false);
  const [showExecutePayoutAmountChildren, setShowExecutePayoutAmountChildren] = useState(false);
  const [showExecutePayoutResultChildren, setShowExecutePayoutResultChildren] = useState(true);
  const [executePayoutResponseOption, setExecutePayoutResponseOption] = useState(1);
  // Query Batch Status section states
  const [showQueryBatchParamsChildren, setShowQueryBatchParamsChildren] = useState(false);
  const [showQueryBatchResultChildren, setShowQueryBatchResultChildren] = useState(true);
  const [queryBatchResponseOption, setQueryBatchResponseOption] = useState(1);

  // URL handling for inline playground
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isPlaygroundOpen = searchParams.get('playground') === 'open';

  // Inline playground states
  const [authorizationExpanded, setAuthorizationExpanded] = useState(true);
  const [bodyExpanded, setBodyExpanded] = useState(true);
  const [paramsExpanded, setParamsExpanded] = useState(true);
  const [leftPanelWidth, setLeftPanelWidth] = useState(40); // percentage
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef(null);

  // Playground endpoint configurations
  const playgroundEndpoints = {
    'identity-lookup': {
      name: 'Identity Lookup',
      method: 'identity_get_by_email_address',
      path: '/v1#identity_get_by_email_address',
      params: [
        { key: 'email_address', type: 'string<email>', required: true, default: 'user@example.com' }
      ],
      successResponse: {
        jsonrpc: '2.0',
        id: '<string>',
        result: {
          success: true,
          user_unique_id: '<string>',
          email_address: 'jsmith@example.com',
          display_name: '<string>',
          verified_identity: true,
          financial_accounts: [{}],
          verifications: [{}]
        }
      },
      errorResponse: {
        jsonrpc: '2.0',
        id: '1',
        error: {
          code: 0,
          message: 'jwt must be provided'
        }
      }
    },
    'create-contract': {
      name: 'Create Contract',
      method: 'contract_create',
      path: '/v1#contract_create',
      params: [
        { key: 'contract_name', type: 'string', required: true, default: 'My Contract' },
        { key: 'revenue_share', type: 'object', required: true, default: {} }
      ],
      successResponse: {
        jsonrpc: '2.0',
        id: '<string>',
        result: {
          success: true,
          contract_id: '<string>'
        }
      },
      errorResponse: {
        jsonrpc: '2.0',
        id: '1',
        error: {
          code: 0,
          message: 'jwt must be provided'
        }
      }
    },
    'fetch-split-data': {
      name: 'Fetch Split Data',
      method: 'split_data_fetch',
      path: '/v1#split_data_fetch',
      params: [
        { key: 'contract_id', type: 'string', required: true, default: 'contract_123' }
      ],
      successResponse: {
        jsonrpc: '2.0',
        id: '<string>',
        result: {
          success: true,
          splits_data: [{}],
          pagination: {}
        }
      },
      errorResponse: {
        jsonrpc: '2.0',
        id: '1',
        error: {
          code: 0,
          message: 'jwt must be provided'
        }
      }
    },
    'execute-payout': {
      name: 'Execute Payout',
      method: 'payout_execute',
      path: '/v1#payout_execute',
      params: [
        { key: 'contract_id', type: 'string', required: true, default: 'contract_123' },
        { key: 'amount', type: 'object', required: true, default: { value: '100', currency: 'USD' } }
      ],
      successResponse: {
        jsonrpc: '2.0',
        id: '<string>',
        result: {
          success: true,
          payout_id: '<string>'
        }
      },
      errorResponse: {
        jsonrpc: '2.0',
        id: '1',
        error: {
          code: 0,
          message: 'jwt must be provided'
        }
      }
    },
    'query-batch-status': {
      name: 'Query Batch Status',
      method: 'batch_status_query',
      path: '/v1#batch_status_query',
      params: [
        { key: 'batch_id', type: 'string', required: true, default: 'batch_123' }
      ],
      successResponse: {
        jsonrpc: '2.0',
        id: '<string>',
        result: {
          success: true,
          batch_status: 'completed'
        }
      },
      errorResponse: {
        jsonrpc: '2.0',
        id: '1',
        error: {
          code: 0,
          message: 'jwt must be provided'
        }
      }
    }
  };

  // Get current endpoint config
  // Find endpoint config by method name
  const findEndpointByMethod = (method) => {
    return Object.values(playgroundEndpoints).find(ep => ep.method === method);
  };

  const currentEndpointConfig = findEndpointByMethod(playgroundEndpoint) || playgroundEndpoints['identity-lookup'];

  // Handle endpoint change
  const handlePlaygroundEndpointChange = (method) => {
    setPlaygroundEndpoint(method);
    const config = findEndpointByMethod(method);
    // Reset params based on new endpoint
    const newParams = {};
    if (config?.params) {
      config.params.forEach(p => {
        newParams[p.key] = typeof p.default === 'object' ? JSON.stringify(p.default) : p.default;
      });
    }
    setPlaygroundParams(newParams);
    setPlaygroundResponse(null);
    setPlaygroundEndpointDropdownOpen(false);
  };

  // Handle send request
  const handlePlaygroundSend = () => {
    setPlaygroundLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (!playgroundBearerToken) {
        setPlaygroundResponse({
          status: 200,
          statusText: 'OK',
          body: currentEndpointConfig.errorResponse
        });
      } else {
        setPlaygroundResponse({
          status: 200,
          statusText: 'OK',
          body: currentEndpointConfig.successResponse
        });
      }
      setPlaygroundLoading(false);
    }, 500);
  };

  // Generate cURL for playground
  const generatePlaygroundCurl = () => {
    const params = {};
    Object.keys(playgroundParams).forEach(key => {
      try {
        params[key] = JSON.parse(playgroundParams[key]);
      } catch {
        params[key] = playgroundParams[key];
      }
    });

    return `curl --request POST \\
  --url 'https://share-ddn.formless.xyz${currentEndpointConfig.path}' \\
  --header 'Authorization: Bearer <token>' \\
  --header 'Content-Type: application/json' \\
  --data '
{
  "jsonrpc": "${playgroundJsonrpc}",
  "id": "${playgroundId}",
  "method": "${currentEndpointConfig.method}",
  "params": ${JSON.stringify(params, null, 4).split('\n').join('\n    ')}
}
'`;
  };

  // Set page title based on active section
  useEffect(() => {
    const titles = {
      'welcome': 'Welcome to the SHARE Protocol API',
      'identity-lookup': 'Identity Lookup - Formless',
      'create-contract': 'Create Contract - Formless',
      'fetch-split-data': 'Fetch Split Data - Formless',
      'execute-payout': 'Execute Payout - Formless',
      'query-batch-status': 'Query Batch Status - Formless',
    };
    document.title = titles[activeSection] || 'Welcome to the SHARE Protocol API';
  }, [activeSection]);

  // Handle Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuOpen && !e.target.closest('.mobile-sidebar') && !e.target.closest('.mobile-menu-toggle')) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileMenuOpen]);

  // Close mobile menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [activeSection]);

  // Handle URL path to set correct endpoint and section
  useEffect(() => {
    const pathToEndpoint = {
      '/api-docs/account-management/identity-lookup': 'identity-lookup',
      '/api-docs/revenue-sharing/create-contract': 'create-contract',
      '/api-docs/revenue-sharing/fetch-split-data': 'fetch-split-data',
      '/api-docs/payouts/execute-payout': 'execute-payout',
      '/api-docs/payouts/query-batch-status': 'query-batch-status',
    };
    const endpointKey = pathToEndpoint[location.pathname];
    if (endpointKey) {
      const config = playgroundEndpoints[endpointKey];
      if (config) {
        setPlaygroundEndpoint(config.method);
        setActiveSection(endpointKey);
        // Reset params based on endpoint
        const newParams = {};
        config.params.forEach(p => {
          newParams[p.key] = typeof p.default === 'object' ? JSON.stringify(p.default) : p.default;
        });
        setPlaygroundParams(newParams);
      }
    }
  }, [location.pathname]);

  // Handle panel resizing
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isResizing) return;
    const container = resizeRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    if (newWidth >= 25 && newWidth <= 75) {
      setLeftPanelWidth(newWidth);
    }
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Dropdown handler functions
  const PRODUCTION_URL = 'https://formless-41ci.onrender.com';

  const getMarkdownUrl = (section = '') => {
    const sectionKey = section || activeSection || 'welcome';
    return `${PRODUCTION_URL}/api-docs/markdown?section=${sectionKey}`;
  };

  const getPageUrl = (section = '') => {
    const sectionPaths = {
      'welcome': '/api-docs',
      'identity-lookup': '/api-docs/account-management/identity-lookup',
      'create-contract': '/api-docs/revenue-sharing/create-contract',
      'fetch-split-data': '/api-docs/revenue-sharing/fetch-split-data',
      'execute-payout': '/api-docs/payouts/execute-payout',
      'query-batch-status': '/api-docs/payouts/query-batch-status',
    };
    const path = sectionPaths[section] || sectionPaths[activeSection] || '/api-docs';
    return `${PRODUCTION_URL}${path}`;
  };

  const handleCopyPage = (pageId, section = '') => {
    const url = getMarkdownUrl(section);
    copyToClipboard(url, pageId);
    setCopyDropdownOpen(null);
  };

  const handleViewAsMarkdown = (section = '') => {
    const url = getMarkdownUrl(section);
    window.open(url, '_blank');
    setCopyDropdownOpen(null);
  };

  const handleOpenInChatGPT = (section = '') => {
    const pageUrl = getPageUrl(section);
    const prompt = encodeURIComponent(`Read from ${pageUrl} so I can ask questions about it.`);
    window.open(`https://chat.openai.com/?q=${prompt}`, '_blank');
    setCopyDropdownOpen(null);
  };

  const handleOpenInClaude = (section = '') => {
    const pageUrl = getPageUrl(section);
    const prompt = encodeURIComponent(`Read from ${pageUrl} so I can ask questions about it.`);
    window.open(`https://claude.ai/new?q=${prompt}`, '_blank');
    setCopyDropdownOpen(null);
  };

  const handleOpenInPerplexity = (section = '') => {
    const pageUrl = getPageUrl(section);
    const prompt = encodeURIComponent(`Read from ${pageUrl} so I can ask questions about it.`);
    window.open(`https://perplexity.ai/search?q=${prompt}`, '_blank');
    setCopyDropdownOpen(null);
  };

  const handleCopyMCPServer = () => {
    const mcpUrl = `${PRODUCTION_URL}/mcp`;
    copyToClipboard(mcpUrl, 'mcp');
    setCopyDropdownOpen(null);
  };

  const handleConnectToCursor = () => {
    const mcpUrl = encodeURIComponent(`${PRODUCTION_URL}/mcp`);
    window.open(`cursor://anysphere.cursor-deeplink/mcp/install?url=${mcpUrl}`, '_blank');
    setCopyDropdownOpen(null);
  };

  const handleConnectToVSCode = () => {
    const mcpUrl = encodeURIComponent(`${PRODUCTION_URL}/mcp`);
    window.open(`vscode://anthropic.claude-dev/mcp/install?url=${mcpUrl}`, '_blank');
    setCopyDropdownOpen(null);
  };

  const scrollToSection = (sectionId) => {
    // For main page sections (what-is, core-features, etc.), scroll within the welcome page
    const welcomeSubsections = ['what-is', 'core-features', 'quick-start', 'api-endpoint', 'authentication', 'request-format', 'need-help'];

    if (welcomeSubsections.includes(sectionId)) {
      // First ensure we're on the welcome page
      setActiveSection('welcome');
      // Then scroll to the subsection
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 0);
    } else {
      // For main sections, just switch the view and scroll to top
      setActiveSection(sectionId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Theme colors
  const theme = {
    bg: isDarkMode ? '#0a0a0a' : '#ffffff',
    bgSecondary: isDarkMode ? '#0f0f0f' : '#f5f5f5',
    bgTertiary: isDarkMode ? '#1a1a1a' : '#e5e5e5',
    bgCard: isDarkMode ? '#141414' : '#f9f9f9',
    bgHover: isDarkMode ? '#1a1a1a' : '#e8e8e8',
    bgActive: isDarkMode ? '#1f1f1f' : '#e0e0e0',
    border: isDarkMode ? '#1a1a1a' : '#e0e0e0',
    text: isDarkMode ? 'white' : '#1a1a1a',
    textSecondary: isDarkMode ? '#ccc' : '#444',
    textMuted: isDarkMode ? '#888' : '#666',
    textDimmed: isDarkMode ? '#666' : '#999',
  };

  // Sidebar link component with hover and active states
  const SidebarLink = ({ href, section, children, badge = null }) => {
    const isActive = activeSection === section;
    return (
      <a
        href={href}
        onClick={(e) => { e.preventDefault(); scrollToSection(section); }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '10px 12px',
          color: isActive ? theme.text : theme.textMuted,
          textDecoration: 'none',
          fontSize: '14px',
          backgroundColor: isActive ? (isDarkMode ? '#1a1a1a' : '#e8e8e8') : 'transparent',
          borderRadius: '8px',
          margin: '2px 8px',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = isDarkMode ? '#141414' : '#f0f0f0';
            e.currentTarget.style.color = theme.text;
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = theme.textMuted;
          }
        }}
      >
        {badge && (
          <span style={{
            backgroundColor: isDarkMode ? 'transparent' : '#dbeafe',
            color: isDarkMode ? '#60a5fa' : '#2563eb',
            fontSize: '10px',
            fontWeight: '600',
            padding: '2px 6px',
            borderRadius: '4px',
          }}>{badge}</span>
        )}
        {children}
      </a>
    );
  };

  // Right sidebar link component
  const RightSidebarLink = ({ href, section, children, indented = false }) => {
    const isActive = activeSection === section;
    return (
      <a
        href={href}
        onClick={(e) => { e.preventDefault(); scrollToSection(section); }}
        style={{
          fontSize: '13px',
          color: isActive ? theme.text : theme.textDimmed,
          fontWeight: isActive ? '600' : '400',
          textDecoration: 'none',
          padding: indented ? '4px 0 4px 16px' : '4px 0',
          transition: 'color 0.15s ease',
          display: 'block',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = theme.text;
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.color = theme.textDimmed;
          }
        }}
      >
        {children}
      </a>
    );
  };

  // Search items for filtering
  const searchItems = [
    { title: 'Welcome to the SHARE Protocol API', section: 'welcome' },
    { title: 'What is the SHARE Protocol API?', section: 'what-is' },
    { title: 'Core Features', section: 'core-features' },
    { title: 'Quick Start', section: 'quick-start' },
    { title: 'API Endpoint', section: 'api-endpoint' },
    { title: 'Authentication', section: 'authentication' },
    { title: 'Request Format', section: 'request-format' },
    { title: 'Need Help?', section: 'need-help' },
    { title: 'Identity Lookup', section: 'identity-lookup' },
    { title: 'Create Contract', section: 'create-contract' },
    { title: 'Fetch Split Data', section: 'fetch-split-data' },
    { title: 'Execute Payout', section: 'execute-payout' },
    { title: 'Query Batch Status', section: 'query-batch-status' },
  ];

  const filteredSearchItems = searchItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );


  // Inline Playground View - shown when on endpoint pages
  if (isPlaygroundOpen) {
    return (
      <PlaygroundView
        isOpen={true}
        playgroundEndpoint={playgroundEndpoint}
        playgroundEndpoints={Object.values(playgroundEndpoints)}
        currentEndpointConfig={currentEndpointConfig}
        playgroundBearerToken={playgroundBearerToken}
        setPlaygroundBearerToken={setPlaygroundBearerToken}
        playgroundJsonrpc={playgroundJsonrpc}
        setPlaygroundJsonrpc={setPlaygroundJsonrpc}
        playgroundId={playgroundId}
        setPlaygroundId={setPlaygroundId}
        playgroundParams={playgroundParams}
        setPlaygroundParams={setPlaygroundParams}
        playgroundResponse={playgroundResponse}
        playgroundLoading={playgroundLoading}
        handlePlaygroundSend={handlePlaygroundSend}
        handlePlaygroundEndpointChange={handlePlaygroundEndpointChange}
        generatePlaygroundCurl={generatePlaygroundCurl}
        copyToClipboard={copyToClipboard}
        copiedCode={copiedCode}
        onClose={() => navigate('/api-docs')}
      />
    );
  }

  return (
    <>
    <style>{scrollbarStyles}</style>
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: theme.bg,
      color: theme.text,
      fontFamily: '"Inter", sans-serif',
    }}>
      {/* Search Modal */}
      {searchOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '100px',
            zIndex: 2000,
          }}
          onClick={() => setSearchOpen(false)}
        >
          <div
            style={{
              backgroundColor: theme.bgSecondary,
              borderRadius: '12px',
              width: '100%',
              maxWidth: '600px',
              border: `1px solid ${theme.border}`,
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px 20px',
              borderBottom: `1px solid ${theme.border}`,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  fontSize: '16px',
                  color: theme.text,
                }}
              />
              <span style={{
                color: theme.textMuted,
                fontSize: '12px',
                backgroundColor: theme.bgTertiary,
                padding: '4px 8px',
                borderRadius: '4px',
              }}>ESC</span>
            </div>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {filteredSearchItems.length > 0 ? (
                filteredSearchItems.map((item) => (
                  <div
                    key={item.section}
                    onClick={() => {
                      scrollToSection(item.section);
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    style={{
                      padding: '12px 20px',
                      cursor: 'pointer',
                      borderBottom: `1px solid ${theme.border}`,
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.bgTertiary}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div style={{ fontSize: '14px', color: theme.text }}>{item.title}</div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: theme.textMuted }}>
                  No results found
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Fixed Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        backgroundColor: theme.bg,
        borderBottom: `1px solid ${theme.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 1000,
      }}>
        {/* Left side - Hamburger + Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              flexDirection: 'column',
              gap: '5px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
            }}
            aria-label="Toggle menu"
          >
            <span style={{
              width: '20px',
              height: '2px',
              backgroundColor: theme.text,
              transition: 'all 0.3s ease',
              transform: mobileMenuOpen ? 'rotate(45deg) translateY(7px)' : 'none',
            }} />
            <span style={{
              width: '20px',
              height: '2px',
              backgroundColor: theme.text,
              transition: 'all 0.3s ease',
              opacity: mobileMenuOpen ? 0 : 1,
            }} />
            <span style={{
              width: '20px',
              height: '2px',
              backgroundColor: theme.text,
              transition: 'all 0.3s ease',
              transform: mobileMenuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none',
            }} />
          </button>

          {/* Logo */}
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <img
              src="/logomain.png"
              alt="Formless Logo"
              style={{ height: '28px', width: 'auto', filter: isDarkMode ? 'none' : 'invert(1)' }}
            />
            <span className="logo-text" style={{
              color: theme.text,
              fontSize: '16px',
              fontWeight: '600',
              letterSpacing: '0.5px',
            }}>
              FORMLESS<sup style={{ fontSize: '8px', marginLeft: '2px' }}>™</sup>
            </span>
          </a>
        </div>

        {/* Search Bar - Center (hidden on mobile) */}
        <div
          className="desktop-search"
          onClick={() => setSearchOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 16px',
            backgroundColor: theme.bgTertiary,
            borderRadius: '8px',
            border: `1px solid ${theme.border}`,
            minWidth: '300px',
            cursor: 'pointer',
            transition: 'border-color 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = theme.textMuted}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = theme.border}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <span style={{ color: theme.textMuted, fontSize: '14px', flex: 1 }}>Search...</span>
          <span style={{
            color: theme.textMuted,
            fontSize: '12px',
            backgroundColor: theme.bgSecondary,
            padding: '2px 6px',
            borderRadius: '4px',
          }}>Ctrl K</span>
        </div>

        {/* Right side - Search icon (mobile) + Theme Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Mobile Search Button */}
          <button
            className="mobile-search-btn"
            onClick={() => setSearchOpen(true)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: theme.textMuted,
              cursor: 'pointer',
              padding: '8px',
            }}
            aria-label="Search"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            style={{
              background: 'none',
              border: 'none',
              color: theme.textMuted,
              cursor: 'pointer',
              padding: '8px',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = theme.text}
            onMouseLeave={(e) => e.currentTarget.style.color = theme.textMuted}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Left Sidebar */}
      <aside
        className="mobile-sidebar"
        style={{
          width: '280px',
          backgroundColor: theme.bgSecondary,
          borderRight: `1px solid ${theme.border}`,
          padding: '24px 0',
          paddingTop: '125px',
          position: 'fixed',
          top: 0,
          left: mobileMenuOpen ? 0 : '-280px',
          height: '100vh',
          overflowY: 'auto',
          transition: 'left 0.3s ease',
          zIndex: 999,
        }}>
        {/* Documentation Title */}
        <div style={{ padding: '0 20px', marginBottom: '16px' }}>
          <h2 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: theme.text,
            margin: 0,
          }}>Documentation</h2>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          backgroundColor: theme.border,
          margin: '16px 20px',
        }} />

        {/* Website Link */}
        <div style={{ padding: '0 20px', marginBottom: '24px' }}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: theme.textMuted,
              textDecoration: 'none',
              fontSize: '14px',
              padding: '8px 0',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            Website
          </a>
        </div>

        {/* Getting Started Section */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            padding: '0 20px',
            marginBottom: '16px',
            fontSize: '12px',
            fontWeight: '600',
            color: theme.text,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Getting Started
          </div>
          <SidebarLink href="#welcome" section="welcome">
            Welcome to the SHARE Protocol API
          </SidebarLink>
        </div>

        {/* Account Management Section */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            padding: '0 20px',
            marginBottom: '16px',
            fontSize: '12px',
            fontWeight: '600',
            color: theme.text,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Account Management
          </div>
          <SidebarLink href="#identity-lookup" section="identity-lookup" badge="POST">
            Identity Lookup
          </SidebarLink>
        </div>

        {/* Revenue Sharing Section */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            padding: '0 20px',
            marginBottom: '16px',
            fontSize: '12px',
            fontWeight: '600',
            color: theme.text,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Revenue Sharing
          </div>
          <SidebarLink href="#create-contract" section="create-contract" badge="POST">
            Create Contract
          </SidebarLink>
          <SidebarLink href="#fetch-split-data" section="fetch-split-data" badge="POST">
            Fetch Split Data
          </SidebarLink>
        </div>

        {/* Payouts Section */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            padding: '0 20px',
            marginBottom: '16px',
            fontSize: '12px',
            fontWeight: '600',
            color: theme.text,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Payouts
          </div>
          <SidebarLink href="#execute-payout" section="execute-payout" badge="POST">
            Execute Payout
          </SidebarLink>
          <SidebarLink href="#query-batch-status" section="query-batch-status" badge="POST">
            Query Batch Status
          </SidebarLink>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className="main-content"
        style={{
          flex: 1,
          marginLeft: '280px',
          marginRight: (activeSection === 'identity-lookup' || activeSection === 'create-contract' || activeSection === 'fetch-split-data' || activeSection === 'execute-payout' || activeSection === 'query-batch-status') ? '480px' : '260px',
          padding: '40px 60px',
          paddingTop: '136px',
          transition: 'margin-right 0.2s ease',
        }}>
        {/* Welcome Page Content */}
        {activeSection === 'welcome' && (
          <>
            {/* Breadcrumb */}
            <div style={{
              fontSize: '14px',
              color: theme.textDimmed,
              marginBottom: '16px',
            }}>
              Getting Started
            </div>

            {/* Title Section */}
            <div id="welcome" style={{ marginBottom: '40px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}>
            <h1 style={{
              fontSize: '36px',
              fontWeight: '700',
              margin: 0,
              lineHeight: '1.2',
            }}>
              Welcome to the SHARE Protocol API
            </h1>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setCopyDropdownOpen(copyDropdownOpen === 'welcome' ? null : 'welcome')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  backgroundColor: theme.bgTertiary,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '6px',
                  color: theme.textMuted,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copy page
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>
              {copyDropdownOpen === 'welcome' && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  backgroundColor: theme.bgSecondary,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  padding: '8px 0',
                  minWidth: '280px',
                  zIndex: 1000,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}>
                  <button className="dropdown-item" onClick={() => handleCopyPage('page', 'welcome')} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    <div><div style={{ fontWeight: '500' }}>Copy page</div><div style={{ fontSize: '12px', color: theme.textMuted }}>Copy page as Markdown for LLMs</div></div>
                  </button>
                  <button className="dropdown-item" onClick={() => handleViewAsMarkdown('welcome')} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <div><div style={{ fontWeight: '500' }}>View as Markdown <span style={{ fontSize: '12px' }}>↗</span></div><div style={{ fontSize: '12px', color: theme.textMuted }}>View this page as plain text</div></div>
                  </button>
                  <div style={{ height: '1px', backgroundColor: theme.border, margin: '8px 0' }} />
                  <button className="dropdown-item" onClick={() => handleOpenInChatGPT('welcome')} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/></svg>
                    <div><div style={{ fontWeight: '500' }}>Open in ChatGPT <span style={{ fontSize: '12px' }}>↗</span></div><div style={{ fontSize: '12px', color: theme.textMuted }}>Ask questions about this page</div></div>
                  </button>
                  <button className="dropdown-item" onClick={() => handleOpenInClaude('welcome')} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4.709 15.955l4.72-2.647.08-.08 2.726-1.529.08-.08 6.467-3.627c.344-.193.554-.57.537-.965a1.077 1.077 0 0 0-.601-.913l-.644-.322a.537.537 0 0 0-.483 0L4.144 12.48a1.077 1.077 0 0 0-.601.913c-.016.394.193.772.538.965l.628.354v1.243z"/><path d="M19.291 8.045l-4.72 2.647-.08.08-2.726 1.529-.08.08-6.467 3.627a1.077 1.077 0 0 0-.537.965c.017.378.242.716.601.913l.644.322a.537.537 0 0 0 .483 0l13.447-7.545c.36-.193.584-.535.601-.913a1.077 1.077 0 0 0-.538-.965l-.628-.354v-1.243z"/></svg>
                    <div><div style={{ fontWeight: '500' }}>Open in Claude <span style={{ fontSize: '12px' }}>↗</span></div><div style={{ fontSize: '12px', color: theme.textMuted }}>Ask questions about this page</div></div>
                  </button>
                  <button className="dropdown-item" onClick={() => handleOpenInPerplexity('welcome')} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
                    <div><div style={{ fontWeight: '500' }}>Open in Perplexity <span style={{ fontSize: '12px' }}>↗</span></div><div style={{ fontSize: '12px', color: theme.textMuted }}>Ask questions about this page</div></div>
                  </button>
                  <div style={{ height: '1px', backgroundColor: theme.border, margin: '8px 0' }} />
                  <button className="dropdown-item" onClick={handleCopyMCPServer} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                    <div><div style={{ fontWeight: '500' }}>Copy MCP Server</div><div style={{ fontSize: '12px', color: theme.textMuted }}>Copy MCP Server URL to clipboard</div></div>
                  </button>
                  <button className="dropdown-item" onClick={handleConnectToCursor} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                    <div><div style={{ fontWeight: '500' }}>Connect to Cursor <span style={{ fontSize: '12px' }}>↗</span></div><div style={{ fontSize: '12px', color: theme.textMuted }}>Install MCP Server on Cursor</div></div>
                  </button>
                  <button className="dropdown-item" onClick={handleConnectToVSCode} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                    <div><div style={{ fontWeight: '500' }}>Connect to VS Code <span style={{ fontSize: '12px' }}>↗</span></div><div style={{ fontSize: '12px', color: theme.textMuted }}>Install MCP Server on VS Code</div></div>
                  </button>
                </div>
              )}
            </div>
          </div>
          <p style={{
            fontSize: '18px',
            color: theme.textMuted,
            margin: 0,
          }}>
            Micropayments, revenue sharing and distribution.
          </p>
        </div>

        {/* SHARE Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '60px',
        }}>
          <img
            src="/logomain.png"
            alt="SHARE Logo"
            style={{ height: '40px', width: 'auto' }}
          />
          <span style={{
            fontSize: '32px',
            fontWeight: '600',
            letterSpacing: '2px',
          }}>SHARE</span>
        </div>

        {/* What is the SHARE Protocol API? */}
        <section id="what-is" style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '16px',
          }}>
            What is the SHARE Protocol API?
          </h2>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.7',
            color: theme.textSecondary,
          }}>
            SHARE Protocol API helps you offer flexible revenue sharing to your products and experiences. It's built for creators, businesses and developers.
          </p>
        </section>

        {/* Core Features */}
        <section id="core-features" style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '24px',
          }}>
            Core Features
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
          }}>
            {/* Account Management Card */}
            <div
              onClick={() => scrollToSection('identity-lookup')}
              style={{
                backgroundColor: theme.bgCard,
                borderRadius: '12px',
                padding: '24px',
                border: `1px solid ${theme.border}`,
                cursor: 'pointer',
                transition: 'border-color 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = theme.textMuted}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = theme.border}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" style={{ marginBottom: '16px' }}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '8px',
              }}>
                Account Management
              </h3>
              <p style={{
                fontSize: '14px',
                color: theme.textMuted,
                margin: 0,
                lineHeight: '1.5',
              }}>
                Manage user identities and accounts
              </p>
            </div>

            {/* Revenue Sharing Card */}
            <div
              onClick={() => scrollToSection('create-contract')}
              style={{
                backgroundColor: theme.bgCard,
                borderRadius: '12px',
                padding: '24px',
                border: `1px solid ${theme.border}`,
                cursor: 'pointer',
                transition: 'border-color 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = theme.textMuted}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = theme.border}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" style={{ marginBottom: '16px' }}>
                <circle cx="18" cy="5" r="3"/>
                <circle cx="6" cy="12" r="3"/>
                <circle cx="18" cy="19" r="3"/>
                <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>
              </svg>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '8px',
              }}>
                Revenue Sharing
              </h3>
              <p style={{
                fontSize: '14px',
                color: theme.textMuted,
                margin: 0,
                lineHeight: '1.5',
              }}>
                Create contracts to split payments
              </p>
            </div>

            {/* Payouts Card */}
            <div
              onClick={() => scrollToSection('execute-payout')}
              style={{
                backgroundColor: theme.bgCard,
                borderRadius: '12px',
                padding: '24px',
                border: `1px solid ${theme.border}`,
                cursor: 'pointer',
                transition: 'border-color 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = theme.textMuted}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = theme.border}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" style={{ marginBottom: '16px' }}>
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <circle cx="12" cy="12" r="4"/>
                <path d="M2 10h2M20 10h2M2 14h2M20 14h2"/>
              </svg>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '8px',
              }}>
                Payouts
              </h3>
              <p style={{
                fontSize: '14px',
                color: theme.textMuted,
                margin: 0,
                lineHeight: '1.5',
              }}>
                Distribute revenue automatically
              </p>
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section id="quick-start" style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '16px',
          }}>
            Quick Start
          </h2>
          <p style={{
            fontSize: '16px',
            color: theme.textSecondary,
            marginBottom: '32px',
          }}>
            Please <a href="mailto:contact@formless.xyz" style={{ color: 'white', textDecoration: 'underline' }}>contact us</a> for a sandbox API key.
          </p>

          {/* 1. API Endpoint */}
          <div id="api-endpoint" style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '16px',
            }}>
              1. API Endpoint
            </h3>
            <p style={{
              fontSize: '15px',
              color: theme.textMuted,
              marginBottom: '16px',
            }}>
              All requests go to:
            </p>
            <div style={{
              backgroundColor: theme.bgCard,
              borderRadius: '8px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: `1px solid ${theme.border}`,
            }}>
              <code style={{
                fontSize: '14px',
                color: theme.textSecondary,
                fontFamily: 'Monaco, Consolas, monospace',
              }}>
                <span style={{ color: '#22c55e' }}>POST</span> https://share-ddn.formless.xyz/v1
              </code>
              <button
                onClick={() => copyToClipboard('POST https://share-ddn.formless.xyz/v1', 'endpoint')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: theme.textDimmed,
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                {copiedCode === 'endpoint' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* 2. Authentication */}
          <div id="authentication" style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '16px',
            }}>
              2. Authentication
            </h3>
            <p style={{
              fontSize: '15px',
              color: theme.textMuted,
              marginBottom: '16px',
            }}>
              Include your JWT token in every request:
            </p>
            <div style={{
              backgroundColor: theme.bgCard,
              borderRadius: '8px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              border: `1px solid ${theme.border}`,
            }}>
              <code style={{
                fontSize: '14px',
                color: theme.textSecondary,
                fontFamily: 'Monaco, Consolas, monospace',
              }}>
                <span style={{ color: theme.textMuted }}>Authorization:</span> <span style={{ color: '#f472b6' }}>Bearer</span> <span style={{ color: '#60a5fa' }}>&lt;your-jwt-token&gt;</span>
              </code>
              <button
                onClick={() => copyToClipboard('Authorization: Bearer <your-jwt-token>', 'auth')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: theme.textDimmed,
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                {copiedCode === 'auth' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* 3. Request Format */}
          <div id="request-format" style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '16px',
            }}>
              3. Request Format
            </h3>
            <p style={{
              fontSize: '15px',
              color: theme.textMuted,
              marginBottom: '16px',
            }}>
              SHARE Protocol uses JSON-RPC 2.0:
            </p>
            <div style={{
              backgroundColor: theme.bgCard,
              borderRadius: '8px',
              padding: '20px',
              position: 'relative',
              border: `1px solid ${theme.border}`,
            }}>
              <button
                onClick={() => copyToClipboard(`{
  "jsonrpc": "2.0",
  "id": "1",
  "method": "method_name",
  "params": {
    // your parameters here
  }
}`, 'format')}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'none',
                  border: 'none',
                  color: theme.textDimmed,
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                {copiedCode === 'format' ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                )}
              </button>
              <pre style={{
                fontSize: '14px',
                fontFamily: 'Monaco, Consolas, monospace',
                margin: 0,
                lineHeight: '1.6',
                color: theme.textSecondary,
              }}>
{`{
  `}<span style={{ color: '#60a5fa' }}>"jsonrpc"</span>{`: `}<span style={{ color: '#22c55e' }}>"2.0"</span>{`,
  `}<span style={{ color: '#60a5fa' }}>"id"</span>{`: `}<span style={{ color: '#22c55e' }}>"1"</span>{`,
  `}<span style={{ color: '#60a5fa' }}>"method"</span>{`: `}<span style={{ color: '#22c55e' }}>"method_name"</span>{`,
  `}<span style={{ color: '#60a5fa' }}>"params"</span>{`: {
    `}<span style={{ color: theme.textDimmed }}>{'// your parameters here'}</span>{`
  }
}`}
              </pre>
            </div>
          </div>
        </section>

        {/* Need Help? */}
        <section id="need-help" style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '16px',
          }}>
            Need Help?
          </h2>
          <p style={{
            fontSize: '16px',
            color: theme.textSecondary,
            lineHeight: '1.7',
          }}>
            Visit{' '}
            <a href="https://formless.xyz" target="_blank" rel="noopener noreferrer" style={{ color: 'white', fontWeight: '600', textDecoration: 'none' }}>
              formless.xyz
            </a>
            {' '}to learn more about Formless.
          </p>
        </section>

        {/* Next Page Navigation for Welcome */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          paddingTop: '24px',
          borderTop: `1px solid ${theme.border}`,
          marginBottom: '60px',
        }}>
          <a
            href="#identity-lookup"
            onClick={(e) => { e.preventDefault(); scrollToSection('identity-lookup'); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              color: theme.text,
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            Identity Lookup
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </a>
        </div>

        {/* Footer for Welcome */}
        <footer style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '24px',
          borderTop: `1px solid ${theme.border}`,
        }}>
          <a
            href="https://github.com/formless-eng"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: theme.textDimmed, transition: 'color 0.2s ease' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          <span style={{ color: theme.textDimmed, fontSize: '14px' }}>
            Powered by{' '}
            <a
              href="https://mintlify.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'white', fontWeight: '600', textDecoration: 'none' }}
            >
              mintlify
            </a>
          </span>
        </footer>
          </>
        )}

        {/* Identity Lookup Page Content */}
        {activeSection === 'identity-lookup' && (
          <>
            {/* Two Column Layout */}
            <div className="api-two-column-layout" style={{ display: 'flex' }}>
              {/* Left Column - Documentation */}
              <div
                className="left-content-column"
                style={{
                  flex: 1,
                  minWidth: 0,
                  overflow: 'hidden',
                }}>
                {/* Inner content wrapper */}
                <div>
                {/* Breadcrumb */}
                <div style={{
                  fontSize: '14px',
                  color: theme.textDimmed,
                  marginBottom: '16px',
                }}>
                  Account Management
                </div>

                {/* Title with Copy page button */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
                gap: '16px',
              }}>
                <h2 className="page-title" style={{
                  fontSize: '36px',
                  fontWeight: '700',
                  margin: 0,
                  lineHeight: '1.2',
                  whiteSpace: 'nowrap',
                }}>
                  Identity Lookup
                </h2>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <button
                    onClick={() => setCopyDropdownOpen(copyDropdownOpen === 'identity' ? null : 'identity')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      backgroundColor: 'transparent',
                      border: `1px solid ${theme.border}`,
                      borderRadius: '6px',
                      color: theme.textMuted,
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                    Copy page
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </button>
                  {copyDropdownOpen === 'identity' && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '8px',
                      backgroundColor: theme.bgSecondary,
                      border: `1px solid ${theme.border}`,
                      borderRadius: '8px',
                      padding: '8px 0',
                      minWidth: '280px',
                      zIndex: 1000,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    }}>
                      <button className="dropdown-item" onClick={() => handleCopyPage('identity-page', 'identity-lookup')} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                        <div><div style={{ fontWeight: '500' }}>Copy page</div><div style={{ fontSize: '12px', color: theme.textMuted }}>Copy page as Markdown for LLMs</div></div>
                      </button>
                      <button className="dropdown-item" onClick={() => handleViewAsMarkdown('identity-lookup')} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        <div><div style={{ fontWeight: '500' }}>View as Markdown <span style={{ fontSize: '12px' }}>↗</span></div><div style={{ fontSize: '12px', color: theme.textMuted }}>View this page as plain text</div></div>
                      </button>
                      <div style={{ height: '1px', backgroundColor: theme.border, margin: '8px 0' }} />
                      <button className="dropdown-item" onClick={() => handleOpenInChatGPT('identity-lookup')} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/></svg>
                        <div><div style={{ fontWeight: '500' }}>Open in ChatGPT <span style={{ fontSize: '12px' }}>↗</span></div><div style={{ fontSize: '12px', color: theme.textMuted }}>Ask questions about this page</div></div>
                      </button>
                      <button className="dropdown-item" onClick={() => handleOpenInClaude('identity-lookup')} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4.709 15.955l4.72-2.647.08-.08 2.726-1.529.08-.08 6.467-3.627c.344-.193.554-.57.537-.965a1.077 1.077 0 0 0-.601-.913l-.644-.322a.537.537 0 0 0-.483 0L4.144 12.48a1.077 1.077 0 0 0-.601.913c-.016.394.193.772.538.965l.628.354v1.243z"/><path d="M19.291 8.045l-4.72 2.647-.08.08-2.726 1.529-.08.08-6.467 3.627a1.077 1.077 0 0 0-.537.965c.017.378.242.716.601.913l.644.322a.537.537 0 0 0 .483 0l13.447-7.545c.36-.193.584-.535.601-.913a1.077 1.077 0 0 0-.538-.965l-.628-.354v-1.243z"/></svg>
                        <div><div style={{ fontWeight: '500' }}>Open in Claude <span style={{ fontSize: '12px' }}>↗</span></div><div style={{ fontSize: '12px', color: theme.textMuted }}>Ask questions about this page</div></div>
                      </button>
                      <button className="dropdown-item" onClick={() => handleOpenInPerplexity('identity-lookup')} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
                        <div><div style={{ fontWeight: '500' }}>Open in Perplexity <span style={{ fontSize: '12px' }}>↗</span></div><div style={{ fontSize: '12px', color: theme.textMuted }}>Ask questions about this page</div></div>
                      </button>
                      <div style={{ height: '1px', backgroundColor: theme.border, margin: '8px 0' }} />
                      <button className="dropdown-item" onClick={handleCopyMCPServer} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                        <div><div style={{ fontWeight: '500' }}>Copy MCP Server</div><div style={{ fontSize: '12px', color: theme.textMuted }}>Copy MCP Server URL to clipboard</div></div>
                      </button>
                      <button className="dropdown-item" onClick={handleConnectToCursor} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                        <div><div style={{ fontWeight: '500' }}>Connect to Cursor <span style={{ fontSize: '12px' }}>↗</span></div><div style={{ fontSize: '12px', color: theme.textMuted }}>Install MCP Server on Cursor</div></div>
                      </button>
                      <button className="dropdown-item" onClick={handleConnectToVSCode} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                        <div><div style={{ fontWeight: '500' }}>Connect to VS Code <span style={{ fontSize: '12px' }}>↗</span></div><div style={{ fontSize: '12px', color: theme.textMuted }}>Install MCP Server on VS Code</div></div>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="page-subtitle" style={{
                fontSize: '18px',
                color: theme.textMuted,
                marginBottom: '24px',
              }}>
                Retrieve user identity information by email address
              </p>

              {/* API Endpoint Bar - Single contained element */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: theme.bgCard,
                borderRadius: '8px',
                border: `1px solid ${theme.border}`,
                marginBottom: '32px',
                overflow: 'hidden',
              }}>
                <span style={{
                  backgroundColor: isDarkMode ? '#1a2744' : '#dbeafe',
                  color: '#60a5fa',
                  fontSize: '14px',
                  fontWeight: '700',
                  padding: '10px 16px',
                }}>POST</span>
                <code style={{
                  fontSize: '14px',
                  color: theme.textSecondary,
                  fontFamily: 'Monaco, Consolas, monospace',
                  padding: '10px 16px',
                  borderLeft: `1px solid ${theme.border}`,
                  borderRight: `1px solid ${theme.border}`,
                }}>/v1#identity_get_by_email_address</code>
                <button
                  onClick={() => { handlePlaygroundEndpointChange('identity_get_by_email_address'); setTryItOpen(true); }}
                  style={{
                  backgroundColor: '#3064e3',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  padding: '10px 20px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  Try it
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              </div>

              {/* Method Description */}
              <p style={{
                fontSize: '16px',
                color: theme.textSecondary,
                marginBottom: '40px',
                lineHeight: '1.7',
              }}>
                Retrieve user identity information based on an email address using the{' '}
                <code style={{
                  backgroundColor: theme.bgCard,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '14px',
                  border: `1px solid ${theme.border}`,
                }}>identity_get_by_email_address</code> method.
              </p>

          {/* Authorizations Section */}
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '24px',
              paddingBottom: '12px',
              borderBottom: `1px solid ${theme.border}`,
            }}>
              Authorizations
            </h3>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '16px',
            }}>
              <span style={{ color: theme.text, fontWeight: '500' }}>Authorization</span>
              <span style={{
                backgroundColor: theme.bgTertiary,
                color: theme.text,
                fontSize: '12px',
                padding: '2px 8px',
                borderRadius: '4px',
              }}>string</span>
              <span style={{
                backgroundColor: theme.bgTertiary,
                color: theme.text,
                fontSize: '12px',
                padding: '2px 8px',
                borderRadius: '4px',
              }}>header</span>
              <span style={{
                backgroundColor: 'rgba(220, 38, 38, 0.15)',
                color: '#f25c5c',
                fontSize: '12px',
                fontWeight: '600',
                padding: '2px 8px',
                borderRadius: '4px',
              }}>required</span>
            </div>
            <p style={{
              fontSize: '14px',
              color: theme.textMuted,
            }}>
              JWT token with Unique ID identification
            </p>
          </div>

          {/* Body Section */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              paddingBottom: '12px',
              borderBottom: `1px solid ${theme.border}`,
            }}>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                margin: 0,
              }}>
                Body
              </h3>
              <span style={{
                color: theme.textMuted,
                fontSize: '14px',
              }}>application/json</span>
            </div>

            {/* jsonrpc field */}
            <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '8px',
              }}>
                <span style={{ color: theme.text, fontWeight: '500' }}>jsonrpc</span>
                <span style={{
                  backgroundColor: theme.bgTertiary,
                  color: theme.text,
                  fontSize: '12px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}>enum&lt;string&gt;</span>
                <span style={{
                  backgroundColor: theme.bgTertiary,
                  fontSize: '12px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}><span style={{ color: theme.textMuted }}>default:</span><span style={{ color: theme.text }}>2.0</span></span>
                <span style={{
                  backgroundColor: 'rgba(220, 38, 38, 0.15)',
                  color: '#f25c5c',
                  fontSize: '12px',
                  fontWeight: '600',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}>required</span>
              </div>
              <p style={{ fontSize: '14px', color: theme.textMuted }}>
                Available options: <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px', color: theme.text }}>2.0</code>
              </p>
            </div>

            {/* id field */}
            <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '8px',
              }}>
                <span style={{ color: theme.text, fontWeight: '500' }}>id</span>
                <span style={{
                  backgroundColor: theme.bgTertiary,
                  color: theme.text,
                  fontSize: '12px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}>string</span>
                <span style={{
                  backgroundColor: theme.bgTertiary,
                  fontSize: '12px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}><span style={{ color: theme.textMuted }}>default:</span><span style={{ color: theme.text }}>1</span></span>
                <span style={{
                  backgroundColor: 'rgba(220, 38, 38, 0.15)',
                  color: '#f25c5c',
                  fontSize: '12px',
                  fontWeight: '600',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}>required</span>
              </div>
            </div>

            {/* method field */}
            <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
              {/* Field name row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '16px',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                <span style={{ color: theme.textMuted, fontWeight: '400' }}>method</span>
              </div>
              {/* Badges row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '16px',
                flexWrap: 'wrap',
              }}>
                <span style={{
                  backgroundColor: theme.bgTertiary,
                  color: theme.text,
                  fontSize: '12px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}>enum&lt;string&gt;</span>
                <span style={{
                  backgroundColor: theme.bgTertiary,
                  fontSize: '12px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}><span style={{ color: theme.textMuted }}>default:</span><span style={{ color: theme.text }}>identity_get_by_email_address</span></span>
                <span style={{
                  backgroundColor: 'rgba(220, 38, 38, 0.15)',
                  color: '#f25c5c',
                  fontSize: '12px',
                  fontWeight: '600',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}>required</span>
              </div>
              <p style={{ fontSize: '14px', color: theme.textMuted }}>
                Available options: <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px', color: theme.text }}>identity_get_by_email_address</code>
              </p>
            </div>

            {/* params field */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '16px',
              }}>
                <span style={{ color: theme.text, fontWeight: '500' }}>params</span>
                <span style={{
                  backgroundColor: theme.bgTertiary,
                  color: theme.text,
                  fontSize: '12px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}>object</span>
                <span style={{
                  backgroundColor: 'rgba(220, 38, 38, 0.15)',
                  color: '#f25c5c',
                  fontSize: '12px',
                  fontWeight: '600',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}>required</span>
              </div>

              {/* Collapsible params container */}
              <div style={{
                backgroundColor: theme.bgCard,
                borderRadius: '8px',
                border: `1px solid ${theme.border}`,
                overflow: 'hidden',
              }}>
                {/* Show/Hide child attributes toggle */}
                <div
                  onClick={() => setShowParamsChildren(!showParamsChildren)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px 20px',
                    color: theme.textMuted,
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.bgHover}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{
                      transform: showParamsChildren ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                  {showParamsChildren ? 'Hide child attributes' : 'Show child attributes'}
                </div>

                {/* Nested params.email_address - shown when expanded */}
                {showParamsChildren && (
                  <div style={{
                    padding: '0 20px 20px 20px',
                    borderTop: `1px solid ${theme.border}`,
                  }}>
                    {/* Field name row */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      paddingTop: '16px',
                      marginBottom: '16px',
                    }}>
                      <span style={{ color: theme.textMuted, fontSize: '14px' }}>params.</span>
                      <span style={{ color: theme.textMuted, fontWeight: '400' }}>email_address</span>
                    </div>
                    {/* Badges row */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      flexWrap: 'wrap',
                    }}>
                      <span style={{
                        backgroundColor: theme.bgTertiary,
                        color: theme.text,
                        fontSize: '12px',
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}>string&lt;email&gt;</span>
                      <span style={{
                        backgroundColor: theme.bgTertiary,
                        fontSize: '12px',
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}><span style={{ color: theme.textMuted }}>default:</span><span style={{ color: theme.text }}>user@example.com</span></span>
                      <span style={{
                        backgroundColor: 'rgba(220, 38, 38, 0.15)',
                        color: '#f25c5c',
                        fontSize: '12px',
                        fontWeight: '600',
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}>required</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Response Section */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              paddingBottom: '12px',
              borderBottom: `1px solid ${theme.border}`,
            }}>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                margin: 0,
              }}>
                Response
              </h3>
              <span style={{
                color: theme.textMuted,
                fontSize: '14px',
              }}>200 - application/json</span>
            </div>

            <p style={{
              fontSize: '14px',
              color: theme.textMuted,
              marginBottom: '24px',
            }}>
              Successful response
            </p>

            {/* Response jsonrpc field */}
            <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '16px',
              }}>
                <span style={{ color: theme.text, fontWeight: '500' }}>jsonrpc</span>
                <span style={{
                  backgroundColor: theme.bgTertiary,
                  color: theme.text,
                  fontSize: '12px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}>enum&lt;string&gt;</span>
                <span style={{
                  backgroundColor: 'rgba(220, 38, 38, 0.15)',
                  color: '#f25c5c',
                  fontSize: '12px',
                  fontWeight: '600',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}>required</span>
              </div>
              <p style={{ fontSize: '14px', color: theme.textMuted }}>
                Available options: <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px', color: theme.text }}>2.0</code>
              </p>
            </div>

            {/* Response id field */}
            <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}>
                <span style={{ color: theme.text, fontWeight: '500' }}>id</span>
                <span style={{
                  backgroundColor: theme.bgTertiary,
                  color: theme.text,
                  fontSize: '12px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}>string</span>
                <span style={{
                  backgroundColor: 'rgba(220, 38, 38, 0.15)',
                  color: '#f25c5c',
                  fontSize: '12px',
                  fontWeight: '600',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}>required</span>
              </div>
            </div>

            {/* Response result field */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '16px',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                <span style={{ color: theme.text, fontWeight: '500' }}>result</span>
                <span style={{
                  backgroundColor: theme.bgTertiary,
                  color: theme.text,
                  fontSize: '12px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}>object</span>
                <span style={{
                  backgroundColor: 'rgba(220, 38, 38, 0.15)',
                  color: '#f25c5c',
                  fontSize: '12px',
                  fontWeight: '600',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}>required</span>
              </div>

              {/* Option Tabs */}
              <div style={{
                backgroundColor: theme.bgCard,
                borderRadius: '8px',
                border: `1px solid ${theme.border}`,
                overflow: 'hidden',
              }}>
                {/* Tab Headers */}
                <div style={{
                  display: 'flex',
                  borderBottom: `1px solid ${theme.border}`,
                }}>
                  <button
                    onClick={() => setActiveResponseOption(1)}
                    style={{
                      padding: '12px 20px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: activeResponseOption === 1 ? theme.text : theme.textMuted,
                      fontSize: '14px',
                      fontWeight: activeResponseOption === 1 ? '500' : '400',
                      cursor: 'pointer',
                      borderBottom: activeResponseOption === 1 ? `2px solid ${theme.text}` : '2px solid transparent',
                      marginBottom: '-1px',
                    }}
                  >Option 1</button>
                  <button
                    onClick={() => setActiveResponseOption(2)}
                    style={{
                      padding: '12px 20px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: activeResponseOption === 2 ? theme.text : theme.textMuted,
                      fontSize: '14px',
                      fontWeight: activeResponseOption === 2 ? '500' : '400',
                      cursor: 'pointer',
                      borderBottom: activeResponseOption === 2 ? `2px solid ${theme.text}` : '2px solid transparent',
                      marginBottom: '-1px',
                    }}
                  >Option 2</button>
                </div>

                <div style={{ padding: '20px' }}>
                  {/* Show/Hide child attributes toggle */}
                  <div
                    onClick={() => setShowResultChildren(!showResultChildren)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      marginBottom: '20px',
                      color: theme.textMuted,
                      fontSize: '14px',
                      cursor: 'pointer',
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
                        transform: showResultChildren ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                      }}
                    >
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                    {showResultChildren ? 'Hide child attributes' : 'Show child attributes'}
                  </div>

                  {/* Content shown when expanded */}
                  {showResultChildren && (
                    <>
                      {/* Option 1 Content - Success Response */}
                      {activeResponseOption === 1 && (
                        <>
                          {/* result.success */}
                          <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '16px',
                              marginBottom: '8px',
                              flexWrap: 'wrap',
                            }}>
                              <span style={{ color: theme.textMuted, fontSize: '14px' }}>result.</span>
                              <span style={{ color: theme.text, fontWeight: '500' }}>success</span>
                              <span style={{
                                backgroundColor: theme.bgTertiary,
                                color: theme.text,
                                fontSize: '12px',
                                padding: '2px 8px',
                                borderRadius: '4px',
                              }}>enum&lt;boolean&gt;</span>
                              <span style={{
                                backgroundColor: 'rgba(220, 38, 38, 0.15)',
                                color: '#f25c5c',
                                fontSize: '12px',
                                fontWeight: '600',
                                padding: '2px 8px',
                                borderRadius: '4px',
                              }}>required</span>
                            </div>
                            <p style={{ fontSize: '14px', color: theme.textMuted, marginBottom: '8px' }}>
                              Indicates if the request was successful
                            </p>
                            <p style={{ fontSize: '14px', color: theme.textMuted }}>
                              Available options: <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px' }}>true</code> , <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px' }}>false</code>
                            </p>
                          </div>

                          {/* result.user_unique_id */}
                          <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '16px',
                              marginBottom: '8px',
                              flexWrap: 'wrap',
                            }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth="2">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                              </svg>
                              <span style={{ color: theme.textMuted, fontSize: '14px' }}>result.</span>
                              <span style={{ color: theme.text, fontWeight: '500' }}>user_unique_id</span>
                              <span style={{
                                backgroundColor: theme.bgTertiary,
                                color: theme.text,
                                fontSize: '12px',
                                padding: '2px 8px',
                                borderRadius: '4px',
                              }}>string</span>
                              <span style={{
                                backgroundColor: 'rgba(220, 38, 38, 0.15)',
                                color: '#f25c5c',
                                fontSize: '12px',
                                fontWeight: '600',
                                padding: '2px 8px',
                                borderRadius: '4px',
                              }}>required</span>
                            </div>
                            <p style={{ fontSize: '14px', color: theme.textMuted }}>
                              The Unique ID of the user
                            </p>
                          </div>

                          {/* result.email_address */}
                          <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '16px',
                              marginBottom: '8px',
                              flexWrap: 'wrap',
                            }}>
                              <span style={{ color: theme.textMuted, fontSize: '14px' }}>result.</span>
                              <span style={{ color: theme.text, fontWeight: '500' }}>email_address</span>
                              <span style={{
                                backgroundColor: theme.bgTertiary,
                                color: theme.text,
                                fontSize: '12px',
                                padding: '2px 8px',
                                borderRadius: '4px',
                              }}>string&lt;email&gt;</span>
                              <span style={{
                                backgroundColor: 'rgba(220, 38, 38, 0.15)',
                                color: '#f25c5c',
                                fontSize: '12px',
                                fontWeight: '600',
                                padding: '2px 8px',
                                borderRadius: '4px',
                              }}>required</span>
                            </div>
                            <p style={{ fontSize: '14px', color: theme.textMuted }}>
                              The email address of the user
                            </p>
                          </div>

                          {/* result.display_name */}
                          <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '16px',
                              marginBottom: '8px',
                              flexWrap: 'wrap',
                            }}>
                              <span style={{ color: theme.textMuted, fontSize: '14px' }}>result.</span>
                              <span style={{ color: theme.text, fontWeight: '500' }}>display_name</span>
                              <span style={{
                                backgroundColor: theme.bgTertiary,
                                color: theme.text,
                                fontSize: '12px',
                                padding: '2px 8px',
                                borderRadius: '4px',
                              }}>string</span>
                            </div>
                            <p style={{ fontSize: '14px', color: theme.textMuted }}>
                              The display name of the user
                            </p>
                          </div>

                          {/* result.verified_identity */}
                          <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '16px',
                              marginBottom: '8px',
                              flexWrap: 'wrap',
                            }}>
                              <span style={{ color: theme.textMuted, fontSize: '14px' }}>result.</span>
                              <span style={{ color: theme.text, fontWeight: '500' }}>verified_identity</span>
                              <span style={{
                                backgroundColor: theme.bgTertiary,
                                color: theme.text,
                                fontSize: '12px',
                                padding: '2px 8px',
                                borderRadius: '4px',
                              }}>boolean</span>
                            </div>
                            <p style={{ fontSize: '14px', color: theme.textMuted }}>
                              Whether the user's identity has been verified
                            </p>
                          </div>

                          {/* result.financial_accounts */}
                          <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '16px',
                              marginBottom: '8px',
                              flexWrap: 'wrap',
                            }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth="2">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                              </svg>
                              <span style={{ color: theme.textMuted, fontSize: '14px' }}>result.</span>
                              <span style={{ color: theme.text, fontWeight: '500' }}>financial_accounts</span>
                              <span style={{
                                backgroundColor: theme.bgTertiary,
                                color: theme.text,
                                fontSize: '12px',
                                padding: '2px 8px',
                                borderRadius: '4px',
                              }}>object[]</span>
                            </div>
                            <p style={{ fontSize: '14px', color: theme.textMuted }}>
                              Array of the user's linked financial accounts
                            </p>
                          </div>

                          {/* result.verifications */}
                          <div>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '16px',
                              marginBottom: '8px',
                              flexWrap: 'wrap',
                            }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth="2">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                              </svg>
                              <span style={{ color: theme.textMuted, fontSize: '14px' }}>result.</span>
                              <span style={{ color: theme.text, fontWeight: '500' }}>verifications</span>
                              <span style={{
                                backgroundColor: theme.bgTertiary,
                                color: theme.text,
                                fontSize: '12px',
                                padding: '2px 8px',
                                borderRadius: '4px',
                              }}>object[]</span>
                            </div>
                            <p style={{ fontSize: '14px', color: theme.textMuted }}>
                              Array of verification records for the user
                            </p>
                          </div>
                        </>
                      )}

                      {/* Option 2 Content - Error Response */}
                      {activeResponseOption === 2 && (
                        <>
                          {/* result.success */}
                          <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '16px',
                              marginBottom: '8px',
                              flexWrap: 'wrap',
                            }}>
                              <span style={{ color: theme.textMuted, fontSize: '14px' }}>result.</span>
                              <span style={{ color: theme.text, fontWeight: '500' }}>success</span>
                              <span style={{
                                backgroundColor: theme.bgTertiary,
                                color: theme.text,
                                fontSize: '12px',
                                padding: '2px 8px',
                                borderRadius: '4px',
                              }}>enum&lt;boolean&gt;</span>
                              <span style={{
                                backgroundColor: 'rgba(220, 38, 38, 0.15)',
                                color: '#f25c5c',
                                fontSize: '12px',
                                fontWeight: '600',
                                padding: '2px 8px',
                                borderRadius: '4px',
                              }}>required</span>
                            </div>
                            <p style={{ fontSize: '14px', color: theme.textMuted, marginBottom: '8px' }}>
                              Indicates the request failed
                            </p>
                            <p style={{ fontSize: '14px', color: theme.textMuted }}>
                              Available options: <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px' }}>true</code> , <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px' }}>false</code>
                            </p>
                          </div>

                          {/* result.message */}
                          <div>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '16px',
                              marginBottom: '8px',
                              flexWrap: 'wrap',
                            }}>
                              <span style={{ color: theme.textMuted, fontSize: '14px' }}>result.</span>
                              <span style={{ color: theme.text, fontWeight: '500' }}>message</span>
                              <span style={{
                                backgroundColor: theme.bgTertiary,
                                color: theme.text,
                                fontSize: '12px',
                                padding: '2px 8px',
                                borderRadius: '4px',
                              }}>string</span>
                              <span style={{
                                backgroundColor: 'rgba(220, 38, 38, 0.15)',
                                color: '#f25c5c',
                                fontSize: '12px',
                                fontWeight: '600',
                                padding: '2px 8px',
                                borderRadius: '4px',
                              }}>required</span>
                            </div>
                            <p style={{ fontSize: '14px', color: theme.textMuted }}>
                              Error message describing why the request failed
                            </p>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation inside left column */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: '24px',
            borderTop: `1px solid ${theme.border}`,
            marginTop: '40px',
            marginBottom: '40px',
          }}>
            <a
              href="#welcome"
              onClick={(e) => { e.preventDefault(); scrollToSection('welcome'); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                color: theme.text,
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
              Welcome to the SHARE Protocol API
            </a>
            <a
              href="#create-contract"
              onClick={(e) => { e.preventDefault(); scrollToSection('create-contract'); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                color: theme.text,
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Create Contract
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </a>
          </div>

          {/* Footer inside left column */}
          <footer style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '24px',
            borderTop: `1px solid ${theme.border}`,
          }}>
            <a
              href="https://github.com/formless-eng"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: theme.textDimmed, transition: 'color 0.2s ease' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <span style={{ color: theme.textDimmed, fontSize: '14px' }}>
              Powered by{' '}
              <a
                href="https://mintlify.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'white', fontWeight: '600', textDecoration: 'none' }}
              >
                mintlify
              </a>
            </span>
          </footer>
                </div>
                {/* End inner content wrapper */}
              </div>
              {/* End Left Column */}

            {/* Right Column - Code Panels (Fixed) */}
            <RightCodePanel
              title="Identity Lookup"
              codeByLanguage={identityLookupCode}
              responseJson={responseSchemas.identityLookup}
              theme={theme}
              copiedCode={copiedCode}
              copyToClipboard={copyToClipboard}
              codeId="code-identity"
              responseId="response-identity"
            />
            {/* End Right Column */}
          </div>
          {/* End Two Column Layout */}

          </>
        )}

        {activeSection === 'create-contract' && (
          <>
            {/* Two Column Layout */}
            <div className="api-two-column-layout" style={{ display: 'flex' }}>
              {/* Left Column - Documentation */}
              <div
                className="left-content-column"
                style={{
                  flex: 1,
                  minWidth: 0,
                  overflow: 'hidden',
                }}>
                {/* Inner content wrapper */}
                <div>
                {/* Breadcrumb */}
                <div style={{
                  fontSize: '14px',
                  color: theme.textDimmed,
                  marginBottom: '16px',
                }}>
                  Revenue Sharing
                </div>

                {/* Title with Copy page button */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
                gap: '16px',
              }}>
                <h2 className="page-title" style={{
                  fontSize: '36px',
                  fontWeight: '700',
                  margin: 0,
                  lineHeight: '1.2',
                  whiteSpace: 'nowrap',
                }}>
                  Create Contract
                </h2>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <button
                    onClick={() => setCopyDropdownOpen(copyDropdownOpen === 'create-contract' ? null : 'create-contract')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      backgroundColor: 'transparent',
                      border: `1px solid ${theme.border}`,
                      borderRadius: '6px',
                      color: theme.textMuted,
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                    Copy page
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </button>
                  {copyDropdownOpen === 'create-contract' && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '8px',
                      backgroundColor: theme.bgSecondary,
                      border: `1px solid ${theme.border}`,
                      borderRadius: '8px',
                      padding: '8px 0',
                      minWidth: '280px',
                      zIndex: 1000,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    }}>
                      <button className="dropdown-item" onClick={() => handleCopyPage('create-contract-page', 'create-contract')} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                        <div><div style={{ fontWeight: '500' }}>Copy page</div><div style={{ fontSize: '12px', color: theme.textMuted }}>Copy page as Markdown for LLMs</div></div>
                      </button>
                      <button className="dropdown-item" onClick={() => handleViewAsMarkdown('create-contract')} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        <div><div style={{ fontWeight: '500' }}>View as Markdown <span style={{ fontSize: '12px' }}>↗</span></div><div style={{ fontSize: '12px', color: theme.textMuted }}>View this page as plain text</div></div>
                      </button>
                      <div style={{ height: '1px', backgroundColor: theme.border, margin: '8px 0' }} />
                      <button className="dropdown-item" onClick={() => handleOpenInChatGPT('create-contract')} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/></svg>
                        <div><div style={{ fontWeight: '500' }}>Open in ChatGPT <span style={{ fontSize: '12px' }}>↗</span></div><div style={{ fontSize: '12px', color: theme.textMuted }}>Ask questions about this page</div></div>
                      </button>
                      <button className="dropdown-item" onClick={() => handleOpenInClaude('create-contract')} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4.709 15.955l4.72-2.647.08-.08 2.726-1.529.08-.08 6.467-3.627c.344-.193.554-.57.537-.965a1.077 1.077 0 0 0-.601-.913l-.644-.322a.537.537 0 0 0-.483 0L4.144 12.48a1.077 1.077 0 0 0-.601.913c-.016.394.193.772.538.965l.628.354v1.243z"/><path d="M19.291 8.045l-4.72 2.647-.08.08-2.726 1.529-.08.08-6.467 3.627a1.077 1.077 0 0 0-.537.965c.017.378.242.716.601.913l.644.322a.537.537 0 0 0 .483 0l13.447-7.545c.36-.193.584-.535.601-.913a1.077 1.077 0 0 0-.538-.965l-.628-.354v-1.243z"/></svg>
                        <div><div style={{ fontWeight: '500' }}>Open in Claude <span style={{ fontSize: '12px' }}>↗</span></div><div style={{ fontSize: '12px', color: theme.textMuted }}>Ask questions about this page</div></div>
                      </button>
                      <button className="dropdown-item" onClick={() => handleOpenInPerplexity('create-contract')} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
                        <div><div style={{ fontWeight: '500' }}>Open in Perplexity <span style={{ fontSize: '12px' }}>↗</span></div><div style={{ fontSize: '12px', color: theme.textMuted }}>Ask questions about this page</div></div>
                      </button>
                      <div style={{ height: '1px', backgroundColor: theme.border, margin: '8px 0' }} />
                      <button className="dropdown-item" onClick={handleCopyMCPServer} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                        <div><div style={{ fontWeight: '500' }}>Copy MCP Server</div><div style={{ fontSize: '12px', color: theme.textMuted }}>Copy MCP Server URL to clipboard</div></div>
                      </button>
                      <button className="dropdown-item" onClick={handleConnectToCursor} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                        <div><div style={{ fontWeight: '500' }}>Connect to Cursor <span style={{ fontSize: '12px' }}>↗</span></div><div style={{ fontSize: '12px', color: theme.textMuted }}>Install MCP Server on Cursor</div></div>
                      </button>
                      <button className="dropdown-item" onClick={handleConnectToVSCode} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                        <div><div style={{ fontWeight: '500' }}>Connect to VS Code <span style={{ fontSize: '12px' }}>↗</span></div><div style={{ fontSize: '12px', color: theme.textMuted }}>Install MCP Server on VS Code</div></div>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="page-subtitle" style={{
                fontSize: '18px',
                color: theme.textMuted,
                marginBottom: '24px',
              }}>
                Create a revenue sharing smart contract
              </p>

              {/* API Endpoint Bar */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: theme.bgCard,
                borderRadius: '8px',
                border: `1px solid ${theme.border}`,
                marginBottom: '32px',
                overflow: 'hidden',
              }}>
                <span style={{
                  backgroundColor: isDarkMode ? '#1a2744' : '#dbeafe',
                  color: '#60a5fa',
                  fontSize: '14px',
                  fontWeight: '700',
                  padding: '10px 16px',
                }}>POST</span>
                <code style={{
                  fontSize: '14px',
                  color: theme.textSecondary,
                  fontFamily: 'Monaco, Consolas, monospace',
                  padding: '10px 16px',
                  borderLeft: `1px solid ${theme.border}`,
                  borderRight: `1px solid ${theme.border}`,
                }}>/v1#contracts_create</code>
                <button
                  onClick={() => { handlePlaygroundEndpointChange('contract_create'); setTryItOpen(true); }}
                  style={{
                  backgroundColor: '#3064e3',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  padding: '10px 20px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  Try it
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              </div>

              {/* Method Description */}
              <p style={{
                fontSize: '16px',
                color: theme.textSecondary,
                marginBottom: '40px',
                lineHeight: '1.7',
              }}>
                Create a revenue sharing smart contract on the blockchain to automatically split payments among recipients and community members.
              </p>

          {/* Authorizations Section */}
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '24px',
              paddingBottom: '12px',
              borderBottom: `1px solid ${theme.border}`,
            }}>
              Authorizations
            </h3>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '16px',
            }}>
              <span style={{ color: theme.text, fontWeight: '500' }}>Authorization</span>
              <span style={{
                backgroundColor: theme.bgTertiary,
                color: theme.text,
                fontSize: '12px',
                padding: '2px 8px',
                borderRadius: '4px',
              }}>string</span>
              <span style={{
                backgroundColor: theme.bgTertiary,
                color: theme.text,
                fontSize: '12px',
                padding: '2px 8px',
                borderRadius: '4px',
              }}>header</span>
              <span style={{
                backgroundColor: 'rgba(220, 38, 38, 0.15)',
                color: '#f25c5c',
                fontSize: '12px',
                fontWeight: '600',
                padding: '2px 8px',
                borderRadius: '4px',
              }}>required</span>
            </div>
            <p style={{
              fontSize: '14px',
              color: theme.textMuted,
            }}>
              JWT token with Unique ID identification
            </p>
          </div>

          {/* Body Section */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              paddingBottom: '12px',
              borderBottom: `1px solid ${theme.border}`,
            }}>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                margin: 0,
              }}>
                Body
              </h3>
              <span style={{
                color: theme.textMuted,
                fontSize: '14px',
              }}>application/json</span>
            </div>

            {/* jsonrpc field */}
            <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                <span style={{ color: theme.text, fontWeight: '500' }}>jsonrpc</span>
                <span style={{ backgroundColor: theme.bgTertiary, color: theme.text, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}>enum&lt;string&gt;</span>
                <span style={{ backgroundColor: theme.bgTertiary, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}><span style={{ color: theme.textMuted }}>default:</span><span style={{ color: theme.text }}>2.0</span></span>
                <span style={{ backgroundColor: 'rgba(220, 38, 38, 0.15)', color: '#f25c5c', fontSize: '12px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px' }}>required</span>
              </div>
              <p style={{ fontSize: '14px', color: theme.textMuted }}>
                Available options: <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px', color: theme.text }}>2.0</code>
              </p>
            </div>

            {/* id field */}
            <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                <span style={{ color: theme.text, fontWeight: '500' }}>id</span>
                <span style={{ backgroundColor: theme.bgTertiary, color: theme.text, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}>string</span>
                <span style={{ backgroundColor: theme.bgTertiary, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}><span style={{ color: theme.textMuted }}>default:</span><span style={{ color: theme.text }}>1</span></span>
                <span style={{ backgroundColor: 'rgba(220, 38, 38, 0.15)', color: '#f25c5c', fontSize: '12px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px' }}>required</span>
              </div>
            </div>

            {/* method field */}
            <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <span style={{ color: theme.textMuted, fontWeight: '400' }}>method</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <span style={{ backgroundColor: theme.bgTertiary, color: theme.text, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}>enum&lt;string&gt;</span>
                <span style={{ backgroundColor: theme.bgTertiary, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}><span style={{ color: theme.textMuted }}>default:</span><span style={{ color: theme.text }}>contracts_create</span></span>
                <span style={{ backgroundColor: 'rgba(220, 38, 38, 0.15)', color: '#f25c5c', fontSize: '12px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px' }}>required</span>
              </div>
              <p style={{ fontSize: '14px', color: theme.textMuted }}>
                Available options: <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px', color: theme.text }}>contracts_create</code>
              </p>
            </div>

            {/* params field */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <span style={{ color: theme.text, fontWeight: '500' }}>params</span>
                <span style={{ backgroundColor: theme.bgTertiary, color: theme.text, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}>object</span>
                <span style={{ backgroundColor: 'rgba(220, 38, 38, 0.15)', color: '#f25c5c', fontSize: '12px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px' }}>required</span>
              </div>

              {/* Collapsible params container */}
              <div style={{ backgroundColor: theme.bgCard, borderRadius: '8px', border: `1px solid ${theme.border}`, overflow: 'hidden' }}>
                <div
                  onClick={() => setShowCreateContractParamsChildren(!showCreateContractParamsChildren)}
                  style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', color: theme.textMuted, fontSize: '14px', cursor: 'pointer', transition: 'background-color 0.2s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.bgHover}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: showCreateContractParamsChildren ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                  {showCreateContractParamsChildren ? 'Hide child attributes' : 'Show child attributes'}
                </div>

                {showCreateContractParamsChildren && (
                  <div style={{ padding: '0 20px 20px 20px', borderTop: `1px solid ${theme.border}` }}>
                    {/* params.type */}
                    <div style={{ paddingTop: '16px', marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <span style={{ color: theme.textMuted, fontSize: '14px' }}>params.</span>
                        <span style={{ color: theme.textMuted, fontWeight: '400' }}>type</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <span style={{ backgroundColor: theme.bgTertiary, color: theme.text, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}>enum&lt;string&gt;</span>
                        <span style={{ backgroundColor: theme.bgTertiary, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}><span style={{ color: theme.textMuted }}>default:</span><span style={{ color: theme.text }}>digital_property_with_revenue_share</span></span>
                        <span style={{ backgroundColor: 'rgba(220, 38, 38, 0.15)', color: '#f25c5c', fontSize: '12px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px' }}>required</span>
                      </div>
                      <p style={{ fontSize: '14px', color: theme.textMuted }}>Available options: <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px', color: theme.text }}>digital_property_with_revenue_share</code></p>
                    </div>

                    {/* params.network */}
                    <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <span style={{ color: theme.textMuted, fontSize: '14px' }}>params.</span>
                        <span style={{ color: theme.textMuted, fontWeight: '400' }}>network</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <span style={{ backgroundColor: theme.bgTertiary, color: theme.text, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}>enum&lt;string&gt;</span>
                        <span style={{ backgroundColor: theme.bgTertiary, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}><span style={{ color: theme.textMuted }}>default:</span><span style={{ color: theme.text }}>base</span></span>
                        <span style={{ backgroundColor: 'rgba(220, 38, 38, 0.15)', color: '#f25c5c', fontSize: '12px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px' }}>required</span>
                      </div>
                      <p style={{ fontSize: '14px', color: theme.textMuted }}>Available options: <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px', color: theme.text }}>base</code></p>
                    </div>

                    {/* params.title */}
                    <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <span style={{ color: theme.textMuted, fontSize: '14px' }}>params.</span>
                        <span style={{ color: theme.textMuted, fontWeight: '400' }}>title</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        <span style={{ backgroundColor: theme.bgTertiary, color: theme.text, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}>string</span>
                        <span style={{ backgroundColor: theme.bgTertiary, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}><span style={{ color: theme.textMuted }}>default:</span><span style={{ color: theme.text }}>HYPERMAX SNEAKER RELEASE</span></span>
                        <span style={{ backgroundColor: 'rgba(220, 38, 38, 0.15)', color: '#f25c5c', fontSize: '12px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px' }}>required</span>
                      </div>
                    </div>

                    {/* params.description */}
                    <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <span style={{ color: theme.textMuted, fontSize: '14px' }}>params.</span>
                        <span style={{ color: theme.textMuted, fontWeight: '400' }}>description</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        <span style={{ backgroundColor: theme.bgTertiary, color: theme.text, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}>string</span>
                        <span style={{ backgroundColor: theme.bgTertiary, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}><span style={{ color: theme.textMuted }}>default:</span><span style={{ color: theme.text }}>Community revenue sharing for HYPERMAX sneaker release</span></span>
                        <span style={{ backgroundColor: 'rgba(220, 38, 38, 0.15)', color: '#f25c5c', fontSize: '12px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px' }}>required</span>
                      </div>
                    </div>

                    {/* params.creator_name */}
                    <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <span style={{ color: theme.textMuted, fontSize: '14px' }}>params.</span>
                        <span style={{ color: theme.textMuted, fontWeight: '400' }}>creator_name</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        <span style={{ backgroundColor: theme.bgTertiary, color: theme.text, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}>string</span>
                        <span style={{ backgroundColor: theme.bgTertiary, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}><span style={{ color: theme.textMuted }}>default:</span><span style={{ color: theme.text }}>HYPERMAX Brand</span></span>
                        <span style={{ backgroundColor: 'rgba(220, 38, 38, 0.15)', color: '#f25c5c', fontSize: '12px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px' }}>required</span>
                      </div>
                    </div>

                    {/* params.revenue_share */}
                    <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <span style={{ color: theme.textMuted, fontSize: '14px' }}>params.</span>
                        <span style={{ color: theme.textMuted, fontWeight: '400' }}>revenue_share</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
                        <span style={{ backgroundColor: theme.bgTertiary, color: theme.text, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}>object</span>
                        <span style={{ backgroundColor: 'rgba(220, 38, 38, 0.15)', color: '#f25c5c', fontSize: '12px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px' }}>required</span>
                      </div>
                      
                      {/* Collapsible revenue_share children */}
                      <div style={{ backgroundColor: theme.bgCard, borderRadius: '8px', border: `1px solid ${theme.border}`, overflow: 'hidden' }}>
                        <div onClick={() => setShowRevenueShareChildren(!showRevenueShareChildren)} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', color: theme.textMuted, fontSize: '14px', cursor: 'pointer' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: showRevenueShareChildren ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}><path d="M9 18l6-6-6-6"/></svg>
                          {showRevenueShareChildren ? 'Hide child attributes' : 'Show child attributes'}
                        </div>
                        
                        {showRevenueShareChildren && (
                          <div style={{ padding: '0 20px 20px 20px', borderTop: `1px solid ${theme.border}` }}>
                            {/* params.revenue_share.recipients */}
                            <div style={{ paddingTop: '16px', marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                <span style={{ color: theme.textMuted, fontSize: '14px' }}>params.revenue_share.</span>
                                <span style={{ color: theme.textMuted, fontWeight: '400' }}>recipients</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
                                <span style={{ backgroundColor: theme.bgTertiary, color: theme.text, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}>object</span>
                                <span style={{ backgroundColor: 'rgba(220, 38, 38, 0.15)', color: '#f25c5c', fontSize: '12px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px' }}>required</span>
                              </div>
                              
                              {/* Collapsible recipients children */}
                              <div style={{ backgroundColor: theme.bgSecondary, borderRadius: '8px', border: `1px solid ${theme.border}`, overflow: 'hidden' }}>
                                <div onClick={() => setShowRecipientsChildren(!showRecipientsChildren)} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', color: theme.textMuted, fontSize: '14px', cursor: 'pointer' }}>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: showRecipientsChildren ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}><path d="M9 18l6-6-6-6"/></svg>
                                  {showRecipientsChildren ? 'Hide child attributes' : 'Show child attributes'}
                                </div>
                                
                                {showRecipientsChildren && (
                                  <div style={{ padding: '0 20px 20px 20px', borderTop: `1px solid ${theme.border}` }}>
                                    <div style={{ paddingTop: '16px' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                        <span style={{ color: theme.textMuted, fontSize: '14px' }}>params.revenue_share.recipients.</span>
                                        <span style={{ color: theme.textMuted, fontWeight: '400' }}>{'{key}'}</span>
                                      </div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                                        <span style={{ backgroundColor: theme.bgTertiary, color: theme.text, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}>number</span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* params.revenue_share.community_allocation_percent */}
                            <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                <span style={{ color: theme.textMuted, fontSize: '14px' }}>params.revenue_share.</span>
                                <span style={{ color: theme.textMuted, fontWeight: '400' }}>community_allocation_percent</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                                <span style={{ backgroundColor: theme.bgTertiary, color: theme.text, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}>number</span>
                                <span style={{ backgroundColor: theme.bgTertiary, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}><span style={{ color: theme.textMuted }}>default:</span><span style={{ color: theme.text }}>100</span></span>
                                <span style={{ backgroundColor: 'rgba(220, 38, 38, 0.15)', color: '#f25c5c', fontSize: '12px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px' }}>required</span>
                              </div>
                            </div>
                            
                            {/* params.revenue_share.community_split_count */}
                            <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                <span style={{ color: theme.textMuted, fontSize: '14px' }}>params.revenue_share.</span>
                                <span style={{ color: theme.textMuted, fontWeight: '400' }}>community_split_count</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                                <span style={{ backgroundColor: theme.bgTertiary, color: theme.text, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}>integer</span>
                                <span style={{ backgroundColor: theme.bgTertiary, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}><span style={{ color: theme.textMuted }}>default:</span><span style={{ color: theme.text }}>100</span></span>
                                <span style={{ backgroundColor: 'rgba(220, 38, 38, 0.15)', color: '#f25c5c', fontSize: '12px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px' }}>required</span>
                              </div>
                            </div>
                            
                            {/* params.revenue_share.distribution_unit */}
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                <span style={{ color: theme.textMuted, fontSize: '14px' }}>params.revenue_share.</span>
                                <span style={{ color: theme.textMuted, fontWeight: '400' }}>distribution_unit</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
                                <span style={{ backgroundColor: theme.bgTertiary, color: theme.text, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}>object</span>
                                <span style={{ backgroundColor: 'rgba(220, 38, 38, 0.15)', color: '#f25c5c', fontSize: '12px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px' }}>required</span>
                              </div>
                              
                              {/* Collapsible distribution_unit children */}
                              <div style={{ backgroundColor: theme.bgSecondary, borderRadius: '8px', border: `1px solid ${theme.border}`, overflow: 'hidden' }}>
                                <div onClick={() => setShowDistributionUnitChildren(!showDistributionUnitChildren)} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', color: theme.textMuted, fontSize: '14px', cursor: 'pointer' }}>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: showDistributionUnitChildren ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}><path d="M9 18l6-6-6-6"/></svg>
                                  {showDistributionUnitChildren ? 'Hide child attributes' : 'Show child attributes'}
                                </div>
                                
                                {showDistributionUnitChildren && (
                                  <div style={{ padding: '0 20px 20px 20px', borderTop: `1px solid ${theme.border}` }}>
                                    {/* distribution_unit.value */}
                                    <div style={{ paddingTop: '16px', marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                        <span style={{ color: theme.textMuted, fontSize: '14px' }}>params.revenue_share.distribution_unit.</span>
                                        <span style={{ color: theme.textMuted, fontWeight: '400' }}>value</span>
                                      </div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                                        <span style={{ backgroundColor: theme.bgTertiary, color: theme.text, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}>number</span>
                                        <span style={{ backgroundColor: theme.bgTertiary, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}><span style={{ color: theme.textMuted }}>default:</span><span style={{ color: theme.text }}>1</span></span>
                                        <span style={{ backgroundColor: 'rgba(220, 38, 38, 0.15)', color: '#f25c5c', fontSize: '12px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px' }}>required</span>
                                      </div>
                                    </div>
                                    
                                    {/* distribution_unit.currency */}
                                    <div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                        <span style={{ color: theme.textMuted, fontSize: '14px' }}>params.revenue_share.distribution_unit.</span>
                                        <span style={{ color: theme.textMuted, fontWeight: '400' }}>currency</span>
                                      </div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                        <span style={{ backgroundColor: theme.bgTertiary, color: theme.text, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}>enum&lt;string&gt;</span>
                                        <span style={{ backgroundColor: theme.bgTertiary, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}><span style={{ color: theme.textMuted }}>default:</span><span style={{ color: theme.text }}>USD</span></span>
                                        <span style={{ backgroundColor: 'rgba(220, 38, 38, 0.15)', color: '#f25c5c', fontSize: '12px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px' }}>required</span>
                                      </div>
                                      <p style={{ fontSize: '14px', color: theme.textMuted }}>Available options: <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px', color: theme.text }}>USD</code> , <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px', color: theme.text }}>USDC</code></p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* params.revenue_source */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <span style={{ color: theme.textMuted, fontSize: '14px' }}>params.</span>
                        <span style={{ color: theme.textMuted, fontWeight: '400' }}>revenue_source</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
                        <span style={{ backgroundColor: theme.bgTertiary, color: theme.text, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}>object</span>
                      </div>
                      
                      {/* Collapsible revenue_source children */}
                      <div style={{ backgroundColor: theme.bgCard, borderRadius: '8px', border: `1px solid ${theme.border}`, overflow: 'hidden' }}>
                        <div onClick={() => setShowRevenueSourceChildren(!showRevenueSourceChildren)} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', color: theme.textMuted, fontSize: '14px', cursor: 'pointer' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: showRevenueSourceChildren ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}><path d="M9 18l6-6-6-6"/></svg>
                          {showRevenueSourceChildren ? 'Hide child attributes' : 'Show child attributes'}
                        </div>
                        
                        {showRevenueSourceChildren && (
                          <div style={{ padding: '0 20px 20px 20px', borderTop: `1px solid ${theme.border}` }}>
                            {/* params.revenue_source.product */}
                            <div style={{ paddingTop: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                <span style={{ color: theme.textMuted, fontSize: '14px' }}>params.revenue_source.</span>
                                <span style={{ color: theme.textMuted, fontWeight: '400' }}>product</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
                                <span style={{ backgroundColor: theme.bgTertiary, color: theme.text, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}>object</span>
                              </div>
                              
                              {/* Collapsible product children */}
                              <div style={{ backgroundColor: theme.bgSecondary, borderRadius: '8px', border: `1px solid ${theme.border}`, overflow: 'hidden' }}>
                                <div onClick={() => setShowRevenueSourceProductChildren(!showRevenueSourceProductChildren)} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', color: theme.textMuted, fontSize: '14px', cursor: 'pointer' }}>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: showRevenueSourceProductChildren ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}><path d="M9 18l6-6-6-6"/></svg>
                                  {showRevenueSourceProductChildren ? 'Hide child attributes' : 'Show child attributes'}
                                </div>
                                
                                {showRevenueSourceProductChildren && (
                                  <div style={{ padding: '0 20px 20px 20px', borderTop: `1px solid ${theme.border}` }}>
                                    <div style={{ paddingTop: '16px' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                        <span style={{ color: theme.textMuted, fontSize: '14px' }}>params.revenue_source.product.</span>
                                        <span style={{ color: theme.textMuted, fontWeight: '400' }}>type</span>
                                      </div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                        <span style={{ backgroundColor: theme.bgTertiary, color: theme.text, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}>enum&lt;string&gt;</span>
                                        <span style={{ backgroundColor: theme.bgTertiary, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}><span style={{ color: theme.textMuted }}>default:</span><span style={{ color: theme.text }}>product</span></span>
                                      </div>
                                      <p style={{ fontSize: '14px', color: theme.textMuted }}>Available options: <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px', color: theme.text }}>product</code></p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Response Section */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '12px', borderBottom: `1px solid ${theme.border}` }}>
              <h3 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>Response</h3>
              <span style={{ color: theme.textMuted, fontSize: '14px' }}>200 - application/json</span>
            </div>

            <p style={{ fontSize: '14px', color: theme.textMuted, marginBottom: '24px' }}>Successful response</p>

            {/* Response jsonrpc field */}
            <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <span style={{ color: theme.text, fontWeight: '500' }}>jsonrpc</span>
                <span style={{ backgroundColor: theme.bgTertiary, color: theme.text, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}>enum&lt;string&gt;</span>
                <span style={{ backgroundColor: 'rgba(220, 38, 38, 0.15)', color: '#f25c5c', fontSize: '12px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px' }}>required</span>
              </div>
              <p style={{ fontSize: '14px', color: theme.textMuted }}>Available options: <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px', color: theme.text }}>2.0</code></p>
            </div>

            {/* Response id field */}
            <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ color: theme.text, fontWeight: '500' }}>id</span>
                <span style={{ backgroundColor: theme.bgTertiary, color: theme.text, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}>string</span>
                <span style={{ backgroundColor: 'rgba(220, 38, 38, 0.15)', color: '#f25c5c', fontSize: '12px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px' }}>required</span>
              </div>
            </div>

            {/* Response result field */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <span style={{ color: theme.text, fontWeight: '500' }}>result</span>
                <span style={{ backgroundColor: theme.bgTertiary, color: theme.text, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}>object</span>
                <span style={{ backgroundColor: 'rgba(220, 38, 38, 0.15)', color: '#f25c5c', fontSize: '12px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px' }}>required</span>
              </div>

              <div style={{ backgroundColor: theme.bgCard, borderRadius: '8px', border: `1px solid ${theme.border}`, overflow: 'hidden' }}>
                <div style={{ display: 'flex', borderBottom: `1px solid ${theme.border}` }}>
                  <button onClick={() => setCreateContractResponseOption(1)} style={{ padding: '12px 20px', backgroundColor: 'transparent', border: 'none', color: createContractResponseOption === 1 ? theme.text : theme.textMuted, fontSize: '14px', fontWeight: createContractResponseOption === 1 ? '500' : '400', cursor: 'pointer', borderBottom: createContractResponseOption === 1 ? `2px solid ${theme.text}` : '2px solid transparent', marginBottom: '-1px' }}>Option 1</button>
                  <button onClick={() => setCreateContractResponseOption(2)} style={{ padding: '12px 20px', backgroundColor: 'transparent', border: 'none', color: createContractResponseOption === 2 ? theme.text : theme.textMuted, fontSize: '14px', fontWeight: createContractResponseOption === 2 ? '500' : '400', cursor: 'pointer', borderBottom: createContractResponseOption === 2 ? `2px solid ${theme.text}` : '2px solid transparent', marginBottom: '-1px' }}>Option 2</button>
                </div>

                <div style={{ padding: '20px' }}>
                  <div onClick={() => setShowCreateContractResultChildren(!showCreateContractResultChildren)} style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', color: theme.textMuted, fontSize: '14px', cursor: 'pointer' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: showCreateContractResultChildren ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}><path d="M9 18l6-6-6-6"/></svg>
                    {showCreateContractResultChildren ? 'Hide child attributes' : 'Show child attributes'}
                  </div>

                  {/* Option 1 - Success case */}
                  {showCreateContractResultChildren && createContractResponseOption === 1 && (
                    <>
                      <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <span style={{ color: theme.textMuted, fontSize: '14px' }}>result.</span>
                          <span style={{ color: theme.textMuted, fontWeight: '400' }}>status</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <span style={{ backgroundColor: theme.bgTertiary, color: theme.text, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}>enum&lt;string&gt;</span>
                          <span style={{ backgroundColor: 'rgba(220, 38, 38, 0.15)', color: '#f25c5c', fontSize: '12px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px' }}>required</span>
                        </div>
                        <p style={{ fontSize: '14px', color: theme.textMuted, marginBottom: '8px' }}>Status of the contract creation</p>
                        <p style={{ fontSize: '14px', color: theme.textMuted }}>Available options: <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px', color: theme.text }}>success</code></p>
                      </div>
                      <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <span style={{ color: theme.textMuted, fontSize: '14px' }}>result.</span>
                          <span style={{ color: theme.textMuted, fontWeight: '400' }}>code</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <span style={{ backgroundColor: theme.bgTertiary, color: theme.text, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}>enum&lt;integer&gt;</span>
                          <span style={{ backgroundColor: 'rgba(220, 38, 38, 0.15)', color: '#f25c5c', fontSize: '12px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px' }}>required</span>
                        </div>
                        <p style={{ fontSize: '14px', color: theme.textMuted, marginBottom: '8px' }}>HTTP status code</p>
                        <p style={{ fontSize: '14px', color: theme.textMuted }}>Available options: <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px', color: theme.text }}>200</code></p>
                      </div>
                      <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <span style={{ color: theme.textMuted, fontSize: '14px' }}>result.</span>
                          <span style={{ color: theme.textMuted, fontWeight: '400' }}>network_id</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <span style={{ backgroundColor: theme.bgTertiary, color: theme.text, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}>integer</span>
                        </div>
                        <p style={{ fontSize: '14px', color: theme.textMuted }}>The network ID where the contract was deployed</p>
                      </div>
                      <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <span style={{ color: theme.textMuted, fontSize: '14px' }}>result.</span>
                          <span style={{ color: theme.textMuted, fontWeight: '400' }}>blockchain_name</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <span style={{ backgroundColor: theme.bgTertiary, color: theme.text, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}>string</span>
                        </div>
                        <p style={{ fontSize: '14px', color: theme.textMuted }}>The name of the blockchain (e.g., 'base')</p>
                      </div>
                      <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <span style={{ color: theme.textMuted, fontSize: '14px' }}>result.</span>
                          <span style={{ color: theme.textMuted, fontWeight: '400' }}>revenue_share_smart_contract_address</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <span style={{ backgroundColor: theme.bgTertiary, color: theme.text, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}>string</span>
                        </div>
                        <p style={{ fontSize: '14px', color: theme.textMuted }}>The address of the deployed revenue sharing smart contract</p>
                      </div>
                      <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <span style={{ color: theme.textMuted, fontSize: '14px' }}>result.</span>
                          <span style={{ color: theme.textMuted, fontWeight: '400' }}>digital_property_contract_address</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <span style={{ backgroundColor: theme.bgTertiary, color: theme.text, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}>string</span>
                        </div>
                        <p style={{ fontSize: '14px', color: theme.textMuted }}>The address of the deployed digital property contract</p>
                      </div>
                      <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <span style={{ color: theme.textMuted, fontSize: '14px' }}>result.</span>
                          <span style={{ color: theme.textMuted, fontWeight: '400' }}>digital_property_contract_id</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <span style={{ backgroundColor: theme.bgTertiary, color: theme.text, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}>string</span>
                        </div>
                        <p style={{ fontSize: '14px', color: theme.textMuted }}>The ID of the digital property contract</p>
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <span style={{ color: theme.textMuted, fontSize: '14px' }}>result.</span>
                          <span style={{ color: theme.textMuted, fontWeight: '400' }}>join_splits_url</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <span style={{ backgroundColor: theme.bgTertiary, color: theme.text, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}>string&lt;uri&gt;</span>
                        </div>
                        <p style={{ fontSize: '14px', color: theme.textMuted }}>URL where community members can join the revenue split</p>
                      </div>
                    </>
                  )}

                  {/* Option 2 - Failure case */}
                  {showCreateContractResultChildren && createContractResponseOption === 2 && (
                    <>
                      <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <span style={{ color: theme.textMuted, fontSize: '14px' }}>result.</span>
                          <span style={{ color: theme.textMuted, fontWeight: '400' }}>status</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <span style={{ backgroundColor: theme.bgTertiary, color: theme.text, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}>enum&lt;string&gt;</span>
                          <span style={{ backgroundColor: 'rgba(220, 38, 38, 0.15)', color: '#f25c5c', fontSize: '12px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px' }}>required</span>
                        </div>
                        <p style={{ fontSize: '14px', color: theme.textMuted, marginBottom: '8px' }}>Status indicating failure</p>
                        <p style={{ fontSize: '14px', color: theme.textMuted }}>Available options: <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px', color: theme.text }}>failure</code></p>
                      </div>
                      <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${theme.border}` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <span style={{ color: theme.textMuted, fontSize: '14px' }}>result.</span>
                          <span style={{ color: theme.textMuted, fontWeight: '400' }}>code</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <span style={{ backgroundColor: theme.bgTertiary, color: theme.text, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}>integer</span>
                          <span style={{ backgroundColor: 'rgba(220, 38, 38, 0.15)', color: '#f25c5c', fontSize: '12px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px' }}>required</span>
                        </div>
                        <p style={{ fontSize: '14px', color: theme.textMuted }}>HTTP error status code</p>
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <span style={{ color: theme.textMuted, fontSize: '14px' }}>result.</span>
                          <span style={{ color: theme.textMuted, fontWeight: '400' }}>message</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <span style={{ backgroundColor: theme.bgTertiary, color: theme.text, fontSize: '12px', padding: '2px 8px', borderRadius: '4px' }}>string</span>
                          <span style={{ backgroundColor: 'rgba(220, 38, 38, 0.15)', color: '#f25c5c', fontSize: '12px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px' }}>required</span>
                        </div>
                        <p style={{ fontSize: '14px', color: theme.textMuted }}>Error message describing what went wrong</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '24px', borderTop: `1px solid ${theme.border}`, marginTop: '40px', marginBottom: '40px' }}>
            <a href="#identity-lookup" onClick={(e) => { e.preventDefault(); scrollToSection('identity-lookup'); }} style={{ display: 'flex', alignItems: 'center', gap: '16px', color: theme.text, textDecoration: 'none', fontSize: '14px', transition: 'opacity 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
              Identity Lookup
            </a>
            <a href="#fetch-split-data" onClick={(e) => { e.preventDefault(); scrollToSection('fetch-split-data'); }} style={{ display: 'flex', alignItems: 'center', gap: '16px', color: theme.text, textDecoration: 'none', fontSize: '14px', transition: 'opacity 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
              Fetch Split Data
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </a>
          </div>

          {/* Footer */}
          <footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px', borderTop: `1px solid ${theme.border}` }}>
            <a href="https://github.com/formless-eng" target="_blank" rel="noopener noreferrer" style={{ color: theme.textDimmed, transition: 'color 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = '#666'}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
            <span style={{ color: theme.textDimmed, fontSize: '14px' }}>Powered by{' '}<a href="https://mintlify.com" target="_blank" rel="noopener noreferrer" style={{ color: 'white', fontWeight: '600', textDecoration: 'none' }}>mintlify</a></span>
          </footer>
                </div>
              </div>

            {/* Right Column - Code Panels */}
            <RightCodePanel
              title="Create Revenue Sharing Contract"
              codeByLanguage={createContractCode}
              responseJson={responseSchemas.createContract}
              theme={theme}
              copiedCode={copiedCode}
              copyToClipboard={copyToClipboard}
              codeId="code-create-contract"
              responseId="response-create-contract"
            />
          </div>
          </>
        )}

        {/* Fetch Split Data Page Content */}
        {activeSection === 'fetch-split-data' && (
          <>
            {/* Two Column Layout */}
            <div className="api-two-column-layout" style={{ display: 'flex' }}>
              {/* Left Column - Documentation */}
              <div
                className="left-content-column"
                style={{
                  flex: 1,
                  minWidth: 0,
                  overflow: 'hidden',
                }}>
                {/* Inner content wrapper */}
                <div>
                {/* Breadcrumb */}
                <div style={{
                  fontSize: '14px',
                  color: theme.textDimmed,
                  marginBottom: '16px',
                }}>
                  Revenue Sharing
                </div>

                {/* Title with Copy page button */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
                gap: '16px',
              }}>
                <h2 className="page-title" style={{
                  fontSize: '36px',
                  fontWeight: '700',
                  margin: 0,
                  lineHeight: '1.2',
                  whiteSpace: 'nowrap',
                }}>
                  Fetch Split Data
                </h2>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <button
                    onClick={() => setCopyDropdownOpen(copyDropdownOpen === 'fetch-split-data' ? null : 'fetch-split-data')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      backgroundColor: 'transparent',
                      border: `1px solid ${theme.border}`,
                      borderRadius: '6px',
                      color: theme.textMuted,
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                    Copy page
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </button>
                  {copyDropdownOpen === 'fetch-split-data' && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '8px',
                      backgroundColor: theme.bgSecondary,
                      border: `1px solid ${theme.border}`,
                      borderRadius: '8px',
                      padding: '8px 0',
                      minWidth: '280px',
                      zIndex: 1000,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    }}>
                      <button className="dropdown-item" onClick={() => handleCopyPage('fetch-split-data-page', 'fetch-split-data')} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                        <div><div style={{ fontWeight: '500' }}>Copy page</div><div style={{ fontSize: '12px', color: theme.textMuted }}>Copy page as Markdown for LLMs</div></div>
                      </button>
                      <button className="dropdown-item" onClick={() => handleViewAsMarkdown('fetch-split-data')} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        <div><div style={{ fontWeight: '500' }}>View as Markdown <span style={{ fontSize: '12px' }}>↗</span></div><div style={{ fontSize: '12px', color: theme.textMuted }}>View this page as plain text</div></div>
                      </button>
                      <div style={{ height: '1px', backgroundColor: theme.border, margin: '8px 0' }} />
                      <button className="dropdown-item" onClick={() => handleOpenInChatGPT('fetch-split-data')} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/></svg>
                        <div><div style={{ fontWeight: '500' }}>Open in ChatGPT <span style={{ fontSize: '12px' }}>↗</span></div><div style={{ fontSize: '12px', color: theme.textMuted }}>Ask questions about this page</div></div>
                      </button>
                      <button className="dropdown-item" onClick={() => handleOpenInClaude('fetch-split-data')} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4.709 15.955l4.72-2.647.08-.08 2.726-1.529.08-.08 6.467-3.627c.344-.193.554-.57.537-.965a1.077 1.077 0 0 0-.601-.913l-.644-.322a.537.537 0 0 0-.483 0L4.144 12.48a1.077 1.077 0 0 0-.601.913c-.016.394.193.772.538.965l.628.354v1.243z"/><path d="M19.291 8.045l-4.72 2.647-.08.08-2.726 1.529-.08.08-6.467 3.627a1.077 1.077 0 0 0-.537.965c.017.378.242.716.601.913l.644.322a.537.537 0 0 0 .483 0l13.447-7.545c.36-.193.584-.535.601-.913a1.077 1.077 0 0 0-.538-.965l-.628-.354v-1.243z"/></svg>
                        <div><div style={{ fontWeight: '500' }}>Open in Claude <span style={{ fontSize: '12px' }}>↗</span></div><div style={{ fontSize: '12px', color: theme.textMuted }}>Ask questions about this page</div></div>
                      </button>
                      <button className="dropdown-item" onClick={() => handleOpenInPerplexity('fetch-split-data')} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
                        <div><div style={{ fontWeight: '500' }}>Open in Perplexity <span style={{ fontSize: '12px' }}>↗</span></div><div style={{ fontSize: '12px', color: theme.textMuted }}>Ask questions about this page</div></div>
                      </button>
                      <div style={{ height: '1px', backgroundColor: theme.border, margin: '8px 0' }} />
                      <button className="dropdown-item" onClick={handleCopyMCPServer} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                        <div><div style={{ fontWeight: '500' }}>Copy MCP Server</div><div style={{ fontSize: '12px', color: theme.textMuted }}>Copy MCP Server URL to clipboard</div></div>
                      </button>
                      <button className="dropdown-item" onClick={handleConnectToCursor} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                        <div><div style={{ fontWeight: '500' }}>Connect to Cursor <span style={{ fontSize: '12px' }}>↗</span></div><div style={{ fontSize: '12px', color: theme.textMuted }}>Install MCP Server on Cursor</div></div>
                      </button>
                      <button className="dropdown-item" onClick={handleConnectToVSCode} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                        <div><div style={{ fontWeight: '500' }}>Connect to VS Code <span style={{ fontSize: '12px' }}>↗</span></div><div style={{ fontSize: '12px', color: theme.textMuted }}>Install MCP Server on VS Code</div></div>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="page-subtitle" style={{
                fontSize: '18px',
                color: theme.textMuted,
                marginBottom: '24px',
              }}>
                Retrieve revenue split information for a smart contract
              </p>

                {/* POST Endpoint Bar */}
                <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: theme.bgCard,
                borderRadius: '8px',
                border: `1px solid ${theme.border}`,
                marginBottom: '32px',
                overflow: 'hidden',
              }}>
                <span style={{
                  backgroundColor: isDarkMode ? '#1a2744' : '#dbeafe',
                  color: '#60a5fa',
                  fontSize: '14px',
                  fontWeight: '700',
                  padding: '10px 16px',
                }}>POST</span>
                <code style={{
                  fontSize: '14px',
                  color: theme.textSecondary,
                  fontFamily: 'Monaco, Consolas, monospace',
                  padding: '10px 16px',
                  borderLeft: `1px solid ${theme.border}`,
                  borderRight: `1px solid ${theme.border}`,
                }}>/v1#splits_fetch_data</code>
                <button
                  onClick={() => { handlePlaygroundEndpointChange('split_data_fetch'); setTryItOpen(true); }}
                  style={{
                  backgroundColor: '#3064e3',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  padding: '10px 20px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  Try it
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              </div>

                {/* Detailed Description */}
                <p style={{
                  fontSize: '15px',
                  color: theme.textMuted,
                  lineHeight: '1.7',
                  marginBottom: '32px',
                }}>
                  Fetch detailed information about revenue splits for a contract, including all split holders, their percentages, and identity information. Results are paginated with a maximum of 25 splits per page.
                </p>

                {/* Authorizations Section */}
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: theme.text,
                  marginBottom: '16px',
                  paddingBottom: '12px',
                  borderBottom: `1px solid ${theme.border}`,
                }}>
                  Authorizations
                </h3>

                <div style={{
                  marginBottom: '32px',
                  paddingBottom: '16px',
                  borderBottom: `1px solid ${theme.border}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: '500', color: theme.text }}>Authorization</span>
                    <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>string</span>
                    <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>header</span>
                    <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                  </div>
                  <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>JWT token with Unique ID identification</p>
                </div>

                {/* Body Section */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: theme.text,
                    margin: 0,
                  }}>
                    Body
                  </h3>
                  <span style={{
                    fontSize: '14px',
                    color: theme.textMuted,
                  }}>
                    application/json
                  </span>
                </div>

                {/* Body Parameters */}
                <div style={{ marginBottom: '32px' }}>
                  {/* jsonrpc */}
                  <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: '500', color: theme.text }}>jsonrpc</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>enum&lt;string&gt;</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px' }}><span style={{ color: theme.textMuted }}>default:</span><span style={{ color: theme.text }}>2.0</span></span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                    </div>
                    <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Available options: <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px', color: theme.text }}>2.0</code></p>
                  </div>

                  {/* id */}
                  <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: '500', color: theme.text }}>id</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>string</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px' }}><span style={{ color: theme.textMuted }}>default:</span><span style={{ color: theme.text }}>1</span></span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                    </div>
                  </div>

                  {/* method */}
                  <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: '400', color: theme.textMuted }}>method</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>enum&lt;string&gt;</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px' }}><span style={{ color: theme.textMuted }}>default:</span><span style={{ color: theme.text }}>splits_fetch_data</span></span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                    </div>
                    <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Available options: <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px', color: theme.text }}>splits_fetch_data</code></p>
                  </div>

                  {/* params */}
                  <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: '500', color: theme.text }}>params</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>object</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                    </div>
                    
                    {/* Collapsible params children */}
                    <div 
                      onClick={() => setShowFetchSplitParamsChildren(!showFetchSplitParamsChildren)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        cursor: 'pointer',
                        color: theme.textMuted,
                        fontSize: '14px',
                        marginTop: '12px',
                      }}
                    >
                      <svg 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                        style={{ transform: showFetchSplitParamsChildren ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                      >
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                      {showFetchSplitParamsChildren ? 'Hide' : 'Show'} child attributes
                    </div>

                    {showFetchSplitParamsChildren && (
                      <div style={{ marginLeft: '16px', marginTop: '16px', paddingLeft: '16px', borderLeft: `2px solid ${theme.border}` }}>
                        {/* params.contract_address */}
                        <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <span style={{ color: theme.textMuted, fontSize: '14px' }}>params.</span>
                            <span style={{ color: theme.textMuted, fontWeight: '400' }}>contract_address</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>string</span>
                            <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px' }}><span style={{ color: theme.textMuted }}>default:</span><span style={{ color: theme.text }}>0x1234...</span></span>
                            <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                          </div>
                          <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>The digital property contract address</p>
                        </div>

                        {/* params.network_id */}
                        <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <span style={{ color: theme.textMuted, fontSize: '14px' }}>params.</span>
                            <span style={{ color: theme.textMuted, fontWeight: '400' }}>network_id</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>enum&lt;integer&gt;</span>
                            <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px' }}><span style={{ color: theme.textMuted }}>default:</span><span style={{ color: theme.text }}>8453</span></span>
                            <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                          </div>
                          <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Blockchain network ID (8453 for Base)</p>
                          <p style={{ fontSize: '14px', color: theme.textMuted, margin: '8px 0 0 0' }}>Available options: <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px', color: theme.text }}>8453</code></p>
                        </div>

                        {/* params.page */}
                        <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <span style={{ color: theme.textMuted, fontSize: '14px' }}>params.</span>
                            <span style={{ color: theme.textMuted, fontWeight: '400' }}>page</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>integer</span>
                            <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px' }}><span style={{ color: theme.textMuted }}>default:</span><span style={{ color: theme.text }}>0</span></span>
                          </div>
                          <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Page number for pagination (starts at 0)</p>
                        </div>

                        {/* params.page_size */}
                        <div style={{ paddingBottom: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <span style={{ color: theme.textMuted, fontSize: '14px' }}>params.</span>
                            <span style={{ color: theme.textMuted, fontWeight: '400' }}>page_size</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>integer</span>
                            <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px' }}><span style={{ color: theme.textMuted }}>default:</span><span style={{ color: theme.text }}>25</span></span>
                          </div>
                          <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Number of splits per page (max 25)</p>
                          <p style={{ fontSize: '14px', color: theme.textMuted, margin: '8px 0 0 0' }}>Required range: <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px', color: theme.text }}>x &lt;= 25</code></p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Response Section */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                  paddingBottom: '12px',
                  borderBottom: `1px solid ${theme.border}`,
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: theme.text,
                    margin: 0,
                  }}>
                    Response
                  </h3>
                  <span style={{
                    fontSize: '14px',
                    color: theme.textMuted,
                  }}>
                    200 - application/json
                  </span>
                </div>

                <p style={{ fontSize: '14px', color: theme.textMuted, marginBottom: '24px' }}>Successful response</p>

                {/* Response Fields */}
                <div style={{ marginBottom: '32px' }}>
                  {/* jsonrpc response */}
                  <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: '400', color: theme.textMuted }}>jsonrpc</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>enum&lt;string&gt;</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                    </div>
                    <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Available options: <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px', color: theme.text }}>2.0</code></p>
                  </div>

                  {/* id response */}
                  <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={theme.textMuted} strokeWidth="2">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                      </svg>
                      <span style={{ fontWeight: '400', color: theme.textMuted }}>id</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>string</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                    </div>
                  </div>

                  {/* result response with options */}
                  <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: '400', color: theme.textMuted }}>result</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>object</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                    </div>

                    {/* Option tabs */}
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      marginBottom: '16px',
                      backgroundColor: theme.bgSecondary,
                      padding: '4px',
                      borderRadius: '8px',
                      width: 'fit-content',
                    }}>
                      <button
                        onClick={() => setFetchSplitResponseOption(1)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: fetchSplitResponseOption === 1 ? theme.bg : 'transparent',
                          border: 'none',
                          borderRadius: '6px',
                          color: fetchSplitResponseOption === 1 ? theme.text : theme.textMuted,
                          fontSize: '14px',
                          cursor: 'pointer',
                          fontWeight: fetchSplitResponseOption === 1 ? '500' : '400',
                        }}
                      >
                        Option 1
                      </button>
                      <button
                        onClick={() => setFetchSplitResponseOption(2)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: fetchSplitResponseOption === 2 ? theme.bg : 'transparent',
                          border: 'none',
                          borderRadius: '6px',
                          color: fetchSplitResponseOption === 2 ? theme.text : theme.textMuted,
                          fontSize: '14px',
                          cursor: 'pointer',
                          fontWeight: fetchSplitResponseOption === 2 ? '500' : '400',
                        }}
                      >
                        Option 2
                      </button>
                    </div>

                    {/* Collapsible result children */}
                    <div 
                      onClick={() => setShowFetchSplitResultChildren(!showFetchSplitResultChildren)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        cursor: 'pointer',
                        color: theme.textMuted,
                        fontSize: '14px',
                        marginBottom: '16px',
                      }}
                    >
                      <svg 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                        style={{ transform: showFetchSplitResultChildren ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                      >
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                      {showFetchSplitResultChildren ? 'Hide' : 'Show'} child attributes
                    </div>

                    {showFetchSplitResultChildren && (
                      <div style={{ marginLeft: '16px', paddingLeft: '16px', borderLeft: `2px solid ${theme.border}` }}>
                        {/* Option 1 - Success */}
                        {fetchSplitResponseOption === 1 && (
                          <>
                            {/* result.total_slots */}
                            <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: '400', color: theme.textMuted }}>result.total_slots</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>string</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                              </div>
                              <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Total number of slots in the revenue split contract</p>
                            </div>

                            {/* result.total_splits */}
                            <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: '400', color: theme.textMuted }}>result.total_splits</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>integer</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                              </div>
                              <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Total number of unique split holders</p>
                            </div>

                            {/* result.community_allocation_percent */}
                            <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: '400', color: theme.textMuted }}>result.community_allocation_percent</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>number</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                              </div>
                              <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Percentage of revenue allocated to community splits</p>
                            </div>

                            {/* result.percent_per_slot */}
                            <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: '400', color: theme.textMuted }}>result.percent_per_slot</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>number</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                              </div>
                              <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Percentage of revenue per individual slot</p>
                            </div>

                            {/* result.splits_data */}
                            <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: '400', color: theme.textMuted }}>result.splits_data</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>object[]</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                              </div>
                              <p style={{ fontSize: '14px', color: theme.textMuted, margin: '0 0 12px 0' }}>Array of split holder information for the current page</p>

                              {/* Collapsible splits_data children */}
                              <div
                                onClick={() => setShowFetchSplitSplitsDataChildren(!showFetchSplitSplitsDataChildren)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  cursor: 'pointer',
                                  color: theme.textMuted,
                                  fontSize: '14px',
                                }}
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  style={{ transform: showFetchSplitSplitsDataChildren ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                                >
                                  <path d="M9 18l6-6-6-6"/>
                                </svg>
                                {showFetchSplitSplitsDataChildren ? 'Hide' : 'Show'} child attributes
                              </div>

                              {showFetchSplitSplitsDataChildren && (
                                <div style={{ marginLeft: '16px', marginTop: '16px', paddingLeft: '16px', borderLeft: `2px solid ${theme.border}` }}>
                                  <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                      <span style={{ fontWeight: '400', color: theme.textMuted }}>result.splits_data.wallet_address</span>
                                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>string</span>
                                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                                    </div>
                                    <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Wallet address of the split holder</p>
                                  </div>
                                  <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                      <span style={{ fontWeight: '400', color: theme.textMuted }}>result.splits_data.percentage</span>
                                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>number</span>
                                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                                    </div>
                                    <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Percentage of revenue this holder receives</p>
                                  </div>
                                  <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                      <span style={{ fontWeight: '400', color: theme.textMuted }}>result.splits_data.unique_id</span>
                                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>string | null</span>
                                    </div>
                                    <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Unique ID of the split holder</p>
                                  </div>
                                  <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                      <span style={{ fontWeight: '400', color: theme.textMuted }}>result.splits_data.display_name</span>
                                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>string | null</span>
                                    </div>
                                    <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Display name of the split holder</p>
                                  </div>
                                  <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                      <span style={{ fontWeight: '400', color: theme.textMuted }}>result.splits_data.email_address</span>
                                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>string | null</span>
                                    </div>
                                    <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Email address of the split holder</p>
                                  </div>
                                  <div style={{ paddingBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                      <span style={{ fontWeight: '400', color: theme.textMuted }}>result.splits_data.verified_identity</span>
                                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>boolean</span>
                                    </div>
                                    <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Whether the identity has been verified</p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* result.pagination */}
                            <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: '400', color: theme.textMuted }}>result.pagination</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>object</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                              </div>

                              {/* Collapsible pagination children */}
                              <div
                                onClick={() => setShowFetchSplitPaginationChildren(!showFetchSplitPaginationChildren)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  cursor: 'pointer',
                                  color: theme.textMuted,
                                  fontSize: '14px',
                                  marginTop: '12px',
                                }}
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  style={{ transform: showFetchSplitPaginationChildren ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                                >
                                  <path d="M9 18l6-6-6-6"/>
                                </svg>
                                {showFetchSplitPaginationChildren ? 'Hide' : 'Show'} child attributes
                              </div>

                              {showFetchSplitPaginationChildren && (
                                <div style={{ marginLeft: '16px', marginTop: '16px', paddingLeft: '16px', borderLeft: `2px solid ${theme.border}` }}>
                                  <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                      <span style={{ fontWeight: '400', color: theme.textMuted }}>result.pagination.total_records</span>
                                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>integer</span>
                                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                                    </div>
                                    <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Total number of split holders</p>
                                  </div>
                                  <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                      <span style={{ fontWeight: '400', color: theme.textMuted }}>result.pagination.current_page</span>
                                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>integer</span>
                                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                                    </div>
                                    <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Current page number</p>
                                  </div>
                                  <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                      <span style={{ fontWeight: '400', color: theme.textMuted }}>result.pagination.total_pages</span>
                                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>integer</span>
                                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                                    </div>
                                    <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Total number of pages</p>
                                  </div>
                                  <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                      <span style={{ fontWeight: '400', color: theme.textMuted }}>result.pagination.next_page</span>
                                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>integer | null</span>
                                    </div>
                                    <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Next page number (null if on last page)</p>
                                  </div>
                                  <div style={{ paddingBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                      <span style={{ fontWeight: '400', color: theme.textMuted }}>result.pagination.prev_page</span>
                                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>integer | null</span>
                                    </div>
                                    <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Previous page number (null if on first page)</p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* result.email_addresses */}
                            <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: '400', color: theme.textMuted }}>result.email_addresses</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>string[]</span>
                              </div>
                              <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Email addresses of split holders on current page</p>
                            </div>

                            {/* result.split_percentage_owned_by_unique_id */}
                            <div style={{ paddingBottom: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: '400', color: theme.textMuted }}>result.split_percentage_owned_by_unique_id</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>number</span>
                              </div>
                              <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Percentage owned by the requesting user's Unique ID</p>
                            </div>
                          </>
                        )}

                        {/* Option 2 - Failure */}
                        {fetchSplitResponseOption === 2 && (
                          <>
                            <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: '400', color: theme.textMuted }}>result.success</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>enum&lt;boolean&gt;</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                              </div>
                              <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Available options: <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px', color: theme.text }}>true</code> , <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px', color: theme.text }}>false</code></p>
                            </div>
                            <div style={{ paddingBottom: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: '400', color: theme.textMuted }}>result.message</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>string</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                              </div>
                              <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Error message</p>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Navigation */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '24px',
                  borderTop: `1px solid ${theme.border}`,
                  marginTop: '32px',
                }}>
                  <button
                    onClick={() => setActiveSection('create-contract')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 16px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: theme.text,
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 18l-6-6 6-6"/>
                    </svg>
                    Create Contract
                  </button>
                  <button
                    onClick={() => setActiveSection('execute-payout')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 16px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: theme.text,
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    Execute Payout
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </button>
                </div>

          {/* Footer */}
          <footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px', borderTop: `1px solid ${theme.border}`, marginTop: '32px' }}>
            <a href="https://github.com/formless-eng" target="_blank" rel="noopener noreferrer" style={{ color: theme.textDimmed, transition: 'color 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = '#666'}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <span style={{ color: theme.textDimmed, fontSize: '14px' }}>Powered by{' '}<a href="https://mintlify.com" target="_blank" rel="noopener noreferrer" style={{ color: 'white', fontWeight: '600', textDecoration: 'none' }}>mintlify</a></span>
          </footer>

                </div>
              </div>
            </div>
            {/* End Two Column Layout */}

            {/* Right Column - Code Panels */}
            <RightCodePanel
              title="Fetch Revenue Split Data"
              codeByLanguage={fetchSplitDataCode}
              responseJson={responseSchemas.fetchSplitData}
              theme={theme}
              copiedCode={copiedCode}
              copyToClipboard={copyToClipboard}
              codeId="code-fetch-split"
              responseId="response-fetch-split"
            />
          </>
        )}

        {/* Execute Payout Page Content */}
        {activeSection === 'execute-payout' && (
          <>
            {/* Two Column Layout */}
            <div className="api-two-column-layout" style={{ display: 'flex' }}>
              {/* Left Column - Documentation */}
              <div
                className="left-content-column"
                style={{
                  flex: 1,
                  minWidth: 0,
                  overflow: 'hidden',
                }}>
                {/* Inner content wrapper */}
                <div>
                {/* Breadcrumb */}
                <div style={{
                  fontSize: '14px',
                  color: theme.textDimmed,
                  marginBottom: '16px',
                }}>
                  Payouts
                </div>

                {/* Title with Copy page button */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
                gap: '16px',
              }}>
                <h2 className="page-title" style={{
                  fontSize: '36px',
                  fontWeight: '700',
                  margin: 0,
                  lineHeight: '1.2',
                }}>
                  Execute Payout
                </h2>
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setCopyDropdownOpen(copyDropdownOpen === 'execute-payout' ? null : 'execute-payout')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      backgroundColor: 'transparent',
                      border: `1px solid ${theme.border}`,
                      borderRadius: '6px',
                      color: theme.textMuted,
                      fontSize: '14px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                    Copy page
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </button>
                  {copyDropdownOpen === 'execute-payout' && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '8px',
                      backgroundColor: theme.bgSecondary,
                      border: `1px solid ${theme.border}`,
                      borderRadius: '8px',
                      padding: '8px 0',
                      minWidth: '280px',
                      zIndex: 1000,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    }}>
                      <button className="dropdown-item" onClick={() => handleCopyPage('execute-payout-page', 'execute-payout')} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                        <div><div style={{ fontWeight: '500' }}>Copy page</div><div style={{ fontSize: '12px', color: theme.textMuted }}>Copy page as Markdown for LLMs</div></div>
                      </button>
                      <button className="dropdown-item" onClick={() => handleViewAsMarkdown('execute-payout')} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        <div><div style={{ fontWeight: '500' }}>View as Markdown <span style={{ fontSize: '12px' }}>↗</span></div><div style={{ fontSize: '12px', color: theme.textMuted }}>View this page as plain text</div></div>
                      </button>
                      <div style={{ height: '1px', backgroundColor: theme.border, margin: '8px 0' }} />
                      <button className="dropdown-item" onClick={() => handleOpenInChatGPT('execute-payout')} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.2 8.3c.2-.6.3-1.3.3-2 0-3.5-2.8-6.3-6.3-6.3-1.4 0-2.7.5-3.8 1.3C11.4.5 10.1 0 8.7 0 5.2 0 2.4 2.8 2.4 6.3c0 .7.1 1.4.3 2C1 9.4 0 11.1 0 13c0 3.5 2.8 6.3 6.3 6.3 1.4 0 2.7-.5 3.8-1.3 1 .8 2.3 1.3 3.7 1.3 3.5 0 6.3-2.8 6.3-6.3 0-1.9-1-3.6-2.6-4.7h.7z"/></svg>
                        <div><div style={{ fontWeight: '500' }}>Open in ChatGPT <span style={{ fontSize: '12px' }}>↗</span></div><div style={{ fontSize: '12px', color: theme.textMuted }}>Ask questions about this page</div></div>
                      </button>
                      <button className="dropdown-item" onClick={() => handleOpenInClaude('execute-payout')} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                        <div><div style={{ fontWeight: '500' }}>Open in Claude <span style={{ fontSize: '12px' }}>↗</span></div><div style={{ fontSize: '12px', color: theme.textMuted }}>Ask questions about this page</div></div>
                      </button>
                      <button className="dropdown-item" onClick={() => handleOpenInPerplexity('execute-payout')} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
                        <div><div style={{ fontWeight: '500' }}>Open in Perplexity <span style={{ fontSize: '12px' }}>↗</span></div><div style={{ fontSize: '12px', color: theme.textMuted }}>Ask questions about this page</div></div>
                      </button>
                      <div style={{ height: '1px', backgroundColor: theme.border, margin: '8px 0' }} />
                      <button className="dropdown-item" onClick={handleCopyMCPServer} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                        <div><div style={{ fontWeight: '500' }}>Copy MCP Server</div><div style={{ fontSize: '12px', color: theme.textMuted }}>Copy MCP Server URL to clipboard</div></div>
                      </button>
                      <button className="dropdown-item" onClick={handleConnectToCursor} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                        <div><div style={{ fontWeight: '500' }}>Connect to Cursor <span style={{ fontSize: '12px' }}>↗</span></div><div style={{ fontSize: '12px', color: theme.textMuted }}>Install MCP Server on Cursor</div></div>
                      </button>
                      <button className="dropdown-item" onClick={handleConnectToVSCode} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                        <div><div style={{ fontWeight: '500' }}>Connect to VS Code <span style={{ fontSize: '12px' }}>↗</span></div><div style={{ fontSize: '12px', color: theme.textMuted }}>Install MCP Server on VS Code</div></div>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Subtitle */}
              <p style={{
                fontSize: '18px',
                color: theme.textMuted,
                marginBottom: '24px',
                lineHeight: '1.5',
              }}>
                Execute a payout to a smart contract based recipient
              </p>

                {/* Endpoint URL */}
                <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: theme.bgCard,
                borderRadius: '8px',
                border: `1px solid ${theme.border}`,
                marginBottom: '32px',
                overflow: 'hidden',
              }}>
                <span style={{
                  backgroundColor: isDarkMode ? '#1a2744' : '#dbeafe',
                  color: '#60a5fa',
                  fontSize: '14px',
                  fontWeight: '700',
                  padding: '10px 16px',
                }}>POST</span>
                <code style={{
                  fontSize: '14px',
                  color: theme.textSecondary,
                  fontFamily: 'Monaco, Consolas, monospace',
                  padding: '10px 16px',
                  borderLeft: `1px solid ${theme.border}`,
                  borderRight: `1px solid ${theme.border}`,
                }}>/v1#payouts</code>
                <button
                  onClick={() => { handlePlaygroundEndpointChange('payout_execute'); setTryItOpen(true); }}
                  style={{
                  backgroundColor: '#3064e3',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  padding: '10px 20px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  Try it
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              </div>

                {/* Detailed Description */}
                <p style={{
                  fontSize: '15px',
                  color: theme.textMuted,
                  lineHeight: '1.7',
                  marginBottom: '32px',
                }}>
                  Execute a payout to distribute revenue to a smart contract recipient. Use idempotency keys to prevent duplicate payouts.
                </p>

                {/* Authorizations Section */}
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: theme.text,
                  marginBottom: '16px',
                  paddingBottom: '12px',
                  borderBottom: `1px solid ${theme.border}`,
                }}>
                  Authorizations
                </h3>

                <div style={{
                  marginBottom: '32px',
                  paddingBottom: '16px',
                  borderBottom: `1px solid ${theme.border}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: '500', color: theme.text }}>Authorization</span>
                    <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>string</span>
                    <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>header</span>
                    <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                  </div>
                  <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>JWT token with Unique ID identification</p>
                </div>

                {/* Body Section */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: theme.text,
                    margin: 0,
                  }}>
                    Body
                  </h3>
                  <span style={{
                    fontSize: '14px',
                    color: theme.textMuted,
                  }}>
                    application/json
                  </span>
                </div>

                {/* Body Parameters */}
                <div style={{ marginBottom: '32px' }}>
                  {/* jsonrpc */}
                  <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: '400', color: theme.textMuted }}>jsonrpc</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>enum&lt;string&gt;</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px' }}><span style={{ color: theme.textMuted }}>default:</span><span style={{ color: theme.text }}>2.0</span></span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                    </div>
                    <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Available options: <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px', color: theme.text }}>2.0</code></p>
                  </div>

                  {/* id */}
                  <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: '400', color: theme.textMuted }}>id</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>string</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px' }}><span style={{ color: theme.textMuted }}>default:</span><span style={{ color: theme.text }}>1</span></span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                    </div>
                  </div>

                  {/* method */}
                  <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: '400', color: theme.textMuted }}>method</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>enum&lt;string&gt;</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px' }}><span style={{ color: theme.textMuted }}>default:</span><span style={{ color: theme.text }}>payouts</span></span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                    </div>
                    <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Available options: <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px', color: theme.text }}>payouts</code></p>
                  </div>

                  {/* params */}
                  <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: '400', color: theme.textMuted }}>params</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>object</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                    </div>

                    {/* Collapsible params children */}
                    <div
                      onClick={() => setShowExecutePayoutParamsChildren(!showExecutePayoutParamsChildren)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        color: theme.textMuted,
                        fontSize: '14px',
                        marginTop: '12px',
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{ transform: showExecutePayoutParamsChildren ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                      >
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                      {showExecutePayoutParamsChildren ? 'Hide' : 'Show'} child attributes
                    </div>

                    {showExecutePayoutParamsChildren && (
                      <div style={{ marginLeft: '16px', marginTop: '16px', paddingLeft: '16px', borderLeft: `2px solid ${theme.border}` }}>
                        {/* params.idempotency_key */}
                        <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <span style={{ color: theme.textMuted, fontSize: '14px' }}>params.</span>
                            <span style={{ color: theme.textMuted, fontWeight: '400' }}>idempotency_key</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>string</span>
                            <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px' }}><span style={{ color: theme.textMuted }}>default:</span><span style={{ color: theme.text }}>unique-payout-key-123</span></span>
                            <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                          </div>
                          <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Unique key to prevent duplicate payouts</p>
                        </div>

                        {/* params.recipient_type */}
                        <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <span style={{ color: theme.textMuted, fontSize: '14px' }}>params.</span>
                            <span style={{ color: theme.textMuted, fontWeight: '400' }}>recipient_type</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>enum&lt;string&gt;</span>
                            <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px' }}><span style={{ color: theme.textMuted }}>default:</span><span style={{ color: theme.text }}>smart_contract</span></span>
                            <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                          </div>
                          <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Type of recipient</p>
                          <p style={{ fontSize: '14px', color: theme.textMuted, margin: '8px 0 0 0' }}>Available options: <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px', color: theme.text }}>smart_contract</code></p>
                        </div>

                        {/* params.recipient_id */}
                        <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <span style={{ color: theme.textMuted, fontSize: '14px' }}>params.</span>
                            <span style={{ color: theme.textMuted, fontWeight: '400' }}>recipient_id</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>string</span>
                            <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px' }}><span style={{ color: theme.textMuted }}>default:</span><span style={{ color: theme.text }}>7a2ab0d5-27d8-482f-becf-0ac3217e0b1a</span></span>
                            <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                          </div>
                          <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>ID of the recipient contract</p>
                        </div>

                        {/* params.amount */}
                        <div style={{ paddingBottom: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <span style={{ color: theme.textMuted, fontSize: '14px' }}>params.</span>
                            <span style={{ color: theme.textMuted, fontWeight: '400' }}>amount</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>object</span>
                            <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                          </div>

                          {/* Collapsible amount children */}
                          <div
                            onClick={() => setShowExecutePayoutAmountChildren(!showExecutePayoutAmountChildren)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              cursor: 'pointer',
                              color: theme.textMuted,
                              fontSize: '14px',
                              marginTop: '12px',
                            }}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              style={{ transform: showExecutePayoutAmountChildren ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                            >
                              <path d="M9 18l6-6-6-6"/>
                            </svg>
                            {showExecutePayoutAmountChildren ? 'Hide' : 'Show'} child attributes
                          </div>

                          {showExecutePayoutAmountChildren && (
                            <div style={{ marginLeft: '16px', marginTop: '16px', paddingLeft: '16px', borderLeft: `2px solid ${theme.border}` }}>
                              {/* params.amount.value */}
                              <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                  <span style={{ color: theme.textMuted, fontSize: '14px' }}>params.amount.</span>
                                  <span style={{ color: theme.textMuted, fontWeight: '400' }}>value</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                  <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>number</span>
                                  <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px' }}><span style={{ color: theme.textMuted }}>default:</span><span style={{ color: theme.text }}>10</span></span>
                                  <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                                </div>
                                <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Amount to pay out</p>
                              </div>

                              {/* params.amount.currency */}
                              <div style={{ paddingBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                  <span style={{ color: theme.textMuted, fontSize: '14px' }}>params.amount.</span>
                                  <span style={{ color: theme.textMuted, fontWeight: '400' }}>currency</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                  <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>enum&lt;string&gt;</span>
                                  <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px' }}><span style={{ color: theme.textMuted }}>default:</span><span style={{ color: theme.text }}>USD</span></span>
                                  <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                                </div>
                                <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Currency type</p>
                                <p style={{ fontSize: '14px', color: theme.textMuted, margin: '8px 0 0 0' }}>Available options: <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px', color: theme.text }}>USD</code> , <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px', color: theme.text }}>USDC</code></p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Response Section */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                  paddingBottom: '12px',
                  borderBottom: `1px solid ${theme.border}`,
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: theme.text,
                    margin: 0,
                  }}>
                    Response
                  </h3>
                  <span style={{
                    fontSize: '14px',
                    color: theme.textMuted,
                  }}>
                    200 - application/json
                  </span>
                </div>

                <p style={{ fontSize: '14px', color: theme.textMuted, marginBottom: '24px' }}>Successful response</p>

                {/* Response Fields */}
                <div style={{ marginBottom: '32px' }}>
                  {/* jsonrpc response */}
                  <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: '400', color: theme.textMuted }}>jsonrpc</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>enum&lt;string&gt;</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                    </div>
                    <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Available options: <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px', color: theme.text }}>2.0</code></p>
                  </div>

                  {/* id response */}
                  <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: '400', color: theme.textMuted }}>id</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>string</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                    </div>
                  </div>

                  {/* result response with options */}
                  <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: '400', color: theme.textMuted }}>result</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>object</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                    </div>

                    {/* Option tabs */}
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      marginBottom: '16px',
                      backgroundColor: theme.bgSecondary,
                      padding: '4px',
                      borderRadius: '8px',
                      width: 'fit-content',
                    }}>
                      <button
                        onClick={() => setExecutePayoutResponseOption(1)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: executePayoutResponseOption === 1 ? theme.bg : 'transparent',
                          border: 'none',
                          borderRadius: '6px',
                          color: executePayoutResponseOption === 1 ? theme.text : theme.textMuted,
                          fontSize: '14px',
                          cursor: 'pointer',
                          fontWeight: executePayoutResponseOption === 1 ? '500' : '400',
                        }}
                      >
                        Option 1
                      </button>
                      <button
                        onClick={() => setExecutePayoutResponseOption(2)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: executePayoutResponseOption === 2 ? theme.bg : 'transparent',
                          border: 'none',
                          borderRadius: '6px',
                          color: executePayoutResponseOption === 2 ? theme.text : theme.textMuted,
                          fontSize: '14px',
                          cursor: 'pointer',
                          fontWeight: executePayoutResponseOption === 2 ? '500' : '400',
                        }}
                      >
                        Option 2
                      </button>
                    </div>

                    {/* Collapsible result children */}
                    <div
                      onClick={() => setShowExecutePayoutResultChildren(!showExecutePayoutResultChildren)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        color: theme.textMuted,
                        fontSize: '14px',
                        marginBottom: '16px',
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{ transform: showExecutePayoutResultChildren ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                      >
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                      {showExecutePayoutResultChildren ? 'Hide' : 'Show'} child attributes
                    </div>

                    {showExecutePayoutResultChildren && (
                      <div style={{ marginLeft: '16px', paddingLeft: '16px', borderLeft: `2px solid ${theme.border}` }}>
                        {/* Option 1 - Success */}
                        {executePayoutResponseOption === 1 && (
                          <>
                            <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: '400', color: theme.textMuted }}>result.batch_id</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>string</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                              </div>
                              <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Unique identifier for the payout batch</p>
                            </div>
                            <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: '400', color: theme.textMuted }}>result.status</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>enum&lt;string&gt;</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                              </div>
                              <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Status of the payout</p>
                              <p style={{ fontSize: '14px', color: theme.textMuted, margin: '8px 0 0 0' }}>Available options: <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px', color: theme.text }}>pending</code></p>
                            </div>
                            <div style={{ paddingBottom: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: '400', color: theme.textMuted }}>result.message</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>string</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                              </div>
                              <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Status message about the payout processing</p>
                            </div>
                          </>
                        )}

                        {/* Option 2 - Failure */}
                        {executePayoutResponseOption === 2 && (
                          <>
                            <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: '400', color: theme.textMuted }}>result.status</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>enum&lt;string&gt;</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                              </div>
                              <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Status indicating failure</p>
                              <p style={{ fontSize: '14px', color: theme.textMuted, margin: '8px 0 0 0' }}>Available options: <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px', color: theme.text }}>failed</code></p>
                            </div>
                            <div style={{ paddingBottom: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: '400', color: theme.textMuted }}>result.message</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>string</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                              </div>
                              <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Error message describing what went wrong</p>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Navigation */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '24px',
                  borderTop: `1px solid ${theme.border}`,
                  marginTop: '32px',
                }}>
                  <button
                    onClick={() => setActiveSection('fetch-split-data')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 16px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: theme.text,
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 18l-6-6 6-6"/>
                    </svg>
                    Fetch Split Data
                  </button>
                  <button
                    onClick={() => setActiveSection('query-batch-status')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 16px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: theme.text,
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    Query Batch Status
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </button>
                </div>

          {/* Footer */}
          <footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px', borderTop: `1px solid ${theme.border}`, marginTop: '32px' }}>
            <a href="https://github.com/formless-eng" target="_blank" rel="noopener noreferrer" style={{ color: theme.textDimmed, transition: 'color 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = '#666'}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <span style={{ color: theme.textDimmed, fontSize: '14px' }}>Powered by{' '}<a href="https://mintlify.com" target="_blank" rel="noopener noreferrer" style={{ color: 'white', fontWeight: '600', textDecoration: 'none' }}>mintlify</a></span>
          </footer>

                </div>
              </div>
            </div>
            {/* End Two Column Layout */}

            {/* Right Column - Code Panels */}
            <RightCodePanel
              title="Execute Payout"
              codeByLanguage={executePayoutCode}
              responseJson={responseSchemas.executePayout}
              theme={theme}
              copiedCode={copiedCode}
              copyToClipboard={copyToClipboard}
              codeId="code-execute-payout"
              responseId="response-execute-payout"
            />
          </>
        )}

        {/* Query Batch Status Page Content */}
        {activeSection === 'query-batch-status' && (
          <>
            {/* Two Column Layout */}
            <div className="api-two-column-layout" style={{ display: 'flex' }}>
              {/* Left Column - Documentation */}
              <div
                className="left-content-column"
                style={{
                  flex: 1,
                  minWidth: 0,
                  overflow: 'hidden',
                }}>
                {/* Inner content wrapper */}
                <div>
                {/* Breadcrumb */}
                <div style={{
                  fontSize: '14px',
                  color: theme.textDimmed,
                  marginBottom: '16px',
                }}>
                  Payouts
                </div>

                {/* Title with Copy page button */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
                gap: '16px',
              }}>
                <h2 className="page-title" style={{
                  fontSize: '36px',
                  fontWeight: '700',
                  margin: 0,
                  lineHeight: '1.2',
                }}>
                  Query Batch Status
                </h2>
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setCopyDropdownOpen(copyDropdownOpen === 'query-batch-status' ? null : 'query-batch-status')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      backgroundColor: 'transparent',
                      border: `1px solid ${theme.border}`,
                      borderRadius: '6px',
                      color: theme.textMuted,
                      fontSize: '14px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                    Copy page
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </button>
                  {copyDropdownOpen === 'query-batch-status' && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '8px',
                      backgroundColor: theme.bgSecondary,
                      border: `1px solid ${theme.border}`,
                      borderRadius: '8px',
                      padding: '8px 0',
                      minWidth: '280px',
                      zIndex: 1000,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    }}>
                      <button className="dropdown-item" onClick={() => handleCopyPage('query-batch-status-page', 'query-batch-status')} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                        <div><div style={{ fontWeight: '500' }}>Copy page</div><div style={{ fontSize: '12px', color: theme.textMuted }}>Copy page as Markdown for LLMs</div></div>
                      </button>
                      <button className="dropdown-item" onClick={() => handleViewAsMarkdown('query-batch-status')} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        <div><div style={{ fontWeight: '500' }}>View as Markdown <span style={{ fontSize: '12px' }}>↗</span></div><div style={{ fontSize: '12px', color: theme.textMuted }}>View this page as plain text</div></div>
                      </button>
                      <div style={{ height: '1px', backgroundColor: theme.border, margin: '8px 0' }} />
                      <button className="dropdown-item" onClick={() => handleOpenInChatGPT('query-batch-status')} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.2 8.3c.2-.6.3-1.3.3-2 0-3.5-2.8-6.3-6.3-6.3-1.4 0-2.7.5-3.8 1.3C11.4.5 10.1 0 8.7 0 5.2 0 2.4 2.8 2.4 6.3c0 .7.1 1.4.3 2C1 9.4 0 11.1 0 13c0 3.5 2.8 6.3 6.3 6.3 1.4 0 2.7-.5 3.8-1.3 1 .8 2.3 1.3 3.7 1.3 3.5 0 6.3-2.8 6.3-6.3 0-1.9-1-3.6-2.6-4.7h.7z"/></svg>
                        <div><div style={{ fontWeight: '500' }}>Open in ChatGPT <span style={{ fontSize: '12px' }}>↗</span></div><div style={{ fontSize: '12px', color: theme.textMuted }}>Ask questions about this page</div></div>
                      </button>
                      <button className="dropdown-item" onClick={() => handleOpenInClaude('query-batch-status')} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                        <div><div style={{ fontWeight: '500' }}>Open in Claude <span style={{ fontSize: '12px' }}>↗</span></div><div style={{ fontSize: '12px', color: theme.textMuted }}>Ask questions about this page</div></div>
                      </button>
                      <button className="dropdown-item" onClick={() => handleOpenInPerplexity('query-batch-status')} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><text x="12" y="16" fontSize="10" fill="white" textAnchor="middle" fontWeight="bold">P</text></svg>
                        <div><div style={{ fontWeight: '500' }}>Open in Perplexity <span style={{ fontSize: '12px' }}>↗</span></div><div style={{ fontSize: '12px', color: theme.textMuted }}>Ask questions about this page</div></div>
                      </button>
                      <div style={{ height: '1px', backgroundColor: theme.border, margin: '8px 0' }} />
                      <button className="dropdown-item" onClick={handleCopyMCPServer} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                        <div><div style={{ fontWeight: '500' }}>Copy MCP Server</div><div style={{ fontSize: '12px', color: theme.textMuted }}>Copy MCP Server URL to clipboard</div></div>
                      </button>
                      <button className="dropdown-item" onClick={handleConnectToCursor} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                        <div><div style={{ fontWeight: '500' }}>Connect to Cursor <span style={{ fontSize: '12px' }}>↗</span></div><div style={{ fontSize: '12px', color: theme.textMuted }}>Install MCP Server on Cursor</div></div>
                      </button>
                      <button className="dropdown-item" onClick={handleConnectToVSCode} style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: theme.text, fontSize: '14px', cursor: 'pointer', textAlign: 'left' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                        <div><div style={{ fontWeight: '500' }}>Connect to VS Code <span style={{ fontSize: '12px' }}>↗</span></div><div style={{ fontSize: '12px', color: theme.textMuted }}>Install MCP Server on VS Code</div></div>
                      </button>
                    </div>
                  )}
                </div>
              </div>

                {/* Subtitle */}
                <p style={{
                  fontSize: '16px',
                  color: theme.textMuted,
                  marginBottom: '24px',
                  lineHeight: '1.5',
                }}>
                  Query the status of a payout batch by batch ID
                </p>

                {/* Endpoint Badge */}
                <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: theme.bgCard,
                borderRadius: '8px',
                border: `1px solid ${theme.border}`,
                marginBottom: '32px',
                overflow: 'hidden',
              }}>
                <span style={{
                  backgroundColor: isDarkMode ? '#1a2744' : '#dbeafe',
                  color: '#60a5fa',
                  fontSize: '14px',
                  fontWeight: '700',
                  padding: '10px 16px',
                }}>POST</span>
                <code style={{
                  fontSize: '14px',
                  color: theme.textSecondary,
                  fontFamily: 'Monaco, Consolas, monospace',
                  padding: '10px 16px',
                  borderLeft: `1px solid ${theme.border}`,
                  borderRight: `1px solid ${theme.border}`,
                }}>/v1#payouts</code>
                <button
                  onClick={() => { handlePlaygroundEndpointChange('batch_status_query'); setTryItOpen(true); }}
                  style={{
                  backgroundColor: '#3064e3',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  padding: '10px 20px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  Try it
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              </div>

                {/* Description */}
                <p style={{
                  fontSize: '16px',
                  color: theme.textMuted,
                  marginBottom: '32px',
                  lineHeight: '1.6',
                }}>
                  Query the status of a payout batch using the batch ID returned from the execute payout endpoint. The batch status can be pending, complete, or failed.
                </p>

                {/* Authorizations */}
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: theme.text,
                  marginBottom: '16px',
                  paddingBottom: '12px',
                  borderBottom: `1px solid ${theme.border}`,
                }}>
                  Authorizations
                </h3>

                <div style={{
                  marginBottom: '32px',
                  paddingBottom: '16px',
                  borderBottom: `1px solid ${theme.border}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: '500', color: theme.text }}>Authorization</span>
                    <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>string</span>
                    <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>header</span>
                    <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                  </div>
                  <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>JWT token with Unique ID identification</p>
                </div>

                {/* Body Section */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: theme.text,
                    margin: 0,
                  }}>
                    Body
                  </h3>
                  <span style={{
                    fontSize: '14px',
                    color: theme.textMuted,
                  }}>
                    application/json
                  </span>
                </div>

                {/* Body Parameters */}
                <div style={{ marginBottom: '32px' }}>
                  {/* jsonrpc */}
                  <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: '400', color: theme.textMuted }}>jsonrpc</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>enum&lt;string&gt;</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px' }}><span style={{ color: theme.textMuted }}>default:</span><span style={{ color: theme.text }}>2.0</span></span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                    </div>
                    <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Available options: <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px', color: theme.text }}>2.0</code></p>
                  </div>

                  {/* id */}
                  <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: '400', color: theme.textMuted }}>id</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>string</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px' }}><span style={{ color: theme.textMuted }}>default:</span><span style={{ color: theme.text }}>1</span></span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                    </div>
                  </div>

                  {/* method */}
                  <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: '400', color: theme.textMuted }}>method</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>enum&lt;string&gt;</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px' }}><span style={{ color: theme.textMuted }}>default:</span><span style={{ color: theme.text }}>payouts</span></span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                    </div>
                    <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Available options: <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px', color: theme.text }}>payouts</code></p>
                  </div>

                  {/* params */}
                  <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: '400', color: theme.textMuted }}>params</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>object</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                    </div>

                    {/* Collapsible params children */}
                    <div
                      onClick={() => setShowQueryBatchParamsChildren(!showQueryBatchParamsChildren)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        color: theme.textMuted,
                        fontSize: '14px',
                        marginTop: '12px',
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{ transform: showQueryBatchParamsChildren ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                      >
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                      {showQueryBatchParamsChildren ? 'Hide' : 'Show'} child attributes
                    </div>

                    {showQueryBatchParamsChildren && (
                      <div style={{ marginLeft: '16px', marginTop: '16px', paddingLeft: '16px', borderLeft: `2px solid ${theme.border}` }}>
                        {/* params.batch_id */}
                        <div style={{ paddingBottom: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <span style={{ color: theme.textMuted, fontSize: '14px' }}>params.</span>
                            <span style={{ color: theme.textMuted, fontWeight: '400' }}>batch_id</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>string</span>
                            <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px' }}><span style={{ color: theme.textMuted }}>default:</span><span style={{ color: theme.text }}>89de4f6d-a8e5-4808-9c29-ebac29dec4cb</span></span>
                            <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                          </div>
                          <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Batch ID to query status for</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Response Section */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: theme.text,
                    margin: 0,
                  }}>
                    Response
                  </h3>
                  <span style={{
                    fontSize: '14px',
                    color: theme.textMuted,
                  }}>
                    200 - application/json
                  </span>
                </div>

                <p style={{ fontSize: '14px', color: theme.textMuted, marginBottom: '24px' }}>Successful response</p>

                {/* Response Fields */}
                <div style={{ marginBottom: '32px' }}>
                  {/* jsonrpc response */}
                  <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: '400', color: theme.textMuted }}>jsonrpc</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>enum&lt;string&gt;</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                    </div>
                    <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Available options: <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px', color: theme.text }}>2.0</code></p>
                  </div>

                  {/* id response */}
                  <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: '400', color: theme.textMuted }}>id</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>string</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                    </div>
                  </div>

                  {/* result response with options */}
                  <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: '400', color: theme.textMuted }}>result</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>object</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                    </div>

                    {/* Option tabs */}
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      marginBottom: '16px',
                      backgroundColor: theme.bgSecondary,
                      padding: '4px',
                      borderRadius: '8px',
                      width: 'fit-content',
                    }}>
                      <button
                        onClick={() => setQueryBatchResponseOption(1)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: queryBatchResponseOption === 1 ? theme.bg : 'transparent',
                          border: 'none',
                          borderRadius: '6px',
                          color: queryBatchResponseOption === 1 ? theme.text : theme.textMuted,
                          fontSize: '14px',
                          cursor: 'pointer',
                          fontWeight: queryBatchResponseOption === 1 ? '500' : '400',
                        }}
                      >
                        Option 1
                      </button>
                      <button
                        onClick={() => setQueryBatchResponseOption(2)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: queryBatchResponseOption === 2 ? theme.bg : 'transparent',
                          border: 'none',
                          borderRadius: '6px',
                          color: queryBatchResponseOption === 2 ? theme.text : theme.textMuted,
                          fontSize: '14px',
                          cursor: 'pointer',
                          fontWeight: queryBatchResponseOption === 2 ? '500' : '400',
                        }}
                      >
                        Option 2
                      </button>
                    </div>

                    {/* Collapsible result children */}
                    <div
                      onClick={() => setShowQueryBatchResultChildren(!showQueryBatchResultChildren)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        color: theme.textMuted,
                        fontSize: '14px',
                        marginBottom: '16px',
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{ transform: showQueryBatchResultChildren ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                      >
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                      {showQueryBatchResultChildren ? 'Hide' : 'Show'} child attributes
                    </div>

                    {showQueryBatchResultChildren && (
                      <div style={{ marginLeft: '16px', paddingLeft: '16px', borderLeft: `2px solid ${theme.border}` }}>
                        {/* Option 2 - Failure */}
                        {queryBatchResponseOption === 2 && (
                          <>
                            <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: '400', color: theme.textMuted }}>result.status</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>enum&lt;string&gt;</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                              </div>
                              <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Status indicating failure</p>
                              <p style={{ fontSize: '14px', color: theme.textMuted, margin: '8px 0 0 0' }}>Available options: <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px', color: theme.text }}>failed</code></p>
                            </div>
                            <div style={{ paddingBottom: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: '400', color: theme.textMuted }}>result.message</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>string</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                              </div>
                              <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Error message describing what went wrong</p>
                            </div>
                          </>
                        )}

                        {/* Option 1 - Success */}
                        {queryBatchResponseOption === 1 && (
                          <>
                            <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: '400', color: theme.textMuted }}>result.payout_batch_id</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>string</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                              </div>
                              <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>The batch ID</p>
                            </div>
                            <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: '400', color: theme.textMuted }}>result.status</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>enum&lt;string&gt;</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                              </div>
                              <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Current status of the batch</p>
                              <p style={{ fontSize: '14px', color: theme.textMuted, margin: '8px 0 0 0' }}>Available options: <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px', color: theme.text }}>pending</code> , <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px', color: theme.text }}>complete</code> , <code style={{ backgroundColor: theme.bgTertiary, padding: '2px 6px', borderRadius: '4px', color: theme.text }}>failed</code></p>
                            </div>
                            <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: '400', color: theme.textMuted }}>result.submitter</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>string</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: 'rgba(220, 38, 38, 0.15)', borderRadius: '4px', color: '#f25c5c', fontWeight: '600' }}>required</span>
                              </div>
                              <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Unique ID of the user who submitted the batch</p>
                            </div>
                            <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: '400', color: theme.textMuted }}>result.timestamp</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>object</span>
                              </div>
                              <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>When the batch was created</p>
                            </div>
                            <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: '400', color: theme.textMuted }}>result.details</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>object</span>
                              </div>
                              <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Batch details object containing contract_address, network_id, amount_usd, etc.</p>
                            </div>
                            <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: '400', color: theme.textMuted }}>result.activity_details</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>object</span>
                              </div>
                              <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Activity information for the payout (isrc_code, upc_code, month, year, day, etc.)</p>
                            </div>
                            <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: '400', color: theme.textMuted }}>result.successful_txns</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>integer</span>
                              </div>
                              <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Number of successful transactions (present when status is complete)</p>
                            </div>
                            <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: '400', color: theme.textMuted }}>result.incomplete_txns</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>integer</span>
                              </div>
                              <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Number of incomplete transactions (present when status is complete)</p>
                            </div>
                            <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: '400', color: theme.textMuted }}>result.completion_percentage</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>number</span>
                              </div>
                              <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Completion percentage (present when status is complete)</p>
                            </div>
                            <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: '400', color: theme.textMuted }}>result.total_amount_paid_usd</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>number</span>
                              </div>
                              <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Total amount paid in USD (present when status is complete)</p>
                            </div>
                            <div style={{ paddingBottom: '16px', borderBottom: `1px solid ${theme.border}`, marginBottom: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: '400', color: theme.textMuted }}>result.message</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>string</span>
                              </div>
                              <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Status message (present when status is complete or failed)</p>
                            </div>
                            <div style={{ paddingBottom: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: '400', color: theme.textMuted }}>result.failure</span>
                                <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: theme.bgTertiary, borderRadius: '4px', color: theme.text }}>string</span>
                              </div>
                              <p style={{ fontSize: '14px', color: theme.textMuted, margin: 0 }}>Failure reason (present when status is failed)</p>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Navigation */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  paddingTop: '32px',
                  borderTop: `1px solid ${theme.border}`,
                  marginTop: '32px',
                }}>
                  <button
                    onClick={() => setActiveSection('execute-payout')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 16px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: theme.text,
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 18l-6-6 6-6"/>
                    </svg>
                    Execute Payout
                  </button>
                </div>

          {/* Footer */}
          <footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px', borderTop: `1px solid ${theme.border}`, marginTop: '32px' }}>
            <a href="https://github.com/formless-eng" target="_blank" rel="noopener noreferrer" style={{ color: theme.textDimmed, transition: 'color 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = '#666'}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <span style={{ color: theme.textDimmed, fontSize: '14px' }}>Powered by{' '}<a href="https://mintlify.com" target="_blank" rel="noopener noreferrer" style={{ color: 'white', fontWeight: '600', textDecoration: 'none' }}>mintlify</a></span>
          </footer>

                </div>
              </div>
            </div>
            {/* End Two Column Layout */}

            {/* Right Column - Code Panels */}
            <RightCodePanel
              title="Query Payout Batch Status"
              codeByLanguage={queryBatchStatusCode}
              responseJson={responseSchemas.queryBatchStatus}
              theme={theme}
              copiedCode={copiedCode}
              copyToClipboard={copyToClipboard}
              codeId="code-query-batch"
              responseId="response-query-batch"
            />
          </>
        )}
      </main>

      {/* Right Sidebar - On This Page (hidden on Identity Lookup, Create Contract, Fetch Split Data, Execute Payout, and Query Batch Status) */}
      {activeSection !== 'identity-lookup' && activeSection !== 'create-contract' && activeSection !== 'fetch-split-data' && activeSection !== 'execute-payout' && activeSection !== 'query-batch-status' && (
        <aside style={{
          width: '240px',
          position: 'fixed',
          top: '96px',
          right: 0,
          height: 'calc(100vh - 96px)',
          borderLeft: `1px solid ${theme.border}`,
          backgroundColor: theme.bg,
          overflowY: 'auto',
          padding: '40px 20px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '16px',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.textDimmed} strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
            <span style={{ fontSize: '14px', fontWeight: '600', color: theme.textMuted }}>
              On this page
            </span>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <RightSidebarLink href="#what-is" section="what-is">
              What is the SHARE Protocol API?
            </RightSidebarLink>
            <RightSidebarLink href="#core-features" section="core-features">
              Core Features
            </RightSidebarLink>
            <RightSidebarLink href="#quick-start" section="quick-start">
              Quick Start
            </RightSidebarLink>
            <RightSidebarLink href="#api-endpoint" section="api-endpoint" indented>
              1. API Endpoint
            </RightSidebarLink>
            <RightSidebarLink href="#authentication" section="authentication" indented>
              2. Authentication
            </RightSidebarLink>
            <RightSidebarLink href="#request-format" section="request-format" indented>
              3. Request Format
            </RightSidebarLink>
            <RightSidebarLink href="#need-help" section="need-help">
              Need Help?
            </RightSidebarLink>
          </nav>
        </aside>
      )}

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 998,
          }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Responsive Styles */}
      <style>
        {`
          /* Custom Scrollbar */
          aside::-webkit-scrollbar {
            width: 6px;
          }
          aside::-webkit-scrollbar-track {
            background: transparent;
          }
          aside::-webkit-scrollbar-thumb {
            background: ${isDarkMode ? '#333' : '#ccc'};
            border-radius: 3px;
          }
          aside::-webkit-scrollbar-thumb:hover {
            background: ${isDarkMode ? '#444' : '#aaa'};
          }

          /* Firefox scrollbar */
          aside {
            scrollbar-width: thin;
            scrollbar-color: ${isDarkMode ? '#333 transparent' : '#ccc transparent'};
          }

          /* Desktop - show sidebar normally */
          @media (min-width: 769px) {
            .mobile-sidebar {
              left: 0 !important;
            }
            .mobile-menu-toggle {
              display: none !important;
            }
          }

          /* Extra large screens (>= 1500px) - full layout */
          @media (min-width: 1500px) {
            .right-code-panel {
              display: flex !important;
              width: 480px !important;
              right: 40px !important;
            }
            .main-content {
              margin-right: 560px !important;
            }
          }

          /* Large screens (1300px - 1499px) */
          @media (max-width: 1499px) and (min-width: 1300px) {
            .main-content {
              margin-right: 500px !important;
              padding-right: 30px !important;
            }
            .right-code-panel {
              display: flex !important;
              width: 440px !important;
              right: 30px !important;
            }
          }

          /* Medium screens (1100px - 1299px) */
          @media (max-width: 1299px) and (min-width: 1100px) {
            .main-content {
              margin-right: 440px !important;
              padding-right: 20px !important;
            }
            .right-code-panel {
              display: flex !important;
              width: 380px !important;
              right: 20px !important;
            }
          }

          /* Tablet (769px - 1099px) - hide right panel */
          @media (max-width: 1099px) and (min-width: 769px) {
            .right-code-panel {
              display: none !important;
            }
            .main-content {
              margin-right: 0 !important;
              padding: 40px 40px !important;
            }
            .left-content-column {
              margin-right: 0 !important;
              overflow: visible !important;
            }
          }

          /* Mobile - hamburger menu & responsive layout */
          @media (max-width: 768px) {
            .mobile-menu-toggle {
              display: flex !important;
            }
            .mobile-sidebar {
              left: ${mobileMenuOpen ? '0' : '-280px'} !important;
            }
            .desktop-search {
              display: none !important;
            }
            .mobile-search-btn {
              display: flex !important;
            }
            .main-content {
              margin-left: 0 !important;
              margin-right: 0 !important;
              padding: 16px !important;
              padding-top: 100px !important;
            }
            .left-content-column {
              margin-right: 0 !important;
              overflow: visible !important;
            }
            .right-code-panel {
              display: none !important;
            }
            .api-two-column-layout {
              flex-direction: column !important;
            }
            .page-title {
              font-size: 28px !important;
              white-space: normal !important;
            }
            .page-subtitle {
              font-size: 16px !important;
            }
          }

          /* Small mobile adjustments */
          @media (max-width: 480px) {
            header {
              padding: 0 16px !important;
            }
            .main-content {
              margin-right: 0 !important;
              padding: 12px !important;
              padding-top: 100px !important;
            }
            .page-title {
              font-size: 24px !important;
              white-space: normal !important;
            }
          }

          /* Code panel scrollbar */
          .code-panel-scroll::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }
          .code-panel-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          .code-panel-scroll::-webkit-scrollbar-thumb {
            background: ${isDarkMode ? '#444' : '#ccc'};
            border-radius: 3px;
          }
          .code-panel-scroll::-webkit-scrollbar-thumb:hover {
            background: ${isDarkMode ? '#555' : '#aaa'};
          }

          /* Dropdown hover effects */
          .dropdown-item:hover {
            background-color: ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} !important;
          }
        `}
      </style>


      {/* API Playground Modal - Using new PlaygroundView component */}
      {tryItOpen && (
        <PlaygroundView
          isOpen={tryItOpen}
          playgroundEndpoint={playgroundEndpoint}
          playgroundEndpoints={Object.values(playgroundEndpoints)}
          currentEndpointConfig={currentEndpointConfig}
          playgroundBearerToken={playgroundBearerToken}
          setPlaygroundBearerToken={setPlaygroundBearerToken}
          playgroundJsonrpc={playgroundJsonrpc}
          setPlaygroundJsonrpc={setPlaygroundJsonrpc}
          playgroundId={playgroundId}
          setPlaygroundId={setPlaygroundId}
          playgroundParams={playgroundParams}
          setPlaygroundParams={setPlaygroundParams}
          playgroundResponse={playgroundResponse}
          playgroundLoading={playgroundLoading}
          handlePlaygroundSend={handlePlaygroundSend}
          handlePlaygroundEndpointChange={handlePlaygroundEndpointChange}
          generatePlaygroundCurl={generatePlaygroundCurl}
          copyToClipboard={copyToClipboard}
          copiedCode={copiedCode}
          onClose={() => setTryItOpen(false)}
        />
      )}
    </div>
    </>
  );
};

export default ApiDocs;
