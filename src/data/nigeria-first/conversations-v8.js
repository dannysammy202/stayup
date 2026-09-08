import { conversationCategories } from '../categories.js'
import { ngContext } from './context.js'
import { buildNigeriaConversationPrompts as buildV7NigeriaConversationPrompts, nigeriaConversationCategoryIds } from './conversations-v7.js'
import {
  TARGET_PER_MODE,
  audienceFor,
  deterministicShuffle,
  intensityFor,
  normalise,
  stageFor,
} from './helpers.js'

const specs = {
  'getting-to-know-you': {
    friend: ['secondarySchool','familyHome','moneySpending','whatsappPhone','wellbeing','friendshipDynamics','ambitionsJapa','workCareer'],
    relationship: ['datingEarly','relationshipCommunication','relationshipMoney','relationshipFamily','ambitionsJapa','familyHome','whatsappPhone','attractionAffection'],
    friendSingles: [
      a => `What is one story about ${a} that says a lot about you?`,
      a => `What would surprise me most about you when it comes to ${a}?`,
      a => `What do your closest friends already know about you and ${a}?`,
      a => `What have you changed your mind about when it comes to ${a}?`,
      a => `What is your most predictable behaviour around ${a}?`,
      a => `What would somebody who knows you well say about you and ${a}?`,
    ],
    relationshipSingles: [
      a => `What would you want me to understand about you when it comes to ${a}?`,
      a => `What would I probably guess wrongly about you and ${a}?`,
      a => `What is one thing about ${a} you would rather tell me directly than let me assume?`,
      a => `What does ${a} reveal about the kind of partner you think you are?`,
      a => `What preference or boundary do you have around ${a}?`,
      a => `What has experience taught you about yourself when it comes to ${a}?`,
    ],
    friendPair: (a,b) => `Which one would get a longer story out of you: ${a} or ${b}?`,
    relationshipPair: (a,b) => `Which one would you rather talk about early with someone you like: ${a} or ${b}?`,
  },
  'deep-meaningful': {
    friend: ['familyHome','valuesCharacter','ambitionsJapa','wellbeing','friendshipDynamics','faithGeneral','workCareer','moneySpending'],
    relationship: ['relationshipCommunication','relationshipMoney','relationshipFamily','relationshipFuture','conflictBoundaries','faithGeneral','familyHome','ambitionsJapa'],
    friendSingles: [
      a => `What has ${a} taught you about yourself?`,
      a => `What is the hardest part of being honest about ${a}?`,
      a => `What have you had to unlearn about ${a}?`,
      a => `What do you think maturity looks like when dealing with ${a}?`,
      a => `What do you wish people understood about your experience of ${a}?`,
      a => `What part of ${a} has affected you more deeply than people realise?`,
    ],
    relationshipSingles: [
      a => `What would emotional safety look like for you around ${a}?`,
      a => `What would you need from me if ${a} became difficult?`,
      a => `What boundary would help us handle ${a} well?`,
      a => `What did your past teach you about ${a}?`,
      a => `What do you think couples learn too late about ${a}?`,
      a => `What would respect look like between us if we disagreed about ${a}?`,
    ],
    friendPair: (a,b) => `Which has affected the way you think today more: ${a} or ${b}?`,
    relationshipPair: (a,b) => `Which would be harder for you to navigate with someone you love: ${a} or ${b}?`,
  },
  'fun-random': {
    friend: ['secondarySchool','childhoodGames','oldInternet','transportTraffic','powerInternet','snacksStreetFood','socialMedia','whatsappPhone'],
    relationship: ['datingEarly','whatsappPhone','socialMedia','transportTraffic','powerInternet','snacksStreetFood','attractionAffection','musicHabits'],
    friendSingles: [
      a => `What is the funniest story you have about ${a}?`,
      a => `What is your most unserious opinion about ${a}?`,
      a => `What would your friends tease you about when it comes to ${a}?`,
      a => `What ridiculous rule would you create for ${a}?`,
      a => `What is one thing about ${a} you take far too seriously?`,
      a => `What is the most chaotic memory you connect with ${a}?`,
    ],
    relationshipSingles: [
      a => `What silly disagreement do you think we could have about ${a}?`,
      a => `What would make ${a} unexpectedly fun for us?`,
      a => `What do you think I would tease you about when it comes to ${a}?`,
      a => `What do you think you would tease me about when it comes to ${a}?`,
      a => `What would turn ${a} into a story we would keep retelling?`,
      a => `Which one of us do you think would be more dramatic about ${a}?`,
    ],
    friendPair: (a,b) => `Which one would give you the better story to tell: ${a} or ${b}?`,
    relationshipPair: (a,b) => `Which one would make the better gist between us: ${a} or ${b}?`,
  },
  'life-experience': {
    friend: ['secondarySchool','university','nysc','workCareer','savingsHustle','travelNigeria','familyHome','ambitionsJapa'],
    relationship: ['secondarySchool','university','nysc','workCareer','travelNigeria','familyHome','ambitionsJapa','relationshipFuture'],
    friendSingles: [
      a => `What is the first story that comes to mind when you think about ${a}?`,
      a => `What did ${a} teach you that you did not expect?`,
      a => `What would you do differently if you went through ${a} again?`,
      a => `What was harder about ${a} than you expected?`,
      a => `What are you proud of about the way you handled ${a}?`,
      a => `Who mattered most to you during ${a}?`,
    ],
    relationshipSingles: [
      a => `What would you want me to understand about your experience of ${a}?`,
      a => `How did ${a} shape what you now expect from a partner?`,
      a => `What did ${a} teach you about the kind of support you need?`,
      a => `What lesson from ${a} would you want us to remember together?`,
      a => `What did ${a} change about the future you want?`,
      a => `What story about ${a} would help me understand you better?`,
    ],
    friendPair: (a,b) => `Which one changed your perspective more: ${a} or ${b}?`,
    relationshipPair: (a,b) => `Which one would tell me more about the life you have lived: ${a} or ${b}?`,
  },
  nigeria: {
    friend: ['transportTraffic','powerInternet','travelNigeria','cityLife','nigeriaSociety','partiesWeddings','relativesVillage','oldInternet'],
    relationship: ['transportTraffic','powerInternet','travelNigeria','cityLife','nigeriaSociety','partiesWeddings','relationshipFamily','ambitionsJapa'],
    friendSingles: [
      a => `What is your most Nigerian story about ${a}?`,
      a => `What do you think somebody who did not grow up here would misunderstand about ${a}?`,
      a => `What is your strongest opinion about ${a}?`,
      a => `What would you change about ${a} if you had the power?`,
      a => `What part of ${a} feels normal to you but might surprise somebody else?`,
      a => `What do you think has changed most about ${a} since you were younger?`,
    ],
    relationshipSingles: [
      a => `How do you think living in Nigeria affects ${a} for couples?`,
      a => `What would you want us to agree on about ${a} if we were building a life here?`,
      a => `What Nigerian expectation around ${a} would you refuse to follow blindly?`,
      a => `What pressure does family or society add to ${a}?`,
      a => `What would you want us to decide for ourselves about ${a}?`,
      a => `What would make ${a} easier for us to handle as a team?`,
    ],
    friendPair: (a,b) => `Which one would start the longer Nigerian gist for you: ${a} or ${b}?`,
    relationshipPair: (a,b) => `Which one would affect our day-to-day life in Nigeria more: ${a} or ${b}?`,
  },
  family: {
    friend: ['familyHome','relativesVillage','choresErrands','celebrations','valuesCharacter'],
    relationship: ['familyHome','relativesVillage','relationshipFamily','relationshipFuture','valuesCharacter'],
    friendSingles: [
      a => `What family story comes to mind when you think about ${a}?`,
      a => `What did your family teach you about ${a}?`,
      a => `What did you think was normal about ${a} until you met other families?`,
      a => `What would your siblings or cousins say about you and ${a}?`,
      a => `What is one thing about ${a} you would do differently in your own home?`,
      a => `Who in your family do you associate most with ${a}?`,
    ],
    relationshipSingles: [
      a => `What would you want me to understand about your family and ${a}?`,
      a => `What would you want us to keep from your family’s approach to ${a}?`,
      a => `What would you want us to do differently from your family around ${a}?`,
      a => `What boundary would protect our relationship when ${a} involves family?`,
      a => `What family expectation around ${a} would you want us to discuss early?`,
      a => `What would you want our future home to feel like when it comes to ${a}?`,
    ],
    friendPair: (a,b) => `Which one says more about how your family works: ${a} or ${b}?`,
    relationshipPair: (a,b) => `Which one would matter more in the home we build: ${a} or ${b}?`,
  },
  nostalgia: {
    friend: ['primarySchool','secondarySchool','childhoodGames','childhoodMedia','oldInternet','foodMemories','musicNigeria','snacksStreetFood'],
    relationship: ['primarySchool','secondarySchool','childhoodGames','childhoodMedia','oldInternet','foodMemories','musicNigeria','familyHome'],
    friendSingles: [
      a => `What do you miss most about ${a}?`,
      a => `What is your clearest memory of ${a}?`,
      a => `Who do you think of first when you remember ${a}?`,
      a => `What is the funniest thing you remember about ${a}?`,
      a => `What would instantly take you back to ${a}?`,
      a => `What is one thing about ${a} younger people might not understand?`,
    ],
    relationshipSingles: [
      a => `What story about ${a} would help me picture the younger version of you?`,
      a => `What do you think I would find funniest about you during ${a}?`,
      a => `What part of ${a} do you wish we could have experienced together?`,
      a => `What memory from ${a} still makes you smile?`,
      a => `What would your younger self during ${a} think about your life now?`,
      a => `What is one story about ${a} you would enjoy telling me properly?`,
    ],
    friendPair: (a,b) => `Which one takes you back faster: ${a} or ${b}?`,
    relationshipPair: (a,b) => `Which one would you rather relive with me for one day: ${a} or ${b}?`,
  },
  'growing-up': {
    friend: ['primarySchool','secondarySchool','exams','boardingDaySchool','familyHome','choresErrands','childhoodGames','oldInternet'],
    relationship: ['primarySchool','secondarySchool','exams','boardingDaySchool','familyHome','choresErrands','childhoodGames','oldInternet'],
    friendSingles: [
      a => `What did ${a} teach you while you were growing up?`,
      a => `What is one thing about ${a} you only understood when you got older?`,
      a => `What would your parents say about you and ${a}?`,
      a => `What is one time ${a} got you into trouble?`,
      a => `What did you think was unfair about ${a} then but understand now?`,
      a => `What would you change about how you were raised around ${a}?`,
    ],
    relationshipSingles: [
      a => `What would you want me to understand about the younger you and ${a}?`,
      a => `What did growing up around ${a} teach you about trust or communication?`,
      a => `What story about ${a} explains something about you now?`,
      a => `What would your teenage self say about how you handle ${a} now?`,
      a => `What did ${a} teach you about the kind of home you want one day?`,
      a => `What part of ${a} would you handle differently if you could live it again?`,
    ],
    friendPair: (a,b) => `Which one shaped younger you more: ${a} or ${b}?`,
    relationshipPair: (a,b) => `Which one would tell me more about the younger you: ${a} or ${b}?`,
  },
  food: {
    friend: ['nigerianFood','snacksStreetFood','cookingEating','foodDebates','foodMemories'],
    relationship: ['nigerianFood','snacksStreetFood','cookingEating','foodDebates','foodMemories'],
    friendSingles: [
      a => `What is your strongest opinion about ${a}?`,
      a => `What is your best memory connected to ${a}?`,
      a => `What is the best version of ${a} you have ever had?`,
      a => `What unpopular opinion do you have about ${a}?`,
      a => `Who do you trust most when it comes to ${a}?`,
      a => `What would make you choose ${a} immediately?`,
    ],
    relationshipSingles: [
      a => `What do you think we would disagree about most when it comes to ${a}?`,
      a => `Would ${a} make a good date or shared meal for us?`,
      a => `What would you want me to know about your taste when it comes to ${a}?`,
      a => `What memory around ${a} would you want us to create together?`,
      a => `What food habit around ${a} would you need me to accept?`,
      a => `Who do you think would care more about ${a}, you or me?`,
    ],
    friendPair: (a,b) => `Which one are you choosing first: ${a} or ${b}?`,
    relationshipPair: (a,b) => `Which one would you rather share with me: ${a} or ${b}?`,
  },
  'everyday-life': {
    friend: ['transportTraffic','powerInternet','moneySpending','workCareer','shoppingMarkets','housingHome','wellbeing'],
    relationship: ['transportTraffic','powerInternet','moneySpending','workCareer','housingHome','wellbeing','relationshipMoney'],
    friendSingles: [
      a => `How do you usually handle ${a}?`,
      a => `What is your most predictable reaction to ${a}?`,
      a => `What is one thing about ${a} that affects your mood more than it should?`,
      a => `What habit have you developed because of ${a}?`,
      a => `What have you learnt the hard way about ${a}?`,
      a => `What would make ${a} easier for you immediately?`,
    ],
    relationshipSingles: [
      a => `What should I know about the way you handle ${a}?`,
      a => `What would make you feel considered by me when ${a} comes up?`,
      a => `What everyday habit around ${a} would you want us to agree on?`,
      a => `What part of ${a} would you happily let me help with?`,
      a => `What would make ${a} less stressful for us?`,
      a => `What do you think living together would reveal about us when it comes to ${a}?`,
    ],
    friendPair: (a,b) => `Which one affects your normal week more: ${a} or ${b}?`,
    relationshipPair: (a,b) => `Which one would need more teamwork from us: ${a} or ${b}?`,
  },
  movies: {
    friend: ['nollywoodTv','filmHabits','childhoodMedia'],
    relationship: ['nollywoodTv','filmHabits','childhoodMedia'],
    friendSingles: [
      a => `What is your honest opinion about ${a}?`,
      a => `What memory do you connect with ${a}?`,
      a => `What do people overrate about ${a}?`,
      a => `What do people underrate about ${a}?`,
      a => `What would make you recommend something connected to ${a}?`,
      a => `What is your funniest story connected to ${a}?`,
    ],
    relationshipSingles: [
      a => `What do you think we would disagree about around ${a}?`,
      a => `Would ${a} make a good watch-together night for us?`,
      a => `What do you think I would learn about you through ${a}?`,
      a => `What would make ${a} a proper date night rather than background noise?`,
      a => `What would annoy you if I did it around ${a}?`,
      a => `What kind of conversation do you think ${a} would start between us?`,
    ],
    friendPair: (a,b) => `Which one would you rather talk about after a film night: ${a} or ${b}?`,
    relationshipPair: (a,b) => `Which one would make the better movie-night conversation for us: ${a} or ${b}?`,
  },
  music: {
    friend: ['musicNigeria','musicHabits'],
    relationship: ['musicNigeria','musicHabits'],
    friendSingles: [
      a => `What memory comes back fastest when you think about ${a}?`,
      a => `What is your strongest opinion about ${a}?`,
      a => `What does ${a} say about your music taste?`,
      a => `Who do you think about when ${a} comes up?`,
      a => `What mood do you connect with ${a}?`,
      a => `What would your friends say about your opinion of ${a}?`,
    ],
    relationshipSingles: [
      a => `What would you want me to understand about you through ${a}?`,
      a => `What kind of memory would you want us to create around ${a}?`,
      a => `What do you think we would disagree about around ${a}?`,
      a => `Would you ever send me something connected to ${a}, and why?`,
      a => `What would make you send me something connected to ${a} without explaining it?`,
      a => `What do you think ${a} would tell me about your taste?`,
    ],
    friendPair: (a,b) => `Which one has the stronger music memory for you: ${a} or ${b}?`,
    relationshipPair: (a,b) => `Which one would make the better music memory for us: ${a} or ${b}?`,
  },
  'hot-takes': {
    friend: ['nigeriaSociety','moneySpending','socialMedia','friendshipDynamics','workCareer','ambitionsJapa','valuesCharacter','partiesWeddings'],
    relationship: ['nigeriaSociety','relationshipMoney','relationshipFamily','relationshipCommunication','conflictBoundaries','socialMedia','relationshipFuture','ambitionsJapa'],
    friendSingles: [
      a => `What is your unpopular opinion about ${a}?`,
      a => `What do you think people get wrong about ${a}?`,
      a => `What double standard do you notice around ${a}?`,
      a => `What do you think people judge too quickly about ${a}?`,
      a => `What do you think people excuse too easily about ${a}?`,
      a => `What view on ${a} have you changed completely?`,
    ],
    relationshipSingles: [
      a => `What is your hottest take about ${a} in relationships?`,
      a => `What do you think couples pretend does not matter about ${a}?`,
      a => `What double standard do you notice around ${a}?`,
      a => `What do you think people call a red flag too quickly around ${a}?`,
      a => `What do you think people excuse for too long around ${a}?`,
      a => `What would you need a partner to respect about your view of ${a}?`,
    ],
    friendPair: (a,b) => `Which one would start the bigger argument among your friends: ${a} or ${b}?`,
    relationshipPair: (a,b) => `Which one do you think couples need to discuss earlier: ${a} or ${b}?`,
  },
  'values-beliefs': {
    friend: ['valuesCharacter','familyHome','friendshipDynamics','moneySpending','workCareer','faithGeneral','nigeriaSociety','ambitionsJapa'],
    relationship: ['valuesCharacter','relationshipMoney','relationshipFamily','relationshipCommunication','conflictBoundaries','faithGeneral','nigeriaSociety','relationshipFuture'],
    friendSingles: [
      a => `What principle guides you most when it comes to ${a}?`,
      a => `What do you think the right thing to do is around ${a}, even when it is inconvenient?`,
      a => `What is one line you would not cross when it comes to ${a}?`,
      a => `What did your upbringing teach you about ${a}?`,
      a => `What would make you lose respect for someone around ${a}?`,
      a => `What do you think people compromise too easily around ${a}?`,
    ],
    relationshipSingles: [
      a => `What value would you want us to protect most around ${a}?`,
      a => `What would make you lose trust in a partner around ${a}?`,
      a => `What principle around ${a} would you not compromise for a relationship?`,
      a => `What did your upbringing teach you about ${a}?`,
      a => `What do you think fairness between partners looks like around ${a}?`,
      a => `What do you think love should never excuse around ${a}?`,
    ],
    friendPair: (a,b) => `Which one would tell me more about your values: ${a} or ${b}?`,
    relationshipPair: (a,b) => `Which one would tell me more about the kind of relationship you want: ${a} or ${b}?`,
  },
}

