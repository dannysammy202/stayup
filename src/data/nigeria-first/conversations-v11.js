import {
  buildNigeriaConversationPrompts as buildV10NigeriaConversationPrompts,
  nigeriaConversationCategoryIds,
} from './conversations-v10.js'

const pairOpeners = [
  'Start with your first instinct.',
  'Think about your own experience.',
  'Go with the answer that comes first.',
  'Answer from your own life.',
  'Pick the one that feels truest.',
  'Think about what fits you best.',
  'Go with what feels most familiar.',
  'Take this from your own experience.',
  'Choose before you overthink it.',
  'Think about the version of you today.',
  'Answer the way you would with a close friend.',
  'Start with what feels most natural.',
  'Go with the one you would explain first.',
  'Think about what has mattered more.',
  'Answer from the life you have lived.',
  'Take the question at face value.',
  'Start with the answer you trust most.',
  'Think about which side sounds more like you.',
  'Go with the answer you would defend.',
  'Choose the one you feel more strongly about.',
  'Start with the story behind your answer.',
  'Think about what your friends already know.',
  'Go with the answer you would give quickly.',
  'Answer from what you have seen for yourself.',
]

const properNouns = [
  ['lagos','Lagos'], ['abuja','Abuja'], ['ibadan','Ibadan'], ['abeokuta','Abeokuta'], ['ilorin','Ilorin'],
  ['enugu','Enugu'], ['calabar','Calabar'], ['kano','Kano'], ['jos','Jos'], ['benin city','Benin City'],
  ['port harcourt','Port Harcourt'], ['nigeria','Nigeria'], ['nigerian','Nigerian'], ['whatsapp','WhatsApp'],
  ['blackberry','BlackBerry'], ['youtube','YouTube'], ['nollywood','Nollywood'], ['afrobeats','Afrobeats'],
  ['bluetooth','Bluetooth'], ['opera mini','Opera Mini'], ['big brother naija','Big Brother Naija'],
  ['papa ajasco','Papa Ajasco'], ['nysc','NYSC'], ['siwes','SIWES'], ['jamb','JAMB'], ['waec','WAEC'], ['neco','NECO'],
]

function hashText(value) {
  let hash = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function cleanCopy(text) {
  let out = text.replace(/\b([A-Za-z]+) s\b/g, '$1’s')
  for (const [plain, display] of properNouns) {
    out = out.replace(new RegExp(`\\b${escapeRegExp(plain)}\\b`, 'gi'), display)
  }
  return out
}

function polishPrompt(prompt) {
  let text = cleanCopy(prompt.text)
  if (prompt.categoryId !== 'faith-spirituality' && prompt.semanticSourceKey?.startsWith('pair:')) {
    const opener = pairOpeners[hashText(`${prompt.categoryId}:${prompt.mode}:${prompt.semanticSourceKey}`) % pairOpeners.length]
    text = `${opener} ${text}`
  }
  return text === prompt.text ? prompt : { ...prompt, text, copyText: text }
}

const cache = new Map()

export function buildNigeriaConversationPrompts(categoryId, mode) {
  const key = `${categoryId}:${mode}`
  if (!cache.has(key)) cache.set(key, buildV10NigeriaConversationPrompts(categoryId, mode).map(polishPrompt))
  return cache.get(key)
}

export { nigeriaConversationCategoryIds }
