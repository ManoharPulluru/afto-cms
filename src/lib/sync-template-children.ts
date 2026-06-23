import type { PageNode } from '@/lib/types/store'
import type { WhatsAppTemplateDetail } from '@/lib/types/product-template'
import { mapTemplateProduct } from '@/lib/map-template-product'
import { normalizeProductCardVariant } from '@/lib/product-section-layout'

export function buildTemplateSectionChildren(
  template: WhatsAppTemplateDetail,
  productCardVariant: string,
): PageNode[] {
  const variant = normalizeProductCardVariant(productCardVariant)

  return [...template.sections]
    .sort((a, b) => a.serialNumber - b.serialNumber)
    .map((section) => ({
      id: `template-section-${section.id}`,
      type: 'templateSection',
      variant: 'TemplateSectionV1',
      label: section.title,
      props: {
        sectionId: section.id,
        title: section.title,
        productCardVariant: variant,
      },
      children: [...section.items]
        .sort((a, b) => a.serialNumber - b.serialNumber)
        .map((item) => {
          const mapped = mapTemplateProduct(item.product)
          return {
            id: `template-item-${item.id}`,
            type: 'productCard',
            variant,
            label: mapped.name,
            props: {
              productId: mapped.id,
              categoryLabel: mapped.categoryName ?? '',
              compareAtPrice: mapped.compareAtPrice,
            },
          } satisfies PageNode
        }),
    }))
}

export function collectTemplateIdsFromTree(nodes: PageNode[]): string[] {
  const ids = new Set<string>()

  function walk(list: PageNode[]) {
    for (const node of list) {
      if (node.type === 'productSection') {
        const templateId = node.props?.templateId as string | undefined
        if (templateId) ids.add(templateId)
      }
      if (node.children?.length) walk(node.children)
    }
  }

  walk(nodes)
  return [...ids]
}
