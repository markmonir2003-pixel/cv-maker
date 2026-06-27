'use client';

import { useResume } from '@/contexts/ResumeContext';
import { AlertTriangle, CheckCircle2, Info, TrendingUp } from 'lucide-react';

function Gauge({ label, score }: { label: string; score: number }) {
  const color = score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="font-medium text-muted-foreground">{label}</span>
        <span className="font-bold">{score}/100</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

export function AtsScorePanel() {
  const { atsScore } = useResume();

  if (!atsScore) return null;

  const { overall, toneAndStyle, content, structure, skills } = atsScore;

  const gradeColor = overall >= 80 ? 'text-green-600' : overall >= 60 ? 'text-yellow-600' : 'text-red-600';
  const gradeLabel = overall >= 80 ? 'Excellent' : overall >= 60 ? 'Good Start' : 'Needs Work';
  const gaugeScores = [
    { label: 'ATS Compatibility', score: atsScore.atsCompatibility },
    { label: 'Formatting', score: atsScore.formatting },
    { label: 'Keyword Optimization', score: atsScore.keywordOptimization },
    { label: 'Completeness', score: atsScore.completeness },
    { label: 'Readability', score: atsScore.readability },
    { label: 'Professional Writing', score: atsScore.professionalWriting },
    { label: 'Resume Length', score: atsScore.resumeLength },
    { label: 'Section Quality', score: atsScore.sectionQuality },
  ];

  return (
    <div className="bg-white rounded-xl border p-4 space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-bold">ATS Resume Score</h3>
      </div>

      <div className="flex items-end gap-3">
        <span className={`text-4xl font-black ${gradeColor}`}>{overall}</span>
        <div className="mb-1">
          <span className="text-xs font-semibold text-muted-foreground">/ 100</span>
          <p className={`text-xs font-bold ${gradeColor}`}>{gradeLabel}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Gauge label="Tone & Style" score={toneAndStyle} />
        <Gauge label="Content" score={content} />
        <Gauge label="Structure" score={structure} />
        <Gauge label="Skills" score={skills} />
      </div>

      <details className="group">
        <summary className="text-xs font-semibold text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
          Show all 8 dimensions
        </summary>
        <div className="mt-3 space-y-2">
          {gaugeScores.map(g => <Gauge key={g.label} label={g.label} score={g.score} />)}
        </div>
      </details>
    </div>
  );
}

export function AtsSuggestionsPanel() {
  const { atsSuggestions } = useResume();

  if (!atsSuggestions || atsSuggestions.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border p-4 space-y-3">
      <h3 className="text-sm font-bold flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-yellow-500" />
        Improvement Suggestions
        <span className="text-xs font-normal text-muted-foreground">({atsSuggestions.length})</span>
      </h3>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {atsSuggestions.map((s, i) => (
          <div key={i} className="flex gap-2 text-xs p-2 rounded-lg bg-muted/50">
            {s.severity === 'error' ? (
              <AlertTriangle className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
            ) : s.severity === 'warning' ? (
              <AlertTriangle className="w-3.5 h-3.5 text-yellow-500 mt-0.5 shrink-0" />
            ) : (
              <Info className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
            )}
            <div>
              <span className="font-semibold text-muted-foreground">{s.section}: </span>
              {s.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AtsSummaryBadge() {
  const { atsScore } = useResume();

  if (!atsScore) return null;

  const color = atsScore.overall >= 80 ? 'text-green-600' : atsScore.overall >= 60 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className={`flex items-center gap-1.5 text-xs font-bold ${color}`}>
      {atsScore.overall >= 80 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
      ATS Score: {atsScore.overall}/100
    </div>
  );
}
