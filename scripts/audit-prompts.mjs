import { conversationCategories, allCategories } from '../src/data/categories.js'
import { getPrompts } from '../src/data/prompts-v2.js'

const bannedPadding = [
  'Give me the story behind your answer.',
  'What made you think of that first?',
  'Give me one real example.',
  'What changed your mind about it?',
  'What part of your answer would surprise people?',
  'What is the part you usually leave out?',
  'When did you first realise this about yourself?',
  'What would your younger self say about your answer?',
  'Who influenced your answer the most?',
  'Has your answer changed over time?',
  'What is the funniest example you have?',
  'What is the most honest version of your answer?',
]

function normalise(text) {
  return text
    .toLowerCase()
    .replace(/[“”‘’'".,!?():;\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokenSet(text) {
  const stop = new Set(['the', 'a', 'an', 'and', 'or', 'to', 'of', 'in', 'on', 'for', 'with', 'is', 'are', 'do', 'does', 'did', 'you', 'your', 'what', 'how', 'when', 'would', 'one'])
  return new Set(normalise(text).split(' ').filter(word => word.length > 2 && !stop.has(word)))
}

function jaccard(a, b) {
  const left = tokenSet(a)
  const right = tokenSet(b)
  if (!left.size || !right.size) return 0
  let intersection = 0
  left.forEach(token => { if (right.has(token)) intersection += 1 })
  return intersection / (left.size + right.size - intersection)
}

const errors = []
const warnings = []

for (const mode of ['friend', 'relationship']) {
  for (const category of allCategories) {
    const prompts = getPrompts(category.id, mode)
    const exact = new Map()

    prompts.forEach(prompt => {
      const key = normalise(prompt.text)
      if (exact.has(key)) {
        errors.push(`${category.id}/${mode}: exact duplicate: "${prompt.text}"`)
      } else {
        exact.set(key, prompt.id)
      }

      if (bannedPadding.some(phrase => prompt.text.includes(phrase))) {
        errors.push(`${category.id}/${mode}: old padding phrase found: "${prompt.text}"`)
      }

      if (prompt.text.trim().length < 12) {
        errors.push(`${category.id}/${mode}: prompt is too short: "${prompt.text}"`)
      }
    })
  }
}

for (const mode of ['friend', 'relationship']) {
  for (const category of conversationCategories) {
    const prompts = getPrompts(category.id, mode)
    const requiredIntensities = mode === 'friend'
      ? ['Chill', 'Interesting', 'Deep', 'No Filter']
      : ['Chill', 'Interesting', 'Deep', 'Flirty', 'Spicy', 'No Filter']

    for (const intensity of requiredIntensities) {
      const count = prompts.filter(prompt => prompt.intensity === intensity).length
      if (count < 5) errors.push(`${category.id}/${mode}: ${intensity} has only ${count} prompts`)
    }

    for (let i = 0; i < prompts.length; i += 1) {
      for (let j = i + 1; j < prompts.length; j += 1) {
        const score = jaccard(prompts[i].text, prompts[j].text)
        if (score >= 0.82) {
          errors.push(`${category.id}/${mode}: near duplicate (${score.toFixed(2)}): "${prompts[i].text}" / "${prompts[j].text}"`)
        } else if (score >= 0.72) {
          warnings.push(`${category.id}/${mode}: review similarity (${score.toFixed(2)}): "${prompts[i].text}" / "${prompts[j].text}"`)
        }
      }
    }
  }
}

const conversationTotal = ['friend', 'relationship'].reduce((sum, mode) => (
  sum + conversationCategories.reduce((inner, category) => inner + getPrompts(category.id, mode).length, 0)
), 0)

console.log(`Prompt audit: ${conversationTotal} editorial conversation prompts checked.`)
if (warnings.length) {
  console.log(`Prompt audit warnings: ${warnings.length}`)
  warnings.slice(0, 12).forEach(warning => console.log(`- ${warning}`))
}

if (errors.length) {
  console.error(`Prompt audit failed with ${errors.length} issue(s).`)
  errors.slice(0, 30).forEach(error => console.error(`- ${error}`))
  process.exit(1)
}

console.log('Prompt audit passed.')
