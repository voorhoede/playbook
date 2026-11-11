/**
 * Copies the De Voorhoede design system into the playbook theme.
 *
 * Usage: node scripts/design-system/sync.mjs <path to the design system's project/ folder>
 *
 * Download the design system's `project/tokens.json` and `project/components/bundle.css`
 * (keeping that folder structure), then run this script. It writes:
 * - docs/.vitepress/theme/design-system/tokens.json  (copied as is, the source of truth)
 * - docs/.vitepress/theme/design-system/tokens.css   (generated from tokens.json)
 * - docs/.vitepress/theme/design-system/bundle.css   (copied as is)
 *
 * tokens.css is generated here instead of copied, because the design system's own tokens.css
 * can lag behind tokens.json. Font faces are left out: the playbook serves the full Apercu
 * files (the design system's are Basic Latin subsets, without the Dutch diacritics).
 */
import fs from 'node:fs'
import path from 'node:path'

const source = process.argv[2]
if (!source) {
  console.error('Usage: node scripts/design-system/sync.mjs <design system project/ folder>')
  process.exit(1)
}

const target = path.resolve('docs/.vitepress/theme/design-system')
const tokens = JSON.parse(fs.readFileSync(path.join(source, 'tokens.json'), 'utf8'))

const comment = text => text ? ` /* ${text.replace(/\*\//g, '* /')} */` : ''
const valueOf = value => typeof value === 'object' && value !== null
  ? value.light ?? Object.values(value)[0]
  : value
const toKebab = name => name.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`)

const lines = [`/* ${tokens.name} — generated from tokens.json by scripts/design-system/sync.mjs. Do not edit. */`, ':root {']

for (const [family, group] of Object.entries(tokens)) {
  if (['name', 'version', 'meta', 'type'].includes(family) || !group?.tokens) continue
  for (const token of group.tokens) {
    const value = String(valueOf(token.value)).replace(/^\{(.+)\}$/, 'var(--$1)')
    lines.push(`  --${token.name}: ${value};${comment(token.usage)}`)
  }
}

for (const [name, stack] of Object.entries(tokens.type?.families ?? {})) {
  lines.push(`  --font-${name}: ${stack};`)
}
lines.push('}')

/* block-spacing steps up at 1100px (see its usage note in tokens.json) */
lines.push('@media (min-width: 1100px) {', '  :root {', '    --block-spacing: var(--spacing-120);', '  }', '}')

for (const group of tokens.type?.groups ?? []) {
  for (const style of group.styles) {
    lines.push(
      `.${style.name} {`,
      `  font-family: var(--font-${style.family || group.family});`,
      `  font-size: ${style.fontSize};`,
      `  line-height: ${style.lineHeight};`,
      `  font-weight: ${style.fontWeight};`,
      `  letter-spacing: ${style.letterSpacing || 0};`,
      '}',
    )
  }
}

fs.mkdirSync(target, { recursive: true })
fs.writeFileSync(path.join(target, 'tokens.css'), lines.join('\n') + '\n')
fs.copyFileSync(path.join(source, 'tokens.json'), path.join(target, 'tokens.json'))
fs.copyFileSync(path.join(source, 'components/bundle.css'), path.join(target, 'bundle.css'))

console.log(`Design system synced to ${path.relative(process.cwd(), target)} (${tokens.meta?.synced ?? 'unknown date'})`)
