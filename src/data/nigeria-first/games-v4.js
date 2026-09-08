import { gameCategories } from '../categories.js'
import { buildNigeriaGamePrompts as buildV2NigeriaGamePrompts, nigeriaGameCategoryIds } from './games-v2.js'
import {
  TARGET_PER_MODE,
  audienceFor,
  combinations,
  deterministicShuffle,
  intensityFor,
  stageFor,
  takeTarget,
} from './helpers.js'

const friendKmaPools = [
  ['secondary school characters', ['The class clown','The quiet genius','The popular student','The football star','The strict prefect','The teacher’s favourite','The person who always had snacks','The person who always borrowed notes','The stylish student','The mysterious transfer student']],
  ['friend-group personalities', ['The funny one','The calm one','The ambitious one','The adventurous one','The homebody','The social butterfly','The bookworm','The fashion lover','The foodie','The person who knows everybody']],
  ['Nigerian wedding characters', ['The DJ','The MC','The photographer','The stylish guest','The person dancing all night','The cousin who knows everybody','The quiet person at the table','The person helping with food','The friend of the couple','The person who came mainly for food']],
  ['career personalities', ['The doctor','The lawyer','The software engineer','The entrepreneur','The designer','The banker','The teacher','The musician','The photographer','The chef']],
  ['people on a group trip', ['The itinerary planner','The late person','The person with snacks','The photographer','The person who sleeps in the bus','The person who wants every activity','The person who wants to rest','The person who knows the best food spots','The person who forgets something important','The person who keeps everybody laughing']],
  ['people at a house party', ['The person controlling the music','The person in the kitchen','The person playing games','The person taking pictures','The person telling stories','The person leaving early','The person who brought extra food','The person who knows nobody but makes friends','The quiet person','The person who wants an after-party']],
  ['people in a work team', ['The organised planner','The last-minute genius','The quiet hard worker','The presenter','The person who asks every question','The person who knows everybody','The person who keeps meetings short','The person who brings snacks','The person who volunteers for everything','The person who always has another idea']],
]

const relationshipKmaPools = [
  ['dating personalities', ['The hopeless romantic','The ambitious career person','The calm homebody','The spontaneous traveller','The funny extrovert','The quiet deep thinker','The family-first person','The creative type','The disciplined saver','The generous spender']],
  ['talking-stage personalities', ['The fast replier','The voice-note person','The late-night caller','The person who plans proper dates','The person who sends songs','The person who asks deep questions','The playful teaser','The person who is always busy','The person who remembers every detail','The person who keeps things private']],
  ['future-partner personalities', ['The homebody','The traveller','The entrepreneur','The corporate professional','The creative','The saver','The spender','The family-first person','The social butterfly','The quiet planner']],
  ['people at a Nigerian wedding', ['The wedding photographer','The stylish guest','The DJ','The friend of the bride','The friend of the groom','The person dancing all night','The person helping everyone','The quiet person at the table','The person who knows everybody','The person who came mainly for food']],
  ['date personalities', ['The person who plans everything','The person who says “surprise me”','The foodie','The cinema person','The games-night person','The beach person','The concert person','The stay-at-home person','The spontaneous person','The person who always takes pictures']],
  ['communication styles', ['The caller','The texter','The voice-note person','The meme sender','The face-to-face talker','The person who needs time before replying','The person who talks things out immediately','The long-message person','The short-reply person','The person who checks in throughout the day']],
  ['money personalities', ['The strict saver','The generous spender','The budget planner','The investor','The person who spends on experiences','The gift giver','The person who hates debt','The person who supports family heavily','The person who tracks every expense','The person who rarely checks their balance']],
]

