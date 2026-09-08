import { conversationCategories } from '../categories.js'
import { ngContext } from './context.js'
import { buildNigeriaConversationPrompts as buildV8NigeriaConversationPrompts, nigeriaConversationCategoryIds } from './conversations-v8.js'
import {
  TARGET_PER_MODE,
  audienceFor,
  deterministicShuffle,
  intensityFor,
  normalise,
  stageFor,
} from './helpers.js'

const familyExtras = [
  'the parent you asked when you wanted permission','the relative everybody listens to','the sibling or cousin who knows the most family gist','family expectations around school results','family expectations around career choices','family expectations around marriage','family expectations around helping relatives','how your family handled apologies','how your family handled money conversations','how your family handled birthdays','how your family handled Christmas','the relative who always asks the most personal questions','the family member who made gatherings more fun','the family member you could talk to most easily growing up','being sent on errands by older relatives','sharing food with siblings or cousins','being compared with another child','family prayers or devotional routines','visiting relatives during school holidays','travelling home for Christmas','family weddings','family burials that became reunions','cousins you only saw during holidays','being expected to greet every older person properly','who controlled the television remote at home','sharing a room with siblings or relatives','the kind of discipline your home used','the family rule you complained about most','the thing your family still teases you about','the family tradition you would happily keep','who usually settled arguments at home','who you called first when you needed help','the meal your family always made for celebrations','the relative whose house you enjoyed visiting most','family members arriving without much notice','helping prepare food for a family event','sharing rooms when relatives visited','the family member who always brought gifts','family members asking about your relationship status','the first person at home who knew when something was wrong','how your family reacted when somebody changed career direction','how your family handled somebody moving abroad','how relatives discussed money at gatherings','who was strictest about coming home on time','the person who defended you when you were in trouble','family members borrowing each other’s things','how your family celebrated exam results or graduation','the cousin you became close to unexpectedly','the relative who always knew everybody’s news','how your family handled visitors staying over','the family member everybody trusted with secrets','who organised most family outings','how your family divided chores','what happened when somebody brought a partner home','the difference between your mother’s side and father’s side','how your family handled disagreements between siblings','the oldest relative you still remember clearly','the family member who told the best stories','how birthdays felt in your home growing up','what happened when relatives came from abroad','family expectations around greeting and respect','how your family reacted to tattoos, piercings or unusual style','who was most likely to spoil the younger children','how your family handled school fees conversations','what your family considered a serious career','the relative who gave the best advice','how family members supported somebody during a hard period','how your family handled private matters becoming public','what your family expected during festive periods','who was most likely to start dancing at family events','how your family treated neighbours like relatives','what counted as disrespect in your home','the family member you resemble most in personality','the family member whose habits you have picked up','how your family decided where to spend Christmas','the family joke outsiders would not understand','how older siblings looked after younger ones','the relative who always asked what you were eating','how your family reacted when somebody was late','the family member you would trust to plan an event','how your family handled somebody dating outside the tribe','how your family handled different denominations or beliefs','the relative who always wanted everybody in one photo','family group photos that took too long','how your family shared food after large events','what your family did when power went out during a gathering','the room everybody gathered in at home','the chair or spot somebody always claimed','the family member who remembered everyone’s birthdays','how your family handled surprise visitors','the first family member you would tell good news','the family member you would call during an emergency','what your family expected when an older relative visited','how cousins behaved when all of you met after a long time','the family member who always left events early','the family member who never wanted the gathering to end','how your family handled somebody getting married','the role aunties and uncles played in your upbringing','how your family reacted to a child answering back','what your family expected from the eldest child','what your family expected from the youngest child','how your home handled sharing bedrooms','how your family handled food preferences','the person whose cooking everybody trusted','the family member whose cooking everybody avoided','the first family trip you remember','how your family handled long road trips','what happened when somebody forgot an important family date','the kind of gifts relatives brought during visits','how your family talked about saving money','how your family talked about debt','how your family reacted to expensive purchases','whether your family preferred private or big celebrations','the family member most likely to settle a disagreement','the relative most likely to ask when you are getting married','the family member who knew when you were pretending to be fine','what family support looked like when somebody lost a job','how your family handled someone starting a business','what your family thought success looked like','how your family spoke about people living abroad','the relative you only knew through stories before meeting them','how family WhatsApp groups changed the way relatives kept in touch','who sent the longest messages in the family group','who forwarded the most random things in the family group','how your family handled prayer requests in the group chat','how relatives announced big news to everyone','the first person who usually heard family news','how your family handled naming ceremonies','how your family handled weddings in another state','what happened when two relatives stopped speaking','how your family tried to reconcile people','whether children were allowed into adult conversations','how your family handled visitors during school days','the family member who always brought snacks for the children','who made sure everybody got home safely after events','the relative who could turn any visit into a long stay','how your family reacted when somebody wanted privacy','what privacy meant in your home growing up','how your family handled shared bathrooms','how your family handled television choices','who decided what everybody watched','how your family reacted to football matches','what Sunday afternoons looked like at home','what Saturday mornings looked like at home','how your family prepared for church or mosque','how your family handled religious holidays','how your family reacted when somebody missed a family gathering','what excuse never worked on your parents','the kind of apology your parents expected','the family member most likely to hold a grudge','the family member most likely to forgive quickly','how your family handled lending money to relatives','the family member everybody borrowed from','how relatives reacted when somebody bought a car','how the family reacted to a new baby','what family celebrations looked like when money was tight','how your family handled eating out','the first restaurant or fast-food place you remember going with family','how your family handled takeaway food','who usually got the last piece of meat','what happened when somebody finished food meant for another person','how your family divided leftovers','the family member who always carried food home from events','the family member who always wanted extra pictures','how relatives reacted to social media posts','whether family members followed each other closely online','how your family handled embarrassing childhood photos','the story your family tells about you most often','the story you wish your family would stop telling','what relatives remember about you that you barely remember yourself','how your family reacted when you became more independent','the first decision your family let you make completely on your own','how your relationship with your parents changed as you got older','how your relationship with siblings changed after adulthood','how distance changed family relationships','how moving out changed how you saw home','what you appreciate now about your family that you missed when younger'
]

