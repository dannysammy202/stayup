import { buildNigeriaGamePrompts as buildV5NigeriaGamePrompts, nigeriaGameCategoryIds } from './games-v5.js'

function splitCard(text) {
  const [head, ...rest] = text.split('\n\n')
  return { head, rest: rest.join('\n\n') }
}

function joinCard(head, rest) {
  return rest ? `${head}\n\n${rest}` : head
}

function polishRedGreen(text) {
  const singularToPlural = [
    ['expects','expect'],['cancels','cancel'],['checks','check'],['says','say'],['raises','raise'],['makes','make'],['is','are'],['has','have'],['wants','want'],['refuses','refuse'],['apologises','apologise'],['supports','support'],['borrows','borrow'],['keeps','keep'],['tells','tell'],['shares','share'],['posts','post'],['replies','reply'],['follows','follow'],['repeats','repeat'],['handles','handle'],['avoids','avoid'],['needs','need'],['likes','like'],['expects','expect'],['remembers','remember']
  ]
  let out = text
  singularToPlural.forEach(([from, to]) => {
    out = out.replace(new RegExp(`\\bThey ${from}\\b`, 'g'), `They ${to}`)
    out = out.replace(new RegExp(`\\bthey ${from}\\b`, 'g'), `they ${to}`)
  })
  out = out
    .replace(/\bnever supports\b/g, 'never support')
    .replace(/\bbut repeats\b/g, 'but repeat')
    .replace(/\band repeats\b/g, 'and repeat')
    .replace(/ once, apologise properly/g, ' once, then apologise properly')
    .replace(/, and they refuse to discuss it when you bring it up\./g, ', but they shut down when you raise a separate issue with them.')
    .replace(/ repeatedly even after you have discussed it\./g, ' consistently, even when the conversation is uncomfortable.')
    .replace(/, but only when they are under serious pressure\./g, ', but become inconsistent when they are under serious pressure.')
  return out
}

function polishAgree(text) {
  const { head, rest } = splitCard(text)
  let out = head.charAt(0).toUpperCase() + head.slice(1)
  out = out.replace('Money changes the way people handle the culture of calling older people auntie or uncle.', 'Money and status change how some people treat age and respect in Nigeria.')
  return joinCard(out, rest)
}

function polishKeepOne(text) {
  const { head, rest } = splitCard(text)
  if (/^You keep only one from these relationship challenges\.$/i.test(head)) {
    return joinCard('If you had to deal with only one of these relationship challenges and avoid the other three, which one are you choosing?', rest)
  }
  return text
}

function polishRate(text, mode) {
  let out = text
  out = out.replace(/^Rate how much you would miss (.+) if it disappeared for a year, from 1 to 10\.$/i, 'Rate how much $1 affects your everyday life, from 1 to 10. What makes it that number?')
  out = out.replace(/^Rate how much whether you would move for a partner’s career can make or break a relationship for you, from 1 to 10\.$/i, 'Rate how important agreement about moving for a partner’s career is to you, from 1 to 10.')
  out = out.replace(/^Rate how much parents asking when you are getting married can make or break a relationship for you, from 1 to 10\.$/i, 'Rate how much family pressure about marriage could affect a relationship for you, from 1 to 10.')
  if (mode === 'friend') {
    out = out.replace(/^Rate your experience with moi moi from 1 to 10, then explain the number\.$/i, 'Rate moi moi as a Nigerian classic from 1 to 10. What makes it that score?')
    out = out.replace(/^Rate your experience with yam and egg from 1 to 10, then explain the number\.$/i, 'Rate the yam-and-egg combo from 1 to 10. What makes it that score?')
  }
  return out
}

function polishLikely(text, mode) {
  let out = text
  out = out.replace(/^Who is more likely to (.+) without warning anybody first\?$/i, 'If nobody saw it coming, who is more likely to $1?')
  out = out.replace(/^Who is more likely to (.+) and somehow make it everybody else’s problem\?$/i, 'If things got chaotic, who is more likely to $1 and pull the group into it?')
  out = out.replace(/^Who is more likely to (.+) after a small disagreement\?$/i, 'Even when the mood is slightly off, who is more likely to $1?')
  out = out.replace(/^Who is more likely to (.+) once family gets involved\?$/i, 'With family in the picture, who is more likely to $1?')
  out = out.replace(/^Who is more likely to (.+) and remember the story years later\?$/i, 'Years later, who is more likely to still admit they would $1?')
  if (mode === 'relationship') {
    out = out.replace('Even when the mood is slightly off, who is more likely to want to order the same meal every time?', 'Even when the mood is slightly off, who is more likely to stick to their usual food order?')
  }
  return out
}

function polishHowWell(text, index) {
  const { head, rest } = splitCard(text)
  const match = head.match(/^Which of these (.+) do you think describes my choice best\? Guess before I answer\.$/i)
  if (!match) return text
  const topic = match[1]
  const frames = [
    `Which of these ${topic} would you bet I would choose first?`,
    `Which ${topic} feels most like my kind of choice? Guess before I answer.`,
    `Pick the ${topic} option you think I would go for without overthinking it.`,
    `When it comes to ${topic}, which option do you think sounds most like me?`,
    `Which of these ${topic} do you think I would choose if you had to answer for me?`,
    `Guess my pick from these ${topic} before I tell you mine.`
  ]
  return joinCard(frames[index % frames.length], rest)
}

function polishTruthDare(text, mode) {
  if (mode === 'friend') {
    return text.replace(
      'What is the most honest thing you can say about a time somebody disappointed you?',
      'What is one time somebody you trusted let you down, and what did you do afterwards?'
    )
  }
  return text
}

function polishThisOrThat(text) {
  const { head, rest } = splitCard(text)
  return joinCard(head.charAt(0).toUpperCase() + head.slice(1), rest)
}

function polishGame(categoryId, mode, prompt, index) {
  let text = prompt.text
  if (categoryId === 'red-green-depends') text = polishRedGreen(text)
  if (categoryId === 'agree-disagree') text = polishAgree(text)
  if (categoryId === 'keep-one-forever') text = polishKeepOne(text)
  if (categoryId === 'rate-it') text = polishRate(text, mode)
  if (categoryId === 'who-is-more-likely') text = polishLikely(text, mode)
  if (categoryId === 'how-well-do-you-know-me') text = polishHowWell(text, index)
  if (categoryId === 'truth-dare') text = polishTruthDare(text, mode)
  if (categoryId === 'this-or-that') text = polishThisOrThat(text)
  return { ...prompt, text, copyText: text }
}

export function buildNigeriaGamePrompts(categoryId, mode) {
  return buildV5NigeriaGamePrompts(categoryId, mode).map((prompt, index) => polishGame(categoryId, mode, prompt, index))
}

export { nigeriaGameCategoryIds }
