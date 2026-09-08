import { buildNigeriaConversationPrompts as buildV9NigeriaConversationPrompts, nigeriaConversationCategoryIds } from './conversations-v9.js'

function hashText(value) {
  let hash = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

const knownLeadIns = [
  'Quick one:','Be honest:','I’m curious:','Tell me this:','No overthinking:','Your first instinct:',
  'A deeper one:','Think about this:','If you’re comfortable:','A real question:','Take your time:','For you personally:',
  'Random one:','Unserious question:','Quick random one:','For the laughs:','First answer only:',
  'Story time:','Looking back:','From your own life:','One from experience:','Think back:','Tell me about this:',
  'Nigeria one:','Living here:','From your Nigerian experience:','One about life here:','Growing up here:','Nigeria question:',
  'Family one:','Growing up at home:','Thinking about your family:','One about home:','From your family experience:','Family question:',
  'Throwback question:','Take yourself back:','Old-school one:','Memory lane:','One from back then:',
  'Growing-up question:','Think about younger you:','Back when you were younger:','One from your childhood:','School-days question:',
  'Food question:','Be honest about food:','Quick food one:','One for the food debate:','Food gist:','Let’s talk food:',
  'Everyday one:','Normal-life question:','Day-to-day one:','Real-life question:','One about your routine:','Your normal day:',
  'Movie question:','Film one:','Cinema question:','Nollywood one:','Watch-list question:','One about films:',
  'Music question:','Song one:','Your playlist question:','Afrobeats one:','One about music:','Your music taste:',
  'Hot take:','No fence-sitting:','Pick a side:','Your unpopular opinion:','One for debate:','Your real take:',
  'Values question:','What do you stand on:','One about your principles:','Character question:','Your values here:','Think about your beliefs:'
]

function stripLeadIn(text) {
  for (const lead of knownLeadIns) {
    if (text.startsWith(`${lead} `)) return text.slice(lead.length + 1)
  }
  return text
}

function readableSource(value) {
  const replacements = [
    [/\bnysc\b/g, 'NYSC'],[/\bsiwes\b/g, 'SIWES'],[/\bjamb\b/g, 'JAMB'],[/\bwaec\b/g, 'WAEC'],[/\bneco\b/g, 'NECO'],
    [/\blagos\b/g, 'Lagos'],[/\bnigeria\b/g, 'Nigeria'],[/\bnigerian\b/g, 'Nigerian'],[/\bwhatsapp\b/g, 'WhatsApp'],[/\bblackberry\b/g, 'BlackBerry'],
    [/\byoutube\b/g, 'YouTube'],[/\bnollywood\b/g, 'Nollywood'],[/\bafrobeats\b/g, 'Afrobeats'],[/\bbolt\b/g, 'Bolt'],[/\buber\b/g, 'Uber'],
    [/\beid\b/g, 'Eid'],[/\bchristmas\b/g, 'Christmas'],[/\bbible\b/g, 'Bible'],[/\bjesus\b/g, 'Jesus'],[/\bchristian\b/g, 'Christian'],
    [/\b2go\b/g, '2go'],[/\bopera mini\b/g, 'Opera Mini'],[/\bbig brother naija\b/g, 'Big Brother Naija'],[/\bpapa ajasco\b/g, 'Papa Ajasco']
  ]
  let out = value
  replacements.forEach(([pattern, replacement]) => { out = out.replace(pattern, replacement) })
  return out.charAt(0).toUpperCase() + out.slice(1)
}

const pairFrames = {
  'getting-to-know-you': {
    friend: [
      (a,b)=>`Which one would get a longer story out of you: ${a} or ${b}?`,
      (a,b)=>`Which one says more about you: ${a} or ${b}?`,
      (a,b)=>`If I asked about only one, which would you pick: ${a} or ${b}?`,
      (a,b)=>`Which one feels more personal to you: ${a} or ${b}?`,
      (a,b)=>`Which one would reveal more about your personality: ${a} or ${b}?`,
      (a,b)=>`Which one do you have stronger opinions about: ${a} or ${b}?`,
      (a,b)=>`Which one has the better story behind it for you: ${a} or ${b}?`,
      (a,b)=>`Which one would your close friends expect you to talk about longer: ${a} or ${b}?`,
      (a,b)=>`Which one do you think I would learn more about you from: ${a} or ${b}?`,
      (a,b)=>`Which one would you answer first without overthinking: ${a} or ${b}?`,
      (a,b)=>`Which one has played a bigger part in your life: ${a} or ${b}?`,
      (a,b)=>`Which one would make you tell me a proper story: ${a} or ${b}?`
    ],
    relationship: [
      (a,b)=>`Which one would you rather talk about early with someone you like: ${a} or ${b}?`,
      (a,b)=>`Which one tells me more about how you approach relationships: ${a} or ${b}?`,
      (a,b)=>`Which one would you want clarity on sooner: ${a} or ${b}?`,
      (a,b)=>`Which one feels more important to explain properly: ${a} or ${b}?`,
      (a,b)=>`Which one would you rather not leave to assumptions: ${a} or ${b}?`,
      (a,b)=>`Which one would tell me more about what you need from a partner: ${a} or ${b}?`,
      (a,b)=>`Which one would you be more comfortable discussing first: ${a} or ${b}?`,
      (a,b)=>`Which one do you think creates more misunderstandings when people avoid the conversation: ${a} or ${b}?`,
      (a,b)=>`If we talked about one tonight, which would you choose: ${a} or ${b}?`,
      (a,b)=>`Which one matters more to how you date: ${a} or ${b}?`,
      (a,b)=>`Which one would show me more of your relationship mindset: ${a} or ${b}?`,
      (a,b)=>`Which one would you want us to understand about each other earlier: ${a} or ${b}?`
    ]
  },
  'deep-meaningful': {
    friend: [
      (a,b)=>`Which has affected the way you think today more: ${a} or ${b}?`,
      (a,b)=>`Which one has taught you more about yourself: ${a} or ${b}?`,
      (a,b)=>`Which one challenged your values more: ${a} or ${b}?`,
      (a,b)=>`Which one changed your perspective more deeply: ${a} or ${b}?`,
      (a,b)=>`Which one do you think shaped your character more: ${a} or ${b}?`,
      (a,b)=>`Which one took more maturity to understand: ${a} or ${b}?`,
      (a,b)=>`Which one taught you a harder lesson: ${a} or ${b}?`,
      (a,b)=>`Which one do you think you still carry with you more: ${a} or ${b}?`,
      (a,b)=>`Which one made you rethink yourself more: ${a} or ${b}?`,
      (a,b)=>`Which one would you say influenced who you are today more: ${a} or ${b}?`,
      (a,b)=>`Which one forced more growth from you: ${a} or ${b}?`,
      (a,b)=>`Which one would take longer to explain properly: ${a} or ${b}?`
    ],
    relationship: [
      (a,b)=>`Which would be harder for you to navigate with someone you love: ${a} or ${b}?`,
      (a,b)=>`Which one would need more honesty in a serious relationship: ${a} or ${b}?`,
      (a,b)=>`Which one would test emotional safety more for you: ${a} or ${b}?`,
      (a,b)=>`Which one would need clearer boundaries between two people: ${a} or ${b}?`,
      (a,b)=>`Which one do you think couples understand too late: ${a} or ${b}?`,
      (a,b)=>`Which one would be harder for you to talk about openly: ${a} or ${b}?`,
      (a,b)=>`Which one would need more patience from both people: ${a} or ${b}?`,
      (a,b)=>`Which one would tell me more about what makes you feel safe in love: ${a} or ${b}?`,
      (a,b)=>`Which one do you think would reveal more about how two people handle pressure: ${a} or ${b}?`,
      (a,b)=>`Which one would require more trust from you: ${a} or ${b}?`,
      (a,b)=>`Which one would you want handled more carefully in a relationship: ${a} or ${b}?`,
      (a,b)=>`Which one would you find harder to compromise on: ${a} or ${b}?`
    ]
  },
  'fun-random': {
    friend: [
      (a,b)=>`Which one would give you the better story to tell: ${a} or ${b}?`,
      (a,b)=>`Which one sounds more like your kind of chaos: ${a} or ${b}?`,
      (a,b)=>`Which one would your friends tease you about more: ${a} or ${b}?`,
      (a,b)=>`Which one would make you laugh harder afterwards: ${a} or ${b}?`,
      (a,b)=>`Which one would produce the more unserious story: ${a} or ${b}?`,
      (a,b)=>`Which one would you pick for pure entertainment: ${a} or ${b}?`,
      (a,b)=>`Which one has more potential for gist: ${a} or ${b}?`,
      (a,b)=>`Which one would bring out your unserious side faster: ${a} or ${b}?`,
      (a,b)=>`Which one would make the better group-chat story: ${a} or ${b}?`,
      (a,b)=>`Which one would you rather experience if the goal was a funny story: ${a} or ${b}?`,
      (a,b)=>`Which one would make your friends say “this is so you”: ${a} or ${b}?`,
      (a,b)=>`Which one would you have more fun arguing about: ${a} or ${b}?`
    ],
    relationship: [
      (a,b)=>`Which one would make the better gist between us: ${a} or ${b}?`,
      (a,b)=>`Which one do you think we would laugh about more: ${a} or ${b}?`,
      (a,b)=>`Which one could turn into the sillier argument between us: ${a} or ${b}?`,
      (a,b)=>`Which one would make the funnier story about us: ${a} or ${b}?`,
      (a,b)=>`Which one would you rather experience with me for the gist alone: ${a} or ${b}?`,
      (a,b)=>`Which one would make us tease each other more: ${a} or ${b}?`,
      (a,b)=>`Which one sounds more like something we would keep talking about: ${a} or ${b}?`,
      (a,b)=>`Which one would expose our different personalities faster: ${a} or ${b}?`,
      (a,b)=>`Which one would make the better late-night conversation: ${a} or ${b}?`,
      (a,b)=>`Which one would be more fun to debate together: ${a} or ${b}?`,
      (a,b)=>`Which one do you think would give us more inside jokes: ${a} or ${b}?`,
      (a,b)=>`Which one would you rather have happen if we had to laugh about it later: ${a} or ${b}?`
    ]
  },
  'life-experience': {
    friend: [
      (a,b)=>`Which one changed your perspective more: ${a} or ${b}?`,
      (a,b)=>`Which one taught you more about adult life: ${a} or ${b}?`,
      (a,b)=>`Which one gave you the stronger life lesson: ${a} or ${b}?`,
      (a,b)=>`Which one changed your plans more: ${a} or ${b}?`,
      (a,b)=>`Which one would you say shaped your journey more: ${a} or ${b}?`,
      (a,b)=>`Which one taught you more about what you want: ${a} or ${b}?`,
      (a,b)=>`Which one forced you to grow faster: ${a} or ${b}?`,
      (a,b)=>`Which one gave you the better story afterwards: ${a} or ${b}?`,
      (a,b)=>`Which one would you handle more differently today: ${a} or ${b}?`,
      (a,b)=>`Which one changed how you see yourself more: ${a} or ${b}?`,
      (a,b)=>`Which one taught you more about people: ${a} or ${b}?`,
      (a,b)=>`Which one would you rather experience again with what you know now: ${a} or ${b}?`
    ],
    relationship: [
      (a,b)=>`Which one would tell me more about the life you have lived: ${a} or ${b}?`,
      (a,b)=>`Which one shaped what you now expect from a partner more: ${a} or ${b}?`,
      (a,b)=>`Which one taught you more about the support you need: ${a} or ${b}?`,
      (a,b)=>`Which one changed the future you want more: ${a} or ${b}?`,
      (a,b)=>`Which one would help me understand your journey better: ${a} or ${b}?`,
      (a,b)=>`Which one influenced the way you think about partnership more: ${a} or ${b}?`,
      (a,b)=>`Which one would you want me to hear the full story about first: ${a} or ${b}?`,
      (a,b)=>`Which one made you clearer about what you need from people: ${a} or ${b}?`,
      (a,b)=>`Which one do you think changed your relationship standards more: ${a} or ${b}?`,
      (a,b)=>`Which one would take longer for you to explain properly: ${a} or ${b}?`,
      (a,b)=>`Which one taught you more about responsibility: ${a} or ${b}?`,
      (a,b)=>`Which one would you say prepared you more for adult relationships: ${a} or ${b}?`
    ]
  },
  nigeria: {
    friend: [
      (a,b)=>`Which one would start the longer Nigerian gist for you: ${a} or ${b}?`,
      (a,b)=>`Which one feels more familiar from life in Nigeria: ${a} or ${b}?`,
      (a,b)=>`Which one would you complain about longer with friends: ${a} or ${b}?`,
      (a,b)=>`Which one says more about everyday Nigerian life to you: ${a} or ${b}?`,
      (a,b)=>`Which one would you miss more if you left Nigeria: ${a} or ${b}?`,
      (a,b)=>`Which one has changed more since you were younger: ${a} or ${b}?`,
      (a,b)=>`Which one would a visitor need more explanation for: ${a} or ${b}?`,
      (a,b)=>`Which one brings out a stronger Nigerian opinion from you: ${a} or ${b}?`,
      (a,b)=>`Which one would give you more stories about living here: ${a} or ${b}?`,
      (a,b)=>`Which one feels more tied to your experience of Nigeria: ${a} or ${b}?`,
      (a,b)=>`Which one would start a bigger debate at a Nigerian hangout: ${a} or ${b}?`,
      (a,b)=>`Which one do you think Nigerians have adapted to more: ${a} or ${b}?`
    ],
    relationship: [
      (a,b)=>`Which one would affect our day-to-day life in Nigeria more: ${a} or ${b}?`,
      (a,b)=>`Which one would we need to plan around more carefully here: ${a} or ${b}?`,
      (a,b)=>`Which one do you think puts more pressure on couples in Nigeria: ${a} or ${b}?`,
      (a,b)=>`Which one would test our teamwork more while living here: ${a} or ${b}?`,
      (a,b)=>`Which one would we need a clearer shared approach to: ${a} or ${b}?`,
      (a,b)=>`Which one could affect our lifestyle here more: ${a} or ${b}?`,
      (a,b)=>`Which one do you think Nigerian couples underestimate more: ${a} or ${b}?`,
      (a,b)=>`Which one would create more family or social pressure for us: ${a} or ${b}?`,
      (a,b)=>`Which one would you want us to decide for ourselves: ${a} or ${b}?`,
      (a,b)=>`Which one would require more adjustment from us in Nigeria: ${a} or ${b}?`,
      (a,b)=>`Which one would shape our routine here more: ${a} or ${b}?`,
      (a,b)=>`Which one would you rather have sorted before building a life here: ${a} or ${b}?`
    ]
  },
  family: {
    friend: [
      (a,b)=>`Which one says more about how your family works: ${a} or ${b}?`,
      (a,b)=>`Which one would get the longer family story from you: ${a} or ${b}?`,
      (a,b)=>`Which one shaped your experience at home more: ${a} or ${b}?`,
      (a,b)=>`Which one would your siblings or cousins have more to say about: ${a} or ${b}?`,
      (a,b)=>`Which one tells me more about the home you grew up in: ${a} or ${b}?`,
      (a,b)=>`Which one would your family debate more: ${a} or ${b}?`,
      (a,b)=>`Which one brings back a stronger family memory: ${a} or ${b}?`,
      (a,b)=>`Which one says more about your family’s habits: ${a} or ${b}?`,
      (a,b)=>`Which one would make the better family gist: ${a} or ${b}?`,
      (a,b)=>`Which one do you think influenced you more at home: ${a} or ${b}?`,
      (a,b)=>`Which one would you keep more happily from your upbringing: ${a} or ${b}?`,
      (a,b)=>`Which one would need more explanation to somebody outside your family: ${a} or ${b}?`
    ],
    relationship: [
      (a,b)=>`Which one would tell me more about the family life you want us to build: ${a} or ${b}?`,
      (a,b)=>`Which one would matter more in the home we build: ${a} or ${b}?`,
      (a,b)=>`Which one would you want us to handle differently from your family: ${a} or ${b}?`,
      (a,b)=>`Which one would need a clearer family boundary for us: ${a} or ${b}?`,
      (a,b)=>`Which one do you think would shape our future home more: ${a} or ${b}?`,
      (a,b)=>`Which one would you want us to talk through before marriage: ${a} or ${b}?`,
      (a,b)=>`Which one would show me more about the family culture you want: ${a} or ${b}?`,
      (a,b)=>`Which one would you be more intentional about in our own home: ${a} or ${b}?`,
      (a,b)=>`Which one do you think would need more compromise between our families: ${a} or ${b}?`,
      (a,b)=>`Which one would you want us to protect our relationship from more carefully: ${a} or ${b}?`,
      (a,b)=>`Which one would influence the atmosphere of our home more: ${a} or ${b}?`,
      (a,b)=>`Which one would you want us to make our own rules about: ${a} or ${b}?`
    ]
  },
  nostalgia: {
    friend: [
      (a,b)=>`Which one takes you back faster: ${a} or ${b}?`,
      (a,b)=>`Which one do you miss more: ${a} or ${b}?`,
      (a,b)=>`Which one brings back a clearer memory: ${a} or ${b}?`,
      (a,b)=>`Which one would you bring back for one day: ${a} or ${b}?`,
      (a,b)=>`Which one feels more like your childhood: ${a} or ${b}?`,
      (a,b)=>`Which one would make you more nostalgic immediately: ${a} or ${b}?`,
      (a,b)=>`Which one would get the better throwback story from you: ${a} or ${b}?`,
      (a,b)=>`Which one do you remember more vividly: ${a} or ${b}?`,
      (a,b)=>`Which one would younger you choose first: ${a} or ${b}?`,
      (a,b)=>`Which one would you enjoy experiencing again exactly once: ${a} or ${b}?`,
      (a,b)=>`Which one feels more old-school to you personally: ${a} or ${b}?`,
      (a,b)=>`Which one has the stronger memory attached to it: ${a} or ${b}?`
    ],
    relationship: [
      (a,b)=>`Which one would you rather relive with me for one day: ${a} or ${b}?`,
      (a,b)=>`Which one would help me picture younger you better: ${a} or ${b}?`,
      (a,b)=>`Which one would you rather tell me the full story about: ${a} or ${b}?`,
      (a,b)=>`Which one would make you more nostalgic if we talked about it tonight: ${a} or ${b}?`,
      (a,b)=>`Which one would you have loved for us to experience together back then: ${a} or ${b}?`,
      (a,b)=>`Which one has the stronger childhood memory for you: ${a} or ${b}?`,
      (a,b)=>`Which one would make the better throwback conversation between us: ${a} or ${b}?`,
      (a,b)=>`Which one would younger you have been more excited about: ${a} or ${b}?`,
      (a,b)=>`Which one would you bring back for us to experience once: ${a} or ${b}?`,
      (a,b)=>`Which one tells me more about what growing up felt like for you: ${a} or ${b}?`,
      (a,b)=>`Which one would you smile about longer while telling me the story: ${a} or ${b}?`,
      (a,b)=>`Which one would you want me to understand from your younger years first: ${a} or ${b}?`
    ]
  },
  'growing-up': {
    friend: [
      (a,b)=>`Which one shaped younger you more: ${a} or ${b}?`,
      (a,b)=>`Which one taught you more while growing up: ${a} or ${b}?`,
      (a,b)=>`Which one got you into more trouble back then: ${a} or ${b}?`,
      (a,b)=>`Which one taught you more responsibility: ${a} or ${b}?`,
      (a,b)=>`Which one would your parents remember more about you: ${a} or ${b}?`,
      (a,b)=>`Which one changed you more before adulthood: ${a} or ${b}?`,
      (a,b)=>`Which one would younger you have stronger feelings about: ${a} or ${b}?`,
      (a,b)=>`Which one tells me more about how you grew up: ${a} or ${b}?`,
      (a,b)=>`Which one gave you the stronger lesson as a child or teenager: ${a} or ${b}?`,
      (a,b)=>`Which one do you understand differently now: ${a} or ${b}?`,
      (a,b)=>`Which one shaped your habits more when you were younger: ${a} or ${b}?`,
      (a,b)=>`Which one would make the longer growing-up story: ${a} or ${b}?`
    ],
    relationship: [
      (a,b)=>`Which one would tell me more about the younger you: ${a} or ${b}?`,
      (a,b)=>`Which one shaped how you relate to people more: ${a} or ${b}?`,
      (a,b)=>`Which one do you think still affects you today more: ${a} or ${b}?`,
      (a,b)=>`Which one would help me understand your upbringing better: ${a} or ${b}?`,
      (a,b)=>`Which one taught you more about trust or communication: ${a} or ${b}?`,
      (a,b)=>`Which one would you handle differently if you could grow up again: ${a} or ${b}?`,
      (a,b)=>`Which one do you think shaped the kind of home you want more: ${a} or ${b}?`,
      (a,b)=>`Which one would you want me to hear the story behind first: ${a} or ${b}?`,
      (a,b)=>`Which one influenced your teenage years more: ${a} or ${b}?`,
      (a,b)=>`Which one would younger you have found harder: ${a} or ${b}?`,
      (a,b)=>`Which one tells me more about what your home was like: ${a} or ${b}?`,
      (a,b)=>`Which one do you think your family remembers you for more: ${a} or ${b}?`
    ]
  },
  food: {
    friend: [
      (a,b)=>`Which one are you choosing first: ${a} or ${b}?`,
      (a,b)=>`Which one would you defend harder: ${a} or ${b}?`,
      (a,b)=>`Which one has the better food memory for you: ${a} or ${b}?`,
      (a,b)=>`Which one would you order without thinking twice: ${a} or ${b}?`,
      (a,b)=>`Which one would win on your plate: ${a} or ${b}?`,
      (a,b)=>`Which one would start the bigger food debate with you: ${a} or ${b}?`,
      (a,b)=>`Which one do you crave more easily: ${a} or ${b}?`,
      (a,b)=>`Which one would you recommend first: ${a} or ${b}?`,
      (a,b)=>`Which one would you miss more if you stopped eating it: ${a} or ${b}?`,
      (a,b)=>`Which one gets a higher food rating from you: ${a} or ${b}?`,
      (a,b)=>`Which one would you pick for a proper Nigerian food day: ${a} or ${b}?`,
      (a,b)=>`Which one would you rather argue about with friends: ${a} or ${b}?`
    ],
    relationship: [
      (a,b)=>`Which one would you rather share with me: ${a} or ${b}?`,
      (a,b)=>`Which one would make the better relaxed food date: ${a} or ${b}?`,
      (a,b)=>`Which one do you think we would disagree about more: ${a} or ${b}?`,
      (a,b)=>`Which one would you want us to order first: ${a} or ${b}?`,
      (a,b)=>`Which one would make the better late-night food run: ${a} or ${b}?`,
      (a,b)=>`Which one do you think I should know your opinion on first: ${a} or ${b}?`,
      (a,b)=>`Which one would you rather cook or buy for us: ${a} or ${b}?`,
      (a,b)=>`Which one would start a bigger food argument between us: ${a} or ${b}?`,
      (a,b)=>`Which one would you choose for an easy date: ${a} or ${b}?`,
      (a,b)=>`Which one would you rather introduce me to properly: ${a} or ${b}?`,
      (a,b)=>`Which one would you be less willing to share: ${a} or ${b}?`,
      (a,b)=>`Which one would you rather have waiting for us after a long day: ${a} or ${b}?`
    ]
  },
  'everyday-life': {
    friend: [
      (a,b)=>`Which one affects your normal week more: ${a} or ${b}?`,
      (a,b)=>`Which one drains more of your energy: ${a} or ${b}?`,
      (a,b)=>`Which one do you handle better: ${a} or ${b}?`,
      (a,b)=>`Which one would improve your day more if it became easier: ${a} or ${b}?`,
      (a,b)=>`Which one takes more planning from you: ${a} or ${b}?`,
      (a,b)=>`Which one annoys you more during a normal week: ${a} or ${b}?`,
      (a,b)=>`Which one affects your routine more often: ${a} or ${b}?`,
      (a,b)=>`Which one would you happily never deal with again: ${a} or ${b}?`,
      (a,b)=>`Which one do you think you have adapted to better: ${a} or ${b}?`,
      (a,b)=>`Which one makes you change your plans more often: ${a} or ${b}?`,
      (a,b)=>`Which one takes more patience from you: ${a} or ${b}?`,
      (a,b)=>`Which one would make a bigger difference if it improved tomorrow: ${a} or ${b}?`
    ],
    relationship: [
      (a,b)=>`Which one would need more teamwork from us: ${a} or ${b}?`,
      (a,b)=>`Which one do you think would affect our routine more: ${a} or ${b}?`,
      (a,b)=>`Which one would create more everyday tension if we handled it differently: ${a} or ${b}?`,
      (a,b)=>`Which one would you rather we have a clear routine for: ${a} or ${b}?`,
      (a,b)=>`Which one would need more patience from both of us: ${a} or ${b}?`,
      (a,b)=>`Which one do you think living together would expose faster: ${a} or ${b}?`,
      (a,b)=>`Which one would you want us to make easier for each other: ${a} or ${b}?`,
      (a,b)=>`Which one would affect our day-to-day mood more: ${a} or ${b}?`,
      (a,b)=>`Which one would require more compromise in our routine: ${a} or ${b}?`,
      (a,b)=>`Which one would you rather we solve together first: ${a} or ${b}?`,
      (a,b)=>`Which one could become a bigger everyday issue if ignored: ${a} or ${b}?`,
      (a,b)=>`Which one would you want me to understand your habits around better: ${a} or ${b}?`
    ]
  },
  movies: {
    friend: [
      (a,b)=>`Which one would you rather talk about after a film night: ${a} or ${b}?`,
      (a,b)=>`Which one says more about your screen taste: ${a} or ${b}?`,
      (a,b)=>`Which one would start the better movie argument: ${a} or ${b}?`,
      (a,b)=>`Which one would you pick first for a watch night: ${a} or ${b}?`,
      (a,b)=>`Which one would you have more opinions about: ${a} or ${b}?`,
      (a,b)=>`Which one would make the better post-film gist: ${a} or ${b}?`,
      (a,b)=>`Which one do you think you would defend more: ${a} or ${b}?`,
      (a,b)=>`Which one would tell me more about what you enjoy watching: ${a} or ${b}?`,
      (a,b)=>`Which one would keep you talking longer after the credits: ${a} or ${b}?`,
      (a,b)=>`Which one would you rather watch or discuss tonight: ${a} or ${b}?`,
      (a,b)=>`Which one would make the more interesting film conversation: ${a} or ${b}?`,
      (a,b)=>`Which one is closer to your actual viewing habits: ${a} or ${b}?`
    ],
    relationship: [
      (a,b)=>`Which one would make the better movie-night conversation for us: ${a} or ${b}?`,
      (a,b)=>`Which one would you rather watch or debate with me: ${a} or ${b}?`,
      (a,b)=>`Which one do you think we would disagree about more: ${a} or ${b}?`,
      (a,b)=>`Which one would tell me more about your film taste: ${a} or ${b}?`,
      (a,b)=>`Which one would make the better stay-in night for us: ${a} or ${b}?`,
      (a,b)=>`Which one would start more gist between us after watching: ${a} or ${b}?`,
      (a,b)=>`Which one would you be more likely to recommend to me: ${a} or ${b}?`,
      (a,b)=>`Which one could turn into a longer movie debate between us: ${a} or ${b}?`,
      (a,b)=>`Which one would you rather experience on a date night: ${a} or ${b}?`,
      (a,b)=>`Which one do you think would expose our different tastes faster: ${a} or ${b}?`,
      (a,b)=>`Which one would make the better film memory for us: ${a} or ${b}?`,
      (a,b)=>`Which one would you rather have me understand about your viewing habits: ${a} or ${b}?`
    ]
  },
  music: {
    friend: [
      (a,b)=>`Which one has the stronger music memory for you: ${a} or ${b}?`,
      (a,b)=>`Which one says more about your music taste: ${a} or ${b}?`,
      (a,b)=>`Which one would you play or talk about first: ${a} or ${b}?`,
      (a,b)=>`Which one would your friends expect you to pick: ${a} or ${b}?`,
      (a,b)=>`Which one has more nostalgia attached to it for you: ${a} or ${b}?`,
      (a,b)=>`Which one would start the longer music gist: ${a} or ${b}?`,
      (a,b)=>`Which one do you have stronger opinions about: ${a} or ${b}?`,
      (a,b)=>`Which one would you choose for a playlist conversation: ${a} or ${b}?`,
      (a,b)=>`Which one brings back a clearer moment for you: ${a} or ${b}?`,
      (a,b)=>`Which one would you rather defend as part of your taste: ${a} or ${b}?`,
      (a,b)=>`Which one would tell me more about your relationship with music: ${a} or ${b}?`,
      (a,b)=>`Which one would get you talking longer about music: ${a} or ${b}?`
    ],
    relationship: [
      (a,b)=>`Which one would make the better music memory for us: ${a} or ${b}?`,
      (a,b)=>`Which one would you rather share with me through music: ${a} or ${b}?`,
      (a,b)=>`Which one do you think would create the better playlist conversation: ${a} or ${b}?`,
      (a,b)=>`Which one would you rather send me unexpectedly: ${a} or ${b}?`,
      (a,b)=>`Which one would tell me more about your music taste: ${a} or ${b}?`,
      (a,b)=>`Which one would make the better soundtrack memory between us: ${a} or ${b}?`,
      (a,b)=>`Which one do you think we would debate more: ${a} or ${b}?`,
      (a,b)=>`Which one would you rather hear together on a long drive: ${a} or ${b}?`,
      (a,b)=>`Which one would you want me to understand the story behind: ${a} or ${b}?`,
      (a,b)=>`Which one would make the better late-night music gist: ${a} or ${b}?`,
      (a,b)=>`Which one would you connect with us more easily: ${a} or ${b}?`,
      (a,b)=>`Which one would you rather build a shared music memory around: ${a} or ${b}?`
    ]
  },
  'hot-takes': {
    friend: [
      (a,b)=>`Which one would start the bigger argument among your friends: ${a} or ${b}?`,
      (a,b)=>`Which one do people get more wrong: ${a} or ${b}?`,
      (a,b)=>`Which one has the bigger double standard around it: ${a} or ${b}?`,
      (a,b)=>`Which one do people judge too quickly: ${a} or ${b}?`,
      (a,b)=>`Which one do people excuse too easily: ${a} or ${b}?`,
      (a,b)=>`Which one would you defend the stronger unpopular opinion about: ${a} or ${b}?`,
      (a,b)=>`Which one would split your friend group faster in a debate: ${a} or ${b}?`,
      (a,b)=>`Which one do you think society overthinks more: ${a} or ${b}?`,
      (a,b)=>`Which one exposes more hypocrisy to you: ${a} or ${b}?`,
      (a,b)=>`Which one would you rather debate without sitting on the fence: ${a} or ${b}?`,
      (a,b)=>`Which one has changed your opinion more over time: ${a} or ${b}?`,
      (a,b)=>`Which one would get the more controversial answer from you: ${a} or ${b}?`
    ],
    relationship: [
      (a,b)=>`Which one do you think couples need to discuss earlier: ${a} or ${b}?`,
      (a,b)=>`Which one creates more relationship pressure: ${a} or ${b}?`,
      (a,b)=>`Which one has the bigger double standard in dating: ${a} or ${b}?`,
      (a,b)=>`Which one do people call a red flag too quickly: ${a} or ${b}?`,
      (a,b)=>`Which one do couples excuse for too long: ${a} or ${b}?`,
      (a,b)=>`Which one would start the hotter relationship debate: ${a} or ${b}?`,
      (a,b)=>`Which one do you think social media has complicated more: ${a} or ${b}?`,
      (a,b)=>`Which one would you need stronger agreement on despite other people’s opinions: ${a} or ${b}?`,
      (a,b)=>`Which one do you think couples are less honest about: ${a} or ${b}?`,
      (a,b)=>`Which one would expose compatibility problems faster: ${a} or ${b}?`,
      (a,b)=>`Which one would you have the stronger hot take about: ${a} or ${b}?`,
      (a,b)=>`Which one do people romanticise or simplify too much: ${a} or ${b}?`
    ]
  },
  'values-beliefs': {
    friend: [
      (a,b)=>`Which one would tell me more about your values: ${a} or ${b}?`,
      (a,b)=>`Which one would test your principles more: ${a} or ${b}?`,
      (a,b)=>`Which one says more about someone’s character to you: ${a} or ${b}?`,
      (a,b)=>`Which one would be harder for you to compromise on: ${a} or ${b}?`,
      (a,b)=>`Which one do you think reveals more about what somebody stands for: ${a} or ${b}?`,
      (a,b)=>`Which one matters more to your idea of integrity: ${a} or ${b}?`,
      (a,b)=>`Which one would make you lose respect for somebody faster if handled badly: ${a} or ${b}?`,
      (a,b)=>`Which one would you judge more by someone’s actions than their words: ${a} or ${b}?`,
      (a,b)=>`Which one would you find harder to excuse: ${a} or ${b}?`,
      (a,b)=>`Which one tells me more about the standards you keep for yourself: ${a} or ${b}?`,
      (a,b)=>`Which one do you think people compromise too easily on: ${a} or ${b}?`,
      (a,b)=>`Which one would you rather be known for handling well: ${a} or ${b}?`
    ],
    relationship: [
      (a,b)=>`Which one would tell me more about the kind of relationship you want: ${a} or ${b}?`,
      (a,b)=>`Which one would test our shared values more: ${a} or ${b}?`,
      (a,b)=>`Which one would you need stronger agreement on: ${a} or ${b}?`,
      (a,b)=>`Which one would affect trust more for you: ${a} or ${b}?`,
      (a,b)=>`Which one would be harder for you to compromise on in a relationship: ${a} or ${b}?`,
      (a,b)=>`Which one would reveal more about whether our principles align: ${a} or ${b}?`,
      (a,b)=>`Which one do you think love should never excuse: ${a} or ${b}?`,
      (a,b)=>`Which one would matter more to your idea of fairness between partners: ${a} or ${b}?`,
      (a,b)=>`Which one would you want us to have clearer rules around: ${a} or ${b}?`,
      (a,b)=>`Which one would tell me more about what commitment means to you: ${a} or ${b}?`,
      (a,b)=>`Which one do you think tests character more inside a relationship: ${a} or ${b}?`,
      (a,b)=>`Which one would you rather resolve before making a long-term commitment: ${a} or ${b}?`
    ]
  }
}

function reframePair(categoryId, mode, prompt) {
  if (!prompt.semanticSourceKey?.startsWith('pair:')) return prompt
  const raw = prompt.semanticSourceKey.slice(5)
  const divider = raw.indexOf('|')
  if (divider < 1) return prompt
  const a = readableSource(raw.slice(0, divider))
  const b = readableSource(raw.slice(divider + 1))
  const frames = pairFrames[categoryId]?.[mode]
  if (!frames?.length) return prompt
  const frame = frames[hashText(prompt.semanticSourceKey) % frames.length]
  const text = frame(a, b)
  return { ...prompt, text, copyText: text }
}

function cleanSingle(prompt) {
  if (prompt.semanticSourceKey?.startsWith('pair:')) return prompt
  const text = stripLeadIn(prompt.text)
  return text === prompt.text ? prompt : { ...prompt, text, copyText: text }
}

export function buildNigeriaConversationPrompts(categoryId, mode) {
  const base = buildV9NigeriaConversationPrompts(categoryId, mode)
  if (categoryId === 'faith-spirituality') return base
  return base.map(prompt => reframePair(categoryId, mode, cleanSingle(prompt)))
}

export { nigeriaConversationCategoryIds }
