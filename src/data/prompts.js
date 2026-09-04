import {
  allCategories,
  conversationCategories,
  friendIntensities,
  relationshipIntensities,
  relationshipStages,
} from './categories.js'

const profiles = {
  'getting-to-know-you': [
    'your personality', 'the side of you people notice first', 'something people misunderstand about you', 'your ideal weekend',
    'how you make decisions', 'what makes you feel comfortable around someone', 'your social battery', 'your sense of humour',
    'the way you handle stress', 'your dream ordinary day', 'what you are secretly competitive about', 'how you spend money',
    'what you save money for', 'your favourite kind of conversation', 'your personal boundaries', 'what makes you feel appreciated',
    'the version of yourself your friends know', 'a habit you are proud of', 'something you want to get better at', 'one surprising thing about you',
  ],
  'deep-meaningful': [
    'a fear you have outgrown', 'a fear you still carry', 'a lesson you learnt the hard way', 'forgiveness', 'trust',
    'feeling understood', 'failure', 'loneliness', 'change', 'grief', 'ambition', 'self-worth', 'regret', 'peace', 'purpose',
    'the future', 'the past', 'being vulnerable', 'starting over', 'the person you are becoming',
  ],
  'fun-random': [
    'a useless talent', 'your weirdest food combination', 'a ridiculous superpower', 'a conspiracy you find funny', 'your funniest bad habit',
    'an irrational fear', 'a strange dream', 'a random hill you would die on', 'the worst fashion trend', 'an embarrassing autocorrect',
    'a cartoon character you relate to', 'a silly purchase', 'a nickname', 'a game show you would dominate', 'your funniest school memory',
    'a strange thing you believed as a child', 'a celebrity encounter', 'your worst cooking attempt', 'a fictional world', 'a harmless secret',
  ],
  'life-experience': [
    'your first job', 'your first big win', 'a major disappointment', 'a trip you still think about', 'a difficult decision',
    'a friendship that changed you', 'a teacher who affected you', 'your proudest risk', 'a time you surprised yourself', 'a season of uncertainty',
    'a mistake that taught you something', 'a moment you felt grown', 'a time you had to speak up', 'a change of plan', 'a fresh start',
    'a time money was tight', 'a career decision', 'a moment of courage', 'a lucky break', 'an experience you want to repeat',
  ],
  nigeria: [
    'secondary school in Nigeria', 'boarding school', 'Nigerian parents', 'Sunday church growing up', 'NYSC', 'university life in Nigeria',
    'Lagos traffic', 'Nigerian weddings', 'Detty December', 'neighbourhood gist', 'school punishments', 'inter-house sports',
    'children’s parties', 'Nigerian television growing up', 'road trips in Nigeria', 'family Christmas', 'street food', 'market runs',
    'power cuts', 'a classic Nigerian childhood experience',
  ],
  family: [
    'your relationship with your parents', 'your siblings', 'family traditions', 'family expectations', 'the funniest person in your family',
    'family celebrations', 'family conflict', 'the role you play at home', 'how affection gets shown in your family', 'family rules growing up',
    'extended family', 'family money habits', 'family food traditions', 'the person you call first', 'what home means to you',
    'what you want to carry into your own home', 'what you want to do differently', 'family stories', 'your childhood home', 'being protective of family',
  ],
  nostalgia: [
    'your favourite childhood TV show', 'old school games', 'your first phone', 'your first social media account', 'songs from your teenage years',
    'school holidays', 'old snacks', 'birthday parties growing up', 'your first crush', 'a childhood toy', 'a smell from childhood',
    'your old neighbourhood', 'an old friendship', 'a fashion phase', 'an old family tradition', 'a place you miss', 'a discontinued product',
    'a childhood weekend', 'your first concert or event', 'a memory you wish you recorded',
  ],
  'growing-up': [
    'primary school', 'secondary school', 'your teenage years', 'your first crush', 'your first heartbreak', 'school friendships',
    'your relationship with authority', 'the kind of student you were', 'your childhood dreams', 'your first taste of independence',
    'your biggest teenage insecurity', 'the rules at home', 'how you spent holidays', 'what you got in trouble for', 'your first big responsibility',
    'a phase you went through', 'what adulthood surprised you with', 'what younger you needed', 'what you miss about being younger', 'how you have changed',
  ],
  food: [
    'your comfort food', 'your perfect breakfast', 'your favourite Nigerian meal', 'a food you refuse to eat', 'late-night food',
    'a meal you cook well', 'a meal you always order', 'street food', 'restaurant dates', 'food sharing', 'spicy food', 'snacks',
    'childhood meals', 'family recipes', 'trying new food', 'food on a bad day', 'your ideal food crawl', 'a controversial food opinion',
    'a meal tied to a memory', 'what you would eat for a week straight',
  ],
  'everyday-life': [
    'your morning routine', 'your bedtime routine', 'how tidy you are', 'how you use your phone', 'weekends', 'workdays', 'chores',
    'being late', 'planning ahead', 'shopping', 'your spending habits', 'your saving habits', 'exercise', 'rest', 'social media',
    'replying to messages', 'alone time', 'work-life balance', 'how you recharge', 'small things that improve your day',
  ],
  movies: [
    'your comfort film', 'a film you think is overrated', 'a film ending you would change', 'your favourite villain', 'your favourite hero',
    'romantic films', 'horror films', 'Nollywood', 'cinema dates', 'films you rewatch', 'a character you relate to', 'a film that made you cry',
    'a film that changed your mind', 'your dream film universe', 'bad films you still enjoy', 'series finales', 'spoilers', 'subtitles',
    'watching alone versus together', 'your ideal movie night',
  ],
  music: [
    'the song you have on repeat', 'your favourite artist', 'a song tied to a person', 'a song tied to a season', 'your first favourite artist',
    'concerts', 'Afrobeats', 'rap', 'gospel music', 'R&B', 'sad songs', 'gym music', 'driving music', 'music while working',
    'songs you know word for word', 'a song you are tired of', 'an artist you defend', 'your guilty pleasure song', 'sharing playlists', 'music taste compatibility',
  ],
  'hot-takes': [
    'splitting bills', 'money in relationships', 'gender roles', 'staying friends with an ex', 'social media privacy', 'posting your partner',
    'marriage', 'having children', 'friendship loyalty', 'work-life balance', 'university degrees', 'remote work', 'church culture',
    'celebrity culture', 'dating apps', 'ghosting', 'apologies', 'forgiveness', 'living with family as an adult', 'career ambition',
  ],
  'faith-spirituality': [
    'purpose', 'prayer', 'doubt', 'gratitude', 'forgiveness', 'spiritual discipline', 'community', 'worship', 'questions about God', 'faith during hard seasons',
    'church', 'Scripture', 'serving others', 'conviction', 'grace', 'calling', 'spiritual growth', 'hope', 'what you believe happens after death', 'how faith shapes decisions',
  ],
  'values-beliefs': [
    'honesty', 'loyalty', 'respect', 'money', 'success', 'ambition', 'kindness', 'justice', 'boundaries', 'commitment',
    'independence', 'family', 'friendship', 'marriage', 'parenting', 'work', 'generosity', 'privacy', 'forgiveness', 'personal growth',
  ],
}

