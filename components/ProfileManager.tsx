'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useFunnelAnalytics } from '@/hooks/useFunnelAnalytics';

type Profile = { id: string; slug: string; label: string; status: 'live' | 'draft'; lockedAt: string | null; expiresAt: string | null };

export function ProfileManager({ username, plan }: { username: string; plan: 'free' | 'pro' }) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [label, setLabel] = useState('');
  const [slug, setSlug] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const plausible = useFunnelAnalytics();
  const load = () => fetch('/api/profiles').then((r) => r.json()).then((r) => setProfiles(r.profiles ?? [])).catch(() => undefined);
  useEffect(() => { load(); }, []);

  const create = async () => {
    setLoading(true);
    const response = await fetch('/api/profiles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ label, slug, jobDescription }) });
    const result = await response.json();
    setLoading(false);
    if (!response.ok) {
      if (result.code === 'AI_QUOTA_REACHED') plausible('quota_reached', { props: { quota: 'ai_generation' } });
      if (result.code === 'PROFILE_LIMIT_REACHED') plausible('quota_reached', { props: { quota: 'profile' } });
      return toast.error(result.error ?? 'Unable to create profile');
    }
    plausible('version_created', { props: { profile_count: profiles.length + 2 } });
    toast.success('Job-specific profile created. Review it before publishing.');
    setOpen(false); setLabel(''); setSlug(''); setJobDescription(''); load();
  };
  const setStatus = async (profile: Profile) => {
    const response = await fetch(`/api/profiles/${profile.slug}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: profile.status === 'live' ? 'draft' : 'live' }),
    });
    const result = await response.json();
    if (!response.ok) return toast.error(result.error ?? 'Unable to update profile');
    load();
  };
  const remove = async (profile: Profile) => {
    const response = await fetch(`/api/profiles/${profile.slug}`, { method: 'DELETE' });
    if (!response.ok) return toast.error('Unable to delete profile');
    load();
  };

  return (
    <section className="rounded-lg border border-neutral-300 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div><h2 className="font-semibold">Profiles</h2><p className="text-sm text-neutral-600">Primary plus {profiles.length} job-specific version{profiles.length === 1 ? '' : 's'}.</p></div>
        {plan === 'pro' ? <Button variant="outline" onClick={() => setOpen(!open)}>New version</Button> : <Button asChild variant="outline"><Link href="/pricing">Unlock versions</Link></Button>}
      </div>
      {open && <div className="mt-4 grid gap-3 border-t pt-4">
        <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label, e.g. Product Designer" />
        <Input value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} placeholder="URL slug, e.g. product-designer" />
        <Textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste the job description. It is used for this generation only and is not stored." rows={8} />
        <p className="text-xs text-neutral-500">AI may reorder and rewrite existing facts only. Failed generations do not use quota.</p>
        <Button onClick={create} disabled={loading || jobDescription.length < 80}>{loading ? 'Generating…' : 'Generate draft'}</Button>
      </div>}
      {profiles.length > 0 && <ul className="mt-4 divide-y border-t">{profiles.map((profile) => <li key={profile.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm"><span>{profile.label} · {profile.lockedAt ? 'locked' : profile.status}</span><div className="flex items-center gap-3"><Link className="underline" href={`/preview/${profile.slug}`}>Review</Link>{profile.status === 'live' && !profile.lockedAt && <Link className="underline" href={`/${username}/${profile.slug}`} target="_blank">Public URL</Link>}<button className="underline disabled:opacity-50" disabled={Boolean(profile.lockedAt)} onClick={() => setStatus(profile)}>{profile.status === 'live' ? 'Unpublish' : 'Publish'}</button><button className="text-red-700 underline" onClick={() => remove(profile)}>Delete</button></div></li>)}</ul>}
    </section>
  );
}
