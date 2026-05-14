<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import FormInput from '~/components/common/FormInput.vue'
import FormTextarea from '~/components/common/FormTextarea.vue'
import DatePicker from '@/components/common/DatePicker.vue'
import PublicSelectDropdown from '~/components/public/ui/PublicSelectDropdown.vue'
import PrimaryButton from '~/components/public/ui/PrimaryButton.vue'

definePageMeta({
  layout: 'public-app',
  public: true,
})

const runtimeConfig = useRuntimeConfig()

const siteUrl = computed(() =>
  String(runtimeConfig.public.siteUrl || '').replace(/\/$/, ''),
)

const canonicalHref = computed(() => `${siteUrl.value}/teacher-apply`)

const pageTitle = 'Apply as Teacher — Sebayett'
const pageDescription =
  'Apply to teach on Sebayett. Share your background and the subjects you want to teach.'

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
  dob: '',
  gender: '',
  expertise: '',
})

const errors = reactive({
  firstName: '',
  lastName: '',
  dob: '',
  gender: '',
  expertise: '',
})

const DOB_ERROR_ID = 'teacher-apply-dob-error'

function clearErrors() {
  errors.firstName = ''
  errors.lastName = ''
  errors.dob = ''
  errors.gender = ''
  errors.expertise = ''
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
  if (!form.dob.trim()) {
    errors.dob = 'Date of birth is required.'
    ok = false
  }
  if (!form.gender.trim()) {
    errors.gender = 'Please select a gender.'
    ok = false
  }
  if (!form.expertise.trim()) {
    errors.expertise = 'Please describe your expertise.'
    ok = false
  }
  else if (form.expertise.trim().length < 10) {
    errors.expertise = 'Please enter at least 10 characters.'
    ok = false
  }

  return ok
}

const genderItems = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
]

const dobPickerRef = ref<InstanceType<typeof DatePicker> | null>(null)
const genderDropdownRef = ref<InstanceType<typeof PublicSelectDropdown> | null>(
  null,
)

function onDobPickerOpened() {
  genderDropdownRef.value?.closePanel()
}

function onGenderDropdownOpened() {
  dobPickerRef.value?.closePanel()
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
          id="teacher-apply-heading"
          class="text-balance text-4xl font-bold tracking-tight text-neutral-900 leading-[1.1] sm:text-5xl sm:leading-[1.08] lg:leading-[1.05]"
        >
          <span class="block">Want To Apply As Teacher?</span>
          <span class="block">Fill Out Our Form</span>
        </h1>
      </header>

      <form
        class="mx-auto mt-10 w-full max-w-xl space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 sm:mt-12 sm:p-8"
        novalidate
        @submit.prevent="onSubmit"
      >
        <FormInput
          v-model="form.firstName"
          input-id="teacher-apply-first-name"
          label="First name:"
          placeholder="Enter your first name"
          :error-message="errors.firstName"
        />
        <FormInput
          v-model="form.lastName"
          input-id="teacher-apply-last-name"
          label="Last name:"
          placeholder="Enter your last name"
          :error-message="errors.lastName"
        />
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-600" for="teacher-apply-dob">
            Date of birth:
          </label>
          <DatePicker
            ref="dobPickerRef"
            v-model="form.dob"
            button-id="teacher-apply-dob"
            :invalid="!!errors.dob"
            :aria-describedby="errors.dob ? DOB_ERROR_ID : undefined"
            @opened="onDobPickerOpened"
          />
          <p
            v-if="errors.dob"
            :id="DOB_ERROR_ID"
            role="alert"
            class="text-sm text-red-600"
          >
            {{ errors.dob }}
          </p>
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-600" for="teacher-apply-gender">
            Gender:
          </label>
          <PublicSelectDropdown
            ref="genderDropdownRef"
            v-model="form.gender"
            :items="genderItems"
            trigger-id="teacher-apply-gender"
            listbox-id="teacher-apply-gender-listbox"
            placeholder="Select Gender"
            :error-message="errors.gender"
            @opened="onGenderDropdownOpened"
          />
        </div>
        <FormTextarea
          v-model="form.expertise"
          input-id="teacher-apply-expertise"
          label="Expertise:"
          :rows="4"
          placeholder="Tell us about the your skill and experties"
          :error-message="errors.expertise"
        />

        <PrimaryButton variant="primary" type="submit" class="w-full">
          Submit
        </PrimaryButton>
      </form>
    </div>
  </section>
</template>
