import { conversationCategories } from '../categories.js'
import { ngContext } from './context.js'
import {
  TARGET_PER_MODE,
  audienceFor,
  deterministicShuffle,
  intensityFor,
  normalise,
  stageFor,
  takeTarget,
} from './helpers.js'

const movieExtra = [
  'watching a Nigerian film with your parents', 'choosing what to watch with friends', 'a cinema date', 'a film that everybody loved except you',
  'a film you watched more than once as a child', 'a Nollywood character you still remember', 'a film ending that annoyed you', 'a film that made you cry unexpectedly',
  'a film you only watched because everybody was discussing it', 'a series you abandoned halfway', 'a film you wish you could watch again for the first time',
  'a Nigerian actor who always gets your attention', 'a movie night that became more about gist than the film', 'buying overpriced cinema snacks',
  'arguing about whether a film was good after leaving the cinema', 'watching old Nollywood clips online', 'a film your siblings made you watch',
  'a movie soundtrack you still remember', 'a film genre you never get tired of', 'a film genre you avoid almost every time',
  'a movie everybody quotes around you', 'a series you stayed up too late watching', 'a film you watched mainly for one actor', 'a character you defended even when they were clearly wrong',
  'a film that changed your mind about something', 'a movie you would recommend to almost anybody', 'a film you enjoyed even though the reviews were bad',
  'a cinema experience ruined by somebody talking', 'watching football when everybody else wanted a film', 'sharing a streaming account with family or friends',
]

const musicExtra = [
  'the song that defined your final year in secondary school', 'the Nigerian song you played too much one year', 'a gospel song you grew up hearing at home',
  'a song that reminds you of a specific friend', 'a song that reminds you of somebody you once liked', 'the first Nigerian concert you attended or wanted to attend',
  'a song you discovered through a friend', 'a song you discovered through social media', 'an old Afrobeats song that still works at a party',
  'a Nigerian artist you defended before everyone else liked them', 'an artist you stopped listening to as much', 'a song you use to survive traffic',
  'a song you play when you need confidence', 'a song you play when you are cleaning', 'a song that always works at a wedding',
  'a song you know almost every word of', 'a song you love even though the lyrics are not deep', 'an album you can play without skipping much',
  'a Nigerian artist you want to see live', 'a song you sent someone because the lyrics said what you could not', 'a playlist you made for a specific season of your life',
  'the type of music your parents played at home', 'a song that takes you back to university', 'a song that takes you back to NYSC',
  'a song you would choose for a late-night drive', 'a song you would choose for a road trip', 'a song you would never want somebody to ruin for you',
  'an artist whose old music you prefer to their new music', 'a music opinion your friends always argue with', 'the Nigerian music era you would bring back for one weekend',
]

const faithExtra = [
  'the first time faith became personal to you', 'a prayer you still remember from a difficult season', 'a Bible passage that has stayed with you',
  'a church experience that shaped you positively', 'a church experience that made you ask questions', 'how your family practised faith while you were growing up',
  'how you respond when prayer feels unanswered', 'how you handle doubt', 'how you decide whether a teaching is sound', 'how faith affects your friendships',
  'how faith affects your money decisions', 'how faith affects your career decisions', 'what forgiveness means when the hurt is serious',
  'what obedience means when it costs you something', 'how you know when you need spiritual rest rather than more activity', 'the role of community in your faith',
  'what you value in a church', 'what makes religious pressure unhealthy', 'how you separate conviction from fear', 'what gratitude looks like in your normal week',
  'how you handle seasons when you feel spiritually dry', 'what you want to understand better about God', 'what spiritual maturity looks like to you',
  'how you think Christians should handle disagreement', 'how you think Christians should approach dating', 'how you think Christians should approach ambition',
  'how you think Christians should treat people who believe differently', 'what serving other people looks like outside church', 'the place of generosity in your faith',
  'the kind of Christian you hope to become over time',
]

