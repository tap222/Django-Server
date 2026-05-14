<script setup lang="ts">
import { nextTick, reactive } from 'vue'
import FormInput from '@/components/common/FormInput.vue'
import { Dropdown } from '@/components/ui/dropdown'
import { discordBotService, AVAILABLE_SERVERS } from '@/services/discordBotService'
import type { BotFormData } from '@/services/discordBotService'
import { discordBotFieldErrors } from '@/utils/formValidation'

interface Props {
  initialServer?: string
  /** Prefix for stable input ids (e.g. discord-bot-add vs discord-bot-edit) */
  fieldIdPrefix?: string
}

const props = withDefaults(defineProps<Props>(), {
  initialServer: AVAILABLE_SERVERS[0] ?? '',
  fieldIdPrefix: 'discord-bot-add',
})

const emit = defineEmits<{
  submit: [data: BotFormData]
  success: []
}>()

const form = reactive<BotFormData>({
  server: props.initialServer,
  botId: '',
  token: '',
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
  const e = discordBotFieldErrors(form)
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
  try {
    await discordBotService.create(form)
    emit('submit', form)
    emit('success')

    form.botId = ''
    form.token = ''
    clearErrors()
  }
  catch (error) {
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
        :options="[...AVAILABLE_SERVERS]"
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
