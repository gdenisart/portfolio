export interface Project {
  id: number;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string; // JSON array as string
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  level: number;
  iconUrl?: string;
  description?: string;
  featured: boolean;
}

export interface Experience {
  id: number;
  title: string;
  company: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description: string;
  technologies?: string; // JSON array as string
  achievements?: string; // JSON array as string
}

export interface Education {
  id: number;
  degree: string;
  institution: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description?: string;
  grade?: string;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface Admin {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
}