const everydayExtra = [
  'deciding what to eat after a long workday', 'trying to leave home early enough to beat traffic', 'checking whether you have enough data before a call',
  'charging your phone whenever power returns', 'keeping emergency money for transport', 'remembering to buy something on your way home', 'replying messages after a busy day',
  'deciding whether to cook or order food', 'doing laundry on a weekend', 'cleaning your room before you can relax', 'making time to exercise after work',
  'trying to sleep early and still staying awake on your phone', 'planning your week around work and family', 'checking your account balance before going out',
  'using a power bank when you are outside all day', 'finding time to call your parents or family', 'dealing with a delivery rider who cannot find your address',
  'buying groceries when prices have changed again', 'deciding whether an outing is worth the traffic', 'finding a quiet place after a noisy day',
  'getting home and changing into comfortable clothes immediately', 'keeping your room cool during a power cut', 'planning several errands for one trip',
  'remembering to refill fuel or recharge backup power', 'trying to avoid unnecessary spending during the week', 'making weekend plans and then wanting to stay home',
  'sorting out a bank issue during working hours', 'waiting for a ride after an event', 'having a favourite food place near home or work', 'protecting one evening with no plans',
]

const familyExtra = [
  'the parent you asked when you wanted permission', 'the relative everybody listens to', 'the sibling or cousin who knows the most family gist',
  'family expectations around school results', 'family expectations around career choices', 'family expectations around marriage', 'family expectations around helping relatives',
  'how your family handled apologies', 'how your family handled money conversations', 'how your family handled birthdays', 'how your family handled Christmas',
  'the relative who always asks the most personal questions', 'the family member who made gatherings more fun', 'the family member you could talk to most easily growing up',
  'being sent on errands by older relatives', 'sharing food with siblings or cousins', 'being compared with another child', 'family prayers or devotional routines',
  'visiting relatives during school holidays', 'travelling home for Christmas', 'family weddings', 'family burials that became reunions', 'cousins you only saw during holidays',
  'being expected to greet every older person properly', 'who controlled the television remote at home', 'sharing a room with siblings or relatives',
  'the kind of discipline your home used', 'the family rule you complained about most', 'the thing your family still teases you about', 'the family tradition you would happily keep',
]

