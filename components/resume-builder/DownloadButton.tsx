'use client';

import React, { useCallback } from 'react';
import { useResume } from '@/contexts/ResumeContext';
import { toast } from 'sonner';

export function useDownloadResume() {
  const { data } = useResume();

  const downloadResume = useCallback(async () => {
    if (!data?.personalInfo) {
      toast.error('Resume data is missing. Please fill in your information first.');
      return;
    }

    const toastId = toast.loading('Generating your PDF…');

    try {
      const [{ pdf }, { ResumePdfDocument }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('./pdf/ResumePdfDocument'),
      ]);

      const element = React.createElement(ResumePdfDocument, { data }) as any;
      const blob = await pdf(element).toBlob();

      if (!blob || blob.size === 0) {
        throw new Error('Generated PDF blob is empty.');
      }

      const name = data.personalInfo.fullName
        ? data.personalInfo.fullName.toLowerCase().replace(/\s+/g, '-')
        : 'resume';
      const date = new Date().toISOString().split('T')[0];
      const fileName = `${name}-${date}.pdf`;

      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = fileName;
      anchor.style.display = 'none';
      document.body.appendChild(anchor);
      anchor.click();

      setTimeout(() => {
        document.body.removeChild(anchor);
        window.URL.revokeObjectURL(url);
      }, 200);

      toast.success(`Downloaded: ${fileName}`, { id: toastId });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF. Please try again.', { id: toastId });
    }
  }, [data]);

  const downloadJson = useCallback(() => {
    if (!data?.personalInfo) {
      toast.error('No resume data to export.');
      return;
    }

    try {
      const name = data.personalInfo.fullName
        ? data.personalInfo.fullName.toLowerCase().replace(/\s+/g, '-')
        : 'resume';
      const date = new Date().toISOString().split('T')[0];
      const fileName = `${name}-${date}.json`;

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = fileName;
      anchor.style.display = 'none';
      document.body.appendChild(anchor);
      anchor.click();

      setTimeout(() => {
        document.body.removeChild(anchor);
        window.URL.revokeObjectURL(url);
      }, 200);

      toast.success(`Exported: ${fileName}`);
    } catch (error) {
      console.error('JSON export error:', error);
      toast.error('Failed to export JSON.');
    }
  }, [data]);

  return { downloadResume, downloadJson };
}
