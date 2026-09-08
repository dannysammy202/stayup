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
