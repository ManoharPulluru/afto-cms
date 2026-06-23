/** True when rendered in the builder canvas or studio preview iframe */
export function isStudioRenderContext(ctx: {
  builderMode?: boolean
  previewInFrame?: boolean
}): boolean {
  return Boolean(ctx.builderMode || ctx.previewInFrame)
}
