export const TARGET_PER_MODE = 750
export const TRUTH_DARE_TARGET_PER_SUBTYPE = 750

export const friendIntensitiesNg = ['Chill', 'Interesting', 'Deep', 'No Filter']
export const relationshipIntensitiesNg = ['Chill', 'Interesting', 'Deep', 'Flirty', 'Spicy', 'No Filter']

export const relationshipStagesNg = [
  'Talking Stage',
  'New Relationship',
  'Been Together a While',
  'Long-Term',
  'Married',
]

export function normalise(text) {
  return String(text)
    .toLowerCase()
    .replace(/[“”‘’'".,!?():;\-–—]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function uniqueByText(items) {
  const seen = new Set()
  const out = []
  for (const item of items) {
    const optionText = item.options?.join(' ') || item.statements?.join(' ') || ''
    const key = normalise(`${item.text} ${optionText}`)
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(item)
  }
  return out
}

export function deterministicShuffle(items, salt = 17) {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = (i * 37 + salt * 53 + (i % 11) * 7) % (i + 1)
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export function takeTarget(items, target = TARGET_PER_MODE, salt = 17) {
  const unique = uniqueByText(items)
  if (unique.length < target) {
    throw new Error(`Nigeria-first pool needs ${target} unique prompts, found ${unique.length}`)
  }
  return deterministicShuffle(unique, salt).slice(0, target)
}

export function combinations(items, size) {
  const out = []
  const walk = (start, current) => {
    if (current.length === size) {
      out.push([...current])
      return
    }
    for (let i = start; i <= items.length - (size - current.length); i += 1) {
      current.push(items[i])
      walk(i + 1, current)
      current.pop()
    }
  }
  walk(0, [])
  return out
}

export function rotate(items, offset) {
  if (!items.length) return []
  const n = ((offset % items.length) + items.length) % items.length
  return [...items.slice(n), ...items.slice(0, n)]
}

export function intensityFor(mode, index) {
  const values = mode === 'relationship' ? relationshipIntensitiesNg : friendIntensitiesNg
  return values[index % values.length]
}

export function stageFor(index) {
  return relationshipStagesNg[index % relationshipStagesNg.length]
}

export function audienceFor(intensity) {
  return intensity === 'Spicy' ? '18+' : 'General'
}

export function renderTemplate(template, topic) {
  return template.replaceAll('{topic}', topic)
}

export function roundRobinTopicPrompts(topics, templates, perTopic = 4) {
  const rows = []
  topics.forEach((topic, topicIndex) => {
    const start = topicIndex % templates.length
    for (let n = 0; n < perTopic; n += 1) {
      const template = templates[(start + n * 5) % templates.length]
      rows.push({ text: renderTemplate(template, topic), sourceTopic: topic })
    }
  })
  return rows
}
