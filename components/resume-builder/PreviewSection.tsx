'use client';

import { useResume } from '@/contexts/ResumeContext';
import { ResumePreview } from './pdf/ResumePreview';

export function PreviewSection() {
  const { data } = useResume();

  const isEmpty =
    !data.personalInfo.fullName &&
    data.experiences.length === 0 &&
    data.educations.length === 0 &&
    data.skills.length === 0;

  return (
    <div className="bg-muted/50 flex flex-col h-full">
      {/* Section header */}
      <div className="px-5 py-3 border-b bg-background/80 flex items-center justify-between">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Live Preview
        </h3>
        <span className="text-xs text-muted-foreground/60">A4 Format</span>
      </div>

      {/* Preview area */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3 text-muted-foreground py-12">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
              <svg className="w-8 h-8 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium">Your resume will appear here</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Fill in the form on the left to get started</p>
            </div>
          </div>
        ) : (
          <div
            className="w-full h-fit flex justify-center"
            data-resume-preview
          >
            <ResumePreview data={data} />
          </div>
        )}
      </div>
    </div>
  );
}
