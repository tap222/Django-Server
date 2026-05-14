import { ref } from 'vue'
import { groupService } from '@/services/groupService'
import type { GroupRow, UserRole } from '@/services/groupService'

export function useGroups() {
  const groups = ref<GroupRow[]>([])
  const loading = ref(false)
  const isDeleting = ref(false)

  async function fetchGroups() {
    loading.value = true
    try {
      groups.value = await groupService.getAll()
    } finally {
      loading.value = false
    }
  }

  async function deleteGroup(slug: string) {
    isDeleting.value = true
    try {
      await groupService.deleteGroup(slug)
      await fetchGroups()
    } finally {
      isDeleting.value = false
    }
  }

  return { groups, loading, isDeleting, fetchGroups, deleteGroup }
}

export function useGroupUsers(roleSlug: string) {
  const users = ref<UserRole[]>([])
  const loading = ref(false)

  async function fetchUsers() {
    loading.value = true
    try {
      users.value = await groupService.getUsersByRole(roleSlug)
    } finally {
      loading.value = false
    }
  }

  async function revokeRole(userId: number) {
    await groupService.revokeRole(userId, roleSlug)
    await fetchUsers()
  }

  return { users, loading, fetchUsers, revokeRole }
}
