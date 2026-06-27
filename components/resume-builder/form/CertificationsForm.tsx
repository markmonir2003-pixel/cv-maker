'use client';

import { useCallback } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Award } from 'lucide-react';

export function CertificationsForm() {
  const { data, addCertification, updateCertification, removeCertification } = useResume();
  const { certifications } = data;

  const handleAdd = useCallback(() => {
    addCertification({ name: '', issuer: '', date: '' });
  }, [addCertification]);

  const handleChange = useCallback(
    (id: string, field: string, value: string) => {
      const cert = certifications.find(c => c.id === id);
      if (!cert) return;
      updateCertification(id, { ...cert, [field]: value });
    },
    [certifications, updateCertification]
  );

  return (
    <div className="space-y-4">
      {certifications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 gap-3 text-muted-foreground border-2 border-dashed rounded-lg">
          <Award className="w-8 h-8 text-muted-foreground/40" />
          <p className="text-sm">No certifications added yet</p>
          <p className="text-xs text-muted-foreground/60">Add relevant certifications to strengthen your profile</p>
        </div>
      )}

      {certifications.map((cert, idx) => (
        <div key={cert.id} className="border rounded-xl p-4 space-y-3 bg-muted/20 hover:bg-muted/30 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Certification #{idx + 1}</span>
            <button onClick={() => removeCertification(cert.id)}
              className="text-destructive hover:bg-destructive/10 p-1.5 rounded-md transition-colors" aria-label="Remove certification">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor={`cert-name-${cert.id}`} className="text-xs font-semibold">Certification Name</Label>
              <Input id={`cert-name-${cert.id}`} value={cert.name}
                onChange={e => handleChange(cert.id, 'name', e.target.value)}
                placeholder="e.g., Google Ads Certification" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`cert-issuer-${cert.id}`} className="text-xs font-semibold">Issuing Organization</Label>
              <Input id={`cert-issuer-${cert.id}`} value={cert.issuer}
                onChange={e => handleChange(cert.id, 'issuer', e.target.value)} placeholder="e.g., Google" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`cert-date-${cert.id}`} className="text-xs font-semibold">Date Earned</Label>
            <Input id={`cert-date-${cert.id}`} type="month" value={cert.date}
              onChange={e => handleChange(cert.id, 'date', e.target.value)} />
          </div>
        </div>
      ))}

      <Button onClick={handleAdd} variant="outline" className="w-full gap-2 border-dashed">
        <Plus className="w-4 h-4" /> Add Certification
      </Button>
    </div>
  );
}
