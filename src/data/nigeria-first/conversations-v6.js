import { buildNigeriaConversationPrompts as buildV5NigeriaConversationPrompts, nigeriaConversationCategoryIds } from './conversations-v5.js'

const leadIns = {
  'getting-to-know-you': ['Quick one:','Be honest:','I’m curious:','Tell me this:','No overthinking:','Your first instinct:','One I want to know:','Small question:','Something about you:','Let me ask you this:','One for you:','Curious about this:'],
  'deep-meaningful': ['A deeper one:','Think about this:','If you’re comfortable:','Something I’ve wondered:','Be honest with this one:','Take your time:','A real question:','One worth thinking about:','Go a little deeper:','For you personally:','Something serious:','I want your real answer:'],
  'fun-random': ['Random one:','Unserious question:','Quick random one:','For the laughs:','First answer only:','No overthinking:','This one is random:','Just for fun:','One silly question:','Your first instinct:','Let me hear this:','Okay, random:'],
  'life-experience': ['Story time:','Looking back:','From your own life:','One from experience:','Think back:','Tell me about this:','From what you’ve lived through:','One life question:','Your own experience:','Take yourself back:','Something from your journey:','A personal one:'],
  nigeria: ['Nigeria one:','Living here:','From your own Nigerian experience:','One about life here:','Growing up here:','Nigeria question:','From your side:','Think about life here:','One we can relate to:','Your Nigerian experience:','Living in Nigeria:','One from home:'],
  family: ['Family one:','Growing up at home:','Thinking about your family:','One about home:','From your family experience:','Family question:','Take yourself home:','One from growing up:','About your people:','Thinking about relatives:','One family story:','Home life question:'],
  nostalgia: ['Throwback question:','Take yourself back:','Old-school one:','Think back:','Memory lane:','One from back then:','A proper throwback:','From the old days:','Something nostalgic:','Back in the day:','One old memory:','Childhood throwback:'],
  'growing-up': ['Growing-up question:','Think about younger you:','Back when you were younger:','One from your childhood:','Teenage-you question:','School-days question:','Take yourself back:','One from growing up:','About younger you:','Think back to school:','Childhood one:','From your younger days:'],
  food: ['Food question:','Be honest about food:','Quick food one:','Your taste buds decide:','One for the food debate:','Food gist:','No judging your answer:','First food answer:','One about what you eat:','Food opinion:','Let’s talk food:','Your plate, your rules:'],
  'everyday-life': ['Everyday one:','Normal-life question:','Day-to-day one:','Real-life question:','One about your routine:','Your normal day:','Small everyday thing:','One from daily life:','About your routine:','Regular-life question:','Day-to-day gist:','One practical question:'],
  movies: ['Movie question:','Film one:','Cinema question:','Nollywood one:','Watch-list question:','One about films:','Movie-night question:','Screen-time question:','Film gist:','Quick movie one:','One for your watch list:','Your movie taste:'],
  music: ['Music question:','Song one:','Your playlist question:','Afrobeats one:','One about music:','Your music taste:','Song-memory question:','Playlist gist:','Quick music one:','One for your headphones:','Music-memory question:','Your soundtrack question:'],
  'hot-takes': ['Hot take:','No fence-sitting:','Pick a side:','Your unpopular opinion:','Say it with your chest:','One for debate:','Be honest here:','Your real take:','No safe answer:','Debate this:','I want your opinion:','One controversial one:'],
  'faith-spirituality': ['Faith question:','A spiritual one:','Thinking about your faith:','One about belief:','Be honest about this:','A faith-and-life question:','From your own faith journey:','One worth reflecting on:','Your conviction question:','A church-and-life question:','One about spiritual life:','From your beliefs:'],
  'values-beliefs': ['Values question:','What do you stand on:','One about your principles:','Character question:','Your values here:','Think about your beliefs:','One about what matters:','Your line in the sand:','A principles question:','What matters to you here:','One about character:','Your real standard:']
}

