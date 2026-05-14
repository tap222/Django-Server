/**
 * Shared auth marketing modal open state (singleton via Nuxt useState).
 */
export function useAuthModal() {
  const authModalOpen = useState('auth-modal-open', () => false)

  function openAuthModal() {
    authModalOpen.value = true
  }

  return { authModalOpen, openAuthModal }
}
