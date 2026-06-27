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
import { Trash2, Plus, FolderKanban, X } from 'lucide-react';

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
        <div key={i} className={`h-2 w-4 rounded-sm transition-all ${i <= bars ? color : 'bg-muted'}`} />
      ))}
    </div>
  );
}

export function SkillsForm() {
  const { data, addSkillCategory, updateSkillCategory, removeSkillCategory } = useResume();
  const { skillCategories } = data;

  const handleAddCategory = useCallback(() => {
    addSkillCategory({ category: '', skills: [{ name: '', proficiency: 'intermediate' }] });
  }, [addSkillCategory]);

  const handleCategoryChange = useCallback(
    (id: string, field: string, value: any) => {
      const cat = skillCategories.find(c => c.id === id);
      if (!cat) return;
      updateSkillCategory(id, { ...cat, [field]: value });
    },
    [skillCategories, updateSkillCategory]
  );

  const handleSkillChange = useCallback(
    (catId: string, skillIdx: number, field: string, value: string) => {
      const cat = skillCategories.find(c => c.id === catId);
      if (!cat) return;
      const skills = [...cat.skills];
      skills[skillIdx] = { ...skills[skillIdx], [field]: value };
      handleCategoryChange(catId, 'skills', skills);
    },
    [skillCategories, handleCategoryChange]
  );

  const addSkill = useCallback((catId: string) => {
    const cat = skillCategories.find(c => c.id === catId);
    if (!cat) return;
    handleCategoryChange(catId, 'skills', [...cat.skills, { name: '', proficiency: 'intermediate' as const }]);
  }, [skillCategories, handleCategoryChange]);

  const removeSkill = useCallback((catId: string, skillIdx: number) => {
    const cat = skillCategories.find(c => c.id === catId);
    if (!cat) return;
    const skills = cat.skills.filter((_, i) => i !== skillIdx);
    handleCategoryChange(catId, 'skills', skills.length > 0 ? skills : [{ name: '', proficiency: 'intermediate' as const }]);
  }, [skillCategories, handleCategoryChange]);

  return (
    <div className="space-y-4">
      {skillCategories.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 gap-3 text-muted-foreground border-2 border-dashed rounded-lg">
          <FolderKanban className="w-8 h-8 text-muted-foreground/40" />
          <p className="text-sm">No skill categories added yet</p>
          <p className="text-xs text-muted-foreground/60">Organize skills by category (e.g., Technical, Analytical, Creative)</p>
        </div>
      )}

      {skillCategories.map((cat, catIdx) => (
        <div key={cat.id} className="border rounded-xl p-4 space-y-3 bg-muted/20 hover:bg-muted/30 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Category #{catIdx + 1}
            </span>
            <button
              onClick={() => removeSkillCategory(cat.id)}
              className="text-destructive hover:bg-destructive/10 p-1.5 rounded-md transition-colors"
              aria-label="Remove category"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`cat-name-${cat.id}`} className="text-xs font-semibold">Category Name</Label>
            <Input
              id={`cat-name-${cat.id}`}
              value={cat.category}
              onChange={e => handleCategoryChange(cat.id, 'category', e.target.value)}
              placeholder="e.g., Technical Skills, Analytical Skills, Creative Skills"
            />
          </div>

          <div className="space-y-2 pl-2 border-l-2 border-muted">
            <Label className="text-xs font-semibold text-muted-foreground">Skills</Label>
            {cat.skills.map((skill, sIdx) => (
              <div key={sIdx} className="flex gap-2 items-end">
                <div className="flex-1 space-y-1">
                  <Input
                    value={skill.name}
                    onChange={e => handleSkillChange(cat.id, sIdx, 'name', e.target.value)}
                    placeholder="e.g., Meta Ads Manager"
                    className="text-sm"
                  />
                </div>
                <div className="w-32 space-y-1 shrink-0">
                  <div className="flex items-center justify-end">
                    <ProficiencyBars level={skill.proficiency} />
                  </div>
                  <Select
                    value={skill.proficiency}
                    onValueChange={value => handleSkillChange(cat.id, sIdx, 'proficiency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROFICIENCY_LEVELS.map(level => (
                        <SelectItem key={level} value={level}>{proficiencyConfig[level].label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <button
                  onClick={() => removeSkill(cat.id, sIdx)}
                  className="text-muted-foreground hover:text-destructive p-1.5 rounded-md transition-colors mb-0.5"
                  aria-label="Remove skill"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <Button onClick={() => addSkill(cat.id)} variant="ghost" size="sm" className="gap-1 text-xs h-7">
              <Plus className="w-3 h-3" /> Add skill
            </Button>
          </div>
        </div>
      ))}

      <Button onClick={handleAddCategory} variant="outline" className="w-full gap-2 border-dashed">
        <Plus className="w-4 h-4" /> Add Skill Category
      </Button>

      {skillCategories.length > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          {skillCategories.reduce((s, c) => s + c.skills.length, 0)} skill{skillCategories.reduce((s, c) => s + c.skills.length, 0) !== 1 ? 's' : ''} in {skillCategories.length} categor{skillCategories.length !== 1 ? 'ies' : 'y'}
        </p>
      )}
    </div>
  );
}
