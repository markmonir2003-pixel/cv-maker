'use client';

import { useCallback } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus, FolderGit2, X } from 'lucide-react';

export function ProjectsForm() {
  const { data, addProject, updateProject, removeProject } = useResume();
  const { projects } = data;

  const handleAdd = useCallback(() => {
    addProject({ name: '', role: '', startDate: '', endDate: '', currentlyWorking: false, bullets: [''] });
  }, [addProject]);

  const handleChange = useCallback(
    (id: string, field: string, value: any) => {
      const project = projects.find(p => p.id === id);
      if (!project) return;
      updateProject(id, { ...project, [field]: value });
    },
    [projects, updateProject]
  );

  const handleBulletChange = useCallback(
    (projId: string, idx: number, value: string) => {
      const project = projects.find(p => p.id === projId);
      if (!project) return;
      const bullets = [...project.bullets];
      bullets[idx] = value;
      handleChange(projId, 'bullets', bullets);
    },
    [projects, handleChange]
  );

  const addBullet = useCallback((projId: string) => {
    const project = projects.find(p => p.id === projId);
    if (!project) return;
    handleChange(projId, 'bullets', [...project.bullets, '']);
  }, [projects, handleChange]);

  const removeBullet = useCallback((projId: string, idx: number) => {
    const project = projects.find(p => p.id === projId);
    if (!project) return;
    const bullets = project.bullets.filter((_, i) => i !== idx);
    handleChange(projId, 'bullets', bullets.length > 0 ? bullets : ['']);
  }, [projects, handleChange]);

  return (
    <div className="space-y-4">
      {projects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 gap-3 text-muted-foreground border-2 border-dashed rounded-lg">
          <FolderGit2 className="w-8 h-8 text-muted-foreground/40" />
          <p className="text-sm">No projects added yet</p>
        </div>
      )}

      {projects.map((project, idx) => (
        <div key={project.id} className="border rounded-xl p-4 space-y-3 bg-muted/20 hover:bg-muted/30 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Project #{idx + 1}</span>
            <button onClick={() => removeProject(project.id)}
              className="text-destructive hover:bg-destructive/10 p-1.5 rounded-md transition-colors" aria-label="Remove project">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor={`proj-name-${project.id}`} className="text-xs font-semibold">Project Name</Label>
              <Input id={`proj-name-${project.id}`} value={project.name}
                onChange={e => handleChange(project.id, 'name', e.target.value)} placeholder="e.g., E-commerce Dashboard" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`proj-role-${project.id}`} className="text-xs font-semibold">Your Role</Label>
              <Input id={`proj-role-${project.id}`} value={project.role}
                onChange={e => handleChange(project.id, 'role', e.target.value)} placeholder="Lead Developer" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor={`proj-start-${project.id}`} className="text-xs font-semibold">Start Date</Label>
              <Input id={`proj-start-${project.id}`} type="month" value={project.startDate}
                onChange={e => handleChange(project.id, 'startDate', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`proj-end-${project.id}`}
                className={`text-xs font-semibold ${project.currentlyWorking ? 'text-muted-foreground/50' : ''}`}>End Date</Label>
              <Input id={`proj-end-${project.id}`} type="month" value={project.endDate}
                onChange={e => handleChange(project.id, 'endDate', e.target.value)} disabled={project.currentlyWorking} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id={`proj-current-${project.id}`} checked={project.currentlyWorking}
              onCheckedChange={checked => handleChange(project.id, 'currentlyWorking', Boolean(checked))} />
            <Label htmlFor={`proj-current-${project.id}`} className="text-xs font-normal cursor-pointer">Ongoing project</Label>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">Key Contributions</Label>
            {project.bullets.map((bullet, bIdx) => (
              <div key={bIdx} className="flex gap-2 items-start">
                <span className="text-muted-foreground mt-2.5 text-xs">-</span>
                <div className="flex-1">
                  <Input value={bullet}
                    onChange={e => handleBulletChange(project.id, bIdx, e.target.value)}
                                                      placeholder='e.g., "Designed and implemented a real-time dashboard that reduced reporting time by 40%"' className="text-sm" />
                </div>
                <button onClick={() => removeBullet(project.id, bIdx)}
                  className="text-muted-foreground hover:text-destructive p-1.5 rounded-md transition-colors mt-0.5"
                  aria-label="Remove bullet">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <Button onClick={() => addBullet(project.id)} variant="ghost" size="sm" className="gap-1 text-xs h-7">
              <Plus className="w-3 h-3" /> Add bullet point
            </Button>
            <p className="text-[10px] text-muted-foreground/60 italic">
              Start with a strong action verb and include measurable results (%, $) when possible
            </p>
          </div>
        </div>
      ))}

      <Button onClick={handleAdd} variant="outline" className="w-full gap-2 border-dashed">
        <Plus className="w-4 h-4" /> Add Project
      </Button>
    </div>
  );
}
