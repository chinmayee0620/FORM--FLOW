import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { DocumentPreviewModal } from '../documents/DocumentPreviewModal';
import { HumanApprovalModal } from '../applications/HumanApprovalModal';
import { SettingsModal } from '../common/SettingsModal';
import { GoogleDriveConnectModal } from '../documents/GoogleDriveConnectModal';
import { useFormFlow } from '../../contexts/FormFlowContext';

export const AppLayout: React.FC = () => {
  const { 
    isSettingsOpen, 
    closeSettings,
    isDriveModalOpen,
    closeDriveModal,
    isMobileMenuOpen,
    closeMobileMenu
  } = useFormFlow();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FAF6EF] text-[#202720] font-sans selection:bg-[#BDE9D4] selection:text-[#064E3B] relative">
      {/* Mobile Drawer Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div 
          onClick={closeMobileMenu}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300 animate-fade-in cursor-pointer"
          title="Tap to close menu"
          aria-label="Close menu overlay"
        />
      )}

      {/* Editorial × Linear Sidebar (Sliding Drawer on Mobile, Fixed/Collapsible on Laptop) */}
      <Sidebar />

      {/* Main Central Canvas */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0 bg-[#FAF6EF]">
        <Header />

        {/* Dynamic Page Content */}
        <main className="flex-1 min-h-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Modals */}
      <DocumentPreviewModal />
      <HumanApprovalModal />
      <GoogleDriveConnectModal isOpen={isDriveModalOpen} onClose={closeDriveModal} />
      <SettingsModal isOpen={isSettingsOpen} onClose={closeSettings} />
    </div>
  );
};
