import { gameCategories } from '../categories.js'
import { buildNigeriaGamePrompts as buildV4NigeriaGamePrompts, nigeriaGameCategoryIds } from './games-v4.js'
import { TARGET_PER_MODE, audienceFor, deterministicShuffle, intensityFor, stageFor, takeTarget } from './helpers.js'

const relationshipNeverBase = [
  'stayed in a talking stage I knew was going nowhere','replied slowly on purpose because I did not want to look too interested','checked whether someone viewed my story after I posted','asked a friend to analyse a message from somebody I liked','pretended I was less interested than I really was','continued talking to somebody because the attention felt good','ghosted somebody instead of explaining why I lost interest','been ghosted and still checked the person’s page','talked to more than one person before becoming exclusive','ignored a red flag because I liked the person','looked through somebody’s social media before a first date','changed an outfit several times before seeing somebody','lied about being busy because I wanted space','stayed on a call far later than planned because I liked the person','wondered whether a good morning text meant more than it did',
  'pretended I was not jealous when I was','checked who somebody I liked was following','felt jealous of a close friend of somebody I was dating','asked a question I already knew the answer to because I wanted reassurance','noticed who liked my partner’s post','felt some type of way about an ex still being around','compared myself with somebody from a partner’s past','said something did not bother me and brought it up later','looked at an old picture and overthought it','wanted reassurance but acted like I did not need it','felt jealous over something I knew was harmless','asked a friend whether I was overreacting before speaking to my partner','felt insecure because of something on social media','wanted somebody to unfollow a person but felt awkward saying it','realised my jealousy was more about my insecurity than the situation',
  'sent a long message during an argument','deleted a message before my partner could read it','fallen asleep during a serious conversation','asked for space and then wanted the person to check on me anyway','said “nothing” when something was clearly wrong','avoided a call because I did not feel ready to talk','rehearsed what I wanted to say before a difficult conversation','used humour because a conversation felt too tense','spoken to a friend before speaking to my partner about an issue','misread the tone of a text and became annoyed','wanted an apology but struggled to explain what hurt me','said something harsh because I was angry and regretted it','needed time to cool down before I could communicate properly','expected somebody to notice my mood without me explaining it','ended an argument still feeling unheard',
  'felt awkward discussing who should pay on a date','spent more on a gift than I planned','wondered whether a partner’s spending habits were a red flag','avoided telling someone exactly how much I earned','felt uncomfortable borrowing money from a partner','lent money to somebody I was dating','judged somebody a little because of how they handled money','wanted to save while a partner wanted to enjoy the money now','had a serious conversation about supporting family financially','worried about whether different income levels would cause problems','felt pressure to plan an expensive date','chosen a cheaper date and enjoyed it more','thought about wedding costs before thinking about the wedding itself','wanted clearer boundaries around money with extended family','realised financial compatibility mattered more than I expected',
  'felt nervous about meeting somebody’s parents','worried about whether a family would approve of me','asked a partner what their family knew about me','felt uncomfortable about a relative getting too involved','wondered how two different family cultures would work together','thought about where Christmas would be spent after marriage','worried about family expectations around a wedding','felt pressure from questions about marriage','wanted a partner to defend me when family crossed a line','wondered how much support both families would expect financially','thought about how tribe or ethnicity might affect family reactions','thought about how religion might affect family reactions','wanted clearer boundaries with extended family','felt caught between a partner and a family member','realised marrying somebody also means learning how their family works',
  'wanted more affection but felt awkward asking for it','sent a song instead of saying exactly how I felt','kept a picture because I liked how the moment felt','missed somebody and waited for them to say it first','wanted a hug more than advice after a hard day','planned a small surprise because I remembered a detail','felt more loved by an ordinary thoughtful act than an expensive gift','wanted more quality time during a busy period','felt rejected because somebody was less affectionate than usual','used food as a way of showing care','stayed on a call even when there was nothing urgent to say','wanted public affection but knew the other person was private','wanted private affection but disliked public displays','felt closer after doing something completely ordinary together','realised consistency was more attractive than grand gestures',
  'thought seriously about whether I want to get married','thought about genotype before a relationship became serious','wondered whether I want children','worried about where I would want to raise a family','thought about relocating abroad with a partner','thought about staying in Nigeria long term with a partner','wondered how careers would affect where we live','thought about supporting parents after marriage','worried about wedding expectations from family','thought about whether I want a big wedding or a small one','wondered how household responsibilities should be shared','thought about whether I would combine finances after marriage','wondered how faith would shape a future home','thought about how much privacy a married couple should have','wondered whether love alone is enough for a long-term relationship',
  'wanted clearer boundaries around exes','wanted clearer boundaries around opposite-sex friendships','felt uncomfortable with how much a partner shared online','wanted more privacy around my phone','wondered whether sharing passwords creates trust or pressure','felt uncomfortable with family knowing too much about the relationship','wanted more time alone without it meaning anything was wrong','felt awkward setting a boundary because I did not want to seem difficult','ignored a boundary issue because everything else felt good','realised a small repeated behaviour bothered me more than one big incident','wanted a partner to tell friends less about our arguments','felt uncomfortable with somebody checking my location too often','wondered whether keeping an ex as a friend would bother me','wanted clarity about what counts as flirting','realised I needed a boundary I had never needed before',
  'brought up an old issue during a new argument','said sorry before I fully understood what I did wrong','accepted an apology but still needed time to trust again','gone quiet because I was afraid I would say something worse','raised my voice and regretted it','wanted to solve an argument immediately while the other person needed space','felt frustrated because an apology did not come with changed behaviour','been more focused on being right than understanding the other person','needed reassurance after an argument even after things were resolved','asked a friend whether I was wrong before apologising','realised I was arguing about something smaller than the real issue','said “it is fine” when it was not fine','wanted a conversation to end because I felt overwhelmed','needed a night to sleep before discussing an issue','felt closer after resolving a difficult disagreement properly',
  'planned a date around Lagos traffic','cancelled a date because the logistics became too stressful','turned an ordinary errand into a date','sent food because I could not be there in person','fallen asleep on a call','watched a story before replying to a message','been annoyed by a dry reply after a good conversation','taken too long choosing where to eat','remembered a random detail somebody mentioned weeks earlier','checked whether somebody got home safely','sent a meme in the middle of a serious conversation','missed somebody more during an ordinary workday than during a big occasion','changed plans because of rain or traffic','chosen a cheap food spot and enjoyed the date more','sat in traffic talking long enough for the traffic to stop mattering'
]

