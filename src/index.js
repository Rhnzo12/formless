import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import About from './About';
import ApiDocs from './ApiDocs';
import CaseStudies from './CaseStudies';
import Contact from './Contact';
import ScheduleMeeting from './ScheduleMeeting';
import MarkdownView from './MarkdownView';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';
import PageLoader from './components/PageLoader';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <PageLoader>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/about" element={<About />} />
        <Route path="/api-docs" element={<ApiDocs />} />
        <Route path="/api-docs/account-management/identity-lookup" element={<ApiDocs />} />
        <Route path="/api-docs/revenue-sharing/create-contract" element={<ApiDocs />} />
        <Route path="/api-docs/revenue-sharing/fetch-split-data" element={<ApiDocs />} />
        <Route path="/api-docs/payouts/execute-payout" element={<ApiDocs />} />
        <Route path="/api-docs/payouts/query-batch-status" element={<ApiDocs />} />
        <Route path="/api-docs/markdown" element={<MarkdownView />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/schedule-meeting/27886cd3ac3481bdb0f0c5a0d46242b5" element={<ScheduleMeeting />} />
      </Routes>
    </BrowserRouter>
    </PageLoader>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();