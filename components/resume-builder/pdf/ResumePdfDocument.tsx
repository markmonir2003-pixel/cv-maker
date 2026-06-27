import React from 'react';
import {
    Document,
    Page,
    Text,
    View,
    Image,
    StyleSheet,
    Font,
} from '@react-pdf/renderer';
import { ResumeData } from '@/types/resume';

Font.register({
    family: 'Cairo',
    fonts: [
        { src: '/fonts/Cairo-Regular.ttf', fontWeight: 400 },
        { src: '/fonts/Cairo-Regular.ttf', fontWeight: 700 },
    ],
});

Font.registerHyphenationCallback(word => [word]);

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

function rtlStyle(text: string): any {
    return isArabic(text) ? { textAlign: 'right' } : {};
}

const C = {
    primary: '#1e293b',
    accent: '#2563eb',
    muted: '#475569',
    light: '#94a3b8',
    border: '#e2e8f0',
    white: '#ffffff',
};

const S = StyleSheet.create({
    page: {
        fontFamily: 'Cairo',
        flexDirection: 'column',
        backgroundColor: C.white,
        color: C.primary,
        paddingTop: 24,
        paddingBottom: 24,
        paddingLeft: 36,
        paddingRight: 36,
        fontSize: 9,
    },
    headerRow: {
        flexDirection: 'row',
    },
    headerPhotoCol: {
        flexDirection: 'column',
        width: 56,
    },
    headerTextCol: {
        flexDirection: 'column',
        flex: 1,
    },
    photoCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: C.border,
    },
    photoImg: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    headerBlock: {
        flexDirection: 'column',
        paddingBottom: 10,
        borderBottomWidth: 2,
        borderBottomColor: C.border,
    },
    headerSpacer: {
        flexDirection: 'column',
        paddingBottom: 2,
    },
    name: {
        fontSize: 20,
        fontWeight: 700,
        color: C.primary,
    },
    title: {
        fontSize: 11,
        fontWeight: 700,
        color: C.accent,
    },
    contactLine: {
        fontSize: 8,
        color: C.muted,
    },
    section: {
        flexDirection: 'column',
        paddingBottom: 10,
    },
    sectionHeader: {
        flexDirection: 'column',
        borderBottomWidth: 1,
        borderBottomColor: C.border,
        paddingBottom: 2,
        paddingTop: 8,
    },
    sectionTitle: {
        fontSize: 9,
        fontWeight: 700,
        color: C.primary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    entryBlock: {
        flexDirection: 'column',
        paddingBottom: 5,
    },
    entrySpacer: {
        flexDirection: 'column',
        paddingBottom: 1,
    },
    entryTitle: {
        fontSize: 9,
        fontWeight: 700,
        color: C.primary,
    },
    entrySubtitle: {
        fontSize: 8.5,
        fontWeight: 700,
        color: C.accent,
    },
    entryDate: {
        fontSize: 7.5,
        color: C.light,
    },
    bulletList: {
        flexDirection: 'column',
    },
    bulletRow: {
        flexDirection: 'row',
    },
    bulletSpacer: {
        flexDirection: 'column',
        paddingBottom: 1,
    },
    bulletDot: {
        fontSize: 9,
        color: C.muted,
        width: 10,
    },
    bulletText: {
        fontSize: 8.5,
        color: C.muted,
        flex: 1,
    },
    summaryText: {
        fontSize: 8.5,
        color: C.muted,
    },
    skillCategoryBlock: {
        flexDirection: 'row',
        paddingBottom: 1,
    },
    skillCategoryTitle: {
        fontSize: 8,
        fontWeight: 700,
        color: C.primary,
        width: 80,
    },
    skillChipText: {
        fontSize: 8,
        color: C.muted,
    },
    certEntry: {
        flexDirection: 'column',
        paddingBottom: 4,
    },
    certName: {
        fontSize: 8.5,
        fontWeight: 700,
        color: C.primary,
    },
    certDetail: {
        fontSize: 8,
        color: C.muted,
    },
    langRow: {
        flexDirection: 'row',
        paddingBottom: 2,
    },
    langName: {
        fontSize: 8.5,
        fontWeight: 700,
        color: C.primary,
        width: 100,
    },
    langProf: {
        fontSize: 8.5,
        color: C.muted,
    },
});