function buildKma(mode) {
  const pools = mode === 'friend' ? friendKmaPools : relationshipKmaPools
  const cards = []
  pools.forEach(([label, items], poolIndex) => {
    deterministicShuffle(combinations(items, 3), 601 + poolIndex * 11).forEach(options => {
      cards.push({ text: `Kiss, marry, avoid. ${label}:`, options })
    })
  })
  return takeTarget(cards, TARGET_PER_MODE, mode === 'friend' ? 607 : 613)
}

const friendNeverThemes = {
  school: ['hidden a bad result from home','lied about why I was late to school','copied homework because I forgot mine','borrowed notes the night before a test','slept during a lesson or prep','had a school crush nobody knew about','got punished for something I definitely did','used lunch money for something else','avoided a teacher because I knew I was in trouble','helped a friend hide from trouble','checked a result and delayed telling my parents','forgot an important school item at home','laughed during assembly when I was meant to be serious','pretended to be sick because I did not want to go to school','been late because I underestimated how long getting ready would take'],
  family: ['pretended to be asleep when chores were being shared','asked one parent after the other parent already said no','hidden a purchase from my parents','lied about where I was going','avoided a relative because I knew they would ask personal questions','eaten food meant for somebody else at home','blamed a sibling or cousin for something small','left a family event earlier than expected','pretended not to hear when I was sent on an errand','used a sibling’s thing without asking','kept money a relative gave me instead of telling my parents','made up an excuse to avoid a family visit','laughed at the wrong time during a serious family moment','ignored a family group chat on purpose','answered a family question with a vague answer because I did not want follow-up questions'],
  phone: ['viewed somebody’s story while ignoring their message','deleted a message because I regretted sending it','turned off read receipts because of one person','muted a group chat and forgot it existed','archived a chat because I did not want to see it','pretended I did not see a call','saved somebody’s number under a strange name','checked who viewed my story more than once','posted something hoping one person would see it','removed a post because the engagement was poor','sent a voice note longer than five minutes','listened to a voice note at double speed','taken a screenshot and immediately sent it to a friend','used somebody else’s hotspot too confidently','searched somebody online after meeting them once'],
  money: ['spent money I was meant to save','ordered food after saying I needed to stop spending','borrowed money and felt awkward about repayment','lent money and regretted it','bought something mainly because it was on sale','checked my balance before agreeing to an outing','used unexpected money for something unserious','hidden how much I spent on something','paid for people and later wished we had split the bill','joined a savings plan and struggled to stay consistent','bought a gift that cost more than I planned','delayed buying something important because I wanted something fun first','looked rich outside while budgeting heavily inside','spent more than planned at a wedding','cancelled a plan because transport alone was becoming too expensive'],
  adulting: ['said I was five minutes away when I had not left home','cancelled plans because I wanted to stay in bed','ignored laundry until I had almost nothing left to wear','ordered food because I could not face cooking','forgot an appointment I had written down','worked from bed for most of a day','stayed awake too late even though I had work early','made a to-do list and ignored most of it','avoided checking my balance after a weekend out','left home late and blamed traffic anyway','forgot to return a call for several days','planned to exercise and chose sleep instead','used a power cut as an excuse to stop working','carried a power bank that was also almost dead','paid for convenience because I was too tired to do the cheaper thing'],
  friendship: ['felt jealous when a close friend became closer to somebody else','avoided telling a friend I disliked who they were dating','shared a screenshot of a chat with another friend','forgot a friend’s birthday','cancelled plans because another option sounded better','pretended I was not annoyed when a friend disappointed me','borrowed something from a friend and kept it too long','given advice I do not follow myself','stayed in a friendship longer than I wanted to','felt left out after seeing friends together online','said “I am fine” when I wanted a friend to ask again','compared my progress with a friend’s progress','felt some type of way when a friend did not support something important to me','avoided a difficult conversation with a friend','forgiven a friend but never trusted them the same way again'],
  food: ['eaten somebody else’s food from the fridge','said I was not hungry and then eaten from somebody’s plate','ordered the same meal because I was scared to try something new','taken extra party food home','hidden snacks so nobody else would finish them','judged somebody a little because of their food choice','put too much pepper in food and pretended it was fine','eaten a full meal and still ordered something later','spent more on food than I planned in one day','gone somewhere mainly because I heard the food would be good','claimed I could cook something better than I actually could','burnt food and still tried to rescue it','eaten leftovers for breakfast','refused to share the last piece of meat','bought a snack while saying I was saving money'],
  travel: ['missed my stop because I was distracted','fallen asleep during a long road trip and woken up confused','packed too much for a short trip','forgot something important on a trip','arrived at a bus park later than planned','chosen comfort over the cheapest transport option','cancelled a trip because the logistics became stressful','gone on a trip without enough cash','spent too much on food while travelling','pretended I knew where I was going when I did not','used Google Maps and still got confused','complained throughout a trip and still enjoyed it','taken more pictures than expected on a trip','returned from a trip with almost no money left','decided I liked a Nigerian city more than I expected'],
  work: ['pretended to understand something at work and learnt it later','made a mistake at work and hoped nobody would notice','delayed replying to a work message after hours','taken a job mainly because of the salary','thought seriously about resigning during a bad week','used a meeting to do other work quietly','become close friends with a colleague','checked a job board while still employed','applied for a role I did not feel fully qualified for','felt jealous of somebody else’s promotion','stayed late because I did not finish what I planned','complained about work and still defended the job to outsiders','ignored a work call because I needed a break','changed my career plan because of money','considered relocating because of work'],
  social: ['gone to an event mainly because I wanted to dress up','gone to a wedding mainly because of the food and people','left a party without telling everybody goodbye','pretended I knew somebody at an event when I barely remembered them','taken too many pictures before enjoying the moment','worn something uncomfortable because it looked good','avoided somebody at an event','stayed longer than I wanted because my friends were still there','gone home and immediately judged all my pictures','posted a picture days later as if it was recent','met somebody at an event and searched for them online afterwards','said I was leaving and stayed another hour','gone somewhere I did not want to go because of one friend','spent more than planned getting ready for an event','recognised somebody from social media and pretended not to'],
}

