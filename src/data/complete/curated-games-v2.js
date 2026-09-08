import { curatedGameCards as base } from './curated-games.js'
import { FRIEND_INTENSITIES, RELATIONSHIP_INTENSITIES, RELATIONSHIP_STAGES } from '../catalog.js'

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

function meta(mode, index) {
  const intensity = mode === 'friend'
    ? FRIEND_INTENSITIES[index % FRIEND_INTENSITIES.length]
    : RELATIONSHIP_INTENSITIES[index % RELATIONSHIP_INTENSITIES.length]
  return {
    intensity,
    ...(mode === 'relationship' ? { stage: RELATIONSHIP_STAGES[index % RELATIONSHIP_STAGES.length] } : {}),
    audience: intensity === 'Spicy' ? '18+' : 'general',
  }
}

const kmaFriendPools = [
  ['social personalities', ['The life of the party','The quiet observer','The funny one','The ambitious one','The calm homebody','The spontaneous traveller','The foodie','The gym person','The creative','The organised planner']],
  ['dating archetypes', ['The great texter','The great caller','The great date planner','The good cook','The stylish one','The generous one','The mysterious one','The romantic one','The adventurous one','The dependable one']],
  ['work personalities', ['The founder','The banker','The designer','The lawyer','The doctor','The musician','The engineer','The teacher','The entrepreneur','The remote worker']],
  ['Lagos lifestyles', ['The Island socialite','The mainland foodie','The always-in-traffic worker','The beach-every-weekend person','The church-every-Sunday person','The concert regular','The quiet Lekki homebody','The gym-before-work person','The nightlife regular','The road-trip person']],
  ['fictional types', ['The charming villain','The loyal best friend','The brilliant detective','The chaotic genius','The brave hero','The sarcastic sidekick','The mysterious stranger','The soft-hearted rival','The disciplined leader','The funny troublemaker']],
  ['money personalities', ['The strict saver','The generous spender','The quiet investor','The luxury lover','The bargain hunter','The business builder','The cash-only person','The spreadsheet budgeter','The spontaneous buyer','The debt-averse planner']],
  ['weekend personalities', ['The brunch person','The football person','The cinema person','The beach person','The stay-home person','The concert person','The church-event person','The road-trip person','The games-night person','The sleep-all-day person']],
  ['travel personalities', ['The detailed planner','The last-minute packer','The luxury traveller','The budget backpacker','The food tourist','The photo taker','The sleep-through-the-flight person','The itinerary breaker','The souvenir buyer','The local-experience person']]
]

const kmaRelationshipPools = [
  ['relationship personalities', ['The romantic planner','The funny best-friend type','The quiet dependable type','The ambitious workaholic','The affectionate homebody','The social butterfly','The thoughtful gift-giver','The adventurous traveller','The calm problem-solver','The confident flirt']],
  ['communication styles', ['The long texter','The voice-note person','The late-night caller','The quick check-in person','The meme sender','The deep-conversation person','The quiet companion','The constant updater','The spontaneous caller','The playlist sender']],
  ['date energy', ['The dinner-date person','The beach-date person','The road-trip person','The stay-in person','The concert person','The activity-date person','The brunch person','The museum person','The games-night person','The surprise-date planner']],
  ['future types', ['The career climber','The family-first person','The traveller','The home builder','The entrepreneur','The faith-centred person','The minimalist','The luxury lover','The community person','The private couple type']],
  ['romantic strengths', ['Great listener','Great cook','Great planner','Great gift giver','Great communicator','Great encourager','Great problem solver','Great at affection','Great with family','Great with money']],
  ['conflict styles', ['The immediate talker','The cool-off-first person','The apologises-first person','The evidence keeper','The peacemaker','The brutally direct person','The soft-spoken person','The humour diffuser','The long-message person','The needs-a-hug person']],
  ['money styles', ['The aggressive saver','The experience spender','The careful budgeter','The generous giver','The investor','The home-first planner','The travel-first planner','The separate-accounts person','The joint-goals person','The cashflow optimist']],
  ['home-life types', ['The neat one','The relaxed one','The early riser','The night owl','The home cook','The takeaway person','The host-everybody person','The privacy lover','The routine person','The spontaneous person']]
]

function buildKma(mode) {
  const pools = mode === 'friend' ? kmaFriendPools : kmaRelationshipPools
  const cards = []
  for (const [theme, optionsPool] of pools) {
    for (const options of combos(optionsPool, 3)) {
      cards.push({ text: `Kiss, marry, avoid. Choose one role for each of these ${theme}.`, options, ...meta(mode, cards.length) })
      if (cards.length === 750) return cards
    }
  }
  return cards
}

