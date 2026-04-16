'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ResumeData, PersonalInfo, Experience, Education, Skill } from '@/types/resume';

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
    graduationCertificate: '',
  },
  experiences: [],
  educations: [],
  skills: [],
};

function loadFromStorage(): ResumeData {
  if (typeof window === 'undefined') return initialResumeData;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return initialResumeData;
    const parsed = JSON.parse(stored) as ResumeData;
    // Merge with initial to handle any newly added fields
    return {
      ...initialResumeData,
      ...parsed,
      personalInfo: { ...initialResumeData.personalInfo, ...parsed.personalInfo },
    };
  } catch {
    return initialResumeData;
  }
}

interface ResumeContextType {
  data: ResumeData;
  updatePersonalInfo: (info: PersonalInfo) => void;
  addExperience: (experience: Omit<Experience, 'id'>) => void;
  updateExperience: (id: string, experience: Omit<Experience, 'id'>) => void;
  removeExperience: (id: string) => void;
  addEducation: (education: Omit<Education, 'id'>) => void;
  updateEducation: (id: string, education: Omit<Education, 'id'>) => void;
  removeEducation: (id: string) => void;
  addSkill: (skill: Omit<Skill, 'id'>) => void;
  updateSkill: (id: string, skill: Omit<Skill, 'id'>) => void;
  removeSkill: (id: string) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  clearAll: () => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<ResumeData>(initialResumeData);
  const [currentStep, setCurrentStep] = useState(1);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const savedData = loadFromStorage();
    setData(savedData);
    
    if (typeof window !== 'undefined') {
      const savedStep = localStorage.getItem('resume-builder-step');
      if (savedStep) {
        setCurrentStep(parseInt(savedStep, 10));
      }
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage whenever data or step changes (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem('resume-builder-step', currentStep.toString());
  }, [data, currentStep, hydrated]);

  const updatePersonalInfo = useCallback((info: PersonalInfo) => {
    setData(prev => ({ ...prev, personalInfo: info }));
  }, []);

  const addExperience = useCallback((experience: Omit<Experience, 'id'>) => {
    const newExperience: Experience = {
      ...experience,
      id: crypto.randomUUID(),
    };
    setData(prev => ({
      ...prev,
      experiences: [...prev.experiences, newExperience],
    }));
  }, []);

  const updateExperience = useCallback((id: string, experience: Omit<Experience, 'id'>) => {
    setData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp =>
        exp.id === id ? { ...experience, id } : exp
      ),
    }));
  }, []);

  const removeExperience = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(exp => exp.id !== id),
    }));
  }, []);

  const addEducation = useCallback((education: Omit<Education, 'id'>) => {
    const newEducation: Education = {
      ...education,
      id: crypto.randomUUID(),
    };
    setData(prev => ({
      ...prev,
      educations: [...prev.educations, newEducation],
    }));
  }, []);

  const updateEducation = useCallback((id: string, education: Omit<Education, 'id'>) => {
    setData(prev => ({
      ...prev,
      educations: prev.educations.map(edu =>
        edu.id === id ? { ...education, id } : edu
      ),
    }));
  }, []);

  const removeEducation = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      educations: prev.educations.filter(edu => edu.id !== id),
    }));
  }, []);

  const addSkill = useCallback((skill: Omit<Skill, 'id'>) => {
    const newSkill: Skill = {
      ...skill,
      id: crypto.randomUUID(),
    };
    setData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }));
  }, []);

  const updateSkill = useCallback((id: string, skill: Omit<Skill, 'id'>) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.map(s =>
        s.id === id ? { ...skill, id } : s
      ),
    }));
  }, []);

  const removeSkill = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id),
    }));
  }, []);

  const clearAll = useCallback(() => {
    setData(initialResumeData);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <ResumeContext.Provider
      value={{
        data,
        updatePersonalInfo,
        addExperience,
        updateExperience,
        removeExperience,
        addEducation,
        updateEducation,
        removeEducation,
        addSkill,
        updateSkill,
        removeSkill,
        currentStep,
        setCurrentStep,
        clearAll,
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
