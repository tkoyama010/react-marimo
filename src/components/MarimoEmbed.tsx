import React, { useMemo } from 'react'
import { buildCodeUrl, buildSrcUrl } from '../utils/url'

export interface MarimoEmbedProps {
  /** Shareable marimo.app or molab notebook URL */
  src?: string
  /** Inline Python marimo notebook code */
  code?: string
  /** Display mode (default: 'read') */
  mode?: 'edit' | 'read'
  /** Show Python source code cells (default: false) */
  showCode?: boolean
  /** Show marimo.app header chrome (default: false) */
  showChrome?: boolean
  /** Iframe height (default: 600) */
  height?: string | number
  /** Iframe width (default: '100%') */
  width?: string | number
  className?: string
  style?: React.CSSProperties
  /** Accessible title for the iframe (default: 'marimo notebook') */
  title?: string
}

// Recommended sandbox attributes per marimo embedding docs
const SANDBOX =
  'allow-scripts allow-same-origin allow-downloads allow-popups allow-forms'

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

  const embedUrl = useMemo(() => {
    const options = { mode, showCode, showChrome }
    return src ? buildSrcUrl(src, options) : buildCodeUrl(code!, options)
  }, [src, code, mode, showCode, showChrome])

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
