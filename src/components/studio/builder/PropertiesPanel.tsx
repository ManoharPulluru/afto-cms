'use client'

import { useState } from 'react'
import type { PageNode } from '@/lib/types/store'
import type { PropField } from '@/lib/registry'
import { getVariantsForType, getVariantConfig, getComponentType } from '@/lib/registry'
import { getGroceryHeaderFields } from '@/lib/grocery-header-config'
import { getGlassHeaderFields } from '@/lib/glass-header-config'
import { getBistroHeaderFields } from '@/lib/bistro-header-config'
import { getHeaderVariantFields, getHeaderPropsForScheme, snapshotHeaderAppearance, stripHeaderMeta, type HeaderColorScheme } from '@/lib/header-variant-theme'
import type { StoreData } from '@/lib/types/store'
import { getHeaderPartLabels, isHeaderChildPropVisible, isHeaderChildVisible } from '@/lib/header-children'
import { getHeroFields } from '@/lib/hero-config'
import { getHeroPartLabelsForVariant } from '@/lib/hero-children'
import {
  getCartDrawerChildFields,
  getCartDrawerFieldGroups,
  getCartDrawerPartLabelsForVariant,
  getCartDrawerVariantLabel,
  isCartDrawerChildPropVisible,
} from '@/lib/cart-drawer-children-config'
import { getHeroVariantFields } from '@/lib/registry'
import { normalizeProductCardVariant } from '@/lib/product-section-layout'
import { getNodeLabel, getSectionVariantNode, findParentNode } from '@/lib/tree-utils'
import { getNodeTypeIcon } from '@/components/studio/builder/node-icons'
import { IconPickerModal } from '@/components/studio/builder/IconPickerModal'
import { MediaUploadField } from '@/components/studio/builder/MediaUploadField'
import { PanelChrome, SectionBlock, EmptyState } from '@/components/studio/builder/ui/PanelChrome'
import { StudioIcon } from '@/components/studio/builder/ui/StudioIcon'
import { ProductTemplatePicker } from '@/components/studio/builder/ProductTemplatePicker'
import type { WhatsAppTemplateListItem } from '@/lib/types/product-template'

type PropertiesPanelProps = {
  node: PageNode | null
  pageTree?: PageNode[]
  store?: StoreData
  onUpdateProps: (nodeId: string, props: Record<string, unknown>) => void
  onResetProps?: (nodeId: string) => void
  onChangeVariant: (nodeId: string, variant: string) => void
  onChangeProductCardVariant: (sectionNodeId: string, variant: string) => void
  onLinkProductTemplate: (
    sectionNodeId: string,
    template: WhatsAppTemplateListItem | null,
  ) => void
}

const inputClass =
  'w-full rounded-lg border border-zinc-700/80 bg-zinc-900/60 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 transition focus:border-teal-500/50 focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20'

