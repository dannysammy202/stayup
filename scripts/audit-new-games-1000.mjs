import { structuredOptionGamesFinal } from '../src/data/editorial/structured-option-games-final.js'
import { openGamePromptsPublished } from '../src/data/editorial/open-games-published.js'

const libraries = { ...structuredOptionGamesFinal, ...openGamePromptsPublished }

const required = {
  'guess-my-answer': { options: [0, 4] },
  'rank-these': { options: [5] },
  'agree-disagree': { options: [0] },
  'one-has-to-go': { options: [4] },
  'keep-one-forever': { options: [4, 5] },
  'rate-it': { options: [0] },
  'this-or-that': { options: [2] },
  'red-green-depends': { options: [0] },
  'petty-or-valid': { options: [0] },
  'tell-the-story': { options: [0] },
}

function normalise(value) {
  return value
    .toLowerCase()
    .replace(/[“”‘’'".,!?():;\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokens(value) {
  const stop = new Set(['the','a','an','and','or','to','of','in','on','for','with','is','are','it','you','your','they','their','these','this','from','one','only','about','than','do','does'])
  return new Set(normalise(value).split(' ').filter(word => word.length > 2 && !stop.has(word)))
}

function jaccard(a, b) {
  const left = tokens(a)
  const right = tokens(b)
  if (!left.size || !right.size) return 0
  let intersection = 0
  for (const token of left) if (right.has(token)) intersection += 1
  return intersection / (left.size + right.size - intersection)
}

const errors = []
let total = 0

for (const [categoryId, rules] of Object.entries(required)) {
  const modes = libraries[categoryId]
  if (!modes) {
    errors.push(`${categoryId}: missing library`)
    continue
  }

  for (const mode of ['friend', 'relationship']) {
    const cards = modes[mode] || []
    total += cards.length
    console.log(`${categoryId}/${mode}: ${cards.length}`)

    if (cards.length !== 1000) errors.push(`${categoryId}/${mode}: expected 1000 cards, found ${cards.length}`)

    const exact = new Set()
    for (const card of cards) {
      const options = card.options || []
      const combined = `${card.text} ${options.join(' ')}`
      const key = normalise(combined)
      if (exact.has(key)) errors.push(`${categoryId}/${mode}: exact duplicate: ${combined}`)
      exact.add(key)

      const allowed = rules.options
      if (!allowed.includes(options.length)) errors.push(`${categoryId}/${mode}: wrong option count ${options.length}: ${card.text}`)
      const optionSet = new Set(options.map(normalise))
      if (optionSet.size !== options.length) errors.push(`${categoryId}/${mode}: repeated option in card: ${card.text}`)
      if (!card.text || card.text.trim().length < 8) errors.push(`${categoryId}/${mode}: weak text: ${card.text}`)
      if (/\bundefined\b|\bnull\b|\{[a-z]+\}/i.test(combined)) errors.push(`${categoryId}/${mode}: malformed interpolation: ${combined}`)
      if (/\?\?+|\.\.+|\s{2,}/.test(card.text)) errors.push(`${categoryId}/${mode}: malformed punctuation: ${card.text}`)
      if (/\bprotecting making\b|\bhow much visit\b|\btexts feels\b|\bcheck-ins keeps\b|\bcalls keeps\b|\bhabits showed\b/i.test(card.text)) errors.push(`${categoryId}/${mode}: awkward grammar: ${card.text}`)
    }

    const sampleSize = Math.min(cards.length, 220)
    for (let i = 0; i < sampleSize; i += 1) {
      for (let j = i + 1; j < sampleSize; j += 1) {
        const left = `${cards[i].text} ${(cards[i].options || []).join(' ')}`
        const right = `${cards[j].text} ${(cards[j].options || []).join(' ')}`
        const score = jaccard(left, right)
        if (score >= 0.96) errors.push(`${categoryId}/${mode}: suspicious near-duplicate ${score.toFixed(2)}: ${left} / ${right}`)
      }
    }

    const sampleIndexes = [0, 137, 389, 641, 913].filter(i => i < cards.length)
    sampleIndexes.forEach(i => console.log(`sample ${categoryId}/${mode}/${i}: ${cards[i].text} ${(cards[i].options || []).join(' | ')}`))
  }
}

console.log(`New-game published total: ${total}`)
if (total !== 20000) errors.push(`expected 20000 total new-game cards, found ${total}`)

if (errors.length) {
  console.error(`New game audit failed with ${errors.length} issue(s).`)
  errors.slice(0, 60).forEach(error => console.error(`- ${error}`))
  process.exit(1)
}

console.log('New game 1000-card audit passed.')
