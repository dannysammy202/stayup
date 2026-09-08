import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const publishedDir = path.resolve('src/data/editorial/published')
const files = (await fs.readdir(publishedDir)).filter(file => file.endsWith('.js')).sort()

const stop = new Set([
  'the', 'a', 'an', 'and', 'or', 'to', 'of', 'in', 'on', 'for', 'with', 'is', 'are', 'do', 'does', 'did',
  'you', 'your', 'what', 'how', 'when', 'would', 'one', 'something', 'thing', 'think', 'that', 'this', 'it',
  'someone', 'people', 'person', 'about', 'have', 'has', 'had', 'be', 'been', 'being', 'if', 'from', 'as', 'at',
])

function normalise(text) {
  return text
    .toLowerCase()
    .replace(/[“”‘’'".,!?():;\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokenSet(text) {
  return new Set(normalise(text).split(' ').filter(word => word.length > 2 && !stop.has(word)))
}

function jaccard(a, b) {
  const left = tokenSet(a)
  const right = tokenSet(b)
  if (!left.size || !right.size) return 0
  let intersection = 0
  for (const token of left) if (right.has(token)) intersection += 1
  return intersection / (left.size + right.size - intersection)
}

const globalExact = new Map()
let totalPublished = 0
let failures = 0

for (const file of files) {
  const category = file.replace(/\.js$/, '')
  const moduleUrl = pathToFileURL(path.join(publishedDir, file)).href
  const { default: library } = await import(moduleUrl)

  for (const mode of ['friend', 'relationship']) {
    const groups = library[mode]
    if (!groups) {
      console.error(`${category}/${mode}: missing published library`)
      failures += 1
      continue
    }

    const entries = Object.entries(groups)
    const prompts = entries.flatMap(([, items]) => items)
    const counts = Object.fromEntries(entries.map(([name, items]) => [name, items.length]))
    totalPublished += prompts.length

    console.log(`${category}/${mode}: total=${prompts.length} groups=${JSON.stringify(counts)}`)

    if (prompts.length !== 1000) {
      console.error(`${category}/${mode}: expected exactly 1000 published prompts, found ${prompts.length}`)
      failures += 1
    }

    const exact = new Map()
    for (const prompt of prompts) {
      const key = normalise(prompt)
      if (exact.has(key)) {
        console.error(`${category}/${mode}: exact duplicate: ${prompt}`)
        failures += 1
      }
      exact.set(key, prompt)

      const globalKey = `${mode}:${key}`
      if (globalExact.has(globalKey) && globalExact.get(globalKey) !== category) {
        console.error(`${category}/${mode}: duplicates ${globalExact.get(globalKey)}: ${prompt}`)
        failures += 1
      } else {
        globalExact.set(globalKey, category)
      }

      if (prompt.length < 12) {
        console.error(`${category}/${mode}: prompt too short: ${prompt}`)
        failures += 1
      }
    }

    for (let i = 0; i < prompts.length; i += 1) {
      for (let j = i + 1; j < prompts.length; j += 1) {
        const score = jaccard(prompts[i], prompts[j])
        if (score >= 0.88) {
          console.error(`${category}/${mode}: near duplicate ${score.toFixed(2)}: ${prompts[i]} / ${prompts[j]}`)
          failures += 1
        }
      }
    }
  }
}

console.log(`Published editorial total: ${totalPublished}`)
console.log(`Published categories: ${files.length}`)

if (failures) {
  console.error(`Content audit failed with ${failures} issue(s).`)
  process.exit(1)
}

console.log('Content audit passed.')
