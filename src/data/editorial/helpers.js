export function lines(value) {
  return value
    .trim()
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
}

export function countGroups(groups) {
  return Object.values(groups).reduce((sum, prompts) => sum + prompts.length, 0)
}

export function mergeGroups(...parts) {
  const merged = {}
  for (const part of parts) {
    for (const [group, prompts] of Object.entries(part)) {
      merged[group] = [...(merged[group] || []), ...prompts]
    }
  }
  return merged
}

export function publishGroups(groups, plan) {
  const published = {}
  for (const [group, count] of Object.entries(plan)) {
    const source = groups[group] || []
    if (source.length < count) {
      throw new Error(`${group} requires ${count} prompts but only ${source.length} are authored`)
    }
    published[group] = source.slice(0, count)
  }
  return published
}

export function publishBalanced(groups, target = 1000) {
  const names = Object.keys(groups)
  if (!names.length) throw new Error('No prompt groups supplied')
  const total = countGroups(groups)
  if (total < target) throw new Error(`Need ${target} authored prompts but only ${total} are available`)

  const published = Object.fromEntries(names.map(name => [name, []]))
  let remaining = target
  let cursor = 0

  while (remaining > 0) {
    let addedThisPass = 0
    for (const name of names) {
      if (remaining <= 0) break
      const source = groups[name]
      if (cursor < source.length) {
        published[name].push(source[cursor])
        remaining -= 1
        addedThisPass += 1
      }
    }
    if (!addedThisPass) throw new Error(`Unable to publish ${target} prompts from supplied groups`)
    cursor += 1
  }

  return published
}

export function replacePrompts(groups, replacements) {
  const next = Object.fromEntries(Object.entries(groups).map(([name, prompts]) => [name, [...prompts]]))
  for (const [oldPrompt, newPrompt] of Object.entries(replacements)) {
    let replaced = false
    for (const name of Object.keys(next)) {
      const index = next[name].indexOf(oldPrompt)
      if (index !== -1) {
        next[name][index] = newPrompt
        replaced = true
        break
      }
    }
    if (!replaced) throw new Error(`Published prompt replacement target not found: ${oldPrompt}`)
  }
  return next
}