const categorySpecs = {
  'getting-to-know-you': {
    friendDomains: ['secondarySchool','familyHome','moneySpending','whatsappPhone','wellbeing','friendshipDynamics','ambitionsJapa','workCareer'],
    relationshipDomains: ['datingEarly','relationshipCommunication','relationshipMoney','relationshipFamily','ambitionsJapa','familyHome','whatsappPhone','attractionAffection'],
    friendSingles: [
      'What is your honest answer when it comes to {a}?', 'What would surprise me most about you and {a}?', 'What do your closest friends already know about you and {a}?',
      'What is one story about {a} that says a lot about you?', 'What have you changed your mind about when it comes to {a}?', 'What is your most predictable behaviour around {a}?',
    ],
    relationshipSingles: [
      'What would you want me to understand about you when it comes to {a}?', 'What would I probably guess wrongly about you and {a}?', 'What is one thing about {a} you would rather tell me directly than let me assume?',
      'What do you think {a} reveals about the kind of partner you are?', 'What is one preference or boundary you have around {a}?', 'What has experience taught you about yourself when it comes to {a}?',
    ],
    friendPairs: ['Which says more about you: {a} or {b}?', 'Which has shaped you more: {a} or {b}?', 'Which would your friends say matters more to you: {a} or {b}?'],
    relationshipPairs: ['Which would tell me more about you as a partner: {a} or {b}?', 'Which matters more to you in a relationship: {a} or {b}?', 'Which would you rather talk about early: {a} or {b}?'],
  },
  'deep-meaningful': {
    friendDomains: ['familyHome','valuesCharacter','ambitionsJapa','wellbeing','friendshipDynamics','faithGeneral','workCareer','moneySpending'],
    relationshipDomains: ['relationshipCommunication','relationshipMoney','relationshipFamily','relationshipFuture','conflictBoundaries','faithGeneral','familyHome','ambitionsJapa'],
    friendSingles: [
      'What has {a} taught you about yourself?', 'What is the hardest part of being honest about {a}?', 'What did your upbringing teach you about {a}?',
      'What have you had to unlearn about {a}?', 'What do you think maturity looks like when dealing with {a}?', 'What do you wish people understood about your experience of {a}?',
    ],
    relationshipSingles: [
      'What would emotional safety look like for you around {a}?', 'What would you need from me if {a} became difficult?', 'What boundary would help us handle {a} well?',
      'What did your past teach you about {a}?', 'What do you think couples learn too late about {a}?', 'What would respect look like between us if we disagreed about {a}?',
    ],
    friendPairs: ['Which has tested your values more: {a} or {b}?', 'Which has taught you more about yourself: {a} or {b}?', 'Which would be harder for you to lose: {a} or {b}?'],
    relationshipPairs: ['Which would test a relationship more for you: {a} or {b}?', 'Which would you need more agreement on: {a} or {b}?', 'Which would be harder for you to talk about honestly: {a} or {b}?'],
  },
  'fun-random': {
    friendDomains: ['secondarySchool','childhoodGames','oldInternet','transportTraffic','powerInternet','snacksStreetFood','socialMedia','whatsappPhone'],
    relationshipDomains: ['datingEarly','whatsappPhone','socialMedia','transportTraffic','powerInternet','snacksStreetFood','attractionAffection','musicHabits'],
    friendSingles: [
      'What is the funniest story you have about {a}?', 'What is your most unserious opinion about {a}?', 'What part of {a} annoys you faster than it should?',
      'What would your friends tease you about when it comes to {a}?', 'What is one ridiculous rule you would create for {a}?', 'What is one thing about {a} you take far too seriously?',
    ],
    relationshipSingles: [
      'What silly disagreement do you think we could have about {a}?', 'What would make {a} unexpectedly fun for us?', 'Who do you think would handle {a} better, you or me?',
      'What do you think I would tease you about when it comes to {a}?', 'What do you think you would tease me about when it comes to {a}?', 'What would turn {a} into a story we would keep retelling?',
    ],
    friendPairs: ['Which is more likely to ruin your mood: {a} or {b}?', 'Which would make the better story afterwards: {a} or {b}?', 'Which would you choose for pure fun: {a} or {b}?'],
    relationshipPairs: ['Which would be more fun for us: {a} or {b}?', 'Which would cause the sillier argument between us: {a} or {b}?', 'Which would you rather experience with me: {a} or {b}?'],
  },
  'life-experience': {
    friendDomains: ['secondarySchool','university','nysc','workCareer','savingsHustle','travelNigeria','familyHome','ambitionsJapa'],
    relationshipDomains: ['secondarySchool','university','nysc','workCareer','travelNigeria','familyHome','ambitionsJapa','relationshipFuture'],
    friendSingles: [
      'What is the first story that comes to mind when you think about {a}?', 'What did {a} teach you that you did not expect?', 'What would you do differently if you went through {a} again?',
      'What was harder about {a} than you expected?', 'What are you proud of about the way you handled {a}?', 'Who mattered most to you during {a}?',
    ],
    relationshipSingles: [
      'What would you want me to understand about your experience of {a}?', 'How did {a} shape what you now expect from a partner?', 'What did {a} teach you about the kind of support you need?',
      'What lesson from {a} would you want us to remember together?', 'What did {a} change about the future you want?', 'What story about {a} would help me understand you better?',
    ],
    friendPairs: ['Which changed you more: {a} or {b}?', 'Which would you rather experience again: {a} or {b}?', 'Which taught you more about adult life: {a} or {b}?'],
    relationshipPairs: ['Which shaped your relationship expectations more: {a} or {b}?', 'Which would you rather experience with a partner: {a} or {b}?', 'Which would tell me more about your life story: {a} or {b}?'],
  },
  nigeria: {
    friendDomains: ['transportTraffic','powerInternet','travelNigeria','cityLife','nigeriaSociety','partiesWeddings','relativesVillage','oldInternet'],
    relationshipDomains: ['transportTraffic','powerInternet','travelNigeria','cityLife','nigeriaSociety','partiesWeddings','relationshipFamily','ambitionsJapa'],
    friendSingles: [
      'What is your most Nigerian story about {a}?', 'What do you think somebody who did not grow up here would misunderstand about {a}?', 'What is your strongest opinion about {a}?',
      'What would you change about {a} if you had the power?', 'What part of {a} feels normal to you but might surprise somebody else?', 'What do you think has changed most about {a} since you were younger?',
    ],
    relationshipSingles: [
      'How do you think living in Nigeria affects {a} for couples?', 'What would you want us to agree on about {a} if we were building a life here?', 'What Nigerian expectation around {a} would you refuse to follow blindly?',
      'What pressure does family or society add to {a}?', 'What would you want us to decide for ourselves about {a}?', 'What would make {a} easier for us to handle as a team?',
    ],
    friendPairs: ['Which feels more Nigerian to you: {a} or {b}?', 'Which would you miss more if you left Nigeria: {a} or {b}?', 'Which do you think has changed more in Nigeria: {a} or {b}?'],
    relationshipPairs: ['Which would affect our life in Nigeria more: {a} or {b}?', 'Which would create more pressure on a couple here: {a} or {b}?', 'Which would you want us to plan around more carefully: {a} or {b}?'],
  },
  family: {
    friendDomains: ['familyHome','relativesVillage','choresErrands','celebrations','valuesCharacter'], friendExtra: familyExtra,
    relationshipDomains: ['familyHome','relativesVillage','relationshipFamily','relationshipFuture','valuesCharacter'], relationshipExtra: familyExtra,
    friendSingles: [
      'What family story comes to mind when you think about {a}?', 'What did your family teach you about {a}?', 'What did you think was normal about {a} until you met other families?',
      'What would your siblings or cousins say about you and {a}?', 'What is one thing about {a} you would do differently in your own home?', 'Who in your family do you associate most with {a}?',
    ],
    relationshipSingles: [
      'What would you want me to understand about your family and {a}?', 'What would you want us to keep from your family’s approach to {a}?', 'What would you want us to do differently from your family around {a}?',
      'What boundary would protect our relationship when {a} involves family?', 'What family expectation around {a} would you want us to discuss early?', 'What would you want our future home to feel like when it comes to {a}?',
    ],
    friendPairs: ['Which shaped your family experience more: {a} or {b}?', 'Which would your family debate more: {a} or {b}?', 'Which would you want to keep in your future home: {a} or {b}?'],
    relationshipPairs: ['Which would need a clearer family boundary: {a} or {b}?', 'Which would you want us to discuss with family earlier: {a} or {b}?', 'Which would matter more in the home we build: {a} or {b}?'],
  },
  nostalgia: {
    friendDomains: ['primarySchool','secondarySchool','childhoodGames','childhoodMedia','oldInternet','foodMemories','musicNigeria','snacksStreetFood'],
    relationshipDomains: ['primarySchool','secondarySchool','childhoodGames','childhoodMedia','oldInternet','foodMemories','musicNigeria','familyHome'],
    friendSingles: [
      'What do you miss most about {a}?', 'What is your clearest memory of {a}?', 'Who do you think of first when you remember {a}?',
      'What is the funniest thing you remember about {a}?', 'What would instantly take you back to {a}?', 'What is one thing about {a} younger people might not understand?',
    ],
    relationshipSingles: [
      'What story about {a} would help me picture the younger version of you?', 'What do you think I would find funniest about you during {a}?', 'What part of {a} do you wish we could have experienced together?',
      'What memory from {a} still makes you smile?', 'What would your younger self during {a} think about your life now?', 'What is one thing from {a} you would want our future children to experience?',
    ],
    friendPairs: ['Which do you miss more: {a} or {b}?', 'Which takes you back faster: {a} or {b}?', 'Which would you bring back for one day: {a} or {b}?'],
    relationshipPairs: ['Which would you rather relive with me for one day: {a} or {b}?', 'Which tells me more about your childhood: {a} or {b}?', 'Which would you want our future children to experience more: {a} or {b}?'],
  },
  'growing-up': {
    friendDomains: ['primarySchool','secondarySchool','exams','boardingDaySchool','familyHome','choresErrands','childhoodGames','oldInternet'],
    relationshipDomains: ['primarySchool','secondarySchool','exams','boardingDaySchool','familyHome','choresErrands','childhoodGames','oldInternet'],
    friendSingles: [
      'What did {a} teach you while you were growing up?', 'What is one thing about {a} you only understood when you got older?', 'What would your parents say about you and {a}?',
      'What is one time {a} got you into trouble?', 'What did you think was unfair about {a} then but understand now?', 'What would you change about how you were raised around {a}?',
    ],
    relationshipSingles: [
      'What would you want me to understand about the younger you and {a}?', 'What did growing up around {a} teach you about trust or communication?', 'What is one good lesson from {a} you would want in our future home?',
      'What is one thing from {a} you would not want to repeat in our future home?', 'What story about {a} explains something about you now?', 'What would your teenage self say about how you handle {a} now?',
    ],
    friendPairs: ['Which shaped you more while growing up: {a} or {b}?', 'Which got you into more trouble: {a} or {b}?', 'Which taught you more responsibility: {a} or {b}?'],
    relationshipPairs: ['Which shaped how you relate to people more: {a} or {b}?', 'Which would you want our future home to handle differently: {a} or {b}?', 'Which would tell me more about the younger you: {a} or {b}?'],
  },
  food: {
    friendDomains: ['nigerianFood','snacksStreetFood','cookingEating','foodDebates','foodMemories'],
    relationshipDomains: ['nigerianFood','snacksStreetFood','cookingEating','foodDebates','foodMemories'],
    friendSingles: [
      'What is your strongest opinion about {a}?', 'What is your best memory connected to {a}?', 'What is the best version of {a} you have ever had?',
      'What is one unpopular opinion you have about {a}?', 'Who do you trust most when it comes to {a}?', 'What would make you choose {a} immediately?',
    ],
    relationshipSingles: [
      'What do you think we would disagree about most when it comes to {a}?', 'Would {a} make a good date or shared meal for us?', 'What would you want me to know about your taste when it comes to {a}?',
      'What memory around {a} would you want us to create together?', 'What food habit around {a} would you need me to accept?', 'Who do you think would care more about {a}, you or me?',
    ],
    friendPairs: ['Which are you choosing first: {a} or {b}?', 'Which would you defend harder: {a} or {b}?', 'Which brings back better memories: {a} or {b}?'],
    relationshipPairs: ['Which would you rather share with me: {a} or {b}?', 'Which would cause the bigger food argument between us: {a} or {b}?', 'Which would you pick for a relaxed date: {a} or {b}?'],
  },
  'everyday-life': {
    friendDomains: ['transportTraffic','powerInternet','moneySpending','workCareer','shoppingMarkets','housingHome','wellbeing'], friendExtra: everydayExtra,
    relationshipDomains: ['transportTraffic','powerInternet','moneySpending','workCareer','housingHome','wellbeing','relationshipMoney'], relationshipExtra: everydayExtra,
    friendSingles: [
      'How do you usually handle {a}?', 'What is your most predictable reaction to {a}?', 'What is one thing about {a} that affects your mood more than it should?',
      'What is one habit you have developed because of {a}?', 'What have you learnt the hard way about {a}?', 'What would make {a} easier for you immediately?',
    ],
    relationshipSingles: [
      'What should I know about the way you handle {a}?', 'What would make you feel considered by me when {a} comes up?', 'What everyday habit around {a} would you want us to agree on?',
      'What part of {a} would you happily let me help with?', 'What would make {a} less stressful for us?', 'What do you think living together would reveal about us when it comes to {a}?',
    ],
    friendPairs: ['Which takes more out of you: {a} or {b}?', 'Which do you handle better: {a} or {b}?', 'Which would improve your day more if it became easier: {a} or {b}?'],
    relationshipPairs: ['Which would need more teamwork from us: {a} or {b}?', 'Which would cause more everyday tension: {a} or {b}?', 'Which would you rather I help with: {a} or {b}?'],
  },
  movies: {
    friendDomains: ['nollywoodTv','filmHabits','childhoodMedia'], friendExtra: movieExtra,
    relationshipDomains: ['nollywoodTv','filmHabits','childhoodMedia'], relationshipExtra: movieExtra,
    friendSingles: [
      'What is your honest opinion about {a}?', 'What memory do you connect with {a}?', 'What is one thing people overrate about {a}?',
      'What is one thing people underrate about {a}?', 'What would make you recommend something connected to {a}?', 'What is your funniest story connected to {a}?',
    ],
    relationshipSingles: [
      'What do you think we would disagree about around {a}?', 'Would {a} make a good watch-together night for us?', 'What do you think I would learn about you through {a}?',
      'What would make {a} a proper date night rather than background noise?', 'What would annoy you if I did it around {a}?', 'What kind of conversation do you think {a} would start between us?',
    ],
    friendPairs: ['Which would you pick first: {a} or {b}?', 'Which would start the better argument afterwards: {a} or {b}?', 'Which is more your taste: {a} or {b}?'],
    relationshipPairs: ['Which would make the better movie night for us: {a} or {b}?', 'Which do you think we would agree on more: {a} or {b}?', 'Which would tell me more about your taste: {a} or {b}?'],
  },
  music: {
    friendDomains: ['musicNigeria','musicHabits'], friendExtra: musicExtra,
    relationshipDomains: ['musicNigeria','musicHabits'], relationshipExtra: musicExtra,
    friendSingles: [
      'What memory comes back fastest when you think about {a}?', 'What is your strongest opinion about {a}?', 'What does {a} say about your music taste?',
      'Who do you think about when {a} comes up?', 'What mood do you connect with {a}?', 'What would your friends say about your opinion of {a}?',
    ],
    relationshipSingles: [
      'What would you want me to understand about you through {a}?', 'What kind of memory would you want us to create around {a}?', 'What do you think we would disagree about around {a}?',
      'What would make {a} feel romantic to you?', 'What would make you send me something connected to {a} without explaining it?', 'What do you think {a} would tell me about your taste?',
    ],
    friendPairs: ['Which takes you back faster: {a} or {b}?', 'Which would you play first: {a} or {b}?', 'Which says more about your taste: {a} or {b}?'],
    relationshipPairs: ['Which would you rather share with me: {a} or {b}?', 'Which would make the better memory for us: {a} or {b}?', 'Which would you rather hear from me unexpectedly: {a} or {b}?'],
  },
  'hot-takes': {
    friendDomains: ['nigeriaSociety','moneySpending','socialMedia','friendshipDynamics','workCareer','ambitionsJapa','valuesCharacter','partiesWeddings'],
    relationshipDomains: ['nigeriaSociety','relationshipMoney','relationshipFamily','relationshipCommunication','conflictBoundaries','socialMedia','relationshipFuture','ambitionsJapa'],
    friendSingles: [
      'What is your unpopular opinion about {a}?', 'What do you think people get wrong about {a}?', 'What is one double standard you notice around {a}?',
      'What do you think people judge too quickly about {a}?', 'What do you think people excuse too easily about {a}?', 'What is one view on {a} you have changed completely?',
    ],
    relationshipSingles: [
      'What is your hottest take about {a} in relationships?', 'What do you think couples pretend does not matter about {a}?', 'What double standard do you notice around {a}?',
      'What do you think people call a red flag too quickly around {a}?', 'What do you think people excuse for too long around {a}?', 'What would you need a partner to respect about your view of {a}?',
    ],
    friendPairs: ['Which do people overthink more: {a} or {b}?', 'Which exposes more hypocrisy: {a} or {b}?', 'Which do you think society gets more wrong: {a} or {b}?'],
    relationshipPairs: ['Which creates more relationship pressure: {a} or {b}?', 'Which has the bigger double standard around it: {a} or {b}?', 'Which do couples need to discuss earlier: {a} or {b}?'],
  },
  'faith-spirituality': {
    friendDomains: ['faithGeneral','christianLife','familyHome'], friendExtra: faithExtra,
    relationshipDomains: ['faithGeneral','christianLife','relationshipFamily'], relationshipExtra: faithExtra,
    friendSingles: [
      'What do you genuinely believe about {a}?', 'How has your view of {a} changed as you have got older?', 'What is one question you still have about {a}?',
      'What has your own experience taught you about {a}?', 'What do you think people misunderstand about {a}?', 'What would growth look like for you around {a}?',
    ],
    relationshipSingles: [
      'How important is agreement about {a} to you in a relationship?', 'What would you want a partner to understand about your view of {a}?', 'How would you want us to handle it if we saw {a} differently?',
      'What would spiritual maturity look like between us around {a}?', 'What would you want our future home to practise around {a}?', 'What boundary would protect your convictions around {a}?',
    ],
    friendPairs: ['Which has shaped your faith more: {a} or {b}?', 'Which do you find harder to understand: {a} or {b}?', 'Which matters more in your spiritual life: {a} or {b}?'],
    relationshipPairs: ['Which would need more spiritual agreement between us: {a} or {b}?', 'Which would you want us to discuss before marriage: {a} or {b}?', 'Which would shape our home more: {a} or {b}?'],
  },
  'values-beliefs': {
    friendDomains: ['valuesCharacter','familyHome','friendshipDynamics','moneySpending','workCareer','faithGeneral','nigeriaSociety','ambitionsJapa'],
    relationshipDomains: ['valuesCharacter','relationshipMoney','relationshipFamily','relationshipCommunication','conflictBoundaries','faithGeneral','nigeriaSociety','relationshipFuture'],
    friendSingles: [
      'What principle guides you most when it comes to {a}?', 'What do you think the right thing to do is around {a}, even when it is inconvenient?', 'What is one line you would not cross when it comes to {a}?',
      'What did your upbringing teach you about {a}?', 'What would make you lose respect for someone around {a}?', 'What do you think people compromise too easily around {a}?',
    ],
    relationshipSingles: [
      'What value would you want us to protect most around {a}?', 'What would make you lose trust in a partner around {a}?', 'What principle around {a} would you not compromise for a relationship?',
      'What did your upbringing teach you about {a}?', 'What do you think fairness between partners looks like around {a}?', 'What do you think love should never excuse around {a}?',
    ],
    friendPairs: ['Which says more about someone’s character: {a} or {b}?', 'Which would test your values more: {a} or {b}?', 'Which matters more to you personally: {a} or {b}?'],
    relationshipPairs: ['Which would test our shared values more: {a} or {b}?', 'Which would you need stronger agreement on: {a} or {b}?', 'Which would affect trust more for you: {a} or {b}?'],
  },
}

