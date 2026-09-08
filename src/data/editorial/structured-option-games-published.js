import { structuredOptionGames as source } from './structured-option-games.js'

function normalise(value = '') {
  return value.toLowerCase().replace(/[“”‘’'".,!?():;\/\-]/g, ' ').replace(/\s+/g, ' ').trim()
}

function uniqueOptionSets(cards, target) {
  const seen = new Set()
  const out = []
  for (const card of cards) {
    const key = (card.options || []).map(normalise).sort().join('|')
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(card)
    if (out.length === target) return out
  }
  throw new Error(`This or That needs ${target} unique option sets, found ${out.length}`)
}

export const structuredOptionGamesPublished = {
  ...source,
  'this-or-that': {
    friend: uniqueOptionSets(source['this-or-that'].friend, 750),
    relationship: uniqueOptionSets(source['this-or-that'].relationship, 750),
  },
}