const relationshipNeverThemes = {
  talking: ['stayed in a talking stage I knew was going nowhere','replied slowly on purpose because I did not want to look too interested','checked whether someone viewed my story after I posted','asked a friend to analyse a message from somebody I liked','pretended I was less interested than I really was','continued talking to somebody because the attention felt good','ghosted somebody instead of explaining why I lost interest','been ghosted and still checked the person’s page','talked to more than one person before becoming exclusive','ignored a red flag because I liked the person','looked through somebody’s social media before a first date','changed an outfit several times before seeing somebody','lied about being busy because I wanted space','stayed on a call far later than planned because I liked the person','wondered whether a good morning text meant more than it did'],
  jealousy: ['pretended I was not jealous when I was','checked who somebody I liked was following','felt jealous of a close friend of somebody I was dating','asked a question I already knew the answer to because I wanted reassurance','noticed who liked my partner’s post','felt some type of way about an ex still being around','compared myself with somebody from a partner’s past','said something did not bother me and brought it up later','looked at an old picture and overthought it','wanted reassurance but acted like I did not need it','felt jealous over something I knew was harmless','asked a friend whether I was overreacting before speaking to my partner','felt insecure because of something on social media','wanted somebody to unfollow a person but felt awkward saying it','realised my jealousy was more about my insecurity than the situation'],
  communication: ['sent a long message during an argument','deleted a message before my partner could read it','fallen asleep during a serious conversation','asked for space and then wanted the person to check on me anyway','said “nothing” when something was clearly wrong','avoided a call because I did not feel ready to talk','rehearsed what I wanted to say before a difficult conversation','used humour because a conversation felt too tense','spoken to a friend before speaking to my partner about an issue','misread the tone of a text and became annoyed','wanted an apology but struggled to explain what hurt me','said something harsh because I was angry and regretted it','needed time to cool down before I could communicate properly','expected somebody to notice my mood without me explaining it','ended an argument still feeling unheard'],
  money: ['felt awkward discussing who should pay on a date','spent more on a gift than I planned','wondered whether a partner’s spending habits were a red flag','avoided telling someone exactly how much I earned','felt uncomfortable borrowing money from a partner','lent money to somebody I was dating','judged somebody a little because of how they handled money','wanted to save while a partner wanted to enjoy the money now','had a serious conversation about supporting family financially','worried about whether different income levels would cause problems','felt pressure to plan an expensive date','chosen a cheaper date and enjoyed it more','thought about wedding costs before thinking about the wedding itself','wanted clearer boundaries around money with extended family','realised financial compatibility mattered more than I expected'],
  family: ['felt nervous about meeting somebody’s parents','worried about whether a family would approve of me','asked a partner what their family knew about me','felt uncomfortable about a relative getting too involved','wondered how two different family cultures would work together','thought about where Christmas would be spent after marriage','worried about family expectations around a wedding','felt pressure from questions about marriage','wanted a partner to defend me when family crossed a line','wondered how much support both families would expect financially','thought about how tribe or ethnicity might affect family reactions','thought about how religion might affect family reactions','wanted clearer boundaries with extended family','felt caught between a partner and a family member','realised marrying somebody also means learning how their family works'],
  affection: ['wanted more affection but felt awkward asking for it','sent a song instead of saying exactly how I felt','kept a picture because I liked how the moment felt','missed somebody and waited for them to say it first','wanted a hug more than advice after a hard day','planned a small surprise because I remembered a detail','felt more loved by an ordinary thoughtful act than an expensive gift','wanted more quality time during a busy period','felt rejected because somebody was less affectionate than usual','used food as a way of showing care','stayed on a call even when there was nothing urgent to say','wanted public affection but knew the other person was private','wanted private affection but disliked public displays','felt closer after doing something completely ordinary together','realised consistency was more attractive than grand gestures'],
  future: ['thought seriously about whether I want to get married','thought about genotype before a relationship became serious','wondered whether I want children','worried about where I would want to raise a family','thought about relocating abroad with a partner','thought about staying in Nigeria long term with a partner','wondered how careers would affect where we live','thought about supporting parents after marriage','worried about wedding expectations from family','thought about whether I want a big wedding or a small one','wondered how household responsibilities should be shared','thought about whether I would combine finances after marriage','wondered how faith would shape a future home','thought about how much privacy a married couple should have','wondered whether love alone is enough for a long-term relationship'],
  boundaries: ['wanted clearer boundaries around exes','wanted clearer boundaries around opposite-sex friendships','felt uncomfortable with how much a partner shared online','wanted more privacy around my phone','wondered whether sharing passwords creates trust or pressure','felt uncomfortable with family knowing too much about the relationship','wanted more time alone without it meaning anything was wrong','felt awkward setting a boundary because I did not want to seem difficult','ignored a boundary issue because everything else felt good','realised a small repeated behaviour bothered me more than one big incident','wanted a partner to tell friends less about our arguments','felt uncomfortable with somebody checking my location too often','wondered whether keeping an ex as a friend would bother me','wanted clarity about what counts as flirting','realised I needed a boundary I had never needed before'],
  conflict: ['brought up an old issue during a new argument','said sorry before I fully understood what I did wrong','accepted an apology but still needed time to trust again','gone quiet because I was afraid I would say something worse','raised my voice and regretted it','wanted to solve an argument immediately while the other person needed space','felt frustrated because an apology did not come with changed behaviour','been more focused on being right than understanding the other person','needed reassurance after an argument even after things were resolved','asked a friend whether I was wrong before apologising','realised I was arguing about something smaller than the real issue','said “it is fine” when it was not fine','wanted a conversation to end because I felt overwhelmed','needed a night to sleep before discussing an issue','felt closer after resolving a difficult disagreement properly'],
}

