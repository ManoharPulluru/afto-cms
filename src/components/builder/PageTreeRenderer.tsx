'use client'

import type { PageNode, StoreData } from '@/lib/types/store'
import type { VariantRenderContext } from '@/lib/registry/types'
import { getVariantComponent } from '@/lib/registry/render-map'
import { resolveNodeProps } from '@/lib/resolve-props'
import { BuilderNodeWrapper } from '@/components/builder/BuilderNodeWrapper'
import { CustomerAuthProvider } from '@/providers/CustomerAuthProvider'
import { CartDrawerProvider } from '@/providers/CartDrawerProvider'
import { OrderCartProvider } from '@/providers/OrderCartProvider'
import { CartDrawerLiveOverlay } from '@/components/cart/CartDrawerLiveOverlay'
import { ProductTemplateCatalogProvider } from '@/providers/ProductTemplateCatalogProvider'

type PageTreeRendererProps = {
  tree: PageNode[]
  store: StoreData
  ctx?: Partial<VariantRenderContext>
}

function renderNode(
  node: PageNode,
  store: StoreData,
  ctx: VariantRenderContext,
): React.ReactNode {
  if (node.props?.visible === false) {
    return null
  }

  const effectiveVariant = node.variant
  const Component = getVariantComponent(effectiveVariant)
  const resolvedProps = resolveNodeProps(node.type, node.props ?? {}, store, node)

  if (!Component) {
    return (
      <BuilderNodeWrapper
        key={`${node.id}-${effectiveVariant}`}
        node={{ ...node, variant: effectiveVariant }}
        builderMode={ctx.builderMode}
        selectedNodeId={ctx.selectedNodeId}
        hoveredNodeId={ctx.hoveredNodeId}
        onSelect={ctx.onSelectNode}
        onHover={ctx.onHoverNode}
      >
        <div className="border border-dashed border-red-300 p-4 text-sm text-red-600">
          Unknown variant: {effectiveVariant}
        </div>
      </BuilderNodeWrapper>
    )
  }

  const isHeader = node.type === 'header'
  const isHero = node.type === 'hero'
  const isCartDrawer = node.type === 'cartDrawer'
  const childElements = isHeader || isHero || isCartDrawer
    ? undefined
    : node.children?.map((child) => renderNode(child, store, ctx))

  return (
    <BuilderNodeWrapper
      key={`${node.id}-${effectiveVariant}`}
      node={{ ...node, variant: effectiveVariant }}
      builderMode={ctx.builderMode}
      selectedNodeId={ctx.selectedNodeId}
      hoveredNodeId={ctx.hoveredNodeId}
      onSelect={ctx.onSelectNode}
      onHover={ctx.onHoverNode}
    >
      <Component
        key={`cmp-${node.id}-${effectiveVariant}`}
        nodeId={node.id}
        props={resolvedProps}
        childNodes={isHeader || isHero || isCartDrawer ? node.children : undefined}
        ctx={{ ...ctx, store }}
      >
        {childElements}
      </Component>
    </BuilderNodeWrapper>
  )
}

export function PageTreeRenderer({ tree, store, ctx = {} }: PageTreeRendererProps) {
  const fullCtx: VariantRenderContext = {
    store,
    builderMode: false,
    selectedNodeId: null,
    hoveredNodeId: null,
    ...ctx,
  }

  return (
    <ProductTemplateCatalogProvider tree={tree} storeProducts={store.products}>
      <CustomerAuthProvider store={store}>
        <CartDrawerProvider store={store} pageTree={tree}>
          <OrderCartProvider>
            <div className="flex min-h-full min-w-0 flex-col overflow-x-hidden overflow-y-auto scrollbar-none">
              {tree.map((node) => renderNode(node, store, fullCtx))}
            </div>
            <CartDrawerLiveOverlay store={store} />
          </OrderCartProvider>
        </CartDrawerProvider>
      </CustomerAuthProvider>
    </ProductTemplateCatalogProvider>
  )
}
