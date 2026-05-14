import { computed } from 'vue'
import { sidebarMenus } from '~/config/navigation'
import type { NavItem } from '~/config/navigation'

/**
 * Role-filtered sidebar items for layout → Sidebar (`items` prop).
 */
export function useSidebarMenus() {
  const { role } = useRole()

  const filteredMenus = computed(() =>
    sidebarMenus.filter((item) => item.roles.includes(role.value)),
  )

  /** `NavItem` shape for presentation-only sidebar. */
  const navItems = computed<NavItem[]>(() =>
    filteredMenus.value.map(({ label, to, icon }) => ({ label, to, icon })),
  )

  return { filteredMenus, navItems }
}