function BulletItem({ text }: { text: string }) {
    return (
        <View style={S.bulletSpacer}>
            <View style={S.bulletRow}>
                <Text style={S.bulletDot}>-</Text>
                <Text style={[S.bulletText, rtlStyle(text)]}>{text}</Text>
            </View>
        </View>
    );
}

interface Props { data: ResumeData; }

export function ResumePdfDocument({ data }: Props) {
    if (!data?.personalInfo) return null;

    const { personalInfo, experiences, educations, skillCategories, projects, certifications, languages } = data;

    const contactParts: string[] = [];
    if (personalInfo.email) contactParts.push(personalInfo.email);
    if (personalInfo.phone) contactParts.push(personalInfo.phone);
    if (personalInfo.location) contactParts.push(personalInfo.location);
    if (personalInfo.linkedin) contactParts.push(personalInfo.linkedin);

    return (
        <Document
            title={personalInfo.fullName ? `${personalInfo.fullName} – Resume` : 'Resume'}
            author={personalInfo.fullName || ''}
            creator="AI Resume Builder"
        >
            <Page size={[595.28, 970]} style={S.page}>
                {/* ═══ HEADER ═══ */}
                <View style={S.headerBlock}>
                    <View style={S.headerRow}>
                        {personalInfo.photo && (
                            <View style={S.headerPhotoCol}>
                                <View style={S.photoCircle}>
                                    <Image src={personalInfo.photo} style={S.photoImg} />
                                </View>
                            </View>
                        )}
                        <View style={S.headerTextCol}>
                            <View style={S.headerSpacer}>
                                <Text style={[S.name, rtlStyle(personalInfo.fullName)]}>
                                    {personalInfo.fullName || 'Your Name'}
                                </Text>
                            </View>
                            {personalInfo.title && (
                                <View style={S.headerSpacer}>
                                    <Text style={[S.title, rtlStyle(personalInfo.title)]}>{personalInfo.title}</Text>
                                </View>
                            )}
                            {contactParts.map((part, i) => (
                                <View key={i} style={S.headerSpacer}>
                                    <Text style={[S.contactLine, rtlStyle(part)]}>{part}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>

                {/* ═══ PROFESSIONAL SUMMARY ═══ */}
                {personalInfo.professionalSummary && (
                    <View style={S.section}>
                        <View style={S.sectionHeader}>
                            <Text style={S.sectionTitle}>Professional Summary</Text>
                        </View>
                        <View style={S.entrySpacer} />
                        <Text style={[S.summaryText, rtlStyle(personalInfo.professionalSummary)]}>
                            {personalInfo.professionalSummary}
                        </Text>
                    </View>
                )}

                {/* ═══ SKILLS ═══ */}
                {skillCategories.length > 0 && (
                    <View style={S.section}>
                        <View style={S.sectionHeader}>
                            <Text style={S.sectionTitle}>Skills</Text>
                        </View>
                        {skillCategories.map(cat => (
                            <View key={cat.id} style={S.skillCategoryBlock}>
                                <Text style={[S.skillCategoryTitle, rtlStyle(cat.category)]}>{cat.category}</Text>
                                <Text style={[S.skillChipText, rtlStyle(cat.skills.map(s => s.name).join(', '))]}>
                                    {cat.skills.map(s => s.name).join(', ')}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* ═══ EXPERIENCE ═══ */}
                {experiences.length > 0 && (
                    <View style={S.section}>
                        <View style={S.sectionHeader}>
                            <Text style={S.sectionTitle}>Experience</Text>
                        </View>
                        {experiences.map(exp => (
                            <View key={exp.id} style={S.entryBlock}>
                                <View style={S.entrySpacer} />
                                <View style={S.entrySpacer}>
                                    <Text style={[S.entryTitle, rtlStyle(exp.position)]}>{exp.position || 'Position'}</Text>
                                </View>
                                {exp.company && (
                                    <View style={S.entrySpacer}>
                                        <Text style={[S.entrySubtitle, rtlStyle(exp.company)]}>{exp.company}</Text>
                                    </View>
                                )}
                                <View style={S.entrySpacer}>
                                    <Text style={S.entryDate}>{formatRange(exp.startDate, exp.endDate, exp.currentlyWorking)}</Text>
                                </View>
                                {exp.bullets.filter(b => b.trim()).length > 0 && (
                                    <View style={S.bulletList}>
                                        {exp.bullets.filter(b => b.trim()).map((b, i) => (
                                            <BulletItem key={i} text={b} />
                                        ))}
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                )}

                {/* ═══ PROJECTS ═══ */}
                {projects.length > 0 && (
                    <View style={S.section}>
                        <View style={S.sectionHeader}>
                            <Text style={S.sectionTitle}>Projects</Text>
                        </View>
                        {projects.map(proj => (
                            <View key={proj.id} style={S.entryBlock}>
                                <View style={S.entrySpacer} />
                                <View style={S.entrySpacer}>
                                    <Text style={[S.entryTitle, rtlStyle(proj.name)]}>{proj.name || 'Project'}</Text>
                                </View>
                                {proj.role && (
                                    <View style={S.entrySpacer}>
                                        <Text style={[S.entrySubtitle, rtlStyle(proj.role)]}>{proj.role}</Text>
                                    </View>
                                )}
                                <View style={S.entrySpacer}>
                                    <Text style={S.entryDate}>{formatRange(proj.startDate, proj.endDate, proj.currentlyWorking)}</Text>
                                </View>
                                {proj.bullets.filter(b => b.trim()).length > 0 && (
                                    <View style={S.bulletList}>
                                        {proj.bullets.filter(b => b.trim()).map((b, i) => (
                                            <BulletItem key={i} text={b} />
                                        ))}
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                )}

                {/* ═══ EDUCATION ═══ */}
                {educations.length > 0 && (
                    <View style={S.section}>
                        <View style={S.sectionHeader}>
                            <Text style={S.sectionTitle}>Education</Text>
                        </View>
                        {educations.map(edu => (
                            <View key={edu.id} style={S.entryBlock}>
                                <View style={S.entrySpacer} />
                                <View style={S.entrySpacer}>
                                    <Text style={[S.entryTitle, rtlStyle(edu.degree)]}>
                                        {[edu.degree, edu.field].filter(Boolean).join(' in ') || 'Degree'}
                                    </Text>
                                </View>
                                {edu.school && (
                                    <View style={S.entrySpacer}>
                                        <Text style={[S.entrySubtitle, rtlStyle(edu.school)]}>{edu.school}</Text>
                                    </View>
                                )}
                                <View style={S.entrySpacer}>
                                    <Text style={S.entryDate}>{formatDate(edu.graduationDate)}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* ═══ CERTIFICATIONS ═══ */}
                {certifications.length > 0 && (
                    <View style={S.section}>
                        <View style={S.sectionHeader}>
                            <Text style={S.sectionTitle}>Certifications</Text>
                        </View>
                        {certifications.map(cert => (
                            <View key={cert.id} style={S.certEntry}>
                                <View style={S.entrySpacer} />
                                <View style={S.entrySpacer}>
                                    <Text style={[S.certName, rtlStyle(cert.name)]}>{cert.name}</Text>
                                </View>
                                <Text style={S.certDetail}>
                                    {[cert.issuer, cert.date ? formatDate(cert.date) : ''].filter(Boolean).join(' - ')}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* ═══ LANGUAGES ═══ */}
                {languages.length > 0 && (
                    <View style={S.section}>
                        <View style={S.sectionHeader}>
                            <Text style={S.sectionTitle}>Languages</Text>
                        </View>
                        {languages.map(lang => (
                            <View key={lang.id}>
                                <View style={S.entrySpacer} />
                                <View style={S.langRow}>
                                    <Text style={[S.langName, rtlStyle(lang.language)]}>{lang.language}</Text>
                                    <Text style={S.langProf}>{lang.proficiency}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </Page>
        </Document>
    );
}
