export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  photo: string;
  professionalSummary: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  bullets: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  graduationDate: string;
}

export interface Skill {
  name: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface SkillCategory {
  id: string;
  category: string;
  skills: Skill[];
}

export interface Project {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  bullets: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface Language {
  id: string;
  language: string;
  proficiency: string;
}

export interface AtsScore {
  overall: number;
  toneAndStyle: number;
  content: number;
  structure: number;
  skills: number;
  atsCompatibility: number;
  formatting: number;
  keywordOptimization: number;
  completeness: number;
  readability: number;
  professionalWriting: number;
  resumeLength: number;
  sectionQuality: number;
}

export interface AtsSuggestion {
  severity: 'error' | 'warning' | 'info';
  section: string;
  message: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  educations: Education[];
  skillCategories: SkillCategory[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
}
