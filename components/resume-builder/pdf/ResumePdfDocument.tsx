// NOTE: No 'use client' — runs in react-pdf worker context (no DOM APIs).

import React from 'react';
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
    Font,
} from '@react-pdf/renderer';
import { ResumeData } from '@/types/resume';

// ─── Arabic Font Registration ─────────────────────────────────────────────────
// Cairo supports Arabic + Latin characters — prevents garbled text for Arabic input
Font.register({
    family: 'Cairo',
    fonts: [
        { src: '/fonts/Cairo-Regular.ttf', fontWeight: 400 },
        { src: '/fonts/Cairo-Regular.ttf', fontWeight: 700 }, // Fallback to regular if bold missing, but we'll try to use bold
    ],
});

// Disable hyphenation so Arabic words don't get broken
Font.registerHyphenationCallback(word => [word]);

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

/**
 * Basic RTL detection for Arabic characters
 */
function isArabic(text: string): boolean {
    const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    return arabicPattern.test(text || '');
}

/**
 * Get dynamic style based on text direction
 */
function getDirStyle(text: string): any {
    return isArabic(text) ? { textAlign: 'right', direction: 'rtl' } : { textAlign: 'left' };
}

// ─── Palette ─────────────────────────────────────────────────────────────────

const P = {
    primary:   '#3730a1', // Indigo 800
    accent:    '#4f46e5', // Indigo 600
    accentLight:'#eef2ff', // Indigo 50
    textMain:  '#0f172a', // Slate 900
    textMuted: '#475569', // Slate 600
    textLight: '#94a3b8', // Slate 400
    sidebarBg: '#1e1b4b', // Indigo 950 (Premium dark)
    white:     '#ffffff',
    border:    '#e2e8f0',
};

// ─── StyleSheet ──────────────────────────────────────────────────────────────