const friendPatterns = [
  ['Chill', t => `What comes to mind first when you think about ${t}?`],
  ['Chill', t => `What is your favourite thing about ${t}?`],
  ['Chill', t => `What is one story about ${t} you never get tired of telling?`],
  ['Chill', t => `What is your most random opinion about ${t}?`],
  ['Chill', t => `If we talked about ${t} for an hour, where would you start?`],
  ['Interesting', t => `What do people usually get wrong about you when it comes to ${t}?`],
  ['Interesting', t => `What is something about ${t} you changed your mind about?`],
  ['Interesting', t => `What does ${t} reveal about your personality?`],
  ['Interesting', t => `What is one choice you made around ${t} that says a lot about you?`],
  ['Interesting', t => `What is the funniest thing ${t} has ever led you into?`],
  ['Deep', t => `How has ${t} shaped the person you are now?`],
  ['Deep', t => `What did ${t} teach you about yourself?`],
  ['Deep', t => `Is there anything about ${t} you wish people understood better about you?`],
  ['Deep', t => `What is one memory involving ${t} that still affects you?`],
  ['Deep', t => `What is something you wish you handled differently when it came to ${t}?`],
  ['No Filter', t => `What is your most unpopular opinion about ${t}?`],
  ['No Filter', t => `What is the part of ${t} you rarely say out loud?`],
  ['No Filter', t => `What is one lie you have told yourself about ${t}?`],
  ['No Filter', t => `What is something about ${t} you would hate being judged for?`],
  ['No Filter', t => `What is one boundary you refuse to compromise on around ${t}?`],
  ['Interesting', t => `If I asked your closest friend about you and ${t}, what would they say?`],
  ['Chill', t => `What is your current relationship with ${t} like?`],
  ['Deep', t => `What version of you shows up most strongly around ${t}?`],
  ['No Filter', t => `What is one thing involving ${t} that would surprise people who know you?`],
  ['Interesting', t => `What question about ${t} do you wish people asked you more often?`],
]

const relationshipPatterns = [
  ['Chill', t => `What would you want me to know about you when it comes to ${t}?`],
  ['Interesting', t => `What does ${t} usually bring out of you in a relationship?`],
  ['Deep', t => `How has ${t} shaped the way you connect with someone you care about?`],
  ['Flirty', t => `What about ${t} would make a date with me more fun for you?`],
  ['Spicy', t => `How does ${t} affect how affectionate or physically close you feel with someone?`],

  ['Chill', t => `What would a good experience around ${t} look like for us?`],
  ['Interesting', t => `What is one thing you would want us to understand about each other around ${t}?`],
  ['Deep', t => `What fear or hope do you carry into relationships when it comes to ${t}?`],
  ['Flirty', t => `What playful side of you comes out around ${t}?`],
  ['Spicy', t => `What boundary around ${t} matters to you when attraction gets stronger?`],

  ['Chill', t => `What is your favourite memory involving ${t}?`],
  ['Interesting', t => `What is something about ${t} you would enjoy learning about me?`],
  ['Deep', t => `What would make you feel safe talking openly with me about ${t}?`],
  ['Flirty', t => `What would make ${t} feel more romantic to you?`],
  ['Spicy', t => `How would you want us to talk about desire, comfort and boundaries around ${t}?`],

  ['Chill', t => `If we had a whole day centred around ${t}, what would you want it to look like?`],
  ['Interesting', t => `Where do you think we might be surprisingly similar about ${t}?`],
  ['Deep', t => `What is one past experience around ${t} that you would want a partner to understand?`],
  ['Flirty', t => `What part of ${t} feels easiest to turn into a cute memory together?`],
  ['Spicy', t => `When it comes to ${t}, what helps you feel wanted without feeling pressured?`],

  ['No Filter', t => `What is one opinion about ${t} that might start an argument between us?`],
  ['No Filter', t => `What would be a deal-breaker for you when it comes to ${t}?`],
  ['No Filter', t => `What is something about ${t} you would rather hear the hard truth about than be protected from?`],
  ['No Filter', t => `What is one uncomfortable conversation about ${t} you think couples should have earlier?`],
  ['No Filter', t => `If we strongly disagreed about ${t}, what would you need from me during the conversation?`],
]

