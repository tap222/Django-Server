export function useStatus() {
  function getStatusColorClass(status: string | undefined): string {
    if (!status) return 'bg-gray-50 text-gray-500 border-gray-100'
    
    switch (status.toLowerCase()) {
      case 'active':
      case 'completed':
      case 'accepted':
      case 'confirmed':
        return 'bg-[#E6F6F1] text-[#19B77E] border-[#19B77E]/10'
      case 'pending':
      case 'upcoming':
        return 'bg-[#FFF4ED] text-[#F76B00] border-[#F76B00]/10'
      case 'cancel':
      case 'rejected':
      case 'refused':
        return 'bg-[#FEF2F2] text-[#EF4444] border-[#EF4444]/10'
      case 'ongoing':
        return 'bg-[#EBF2FF] text-[#3B82F6] border-[#3B82F6]/10'
      default:
        return 'bg-gray-50 text-gray-500 border-gray-100'
    }
  }

  function capitalize(text: string | undefined): string {
    if (!text) return ''
    return text.charAt(0).toUpperCase() + text.slice(1)
  }

  return { getStatusColorClass, capitalize }
}
