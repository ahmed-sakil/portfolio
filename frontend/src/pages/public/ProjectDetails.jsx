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
          faviconUrl: portRes.data?.profile?.favicon_url || '/favicon.svg'
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
          <div className="w-8 h-8 rounded-full border-2 border-teal-400 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs tracking-wider uppercase text-gray-400">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ color: 'var(--text-primary)' }}>
        <div className="glass-panel p-8 rounded-3xl max-w-md w-full text-center space-y-4 border border-white/10">
          <h2 className="text-xl font-bold text-white">Project Not Found</h2>
          <p className="text-xs text-gray-400">{error || 'Unable to display project information.'}</p>
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs bg-white/10 hover:bg-white/15 text-white transition"
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-slate-900/60 hover:bg-slate-800/80 hover:border-teal-400/40 text-xs font-semibold text-gray-300 hover:text-white transition-all backdrop-blur-md"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Projects
          </Link>

          <div className="flex items-center gap-2">
            {project.live_link && (
              <a
                href={project.live_link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-teal-400 text-slate-950 hover:bg-teal-300 shadow-md shadow-teal-500/20 transition"
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
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-white/10 bg-white/5 hover:bg-white/10 text-white transition"
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
                <span className="text-[11px] font-bold px-3 py-1 rounded-full border border-teal-400/30 bg-teal-400/10 text-teal-300 tracking-wide uppercase">
                  {project.type}
                </span>
              )}

              {project.level && (
                <span className="text-[11px] font-semibold px-3 py-1 rounded-full border border-white/10 bg-white/5 text-gray-300">
                  {project.level} Level
                </span>
              )}

              <span className="text-[11px] font-semibold px-3 py-1 rounded-full border border-white/10 bg-white/5 text-gray-300 inline-flex items-center gap-1.5">
                {(project.category || (isTeam ? 'Group' : 'Personal')) === 'Group' ? (
                  <>
                    <Users className="w-3 h-3 text-cyan-400" />
                    Group Project ({teamMembers.length} {teamMembers.length === 1 ? 'member' : 'members'})
                  </>
                ) : (
                  <>
                    <User className="w-3 h-3 text-gray-400" />
                    Personal Project
                  </>
                )}
              </span>
            </div>

            <div className="flex items-center gap-3.5 sm:gap-5">
              {project.icon_url && (
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-white/20 bg-slate-900/80 p-1 shrink-0 shadow-lg aspect-square">
                  <img src={project.icon_url} alt="" className="w-full h-full object-cover rounded-xl" />
                </div>
              )}
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                {project.title}
              </h1>
            </div>
          </div>

          {/* Project Cover Image */}
          {project.image_url ? (
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-slate-950/60 aspect-video shadow-xl relative">
              <img
                src={project.image_url}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/40 p-12 text-center text-gray-500 text-xs">
              No preview screenshot attached
            </div>
          )}

          {/* Project Overview */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 pb-2 border-b border-white/10">
              Project Overview
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-gray-300 whitespace-pre-line font-normal">
              {project.description}
            </p>
          </div>

          {/* Tech Stack Badges */}
          {techStack.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 pb-2 border-b border-white/10">
                Technologies & Architecture
              </h2>
              <div className="flex flex-wrap gap-2.5 pt-1">
                {techStack.map((tech, idx) => {
                  const meta = getSkillMeta(tech);
                  return (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-white/10 bg-slate-800/70 text-gray-200 hover:border-teal-400/40 transition"
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
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 pb-2 border-b border-white/10 flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-400" />
                {(project.category || (isTeam ? 'Group' : 'Personal')) === 'Group' ? 'Team & Collaborators' : 'Author & Contributors'}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {teamMembers.map((member, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl border border-white/10 bg-slate-800/40 hover:border-white/20 transition flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {member.avatar_url ? (
                        <img
                          src={member.avatar_url}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover border border-teal-400/40 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-teal-400/10 border border-teal-400/30 flex items-center justify-center text-teal-400 shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">
                          {member.name}
                        </div>
                        <div className="text-[11px] text-gray-400 truncate mt-0.5">
                          {member.role || 'Contributor'}
                        </div>
                      </div>
                    </div>

                    {member.portfolio_url && (
                      <a
                        href={member.portfolio_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-white/5 hover:bg-teal-400/20 text-gray-300 hover:text-teal-300 transition shrink-0"
                        title={`${member.name}'s Portfolio`}
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <Link
              to="/#projects"
              className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-teal-400 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> View other projects
            </Link>

            <div className="flex items-center gap-3">
              {project.github_link && (
                <a
                  href={project.github_link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition"
                >
                  <GithubIcon className="w-3.5 h-3.5" /> Codebase
                </a>
              )}
              {project.live_link && (
                <a
                  href={project.live_link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-teal-400 text-slate-950 hover:bg-teal-300 shadow-md shadow-teal-500/20 transition"
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
