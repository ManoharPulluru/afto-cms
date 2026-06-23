/** Preview uses sticky headers; iframe / live site uses fixed viewport headers */
export function headerPositionClass(builderMode?: boolean, previewInFrame?: boolean): string {
  if (builderMode && !previewInFrame) {
    return 'sticky top-0 z-40 w-full'
  }
  return 'fixed inset-x-0 top-0 z-50 w-full pt-[env(safe-area-inset-top)]'
}

export function headerSpacerHeight(
  builderMode: boolean | undefined,
  previewInFrame: boolean | undefined,
  variant: 'grocery' | 'glass' | 'bistro',
): string | null {
  if (builderMode && !previewInFrame) return null
  if (variant === 'grocery') return 'h-[108px] lg:h-[68px]'
  if (variant === 'bistro') return 'h-[58px] lg:h-[88px]'
  return 'h-[56px] lg:h-[88px]'
}