const neverModifiers = [
  item => `Never have I ever ${item}.`,
  item => `Never have I ever ${item} and then acted like it was nothing.`,
  item => `Never have I ever ${item} and only admitted it to one person.`,
  item => `Never have I ever ${item} and regretted it almost immediately.`,
  item => `Never have I ever ${item} and laughed about it later.`,
]

function buildNever(mode) {
  const themes = mode === 'friend' ? friendNeverThemes : relationshipNeverThemes
  const cards = []
  Object.values(themes).forEach(items => items.forEach(item => neverModifiers.forEach(make => cards.push({ text: make(item) }))))
  return takeTarget(cards, TARGET_PER_MODE, mode === 'friend' ? 617 : 619)
}

const friendTwoTruthPools = [
  ['secondary school', ['I was once a prefect.','I had a school crush.','I was punished for lateness.','I copied homework before class.','I enjoyed morning assembly.','I once hid a result from home.','I had a favourite teacher.','I was known for talking in class.','I joined inter-house sports.','I once got into trouble for laughing.','I had a teacher who scared me.','I borrowed notes before a test.','I once forgot an important school item at home.','I had a nickname in school.','I stayed friends with somebody from secondary school.']],
  ['Nigerian childhood', ['I played football in the street or compound.','I played ten-ten.','I played ludo or whot often.','I scratched recharge cards carefully.','I used Opera Mini.','I had a 2go account.','I borrowed somebody’s phone to make calls.','I watched old Nollywood on VCD or DVD.','I had a favourite childhood snack.','I got sent on errands immediately after sitting down.','I had a strict curfew.','I shared a room with siblings or relatives.','I got excited when NEPA brought light.','I watched cartoons before school.','I had one outfit I wore too often.']],
  ['money', ['I track my spending.','I have spent money meant for savings.','I have lent a friend money.','I have borrowed money from a friend.','I have joined a contribution or savings group.','I have hidden how much I spent on something.','I have paid for a whole group before.','I have cancelled plans because of money.','I have used unexpected money for enjoyment.','I have saved towards a big purchase.','I have regretted an impulse purchase.','I compare prices before buying.','I keep emergency money somewhere.','I have overspent at an event.','I have gone out and checked my balance immediately after.']],
  ['food', ['I prefer party jollof to homemade jollof.','I can eat suya at almost any time.','I have taken extra food home from a party.','I have hidden snacks from people at home.','I have a food combination people judge me for.','I prefer swallow to rice.','I have ordered food while food was already at home.','I have eaten from somebody’s plate after saying I was not hungry.','I have a favourite buka or roadside spot.','I think some Nigerian food is overrated.','I have burnt food and still eaten it.','I have spent too much money on food in one day.','I have eaten leftovers for breakfast.','I have refused to share the last piece of meat.','I choose restaurants based on one specific meal.']],
  ['social life', ['I have gone to a wedding mainly for food.','I have left an event without saying goodbye to everyone.','I have pretended to recognise somebody I did not remember.','I have searched for somebody online after meeting them once.','I have stayed at an event longer because of one person.','I have dressed up more than the event required.','I have arrived late to an event after promising to be early.','I have taken more pictures than I needed.','I have posted a picture days after the event.','I have avoided somebody at a party.','I have met a friend through another friend.','I have gone somewhere I did not want to go because my friends insisted.','I have danced more than I planned at a wedding.','I have gone home and judged all my pictures immediately.','I have spent too much getting ready for an outing.']],
]

