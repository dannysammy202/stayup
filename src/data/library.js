import { editorialConversations } from './editorial-conversations.js'
import gettingToKnowPublished from './editorial/published/getting-to-know-you.js'
import deepMeaningfulPublished from './editorial/published/deep-meaningful.js'
import funRandomFriend from './editorial/fun-random.friend.js'
import { newGamePrompts } from './editorial/new-games.js'
import { foundationGamePrompts } from './foundation-games.js'
import {
  FRIEND_INTENSITIES,
  RELATIONSHIP_INTENSITIES,
  RELATIONSHIP_STAGES,
  categoryById,
  conversationCategories,
  gameCategories,
} from './catalog.js'

const ALL_STAGES = RELATIONSHIP_STAGES
const EARLY_STAGES = ['Talking Stage', 'New Relationship']
const ESTABLISHED_STAGES = ['Been Together a While', 'Long-Term Relationship', 'Married']
const LATE_STAGES = ['Long-Term Relationship', 'Married']

function hash(value) {
  let out = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    out ^= value.charCodeAt(index)
    out = Math.imul(out, 16777619)
  }
  return (out >>> 0).toString(36)
}

function normalise(value = '') {
  return value
    .toLowerCase()
    .replace(/[“”‘’'".,!?():;\/\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function balancedTake(groups, target = 750) {
  const entries = Object.entries(groups || {}).filter(([, prompts]) => Array.isArray(prompts) && prompts.length)
  const total = entries.reduce((sum, [, prompts]) => sum + prompts.length, 0)
  if (total <= target) return Object.fromEntries(entries)

  const output = Object.fromEntries(entries.map(([name]) => [name, []]))
  let cursor = 0
  let remaining = target
  while (remaining > 0) {
    let added = 0
    for (const [name, prompts] of entries) {
      if (!remaining) break
      if (cursor < prompts.length) {
        output[name].push(prompts[cursor])
        remaining -= 1
        added += 1
      }
    }
    if (!added) break
    cursor += 1
  }
  return output
}

function inferStages(text, intensity) {
  const value = normalise(text)
  const lateSignals = ['marry', 'marriage', 'married', 'children', 'kids', 'wedding', 'home together', 'raise a family', 'retire', 'in laws']
  const establishedSignals = ['our future', 'long term', 'relocat', 'family boundar', 'money together', 'joint', 'living together', 'build together']
  const earlySignals = ['first date', 'first met', 'first impression', 'starting to like', 'talking stage', 'new relationship', 'caught your attention']

  if (lateSignals.some(signal => value.includes(signal))) return LATE_STAGES
  if (establishedSignals.some(signal => value.includes(signal))) return ESTABLISHED_STAGES
  if (earlySignals.some(signal => value.includes(signal))) return [...EARLY_STAGES, 'Been Together a While']
  if (intensity === 'Flirty') return ['Talking Stage', 'New Relationship', 'Been Together a While', 'Long-Term Relationship']
  return ALL_STAGES
}

function tagsFor(categoryId, text, options = []) {
  const category = categoryById[categoryId]
  const source = `${text} ${options.join(' ')} ${(category?.tags || []).join(' ')} ${category?.name || ''}`
  return [...new Set(normalise(source).split(' ').filter(word => word.length > 2))]
}

function makeCard({ categoryId, mode, text, intensity, options, audience, stages, subtype, source = 'authored', mechanic }) {
  const cleanOptions = Array.isArray(options) ? options.filter(Boolean) : []
  const identity = `${categoryId}|${mode}|${text}|${cleanOptions.join('|')}|${subtype || ''}`
  return {
    id: `${categoryId}-${mode}-${hash(identity)}`,
    categoryId,
    mode,
    text: text.trim(),
    intensity,
    options: cleanOptions,
    audience: audience || (intensity === 'Spicy' ? '18+' : 'general'),
    stages: mode === 'relationship' ? (stages?.length ? stages : inferStages(text, intensity)) : [],
    subtype: subtype || null,
    source,
    mechanic: mechanic || categoryById[categoryId]?.mechanic || 'conversation',
    tags: tagsFor(categoryId, text, cleanOptions),
  }
}

function authoredConversationGroups(categoryId, mode) {
  if (categoryId === 'getting-to-know-you') return gettingToKnowPublished[mode] || {}
  if (categoryId === 'deep-meaningful') return deepMeaningfulPublished[mode] || {}
  if (categoryId === 'fun-random' && mode === 'friend') return funRandomFriend
  return editorialConversations[categoryId]?.[mode] || {}
}

function buildConversationCards() {
  const cards = []
  for (const category of conversationCategories) {
    for (const mode of ['friend', 'relationship']) {
      const groups = balancedTake(authoredConversationGroups(category.id, mode), 750)
      for (const [intensity, prompts] of Object.entries(groups)) {
        prompts.forEach(text => {
          cards.push(makeCard({
            categoryId: category.id,
            mode,
            text,
            intensity,
            source: ['getting-to-know-you', 'deep-meaningful'].includes(category.id) || (category.id === 'fun-random' && mode === 'friend')
              ? 'editorial-large'
              : 'editorial-seed',
          }))
        })
      }
    }
  }
  return cards
}

function mergeGameSeeds(categoryId, mode) {
  const raw = [
    ...(foundationGamePrompts[categoryId]?.[mode] || []),
    ...(newGamePrompts[categoryId]?.[mode] || []),
  ]
  const seen = new Set()
  return raw.filter(card => {
    const key = normalise(`${card.text} ${(card.options || []).slice().sort().join(' ')}`)
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function defaultGameIntensity(mode, index) {
  const values = mode === 'friend'
    ? FRIEND_INTENSITIES
    : RELATIONSHIP_INTENSITIES.filter(value => value !== 'Spicy')
  return values[index % values.length]
}

function buildGameCards() {
  const cards = []
  for (const category of gameCategories) {
    for (const mode of ['friend', 'relationship']) {
      mergeGameSeeds(category.id, mode).forEach((item, index) => {
        const intensity = item.intensity || defaultGameIntensity(mode, index)
        cards.push(makeCard({
          categoryId: category.id,
          mode,
          text: item.text,
          options: item.options,
          intensity,
          audience: item.audience,
          stages: item.stages,
          subtype: item.subtype,
          source: 'editorial-game',
          mechanic: category.mechanic,
        }))
      })
    }
  }
  return cards
}

const conversationCards = buildConversationCards()
const gameCards = buildGameCards()
const cards = [...conversationCards, ...gameCards]
const cardsById = new Map(cards.map(card => [card.id, card]))

export function getCardById(id) {
  return cardsById.get(id) || null
}

export function getCards({
  categoryId,
  mode,
  intensity = 'All',
  stage = 'All',
  allow18 = false,
  subtype = 'All',
} = {}) {
  return cards.filter(card => {
    if (categoryId && card.categoryId !== categoryId) return false
    if (mode && card.mode !== mode) return false
    if (intensity !== 'All' && card.intensity !== intensity) return false
    if (!allow18 && card.audience === '18+') return false
    if (mode === 'relationship' && stage !== 'All' && !card.stages.includes(stage)) return false
    if (subtype !== 'All' && card.subtype !== subtype) return false
    return true
  })
}

export function getAllCards(mode, allow18 = false) {
  return getCards({ mode, allow18 })
}

export function searchCards(query, { mode, stage = 'All', allow18 = false } = {}) {
  const terms = normalise(query).split(' ').filter(Boolean)
  if (!terms.length) return []
  return getCards({ mode, stage, allow18 }).filter(card => {
    const haystack = `${normalise(card.text)} ${normalise(card.options.join(' '))} ${card.tags.join(' ')}`
    return terms.every(term => haystack.includes(term))
  })
}

export function serialiseCard(card) {
  if (!card) return ''
  if (!card.options?.length) return card.text

  if (card.categoryId === 'this-or-that' && card.options.length === 2) {
    return `${card.options[0]} or ${card.options[1]}?`
  }

  const list = card.options.map((option, index) => `${index + 1}. ${option}`).join('\n')
  return `${card.text}\n${list}`
}

export function getCoverage() {
  return [...conversationCategories, ...gameCategories].map(category => {
    const friend = cards.filter(card => card.categoryId === category.id && card.mode === 'friend')
    const relationship = cards.filter(card => card.categoryId === category.id && card.mode === 'relationship')
    const result = {
      id: category.id,
      name: category.name,
      friend: friend.length,
      relationship: relationship.length,
      target: category.id === 'truth-dare' ? 1000 : 750,
    }
    if (category.id === 'truth-dare') {
      result.truth = {
        friend: friend.filter(card => card.subtype === 'Truth').length,
        relationship: relationship.filter(card => card.subtype === 'Truth').length,
      }
      result.dare = {
        friend: friend.filter(card => card.subtype === 'Dare').length,
        relationship: relationship.filter(card => card.subtype === 'Dare').length,
      }
    }
    return result
  })
}

export const librarySize = cards.length
