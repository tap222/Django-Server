export interface LessonScheduleSlot {
  day: string
  start: string
  end: string
}

export interface PublicLesson {
  id: string
  badge: string
  title: string
  description: string
  detailDescription: string
  schedule: LessonScheduleSlot[]
  availabilityFrom: string
  availabilityTo: string
  imageSrc: string
  imageAlt: string
  ctaLabel: string
  ctaTo?: string
}

export const lessonsPageSize = 9
export const lessonsHeading = 'Lessons'

const baseLessons: Omit<PublicLesson, 'id' | 'ctaTo'>[] = [
  {
    badge: 'History',
    title: 'The Roman Empire',
    description:
      "Learn about the rise, expansion, and fall of one of history's most influential civilizations.",
    detailDescription:
      'Learn about the rise, expansion, and fall of the Roman Empire and its impact on modern civilization.',
    schedule: [
      { day: 'Monday', start: '3:00 P.M.', end: '5:00 P.M.' },
      { day: 'Wednesday', start: '10:00 A.M.', end: '12:00 A.M.' },
      { day: 'Friday', start: '4:00 P.M.', end: '6:00 P.M.' },
    ],
    imageSrc:
      'https://images.unsplash.com/photo-1555993539-1732b0258235?auto=format&fit=crop&w=960&q=70',
    imageAlt: 'The Colosseum and ancient Roman architecture',
    ctaLabel: 'Check Availability',
    availabilityFrom: 'Oct. 28, 2025',
    availabilityTo: 'Dec. 31, 2025',
  },
  {
    badge: 'History',
    title: 'World War II Overview',
    description:
      'Understand the causes, major events, and lasting impact of the Second World War.',
    detailDescription:
      'Understand the causes, major events, and lasting impact of the Second World War through guided discussion and primary sources.',
    schedule: [
      { day: 'Tuesday', start: '2:00 P.M.', end: '4:00 P.M.' },
      { day: 'Thursday', start: '11:00 A.M.', end: '1:00 P.M.' },
      { day: 'Saturday', start: '9:00 A.M.', end: '11:00 A.M.' },
    ],
    imageSrc:
      'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=960&q=70',
    imageAlt: 'Vintage military aircraft on display',
    ctaLabel: 'Check Availability',
    availabilityFrom: 'Nov. 1, 2025',
    availabilityTo: 'Jan. 15, 2026',
  },
  {
    badge: 'Psychology',
    title: 'Human Behavior Basics',
    description:
      'Introduction to how humans think, feel, and act in everyday social contexts.',
    detailDescription:
      'Introduction to how humans think, feel, and act in everyday social contexts, with practical examples you can apply immediately.',
    schedule: [
      { day: 'Monday', start: '10:00 A.M.', end: '12:00 P.M.' },
      { day: 'Wednesday', start: '3:00 P.M.', end: '5:00 P.M.' },
      { day: 'Friday', start: '1:00 P.M.', end: '3:00 P.M.' },
    ],
    imageSrc:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=960&q=70',
    imageAlt: 'Person in a calm meditative pose indoors',
    ctaLabel: 'Check Availability',
    availabilityFrom: 'Nov. 5, 2025',
    availabilityTo: 'Feb. 28, 2026',
  },
  {
    badge: 'Psychology',
    title: 'Cognitive Psychology',
    description:
      'Study how the brain processes information, memory, attention, and problem-solving.',
    detailDescription:
      'Study how the brain processes information, memory, attention, and problem-solving with structured exercises and discussion.',
    schedule: [
      { day: 'Tuesday', start: '4:00 P.M.', end: '6:00 P.M.' },
      { day: 'Thursday', start: '10:00 A.M.', end: '12:00 P.M.' },
      { day: 'Sunday', start: '2:00 P.M.', end: '4:00 P.M.' },
    ],
    imageSrc:
      'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=960&q=70',
    imageAlt: 'Abstract representation of neural connections and thought',
    ctaLabel: 'Check Availability',
    availabilityFrom: 'Nov. 10, 2025',
    availabilityTo: 'Mar. 10, 2026',
  },
  {
    badge: 'Computer Science',
    title: 'Programming Fundamentals',
    description:
      'Learn the basics of coding, logic building, and writing your first programs.',
    detailDescription:
      'Learn the basics of coding, logic building, and writing your first programs in a supportive, hands-on environment.',
    schedule: [
      { day: 'Monday', start: '6:00 P.M.', end: '8:00 P.M.' },
      { day: 'Wednesday', start: '6:00 P.M.', end: '8:00 P.M.' },
      { day: 'Saturday', start: '10:00 A.M.', end: '12:00 P.M.' },
    ],
    imageSrc:
      'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=960&q=70',
    imageAlt: 'Laptop displaying source code on a desk',
    ctaLabel: 'Check Availability',
    availabilityFrom: 'Nov. 15, 2025',
    availabilityTo: 'Apr. 1, 2026',
  },
  {
    badge: 'Computer Science',
    title: 'Web Development Basics',
    description:
      'Introduction to building websites using HTML, CSS, and modern best practices.',
    detailDescription:
      'Introduction to building websites using HTML, CSS, and modern best practices, from structure to styling.',
    schedule: [
      { day: 'Tuesday', start: '5:00 P.M.', end: '7:00 P.M.' },
      { day: 'Thursday', start: '5:00 P.M.', end: '7:00 P.M.' },
      { day: 'Friday', start: '12:00 P.M.', end: '2:00 P.M.' },
    ],
    imageSrc:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=960&q=70',
    imageAlt: 'Developer workspace with laptop and coffee',
    ctaLabel: 'Check Availability',
    availabilityFrom: 'Dec. 1, 2025',
    availabilityTo: 'Apr. 30, 2026',
  },
  {
    badge: 'Math',
    title: 'Advanced Algebra',
    description:
      'Explore equations, functions, and algebraic structures with clear examples.',
    detailDescription:
      'Explore equations, functions, and algebraic structures with clear examples and plenty of practice.',
    schedule: [
      { day: 'Monday', start: '4:00 P.M.', end: '6:00 P.M.' },
      { day: 'Wednesday', start: '4:00 P.M.', end: '6:00 P.M.' },
      { day: 'Friday', start: '10:00 A.M.', end: '12:00 P.M.' },
    ],
    imageSrc:
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=960&q=70',
    imageAlt: 'Chalkboard with mathematical formulas and graphs',
    ctaLabel: 'Check Availability',
    availabilityFrom: 'Dec. 5, 2025',
    availabilityTo: 'May 15, 2026',
  },
  {
    badge: 'Math',
    title: 'Probability & Statistics',
    description:
      'Learn data analysis, probability concepts, and how to interpret real-world datasets.',
    detailDescription:
      'Learn data analysis, probability concepts, and how to interpret real-world datasets step by step.',
    schedule: [
      { day: 'Tuesday', start: '3:00 P.M.', end: '5:00 P.M.' },
      { day: 'Thursday', start: '3:00 P.M.', end: '5:00 P.M.' },
      { day: 'Saturday', start: '11:00 A.M.', end: '1:00 P.M.' },
    ],
    imageSrc:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=960&q=70',
    imageAlt: 'Charts and analytics on a computer screen',
    ctaLabel: 'Check Availability',
    availabilityFrom: 'Dec. 10, 2025',
    availabilityTo: 'Jun. 1, 2026',
  },
  {
    badge: 'Physics',
    title: 'Laws of Motion',
    description:
      "Understand Newton's laws and how forces shape movement in the physical world.",
    detailDescription:
      "Understand Newton's laws and how forces shape movement in the physical world with demos and problem sets.",
    schedule: [
      { day: 'Monday', start: '5:00 P.M.', end: '7:00 P.M.' },
      { day: 'Wednesday', start: '11:00 A.M.', end: '1:00 P.M.' },
      { day: 'Friday', start: '3:00 P.M.', end: '5:00 P.M.' },
    ],
    imageSrc:
      'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=960&q=70',
    imageAlt: 'Physics classroom equipment and motion experiments',
    ctaLabel: 'Check Availability',
    availabilityFrom: 'Jan. 6, 2026',
    availabilityTo: 'Jun. 30, 2026',
  },
]

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const totalPages = 4

export const lessonsList: PublicLesson[] = Array.from(
  { length: totalPages },
  (_, pageIdx) =>
    baseLessons.map((lesson) => {
      const id =
        pageIdx === 0
          ? slugify(lesson.title)
          : `${slugify(lesson.title)}-${pageIdx + 1}`
      return {
        ...lesson,
        id,
        ctaTo: `/lessons/${id}`,
      }
    }),
).flat()

export function findLessonById(id: string): PublicLesson | undefined {
  return lessonsList.find((l) => l.id === id)
}
