import { gameCategories } from '../categories.js'
import { ngContext } from './context.js'
import {
  TARGET_PER_MODE,
  audienceFor,
  combinations,
  deterministicShuffle,
  intensityFor,
  normalise,
  stageFor,
  takeTarget,
  uniqueByText,
} from './helpers.js'

const first = (domain, count = 12, offset = 0) => {
  const items = ngContext[domain] || []
  const out = []
  for (let i = 0; i < Math.min(count, items.length); i += 1) out.push(items[(i + offset) % items.length])
  return out
}

const friendOptionPools = [
  ['Nigerian comfort foods', first('nigerianFood', 12)],
  ['Nigerian snacks and street food', first('snacksStreetFood', 12)],
  ['secondary school memories', first('secondarySchool', 12)],
  ['childhood games', first('childhoodGames', 12)],
  ['old phone and internet memories', first('oldInternet', 12)],
  ['things that make a friendship strong', ['Honesty','Loyalty','Humour','Reliability','Respect','Shared interests','Emotional support','Good communication','Showing up','Giving each other space','Generosity','Knowing when to be quiet']],
  ['ways to spend a free Saturday', ['Sleep in','See a film','Visit a friend','Try a restaurant','Play games','Take a short trip','Stay home','Go to an event','Watch football','Go for a walk','Attend a family event','Do absolutely nothing']],
  ['things people spend enjoyment money on', ['Food','Clothes','Tech','Travel','Concerts','Games','Beauty','Home items','Subscriptions','Gifts','Football','Eating out']],
  ['things people save towards', ['Rent','A car','A phone','Travel','Emergency fund','Business','Education','Relocation','A home','Investments','Family support','A wedding']],
  ['everyday Nigerian frustrations', first('powerInternet', 6).concat(first('transportTraffic', 6))],
  ['things you use your phone for', ['WhatsApp','Music','Mobile banking','Maps','Photos','Social media','YouTube','Notes','Ride-hailing','Work','Calls','Food delivery']],
  ['weekend plans', ['Brunch','Beach','Cinema','House hangout','Football','Church or faith gathering','Wedding','Restaurant','Games night','Road trip','Family visit','Stay at home']],
  ['Nigerian party essentials', ['Party jollof','Small chops','A good DJ','Cold drinks','Aso ebi','A lively MC','Good lighting','Enough chairs','A dance floor','Souvenirs','A live band','People who actually dance']],
  ['things that make travel easier', ['Good company','Enough money','Light luggage','Reliable transport','Good weather','A clear plan','Good food','A comfortable seat','Power bank','Flexible timing','A decent hotel','Mobile data']],
  ['things you value at work', ['Good pay','Flexibility','Nice colleagues','Growth','Stability','Short commute','Recognition','Low stress','Interesting work','Good leadership','Remote days','Clear expectations']],
  ['qualities you respect in people', ['Kindness','Discipline','Humour','Confidence','Patience','Ambition','Honesty','Loyalty','Self-awareness','Generosity','Courage','Consistency']],
  ['small luxuries', ['Steady power','Fast internet','Air conditioning','Food delivery','Ride-hailing','Good headphones','Fresh sheets','A quiet morning','A full tank','A clean room','Cold water','No traffic']],
  ['things people are nostalgic about', ['Childhood TV','Old Nigerian songs','School friends','Family holidays','Old phones','Street games','2go','BlackBerry Messenger','Old snacks','School uniforms','Birthday parties','Cybercafés']],
  ['things people procrastinate', ['Laundry','Replying messages','Budgeting','Cleaning','Exercise','Appointments','Reading','Meal prep','Paperwork','Sleep','Calling family back','Fixing something at home']],
  ['ways friends communicate', ['Text','Phone call','Voice note','Video call','Memes','Long messages','In-person talk','Photos','Links','Random check-ins','Group chats','Sending songs']],
  ['things that improve a hangout', ['Good food','Good music','Long conversation','Nice location','Games','A small group','No time pressure','Good lighting','Inside jokes','Late-night energy','Cold drinks','No one rushing home']],
  ['Nigerian cities for a weekend', ['Lagos','Abuja','Ibadan','Port Harcourt','Enugu','Benin City','Calabar','Jos','Abeokuta','Ilorin','Kaduna','Owerri']],
  ['adult-life headaches', ['Bills','Traffic','Deadlines','House chores','Bank issues','Unexpected expenses','Family pressure','Poor sleep','Rent','Power problems','Network issues','Work calls']],
  ['simple pleasures', ['Cold water after a long day','Fresh food','A clean bed','A favourite song','An empty road','A good laugh','Unexpected money','A cool evening','A long shower','Finishing work early','Steady power','A quiet house']],
]

