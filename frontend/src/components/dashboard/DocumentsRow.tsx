import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Plus, FileText } from 'lucide-react';
import { useFormFlow } from '../../contexts/FormFlowContext';

export const DocumentsRow: React.FC = () => {
  const navigate = useNavigate();
  const { openDriveModal, openDocPreview, documents } = useFormFlow();

  const featuredDocs = [
    {
      id: 'doc-aadhaar',
      name: 'Aadhaar Card',
      ext: 'PDF',
      size: '2.4 MB',
      typeColor: '#EF4444',
      previewImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=300',
    },
    {
      id: 'doc-resume',
      name: 'Resume',
      ext: 'DOCX',
      size: '1.2 MB',
      typeColor: '#2563EB',
      previewImage: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=300',
    },
    {
      id: 'doc-transcript',
      name: 'Academic Transcript',
      ext: 'PDF',
      size: '1.1 MB',
      typeColor: '#10B981',
      previewImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=300',
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-7 border border-[#E8DFC8] shadow-editorial transition-all hover:border-[#D6CAB2]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <h2 className="text-sm sm:text-lg font-bold font-sans tracking-tight text-[#202720]">
          Your Documents
        </h2>
        <button
          onClick={() => navigate('/documents')}
          className="text-xs sm:text-sm font-medium text-[#77776E] hover:text-[#0B3D2E] flex items-center gap-1 transition-colors group shrink-0"
        >
          View all 
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* 4 Cards Grid (2 cols on mobile, 4 on laptop/desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
        {featuredDocs.map((doc) => {
          const ctxDoc = documents.find(d => d.name.toLowerCase().includes(doc.name.toLowerCase()));

          return (
            <div
              key={doc.id}
              onClick={() => {
                if (ctxDoc) {
                  openDocPreview(ctxDoc);
                } else {
                  navigate('/documents');
                }
              }}
              className="group bg-[#FAF6EF]/60 hover:bg-[#FAF6EF] border border-[#E8DFC8] hover:border-[#087F5B] rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card flex flex-col active:scale-[0.98]"
            >
              {/* Document Image Thumbnail Preview */}
              <div className="h-20 sm:h-28 w-full overflow-hidden bg-[#F0E8D8] relative">
                <img
                  src={doc.previewImage}
                  alt={doc.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-40 group-hover:opacity-10 transition-opacity" />
              </div>

              {/* Document Details Footer */}
              <div className="p-2 sm:p-3 flex items-start gap-1.5 sm:gap-2.5">
                <div 
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: `${doc.typeColor}15`, color: doc.typeColor }}
                >
                  <FileText size={12} className="sm:hidden" />
                  <FileText size={14} className="hidden sm:block" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-[11px] sm:text-xs font-semibold text-[#202720] truncate group-hover:text-[#0B3D2E]">
                    {doc.name}
                  </h3>
                  <p className="text-[9px] sm:text-[10px] text-[#77776E] mt-0.5 font-mono truncate">
                    {doc.ext} • {doc.size}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Upload More Card */}
        <div
          onClick={openDriveModal}
          className="bg-[#FAF6EF]/70 hover:bg-[#FAF6EF] border-2 border-dashed border-[#D5CBB5] hover:border-[#087F5B] rounded-2xl cursor-pointer transition-all duration-200 flex flex-col items-center justify-center p-3 sm:p-4 text-center group hover:-translate-y-0.5 hover:shadow-card min-h-[135px] sm:min-h-[175px] active:scale-[0.98]"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-[#E8DFC8] group-hover:border-[#087F5B] group-hover:bg-[#BDE9D4]/20 flex items-center justify-center text-[#77776E] group-hover:text-[#0B3D2E] transition-all mb-1 sm:mb-2 shadow-2xs">
            <Plus size={16} className="sm:hidden" strokeWidth={2.2} />
            <Plus size={20} className="hidden sm:block" strokeWidth={2.2} />
          </div>
          <span className="text-[11px] sm:text-xs font-semibold text-[#202720] group-hover:text-[#0B3D2E]">
            Upload more
          </span>
          <span className="text-[9px] sm:text-[10px] text-[#77776E] mt-0.5">
            Drive or PDF
          </span>
        </div>
      </div>
    </div>
  );
};
