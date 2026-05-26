import lzString from 'lz-string'

const MARIMO_APP_BASE = 'https://marimo.app'

// marimo.app recommends lz-string compression for notebooks larger than 14 KB
const LZ_SIZE_THRESHOLD = 14 * 1024

export interface EmbedUrlOptions {
  mode?: 'edit' | 'read'
  showCode?: boolean
  showChrome?: boolean
}

function applyDisplayParams(url: URL, options: EmbedUrlOptions): void {
  const { mode = 'read', showCode = false, showChrome = false } = options
  if (mode === 'read') url.searchParams.set('mode', 'read')
  if (!showChrome) url.searchParams.set('embed', 'true')
  if (!showCode) url.searchParams.set('show-code', 'false')
}

/**
 * Append display parameters to an existing marimo.app or molab share URL.
 */
export function buildSrcUrl(src: string, options: EmbedUrlOptions): string {
  const url = new URL(src)
  applyDisplayParams(url, options)
  return url.toString()
}

/**
 * Build a marimo.app URL from inline Python notebook code.
 * Uses lz-string compression when the code exceeds 14 KB.
 */
export function buildCodeUrl(code: string, options: EmbedUrlOptions): string {
  const url = new URL(MARIMO_APP_BASE)
  applyDisplayParams(url, options)
  if (code.length > LZ_SIZE_THRESHOLD) {
    url.searchParams.set('lz', lzString.compressToEncodedURIComponent(code))
  } else {
    url.searchParams.set('code', encodeURIComponent(code))
  }
  return url.toString()
}
