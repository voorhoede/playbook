import type { MarkdownRenderer as MarkdownIt } from 'vitepress'

/**
 * The page header carries the page's one `h1`: a Drive document's opening `h1` moves into
 * `frontmatter.title`, and any other `h1` becomes an `h2`.
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
  md.core.ruler.before('anchor', 'lift-title', rule)
}
