import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BrowserProvider } from './contexts/BrowserContext';
import { FormFlowProvider } from './contexts/FormFlowContext';
import { AppLayout } from './components/layout/AppLayout';
import { BrowserWorkspace } from './components/browser/BrowserWorkspace';
import { DashboardPage } from './pages/DashboardPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { ApplicationDetailPage } from './pages/ApplicationDetailPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { RemindersPage } from './pages/RemindersPage';
import { SettingsPage } from './pages/SettingsPage';
import { AuditPage } from './pages/AuditPage';

export const App: React.FC = () => {
  return (
    <BrowserProvider>
      <FormFlowProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/workspace" element={<BrowserWorkspace />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/applications" element={<ApplicationsPage />} />
              <Route path="/applications/:id" element={<ApplicationDetailPage />} />
              <Route path="/opportunities" element={<OpportunitiesPage />} />
              <Route path="/reminders" element={<RemindersPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/audit" element={<AuditPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </FormFlowProvider>
    </BrowserProvider>
  );
};

export default App;
