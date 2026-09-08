import { allCategories, conversationCategories, gameCategories } from '../categories.js'
import { buildNigeriaConversationPrompts, nigeriaConversationCategoryIds } from './conversations-v9.js'
import { buildNigeriaGamePrompts, nigeriaGameCategoryIds } from './games-v7.js'

const conversationIds = new Set(conversationCategories.map(item => item.id))
const gameIds = new Set(gameCategories.map(item => item.id))

export function getNigeriaFirstPrompts(categoryId, mode) {
  if (conversationIds.has(categoryId) && nigeriaConversationCategoryIds.has(categoryId)) {
    return buildNigeriaConversationPrompts(categoryId, mode)
  }
  if (gameIds.has(categoryId) && nigeriaGameCategoryIds.has(categoryId)) {
    return buildNigeriaGamePrompts(categoryId, mode)
  }
  return []
}

export function getAllNigeriaFirstPrompts(mode) {
  return allCategories.flatMap(category => getNigeriaFirstPrompts(category.id, mode))
}