const relationshipOptionPools = [
  ['things that make a relationship strong', ['Trust','Communication','Attraction','Friendship','Respect','Faith','Financial compatibility','Humour','Quality time','Shared goals','Emotional safety','Consistency']],
  ['ways to feel loved', ['Words','Gifts','Touch','Quality time','Acts of service','Reassurance','Being listened to','Thoughtful plans','Physical presence','Support','Being defended','Being considered']],
  ['date ideas in Nigeria', ['Dinner','Cinema','Beach day','Road trip','Stay-in night','Games night','Museum','Concert','Cooking together','Brunch','Art event','Late-night drive']],
  ['ways to communicate while apart', ['Texts','Calls','Voice notes','Video calls','Memes','Photos','Long messages','Quick check-ins','Shared playlists','Random updates','Prayer together','Watching something together']],
  ['romantic habits', ['Good morning texts','Date nights','Surprise gifts','Love notes','Random food delivery','Long calls','Holding hands','Checking in','Compliments','Planning ahead','Remembering small details','Showing up after a hard day']],
  ['forms of affection', ['Hugs','Kisses','Cuddling','Holding hands','Forehead kisses','Back rubs','Sitting close','Playing with hair','Long embraces','Quick kisses goodbye','Touching shoulders','Resting on each other']],
  ['things couples build together', ['Memories','Money','Traditions','A home','Friendships','Faith','Routines','Travel plans','Family relationships','Future goals','Business ideas','A peaceful home']],
  ['relationship challenges', ['Distance','Busy schedules','Jealousy','Money stress','Family interference','Different routines','Poor communication','Work pressure','Social media','Different expectations','Relocation plans','Different faith levels']],
  ['things worth discussing early', ['Money','Faith','Marriage','Children','Career plans','Family boundaries','Sex','Where to live','Debt','Communication style','Genotype','Relocation plans']],
  ['things that make dates better', ['Good conversation','Good food','Privacy','A new experience','Music','No phones','Spontaneity','Thoughtful planning','Comfort','No time pressure','Easy transport','Not overspending']],
  ['couple memories', ['First date','First trip','First photo','First argument','First gift','First long call','First holiday','First surprise','First serious talk','First time meeting friends','First family introduction','First time cooking together']],
  ['partner qualities', ['Kindness','Loyalty','Ambition','Humour','Patience','Confidence','Faith','Emotional maturity','Generosity','Discipline','Self-awareness','Consistency']],
  ['future plans', ['Travel','Own a home','Build wealth','Start traditions','Raise children','Move city','Start a business','Host family','Retire early','See more of Africa','Relocate abroad','Build a life in Nigeria']],
  ['things that keep attraction alive', ['Flirting','Compliments','Dates','Touch','Confidence','Mystery','Effort','Dressing up','Playfulness','Time apart','Good conversation','Feeling respected']],
  ['relationship boundaries', ['Privacy','Exes','Friends','Family','Phones','Social media','Money','Time alone','Work','Going out','Sharing screenshots','Public jokes']],
  ['things that make conflict easier', ['Calm tone','Honesty','Time to cool off','Apology','Humour','Clear boundaries','Listening','Taking responsibility','Reassurance','Picking the right time','Changing the behaviour','Praying before talking']],
  ['ways to spend a couple weekend', ['Stay in','Eat out','See friends','Take a trip','Go to church','Watch films','Cook together','Attend an event','Take a long drive','Do separate things','Visit family','Try a new place']],
  ['things people notice in a partner', ['Smile','Voice','Style','Confidence','Kindness','Humour','Eyes','Manners','Energy','How they treat people','Smell','How they speak about family']],
  ['things couples might share', ['Passwords','Locations','Money goals','Calendars','Playlists','Food','Friends','Chores','Travel plans','Family events','Streaming accounts','Emergency contacts']],
  ['small romantic gestures', ['Buy their favourite snack','Send a thoughtful text','Plan a surprise date','Leave a note','Call unexpectedly','Send a song','Bring food','Remember a small detail','Take a nice photo','Handle an annoying task','Pay attention to an important date','Check they got home safely']],
  ['things that test compatibility', ['Money habits','Cleanliness','Sleep schedules','Social energy','Family expectations','Faith','Travel style','Conflict style','Career ambition','Food habits','Relocation plans','Views on children']],
  ['things that make long calls enjoyable', ['Gossip','Deep questions','Stories','Music','Comfortable silence','Flirting','Planning trips','Games','Watching something together','Random observations','Talking about childhood','Planning food']],
  ['Nigerian couple pressures', ['Wedding expectations','Family approval','Money expectations','Relocation plans','Tribe or ethnicity','Faith','Genotype','Where to live','Supporting parents','Career timing','When to marry','When to have children']],
  ['things worth saving for as a couple', ['Rent','A wedding','A home','Travel','Emergency fund','A car','Business','Investments','Relocation','Children','Furniture','Family support']],
]

const poolCards = (pools, size, textFor, target = TARGET_PER_MODE, salt = 17) => {
  const out = []
  pools.forEach(([label, items], poolIndex) => {
    const combos = deterministicShuffle(combinations(items, size), salt + poolIndex * 7)
    combos.slice(0, Math.ceil(target / pools.length) + 6).forEach(options => out.push({ text: textFor(label, options), options }))
  })
  return takeTarget(out, target, salt)
}

const archetypePoolsFriend = [
  ['people from your school years', ['Your first school crush','The class clown','The quiet genius','The popular student','The sports person','The prefect','The person who always had snacks','The person who always borrowed notes','The mysterious transfer student','The teacher’s favourite']],
  ['personality types', ['The funny one','The rich one','The calm one','The ambitious one','The romantic one','The adventurous one','The homebody','The social butterfly','The bookworm','The fashion lover']],
  ['people you might meet at a Nigerian wedding', ['The MC','The DJ','The person dancing all night','The quiet person at the table','The photographer','The person helping with food','The friend of the couple','The stylish guest','The person who came mainly for food','The cousin who knows everybody']],
  ['fictional-type characters', ['The brilliant detective','The charming villain','The loyal best friend','The ambitious CEO','The funny neighbour','The quiet artist','The fearless athlete','The calm doctor','The unpredictable musician','The thoughtful teacher']],
]

const archetypePoolsRelationship = [
  ['dating personalities', ['The hopeless romantic','The ambitious career person','The calm homebody','The spontaneous traveller','The funny extrovert','The quiet deep thinker','The family person','The creative type','The disciplined saver','The generous spender']],
  ['people from your past', ['Your first crush','Your celebrity crush','The person who liked you first','The person you almost dated','The person your friends thought suited you','The person your family would have liked','The person who made you laugh most','The person you had the best conversations with','The person who looked best on paper','The person who surprised you most']],
  ['fictional relationship types', ['The charming musician','The serious lawyer','The thoughtful doctor','The adventurous photographer','The funny chef','The quiet writer','The confident entrepreneur','The calm teacher','The driven athlete','The creative designer']],
  ['Nigerian event characters', ['The wedding photographer','The stylish guest','The DJ','The friend of the bride','The friend of the groom','The person dancing all night','The person helping everyone','The quiet person at the table','The person who knows everybody','The person who came mainly for food']],
]

const friendBehaviours = [
  'cancels plans at the last minute',
  'only calls when they need something',
  'tells their partner everything you tell them',
  'never initiates plans',
  'borrows money and avoids the topic afterwards',
  'shows up when you are having a hard time',
  'celebrates your wins without making it about themselves',
  'makes jokes at your expense in front of other people',
  'keeps secrets you trusted them with',
  'shares screenshots of private chats',
  'becomes distant whenever they enter a relationship',
  'expects you to support their business but never supports yours',
  'compares your progress with theirs constantly',
  'checks in after a difficult day',
  'remembers important dates',
  'keeps you waiting without updating you',
  'talks about your money in front of other people',
  'gives honest advice even when you do not want to hear it',
  'defends you when you are not in the room',
  'corrects you privately instead of embarrassing you publicly',
  'gets jealous when you make new friends',
  'acts differently around people they want to impress',
  'expects instant replies but takes hours to respond',
  'makes every hangout about taking pictures',
  'forgets to pay you back until you remind them repeatedly',
  'sends you job or business opportunities',
  'knows when to give you space',
  'invites extra people without telling you',
  'comes to your area and never tells you',
  'borrows your things without asking first',
  'always wants a special price from your business',
  'makes fun of something you are insecure about',
  'remembers what you said months ago',
  'apologises properly after hurting you',
  'says sorry but repeats the same behaviour',
  'posts private moments without asking',
  'leaves you to handle the bill after suggesting an expensive plan',
  'calls you out when you are clearly wrong',
  'gossips about everybody they claim to be close to',
  'is kind to service workers and strangers',
  'changes plans for family without telling you early',
  'only wants to hang out when it is convenient for them',
  'keeps score of every favour they have done for you',
  'sends you food when you are stressed',
  'expects you to choose sides in every disagreement they have',
  'respects your boundaries without taking them personally',
  'asks what you earn very early in the friendship',
  'makes passive-aggressive posts instead of speaking to you',
  'stays friends with people who openly disrespect you',
  'remembers to check whether you got home safely',
]

