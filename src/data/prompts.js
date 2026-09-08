import {
  getAllNigeriaFirstPrompts,
  getNigeriaFirstPrompts,
} from './nigeria-first/index.js'

export function getPrompts(categoryId, mode) {
  return getNigeriaFirstPrompts(categoryId, mode)
}

export function getAllPrompts(mode) {
  return getAllNigeriaFirstPrompts(mode)
}