const stageByPattern = relationshipStages

const customConversationPrompts = {
  'getting-to-know-you': {
    friend: [
      'What is one thing you could tell me that I would have a hard time believing?',
      'Are you more of a saver or a spender?',
      'What makes you feel like you have known someone for years, even when you just met?',
    ],
    relationship: [
      'What is one thing about you that you think I still would not guess?',
      'Are you more of a saver or a spender, and how would you want money to work in a relationship?',
      'What made you want to keep talking to me after we first met?',
    ],
  },
  'growing-up': {
    friend: ['How was life during secondary school for you?'],
    relationship: ['How was life during secondary school for you, and what part of that version of you still shows up now?'],
  },
}

const christianTopicSet = new Set(['prayer', 'questions about God', 'church', 'Scripture', 'worship', 'grace', 'calling'])

function makeConversationPrompts(categoryId, mode) {
  const category = conversationCategories.find(c => c.id === categoryId)
  const topics = profiles[categoryId]
  const patterns = mode === 'friend' ? friendPatterns : relationshipPatterns
  const prompts = []
  let count = 0

  for (let t = 0; t < topics.length; t += 1) {
    for (let p = 0; p < patterns.length; p += 1) {
      const [intensity, render] = patterns[p]
      const text = render(topics[t])
      const stage = mode === 'relationship' ? stageByPattern[(t + p) % relationshipStages.length] : null
      const audience = intensity === 'Spicy' ? '18+' : 'General'
      const faithType = categoryId === 'faith-spirituality'
        ? christianTopicSet.has(topics[t]) ? 'Christian' : 'General Spirituality'
        : null
      prompts.push({
        id: `${categoryId}-${mode}-${count}`,
        categoryId,
        categoryName: category.name,
        mode,
        text,
        copyText: text,
        intensity,
        stage,
        audience,
        faithType,
        subtype: null,
        tags: [category.name.toLowerCase(), topics[t].toLowerCase(), intensity.toLowerCase(), mode],
      })
      count += 1
    }
  }

  const overrides = customConversationPrompts[categoryId]?.[mode] || []
  overrides.forEach((text, i) => {
    if (!prompts[i]) return
    prompts[i] = {
      ...prompts[i],
      text,
      copyText: text,
      tags: [...prompts[i].tags, 'featured'],
    }
  })

  return prompts.slice(0, 500)
}

const truthSubjectsFriend = [
  'a crush you never admitted', 'the last lie you told', 'an embarrassing DM', 'someone you stalked online', 'a friendship you miss',
  'a secret talent', 'a bad first impression', 'a petty reason you disliked someone', 'a time you faked confidence', 'a message you regretted sending',
  'a person you judged too quickly', 'something you pretend to understand', 'the weirdest thing in your notes app', 'a guilty pleasure', 'a jealous moment',
  'a bad habit', 'your worst date story', 'a time you got caught lying', 'a risky decision', 'something you wish your friends asked you about',
]

const truthSubjectsRelationship = [
  'your first impression of me', 'something you find attractive about me', 'a relationship fear', 'an ex', 'jealousy', 'your biggest relationship lesson',
  'a boundary you learnt late', 'something you want more of from me', 'a moment you felt close to me', 'a moment you misunderstood me',
  'a date idea you have not said yet', 'a relationship insecurity', 'something you find hard to ask for', 'a habit of mine you secretly like',
  'a habit of mine that annoys you', 'your idea of commitment', 'physical affection', 'trust', 'money as a couple', 'our future',
]

const truthTemplates = [
  s => `Tell me the full story about ${s}.`,
  s => `What is the most honest thing you could say about ${s}?`,
  s => `What have you never told most people about ${s}?`,
  s => `What is the awkward truth about ${s}?`,
  s => `What would surprise me most about ${s}?`,
  s => `When did ${s} become a real thing for you?`,
  s => `What is your first instinct when ${s} comes up?`,
  s => `What is one detail about ${s} you usually leave out?`,
  s => `What do you wish you handled differently about ${s}?`,
  s => `Who knows the most about ${s}?`,
  s => `What is the funniest part of ${s}?`,
  s => `What is the hardest part of ${s} to admit?`,
  s => `What would your closest person say about ${s}?`,
  s => `What is one lesson you took from ${s}?`,
  s => `What is the boldest thing you have done because of ${s}?`,
  s => `What is one thing you still overthink about ${s}?`,
  s => `What is one assumption people make about ${s} that is wrong?`,
  s => `If you had to confess one thing about ${s}, what would it be?`,
  s => `What emotion do you connect most strongly with ${s}?`,
  s => `What is one thing you would never repeat about ${s}?`,
  s => `What is the most recent time ${s} crossed your mind?`,
  s => `What would you change about ${s} if nobody judged you?`,
  s => `What is something you learnt too late about ${s}?`,
  s => `What is your most unpopular view about ${s}?`,
  s => `What question about ${s} would make you pause before answering?`,
]

const dareActionsFriend = [
  'send your funniest recent selfie', 'read the last line in your notes app', 'send a voice note doing a dramatic movie trailer voice',
  'show the last meme you saved', 'send the fifth photo in your camera roll', 'describe me using only three emojis', 'change my contact name for ten minutes',
  'send a voice note singing the chorus of a song you know well', 'tell me your worst joke with a straight face', 'send a photo of whatever is directly in front of you',
  'type your next message with your eyes closed', 'show your current lock screen', 'send the oldest selfie you still have on your phone', 'do your best impression of someone we both know',
  'send a five-second dance video', 'let me choose your next profile status', 'send your most-used emoji five times', 'tell a childhood story in under thirty seconds',
  'send a voice note in your most formal voice', 'share the last song you played',
]

