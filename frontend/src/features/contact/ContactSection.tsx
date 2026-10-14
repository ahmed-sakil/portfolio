import React, { useState } from 'react';
import { 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Briefcase, 
  Rocket, 
  Lightbulb, 
  Handshake, 
  Mic, 
  MessageSquare,
  Clock,
  Zap,
  Building,
  User,
  Mail,
  ExternalLink,
  Layers,
  Share2,
  HelpCircle,
} from 'lucide-react';
import { apiClient } from '../../lib/api';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { cn } from '../../lib/utils';
import { renderResolvedIcon } from '../../lib/iconResolver';

const PURPOSES = [
  { id: 'Freelance Project', label: 'Freelance Project', icon: Briefcase },
  { id: 'Full-Time Position', label: 'Full-Time Position', icon: Rocket },
  { id: 'Consultation', label: 'Consultation', icon: Lightbulb },
  { id: 'Collaboration', label: 'Collaboration', icon: Handshake },
  { id: 'Speaking/Workshop', label: 'Speaking/Workshop', icon: Mic },
  { id: 'Other Inquiry', label: 'Other Inquiry', icon: MessageSquare },
];

export interface SpecializedServiceItem {
  id?: string;
  title: string;
  icon?: string | null;
  order?: number;
}

interface ContactSectionProps {
  socials?: Array<{
    id: string;
    title: string;
    icon: string;
    link: string;
  }>;
  services?: SpecializedServiceItem[];
  availableForWork?: boolean;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  socials = [],
  services = [],
  availableForWork = true,
}) => {
  const [selectedPurpose, setSelectedPurpose] = useState('Freelance Project');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      await apiClient('/messages', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          purpose: selectedPurpose,
          subject: `${selectedPurpose} Inquiry from ${formData.name}`,
        }),
      });

      setStatus('success');
      setFormData({ name: '', email: '', company: '', message: '' });
      setTimeout(() => setStatus('idle'), 6000);
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Submission failed. Please try again.');
    }
  };

  return (
    <section id="contact" className="space-y-6 pt-6">
      {/* Coder-vibe Section Header */}
      <SectionHeader
        tag="// contact"
        title="COMMUNICATION DISPATCH"
        subtitle="Initiate direct dialogue for contract development, engineering roles, and technical advisory."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Get in Touch Card */}
          <div className="rounded-lg bg-surface border border-border p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-background border border-border flex items-center justify-center text-accent">
                <Mail className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-text-main font-mono">// GET_IN_TOUCH</h3>
            </div>

            <div className="space-y-3">
              {/* Response Time Pill */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-md bg-background border border-border">
                <div className="w-9 h-9 rounded-md bg-surface border border-border flex items-center justify-center text-accent flex-shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-text-main font-mono">Response Time</div>
                  <div className="text-[11px] font-mono text-text-muted">Within 24 hours guaranteed</div>
                </div>
              </div>

              {/* Availability Pill */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-md bg-background border border-border">
                <div className={cn(
                  "w-9 h-9 rounded-md bg-surface border border-border flex items-center justify-center flex-shrink-0 transition-colors",
                  availableForWork ? "text-emerald-400" : "text-text-muted"
                )}>
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-text-main font-mono">Availability</div>
                  <div className={cn(
                    "text-[11px] font-mono flex items-center gap-1.5",
                    availableForWork ? "text-emerald-400" : "text-text-muted"
                  )}>
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      availableForWork ? "bg-emerald-400 animate-pulse" : "bg-neutral-500"
                    )} />
                    {availableForWork ? "Currently available for selected contracts" : "Currently unavailable / Fully booked"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Specialized Services Card */}
          <div className="rounded-lg bg-surface border border-border p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-background border border-border flex items-center justify-center text-accent">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-text-main font-mono">// SPECIALIZED_SERVICES</h3>
            </div>

            <div className="space-y-2 pt-1">
              {services.length === 0 ? (
                <div className="text-xs font-mono text-text-muted">No specialized services registered yet.</div>
              ) : (
                services.map((srv) => (
                  <div
                    key={srv.id || srv.title}
                    className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border hover:border-accent/40 transition-all duration-150 group"
                  >
                    <div className="w-8 h-8 rounded-md bg-surface border border-border flex items-center justify-center flex-shrink-0 group-hover:border-accent/40 transition-colors text-accent">
                      {renderResolvedIcon(srv.icon, <Layers className="w-4 h-4 text-accent" />, "w-4 h-4 text-accent")}
                    </div>
                    <span className="text-xs font-semibold text-text-main font-mono group-hover:text-accent transition-colors truncate">
                      {srv.title}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Connect on Social Media (All database social links with larger buttons) */}
          <div className="rounded-lg bg-surface border border-border p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-background border border-border flex items-center justify-center text-accent">
                <Share2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-text-main font-mono">// CONNECT_ON_SOCIAL_MEDIA</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {socials.length === 0 ? (
                <span className="text-xs font-mono text-text-muted sm:col-span-2">No social links configured in database.</span>
              ) : (
                socials.map((s) => (
                  <a
                    key={s.id}
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3.5 rounded-lg bg-background border border-border text-xs font-mono text-text-muted hover:text-text-main hover:border-accent/50 hover:bg-surface transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-md bg-surface border border-border flex items-center justify-center flex-shrink-0 group-hover:border-accent/40 transition-colors text-accent">
                        {renderResolvedIcon(s.icon, <ExternalLink className="w-4 h-4 text-accent" />, "w-4 h-4 text-accent")}
                      </div>
                      <span className="font-bold text-text-main group-hover:text-accent transition-colors truncate">{s.title}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:text-accent transition-all flex-shrink-0" />
                  </a>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Boxy form */}
        <div className="lg:col-span-7 rounded-lg bg-surface border border-border p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-background border border-border flex items-center justify-center text-accent">
                <HelpCircle className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-text-main font-mono flex items-center gap-1">
                <span>// WHAT_BRINGS_YOU_HERE?</span>
                <span className="text-rose-400">*</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {PURPOSES.map((purpose) => {
                const isSelected = selectedPurpose === purpose.id;
                const Icon = purpose.icon;
                return (
                  <button
                    key={purpose.id}
                    type="button"
                    onClick={() => setSelectedPurpose(purpose.id)}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all duration-150 gap-2 font-mono",
                      isSelected
                        ? "bg-background border-accent shadow-sm text-text-main font-bold"
                        : "bg-background/60 border-border text-text-muted hover:text-text-main hover:border-text-muted/40"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", isSelected ? "text-accent" : "text-text-muted")} />
                    <span className="text-xs">{purpose.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {status === 'success' && (
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2.5 font-mono">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Message dispatched! I review inbound inquiries daily and will reply within 24 hours.</span>
            </div>
          )}

          {status === 'error' && (
            <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2.5 font-mono">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1 text-[11px] font-mono text-text-muted uppercase">
                  <span>Full Name</span>
                  <span className="text-rose-400">*</span>
                </div>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Sakil Ahmed"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-background border border-border text-xs text-text-main placeholder:text-text-muted/40 focus:outline-none focus:border-accent/60 transition-colors font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-1 text-[11px] font-mono text-text-muted uppercase">
                  <span>Email Address</span>
                  <span className="text-rose-400">*</span>
                </div>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="sakil@example.com"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-background border border-border text-xs text-text-main placeholder:text-text-muted/40 focus:outline-none focus:border-accent/60 transition-colors font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-[11px] font-mono text-text-muted uppercase">
                Company / Organization (Optional)
              </div>
              <div className="relative">
                <Building className="w-3.5 h-3.5 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Your Company or Studio"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-background border border-border text-xs text-text-main placeholder:text-text-muted/40 focus:outline-none focus:border-accent/60 transition-colors font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-1 text-[11px] font-mono text-text-muted uppercase">
                <span>Your Message</span>
                <span className="text-rose-400">*</span>
              </div>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell me about your project, goals, and how I can help..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-xs text-text-main placeholder:text-text-muted/40 focus:outline-none focus:border-accent/60 transition-colors resize-none leading-relaxed font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-accent text-background font-bold text-xs hover:opacity-90 transition-opacity disabled:opacity-50 font-mono shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{status === 'loading' ? 'Transmitting...' : 'Send Message'}</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
