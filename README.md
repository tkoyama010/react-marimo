# react-marimo

React components for embedding [marimo](https://marimo.io) notebooks in your web application.

Inspired by [react-py](https://github.com/elilambnz/react-py) and [react-jupyter-notebook](https://github.com/Joeyonng/react-jupyter-notebook).

## Overview

marimo is a modern Python notebook that stores code as pure Python files, supports reactive execution, and can be published as WebAssembly-powered web apps. `react-marimo` provides a React component to embed these notebooks directly in any React application via marimo's iframe embedding API.

## Installation

```bash
npm install react-marimo
# or
yarn add react-marimo
# or
pnpm add react-marimo
```

## Quick Start

### Embed from a share URL

Generate a share link from [marimo.app](https://marimo.app) or [molab](https://molab.marimo.io), then pass it to `MarimoEmbed`:

```tsx
import { MarimoEmbed } from 'react-marimo'

export default function App() {
  return (
    <MarimoEmbed
      src="https://marimo.app/l/abc123"
      height={600}
    />
  )
}
```

### Embed inline notebook code

Pass raw marimo Python code directly. For notebooks larger than 14 KB the code is automatically compressed using [lz-string](https://github.com/pieroxy/lz-string).

```tsx
import { MarimoEmbed } from 'react-marimo'

const NOTEBOOK_CODE = `
import marimo

app = marimo.App()

@app.cell
def __():
    import marimo as mo
    slider = mo.ui.slider(1, 10, value=5, label="Pick a number")
    slider
    return slider,

@app.cell
def __(slider):
    import matplotlib.pyplot as plt
    import numpy as np

    x = np.linspace(0, slider.value * 2 * np.pi, 200)
    plt.plot(x, np.sin(x))
    plt.title(f"sin(x) over {slider.value} periods")
    plt.gca()
    return
`

export default function App() {
  return (
    <MarimoEmbed
      code={NOTEBOOK_CODE}
      height={500}
      showCode
    />
  )
}
```

## API

### `<MarimoEmbed>`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | — | Shareable marimo.app or molab notebook URL |
| `code` | `string` | — | Inline Python marimo notebook code |
| `mode` | `'edit' \| 'read'` | `'read'` | Display mode |
| `showCode` | `boolean` | `false` | Show Python source code cells |
| `showChrome` | `boolean` | `false` | Show marimo.app header chrome |
| `height` | `string \| number` | `600` | Iframe height |
| `width` | `string \| number` | `'100%'` | Iframe width |
| `title` | `string` | `'marimo notebook'` | Accessible `<iframe>` title |
| `className` | `string` | — | CSS class applied to the iframe |
| `style` | `React.CSSProperties` | — | Inline styles applied to the iframe |

Either `src` or `code` must be provided.

### URL parameters applied automatically

`MarimoEmbed` appends the following parameters to the iframe URL based on your props:

| Parameter | Applied when |
|-----------|-------------|
| `mode=read` | `mode="read"` (default) |
| `embed=true` | `showChrome={false}` (default) — hides the marimo.app header |
| `show-code=false` | `showCode={false}` (default) |

### Sandbox attributes

The iframe uses marimo's recommended sandbox policy:

```
allow-scripts allow-same-origin allow-downloads allow-popups allow-forms
```

This enables persistent localStorage, file exports, and interactive widgets such as `mo.ui.form` and `mo.ui.microphone`.

## Design

`react-marimo` wraps marimo's existing iframe embedding API. Marimo notebooks published to [marimo.app](https://marimo.app) or [molab](https://molab.marimo.io) run in WebAssembly, requiring no server infrastructure on your side.

For inline `code`, the component constructs a `marimo.app` URL at render time:

- Code ≤ 14 KB → `?code=<encodeURIComponent(code)>`
- Code > 14 KB → `?lz=<lzString.compressToEncodedURIComponent(code)>`

This approach mirrors how marimo's own MDX documentation embedding works.

### Comparison with react-py and react-jupyter-notebook

| | react-py | react-jupyter-notebook | react-marimo |
|---|---|---|---|
| Execution | Pyodide (in-page WebAssembly) | None (static render) | marimo WASM (iframe) |
| Input format | Raw Python string | `.ipynb` JSON | marimo `.py` file or share URL |
| Reactivity | No | No | Yes (marimo reactive cells) |
| Interactive widgets | No | No | Yes (`mo.ui.*`) |
| External dependency | None | None | marimo.app / molab |
| Bundle size impact | Large (Pyodide) | Small | Minimal (iframe) |

## License

MIT
