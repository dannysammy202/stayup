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
