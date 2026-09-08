import { allCategories, conversationCategories, gameCategories } from './categories.js'
import { editorialConversations } from './editorial-conversations.js'
import { newGameIds, newGamePrompts } from './editorial/new-games.js'
import { structuredOptionGames } from './editorial/structured-option-games.js'
import { getPrompts as getLegacyPrompts } from './prompts.js'

const conversationIds = new Set(conversationCategories.map(category => category.id))
const cache = new Map()

const stagesByIntensity = {
  Chill: ['Talking Stage', 'New Relationship', 'Been Together a While'],
  Interesting: ['New Relationship', 'Been Together a While', 'Long-Term'],
  Deep: ['Been Together a While', 'Long-Term', 'Married'],
  Flirty: ['Talking Stage', 'New Relationship', 'Been Together a While'],
  Spicy: ['New Relationship', 'Been Together a While', 'Long-Term', 'Married'],
  'No Filter': ['Talking Stage', 'New Relationship', 'Been Together a While', 'Long-Term', 'Married'],
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

function makeNewGamePrompts(categoryId, mode) {
  const cacheKey = `new-game:${categoryId}:${mode}`
  if (cache.has(cacheKey)) return cache.get(cacheKey)

  const category = gameCategories.find(item => item.id === categoryId)
  const cards = structuredOptionGames[categoryId]?.[mode] || newGamePrompts[categoryId]?.[mode] || []
  if (!category) return []

  const prompts = cards.map((card, index) => {
    const intensity = mode === 'relationship'
      ? ['Chill', 'Interesting', 'Deep', 'Flirty'][index % 4]
      : ['Chill', 'Interesting', 'Deep', 'No Filter'][index % 4]

    const optionText = card.options?.length ? `\n\n${card.options.join(' · ')}` : ''
    const displayText = `${card.text}${optionText}`

    return {
      id: `editorial-game-${categoryId}-${mode}-${index}`,
      categoryId,
      categoryName: category.name,
      mode,
      text: displayText,
      copyText: displayText,
      intensity,
      stage: mode === 'relationship' ? relationshipStage(intensity, index) : null,
      audience: 'General',
      faithType: null,
      subtype: null,
      mechanic: category.mechanic,
      options: card.options || null,
      responseLabels: categoryId === 'agree-disagree'
        ? ['Agree', 'Disagree']
        : categoryId === 'red-green-depends'
          ? ['Red Flag', 'Green Flag', 'Depends']
          : categoryId === 'petty-or-valid'
            ? ['Petty', 'Valid', 'Both']
            : null,
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