const dareActionsRelationship = [
  'send me a selfie you think I would like', 'send a voice note saying the first thing you liked about me', 'describe our vibe using three songs',
  'send me a photo that reminds you of us', 'give me a new nickname and use it for the next ten messages', 'send a ten-second voice note flirting with me',
  'tell me one compliment you have been holding back', 'send the last photo of us on your phone', 'plan a mini date in three messages', 'tell me what outfit of mine you remember most',
  'send a voice note saying what you miss about me', 'pick a song for our current mood and send it', 'describe your ideal kiss in one sentence', 'tell me one thing you want us to do together soon',
  'send one message you would have been too shy to send when we first met', 'rename me in your phone for the next hour', 'send a cute photo from your camera roll',
  'tell me the first moment you realised you liked me', 'send a voice note saying my name in your favourite way', 'give me a dare back immediately',
]

const dareTwists = [
  'No overthinking.', 'You have thirty seconds.', 'No deleting after you send it.', 'Do it in one take.', 'Keep it honest.',
  'Pick the first thing that comes to mind.', 'No explanation until after.', 'Make it dramatic.', 'Keep it under one minute.', 'Do it right now.',
  'No asking for another prompt.', 'Make it funny.', 'Make it sincere.', 'Use only what is already on your phone.', 'No searching for the perfect answer.',
  'Send the first version.', 'Do not edit it.', 'Keep it simple.', 'Do it without leaving the call.', 'Do it before the next question.',
  'Let the other person choose the final detail.', 'Add one unexpected detail.', 'Make it slightly embarrassing.', 'Keep it wholesome.', 'Your turn starts now.',
]

function buildTruthDare(mode) {
  const truths = []
  const dares = []
  const subjects = mode === 'friend' ? truthSubjectsFriend : truthSubjectsRelationship
  const actions = mode === 'friend' ? dareActionsFriend : dareActionsRelationship
  for (let i = 0; i < 500; i += 1) {
    const s = subjects[i % subjects.length]
    const template = truthTemplates[Math.floor(i / subjects.length) % truthTemplates.length]
    const truthText = template(s)
    const action = actions[i % actions.length]
    const twist = dareTwists[Math.floor(i / actions.length) % dareTwists.length]
    const dareText = `${action}. ${twist}`
    const intensityList = mode === 'friend' ? friendIntensities : relationshipIntensities
    const intensity = intensityList[i % intensityList.length]
    const audience = intensity === 'Spicy' ? '18+' : 'General'
    const stage = mode === 'relationship' ? relationshipStages[i % relationshipStages.length] : null
    truths.push(gamePrompt('truth-dare', mode, `truth-${i}`, truthText, intensity, audience, stage, 'Truth'))
    dares.push(gamePrompt('truth-dare', mode, `dare-${i}`, dareText, intensity, audience, stage, 'Dare'))
  }
  return [...truths, ...dares]
}

function gamePrompt(categoryId, mode, suffix, text, intensity, audience = 'General', stage = null, subtype = null, extra = {}) {
  const category = allCategories.find(c => c.id === categoryId)
  return {
    id: `${categoryId}-${mode}-${suffix}`,
    categoryId,
    categoryName: category.name,
    mode,
    text,
    copyText: text,
    intensity,
    audience,
    stage,
    subtype,
    faithType: null,
    tags: [category.name.toLowerCase(), mode, intensity.toLowerCase(), ...(extra.tags || [])],
    ...extra,
  }
}

const neverFriendActions = [
  'pretended not to see someone I knew in public', 'sent a message to the wrong person', 'lied about being busy to avoid plans', 'stalked an old crush online',
  'laughed at the wrong moment', 'forgot someone’s name while talking to them', 'faked understanding a joke', 'borrowed something and forgot to return it',
  'made up an excuse to leave early', 're-read an old conversation for no reason', 'screen-shotted a chat and sent it to someone else', 'judged a person before getting to know them',
  'pretended my phone was dying', 'fallen asleep during a call', 'cancelled plans because I wanted to stay home', 'been caught singing when I thought nobody was listening',
  'kept a ridiculous grudge', 'deleted and rewrote a message several times', 'googled someone before meeting them', 'blamed traffic when I was simply late',
]
const neverRelationshipActions = [
  'checked someone’s last seen because I was waiting for a reply', 'felt jealous and acted like I was fine', 'imagined a future with someone too early', 'compared a new person with an ex',
  'kept a message because it made me smile', 'overanalysed a short reply', 'wanted reassurance but refused to ask for it', 'tested someone instead of saying what I needed',
  'looked through old photos because I missed someone', 'been nervous before a simple date', 'pretended not to care when I cared a lot', 'changed an outfit several times before seeing someone',
  'felt possessive and knew it was irrational', 'wanted to say “I miss you” first but held back', 'replayed a compliment in my head', 'been scared of liking someone too much',
  'thought about marriage while still getting to know someone', 'kept a relationship worry to myself', 'wanted more affection but stayed quiet', 'read meaning into an emoji',
]
const neverContexts = [
  '', 'and regretted it later', 'more than once', 'because I was embarrassed', 'because I was jealous', 'because I was tired', 'and got caught',
  'then acted like nothing happened', 'because I did not know what else to do', 'and told nobody about it', 'during school', 'at work', 'during a late-night conversation',
  'on a weekend', 'while travelling', 'because of a crush', 'because of a friend', 'after midnight', 'when I should have been sleeping', 'and laughed about it later',
  'then denied it', 'and immediately changed my mind', 'for a petty reason', 'because I was overthinking', 'and still think about it sometimes',
]

