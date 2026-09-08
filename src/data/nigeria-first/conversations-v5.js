import { conversationCategories } from '../categories.js'
import { buildNigeriaConversationPrompts as buildV3NigeriaConversationPrompts, nigeriaConversationCategoryIds } from './conversations-v3.js'
import { TARGET_PER_MODE, audienceFor, deterministicShuffle, intensityFor, stageFor, takeTarget } from './helpers.js'

const friendFaithTopics = [
  'the first time faith became personal to you','a prayer you still remember from a difficult season','a Bible passage that has stayed with you','a church experience that shaped you positively','a church experience that made you ask questions','how your family practised faith while you were growing up','how you respond when prayer feels unanswered','how you handle doubt','how you decide whether a teaching is sound','how faith affects your friendships','how faith affects your money decisions','how faith affects your career decisions','forgiveness when the hurt is serious','obedience when it costs you something','spiritual rest versus constant activity','the role of community in your faith','what you value most in a church','religious pressure that becomes unhealthy','separating conviction from fear','gratitude in an ordinary week','seasons when you feel spiritually dry','what you still want to understand better about God','what spiritual maturity looks like to you','how Christians should handle disagreement','how Christians should approach dating','how Christians should approach ambition','how Christians should treat people who believe differently','serving people outside church','the place of generosity in your faith','the kind of Christian you hope to become','church friendships','church leadership','giving and tithing','fasting','worship music','Bible study habits','praying with other people','sharing your faith','hearing people say “God told me”','Christian social media','church culture in Nigeria','denominational differences','the pressure to look spiritually strong','asking difficult faith questions','what grace means to you','what repentance means to you','how you think about purpose','how you think about calling','how you handle disappointment with church people','what healthy accountability looks like','how you know when advice is spiritual or controlling','how you respond when family faith expectations differ from yours','how faith affects the way you treat money','how faith affects what success means to you','how faith affects how you use social media','how faith affects how you respond to conflict','what you think prayer should change in a person','what you think church should feel like for young people','how you balance faith with work and ambition','how you decide which Christian voices to listen to','what you wish more Christians were honest about'
]

const relationshipFaithTopics = [
  'praying together','attending church together','choosing a church as a couple','different denominations','different levels of spiritual maturity','how faith affects dating boundaries','how faith affects physical intimacy','how faith affects money decisions','how faith affects career decisions','how faith affects relocation decisions','how faith affects marriage expectations','how faith affects raising children','what spiritual leadership means in a relationship','how both partners should make big decisions','how family religious expectations affect a couple','what you would do if your partner started questioning their faith','what you would do if your partner changed churches','how much church involvement feels healthy','serving in church while building a relationship','giving and tithing as a couple','praying during conflict','forgiving a partner after serious hurt','how faith should affect apologies','how faith should affect honesty','how faith should affect friendships outside the relationship','how faith should affect opposite-sex friendships','how faith should affect social media behaviour','whether a couple needs identical theology','what convictions need agreement before marriage','what faith practices you would want in your future home','how you would want children introduced to faith','how you would handle relatives pushing religious expectations','how you would handle a pastor giving relationship advice you disagree with','how you would handle a partner who is spiritually busier than you','how you would handle a partner who needs a season of spiritual rest','how much private spiritual life should remain private','what praying for each other should look like','what accountability between partners should look like','how you would want faith handled during financial pressure','how you would want faith handled during grief','how you would want faith handled during infertility or delayed plans','how you would want faith handled during career uncertainty','how you would want faith handled during relocation abroad','what Christian dating advice you disagree with','what Christian marriage advice you disagree with','how you think gender roles should be discussed in a Christian relationship','how you think submission should be discussed','how you think sacrifice should work both ways','what emotional safety means in a faith-centred relationship','how you would want spiritual disagreements resolved','what you would never want religion used to excuse in a relationship','what you would never want Scripture used to control','how you would want us to handle unanswered prayers together','what kind of church community you would want around your future family','how important shared worship style is to you','how important shared prayer habits are to you','how important shared Bible study is to you','how important shared beliefs about giving are to you','how important shared views on ministry are to you','the kind of faith-filled home you would want to build'
]

