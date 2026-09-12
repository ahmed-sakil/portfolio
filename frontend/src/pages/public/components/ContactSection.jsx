import { useState } from 'react';
import api from '../../../utils/api';
import {
  Mail,
  Clock,
  Zap,
  Briefcase,
  Rocket,
  Lightbulb,
  Handshake,
  Mic,
  MessageSquare,
  User,
  Building2,
  Send,
  ExternalLink,
  Globe,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import GithubIcon from '../../../components/icons/GithubIcon';
import SocialIcon from '../../../components/icons/SocialIcon';

const INQUIRY_OPTIONS = [
  { id: 'freelance', label: 'Freelance Project', icon: Briefcase, color: 'text-amber-400' },
  { id: 'fulltime', label: 'Full-Time Position', icon: Rocket, color: 'text-rose-400' },
  { id: 'consultation', label: 'Consultation', icon: Lightbulb, color: 'text-yellow-400' },
  { id: 'collaboration', label: 'Collaboration', icon: Handshake, color: 'text-teal-400' },
  { id: 'speaking', label: 'Speaking/Workshop', icon: Mic, color: 'text-purple-400' },
  { id: 'other', label: 'Other Inquiry', icon: MessageSquare, color: 'text-blue-400' },
];

const DEFAULT_SERVICES = [
  { id: 1, title: 'Backend & API Architecture', color: 'bg-blue-400' },
  { id: 2, title: 'Full Stack Web Applications', color: 'bg-teal-400' },
  { id: 3, title: 'Database Optimization & SQL', color: 'bg-green-400' },
  { id: 4, title: 'Cloud Integration & DevOps', color: 'bg-amber-400' },
  { id: 5, title: 'Technical Consulting & Audit', color: 'bg-pink-400' },
];

const BULLET_COLORS = ['bg-blue-400', 'bg-teal-400', 'bg-green-400', 'bg-amber-400', 'bg-pink-400', 'bg-purple-400'];

const ContactSection = ({ profile, services = [], socialLinks = [] }) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [validationError, setValidationError] = useState('');

  const displayServices = services && services.length > 0 ? services : DEFAULT_SERVICES;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!selectedOption) {
      setValidationError('Please select what brings you here before submitting.');
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    const chosenOption = INQUIRY_OPTIONS.find((opt) => opt.id === selectedOption);
    const reasonLabel = chosenOption ? chosenOption.label : selectedOption;

    try {
      await api.post('/contact', {
        name: formData.name,
        email: formData.email,
        subject: `[${reasonLabel}] Portfolio Inquiry`,
        reason: reasonLabel,
        company: formData.company || null,
        message: formData.message,
      });

      setFeedback({
        type: 'success',
        message: 'Thank you! Your message has been sent successfully. I will get back to you within 24 hours.'
      });
      setFormData({ name: '', email: '', company: '', message: '' });
      setSelectedOption('');
    } catch (err) {
      console.error('Contact submission error:', err);
      setFeedback({
        type: 'error',
        message: 'Could not send message right now. Please email directly or try again later.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="w-[92%] sm:w-[90%] max-w-7xl mx-auto mb-16 sm:mb-20 scroll-mt-28">
      {/* All-over Section Card / Glass Panel */}
      <div className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-14 relative overflow-hidden">
        {/* Ambient subtle glow elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="relative z-10 text-center max-w-2xl mx-auto mb-8 sm:mb-12 md:mb-14">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-2 sm:mb-3">
            Let's <span style={{ color: 'var(--accent)' }}>Connect</span>
          </h2>
          <p className="text-xs sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {profile?.connect_message || "Currently open to freelance opportunities and full-time senior roles."}
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* ========================================================
            LEFT COLUMN: Info, Availability, Services, & Socials
           ======================================================== */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card 1: Get in Touch & Availability */}
          <div className="glass-section rounded-3xl p-6 md:p-8 space-y-5">
            <div className="flex items-center gap-2.5 pb-2 text-white font-bold text-lg">
              <Mail className="w-5 h-5 text-blue-400" />
              <span>Get in Touch</span>
            </div>

            {/* Response Time Box */}
            <div
              className="p-4 rounded-2xl border flex items-center gap-3.5"
              style={{ background: 'rgba(255, 255, 255, 0.03)', borderColor: 'var(--border-subtle)' }}
            >
              <div className="w-10 h-10 rounded-xl bg-green-400/10 border border-green-400/30 flex items-center justify-center text-green-400 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Response Time</h4>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                  Within 24 hours
                </p>
              </div>
            </div>

            {/* Availability Box */}
            <div
              className="p-4 rounded-2xl border flex items-center gap-3.5"
              style={{ background: 'rgba(255, 255, 255, 0.03)', borderColor: 'var(--border-subtle)' }}
            >
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Availability</h4>
                <p className="text-xs mt-0.5 flex items-center gap-1.5 text-green-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Currently available
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Services Provided (Fetched from Database) */}
          <div
            className="glass-section rounded-3xl p-6 md:p-8"
            style={{
              background: 'linear-gradient(180deg, rgba(20, 24, 45, 0.75) 0%, rgba(12, 16, 32, 0.8) 100%)',
            }}
          >
            <h3 className="text-base font-bold text-white mb-4 tracking-tight">Services</h3>
            <ul className="space-y-3">
              {displayServices.map((service, index) => (
                <li key={service.id || index} className="flex items-center gap-3 text-sm font-medium text-gray-300 hover:text-white transition group">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 group-hover:scale-125 transition-transform ${
                      BULLET_COLORS[index % BULLET_COLORS.length]
                    }`}
                  />
                  <span>{service.title}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 3: Social Media Links (if available) */}
          {socialLinks && socialLinks.length > 0 && (
            <div className="glass-section rounded-3xl p-6">
              <h3 className="text-xs uppercase tracking-wider font-bold mb-4" style={{ color: 'var(--text-muted)' }}>
                Connect on Social Media
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/10 hover:border-teal-400/50 hover:shadow-[0_0_15px_rgba(0,229,160,0.2)] text-xs font-semibold text-gray-300 hover:text-white transition-all backdrop-blur-sm"
                    style={{ background: 'rgba(255, 255, 255, 0.04)' }}
                  >
                    <SocialIcon platform={link.platform} iconName={link.icon_name} className="w-3.5 h-3.5" />
                    <span>{link.platform}</span>
                    <ExternalLink className="w-3 h-3 opacity-50 ml-0.5" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Note Box at Bottom */}
          <div
            className="p-4 rounded-2xl border text-xs leading-relaxed"
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-muted)'
            }}
          >
            <p>
              <span className="font-semibold text-gray-400">Note:</span> All form submissions are encrypted. Messages reach me directly and are answered within 24 hours.
            </p>
          </div>
        </div>

        {/* ========================================================
            RIGHT COLUMN: Form with Inquiry Selection & Message
           ======================================================== */}
        <div className="lg:col-span-7">
          <div className="glass-section rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10">
            
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              
              {/* Option Selector: "What brings you here? *" */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-white mb-2.5 sm:mb-3">
                  What brings you here? <span className="text-red-400">*</span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  {INQUIRY_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = selectedOption === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setSelectedOption(opt.id);
                          setValidationError('');
                        }}
                        className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border text-left flex flex-col items-center justify-center text-center gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-teal-400 bg-teal-400/10 shadow-[0_0_20px_rgba(0,229,160,0.25)] ring-1 ring-teal-400'
                            : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                        }`}
                        style={{
                          background: isSelected ? 'rgba(0, 229, 160, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                        }}
                      >
                        <div className={`p-1.5 sm:p-2 rounded-xl bg-white/5 ${isSelected ? 'text-teal-400' : opt.color}`}>
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <span
                          className={`text-[11px] sm:text-xs font-semibold leading-tight ${
                            isSelected ? 'text-white' : 'text-gray-300'
                          }`}
                        >
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {validationError && (
                  <p className="text-xs text-red-400 font-semibold mt-2 flex items-center gap-1.5 animate-in fade-in">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {validationError}
                  </p>
                )}
              </div>

              {/* Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 z-10">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="admin-input !pl-11 text-base sm:text-sm"
                      style={{ paddingLeft: '2.75rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 z-10">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="admin-input !pl-11 text-base sm:text-sm"
                      style={{ paddingLeft: '2.75rem' }}
                    />
                  </div>
                </div>
              </div>

              {/* Company / Organization (Optional) */}
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">
                  Company / Organization <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 z-10">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Your Company or Studio"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="admin-input !pl-11 text-base sm:text-sm"
                    style={{ paddingLeft: '2.75rem' }}
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">
                  Your Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell me about your project, goals, and how I can help..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="admin-input font-sans text-base sm:text-sm"
                />
              </div>

              {/* Feedback Alerts */}
              {feedback && (
                <div
                  className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border text-xs sm:text-sm font-medium flex items-center gap-2.5 animate-in fade-in duration-200 ${
                    feedback.type === 'success'
                      ? 'bg-teal-500/10 border-teal-500/30 text-teal-300'
                      : 'bg-red-500/10 border-red-500/30 text-red-300'
                  }`}
                >
                  {feedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-teal-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-red-400" />
                  )}
                  <span>{feedback.message}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 shadow-xl transition-all transform hover:-translate-y-0.5 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--text-inverted)',
                }}
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Sending Message...' : 'Send Message'}</span>
              </button>

            </form>

          </div>
        </div>

      </div>
      </div>
    </section>
  );
};

export default ContactSection;
