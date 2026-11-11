import type { MarkdownRenderer as MarkdownIt } from 'vitepress'

/**
 * A Drive document usually opens with its own `h1`. The page header (HeroHeader) carries the
 * page's one `h1`, so that first heading moves into `frontmatter.title` and leaves the body.
 * Only a heading that opens the document is lifted; any other `h1` becomes an `h2`, so the
 * page keeps a single `h1`.
 */
export function liftTitle(md: MarkdownIt) {
  const rule: Parameters<typeof md.core.ruler.push>[1] = state => {
    const tokens = state.tokens
    const first = tokens.findIndex(token => token.type !== 'html_block' || token.content.trim())
    const opener = tokens[first]

    if (opener?.type === 'heading_open' && opener.tag === 'h1') {
      const text = (tokens[first + 1].children ?? [])
        .filter(child => child.type === 'text' || child.type === 'code_inline')
        .map(child => child.content)
        .join('')
        .trim()
      if (text) {
        state.env.frontmatter ??= {}
        state.env.frontmatter.title = text
        tokens.splice(first, 3)
      }
    }

    for (const token of tokens) {
      if ((token.type === 'heading_open' || token.type === 'heading_close') && token.tag === 'h1') {
        token.tag = 'h2'
      }
    }
  }

  // Before markdown-it-anchor, so a demoted heading gets its id like any other h2.
  try {
    md.core.ruler.before('anchor', 'lift-title', rule)
  } catch {
    md.core.ruler.push('lift-title', rule)
  }
}

const escapeHtml = (text: string) => text
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')

/**
 * Fenced code renders as the design system's CodeBlock: `blue-dark` on `yellow-light`,
 * in the code font, without syntax colours of its own.
 */
export function codeBlock(md: MarkdownIt) {
  md.renderer.rules.fence = (tokens, index) => {
    const token = tokens[index]
    const language = token.info.trim().split(/\s+/)[0] || 'text'
    return `<div class="code-block" v-pre><pre class="language-${escapeHtml(language)}"><code>${escapeHtml(token.content)}</code></pre></div>\n`
  }
}
