import { structuredOptionGames } from './structured-option-games.js'

function normalise(value) {
  return value.toLowerCase().replace(/[“”‘’'".,!?():;\-]/g, ' ').replace(/\s+/g, ' ').trim()
}

function pairKey(a, b) {
  return [normalise(a), normalise(b)].sort().join('|')
}

function rebuildThisOrThat(cards) {
  const byTopic = new Map()
  for (const card of cards) {
    if (!card.topic || !card.options?.length) continue
    const values = byTopic.get(card.topic) || new Set()
    card.options.forEach(option => values.add(option))
    byTopic.set(card.topic, values)
  }

  const out = []
  const seen = new Set()
  const topics = [...byTopic.entries()]
  let round = 0

  while (out.length < 1000) {
    let added = 0
    for (const [topic, valueSet] of topics) {
      const values = [...valueSet]
      const pairs = []
      for (let i = 0; i < values.length; i += 1) {
        for (let j = i + 1; j < values.length; j += 1) pairs.push([values[i], values[j]])
      }
      if (!pairs.length) continue
      const pair = pairs[(round * 7 + out.length * 3) % pairs.length]
      const key = pairKey(pair[0], pair[1])
      if (seen.has(key)) continue
      seen.add(key)
      out.push({ text: `${pair[0]} or ${pair[1]}?`, options: pair, topic })
      added += 1
      if (out.length === 1000) break
    }
    round += 1
    if (!added && round > 5000) break
  }

  if (out.length < 1000) throw new Error(`This or That requires 1000 unique cards, found ${out.length}`)
  return out
}

export const structuredOptionGamesFinal = {
  ...structuredOptionGames,
  'this-or-that': {
    friend: rebuildThisOrThat(structuredOptionGames['this-or-that'].friend),
    relationship: rebuildThisOrThat(structuredOptionGames['this-or-that'].relationship),
  },
}
