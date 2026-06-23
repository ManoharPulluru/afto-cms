export function resolveHeroHeight(props: Record<string, unknown>, isMobile: boolean): string {
  const heightMode = (props.heightMode as string) || 'below-nav'
  const navOffsetDesktop = Number(props.navOffsetDesktop ?? 88)
  const navOffsetMobile = Number(props.navOffsetMobile ?? 58)
  const customHeightDesktop = Number(props.customHeightDesktop ?? 600)
  const customHeightMobile = Number(props.customHeightMobile ?? 480)

  if (heightMode === 'full-viewport') return '100vh'
  if (heightMode === 'custom') {
    return isMobile ? `${customHeightMobile}px` : `${customHeightDesktop}px`
  }
  const offset = isMobile ? navOffsetMobile : navOffsetDesktop
  return `calc(100vh - ${offset}px)`
}
