import React, { useState } from 'react';
import { 
  MessageSquare, 
  Trash2, 
  Pin, 
  Edit2, 
  Check, 
  X,
  Search
} from 'lucide-react';
import { Conversation } from '../../types';

interface ConversationHistoryProps {
  conversations: Conversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  searchQuery?: string;
  isCollapsed?: boolean;
}

export const ConversationHistory: React.FC<ConversationHistoryProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
  onRenameConversation,
  searchQuery = '',
  isCollapsed = false,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const filtered = conversations.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartRename = (conv: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  const handleSaveRename = (id: string, e: React.MouseEvent | React.FormEvent) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRenameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteConversation(id);
  };

  if (isCollapsed) {
    return (
      <div className="py-2 space-y-1">
        {filtered.slice(0, 5).map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelectConversation(conv.id)}
            className={`w-9 h-9 mx-auto rounded-xl flex items-center justify-center transition-colors ${
              conv.id === activeConversationId
                ? 'bg-zinc-200 text-zinc-900 font-semibold'
                : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800'
            }`}
            title={conv.title}
          >
            <MessageSquare size={16} />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {filtered.length === 0 ? (
        <p className="text-xs text-zinc-400 px-3 py-2 italic">No conversations found</p>
      ) : (
        filtered.map((conv) => {
          const isActive = conv.id === activeConversationId;
          const isEditing = editingId === conv.id;

          return (
            <div
              key={conv.id}
              onClick={() => onSelectConversation(conv.id)}
              className={`group relative flex items-center justify-between px-2.5 py-2 rounded-xl text-xs cursor-pointer transition-colors ${
                isActive
                  ? 'bg-zinc-200/85 text-zinc-900 font-semibold shadow-2xs'
                  : 'text-zinc-600 hover:bg-zinc-100/90 hover:text-zinc-900'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {conv.pinned ? (
                  <Pin size={12} className="text-brand-600 shrink-0 rotate-45" />
                ) : (
                  <MessageSquare size={13} className="shrink-0 text-zinc-400 group-hover:text-zinc-600" />
                )}

                {isEditing ? (
                  <div className="flex items-center gap-1 flex-1" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="px-1.5 py-0.5 text-xs bg-white border border-brand-500 rounded focus:outline-none w-full"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={(e) => handleSaveRename(conv.id, e)}
                      className="text-emerald-600 hover:text-emerald-700 p-0.5"
                    >
                      <Check size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(null);
                      }}
                      className="text-zinc-400 hover:text-zinc-600 p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <span className="truncate flex-1 text-left">{conv.title}</span>
                )}
              </div>

              {/* Action buttons on hover */}
              {!isEditing && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 ml-1 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => handleStartRename(conv, e)}
                    className="p-1 rounded text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200 transition-colors"
                    title="Rename"
                  >
                    <Edit2 size={11} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDelete(conv.id, e)}
                    className="p-1 rounded text-zinc-400 hover:text-rose-600 hover:bg-zinc-200 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};
