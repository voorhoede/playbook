/**
 * markdown-it plugin: a paragraph that holds nothing but a link to a YouTube video or playlist
 * becomes an embedded player (the <youtube-embed> theme component).
 */
const youtubeVideo = /^https:\/\/(?:www\.)?youtube\.com\/watch\?v=([\w-]{11})/
const youtubePlaylist = /^https:\/\/(?:www\.)?youtube\.com\/playlist\?list=([\w-]+)/

function getEmbed(href = '') {
  const video = href.match(youtubeVideo)
  if (video) return { id: video[1], type: 'singleVideo' }
  const playlist = href.match(youtubePlaylist)
  if (playlist) return { id: playlist[1], type: 'playlist' }
  return null
}

export default function transformMarkdown(markdown) {
  markdown.core.ruler.push('youtube-embed', state => {
    const tokens = state.tokens
    for (let i = 0; i < tokens.length - 2; i++) {
      const [open, inline, close] = [tokens[i], tokens[i + 1], tokens[i + 2]]
      if (open.type !== 'paragraph_open' || inline.type !== 'inline' || close.type !== 'paragraph_close') continue
      const children = inline.children.filter(child => !(child.type === 'text' && !child.content.trim()))
      if (children.length !== 3 || children[0].type !== 'link_open') continue
      const embed = getEmbed(children[0].attrGet('href'))
      if (!embed) continue
      const title = children[1].content.replace(/"/g, '&quot;')
      const block = new state.Token('html_block', '', 0)
      block.content = `<youtube-embed id="${embed.id}" type="${embed.type}" title="${title}" />\n`
      tokens.splice(i, 3, block)
    }
  })
}

