import { buildNigeriaGamePrompts as buildV5NigeriaGamePrompts, nigeriaGameCategoryIds } from './games-v5.js'

function splitCard(text) {
  const [head, ...rest] = text.split('\n\n')
  return { head, rest: rest.join('\n\n') }
}

function joinCard(head, rest) {
  return rest ? `${head}\n\n${rest}` : head
}

function polishRedGreen(text) {
  return text
    .replace(/^They expects\b/, 'They expect')
    .replace(/^They cancels\b/, 'They cancel')
    .replace(/^They checks\b/, 'They check')
    .replace(/^They says\b/, 'They say')
    .replace(/^They raises\b/, 'They raise')
    .replace(/^They makes\b/, 'They make')
    .replace(/^They is\b/, 'They are')
    .replace(/^They has\b/, 'They have')
    .replace(/^They wants\b/, 'They want')
    .replace(/^They refuses\b/, 'They refuse')
    .replace(/^They apologises\b/, 'They apologise')
    .replace(/^They supports\b/, 'They support')
    .replace(/^They borrows\b/, 'They borrow')
    .replace(/^They keeps\b/, 'They keep')
    .replace(/^They tells\b/, 'They tell')
    .replace(/^They shares\b/, 'They share')
    .replace(/^They posts\b/, 'They post')
    .replace(/^They replies\b/, 'They reply')
    .replace(/^They follows\b/, 'They follow')
    .replace(/ once, apologise properly/g, ' once, then apologise properly')
    .replace(/ once, apologize properly/g, ' once, then apologise properly')
    .replace(/, and they refuse to discuss it when you bring it up\./g, ', but they shut down when you raise a separate issue with them.')
    .replace(/ repeatedly even after you have discussed it\./g, ' consistently, even when the conversation is uncomfortable.')
    .replace(/, but only when they are under serious pressure\./g, ', but become inconsistent when they are under serious pressure.')
}

const rateFrames = [
  topic => `Give ${topic} a score from 1 to 10 based on your own experience. What makes it that score?`,
  topic => `On a scale of 1 to 10, how do you rate ${topic}? Explain the number.`,
  topic => `If you had to score ${topic} from 1 to 10, where does it land for you and why?`,
  topic => `Rate ${topic} from 1 to 10. What would move it one point higher or lower?`,
  topic => `What score from 1 to 10 would you give ${topic} from your own life?`,
  topic => `Give ${topic} a 1 to 10 rating. What is the first reason behind your score?`,
  topic => `How would you rate ${topic} from 1 to 10 if you had to answer immediately?`,
  topic => `Score ${topic} from 1 to 10, then tell me what shaped that score.`
]

function extractRateTopic(head) {
  let match = head.match(/^Rate your experience with (.+) from 1 to 10, then explain the number\.$/i)
  if (match) return match[1]
  match = head.match(/^Rate how much you would miss (.+) if it disappeared for a year, from 1 to 10\.$/i)
  if (match) return match[1]
  match = head.match(/^Rate how important (.+) is in your life from 1 to 10\.$/i)
  if (match) return match[1]
  match = head.match(/^Rate how much (.+) affects your mood from 1 to 10\.$/i)
  if (match) return match[1]
  match = head.match(/^Rate how much (.+) can make or break a relationship for you, from 1 to 10\.$/i)
  if (match) return match[1]
  match = head.match(/^Rate how comfortable you are talking about (.+) with a partner from 1 to 10\.$/i)
  if (match) return match[1]
  return null
}

function polishRate(text, mode, index) {
  const { head, rest } = splitCard(text)
  const topic = extractRateTopic(head)
  if (!topic) return text
  if (mode === 'relationship') {
    const frames = [
      t => `How important is agreement about ${t} to you in a relationship? Rate it from 1 to 10 and explain.`,
      t => `How comfortable would you be discussing ${t} with a partner? Give it a 1 to 10 score.`,
      t => `Rate how much ${t} matters to relationship compatibility for you, from 1 to 10.`,
      t => `Give ${t} a relationship-importance score from 1 to 10. What makes it that number?`,
      t => `On a scale of 1 to 10, how much attention should a couple give ${t}?`,
      t => `How strongly do you care about being aligned on ${t}? Rate it from 1 to 10.`,
      t => `Rate your comfort level talking openly about ${t} in a relationship, from 1 to 10.`,
      t => `From 1 to 10, how much would ${t} affect your view of long-term compatibility?`
    ]
    return joinCard(frames[index % frames.length](topic), rest)
  }
  return joinCard(rateFrames[index % rateFrames.length](topic), rest)
}

function polishLikely(text, mode) {
  let out = text
  const other = mode === 'friend' ? 'your friend' : 'your partner'
  out = out.replace(/^Who is more likely to (.+) without warning anybody first\?$/i, `Who is more likely to $1, you or ${other}?`)
  out = out.replace(/^Who is more likely to (.+) after a small disagreement\?$/i, `After a small disagreement, who is more likely to $1 first, you or ${other}?`)
  out = out.replace(/^Who is more likely to (.+) once family gets involved\?$/i, `When family is around, who is more likely to $1, you or ${other}?`)
  out = out.replace(/^Who is more likely to (.+) and remember the story years later\?$/i, `Who is more likely to $1 and stand by the choice, you or ${other}?`)
  out = out.replace(/^Who is more likely to (.+) and somehow make it everybody else’s problem\?$/i, `Who is more likely to $1 and turn it into group gist, you or ${other}?`)
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
  const out = head.charAt(0).toUpperCase() + head.slice(1)
  return joinCard(out, rest)
}

function polishGame(categoryId, mode, prompt, index) {
  let text = prompt.text
  if (categoryId === 'red-green-depends') text = polishRedGreen(text)
  if (categoryId === 'rate-it') text = polishRate(text, mode, index)
  if (categoryId === 'who-is-more-likely') text = polishLikely(text, mode)
  if (categoryId === 'how-well-do-you-know-me') text = polishHowWell(text, index)
  if (categoryId === 'agree-disagree') text = polishAgree(text)
  if (categoryId === 'keep-one-forever') text = polishKeepOne(text)
  if (categoryId === 'truth-dare') text = polishTruthDare(text, mode)
  if (categoryId === 'this-or-that') text = polishThisOrThat(text)
  return { ...prompt, text, copyText: text }
}

export function buildNigeriaGamePrompts(categoryId, mode) {
  return buildV5NigeriaGamePrompts(categoryId, mode).map((prompt, index) => polishGame(categoryId, mode, prompt, index))
}

export { nigeriaGameCategoryIds }
