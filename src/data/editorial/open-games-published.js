import { openGamePromptsFinal } from './open-games-final.js'

function actionPhrase(value) {
  const replacements = new Map([
    ['visit friends', 'visiting friends'],
    ['sleep in', 'sleeping in'],
    ['stay home and game', 'staying home and gaming'],
    ['try a new restaurant', 'trying a new restaurant'],
    ['go to the beach', 'going to the beach'],
    ['go shopping', 'going shopping'],
    ['take a long walk', 'taking a long walk'],
    ['watch football', 'watching football'],
    ['read all day', 'reading all day'],
    ['go to a concert', 'going to a concert'],
    ['do absolutely nothing', 'doing absolutely nothing'],
    ['talking to a friend', 'talking to a friend'],
    ['being alone', 'having time alone'],
    ['switching your phone off', 'switching my phone off'],
  ])
  return replacements.get(value.toLowerCase()) || value
}

function polishAgree(text) {
  let value = text.replaceAll('switching your phone off', 'switching my phone off')
  const rules = [
    [/^(.+) is a better weekend plan than (.+)\.$/i, (a, b) => `For a free weekend, I would choose ${a} over ${b}.`],
    [/^(.+) feels more luxurious than (.+)\.$/i, (a, b) => `As a small luxury, I would choose ${a} over ${b}.`],
    [/^(.+) is more important to discuss early than (.+)\.$/i, (a, b) => `In a serious relationship, I would discuss ${a} before ${b}.`],
    [/^(.+) tests compatibility more than (.+)\.$/i, (a, b) => `For compatibility, I would worry about ${a} before ${b}.`],
    [/^(.+) makes a better date than (.+)\.$/i, (a, b) => `For a date, I would choose ${a} over ${b}.`],
    [/^(.+) sounds better than (.+)\.$/i, (a, b) => `If I had to choose, I would pick ${a} over ${b}.`],
    [/^(.+) is better than (.+)\.$/i, (a, b) => `If I had to choose, I would pick ${a} over ${b}.`],
  ]
  for (const [pattern, make] of rules) {
    const match = value.match(pattern)
    if (match) return make(match[1], match[2])
  }
  return value
}

function polishRate(text) {
  const patterns = [
    [/^(How would you rate this for enjoyment, 1 to 10: )(.+)(\?)$/i],
    [/^(How would you rate this for importance in your life, 1 to 10: )(.+)(\?)$/i],
    [/^(How much would you miss this if it disappeared for a year, 1 to 10: )(.+)(\?)$/i],
    [/^(How well does this fit your personality, 1 to 10: )(.+)(\?)$/i],
    [/^(How likely are you to choose this when you have the option, 1 to 10: )(.+)(\?)$/i],
    [/^(How much of a mood boost is this for you, 1 to 10: )(.+)(\?)$/i],
    [/^(How strongly would you recommend this to someone like you, 1 to 10: )(.+)(\?)$/i],
    [/^(How important is this to you in a relationship, 1 to 10: )(.+)(\?)$/i],
    [/^(How much do you enjoy this in couple life, 1 to 10: )(.+)(\?)$/i],
    [/^(How much would you miss this if a relationship had none of it, 1 to 10: )(.+)(\?)$/i],
    [/^(How naturally does this come to you in relationships, 1 to 10: )(.+)(\?)$/i],
    [/^(How much does this affect your attraction or connection, 1 to 10: )(.+)(\?)$/i],
    [/^(How important would this be long-term, 1 to 10: )(.+)(\?)$/i],
    [/^(How much effort would you put into protecting this, 1 to 10: )(.+)(\?)$/i],
  ]
  for (const [pattern] of patterns) {
    const match = text.match(pattern)
    if (match) return `${match[1]}${actionPhrase(match[2])}${match[3]}`
  }
  return text
}

function polishRed(text) {
  return text.replace(/, and they also /i, '. They also ')
}

function polishStory(text) {
  return text
    .replace('a trip where habits showed.', 'a trip where someone’s habits became obvious.')
    .replace('a time travel revealed compatibility.', 'a trip that revealed something about compatibility.')
}

function polishMode(mode) {
  return Object.fromEntries(Object.entries(openGamePromptsFinal).map(([id, modes]) => {
    let cards = modes[mode]
    if (id === 'agree-disagree') cards = cards.map(card => ({ ...card, text: polishAgree(card.text) }))
    if (id === 'rate-it') cards = cards.map(card => ({ ...card, text: polishRate(card.text) }))
    if (id === 'red-green-depends') cards = cards.map(card => ({ ...card, text: polishRed(card.text) }))
    if (id === 'tell-the-story') cards = cards.map(card => ({ ...card, text: polishStory(card.text) }))
    return [id, cards]
  }))
}

const friend = polishMode('friend')
const relationship = polishMode('relationship')

export const openGamePromptsPublished = Object.fromEntries(
  Object.keys(friend).map(id => [id, { friend: friend[id], relationship: relationship[id] }]),
)

export const openGameIdsPublished = new Set(Object.keys(openGamePromptsPublished))
