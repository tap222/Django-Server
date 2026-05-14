import type { Component } from 'vue'
import type { AppRole } from '~/types/roles'
import NavIconBookOpen from '~/components/icons/NavIconBookOpen.vue'
import NavIconBot from '~/components/icons/NavIconBot.vue'
import NavIconCalendarDays from '~/components/icons/NavIconCalendarDays.vue'
import NavIconClock from '~/components/icons/NavIconClock.vue'
import NavIconGraduationCap from '~/components/icons/NavIconGraduationCap.vue'
import NavIconHardDrive from '~/components/icons/NavIconHardDrive.vue'
import NavIconLayoutDashboard from '~/components/icons/NavIconLayoutDashboard.vue'
import NavIconServer from '~/components/icons/NavIconServer.vue'
import NavIconSettings from '~/components/icons/NavIconSettings.vue'
import NavIconSun from '~/components/icons/NavIconSun.vue'
import NavIconTicket from '~/components/icons/NavIconTicket.vue'
import NavIconUserSquare2 from '~/components/icons/NavIconUserSquare2.vue'
import NavIconUsers from '~/components/icons/NavIconUsers.vue'

/** Sidebar row: presentation fields only (no role logic in UI). */
export interface NavItem {
  label: string
  to: string
  icon: Component
}

/** Central menu definition: visibility is `roles.includes(currentRole)`. */
export interface SidebarMenuItem extends NavItem {
  roles: AppRole[]
}

/**
 * Single source of truth for sidebar. Admin and teacher entries are disjoint
 * (same route may appear twice with different `roles` only when intentional; Settings uses separate rows).
 */
export const sidebarMenus: SidebarMenuItem[] = [
  // --- Teacher only ---
  { label: 'Dashboard', to: '/teacher/dashboard', icon: NavIconLayoutDashboard, roles: ['teacher'] },
  { label: 'Lessons', to: '/teacher/lessons', icon: NavIconBookOpen, roles: ['teacher'] },
  { label: 'Events', to: '/teacher/events', icon: NavIconCalendarDays, roles: ['teacher'] },
  { label: 'Pending Events', to: '/teacher/events/pending', icon: NavIconClock, roles: ['teacher'] },
  { label: 'Vacations', to: '/teacher/vacations', icon: NavIconSun, roles: ['teacher'] },
  { label: 'Settings', to: '/teacher/settings', icon: NavIconSettings, roles: ['teacher'] },
  // --- Admin only ---
  { label: 'Admin Dashboard', to: '/admin/dashboard', icon: NavIconLayoutDashboard, roles: ['admin'] },
  { label: 'Manage Groups', to: '/admin/groups', icon: NavIconUsers, roles: ['admin'] },
  { label: 'Server Applications', to: '/admin/server-applications', icon: NavIconServer, roles: ['admin'] },
  { label: 'Teacher Applications', to: '/admin/teacher-applications', icon: NavIconUserSquare2, roles: ['admin'] },
  { label: 'Discord Bots', to: '/admin/discord-bots', icon: NavIconBot, roles: ['admin'] },
  { label: 'Servers', to: '/admin/servers', icon: NavIconHardDrive, roles: ['admin'] },
  { label: 'Teachers', to: '/admin/teachers', icon: NavIconGraduationCap, roles: ['admin'] },
  { label: 'Events', to: '/admin/events', icon: NavIconCalendarDays, roles: ['admin'] },
  { label: 'Lessons', to: '/admin/lessons', icon: NavIconBookOpen, roles: ['admin'] },
  { label: 'Settings', to: '/admin/settings', icon: NavIconSettings, roles: ['admin'] },
  // --- Server only ---
  { label: 'Server Dashboard', to: '/server/dashboard', icon: NavIconLayoutDashboard, roles: ['server'] },
  { label: 'Events', to: '/server/events', icon: NavIconCalendarDays, roles: ['server'] },
  { label: 'Settings', to: '/server/settings', icon: NavIconSettings, roles: ['server'] },
  // --- Student only ---
  { label: 'Dashboard', to: '/student/dashboard', icon: NavIconLayoutDashboard, roles: ['student'] },
  { label: 'Tickets', to: '/student/tickets', icon: NavIconTicket, roles: ['student'] },
  { label: 'Settings', to: '/student/settings', icon: NavIconSettings, roles: ['student'] },
]
