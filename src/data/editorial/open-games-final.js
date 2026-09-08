import { openGamePrompts1000 } from './open-games-1000.js'

const G = (text, extra = {}) => ({ text, ...extra })
const normalise = value => value.toLowerCase().replace(/[“”‘’'".,!?():;\-]/g, ' ').replace(/\s+/g, ' ').trim()

function unique(cards, target = 1000) {
  const seen = new Set()
  const out = []
  for (const card of cards) {
    const key = normalise(`${card.text} ${(card.options || []).join(' ')}`)
    if (seen.has(key)) continue
    seen.add(key)
    out.push(card)
    if (out.length === target) return out
  }
  if (out.length < target) throw new Error(`Need ${target} unique cards, found ${out.length}`)
  return out
}

function capitalise(value) {
  return value ? `${value[0].toUpperCase()}${value.slice(1)}` : value
}

function polishAgree(text) {
  const rules = [
    [/^(.+) feels more affectionate than (.+)\.$/i, (_, a, b) => `For showing affection, I would choose ${a} over ${b}.`],
    [/^(.+) keeps a couple connected better than (.+)\.$/i, (_, a, b) => `For staying connected while apart, I would choose ${a} over ${b}.`],
    [/^(.+) keeps romance fresher than (.+)\.$/i, (_, a, b) => `For keeping romance fun, I would choose ${a} over ${b}.`],
    [/^(.+) helps a couple reconnect better than (.+)\.$/i, (_, a, b) => `After tension, I would choose ${a} before ${b} to reconnect.`],
    [/^(.+) is more entertaining than (.+)\.$/i, (_, a, b) => `For entertainment, I would choose ${a} over ${b}.`],
    [/^(.+) deserves more attention than (.+)\.$/i, (_, a, b) => `Between ${a} and ${b}, I would prioritise ${a}.`],
    [/^(.+) fixes a bad day faster than (.+)\.$/i, (_, a, b) => `On a bad day, I would reach for ${a} before ${b}.`],
    [/^(.+) is a better way to stay close than (.+)\.$/i, (_, a, b) => `For staying close, I would choose ${a} over ${b}.`],
    [/^(.+) improves a hangout more than (.+)\.$/i, (_, a, b) => `For a good hangout, I would choose ${a} over ${b}.`],
    [/^(.+) creates more security than (.+)\.$/i, (_, a, b) => `For relationship security, I would prioritise ${a} over ${b}.`],
    [/^(.+) matters more day to day than (.+)\.$/i, (_, a, b) => `Day to day in a relationship, I would prioritise ${a} over ${b}.`],
    [/^(.+) makes someone feel more appreciated than (.+)\.$/i, (_, a, b) => `For feeling appreciated, I would choose ${a} over ${b}.`],
    [/^(.+) stays attractive longer than (.+)\.$/i, (_, a, b) => `Long-term attraction: I would choose ${a} over ${b}.`],
    [/^(.+) would be a better routine for us than (.+)\.$/i, (_, a, b) => `As a couple routine, I would choose ${a} over ${b}.`],
  ]

  for (const [pattern, make] of rules) {
    const match = text.match(pattern)
    if (match) return capitalise(text.replace(pattern, make))
  }
  return capitalise(text)
}

function polishRate(text, mode) {
  const friendRules = [
    [/^Rate how much you personally enjoy (.+) from 1 to 10\.$/i, item => `How would you rate this for enjoyment, 1 to 10: ${item}?`],
    [/^Rate how important (.+) is to you from 1 to 10\.$/i, item => `How would you rate this for importance in your life, 1 to 10: ${item}?`],
    [/^Rate how much you would miss (.+) if it disappeared for a year, from 1 to 10\.$/i, item => `How much would you miss this if it disappeared for a year, 1 to 10: ${item}?`],
    [/^Rate how strongly (.+) fits your personality from 1 to 10\.$/i, item => `How well does this fit your personality, 1 to 10: ${item}?`],
    [/^Rate how likely you are to choose (.+) when you have the option, from 1 to 10\.$/i, item => `How likely are you to choose this when you have the option, 1 to 10: ${item}?`],
    [/^Rate how much (.+) improves your mood from 1 to 10\.$/i, item => `How much of a mood boost is this for you, 1 to 10: ${item}?`],
    [/^Rate how much you would recommend (.+) to someone like you, from 1 to 10\.$/i, item => `How strongly would you recommend this to someone like you, 1 to 10: ${item}?`],
  ]

  const relationshipRules = [
    [/^Rate how much (.+) matters to you in a relationship from 1 to 10\.$/i, item => `How important is this to you in a relationship, 1 to 10: ${item}?`],
    [/^Rate how much you enjoy (.+) as part of couple life from 1 to 10\.$/i, item => `How much do you enjoy this in couple life, 1 to 10: ${item}?`],
    [/^Rate how much you would miss (.+) if a relationship had none of it, from 1 to 10\.$/i, item => `How much would you miss this if a relationship had none of it, 1 to 10: ${item}?`],
    [/^Rate how naturally (.+) comes to you in relationships from 1 to 10\.$/i, item => `How naturally does this come to you in relationships, 1 to 10: ${item}?`],
    [/^Rate how much (.+) affects your attraction or connection from 1 to 10\.$/i, item => `How much does this affect your attraction or connection, 1 to 10: ${item}?`],
    [/^Rate how important (.+) would be in a long-term relationship from 1 to 10\.$/i, item => `How important would this be long-term, 1 to 10: ${item}?`],
    [/^Rate how much effort you would put into protecting (.+) in a relationship from 1 to 10\.$/i, item => `How much effort would you put into protecting this, 1 to 10: ${item}?`],
  ]

  const rules = mode === 'friend' ? friendRules : relationshipRules
  for (const [pattern, make] of rules) {
    const match = text.match(pattern)
    if (match) return make(match[1])
  }
  return text
}

const storyFollowups = new Map([
  ['that still makes you laugh', 'What part still makes you laugh?'],
  ['you would handle differently now', 'What would you do differently now?'],
  ['that taught you something unexpected', 'What did it teach you that you did not expect?'],
  ['you rarely tell people about', 'Why do you rarely talk about it?'],
  ['where the ending surprised you', 'What surprised you about how it ended?'],
])

function polishStory(text) {
  for (const [suffix, followup] of storyFollowups.entries()) {
    const ending = ` ${suffix}.`
    if (text.endsWith(ending)) {
      const event = text.slice('Tell me about '.length, -ending.length)
      return `Tell me about ${event}. ${followup}`
    }
  }
  return text
}

function behaviourFromRed(text) {
  if (!text.startsWith('They ')) return null
  const comma = text.indexOf(',')
  if (comma === -1) return null
  return text.slice(5, comma).trim()
}

function rebuildRed(cards) {
  const starters = cards.filter(card => !behaviourFromRed(card.text)).slice(0, 20)
  const behaviours = [...new Set(cards.map(card => behaviourFromRed(card.text)).filter(Boolean))]
  const generated = []

  for (let i = 0; i < behaviours.length; i += 1) {
    for (let j = i + 1; j < behaviours.length; j += 1) {
      generated.push(G(`They ${behaviours[i]}, and they also ${behaviours[j]}.`))
    }
  }

  generated.sort((a, b) => normalise(a.text).localeCompare(normalise(b.text)))
  return unique([...starters, ...generated], 1000)
}

function polishMode(mode) {
  const source = Object.fromEntries(Object.entries(openGamePrompts1000).map(([id, modes]) => [id, modes[mode]]))
  return {
    'guess-my-answer': source['guess-my-answer'],
    'agree-disagree': unique(source['agree-disagree'].map(card => ({ ...card, text: polishAgree(card.text) })), 1000),
    'rate-it': unique(source['rate-it'].map(card => ({ ...card, text: polishRate(card.text, mode) })), 1000),
    'red-green-depends': rebuildRed(source['red-green-depends']),
    'petty-or-valid': source['petty-or-valid'],
    'tell-the-story': unique(source['tell-the-story'].map(card => ({ ...card, text: polishStory(card.text) })), 1000),
  }
}

const friend = polishMode('friend')
const relationship = polishMode('relationship')

export const openGamePromptsFinal = Object.fromEntries(
  Object.keys(friend).map(id => [id, { friend: friend[id], relationship: relationship[id] }]),
)

export const openGameIdsFinal = new Set(Object.keys(openGamePromptsFinal))