function domainItems(domains = [], extras = []) {
  return [
    ...domains.flatMap(domain => (ngContext[domain] || []).map(text => ({ text, domain }))),
    ...extras.map(text => ({ text, domain: 'category-extra' })),
  ].filter(item => !/^(what|how|whether)\b/i.test(item.text))
}

function pairsWithinDomains(items, salt) {
  const grouped = new Map()
  items.forEach(item => {
    const list = grouped.get(item.domain) || []
    list.push(item.text)
    grouped.set(item.domain, list)
  })
  const pairs = []
  let groupIndex = 0
  for (const values of grouped.values()) {
    const shuffled = deterministicShuffle([...new Set(values)], salt + groupIndex * 11)
    for (let i = 0; i < shuffled.length; i += 1) {
      for (let step = 1; step <= Math.min(5, shuffled.length - 1); step += 1) {
        const b = shuffled[(i + step) % shuffled.length]
        if (shuffled[i] !== b) pairs.push([shuffled[i], b])
      }
    }
    groupIndex += 1
  }
  return pairs
}

function buildCandidates(categoryId, mode, spec) {
  const isRelationship = mode === 'relationship'
  const items = domainItems(isRelationship ? spec.relationshipDomains : spec.friendDomains, isRelationship ? spec.relationshipExtra : spec.friendExtra)
  const singleTemplates = isRelationship ? spec.relationshipSingles : spec.friendSingles
  const pairTemplates = isRelationship ? spec.relationshipPairs : spec.friendPairs
  const rows = []

  items.forEach((item, itemIndex) => {
    singleTemplates.forEach((template, templateIndex) => {
      rows.push({ text: template.replaceAll('{a}', item.text), domain: item.domain, source: item.text, score: itemIndex * 17 + templateIndex })
    })
  })

  pairsWithinDomains(items, categoryId.length * 23 + (isRelationship ? 9 : 3)).forEach(([a, b], pairIndex) => {
    pairTemplates.forEach((template, templateIndex) => {
      rows.push({ text: template.replaceAll('{a}', a).replaceAll('{b}', b), domain: 'pair', source: `${a}|${b}`, score: pairIndex * 13 + templateIndex })
    })
  })

  return deterministicShuffle(rows, categoryId.length * 47 + (isRelationship ? 31 : 7))
}

