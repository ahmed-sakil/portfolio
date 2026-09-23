import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';
import { 
  ArrowLeft, 
  ExternalLink, 
  Users, 
  User, 
  Layers, 
  Calendar,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import GithubIcon from '../../components/icons/GithubIcon';
import AppIcon from '../../components/icons/AppIcon';
import SmoothScroll from '../../components/SmoothScroll';
import { updatePageMeta } from '../../utils/pageMeta';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        const [projRes, portRes] = await Promise.all([
          api.get(`/projects/${id}`).catch(async () => {
            // Fallback: search in all projects list if direct route fails
            const all = await api.get('/projects');
            const found = (all.data || []).find((p) => String(p.id) === String(id));
            if (found) return { data: found };
            throw new Error('Project not found');
          }),
          api.get('/portfolio').catch(() => ({ data: { skills: [] } }))
        ]);

        const proj = projRes.data;
        setProject(proj);
        setSkills(portRes.data?.skills || []);

        updatePageMeta({
          title: `${proj.title || 'Project Details'} — Portfolio`,
          faviconUrl: portRes.data?.profile?.favicon_url || '/favicon.png'
        });
      } catch (err) {
        console.error('Fetch project error:', err);
        setError('Project not found or unavailable.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const getSkillMeta = (techName) => {
    if (!techName) return null;
    const norm = techName.trim().toLowerCase();
    return skills.find((s) => s.name.toLowerCase() === norm);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ color: 'var(--text-primary)' }}>
        <div className="text-center space-y-3">
          <div
            className="w-8 h-8 rounded-full border-2 animate-spin mx-auto"
            style={{ borderColor: 'var(--accent-dim)', borderTopColor: 'var(--accent)' }}
          />
          <p className="text-xs tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ color: 'var(--text-primary)' }}>
        <div
          className="glass-panel p-8 rounded-3xl max-w-md w-full text-center space-y-4 border border-white/10"
          style={{ backgroundColor: 'var(--bg-surface)' }}
        >
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Project Not Found</h2>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{error || 'Unable to display project information.'}</p>
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs bg-white/10 hover:bg-white/15 transition"
            style={{ color: 'var(--text-primary)' }}
          >
            <ArrowLeft className="w-4 h-4" /> Return to Projects
          </Link>
        </div>
      </div>
    );
  }

  // Normalize tech stack
  const techStack = Array.isArray(project.tech_stack)
    ? project.tech_stack
    : (typeof project.tech_stack === 'string' ? JSON.parse(project.tech_stack || '[]') : []);

  // Normalize team members
  const teamMembers = project.team_members
    ? (Array.isArray(project.team_members) ? project.team_members : JSON.parse(project.team_members || '[]'))
    : [];

  const isTeam = project.project_type === 'TEAM';

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 relative" style={{ color: 'var(--text-primary)', zIndex: 1 }}>
      <SmoothScroll />

      <div className="w-[92%] sm:w-[90%] max-w-5xl mx-auto space-y-8">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 hover:border-accent text-xs font-semibold transition-all backdrop-blur-md"
            style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)' }}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Projects
          </Link>

          <div className="flex items-center gap-2">
            {project.live_link && (
              <a
                href={project.live_link}
                target="_blank"
                rel="noreferrer"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--text-inverted)' }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 shadow-md transition"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {project.github_link && (
              <a
                href={project.github_link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-white/10 bg-white/5 hover:bg-white/10 transition"
                style={{ color: 'var(--text-primary)' }}
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>Source</span>
              </a>
            )}
          </div>
        </div>

        {/* Main Content Container (Refined Solid Glass) */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 md:p-12 border border-white/10 shadow-2xl space-y-8">
          {/* Header Metadata */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {project.type && (
                <span
                  className="text-[11px] font-bold px-3 py-1 rounded-full border tracking-wide uppercase"
                  style={{
                    borderColor: 'var(--accent-dim)',
                    backgroundColor: 'var(--accent-dim)',
                    color: 'var(--accent)'
                  }}
                >
                  {project.type}
                </span>
              )}

              {project.level && (
                <span
                  className="text-[11px] font-semibold px-3 py-1 rounded-full border border-white/10 bg-white/5"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {project.level} Level
                </span>
              )}

              <span
                className="text-[11px] font-semibold px-3 py-1 rounded-full border border-white/10 bg-white/5 inline-flex items-center gap-1.5"
                style={{ color: 'var(--text-secondary)' }}
              >
                {(project.category || (isTeam ? 'Group' : 'Personal')) === 'Group' ? (
                  <>
                    <Users className="w-3 h-3 text-accent" />
                    Group Project ({teamMembers.length} {teamMembers.length === 1 ? 'member' : 'members'})
                  </>
                ) : (
                  <>
                    <User className="w-3 h-3 opacity-70" />
                    Personal Project
                  </>
                )}
              </span>
            </div>

            <div className="flex items-center gap-3.5 sm:gap-5">
              {project.icon_url && (
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-white/20 p-1 shrink-0 shadow-lg aspect-square"
                  style={{ backgroundColor: 'var(--bg-surface)' }}
                >
                  <img src={project.icon_url} alt="" className="w-full h-full object-cover rounded-xl" />
                </div>
              )}
              <h1
                className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                {project.title}
              </h1>
            </div>
          </div>

          {/* Project Cover Image */}
          {project.image_url ? (
            <div
              className="rounded-2xl overflow-hidden border border-white/10 aspect-video shadow-xl relative"
              style={{ backgroundColor: 'var(--bg-base)' }}
            >
              <img
                src={project.image_url}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div
              className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-xs"
              style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-muted)' }}
            >
              No preview screenshot attached
            </div>
          )}

          {/* Project Overview */}
          <div className="space-y-3">
            <h2
              className="text-sm font-bold uppercase tracking-wider pb-2 border-b border-white/10"
              style={{ color: 'var(--text-muted)' }}
            >
              Project Overview
            </h2>
            <p
              className="text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal"
              style={{ color: 'var(--text-secondary)' }}
            >
              {project.description}
            </p>
          </div>

          {/* Project Details / Case Study */}
          {project.details && project.details.trim() && (
            <div className="space-y-3">
              <h2
                className="text-sm font-bold uppercase tracking-wider pb-2 border-b border-white/10"
                style={{ color: 'var(--text-muted)' }}
              >
                Project Details &amp; Case Study
              </h2>
              <div
                className="project-case-study text-sm sm:text-base leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
                dangerouslySetInnerHTML={{ __html: project.details }}
              />
            </div>
          )}

          {/* Tech Stack Badges */}
          {techStack.length > 0 && (
            <div className="space-y-3">
              <h2
                className="text-sm font-bold uppercase tracking-wider pb-2 border-b border-white/10"
                style={{ color: 'var(--text-muted)' }}
              >
                Technologies & Architecture
              </h2>
              <div className="flex flex-wrap gap-2.5 pt-1">
                {techStack.map((tech, idx) => {
                  const meta = getSkillMeta(tech);
                  return (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-white/10 hover:border-accent transition"
                      style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}
                    >
                      <AppIcon
                        iconUrl={meta?.icon_url}
                        iconName={meta?.icon_name || tech}
                        iconType={meta?.icon_type || 'light'}
                        className="w-4 h-4 shrink-0"
                        alt={tech}
                      />
                      <span>{tech}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Team / Contributor Info Section */}
          {teamMembers.length > 0 && (
            <div className="space-y-4">
              <h2
                className="text-sm font-bold uppercase tracking-wider pb-2 border-b border-white/10 flex items-center gap-2"
                style={{ color: 'var(--text-muted)' }}
              >
                <Users className="w-4 h-4 text-accent" />
                {(project.category || (isTeam ? 'Group' : 'Personal')) === 'Group' ? 'Team & Collaborators' : 'Author & Contributors'}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {teamMembers.map((member, idx) => {
                  const hasLink = Boolean(member.portfolio_url);
                  const CardTag = hasLink ? 'a' : 'div';
                  const cardProps = hasLink
                    ? {
                        href: member.portfolio_url,
                        target: '_blank',
                        rel: 'noreferrer',
                        title: 'Open Portfolio'
                      }
                    : {};

                  return (
                    <CardTag
                      key={idx}
                      {...cardProps}
                      className={`group/member p-3.5 rounded-2xl border border-white/10 flex items-center justify-between gap-3 transition-all duration-200 ${
                        hasLink
                          ? 'cursor-pointer hover:border-accent hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5'
                          : ''
                      }`}
                      style={{ backgroundColor: 'var(--bg-surface)' }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {member.avatar_url ? (
                          <img
                            src={member.avatar_url}
                            alt={member.name}
                            className="w-10 h-10 rounded-full object-cover border border-accent/60 shrink-0 group-hover/member:scale-105 group-hover/member:border-accent transition-all"
                          />
                        ) : (
                          <div
                            className="w-10 h-10 rounded-full border flex items-center justify-center shrink-0 group-hover/member:scale-105 transition-transform"
                            style={{ borderColor: 'var(--accent-dim)', backgroundColor: 'var(--accent-dim)', color: 'var(--accent)' }}
                          >
                            <User className="w-4 h-4" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div
                            className="text-xs font-bold truncate group-hover/member:text-accent transition-colors"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            {member.name}
                          </div>
                          <div className="text-[11px] truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            {member.role || 'Contributor'}
                          </div>
                        </div>
                      </div>

                      {hasLink && (
                        <div
                          className="flex items-center gap-1.5 px-2 py-1 rounded-xl border border-transparent group-hover/member:border-accent/40 group-hover/member:bg-accent/10 transition-all shrink-0"
                          style={{ color: 'var(--accent)' }}
                        >
                          <span className="max-w-0 overflow-hidden group-hover/member:max-w-[120px] transition-all duration-300 ease-in-out whitespace-nowrap opacity-0 group-hover/member:opacity-100 text-[11px] font-semibold">
                            Open Portfolio
                          </span>
                          <ExternalLink className="w-3.5 h-3.5 shrink-0 group-hover/member:translate-x-0.5 group-hover/member:-translate-y-0.5 transition-transform" />
                        </div>
                      )}
                    </CardTag>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <Link
              to="/#projects"
              className="inline-flex items-center gap-2 text-xs font-semibold hover:underline transition"
              style={{ color: 'var(--accent)' }}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> View other projects
            </Link>

            <div className="flex items-center gap-3">
              {project.github_link && (
                <a
                  href={project.github_link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-white/10 bg-white/5 hover:bg-white/10 transition"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <GithubIcon className="w-3.5 h-3.5" /> Codebase
                </a>
              )}
              {project.live_link && (
                <a
                  href={project.live_link}
                  target="_blank"
                  rel="noreferrer"
                  style={{ backgroundColor: 'var(--accent)', color: 'var(--text-inverted)' }}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold hover:opacity-90 shadow-md transition"
                >
                  Launch App <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
