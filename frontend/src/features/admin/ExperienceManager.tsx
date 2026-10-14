import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';
import { Briefcase, GraduationCap, Trash2, Edit2 } from 'lucide-react';
import { ImageUploader } from './ImageUploader';

interface Experience {
  id: string;
  company: string;
  role: string;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  logoUrl?: string | null;
  description?: string | null;
  order: number;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field?: string | null;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  grade?: string | null;
  location?: string | null;
  logoUrl?: string | null;
  description?: string | null;
  order: number;
}

export const ExperienceManager: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'experience' | 'education'>('experience');

  const { data, isLoading } = useQuery<{ experiences: Experience[]; educations: Education[] }>({
    queryKey: ['profile'],
    queryFn: () => apiClient('/profile'),
  });

  const experiences = data?.experiences || [];
  const educations = data?.educations || [];

  // Experience Form State
  const [expForm, setExpForm] = useState({
    company: '',
    role: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
    logoUrl: '',
    current: false,
    order: 0,
  });
  const [editingExpId, setEditingExpId] = useState<string | null>(null);

  // Education Form State
  const [eduForm, setEduForm] = useState({
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    grade: '',
    location: '',
    logoUrl: '',
    description: '',
    current: false,
    order: 0,
  });
  const [editingEduId, setEditingEduId] = useState<string | null>(null);

  // Experience Mutations
  const saveExpMutation = useMutation({
    mutationFn: (e: typeof expForm) => {
      if (editingExpId) {
        return apiClient(`/profile/experiences/${editingExpId}`, { method: 'PUT', body: JSON.stringify(e) });
      }
      return apiClient('/profile/experiences', { method: 'POST', body: JSON.stringify(e) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      resetExp();
    },
  });

  const deleteExpMutation = useMutation({
    mutationFn: (id: string) => apiClient(`/profile/experiences/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
  });

  // Education Mutations
  const saveEduMutation = useMutation({
    mutationFn: (ed: typeof eduForm) => {
      if (editingEduId) {
        return apiClient(`/profile/educations/${editingEduId}`, { method: 'PUT', body: JSON.stringify(ed) });
      }
      return apiClient('/profile/educations', { method: 'POST', body: JSON.stringify(ed) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      resetEdu();
    },
  });

  const deleteEduMutation = useMutation({
    mutationFn: (id: string) => apiClient(`/profile/educations/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
  });

  const resetExp = () => {
    setEditingExpId(null);
    setExpForm({
      company: '',
      role: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      logoUrl: '',
      current: false,
      order: experiences.length,
    });
  };

  const resetEdu = () => {
    setEditingEduId(null);
    setEduForm({
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      grade: '',
      location: '',
      logoUrl: '',
      description: '',
      current: false,
      order: educations.length,
    });
  };

  if (isLoading) {
    return <div className="text-xs font-mono text-text-muted">Loading timeline...</div>;
  }

  return (
    <div className="space-y-6 font-mono">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-accent" />
          <h2 className="text-sm font-bold text-text-main">Experience & Education Timeline</h2>
        </div>

        <div className="flex items-center gap-1 bg-surface p-1 rounded-lg border border-border">
          <button
            onClick={() => setActiveTab('experience')}
            className={`px-3 py-1 rounded text-xs transition-colors ${
              activeTab === 'experience'
                ? 'bg-accent text-background font-bold'
                : 'text-text-muted hover:text-text-main'
            }`}
          >
            Experience ({experiences.length})
          </button>
          <button
            onClick={() => setActiveTab('education')}
            className={`px-3 py-1 rounded text-xs transition-colors ${
              activeTab === 'education'
                ? 'bg-accent text-background font-bold'
                : 'text-text-muted hover:text-text-main'
            }`}
          >
            Education ({educations.length})
          </button>
        </div>
      </div>

      {activeTab === 'experience' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Experience Form */}
          <div className="p-6 rounded-xl bg-surface border border-border space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase text-text-main">
                {editingExpId ? 'Edit Work Experience' : 'Add Work Experience'}
              </h3>
              {editingExpId && (
                <button onClick={resetExp} className="text-xs text-text-muted hover:text-text-main">
                  Cancel
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-text-muted">Company / Organization</label>
                <input
                  type="text"
                  value={expForm.company}
                  onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-text-muted">Role / Title</label>
                <input
                  type="text"
                  value={expForm.role}
                  onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-text-muted">Location</label>
                <input
                  type="text"
                  value={expForm.location}
                  onChange={(e) => setExpForm({ ...expForm, location: e.target.value })}
                  placeholder="Remote / City, Country"
                  className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-text-muted">Start Date</label>
                  <input
                    type="text"
                    placeholder="Jan 2022"
                    value={expForm.startDate}
                    onChange={(e) => setExpForm({ ...expForm, startDate: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-text-muted">End Date</label>
                  <input
                    type="text"
                    placeholder="Present"
                    disabled={expForm.current}
                    value={expForm.current ? 'Present' : expForm.endDate}
                    onChange={(e) => setExpForm({ ...expForm, endDate: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-text-main cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={expForm.current}
                  onChange={(e) => setExpForm({ ...expForm, current: e.target.checked })}
                  className="rounded border-border"
                />
                <span>Currently Working Here</span>
              </label>

              {/* Company Logo Uploader */}
              <div className="space-y-1">
                <ImageUploader
                  label="Company Logo"
                  onUploadSuccess={(url) => setExpForm((prev) => ({ ...prev, logoUrl: url }))}
                />
                <input
                  type="text"
                  placeholder="Or logo URL..."
                  value={expForm.logoUrl}
                  onChange={(e) => setExpForm({ ...expForm, logoUrl: e.target.value })}
                  className="w-full px-2.5 py-1 rounded bg-background border border-border text-xs text-text-main focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-text-muted">Responsibilities & Highlights</label>
                <textarea
                  rows={3}
                  value={expForm.description}
                  onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none resize-none"
                />
              </div>

              <button
                onClick={() => saveExpMutation.mutate(expForm)}
                disabled={!expForm.company || !expForm.role || saveExpMutation.isPending}
                className="w-full py-2 rounded-lg bg-accent text-background font-bold text-xs hover:opacity-90 disabled:opacity-50 transition-opacity mt-2"
              >
                {editingExpId ? 'Update Experience' : 'Save Experience'}
              </button>
            </div>
          </div>

          {/* Experience List */}
          <div className="lg:col-span-2 space-y-2.5">
            {experiences.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-surface border border-border text-xs text-text-muted">
                No work experience recorded.
              </div>
            ) : (
              experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="flex items-start justify-between p-4 rounded-xl bg-surface border border-border gap-3"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {exp.logoUrl ? (
                        <img src={exp.logoUrl} alt={exp.company} className="w-full h-full object-cover" />
                      ) : (
                        <Briefcase className="w-4 h-4 text-accent" />
                      )}
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-text-main">{exp.company}</span>
                        <span className="text-[10px] text-text-muted">({exp.startDate} - {exp.current ? 'Present' : exp.endDate})</span>
                      </div>
                      <div className="text-xs text-accent">{exp.role}</div>
                      {exp.location && <div className="text-[10px] text-text-muted">{exp.location}</div>}
                      {exp.description && (
                        <p className="text-[11px] text-text-muted leading-relaxed line-clamp-2 mt-1">{exp.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => {
                        setEditingExpId(exp.id);
                        setExpForm({
                          company: exp.company,
                          role: exp.role,
                          location: exp.location || '',
                          startDate: exp.startDate,
                          endDate: exp.endDate || '',
                          description: exp.description || '',
                          logoUrl: exp.logoUrl || '',
                          current: exp.current,
                          order: exp.order,
                        });
                      }}
                      className="p-1.5 rounded hover:bg-surface-hover text-text-muted hover:text-text-main"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteExpMutation.mutate(exp.id)}
                      className="p-1.5 rounded hover:bg-rose-500/10 text-rose-400"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Education Form */}
          <div className="p-6 rounded-xl bg-surface border border-border space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase text-text-main">
                {editingEduId ? 'Edit Education' : 'Add Education'}
              </h3>
              {editingEduId && (
                <button onClick={resetEdu} className="text-xs text-text-muted hover:text-text-main">
                  Cancel
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              <div className="space-y-1">
                <label className="text-[10px] uppercase text-text-muted">Institution / University</label>
                <input
                  type="text"
                  value={eduForm.institution}
                  onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-text-muted">Degree</label>
                <input
                  type="text"
                  placeholder="e.g. B.Sc. in Computer Science"
                  value={eduForm.degree}
                  onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-text-muted">Field of Study</label>
                  <input
                    type="text"
                    placeholder="Computer Science"
                    value={eduForm.field}
                    onChange={(e) => setEduForm({ ...eduForm, field: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-text-muted">Grade / CGPA</label>
                  <input
                    type="text"
                    placeholder="CGPA 3.8 / 4.0"
                    value={eduForm.grade}
                    onChange={(e) => setEduForm({ ...eduForm, grade: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-text-muted">Start Date</label>
                  <input
                    type="text"
                    placeholder="2018"
                    value={eduForm.startDate}
                    onChange={(e) => setEduForm({ ...eduForm, startDate: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-text-muted">End Date</label>
                  <input
                    type="text"
                    placeholder="2022"
                    disabled={eduForm.current}
                    value={eduForm.current ? 'Present' : eduForm.endDate}
                    onChange={(e) => setEduForm({ ...eduForm, endDate: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Institution Logo */}
              <div className="space-y-1">
                <ImageUploader
                  label="Institution Logo"
                  onUploadSuccess={(url) => setEduForm((prev) => ({ ...prev, logoUrl: url }))}
                />
                <input
                  type="text"
                  placeholder="Or logo URL..."
                  value={eduForm.logoUrl}
                  onChange={(e) => setEduForm({ ...eduForm, logoUrl: e.target.value })}
                  className="w-full px-2.5 py-1 rounded bg-background border border-border text-xs text-text-main focus:outline-none"
                />
              </div>

              <button
                onClick={() => saveEduMutation.mutate(eduForm)}
                disabled={!eduForm.institution || !eduForm.degree || saveEduMutation.isPending}
                className="w-full py-2 rounded-lg bg-accent text-background font-bold text-xs hover:opacity-90 disabled:opacity-50 transition-opacity mt-2"
              >
                {editingEduId ? 'Update Education' : 'Save Education'}
              </button>
            </div>
          </div>

          {/* Education List */}
          <div className="lg:col-span-2 space-y-2.5">
            {educations.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-surface border border-border text-xs text-text-muted">
                No education history recorded.
              </div>
            ) : (
              educations.map((edu) => (
                <div
                  key={edu.id}
                  className="flex items-start justify-between p-4 rounded-xl bg-surface border border-border gap-3"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {edu.logoUrl ? (
                        <img src={edu.logoUrl} alt={edu.institution} className="w-full h-full object-cover" />
                      ) : (
                        <GraduationCap className="w-4 h-4 text-accent" />
                      )}
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-text-main">{edu.institution}</span>
                        <span className="text-[10px] text-text-muted">({edu.startDate} - {edu.current ? 'Present' : edu.endDate})</span>
                      </div>
                      <div className="text-xs text-accent">{edu.degree}</div>
                      {edu.grade && <div className="text-[10px] text-text-muted">{edu.grade}</div>}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => {
                        setEditingEduId(edu.id);
                        setEduForm({
                          institution: edu.institution,
                          degree: edu.degree,
                          field: edu.field || '',
                          startDate: edu.startDate,
                          endDate: edu.endDate || '',
                          grade: edu.grade || '',
                          location: edu.location || '',
                          logoUrl: edu.logoUrl || '',
                          description: edu.description || '',
                          current: edu.current,
                          order: edu.order,
                        });
                      }}
                      className="p-1.5 rounded hover:bg-surface-hover text-text-muted hover:text-text-main"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteEduMutation.mutate(edu.id)}
                      className="p-1.5 rounded hover:bg-rose-500/10 text-rose-400"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