const friendDomains = ['familyHome','relativesVillage','choresErrands','celebrations']
const relationshipDomains = ['familyHome','relativesVillage','relationshipFamily','relationshipFuture','celebrations']

const friendSingles = [
  a => `What family story comes to mind when you think about ${a}?`,
  a => `What did your family teach you through ${a}?`,
  a => `What did you think was normal about ${a} until you met other families?`,
  a => `What would your siblings or cousins say about you and ${a}?`,
  a => `What is one thing about ${a} you would do differently in your own home?`,
  a => `Who in your family do you associate most with ${a}?`,
]
const relationshipSingles = [
  a => `What would you want me to understand about your family and ${a}?`,
  a => `What would you want us to keep from your family’s approach to ${a}?`,
  a => `What would you want us to do differently from your family around ${a}?`,
  a => `What family boundary might matter when it comes to ${a}?`,
  a => `What family expectation around ${a} would you want us to discuss early?`,
  a => `What did ${a} teach you about the kind of home you want one day?`,
]

function hashText(value) {
  let hash = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function familyItems(mode) {
  const domains = mode === 'relationship' ? relationshipDomains : friendDomains
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
  familyExtras.forEach(text => {
    const key = normalise(text)
    if (seen.has(key)) return
    seen.add(key)
    rows.push({ text, domain: 'family-extra', key })
  })
  return rows
}

function familyCandidates(mode) {
  const items = familyItems(mode)
  const frames = mode === 'relationship' ? relationshipSingles : friendSingles
  const rows = []

  items.forEach(item => {
    const frame = frames[hashText(`family:${mode}:${item.key}`) % frames.length]
    rows.push({ text: frame(item.text), key: `single:${item.key}`, domain: item.domain, source: item.text })
  })

  for (let i = 0; i < items.length; i += 1) {
    for (let j = i + 1; j < items.length; j += 1) {
      const a = items[i]
      const b = items[j]
      const keys = [a.key, b.key].sort()
      const text = mode === 'relationship'
        ? `Which one would tell me more about the family life you want us to build: ${a.text} or ${b.text}?`
        : `Which one says more about how your family works: ${a.text} or ${b.text}?`
      rows.push({ text, key: `pair:${keys[0]}|${keys[1]}`, domain: a.domain === b.domain ? a.domain : 'family-cross-topic', source: `${a.text}|${b.text}` })
    }
  }

  return deterministicShuffle(rows, hashText(`family:${mode}:source-unique-v9`))
}

function buildFamily(mode) {
  const category = conversationCategories.find(item => item.id === 'family')
  const rows = familyCandidates(mode)
  if (rows.length < TARGET_PER_MODE) throw new Error(`family/${mode} only has ${rows.length} source-unique ideas`)
  return rows.slice(0, TARGET_PER_MODE).map((row, index) => {
    const intensity = intensityFor(mode, index)
    const prefixes = ['Family one:','Growing up at home:','Thinking about your family:','One about home:','From your family experience:','Family question:']
    const text = `${prefixes[hashText(row.key) % prefixes.length]} ${row.text}`
    return {
      id: `ng750-v9-family-${mode}-${index}`,
      categoryId: 'family',
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
      sourceDomain: row.domain,
      semanticSourceKey: row.key,
      tags: [category.name.toLowerCase(), mode, intensity.toLowerCase(), 'nigeria', 'nigeria-first', row.domain.toLowerCase(), ...normalise(row.source).split(' ').filter(word => word.length > 4).slice(0,5)]
    }
  })
}

function polishPrompt(categoryId, prompt) {
  let text = prompt.text
  if (categoryId === 'deep-meaningful' && prompt.sourceDomain === 'familyHome') {
    text = text.replace(/^([^:]+): Which would be harder for you to navigate with someone you love: (.+) or (.+)\?$/i, '$1: Which part of your background do you think would take more explaining to a partner: $2 or $3?')
  }
  if (categoryId === 'everyday-life' && prompt.mode === 'relationship' && prompt.sourceDomain === 'workCareer') {
    text = text.replace(/^([^:]+): Which one would need more teamwork from us: (.+) or (.+)\?$/i, '$1: Which one do you think would affect our routine more: $2 or $3?')
  }
  return text === prompt.text ? prompt : { ...prompt, text, copyText: text }
}

export function buildNigeriaConversationPrompts(categoryId, mode) {
  if (categoryId === 'family') return buildFamily(mode)
  return buildV8NigeriaConversationPrompts(categoryId, mode).map(prompt => polishPrompt(categoryId, prompt))
}

export { nigeriaConversationCategoryIds }