const friendFrames = [
  topic => `What do you genuinely believe about ${topic}?`,
  topic => `How has your view of ${topic} changed as you have got older?`,
  topic => `What is one question you still have about ${topic}?`,
  topic => `What has your own experience taught you about ${topic}?`,
  topic => `What do you think people misunderstand about ${topic}?`,
  topic => `What would growth look like for you around ${topic}?`,
  topic => `What part of ${topic} feels most personal to you?`,
  topic => `What is one thing you had to unlearn about ${topic}?`,
  topic => `What is one thing you wish churches spoke about more honestly when it comes to ${topic}?`,
  topic => `Who or what shaped your view of ${topic} the most?`,
  topic => `What tension do you still feel around ${topic}?`,
  topic => `What would a healthier approach to ${topic} look like to you?`,
  topic => `What is one thing you would never want fear to control about ${topic}?`,
  topic => `What is one thing you appreciate more now about ${topic}?`
]

const relationshipFrames = [
  topic => `How important is agreement about ${topic} to you in a relationship?`,
  topic => `What would you want me to understand about your view of ${topic}?`,
  topic => `How would you want us to handle it if we saw ${topic} differently?`,
  topic => `What would spiritual maturity look like between us around ${topic}?`,
  topic => `What would you want our future home to practise around ${topic}?`,
  topic => `What boundary would protect both of us around ${topic}?`,
  topic => `What would make you feel respected by me when it comes to ${topic}?`,
  topic => `What part of ${topic} would you want us to discuss before marriage?`,
  topic => `What would make ${topic} feel supportive rather than controlling in a relationship?`,
  topic => `What did your upbringing teach you about ${topic}?`,
  topic => `What would you want us to do if ${topic} became difficult for one of us?`,
  topic => `What is one assumption about ${topic} you would not want us to make about each other?`,
  topic => `What would healthy compromise around ${topic} look like to you?`,
  topic => `What is one thing about ${topic} you would rather say clearly than leave unspoken?`
]

function isChristian(text) {
  return /\b(Jesus|Christ|Christian|Bible|Scripture|church|God|prayer|pastor|worship|tithing|fasting|theology|ministry)\b/i.test(text)
}

function buildFaith(mode) {
  const category = conversationCategories.find(item => item.id === 'faith-spirituality')
  const topics = mode === 'friend' ? friendFaithTopics : relationshipFaithTopics
  const frames = mode === 'friend' ? friendFrames : relationshipFrames
  const rows = []
  topics.forEach((topic, topicIndex) => frames.forEach((make, frameIndex) => rows.push({ text: make(topic), score: topicIndex * 17 + frameIndex })))
  const selected = takeTarget(deterministicShuffle(rows, mode === 'friend' ? 701 : 709), TARGET_PER_MODE, mode === 'friend' ? 719 : 727)
  return selected.map((row, index) => {
    const intensity = intensityFor(mode, index)
    return {
      id: `ng750-faith-spirituality-${mode}-${index}`,
      categoryId: 'faith-spirituality',
      categoryName: category.name,
      mode,
      text: row.text,
      copyText: row.text,
      intensity,
      stage: mode === 'relationship' ? stageFor(index) : null,
      audience: audienceFor(intensity),
      faithType: isChristian(row.text) ? 'Christian' : 'General Spirituality',
      subtype: null,
      mechanic: 'conversation',
      sourceDomain: 'faith-nigeria',
      tags: [category.name.toLowerCase(), mode, intensity.toLowerCase(), 'nigeria', 'nigeria-first', 'faith']
    }
  })
}

export function buildNigeriaConversationPrompts(categoryId, mode) {
  if (categoryId === 'faith-spirituality') return buildFaith(mode)
  return buildV3NigeriaConversationPrompts(categoryId, mode)
}

export { nigeriaConversationCategoryIds }
