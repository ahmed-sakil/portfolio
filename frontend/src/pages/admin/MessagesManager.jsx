import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuthStore } from '../../store/authStore';
import { Mail, CheckCircle2, Reply, Trash2, Clock, User } from 'lucide-react';

const MessagesManager = () => {
  const token = useAuthStore((state) => state.token);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await api.get('/admin/messages');
      setMessages(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleMarkRead = async (id) => {
    try {
      await api.patch(`/admin/messages/${id}/read`, {});
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="space-y-8">
      <div className="admin-card p-6 md:p-8">
        {/* Header with Teal Icon Badge */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-teal-400/30 bg-teal-400/10 text-teal-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Visitor Messages & Inquiries ({messages.length})
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Inquiries, freelance requests, and contact submissions from your public portfolio.
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <span className="admin-badge flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              {unreadCount} unread
            </span>
          )}
        </div>

        {/* Messages Content */}
        {loading ? (
          <div className="py-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="p-12 text-center border rounded-2xl border-dashed" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
            <Mail className="w-10 h-10 mx-auto mb-3 opacity-40 text-teal-400" />
            <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>No messages in inbox</p>
            <p className="text-xs mt-1">When someone submits your contact form, their message will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="p-5 rounded-2xl border transition-all"
                style={{
                  background: msg.is_read ? 'var(--bg-surface-hover)' : 'rgba(0, 229, 160, 0.04)',
                  borderColor: msg.is_read ? 'var(--border-subtle)' : 'rgba(0, 229, 160, 0.3)',
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border"
                      style={{
                        background: msg.is_read ? 'var(--bg-card)' : 'rgba(0, 229, 160, 0.15)',
                        color: msg.is_read ? 'var(--text-muted)' : 'var(--accent)',
                        borderColor: 'var(--border-subtle)',
                      }}
                    >
                      {msg.name ? msg.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                          {msg.subject || 'Portfolio Inquiry'}
                        </h4>
                        {msg.reason && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-400/20 text-teal-300 border border-teal-400/30">
                            {msg.reason}
                          </span>
                        )}
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                        From <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{msg.name}</span>
                        {msg.company && (
                          <span> • <span className="text-gray-300 font-medium">({msg.company})</span></span>
                        )}
                        {' '}•{' '}
                        <a
                          href={`mailto:${msg.email}`}
                          className="hover:underline font-mono"
                          style={{ color: 'var(--accent)' }}
                        >
                          {msg.email}
                        </a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <a
                      href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Portfolio Inquiry')}`}
                      className="admin-btn-secondary text-xs py-1.5 px-3"
                      title="Reply via Email"
                    >
                      <Reply className="w-3.5 h-3.5 mr-1 text-teal-400" /> Reply
                    </a>

                    {!msg.is_read && (
                      <button
                        onClick={() => handleMarkRead(msg.id)}
                        className="admin-btn-primary text-xs py-1.5 px-3"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Mark Read
                      </button>
                    )}
                  </div>
                </div>

                <div
                  className="mt-3 p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap border"
                  style={{
                    background: 'var(--bg-input)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {msg.message}
                </div>

                <div className="flex items-center gap-1.5 mt-3 text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
                  <Clock className="w-3 h-3 text-teal-400" />
                  {new Date(msg.created_at).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesManager;
