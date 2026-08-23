'use client';

import type { ResumeData } from '@/lib/server/redisActions';
import type { AccountPlan } from '@/lib/server/redisActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { LockKeyhole, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

const themeOptions = [
  { id: 'signal', name: 'Signal', description: 'Clean, direct, recruiter-friendly.' },
  { id: 'studio', name: 'Studio', description: 'Soft blue canvas for product builders.' },
  { id: 'terminal', name: 'Terminal', description: 'Structured engineering dossier.' },
] as const;

const visibilityOptions = [
  ['email', 'Email'],
  ['phone', 'Phone'],
  ['location', 'Location'],
  ['education', 'Education'],
  ['resumeDownload', 'Resume download'],
] as const;

const createId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `profile-${Date.now()}`;

export function ProfileEnhancements({
  resume,
  plan,
  onChangeResume,
}: {
  resume: ResumeData;
  plan: AccountPlan;
  onChangeResume: (resume: ResumeData) => void;
}) {
  const updateProfileBlocks = (
    profileBlocks: ResumeData['profileBlocks'],
  ) => onChangeResume({ ...resume, profileBlocks });

  return (
    <div className="space-y-8 border-t border-neutral-200 pt-8">
      <section className="space-y-4" aria-labelledby="profile-style-heading">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="profile-style-heading" className="text-xl font-bold">
              Profile style
            </h2>
            <p className="mt-1 text-sm text-design-gray">
              Signal is free. Studio and Terminal are included in Pro.
            </p>
          </div>
          {plan === 'free' ? (
            <Link href="/pricing" className="text-sm font-semibold underline underline-offset-4">
              See Pro
            </Link>
          ) : null}
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {themeOptions.map((theme) => {
            const locked = plan === 'free' && theme.id !== 'signal';
            const selected = resume.themeId === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                disabled={locked}
                onClick={() => onChangeResume({ ...resume, themeId: theme.id })}
                className={`relative rounded-lg border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#050914] disabled:cursor-not-allowed disabled:opacity-55 ${
                  selected ? 'border-[#315efb] bg-[#eef1ff]' : 'border-neutral-200 bg-white'
                }`}
                aria-pressed={selected}
              >
                {locked ? (
                  <LockKeyhole className="absolute right-3 top-3 size-4" aria-label="Pro theme" />
                ) : null}
                <span className="font-semibold">{theme.name}</span>
                <span className="mt-2 block text-xs leading-5 text-design-gray">
                  {theme.description}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="visibility-heading">
        <div>
          <h2 id="visibility-heading" className="text-xl font-bold">
            Public visibility
          </h2>
          <p className="mt-1 text-sm text-design-gray">
            Choose which personal details appear on the published profile.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {visibilityOptions.map(([key, label]) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-3"
            >
              <Label htmlFor={`visibility-${key}`}>{label}</Label>
              <Switch
                id={`visibility-${key}`}
                checked={resume.visibility[key]}
                onCheckedChange={(checked) =>
                  onChangeResume({
                    ...resume,
                    visibility: { ...resume.visibility, [key]: checked },
                  })
                }
                aria-label={`Show ${label.toLowerCase()} publicly`}
              />
            </div>
          ))}
        </div>
        {resume.visibility.resumeDownload ? (
          <div className="space-y-2">
            <Label htmlFor="resume-download-url">Public resume URL</Label>
            <Input
              id="resume-download-url"
              type="url"
              value={resume.profileBlocks.resumeDownloadUrl ?? ''}
              onChange={(event) =>
                updateProfileBlocks({
                  ...resume.profileBlocks,
                  resumeDownloadUrl: event.target.value || null,
                })
              }
              placeholder="https://example.com/resume.pdf"
            />
          </div>
        ) : null}
      </section>

      <section className="space-y-4" aria-labelledby="projects-editor-heading">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="projects-editor-heading" className="text-xl font-bold">
              Selected projects
            </h2>
            <p className="mt-1 text-sm text-design-gray">
              Show outcomes and proof, not a full repository list. Maximum six.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={resume.profileBlocks.projects.length >= 6}
            onClick={() =>
              updateProfileBlocks({
                ...resume.profileBlocks,
                projects: [
                  ...resume.profileBlocks.projects,
                  {
                    id: createId(),
                    name: '',
                    description: '',
                    url: null,
                    sourceUrl: null,
                    technologies: [],
                  },
                ],
              })
            }
          >
            <Plus className="mr-1 size-4" aria-hidden="true" /> Add project
          </Button>
        </div>
        <div className="space-y-4">
          {resume.profileBlocks.projects.map((project, index) => (
            <div key={project.id} className="space-y-4 rounded-lg border border-neutral-200 p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Project {index + 1}</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    updateProfileBlocks({
                      ...resume.profileBlocks,
                      projects: resume.profileBlocks.projects.filter((_, itemIndex) => itemIndex !== index),
                    })
                  }
                  aria-label={`Delete project ${index + 1}`}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`project-name-${project.id}`}>Project name</Label>
                  <Input
                    id={`project-name-${project.id}`}
                    value={project.name}
                    onChange={(event) => {
                      const projects = [...resume.profileBlocks.projects];
                      projects[index] = { ...project, name: event.target.value };
                      updateProfileBlocks({ ...resume.profileBlocks, projects });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`project-tech-${project.id}`}>Technologies</Label>
                  <Input
                    id={`project-tech-${project.id}`}
                    value={project.technologies.join(', ')}
                    onChange={(event) => {
                      const projects = [...resume.profileBlocks.projects];
                      projects[index] = {
                        ...project,
                        technologies: event.target.value.split(',').map((item) => item.trim()).filter(Boolean).slice(0, 8),
                      };
                      updateProfileBlocks({ ...resume.profileBlocks, projects });
                    }}
                    placeholder="TypeScript, React, Postgres"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`project-description-${project.id}`}>Outcome and contribution</Label>
                <Textarea
                  id={`project-description-${project.id}`}
                  value={project.description}
                  maxLength={320}
                  onChange={(event) => {
                    const projects = [...resume.profileBlocks.projects];
                    projects[index] = { ...project, description: event.target.value };
                    updateProfileBlocks({ ...resume.profileBlocks, projects });
                  }}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ['url', 'Live URL', 'https://your-project.com'],
                  ['sourceUrl', 'Source URL', 'https://github.com/you/project'],
                ].map(([key, label, placeholder]) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={`${key}-${project.id}`}>{label}</Label>
                    <Input
                      id={`${key}-${project.id}`}
                      type="url"
                      value={project[key as 'url' | 'sourceUrl'] ?? ''}
                      placeholder={placeholder}
                      onChange={(event) => {
                        const projects = [...resume.profileBlocks.projects];
                        projects[index] = { ...project, [key]: event.target.value || null };
                        updateProfileBlocks({ ...resume.profileBlocks, projects });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4" aria-labelledby="links-editor-heading">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="links-editor-heading" className="text-xl font-bold">
              Professional links
            </h2>
            <p className="mt-1 text-sm text-design-gray">Add writing, demos, portfolios, or focused proof.</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={resume.profileBlocks.links.length >= 8}
            onClick={() =>
              updateProfileBlocks({
                ...resume.profileBlocks,
                links: [
                  ...resume.profileBlocks.links,
                  { id: createId(), label: '', url: '', kind: 'other' },
                ],
              })
            }
          >
            <Plus className="mr-1 size-4" aria-hidden="true" /> Add link
          </Button>
        </div>
        <div className="space-y-3">
          {resume.profileBlocks.links.map((link, index) => (
            <div key={link.id} className="grid gap-3 rounded-lg border border-neutral-200 p-4 sm:grid-cols-[1fr_1.5fr_auto]">
              <div className="space-y-2">
                <Label htmlFor={`link-label-${link.id}`}>Label</Label>
                <Input
                  id={`link-label-${link.id}`}
                  value={link.label}
                  onChange={(event) => {
                    const links = [...resume.profileBlocks.links];
                    links[index] = { ...link, label: event.target.value };
                    updateProfileBlocks({ ...resume.profileBlocks, links });
                  }}
                  placeholder="Technical writing"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`link-url-${link.id}`}>URL</Label>
                <Input
                  id={`link-url-${link.id}`}
                  type="url"
                  value={link.url}
                  onChange={(event) => {
                    const links = [...resume.profileBlocks.links];
                    links[index] = { ...link, url: event.target.value };
                    updateProfileBlocks({ ...resume.profileBlocks, links });
                  }}
                  placeholder="https://example.com"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="self-end"
                onClick={() =>
                  updateProfileBlocks({
                    ...resume.profileBlocks,
                    links: resume.profileBlocks.links.filter((_, itemIndex) => itemIndex !== index),
                  })
                }
                aria-label={`Delete link ${index + 1}`}
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
