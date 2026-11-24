import React, { useState, useEffect } from 'react';
import { 
  FolderSync, 
  Search, 
  FileText, 
  HardDrive, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle,
  LayoutGrid, 
  List, 
  Calendar, 
  Clock, 
  RefreshCw,
  Folder,
  ShieldCheck,
  Info,
  Lock,
  Activity,
  Trash2,
  Eye
} from 'lucide-react';
import { useFormFlow } from '../contexts/FormFlowContext';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { DriveDocument } from '../types';
import { 
  searchDriveFiles, 
  readDriveFileContent, 
  fetchDriveActivity,
  clearDriveTemporaryData,
  DriveFileItem,
  DriveActivityItem,
  FileContentResult
} from '../services/backendApi';

export const DocumentsPage: React.FC = () => {
  const { user, documents, openDocPreview, openDriveModal } = useFormFlow();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDocForPanel, setSelectedDocForPanel] = useState<DriveDocument | null>(documents[0] || null);

  // Real Drive API States
  const [liveSearchResults, setLiveSearchResults] = useState<DriveFileItem[]>([]);
  const [isSearchingLive, setIsSearchingLive] = useState(false);
  const [selectedLiveContent, setSelectedLiveContent] = useState<FileContentResult | null>(null);
  const [readingFileId, setReadingFileId] = useState<string | null>(null);
  const [activityLogs, setActivityLogs] = useState<DriveActivityItem[]>([]);
  const [activeTab, setActiveTab] = useState<'vault' | 'live_search' | 'activity'>('vault');

  const loadActivities = async () => {
    const acts = await fetchDriveActivity();
    setActivityLogs(acts);
  };

  useEffect(() => {
    loadActivities();
  }, [user.isDriveConnected]);

  const handleLiveDriveSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearchingLive(true);
    setSelectedLiveContent(null);
    const res = await searchDriveFiles(searchQuery);
    if (res) {
      setLiveSearchResults(res.files);
    }
    setIsSearchingLive(false);
    loadActivities();
  };

  const handleReadLiveDocument = async (fileId: string) => {
    setReadingFileId(fileId);
    const res = await readDriveFileContent(fileId, 'user_inspection');
    if (res) {
      setSelectedLiveContent(res);
    }
    setReadingFileId(null);
    loadActivities();
  };

  const handleClearTemporaryData = async () => {
    await clearDriveTemporaryData();
    setSelectedLiveContent(null);
    loadActivities();
  };

  const categories = [
    { id: 'all', label: 'All Files' },
    { id: 'academic', label: 'Academic Records' },
    { id: 'identity', label: 'Identity Proofs' },
    { id: 'income', label: 'Financial & Income' },
  ];

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.contentSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.extractedFields.some(f => String(f.value).toLowerCase().includes(searchQuery.toLowerCase()) || f.label.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-5 sm:space-y-6 animate-fade-in">
      {/* Header with Google Drive Connection Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <HardDrive size={22} className="text-brand-600" />
            <span>My Documents (Google Drive)</span>
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Drive-first architecture: FormFlow accesses your authorized Google Drive on demand without uploading duplicate copies.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Badge variant={user.isDriveConnected ? 'success' : 'error'} size="md" dot>
            {user.isDriveConnected ? 'Google Drive Connected' : 'Drive Disconnected'}
          </Badge>
          <Button
            variant={user.isDriveConnected ? 'outline' : 'primary'}
            size="sm"
            onClick={openDriveModal}
          >
            {user.isDriveConnected ? 'Manage Drive Connection' : 'Connect Google Drive'}
          </Button>
        </div>
      </div>

      {/* Google Drive Connection Status Card */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="space-y-0.5">
          <span className="font-semibold text-zinc-800 flex items-center gap-1.5">
            <Folder size={14} className="text-brand-600" />
            <span>Authorized Drive Account:</span>
          </span>
          <p className="text-zinc-600 font-mono">{user.isDriveConnected ? user.driveAccountEmail : 'Not authorized'}</p>
        </div>

        <div className="space-y-0.5">
          <span className="font-semibold text-zinc-800">Permissions Scope:</span>
          <p className="text-zinc-600"><code className="font-mono bg-zinc-200/60 px-1 py-0.5 rounded">drive.readonly</code> (On-Demand Search Only)</p>
        </div>

        <div className="space-y-0.5">
          <span className="font-semibold text-zinc-800">Privacy Mode:</span>
          <p className="text-emerald-700 font-medium flex items-center gap-1">
            <ShieldCheck size={13} />
            <span>Zero Background Scanning</span>
          </p>
        </div>

        <div className="space-y-0.5">
          <span className="font-semibold text-zinc-800">Integration:</span>
          <p className="text-zinc-700 font-medium flex items-center gap-1">
            <CheckCircle2 size={12} className="text-brand-600" />
            <span>Official Google Drive MCP Server</span>
          </p>
        </div>
      </div>

      {/* View Mode Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-2 overflow-x-auto scrollbar-none flex-nowrap -mx-1 px-1">
        <button
          onClick={() => setActiveTab('vault')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
            activeTab === 'vault' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'
          }`}
        >
          <FolderSync size={14} />
          <span>Verified Documents</span>
        </button>

        <button
          onClick={() => setActiveTab('live_search')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
            activeTab === 'live_search' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'
          }`}
        >
          <Search size={14} />
          <span>Live Drive Search & Read</span>
          {liveSearchResults.length > 0 && (
            <span className="px-1.5 py-0.2 bg-zinc-700 text-white rounded-full text-[10px]">
              {liveSearchResults.length}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab('activity');
            loadActivities();
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
            activeTab === 'activity' ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'
          }`}
        >
          <Activity size={14} />
          <span>Drive Activity Log</span>
          {activityLogs.length > 0 && (
            <span className="px-1.5 py-0.2 bg-zinc-200 text-zinc-700 rounded-full text-[10px]">
              {activityLogs.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: Standard Verified Vault */}
      {activeTab === 'vault' && (
        <div className="space-y-4">
          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="flex items-center gap-3 w-full sm:w-auto flex-1 max-w-md">
              <div className="relative w-full">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter local records..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-zinc-200 rounded-xl focus:outline-none focus:border-zinc-400 shadow-2xs"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-1 overflow-x-auto">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors shrink-0 ${
                      selectedCategory === cat.id
                        ? 'bg-zinc-900 text-white'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/80'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center p-0.5 bg-zinc-100 rounded-lg border border-zinc-200 shrink-0">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-2xs text-zinc-900' : 'text-zinc-500 hover:text-zinc-900'}`}
                  title="Grid View"
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-2xs text-zinc-900' : 'text-zinc-500 hover:text-zinc-900'}`}
                  title="List View"
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Document Grid / List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {filteredDocs.length === 0 ? (
                <div className="p-12 text-center border border-zinc-200 bg-white rounded-2xl text-xs text-zinc-500">
                  No matching Google Drive documents found.
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {filteredDocs.map((doc) => {
                    const isSelected = selectedDocForPanel?.id === doc.id;
                    return (
                      <div
                        key={doc.id}
                        onClick={() => setSelectedDocForPanel(doc)}
                        onDoubleClick={() => openDocPreview(doc)}
                        className={`border rounded-2xl p-4 transition-all cursor-pointer space-y-3 bg-white flex flex-col justify-between ${
                          isSelected
                            ? 'border-brand-500 shadow-sm ring-1 ring-brand-400/30'
                            : 'border-zinc-200 hover:border-zinc-300 shadow-2xs'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-600">
                              <FileText size={16} />
                            </div>
                            <Badge
                              variant={doc.verificationStatus === 'discrepancy' ? 'warning' : 'success'}
                              size="sm"
                            >
                              {doc.verificationStatus === 'discrepancy' ? 'Discrepancy Note' : 'Verified'}
                            </Badge>
                          </div>

                          <div>
                            <h4 className="text-xs font-semibold text-zinc-900 line-clamp-1">{doc.name}</h4>
                            <p className="text-[11px] text-zinc-400 truncate mt-0.5">{doc.folderPath}</p>
                          </div>

                          <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                            {doc.contentSummary}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400">
                          <span>{doc.fileType.toUpperCase()} · {doc.size}</span>
                          <span className="text-brand-600 hover:underline font-medium flex items-center gap-0.5">
                            Inspect <ExternalLink size={10} />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="border border-zinc-200 bg-white rounded-2xl overflow-hidden shadow-2xs divide-y divide-zinc-100">
                  {filteredDocs.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDocForPanel(doc)}
                      onDoubleClick={() => openDocPreview(doc)}
                      className="flex items-center justify-between p-3.5 hover:bg-zinc-50 cursor-pointer text-xs"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <FileText size={16} className="text-zinc-400 shrink-0" />
                        <span className="font-medium text-zinc-900 truncate">{doc.name}</span>
                      </div>
                      <Badge variant="success" size="sm">Verified</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Details Panel */}
            <div className="space-y-4">
              <div className="border border-zinc-200 bg-white rounded-2xl p-4.5 shadow-2xs space-y-4 sticky top-20">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Document Details
                  </h3>
                  <Badge variant="purple" size="sm">Google Drive MCP</Badge>
                </div>

                {selectedDocForPanel ? (
                  <div className="space-y-3.5">
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-900 leading-snug">
                        {selectedDocForPanel.name}
                      </h4>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        Source: {selectedDocForPanel.folderPath}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs p-2.5 bg-zinc-50 rounded-xl border border-zinc-100">
                      <div>
                        <span className="text-[10px] text-zinc-400 block">File Type</span>
                        <span className="font-semibold text-zinc-800">{selectedDocForPanel.fileType.toUpperCase()} ({selectedDocForPanel.size})</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-400 block">Last Modified</span>
                        <span className="font-semibold text-zinc-800">{selectedDocForPanel.modifiedDate}</span>
                      </div>
                    </div>

                    {/* Extracted Fields */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-zinc-500 block">
                        Extracted Fields ({selectedDocForPanel.extractedFields.length})
                      </span>
                      <div className="border border-zinc-100 rounded-xl divide-y divide-zinc-100 text-xs overflow-hidden">
                        {selectedDocForPanel.extractedFields.map((f) => (
                          <div key={f.key} className="p-2 flex items-center justify-between">
                            <span className="text-zinc-600 text-[11px]">{f.label}:</span>
                            <span className="font-bold font-mono text-zinc-900">{String(f.value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full"
                      onClick={() => openDocPreview(selectedDocForPanel)}
                    >
                      Open Full Inspector Modal
                    </Button>
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400">Select a document to inspect details.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Live On-Demand Drive Search & Inspection */}
      {activeTab === 'live_search' && (
        <div className="space-y-4">
          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <Search size={16} className="text-brand-600" />
              <h3 className="text-sm font-semibold text-zinc-900">Search Connected Google Drive On-Demand</h3>
            </div>
            <p className="text-xs text-zinc-500">
              Query files in your real Drive. Results display metadata (file name, size, type) without reading file contents.
            </p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLiveDriveSearch()}
                placeholder="Search file name (e.g. '10th', 'marksheet', 'income', 'bonafide')..."
                className="flex-1 px-3.5 py-2 text-xs bg-white border border-zinc-300 rounded-xl focus:outline-none focus:border-zinc-500"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={handleLiveDriveSearch}
                disabled={isSearchingLive}
              >
                {isSearchingLive ? 'Searching Drive...' : 'Search My Drive'}
              </Button>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Drive Search Results (Metadata Only)
              </h4>
              {liveSearchResults.length === 0 ? (
                <div className="p-8 text-center border border-zinc-200 rounded-xl bg-white text-xs text-zinc-400">
                  Type keywords above and click "Search My Drive".
                </div>
              ) : (
                <div className="space-y-2">
                  {liveSearchResults.map((file) => (
                    <div
                      key={file.id}
                      className="p-3.5 bg-white border border-zinc-200 rounded-xl flex items-center justify-between gap-3 text-xs shadow-2xs hover:border-zinc-300"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <FileText size={15} className="text-zinc-500 shrink-0" />
                          <span className="font-semibold text-zinc-900 truncate">{file.name}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-zinc-400">
                          <span>{file.mimeType.split('/').pop()?.toUpperCase()}</span>
                          {file.size && <span>{Math.round(parseInt(file.size) / 1024)} KB</span>}
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReadLiveDocument(file.id)}
                        disabled={readingFileId === file.id}
                        className="shrink-0 flex items-center gap-1.5"
                      >
                        {readingFileId === file.id ? (
                          <>
                            <RefreshCw size={13} className="animate-spin" />
                            <span>Reading...</span>
                          </>
                        ) : (
                          <>
                            <Eye size={13} />
                            <span>Read Content</span>
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Extracted Content Viewer */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Ephemeral In-Memory Content Preview
                </h4>
                {selectedLiveContent && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearTemporaryData}
                    className="text-red-600 hover:text-red-700 text-xs flex items-center gap-1"
                  >
                    <Trash2 size={12} />
                    <span>Clear Memory</span>
                  </Button>
                )}
              </div>

              {selectedLiveContent ? (
                <div className="p-4 bg-zinc-900 text-zinc-100 rounded-2xl border border-zinc-800 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="font-semibold text-amber-400">{selectedLiveContent.file_name}</span>
                    <span className="text-[10px] text-zinc-400">{selectedLiveContent.char_count} chars</span>
                  </div>
                  <pre className="whitespace-pre-wrap font-sans text-xs text-zinc-300 leading-relaxed max-h-96 overflow-y-auto">
                    {selectedLiveContent.extracted_text}
                  </pre>
                  <p className="text-[10px] text-zinc-400 border-t border-zinc-800 pt-2 font-sans">
                    🔒 <strong>Privacy Assurance</strong>: Text is kept ephemerally in server memory during your turn and will be wiped immediately upon completion.
                  </p>
                </div>
              ) : (
                <div className="p-12 text-center border border-zinc-200 rounded-2xl bg-white text-xs text-zinc-400">
                  Select a document from the left and click "Read Content" to inspect on demand.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Privacy Transparency & Activity Log */}
      {activeTab === 'activity' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-emerald-600" />
                <span>Google Drive Privacy Transparency Log</span>
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Chronological record of every interaction with your Google Drive. Sensitive file contents are never logged.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearTemporaryData}
              className="flex items-center gap-1.5"
            >
              <Trash2 size={13} />
              <span>Clear Activity Log</span>
            </Button>
          </div>

          {activityLogs.length === 0 ? (
            <div className="p-8 text-center border border-zinc-200 bg-white rounded-xl text-xs text-zinc-400">
              No recent Drive operations recorded.
            </div>
          ) : (
            <div className="border border-zinc-200 bg-white rounded-xl divide-y divide-zinc-100 overflow-hidden text-xs">
              {activityLogs.map((act) => (
                <div key={act.id} className="p-3.5 flex items-start justify-between gap-4 hover:bg-zinc-50/70">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-900">{act.action}</span>
                      {act.document_name && (
                        <span className="px-1.5 py-0.5 bg-zinc-100 text-zinc-700 rounded font-mono text-[10px]">
                          {act.document_name}
                        </span>
                      )}
                    </div>
                    <p className="text-zinc-600 text-[11px]">{act.details}</p>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono shrink-0">
                    {act.timestamp_formatted}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
