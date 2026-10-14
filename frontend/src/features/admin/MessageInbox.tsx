import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';
import { Mail, CheckCircle2, Trash2, Building, Tag } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  purpose?: string | null;
  company?: string | null;
  subject?: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const MessageInbox: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: messages = [], isLoading } = useQuery<ContactMessage[]>({
    queryKey: ['messages'],
    queryFn: () => apiClient<ContactMessage[]>('/messages'),
  });

  const toggleReadMutation = useMutation({
    mutationFn: ({ id, isRead }: { id: string; isRead: boolean }) =>
      apiClient(`/messages/${id}/read`, {
        method: 'PATCH',
        body: JSON.stringify({ isRead }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['messages'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient(`/messages/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['messages'] }),
  });

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-6 font-mono">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <h2 className="text-sm font-bold text-text-main flex items-center gap-2">
          <Mail className="w-4 h-4 text-accent" />
          <span>Inquiries ({messages.length})</span>
        </h2>
        {unreadCount > 0 && (
          <span className="text-xs px-2 py-0.5 rounded bg-accent text-background font-bold">
            {unreadCount} Unread
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="text-xs font-mono text-text-muted">Loading messages...</div>
      ) : messages.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-surface border border-border text-xs font-mono text-text-muted">
          Your inbox is completely clear.
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "p-5 rounded-2xl border transition-all duration-150 space-y-3",
                msg.isRead
                  ? "bg-surface border-border text-text-muted opacity-80"
                  : "bg-surface border-accent/40 shadow-sm"
              )}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-xs font-mono font-bold text-accent">
                    {msg.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-text-main">{msg.name}</span>
                      <span className="text-[11px] font-mono text-text-muted">&lt;{msg.email}&gt;</span>
                      {!msg.isRead && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-accent text-background font-bold">
                          NEW
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      {msg.purpose && (
                        <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md bg-background border border-border text-accent">
                          <Tag className="w-3 h-3" />
                          <span>{msg.purpose}</span>
                        </span>
                      )}
                      {msg.company && (
                        <span className="flex items-center gap-1 text-[10px] font-mono text-text-muted">
                          <Building className="w-3 h-3" />
                          <span>{msg.company}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-text-muted hidden sm:inline">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => toggleReadMutation.mutate({ id: msg.id, isRead: !msg.isRead })}
                    className="p-1.5 rounded-lg border border-border text-text-muted hover:text-text-main hover:bg-surface-hover text-xs"
                    title={msg.isRead ? "Mark as Unread" : "Mark as Read"}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this message?')) {
                        deleteMutation.mutate(msg.id);
                      }
                    }}
                    className="p-1.5 rounded-lg border border-border text-rose-400 hover:bg-rose-500/10 text-xs"
                    title="Delete Message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-background border border-border text-xs text-text-main leading-relaxed whitespace-pre-wrap">
                {msg.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
