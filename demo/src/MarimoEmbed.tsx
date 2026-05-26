import { useMemo } from 'react'
import lzString from 'lz-string'

export interface MarimoEmbedProps {
  src?: string
  code?: string
  mode?: 'edit' | 'read'
  showCode?: boolean
  showChrome?: boolean
  height?: string | number
  width?: string | number
  className?: string
  style?: React.CSSProperties
  title?: string
}

const MARIMO_APP_BASE = 'https://marimo.app'
const LZ_SIZE_THRESHOLD = 14 * 1024
const SANDBOX =
  'allow-scripts allow-same-origin allow-downloads allow-popups allow-forms'

function buildUrl(props: MarimoEmbedProps): string {
  const { src, code, mode = 'read', showCode = false, showChrome = false } = props
  const base = src ? new URL(src) : new URL(MARIMO_APP_BASE)

  if (mode === 'read') base.searchParams.set('mode', 'read')
  if (!showChrome) base.searchParams.set('embed', 'true')
  if (!showCode) base.searchParams.set('show-code', 'false')

  if (!src && code) {
    if (code.length > LZ_SIZE_THRESHOLD) {
      base.searchParams.set('lz', lzString.compressToEncodedURIComponent(code))
    } else {
      base.searchParams.set('code', encodeURIComponent(code))
    }
  }

  return base.toString()
}

export function MarimoEmbed({
  src,
  code,
  mode = 'read',
  showCode = false,
  showChrome = false,
  height = 600,
  width = '100%',
  className,
  style,
  title = 'marimo notebook',
}: MarimoEmbedProps) {
  if (!src && !code) {
    throw new Error('[react-marimo] Either the `src` or `code` prop is required.')
  }

  const embedUrl = useMemo(
    () => buildUrl({ src, code, mode, showCode, showChrome }),
    [src, code, mode, showCode, showChrome],
  )

  return (
    <iframe
      src={embedUrl}
      title={title}
      width={width}
      height={height}
      className={className}
      style={{ border: 'none', ...style }}
      sandbox={SANDBOX}
      allow="microphone"
      allowFullScreen
    />
  )
}