function buildNever(mode) {
  const actions = mode === 'friend' ? neverFriendActions : neverRelationshipActions
  return Array.from({ length: 500 }, (_, i) => {
    const action = actions[i % actions.length]
    const context = neverContexts[Math.floor(i / actions.length) % neverContexts.length]
    const text = `Never have I ever ${action}${context ? ` ${context}` : ''}.`
    const intensityList = mode === 'friend' ? friendIntensities : relationshipIntensities
    const intensity = intensityList[i % intensityList.length]
    const audience = intensity === 'Spicy' ? '18+' : 'General'
    const stage = mode === 'relationship' ? relationshipStages[i % relationshipStages.length] : null
    return gamePrompt('never-have-i-ever', mode, i, text, intensity, audience, stage)
  })
}

const twoTruthPoolFriend = [
  'I have missed a flight or bus because I was late.', 'I once pretended to be sick to avoid something.', 'I have won a competition.', 'I have never broken a bone.',
  'I have met someone famous.', 'I once got lost in a place I knew well.', 'I have cried because of a film.', 'I have eaten the same meal for a week.',
  'I have had a nickname I hated.', 'I have lied about my age.', 'I have been on stage in front of a crowd.', 'I have kept a secret for years.',
  'I have sent a message I wished I could take back.', 'I have travelled somewhere alone.', 'I have fallen asleep in class or at work.', 'I have been mistaken for someone else.',
  'I have had a crush on someone unexpected.', 'I have broken something and blamed someone else.', 'I have stayed awake all night talking.', 'I have changed my mind about someone completely.',
]
const twoTruthPoolRelationship = [
  'I noticed you before you noticed me.', 'I have imagined a future trip with you.', 'I have re-read one of your messages because it made me smile.', 'I have been jealous and kept quiet about it.',
  'I remember what you wore the first time we met.', 'I have told a friend something cute about you.', 'I have worried you were losing interest.', 'I have saved a photo of you because I liked it.',
  'I have planned a date idea in my head and never mentioned it.', 'I have missed you while pretending I was fine.', 'I have compared our relationship with someone else’s.', 'I have thought about what our home would look like.',
  'I have wanted to call you and stopped myself.', 'I have overanalysed one of your replies.', 'I have smiled at my phone because of you in public.', 'I have rehearsed something before saying it to you.',
  'I have worried about meeting your family.', 'I have thought about what song fits us.', 'I have wanted more affection and stayed quiet.', 'I have changed my mind about relationships because of you.',
]
function buildTwoTruths(mode) {
  const pool = mode === 'friend' ? twoTruthPoolFriend : twoTruthPoolRelationship
  const combinations = []
  for (let a = 0; a < pool.length - 2; a += 1) {
    for (let b = a + 1; b < pool.length - 1; b += 1) {
      for (let c = b + 1; c < pool.length; c += 1) {
        combinations.push([pool[a], pool[b], pool[c]])
      }
    }
  }
  return Array.from({ length: 500 }, (_, i) => {
    const statements = combinations[(i * 37) % combinations.length]
    const text = `${statements[0]}\n${statements[1]}\n${statements[2]}`
    const intensityList = mode === 'friend' ? friendIntensities : relationshipIntensities
    const intensity = intensityList[i % intensityList.length]
    const audience = intensity === 'Spicy' ? '18+' : 'General'
    const stage = mode === 'relationship' ? relationshipStages[i % relationshipStages.length] : null
    return gamePrompt('two-truths-lie', mode, i, text, intensity, audience, stage, null, { statements })
  })
}

const kmaPeople = [
  'Burna Boy', 'Tems', 'Davido', 'Ayra Starr', 'Rema', 'Wizkid', 'Tiwa Savage', 'Asake', 'Shallipopi', 'Fireboy DML',
  'Michael B. Jordan', 'Zendaya', 'Idris Elba', 'Rihanna', 'Drake', 'Beyoncé', 'Damson Idris', 'SZA', 'Central Cee', 'Ayo Edebiri',
  'your secondary school crush', 'your celebrity crush', 'your first crush', 'a mysterious billionaire', 'a funny broke creative', 'a quiet bookworm',
  'a famous athlete', 'a charming chef', 'a brilliant doctor', 'a touring musician', 'a childhood friend', 'your office crush', 'a confident introvert',
  'a soft-spoken extrovert', 'a stylish entrepreneur', 'a talented actor', 'a travel creator', 'a gamer with perfect banter', 'a gym person', 'a hopeless romantic',
]
function buildKMA(mode) {
  const combinations = []
  for (let a = 0; a < kmaPeople.length - 2; a += 1) {
    for (let b = a + 1; b < kmaPeople.length - 1; b += 1) {
      for (let c = b + 1; c < kmaPeople.length; c += 1) {
        combinations.push([kmaPeople[a], kmaPeople[b], kmaPeople[c]])
      }
    }
  }
  return Array.from({ length: 500 }, (_, i) => {
    const trio = combinations[(i * 37) % combinations.length]
    const text = `Kiss, Marry, Avoid: ${trio[0]}, ${trio[1]}, ${trio[2]}.`
    const intensityList = mode === 'friend' ? friendIntensities : relationshipIntensities
    const intensity = intensityList[i % intensityList.length]
    const stage = mode === 'relationship' ? relationshipStages[i % relationshipStages.length] : null
    return gamePrompt('kiss-marry-avoid', mode, i, text, intensity, 'General', stage, null, { choices: trio })
  })
}