const relationshipBehaviours = [
  'still talks to an ex regularly',
  'keeps a dating app after you become exclusive',
  'goes through your phone without asking',
  'asks before using your phone',
  'shares screenshots of your chats with friends',
  'tells their family every detail of your arguments',
  'supports their parents financially every month',
  'expects you to support their family financially too',
  'never wants to discuss money',
  'is open about debt and financial responsibilities',
  'replies slowly but always calls later',
  'disappears for hours without any explanation',
  'checks that you got home safely',
  'expects your location at all times',
  'keeps close friends of the opposite sex',
  'flirts jokingly with other people',
  'likes suggestive posts online regularly',
  'rarely posts you but posts everything else',
  'keeps the relationship mostly private online',
  'makes big plans without discussing them with you',
  'changes plans for family repeatedly',
  'stands up for you when family crosses a boundary',
  'avoids saying sorry first',
  'apologises and changes the behaviour',
  'raises their voice during arguments',
  'asks for time to cool down before talking',
  'uses silence as punishment',
  'brings up old mistakes during new arguments',
  'makes jokes about you in public',
  'protects private things you told them',
  'expects you to pay for every date',
  'insists on splitting everything exactly in half',
  'earns more but never uses it to control decisions',
  'buys expensive gifts instead of talking through problems',
  'is extremely close to their family',
  'has no close friends at all',
  'changes their personality around certain friends',
  'takes faith seriously but does not force it on you',
  'wants to relocate abroad as soon as possible',
  'wants to build their whole future in Nigeria',
  'expects marriage within a fixed timeline',
  'does not want children',
  'wants several children',
  'expects household work to follow traditional gender roles',
  'is comfortable sharing household responsibilities',
  'can talk openly about genotype and health before things get serious',
  'avoids difficult conversations until they become urgent',
  'remembers small details you mention once',
  'makes time for you even during busy periods',
  'expects access to every password because you are dating',
]

const behaviourNuance = [
  behaviour => `They ${behaviour}, and they do not think it is a big deal.`,
  behaviour => `They ${behaviour}, but they listen when you explain why it bothers you.`,
  behaviour => `They ${behaviour} repeatedly even after you have discussed it.`,
  behaviour => `They ${behaviour} once, apologise properly and do not repeat it.`,
  behaviour => `They ${behaviour}, but only when they are under serious pressure.`,
  behaviour => `They ${behaviour}, and their friends think it is completely normal.`,
  behaviour => `They ${behaviour}, but everything else about the friendship or relationship feels healthy.`,
  behaviour => `They ${behaviour}, and they would be upset if you did the same thing.`,
  behaviour => `They ${behaviour}, but they are honest about why they do it.`,
  behaviour => `They ${behaviour}, and they refuse to discuss it when you bring it up.`,
  behaviour => `They ${behaviour}, but they make a genuine effort to improve.`,
  behaviour => `They ${behaviour}, and it has started affecting how much you trust them.`,
  behaviour => `They ${behaviour}, but only in situations involving family.`,
  behaviour => `They ${behaviour}, but only when money is involved.`,
  behaviour => `They ${behaviour}, and you notice they treat other people the same way.`,
]

const friendPettySituations = [
  'your friend viewed your story but ignored the message you sent earlier',
  'your friend came to your area several times and never told you',
  'your friend started dating and barely calls anymore',
  'your friend bought the same thing after mocking you for buying it',
  'your friend always takes the bigger piece of food',
  'your friend heard your big news from someone else before you told them',
  'your friend forgot your birthday but posted somebody else that same day',
  'your friend keeps making plans in the group chat and excluding you',
  'your friend only wants to meet when they need to leave the house anyway',
  'your friend borrowed your charger and returned a different one',
  'your friend asks for your Netflix password but never shares theirs',
  'your friend always chooses the restaurant but complains about your choices',
  'your friend never likes your posts but likes everybody else’s',
  'your friend keeps sending voice notes after saying they hate voice notes',
  'your friend makes you take twenty photos of them but takes two bad ones of you',
  'your friend brings an extra person to your plan without asking',
  'your friend orders the most expensive thing after suggesting you split the bill equally',
  'your friend uses your joke in another group and gets all the laughs',
  'your friend keeps your food order wrong even though you always remember theirs',
  'your friend replies “okay” to a long message you spent time writing',
  'your friend refuses to send the pictures they took of you',
  'your friend always says they are broke but never misses an event',
  'your friend knows you hate lateness and still arrives an hour late',
  'your friend tags everyone else in a throwback except you',
  'your friend never tells you they are in town until they are leaving',
]

const relationshipPettySituations = [
  'your partner did not post you on your birthday but posted throughout the day',
  'your partner liked everybody’s birthday message to them except yours',
  'your partner replied “thank you” to a long romantic message',
  'your partner posted a photo of you that you clearly dislike',
  'your partner did not notice your new outfit',
  'your partner watched your story before replying to your message',
  'your partner remembers football fixtures or release dates but forgets a date important to you',
  'your partner calls you by your full name when they are annoyed',
  'your partner chooses food without asking what you want',
  'your partner finishes the food you said you were saving',
  'your partner falls asleep during the film they insisted you watch together',
  'your partner keeps winning the same silly argument because your friends agree with them',
  'your partner always takes the better side of the bed',
  'your partner says they are too tired to call but stays active online',
  'your partner uses a picture you took as their profile photo without giving you credit',
  'your partner asks you to choose a restaurant and rejects every option',
  'your partner does not send you pictures from an event until you ask',
  'your partner sends you a dry “morning” after you sent a proper good morning message',
  'your partner does not save your favourite snack for you',
  'your partner tells a funny story about you at a family gathering',
  'your partner forgets which one of you said “I love you” first',
  'your partner takes too long to choose a picture of you to post',
  'your partner gives your side of the charger to somebody else',
  'your partner picks a film without checking whether you have seen it',
  'your partner keeps a nickname for you that you pretend to hate',
]

