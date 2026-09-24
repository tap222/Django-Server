<script setup lang="ts">
definePageMeta({ allowedRoles: ['admin'] })

import { nextTick, reactive } from 'vue'
import BackButton from '@/components/common/BackButton.vue'
import FormInput from '@/components/common/FormInput.vue'
import { Dropdown } from '@/components/ui/dropdown'
import { discordBotService } from '@/services/discordBotService'
import { discordBotFieldErrors } from '@/utils/formValidation'
import type { DiscordBotFormShape } from '@/utils/formValidation'
import { serverOptionLabel, useServerOptions } from '@/composables/useServerOptions'

const route = useRoute()
const rawId = route.params.botId
const botId = Array.isArray(rawId) ? rawId[0] : rawId
const decodedId = (() => { try { return decodeURIComponent(botId) } catch { return botId } })()

const { data } = await useAsyncData(`bot-edit-${decodedId}`, () => discordBotService.getById(decodedId))
const initialBot = data.value

const { options: serverOptions, idForLabel } = useServerOptions()
const router = useRouter()

const form = reactive<DiscordBotFormShape>({
  server: initialBot ? serverOptionLabel(initialBot.server, initialBot.serverId) : '',
  botId: initialBot?.botId ?? '',
  token: initialBot?.token ?? '',
})

const errors = reactive({
  server: '',
  botId: '',
  token: '',
})

const PREFIX = 'discord-bot-edit'
const fieldIds = {
  server: `${PREFIX}-server`,
  listbox: `${PREFIX}-server-listbox`,
  botId: `${PREFIX}-bot-id`,
  token: `${PREFIX}-token`,
}

function clearErrors() {
  errors.server = ''
  errors.botId = ''
  errors.token = ''
}

function validate(): boolean {
  clearErrors()
  const e = discordBotFieldErrors(form, serverOptions.value)
  errors.server = e.server
  errors.botId = e.botId
  errors.token = e.token
  const order = [fieldIds.server, fieldIds.botId, fieldIds.token] as const
  const keys: (keyof typeof errors)[] = ['server', 'botId', 'token']
  for (let i = 0; i < keys.length; i++) {
    if (errors[keys[i]!]) {
      nextTick(() => document.getElementById(order[i]!)?.focus())
      break
    }
  }
  return !errors.server && !errors.botId && !errors.token
}

async function onUpdate() {
  if (!validate()) return
  try {
    await discordBotService.update(decodedId, { serverId: idForLabel(form.server), botId: form.botId, token: form.token })
    await router.push('/admin/discord-bots')
  } catch (error) {
    const fieldErrors = apiFieldErrors(error)
    errors.server = fieldErrors.server ?? ''
    errors.botId = fieldErrors.botId ?? ''
    errors.token = fieldErrors.token ?? ''
  }
}
</script>

<template>
  <section>
    <template v-if="initialBot">
      <header class="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">Edit self-bot</h1>
        <BackButton />
      </header>

      <div class="mt-6 rounded-xl bg-white p-6 shadow-sm sm:p-8">
        <form class="space-y-6" novalidate @submit.prevent="onUpdate">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-600" :for="fieldIds.server">Server:</label>
            <Dropdown
              :button-id="fieldIds.server"
              :listbox-id="fieldIds.listbox"
              :model-value="form.server"
              :options="serverOptions"
              width-class="w-full"
              :error-message="errors.server"
              @update:model-value="form.server = $event"
            />
          </div>
          <FormInput
            :input-id="fieldIds.botId"
            v-model="form.botId"
            label="Bot id"
            placeholder="Enter the id of the bot"
            :error-message="errors.botId"
          />
          <FormInput
            :input-id="fieldIds.token"
            v-model="form.token"
            label="Bot self token"
            placeholder="Enter the self-bot token"
            type="password"
            :error-message="errors.token"
          />
          <div class="flex justify-center pt-2">
            <button type="submit" class="inline-flex items-center justify-center rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-orange-600">Update</button>
          </div>
        </form>
      </div>
    </template>

    <template v-else>
      <header class="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">Bot not found</h1>
        <BackButton />
      </header>
      <p class="text-sm text-gray-600">No bot matches this ID. Return to the list and try again.</p>
    </template>
  </section>
</template>