const friendChoicePools = [
  ['career', ['A job you love with modest pay','A job you dislike with triple the pay','A stable job with slow growth','A risky role with huge growth','Work fully remote','Work in an office with a great team','Start a business','Join a strong company','A four-day work week','A prestigious title','A short commute','Unlimited leave with average pay','High pay with long hours','A job abroad','A job close to family']],
  ['location', ['Live close to family with fewer opportunities','Move far away for the career you want','Stay in Lagos','Move to Abuja','Move abroad','Live in a smaller Nigerian city','Own a home far from work','Rent close to work','Live near the beach','Live near the office','Move every three years','Stay in one city for twenty years','Live alone','Share a bigger home','Live somewhere quieter']],
  ['money', ['Receive ₦10 million today','Receive ₦1 million every year for fifteen years','Own your home outright','Have zero debt forever','Free food for five years','Free transport for five years','A guaranteed pension','A successful side business','Double your salary','Never pay rent again','A paid-off car','Free healthcare for life','A six-month emergency fund instantly','A profitable investment portfolio','No family financial pressure for five years']],
  ['knowledge', ['Know what people say after you leave','Know what your life looks like in ten years','Know your future salary','Know who your closest friends will be','Know the date of your biggest career break','Know which investment will do best','Know the next major mistake you will make','Know which city you will settle in','Know which friendship will last','Know your future job title','Know when you will buy a home','Know which risk will pay off','Know who genuinely likes you','Know one future regret','Know one future opportunity']],
  ['friendship', ['Keep a long friendship that has become draining','Protect your peace and let the friendship end','Have many casual friends','Have two extremely close friends','A brutally honest friend','A gentle supportive friend','A friend who is always available','A friend who pushes you hard','A friend who lives nearby','A friend abroad who understands you deeply','A friend who shares your hobbies','A friend who shares your values','A funny unreliable friend','A serious dependable friend','A friend who challenges your choices']],
  ['comfort', ['Perfect sleep every night','Never sit in traffic again','Never lose power at home','Never have bad internet again','Free domestic help','Free food delivery','A personal driver','A four-day work week','A perfectly quiet home','Air conditioning everywhere','Never queue again','Never deal with bank-app failures','A chef twice a week','Every errand handled for you','Always find parking immediately']],
  ['travel', ['One luxury trip a year','Four budget trips a year','Travel alone','Travel only with friends','Visit every African country','Visit five dream countries outside Africa','Always fly business class','Always stay in luxury hotels','Take spontaneous weekend trips','Plan one major trip for a year','Travel for food','Travel for music events','Road-trip around Nigeria','Live abroad for six months','Spend every holiday at home']],
  ['social life', ['A packed social calendar','Quiet weekends at home','Attend every big event','Never attend another crowded party','Always know someone at events','Always leave events early','Be the organiser','Never plan anything yourself','Host friends at home','Meet friends outside only','Have one social night every week','Have one social weekend every month','Know everybody in the room','Stay anonymous in crowds','Always have a plus-one']]
]

const relationshipChoicePools = [
  ['compatibility', ['Strong chemistry with different long-term plans','Matching long-term plans with slower chemistry','Same faith with different lifestyles','Same lifestyle with different faith priorities','Great communication with low spontaneity','Great spontaneity with weaker planning','Shared ambition','Shared calmness','Same humour','Same money habits','Same family values','Same travel style','Different hobbies with strong support','Similar careers','Completely different careers']],
  ['distance and pressure', ['Two years of long distance','Two years of serious money pressure','One year living with family','One year in different time zones','A demanding work season','A difficult family season','Frequent travel for work','A temporary income gap','Six months of opposite schedules','A year without major holidays','Relocation twice in three years','Supporting a sick parent','Starting a business during the relationship','Studying while working','One partner changing careers']],
  ['wedding and home', ['A large wedding and delay buying a home','A small wedding and stronger house deposit','Traditional wedding first','Court wedding first','Rent in a nicer area','Own farther away','Spend on honeymoon','Spend on home setup','Big guest list','Small private ceremony','Luxury rings','Simple rings and more savings','Wedding abroad','Wedding close to family','No debt from wedding expenses']],
  ['future', ['Move abroad together','Stay close to both families','Build a business together','Keep careers completely separate','Have children earlier','Have children later','Live in one city long term','Move every few years for opportunity','Buy a home early','Travel heavily before buying','Prioritise retirement savings','Prioritise experiences now','Raise children near grandparents','Raise children somewhere new','Take a one-year career break']],
  ['money', ['Fully joint finances','Mostly separate finances with shared goals','One shared household account','One person manages the budget','Aggressive saving for five years','More travel while you are young','Buy a car first','Save for a home first','Pay off all debt first','Invest before upgrading lifestyle','Equal bill split','Income-based bill split','Monthly family-support budget','Separate personal spending money','Review finances together every month']],
  ['family', ['Live near your family','Live near your partner’s family','Host relatives often','Keep the home mostly private','Spend every major holiday with family','Alternate family holidays','Support parents monthly','Support only when specific needs arise','Have parents stay for long visits','Prefer hotels for visiting relatives','Attend every major family event','Protect some weekends from family plans','Share childcare with relatives','Use paid childcare','Keep couple issues away from family']],
  ['relationship rhythm', ['Weekly date night','One full weekend away every month','Daily calls when apart','Longer calls a few times a week','Lots of shared hobbies','Mostly separate hobbies','Plan everything early','Keep plans spontaneous','Share most social plans','Maintain separate friend nights','Morning check-ins','Nightly catch-ups','Take annual trips together','Take some solo trips','Have phone-free evenings']],
  ['conflict', ['Talk immediately after an argument','Take a few hours before talking','Apologise first even before full agreement','Wait until both people feel calm','Discuss every issue fully','Let small things go quickly','Seek outside counsel early','Keep conflict private unless stuck','Use text to organise thoughts first','Talk face to face only','Never sleep on major conflict','Pause overnight when needed','Ask direct questions','Lead with reassurance','Focus on practical changes']]
]

function buildChoice(mode) {
  const pools = mode === 'friend' ? friendChoicePools : relationshipChoicePools
  const cards = []
  for (const [theme, optionsPool] of pools) {
    for (const options of combos(optionsPool, 2)) {
      cards.push({ text: `If you had to choose one in this ${theme} situation, which would you take and why?`, options, ...meta(mode, cards.length) })
      if (cards.length === 750) return cards
    }
  }
  return cards
}

export const curatedGameCards = {
  ...base,
  'kiss-marry-avoid': { friend: buildKma('friend'), relationship: buildKma('relationship') },
  'if-you-had-to-choose': { friend: buildChoice('friend'), relationship: buildChoice('relationship') },
}
