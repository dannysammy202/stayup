import { allCategories, conversationCategories, gameCategories } from './categories.js'
import { editorialConversations } from './editorial-conversations.js'
import { newGameIds } from './editorial/new-games.js'
import { structuredOptionGamesFinal } from './editorial/structured-option-games-final.js'
import { openGameIdsPublished, openGamePromptsPublished } from './editorial/open-games-published.js'
import { getPrompts as getLegacyPrompts } from './prompts.js'

const conversationIds = new Set(conversationCategories.map(category => category.id))
const structuredOptionIds = new Set(Object.keys(structuredOptionGamesFinal))
const cache = new Map()

const stagesByIntensity = {
  Chill: ['Talking Stage', 'New Relationship', 'Been Together a While'],
  Interesting: ['New Relationship', 'Been Together a While', 'Long-Term'],
  Deep: ['Been Together a While', 'Long-Term', 'Married'],
  Flirty: ['Talking Stage', 'New Relationship', 'Been Together a While'],
  Spicy: ['New Relationship', 'Been Together a While', 'Long-Term', 'Married'],
  'No Filter': ['Talking Stage', 'New Relationship', 'Been Together a While', 'Long-Term', 'Married'],
}

const verdictLabels = {
  'agree-disagree': ['Agree', 'Disagree'],
  'red-green-depends': ['Red Flag', 'Green Flag', 'Depends'],
  'petty-or-valid': ['Petty', 'Valid', 'Both'],
}

function isChristianPrompt(text) {
  return /\b(Jesus|Christ|Christian|Scripture|Bible|church|prayer|God|theology|faith)\b/i.test(text)
}

function relationshipStage(intensity, index) {
  const stages = stagesByIntensity[intensity] || stagesByIntensity.Interesting
  return stages[index % stages.length]
}

function makeEditorialPrompts(categoryId, mode) {
  const cacheKey = `${categoryId}:${mode}`
  if (cache.has(cacheKey)) return cache.get(cacheKey)

  const category = conversationCategories.find(item => item.id === categoryId)
  const groups = editorialConversations[categoryId]?.[mode]
  if (!category || !groups) return []

  const prompts = []
  let index = 0

  Object.entries(groups).forEach(([intensity, texts]) => {
    texts.forEach(text => {
      const faithType = categoryId === 'faith-spirituality'
        ? isChristianPrompt(text) ? 'Christian' : 'General Spirituality'
        : null

      prompts.push({
        id: `editorial-${categoryId}-${mode}-${index}`,
        categoryId,
        categoryName: category.name,
        mode,
        text,
        copyText: text,
        intensity,
        stage: mode === 'relationship' ? relationshipStage(intensity, index) : null,
        audience: intensity === 'Spicy' ? '18+' : 'General',
        faithType,
        subtype: null,
        tags: [category.name.toLowerCase(), mode, intensity.toLowerCase(), 'editorial'],
      })
      index += 1
    })
  })

  cache.set(cacheKey, prompts)
  return prompts
}

function sourceCards(categoryId, mode) {
  if (structuredOptionIds.has(categoryId)) return structuredOptionGamesFinal[categoryId]?.[mode] || []
  if (openGameIdsPublished.has(categoryId)) return openGamePromptsPublished[categoryId]?.[mode] || []
  return []
}

function choiceLines(categoryId, options) {
  if (!options?.length) return ''
  const numeric = categoryId === 'rank-these'
  return options.map((option, index) => `${numeric ? `${index + 1}.` : `${String.fromCharCode(65 + index)}.`} ${option}`).join('\n')
}

function makeNewGamePrompts(categoryId, mode) {
  const cacheKey = `new-game:${categoryId}:${mode}`
  if (cache.has(cacheKey)) return cache.get(cacheKey)

  const category = gameCategories.find(item => item.id === categoryId)
  const cards = sourceCards(categoryId, mode)
  if (!category) return []

  const prompts = cards.map((card, index) => {
    const intensity = mode === 'relationship'
      ? ['Chill', 'Interesting', 'Deep', 'Flirty'][index % 4]
      : ['Chill', 'Interesting', 'Deep', 'No Filter'][index % 4]

    const choices = choiceLines(categoryId, card.options)
    const labels = verdictLabels[categoryId] || null
    const displayExtra = choices || labels?.join('  ·  ') || ''
    const displayText = displayExtra ? `${card.text}\n\n${displayExtra}` : card.text
    const copyExtra = card.options?.length ? card.options.join(' · ') : labels?.join(' · ') || ''
    const copyText = copyExtra ? `${card.text}\n\n${copyExtra}` : card.text

    return {
      id: `editorial-game-${categoryId}-${mode}-${index}`,
      categoryId,
      categoryName: category.name,
      mode,
      text: displayText,
      copyText,
      intensity,
      stage: mode === 'relationship' ? relationshipStage(intensity, index) : null,
      audience: 'General',
      faithType: null,
      subtype: null,
      mechanic: category.mechanic,
      options: card.options || null,
      responseLabels: labels,
      tags: [category.name.toLowerCase(), mode, intensity.toLowerCase(), 'editorial-game'],
    }
  })

  cache.set(cacheKey, prompts)
  return prompts
}

export function getPrompts(categoryId, mode) {
  if (conversationIds.has(categoryId)) return makeEditorialPrompts(categoryId, mode)
  if (newGameIds.has(categoryId)) return makeNewGamePrompts(categoryId, mode)
  return getLegacyPrompts(categoryId, mode)
}

export function getAllPrompts(mode) {
  return allCategories.flatMap(category => getPrompts(category.id, mode))
}
