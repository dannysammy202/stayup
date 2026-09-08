import { FRIEND_INTENSITIES, RELATIONSHIP_INTENSITIES, RELATIONSHIP_STAGES } from '../catalog.js'

const hash = value => {
  let h = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

const deterministicMix = (items, salt) => [...items]
  .map((item, index) => ({ item, score: hash(`${salt}|${index}|${item.text || item}`) }))
  .sort((a, b) => a.score - b.score)
  .map(entry => entry.item)

function buildFriend(categoryId, topics, frames) {
  const cards = []
  topics.forEach((topic, topicIndex) => {
    frames.forEach((frame, frameIndex) => {
      cards.push({
        text: frame(topic),
        intensity: FRIEND_INTENSITIES[(topicIndex + frameIndex) % FRIEND_INTENSITIES.length],
      })
    })
  })
  return deterministicMix(cards, `${categoryId}:friend`).slice(0, 750)
}

function buildRelationship(categoryId, stageTopics, frames) {
  const cards = []
  RELATIONSHIP_STAGES.forEach((stage, stageIndex) => {
    const topics = stageTopics[stage]
    topics.forEach((topic, topicIndex) => {
      frames.forEach((frame, frameIndex) => {
        const intensity = RELATIONSHIP_INTENSITIES[(topicIndex + frameIndex + stageIndex) % RELATIONSHIP_INTENSITIES.length]
        cards.push({
          text: frame(topic, stage),
          intensity,
          stage,
          audience: intensity === 'Spicy' ? '18+' : 'general',
        })
      })
    })
  })
  return cards
}

const nostalgiaFriendTopics = [
  'watching cartoons before school', 'Saturday morning television', 'old Nollywood films on VCD', 'renting films from a video club', '2go usernames and chat rooms', 'BlackBerry Messenger pins', 'Opera Mini and cheap browsing bundles', 'ringback tunes', 'polyphonic ringtones', 'infrared and Bluetooth file sharing',
  'buying recharge cards and scratching the silver panel', 'using cybercafés for school work', 'printing assignments at business centres', 'writing phone numbers in small notebooks', 'borrowing someone’s phone to make a quick call', 'school assembly songs', 'inter-house sports day', 'school excursions', 'class parties before holidays', 'signing shirts on graduation day',
  'old school sandals and white socks', 'brown or green school uniforms', 'morning inspection at school', 'manual school bells', 'writing with fountain pens', 'covering exercise books with brown paper', 'using mathematical sets until the compass disappeared', 'sharing textbooks with seatmates', 'buying gala and drinks after school', 'ice cream bicycles in the neighbourhood',
  'playing football in the street', 'playing ten-ten or suwe', 'building toys from bottle tops', 'racing old tyres with sticks', 'playing police and thief', 'staying outside until a parent shouted your full name', 'December trips to the village', 'sleeping in a room full of cousins', 'family road trips without Google Maps', 'Sunday rice after church',
  'Christmas clothes chosen by your parents', 'birthday parties with plastic chairs and party packs', 'old Milo and Bournvita tins in the kitchen', 'Cabin biscuits and similar school snacks', 'pure water before everyone carried bottles', 'old Nigerian adverts you still remember', 'football viewing centres before streaming', 'Super Eagles matches that stopped everything', 'music from old Nokia speakers', 'burning songs onto CDs for friends'
]

const nostalgiaFriendFrames = [
  t => `What do you remember most clearly about ${t}?`,
  t => `What is the funniest memory you have around ${t}?`,
  t => `Do you genuinely miss ${t}, or do you only miss the age you were then?`,
  t => `What part of ${t} would feel strange if it returned exactly as it was?`,
  t => `Who do you immediately associate with ${t}?`,
  t => `What story about ${t} still gets better every time you tell it?`,
  t => `What did you think was completely normal about ${t} until you got older?`,
  t => `What did younger you take far too seriously about ${t}?`,
  t => `What part of ${t} do younger people today miss out on?`,
  t => `What tiny detail about ${t} brings the whole memory back for you?`,
  t => `If you brought one part of ${t} back for a day, what would you choose?`,
  t => `What would you have to explain first about ${t} to somebody much younger?`,
  t => `What does ${t} remind you about the kind of childhood you had?`,
  t => `What did you fail to appreciate about ${t} while it was still normal?`,
  t => `If you relived one day involving ${t}, which day would you pick?`
]

const nostalgiaRelationshipTopics = {
  'Talking Stage': ['old-school crushes', 'first phones and late-night texts', 'school love notes', 'songs people used to dedicate to crushes', 'the first person you ever liked properly', 'old romantic films that shaped your expectations', 'meeting people before social media made everything searchable', 'getting someone’s number through a friend', 'waiting for someone to come online', 'early ideas of what a perfect date looked like'],
  'New Relationship': ['your first photos together', 'the first song that felt like your song', 'the first long phone call you had', 'your earliest inside jokes', 'the first time you missed each other', 'your first proper outing together', 'the first gift you exchanged', 'the first time friends noticed the relationship', 'the first awkward misunderstanding you laughed about later', 'the earliest thing about each other that felt familiar'],
  'Been Together a While': ['old chats from the beginning of the relationship', 'your earliest photos compared with now', 'the first disagreement you worked through', 'the first trip or long drive you took together', 'a phase when you talked every night', 'an old date spot you stopped visiting', 'the first family event you attended together', 'the first big decision you discussed seriously', 'a small habit from the beginning that survived', 'the first time you realised the relationship had become normal life'],
  'Long-Term Relationship': ['the version of both of you from the early years', 'old plans you once thought would happen sooner', 'the first place you talked about living together', 'early money conversations', 'old traditions you created without planning them', 'friends who knew you before the relationship became serious', 'the first major season you supported each other through', 'old arguments that now seem small', 'the first time marriage entered the conversation', 'a period of the relationship you would happily revisit'],
  'Married': ['your dating days before marriage', 'the first home you shared', 'your wedding planning season', 'the first year of marriage', 'old routines before bigger responsibilities arrived', 'the first major purchase you made together', 'early family holidays as a married couple', 'the first disagreement that taught you how to be married', 'the first tradition you created as a household', 'the version of your relationship before everyone called you husband and wife']
}

const nostalgiaRelationshipFrames = [
  t => `What do you remember most fondly about ${t}?`,
  t => `What would make you laugh if we went back and watched ourselves during ${t}?`,
  t => `What did ${t} teach you about how you love people?`,
  t => `What small detail from ${t} still feels surprisingly romantic to you?`,
  t => `What would you repeat exactly the same about ${t}?`,
  t => `What would you handle differently now if ${t} happened again?`,
  t => `What did you misunderstand about relationships during ${t}?`,
  t => `What song, place or smell do you connect with ${t}?`,
  t => `What did ${t} reveal about what makes you feel close to someone?`,
  t => `What part of ${t} would you want me to understand from your point of view?`,
  t => `What did you appreciate only after ${t} had passed?`,
  t => `What part of ${t} still influences the way you treat relationships now?`,
  t => `What would you tell your younger relationship-self about ${t}?`,
  t => `What memory from ${t} would you keep even if every photo disappeared?`,
  t => `What part of ${t} feels more meaningful now than it did at the time?`
]

const growingFriendTopics = [
  'being sent on errands without warning', 'washing plates after everyone ate', 'sweeping the compound early in the morning', 'fetching water when there was no supply', 'hearing your full name from another room', 'parents checking your report card', 'parents comparing children during family visits', 'being told to greet every adult properly', 'kneeling or bending to greet elders', 'having to explain where you were going before leaving the house',
  'primary school morning assembly', 'secondary school prefects', 'class captains who took the job too seriously', 'teachers who carried canes', 'being punished with the whole class', 'noise-maker lists', 'copying notes from the board before they were cleaned', 'borrowing rulers and never getting them back', 'school bus drama', 'sneaking food into class',
  'Saturday chores before cartoons or football', 'Sunday morning church routines', 'family devotion before school', 'school holiday lessons', 'staying with cousins during long holidays', 'sleepovers at relatives’ houses', 'playing outside until dark', 'neighbourhood friends whose houses felt like yours', 'compound aunties who knew everybody’s business', 'older siblings acting like extra parents',
  'younger siblings reporting everything', 'cousins competing during family gatherings', 'being forced to share snacks', 'hiding the good food for later', 'birthday money collected by adults', 'Christmas clothes and shoes', 'being photographed at every family event', 'learning to cook basic meals', 'first being trusted to stay home alone', 'first being allowed to go somewhere with friends',
  'JAMB and university admission pressure', 'WAEC or NECO result anxiety', 'lesson teachers after school', 'parents choosing or suggesting careers', 'being asked what you wanted to become', 'learning to manage pocket money', 'first travelling without your parents', 'first school crush', 'first serious friendship fallout', 'the moment adults started treating you less like a child'
]

const growingFriendFrames = [
  t => `What were you like when it came to ${t}?`,
  t => `What is your funniest memory involving ${t}?`,
  t => `What did ${t} teach you without anybody meaning to teach you?`,
  t => `How strict was your home or school about ${t}?`,
  t => `What did you secretly hate about ${t} when you were younger?`,
  t => `What do you appreciate about ${t} now that you did not appreciate then?`,
  t => `Who was usually involved whenever ${t} became a problem?`,
  t => `What rule around ${t} made the least sense to you?`,
  t => `What did you do to escape or make ${t} easier?`,
  t => `What story about ${t} tells people exactly what your childhood was like?`,
  t => `Would you raise a child with the same approach to ${t}?`,
  t => `What part of ${t} do you think made Nigerian childhood feel different?`,
  t => `What did your friends’ homes do differently around ${t}?`,
  t => `What is one thing adults misunderstood about how you felt about ${t}?`,
  t => `If younger you knew what you know now about ${t}, what would change?`
]

const growingRelationshipTopics = {
  'Talking Stage': ['how strict your parents were about dating', 'what you were taught about boys and girls being friends', 'the kind of marriage you saw at home', 'how affection was shown in your family', 'what your parents said about choosing a partner', 'how much privacy you had growing up', 'the role religion played in your home', 'how money was discussed around children', 'what arguments looked like between adults at home', 'what you learnt from older siblings’ relationships'],
  'New Relationship': ['introducing someone you were dating to friends', 'telling family you were seeing somebody', 'what counted as a serious relationship in your home', 'how early relationships fitted around school or work', 'the first boundaries you learnt to set', 'what younger you thought romance should feel like', 'how jealousy showed up in your early dating years', 'what you learnt from your first heartbreak', 'how much advice you took from friends about dating', 'what dating rules you inherited from home'],
  'Been Together a While': ['childhood habits that still show up in relationships', 'the way you react when someone raises their voice', 'how you handle chores because of how you grew up', 'how you approach saving and spending because of home', 'how family expectations affect your time', 'how comfortable you are asking for help', 'how quickly you apologise after conflict', 'how much alone time feels normal to you', 'how you celebrate birthdays and milestones', 'how you divide responsibility when life gets busy'],
  'Long-Term Relationship': ['which childhood traditions you would keep in your future home', 'which parenting habits from your parents you would avoid', 'how you want future children disciplined', 'how much extended family should be involved', 'what kind of home atmosphere you want to build', 'what faith practices you want in your household', 'how you want children to understand money', 'how openly you want affection shown at home', 'how you would handle school choices for children', 'how you would protect couple time from family pressure'],
  'Married': ['the parts of your upbringing that shape your marriage most', 'household roles you had to unlearn after marriage', 'family traditions you merged or dropped', 'how your childhood affects the way you handle money together', 'how you deal with relatives because of what you saw growing up', 'what you want your home to feel like for children or guests', 'how you handle discipline differently from your parents', 'which childhood routines still happen in your married home', 'what you understand about your parents now that you are married', 'which part of growing up you want your spouse to experience through your stories']
}

const growingRelationshipFrames = [
  t => `How has ${t} shaped the way you approach relationships now?`,
  t => `What is one thing you would want a partner to understand about ${t}?`,
  t => `What did you learn from ${t} that still feels useful?`,
  t => `What did you have to unlearn because of ${t}?`,
  t => `How different would you want our approach to ${t} to be?`,
  t => `What part of ${t} still affects your reactions more than you expect?`,
  t => `What conversation about ${t} would you rather have early than late?`,
  t => `Where do you think two people with different experiences of ${t} might clash?`,
  t => `What would make you feel respected when ${t} becomes relevant to us?`,
  t => `What boundary around ${t} matters to you?`,
  t => `What part of ${t} would you want to preserve in a future home?`,
  t => `What part of ${t} would you never repeat in a future home?`,
  t => `How would you explain your experience of ${t} to somebody who grew up differently?`,
  t => `What do you think your younger self would be surprised to hear about ${t} now?`,
  t => `What does ${t} reveal about the kind of home life you want?`
]

const foodFriendTopics = [
  'party jollof rice', 'home-cooked jollof rice', 'fried rice at Nigerian events', 'ofada rice and sauce', 'beans and dodo', 'yam and egg sauce', 'yam porridge', 'rice and stew', 'spaghetti cooked Nigerian style', 'indomie with extra ingredients',
  'suya late at night', 'shawarma after an outing', 'small chops at events', 'meat pie from a good bakery', 'puff-puff when it is still hot', 'akara in the morning', 'moi moi with rice', 'pepper soup on a cool evening', 'roasted corn and pear', 'bole and fish',
  'pounded yam and soup', 'eba and egusi', 'amala with ewedu and gbegiri', 'semo versus other swallows', 'ogbono soup', 'okra soup', 'afang soup', 'banga soup', 'edikaikong', 'white soup',
  'eating rice with plantain', 'putting egg inside noodles', 'mixing different soups', 'drinking garri with groundnut', 'adding milk to garri', 'eating leftover rice the next morning', 'ordering food when there is food at home', 'saving the best meat for last', 'taking food from somebody else’s plate', 'refusing to share food after buying your own',
  'choosing restaurants for portion size', 'street food versus restaurant versions', 'food at weddings', 'food at funerals and family events', 'airport food prices', 'office lunch routines', 'Sunday lunch after church', 'late-night food delivery', 'trying food from another Nigerian region', 'the meal you request when you return home after travelling'
]

const foodFriendFrames = [
  t => `What is your strongest opinion about ${t}?`,
  t => `What makes ${t} good enough for you to rate it properly?`,
  t => `What is the worst version of ${t} you have ever been served?`,
  t => `Who makes or sells ${t} in the way you like it most?`,
  t => `What would make you reject ${t} even if you were hungry?`,
  t => `What is the most Nigerian argument you have heard about ${t}?`,
  t => `What do people add to ${t} that you think ruins it?`,
  t => `What do people leave out of ${t} that you think it needs?`,
  t => `What memory do you connect most with ${t}?`,
  t => `How often would you happily eat ${t} before getting tired of it?`,
  t => `Would you trust a fancy restaurant or a small local spot more for ${t}?`,
  t => `What drink belongs beside ${t} for you?`,
  t => `What other food would you never put on the same plate as ${t}?`,
  t => `If you had to introduce a visitor to ${t}, where would you take them?`,
  t => `What is one food habit you have around ${t} that people judge?`
]

const foodRelationshipTopics = {
  'Talking Stage': ['your go-to first-date meal', 'foods you refuse to eat in front of someone new', 'how adventurous you are with new restaurants', 'sharing food from the same plate', 'ordering for the table', 'splitting a restaurant bill', 'what counts as an expensive date meal', 'food allergies or restrictions', 'whether bad table manners matter to you', 'the food choice that would impress you on a casual date'],
  'New Relationship': ['remembering each other’s usual orders', 'bringing food after a stressful day', 'cooking for each other for the first time', 'arguing over where to eat', 'sharing the last piece of food', 'ordering food for each other without asking', 'meeting each other’s favourite local food spot', 'trying a dish because your partner loves it', 'food gifts instead of conventional gifts', 'late-night food runs together'],
  'Been Together a While': ['deciding what to eat every evening', 'one person always choosing restaurants', 'food budgets during expensive months', 'meal prep when both people are busy', 'different spice tolerance', 'one person eating much later than the other', 'keeping snacks hidden from each other', 'visiting family and eating what is served', 'hosting friends with food', 'learning each other’s comfort meals'],
  'Long-Term Relationship': ['how food costs fit into a shared budget', 'who cooks when work gets demanding', 'which family recipes you want to keep', 'how often you want to eat out', 'how health goals change what you both eat', 'feeding children versus feeding adults', 'hosting relatives during holidays', 'different cultural food traditions', 'keeping a stocked kitchen', 'deciding whether domestic help handles cooking'],
  'Married': ['the meal that feels most like home together', 'who notices groceries are finished first', 'how you handle a partner who dislikes your favourite food', 'Sunday meals in your household', 'holiday cooking responsibilities', 'how often takeaway enters the monthly budget', 'feeding unexpected visitors', 'food traditions from both families', 'what you cook when nobody has energy', 'the dish your spouse makes better than you expected']
}

const foodRelationshipFrames = [
  t => `What is your real opinion about ${t} in a relationship?`,
  t => `What would make ${t} feel thoughtful rather than ordinary to you?`,
  t => `Where do you think couples disagree most about ${t}?`,
  t => `What would you want us to know about each other before ${t} becomes an issue?`,
  t => `What is the funniest version of ${t} you can picture happening between us?`,
  t => `How much does ${t} matter to your idea of being cared for?`,
  t => `What would make you feel taken for granted around ${t}?`,
  t => `What compromise around ${t} would feel fair to you?`,
  t => `What habit around ${t} would quietly annoy you over time?`,
  t => `What part of ${t} would you enjoy turning into our own routine?`,
  t => `What did a past experience teach you about ${t}?`,
  t => `How would money affect the way you think about ${t}?`,
  t => `What would make ${t} feel romantic to you?`,
  t => `What would make ${t} feel unnecessarily stressful?`,
  t => `If we disagreed about ${t}, how would you want us to settle it?`
]

const everydayFriendTopics = [
  'waking up to an alarm', 'checking your phone before getting out of bed', 'deciding what to wear for work', 'morning traffic', 'buying breakfast on the way out', 'making your bed', 'replying to messages from the previous night', 'planning your day', 'working from home', 'commuting by bus or ride-hailing',
  'office lunch breaks', 'meetings that should have been messages', 'charging your phone during the day', 'keeping a power bank nearby', 'dealing with poor network', 'sending money through banking apps', 'checking account balances', 'buying data', 'tracking expenses', 'running small errands after work',
  'doing laundry', 'washing plates immediately or later', 'keeping your room tidy', 'changing bedsheets', 'grocery shopping', 'deciding what to cook', 'ordering food', 'taking an afternoon nap', 'watching something while eating', 'listening to music while getting ready',
  'replying to family group chats', 'checking social media during breaks', 'saving posts you never revisit', 'taking screenshots instead of bookmarking', 'keeping too many browser tabs open', 'clearing phone storage', 'ignoring unknown numbers', 'returning missed calls', 'sending voice notes', 'leaving people on read by mistake',
  'weekend plans', 'Sunday evening anxiety', 'going to the barber or salon', 'getting fuel', 'washing your car', 'shopping for toiletries', 'keeping cash for emergencies', 'planning around power cuts', 'trying to sleep earlier', 'finding time to do nothing'
]

const everydayFriendFrames = [
  t => `What is your normal approach to ${t}?`,
  t => `What is the most annoying part of ${t} for you?`,
  t => `What tiny habit makes ${t} easier for you?`,
  t => `What do you do differently from most people when it comes to ${t}?`,
  t => `What is the funniest thing that has happened to you while ${t}?`,
  t => `How much money do you think ${t} quietly costs you?`,
  t => `What would make ${t} disappear from your life if you had the choice?`,
  t => `What part of ${t} are you better at now than five years ago?`,
  t => `What is one bad habit you have around ${t}?`,
  t => `Who do you know that takes ${t} far more seriously than you do?`,
  t => `What is one rule you have for yourself around ${t}?`,
  t => `What mood are you usually in when ${t} comes up?`,
  t => `What would your ideal version of ${t} look like?`,
  t => `What is one thing people overcomplicate about ${t}?`,
  t => `What does ${t} reveal about how organised you are?`
]

const everydayRelationshipTopics = {
  'Talking Stage': ['how often you like texting during the day', 'whether you prefer calls or messages', 'how you behave when work gets busy', 'how quickly you normally reply', 'whether you enjoy good-morning texts', 'how much detail you share about your day', 'how often you make spontaneous plans', 'what your weekends usually look like', 'how much alone time you need', 'whether you like phone calls before bed'],
  'New Relationship': ['finding time for dates during busy weeks', 'checking in after work', 'deciding who travels farther to meet', 'sharing small updates during the day', 'sleep schedules that do not match', 'balancing friends with couple time', 'what counts as enough communication', 'last-minute date changes', 'spending quiet time without talking constantly', 'how often you want to see each other'],
  'Been Together a While': ['dividing errands when both people are tired', 'deciding what to eat every day', 'keeping shared spaces tidy', 'one person being more punctual', 'how you spend ordinary Sunday afternoons', 'phones during quality time', 'work stress entering home life', 'routine becoming boring', 'seeing friends separately', 'planning small expenses together'],
  'Long-Term Relationship': ['shared calendars', 'household routines', 'monthly budgets', 'saving for large expenses', 'splitting chores', 'handling relatives dropping by', 'planning annual leave together', 'who deals with repairs and service providers', 'protecting date nights from routine', 'making time for individual hobbies'],
  'Married': ['morning routines in the same home', 'who locks doors and checks things at night', 'who notices household supplies first', 'how you share domestic tasks', 'how you handle different sleep habits', 'how you decompress after work', 'how much quiet time you need at home', 'how you manage weekends with family commitments', 'how you decide when to spend or save', 'how you keep romance inside ordinary routines']
}

const everydayRelationshipFrames = [
  t => `What would your ideal approach to ${t} look like for us?`,
  t => `What small misunderstanding tends to happen around ${t}?`,
  t => `What would make you feel considered when it comes to ${t}?`,
  t => `What would make you feel crowded or ignored around ${t}?`,
  t => `How much flexibility do you need around ${t}?`,
  t => `What habit around ${t} would make daily life easier with you?`,
  t => `What habit around ${t} would get on your nerves quickly?`,
  t => `What is something couples assume about ${t} instead of discussing?`,
  t => `What would a fair compromise around ${t} look like?`,
  t => `What part of ${t} feels more important than people admit?`,
  t => `What did you learn from past relationships or family about ${t}?`,
  t => `What would make ${t} feel natural rather than forced?`,
  t => `How would you want us to handle ${t} during a stressful week?`,
  t => `What would you want me never to take personally about ${t}?`,
  t => `What would make you feel like we work well as a team around ${t}?`
]

const movieFriendTopics = [
  'Nollywood films from the 2000s', 'old village-themed Nollywood stories', 'modern glossy Nollywood films', 'cinema comedies', 'romantic comedies', 'crime films', 'action films', 'horror films', 'thrillers', 'documentaries',
  'Marvel films', 'DC films', 'anime films', 'Korean dramas', 'American sitcoms', 'British crime series', 'reality television', 'competition shows', 'football documentaries', 'true-crime series',
  'watching films at the cinema', 'watching films at home', 'binge-watching a series', 'waiting weekly for new episodes', 'rewatching comfort shows', 'spoilers on social media', 'watching trailers before a film', 'reading reviews first', 'checking ratings before watching', 'stopping a bad film halfway',
  'watching with subtitles', 'watching dubbed versions', 'people talking during films', 'people checking phones in the cinema', 'buying cinema snacks', 'choosing the best seat', 'watching alone', 'watching with friends', 'watching with family', 'falling asleep during films',
  'villains you understand', 'characters everybody loves but you dislike', 'characters you defend too much', 'bad endings', 'perfect endings', 'plot twists', 'films based on true stories', 'books turned into films', 'actors who always play similar roles', 'shows that stayed too long'
]

const movieFriendFrames = [
  t => `What is your strongest opinion about ${t}?`,
  t => `What is the best example of ${t} you have seen?`,
  t => `What is the worst example of ${t} you remember?`,
  t => `What makes ${t} work for you when it is done well?`,
  t => `What usually makes you lose interest in ${t}?`,
  t => `Who do you know whose taste in ${t} you trust?`,
  t => `What is one unpopular opinion you have about ${t}?`,
  t => `What memory do you connect with ${t}?`,
  t => `How has your taste in ${t} changed as you got older?`,
  t => `What would you recommend first to somebody curious about ${t}?`,
  t => `What do people praise too easily about ${t}?`,
  t => `What do people dismiss too quickly about ${t}?`,
  t => `What is the longest conversation you have had because of ${t}?`,
  t => `What would make you give ${t} another chance after avoiding it?`,
  t => `If you had to live with only one example of ${t}, what would you keep?`
]

const movieRelationshipTopics = {
  'Talking Stage': ['films you use to judge someone’s taste', 'sharing favourite films early', 'watching something together on a call', 'spoilers when one person is behind', 'romantic films you secretly enjoy', 'shows you would never admit liking first', 'cinema dates', 'choosing a film for a first hangout', 'characters you have had crushes on', 'the film opinion that usually starts an argument'],
  'New Relationship': ['your first cinema date together', 'sharing streaming recommendations', 'falling asleep while watching together', 'one person choosing every film', 'watching a partner’s favourite series', 'finding a show you both love', 'talking during films at home', 'sharing one streaming account', 'rewatching a film because your partner has not seen it', 'using film nights as cheap dates'],
  'Been Together a While': ['having different film tastes', 'one person watching ahead without the other', 'choosing comfort shows after stressful days', 'films that remind you of earlier dates', 'cinema spending versus staying in', 'watching with friends versus alone together', 'shows you abandoned halfway as a couple', 'inside jokes from films', 'actors one person likes too much', 'disagreeing over what counts as a good ending'],
  'Long-Term Relationship': ['film-night traditions', 'showing future children films you grew up with', 'which subscriptions are worth keeping', 'making time for cinema dates', 'different tolerance for violent or scary films', 'films you would never watch with family', 'documentaries that start serious conversations', 'sharing a watchlist for years', 'comfort films during difficult seasons', 'how entertainment fits into a busy home'],
  'Married': ['films that remind you of dating days', 'the show you both return to', 'who controls the remote most often', 'falling asleep during movie night', 'cinema dates after marriage', 'films you save to watch together', 'one spouse watching ahead', 'family movie nights', 'what you watch after guests leave', 'the film opinion your spouse will never let you forget']
}

const movieRelationshipFrames = [
  t => `What would your honest take on ${t} be with someone you are dating?`,
  t => `What could ${t} reveal about whether two people click?`,
  t => `What is the funniest disagreement a couple could have over ${t}?`,
  t => `What would make ${t} feel like quality time to you?`,
  t => `What would ruin ${t} for you?`,
  t => `What rule would you secretly want around ${t}?`,
  t => `What part of ${t} would you enjoy sharing with a partner?`,
  t => `What part of ${t} would you rather keep as your own thing?`,
  t => `What past memory makes ${t} more personal to you?`,
  t => `How much does matching taste around ${t} matter to you?`,
  t => `What would you happily compromise on around ${t}?`,
  t => `What would you refuse to pretend to enjoy about ${t}?`,
  t => `What could ${t} turn into a deeper conversation about?`,
  t => `What would make ${t} a good low-pressure date or evening?`,
  t => `What is one thing you would want us to watch or experience together around ${t}?`
]

const musicFriendTopics = [
  'Afrobeats from the 2000s', 'early Wizkid songs', 'early Davido songs', 'old P-Square records', '2Baba classics', 'D’banj-era party music', 'Mo’Hits records', 'old gospel songs from home', 'school assembly songs', 'church praise songs you grew up with',
  'current Afrobeats', 'Amapiano', 'Nigerian rap', 'UK rap', 'American hip-hop', 'R&B', 'gospel rap', 'highlife', 'Afro-fusion', 'alternative Nigerian music',
  'songs you play while driving', 'music for night walks', 'songs for cleaning', 'music for working', 'music for the gym', 'songs for heartbreak', 'songs for confidence', 'songs for prayer', 'songs for parties', 'songs for quiet mornings',
  'concerts in Lagos', 'small live shows', 'listening parties', 'music festivals', 'artists performing with live bands', 'artists lip-syncing on stage', 'opening acts', 'standing versus seated concerts', 'concert ticket prices', 'leaving before the final song',
  'sharing playlists', 'judging somebody by their top artists', 'lyrics you misheard for years', 'songs you skip after the first note', 'artists you defend too hard', 'albums you prefer to singles', 'songs ruined by overplaying', 'remixes better than originals', 'features that saved a song', 'songs tied to one specific memory'
]

const musicFriendFrames = [
  t => `What is your strongest opinion about ${t}?`,
  t => `What is the first song or artist you think of with ${t}?`,
  t => `What memory do you connect most with ${t}?`,
  t => `What do you think people misunderstand about ${t}?`,
  t => `What is your most unpopular take on ${t}?`,
  t => `Who introduced you to ${t}, if anybody?`,
  t => `How has your taste in ${t} changed over time?`,
  t => `What would make you stop listening to ${t} for a while?`,
  t => `What would you play first to convince somebody to try ${t}?`,
  t => `What does your taste in ${t} say about your personality?`,
  t => `What is the best conversation you have had because of ${t}?`,
  t => `What part of ${t} matters more to you, lyrics, production, voice or mood?`,
  t => `What is one thing you refuse to pretend to like about ${t}?`,
  t => `What would you bring back from an older era of ${t}?`,
  t => `If you had one hour of only ${t}, what would have to be on the playlist?`
]

const musicRelationshipTopics = {
  'Talking Stage': ['sharing playlists with someone you like', 'sending a song instead of explaining a feeling', 'judging a crush by their music taste', 'having completely different favourite artists', 'flirty songs', 'songs connected to an ex', 'going to a concert as an early date', 'posting lyrics that seem directed at somebody', 'asking someone what they are listening to', 'the first song you would send after a good date'],
  'New Relationship': ['making a shared playlist', 'choosing your song as a couple', 'sending songs during the day', 'concert dates', 'singing badly together in the car', 'one person controlling the aux cable', 'learning each other’s favourite albums', 'songs that remind you of the first month together', 'dancing together at home', 'discovering an artist through your partner'],
  'Been Together a While': ['songs tied to old arguments or good memories', 'sharing headphones', 'different concert budgets', 'music during road trips', 'one person replaying the same songs constantly', 'playlists for housework', 'songs that became inside jokes', 'artists both of you defend', 'artists one person cannot stand', 'old relationship playlists you never deleted'],
  'Long-Term Relationship': ['music you would want at your wedding', 'songs you want in your future home', 'music you would play around children', 'concerts worth travelling for together', 'songs linked to major milestones', 'keeping separate music tastes', 'a playlist for long drives', 'music during difficult seasons', 'artists you have watched evolve together', 'songs that still make the relationship feel young'],
  'Married': ['your wedding songs', 'songs that remind you of dating', 'music you play around the house', 'who controls music on road trips', 'songs attached to family memories', 'music for celebrations at home', 'concerts after marriage', 'sharing music with children', 'old playlists from before marriage', 'the song your spouse knows will always get a reaction']
}

const musicRelationshipFrames = [
  t => `What does ${t} mean to you when you are with someone?`,
  t => `What would make ${t} feel romantic rather than cheesy?`,
  t => `What could ${t} tell you about a person before they say much?`,
  t => `What is one boundary or awkward situation around ${t} you would rather discuss?`,
  t => `What is the best memory you would want to create around ${t}?`,
  t => `What past experience affects how you feel about ${t}?`,
  t => `How much does matching taste around ${t} matter to you?`,
  t => `What would you happily learn to enjoy because your partner loves ${t}?`,
  t => `What would you never fake enthusiasm for around ${t}?`,
  t => `What could ${t} become part of in our routine?`,
  t => `What would make ${t} more personal than a normal date or gesture?`,
  t => `What is the funniest disagreement you can picture around ${t}?`,
  t => `What would you want a partner to notice about your taste around ${t}?`,
  t => `What would make ${t} feel like “our thing” rather than your thing or mine?`,
  t => `What memory would you want us to have one day when we think back on ${t}?`
]

const hotTakeTopics = [
  'friends do not need to talk every day to remain close', 'borrowing money from friends damages more friendships than people admit', 'a friend who never initiates plans is showing you something important', 'adult friendships need scheduling to survive', 'people expect too much access to close friends', 'being friends for many years is not a reason to stay close', 'friends should tell each other when a relationship looks unhealthy', 'mixing business and friendship is usually a bad idea', 'friends should discuss money before group trips', 'outgrowing a friendship does not always need a dramatic ending',
  'dating should become intentional earlier than people think', 'talking stages last too long because people avoid making decisions', 'your partner does not need your phone password to prove trust', 'being friends with an ex is not automatically a red flag', 'chemistry without compatibility wastes time', 'a person’s family matters more in Nigerian dating than people admit', 'long distance exposes weak communication faster', 'people confuse privacy with secrecy in relationships', 'social media makes ordinary relationships look inadequate', 'couples should talk about money before saying they are serious',
  'marriage pressure makes people choose badly', 'a big wedding is rarely worth financial stress', 'couples should decide family boundaries before marriage', 'love is not enough when financial habits clash badly', 'people should discuss children before engagement', 'traditional gender roles work only when both people genuinely want them', 'marriage does not fix poor communication', 'relocation plans belong in serious relationship conversations early', 'parents should advise adults without controlling their marriages', 'weddings in Nigeria have become too performative',
  'earning more money changes how people treat you', 'every adult needs an emergency fund before luxury spending', 'side hustles are sometimes a response to bad salaries rather than ambition', 'people judge spending without knowing family responsibilities', 'rent pressure shapes too many career choices', 'salary secrecy helps employers more than workers', 'financial compatibility matters in friendships too', 'lending money you cannot afford to lose is asking for trouble', 'people spend too much trying to look successful', 'moving abroad is not automatically an upgrade',
  'career ambition has a real cost people understate', 'working from home is not better for everybody', 'university degrees matter less in some industries than parents think', 'NYSC should be redesigned for modern Nigeria', 'people stay too long in bad jobs because change feels risky', 'family responsibility delays many adults’ personal goals', 'religious communities sometimes avoid difficult mental-health conversations', 'church friendships can be as complicated as any other friendships', 'having children should be a choice rather than a social deadline', 'being private online is becoming a luxury'
]

const hotTakeFriendFrames = [
  t => `Agree or disagree with this take: ${t}.`,
  t => `How strong is your agreement with this: ${t}?`,
  t => `What is the best argument for the idea that ${t}?`,
  t => `What is the strongest argument against the idea that ${t}?`,
  t => `What personal experience makes you agree or disagree that ${t}?`,
  t => `Where do you think people in Nigeria divide most over this: ${t}?`,
  t => `What exception would make you rethink the idea that ${t}?`,
  t => `Who do you think benefits most when people believe that ${t}?`,
  t => `What part of this statement feels true but incomplete: ${t}?`,
  t => `How would your parents’ generation react to the idea that ${t}?`,
  t => `How would your closest friends react if you said ${t}?`,
  t => `What would change in people’s lives if more people believed that ${t}?`,
  t => `What do social media conversations usually get wrong about this: ${t}?`,
  t => `What would make this take unfair in a real situation: ${t}?`,
  t => `If you had to defend the opposite side of “${t}”, what would you say?`
]

const hotRelationshipTopics = {
  'Talking Stage': ['people should ask about serious intentions early', 'daily texting creates false closeness quickly', 'dating multiple people is fine until exclusivity is discussed', 'asking about exes early creates unnecessary comparisons', 'paying for every date should not automatically fall on one person', 'a slow reply is not automatically a sign of low interest', 'friends should not make final decisions about who you date', 'chemistry can hide incompatibility during the first few months', 'religion should be discussed before feelings become deep', 'family expectations should come up before a relationship becomes official'],
  'New Relationship': ['couples should define privacy before discussing passwords', 'small jealousy should be discussed instead of joked away', 'seeing each other too often early can hide incompatibility', 'people should say how they handle money before spending heavily on dates', 'your partner should not have to become best friends with all your friends', 'posting a new relationship online should be a joint decision', 'quality time matters more than constant messaging', 'conflict style matters more than having the same hobbies', 'one bad argument can reveal useful information early', 'meeting family too early puts unnecessary pressure on a new relationship'],
  'Been Together a While': ['couples should have separate friendships', 'money conversations should become more detailed as commitment grows', 'sharing passwords does not create trust', 'family members should not hear every relationship problem', 'couples need intentional dates even when they see each other often', 'a partner should be able to travel without the other person', 'moving in together should never happen only to save rent', 'people should say when attraction feels neglected', 'one person earning more should not control every financial decision', 'forgiveness without changed behaviour is pointless'],
  'Long-Term Relationship': ['engagement should not be used to postpone unresolved problems', 'families should know the couple’s boundaries before wedding planning', 'financial compatibility matters as much as romantic compatibility', 'couples should discuss where parents may live in old age', 'children should never be assumed just because marriage is planned', 'relocation decisions should treat both careers seriously', 'a small wedding can be a wiser choice than satisfying relatives', 'premarital counselling should include money and family systems', 'people should discuss debt before engagement', 'love should not require one person to abandon every personal ambition'],
  'Married': ['married couples still need private individual time', 'in-laws should not have automatic access to every marital decision', 'joint finances do not require every account to be joint', 'date nights matter more after marriage than before', 'housework should be divided by capacity rather than gender', 'a spouse should defend the marriage boundary even against parents', 'couples should revisit money agreements when income changes', 'having children should not erase the couple relationship', 'apologies matter less than repeated behavioural change', 'a good marriage should leave room for separate interests and friendships']
}

const hotRelationshipFrames = [
  t => `Do you agree with this relationship take: ${t}?`,
  t => `What experience would make you agree with the idea that ${t}?`,
  t => `What is the strongest case against the idea that ${t}?`,
  t => `Where would you draw the line around this: ${t}?`,
  t => `What would make this statement fair in one relationship and unfair in another: ${t}?`,
  t => `How much do Nigerian family or social expectations affect this take: ${t}?`,
  t => `What would you want us to agree on if this became relevant: ${t}?`,
  t => `What past example have you seen that supports or challenges this: ${t}?`,
  t => `What part of this take do people oversimplify: ${t}?`,
  t => `What would you tell a friend who strongly believed that ${t}?`,
  t => `Would your answer change if money was tight around this idea: ${t}?`,
  t => `Would your answer change if family pressure was involved in this idea: ${t}?`,
  t => `What does this take reveal about what you value in relationships: ${t}?`,
  t => `What boundary would help two people handle this issue well: ${t}?`,
  t => `If we disagreed about whether ${t}, what would you want the conversation to look like?`
]

const faithFriendTopics = [
  'how you first learnt to pray', 'family devotion while growing up', 'Sunday school memories', 'the church you grew up attending', 'youth church programmes', 'overnight services', 'fasting as a teenager', 'memorising Bible verses', 'church music from childhood', 'religious rules you did not understand as a child',
  'praying before important exams', 'asking God for guidance about work', 'praying when money is tight', 'faith during illness in the family', 'faith when plans fail', 'faith when prayers seem unanswered', 'gratitude after good news', 'doubt during difficult seasons', 'hearing a sermon that stayed with you', 'a Bible passage you return to often',
  'choosing a church as an adult', 'serving in church', 'giving and generosity', 'tithing', 'accountability with other believers', 'friendships formed in church', 'church leadership', 'church culture around appearance', 'church expectations around dating', 'how churches talk about money',
  'faith and career ambition', 'faith and relocation', 'faith and mental health', 'faith and social media', 'faith and politics', 'faith and forgiveness', 'faith and personal discipline', 'faith and success', 'faith and disappointment', 'faith and family pressure',
  'different Christian denominations', 'having friends from other religions', 'asking difficult questions about belief', 'reading the Bible consistently', 'worship outside church', 'praying in public versus private', 'sharing faith without forcing it', 'how your beliefs changed as you got older', 'what spiritual maturity looks like', 'what keeps faith personal rather than performative'
]

const faithFriendFrames = [
  t => `What has your experience of ${t} been like?`,
  t => `What did you believe about ${t} when you were younger that changed later?`,
  t => `What question do you still have about ${t}?`,
  t => `What has ${t} taught you about God or yourself?`,
  t => `What part of ${t} feels easiest for you?`,
  t => `What part of ${t} feels hardest to live out honestly?`,
  t => `What is one church or family assumption about ${t} you do not fully agree with?`,
  t => `Who has influenced the way you think about ${t} most?`,
  t => `What personal experience made ${t} more real to you?`,
  t => `How do you separate genuine conviction from pressure when it comes to ${t}?`,
  t => `What would you want younger believers to understand about ${t}?`,
  t => `What do people sometimes make too complicated about ${t}?`,
  t => `What do people sometimes make too simple about ${t}?`,
  t => `How has adulthood changed the way you approach ${t}?`,
  t => `What would healthy growth around ${t} look like for you now?`
]

const faithRelationshipTopics = {
  'Talking Stage': ['whether faith is central or secondary in dating', 'what church involvement means to you', 'praying with someone you are dating', 'dating across denominations', 'dating somebody with a different level of spiritual discipline', 'how early to discuss sexual boundaries shaped by faith', 'whether family religion influences who you date', 'what spiritual leadership means to you', 'how you recognise shared values beyond church attendance', 'what you believe marriage is for'],
  'New Relationship': ['attending church together', 'praying for each other', 'discussing doubts honestly', 'different devotional habits', 'giving and tithing', 'church friends influencing the relationship', 'pastors giving relationship advice', 'faith-based physical boundaries', 'how to handle different convictions', 'how openly to discuss the relationship at church'],
  'Been Together a While': ['choosing where to worship', 'serving in church while protecting couple time', 'handling different prayer habits', 'faith during relationship conflict', 'forgiving without avoiding accountability', 'money decisions influenced by faith', 'supporting each other through spiritual dry seasons', 'how much counsel to seek from church leaders', 'religious family expectations', 'keeping faith personal instead of performative as a couple'],
  'Long-Term Relationship': ['premarital counselling', 'which church to attend after marriage', 'faith practices in a future home', 'how children would be taught faith', 'giving as a household', 'serving in church after marriage', 'how to handle doctrinal differences', 'how involved pastors should be in private marital issues', 'family traditions with religious meaning', 'how faith affects career and relocation decisions'],
  'Married': ['praying together during hard seasons', 'worshipping together when one person feels spiritually tired', 'choosing a church as a household', 'giving decisions', 'teaching children about faith', 'handling disagreements over doctrine', 'protecting private marital matters from church gossip', 'serving without neglecting home', 'forgiveness after serious conflict', 'keeping spiritual intimacy alive through ordinary routines']
}

const faithRelationshipFrames = [
  t => `What would you want us to understand about ${t}?`,
  t => `What does a healthy approach to ${t} look like to you in a relationship?`,
  t => `Where do you think couples get ${t} wrong?`,
  t => `What past experience shapes how you feel about ${t}?`,
  t => `What boundary would protect both faith and honesty around ${t}?`,
  t => `What would make you feel spiritually supported around ${t}?`,
  t => `What would make you feel judged or controlled around ${t}?`,
  t => `How much agreement do two people need around ${t}?`,
  t => `What would you do if we had different convictions about ${t}?`,
  t => `How should family or church leaders influence decisions about ${t}?`,
  t => `What would you never want us to fake around ${t}?`,
  t => `What would growth together around ${t} look like?`,
  t => `What would you rather discuss now than discover later about ${t}?`,
  t => `How would ${t} affect the kind of future you want to build?`,
  t => `What would keep ${t} sincere rather than becoming a relationship performance?`
]

const valuesFriendTopics = [
  'loyalty when a friend is clearly wrong', 'telling the truth when it will embarrass somebody', 'keeping a confidence after a friendship ends', 'forgiving somebody who never apologised', 'giving second chances', 'ending friendships that become disrespectful', 'calling friends out privately', 'defending friends in public', 'choosing peace over being right', 'admitting when envy affects you',
  'lending money to people close to you', 'giving money to family', 'saving before spending', 'helping people without announcing it', 'sharing salary information', 'splitting bills fairly', 'supporting relatives financially', 'spending on experiences versus possessions', 'giving to church or charity', 'saying no when people expect financial help',
  'ambition versus contentment', 'working hard at the cost of rest', 'choosing a lower-paying peaceful job', 'moving abroad for opportunity', 'staying close to family', 'starting over in a new career', 'taking risks with money', 'owning a business', 'retiring early', 'measuring success by income',
  'respecting elders who are disrespectful', 'family loyalty versus personal boundaries', 'keeping family problems private', 'parents influencing adult decisions', 'supporting siblings', 'caring for ageing parents', 'choosing a partner your family dislikes', 'attending every family event', 'protecting children from family conflict', 'saying no to traditions you disagree with',
  'privacy on social media', 'posting achievements online', 'sharing relationship problems publicly', 'judging people by their online presence', 'separating work from personal identity', 'being politically outspoken', 'changing your mind publicly', 'apologising without explaining yourself', 'standing alone on an unpopular principle', 'choosing kindness when nobody will know'
]

const valuesFriendFrames = [
  t => `Where do you personally draw the line around ${t}?`,
  t => `What experience shaped your view of ${t}?`,
  t => `What principle matters most to you when ${t} becomes difficult?`,
  t => `What would make you change your mind about ${t}?`,
  t => `What do people often confuse with being principled when it comes to ${t}?`,
  t => `What would your closest friends say your behaviour around ${t} reveals about you?`,
  t => `What did your family teach you about ${t}?`,
  t => `What part of ${t} became clearer as you got older?`,
  t => `What is the hardest part of living consistently with your view on ${t}?`,
  t => `When have you failed to live up to your own standard around ${t}?`,
  t => `What would you want a younger person to understand about ${t}?`,
  t => `What does a fair version of ${t} look like to you?`,
  t => `What would make ${t} become a deal-breaker in a friendship?`,
  t => `How much should context change your principle around ${t}?`,
  t => `If doing the right thing around ${t} cost you something important, what would matter most?`
]

const valuesRelationshipTopics = {
  'Talking Stage': ['honesty about intentions', 'dating more than one person before exclusivity', 'privacy about past relationships', 'how quickly to become exclusive', 'financial expectations on dates', 'faith compatibility', 'family approval', 'friendships with exes', 'opposite-sex friendships', 'how much social media should show'],
  'New Relationship': ['what loyalty looks like before marriage', 'how much reassurance is healthy', 'phone privacy', 'telling friends relationship details', 'how conflict should be handled', 'how apologies should work', 'whether one person should always pay', 'how much time couples owe each other', 'how to speak about exes', 'what counts as disrespect in public'],
  'Been Together a While': ['financial transparency', 'supporting family members', 'career sacrifices', 'relocation decisions', 'boundaries with friends', 'boundaries with family', 'what forgiveness requires', 'how much independence partners need', 'whether every problem should be discussed immediately', 'what commitment means before engagement'],
  'Long-Term Relationship': ['marriage expectations', 'children', 'joint versus separate finances', 'supporting ageing parents', 'gender roles at home', 'career priorities after marriage', 'where to live', 'faith practices in the home', 'wedding spending', 'how much extended family should know'],
  'Married': ['keeping promises after routines settle in', 'financial honesty', 'shared responsibility at home', 'protecting the marriage from family interference', 'staying respectful during conflict', 'individual privacy inside marriage', 'supporting each other’s ambitions', 'making decisions when one person earns more', 'forgiving repeated mistakes', 'choosing the marriage during stressful seasons']
}

const valuesRelationshipFrames = [
  t => `What does your personal standard around ${t} look like?`,
  t => `What would make ${t} a deal-breaker for you?`,
  t => `What would make you flexible about ${t}?`,
  t => `What past experience shaped how you think about ${t}?`,
  t => `What would feeling respected around ${t} look like to you?`,
  t => `What would feel unfair or controlling around ${t}?`,
  t => `How much agreement do two people need around ${t}?`,
  t => `What should happen when two people have different values around ${t}?`,
  t => `What would you want us to decide before ${t} becomes urgent?`,
  t => `What do couples sometimes avoid saying honestly about ${t}?`,
  t => `What family or cultural expectation affects how you view ${t}?`,
  t => `What principle would you refuse to compromise around ${t}?`,
  t => `What would make you trust somebody more around ${t}?`,
  t => `What behaviour would make you question somebody’s values around ${t}?`,
  t => `What would a mature compromise around ${t} look like without either person resenting it?`
]

const specs = {
  nostalgia: [nostalgiaFriendTopics, nostalgiaFriendFrames, nostalgiaRelationshipTopics, nostalgiaRelationshipFrames],
  'growing-up': [growingFriendTopics, growingFriendFrames, growingRelationshipTopics, growingRelationshipFrames],
  food: [foodFriendTopics, foodFriendFrames, foodRelationshipTopics, foodRelationshipFrames],
  'everyday-life': [everydayFriendTopics, everydayFriendFrames, everydayRelationshipTopics, everydayRelationshipFrames],
  movies: [movieFriendTopics, movieFriendFrames, movieRelationshipTopics, movieRelationshipFrames],
  music: [musicFriendTopics, musicFriendFrames, musicRelationshipTopics, musicRelationshipFrames],
  'hot-takes': [hotTakeTopics, hotTakeFriendFrames, hotRelationshipTopics, hotRelationshipFrames],
  'faith-spirituality': [faithFriendTopics, faithFriendFrames, faithRelationshipTopics, faithRelationshipFrames],
  'values-beliefs': [valuesFriendTopics, valuesFriendFrames, valuesRelationshipTopics, valuesRelationshipFrames],
}

export const curatedNormalCards = Object.fromEntries(
  Object.entries(specs).map(([id, [friendTopics, friendFrames, relationshipTopics, relationshipFrames]]) => [id, {
    friend: buildFriend(id, friendTopics, friendFrames),
    relationship: buildRelationship(id, relationshipTopics, relationshipFrames),
  }]),
)

for (const [id, modes] of Object.entries(curatedNormalCards)) {
  if (modes.friend.length !== 750) throw new Error(`${id} friend expected 750, got ${modes.friend.length}`)
  if (modes.relationship.length !== 750) throw new Error(`${id} relationship expected 750, got ${modes.relationship.length}`)
}
