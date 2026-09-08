import gettingFriend from '../src/data/editorial/getting-to-know-you.friend.js'
import gettingFriendSupplement from '../src/data/editorial/getting-to-know-you.friend.supplement.js'
import gettingRelationshipPart1 from '../src/data/editorial/getting-to-know-you.relationship.part1.js'
import gettingRelationshipPart2 from '../src/data/editorial/getting-to-know-you.relationship.part2.js'

function mergeGroups(...parts) {
  const merged = {}
  for (const part of parts) {
    for (const [group, prompts] of Object.entries(part)) {
      merged[group] = [...(merged[group] || []), ...prompts]
    }
  }
  return merged
}

const modules = [
  ['getting-to-know-you', 'friend', mergeGroups(gettingFriend, gettingFriendSupplement)],
  ['getting-to-know-you', 'relationship', mergeGroups(gettingRelationshipPart1, gettingRelationshipPart2)],
]

function normalise(text) {
  return text
    .toLowerCase()
    .replace(/[“”‘’'".,!?():;\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

for (const [category, mode, groups] of modules) {
  const entries = Object.entries(groups)
  const prompts = entries.flatMap(([, items]) => items)
  const counts = Object.fromEntries(entries.map(([name, items]) => [name, items.length]))
  const exact = new Set()
  const duplicates = []

  for (const prompt of prompts) {
    const key = normalise(prompt)
    if (exact.has(key)) duplicates.push(prompt)
    exact.add(key)
  }

  console.log(`${category}/${mode}: total=${prompts.length} groups=${JSON.stringify(counts)} duplicates=${duplicates.length}`)
  if (duplicates.length) {
    duplicates.slice(0, 20).forEach(prompt => console.error(`duplicate: ${prompt}`))
    process.exitCode = 1
  }

  if (prompts.length !== 1000) {
    console.error(`${category}/${mode}: expected exactly 1000 authored prompts, found ${prompts.length}`)
    process.exitCode = 1
  }
}
