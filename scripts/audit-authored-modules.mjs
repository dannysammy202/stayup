import gettingFriend from '../src/data/editorial/getting-to-know-you.friend.js'

const modules = [
  ['getting-to-know-you', 'friend', gettingFriend],
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
}
