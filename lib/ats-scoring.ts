import { ResumeData, AtsScore, AtsSuggestion } from '@/types/resume';

function countWords(s: string): number {
  return (s || '').trim().split(/\s+/).filter(Boolean).length;
}

const STANDARD_SECTIONS = [
  'professional summary', 'summary', 'skills', 'experience',
  'projects', 'education', 'certifications', 'languages',
  'contact', 'work experience', 'technical skills',
];

export function computeAtsScore(data: ResumeData): AtsScore {
  const { personalInfo, experiences, educations, skillCategories, projects, certifications, languages } = data;

  // 1. ATS Compatibility - standard sections, clean formatting
  let atsCompatibility = 60;
  if (personalInfo.fullName) atsCompatibility += 5;
  if (experiences.length > 0) atsCompatibility += 5;
  if (educations.length > 0) atsCompatibility += 5;
  if (skillCategories.length > 0) atsCompatibility += 5;
  if (personalInfo.professionalSummary) atsCompatibility += 5;
  if (certifications.length > 0) atsCompatibility += 5;
  if (projects.length > 0) atsCompatibility += 5;
  if (languages.length > 0) atsCompatibility += 5;

  // 2. Formatting - consistent structure
  let formatting = 50;
  if (experiences.every(e => e.position && e.company)) formatting += 10;
  if (experiences.every(e => e.bullets.length > 0)) formatting += 10;
  if (educations.every(e => e.school && e.degree)) formatting += 10;
  if (skillCategories.some(c => c.skills.length > 0)) formatting += 10;
  if (experiences.every(e => e.startDate)) formatting += 10;

  // 3. Keyword Optimization
  let keywordOptimization = 40;
  const allText = [
    personalInfo.professionalSummary,
    ...experiences.flatMap(e => e.bullets),
    ...projects.flatMap(p => p.bullets),
    ...skillCategories.flatMap(c => c.skills.map(s => s.name)),
  ].join(' ').toLowerCase();

  const keywords = [
    'campaign', 'performance', 'metrics', 'budget', 'managed', 'developed',
    'increased', 'decreased', 'improved', 'led', 'created', 'implemented',
    'analyzed', 'optimized', 'achieved', 'reduced', 'launched', 'designed',
    'results', 'strategy', 'leadership', 'communication', 'team',
  ];
  const found = keywords.filter(k => allText.includes(k)).length;
  keywordOptimization += Math.min(found * 3, 40);
  if (experiences.some(e => e.bullets.some(b => /\d+%/.test(b) || /\$\d+/.test(b)))) keywordOptimization += 10;
  if (skillCategories.length > 0) keywordOptimization += 10;

  // 4. Completeness
  let completeness = 40;
  if (personalInfo.fullName) completeness += 5;
  if (personalInfo.email) completeness += 5;
  if (personalInfo.phone) completeness += 5;
  if (personalInfo.linkedin) completeness += 3;
  if (personalInfo.professionalSummary) completeness += 5;
  if (experiences.length >= 1) completeness += 5;
  if (experiences.length >= 2) completeness += 3;
  if (educations.length >= 1) completeness += 5;
  if (skillCategories.length >= 2) completeness += 5;
  if (projects.length > 0) completeness += 5;
  if (certifications.length > 0) completeness += 5;
  if (languages.length > 0) completeness += 4;

  // 5. Readability
  let readability = 60;
  const totalBullets = experiences.reduce((s, e) => s + e.bullets.length, 0) +
    projects.reduce((s, p) => s + p.bullets.length, 0);
  if (totalBullets >= 5) readability += 10;
  if (totalBullets >= 10) readability += 10;
  if (experiences.every(e => e.bullets.every(b => countWords(b) >= 8 && countWords(b) <= 30))) readability += 10;
  if (personalInfo.professionalSummary && countWords(personalInfo.professionalSummary) >= 30) readability += 10;

  // 6. Professional Writing
  let professionalWriting = 40;
  const strongVerbs = ['achieved', 'managed', 'developed', 'created', 'implemented', 'led', 'improved',
    'increased', 'reduced', 'designed', 'launched', 'established', 'negotiated', 'generated',
    'directed', 'coordinated', 'delivered', 'executed', 'produced', 'transformed', 'spearheaded',
    'accelerated', 'drove', 'optimized', 'engineered', 'architected', 'orchestrated'];
  const weakVerbs = ['was', 'was responsible for', 'was in charge of', 'worked on', 'helped', 'did', 'made', 'got', 'had to'];
  const allBullets = [...experiences.flatMap(e => e.bullets), ...projects.flatMap(p => p.bullets)];
  const actionCount = allBullets.filter(b => strongVerbs.some(v => b.toLowerCase().startsWith(v))).length;
  const weakCount = allBullets.filter(b => weakVerbs.some(v => b.toLowerCase().startsWith(v))).length;
  professionalWriting += Math.min(actionCount * 5, 30);
  professionalWriting -= Math.min(weakCount * 5, 15);
  if (allBullets.every(b => /^[A-Z]/.test(b.trim()))) professionalWriting += 5;
  if (allBullets.every(b => b.trim().endsWith('.'))) professionalWriting += 5;
  if (personalInfo.professionalSummary) professionalWriting += 10;
  if (personalInfo.professionalSummary && /^(Results-driven|Experienced|Strategic|Innovative|Dynamic)/i.test(personalInfo.professionalSummary.trim())) professionalWriting += 5;

  // 7. Resume Length
  let resumeLength = 80;
  const totalSections = [experiences, educations, skillCategories, projects, certifications, languages]
    .filter(arr => arr.length > 0).length;
  if (totalSections >= 3) resumeLength += 10;
  if (totalSections >= 5) resumeLength += 10;

  // 8. Section Quality
  let sectionQuality = 50;
  if (experiences.length > 0 && experiences.every(e => e.bullets.length >= 3)) sectionQuality += 10;
  if (experiences.some(e => e.bullets.some(b => /\d+/.test(b)))) sectionQuality += 10;
  if (skillCategories.length > 0) sectionQuality += 10;
  if (projects.length > 0) sectionQuality += 10;
  if (certifications.length > 0) sectionQuality += 10;

  const clamp = (n: number) => Math.min(100, Math.max(0, n));

  atsCompatibility = clamp(atsCompatibility);
  formatting = clamp(formatting);
  keywordOptimization = clamp(keywordOptimization);
  completeness = clamp(completeness);
  readability = clamp(readability);
  professionalWriting = clamp(professionalWriting);
  resumeLength = clamp(resumeLength);
  sectionQuality = clamp(sectionQuality);

  const toneAndStyle = Math.round((readability + professionalWriting) / 2);
  const content = Math.round((keywordOptimization + completeness + sectionQuality) / 3);
  const structure = Math.round((atsCompatibility + formatting + resumeLength) / 3);
  const skills = Math.round((keywordOptimization + sectionQuality) / 2);

  const overall = Math.round(
    (atsCompatibility + formatting + keywordOptimization + completeness +
      readability + professionalWriting + resumeLength + sectionQuality) / 8
  );

  return {
    overall, toneAndStyle, content, structure, skills,
    atsCompatibility, formatting, keywordOptimization, completeness,
    readability, professionalWriting, resumeLength, sectionQuality,
  };
}