const S = StyleSheet.create({
    page: {
        fontFamily: 'Cairo',
        backgroundColor: P.white,
        flexDirection: 'row',
        color: P.textMain,
    },

    // ── Sidebar ──
    sidebar: {
        width: '32%',
        backgroundColor: P.sidebarBg,
        paddingTop: 40,
        paddingBottom: 40,
        paddingHorizontal: 20,
        flexShrink: 0,
    },
    photoContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
        backgroundColor: P.accent,
        alignSelf: 'center',
        marginBottom: 24,
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    photo: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    sidebarSection: {
        marginBottom: 28,
    },
    sidebarTitle: {
        fontSize: 9,
        fontWeight: 700,
        color: '#818cf8', // Indigo 400
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        paddingBottom: 4,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
        gap: 8,
    },
    contactIcon: {
        fontSize: 10,
        color: '#a5b4fc',
        width: 12,
    },
    contactText: {
        fontSize: 8.5,
        color: '#e0e7ff',
        flex: 1,
        lineHeight: 1.4,
    },
    skillItem: {
        marginBottom: 10,
    },
    skillHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    skillName: {
        fontSize: 9,
        fontWeight: 700,
        color: P.white,
    },
    skillBarBg: {
        height: 3,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 2,
    },
    skillBarFill: {
        height: 3,
        backgroundColor: '#818cf8',
        borderRadius: 2,
    },

    // ── Main Content ──
    main: {
        flex: 1,
        paddingTop: 40,
        paddingBottom: 40,
        paddingHorizontal: 32,
    },
    header: {
        marginBottom: 32,
    },
    name: {
        fontSize: 28,
        fontWeight: 700,
        color: P.textMain,
        marginBottom: 4,
    },
    jobTitle: {
        fontSize: 14,
        fontWeight: 700,
        color: P.accent,
        letterSpacing: 0.5,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        borderBottomWidth: 2,
        borderBottomColor: P.accentLight,
        paddingBottom: 6,
        gap: 8,
    },
    sectionIcon: {
        width: 4,
        height: 14,
        backgroundColor: P.accent,
        borderRadius: 2,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: 700,
        color: P.textMain,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
    },
    
    // Entry Rows
    entry: {
        marginBottom: 16,
    },
    entryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
        gap: 12,
    },
    entryTitle: {
        fontSize: 11,
        fontWeight: 700,
        color: P.textMain,
        flex: 1,
    },
    dateBadge: {
        backgroundColor: P.accentLight,
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 4,
    },
    dateText: {
        fontSize: 8,
        fontWeight: 700,
        color: P.accent,
    },
    entrySubtitle: {
        fontSize: 9.5,
        fontWeight: 700,
        color: P.accent,
        marginBottom: 6,
    },
    entryDescription: {
        fontSize: 9,
        color: P.textMuted,
        lineHeight: 1.6,
    },

    // ── Attachment Pages ──
    attachmentPage: {
        fontFamily: 'Cairo',
        backgroundColor: '#f8fafc',
        padding: 40,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    attachmentHeader: {
        width: '100%',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        paddingBottom: 10,
    },
    attachmentLabel: {
        fontSize: 10,
        color: P.accent,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    attachmentTitle: {
        fontSize: 18,
        fontWeight: 700,
        color: P.textMain,
    },
    attachmentFrame: {
        flex: 1,
        width: '100%',
        backgroundColor: P.white,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        padding: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    attachmentImage: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
    },
});

// ─── Components ─────────────────────────────────────────────────────────────

const PROF_PCT: Record<string, string> = {
    beginner: '30%',
    intermediate: '60%',
    advanced: '85%',
    expert: '100%',
};

function Skill({ name, proficiency }: { name: string; proficiency: string }) {
    return (
        <View style={S.skillItem}>
            <View style={S.skillHeader}>
                <Text style={[S.skillName, getDirStyle(name)]}>{name}</Text>
            </View>
            <View style={S.skillBarBg}>
                <View style={[S.skillBarFill, { width: PROF_PCT[proficiency] || '50%' }]} />
            </View>
        </View>
    );
}

// ─── Main Document ──────────────────────────────────────────────────────────

interface Props { data: ResumeData; }

export function ResumePdfDocument({ data }: Props) {
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

    return (
        <Document
            title={pi.fullName ? `${pi.fullName} – Resume` : 'Resume'}
            author={pi.fullName || ''}
            creator="AI Resume Builder"
            producer="AI Resume Builder"
        >
            {/* ═══ MAIN CV PAGE ═══ */}
            <Page size="A4" style={S.page}>
                {/* Sidebar */}
                <View style={S.sidebar}>
                    <View style={S.photoContainer}>
                        {pi.photo ? (
                            <Image src={pi.photo} style={S.photo} />
                        ) : (
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 32, color: '#a5b4fc', fontWeight: 700 }}>
                                    {(pi.fullName || '?')[0].toUpperCase()}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Contact Section */}
                    {contacts.length > 0 && (
                        <View style={S.sidebarSection}>
                            <Text style={S.sidebarTitle}>Contact</Text>
                            {contacts.map((c, i) => (
                                <View key={i} style={S.contactRow}>
                                    <Text style={S.contactIcon}>{c.icon}</Text>
                                    <Text style={[S.contactText, getDirStyle(c.text)]}>{c.text}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Skills Section */}
                    {skills.length > 0 && (
                        <View style={S.sidebarSection}>
                            <Text style={S.sidebarTitle}>Skills</Text>
                            {skills.map(s => <Skill key={s.id} name={s.name} proficiency={s.proficiency} />)}
                        </View>
                    )}
                </View>

                {/* Main Content */}
                <View style={S.main}>
                    <View style={S.header}>
                        <Text style={[S.name, getDirStyle(pi.fullName)]}>{pi.fullName || 'Your Name'}</Text>
                        {pi.title && <Text style={[S.jobTitle, getDirStyle(pi.title)]}>{pi.title}</Text>}
                    </View>

                    {/* Education */}
                    {educations.length > 0 && (
                        <View style={S.section}>
                            <View style={S.sectionHeader}>
                                <View style={S.sectionIcon} />
                                <Text style={S.sectionTitle}>Education</Text>
                            </View>
                            {educations.map(edu => (
                                <View key={edu.id} style={S.entry}>
                                    <View style={S.entryHeader}>
                                        <Text style={[S.entryTitle, getDirStyle(edu.degree)]}>
                                            {[edu.degree, edu.field].filter(Boolean).join(' in ') || 'Degree'}
                                        </Text>
                                        <View style={S.dateBadge}>
                                            <Text style={S.dateText}>{formatDate(edu.graduationDate)}</Text>
                                        </View>
                                    </View>
                                    {edu.school && <Text style={[S.entrySubtitle, getDirStyle(edu.school)]}>{edu.school}</Text>}
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Experience */}
                    {experiences.length > 0 && (
                        <View style={S.section}>
                            <View style={S.sectionHeader}>
                                <View style={S.sectionIcon} />
                                <Text style={S.sectionTitle}>Experience</Text>
                            </View>
                            {experiences.map(exp => (
                                <View key={exp.id} style={S.entry}>
                                    <View style={S.entryHeader}>
                                        <Text style={[S.entryTitle, getDirStyle(exp.position)]}>{exp.position || 'Position'}</Text>
                                        <View style={S.dateBadge}>
                                            <Text style={S.dateText}>{formatRange(exp.startDate, exp.endDate, exp.currentlyWorking)}</Text>
                                        </View>
                                    </View>
                                    {exp.company && <Text style={[S.entrySubtitle, getDirStyle(exp.company)]}>{exp.company}</Text>}
                                    {exp.description && (
                                        <Text style={[S.entryDescription, getDirStyle(exp.description)]}>
                                            {exp.description}
                                        </Text>
                                    )}
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </Page>

            {/* ═══ ATTACHMENT PAGES ═══ */}
            
            {/* Graduation Certificate */}
            {pi.graduationCertificate && (
                <Page size="A4" style={S.attachmentPage}>
                    <View style={S.attachmentHeader}>
                        <Text style={S.attachmentLabel}>Official Attachment</Text>
                        <Text style={S.attachmentTitle}>Graduation Certificate</Text>
                    </View>
                    <View style={S.attachmentFrame}>
                        <Image src={pi.graduationCertificate} style={S.attachmentImage} />
                    </View>
                </Page>
            )}

            {/* Course Certificates */}
            {certSkills.map(s => (
                <Page key={s.id} size="A4" style={S.attachmentPage}>
                    <View style={S.attachmentHeader}>
                        <Text style={S.attachmentLabel}>Course Certification</Text>
                        <Text style={S.attachmentTitle}>{s.name} Certificate</Text>
                    </View>
                    <View style={S.attachmentFrame}>
                        <Image src={s.certificate!} style={S.attachmentImage} />
                    </View>
                </Page>
            ))}
        </Document>
    );
}