const pettyReactions = [
  situation => `Petty or valid: ${situation}, so you stop putting in the same amount of effort for a while?`,
  situation => `Petty or valid: ${situation}, and it genuinely changes your mood?`,
  situation => `Petty or valid: ${situation}, so you mention it directly instead of pretending you do not care?`,
  situation => `Petty or valid: ${situation}, and you bring it up as a joke later?`,
  situation => `Petty or valid: ${situation}, but you decide it is too small to discuss?`,
  situation => `Petty or valid: ${situation}, so you do the same thing back once?`,
  situation => `Petty or valid: ${situation}, and you ask somebody else whether you are overreacting?`,
  situation => `Petty or valid: ${situation}, and you remember it much longer than you want to admit?`,
  situation => `Petty or valid: ${situation}, so you make them explain themselves?`,
  situation => `Petty or valid: ${situation}, but everything else between you is fine?`,
]

const friendTruthTopics = [
  ...first('secondarySchool', 20), ...first('familyHome', 20), ...first('moneySpending', 20), ...first('friendshipDynamics', 20),
  ...first('socialMedia', 20), ...first('whatsappPhone', 20), ...first('workCareer', 20), ...first('ambitionsJapa', 20),
  ...first('foodMemories', 20), ...first('valuesCharacter', 20),
]
const relationshipTruthTopics = [
  ...first('datingEarly', 20), ...first('relationshipCommunication', 20), ...first('relationshipMoney', 20), ...first('relationshipFamily', 20),
  ...first('relationshipFuture', 20), ...first('conflictBoundaries', 20), ...first('attractionAffection', 20), ...first('familyHome', 20),
  ...first('ambitionsJapa', 20), ...first('faithGeneral', 20),
]

const truthTemplatesFriend = [
  'What is something you have never told most people about {topic}?',
  'What is the most embarrassing story you have around {topic}?',
  'What is one thing you pretend not to care about when it comes to {topic}?',
  'What is the pettiest thing you have done because of {topic}?',
  'What is one lie you have told to avoid dealing with {topic}?',
  'What is one thing your close friends know about you and {topic} that others do not?',
  'What is one thing about {topic} you would hate to have shown on a big screen?',
  'What is the most honest answer you can give about how you handle {topic}?',
]
const truthTemplatesRelationship = [
  'What is something about {topic} you would be nervous to tell someone you are dating?',
  'What is one thing about {topic} you hope I never misunderstand about you?',
  'What is the most embarrassing thing you have done because of {topic}?',
  'What is one truth about {topic} you usually avoid saying too early?',
  'What is one thing about {topic} you would want complete honesty from me about?',
  'What is one thing from your past around {topic} that changed how you date now?',
  'What is one insecurity you have around {topic}?',
  'What is the most honest answer you can give about what you want around {topic}?',
]

const dareFamilies = [
  values => values.map(value => `Send a voice note telling the funniest story you have about ${value}.`),
  values => values.map(value => `Send one photo from your phone that reminds you of ${value}, if you are comfortable sharing it.`),
  values => values.map(value => `Send a song you would choose for ${value}.`),
  values => values.map(value => `Describe ${value} in exactly five words, without taking more than ten seconds to think.`),
  values => values.map(value => `Send the first GIF or sticker you find that matches your mood about ${value}.`),
  values => values.map(value => `Give ${value} a score out of 10 in a voice note and defend the score.`),
  values => values.map(value => `Tell one true story about ${value} that sounds made up.`),
  values => values.map(value => `Pick one person you know and say what they would say about you and ${value}.`),
  values => values.map(value => `Send one emoji only to describe how you feel about ${value}, then explain after the other person guesses.`),
  values => values.map(value => `Give your hottest take about ${value} in one sentence.`),
]

const dareValuesFriend = [
  ...first('secondarySchool', 8), ...first('childhoodGames', 8), ...first('oldInternet', 8), ...first('foodMemories', 8), ...first('transportTraffic', 8),
]
const dareValuesRelationship = [
  ...first('datingEarly', 8), ...first('attractionAffection', 8), ...first('relationshipCommunication', 8), ...first('foodMemories', 8), ...first('musicHabits', 8),
]

const finishStartersFriend = [
  'If my secondary school friends saw me now, they would say…',
  'One thing Nigerian parents were right about is…',
  'One thing Nigerian parents were wrong about is…',
  'The quickest way to annoy me is…',
  'If ₦1 million entered my account unexpectedly, the first sensible thing I would do is…',
  'If ₦1 million entered my account unexpectedly, the first unserious thing I would do is…',
  'The Nigerian food I could eat too often is…',
  'The part of growing up I miss most is…',
  'The part of adulthood nobody prepared me for is…',
  'If I could relive one school year, I would choose…',
  'The friend who knows me best knows that I…',
  'When I am stressed, I usually…',
  'The one thing I always overspend on is…',
  'The kind of weekend I enjoy most starts with…',
  'If I left Nigeria for one year, I would miss…',
  'The thing I complain about in my city but would still miss is…',
  'A small luxury I struggle to give up is…',
  'My family knows not to ask me to…',
  'The easiest way to make me laugh is…',
  'I know I trust someone when…',
  'The kind of person I become in traffic is…',
  'A song that takes me straight back is…',
  'If you checked my food order history, you would notice…',
  'The most Nigerian thing about my childhood was…',
  'If I had a free flight within Nigeria tomorrow, I would go to…',
]

const finishStartersRelationship = [
  'I knew I was starting to like you when…',
  'One ordinary thing I would enjoy doing with you often is…',
  'The relationship habit I never want us to lose is…',
  'If we had ₦100,000 to spend on one date, I would want us to…',
  'If we had to stay indoors all weekend, I would want us to…',
  'The easiest way to make me feel considered is…',
  'When I am upset, the worst thing a partner can do is…',
  'When I am upset, the thing that helps most is…',
  'One money conversation I think couples should have early is…',
  'One family boundary I think couples need is…',
  'If we moved to another Nigerian city together, I would pick…',
  'If we relocated abroad together, the thing I would miss most is…',
  'One thing I hope we can laugh about even when we are old is…',
  'A date does not need to be expensive if…',
  'The kind of reassurance that works best on me is…',
  'The quickest way to make me feel distant in a relationship is…',
  'One thing I would want our future home to feel like is…',
  'One Nigerian family expectation I would want us to discuss properly is…',
  'The kind of support I value most during a hard month is…',
  'If we had to save for one big thing first, I would choose…',
  'One thing I would never want social media to control in our relationship is…',
  'The kind of apology I respect is…',
  'One thing I would want us to be completely honest about is…',
  'The most attractive thing someone can do without trying to look attractive is…',
  'A small thing that would make me feel loved after a long day is…',
]