const leadIns = {
  'getting-to-know-you': ['Quick one:','Be honest:','I’m curious:','Tell me this:','No overthinking:','Your first instinct:'],
  'deep-meaningful': ['A deeper one:','Think about this:','If you’re comfortable:','A real question:','Take your time:','For you personally:'],
  'fun-random': ['Random one:','Unserious question:','Quick random one:','For the laughs:','First answer only:','No overthinking:'],
  'life-experience': ['Story time:','Looking back:','From your own life:','One from experience:','Think back:','Tell me about this:'],
  nigeria: ['Nigeria one:','Living here:','From your Nigerian experience:','One about life here:','Growing up here:','Nigeria question:'],
  family: ['Family one:','Growing up at home:','Thinking about your family:','One about home:','From your family experience:','Family question:'],
  nostalgia: ['Throwback question:','Take yourself back:','Old-school one:','Think back:','Memory lane:','One from back then:'],
  'growing-up': ['Growing-up question:','Think about younger you:','Back when you were younger:','One from your childhood:','School-days question:','Take yourself back:'],
  food: ['Food question:','Be honest about food:','Quick food one:','One for the food debate:','Food gist:','Let’s talk food:'],
  'everyday-life': ['Everyday one:','Normal-life question:','Day-to-day one:','Real-life question:','One about your routine:','Your normal day:'],
  movies: ['Movie question:','Film one:','Cinema question:','Nollywood one:','Watch-list question:','One about films:'],
  music: ['Music question:','Song one:','Your playlist question:','Afrobeats one:','One about music:','Your music taste:'],
  'hot-takes': ['Hot take:','No fence-sitting:','Pick a side:','Your unpopular opinion:','One for debate:','Your real take:'],
  'values-beliefs': ['Values question:','What do you stand on:','One about your principles:','Character question:','Your values here:','Think about your beliefs:'],
}

