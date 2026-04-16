'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResume } from '@/contexts/ResumeContext';
import { useDownloadResume } from './DownloadButton';
import { FormSection } from './FormSection';
import { PreviewSection } from './PreviewSection';
import { Button } from '@/components/ui/button';
import { FileText, Trash2, Eye, EyeOff } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export function ResumeBuilder() {
  const downloadResume = useDownloadResume();
  const { clearAll } = useResume();
  const [showPreview, setShowPreview] = useState(true);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Header Bar */}
      <header className="flex items-center justify-between px-3 md:px-6 py-2 md:py-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-20">
        <div className="flex items-center gap-2 md:gap-2.5">
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <FileText className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xs md:text-sm font-bold leading-tight truncate">AI Resume Builder</h1>
            <p className="text-[10px] text-muted-foreground leading-tight hidden md:block">
              Build & download your resume
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile: Toggle preview */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(p => !p)}
            className="md:hidden gap-1.5"
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showPreview ? 'Make your CV' : 'Preview'}
          </Button>

          {/* Clear all data */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1.5 text-destructive hover:text-destructive">
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Clear</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear all data?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your resume data. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={clearAll}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  Clear All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Form Panel */}
        <AnimatePresence>
          {(!showPreview || true) && (
            <motion.div
              className={`border-r overflow-hidden flex-shrink-0 ${showPreview ? 'hidden md:flex md:w-1/2' : 'flex w-full'
                } flex-col`}
              initial={false}
            >
              <FormSection onDownload={downloadResume} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preview Panel */}
        <AnimatePresence>
          {(showPreview || true) && (
            <motion.div
              className={`overflow-hidden flex-1 ${showPreview ? 'flex' : 'hidden md:flex'
                } flex-col`}
              initial={false}
            >
              <PreviewSection />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