const relationshipTwoTruthPools = [
  ['talking stage', ['I have replied slowly on purpose.','I have asked a friend to analyse a message.','I have checked whether somebody viewed my story.','I have stayed on a call far later than planned.','I have pretended to be less interested than I was.','I have ignored a red flag because I liked somebody.','I have looked through somebody’s social media before a date.','I have changed outfits several times before seeing somebody.','I have sent a song because I did not know what else to say.','I have overthought a dry reply.','I have talked to more than one person before becoming exclusive.','I have been ghosted.','I have ghosted somebody.','I have wondered whether a good morning text meant something deeper.','I have known a talking stage was going nowhere and stayed anyway.']],
  ['relationship habits', ['I like good morning messages.','I prefer calls to long texts.','I need time to cool off during arguments.','I prefer resolving disagreements immediately.','I enjoy planning dates.','I like spontaneous dates.','I remember small details people tell me.','I use food as a way of showing care.','I prefer private relationships online.','I enjoy public affection.','I need regular reassurance.','I value time alone even in a relationship.','I enjoy long late-night calls.','I prefer practical gifts to romantic gifts.','I think consistency matters more than grand gestures.']],
  ['future', ['I want to get married.','I have a clear idea of how many children I want.','I would consider relocating abroad with a partner.','I would consider staying in Nigeria long term.','I want to own a home.','I want to support my parents financially after marriage.','I have thought about genotype before dating seriously.','I prefer a small wedding.','I prefer a big wedding.','I want shared financial goals in marriage.','I would keep some money separate after marriage.','I care about living near family.','I want faith to shape my future home.','I have thought about how chores should be divided.','I have a strong opinion about where I want to raise a family.']],
  ['boundaries', ['I would not share my phone password.','I would share my phone password.','I think exes need clear boundaries.','I am comfortable with close opposite-sex friendships.','I prefer relationship arguments to stay private.','I would not want family involved in relationship decisions.','I need alone time without it meaning something is wrong.','I care about what gets posted online.','I would share my location with a partner.','I would not want constant location checking.','I think flirting has a clear line.','I think some boundaries depend on the couple.','I would tell a partner if an ex contacted me.','I would want honesty about debt before marriage.','I think privacy still matters in a serious relationship.']],
  ['money and dating', ['I am comfortable splitting a date bill.','I like paying for dates sometimes.','I prefer when one person plans the whole date.','I think financial compatibility matters a lot.','I would discuss income before marriage.','I would discuss debt before marriage.','I would save towards a major goal with a partner.','I have bought a gift that cost more than planned.','I prefer experiences to expensive gifts.','I think supporting family needs clear boundaries.','I would rather have a cheap thoughtful date than an expensive boring one.','I track my spending.','I think different income levels need honest conversations.','I would avoid borrowing from a partner if possible.','I think wedding spending should have a strict budget.']],
]