const storyTemplatesFriend = [
  topic => `Tell me the full story of ${topic}.`,
  topic => `Tell me about the funniest thing that happened around ${topic}.`,
  topic => `Tell me about a time ${topic} went completely differently from what you expected.`,
  topic => `Tell me about someone you still remember because of ${topic}.`,
  topic => `Tell me about a mistake you made around ${topic} that is funny now.`,
  topic => `Tell me about the best day you connect with ${topic}.`,
  topic => `Tell me about the worst day you connect with ${topic}.`,
  topic => `Tell me about the most embarrassing moment you have around ${topic}.`,
]
const storyTemplatesRelationship = [
  topic => `Tell me the story that best explains your experience with ${topic}.`,
  topic => `Tell me about a funny relationship or dating memory connected to ${topic}.`,
  topic => `Tell me about a time ${topic} taught you something about what you want from a partner.`,
  topic => `Tell me about a time ${topic} went better than you expected.`,
  topic => `Tell me about a time ${topic} went badly and what you learnt from it.`,
  topic => `Tell me about the most awkward moment you have around ${topic}.`,
  topic => `Tell me about a moment around ${topic} you would handle differently now.`,
  topic => `Tell me about a moment around ${topic} that still makes you smile.`,
]

function topicGame(topicRows, templates, target, salt) {
  const out = []
  topicRows.forEach((topic, i) => {
    templates.forEach((template, j) => {
      const text = typeof template === 'function' ? template(topic) : template.replaceAll('{topic}', topic)
      out.push({ text, source: topic, salt: i * 11 + j })
    })
  })
  return takeTarget(out, target, salt)
}

function behaviourCards(behaviours, target, salt) {
  const out = []
  behaviours.forEach((behaviour, i) => {
    behaviourNuance.forEach((make, j) => out.push({ text: make(behaviour), source: behaviour, salt: i * 17 + j }))
  })
  return takeTarget(out, target, salt)
}

function pettyCards(situations, target, salt) {
  const out = []
  situations.forEach((situation, i) => pettyReactions.forEach((make, j) => out.push({ text: make(situation), source: situation, salt: i * 7 + j })))
  return takeTarget(out, target, salt)
}

function agreeCards(mode) {
  const topics = mode === 'friend'
    ? [...first('nigeriaSociety',20), ...first('friendshipDynamics',20), ...first('moneySpending',20), ...first('workCareer',20), ...first('socialMedia',20), ...first('valuesCharacter',20)]
    : [...first('nigeriaSociety',20), ...first('relationshipMoney',20), ...first('relationshipFamily',20), ...first('conflictBoundaries',20), ...first('socialMedia',20), ...first('relationshipFuture',20)]
  const templates = mode === 'friend' ? [
    '{topic} matters more than people admit.',
    'People make too much of {topic}.',
    'People do not take {topic} seriously enough.',
    'Money changes the way people handle {topic}.',
    'Social media has made {topic} more complicated than it needs to be.',
    'Your upbringing affects your view of {topic} more than most people realise.',
    'People should be more honest with close friends about {topic}.',
  ] : [
    '{topic} matters more in a relationship than people admit.',
    'Couples make too much of {topic}.',
    'Couples do not discuss {topic} early enough.',
    'Money changes the way couples handle {topic}.',
    'Family pressure makes {topic} more complicated than it needs to be.',
    'Social media has made {topic} harder for couples.',
    'A serious couple should be completely honest about {topic}.',
  ]
  return topicGame(topics, templates, TARGET_PER_MODE, mode === 'friend' ? 71 : 73)
}

function rateCards(mode) {
  const topics = mode === 'friend'
    ? [...first('secondarySchool',20), ...first('nigerianFood',20), ...first('transportTraffic',20), ...first('moneySpending',20), ...first('workCareer',20), ...first('wellbeing',20), ...first('musicNigeria',20)]
    : [...first('datingEarly',20), ...first('relationshipCommunication',20), ...first('relationshipMoney',20), ...first('attractionAffection',20), ...first('relationshipFamily',20), ...first('relationshipFuture',20), ...first('wellbeing',20)]
  const templates = mode === 'friend' ? [
    'Rate your experience with {topic} from 1 to 10, then explain the number.',
    'Rate how much {topic} affects your mood from 1 to 10.',
    'Rate how much you enjoy {topic} from 1 to 10.',
    'Rate how important {topic} is in your life from 1 to 10.',
    'Rate how well you handle {topic} from 1 to 10.',
    'Rate how much you would miss {topic} if it disappeared for a year, from 1 to 10.',
  ] : [
    'Rate how important {topic} is to you in a relationship from 1 to 10.',
    'Rate how comfortable you are talking about {topic} with a partner from 1 to 10.',
    'Rate how much {topic} affects compatibility for you from 1 to 10.',
    'Rate how much effort you think a couple should put into {topic}, from 1 to 10.',
    'Rate how confident you are that you handle {topic} well in relationships, from 1 to 10.',
    'Rate how much {topic} can make or break a relationship for you, from 1 to 10.',
  ]
  return topicGame(topics, templates, TARGET_PER_MODE, mode === 'friend' ? 79 : 83)
}

function storyCards(mode) {
  const topics = mode === 'friend'
    ? [...first('secondarySchool',20), ...first('familyHome',20), ...first('oldInternet',20), ...first('transportTraffic',20), ...first('workCareer',20), ...first('foodMemories',20), ...first('travelNigeria',20)]
    : [...first('datingEarly',20), ...first('relationshipCommunication',20), ...first('relationshipMoney',20), ...first('relationshipFamily',20), ...first('attractionAffection',20), ...first('travelNigeria',20), ...first('familyHome',20)]
  return topicGame(topics, mode === 'friend' ? storyTemplatesFriend : storyTemplatesRelationship, TARGET_PER_MODE, mode === 'friend' ? 89 : 97)
}

