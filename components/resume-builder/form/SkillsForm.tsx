'use client';

import { useCallback } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trash2, Plus, Zap, FileBadge } from 'lucide-react';
import { Skill } from '@/types/resume';
import { compressImage } from '@/lib/image-utils';

const PROFICIENCY_LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'] as const;
type ProficiencyLevel = typeof PROFICIENCY_LEVELS[number];

const proficiencyConfig: Record<ProficiencyLevel, { label: string; color: string; bars: number }> = {
  beginner: { label: 'Beginner', color: 'bg-orange-400', bars: 1 },
  intermediate: { label: 'Intermediate', color: 'bg-yellow-400', bars: 2 },
  advanced: { label: 'Advanced', color: 'bg-blue-400', bars: 3 },
  expert: { label: 'Expert', color: 'bg-green-400', bars: 4 },
};

function ProficiencyBars({ level }: { level: ProficiencyLevel }) {
  const { color, bars } = proficiencyConfig[level];
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4].map(i => (
        <div
          key={i}
          className={`h-2 w-4 rounded-sm transition-all ${i <= bars ? color : 'bg-muted'}`}
        />
      ))}
    </div>
  );
}

export function SkillsForm() {
  const { data, addSkill, updateSkill, removeSkill } = useResume();
  const { skills } = data;

  const handleAddSkill = useCallback(() => {
    addSkill({ name: '', proficiency: 'intermediate', certificate: '' });
  }, [addSkill]);

  const handleChange = useCallback(
    (id: string, field: keyof Omit<Skill, 'id'>, value: string) => {
      const skill = skills.find(s => s.id === id);
      if (!skill) return;
      updateSkill(id, { ...skill, [field]: value });
    },
    [skills, updateSkill]
  );

  const handleFileUpload = useCallback(async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressedBase64 = await compressImage(file);
      handleChange(id, 'certificate', compressedBase64);
    } catch (error) {
      console.error('Error compressing image:', error);
    }
  }, [handleChange]);

  return (
    <div className="space-y-3">
      {skills.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 gap-3 text-muted-foreground border-2 border-dashed rounded-lg">
          <Zap className="w-8 h-8 text-muted-foreground/40" />
          <p className="text-sm">No skills added yet</p>
        </div>
      )}

      <div className="space-y-2">
        {skills.map(skill => (
          <div
            key={skill.id}
            className="border rounded-xl p-4 space-y-3 bg-muted/20 hover:bg-muted/30 transition-colors"
          >
            <div className="flex gap-3 items-end">
              {/* Skill Name */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <Label htmlFor={`skill-name-${skill.id}`} className="text-xs font-semibold">
                  Skill
                </Label>
                <Input
                  id={`skill-name-${skill.id}`}
                  value={skill.name}
                  onChange={e => handleChange(skill.id, 'name', e.target.value)}
                  placeholder="e.g. React, Python…"
                />
              </div>

              {/* Proficiency */}
              <div className="w-36 space-y-1.5 shrink-0">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`proficiency-${skill.id}`} className="text-xs font-semibold">
                    Level
                  </Label>
                  <ProficiencyBars level={skill.proficiency} />
                </div>
                <Select
                  value={skill.proficiency}
                  onValueChange={value => handleChange(skill.id, 'proficiency', value as any)}
                >
                  <SelectTrigger id={`proficiency-${skill.id}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROFICIENCY_LEVELS.map(level => (
                      <SelectItem key={level} value={level}>
                        {proficiencyConfig[level].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeSkill(skill.id)}
                className="text-destructive hover:bg-destructive/10 p-1.5 rounded-md transition-colors mb-0.5"
                aria-label="Remove skill"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Certificate */}
            <div className="space-y-1.5">
              <Label htmlFor={`certificate-${skill.id}`} className="flex items-center gap-1.5 text-xs font-semibold">
                <FileBadge className="w-3.5 h-3.5 text-muted-foreground" />
                Course Certificate <span className="font-normal text-muted-foreground">(optional, if accredited)</span>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id={`certificate-${skill.id}`}
                  type="file"
                  accept="image/*"
                  onChange={e => handleFileUpload(skill.id, e)}
                  className="cursor-pointer file:cursor-pointer flex-1"
                />
                {skill.certificate && (
                  <p className="text-[10px] text-green-600 font-medium shrink-0">Uploaded</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={handleAddSkill}
        variant="outline"
        className="w-full gap-2 border-dashed"
      >
        <Plus className="w-4 h-4" />
        Add Skill
      </Button>

      {skills.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          {skills.length} skill{skills.length !== 1 ? 's' : ''} added
        </p>
      )}
    </div>
  );
}
