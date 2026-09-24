import { computed, onMounted, ref } from 'vue'
import { serverService } from '@/services/serverService'
import type { ServerRow } from '@/services/serverService'

/** Label shown in server pickers; includes the ID because server names aren't unique. */
export const serverOptionLabel = (name: string, id: string) => `${name} (${id})`

/** Servers for a dropdown: string labels in, server IDs out. */
export function useServerOptions() {
  const servers = ref<ServerRow[]>([])

  const options = computed(() => servers.value.map((s) => serverOptionLabel(s.serverName, s.serverId)))

  function idForLabel(label: string): string {
    return servers.value.find((s) => serverOptionLabel(s.serverName, s.serverId) === label)?.serverId ?? ''
  }

  const ready = ref(false)
  onMounted(async () => {
    servers.value = await serverService.getAll()
    ready.value = true
  })

  return { options, idForLabel, ready }
}