export function PropertiesPanel({
  node,
  pageTree,
  store,
  onUpdateProps,
  onResetProps,
  onChangeVariant,
  onChangeProductCardVariant,
  onLinkProductTemplate,
}: PropertiesPanelProps) {
  if (!node) {
    return (
      <PanelChrome
        icon="solar:settings-minimalistic-bold-duotone"
        title="Properties"
        subtitle="Edit selected element"
        className="border-l border-zinc-800/80"
      >
        <EmptyState
          icon="solar:cursor-square-bold-duotone"
          title="Nothing selected"
          description="Click an element in the navigator or preview to edit its variants and properties."
        />
      </PanelChrome>
    )
  }

  const typeConfig = getComponentType(node.type)
  const variantConfig = getVariantConfig(node.type, node.variant)
  const props = node.props ?? {}
  const nodeIcon = getNodeTypeIcon(node.type)

  const variantHostNode = pageTree?.length ? getSectionVariantNode(node, pageTree) : node
  const variantHostType = getComponentType(variantHostNode.type)
  const variantHostVariants = getVariantsForType(variantHostNode.type)

  const parentNode = pageTree?.length ? findParentNode(pageTree, node.id) : null
  const productSectionNode =
    node.type === 'productSection'
      ? node
      : parentNode?.type === 'productSection'
        ? parentNode
        : null
  const productSectionProps = productSectionNode?.props ?? {}
  const activeProductCardVariant = normalizeProductCardVariant(
    (productSectionProps.productCardVariant as string) ||
      productSectionNode?.children?.find((c) => c.type === 'productCard')?.variant ||
      'ProductCardV4',
  )

  function setProp(key: string, value: unknown) {
    let next: Record<string, unknown> = { ...props, [key]: value }
    if (isHeaderRoot && store) {
      if (key === 'colorScheme') {
        next = getHeaderPropsForScheme(node!.variant, value as HeaderColorScheme, store)
      }
      const appearance = stripHeaderMeta(next)
      const appearanceByVariant = snapshotHeaderAppearance(
        { ...(node!.props ?? {}), ...appearance },
        node!.variant,
      )
      next = {
        ...appearance,
        appearanceByVariant,
        childrenByVariant: node!.props?.childrenByVariant,
      }
    }
    onUpdateProps(node!.id, next)
  }

  const headerVariant = variantHostNode.type === 'header' ? variantHostNode.variant : null
  const isHeaderRoot = node.type === 'header'
  const isHeaderChild = Boolean(headerVariant && parentNode?.type === 'header')
  const isHeroRoot = node.type === 'hero'
  const isHeroChild = parentNode?.type === 'hero'
  const isCartDrawerRoot = node.type === 'cartDrawer'
  const isCartDrawerChild = parentNode?.type === 'cartDrawer'
  const cartDrawerVariant =
    variantHostNode.type === 'cartDrawer' ? variantHostNode.variant : null

  function shouldShowField(fieldKey: string): boolean {
    if (isHeaderChild && headerVariant) {
      if (!isHeaderChildVisible(headerVariant, node!.type, node!)) return false
      if (!isHeaderChildPropVisible(headerVariant, node!.type, fieldKey)) return false
    }

    if (isCartDrawerChild && cartDrawerVariant) {
      if (!isCartDrawerChildPropVisible(cartDrawerVariant, node!.type, fieldKey)) return false
    }

    if (node!.type === 'account') {
      if (headerVariant === 'HeaderV1') {
        if (!Boolean(props.isLoggedIn)) {
          if (['userName', 'avatarUrl', 'avatarBg', 'avatarTextColor', 'nameColor', 'showAvatar'].includes(fieldKey)) {
            return false
          }
        } else {
          if (fieldKey === 'iconColor') return false
          if (!Boolean(props.showAvatar) && ['avatarUrl', 'avatarBg', 'avatarTextColor'].includes(fieldKey)) {
            return false
          }
        }
      } else {
        if (!Boolean(props.isLoggedIn) && (fieldKey === 'userName' || fieldKey === 'userEmail')) {
          return false
        }
        if (Boolean(props.isLoggedIn) && (fieldKey === 'welcomeLabel' || fieldKey === 'loginPrompt')) {
          return false
        }
      }
    }

    if (node!.type === 'heroMedia') {
      const mediaType = (props.mediaType as string) || 'image'
      if (mediaType === 'image' && fieldKey === 'videoUrl') return false
      if (mediaType === 'video' && fieldKey === 'imageUrl') return false
    }

    if (isHeroRoot) {
      const heightMode = (props.heightMode as string) || 'below-nav'
      if (heightMode !== 'below-nav' && (fieldKey === 'navOffsetDesktop' || fieldKey === 'navOffsetMobile')) {
        return false
      }
      if (heightMode !== 'custom' && (fieldKey === 'customHeightDesktop' || fieldKey === 'customHeightMobile')) {
        return false
      }
      if (fieldKey === 'featureDividerColor' && node!.variant !== 'HeroV4') return false
    }

    return true
  }

  const baseFields: PropField[] =
    isHeaderChild && headerVariant === 'HeaderV1'
      ? getGroceryHeaderFields(node.type)
      : isHeaderChild && headerVariant === 'HeaderV2'
        ? getGlassHeaderFields(node.type)
        : isHeaderChild && headerVariant === 'HeaderV3'
          ? getBistroHeaderFields(node.type)
          : isHeroChild
            ? getHeroFields(node.type)
            : isCartDrawerChild && cartDrawerVariant
              ? getCartDrawerChildFields(cartDrawerVariant, node.type)
              : isHeroRoot
              ? getHeroVariantFields(node.variant)
              : isHeaderRoot
                ? getHeaderVariantFields(node.variant)
                : variantConfig?.fields ?? []

  const appearanceFields = isHeaderRoot || isHeroRoot ? baseFields : []
  const contentFields = (isHeaderRoot || isHeroRoot ? [] : baseFields).filter((field) => {
    if (!shouldShowField(field.key)) return false
    if (node.type === 'heroMedia' && (field.key === 'imageUrl' || field.key === 'videoUrl')) return false
    if (node.type === 'heroLogo' && field.key === 'imageUrl') return false
    return true
  })
  const cartDrawerFieldGroups =
    isCartDrawerChild && cartDrawerVariant
      ? getCartDrawerFieldGroups(cartDrawerVariant, node.type)
      : []
  const cartDrawerFieldsByKey = Object.fromEntries(contentFields.map((f) => [f.key, f]))
  const hasEditableFields =
    appearanceFields.length > 0 ||
    contentFields.length > 0 ||
    cartDrawerFieldGroups.length > 0

  function handleReset() {
    if (!node || !onResetProps) return
    if (!confirm('Reset all properties for this element to their defaults?')) return
    onResetProps(node.id)
  }

  return (
    <PanelChrome
      icon="solar:tuning-square-2-bold-duotone"
      title={getNodeLabel(node)}
      subtitle={`${typeConfig?.label ?? node.type} · ${variantConfig?.label ?? node.variant}`}
      className="border-l border-zinc-800/80"
      action={
        <div className="flex items-center gap-1">
          {onResetProps && hasEditableFields && (
            <button
              type="button"
              onClick={handleReset}
              title="Reset properties to defaults"
              className="flex h-8 items-center gap-1.5 rounded-lg border border-zinc-700/80 bg-zinc-800/60 px-2.5 text-[11px] font-medium text-zinc-300 transition hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-200"
            >
              <StudioIcon icon="solar:restart-bold" width={14} height={14} />
              Reset
            </button>
          )}
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800/80 text-zinc-400 ring-1 ring-zinc-700/50">
            <StudioIcon icon={nodeIcon} width={16} height={16} />
          </span>
        </div>
      }
    >
      {variantHostVariants.length > 0 && (
        <VariantPicker
          label={
            variantHostNode.id !== node.id && variantHostType?.label
              ? `${variantHostType.label} variants`
              : variantHostVariants.length > 1
                ? 'Variants'
                : 'Variant'
          }
          variants={variantHostVariants}
          activeVariantId={variantHostNode.variant}
          onSelect={(variantId) => onChangeVariant(variantHostNode.id, variantId)}
        />
      )}

      {productSectionNode && (
        <SectionBlock label="Product Template" icon="solar:document-text-bold-duotone">
          <ProductTemplatePicker
            linkedTemplateId={productSectionProps.templateId as string | undefined}
            linkedTemplateName={productSectionProps.templateName as string | undefined}
            onLink={(template) => onLinkProductTemplate(productSectionNode.id, template)}
          />
        </SectionBlock>
      )}

      {productSectionNode && (
        <SectionBlock label="Product cards" icon="solar:bag-4-bold-duotone">
          <div className="grid gap-2">
            {getVariantsForType('productCard').map((v) => {
              const isActive = activeProductCardVariant === v.id
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => onChangeProductCardVariant(productSectionNode.id, v.id)}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all ${
                    isActive
                      ? 'border-teal-500/50 bg-teal-500/10 ring-1 ring-teal-500/30'
                      : 'border-zinc-800/80 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-800/40'
                  }`}
                >
                  <div
                    className="h-9 w-9 shrink-0 rounded-lg shadow-inner"
                    style={{ backgroundColor: v.previewColor ?? '#3f3f46' }}
                  />
                  <span className={`flex-1 text-sm font-medium ${isActive ? 'text-teal-200' : 'text-zinc-300'}`}>
                    {v.label}
                  </span>
                  {isActive && (
                    <StudioIcon icon="solar:check-circle-bold" width={16} height={16} className="text-teal-400" />
                  )}
                </button>
              )
            })}
          </div>
        </SectionBlock>
      )}

      {appearanceFields.length > 0 && (
        <SectionBlock label="Appearance" icon="solar:palette-bold-duotone">
          <div className="space-y-4">
            {appearanceFields.map((field) => (
              <PropFieldEditor
                key={field.key}
                field={field}
                value={props[field.key]}
                onChange={(value) => setProp(field.key, value)}
              />
            ))}
          </div>
        </SectionBlock>
      )}

      {variantHostNode.type === 'header' && !isHeaderRoot && (
        <SectionBlock label="Header parts" icon="solar:widget-add-bold-duotone">
          <p className="text-xs leading-relaxed text-zinc-500">
            Expand <span className="text-zinc-400">Header</span> in the navigator and select a part to edit it:{' '}
            {getHeaderPartLabels(variantHostNode.variant, variantHostNode.children).join(', ')}.
          </p>
        </SectionBlock>
      )}

      {variantHostNode.type === 'hero' && !isHeroRoot && (
        <SectionBlock label="Hero parts" icon="solar:widget-add-bold-duotone">
          <p className="text-xs leading-relaxed text-zinc-500">
            Expand <span className="text-zinc-400">Hero Media</span> in the navigator and select a part:{' '}
            {getHeroPartLabelsForVariant(variantHostNode.variant).join(', ')}.
          </p>
        </SectionBlock>
      )}

      {isCartDrawerChild && cartDrawerVariant && (
        <SectionBlock label={`${getCartDrawerVariantLabel(cartDrawerVariant)} drawer`} icon="solar:cart-large-2-bold-duotone">
          <p className="text-xs leading-relaxed text-zinc-500">
            The preview uses your live cart when logged in, or sample products otherwise. Use the{' '}
            <span className="text-zinc-400">Preview checkout step</span> bar above the drawer to
            switch between Cart, Details, Delivery, and Payment while editing.
          </p>
        </SectionBlock>
      )}

      {variantHostNode.type === 'cartDrawer' && !isCartDrawerRoot && (
        <SectionBlock label="Cart parts" icon="solar:widget-add-bold-duotone">
          <p className="text-xs leading-relaxed text-zinc-500">
            Expand <span className="text-zinc-400">Cart Drawer</span> in the navigator and select a part:{' '}
            {getCartDrawerPartLabelsForVariant(variantHostNode.variant).join(', ')}.
          </p>
        </SectionBlock>
      )}

      {isCartDrawerRoot && cartDrawerVariant && (
        <SectionBlock label="Cart parts" icon="solar:widget-add-bold-duotone">
          <p className="text-xs leading-relaxed text-zinc-500">
            Expand this section to customize each checkout step part for{' '}
            <span className="text-zinc-400">{getCartDrawerVariantLabel(cartDrawerVariant)}</span>:{' '}
            {getCartDrawerPartLabelsForVariant(cartDrawerVariant).join(', ')}.
          </p>
        </SectionBlock>
      )}

      {node.type === 'heroLogo' && (
        <SectionBlock label="Upload logo" icon="solar:gallery-add-bold-duotone">
          <MediaUploadField
            mediaKind="image"
            value={(props.imageUrl as string) ?? ''}
            onChange={(url) => setProp('imageUrl', url)}
          />
        </SectionBlock>
      )}

      {node.type === 'heroMedia' && (
        <SectionBlock
          label={(props.mediaType as string) === 'video' ? 'Upload video' : 'Upload image'}
          icon={
            (props.mediaType as string) === 'video'
              ? 'solar:videocamera-record-bold-duotone'
              : 'solar:gallery-add-bold-duotone'
          }
        >
          <MediaUploadField
            mediaKind={(props.mediaType as string) === 'video' ? 'video' : 'image'}
            value={
              ((props.mediaType as string) === 'video'
                ? (props.videoUrl as string)
                : (props.imageUrl as string)) ?? ''
            }
            onChange={(url) =>
              setProp((props.mediaType as string) === 'video' ? 'videoUrl' : 'imageUrl', url)
            }
          />
        </SectionBlock>
      )}

      {cartDrawerFieldGroups.length > 0 && (
        <>
          {cartDrawerFieldGroups.map((group) => (
            <SectionBlock key={group.label} label={group.label} icon="solar:pen-new-square-bold-duotone">
              <div className="space-y-4">
                {group.keys.map((key) => {
                  const field = cartDrawerFieldsByKey[key]
                  if (!field) return null
                  return (
                    <PropFieldEditor
                      key={field.key}
                      field={field}
                      value={props[field.key]}
                      onChange={(value) => setProp(field.key, value)}
                    />
                  )
                })}
              </div>
            </SectionBlock>
          ))}
        </>
      )}

      {!isCartDrawerChild && contentFields.length > 0 && (
        <SectionBlock label="Content" icon="solar:pen-new-square-bold-duotone">
          <div className="space-y-4">
            {contentFields.map((field) => (
              <PropFieldEditor
                key={field.key}
                field={field}
                value={props[field.key]}
                onChange={(value) => setProp(field.key, value)}
              />
            ))}
          </div>
        </SectionBlock>
      )}
    </PanelChrome>
  )
}

function PropFieldEditor({
  field,
  value,
  onChange,
}: {
  field: PropField
  value: unknown
  onChange: (value: unknown) => void
}) {
  const [iconPickerOpen, setIconPickerOpen] = useState(false)
  const inputClass =
    'w-full rounded-lg border border-zinc-700/80 bg-zinc-900/60 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 transition focus:border-teal-500/50 focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20'

  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-zinc-500">
        <StudioIcon icon={fieldIcon(field.type)} width={12} height={12} />
        {field.label}
      </label>
      {field.type === 'icon' ? (
        <>
          <button
            type="button"
            onClick={() => setIconPickerOpen(true)}
            className="flex w-full items-center gap-3 rounded-lg border border-zinc-700/80 bg-zinc-900/60 px-3 py-2.5 text-left transition hover:border-zinc-600 hover:bg-zinc-800/60"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800 text-zinc-300">
              <StudioIcon icon={(value as string) || 'solar:question-circle-linear'} width={20} height={20} />
            </span>
            <span className="min-w-0 flex-1 truncate text-sm text-zinc-300">
              {(value as string) || 'Choose icon…'}
            </span>
            <StudioIcon icon="solar:pallete-2-linear" width={16} height={16} className="text-zinc-500" />
          </button>
          <IconPickerModal
            open={iconPickerOpen}
            value={(value as string) || ''}
            onSelect={onChange}
            onClose={() => setIconPickerOpen(false)}
          />
        </>
      ) : field.type === 'select' ? (
        <div className="flex rounded-lg border border-zinc-800 bg-zinc-950/60 p-1">
          {(field.options ?? []).map((opt) => {
            const isActive = (value as string) === opt.value || (!value && opt.value === field.options?.[0]?.value)
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange(opt.value)}
                className={`flex-1 rounded-md px-2 py-2 text-[11px] font-medium leading-tight transition ${
                  isActive
                    ? 'bg-teal-500/20 text-teal-300 ring-1 ring-teal-500/40'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      ) : field.type === 'boolean' ? (
        field.key === 'applySchemeToContent' ? (
          <div className="flex rounded-lg border border-zinc-800 bg-zinc-950/60 p-1">
            <button
              type="button"
              onClick={() => onChange(false)}
              className={`flex-1 rounded-md px-3 py-2 text-xs font-medium transition ${
                value === false
                  ? 'bg-violet-500/20 text-violet-300 ring-1 ring-violet-500/40'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Custom parts
            </button>
            <button
              type="button"
              onClick={() => onChange(true)}
              className={`flex-1 rounded-md px-3 py-2 text-xs font-medium transition ${
                value !== false
                  ? 'bg-teal-500/20 text-teal-300 ring-1 ring-teal-500/40'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Sync with scheme
            </button>
          </div>
        ) : field.key === 'isLoggedIn' ? (
          <AuthStateToggle
            isLoggedIn={Boolean(value)}
            onLoggedOut={() => onChange(false)}
            onLoggedIn={() => onChange(true)}
          />
        ) : (
          <div className="flex rounded-lg border border-zinc-800 bg-zinc-950/60 p-1">
            <button
              type="button"
              onClick={() => onChange(false)}
              className={`flex-1 rounded-md px-3 py-2 text-xs font-medium transition ${
                (field.key === 'visible' || field.key === 'showAvatar' || field.key === 'showCount' || field.key === 'showTotal'
                  ? value === false
                  : !Boolean(value))
                  ? 'bg-violet-500/20 text-violet-300 ring-1 ring-violet-500/40'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {field.key === 'visible' ? 'Hidden' : field.key === 'showAvatar' ? 'No photo' : field.key === 'showCount' ? 'Hide badge' : field.key === 'showTotal' ? 'Text only' : 'Off'}
            </button>
            <button
              type="button"
              onClick={() => onChange(true)}
              className={`flex-1 rounded-md px-3 py-2 text-xs font-medium transition ${
                (field.key === 'visible' || field.key === 'showAvatar' || field.key === 'showCount' || field.key === 'showTotal'
                  ? value !== false
                  : Boolean(value))
                  ? 'bg-teal-500/20 text-teal-300 ring-1 ring-teal-500/40'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {field.key === 'visible' ? 'Visible' : field.key === 'showAvatar' ? 'With photo' : field.key === 'showCount' ? 'Show badge' : field.key === 'showTotal' ? 'Show price' : 'On'}
            </button>
          </div>
        )
      ) : field.type === 'color' ? (
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={(value as string) || '#ffffff'}
            onChange={(e) => onChange(e.target.value)}
            className="h-10 w-12 cursor-pointer rounded border border-zinc-700 bg-transparent"
          />
          <input
            type="text"
            value={(value as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
            placeholder="#FFFFFF"
          />
        </div>
      ) : field.type === 'textarea' ? (
        <textarea
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} min-h-[88px] resize-y`}
          placeholder={`Enter ${field.label.toLowerCase()}…`}
        />
      ) : field.type === 'categoryIds' ? (
        <input
          type="text"
          value={Array.isArray(value) ? (value as string[]).join(', ') : ''}
          onChange={(e) =>
            onChange(
              e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
            )
          }
          className={inputClass}
          placeholder="cat-1, cat-2"
        />
      ) : (
        <input
          type={field.type === 'number' ? 'number' : field.type === 'url' ? 'url' : 'text'}
          value={(value as string | number) ?? ''}
          onChange={(e) =>
            onChange(field.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)
          }
          className={inputClass}
          placeholder={`Enter ${field.label.toLowerCase()}…`}
        />
      )}
    </div>
  )
}

function VariantPicker({
  label,
  variants,
  activeVariantId,
  onSelect,
}: {
  label: string
  variants: ReturnType<typeof getVariantsForType>
  activeVariantId: string
  onSelect: (variantId: string) => void
}) {
  return (
    <SectionBlock label={label} icon="solar:pallete-2-bold-duotone">
      <div className="grid gap-2">
        {variants.map((v) => {
          const isActive = activeVariantId === v.id
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => onSelect(v.id)}
              className={`group flex items-center gap-3 rounded-xl border p-3 text-left transition-all duration-150 ${
                isActive
                  ? 'border-teal-500/50 bg-teal-500/10 shadow-sm shadow-teal-500/10 ring-1 ring-teal-500/30'
                  : 'border-zinc-800/80 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-800/40'
              }`}
            >
              <div
                className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg shadow-inner"
                style={{ backgroundColor: v.previewColor ?? '#3f3f46' }}
              >
                {isActive && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-teal-500 text-white shadow">
                    <StudioIcon icon="solar:check-read-linear" width={12} height={12} />
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className={`truncate text-sm font-medium ${isActive ? 'text-teal-200' : 'text-zinc-200'}`}>
                  {v.label}
                </p>
                <p className="truncate text-[11px] text-zinc-600">{v.id}</p>
              </div>
              <StudioIcon
                icon="solar:alt-arrow-right-linear"
                width={14}
                height={14}
                className={`shrink-0 transition ${isActive ? 'text-teal-400' : 'text-zinc-700 group-hover:text-zinc-500'}`}
              />
            </button>
          )
        })}
      </div>
    </SectionBlock>
  )
}

function AuthStateToggle({
  isLoggedIn,
  onLoggedOut,
  onLoggedIn,
}: {
  isLoggedIn: boolean
  onLoggedOut: () => void
  onLoggedIn: () => void
}) {
  return (
    <div className="flex rounded-lg border border-zinc-800 bg-zinc-950/60 p-1">
      <button
        type="button"
        onClick={onLoggedOut}
        className={`flex-1 rounded-md px-3 py-2 text-xs font-medium transition ${
          !isLoggedIn
            ? 'bg-violet-500/20 text-violet-300 ring-1 ring-violet-500/40'
            : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        Logged out
      </button>
      <button
        type="button"
        onClick={onLoggedIn}
        className={`flex-1 rounded-md px-3 py-2 text-xs font-medium transition ${
          isLoggedIn
            ? 'bg-teal-500/20 text-teal-300 ring-1 ring-teal-500/40'
            : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        Logged in
      </button>
    </div>
  )
}

function fieldIcon(type: string): string {
  switch (type) {
    case 'textarea':
      return 'solar:text-bold-duotone'
    case 'url':
      return 'solar:link-bold-duotone'
    case 'number':
      return 'solar:hashtag-bold-duotone'
    case 'boolean':
      return 'solar:toggle-on-bold-duotone'
    case 'color':
      return 'solar:palette-bold-duotone'
    case 'categoryIds':
      return 'solar:tag-bold-duotone'
    case 'icon':
      return 'solar:star-bold-duotone'
    case 'select':
      return 'solar:slider-vertical-bold-duotone'
    default:
      return 'solar:text-field-bold-duotone'
  }
}