function finishCards(mode) {
  const starters = mode === 'friend' ? finishStartersFriend : finishStartersRelationship
  const endings = mode === 'friend'
    ? ['Be honest.','No safe answer.','First answer only.','Do not overthink it.','Explain after you finish it.','Give the answer you would send your closest friend.','Say the first thing that came to mind.','Then tell the story behind it.','No pretending to be mature.','Give the answer your family would expect least.','Give the answer your friends would expect most.','Then say why.','Keep it short first, then explain.','Answer before changing your mind.','Give the real answer, not the polite one.','Add one example.','Say what changed your answer over time.','Say who would disagree with you.','Say what your younger self would answer.','Say what you hope your answer becomes later.','Give the version you would say on a late-night call.','Then ask me the same thing.','Add the one detail that makes the answer make sense.','Say whether the answer has changed in the last five years.','Tell me who influenced that answer most.','Say what would make you change the answer.','Give the most Nigerian version of the answer.','Say what your closest friend would add.','Say what your parents would guess.','Say what your siblings would guess.']
    : ['Be honest.','No safe answer.','First answer only.','Do not overthink it.','Then tell me why.','Say what you would tell me on a late-night call.','Give the answer you would want me to remember.','Add one example.','Say whether your answer has changed over time.','Say what would make the answer different in marriage.','Say what family pressure changes about the answer.','Say what money changes about the answer.','Say what faith changes about the answer.','Tell me what would make you feel safe enough to say it.','Then ask me the same thing.','Say what your closest friend would guess you would answer.','Say what your family would guess you would answer.','Say what you would have answered five years ago.','Say what you hope your answer becomes later.','Give the answer you would rather say than text.','Say what part of the answer you would need me to understand.','Add the one detail that makes the answer make sense.','Say what would make you change the answer.','Give the most realistic answer for life in Nigeria.','Say what a healthy relationship would look like in the answer.','Say what would make the answer difficult in real life.','Tell me which part matters most.','Say what you would compromise on and what you would not.','Give the answer before trying to sound romantic.','Say what you think I would answer too.']
  const out = []
  starters.forEach((starter, i) => endings.forEach((ending, j) => out.push({ text: `${starter} ${ending}`, source: starter, salt: i * 31 + j })))
  return takeTarget(out, TARGET_PER_MODE, mode === 'friend' ? 101 : 103)
}

function neverCards(mode) {
  const topics = mode === 'friend'
    ? [...first('secondarySchool',20), ...first('oldInternet',20), ...first('familyHome',20), ...first('socialMedia',20), ...first('moneySpending',20), ...first('transportTraffic',20)]
    : [...first('datingEarly',20), ...first('relationshipCommunication',20), ...first('socialMedia',20), ...first('conflictBoundaries',20), ...first('relationshipMoney',20), ...first('attractionAffection',20)]
  const templates = mode === 'friend' ? [
    'Never have I ever lied to avoid {topic}.',
    'Never have I ever pretended to understand {topic} when I did not.',
    'Never have I ever spent more money than I planned because of {topic}.',
    'Never have I ever blamed somebody else for something involving {topic}.',
    'Never have I ever hidden something from my family because of {topic}.',
    'Never have I ever changed my mind completely about {topic}.',
    'Never have I ever embarrassed myself because of {topic}.',
  ] : [
    'Never have I ever avoided telling someone I was dating the full truth about {topic}.',
    'Never have I ever overthought {topic} because I liked someone.',
    'Never have I ever asked a friend for advice about {topic} before speaking to my partner.',
    'Never have I ever felt jealous because of {topic}.',
    'Never have I ever pretended {topic} did not bother me when it did.',
    'Never have I ever changed my relationship standards because of {topic}.',
    'Never have I ever had an argument because of {topic}.',
  ]
  return topicGame(topics, templates, TARGET_PER_MODE, mode === 'friend' ? 107 : 109)
}

function twoTruthsCards(mode) {
  const pools = mode === 'friend' ? friendOptionPools : relationshipOptionPools
  const cards = []
  pools.forEach(([label, items], poolIndex) => {
    const statements = items.map(item => `I have a real story about ${item}.`)
    deterministicShuffle(combinations(statements, 3), 113 + poolIndex).slice(0, 40).forEach(options => {
      cards.push({ text: `Pick two that are true for you about ${label}. Make one the lie.`, statements: options })
    })
  })
  return takeTarget(cards, TARGET_PER_MODE, mode === 'friend' ? 113 : 127)
}