const modifiers = [
  item => `Never have I ever ${item}.`,
  item => `Never have I ever ${item} and then acted like it was nothing.`,
  item => `Never have I ever ${item} and only admitted it to one person.`,
  item => `Never have I ever ${item} and regretted it almost immediately.`,
  item => `Never have I ever ${item} and laughed about it later.`
]

function buildRelationshipNever() {
  const category = gameCategories.find(item => item.id === 'never-have-i-ever')
  const cards = relationshipNeverBase.flatMap(item => modifiers.map(make => make(item)))
  const selected = takeTarget(cards.map(text => ({ text })), TARGET_PER_MODE, 811)
  return deterministicShuffle(selected, 821).map((card, index) => {
    const intensity = intensityFor('relationship', index)
    return {
      id: `ng750-game-never-have-i-ever-relationship-${index}`,
      categoryId: 'never-have-i-ever',
      categoryName: category.name,
      mode: 'relationship',
      text: card.text,
      copyText: card.text,
      intensity,
      stage: stageFor(index),
      audience: audienceFor(intensity),
      faithType: null,
      subtype: null,
      mechanic: category.mechanic,
      options: null,
      statements: null,
      responseLabels: null,
      tags: [category.name.toLowerCase(), 'relationship', intensity.toLowerCase(), 'nigeria', 'nigeria-first', 'game']
    }
  })
}

export function buildNigeriaGamePrompts(categoryId, mode) {
  if (categoryId === 'never-have-i-ever' && mode === 'relationship') return buildRelationshipNever()
  return buildV4NigeriaGamePrompts(categoryId, mode)
}

export { nigeriaGameCategoryIds }
