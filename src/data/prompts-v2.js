import { allCategories, conversationCategories } from './categories.js'
import { editorialConversations } from './editorial-conversations.js'
import { getPrompts as getLegacyPrompts } from './prompts.js'

const conversationIds = new Set(conversationCategories.map(category => category.id))
const cache = new Map()

function isChristianPrompt(text) {
  return /\b(Jesus|Christ|Christian|Scripture|Bible|church|prayer|God|theology|faith)\b/i.test(text)
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
        stage: mode === 'relationship' ? 'All stages' : null,
        audience: intensity === 'Spicy' ? '18+' : 'General',
        faithType,
        subtype: null,
        tags: [
          category.name.toLowerCase(),
          mode,
          intensity.toLowerCase(),
          'editorial',
        ],
      })
      index += 1
    })
  })

  cache.set(cacheKey, prompts)
  return prompts
}

export function getPrompts(categoryId, mode) {
  if (conversationIds.has(categoryId)) {
    return makeEditorialPrompts(categoryId, mode)
  }
  return getLegacyPrompts(categoryId, mode)
}

export function getAllPrompts(mode) {
  return allCategories.flatMap(category => getPrompts(category.id, mode))
}