function whatWouldYouDoCards(mode) {
  const friendScenarios = [
    'A close friend borrows money from you, misses the repayment date and starts avoiding you.',
    'Your best friend starts dating someone you strongly dislike, but they are clearly happy.',
    'A friend tells you a secret, then somebody else asks you directly about it.',
    'You find out a friend has been making jokes about you in another group chat.',
    'A friend gets a job opportunity you wanted and asks you to celebrate with them.',
    'You are at a Nigerian wedding and a friend disappears, leaving you with people you do not know.',
    'Your friend keeps cancelling plans because of their relationship.',
    'A friend asks you to lie to their parents for them.',
    'You discover a friend has been using your business idea without telling you.',
    'A friend sends you money by mistake and does not notice.',
    'You are stranded after an event and your friend is the only person close enough to help, but you recently argued.',
    'Your friend posts something private you told them without using your name, but you know it is about you.',
    'A friend wants to move abroad and is about to make a decision you think is financially reckless.',
    'Your friend gets engaged to someone you think they barely know.',
    'A friend keeps borrowing your things and returning them late.',
    'You hear a damaging rumour about your friend from someone you trust.',
    'Your friend is clearly struggling but keeps saying they are fine.',
    'A friend wants you to invest in their business, but the numbers do not make sense to you.',
    'Your friend asks you to choose between them and another close friend after an argument.',
    'You realise you have outgrown a friendship that once meant a lot to you.',
  ]
  const relationshipScenarios = [
    'Your partner gets a job offer abroad and you have no immediate plan to leave Nigeria.',
    'Your partner wants to support their parents with a large amount of money every month.',
    'Your families disagree strongly about how big your wedding should be.',
    'Your partner wants to live close to family, but you want more distance and privacy.',
    'You discover your partner has been talking to an ex regularly but says it is completely platonic.',
    'Your partner loses their job shortly after you both commit to a major financial plan.',
    'Your partner wants to combine finances, but you prefer keeping some money separate.',
    'A close family member openly disrespects your partner during a family event.',
    'Your partner wants to relocate to another Nigerian city for work.',
    'You both want marriage, but your preferred timelines are very different.',
    'Your partner has a close friend you do not trust.',
    'Your partner shares details of your arguments with their friends.',
    'Your partner wants children, and you are no longer sure you do.',
    'Your partner’s family expects you to follow a tradition you are uncomfortable with.',
    'You find out your partner has debt they never mentioned.',
    'Your partner receives a large unexpected amount of money and wants to spend most of it immediately.',
    'Your partner hates posting relationships online, but public acknowledgement matters to you.',
    'You discover you have very different ideas about supporting extended family after marriage.',
    'Your partner wants to start a business with most of your joint savings.',
    'You both love each other, but you keep having the same unresolved argument.',
  ]
  const scenarios = mode === 'friend' ? friendScenarios : relationshipScenarios
  const twists = [
    'What would you do first?',
    'Would you address it immediately or wait? Why?',
    'Who would you talk to before making a decision?',
    'What would make you handle it gently, and what would make you become firm?',
    'What outcome would you consider fair?',
    'What would you refuse to do in this situation?',
    'What would make you change your mind?',
    'Would your answer be different if money was involved? Explain.',
    'Would your answer be different if family pressure was involved? Explain.',
    'What do you think most people around you would advise, and would you follow it?',
    'What would your closest friend expect you to do?',
    'What would make the situation a deal-breaker for you?',
    'What boundary would you set afterwards?',
    'Would you forgive it once? Why or why not?',
    'What would you need to hear before moving forward?',
    'How would you handle it if the other person became defensive?',
    'How would you handle it if the other person apologised immediately?',
    'Would you involve family or keep it between the people involved?',
    'What part of this situation would bother you most?',
    'What would a mature response look like to you?',
    'What would an immature response look like to you?',
    'Would you rather protect the relationship or protect your peace here?',
    'What would you do if the same thing happened twice?',
    'Would you want the full truth even if it hurt?',
    'What advice would you give somebody else in the same situation?',
    'How much would the history between both people matter to your answer?',
    'Would you handle it differently if you were financially dependent on the person?',
    'Would you handle it differently if everybody around you knew about it?',
    'What is the one question you would need answered first?',
    'What would make you walk away?',
    'What would make you stay and work through it?',
    'What would you need to see change afterwards?',
    'Would you sleep on it or decide quickly?',
    'What would you regret doing impulsively?',
    'What part of your values would guide your answer most?',
    'What would your parents advise you to do?',
    'What would your younger self have done?',
    'What would you do now that you are older?',
  ]
  const out = []
  scenarios.forEach((scenario, i) => twists.forEach((twist, j) => out.push({ text: `${scenario} ${twist}`, source: scenario, salt: i * 41 + j })))
  return takeTarget(out, TARGET_PER_MODE, mode === 'friend' ? 131 : 137)
}

function whoLikelyCards(mode) {
  const behaviours = mode === 'friend' ? friendBehaviours : relationshipBehaviours
  const extras = mode === 'friend'
    ? ['forget their own birthday plans','spend all their money on food first','move abroad with two weeks’ notice','sleep through an important alarm','become friends with a stranger in a queue','know the best food spot in any area','turn a short story into a twenty-minute story','reply to a message three days later like nothing happened','start a side hustle unexpectedly','survive a week without social media','get into a debate with an older relative','carry snacks everywhere','be the last person to leave a wedding','know every old Nigerian song','fall asleep during a long call','choose a road trip over a flight','get lost even with Google Maps','remember everybody’s food order','forget where they kept their phone','become the family favourite at somebody else’s house']
    : ['say “I miss you” first','plan the better date','fall asleep on a call first','remember an anniversary first','spend more on gifts','suggest a spontaneous road trip','get jealous first','apologise first','want to leave a party first','become close to the other person’s family first','suggest saving together first','want to relocate first','start a silly argument over food','take more pictures on dates','send the longer good morning text','buy food as an apology','want a bigger wedding','suggest staying in instead of going out','get emotional during a film','remember a tiny detail from months ago']
  const all = [...behaviours.map(x => x.replace(/^./, c => c.toLowerCase())), ...extras]
  const templates = mode === 'friend'
    ? ['Who is more likely to {topic}, you or your friend?','Between the two of you, who would most likely {topic}?','If one of you had to {topic}, who are you picking?','Who would your mutual friends say is more likely to {topic}?','Who is more likely to {topic} and then defend it confidently?']
    : ['Who is more likely to {topic}, you or your partner?','Between the two of you, who would most likely {topic}?','If one of you had to {topic}, who are you picking?','Who would your close friends say is more likely to {topic}?','Who is more likely to {topic} and then act like it was obvious?']
  return topicGame(all, templates, TARGET_PER_MODE, mode === 'friend' ? 139 : 149)
}

function guessCards(mode, gameId) {
  const pools = mode === 'friend' ? friendOptionPools : relationshipOptionPools
  const cards = []
  pools.forEach(([label, items], poolIndex) => {
    const combos = deterministicShuffle(combinations(items, 4), 151 + poolIndex)
    combos.slice(0, 40).forEach(options => {
      const text = gameId === 'guess-my-answer'
        ? `Which of these ${label} do you think I would pick first?`
        : `Which of these ${label} do you think describes my choice best? Guess before I answer.`
      cards.push({ text, options })
    })
  })
  return takeTarget(cards, TARGET_PER_MODE, gameId === 'guess-my-answer' ? 151 : 157)
}

function ifChooseCards(mode) {
  const pools = mode === 'friend' ? friendOptionPools : relationshipOptionPools
  const cards = []
  pools.forEach(([label, items], poolIndex) => {
    deterministicShuffle(combinations(items, 2), 163 + poolIndex).slice(0, 35).forEach(options => {
      cards.push({ text: `If you had to choose one from these ${label}, which one are you taking and why?`, options })
    })
  })
  return takeTarget(cards, TARGET_PER_MODE, mode === 'friend' ? 163 : 167)
}

function kissMarryAvoidCards(mode) {
  const pools = mode === 'friend' ? archetypePoolsFriend : archetypePoolsRelationship
  const cards = []
  pools.forEach(([label, items], poolIndex) => {
    deterministicShuffle(combinations(items, 3), 173 + poolIndex).slice(0, 200).forEach(options => cards.push({ text: `Kiss, marry, avoid: ${label}.`, options }))
  })
  return takeTarget(cards, TARGET_PER_MODE, mode === 'friend' ? 173 : 179)
}

