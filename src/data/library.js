import gettingToKnowPublished from './editorial/published/getting-to-know-you.js'
import deepMeaningfulPublished from './editorial/published/deep-meaningful.js'
import funRandomFriend from './editorial/fun-random.friend.js'
import { structuredOptionGames } from './editorial/structured-option-games.js'
import { openGamePromptsPublished } from './editorial/open-games-published.js'
import funRandomRelationship from './complete/fun-random.relationship.js'
import { curatedNormalCards } from './complete/curated-normal.js'
import { supplementalNormalCards } from './complete/supplemental-normal.js'
import { curatedGameCards } from './complete/curated-games-v2.js'
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

function hashNumber(value) {
  let out = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    out ^= value.charCodeAt(index)
    out = Math.imul(out, 16777619)
  }
  return out >>> 0
}

function hash(value) {
  return hashNumber(value).toString(36)
}

function normalise(value = '') {
  return value
    .toLowerCase()
    .replace(/[“”‘’'".,!?():;\/\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function signature(item) {
  return normalise(`${item.text || ''} ${(item.options || []).join(' ')} ${item.subtype || ''}`)
}

function deterministicUniqueTake(items, target, salt) {
  const seen = new Set()
  const unique = []
  for (const item of items) {
    const key = signature(item)
    if (!key || seen.has(key)) continue
    seen.add(key)
    unique.push(item)
  }
  if (unique.length < target) {
    throw new Error(`${salt}: expected at least ${target} unique cards, found ${unique.length}`)
  }
  return unique
    .map((item, index) => ({ item, score: hashNumber(`${salt}|${index}|${signature(item)}`) }))
    .sort((a, b) => a.score - b.score)
    .slice(0, target)
    .map(entry => entry.item)
}

function inferStages(text, intensity) {
  const value = normalise(text)
  const lateSignals = ['marry', 'marriage', 'married', 'children', 'kids', 'wedding', 'spouse', 'husband', 'wife', 'raise a family', 'in laws', 'in-laws']
  const establishedSignals = ['our future', 'long term', 'long-term', 'relocat', 'family boundar', 'money together', 'joint finances', 'living together', 'build together', 'engagement']
  const earlySignals = ['first date', 'first met', 'first impression', 'starting to like', 'talking stage', 'new relationship', 'caught your attention', 'first caught']

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

function makeCard({ categoryId, mode, text, intensity, options, audience, stages, stage, subtype, source = 'authored', mechanic }) {
  const cleanOptions = Array.isArray(options) ? options.filter(Boolean) : []
  const resolvedIntensity = intensity || 'Interesting'
  const stageText = `${text || ''} ${cleanOptions.join(' ')}`
  const resolvedStages = mode === 'relationship'
    ? (Array.isArray(stages) && stages.length ? stages : stage ? [stage] : inferStages(stageText, resolvedIntensity))
    : []
  const identity = `${categoryId}|${mode}|${text}|${cleanOptions.join('|')}|${subtype || ''}`
  return {
    id: `${categoryId}-${mode}-${hash(identity)}`,
    categoryId,
    mode,
    text: String(text || '').trim(),
    intensity: resolvedIntensity,
    options: cleanOptions,
    audience: audience || (resolvedIntensity === 'Spicy' ? '18+' : 'general'),
    stages: resolvedStages,
    subtype: subtype || null,
    source,
    mechanic: mechanic || categoryById[categoryId]?.mechanic || 'conversation',
    tags: tagsFor(categoryId, String(text || ''), cleanOptions),
  }
}

function flattenGroups(groups) {
  if (!groups) return []
  if (Array.isArray(groups)) {
    const out = []
    groups.forEach(group => {
      if (typeof group === 'string') {
        out.push({ text: group })
        return
      }
      if (Array.isArray(group?.prompts)) {
        group.prompts.forEach(text => out.push({
          text,
          intensity: group.intensity,
          stage: group.stage,
          audience: group.audience,
          stages: group.stages,
        }))
        return
      }
      if (group?.text) out.push(group)
    })
    return out
  }
  return Object.entries(groups).flatMap(([intensity, prompts]) =>
    (prompts || []).map(text => ({ text, intensity })),
  )
}

function normalConversationSource(categoryId, mode) {
  if (categoryId === 'getting-to-know-you') return flattenGroups(gettingToKnowPublished[mode])
  if (categoryId === 'deep-meaningful') return flattenGroups(deepMeaningfulPublished[mode])
  if (categoryId === 'fun-random') return mode === 'friend' ? flattenGroups(funRandomFriend) : flattenGroups(funRandomRelationship)
  if (supplementalNormalCards[categoryId]) return supplementalNormalCards[categoryId][mode]
  return curatedNormalCards[categoryId]?.[mode] || []
}

function buildConversationCards() {
  const cards = []
  for (const category of conversationCategories) {
    for (const mode of ['friend', 'relationship']) {
      const raw = normalConversationSource(category.id, mode)
      const selected = deterministicUniqueTake(raw, 750, `${category.id}:${mode}:conversation`)
      selected.forEach((item, index) => {
        const intensity = item.intensity || (mode === 'friend'
          ? FRIEND_INTENSITIES[index % FRIEND_INTENSITIES.length]
          : RELATIONSHIP_INTENSITIES[index % RELATIONSHIP_INTENSITIES.length])
        cards.push(makeCard({
          ...item,
          categoryId: category.id,
          mode,
          intensity,
          source: 'editorial-complete',
        }))
      })
    }
  }
  return cards
}

const structuredIds = new Set(Object.keys(structuredOptionGames))
const openIds = new Set(Object.keys(openGamePromptsPublished))

function rawGameSource(categoryId, mode) {
  if (curatedGameCards[categoryId]) return curatedGameCards[categoryId][mode]
  if (structuredIds.has(categoryId)) return structuredOptionGames[categoryId][mode]
  if (openIds.has(categoryId)) return openGamePromptsPublished[categoryId][mode]
  return []
}

function buildGameCards() {
  const cards = []
  for (const category of gameCategories) {
    for (const mode of ['friend', 'relationship']) {
      const target = category.id === 'truth-dare' ? 1000 : 750
      let raw = rawGameSource(category.id, mode)
      if (category.id === 'truth-dare') {
        const truths = deterministicUniqueTake(raw.filter(card => card.subtype === 'Truth'), 500, `${category.id}:${mode}:truth`)
        const dares = deterministicUniqueTake(raw.filter(card => card.subtype === 'Dare'), 500, `${category.id}:${mode}:dare`)
        raw = [...truths, ...dares]
      } else {
        raw = deterministicUniqueTake(raw, target, `${category.id}:${mode}:game`)
      }
      raw.forEach((item, index) => {
        const intensity = item.intensity || (mode === 'friend'
          ? FRIEND_INTENSITIES[index % FRIEND_INTENSITIES.length]
          : RELATIONSHIP_INTENSITIES[index % RELATIONSHIP_INTENSITIES.length])
        cards.push(makeCard({
          ...item,
          categoryId: category.id,
          mode,
          intensity,
          source: 'editorial-game-complete',
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

if (cardsById.size !== cards.length) {
  throw new Error(`StayUp card id collision: ${cards.length - cardsById.size} duplicate ids`)
}

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
  if (card.categoryId === 'this-or-that') return card.text
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
