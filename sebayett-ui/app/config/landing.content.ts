import type { Component } from 'vue'
import LandingStepClipboardIcon from '~/components/icons/LandingStepClipboardIcon.vue'
import LandingStepRegisterIcon from '~/components/icons/LandingStepRegisterIcon.vue'
import LandingStepTrendingIcon from '~/components/icons/LandingStepTrendingIcon.vue'

export const landingHero = {
  /** Static hero reference: three headline lines + md line break in subtext */
  heroLine1: 'Empower Your Discord',
  heroLine2: 'Community with',
  heroBrand: 'Sebayett',
  subtextLine1: 'Personalized coaching and strategies for server owners to ',
  subtextLine2: 'grow and engage their communities.',
  primaryCta: { label: 'Join Us', to: '/server-apply' as const },
  secondaryCta: { label: 'Sign In', to: '/login' as const },
}

export interface LandingFeature {
  imageSrc: string
  imageAlt: string
  title: string
  description: string
}

export const landingFeatures: LandingFeature[] = [
  {
    imageSrc: '/images/landing/landing-page-choose-three.png',
    imageAlt: 'Role-specific tests for firefighting, law enforcement, and healthcare careers',
    title: 'Role-Specific Tests',
    description:
      'Custom tests crafted for careers like firefighting, law enforcement, and healthcare.',
  },
  {
    imageSrc: '/images/landing/landing-page-choose-two.png',
    imageAlt: 'Analytics and progress insights',
    title: 'Expert Analytics',
    description: 'Clear insights to track progress and improve where it matters.',
  },
  {
    imageSrc: '/images/landing/landing-page-choose-one.png',
    imageAlt: 'Comprehensive study and preparation resources in one place',
    title: 'Comprehensive Resources',
    description: 'Everything you need to prepare, all in one place.',
  },
]

export const landingCommunity = {
  badge: 'Our Story',
  title: 'Empowering Discord Communities to Thrive',
  intro:
    'We help Discord server owners build, grow, and manage thriving communities through practical, expert-led guidance. Our step-by-step courses give you everything you need to succeed, including:',
  bullets: [
    'Smart server setup and optimization',
    'Proven growth and engagement strategies',
    'Community management best practices',
    'Effective monetization techniques',
  ],
  outro:
    "Whether you're launching a new server or scaling an existing one, we provide the tools and strategies to turn your Discord community into a long-term success.",
  cta: { label: 'Apply As Server', to: '/server-apply' as const },
  imageSrc: '/images/landing/making-business-plan-landing-page.png',
  imageAlt:
    'People collaborating on strategy and planning for a growing community',
}

export interface LandingStep {
  step: number
  icon: Component
  description: string
}

export const landingSteps: LandingStep[] = [
  {
    step: 1,
    icon: LandingStepRegisterIcon,
    description: 'Create your free account and select your career goal.',
  },
  {
    step: 2,
    icon: LandingStepClipboardIcon,
    description:
      'Choose a quick test, mock exam, or customize one based on your preferences.',
  },
  {
    step: 3,
    icon: LandingStepTrendingIcon,
    description: 'Review your performance and get insights to improve.',
  },
]

export const landingServer = {
  badge: 'Our Mission',
  title: 'Turning Servers into Thriving Communities',
  body:
    'We understand the unique challenges of building and maintaining a successful Discord server. That\'s why our courses focus on practical, actionable strategies from setting up a strong foundation to implementing advanced engagement and monetization techniques. Our mission is to empower you with the tools, insights, and proven frameworks needed to turn your server into a dynamic, loyal, and thriving community. Whether you\'re just starting or scaling to the next level, we\'re here to support your journey every step of the way.',
  cta: { label: 'Create Account', to: '/login' as const },
  imageSrc: '/images/landing/landing-page-mission.png',
  imageAlt:
    'Professionals collaborating in an office around laptops and documents',
}

export interface LandingInstructor {
  name: string
  role: string
  imageSrc: string
  imageAlt: string
  rating: number
  studentCount: number
}