function uniqueItems(domains) {
  const seen = new Set()
  const rows = []
  domains.forEach(domain => {
    ;(ngContext[domain] || []).forEach(text => {
      if (/^(what|how|whether)\b/i.test(text)) return
      const key = normalise(text)
      if (seen.has(key)) return
      seen.add(key)
      rows.push({ text, domain, key })
    })
  })
  return rows
}

function hashText(value) {
  let hash = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function buildIdeaRows(categoryId, mode, spec) {
  const domains = spec[mode]
  const items = uniqueItems(domains)
  const singleFrames = mode === 'relationship' ? spec.relationshipSingles : spec.friendSingles
  const pairFrame = mode === 'relationship' ? spec.relationshipPair : spec.friendPair
  const rows = []

  items.forEach(item => {
    const frame = singleFrames[hashText(`${categoryId}:${mode}:single:${item.key}`) % singleFrames.length]
    rows.push({
      text: frame(item.text),
      sourceKey: `single:${item.key}`,
      sourceDomain: item.domain,
      source: item.text,
    })
  })

  const grouped = new Map()
  items.forEach(item => {
    const list = grouped.get(item.domain) || []
    list.push(item)
    grouped.set(item.domain, list)
  })

  for (const [domain, values] of grouped.entries()) {
    for (let i = 0; i < values.length; i += 1) {
      for (let j = i + 1; j < values.length; j += 1) {
        const a = values[i]
        const b = values[j]
        const keys = [a.key, b.key].sort()
        rows.push({
          text: pairFrame(a.text, b.text),
          sourceKey: `pair:${keys[0]}|${keys[1]}`,
          sourceDomain: domain,
          source: `${a.text}|${b.text}`,
        })
      }
    }
  }

  if (['movies','music','food'].includes(categoryId) && rows.length < TARGET_PER_MODE * 2) {
    for (let i = 0; i < items.length; i += 1) {
      for (let j = i + 1; j < items.length; j += 1) {
        if (items[i].domain === items[j].domain) continue
        const keys = [items[i].key, items[j].key].sort()
        const sourceKey = `pair:${keys[0]}|${keys[1]}`
        if (rows.some(row => row.sourceKey === sourceKey)) continue
        rows.push({
          text: pairFrame(items[i].text, items[j].text),
          sourceKey,
          sourceDomain: 'cross-domain-pair',
          source: `${items[i].text}|${items[j].text}`,
        })
      }
    }
  }

  return deterministicShuffle(rows, hashText(`${categoryId}:${mode}:ng750-v8`))
}

function buildPublished(categoryId, mode) {
  if (categoryId === 'faith-spirituality') return buildV7NigeriaConversationPrompts(categoryId, mode)
  const spec = specs[categoryId]
  const category = conversationCategories.find(item => item.id === categoryId)
  if (!spec || !category) return []

  const candidates = buildIdeaRows(categoryId, mode, spec)
  if (candidates.length < TARGET_PER_MODE) {
    throw new Error(`${categoryId}/${mode} has ${candidates.length} unique ideas, below ${TARGET_PER_MODE}`)
  }

  const selected = candidates.slice(0, TARGET_PER_MODE)
  const prefixOptions = leadIns[categoryId] || ['Quick one:','Be honest:','I’m curious:','Tell me this:','One for you:','Think about this:']

  return selected.map((row, index) => {
    const intensity = intensityFor(mode, index)
    const prefix = prefixOptions[hashText(row.sourceKey) % prefixOptions.length]
    const text = `${prefix} ${row.text}`
    return {
      id: `ng750-v8-${categoryId}-${mode}-${index}`,
      categoryId,
      categoryName: category.name,
      mode,
      text,
      copyText: text,
      intensity,
      stage: mode === 'relationship' ? stageFor(index) : null,
      audience: audienceFor(intensity),
      faithType: null,
      subtype: null,
      mechanic: 'conversation',
      sourceDomain: row.sourceDomain,
      semanticSourceKey: row.sourceKey,
      tags: [
        category.name.toLowerCase(), mode, intensity.toLowerCase(), 'nigeria', 'nigeria-first',
        row.sourceDomain.toLowerCase(), ...normalise(row.source).split(' ').filter(word => word.length > 4).slice(0, 5),
      ],
    }
  })
}

const cache = new Map()

export function buildNigeriaConversationPrompts(categoryId, mode) {
  const key = `${categoryId}:${mode}`
  if (!cache.has(key)) cache.set(key, buildPublished(categoryId, mode))
  return cache.get(key)
}

export { nigeriaConversationCategoryIds }