function faithType(categoryId, prompt) {
  if (categoryId !== 'faith-spirituality') return null
  return /\b(Jesus|Christian|Bible|Scripture|church|God|prayer)\b/i.test(prompt) ? 'Christian' : 'General Spirituality'
}

const cache = new Map()

export function buildNigeriaConversationPrompts(categoryId, mode) {
  const key = `${categoryId}:${mode}`
  if (cache.has(key)) return cache.get(key)
  const spec = categorySpecs[categoryId]
  const category = conversationCategories.find(item => item.id === categoryId)
  if (!spec || !category) return []

  const selected = takeTarget(buildCandidates(categoryId, mode, spec), TARGET_PER_MODE, categoryId.length * 59 + (mode === 'relationship' ? 13 : 5))
  const prompts = selected.map((row, index) => {
    const intensity = intensityFor(mode, index)
    return {
      id: `ng750-${categoryId}-${mode}-${index}`,
      categoryId,
      categoryName: category.name,
      mode,
      text: row.text,
      copyText: row.text,
      intensity,
      stage: mode === 'relationship' ? stageFor(index) : null,
      audience: audienceFor(intensity),
      faithType: faithType(categoryId, row.text),
      subtype: null,
      mechanic: 'conversation',
      sourceDomain: row.domain,
      tags: [category.name.toLowerCase(), mode, intensity.toLowerCase(), 'nigeria', 'nigeria-first', row.domain.toLowerCase(), ...normalise(row.source).split(' ').filter(word => word.length > 4).slice(0, 5)],
    }
  })
  cache.set(key, prompts)
  return prompts
}

export const nigeriaConversationCategoryIds = new Set(Object.keys(categorySpecs))
