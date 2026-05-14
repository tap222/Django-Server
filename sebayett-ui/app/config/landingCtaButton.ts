/**
 * Shared Tailwind classes for marketing CTAs (hero “Join Us” and matching variants).
 * Keep literals intact for Tailwind JIT.
 */
export const LANDING_CTA_PRIMARY_CLASSES =
  'w-full min-w-[8.5rem] !rounded-[10px] border-0 !bg-orange-500 px-5 py-2.5 text-lg !font-semibold !text-white transition [transition-property:color,background-color,box-shadow,transform] hover:!bg-orange-600 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(249,115,22,0.4)] active:translate-y-0 sm:w-auto'

export const LANDING_CTA_SECONDARY_CLASSES =
  'w-full min-w-[8.5rem] !rounded-[10px] border-2 !border-orange-500 !bg-transparent px-5 py-2.5 text-lg !font-semibold !text-orange-500 shadow-none transition [transition-property:color,background-color,box-shadow,transform] hover:!bg-orange-50 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(249,115,22,0.28)] active:translate-y-0 sm:w-auto'

/** Smaller primary CTA for landing header Sign In (same look as hero, tighter scale). */
export const LANDING_CTA_HEADER_PRIMARY_CLASSES =
  'shrink-0 whitespace-nowrap !rounded-[10px] border-0 !bg-orange-500 px-4 py-2 text-sm !font-semibold !leading-none !text-white transition [transition-property:color,background-color,box-shadow,transform] hover:!bg-orange-600 hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(249,115,22,0.35)] active:translate-y-0'
