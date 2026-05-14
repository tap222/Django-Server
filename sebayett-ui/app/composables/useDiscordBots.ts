import { ref } from 'vue'
import { discordBotService } from '@/services/discordBotService'
import type { BotRow } from '@/services/discordBotService'

export function useDiscordBots() {
  const bots = ref<BotRow[]>([])
  const loading = ref(false)
  const isDeleting = ref(false)

  async function fetchBots() {
    loading.value = true
    try {
      bots.value = await discordBotService.getAll()
    } finally {
      loading.value = false
    }
  }

  async function deleteBot(id: string) {
    isDeleting.value = true
    try {
      await discordBotService.deleteBot(id)
      await fetchBots()
    } finally {
      isDeleting.value = false
    }
  }

  return { bots, loading, isDeleting, fetchBots, deleteBot }
}