export const landingInstructors: LandingInstructor[] = [
  {
    name: 'Darrell Steward',
    role: 'Digital Product Designer',
    imageSrc: '/images/landing/landing-page-teacher-1.png',
    imageAlt: 'Portrait of Darrell Steward, instructor 1 of 5',
    rating: 4.9,
    studentCount: 454444,
  },
  {
    name: 'Jane Cooper',
    role: 'UI/UX Designer',
    imageSrc: '/images/landing/landing-page-teacher-2.png',
    imageAlt: 'Portrait of Jane Cooper, instructor 2 of 5',
    rating: 4.8,
    studentCount: 435671,
  },
  {
    name: 'Albert Flores',
    role: 'Adobe Instructor',
    imageSrc: '/images/landing/landing-page-teacher-3.png',
    imageAlt: 'Portrait of Albert Flores, instructor 3 of 5',
    rating: 4.7,
    studentCount: 511123,
  },
  {
    name: 'Darrell Steward',
    role: 'Digital Product Designer',
    imageSrc: '/images/landing/landing-page-teacher-4.png',
    imageAlt: 'Portrait of Darrell Steward, instructor 4 of 5',
    rating: 4.9,
    studentCount: 454444,
  },
  {
    name: 'Albert Flores',
    role: 'Adobe Instructor',
    imageSrc: '/images/landing/landing-page-teacher-5.png',
    imageAlt: 'Portrait of Albert Flores, instructor 5 of 5',
    rating: 4.7,
    studentCount: 511123,
  },
]

export const landingInstructorsCta = {
  lineLead:
    'Thousands of students are waiting for an instructor. Start teaching & earning now!',
  lineLinkText: 'Become Instructor',
  lineLinkTo: '/login' as const,
  button: { label: 'Become Instructor', to: '/login' as const },
}

export interface LandingFaqItem {
  id: string
  title: string
  content: string
}

export const landingFaqIntro = {
  title: 'Frequently Asked Questions',
  description:
    'Whether you are growing a Discord community, onboarding instructors, or scaling structured programs, these answers explain how our courses support server owners, admins, and members from day one.',
}

const faq1LoremParagraph =
  'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries'

export const landingFaqItems: LandingFaqItem[] = [
  {
    id: 'faq-1',
    title: 'What types of courses do you offer for Discord server owners?',
    content: `${faq1LoremParagraph}\n\n${faq1LoremParagraph}`,
  },
  {
    id: 'faq-2',
    title: 'How can I get started with your courses?',
    content:
      'Create a free account using Join Us or Sign In, then explore available programs for your goals. Pick a learning path that matches your server role, follow the onboarding steps, and begin the first module when you are ready. If your organization uses Sebayett through a server application, complete that flow first so the right courses unlock for your team.',
  },
  {
    id: 'faq-3',
    title: 'Do your courses cover advanced topics for experienced server owners?',
    content:
      'Yes. Content is structured so newer owners build foundations first, while experienced admins can skip ahead to deeper topics such as governance, engagement systems, instructor workflows, and scaling operations. Advanced material assumes you already run an active server and want sharper playbooks—not beginner-only basics.',
  },
  {
    id: 'faq-4',
    title: 'Are the courses live or pre-recorded?',
    content:
      'Programs use a mix depending on the track: core lessons are on-demand so you can learn on your schedule, while live sessions or office hours may be offered for Q&A and cohort milestones when a program includes them. Check each course overview for its format before you enroll.',
  },
  {
    id: 'faq-5',
    title: 'How long will it take to see results from the course content?',
    content:
      'Most server owners notice clearer processes within the first few weeks once they apply lessons consistently. Broader community outcomes—retention, event attendance, instructor quality—typically strengthen over one to three months as you iterate. Your pace depends on how often you ship changes from what you learn.',
  },
]

export const landingSectionTitles = {
  why: 'Why Choose Sebayett?',
  how: 'How Sebayett Works?',
  instructors: 'Top Instructor we have',
}
