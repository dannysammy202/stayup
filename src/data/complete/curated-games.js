import { FRIEND_INTENSITIES, RELATIONSHIP_INTENSITIES, RELATIONSHIP_STAGES } from '../catalog.js'

const hash = value => {
  let h = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

const mix = (items, salt) => [...items]
  .map((item, index) => ({ item, score: hash(`${salt}|${index}|${item.text || item}`) }))
  .sort((a, b) => a.score - b.score)
  .map(entry => entry.item)

function combos(items, size) {
  const out = []
  const walk = (start, picked) => {
    if (picked.length === size) {
      out.push([...picked])
      return
    }
    for (let i = start; i <= items.length - (size - picked.length); i += 1) {
      picked.push(items[i])
      walk(i + 1, picked)
      picked.pop()
    }
  }
  walk(0, [])
  return out
}

function meta(mode, index, stage = null) {
  const intensity = mode === 'friend'
    ? FRIEND_INTENSITIES[index % FRIEND_INTENSITIES.length]
    : RELATIONSHIP_INTENSITIES[index % RELATIONSHIP_INTENSITIES.length]
  return {
    intensity,
    ...(mode === 'relationship' ? { stage: stage || RELATIONSHIP_STAGES[index % RELATIONSHIP_STAGES.length] } : {}),
    audience: intensity === 'Spicy' ? '18+' : 'general',
  }
}

const friendTruthTopics = [
  'secondary school', 'primary school', 'your strictest teacher', 'school punishment', 'a school crush', 'a friendship you mishandled', 'a friend you drifted from', 'an embarrassing public moment', 'a lie that became too big', 'a message you regret sending',
  'a message you are glad you deleted', 'money you wasted', 'something you bought to impress people', 'a time you pretended to understand something', 'a time you blamed network unfairly', 'an excuse you used to avoid an outing', 'a person you avoided greeting', 'a time you snooped where you should not have', 'a social-media habit you hide', 'your most unserious jealousy',
  'a family rule you secretly broke', 'a chore you regularly escaped', 'food you hid so you would not share', 'something you blamed on a sibling', 'a time you disappointed your parents', 'a university mistake', 'an NYSC story', 'a work mistake nobody noticed', 'a job you nearly quit impulsively', 'a side hustle that failed',
  'a bad transport experience', 'your worst Lagos traffic decision', 'a trip that went wrong', 'a party you should have left earlier', 'a wedding expense you regretted', 'a fashion phase you deny', 'an old username or email address', 'a celebrity crush', 'an unpopular music opinion', 'a film everyone likes except you',
  'a church moment that embarrassed you', 'a prayer you made for a funny reason', 'a habit you judge people for', 'a boundary you learnt late', 'a person you forgave too easily', 'a time you were the toxic friend', 'a secret talent you rarely show', 'something you pretend not to care about', 'a compliment you still remember', 'something you want to become better at'
]

const friendTruthFrames = [
  t => `What is the funniest truth you can admit about ${t}?`,
  t => `What is something about ${t} you would rather your friends did not bring up in public?`,
  t => `What is the most embarrassing thing connected to ${t}?`,
  t => `What is one thing you did around ${t} that you would handle differently now?`,
  t => `What is one opinion about ${t} you usually keep to yourself?`,
  t => `What is the biggest lie or excuse you have used around ${t}?`,
  t => `What is something about ${t} you were too proud to admit at the time?`,
  t => `What is the pettiest thing you have done because of ${t}?`,
  t => `What is one thing about ${t} that still makes you cringe when you remember it?`,
  t => `What is the most honest answer you can give about how ${t} affected you?`
]

const friendDareActions = [
  'send a 20-second voice note imitating a secondary school teacher', 'send the last harmless photo in your gallery without context', 'read out the last three harmless things you searched for', 'send a voice note singing the hook of a song you know well', 'describe your outfit like a luxury fashion advert', 'sell the nearest boring object like it costs ₦1 million', 'use your childhood nickname for the next ten minutes', 'send a selfie making the most unserious face you can manage', 'send a song that describes your mood without explaining it', 'tell one embarrassing school story in a voice note',
  'send a voice note in your best fake news-presenter voice', 'give the other person a new nickname and use it for ten minutes', 'describe your last meal like a restaurant critic', 'say the alphabet backwards as far as you can without checking', 'send a photo of the oldest harmless item near you', 'give a one-minute motivational speech about doing laundry', 'read one old harmless status or caption you once posted', 'describe your day using only film titles', 'send three emojis that describe your week and let the other person guess', 'say five Nigerian foods in ten seconds without repeating one',
  'send a voice note pretending to be a bus conductor announcing your destination', 'give a dramatic apology for something completely harmless', 'recommend a terrible film as if it is a masterpiece', 'explain a simple thing as if you are teaching a five-year-old', 'say one tongue twister three times quickly', 'describe your room without using the words room, bed or chair', 'send the most recent meme you saved', 'name five songs you know from the first second', 'read the first harmless note in your Notes app', 'show the oldest harmless screenshot you still have',
  'send a voice note describing your dream holiday in exactly thirty seconds', 'make up a campaign slogan for becoming president of your friend group', 'give the other person a ridiculous award and explain why they won it', 'tell a story using only ten sentences', 'describe your first phone as if it were a person', 'do your best impression of a Nigerian parent calling a child from another room', 'name every school you attended without pausing', 'send a picture of something you use every day but rarely notice', 'give a weather report for your current mood', 'invent a new name for jollof rice and defend it',
  'send a voice note ranking your three most-used apps', 'describe your worst traffic experience in one minute', 'make up a fake advert for your personality', 'tell the funniest family-safe lie you remember from childhood', 'send a song you used to overplay years ago', 'give a one-minute review of your week', 'say three compliments about yourself without joking them away', 'tell the other person one thing you genuinely appreciate about them', 'send a voice note explaining your most useless skill', 'pick one harmless contact name and explain the story behind it'
]

const dareConstraints = [
  a => `${a}.`,
  a => `${a}, and do not restart if you laugh or make a mistake.`,
  a => `${a}, but keep it under thirty seconds.`,
  a => `${a}, and commit to it properly instead of doing a lazy version.`,
  a => `${a}, then let the other person rate the effort out of ten.`,
  a => `${a}, without preparing first.`,
  a => `${a}, using your most serious voice.`,
  a => `${a}, and add one completely unnecessary dramatic detail.`,
  a => `${a}, then explain why you chose what you chose.`,
  a => `${a}, without saying “this is embarrassing” first.`
]

function truthDareFriend() {
  const truths = []
  friendTruthTopics.forEach((topic, ti) => friendTruthFrames.forEach((frame, fi) => truths.push({ text: frame(topic), subtype: 'Truth', ...meta('friend', ti * 10 + fi) })))
  const dares = []
  friendDareActions.forEach((action, ai) => dareConstraints.forEach((frame, fi) => dares.push({ text: frame(action), subtype: 'Dare', ...meta('friend', ai * 10 + fi) })))
  return [...mix(truths, 'truth-friend'), ...mix(dares, 'dare-friend')]
}

const relationshipTruthStageTopics = {
  'Talking Stage': ['your first impression of me', 'what first caught your attention', 'how quickly you knew you were interested', 'something you overthought before replying', 'the first time you checked my page properly', 'what you told a friend about me first', 'a question you wanted to ask but held back', 'what would make you stop talking to somebody early', 'what makes you feel pursued without feeling pressured', 'what you find hardest to read during a talking stage'],
  'New Relationship': ['the first thing that made the relationship feel real', 'something you are still learning about me', 'a small jealousy you did not mention', 'what you need more reassurance about', 'the first boundary you wanted us to understand', 'what makes you feel appreciated early in a relationship', 'something you compare with past experiences', 'a habit of mine you noticed quickly', 'what you are most excited to learn about us', 'what you are still cautious about'],
  'Been Together a While': ['a disagreement you think changed us', 'something I do that you now understand better', 'a habit of mine that still annoys you', 'a way you think we have improved', 'something you miss from the beginning', 'a conversation we keep postponing', 'a part of the relationship you protect strongly', 'something you think we spend too much on', 'a way family or friends affect us', 'something you wish I noticed without being told'],
  'Long-Term Relationship': ['the future plan you think about most', 'a fear you have about marriage or long-term commitment', 'how money could test us', 'how relocation could test us', 'what you want our families to understand about us', 'a sacrifice you would struggle to make', 'what kind of home you want us to build', 'what you need to feel ready for the next step', 'what you never want routine to remove from us', 'the part of our future you feel most confident about'],
  'Married': ['something marriage taught you about me', 'a routine you want us to protect', 'a money habit we should improve', 'a family boundary we need to guard', 'something you miss from our dating years', 'a way I support you that you value', 'a marital disagreement you think taught us something', 'what keeps attraction alive for you now', 'what you want the next five years to feel like', 'something you want us to do more intentionally']
}

const relationshipTruthFrames = [
  t => `What is the most honest thing you can say about ${t}?`,
  t => `What have you thought about ${t} but not said clearly?`,
  t => `What is one fear or insecurity connected to ${t}?`,
  t => `What is one thing you would want me to understand about ${t} without getting defensive?`,
  t => `What is the sweetest truth you can admit about ${t}?`,
  t => `What is one thing you are still figuring out about ${t}?`,
  t => `What past experience affects how you feel about ${t}?`,
  t => `What would you change if you had full control over ${t}?`,
  t => `What do you think I misunderstand about ${t}?`,
  t => `What is the answer about ${t} you would give if you knew I would not judge you?`
]

const relationshipDareStageActions = {
  'Talking Stage': ['send a voice note saying what first caught your attention about me', 'send the song you would use to describe our current vibe', 'give me a new nickname and explain it', 'describe our ideal first full-day date', 'tell me three things you have noticed about me', 'send a voice note recreating how you think I sound when I am annoyed', 'say what outfit you would pick for me on a date', 'send one harmless photo that says something about your personality', 'describe what you think my friends would say about you', 'plan a ₦20,000 date for us'],
  'New Relationship': ['send a voice note describing our first proper date from your side', 'tell me three non-physical things you find attractive about me', 'send a song you would add to an “us” playlist', 'plan a surprise date without asking me any questions', 'tell me one thing you want us to try together this month', 'describe the moment the relationship started feeling real', 'give me a compliment you have thought but not said', 'tell me which photo of us you like most and why', 'make up a private couple award for me', 'describe the kind of weekend away you would plan for us'],
  'Been Together a While': ['send a voice note saying one thing you think we do well', 'tell me one old memory of us you would repeat', 'plan a no-phone evening for us', 'send a song that reminds you of one specific memory with me', 'tell me one habit of mine you secretly find cute', 'describe our relationship using three film titles', 'give me one sincere compliment and one playful complaint', 'plan a date using only places we have never visited together', 'tell me one thing you want more of in our ordinary weeks', 'send a thirty-second voice note about what you appreciate about us'],
  'Long-Term Relationship': ['describe the home you would enjoy building with me', 'plan an anniversary with a realistic budget', 'tell me one tradition you want us to start', 'send a voice note about one future plan that excites you', 'pick one city you would live in with me for a year and explain it', 'tell me one thing you want us to protect after marriage', 'plan a weekend where neither of us handles work', 'describe one money goal you would enjoy reaching together', 'tell me one family boundary you think we should agree on', 'send a song you would want played at a major milestone for us'],
  'Married': ['send a voice note saying one thing you still admire about me', 'plan a date that feels different from our normal routine', 'tell me one dating-era habit you want us to bring back', 'describe one thing you want our home to feel known for', 'pick a trip you want us to take before our next major anniversary', 'tell me one small thing I do that still makes you feel loved', 'plan one quiet weekend with no family obligations', 'send a song that captures this season of our marriage', 'tell me one new tradition you want us to start this year', 'describe one thing you hope we laugh about when we are much older']
}

function truthDareRelationship() {
  const truths = []
  const dares = []
  RELATIONSHIP_STAGES.forEach((stage, si) => {
    relationshipTruthStageTopics[stage].forEach((topic, ti) => relationshipTruthFrames.forEach((frame, fi) => truths.push({ text: frame(topic), subtype: 'Truth', ...meta('relationship', si * 100 + ti * 10 + fi, stage) })))
    relationshipDareStageActions[stage].forEach((action, ai) => dareConstraints.forEach((frame, fi) => dares.push({ text: frame(action), subtype: 'Dare', ...meta('relationship', si * 100 + ai * 10 + fi, stage) })))
  })
  return [...truths, ...dares]
}

const neverFriendActions = [
  'pretended not to see someone I knew in public', 'said I was on my way before leaving home', 'used network as an excuse to end a conversation', 'borrowed money and hoped the person would forget for a while', 'checked someone’s page before meeting them properly', 'hidden food because I did not want to share', 'fallen asleep during a church service', 'taken a longer route to avoid greeting someone', 'lied about why I missed an event', 'muted a friend because they were annoying me',
  'left a group chat and returned quietly later', 'screenshotted a conversation for gist', 'deleted a message immediately after sending it', 'rehearsed an argument in my head', 'practised a phone call before making it', 'pretended to know a song everyone else knew', 'Googled a word during a conversation so I would not look lost', 'worn the same outfit because nobody important saw it the first time', 'lied about how much something cost', 'eaten someone else’s food without asking',
  'kept change I was supposed to return as a child', 'blamed a sibling for something I did', 'signed a parent’s name badly for school', 'copied homework because I forgot mine', 'looked at someone else’s answers during a test', 'pretended to be sick to avoid school', 'hidden a report card or result', 'used someone else’s phone without permission', 'read a sibling’s messages', 'entered a room because I heard people talking about me',
  'cancelled plans because staying home suddenly sounded better', 'ignored a call and texted “what’s up?” instead', 'waited before replying so I would not look too available', 'checked whether someone viewed my status', 'posted something hoping one specific person would see it', 'deleted a post because it did not get enough attention', 'unfollowed someone after an argument', 'searched an ex or old friend out of curiosity', 'judged somebody by their phone or car', 'pretended not to care about being left out',
  'spent money meant for something sensible on food', 'bought something mainly because it was on sale', 'ordered food while food was already at home', 'paid for convenience and regretted it', 'forgot a subscription was still charging me', 'sent money to the wrong account and panicked', 'avoided checking my balance after a big weekend', 'made a budget and ignored it almost immediately', 'borrowed from my future salary', 'hidden a purchase from family because I knew they would judge it'
]

const neverContexts = [
  a => `Never have I ever ${a}.`,
  a => `Never have I ever ${a} and acted completely normal afterwards.`,
  a => `Never have I ever ${a} because I did not want to explain myself.`,
  a => `Never have I ever ${a} and later laughed at how unnecessary it was.`,
  a => `Never have I ever ${a} more than once.`,
  a => `Never have I ever ${a} and hoped nobody noticed.`,
  a => `Never have I ever ${a} because I was embarrassed.`,
  a => `Never have I ever ${a} and blamed the situation instead of myself.`,
  a => `Never have I ever ${a} even though I knew better.`,
  a => `Never have I ever ${a} and then told a friend the full story later.`,
  a => `Never have I ever ${a} during a week when I was already stressed.`,
  a => `Never have I ever ${a} and immediately wished I had handled it differently.`,
  a => `Never have I ever ${a} because I wanted to avoid awkwardness.`,
  a => `Never have I ever ${a} and secretly felt justified at the time.`,
  a => `Never have I ever ${a} and refused to admit it until much later.`
]

const neverRelationshipStageActions = {
  'Talking Stage': ['checked how long somebody took to reply before deciding my own reply speed', 'asked a friend to analyse a message from someone I liked', 'looked through someone’s old photos before our first date', 'pretended not to be as interested as I was', 'posted something hoping the person I liked would react', 'felt jealous before we were even exclusive', 'talked to more than one person at the same time', 'cancelled other plans because a crush became available', 'practised what I wanted to say before calling', 'searched someone’s ex out of curiosity'],
  'New Relationship': ['reread old messages because I missed the beginning', 'felt jealous and decided not to mention it', 'compared a new partner with an ex', 'worried about meeting a partner’s friends', 'worried about meeting a partner’s family', 'saved a cute message or screenshot', 'planned a surprise and almost ruined it myself', 'pretended a small thing did not bother me', 'asked a friend for relationship advice before speaking to my partner', 'checked whether my partner noticed something I posted'],
  'Been Together a While': ['avoided a difficult conversation because the timing felt bad', 'gone to bed still annoyed after saying I was fine', 'forgotten an anniversary-related detail and tried to recover quietly', 'felt jealous of the attention work or friends were getting', 'missed the early dating phase', 'kept a small purchase quiet to avoid commentary', 'used humour to avoid a serious conversation', 'needed space but struggled to say it clearly', 'compared how much effort each person was making', 'felt taken for granted and waited too long to mention it'],
  'Long-Term Relationship': ['worried about whether money could affect the future', 'imagined living in another country together', 'wondered how our families would behave around wedding plans', 'avoided discussing a future decision because it felt too serious', 'thought about what kind of parents we would be', 'worried our careers might pull us in different directions', 'felt pressure from other people’s relationship timelines', 'wondered whether marriage would change our dynamic', 'disagreed privately with family advice about the relationship', 'thought about which traditions I would refuse to carry into marriage'],
  'Married': ['missed something about the dating phase', 'felt annoyed by a household habit and said nothing for too long', 'spent money on something without mentioning it first', 'needed time alone and felt guilty about it', 'compared our marriage with another couple’s highlight reel', 'avoided a family issue because I did not want another argument', 'forgot to appreciate something my spouse does regularly', 'felt romance getting lost inside responsibilities', 'wanted a break from everybody including family', 'looked back at old photos because I missed a simpler season']
}

function buildNever(mode) {
  const cards = []
  if (mode === 'friend') {
    neverFriendActions.forEach((action, ai) => neverContexts.forEach((frame, fi) => cards.push({ text: frame(action), ...meta(mode, ai * 15 + fi) })))
  } else {
    RELATIONSHIP_STAGES.forEach((stage, si) => {
      neverRelationshipStageActions[stage].forEach((action, ai) => neverContexts.forEach((frame, fi) => cards.push({ text: frame(action), ...meta(mode, si * 150 + ai * 15 + fi, stage) })))
    })
  }
  return cards.slice(0, 750)
}

const friendTruthLiePools = [
  ['school life', ['I once got punished for something I did not do.','I have slept during a lesson.','I have copied an assignment.','I have been on a noise-maker list.','I have hidden a bad result.','I have had a crush on a classmate.','I have been sent out of class.','I have forgotten my lunch or lunch money.','I have represented my school in something.','I have skipped an assembly.']],
  ['food habits', ['I save the best meat for last.','I have hidden food so I would not share.','I enjoy cold leftover rice.','I have ordered food while food was at home.','I have eaten noodles more than once in one day.','I prefer street suya to restaurant suya.','I have mixed foods people judged me for.','I have eaten from another person’s plate without asking.','I prefer swallow to rice.','I have gone out mainly because food was promised.']],
  ['phone habits', ['I have cracked a phone screen badly.','I have ignored a call and texted instead.','I keep too many screenshots.','I have lost important photos.','I have used someone else’s charger for weeks.','I have stayed below 5% battery for hours.','I have searched my own name online.','I have deleted an app to create storage.','I have owned more than one phone at the same time.','I have pretended my battery died.']],
  ['travel', ['I have missed a flight or bus.','I have packed less than an hour before leaving.','I have travelled without telling everybody at home.','I have forgotten something important on a trip.','I have slept through most of a road trip.','I have overpacked for a short trip.','I have gone somewhere mainly for the food.','I have changed a trip plan at the last minute.','I have travelled alone.','I have taken a trip without a proper itinerary.']],
  ['work and money', ['I have spent my salary too quickly.','I have wanted to quit a job on the spot.','I have joined a meeting from bed.','I have pretended to understand a work task.','I have missed a deadline.','I have had a side hustle.','I have borrowed money before payday.','I have bought something mainly to reward myself after work.','I have worked on a weekend.','I have taken a job mainly because of the pay.']],
  ['social life', ['I have cancelled plans because I wanted to stay home.','I have gone to an event knowing almost nobody.','I have left a party without saying goodbye.','I have pretended to know someone’s name.','I have gone somewhere mainly because one person would be there.','I have been the last person to leave an event.','I have dressed up more than the event required.','I have arrived late on purpose.','I have gone out two nights in a row.','I have regretted agreeing to plans.']],
  ['childhood', ['I have stolen meat from a pot.','I have blamed a sibling for something.','I have been beaten or punished for playing outside too long.','I have hidden a broken household item.','I have spent money I was told to keep.','I have pretended to be asleep to avoid an errand.','I have cried because a sibling got something I wanted.','I have eaten food meant for visitors.','I have been locked outside briefly for coming home late.','I have lied about finishing my chores.']],
  ['music', ['I have cried because of a song.','I have pretended to know lyrics.','I have paid for a concert.','I have disliked a popular artist.','I have replayed one song more than twenty times in a day.','I have made a playlist for one person.','I have discovered an artist through a friend.','I have deleted a song because of a bad memory.','I have sung loudly in traffic.','I have judged someone’s music taste.']],
  ['internet era', ['I used 2go.','I had a BlackBerry PIN.','I used Opera Mini regularly.','I have had an embarrassing username.','I used a cybercafé often.','I downloaded music from questionable sites.','I sent songs through Bluetooth.','I had a Facebook account before Instagram.','I have changed my display name for a crush.','I used to buy browsing bundles mainly for chatting.']],
  ['random skills', ['I can whistle loudly.','I can cook a full Nigerian meal.','I can sleep almost anywhere.','I can remember phone numbers easily.','I can drive a manual car.','I can dance better than people expect.','I can imitate someone in my family.','I can fix a basic tech problem without help.','I can stay awake all night.','I can recognise many songs from the first few seconds.']]
]

const relationshipTruthLiePools = [
  ['early dating', ['I noticed you before you noticed me.','I have rehearsed a text before sending it to someone I liked.','I have asked a friend to analyse a message.','I have checked someone’s old photos before a date.','I have pretended to be less interested than I was.','I have been nervous before a phone call with someone I liked.','I have changed an outfit more than once before a date.','I have saved a cute message.','I have looked up a restaurant menu before a date.','I have smiled at my phone because of one person.']],
  ['relationship habits', ['I like good-morning messages.','I need time alone after conflict.','I prefer calls to long texts for serious conversations.','I remember small details people tell me.','I like surprise plans.','I would rather stay in than go out for every date.','I need reassurance sometimes.','I dislike going to bed angry.','I enjoy sharing food.','I prefer planned dates to spontaneous ones.']],
  ['jealousy and trust', ['I have felt jealous and kept quiet.','I have checked an ex’s page out of curiosity.','I have worried about a partner’s close friendship.','I have trusted someone with my phone password.','I have been bothered by a harmless comment online.','I have compared myself with someone from a partner’s past.','I have needed reassurance about something small.','I have apologised for being unnecessarily suspicious.','I have hidden jealousy behind a joke.','I have changed my mind about a relationship boundary.']],
  ['money and dating', ['I have paid for an entire date.','I have split a date bill.','I have planned a date around a tight budget.','I have spent too much on a gift.','I have worried about earning less than a partner.','I have discussed debt in a relationship.','I have lent money to someone I was dating.','I have cancelled plans because money was tight.','I have saved towards a couple trip.','I have judged a date choice by its price.']],
  ['family', ['I have worried about what my family would think of someone I liked.','I have introduced someone I was dating to family.','I have hidden a relationship from family.','I have had relatives ask when I would marry.','I have disagreed with family advice about dating.','I have dated someone from a different background.','I have thought about how two families would get along.','I have attended a partner’s family event.','I have felt pressure from a family member about relationships.','I have defended someone I was dating to family.']],
  ['future', ['I have imagined relocating with a partner.','I have discussed marriage before engagement.','I have talked about children in a relationship.','I have discussed where to live long term.','I have pictured building a home with someone.','I have talked about combining finances.','I have thought about what kind of parent a partner would be.','I have discussed career sacrifices with someone I loved.','I have planned a trip more than six months ahead as a couple.','I have thought about growing old with someone.']],
  ['affection', ['I like holding hands in public.','I like pet names.','I enjoy random compliments.','I like long hugs.','I enjoy surprise food deliveries.','I like affectionate voice notes.','I enjoy taking photos together.','I like being checked on after a long day.','I enjoy playful teasing.','I like quiet time together without talking.']],
  ['conflict', ['I have apologised first while still feeling right.','I have needed a night to cool down.','I have cried during a relationship argument.','I have laughed during an argument because it became ridiculous.','I have avoided a conversation because I feared the answer.','I have written a long message and deleted it.','I have asked a friend for advice before resolving a conflict.','I have forgiven something I thought would be a deal-breaker.','I have realised I was wrong halfway through an argument.','I have needed physical space after conflict.']],
  ['romance', ['I have planned a surprise date.','I have written a love note.','I have made a playlist for someone.','I have travelled mainly to see someone I loved.','I have bought a gift for no occasion.','I have saved a relationship photo as my favourite.','I have dressed up mainly to impress one person.','I have cooked for someone I liked.','I have sent a long goodnight message.','I have celebrated a small relationship milestone.']],
  ['marriage mindset', ['I would prefer a small wedding.','I would rather spend more on a home than a wedding.','I think couples should discuss money before engagement.','I think family boundaries should be agreed before marriage.','I would attend premarital counselling.','I think married couples need individual friendships.','I would keep at least one personal bank account.','I think date nights matter after marriage.','I think household work should be discussed explicitly.','I think relocation decisions should treat both careers seriously.']]
]

function buildThreeStatementSets(mode) {
  const pools = mode === 'friend' ? friendTruthLiePools : relationshipTruthLiePools
  const cards = []
  for (let round = 0; cards.length < 750; round += 1) {
    pools.forEach(([theme, statements], poolIndex) => {
      if (cards.length >= 750) return
      const all = combos(statements, 3)
      const start = (round * 19 + poolIndex * 11) % all.length
      for (let j = 0; j < 75 && cards.length < 750; j += 1) {
        const options = all[(start + j * 17) % all.length]
        cards.push({ text: `Pick which statement becomes your lie. The other two are your truths about ${theme}.`, options, ...meta(mode, cards.length) })
      }
    })
  }
  return cards.slice(0, 750)
}

const friendKmaPools = [
  ['social personalities', ['The life of the party','The quiet observer','The funny one','The ambitious one','The calm homebody','The spontaneous traveller','The foodie','The gym person','The creative','The organised planner']],
  ['dating archetypes', ['The great texter','The great caller','The great date planner','The good cook','The stylish one','The generous one','The mysterious one','The romantic one','The adventurous one','The dependable one']],
  ['work personalities', ['The founder','The banker','The designer','The lawyer','The doctor','The musician','The engineer','The teacher','The entrepreneur','The remote worker']],
  ['Lagos lifestyles', ['The Island socialite','The mainland foodie','The always-in-traffic worker','The beach-every-weekend person','The church-every-Sunday person','The concert regular','The quiet Lekki homebody','The gym-before-work person','The nightlife regular','The road-trip person']],
  ['fictional types', ['The charming villain','The loyal best friend','The brilliant detective','The chaotic genius','The brave hero','The sarcastic sidekick','The mysterious stranger','The soft-hearted rival','The disciplined leader','The funny troublemaker']]
]

const relationshipKmaPools = [
  ['relationship personalities', ['The romantic planner','The funny best-friend type','The quiet dependable type','The ambitious workaholic','The affectionate homebody','The social butterfly','The thoughtful gift-giver','The adventurous traveller','The calm problem-solver','The confident flirt']],
  ['communication styles', ['The long texter','The voice-note person','The late-night caller','The quick check-in person','The meme sender','The deep-conversation person','The quiet companion','The constant updater','The spontaneous caller','The playlist sender']],
  ['date energy', ['The dinner-date person','The beach-date person','The road-trip person','The stay-in person','The concert person','The activity-date person','The brunch person','The museum person','The games-night person','The surprise-date planner']],
  ['future types', ['The career climber','The family-first person','The traveller','The home builder','The entrepreneur','The faith-centred person','The minimalist','The luxury lover','The community person','The private couple type']],
  ['romantic strengths', ['Great listener','Great cook','Great planner','Great gift giver','Great communicator','Great encourager','Great problem solver','Great at affection','Great with family','Great with money']]
]

function buildKma(mode) {
  const pools = mode === 'friend' ? friendKmaPools : relationshipKmaPools
  const cards = []
  let round = 0
  while (cards.length < 750) {
    for (const [theme, optionsPool] of pools) {
      const triples = combos(optionsPool, 3)
      const start = (round * 13 + hash(theme)) % triples.length
      for (let i = 0; i < triples.length && cards.length < 750; i += 1) {
        const options = triples[(start + i * 23) % triples.length]
        cards.push({ text: `Kiss, marry, avoid. Choose one role for each of these ${theme}.`, options, ...meta(mode, cards.length) })
        if (cards.length % 30 === 0) break
      }
    }
    round += 1
  }
  return cards.slice(0, 750)
}

const friendScenarioTopics = [
  'a close friend starts talking to your ex without telling you', 'a friend owes you money but keeps posting expensive outings', 'a friend tells your secret to their partner', 'a friend cancels on you three times in one month', 'a close friend gets a job abroad and asks you to keep it secret', 'a friend wants to stay with you for two weeks and remains for two months', 'a friend constantly borrows your things and returns them damaged', 'a friend never supports your wins but appears during problems', 'a friend starts copying your ideas at work', 'a friend invites you to a wedding with an expensive aso ebi expectation',
  'you hear a friend’s partner insulting them when they are absent', 'a friend asks you to lie to their partner for them', 'a friend wants you to invest in a business you do not trust', 'a friend becomes close to somebody who treated you badly', 'a friend disappears whenever they start dating', 'a friend posts an embarrassing photo of you after you ask them not to', 'a friend keeps making jokes about your money', 'a friend tells family something you shared privately', 'a friend gets promoted into a role you both wanted', 'a friend asks to borrow a large amount you need for yourself',
  'you find a wallet with enough cash to change your month', 'your employer accidentally pays you twice', 'you receive a bank transfer from an unknown person', 'you discover a colleague taking credit for your work', 'your manager asks you to cover up their mistake', 'you get a much better job offer one week after accepting another role', 'your family expects you to fund an event you cannot afford', 'you are offered relocation but your closest people want you to stay', 'your landlord increases rent suddenly', 'you discover a side hustle opportunity that conflicts with your main job',
  'you see somebody cheating during an important exam', 'you discover a friend lied about why they needed money', 'you find out people made plans without inviting you', 'you receive a message clearly meant for somebody else', 'someone insults you in a group chat and later deletes it', 'a stranger mistakenly sends you sensitive information', 'you are added to a family group chat argument by mistake', 'your old school asks you to speak to students with one day notice', 'you see somebody you know pretending not to see you in public', 'you realise a friend has been lying about knowing a celebrity',
  'your flight is cancelled after you arrive at the airport', 'your car breaks down in heavy rain', 'you lose your phone during a night out', 'power goes out during an important online interview', 'your bank app fails while you are trying to pay in public', 'you arrive at an event dressed far more formally than everybody else', 'you accidentally send a voice note complaining about someone to that person', 'you wake up and realise you missed an important appointment', 'you are given a free weekend trip but must leave in three hours', 'you get ₦1 million with one rule: spend it before midnight'
]

const friendScenarioFrames = [
  s => `${s}. What do you do first?`,
  s => `${s}. Who do you speak to before making a decision?`,
  s => `${s}. What would make you handle it quietly instead of confronting it?`,
  s => `${s}. What would be the fair response in your eyes?`,
  s => `${s}. What would make you walk away completely?`,
  s => `${s}. What part of the situation would annoy you most?`,
  s => `${s}. What would you refuse to do even if other people expected it?`,
  s => `${s}. What would your closest friend expect you to do?`,
  s => `${s}. What mistake would you be most likely to make in the moment?`,
  s => `${s}. How would you want somebody to treat you if the roles were reversed?`,
  s => `${s}. Would you deal with it immediately or wait until emotions settle?`,
  s => `${s}. What detail would completely change your answer?`,
  s => `${s}. What would be the most Nigerian complication in the situation?`,
  s => `${s}. What would you do if family members became involved?`,
  s => `${s}. What outcome would make you feel you handled it well?`
]

const relationshipScenarioStageTopics = {
  'Talking Stage': ['the person you are talking to still speaks to their ex every day', 'they disappear for two days and return as if nothing happened', 'they ask to borrow money before you have met in person', 'their friend tells you they are also talking seriously to someone else', 'they want exclusivity but refuse to define the relationship', 'they make a joke about your income that bothers you', 'they invite you to meet family much earlier than you expected', 'they say religion is not important but their family expects same-faith marriage', 'they want to relocate in six months', 'they ask for your phone password as proof of trust'],
  'New Relationship': ['your partner keeps cancelling dates because of work', 'an ex sends your partner a late-night message asking to talk', 'your partner shares a private disagreement with friends', 'your partner spends heavily while telling you money is tight', 'your partner’s family starts asking when marriage will happen', 'you discover your partner has debt they were embarrassed to mention', 'your partner wants to post the relationship publicly and you prefer privacy', 'your partner dislikes one of your closest friends', 'you have different expectations about how often to see each other', 'your partner receives an overseas job offer'],
  'Been Together a While': ['one person wants to move in together mainly to reduce rent', 'one partner keeps sending family money without discussing the impact', 'your families clash during an important event', 'a career opportunity would separate you for a year', 'one person wants more dates while the other wants to save aggressively', 'you disagree about friendships with exes', 'your partner reads a private message on your unlocked phone', 'you keep having the same argument about time and availability', 'one person feels attraction has become less intentional', 'you learn your partner discussed engagement with family before you'],
  'Long-Term Relationship': ['you want to marry but disagree about where to live', 'one family expects a large wedding and you both want something small', 'you discover your approaches to debt are very different', 'one person wants children soon and the other wants to wait several years', 'a relocation opportunity strongly benefits one career and hurts the other', 'your partner wants a parent to live with you after marriage', 'you disagree about which church to attend after marriage', 'you have different ideas about joint finances', 'one person wants a traditional division of household roles', 'family members keep trying to influence wedding decisions'],
  'Married': ['one spouse receives a major job offer in another country', 'one spouse wants to financially support a relative beyond the agreed budget', 'an in-law repeatedly ignores a boundary you both set', 'you disagree about how much to spend on a major family event', 'one person feels housework has become unfair', 'work stress has reduced quality time for months', 'one spouse wants a large purchase and the other wants to save', 'you disagree about discipline or schooling for a child', 'a private marital issue becomes known to extended family', 'one person says the marriage has become too routine']
}

const relationshipScenarioFrames = [
  s => `${s}. What would you do first?`,
  s => `${s}. What conversation needs to happen before any decision?`,
  s => `${s}. What boundary would matter most to you?`,
  s => `${s}. What would make you feel respected in the way it is handled?`,
  s => `${s}. What response would make the situation worse immediately?`,
  s => `${s}. What compromise would feel fair rather than forced?`,
  s => `${s}. What past experience might affect your reaction?`,
  s => `${s}. What would you need to hear from your partner?`,
  s => `${s}. When would this become a deal-breaker for you?`,
  s => `${s}. What should remain private between the two of you?`,
  s => `${s}. How much should family opinion matter?`,
  s => `${s}. How much should money affect the decision?`,
  s => `${s}. Would you want time to think or an immediate conversation?`,
  s => `${s}. What would a mature solution look like?`,
  s => `${s}. What would you want the two of you to learn from it afterwards?`
]

function buildScenarios(mode) {
  const cards = []
  if (mode === 'friend') {
    friendScenarioTopics.forEach((scenario, si) => friendScenarioFrames.forEach((frame, fi) => cards.push({ text: frame(scenario), ...meta(mode, si * 15 + fi) })))
  } else {
    RELATIONSHIP_STAGES.forEach((stage, stageIndex) => relationshipScenarioStageTopics[stage].forEach((scenario, si) => relationshipScenarioFrames.forEach((frame, fi) => cards.push({ text: frame(scenario), ...meta(mode, stageIndex * 150 + si * 15 + fi, stage) }))))
  }
  return cards.slice(0, 750)
}

const friendChoicePools = [
  ['career', ['A job you love with modest pay','A job you dislike with triple the pay','A stable job with slow growth','A risky role with huge growth','Work fully remote','Work in an office with a great team','Start a business','Join a strong company']],
  ['location', ['Live close to family with fewer opportunities','Move far away for the career you want','Stay in Lagos','Move to Abuja','Move abroad','Live in a smaller Nigerian city','Own a home far from work','Rent close to work']],
  ['money', ['Receive ₦10 million today','Receive ₦1 million every year for fifteen years','Own your home outright','Have zero debt forever','Free food for five years','Free transport for five years','A guaranteed pension','A successful side business']],
  ['knowledge', ['Know what people say after you leave','Know what your life looks like in ten years','Know your future salary','Know who your closest friends will be','Know the date of your biggest career break','Know which investment will do best','Know the next major mistake you will make','Know which city you will settle in']],
  ['friendship', ['Keep a long friendship that has become draining','Protect your peace and let the friendship end','Have many casual friends','Have two extremely close friends','A brutally honest friend','A gentle supportive friend','A friend who is always available','A friend who pushes you hard']],
  ['comfort', ['Perfect sleep every night','Never sit in traffic again','Never lose power at home','Never have bad internet again','Free domestic help','Free food delivery','A personal driver','A four-day work week']],
  ['travel', ['One luxury trip a year','Four budget trips a year','Travel alone','Travel only with friends','Visit every African country','Visit five dream countries outside Africa','Always fly business class','Always stay in luxury hotels']],
  ['social life', ['A packed social calendar','Quiet weekends at home','Attend every big event','Never attend another crowded party','Always know someone at events','Always leave events early','Be the organiser','Never plan anything yourself']]
]

const relationshipChoicePools = [
  ['compatibility', ['Strong chemistry with different long-term plans','Matching long-term plans with slower chemistry','Same faith with different lifestyles','Same lifestyle with different faith priorities','Great communication with low spontaneity','Great spontaneity with weaker planning','Shared ambition','Shared calmness']],
  ['distance and pressure', ['Two years of long distance','Two years of serious money pressure','One year living with family','One year in different time zones','A demanding work season','A difficult family season','Frequent travel for work','A temporary income gap']],
  ['wedding and home', ['A large wedding and delay buying a home','A small wedding and stronger house deposit','Traditional wedding first','Court wedding first','Rent in a nicer area','Own farther away','Spend on honeymoon','Spend on home setup']],
  ['future', ['Move abroad together','Stay close to both families','Build a business together','Keep careers completely separate','Have children earlier','Have children later','Live in one city long term','Move every few years for opportunity']],
  ['money', ['Fully joint finances','Mostly separate finances with shared goals','One shared household account','One person manages the budget','Aggressive saving for five years','More travel while you are young','Buy a car first','Save for a home first']],
  ['family', ['Live near your family','Live near your partner’s family','Host relatives often','Keep the home mostly private','Spend every major holiday with family','Alternate family holidays','Support parents monthly','Support only when specific needs arise']],
  ['relationship rhythm', ['Weekly date night','One full weekend away every month','Daily calls when apart','Longer calls a few times a week','Lots of shared hobbies','Mostly separate hobbies','Plan everything early','Keep plans spontaneous']],
  ['conflict', ['Talk immediately after an argument','Take a few hours before talking','Apologise first even before full agreement','Wait until both people feel calm','Discuss every issue fully','Let small things go quickly','Seek outside counsel early','Keep conflict private unless stuck']]
]

function buildHardChoices(mode) {
  const pools = mode === 'friend' ? friendChoicePools : relationshipChoicePools
  const cards = []
  let round = 0
  while (cards.length < 750) {
    pools.forEach(([theme, options], poolIndex) => {
      const pairs = combos(options, 2)
      const start = (round * 11 + poolIndex * 5) % pairs.length
      for (let i = 0; i < pairs.length && cards.length < 750; i += 1) {
        const pair = pairs[(start + i * 9) % pairs.length]
        cards.push({ text: `If you had to choose one in this ${theme} situation, which would you take and why?`, options: pair, ...meta(mode, cards.length) })
      }
    })
    round += 1
  }
  return cards.slice(0, 750)
}

const likelyFriendTopics = [
  'say “I am on my way” before leaving home', 'spend too much money on food in one weekend', 'move abroad with two weeks’ notice', 'forgive an old friend and act like nothing happened', 'argue with customer service until an issue is fixed', 'disappear from social media for a month', 'forget where they put their phone', 'sleep through three alarms', 'arrive first to an event', 'arrive last to an event',
  'plan a group trip properly', 'cancel plans because staying home sounds better', 'start a side hustle', 'change careers suddenly', 'buy something expensive on impulse', 'save money consistently', 'lend money to a friend', 'ask for money back directly', 'become friends with a stranger on a trip', 'talk to a celebrity normally without panicking',
  'cry during a film', 'laugh at the wrong moment', 'send a voice note longer than five minutes', 'leave a group chat dramatically', 'mute everybody for peace', 'remember a birthday without reminders', 'forget a birthday completely', 'keep an embarrassing secret for years', 'tell a friend the hard truth', 'avoid confrontation until the last minute',
  'survive best without electricity for a week', 'find the best food spot in a new area', 'get lost even with Google Maps', 'pack for a trip in twenty minutes', 'overpack for a two-day trip', 'sleep through a road journey', 'start dancing at a party first', 'leave a party before everyone else', 'know every lyric to an old Nigerian song', 'recognise an actor but forget their name',
  'run for office in the friend group', 'become rich quietly', 'post a major win late', 'buy gifts for everyone', 'keep a serious budget spreadsheet', 'ignore a budget spreadsheet', 'learn a new skill for fun', 'turn a hobby into a business', 'adopt a pet', 'move to a quiet town later in life'
]

const likelyRelationshipStageTopics = {
  'Talking Stage': ['reply first after a long conversation', 'ask the deeper question first', 'suggest the first date', 'overthink a short reply', 'send a good-morning text first', 'check the other person’s page quietly', 'tell a friend about the new person first', 'catch feelings faster', 'pretend not to catch feelings', 'suggest a phone call instead of texting'],
  'New Relationship': ['plan the better surprise date', 'apologise first after a small argument', 'remember a tiny detail from weeks ago', 'get jealous and try to hide it', 'introduce the other person to friends first', 'send food after a stressful day', 'take more photos together', 'create the shared playlist', 'suggest a weekend trip first', 'want more quality time'],
  'Been Together a While': ['need space first after conflict', 'want to talk immediately after conflict', 'overspend on an anniversary', 'forget an anniversary detail', 'plan the next trip', 'handle a difficult family conversation', 'notice when the other person is stressed', 'suggest saving more money', 'want to stay home on a date night', 'bring up a conversation you have both avoided'],
  'Long-Term Relationship': ['suggest relocating for a better opportunity', 'want a smaller wedding', 'want a bigger wedding', 'research homes before you are ready to buy', 'make the detailed future budget', 'worry more about family expectations', 'push for premarital counselling', 'plan the honeymoon early', 'want children sooner', 'want to travel more before children'],
  'Married': ['wake up first on weekends', 'notice household supplies are finished', 'plan family events', 'protect date night from other plans', 'say “we need to save” first', 'suggest a spontaneous trip', 'call a repair person first', 'remember extended-family birthdays', 'need quiet time after work', 'start laughing in the middle of an argument']
}

const likelyFrames = [
  t => `Who is more likely to ${t}?`,
  t => `Between the two of you, who would ${t} first?`,
  t => `Who would your friends bet on to ${t}?`,
  t => `If money was on the line, who would you pick to ${t}?`,
  t => `Who would deny it but is still more likely to ${t}?`,
  t => `Who has the stronger track record of being likely to ${t}?`,
  t => `Who would surprise nobody by being the one to ${t}?`,
  t => `Who would be more likely to ${t} under pressure?`,
  t => `Who would be more likely to ${t} on a completely ordinary day?`,
  t => `Who would be more likely to ${t} without telling the other person first?`,
  t => `Who would be more likely to ${t} and then laugh about it later?`,
  t => `Who would be more likely to ${t} after saying they never would?`,
  t => `Who would be more likely to ${t} if friends encouraged it?`,
  t => `Who would be more likely to ${t} when tired or stressed?`,
  t => `Who would the other person immediately choose as more likely to ${t}?`
]

function buildLikely(mode) {
  const cards = []
  if (mode === 'friend') {
    likelyFriendTopics.forEach((topic, ti) => likelyFrames.forEach((frame, fi) => cards.push({ text: frame(topic), ...meta(mode, ti * 15 + fi) })))
  } else {
    RELATIONSHIP_STAGES.forEach((stage, si) => likelyRelationshipStageTopics[stage].forEach((topic, ti) => likelyFrames.forEach((frame, fi) => cards.push({ text: frame(topic), ...meta(mode, si * 150 + ti * 15 + fi, stage) }))))
  }
  return cards.slice(0, 750)
}

const knowFriendTopics = [
  'what I would spend ₦100,000 on first', 'what food I would pick when I am tired', 'which friend I call first with big news', 'what stresses me faster than I admit', 'what cheers me up after a bad day', 'what I value most in friendship', 'what kind of trip I would choose', 'what job I would try for one month', 'what Nigerian city I would live in', 'what app I use most',
  'what school memory I talk about most', 'what food I would refuse to share', 'what song gets me moving immediately', 'what film genre I avoid', 'what I would do with a free weekend', 'what I would buy after getting a bonus', 'what family member I am most similar to', 'what habit I am trying to improve', 'what type of person annoys me quickly', 'what compliment means most to me',
  'what I would do if my phone disappeared for a day', 'what I would order at a familiar restaurant', 'what I would choose between sleep and a night out', 'what I would save for first', 'what kind of gift I prefer', 'what I do when I am overwhelmed', 'what I need from friends when I am quiet', 'what I am most likely to procrastinate', 'what I notice first about people', 'what kind of humour always gets me',
  'what childhood snack I would still buy', 'what old song I know word for word', 'what I would choose at a Nigerian party', 'what I would do during a power cut', 'what I would complain about in traffic', 'what part of travelling I enjoy most', 'what I would choose for breakfast', 'what I would do with an unexpected day off', 'what I am competitive about', 'what I secretly spend too much on',
  'what makes me feel appreciated', 'what I would never lend out', 'what risk I am more willing to take', 'what I would choose between fame and privacy', 'what future goal matters most to me', 'what I would change about my daily routine', 'what I would do if I won ₦10 million', 'what I miss most from childhood', 'what makes me lose patience', 'what kind of life I would enjoy at sixty'
]

const knowRelationshipStageTopics = {
  'Talking Stage': ['what I noticed about you first', 'what kind of date I would choose first', 'what reply style I like most', 'what makes me lose interest early', 'what makes me feel comfortable on a call', 'what I am most curious to learn about you', 'what kind of compliment works on me', 'what I would rather discuss in person', 'what I would spend date money on', 'what makes a talking stage feel serious to me'],
  'New Relationship': ['what makes me feel cared for', 'what kind of date I would repeat', 'what I need after a bad day', 'what small thing makes me jealous', 'what I would want more reassurance about', 'what gift would mean most to me', 'what part of the relationship excites me most', 'what I find hardest to communicate', 'what makes me feel close during the week', 'what I would want us to try together'],
  'Been Together a While': ['what habit of yours I secretly find cute', 'what disagreement affects me longest', 'what I want more of in our routine', 'what memory I would repeat', 'what expense I would cut first', 'what kind of trip I want us to take', 'what makes me feel taken for granted', 'what I think we do best together', 'what I need during conflict', 'what family boundary matters most to me'],
  'Long-Term Relationship': ['what future plan matters most to me', 'what kind of wedding I would choose', 'what money goal I would prioritise', 'where I would want us to live', 'what kind of home atmosphere I want', 'what worries me most about marriage', 'what I think we should discuss before engagement', 'what family tradition I would keep', 'what I would want us to protect after marriage', 'what career sacrifice would be hardest for me'],
  'Married': ['what part of our routine I value most', 'what I miss from dating', 'what makes me feel loved in ordinary weeks', 'what household task I dislike most', 'what money goal I want us to reach next', 'what family boundary I protect most', 'what date I would happily repeat', 'what I need after a stressful workday', 'what I want us to do more this year', 'what I hope our marriage feels like in ten years']
}

const knowFrames = [
  t => `What do you think my answer would be about ${t}?`,
  t => `If you had to predict before I answered, what would you say about ${t}?`,
  t => `How well do you know me: what do you think is true about ${t}?`,
  t => `What would you bet I would say if you asked me about ${t}?`,
  t => `Without asking me first, what is your guess about ${t}?`,
  t => `What answer do you think I would give immediately about ${t}?`,
  t => `What do you think my closest friend would predict about ${t}?`,
  t => `If you had one guess only, what would you pick for ${t}?`,
  t => `What do you think you have learnt about me from ${t}?`,
  t => `What answer from me would surprise you most about ${t}?`,
  t => `What do you think I would choose if ${t} came up today?`,
  t => `What do you think my first instinct is around ${t}?`,
  t => `What do you think matters most to me when it comes to ${t}?`,
  t => `What pattern have you noticed in me around ${t}?`,
  t => `Before I tell you, what do you think my real answer is about ${t}?`
]

function buildKnow(mode) {
  const cards = []
  if (mode === 'friend') {
    knowFriendTopics.forEach((topic, ti) => knowFrames.forEach((frame, fi) => cards.push({ text: frame(topic), ...meta(mode, ti * 15 + fi) })))
  } else {
    RELATIONSHIP_STAGES.forEach((stage, si) => knowRelationshipStageTopics[stage].forEach((topic, ti) => knowFrames.forEach((frame, fi) => cards.push({ text: frame(topic), ...meta(mode, si * 150 + ti * 15 + fi, stage) }))))
  }
  return cards.slice(0, 750)
}

const finishFriendTopics = [
  'A friendship starts feeling real to me when', 'The quickest way to annoy me on a group trip is', 'One thing adulthood did not prepare me for is', 'If I could relive one school holiday, I would choose', 'The Nigerian food argument I will never stop having is', 'One thing I wish my younger self understood earlier is', 'The kind of friend I struggle with most is', 'When I have had a terrible day, I usually need', 'The thing I spend money on too easily is', 'My most unserious red flag in a friend is',
  'The moment I know I need a break from people is', 'One family habit I carried into adulthood is', 'The school memory that still makes me laugh is', 'If I disappeared for a quiet weekend, I would go', 'The song that instantly changes my mood is', 'The meal I trust to fix a bad day is', 'One thing Lagos has taught me is', 'If I got ₦10 million today, my first sensible move would be', 'My worst habit when I am stressed is', 'The compliment I remember longest is',
  'The friend who knows me best knows that', 'One thing I pretend not to care about is', 'The easiest way to make me laugh is', 'The quickest way to lose my trust is', 'The part of travelling I enjoy most is', 'My ideal Sunday afternoon looks like', 'The thing I procrastinate most is', 'The childhood snack I would still defend is', 'If my phone vanished for a day, I would miss', 'The app I spend too much time on is',
  'The thing I would never lend out is', 'The quality I respect fastest in somebody is', 'A small luxury I find hard to give up is', 'The job I would try for one month just for the story is', 'A habit I am proud I changed is', 'Something I want to get better at this year is', 'If I had to leave Nigeria for five years, I would miss', 'The city I would live in for one year is', 'The event I usually want to leave early is', 'The person in my family I resemble most is',
  'My most controversial music opinion is', 'The film I could rewatch too many times is', 'The thing I notice first when I enter someone’s home is', 'The best kind of gift for me is', 'The part of friendship I take most seriously is', 'The mistake I forgive slowly is', 'The risk I am glad I took is', 'The risk I wish I had not taken is', 'At sixty, I hope my life includes', 'The thing I want people close to me to remember is'
]

const finishRelationshipStageTopics = {
  'Talking Stage': ['I start taking someone seriously when', 'The quickest way to lose my interest is', 'A first date feels successful to me when', 'I know I am catching feelings when', 'The kind of flirting I enjoy most is', 'I feel comfortable on a call when', 'One thing I want to know early is', 'A talking stage becomes tiring when', 'The compliment that works on me is', 'I would rather move slowly than'],
  'New Relationship': ['I feel most cared for when', 'One thing I want us to protect early is', 'I know I trust someone more when', 'The kind of date I enjoy most is', 'A small thing that makes me jealous is', 'I need reassurance when', 'One boundary I want respected is', 'I feel closest after', 'A relationship starts feeling safe when', 'One thing I never want us to fake is'],
  'Been Together a While': ['I know routine is getting too comfortable when', 'One thing I miss from the beginning is', 'I feel appreciated when', 'The argument I hate repeating is', 'I need space when', 'I want more quality time when', 'The best ordinary evenings with you include', 'One thing I think we do well is', 'I feel taken for granted when', 'A date night feels worth it when'],
  'Long-Term Relationship': ['The future feels real to me when', 'Before marriage I need clarity about', 'The kind of home I want us to build feels', 'One family boundary I need us to protect is', 'Money feels safest between us when', 'A wedding matters less to me than', 'The career sacrifice I would struggle with most is', 'I would feel ready for the next step when', 'One thing I never want marriage to remove is', 'The tradition I want us to start is'],
  'Married': ['Marriage feels strongest to me when', 'One dating habit I want us to keep is', 'Home feels peaceful when', 'I feel supported after work when', 'One money habit I want us to improve is', 'The family boundary I value most is', 'Romance in an ordinary week looks like', 'The next memory I want us to create is', 'Ten years from now I hope we still', 'One thing I want us to laugh about more is']
}

const finishFrames = [
  t => `${t}…`,
  t => `${t}, because…`,
  t => `${t}, even if other people disagree because…`,
  t => `${t}. The first example that comes to mind is…`,
  t => `${t}. I realised this when…`,
  t => `${t}. What makes it matter to me is…`,
  t => `${t}. If I had to explain why, I would say…`,
  t => `${t}. The part people misunderstand is…`,
  t => `${t}. I used to answer this differently because…`,
  t => `${t}. The person who knows me best would say…`,
  t => `${t}. A real-life example would be…`,
  t => `${t}. The opposite would make me feel…`,
  t => `${t}. I learnt this the hard way when…`,
  t => `${t}. I hope this changes by…`,
  t => `${t}. The honest answer I do not usually say first is…`
]

function buildFinish(mode) {
  const cards = []
  if (mode === 'friend') {
    finishFriendTopics.forEach((topic, ti) => finishFrames.forEach((frame, fi) => cards.push({ text: frame(topic), ...meta(mode, ti * 15 + fi) })))
  } else {
    RELATIONSHIP_STAGES.forEach((stage, si) => finishRelationshipStageTopics[stage].forEach((topic, ti) => finishFrames.forEach((frame, fi) => cards.push({ text: frame(topic), ...meta(mode, si * 150 + ti * 15 + fi, stage) }))))
  }
  return cards.slice(0, 750)
}

export const curatedGameCards = {
  'truth-dare': { friend: truthDareFriend(), relationship: truthDareRelationship() },
  'never-have-i-ever': { friend: buildNever('friend'), relationship: buildNever('relationship') },
  'two-truths-lie': { friend: buildThreeStatementSets('friend'), relationship: buildThreeStatementSets('relationship') },
  'kiss-marry-avoid': { friend: buildKma('friend'), relationship: buildKma('relationship') },
  'what-would-you-do': { friend: buildScenarios('friend'), relationship: buildScenarios('relationship') },
  'if-you-had-to-choose': { friend: buildHardChoices('friend'), relationship: buildHardChoices('relationship') },
  'who-is-more-likely': { friend: buildLikely('friend'), relationship: buildLikely('relationship') },
  'how-well-do-you-know-me': { friend: buildKnow('friend'), relationship: buildKnow('relationship') },
  'finish-the-sentence': { friend: buildFinish('friend'), relationship: buildFinish('relationship') },
}

for (const [id, modes] of Object.entries(curatedGameCards)) {
  if (id === 'truth-dare') {
    for (const mode of ['friend', 'relationship']) {
      const truth = modes[mode].filter(card => card.subtype === 'Truth').length
      const dare = modes[mode].filter(card => card.subtype === 'Dare').length
      if (truth !== 500 || dare !== 500) throw new Error(`${id} ${mode} expected 500 Truth / 500 Dare, got ${truth}/${dare}`)
    }
  } else {
    if (modes.friend.length !== 750) throw new Error(`${id} friend expected 750, got ${modes.friend.length}`)
    if (modes.relationship.length !== 750) throw new Error(`${id} relationship expected 750, got ${modes.relationship.length}`)
  }
}