function buildTwoTruths(mode) {
  const pools = mode === 'friend' ? friendTwoTruthPools : relationshipTwoTruthPools
  const cards = []
  pools.forEach(([label, statements], poolIndex) => {
    deterministicShuffle(combinations(statements, 3), 631 + poolIndex * 13).forEach(group => {
      cards.push({ text: `Two truths and a lie. Use these three ${label} statements and make one the lie.`, statements: group })
    })
  })
  return takeTarget(cards, TARGET_PER_MODE, mode === 'friend' ? 641 : 643)
}

const friendTruthSubjects = ['secondary school','your strictest parent rule','a school crush','saving money','your spending habits','your closest friendship','a friendship you outgrew','your search history','your camera roll','your worst lateness story','Lagos or city traffic','your family WhatsApp group','your career','your biggest current goal','relocating abroad','staying in Nigeria','your childhood','a lie you told growing up','an embarrassing school memory','your worst purchase','a secret talent','your most unreasonable pet peeve','somebody you miss','a friend you owe an apology','a time you felt jealous','a time you felt left out','a bad habit','a fear you rarely admit','the last time you cried','something you regret','something you are proud of','a family expectation','your relationship with money','a person you misjudged','an opportunity you almost missed','a wedding story','a food opinion','a music opinion','a Nollywood opinion','a time you got caught lying','a time you broke a rule','a time you disappointed somebody','a time somebody disappointed you','an insecurity','a friendship boundary','a family boundary','a belief you changed','a faith question','a decision your parents disagreed with','the last thing you stalked online']
const relationshipTruthSubjects = ['your first impression of me','the first thing you found attractive','jealousy','an ex','social media boundaries','phone privacy','money in relationships','who pays for dates','financial support for family','meeting parents','family approval','tribe or ethnicity','faith','genotype','marriage','children','relocation abroad','living in Nigeria long term','career sacrifice','household responsibilities','affection','physical touch','quality time','gifts','good morning messages','late-night calls','arguments','apologies','needing space','reassurance','trust','a relationship red flag','a relationship green flag','something you used to tolerate','a past relationship lesson','a mistake you made while dating','a time you ignored a red flag','a time you overthought a message','a family boundary','a money boundary','opposite-sex friendships','staying friends with an ex','posting a partner online','sharing passwords','sharing locations','long distance','wedding expectations','supporting parents after marriage','saving together','debt','where to live']
const truthFramesFriend = [
  subject => `What is the most honest thing you can say about ${subject}?`,
  subject => `What is one story about ${subject} you rarely tell people?`,
  subject => `What is one thing about ${subject} you wish you handled differently?`,
  subject => `What would your closest friend say about you when it comes to ${subject}?`,
  subject => `What is one thing about ${subject} you changed your mind about?`,
  subject => `What is the most embarrassing part of your history with ${subject}?`,
  subject => `What is one thing about ${subject} you would answer differently now than three years ago?`,
  subject => `What is one thing about ${subject} you still do not have figured out?`,
]
const truthFramesRelationship = [
  subject => `What is the most honest thing you can say about ${subject}?`,
  subject => `What is one thing about ${subject} you would rather tell me directly than let me assume?`,
  subject => `What has your past taught you about ${subject}?`,
  subject => `What is one boundary you have around ${subject}?`,
  subject => `What is one thing about ${subject} you think couples avoid discussing too long?`,
  subject => `What would make you feel respected by me when it comes to ${subject}?`,
  subject => `What is one fear you have around ${subject}?`,
  subject => `What is one thing you would want us to agree on about ${subject}?`,
]
const friendDareSubjects = ['your secondary school days','your favourite Nigerian food','an old Nigerian song','your funniest friend','your family','your city','Lagos traffic','a childhood memory','your first phone','2go or BlackBerry days','your workday','your weekend','a food opinion','a music opinion','a film opinion','your favourite snack','your last outing','your last trip','a school crush story','your worst lateness story','a funny family rule','a bad purchase','something you are saving for','your current goal','a Nigerian city you like','a wedding memory','the last thing that made you laugh','a harmless unpopular opinion','your favourite comfort meal','a friend-group memory','a time power went out at the worst moment','your most-used app','your favourite place to eat','a song linked to a memory','your most Nigerian childhood memory','a skill people do not expect you to have','a silly pet peeve','a story your family still tells','a time you got lost','a time you overspent','your favourite school teacher','a school punishment','a childhood game','a favourite cousin memory','a road-trip memory','a food you refuse to share','a Nigerian artist you recommend','a Nigerian film you recommend','your ideal free Saturday','your best cheap meal']
const relationshipDareSubjects = ['your first impression of me','the first thing you noticed about me','a song that reminds you of me','a date you would enjoy','a low-budget date in Nigeria','a Nigerian city you would visit with me','a compliment you have not said yet','a funny thing we would argue about','a relationship green flag','a relationship hot take','your ideal weekend together','a memory you want us to make','a song for a couple playlist','a film you would watch with me','a food you would cook for me','a place you would take me in your city','a small romantic gesture','your favourite kind of affection','a future trip','a thing you would want us to save for','a Nigerian wedding opinion','a playful nickname','an embarrassing dating story','a harmless confession','a first-date opinion','a money opinion','a social-media boundary','a phone boundary','a family boundary','a relationship value','a faith value','a future goal','a relocation opinion','a date idea that costs almost nothing','a late-night food run','a question you have wanted to ask me','something you think we have in common','something you think we are opposite about','a family question you think matters','a money question you think matters','a future question you think matters','an old song you would send me','a weekend plan','a church or faith conversation','a relationship lesson you learnt','a small thing you would want more of','a story you would want to hear from me','a thing you would want us to laugh about when we are older','a Nigerian city you think suits me','a gift you think I would like']
const dareFrames = [
  subject => `Send a voice note about ${subject}. Keep it under one minute.`,
  subject => `Send one photo that represents ${subject}, if you are comfortable sharing it.`,
  subject => `Send a song that fits ${subject}, then explain your choice.`,
  subject => `Give ${subject} a score from 1 to 10 in a voice note and defend the score.`,
  subject => `Say your hottest take about ${subject} in one sentence.`,
  subject => `Tell the funniest story you have about ${subject} without typing more than four lines.`,
  subject => `Pick one word for ${subject}, then explain why you chose it.`,
  subject => `Describe ${subject} using only three words first, then explain yourself.`,
]

