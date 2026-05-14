/**
 * Public marketing site navigation and footer copy.
 * Adjust `to` / `href` values to match your real routes.
 */

export interface PublicNavItem {
  label: string
  to: string
}

export type PublicSocialIcon =
  | 'x'
  | 'instagram'
  | 'facebook'
  | 'youtube'

export interface PublicSocialLink {
  label: string
  href: string
  icon: PublicSocialIcon
}

/** Logo / home link */
export const publicBrand = {
  title: 'Sebayett',
  homePath: '/',
} as const

/** Primary navbar links */
export const publicMainNav: PublicNavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Server Apply', to: '/server-apply' },
  { label: 'Teacher Apply', to: '/teacher-apply' },
  { label: 'Events', to: '/events' },
  { label: 'Lessons', to: '/lessons' },
  { label: 'FAQs', to: '/faqs' },
]

/** Footer — Company column */
export const publicCompanyLinks: PublicNavItem[] = [
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Blogs', to: '/blogs' },
  { label: 'Contact', to: '/contact' },
]

/** Footer — Quick links */
export const publicQuickLinks: PublicNavItem[] = [
  { label: 'Server Apply', to: '/server-apply' },
  { label: 'Teacher Apply', to: '/teacher-apply' },
  { label: 'Events', to: '/events' },
  { label: 'Lessons', to: '/lessons' },
  { label: 'FAQs', to: '/faqs' },
]

export const publicFooterDescription =
  'Sebayett helps Discord communities run structured lessons and events—built for admins, instructors, and engaged members.'

export const publicSocialLinks: PublicSocialLink[] = [
  { label: 'X', href: 'https://x.com', icon: 'x' },
  { label: 'Instagram', href: 'https://instagram.com', icon: 'instagram' },
  { label: 'Facebook', href: 'https://facebook.com', icon: 'facebook' },
  { label: 'YouTube', href: 'https://youtube.com', icon: 'youtube' },
]
