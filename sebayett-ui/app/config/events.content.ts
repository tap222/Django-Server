export interface PublicEvent {
  id: string
  badge: string
  title: string
  description: string
  date: string
  time: string
  imageSrc: string
  imageAlt: string
  ctaLabel: string
  ctaTo?: string
}

export const eventsPageSize = 9
export const eventsHeading = 'Events'

const baseEvents: Omit<PublicEvent, 'id' | 'ctaTo'>[] = [
  {
    badge: 'Tech Talks Hub',
    title: 'AI Innovation Summit',
    description:
      'Explore latest trends in artificial intelligence and real-world applications.',
    date: 'Nov 10, 2025',
    time: '3:00 p.m.',
    imageSrc:
      'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=960&q=70',
    imageAlt: 'Speaker presenting AI trends on stage',
    ctaLabel: 'Check it out',
  },
  {
    badge: 'Dev Community',
    title: 'Frontend Friday',
    description: 'Learn modern UI/UX and frontend frameworks with live demos.',
    date: 'Nov 14, 2025',
    time: '5:00 p.m.',
    imageSrc:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=960&q=70',
    imageAlt: 'Developer working on a laptop with code on screen',
    ctaLabel: 'Check it out',
  },
  {
    badge: 'Cyber Circle',
    title: 'Ethical Hacking Basics',
    description:
      'Introduction to cybersecurity, threats, and ethical hacking practices.',
    date: 'Nov 18, 2025',
    time: '6:00 p.m.',
    imageSrc:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=960&q=70',
    imageAlt: 'Cybersecurity workspace with circuit board imagery',
    ctaLabel: 'Check it out',
  },
  {
    badge: 'Startup Connect',
    title: 'Startup Pitch Night',
    description: 'Present your startup ideas and get feedback from experts.',
    date: 'Nov 22, 2025',
    time: '7:00 p.m.',
    imageSrc:
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=960&q=70',
    imageAlt: 'Founders presenting business ideas to a small group',
    ctaLabel: 'Check it out',
  },
  {
    badge: 'Learning Space',
    title: 'Productivity Masterclass',
    description: 'Learn time management and productivity hacks for daily success.',
    date: 'Nov 25, 2025',
    time: '11:00 a.m.',
    imageSrc:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=960&q=70',
    imageAlt: 'Team collaborating around a table during a workshop',
    ctaLabel: 'Check it out',
  },
  {
    badge: 'Code Masters',
    title: 'JavaScript Deep Dive',
    description:
      'Advanced concepts of JavaScript including closures and async programming.',
    date: 'Nov 28, 2025',
    time: '4:30 p.m.',
    imageSrc:
      'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=960&q=70',
    imageAlt: 'Code editor with JavaScript on a dark theme',
    ctaLabel: 'Check it out',
  },
  {
    badge: 'Design Studio',
    title: 'UI/UX Design Workshop',
    description:
      'Hands-on session on creating modern and user-friendly interfaces.',
    date: 'Dec 02, 2025',
    time: '2:00 p.m.',
    imageSrc:
      'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=960&q=70',
    imageAlt: 'Designer sketching wireframes on paper next to a tablet',
    ctaLabel: 'Check it out',
  },
  {
    badge: 'Data Wizards',
    title: 'Data Analytics Bootcamp',
    description:
      'Learn data visualization and analytics using real datasets.',
    date: 'Dec 06, 2025',
    time: '10:00 a.m.',
    imageSrc:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=960&q=70',
    imageAlt: 'Analyst reviewing dashboards on a laptop',
    ctaLabel: 'Check it out',
  },
  {
    badge: 'Career Hub',
    title: 'Resume Building Session',
    description:
      'Improve your resume and prepare for job interviews effectively.',
    date: 'Dec 10, 2025',
    time: '1:00 p.m.',
    imageSrc:
      'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=960&q=70',
    imageAlt: 'Person preparing a resume document at a desk',
    ctaLabel: 'Check it out',
  },
]

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const totalPages = 4

export const eventsList: PublicEvent[] = Array.from(
  { length: totalPages },
  (_, pageIdx) =>
    baseEvents.map((evt) => {
      const id =
        pageIdx === 0
          ? slugify(evt.title)
          : `${slugify(evt.title)}-${pageIdx + 1}`
      return {
        ...evt,
        id,
        ctaTo: `/events/${id}`,
      }
    }),
).flat()

export function findEventById(id: string): PublicEvent | undefined {
  return eventsList.find((e) => e.id === id)
}
