import { FRIEND_INTENSITIES, RELATIONSHIP_INTENSITIES, RELATIONSHIP_STAGES } from '../catalog.js'

const friendFrames = [
  t => `What is the first story you think of when you hear ${t}?`,
  t => `What has ${t} taught you about yourself?`,
  t => `What is your strongest opinion about ${t}?`,
  t => `What is one mistake you made around ${t} that you would not repeat?`,
  t => `What do people around you misunderstand about ${t}?`,
  t => `What part of ${t} has changed most for you as you got older?`,
  t => `What is the funniest experience you have had with ${t}?`,
  t => `What is one thing you wish somebody had told you about ${t} earlier?`,
  t => `What does your current approach to ${t} look like?`,
  t => `What would your younger self think about how you handle ${t} now?`,
  t => `What part of ${t} do you take more seriously than most people?`,
  t => `What part of ${t} do you think people take too seriously?`,
  t => `Who influenced how you think about ${t} most?`,
  t => `What would make you change your mind about ${t}?`,
  t => `What is one experience with ${t} you would happily relive?`,
]

const relationshipFrames = [
  t => `What would you want a partner to understand about ${t}?`,
  t => `What would a healthy approach to ${t} look like between two people?`,
  t => `What past experience shapes how you think about ${t}?`,
  t => `Where do you think couples misunderstand each other around ${t}?`,
  t => `What would make you feel respected when ${t} becomes relevant?`,
  t => `What would make you feel unsupported around ${t}?`,
  t => `What boundary matters to you when it comes to ${t}?`,
  t => `What compromise around ${t} would feel fair to you?`,
  t => `What would you rather discuss early than discover later about ${t}?`,
  t => `How much should family opinion affect decisions around ${t}?`,
  t => `How much should money affect decisions around ${t}?`,
  t => `What would you never want us to assume about ${t}?`,
  t => `What would make ${t} easier for us to handle as a team?`,
  t => `What is one lesson you have already learnt about ${t}?`,
  t => `What would maturity around ${t} look like to you?`,
]

function buildFriend(topics) {
  const out = []
  topics.forEach((topic, ti) => friendFrames.forEach((frame, fi) => out.push({
    text: frame(topic),
    intensity: FRIEND_INTENSITIES[(ti + fi) % FRIEND_INTENSITIES.length],
  })))
  return out
}

function buildRelationship(stageTopics) {
  const out = []
  RELATIONSHIP_STAGES.forEach((stage, si) => stageTopics[stage].forEach((topic, ti) => relationshipFrames.forEach((frame, fi) => {
    const intensity = RELATIONSHIP_INTENSITIES[(si + ti + fi) % RELATIONSHIP_INTENSITIES.length]
    out.push({ text: frame(topic), intensity, stage, audience: intensity === 'Spicy' ? '18+' : 'general' })
  })))
  return out
}

const lifeFriend = [
  'your first salary', 'your first proper job', 'your first job interview', 'your first resignation', 'a difficult manager', 'a great manager', 'working with friends', 'working from home', 'office politics', 'commuting to work',
  'university admission', 'your university course', 'your first semester', 'final-year pressure', 'group assignments', 'hostel life', 'off-campus living', 'school strikes', 'graduation', 'life after graduation',
  'NYSC orientation camp', 'your NYSC PPA', 'NYSC allowance', 'meeting people during NYSC', 'moving for NYSC', 'post-NYSC job hunting', 'career uncertainty', 'changing career direction', 'learning a new skill', 'professional certifications',
  'saving money', 'building an emergency fund', 'supporting family financially', 'rent', 'buying a car', 'starting a side hustle', 'losing money on a bad decision', 'getting an unexpected expense', 'salary negotiations', 'earning more than before',
  'relocating to another city', 'thinking about moving abroad', 'living alone', 'living with family as an adult', 'making new adult friends', 'losing touch with old friends', 'adult birthdays', 'taking proper holidays', 'burnout', 'figuring out what success means to you'
]

const lifeRelationship = {
  'Talking Stage': ['career ambition', 'current work pressure', 'money habits', 'family financial responsibilities', 'relocation plans', 'living arrangements', 'future education plans', 'side hustles', 'work-life balance', 'what success means to you'],
  'New Relationship': ['making time for dates around work', 'discussing salaries', 'supporting each other during stressful work periods', 'splitting date expenses', 'saving goals', 'career changes', 'family obligations', 'taking holidays together', 'different work schedules', 'early relocation conversations'],
  'Been Together a While': ['career sacrifices', 'job loss', 'income differences', 'shared travel plans', 'rent and housing choices', 'supporting relatives', 'business risks', 'professional exams', 'burnout', 'balancing friends with couple time'],
  'Long-Term Relationship': ['where to settle', 'buying a home', 'combining financial goals', 'debt', 'wedding costs', 'children and careers', 'supporting ageing parents', 'moving abroad together', 'one partner changing careers', 'building wealth together'],
  'Married': ['household budgeting', 'career growth after marriage', 'unexpected expenses', 'supporting extended family', 'saving for children', 'relocation as a household', 'job loss inside marriage', 'shared investments', 'retirement planning', 'protecting rest and couple time']
}