const scenarioFriend = [
  'your close friend starts dating your ex without telling you', 'a friend borrows money and avoids you afterwards', 'you find out a friend shared something private about you',
  'two close friends fall out and both expect you to choose a side', 'a friend keeps cancelling plans at the last minute', 'someone takes credit for your idea at work or school',
  'you find a wallet with a large amount of cash', 'you accidentally see a private message about yourself', 'your friend is making a decision you think is terrible',
  'you get invited somewhere and your closest friend is deliberately excluded', 'a friend keeps copying your ideas', 'someone embarrasses your friend in public',
  'a friend asks you to cover a lie for them', 'you notice your friend’s partner flirting with someone else', 'you win a large amount of money unexpectedly',
  'you realise you have been unfair to someone for years', 'a friend starts acting differently after becoming successful', 'you get a job offer abroad with one week to decide',
  'you hear a rumour about yourself from someone you trust', 'someone from your past apologises after years of silence',
]
const scenarioRelationship = [
  'your partner gets a dream job in another country', 'your partner wants to lend a large amount of money to a family member', 'an ex sends your partner a late-night message',
  'you find out your partner hid a financial problem', 'your partner becomes close friends with someone you feel uneasy about', 'one person wants children soon and the other wants to wait',
  'your families strongly disagree about a major relationship decision', 'your partner forgets an important date', 'one person earns much more than the other',
  'your partner wants far more alone time than you do', 'you disagree about posting the relationship online', 'your partner gets a job that requires constant travel',
  'you learn your partner told a friend something private about your relationship', 'you disagree about where to live', 'one person wants to merge finances and the other does not',
  'your partner is still close with an ex’s family', 'you both have a free month but completely different travel plans', 'you disagree about how often to see extended family',
  'your partner wants to change careers and take a major pay cut', 'you realise you have different ideas of what marriage should look like',
]
const scenarioTwists = [
  'What do you do first?', 'What would matter most in your decision?', 'What would you say before making any decision?', 'Would you confront it immediately or wait?',
  'What outcome would feel fair?', 'What boundary would you set?', 'What would make you change your mind?', 'Who would you talk to before deciding?',
  'What would you refuse to do?', 'What would a calm response look like?', 'What would make this a deal-breaker?', 'What would you need to hear?',
  'Would you forgive it?', 'How long would you think about it?', 'What would make you trust the situation again?', 'Would your answer change if money was involved?',
  'Would your answer change if family was involved?', 'Would you tell other people about it?', 'What would your younger self do?', 'What would your current self do differently?',
  'What detail would change your answer completely?', 'Would you choose peace or principle?', 'What would you regret doing?', 'What would you regret not doing?', 'What is the hardest part of the decision?',
]
function buildScenarios(mode) {
  const scenarios = mode === 'friend' ? scenarioFriend : scenarioRelationship
  return Array.from({ length: 500 }, (_, i) => {
    const text = `Scenario: ${scenarios[i % scenarios.length]}. ${scenarioTwists[Math.floor(i / scenarios.length) % scenarioTwists.length]}`
    const intensityList = mode === 'friend' ? friendIntensities : relationshipIntensities
    const intensity = intensityList[i % intensityList.length]
    const audience = intensity === 'Spicy' ? '18+' : 'General'
    const stage = mode === 'relationship' ? relationshipStages[i % relationshipStages.length] : null
    return gamePrompt('what-would-you-do', mode, i, text, intensity, audience, stage)
  })
}

const choiceA = [
  'have more money but less free time', 'live near family forever', 'always know when someone is lying', 'lose social media for a year', 'take a dream job abroad',
  'have a tiny circle of loyal friends', 'know exactly what your future looks like', 'be famous but have no privacy', 'work four long days a week', 'own a home far from the city',
  'redo one year of your life', 'always say what you think', 'be able to read minds once a day', 'travel constantly for work', 'have perfect memory',
  'give up music for a year', 'never eat your favourite meal again', 'always be thirty minutes early', 'live somewhere cold', 'have a job you love with average pay', 'live without online shopping', 'always know the weather one week ahead', 'take a year off work at thirty', 'speak every language', 'never need sleep',
]
const choiceB = [
  'have less money but plenty of free time', 'move anywhere you want whenever you want', 'never know when someone is lying', 'lose streaming services for a year', 'stay close to home for a comfortable job',
  'know hundreds of people but trust only a few', 'let the future stay completely unknown', 'stay anonymous with complete privacy', 'work five shorter days a week', 'rent in the middle of the city',
  'skip one difficult year of your life', 'always know when to stay quiet', 'have one perfect prediction each month', 'work from one place forever', 'forget every embarrassing moment',
  'give up films for a year', 'eat the same favourite meal every week', 'always arrive five minutes late', 'live somewhere hot', 'have a job you dislike with huge pay', 'live without food delivery', 'always be surprised by the weather', 'work continuously and retire early', 'master one language perfectly', 'sleep ten hours every night',
]
const relationshipChoiceA = [
  'date someone who earns more but works all the time', 'have a big wedding and delay buying a home', 'live near your family', 'share every password', 'combine all finances',
  'have one big holiday each year', 'talk through conflict immediately', 'get married sooner and figure things out together', 'have children earlier', 'post your relationship often',
  'choose chemistry over lifestyle compatibility', 'live in a smaller home in the perfect area', 'spend weekends mostly together', 'tell each other every detail about past relationships', 'receive gifts often',
  'have a partner with your exact personality', 'build a business together', 'move abroad for your partner’s opportunity', 'have date night every week', 'plan everything months ahead', 'live close to both families', 'save aggressively for five years', 'have separate hobbies most evenings', 'celebrate every monthly anniversary', 'know every detail of each other’s day',
]
const relationshipChoiceB = [
  'date someone who earns less but has plenty of time for you', 'have a small wedding and buy a home sooner', 'live near your partner’s family', 'keep passwords private', 'keep separate accounts and split shared costs',
  'take several cheap short trips', 'cool down before discussing conflict', 'wait longer before marriage', 'have children later', 'keep your relationship mostly offline',
  'choose lifestyle compatibility over intense chemistry', 'live in a larger home far from everything', 'protect separate weekend time', 'keep some past details private', 'receive thoughtful words often',
  'have a partner who balances your personality', 'keep work and relationship separate', 'stay home and protect your own career', 'have one big date each month', 'make plans as life happens', 'live far from both families', 'spend more now and save gradually', 'share most hobbies and free time', 'celebrate only major anniversaries', 'keep parts of each day completely private',
]
function buildChoices(mode) {
  const left = mode === 'friend' ? choiceA : relationshipChoiceA
  const right = mode === 'friend' ? choiceB : relationshipChoiceB
  return Array.from({ length: 500 }, (_, i) => {
    const a = left[i % left.length]
    const b = right[(i * 7 + Math.floor(i / left.length)) % right.length]
    const text = `If you had to choose, would you rather ${a} or ${b}?`
    const intensityList = mode === 'friend' ? friendIntensities : relationshipIntensities
    const intensity = intensityList[i % intensityList.length]
    const audience = intensity === 'Spicy' ? '18+' : 'General'
    const stage = mode === 'relationship' ? relationshipStages[i % relationshipStages.length] : null
    return gamePrompt('if-you-had-to-choose', mode, i, text, intensity, audience, stage, null, { choices: [a, b] })
  })
}