function humanise(text, categoryId) {
  let out = text

  if (categoryId === 'getting-to-know-you') {
    out = out.replace(/^Which would your friends say matters more to you: (.+) or (.+)\?$/i, 'Which story would tell me more about you: $1 or $2?')
    out = out.replace(/^Which has shaped you more: (.+) or (.+)\?$/i, 'Which one has influenced the person you are now more: $1 or $2?')
  }

  if (categoryId === 'deep-meaningful') {
    out = out.replace(/^Which would you need more agreement on: (.+) or (.+)\?$/i, 'Which do you think would shape a serious relationship more: $1 or $2?')
    out = out.replace(/^Which has taught you more about yourself: (.+) or (.+)\?$/i, 'Which experience taught you something more important about yourself: $1 or $2?')
  }

  if (categoryId === 'fun-random') {
    out = out.replace(/^Which would you rather experience with me: (.+) or (.+)\?$/i, 'Which one would make the funnier story between us: $1 or $2?')
    out = out.replace(/^Who do you think would handle (.+) better, you or me\?$/i, 'Who do you think would be more dramatic about $1, you or me?')
  }

  if (categoryId === 'nigeria') {
    out = out.replace(/^Which do you think has changed more in Nigeria: (.+) or (.+)\?$/i, 'Which feels more different now than when you were younger: $1 or $2?')
  }

  if (categoryId === 'family') {
    out = out.replace(/^Which would need a clearer family boundary: (.+) or (.+)\?$/i, 'Which one would tell me more about how your family works: $1 or $2?')
    out = out.replace(/^Which would you want to keep in your future home: (.+) or (.+)\?$/i, 'Which part of your family life would you be happier to carry into your own home: $1 or $2?')
  }

  if (categoryId === 'nostalgia') {
    out = out.replace(/^Which tells me more about your childhood: (.+) or (.+)\?$/i, 'Which one tells me more about the life you had back then: $1 or $2?')
    out = out.replace(/^Which would you want our future children to experience more: (.+) or (.+)\?$/i, 'Which one would you actually enjoy telling our future children about: $1 or $2?')
  }

  if (categoryId === 'growing-up') {
    out = out.replace(/^What is one good lesson from (.+) you would want in our future home\?$/i, 'What does $1 tell me about the kind of child or teenager you were?')
    out = out.replace(/^What is one thing from (.+) you would not want to repeat in our future home\?$/i, 'What part of $1 would you handle differently if you could live it again?')
  }

  if (categoryId === 'music') {
    out = out.replace(/^What would make (.+) feel romantic to you\?$/i, 'Would you ever send me something connected to $1, and what would make you choose it?')
    out = out.replace(/^Which takes you back faster: (.+) or (.+)\?$/i, 'Which one has the stronger music memory for you: $1 or $2?')
  }

  if (categoryId === 'faith-spirituality') {
    out = out.replace(/^What part of what you would do if your partner started questioning their faith would you want us to discuss before marriage\?$/i, 'If one of us started questioning our faith, how would you want us to handle it together?')
    out = out.replace(/^What is one assumption about how you would handle a partner who needs a season of spiritual rest you would not want us to make about each other\?$/i, 'If one of us needed a season of spiritual rest, what assumption would you want us to avoid?')
    out = out.replace(/^What would make how you think submission should be discussed feel supportive rather than controlling in a relationship\?$/i, 'How should a Christian couple discuss submission so it feels supportive rather than controlling?')
    out = out.replace(/^What would you want our future home to practise around what Christian dating advice you disagree with\?$/i, 'What Christian dating advice do you disagree with, and what would you want us to do differently?')
  }

  return out
}

function addLeadIn(text, categoryId, index) {
  const options = leadIns[categoryId] || ['Quick one:','Be honest:','I’m curious:','Tell me this:','One for you:','Think about this:','Your first instinct:','No overthinking:','A proper question:','Let me ask you this:','Something I want to know:','One more:']
  return `${options[index % options.length]} ${text}`
}

function removeReversePairDuplicates(prompts, categoryId) {
  if (categoryId !== 'life-experience') return prompts
  const seen = new Set()
  return prompts.map(prompt => {
    const match = prompt.text.match(/^(.*?): (.+) or (.+)\?$/)
    if (!match) return prompt
    const key = [match[2].toLowerCase(), match[3].toLowerCase()].sort().join('|')
    if (!seen.has(key)) {
      seen.add(key)
      return prompt
    }
    const replacement = `What is one lesson you took from ${match[2]} that ${match[3]} did not teach you?`
    return { ...prompt, text: replacement, copyText: replacement }
  })
}

export function buildNigeriaConversationPrompts(categoryId, mode) {
  const base = removeReversePairDuplicates(buildV5NigeriaConversationPrompts(categoryId, mode), categoryId)
  return base.map((prompt, index) => {
    const clean = humanise(prompt.text, categoryId)
    const text = addLeadIn(clean, categoryId, index)
    return { ...prompt, text, copyText: text, tags: [...new Set([...(prompt.tags || []), 'human-reviewed-patterns'])] }
  })
}

export { nigeriaConversationCategoryIds }
