<script setup lang="ts">
import { computed, reactive } from 'vue'
import FormInput from '~/components/common/FormInput.vue'
import FormTextarea from '~/components/common/FormTextarea.vue'
import PrimaryButton from '~/components/public/ui/PrimaryButton.vue'

definePageMeta({
  layout: 'public-app',
  public: true,
})

const runtimeConfig = useRuntimeConfig()

const siteUrl = computed(() =>
  String(runtimeConfig.public.siteUrl || '').replace(/\/$/, ''),
)

const canonicalHref = computed(() => `${siteUrl.value}/server-apply`)

const pageTitle = 'Apply as Server — Sebayett'
const pageDescription =
  'Apply to bring your Discord server to Sebayett. Tell us about your community and we’ll be in touch.'

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogType: 'website',
  ogUrl: canonicalHref,
  twitterCard: 'summary_large_image',
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
})

useHead({
  htmlAttrs: { lang: 'en' },
  link: [{ rel: 'canonical', href: canonicalHref }],
})

const form = reactive({
  firstName: '',
  lastName: '',
  serverName: '',
  serverId: '',
  serverInterests: '',
  description: '',
})

const errors = reactive({
  firstName: '',
  lastName: '',
  serverName: '',
  serverId: '',
  serverInterests: '',
  description: '',
})

/** Typical Discord snowflake length (numeric string). */
const DISCORD_ID_RE = /^\d{17,20}$/

function clearErrors() {
  errors.firstName = ''
  errors.lastName = ''
  errors.serverName = ''
  errors.serverId = ''
  errors.serverInterests = ''
  errors.description = ''
}

function validate(): boolean {
  clearErrors()
  let ok = true

  if (!form.firstName.trim()) {
    errors.firstName = 'First name is required.'
    ok = false
  }
  if (!form.lastName.trim()) {
    errors.lastName = 'Last name is required.'
    ok = false
  }
  if (!form.serverName.trim()) {
    errors.serverName = "Server name is required."
    ok = false
  }
  const sid = form.serverId.trim()
  if (!sid) {
    errors.serverId = "Server ID is required."
    ok = false
  }
  else if (!DISCORD_ID_RE.test(sid)) {
    errors.serverId = 'Enter a valid numeric server ID (17–20 digits).'
    ok = false
  }
  if (!form.serverInterests.trim()) {
    errors.serverInterests = 'Server interests are required.'
    ok = false
  }
  else if (form.serverInterests.trim().length < 3) {
    errors.serverInterests = 'Please enter at least 3 characters.'
    ok = false
  }
  if (!form.description.trim()) {
    errors.description = 'Description is required.'
    ok = false
  }
  else if (form.description.trim().length < 10) {
    errors.description = 'Please enter at least 10 characters.'
    ok = false
  }

  return ok
}

function onSubmit() {
  if (!validate()) return
  // Static UI only — submit handling will be wired up later.
}
</script>

<template>
  <section
    class="relative overflow-hidden pb-20 pt-10 sm:pb-24 sm:pt-14 lg:pb-28 lg:pt-16"
  >
    <div class="relative mx-auto max-w-3xl px-3 sm:px-4 lg:px-6">
      <header class="text-center motion-safe:animate-fade-up">
        <h1
          id="server-apply-heading"
          class="text-4xl font-bold tracking-tight text-neutral-900 leading-[1.1] sm:text-5xl sm:leading-[1.08] lg:leading-[1.05]"
        >
          <span class="block">Want To Apply As Server?</span>
          <span class="block">Fill Out Our Form</span>
        </h1>
      </header>

      <form
        class="mx-auto mt-10 w-full max-w-xl space-y-3 rounded-2xl border border-brand/35 bg-brand/[0.07] rounded-lg bg-white p-6 sm:mt-12 sm:p-8"
        novalidate
        @submit.prevent="onSubmit"
      >
        <FormInput
          v-model="form.firstName"
          input-id="server-apply-first-name"
          label="First name:"
          placeholder="Enter your first name"
          :error-message="errors.firstName"
        />
        <FormInput
          v-model="form.lastName"
          input-id="server-apply-last-name"
          label="Last name:"
          placeholder="Enter your last name"
          :error-message="errors.lastName"
        />
        <FormInput
          v-model="form.serverName"
          input-id="server-apply-server-name"
          label="Server's name:"
          placeholder="Enter your server's name"
          :error-message="errors.serverName"
        />
        <FormInput
          v-model="form.serverId"
          input-id="server-apply-server-id"
          label="Server's ID:"
          placeholder="Enter your server's ID"
          :error-message="errors.serverId"
        />
        <FormInput
          v-model="form.serverInterests"
          input-id="server-apply-server-interests"
          label="Server interests:"
          placeholder="Enter your server interests"
          :error-message="errors.serverInterests"
        />

        <FormTextarea
          v-model="form.description"
          input-id="server-apply-description"
          label="Description:"
          :rows="4"
          placeholder="Write a short description about your server"
          :error-message="errors.description"
        />

        <PrimaryButton variant="primary" type="submit" class="w-full">
          Submit
        </PrimaryButton>
      </form>
    </div>
  </section>
</template>
