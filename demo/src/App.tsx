import { useState } from 'react'
import { MarimoEmbed } from 'react-marimo'

// Demonstrates: inline code, showCode toggle, mode toggle
const EXAMPLE_CODE = `import marimo
app = marimo.App()

@app.cell
def _():
    import marimo as mo
    slider = mo.ui.slider(1, 10, value=3, label="Periods")
    slider
    return (slider,)

@app.cell
def _(slider):
    import matplotlib.pyplot as plt
    import numpy as np
    x = np.linspace(0, slider.value * 2 * np.pi, 500)
    fig, ax = plt.subplots()
    ax.plot(x, np.sin(x))
    ax.set_title(f"sin(x) over {slider.value} period(s)")
    fig
    return
`

export default function App() {
  const [showCode, setShowCode] = useState(false)
  const [mode, setMode] = useState<'read' | 'edit'>('read')
  const [url, setUrl] = useState('')
  const [activeUrl, setActiveUrl] = useState('')

  return (
    <main className="app">
      <header>
        <h1>react-marimo demo</h1>
        <p>
          React components for embedding{' '}
          <a href="https://marimo.io" target="_blank" rel="noreferrer">marimo</a>{' '}
          notebooks via iframe.
        </p>
      </header>

      <section>
        <h2>
          Inline code — <code>{'<MarimoEmbed code={...} />'}</code>
        </h2>
        <p>The notebook is constructed from inline Python code and rendered via marimo's WebAssembly runtime.</p>
        <div className="controls">
          <label>
            <input
              type="checkbox"
              checked={showCode}
              onChange={(e) => setShowCode(e.target.checked)}
            />
            {' '}Show source cells
          </label>
          <label>
            <input
              type="checkbox"
              checked={mode === 'edit'}
              onChange={(e) => setMode(e.target.checked ? 'edit' : 'read')}
            />
            {' '}Edit mode
          </label>
        </div>
        <MarimoEmbed code={EXAMPLE_CODE} height={480} showCode={showCode} mode={mode} />
      </section>

      <section>
        <h2>
          Share URL — <code>{'<MarimoEmbed src="..." />'}</code>
        </h2>
        <p>
          Paste a{' '}
          <a href="https://marimo.app" target="_blank" rel="noreferrer">marimo.app</a>{' '}
          or molab share URL to embed it here.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setActiveUrl(url)
          }}
        >
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://marimo.app/l/..."
            className="url-input"
          />
          <button type="submit">Load notebook</button>
        </form>
        {activeUrl && <MarimoEmbed src={activeUrl} height={480} />}
      </section>
    </main>
  )
}
