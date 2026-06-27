'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  ResumeData, PersonalInfo, Experience, Education,
  SkillCategory, Project, Certification, Language,
  AtsScore, AtsSuggestion,
} from '@/types/resume';
import { computeAtsScore, computeAtsSuggestions } from '@/lib/ats-scoring';

const STORAGE_KEY = 'resume-builder-data';

const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    photo: '',
    professionalSummary: '',
  },
  experiences: [],
  educations: [],
  skillCategories: [],
  projects: [],
  certifications: [],
  languages: [],
};

function loadFromStorage(): ResumeData {
  if (typeof window === 'undefined') return initialResumeData;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return initialResumeData;
    const parsed = JSON.parse(stored) as ResumeData;
    return {
      ...initialResumeData,
      ...parsed,
      personalInfo: { ...initialResumeData.personalInfo, ...parsed.personalInfo },
      skillCategories: parsed.skillCategories || [],
      projects: parsed.projects || [],
      certifications: parsed.certifications || [],
      languages: parsed.languages || [],
      experiences: (parsed.experiences || []).map(e => ({
        ...e,
        bullets: e.bullets || [],
      })),
    };
  } catch {
    return initialResumeData;
  }
}

interface ResumeContextType {
  data: ResumeData;
  atsScore: AtsScore;
  atsSuggestions: AtsSuggestion[];
  updatePersonalInfo: (info: PersonalInfo) => void;
  addExperience: (experience: Omit<Experience, 'id'>) => void;
  updateExperience: (id: string, experience: Omit<Experience, 'id'>) => void;
  removeExperience: (id: string) => void;
  addEducation: (education: Omit<Education, 'id'>) => void;
  updateEducation: (id: string, education: Omit<Education, 'id'>) => void;
  removeEducation: (id: string) => void;
  addSkillCategory: (category: Omit<SkillCategory, 'id'>) => void;
  updateSkillCategory: (id: string, category: Omit<SkillCategory, 'id'>) => void;
  removeSkillCategory: (id: string) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Omit<Project, 'id'>) => void;
  removeProject: (id: string) => void;
  addCertification: (cert: Omit<Certification, 'id'>) => void;
  updateCertification: (id: string, cert: Omit<Certification, 'id'>) => void;
  removeCertification: (id: string) => void;
  addLanguage: (lang: Omit<Language, 'id'>) => void;
  updateLanguage: (id: string, lang: Omit<Language, 'id'>) => void;
  removeLanguage: (id: string) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  clearAll: () => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<ResumeData>(initialResumeData);
  const [currentStep, setCurrentStep] = useState(1);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const savedData = loadFromStorage();
    setData(savedData);
    if (typeof window !== 'undefined') {
      const savedStep = localStorage.getItem('resume-builder-step');
      if (savedStep) setCurrentStep(parseInt(savedStep, 10));
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem('resume-builder-step', currentStep.toString());
  }, [data, currentStep, hydrated]);

  const atsScore = useMemo(() => computeAtsScore(data), [data]);
  const atsSuggestions = useMemo(() => computeAtsSuggestions(data), [data]);

  const updatePersonalInfo = useCallback((info: PersonalInfo) => {
    setData(prev => ({ ...prev, personalInfo: info }));
  }, []);

  const addExperience = useCallback((experience: Omit<Experience, 'id'>) => {
    const newExperience: Experience = { ...experience, id: crypto.randomUUID() };
    setData(prev => ({ ...prev, experiences: [...prev.experiences, newExperience] }));
  }, []);

  const updateExperience = useCallback((id: string, experience: Omit<Experience, 'id'>) => {
    setData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp => exp.id === id ? { ...experience, id } : exp),
    }));
  }, []);

  const removeExperience = useCallback((id: string) => {
    setData(prev => ({ ...prev, experiences: prev.experiences.filter(exp => exp.id !== id) }));
  }, []);

  const addEducation = useCallback((education: Omit<Education, 'id'>) => {
    const newEducation: Education = { ...education, id: crypto.randomUUID() };
    setData(prev => ({ ...prev, educations: [...prev.educations, newEducation] }));
  }, []);

  const updateEducation = useCallback((id: string, education: Omit<Education, 'id'>) => {
    setData(prev => ({
      ...prev,
      educations: prev.educations.map(edu => edu.id === id ? { ...education, id } : edu),
    }));
  }, []);

  const removeEducation = useCallback((id: string) => {
    setData(prev => ({ ...prev, educations: prev.educations.filter(edu => edu.id !== id) }));
  }, []);

  const addSkillCategory = useCallback((category: Omit<SkillCategory, 'id'>) => {
    const newCategory: SkillCategory = { ...category, id: crypto.randomUUID() };
    setData(prev => ({ ...prev, skillCategories: [...prev.skillCategories, newCategory] }));
  }, []);

  const updateSkillCategory = useCallback((id: string, category: Omit<SkillCategory, 'id'>) => {
    setData(prev => ({
      ...prev,
      skillCategories: prev.skillCategories.map(c => c.id === id ? { ...category, id } : c),
    }));
  }, []);

  const removeSkillCategory = useCallback((id: string) => {
    setData(prev => ({ ...prev, skillCategories: prev.skillCategories.filter(c => c.id !== id) }));
  }, []);

  const addProject = useCallback((project: Omit<Project, 'id'>) => {
    const newProject: Project = { ...project, id: crypto.randomUUID() };
    setData(prev => ({ ...prev, projects: [...prev.projects, newProject] }));
  }, []);

  const updateProject = useCallback((id: string, project: Omit<Project, 'id'>) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...project, id } : p),
    }));
  }, []);

  const removeProject = useCallback((id: string) => {
    setData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));
  }, []);

  const addCertification = useCallback((cert: Omit<Certification, 'id'>) => {
    const newCert: Certification = { ...cert, id: crypto.randomUUID() };
    setData(prev => ({ ...prev, certifications: [...prev.certifications, newCert] }));
  }, []);

  const updateCertification = useCallback((id: string, cert: Omit<Certification, 'id'>) => {
    setData(prev => ({
      ...prev,
      certifications: prev.certifications.map(c => c.id === id ? { ...cert, id } : c),
    }));
  }, []);

  const removeCertification = useCallback((id: string) => {
    setData(prev => ({ ...prev, certifications: prev.certifications.filter(c => c.id !== id) }));
  }, []);

  const addLanguage = useCallback((lang: Omit<Language, 'id'>) => {
    const newLang: Language = { ...lang, id: crypto.randomUUID() };
    setData(prev => ({ ...prev, languages: [...prev.languages, newLang] }));
  }, []);

  const updateLanguage = useCallback((id: string, lang: Omit<Language, 'id'>) => {
    setData(prev => ({
      ...prev,
      languages: prev.languages.map(l => l.id === id ? { ...lang, id } : l),
    }));
  }, []);

  const removeLanguage = useCallback((id: string) => {
    setData(prev => ({ ...prev, languages: prev.languages.filter(l => l.id !== id) }));
  }, []);

  const clearAll = useCallback(() => {
    setData(initialResumeData);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <ResumeContext.Provider
      value={{
        data, atsScore, atsSuggestions,
        updatePersonalInfo,
        addExperience, updateExperience, removeExperience,
        addEducation, updateEducation, removeEducation,
        addSkillCategory, updateSkillCategory, removeSkillCategory,
        addProject, updateProject, removeProject,
        addCertification, updateCertification, removeCertification,
        addLanguage, updateLanguage, removeLanguage,
        currentStep, setCurrentStep, clearAll,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}