const likelyActionsFriend = [
  'reply after three business days', 'get lost on a simple journey', 'become famous', 'start laughing during a serious moment', 'spend all their money on food',
  'forget a birthday', 'move abroad with little warning', 'adopt a random pet', 'win an argument with pure confidence', 'fall asleep on a call',
  'cry during a film', 'become rich first', 'send a risky text', 'survive longest on a reality show', 'get married first', 'cancel plans to stay home',
  'start a business', 'be late to their own event', 'remember tiny details', 'make friends with a stranger',
]
const likelyActionsRelationship = [
  'say “I miss you” first', 'plan the better surprise date', 'get jealous first', 'fall asleep during a late-night call', 'remember an anniversary without a reminder',
  'apologise first after an argument', 'spend more on gifts', 'want more cuddles', 'suggest a spontaneous trip', 'take more photos together',
  'cry during a romantic film', 'send the longer paragraph', 'overthink a short reply', 'want to stay in instead of going out', 'start talking about the future first',
  'be more protective', 'forget where they put their phone', 'make the other person laugh during an argument', 'plan the wedding details first', 'say something cheesy and mean it',
]
const likelyContexts = ['on holiday', 'after midnight', 'during a stressful week', 'on a random Tuesday', 'at a party', 'during a road trip', 'while hungry', 'when tired', 'around family', 'with no warning', 'during a wedding', 'at the airport', 'on a rainy day', 'during a long phone call', 'while shopping', 'after an argument', 'on a first outing', 'during a game night', 'at work', 'during a family event', 'while travelling abroad', 'on a Sunday afternoon', 'during a power cut', 'while trying to save money', 'when everyone else is asleep']
function buildLikely(mode) {
  const actions = mode === 'friend' ? likelyActionsFriend : likelyActionsRelationship
  return Array.from({ length: 500 }, (_, i) => {
    const action = actions[i % actions.length]
    const context = likelyContexts[Math.floor(i / actions.length) % likelyContexts.length]
    const text = `Who is more likely to ${action} ${context}?`
    const intensityList = mode === 'friend' ? friendIntensities : relationshipIntensities
    const intensity = intensityList[i % intensityList.length]
    const stage = mode === 'relationship' ? relationshipStages[i % relationshipStages.length] : null
    return gamePrompt('who-is-more-likely', mode, i, text, intensity, 'General', stage)
  })
}

const knowTopicsFriend = [
  'my comfort food', 'my biggest pet peeve', 'my dream holiday', 'my favourite music mood', 'the thing that stresses me fastest', 'my biggest goal right now',
  'the person I call first', 'my ideal weekend', 'my most-used app', 'the thing I spend too much money on', 'my favourite childhood memory', 'my go-to order',
  'what makes me laugh fastest', 'my worst habit', 'the kind of gift I value', 'what I do when I need space', 'my favourite time of day', 'what I fear most',
  'the job I would do for fun', 'the place I want to visit most',
]
const knowTopicsRelationship = [
  'what makes me feel loved', 'what makes me feel ignored', 'my favourite thing about us', 'my ideal date', 'what I need after a hard day', 'what I overthink most',
  'what makes me jealous', 'what I want more of in our relationship', 'my favourite memory of us', 'what I find most attractive about you', 'my relationship deal-breaker',
  'my idea of a perfect weekend together', 'what makes me feel reassured', 'the kind of affection I prefer', 'my biggest relationship fear', 'what I want our future to feel like',
  'how I prefer to resolve conflict', 'what I would spend a surprise ₦1 million on', 'what I would choose for our next trip', 'what I think we disagree about most',
]
const knowTemplates = [
  t => `Without asking me, what do you think ${t} is?`, t => `Guess ${t}.`, t => `How confident are you that you know ${t}? Give your answer first.`,
  t => `What would you bet ${t} is?`, t => `If you had one guess for ${t}, what would you pick?`, t => `What answer do you think I would give for ${t}?`,
  t => `Tell me ${t} before I tell you.`, t => `Do you think you know ${t}? Prove it.`, t => `What is your first guess for ${t}?`, t => `No clues. What is ${t}?`,
  t => `If my closest person answered for me, what would they say ${t} is?`, t => `What have you noticed about ${t}?`, t => `What do you think changed recently about ${t}?`,
  t => `What do you think I would never choose when it comes to ${t}?`, t => `What detail gives away ${t}?`, t => `What do you think surprises people about ${t}?`,
  t => `What do you think I am most specific about when it comes to ${t}?`, t => `What would be your second guess for ${t}?`, t => `What answer would shock you if I gave it for ${t}?`,
  t => `What do you think I would answer for ${t} on a bad day?`, t => `What do you think I would answer for ${t} on a good day?`, t => `What would you pick for me if you had to decide ${t}?`,
  t => `How close do you think your guess for ${t} will be?`, t => `What clue about me points to ${t}?`, t => `What is the boldest guess you have for ${t}?`,
]
function buildKnowMe(mode) {
  const topics = mode === 'friend' ? knowTopicsFriend : knowTopicsRelationship
  return Array.from({ length: 500 }, (_, i) => {
    const text = knowTemplates[Math.floor(i / topics.length) % knowTemplates.length](topics[i % topics.length])
    const intensityList = mode === 'friend' ? friendIntensities : relationshipIntensities
    const intensity = intensityList[i % intensityList.length]
    const stage = mode === 'relationship' ? relationshipStages[i % relationshipStages.length] : null
    return gamePrompt('how-well-do-you-know-me', mode, i, text, intensity, intensity === 'Spicy' ? '18+' : 'General', stage)
  })
}