function dareCards(mode) {
  const values = mode === 'friend' ? dareValuesFriend : dareValuesRelationship
  const out = dareFamilies.flatMap(make => make(values).map(text => ({ text })))
  const safeExtras = mode === 'friend' ? [
    'Send the last meme you saved that you would be comfortable sharing.',
    'Send a voice note doing your best impression of a strict secondary school teacher.',
    'Send the oldest school photo on your phone that you are comfortable sharing.',
    'Send a screenshot of the last song you played.',
    'Send the last food picture you took.',
    'Send a voice note describing your day like a dramatic Nollywood trailer.',
    'Send one photo of something in your room that has a story behind it.',
    'Send a song you think the other person would like but might not know.',
    'Send the funniest sticker in your WhatsApp favourites.',
    'Send a voice note explaining your most controversial Nigerian food opinion.',
  ] : [
    'Send a song that reminds you of the other person.',
    'Send a voice note saying the first thing you noticed about the other person.',
    'Send a photo from your phone that makes you think of a date you would enjoy.',
    'Send a voice note describing your ideal low-budget date in Nigeria.',
    'Send one compliment you have thought before but never said.',
    'Send a screenshot of a song you would put on a playlist for both of you.',
    'Send a voice note telling one funny thing you think both of you would argue about if you lived together.',
    'Send a photo of a Nigerian meal you would happily share with the other person.',
    'Send one emoji that describes your current mood towards the other person and let them guess why.',
    'Send a voice note describing the kind of weekend trip you would plan together.',
  ]
  safeExtras.forEach(text => out.push({ text }))
  return takeTarget(out, Math.floor(TARGET_PER_MODE / 2), mode === 'friend' ? 181 : 191)
}

function truthCards(mode) {
  const topics = mode === 'friend' ? friendTruthTopics : relationshipTruthTopics
  const templates = mode === 'friend' ? truthTemplatesFriend : truthTemplatesRelationship
  return topicGame(topics, templates, Math.ceil(TARGET_PER_MODE / 2), mode === 'friend' ? 193 : 197)
}

function buildGameSource(categoryId, mode) {
  const pools = mode === 'friend' ? friendOptionPools : relationshipOptionPools
  if (categoryId === 'rank-these') return poolCards(pools, 5, label => `Rank these ${label} from first choice to last.`, TARGET_PER_MODE, 211)
  if (categoryId === 'one-has-to-go') return poolCards(pools, 4, label => `One has to go from these ${label}.`, TARGET_PER_MODE, 223)
  if (categoryId === 'keep-one-forever') return poolCards(pools, 4, label => `You keep only one from these ${label}.`, TARGET_PER_MODE, 227)
  if (categoryId === 'this-or-that') return poolCards(pools, 2, (label, options) => `${options[0]} or ${options[1]}?`, TARGET_PER_MODE, 229)
  if (categoryId === 'if-you-had-to-choose') return ifChooseCards(mode)
  if (categoryId === 'kiss-marry-avoid') return kissMarryAvoidCards(mode)
  if (categoryId === 'guess-my-answer' || categoryId === 'how-well-do-you-know-me') return guessCards(mode, categoryId)
  if (categoryId === 'agree-disagree') return agreeCards(mode)
  if (categoryId === 'rate-it') return rateCards(mode)
  if (categoryId === 'red-green-depends') return behaviourCards(mode === 'friend' ? friendBehaviours : relationshipBehaviours, TARGET_PER_MODE, mode === 'friend' ? 233 : 239)
  if (categoryId === 'petty-or-valid') return pettyCards(mode === 'friend' ? friendPettySituations : relationshipPettySituations, TARGET_PER_MODE, mode === 'friend' ? 241 : 251)
  if (categoryId === 'tell-the-story') return storyCards(mode)
  if (categoryId === 'never-have-i-ever') return neverCards(mode)
  if (categoryId === 'two-truths-lie') return twoTruthsCards(mode)
  if (categoryId === 'what-would-you-do') return whatWouldYouDoCards(mode)
  if (categoryId === 'who-is-more-likely') return whoLikelyCards(mode)
  if (categoryId === 'finish-the-sentence') return finishCards(mode)
  if (categoryId === 'truth-dare') {
    return [...truthCards(mode).map(card => ({ ...card, subtype: 'Truth' })), ...dareCards(mode).map(card => ({ ...card, subtype: 'Dare' }))]
  }
  return []
}

const verdictLabels = {
  'agree-disagree': ['Agree', 'Disagree'],
  'red-green-depends': ['Red Flag', 'Green Flag', 'Depends'],
  'petty-or-valid': ['Petty', 'Valid', 'Both'],
}

function formatChoices(categoryId, card) {
  if (card.statements?.length) return card.statements.map((statement, index) => `${index + 1}. ${statement}`).join('\n')
  if (!card.options?.length) return ''
  if (categoryId === 'rank-these') return card.options.map((option, index) => `${index + 1}. ${option}`).join('\n')
  return card.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`).join('\n')
}

const cache = new Map()

export function buildNigeriaGamePrompts(categoryId, mode) {
  const key = `${categoryId}:${mode}`
  if (cache.has(key)) return cache.get(key)
  const category = gameCategories.find(item => item.id === categoryId)
  if (!category) return []
  const raw = uniqueByText(buildGameSource(categoryId, mode))
  const expected = TARGET_PER_MODE
  if (raw.length < expected) throw new Error(`${categoryId}/${mode} has ${raw.length}, expected ${expected}`)
  const selected = deterministicShuffle(raw, categoryId.length * 29 + (mode === 'relationship' ? 17 : 3)).slice(0, expected)

  const prompts = selected.map((card, index) => {
    const intensity = intensityFor(mode, index)
    const choices = formatChoices(categoryId, card)
    const labels = verdictLabels[categoryId] || null
    const displayExtra = choices || labels?.join('  ·  ') || ''
    const text = displayExtra ? `${card.text}\n\n${displayExtra}` : card.text
    const copyText = displayExtra ? `${card.text}\n\n${choices || labels.join(' · ')}` : card.text
    return {
      id: `ng750-game-${categoryId}-${mode}-${index}`,
      categoryId,
      categoryName: category.name,
      mode,
      text,
      copyText,
      intensity,
      stage: mode === 'relationship' ? stageFor(index) : null,
      audience: audienceFor(intensity),
      faithType: null,
      subtype: card.subtype || null,
      mechanic: category.mechanic,
      options: card.options || null,
      statements: card.statements || null,
      responseLabels: labels,
      tags: [category.name.toLowerCase(), mode, intensity.toLowerCase(), 'nigeria', 'nigeria-first', 'game'],
    }
  })

  cache.set(key, prompts)
  return prompts
}

export const nigeriaGameCategoryIds = new Set(gameCategories.map(item => item.id))
