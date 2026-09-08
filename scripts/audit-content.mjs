import { getCoverage, getCards, serialiseCard } from '../src/data/library.js'
import { allCategories, conversationCategories, gameCategories } from '../src/data/catalog.js'

const strict = process.argv.includes('--strict')
const failures = []
const warnings = []

const normalise = value => value
  .toLowerCase()
  .replace(/[“”‘’'".,!?():;\/\-]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()

function fail(message) { failures.push(message) }
function warn(message) { warnings.push(message) }

if (allCategories.length !== 34) fail(`Expected 34 categories, found ${allCategories.length}`)
if (conversationCategories.length !== 15) fail(`Expected 15 conversation categories, found ${conversationCategories.length}`)
if (gameCategories.length !== 19) fail(`Expected 19 game categories, found ${gameCategories.length}`)

for (const category of allCategories) {
  for (const mode of ['friend', 'relationship']) {
    const cards = getCards({ categoryId: category.id, mode, allow18: true })
    if (!cards.length) fail(`${category.name} / ${mode}: no published cards`)

    const ids = new Set()
    const exact = new Set()
    const optionSets = new Set()
    const leadIns = new Map()

    cards.forEach(card => {
      if (!card.id || ids.has(card.id)) fail(`${category.name} / ${mode}: duplicate or missing id ${card.id}`)
      ids.add(card.id)
      if (!card.text || card.text !== card.text.trim()) fail(`${category.name} / ${mode}: blank or untrimmed card ${card.id}`)
      if (!card.intensity) fail(`${category.name} / ${mode}: missing intensity on ${card.id}`)
      if (!['general', '18+'].includes(card.audience)) fail(`${category.name} / ${mode}: invalid audience on ${card.id}`)
      if (mode === 'relationship' && !card.stages?.length) fail(`${category.name} / ${mode}: missing stage classification on ${card.id}`)
      if (card.source?.includes('generated') || card.source?.includes('nigeria-first')) fail(`${category.name} / ${mode}: generated source reached live library`)

      const copy = serialiseCard(card)
      if (/stayup|https?:\/\//i.test(copy)) fail(`${category.name} / ${mode}: copy payload contains branding or a link`)

      const signature = normalise(`${card.text} ${(card.options || []).join(' ')}`)
      if (exact.has(signature)) fail(`${category.name} / ${mode}: exact duplicate "${card.text}"`)
      exact.add(signature)

      if (card.options?.length >= 2) {
        const optionKey = card.options.map(normalise).sort().join('|')
        if (optionSets.has(optionKey) && ['this-or-that', 'if-you-had-to-choose', 'kiss-marry-avoid'].includes(category.id)) {
          fail(`${category.name} / ${mode}: repeated option set ${card.options.join(' / ')}`)
        }
        optionSets.add(optionKey)
      }

      const lead = normalise(card.text).split(' ').slice(0, 5).join(' ')
      leadIns.set(lead, (leadIns.get(lead) || 0) + 1)
    })

    for (const [lead, count] of leadIns) {
      if (count > Math.max(12, Math.floor(cards.length * 0.18))) warn(`${category.name} / ${mode}: ${count} cards share the opening "${lead}"`)
    }
  }
}

const coverage = getCoverage()
console.log('\nStayUp editorial coverage')
console.log('=========================')
for (const item of coverage) {
  if (item.id === 'truth-dare') {
    console.log(`${item.name.padEnd(35)} Friends ${String(item.friend).padStart(4)}  Relationship ${String(item.relationship).padStart(4)}  Truth F/R ${item.truth.friend}/${item.truth.relationship}  Dare F/R ${item.dare.friend}/${item.dare.relationship}`)
    if (strict) {
      if (item.truth.friend !== 500) fail(`${item.name}: Friends Truth must be exactly 500, found ${item.truth.friend}`)
      if (item.truth.relationship !== 500) fail(`${item.name}: Relationship Truth must be exactly 500, found ${item.truth.relationship}`)
      if (item.dare.friend !== 500) fail(`${item.name}: Friends Dare must be exactly 500, found ${item.dare.friend}`)
      if (item.dare.relationship !== 500) fail(`${item.name}: Relationship Dare must be exactly 500, found ${item.dare.relationship}`)
    }
  } else {
    console.log(`${item.name.padEnd(35)} Friends ${String(item.friend).padStart(4)}  Relationship ${String(item.relationship).padStart(4)}  Target 750`)
    if (strict) {
      if (item.friend !== 750) fail(`${item.name}: Friends must be exactly 750, found ${item.friend}`)
      if (item.relationship !== 750) fail(`${item.name}: Relationship must be exactly 750, found ${item.relationship}`)
    }
  }
}

if (warnings.length) {
  console.log('\nEditorial warnings')
  warnings.slice(0, 40).forEach(message => console.log(`- ${message}`))
  if (warnings.length > 40) console.log(`- ${warnings.length - 40} more warnings`)
}

if (failures.length) {
  console.error(`\nAudit failed with ${failures.length} issue${failures.length === 1 ? '' : 's'}:`)
  failures.slice(0, 80).forEach(message => console.error(`- ${message}`))
  if (failures.length > 80) console.error(`- ${failures.length - 80} more issues`)
  process.exit(1)
}

console.log(`\nAudit passed${strict ? ' with strict editorial targets' : ' for structure and live-source integrity'}.`)