export function computeAtsSuggestions(data: ResumeData): AtsSuggestion[] {
  const suggestions: AtsSuggestion[] = [];
  const { personalInfo, experiences, educations, skillCategories, projects } = data;

  if (!personalInfo.professionalSummary?.trim()) {
    suggestions.push({ severity: 'warning', section: 'Professional Summary', message: 'Add a professional summary to give recruiters a quick overview of your qualifications.' });
  }

  if (experiences.length === 0) {
    suggestions.push({ severity: 'warning', section: 'Experience', message: 'Add at least one work experience entry.' });
  }

  for (const exp of experiences) {
    if (exp.bullets.length === 0) {
      suggestions.push({ severity: 'error', section: `Experience: ${exp.position || 'Untitled'}`, message: 'Add bullet points describing your responsibilities and achievements.' });
    }
    for (const bullet of exp.bullets) {
      const weakVerbs = ['was', 'was responsible for', 'was in charge of', 'worked on', 'helped', 'did', 'made', 'got', 'had to'];
      for (const wv of weakVerbs) {
        if (bullet.toLowerCase().startsWith(wv)) {
          suggestions.push({ severity: 'warning', section: `Experience: ${exp.position || 'Untitled'}`, message: `Replace weak verb "${wv}" with a strong action verb (e.g., managed, developed, led).` });
          break;
        }
      }
      if (/\d+%/.test(bullet) || /\$\d+/.test(bullet)) {
        // Good - has metrics
      } else {
        suggestions.push({ severity: 'info', section: `Experience: ${exp.position || 'Untitled'}`, message: 'Consider adding quantifiable results (e.g., "increased sales by 20%").' });
      }
    }
  }

  if (projects.length > 0) {
    for (const proj of projects) {
      if (proj.bullets.length === 0) {
        suggestions.push({ severity: 'warning', section: `Project: ${proj.name || 'Untitled'}`, message: 'Add bullet points describing your project contributions and outcomes.' });
      }
    }
  }

  if (skillCategories.length === 0) {
    suggestions.push({ severity: 'warning', section: 'Skills', message: 'Add your skills organized by category (e.g., Technical, Analytical, Creative).' });
  }

  if (educations.length === 0) {
    suggestions.push({ severity: 'info', section: 'Education', message: 'Adding your educational background strengthens your resume.' });
  }

  const weakPatterns = [
    { pattern: /Excellent|Strong|Good\s+(?:communication|team|leadership)/i, msg: 'Replace generic traits like "Excellent communication skills" with specific evidence.' },
    { pattern: /references\s+(?:available\s+)?upon\s+request/i, msg: 'Remove "References available upon request" — it is assumed and wastes space.' },
    { pattern: /objective/i, msg: 'Replace "Objective" with a "Professional Summary" that highlights your value proposition.' },
  ];

  const allText = [personalInfo.professionalSummary, ...experiences.flatMap(e => e.bullets), ...projects.flatMap(p => p.bullets)].join(' ');
  for (const wp of weakPatterns) {
    if (wp.pattern.test(allText)) {
      suggestions.push({ severity: 'info', section: 'Content', message: wp.msg });
    }
  }

  return suggestions;
}
