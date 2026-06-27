'use client';

import { useCallback } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus, BriefcaseBusiness, X } from 'lucide-react';

export function ExperienceForm() {
  const { data, addExperience, updateExperience, removeExperience } = useResume();
  const { experiences } = data;

  const handleAddExperience = useCallback(() => {
    addExperience({
      company: '', position: '', startDate: '', endDate: '',
      currentlyWorking: false, bullets: [''],
    });
  }, [addExperience]);

  const handleChange = useCallback(
    (id: string, field: string, value: any) => {
      const experience = experiences.find(e => e.id === id);
      if (!experience) return;
      updateExperience(id, { ...experience, [field]: value });
    },
    [experiences, updateExperience]
  );

  const handleBulletChange = useCallback(
    (expId: string, idx: number, value: string) => {
      const experience = experiences.find(e => e.id === expId);
      if (!experience) return;
      const bullets = [...experience.bullets];
      bullets[idx] = value;
      handleChange(expId, 'bullets', bullets);
    },
    [experiences, handleChange]
  );

  const addBullet = useCallback((expId: string) => {
    const experience = experiences.find(e => e.id === expId);
    if (!experience) return;
    handleChange(expId, 'bullets', [...experience.bullets, '']);
  }, [experiences, handleChange]);

  const removeBullet = useCallback((expId: string, idx: number) => {
    const experience = experiences.find(e => e.id === expId);
    if (!experience) return;
    const bullets = experience.bullets.filter((_, i) => i !== idx);
    handleChange(expId, 'bullets', bullets.length > 0 ? bullets : ['']);
  }, [experiences, handleChange]);

  return (
    <div className="space-y-4">
      {experiences.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 gap-3 text-muted-foreground border-2 border-dashed rounded-lg">
          <BriefcaseBusiness className="w-8 h-8 text-muted-foreground/40" />
          <p className="text-sm">No work experience added yet</p>
        </div>
      )}

      {experiences.map((experience, idx) => (
        <div key={experience.id} className="border rounded-xl p-4 space-y-3 bg-muted/20 hover:bg-muted/30 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Experience #{idx + 1}
            </span>
            <button
              onClick={() => removeExperience(experience.id)}
              className="text-destructive hover:bg-destructive/10 p-1.5 rounded-md transition-colors"
              aria-label="Remove experience"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor={`company-${experience.id}`} className="text-xs font-semibold">Company</Label>
              <Input id={`company-${experience.id}`} value={experience.company}
                onChange={e => handleChange(experience.id, 'company', e.target.value)} placeholder="Acme Inc." />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`position-${experience.id}`} className="text-xs font-semibold">Position / Title</Label>
              <Input id={`position-${experience.id}`} value={experience.position}
                onChange={e => handleChange(experience.id, 'position', e.target.value)} placeholder="Senior Media Buyer" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor={`startDate-${experience.id}`} className="text-xs font-semibold">Start Date</Label>
              <Input id={`startDate-${experience.id}`} type="month" value={experience.startDate}
                onChange={e => handleChange(experience.id, 'startDate', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`endDate-${experience.id}`}
                className={`text-xs font-semibold ${experience.currentlyWorking ? 'text-muted-foreground/50' : ''}`}>
                End Date
              </Label>
              <Input id={`endDate-${experience.id}`} type="month" value={experience.endDate}
                onChange={e => handleChange(experience.id, 'endDate', e.target.value)}
                disabled={experience.currentlyWorking} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id={`current-${experience.id}`} checked={experience.currentlyWorking}
              onCheckedChange={checked => handleChange(experience.id, 'currentlyWorking', Boolean(checked))} />
            <Label htmlFor={`current-${experience.id}`} className="text-xs font-normal cursor-pointer">
              I currently work here
            </Label>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">Key Achievements & Responsibilities</Label>
            {experience.bullets.map((bullet, bIdx) => (
              <div key={bIdx} className="flex gap-2 items-start">
                <span className="text-muted-foreground mt-2.5 text-xs">•</span>
                <div className="flex-1">
                  <Input
                    value={bullet}
                    onChange={e => handleBulletChange(experience.id, bIdx, e.target.value)}
                    placeholder='e.g., "Successfully managed $500K+ monthly ad budget across Meta and Google platforms"'
                    className="text-sm"
                  />
                </div>
                <button
                  onClick={() => removeBullet(experience.id, bIdx)}
                  className="text-muted-foreground hover:text-destructive p-1.5 rounded-md transition-colors mt-0.5"
                  aria-label="Remove bullet point"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <Button onClick={() => addBullet(experience.id)} variant="ghost" size="sm" className="gap-1 text-xs h-7">
              <Plus className="w-3 h-3" /> Add bullet point
            </Button>
            <p className="text-[10px] text-muted-foreground/60 italic">
              Use active voice: start each point with a strong action verb (Managed, Developed, Led, Achieved)
            </p>
          </div>
        </div>
      ))}

      <Button onClick={handleAddExperience} variant="outline" className="w-full gap-2 border-dashed">
        <Plus className="w-4 h-4" /> Add Work Experience
      </Button>
    </div>
  );
}
