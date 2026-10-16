import React from 'react'

export type HeadingScale =
  | 'display'
  | 'heading-lg'
  | 'keyword-rotator'
  | 'heading'
  | 'heading-sm'
  | 'subheading'
  | 'subheading-sm'
  | 'subheading-medium'

export type Tone =
  | 'white'
  | 'white-75'
  | 'white-70'
  | 'obsidian'
  | 'graphite'
  | 'smoke'
  | 'silhouette'
  | 'forest'

const HEADING_SCALE_CLASS: Record<HeadingScale, string> = {
  display: 'ds-type-display',
  'heading-lg': 'ds-type-heading-lg',
  'keyword-rotator': 'ds-type-keyword-rotator',
  heading: 'ds-type-heading',
  'heading-sm': 'ds-type-heading-sm',
  subheading: 'ds-type-subheading',
  'subheading-sm': 'ds-type-subheading-sm',
  'subheading-medium': 'ds-type-subheading-medium',
}

const TONE_CLASS: Record<Tone, string> = {
  white: 'ds-text-white',
  'white-75': 'ds-text-white-75',
  'white-70': 'ds-text-white-70',
  obsidian: 'ds-text-obsidian',
  graphite: 'ds-text-graphite',
  smoke: 'ds-text-smoke',
  silhouette: 'ds-text-silhouette',
  forest: 'ds-text-forest',
}

export interface HeadingProps {
  level?: 1 | 2 | 3 | 4
  scale?: HeadingScale
  tone?: Tone
  className?: string
  children: React.ReactNode
}

export function Heading({
  level = 2,
  scale = 'heading',
  tone = 'obsidian',
  className = '',
  children,
}: HeadingProps) {
  const tag = `h${level}`
  const classes = `${HEADING_SCALE_CLASS[scale]} ${TONE_CLASS[tone]} m-0 ${className}`.trim()
  return React.createElement(tag, { className: classes }, children)
}

export type TextScale =
  | 'body'
  | 'body-sm'
  | 'body-sm-medium'
  | 'caption'
  | 'wordmark'

const TEXT_SCALE_CLASS: Record<TextScale, string> = {
  body: 'ds-type-body',
  'body-sm': 'ds-type-body-sm',
  'body-sm-medium': 'ds-type-body-sm-medium',
  caption: 'ds-type-caption',
  wordmark: 'ds-type-wordmark',
}

export interface TextProps {
  as?: 'p' | 'span' | 'div'
  scale?: TextScale
  tone?: Tone
  className?: string
  children: React.ReactNode
}

export function Text({
  as = 'p',
  scale = 'body-sm',
  tone = 'graphite',
  className = '',
  children,
}: TextProps) {
  const classes = `${TEXT_SCALE_CLASS[scale]} ${TONE_CLASS[tone]} m-0 ${className}`.trim()
  return React.createElement(as, { className: classes }, children)
}

export interface MonoLabelProps {
  tone?: Tone
  className?: string
  children: React.ReactNode
}

export function MonoLabel({
  tone = 'graphite',
  className = '',
  children,
}: MonoLabelProps) {
  return (
    <span className={`ds-type-micro-label ${TONE_CLASS[tone]} inline-block ${className}`.trim()}>
      {children}
    </span>
  )
}

export function MonoNote({
  tone = 'white',
  className = '',
  children,
}: MonoLabelProps) {
  return (
    <span className={`ds-type-mono-note ${TONE_CLASS[tone]} inline-block ${className}`.trim()}>
      {children}
    </span>
  )
}

export interface TagPillProps {
  variant?: 'hero-dark' | 'dark-outline' | 'light-surface' | 'panel-subtle'
  className?: string
  children: React.ReactNode
}

export function TagPill({
  variant = 'hero-dark',
  className = '',
  children,
}: TagPillProps) {
  const variantStyles: Record<NonNullable<TagPillProps['variant']>, string> = {
    'hero-dark': 'ds-border-white-25 ds-text-white',
    'dark-outline': 'ds-border-charcoal ds-text-smoke',
    'light-surface': 'ds-surface-soft-mist ds-text-graphite',
    'panel-subtle': 'ds-border-white-25 ds-text-white',
  }
  return (
    <div
      className={`ds-radius-tag ds-pill-pad ds-type-micro-label inline-flex items-center ds-gap-8 ${variantStyles[variant]} ${className}`.trim()}
    >
      {children}
    </div>
  )
}

