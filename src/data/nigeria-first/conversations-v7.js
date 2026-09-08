import { buildNigeriaConversationPrompts as buildV6NigeriaConversationPrompts, nigeriaConversationCategoryIds } from './conversations-v6.js'
import { normalise } from './helpers.js'

const replacements = [
  [
    'Which do you think would shape a serious relationship more: having to greet older relatives properly or parents having a favourite way to discipline you?',
    'How do you think the way your family handled respect and discipline affects what you expect from a serious relationship?'
  ],
  [
    'Which one tells me more about the life you had back then: the kind of music you play when cleaning or the Nigerian artist you think gives the best live performance?',
    'What kind of music did you hear around the house growing up, and what does it remind you of now?'
  ],
  [
    'Which one would tell me more about how your family works: being punctual when everybody else expects lateness or being generous without showing people?',
    'Which did your family emphasise more growing up: being punctual or being generous without making a show of it?'
  ],
  [
    'Which are you choosing first: jollof rice versus fried rice or sharing food versus ordering separately?',
    'Which food debate gets you talking faster: jollof versus fried rice, or whether food should always be shared?'
  ],
  [
    'Which would cause more everyday tension: having colleagues who become friends or job interviews?',
    'Which affects your day-to-day relationship rhythm more: close friendships with colleagues or the stress of job interviews?'
  ],
  [
    'What is one lesson you took from parents having a favourite way to discipline you that eating together as a family did not teach you?',
    'When you think about discipline and family meals growing up, which one tells me more about the home you came from?'
  ]
]

function polish(text) {
  let out = text
  for (const [from, to] of replacements) {
    if (out.includes(from)) out = out.replace(from, to)
  }
  return out
}

function makeDuplicateDistinct(text, count) {
  const colon = text.indexOf(': ')
  const core = colon >= 0 ? text.slice(colon + 2) : text
  const variants = [
    `Another angle: ${core}`,
    `Think about a different part of it: ${core}`,
    `From another side: ${core}`,
    `One more way to look at it: ${core}`
  ]
  return variants[(count - 1) % variants.length]
}

export function buildNigeriaConversationPrompts(categoryId, mode) {
  const base = buildV6NigeriaConversationPrompts(categoryId, mode)
  const seen = new Map()
  return base.map(prompt => {
    let text = polish(prompt.text)
    const key = normalise(text)
    const count = (seen.get(key) || 0) + 1
    seen.set(key, count)
    if (count > 1) text = makeDuplicateDistinct(text, count)
    return { ...prompt, text, copyText: text }
  })
}

export { nigeriaConversationCategoryIds }
