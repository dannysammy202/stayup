import { conversationCategories, gameCategories } from '../src/data/categories.js'
import { getAllNigeriaFirstPrompts, getNigeriaFirstPrompts } from '../src/data/nigeria-first/index.js'
import { normalise, TARGET_PER_MODE } from '../src/data/nigeria-first/helpers.js'

const errors = []
const modes = ['friend', 'relationship']
const globalSeen = { friend: new Map(), relationship: new Map() }

const stop = new Set(['the','a','an','and','or','to','of','in','on','for','with','is','are','it','you','your','they','their','this','that','what','when','how','would','could','should','about','one','do','does'])
const tokens = text => new Set(normalise(text).split(' ').filter(word => word.length > 3 && !stop.has(word)))
const jaccard = (a, b) => {
  const left = tokens(a)
  const right = tokens(b)
  if (!left.size || !right.size) return 0
  let shared = 0
  left.forEach(token => { if (right.has(token)) shared += 1 })
  return shared / (left.size + right.size - shared)
}

function auditPool(category, mode, prompts, isConversation) {
  const label = `${category.id}/${mode}`
  console.log(`${label}: ${prompts.length}`)
  if (prompts.length !== TARGET_PER_MODE) errors.push(`${label}: expected ${TARGET_PER_MODE}, found ${prompts.length}`)

  const local = new Set()
  const openers = new Map()
  for (const prompt of prompts) {
    const optionText = prompt.options?.join(' ') || prompt.statements?.join(' ') || ''
    const key = normalise(`${prompt.text} ${optionText}`)
    if (!key) errors.push(`${label}: empty prompt`)
    if (local.has(key)) errors.push(`${label}: exact duplicate: ${prompt.text}`)
    local.add(key)

    const previous = globalSeen[mode].get(key)
    if (previous && previous !== category.id) errors.push(`${label}: copied from ${previous}: ${prompt.text}`)
    else globalSeen[mode].set(key, category.id)

    if (prompt.text.length < 12) errors.push(`${label}: too short: ${prompt.text}`)
    if (prompt.text.length > 520) errors.push(`${label}: too long: ${prompt.text.slice(0, 120)}`)
    if (/\bundefined\b|\bnull\b|\{topic\}|\{[^}]+\}/i.test(prompt.text)) errors.push(`${label}: malformed interpolation: ${prompt.text}`)
    if (/\?\?+|\.\.+|\s{3,}/.test(prompt.text)) errors.push(`${label}: malformed punctuation: ${prompt.text}`)
    if (/\babi\b|\bsha\b|\bsef\b|\bdey\b|\bwey\b|\bna\b/i.test(prompt.text)) errors.push(`${label}: pidgin slipped into copy: ${prompt.text}`)

    if (isConversation) {
      const opener = normalise(prompt.text).split(' ').slice(0, 5).join(' ')
      openers.set(opener, (openers.get(opener) || 0) + 1)
      if (!prompt.tags?.includes('nigeria-first')) errors.push(`${label}: missing Nigeria-first tag`)
    }
  }

  if (isConversation) {
    const maxOpener = Math.max(...openers.values())
    if (maxOpener > 75) errors.push(`${label}: one five-word opener appears ${maxOpener} times`)
  }

  const sample = prompts.filter((_, index) => index % 4 === 0).slice(0, 150)
  for (let i = 0; i < sample.length; i += 1) {
    for (let j = i + 1; j < sample.length; j += 1) {
      const score = jaccard(sample[i].text, sample[j].text)
      if (score >= 0.94 && normalise(sample[i].text) !== normalise(sample[j].text)) {
        errors.push(`${label}: strong near-duplicate ${score.toFixed(2)}: ${sample[i].text} / ${sample[j].text}`)
        if (errors.length > 120) return
      }
    }
  }

  ;[0, 137, 389, 641].filter(index => index < prompts.length).forEach(index => {
    console.log(`sample ${label}/${index}: ${prompts[index].text.replaceAll('\n', ' | ')}`)
  })
}

for (const category of conversationCategories) {
  for (const mode of modes) auditPool(category, mode, getNigeriaFirstPrompts(category.id, mode), true)
}

for (const category of gameCategories) {
  for (const mode of modes) {
    const prompts = getNigeriaFirstPrompts(category.id, mode)
    auditPool(category, mode, prompts, false)
    if (category.id === 'truth-dare') {
      const truth = prompts.filter(prompt => prompt.subtype === 'Truth').length
      const dare = prompts.filter(prompt => prompt.subtype === 'Dare').length
      if (truth !== 375 || dare !== 375) errors.push(`${category.id}/${mode}: expected Truth 375 and Dare 375, found ${truth}/${dare}`)
    }
  }
}

for (const mode of modes) {
  const all = getAllNigeriaFirstPrompts(mode)
  const expected = (conversationCategories.length + gameCategories.length) * TARGET_PER_MODE
  console.log(`${mode} total: ${all.length}`)
  if (all.length !== expected) errors.push(`${mode}: expected total ${expected}, found ${all.length}`)
}

if (errors.length) {
  console.error(`Nigeria-first audit failed with ${errors.length} issue(s).`)
  errors.slice(0, 120).forEach(error => console.error(`- ${error}`))
  process.exit(1)
}

console.log('Nigeria-first 750 audit passed.')
