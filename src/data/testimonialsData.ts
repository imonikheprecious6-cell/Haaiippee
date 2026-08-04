import { Testimonial, VideoTestimonial } from '../types';

export const WRITTEN_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    clientName: 'Elena Rostova',
    company: 'Aura Architecture Studio',
    role: 'Principal Architect',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    content: 'Precious delivered a website that exceeded our expectations. He listened carefully to our design philosophy and translated it into a dark, luxurious layout that highlights our projects beautifully. His attention to detail and SEO expertise made the entire process seamless.',
    projectType: 'Website Design & SEO',
    rating: 5
  },
  {
    id: '2',
    clientName: 'Marcus Vance',
    company: 'Lumina Specialty Roasters',
    role: 'Co-Founder',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
    content: 'Working with Precious on our website redesign was one of the best decisions we made for our business. He completely elevated our online store, made navigation smooth for our subscribers, and communicating with him was always direct and professional.',
    projectType: 'Website Redesign',
    rating: 5
  },
  {
    id: '3',
    clientName: 'Sarah Jenkins',
    company: 'Solaria Holistic Spa',
    role: 'Managing Director',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    content: 'Precious understands true visual hierarchy. He built a tranquil, beautiful site for our spa that feels expensive and peaceful. Our online consultation bookings have been effortless ever since.',
    projectType: 'Squarespace Design & Local SEO',
    rating: 5
  },
  {
    id: '4',
    clientName: 'David Thorne',
    company: 'Vanguard Wealth Partners',
    role: 'Managing Partner',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    content: 'In the financial sector, trust is paramount. Precious crafted a Wix Studio experience for us that communicates authority and safety. He completed the project on time and guided us through every step of the content setup.',
    projectType: 'Wix Studio & Brand Strategy',
    rating: 5
  }
];

export const VIDEO_TESTIMONIALS: VideoTestimonial[] = [
  {
    id: 'v1',
    clientName: 'Rob',
    company: 'BreakupBro.com',
    role: 'Founder',
    projectType: 'Complete Website Design & Development',
    description: 'Designed and developed a modern website that reflects the brand and provides visitors with a clean, user-friendly experience.',
    duration: 'Video Story',
    videoUrl: 'https://youtube.com/shorts/cz0orTqWpDw?si=-1GkU7gBuPhcrh4s',
    youtubeId: 'cz0orTqWpDw'
  },
  {
    id: 'v2',
    clientName: 'Jomilla Denae',
    company: 'Jomilla Denae Coaching',
    role: 'Coach',
    projectType: 'Website Redesign & Maintenance',
    description: 'Redesigned the existing website and continue providing ongoing maintenance and updates to ensure everything runs smoothly.',
    duration: 'Video Story',
    videoUrl: 'https://youtu.be/WWkQXOQV8gA',
    youtubeId: 'WWkQXOQV8gA'
  },
  {
    id: 'v3',
    clientName: 'Perez',
    company: 'Dominican Restaurant',
    role: 'Restaurant Owner',
    projectType: 'Restaurant Website Design',
    description: 'Designed and developed a modern restaurant website focused on creating an engaging online experience for customers.',
    duration: 'Video Story',
    videoUrl: 'https://youtu.be/-SGItXDaaaY',
    youtubeId: '-SGItXDaaaY'
  }
];