export type ButtonVariant =
  | 'nav-outline-dark'
  | 'nav-outline-light'
  | 'nav-primary-dark'
  | 'nav-primary-light'
  | 'hero-primary'
  | 'hero-secondary'
  | 'surface-charcoal'
  | 'surface-outline-light'
  | 'forest-cta'

const BUTTON_VARIANT_CLASS: Record<ButtonVariant, string> = {
  'nav-outline-dark': 'ds-btn-nav-outline ds-type-body-sm',
  'nav-outline-light': 'ds-btn-nav-outline-light ds-type-body-sm',
  'nav-primary-dark': 'ds-btn-nav-primary-dark ds-type-body-sm',
  'nav-primary-light': 'ds-btn-nav-primary-light ds-type-body-sm',
  'hero-primary': 'ds-btn-hero-primary ds-type-body-sm',
  'hero-secondary': 'ds-btn-hero-secondary ds-type-body-sm',
  'surface-charcoal': 'ds-btn-nav-primary-light ds-type-body-sm',
  'surface-outline-light': 'ds-btn-nav-outline-light ds-type-body-sm',
  'forest-cta': 'ds-btn-forest-cta',
}

export interface ActionButtonProps {
  variant?: ButtonVariant
  onClick?: () => void
  type?: 'button' | 'submit'
  className?: string
  ariaLabel?: string
  children: React.ReactNode
}

export function ActionButton({
  variant = 'hero-primary',
  onClick,
  type = 'button',
  className = '',
  ariaLabel,
  children,
}: ActionButtonProps) {
  return React.createElement(
    'button',
    {
      type,
      onClick,
      'aria-label': ariaLabel,
      className: `${BUTTON_VARIANT_CLASS[variant]} cursor-pointer inline-flex items-center justify-center ds-gap-8 ${className}`.trim(),
    },
    children
  )
}

export interface GhostNavButtonProps {
  onClick?: () => void
  tone?: Tone
  active?: boolean
  className?: string
  children: React.ReactNode
}

export function GhostNavButton({
  onClick,
  tone = 'white',
  active = false,
  className = '',
  children,
}: GhostNavButtonProps) {
  return React.createElement(
    'button',
    {
      type: 'button',
      onClick,
      className: `ds-type-body-sm ${TONE_CLASS[tone]} bg-transparent border-0 p-0 cursor-pointer transition-opacity duration-200 ${
        active ? 'opacity-100' : 'opacity-80 hover:opacity-100'
      } ${className}`.trim(),
    },
    children
  )
}

export interface InteractiveTriggerProps {
  onClick?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  className?: string
  ariaLabel?: string
  children: React.ReactNode
}

export function InteractiveTrigger({
  onClick,
  onMouseEnter,
  onMouseLeave,
  className = '',
  ariaLabel,
  children,
}: InteractiveTriggerProps) {
  return React.createElement(
    'button',
    {
      type: 'button',
      onClick,
      onMouseEnter,
      onMouseLeave,
      'aria-label': ariaLabel,
      className: `bg-transparent border-0 p-0 text-left cursor-pointer ${className}`.trim(),
    },
    children
  )
}

export interface SquareIconButtonProps {
  variant?: 'hero-dark' | 'carousel-light' | 'modal-close'
  onClick?: () => void
  ariaLabel: string
  className?: string
  children: React.ReactNode
}

export function SquareIconButton({
  variant = 'carousel-light',
  onClick,
  ariaLabel,
  className = '',
  children,
}: SquareIconButtonProps) {
  const styles: Record<NonNullable<SquareIconButtonProps['variant']>, string> = {
    'hero-dark':
      'ds-square-40 ds-radius-button ds-border-white ds-text-white bg-transparent hover:opacity-80',
    'carousel-light':
      'ds-square-40 ds-radius-button ds-border-obsidian ds-surface-canvas ds-text-obsidian hover:opacity-75',
    'modal-close':
      'ds-square-40 ds-radius-button ds-border-silhouette ds-surface-soft-mist ds-text-obsidian hover:opacity-80',
  }
  return React.createElement(
    'button',
    {
      type: 'button',
      onClick,
      'aria-label': ariaLabel,
      className: `${styles[variant]} inline-flex items-center justify-center cursor-pointer transition-opacity duration-200 ${className}`.trim(),
    },
    children
  )
}

export interface FlatCardProps {
  surface?: 'canvas' | 'soft-mist' | 'pale-stone' | 'obsidian' | 'charcoal'
  className?: string
  children: React.ReactNode
}