const nigeriaFriend = [
  'Lagos traffic', 'Abuja life', 'life in smaller Nigerian cities', 'ride-hailing', 'danfo buses', 'okadas', 'airport delays', 'road trips inside Nigeria', 'rainy-season flooding', 'heat and humidity',
  'power cuts', 'generators', 'inverters', 'data prices', 'bad network', 'mobile banking', 'bank transfer delays', 'cash shortages', 'customer service', 'landlord issues',
  'Nigerian weddings', 'traditional weddings', 'aso ebi', 'December events', 'family parties', 'Sunday church culture', 'Friday mosque routines', 'naming ceremonies', 'burials and family gatherings', 'visiting the village',
  'jollof arguments', 'suya spots', 'street food', 'open markets', 'supermarkets', 'price bargaining', 'tailors and deadlines', 'barbers and salons', 'neighbourhood shops', 'roadside vendors',
  'Nigerian parents', 'extended family expectations', 'respect for elders', 'greeting culture', 'career pressure', 'marriage pressure', 'relocation conversations', 'supporting family', 'Nigerian humour', 'the things Nigerians complain about but still miss abroad'
]

const nigeriaRelationship = {
  'Talking Stage': ['who pays for dates', 'Lagos distance between two people', 'dating around heavy work schedules', 'family background questions', 'religion in dating', 'tribal or cultural differences', 'social-media expectations', 'talking-stage length', 'dating someone planning to relocate', 'meeting friends early'],
  'New Relationship': ['meeting family', 'attending weddings together', 'transport costs for seeing each other', 'date budgets', 'church or mosque expectations', 'different cultural traditions', 'public versus private relationships', 'family questions about marriage', 'different social lifestyles', 'December spending'],
  'Been Together a While': ['family interference', 'supporting relatives financially', 'Lagos rent', 'career pressure', 'relocation plans', 'wedding expectations from friends', 'different church communities', 'different hometown traditions', 'money during family emergencies', 'balancing couple time with social obligations'],
  'Long-Term Relationship': ['traditional wedding expectations', 'civil and religious ceremonies', 'where to live after marriage', 'family introductions', 'bride-price conversations', 'wedding guest lists', 'supporting parents', 'children and cultural identity', 'relocation abroad', 'choosing a church or faith community'],
  'Married': ['in-law boundaries', 'family financial requests', 'holiday rotations between families', 'housing costs', 'domestic help', 'school choices for children', 'church or mosque routines', 'extended family visits', 'career moves between cities', 'building a private home life inside a communal culture']
}

const familyFriend = [
  'your relationship with your mother', 'your relationship with your father', 'siblings', 'older siblings', 'younger siblings', 'cousins', 'grandparents', 'aunts and uncles', 'family group chats', 'family nicknames',
  'family holidays', 'Christmas with family', 'Sunday lunch', 'family birthdays', 'family weddings', 'family funerals', 'visiting the village', 'sleeping in rooms full of cousins', 'family photos', 'family jokes',
  'strict parents', 'being compared with siblings or cousins', 'family expectations about school', 'family expectations about career', 'family expectations about marriage', 'family expectations about money', 'being sent on errands', 'house chores', 'family devotion', 'greeting elders',
  'supporting parents financially', 'helping siblings', 'lending money to relatives', 'family emergencies', 'caring for ageing parents', 'relatives asking for favours', 'living with family as an adult', 'moving away from family', 'setting boundaries with relatives', 'keeping family matters private',
  'the family member you call first', 'the relative who knows everybody’s gist', 'the peacemaker in the family', 'the strict one in the family', 'the funniest family member', 'the family member most like you', 'the family tradition you value most', 'the family habit you want to end', 'what home means to you', 'what you want your future family to feel like'
]

const familyRelationship = {
  'Talking Stage': ['how close you are to your parents', 'siblings and dating opinions', 'family religion', 'family cultural expectations', 'how private you are with relatives', 'whether family approval matters', 'family money responsibilities', 'how often you visit home', 'what your family expects from a partner', 'how quickly family should know about someone'],
  'New Relationship': ['introducing a partner to parents', 'meeting siblings', 'family events together', 'what relatives should know about the relationship', 'family comments about marriage', 'different family cultures', 'different family communication styles', 'family financial requests', 'how much advice to take from parents', 'protecting private disagreements'],
  'Been Together a While': ['family boundaries', 'holidays with each family', 'supporting parents', 'siblings staying over', 'family opinions about the relationship', 'caregiving responsibilities', 'family emergencies', 'relatives borrowing money', 'balancing couple time with family time', 'what to share with parents'],
  'Long-Term Relationship': ['wedding involvement from family', 'where parents fit into future plans', 'supporting ageing parents', 'children knowing both families', 'different cultural traditions', 'where to spend major holidays', 'living near family', 'parents staying with you', 'family expectations about children', 'building independent couple decisions'],
  'Married': ['in-law boundaries', 'monthly family support', 'family visits', 'holiday rotations', 'parents giving marriage advice', 'siblings needing help', 'private marital matters', 'raising children around relatives', 'care for ageing parents', 'protecting the marriage from family pressure']
}

export const supplementalNormalCards = {
  'life-experience': { friend: buildFriend(lifeFriend), relationship: buildRelationship(lifeRelationship) },
  nigeria: { friend: buildFriend(nigeriaFriend), relationship: buildRelationship(nigeriaRelationship) },
  family: { friend: buildFriend(familyFriend), relationship: buildRelationship(familyRelationship) },
}

for (const [id, modes] of Object.entries(supplementalNormalCards)) {
  if (modes.friend.length !== 750 || modes.relationship.length !== 750) throw new Error(`${id} supplemental pool count mismatch`)
}