const sentenceFriend = [
  'I feel most like myself when', 'One thing I wish people understood about me is', 'My perfect lazy day starts with', 'The fastest way to make me laugh is',
  'A friendship means the most to me when', 'I knew I was growing up when', 'One thing I never get tired of is', 'If money did not matter, I would spend more time',
  'The weirdest thing I enjoy is', 'I feel proud of myself when', 'I wish I was better at', 'The best compliment someone gave me was',
  'When I need space, I usually', 'My younger self would be shocked that I', 'One thing I want to do before this year ends is', 'My biggest green flag in a friend is',
  'A tiny thing that ruins my mood is', 'I know I trust someone when', 'The most random thing on my bucket list is', 'Right now, life feels like',
]
const sentenceRelationship = [
  'I feel closest to you when', 'I knew I liked you when', 'One thing I want more of from us is', 'I feel most loved when', 'I feel most attractive when',
  'One thing I find hard to say in relationships is', 'A future with you feels exciting when I think about', 'I feel reassured by you when', 'One date I want us to have is',
  'The first thing I noticed about you was', 'I miss you most when', 'A small thing you do that I love is', 'I feel safe with someone when', 'One boundary I need respected is',
  'A relationship feels healthy to me when', 'The best kind of affection for me is', 'One thing I want us to laugh about years from now is', 'I get jealous when',
  'One thing I hope never changes about us is', 'If we had a free weekend tomorrow, I would want us to',
]
const sentenceContexts = [
  '', 'without overthinking it', 'and the honest answer is', 'even if it sounds silly', 'when nobody is judging', 'on a difficult day', 'on a good day',
  'if I had to answer in one sentence', 'right now', 'five years ago', 'these days', 'more than I admit', 'when I feel comfortable', 'when I am tired',
  'when I feel brave', 'if I stopped trying to sound cool', 'when I am completely honest', 'if I had to text the answer', 'if I had to say it on a call', 'if I only had ten seconds',
  'without explaining why', 'and I wish more people knew this', 'and I learnt this recently', 'even though I rarely say it', 'and my answer might surprise you',
]
function buildFinish(mode) {
  const starters = mode === 'friend' ? sentenceFriend : sentenceRelationship
  return Array.from({ length: 500 }, (_, i) => {
    const starter = starters[i % starters.length]
    const context = sentenceContexts[Math.floor(i / starters.length) % sentenceContexts.length]
    const text = `Finish the sentence: “${starter}${context ? ` ${context}` : ''}…”`
    const intensityList = mode === 'friend' ? friendIntensities : relationshipIntensities
    const intensity = intensityList[i % intensityList.length]
    const stage = mode === 'relationship' ? relationshipStages[i % relationshipStages.length] : null
    return gamePrompt('finish-the-sentence', mode, i, text, intensity, intensity === 'Spicy' ? '18+' : 'General', stage)
  })
}

const cache = new Map()

export function getPrompts(categoryId, mode) {
  const key = `${categoryId}:${mode}`
  if (cache.has(key)) return cache.get(key)

  let prompts = []
  if (profiles[categoryId]) prompts = makeConversationPrompts(categoryId, mode)
  else if (categoryId === 'truth-dare') prompts = buildTruthDare(mode)
  else if (categoryId === 'never-have-i-ever') prompts = buildNever(mode)
  else if (categoryId === 'two-truths-lie') prompts = buildTwoTruths(mode)
  else if (categoryId === 'kiss-marry-avoid') prompts = buildKMA(mode)
  else if (categoryId === 'what-would-you-do') prompts = buildScenarios(mode)
  else if (categoryId === 'if-you-had-to-choose') prompts = buildChoices(mode)
  else if (categoryId === 'who-is-more-likely') prompts = buildLikely(mode)
  else if (categoryId === 'how-well-do-you-know-me') prompts = buildKnowMe(mode)
  else if (categoryId === 'finish-the-sentence') prompts = buildFinish(mode)

  cache.set(key, prompts)
  return prompts
}

export function getAllPrompts(mode) {
  return allCategories.flatMap(category => getPrompts(category.id, mode))
}