function buildTruthDare(mode) {
  const subjects = mode === 'friend' ? friendTruthSubjects : relationshipTruthSubjects
  const frames = mode === 'friend' ? truthFramesFriend : truthFramesRelationship
  const truths = subjects.flatMap(subject => frames.map(make => ({ text: make(subject), subtype: 'Truth' })))
  const dareSubjects = mode === 'friend' ? friendDareSubjects : relationshipDareSubjects
  const dares = dareSubjects.flatMap(subject => dareFrames.map(make => ({ text: make(subject), subtype: 'Dare' })))
  return [
    ...takeTarget(truths, 375, mode === 'friend' ? 647 : 653),
    ...takeTarget(dares, 375, mode === 'friend' ? 659 : 661),
  ]
}

function formatOptions(card) {
  if (card.statements?.length) return card.statements.map((statement, index) => `${index + 1}. ${statement}`).join('\n')
  if (!card.options?.length) return ''
  return card.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`).join('\n')
}

function wrap(categoryId, mode, cards) {
  const category = gameCategories.find(item => item.id === categoryId)
  return deterministicShuffle(cards, categoryId.length * 43 + (mode === 'relationship' ? 17 : 7)).map((card, index) => {
    const intensity = intensityFor(mode, index)
    const optionText = formatOptions(card)
    const text = optionText ? `${card.text}\n\n${optionText}` : card.text
    return {
      id: `ng750-game-${categoryId}-${mode}-${index}`,
      categoryId,
      categoryName: category.name,
      mode,
      text,
      copyText: text,
      intensity,
      stage: mode === 'relationship' ? stageFor(index) : null,
      audience: audienceFor(intensity),
      faithType: null,
      subtype: card.subtype || null,
      mechanic: category.mechanic,
      options: card.options || null,
      statements: card.statements || null,
      responseLabels: null,
      tags: [category.name.toLowerCase(), mode, intensity.toLowerCase(), 'nigeria', 'nigeria-first', 'game'],
    }
  })
}

export function buildNigeriaGamePrompts(categoryId, mode) {
  if (categoryId === 'kiss-marry-avoid') return wrap(categoryId, mode, buildKma(mode))
  if (categoryId === 'never-have-i-ever') return wrap(categoryId, mode, buildNever(mode))
  if (categoryId === 'two-truths-lie') return wrap(categoryId, mode, buildTwoTruths(mode))
  if (categoryId === 'truth-dare') return wrap(categoryId, mode, buildTruthDare(mode))
  return buildV2NigeriaGamePrompts(categoryId, mode)
}

export { nigeriaGameCategoryIds }
