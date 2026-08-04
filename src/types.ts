export type NavPage = 'home' | 'about' | 'services' | 'portfolio' | 'contact';

export interface Project {
  id: string;
  title: string;
  client: string;
  category: string;
  shortDescription: string;
  heroImage: string;
  desktopMockup: string;
  mobileMockup: string;
  tabletMockup?: string;
  overview: string;
  clientGoal: string;
  myRole: string;
  toolsUsed: string[];
  challenges: string;
  solution: string;
  designProcess: string[];
  galleryImages: string[];
  featured?: boolean;
  finalOutcome?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  category: 'design' | 'platform' | 'marketing';
  description: string;
  deliverables: string[];
  platforms?: string[];
  iconName: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  company: string;
  role: string;
  avatar: string;
  content: string;
  projectType: string;
  rating: number;
}

export interface VideoTestimonial {
  id: string;
  clientName: string;
  company: string;
  role: string;
  thumbnail?: string;
  projectType: string;
  quote?: string;
  description?: string;
  duration?: string;
  videoUrl: string;
  youtubeId: string;
}

export interface ContactInfo {
  email: string;
  whatsapp: string;
  whatsappNumber: string;
  instagram: string;
  telegram: string;
  calendlyUrl: string;
}
