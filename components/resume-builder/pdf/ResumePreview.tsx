'use client';

import React from 'react';
import { ResumeData } from '@/types/resume';

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

function getDirStyle(text: string): React.CSSProperties {
  return isArabic(text) ? { textAlign: 'right', direction: 'rtl' } : { textAlign: 'left' };
}

// ─── Constants ───────────────────────────────────────────────────────────────

const PROF_PCT: Record<string, string> = {
  beginner: '30%',
  intermediate: '60%',
  advanced: '85%',
  expert: '100%',
};

// ─── Components ─────────────────────────────────────────────────────────────

function Skill({ name, proficiency }: { name: string; proficiency: string }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: '4px',
        ...getDirStyle(name)
      }}>
        <span style={{ fontSize: '9.5px', fontWeight: 700, color: '#ffffff' }}>{name}</span>
      </div>
      <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ 
          height: '100%', 
          width: PROF_PCT[proficiency] || '50%', 
          backgroundColor: '#818cf8',
          borderRadius: '2px',
          transition: 'width 0.5s ease'
        }} />
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '28px' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px', 
        marginBottom: '16px',
        borderBottom: '2px solid #eef2ff',
        paddingBottom: '8px'
      }}>
        <div style={{ width: '4px', height: '16px', backgroundColor: '#4f46e5', borderRadius: '2px' }} />
        <h2 style={{ 
          fontSize: '11px', 
          fontWeight: 800, 
          color: '#0f172a', 
          textTransform: 'uppercase', 
          letterSpacing: '0.12em',
          margin: 0
        }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

// ─── Main Preview ─────────────────────────────────────────────────────────────

interface Props { data: ResumeData; }

export function ResumePreview({ data }: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current) return;
      
      // Use the actual container width instead of window.innerWidth
      const parent = containerRef.current.parentElement;
      if (!parent) return;

      const parentWidth = parent.clientWidth;
      const a4Width = 794; // approx 210mm in pixels at 96dpi
      
      // On mobile (parentWidth < 768), we want almost no padding to maximize space
      const padding = parentWidth < 768 ? 16 : 40;
      const availableWidth = parentWidth - padding;
      
      if (availableWidth < a4Width) {
        setScale(availableWidth / a4Width);
      } else {
        setScale(1);
      }
    };

    // Need a slight delay to ensure parent has rendered its true width
    const timeoutId = setTimeout(calculateScale, 100);
    
    window.addEventListener('resize', calculateScale);
    return () => {
      window.removeEventListener('resize', calculateScale);
      clearTimeout(timeoutId);
    };
  }, []);

  if (!data?.personalInfo) return null;

  const { personalInfo: pi, experiences, educations, skills } = data;

  const contacts = [
    pi.email && { icon: '✉', text: pi.email },
    pi.phone && { icon: '✆', text: pi.phone },
    pi.location && { icon: '⌖', text: pi.location },
    pi.linkedin && { icon: 'in', text: pi.linkedin },
    pi.website && { icon: '⌂', text: pi.website },
  ].filter(Boolean) as { icon: string; text: string }[];

  const certSkills = skills.filter(s => s.certificate);

  // A4 dimensions in pixels
  const A4_WIDTH_PX = 794;
  const A4_HEIGHT_PX = 1123;

  return (
    <div 
      ref={containerRef}
      className="resume-preview-container" 
      style={{
        width: '100%',
        margin: '0 auto',
        padding: scale < 1 ? '8px 0' : '20px', // Reduce padding on mobile
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflowX: 'hidden', // Prevent horizontal scroll
      }}
    >
      {/* ═══ A4 PAPER WRAPPER ═══ */}
      <div style={{
        backgroundColor: '#ffffff',
        width: `${A4_WIDTH_PX}px`,
        minHeight: `${A4_HEIGHT_PX}px`,
        margin: '0 auto',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'row',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        // Dynamic scale
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        // Important: maintain vertical space for scaled content
        marginBottom: `calc(${A4_HEIGHT_PX}px * (${scale} - 1))`,
      }}>
        
        {/* ═══ LEFT SIDEBAR ═══ */}
        <div style={{
          width: '32%',
          backgroundColor: '#1e1b4b',
          color: '#ffffff',
          padding: '40px 20px',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}>
          {/* Photo */}
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            overflow: 'hidden',
            backgroundColor: '#4f46e5',
            alignSelf: 'center',
            marginBottom: '24px',
            border: '3px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            {pi.photo ? (
              <img src={pi.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '36px', color: '#a5b4fc', fontWeight: 800 }}>
                {(pi.fullName || '?')[0].toUpperCase()}
              </span>
            )}
          </div>

          {/* Contact */}
          {contacts.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '9px', fontWeight: 800, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>Contact</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {contacts.map((c, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '10px', color: '#a5b4fc', width: '14px', textAlign: 'center' }}>{c.icon}</span>
                    <span style={{ fontSize: '8.5px', color: '#e0e7ff', flex: 1, wordBreak: 'break-all', ...getDirStyle(c.text) }}>{c.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <h3 style={{ fontSize: '9px', fontWeight: 800, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>Skills</h3>
              {skills.map(s => <Skill key={s.id} name={s.name} proficiency={s.proficiency} />)}
            </div>
          )}
        </div>

        {/* ═══ RIGHT MAIN CONTENT ═══ */}
        <div style={{
          flex: 1,
          padding: '40px 32px',
          backgroundColor: '#ffffff',
          minWidth: 0,
        }}>
          {/* Header */}
          <div style={{ marginBottom: '36px' }}>
            <h1 style={{ fontSize: '30px', fontWeight: 900, color: '#0f172a', margin: '0 0 6px', ...getDirStyle(pi.fullName) }}>
              {pi.fullName || 'Your Name'}
            </h1>
            {pi.title && (
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#4f46e5', margin: 0, letterSpacing: '0.02em', ...getDirStyle(pi.title) }}>
                {pi.title}
              </p>
            )}
          </div>

          {/* Education */}
          {educations.length > 0 && (
            <Section title="Education">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {educations.map(edu => (
                  <div key={edu.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#1e293b', flex: 1, ...getDirStyle(edu.degree) }}>
                        {[edu.degree, edu.field].filter(Boolean).join(' in ') || 'Degree'}
                      </span>
                      <span style={{ fontSize: '8.5px', fontWeight: 700, color: '#4f46e5', backgroundColor: '#eef2ff', padding: '3px 8px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                        {formatDate(edu.graduationDate)}
                      </span>
                    </div>
                    {edu.school && <p style={{ fontSize: '10px', fontWeight: 600, color: '#4f46e5', margin: 0, ...getDirStyle(edu.school) }}>{edu.school}</p>}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Experience */}
          {experiences.length > 0 && (
            <Section title="Experience">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {experiences.map(exp => (
                  <div key={exp.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#1e293b', flex: 1, ...getDirStyle(exp.position) }}>
                        {exp.position || 'Position'}
                      </span>
                      <span style={{ fontSize: '8.5px', fontWeight: 700, color: '#4f46e5', backgroundColor: '#eef2ff', padding: '3px 8px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                        {formatRange(exp.startDate, exp.endDate, exp.currentlyWorking)}
                      </span>
                    </div>
                    {exp.company && <p style={{ fontSize: '10px', fontWeight: 600, color: '#4f46e5', margin: '0 0 8px', ...getDirStyle(exp.company) }}>{exp.company}</p>}
                    {exp.description && (
                      <div style={{ fontSize: '9.5px', color: '#475569', lineHeight: 1.6, ...getDirStyle(exp.description) }}>
                        {exp.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>
      </div>

      {/* ═══ ATTACHMENTS PREVIEW ═══ */}
      {(pi.graduationCertificate || certSkills.length > 0) && (
        <div style={{ 
          marginTop: '40px', 
          backgroundColor: '#ffffff', 
          borderRadius: '12px', 
          padding: '24px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' 
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#4f46e5' }}>📎</span> Attachments & Certificates
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
            {/* Graduation */}
            {pi.graduationCertificate && (
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ height: '150px', backgroundColor: '#f8fafc', overflow: 'hidden' }}>
                  <img src={pi.graduationCertificate} alt="Graduation Certificate" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{ padding: '10px', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, margin: 0, color: '#1e293b' }}>Graduation Certificate</p>
                </div>
              </div>
            )}
            {/* Skills */}
            {certSkills.map(s => (
              <div key={s.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ height: '150px', backgroundColor: '#f8fafc', overflow: 'hidden' }}>
                  <img src={s.certificate} alt={`${s.name} Certificate`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{ padding: '10px', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, margin: 0, color: '#1e293b' }}>{s.name} Certificate</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