const CARD_SURFACE_MAP: Record<NonNullable<FlatCardProps['surface']>, string> = {
  canvas: 'ds-surface-canvas',
  'soft-mist': 'ds-surface-soft-mist',
  'pale-stone': 'ds-surface-pale-stone',
  obsidian: 'ds-surface-obsidian',
  charcoal: 'ds-surface-charcoal',
}

export function FlatCard({
  surface = 'canvas',
  className = '',
  children,
}: FlatCardProps) {
  return (
    <div className={`${CARD_SURFACE_MAP[surface]} ds-radius-card ds-card-pad ${className}`.trim()}>
      {children}
    </div>
  )
}

export interface NestedCardProps {
  surface?: 'canvas' | 'soft-mist' | 'bone' | 'charcoal' | 'obsidian'
  className?: string
  children: React.ReactNode
}

const NESTED_SURFACE_MAP: Record<NonNullable<NestedCardProps['surface']>, string> = {
  canvas: 'ds-surface-canvas',
  'soft-mist': 'ds-surface-soft-mist',
  bone: 'ds-surface-bone',
  charcoal: 'ds-surface-charcoal',
  obsidian: 'ds-surface-obsidian',
}

export function NestedCard({
  surface = 'canvas',
  className = '',
  children,
}: NestedCardProps) {
  return (
    <div className={`${NESTED_SURFACE_MAP[surface]} ds-radius-nested ds-nested-pad ${className}`.trim()}>
      {children}
    </div>
  )
}

export interface AccentPanelProps {
  wash: 'forest' | 'iris' | 'slate' | 'sandstone'
  className?: string
  children: React.ReactNode
}

const WASH_MAP: Record<AccentPanelProps['wash'], string> = {
  forest: 'ds-surface-forest ds-text-white',
  iris: 'ds-surface-iris ds-text-white',
  slate: 'ds-surface-slate ds-text-obsidian',
  sandstone: 'ds-surface-sandstone ds-text-obsidian',
}

export function AccentPanel({ wash, className = '', children }: AccentPanelProps) {
  return (
    <div className={`${WASH_MAP[wash]} ds-radius-panel ds-panel-pad flex flex-col justify-between ${className}`.trim()}>
      {children}
    </div>
  )
}

export interface SectionHeaderStackProps {
  eyebrow?: string
  headline: string
  tone?: 'light' | 'dark'
  className?: string
  rightAction?: React.ReactNode
}

export function SectionHeaderStack({
  eyebrow,
  headline,
  tone = 'light',
  className = '',
  rightAction,
}: SectionHeaderStackProps) {
  const eyebrowTone: Tone = tone === 'light' ? 'graphite' : 'smoke'
  const headlineTone: Tone = tone === 'light' ? 'obsidian' : 'white'

  return (
    <div className={`flex flex-col md:flex-row md:items-end justify-between ds-gap-24 ${className}`.trim()}>
      <div className="flex flex-col ds-gap-16">
        {eyebrow && <MonoLabel tone={eyebrowTone}>{eyebrow}</MonoLabel>}
        <Heading level={2} scale="heading" tone={headlineTone}>
          {headline}
        </Heading>
      </div>
      {rightAction && <div className="flex items-center ds-gap-12 shrink-0">{rightAction}</div>}
    </div>
  )
}

export interface TextFieldProps {
  label: string
  value: string
  onChange: (val: string) => void
  placeholder?: string
  type?: string
  required?: boolean
}

export function TextField({
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  required = false,
}: TextFieldProps) {
  return (
    <label className="flex flex-col ds-gap-8">
      <MonoLabel tone="graphite">{label}</MonoLabel>
      {React.createElement('input', {
        type,
        value,
        required,
        placeholder,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
        className:
          'ds-surface-soft-mist ds-border-silhouette ds-radius-button ds-px-16 ds-py-12 ds-type-body-sm ds-text-obsidian outline-none',
      })}
    </label>
  )
}

export interface SelectFieldProps {
  label: string
  value: string
  onChange: (val: string) => void
  options: { value: string; label: string }[]
}

export function SelectField({ label, value, onChange, options }: SelectFieldProps) {
  return (
    <label className="flex flex-col ds-gap-8">
      <MonoLabel tone="graphite">{label}</MonoLabel>
      {React.createElement(
        'select',
        {
          value,
          onChange: (e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value),
          className:
            'ds-surface-soft-mist ds-border-silhouette ds-radius-button ds-px-16 ds-py-12 ds-type-body-sm ds-text-obsidian outline-none cursor-pointer',
        },
        options.map((opt) =>
          React.createElement('option', { key: opt.value, value: opt.value }, opt.label)
        )
      )}
    </label>
  )
}
