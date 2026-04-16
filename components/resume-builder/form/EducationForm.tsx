'use client';

import { useCallback } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, GraduationCap } from 'lucide-react';
import { Education } from '@/types/resume';

export function EducationForm() {
  const { data, addEducation, updateEducation, removeEducation } = useResume();
  const { educations } = data;

  const handleAddEducation = useCallback(() => {
    addEducation({
      school: '',
      degree: '',
      field: '',
      graduationDate: '',
    });
  }, [addEducation]);

  const handleChange = useCallback(
    (id: string, field: keyof Omit<Education, 'id'>, value: string) => {
      const education = educations.find(e => e.id === id);
      if (!education) return;
      updateEducation(id, { ...education, [field]: value });
    },
    [educations, updateEducation]
  );

  return (
    <div className="space-y-4">
      {educations.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 gap-3 text-muted-foreground border-2 border-dashed rounded-lg">
          <GraduationCap className="w-8 h-8 text-muted-foreground/40" />
          <p className="text-sm">No education added yet</p>
        </div>
      )}

      {educations.map((education, idx) => (
        <div
          key={education.id}
          className="border rounded-xl p-4 space-y-3 bg-muted/20 hover:bg-muted/30 transition-colors"
        >
          {/* Card Header */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Education #{idx + 1}
            </span>
            <button
              onClick={() => removeEducation(education.id)}
              className="text-destructive hover:bg-destructive/10 p-1.5 rounded-md transition-colors"
              aria-label="Remove education"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* School */}
          <div className="space-y-1.5">
            <Label htmlFor={`school-${education.id}`} className="text-xs font-semibold">
              School / University
            </Label>
            <Input
              id={`school-${education.id}`}
              value={education.school}
              onChange={e => handleChange(education.id, 'school', e.target.value)}
              placeholder="University of Example"
            />
          </div>

          {/* Degree + Field */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor={`degree-${education.id}`} className="text-xs font-semibold">
                Degree
              </Label>
              <Input
                id={`degree-${education.id}`}
                value={education.degree}
                onChange={e => handleChange(education.id, 'degree', e.target.value)}
                placeholder="Bachelor of Science"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`field-${education.id}`} className="text-xs font-semibold">
                Field of Study
              </Label>
              <Input
                id={`field-${education.id}`}
                value={education.field}
                onChange={e => handleChange(education.id, 'field', e.target.value)}
                placeholder="Computer Science"
              />
            </div>
          </div>

          {/* Graduation Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor={`graduationDate-${education.id}`} className="text-xs font-semibold">
                Graduation Date
              </Label>
              <Input
                id={`graduationDate-${education.id}`}
                type="month"
                value={education.graduationDate}
                onChange={e => handleChange(education.id, 'graduationDate', e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}

      <Button
        onClick={handleAddEducation}
        variant="outline"
        className="w-full gap-2 border-dashed"
      >
        <Plus className="w-4 h-4" />
        Add Education
      </Button>
    </div>
  );
}
