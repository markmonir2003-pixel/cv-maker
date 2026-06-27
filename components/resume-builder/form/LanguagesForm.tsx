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
import { Trash2, Plus, LanguagesIcon } from 'lucide-react';

const PROFICIENCY_OPTIONS = [
  'Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic',
];

export function LanguagesForm() {
  const { data, addLanguage, updateLanguage, removeLanguage } = useResume();
  const { languages } = data;

  const handleAdd = useCallback(() => {
    addLanguage({ language: '', proficiency: 'Intermediate' });
  }, [addLanguage]);

  const handleChange = useCallback(
    (id: string, field: string, value: string) => {
      const lang = languages.find(l => l.id === id);
      if (!lang) return;
      updateLanguage(id, { ...lang, [field]: value });
    },
    [languages, updateLanguage]
  );

  return (
    <div className="space-y-4">
      {languages.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 gap-3 text-muted-foreground border-2 border-dashed rounded-lg">
          <LanguagesIcon className="w-8 h-8 text-muted-foreground/40" />
          <p className="text-sm">No languages added yet</p>
        </div>
      )}

      {languages.map((lang, idx) => (
        <div key={lang.id} className="border rounded-xl p-4 space-y-3 bg-muted/20 hover:bg-muted/30 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Language #{idx + 1}</span>
            <button onClick={() => removeLanguage(lang.id)}
              className="text-destructive hover:bg-destructive/10 p-1.5 rounded-md transition-colors" aria-label="Remove language">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor={`lang-name-${lang.id}`} className="text-xs font-semibold">Language</Label>
              <Input id={`lang-name-${lang.id}`} value={lang.language}
                onChange={e => handleChange(lang.id, 'language', e.target.value)}
                placeholder="e.g., English, Arabic" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`lang-prof-${lang.id}`} className="text-xs font-semibold">Proficiency</Label>
              <Select value={lang.proficiency}
                onValueChange={value => handleChange(lang.id, 'proficiency', value)}>
                <SelectTrigger id={`lang-prof-${lang.id}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROFICIENCY_OPTIONS.map(opt => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      ))}

      <Button onClick={handleAdd} variant="outline" className="w-full gap-2 border-dashed">
        <Plus className="w-4 h-4" /> Add Language
      </Button>
    </div>
  );
}
