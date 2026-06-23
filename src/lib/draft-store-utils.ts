import type { PageNode, StoreData } from '@/lib/types/store'
import type { WhatsAppTemplateDetail } from '@/lib/types/product-template'
import { updateNodeInTree } from '@/lib/tree-utils'
import { buildTemplateSectionChildren } from '@/lib/sync-template-children'

/** Remove template link props without leaving undefined keys in JSON. */
export function clearProductTemplateLinkProps(
  props: Record<string, unknown> | undefined,
): Record<string, unknown> {
  if (!props) return {}
  const { templateId: _id, templateName: _name, ...rest } = props
  return rest
}

export function applyProductTemplateLink(
  store: StoreData,
  pageId: string,
  sectionNodeId: string,
  input:
    | { action: 'unlink' }
    | {
        action: 'link'
        templateId: string
        templateName: string
        headerText?: string
        detail: WhatsAppTemplateDetail
        productCardVariant: string
      },
): StoreData {
  return {
    ...store,
    pages: store.pages.map((page) => {
      if (page.id !== pageId) return page
      return {
        ...page,
        tree: updateNodeInTree(page.tree ?? [], sectionNodeId, (node) => {
          if (input.action === 'unlink') {
            return {
              ...node,
              props: clearProductTemplateLinkProps(node.props),
              children: [],
            }
          }

          return {
            ...node,
            label: input.templateName,
            props: {
              ...clearProductTemplateLinkProps(node.props),
              templateId: input.templateId,
              templateName: input.templateName,
              title:
                (node.props?.title as string) ||
                input.headerText ||
                input.templateName,
            },
            children: buildTemplateSectionChildren(input.detail, input.productCardVariant),
          }
        }),
      }
    }),
  }
}

export function collectProductTemplateIds(store: StoreData): string[] {
  const ids = new Set<string>()

  function walk(nodes: PageNode[]) {
    for (const node of nodes) {
      if (node.type === 'productSection') {
        const templateId = node.props?.templateId as string | undefined
        if (templateId) ids.add(templateId)
      }
      if (node.children?.length) walk(node.children)
    }
  }

  for (const page of store.pages) {
    if (page.tree?.length) walk(page.tree)
  }

  return [...ids]
}

/** Compare template links between published and draft stores. */
export function productTemplatesDiffer(published: StoreData, draft: StoreData): boolean {
  const pub = collectProductTemplateIds(published).sort().join(',')
  const drf = collectProductTemplateIds(draft).sort().join(',')
  return pub !== drf
}
