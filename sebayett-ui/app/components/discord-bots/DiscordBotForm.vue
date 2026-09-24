<script setup lang="ts">
import { nextTick, reactive, watch } from 'vue'
import FormInput from '@/components/common/FormInput.vue'
import { Dropdown } from '@/components/ui/dropdown'
import { discordBotService } from '@/services/discordBotService'
import type { BotFormData } from '@/services/discordBotService'
import { discordBotFieldErrors } from '@/utils/formValidation'
import type { DiscordBotFormShape } from '@/utils/formValidation'
import { useServerOptions } from '@/composables/useServerOptions'

interface Props {
  initialServer?: string
  /** Prefix for stable input ids (e.g. discord-bot-add vs discord-bot-edit) */
  fieldIdPrefix?: string
}

const props = withDefaults(defineProps<Props>(), {
  initialServer: '',
  fieldIdPrefix: 'discord-bot-add',
})

const emit = defineEmits<{
  submit: [data: BotFormData]
  success: []
}>()

const { options: serverOptions, idForLabel } = useServerOptions()

const form = reactive<DiscordBotFormShape>({
  server: props.initialServer,
  botId: '',
  token: '',
})

// Pre-select the first server once the list has loaded
watch(serverOptions, (options) => {
  if (!form.server && options[0]) form.server = options[0]
})

const errors = reactive({
  server: '',
  botId: '',
  token: '',
})

const id = {
  server: `${props.fieldIdPrefix}-server`,
  listbox: `${props.fieldIdPrefix}-server-listbox`,
  botId: `${props.fieldIdPrefix}-bot-id`,
  token: `${props.fieldIdPrefix}-token`,
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
  const order = [id.server, id.botId, id.token] as const
  const keys: (keyof typeof errors)[] = ['server', 'botId', 'token']
  for (let i = 0; i < keys.length; i++) {
    if (errors[keys[i]!]) {
      nextTick(() => document.getElementById(order[i]!)?.focus())
      break
    }
  }
  return !errors.server && !errors.botId && !errors.token
}

async function onSubmit() {
  if (!validate()) return
  const data: BotFormData = { serverId: idForLabel(form.server), botId: form.botId, token: form.token }
  try {
    await discordBotService.create(data)
    emit('submit', data)
    emit('success')

    form.botId = ''
    form.token = ''
    clearErrors()
  }
  catch (error) {
    // Show the server's validation messages (e.g. duplicate bot or token) on the fields
    const fieldErrors = apiFieldErrors(error)
    errors.server = fieldErrors.server ?? ''
    errors.botId = fieldErrors.botId ?? ''
    errors.token = fieldErrors.token ?? ''
    console.error('Failed to create Discord bot:', error)
  }
}
</script>

<template>
  <form class="space-y-6" novalidate @submit.prevent="onSubmit">
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-600" :for="id.server">Server:</label>
      <Dropdown
        :button-id="id.server"
        :listbox-id="id.listbox"
        :model-value="form.server"
        :options="serverOptions"
        width-class="w-full"
        :error-message="errors.server"
        @update:model-value="form.server = $event"
      />
    </div>

    <FormInput
      :input-id="id.botId"
      v-model="form.botId"
      label="Bot id"
      placeholder="Enter the id of the bot"
      :error-message="errors.botId"
    />

    <FormInput
      :input-id="id.token"
      v-model="form.token"
      label="Bot self token"
      placeholder="Enter the self-bot token"
      type="password"
      :error-message="errors.token"
    />

    <div class="flex justify-center pt-2">
      <button
        type="submit"
        class="inline-flex items-center justify-center rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-orange-600"
      >
        Add Bot
      </button>
    </div>
  </form>
</template>
