'use client';

import React from 'react';
import { ResumeData } from '@/types/resume';

function formatDate(s: string): string {
  if (!s) return '';
  try {
    const [y, m] = s.split('-');
    return new Date(+y, +m - 1).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  } catch {
    return s;
  }
}

function formatRange(start: string, end: string, current: boolean): string {
  if (!start) return '';
  const s = formatDate(start);
  if (current) return `${s} – Present`;
  return end ? `${s} – ${formatDate(end)}` : s;
}

function isArabic(text: string): boolean {
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicPattern.test(text || '');
}

function rtlStyle(text: string): React.CSSProperties {
  return isArabic(text) ? { textAlign: 'right' } : {};
}

function BulletItem({ text }: { text: string }) {
  return (
    <div style={{ paddingBottom: '1px' }}>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <span style={{ fontSize: '9px', color: '#475569', width: '10px', flexShrink: 0 }}>-</span>
        <span style={{ fontSize: '8.5px', color: '#475569', flex: 1, ...rtlStyle(text) }}>{text}</span>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ paddingBottom: '10px' }}>
      <div style={{
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '2px',
        paddingTop: '8px',
      }}>
        <h2 style={{
          fontSize: '9px', fontWeight: 800, color: '#1e293b',
          textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0,
        }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

interface Props { data: ResumeData; }

export function ResumePreview({ data }: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current) return;
      const parent = containerRef.current.parentElement;
      if (!parent) return;
      const parentWidth = parent.clientWidth;
      const a4Width = 794;
      const padding = parentWidth < 768 ? 16 : 40;
      const availableWidth = parentWidth - padding;
      setScale(availableWidth < a4Width ? availableWidth / a4Width : 1);
    };
    const timeoutId = setTimeout(calculateScale, 100);
    window.addEventListener('resize', calculateScale);
    return () => { window.removeEventListener('resize', calculateScale); clearTimeout(timeoutId); };
  }, []);

  if (!data?.personalInfo) return null;

  const { personalInfo, experiences, educations, skillCategories, projects, certifications, languages } = data;

  const contactParts: string[] = [];
  if (personalInfo.email) contactParts.push(personalInfo.email);
  if (personalInfo.phone) contactParts.push(personalInfo.phone);
  if (personalInfo.location) contactParts.push(personalInfo.location);
  if (personalInfo.linkedin) contactParts.push(personalInfo.linkedin);

  const A4_WIDTH = 794;

  return (
    <div ref={containerRef} style={{
      width: '100%', margin: '0 auto', padding: scale < 1 ? '5px' : '20px',
      boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center',
    }}>
      <div style={{
        width: `${A4_WIDTH * scale}px`,
        height: `${1293 * scale}px`,
        position: 'relative',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
        backgroundColor: '#ffffff',
      }}>
        <div style={{
          width: `${A4_WIDTH}px`, height: '1293px', position: 'absolute', top: 0, left: 0,
          backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', overflow: 'hidden',
          boxSizing: 'border-box', transform: `scale(${scale})`, transformOrigin: 'top left',
          padding: '24px 36px', fontSize: '9px', color: '#1e293b',
        }}>

          {/* ═══ HEADER ═══ */}
          <div style={{ flexDirection: 'column', paddingBottom: '10px', borderBottom: '2px solid #e2e8f0' }}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              {personalInfo.photo && (
                <div style={{ width: '56px', flexShrink: 0 }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '24px', overflow: 'hidden',
                    backgroundColor: '#e2e8f0',
                  }}>
                    <img src={personalInfo.photo} alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </div>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ paddingBottom: '2px' }}>
                  <h1 style={{ fontSize: '20px', fontWeight: 900, color: '#1e293b', margin: 0, ...rtlStyle(personalInfo.fullName) }}>
                    {personalInfo.fullName || 'Your Name'}
                  </h1>
                </div>
                {personalInfo.title && (
                  <div style={{ paddingBottom: '2px' }}>
                    <p style={{ fontSize: '11px', fontWeight: 700, color: '#2563eb', margin: 0, ...rtlStyle(personalInfo.title) }}>
                      {personalInfo.title}
                    </p>
                  </div>
                )}
                {contactParts.map((part, i) => (
                  <div key={i} style={{ paddingBottom: '2px' }}>
                    <p style={{ fontSize: '8px', color: '#475569', margin: 0, ...rtlStyle(part) }}>{part}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ═══ PROFESSIONAL SUMMARY ═══ */}
          {personalInfo.professionalSummary && (
            <Section title="Professional Summary">
              <div style={{ paddingBottom: '1px' }} />
              <p style={{ fontSize: '8.5px', color: '#475569', margin: 0, ...rtlStyle(personalInfo.professionalSummary) }}>
                {personalInfo.professionalSummary}
              </p>
            </Section>
          )}

          {/* ═══ SKILLS ═══ */}
          {skillCategories.length > 0 && (
            <Section title="Skills">
              {skillCategories.map(cat => (
                <div key={cat.id} style={{ display: 'flex', flexDirection: 'row', paddingBottom: '1px' }}>
                  {cat.category && (
                    <span style={{ fontSize: '8px', fontWeight: 700, color: '#1e293b', width: '80px', flexShrink: 0, ...rtlStyle(cat.category) }}>
                      {cat.category}
                    </span>
                  )}
                  <span style={{ fontSize: '8px', color: '#475569', ...rtlStyle(cat.skills.map(s => s.name).join(', ')) }}>
                    {cat.skills.map(s => s.name).join(', ')}
                  </span>
                </div>
              ))}
            </Section>
          )}

          {/* ═══ EXPERIENCE ═══ */}
          {experiences.length > 0 && (
            <Section title="Experience">
              {experiences.map(exp => (
                <div key={exp.id} style={{ paddingBottom: '5px' }}>
                  <div style={{ paddingBottom: '1px' }} />
                  <div style={{ paddingBottom: '1px' }}>
                    <p style={{ fontSize: '9px', fontWeight: 800, color: '#1e293b', margin: 0, ...rtlStyle(exp.position) }}>
                      {exp.position || 'Position'}
                    </p>
                  </div>
                  {exp.company && (
                    <div style={{ paddingBottom: '1px' }}>
                      <p style={{ fontSize: '8.5px', fontWeight: 600, color: '#2563eb', margin: 0, ...rtlStyle(exp.company) }}>
                        {exp.company}
                      </p>
                    </div>
                  )}
                  <div style={{ paddingBottom: '1px' }}>
                    <p style={{ fontSize: '7.5px', color: '#94a3b8', margin: 0 }}>
                      {formatRange(exp.startDate, exp.endDate, exp.currentlyWorking)}
                    </p>
                  </div>
                  {exp.bullets.filter(b => b.trim()).length > 0 && (
                    <div>
                      {exp.bullets.filter(b => b.trim()).map((b, i) => (
                        <BulletItem key={i} text={b} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </Section>
          )}

          {/* ═══ PROJECTS ═══ */}
          {projects.length > 0 && (
            <Section title="Projects">
              {projects.map(proj => (
                <div key={proj.id} style={{ paddingBottom: '5px' }}>
                  <div style={{ paddingBottom: '1px' }} />
                  <div style={{ paddingBottom: '1px' }}>
                    <p style={{ fontSize: '9px', fontWeight: 800, color: '#1e293b', margin: 0, ...rtlStyle(proj.name) }}>
                      {proj.name || 'Project'}
                    </p>
                  </div>
                  {proj.role && (
                    <div style={{ paddingBottom: '1px' }}>
                      <p style={{ fontSize: '8.5px', fontWeight: 600, color: '#2563eb', margin: 0, ...rtlStyle(proj.role) }}>
                        {proj.role}
                      </p>
                    </div>
                  )}
                  <div style={{ paddingBottom: '1px' }}>
                    <p style={{ fontSize: '7.5px', color: '#94a3b8', margin: 0 }}>
                      {formatRange(proj.startDate, proj.endDate, proj.currentlyWorking)}
                    </p>
                  </div>
                  {proj.bullets.filter(b => b.trim()).length > 0 && (
                    <div>
                      {proj.bullets.filter(b => b.trim()).map((b, i) => (
                        <BulletItem key={i} text={b} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </Section>
          )}

          {/* ═══ EDUCATION ═══ */}
          {educations.length > 0 && (
            <Section title="Education">
              {educations.map(edu => (
                <div key={edu.id} style={{ paddingBottom: '5px' }}>
                  <div style={{ paddingBottom: '1px' }} />
                  <div style={{ paddingBottom: '1px' }}>
                    <p style={{ fontSize: '9px', fontWeight: 800, color: '#1e293b', margin: 0, ...rtlStyle(edu.degree) }}>
                      {[edu.degree, edu.field].filter(Boolean).join(' in ') || 'Degree'}
                    </p>
                  </div>
                  {edu.school && (
                    <div style={{ paddingBottom: '1px' }}>
                      <p style={{ fontSize: '8.5px', fontWeight: 600, color: '#2563eb', margin: 0, ...rtlStyle(edu.school) }}>
                        {edu.school}
                      </p>
                    </div>
                  )}
                  <div style={{ paddingBottom: '1px' }}>
                    <p style={{ fontSize: '7.5px', color: '#94a3b8', margin: 0 }}>{formatDate(edu.graduationDate)}</p>
                  </div>
                </div>
              ))}
            </Section>
          )}

          {/* ═══ CERTIFICATIONS ═══ */}
          {certifications.length > 0 && (
            <Section title="Certifications">
              {certifications.map(cert => (
                <div key={cert.id} style={{ paddingBottom: '4px' }}>
                  <div style={{ paddingBottom: '1px' }} />
                  <div style={{ paddingBottom: '1px' }}>
                    <p style={{ fontSize: '8.5px', fontWeight: 700, color: '#1e293b', margin: 0, ...rtlStyle(cert.name) }}>{cert.name}</p>
                  </div>
                  <p style={{ fontSize: '8px', color: '#475569', margin: 0 }}>
                    {[cert.issuer, cert.date ? formatDate(cert.date) : ''].filter(Boolean).join(' - ')}
                  </p>
                </div>
              ))}
            </Section>
          )}

          {/* ═══ LANGUAGES ═══ */}
          {languages.length > 0 && (
            <Section title="Languages">
              {languages.map(lang => (
                <div key={lang.id}>
                  <div style={{ paddingBottom: '1px' }} />
                  <div style={{ display: 'flex', flexDirection: 'row', paddingBottom: '2px' }}>
                    <span style={{ fontSize: '8.5px', fontWeight: 700, color: '#1e293b', width: '100px', ...rtlStyle(lang.language) }}>
                      {lang.language}
                    </span>
                    <span style={{ fontSize: '8.5px', color: '#475569' }}>{lang.proficiency}</span>
                  </div>
                </div>
              ))}
            </Section>
          )}

        </div>
      </div>
    </div>
  );
}
