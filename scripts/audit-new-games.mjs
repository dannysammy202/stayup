import { newGamePrompts } from '../src/data/editorial/new-games.js'

const required = {
  'guess-my-answer': { options: null },
  'rank-these': { options: 5 },
  'agree-disagree': { options: null },
  'one-has-to-go': { options: 4 },
  'keep-one-forever': { options: [4, 5] },
  'rate-it': { options: null },
  'this-or-that': { options: 2 },
  'red-green-depends': { options: null },
  'petty-or-valid': { options: null },
  'tell-the-story': { options: null },
}

function normalise(value) {
  return value
    .toLowerCase()
    .replace(/[“”‘’'".,!?():;\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const errors = []
const globalText = new Map()
let total = 0

for (const [categoryId, rules] of Object.entries(required)) {
  const modes = newGamePrompts[categoryId]
  if (!modes) {
    errors.push(`${categoryId}: missing category data`)
    continue
  }

  for (const mode of ['friend', 'relationship']) {
    const cards = modes[mode]
    if (!Array.isArray(cards) || !cards.length) {
      errors.push(`${categoryId}/${mode}: no authored cards`)
      continue
    }

    const seen = new Set()
    for (const card of cards) {
      total += 1
      const combined = `${card.text} ${(card.options || []).join(' ')}`
      const key = normalise(combined)
      if (seen.has(key)) errors.push(`${categoryId}/${mode}: exact duplicate: ${combined}`)
      seen.add(key)

      const globalKey = `${mode}:${key}`
      if (globalText.has(globalKey)) {
        errors.push(`${categoryId}/${mode}: copied from ${globalText.get(globalKey)}: ${combined}`)
      } else {
        globalText.set(globalKey, categoryId)
      }

      if (!card.text || card.text.trim().length < 8) errors.push(`${categoryId}/${mode}: weak or missing text`)

      if (rules.options !== null) {
        const allowed = Array.isArray(rules.options) ? rules.options : [rules.options]
        const count = card.options?.length || 0
        if (!allowed.includes(count)) {
          errors.push(`${categoryId}/${mode}: expected ${allowed.join(' or ')} options, found ${count}: ${card.text}`)
        }
        const optionSet = new Set((card.options || []).map(normalise))
        if (optionSet.size !== count) errors.push(`${categoryId}/${mode}: duplicate option inside card: ${card.text}`)
      }
    }

    console.log(`${categoryId}/${mode}: authored=${cards.length}, target=1000, remaining=${Math.max(0, 1000 - cards.length)}`)
  }
}

console.log(`New game audit checked ${total} authored cards.`)

if (errors.length) {
  console.error(`New game audit failed with ${errors.length} issue(s).`)
  errors.slice(0, 30).forEach(error => console.error(`- ${error}`))
  process.exit(1)
}

console.log('New game seed audit passed.')
