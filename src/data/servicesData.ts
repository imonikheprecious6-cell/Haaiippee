import { ServiceItem } from '../types';

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: 'website-design',
    title: 'Website Design',
    category: 'design',
    description: 'Custom, high-converting digital experiences tailored to your brand identity, business goals, and target audience.',
    deliverables: [
      'Bespoke visual UI/UX layout',
      'Mobile & desktop responsive optimization',
      'Interactive wireframes & prototypes',
      'Conversion-focused section structures'
    ],
    iconName: 'Layout'
  },
  {
    id: 'website-redesign',
    title: 'Website Redesign',
    category: 'design',
    description: 'Transform outdated websites into modern, elevated digital assets that build trust and drive real business growth.',
    deliverables: [
      'Comprehensive UI/UX audit of current site',
      'Modern visual refresh & typography overhaul',
      'Mobile usability & speed optimization',
      'Content reorganization & navigation cleanup'
    ],
    iconName: 'RefreshCw'
  },
  {
    id: 'landing-pages',
    title: 'Landing Pages',
    category: 'design',
    description: 'High-impact, single-page funnels engineered to capture inquiries, sell products, or launch new campaigns.',
    deliverables: [
      'Persuasive narrative flow & visual hierarchy',
      'Fast-loading single page architecture',
      'Seamless form & calendar booking integration',
      'A/B test ready layout structure'
    ],
    iconName: 'Sparkles'
  },
  {
    id: 'wordpress',
    title: 'WordPress',
    category: 'platform',
    description: 'Flexible, scalable WordPress websites built with clean site architecture, fast page loads, and intuitive content management.',
    deliverables: [
      'Custom theme setup & child theme development',
      'Security & performance optimization',
      'Plugin setup & custom fields configuration',
      'Client training & CMS documentation'
    ],
    platforms: ['WordPress.org', 'WooCommerce', 'WP Engine'],
    iconName: 'Code'
  },
  {
    id: 'elementor',
    title: 'Elementor',
    category: 'platform',
    description: 'Custom WordPress site development using Elementor Pro for effortless ongoing updates and visually pixel-perfect designs.',
    deliverables: [
      'Bespoke Elementor template kits',
      'Dynamic post types & custom loop items',
      'Clean CSS styling & lightweight builder config',
      'Responsive tablet & mobile breakpoint tuning'
    ],
    platforms: ['Elementor Pro', 'WordPress'],
    iconName: 'Box'
  },
  {
    id: 'webflow',
    title: 'Webflow',
    category: 'platform',
    description: 'Premium visual development in Webflow, delivering production-ready animations, ultra-fast performance, and robust CMS structures.',
    deliverables: [
      'Clean HTML5/CSS3 Webflow builds',
      'Custom Webflow CMS collections',
      'Smooth micro-interactions & scroll triggers',
      'Complete Webflow SEO configuration'
    ],
    platforms: ['Webflow CMS', 'Webflow E-Commerce'],
    iconName: 'Layers'
  },
  {
    id: 'wix-wixstudio',
    title: 'Wix & Wix Studio',
    category: 'platform',
    description: 'Sophisticated visual layouts built on Wix Studio with custom Velo scripting, dynamic databases, and responsive CSS grid controls.',
    deliverables: [
      'Responsive visual design in Wix Studio',
      'Wix CMS & dynamic dataset integration',
      'Custom member portals & booking flows',
      'Domain & DNS launch assistance'
    ],
    platforms: ['Wix Studio', 'Wix Classic', 'Velo'],
    iconName: 'Monitor'
  },
  {
    id: 'squarespace',
    title: 'Squarespace',
    category: 'platform',
    description: 'Clean, elegant, and low-maintenance Squarespace sites crafted for boutique brands, creatives, and service providers.',
    deliverables: [
      'Custom styled Squarespace 7.1 templates',
      'Custom CSS injection & font pairings',
      'Scheduling & newsletter integration',
      'Mobile-optimized fluid engine layouts'
    ],
    platforms: ['Squarespace 7.1', 'Fluid Engine'],
    iconName: 'Grid'
  },
  {
    id: 'seo',
    title: 'SEO (Search Engine Optimization)',
    category: 'marketing',
    description: 'Strategic search engine optimization to help your target clients discover your business organically on Google.',
    deliverables: [
      'Technical SEO audit & site speed fixes',
      'Keyword research & search intent mapping',
      'On-page SEO (meta titles, schema, headings)',
      'Local SEO & Google Business Profile optimization'
    ],
    iconName: 'Search'
  },
  {
    id: 'branding-logo-design',
    title: 'Branding & Logo Design',
    category: 'design',
    description: 'Distinctive brand identities, logo marks, color palettes, and typography guidelines that make your business unforgettable.',
    deliverables: [
      'Primary & secondary logo marks',
      'Brand color palette & typography hierarchy',
      'Brand style guide PDF',
      'Social media profile & favicon assets'
    ],
    iconName: 'Palette'
  },
  {
    id: 'social-media-management',
    title: 'Social Media Management',
    category: 'marketing',
    description: 'Cohesive visual feed curation, strategic content planning, and consistent profile management to build brand presence.',
    deliverables: [
      'Monthly visual content calendar',
      'Custom graphic templates & carousels',
      'Profile optimization & bio refining',
      'Brand voice consistency guidelines'
    ],
    iconName: 'Share2'
  },
  {
    id: 'social-media-advertising',
    title: 'Social Media Advertising',
    category: 'marketing',
    description: 'Targeted advertising campaigns on Meta (Instagram/Facebook) designed to drive qualified traffic to your custom landing pages.',
    deliverables: [
      'Ad creative design & copywriting',
      'Target audience setup & pixel placement',
      'Campaign structure & budget planning',
      'Performance tracking & clear ad reporting'
    ],
    iconName: 'Target'
  }
];
