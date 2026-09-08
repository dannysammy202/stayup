export const FRIEND_INTENSITIES = ['Chill', 'Interesting', 'Deep', 'No Filter']
export const RELATIONSHIP_INTENSITIES = ['Chill', 'Interesting', 'Deep', 'Flirty', 'Spicy', 'No Filter']
export const RELATIONSHIP_STAGES = ['Talking Stage', 'New Relationship', 'Been Together a While', 'Long-Term Relationship', 'Married']

export const conversationCategories = [
  { id: 'getting-to-know-you', name: 'Getting to Know You', icon: 'profile', description: 'The things worth learning about each other beyond small talk.', tags: ['personality', 'habits', 'preferences', 'first impressions'] },
  { id: 'deep-meaningful', name: 'Deep & Meaningful', icon: 'messages', description: 'Longer conversations about who you are, what shaped you and what matters.', tags: ['life', 'growth', 'feelings', 'lessons'] },
  { id: 'fun-random', name: 'Fun & Random', icon: 'magic', description: 'Unexpected questions for jokes, chaos and strange opinions.', tags: ['fun', 'random', 'laugh', 'weird'] },
  { id: 'life-experience', name: 'Life & Experience', icon: 'briefcase', description: 'University, NYSC, work, money, choices, pressure and adult life.', tags: ['university', 'NYSC', 'work', 'career', 'money', 'relocation'] },
  { id: 'nigeria', name: 'Nigeria', icon: 'global', description: 'Life here, the things we normalise, the things we argue about and the things we love.', tags: ['Nigeria', 'Lagos', 'Abuja', 'culture', 'transport'] },
  { id: 'family', name: 'Family', icon: 'people', description: 'Parents, siblings, cousins, expectations, closeness and family dynamics.', tags: ['parents', 'siblings', 'cousins', 'home'] },
  { id: 'nostalgia', name: 'Nostalgia', icon: 'clock', description: 'Old music, old phones, TV, school trends, snacks and memories from back then.', tags: ['2go', 'BlackBerry', 'childhood', 'old school', 'TV'] },
  { id: 'growing-up', name: 'Growing Up', icon: 'book', description: 'School, chores, punishments, neighbours, holidays and the house you grew up in.', tags: ['secondary school', 'primary school', 'parents', 'chores', 'childhood'] },
  { id: 'food', name: 'Food', icon: 'coffee', description: 'Nigerian food arguments, eating habits, comfort meals and questionable combinations.', tags: ['jollof', 'suya', 'swallow', 'shawarma', 'food'] },
  { id: 'everyday-life', name: 'Everyday Life', icon: 'home', description: 'The ordinary routines and small habits people end up talking about for ages.', tags: ['routine', 'weekend', 'traffic', 'home', 'phone'] },
  { id: 'movies', name: 'Movies', icon: 'video', description: 'Films, series, Nollywood, cinema habits, characters and unpopular opinions.', tags: ['movies', 'Nollywood', 'series', 'cinema'] },
  { id: 'music', name: 'Music', icon: 'music', description: 'Songs, artists, playlists, concerts, throwbacks and music you will defend.', tags: ['music', 'Afrobeats', 'playlist', 'artist'] },
  { id: 'hot-takes', name: 'Hot Takes', icon: 'judge', description: 'Opinions worth debating around money, dating, family, gender, marriage and adult life.', tags: ['debate', 'money', 'dating', 'marriage', 'social media'] },
  { id: 'faith-spirituality', name: 'Faith & Spirituality', icon: 'lamp', description: 'Faith, church, doubt, prayer, values and what belief looks like in real life.', tags: ['faith', 'church', 'prayer', 'God', 'religion'] },
  { id: 'values-beliefs', name: 'Values & Beliefs', icon: 'shield', description: 'Principles, boundaries, right and wrong, loyalty, ambition and the lines you hold.', tags: ['values', 'beliefs', 'boundaries', 'loyalty'] },
]

export const gameCategories = [
  { id: 'truth-dare', name: 'Truth or Dare', icon: 'flash', mechanic: 'truth-dare', description: 'Pick Truth or Dare. Every dare works over text or a call.' },
  { id: 'never-have-i-ever', name: 'Never Have I Ever', icon: 'tick', mechanic: 'statement', description: 'Read the statement and answer in the conversation you already have.' },
  { id: 'two-truths-lie', name: 'Two Truths & A Lie', icon: 'cards', mechanic: 'two-truths-lie', description: 'Choose which believable statement becomes the lie before you send the set.' },
  { id: 'kiss-marry-avoid', name: 'Kiss, Marry, Avoid', icon: 'heart', mechanic: 'kiss-marry-avoid', description: 'Three coherent choices. Assign one to each option.' },
  { id: 'what-would-you-do', name: 'What Would You Do?', icon: 'message', mechanic: 'scenario', description: 'A situation with enough tension to produce a real conversation.' },
  { id: 'if-you-had-to-choose', name: 'If You Had To Choose', icon: 'route', mechanic: 'hard-choice', description: 'Difficult choices where the explanation matters more than the answer.' },
  { id: 'who-is-more-likely', name: 'Who Is More Likely To?', icon: 'people', mechanic: 'who', description: 'Pick which of you is more likely, then defend the answer.' },
  { id: 'how-well-do-you-know-me', name: 'How Well Do You Know Me?', icon: 'profile', mechanic: 'predict', description: 'Answer about the other person first, then compare with their real answer.' },
  { id: 'finish-the-sentence', name: 'Finish the Sentence', icon: 'edit', mechanic: 'finish', description: 'Complete the line in your own words. Short prompt, longer gist.' },
  { id: 'guess-my-answer', name: 'Guess My Answer', icon: 'question', mechanic: 'predict', description: 'The other person predicts your answer before you reveal it.' },
  { id: 'rank-these', name: 'Rank These', icon: 'sort', mechanic: 'rank', description: 'Put five related options in order and explain the controversial placements.' },
  { id: 'agree-disagree', name: 'Agree or Disagree', icon: 'judge', mechanic: 'agree', description: 'React to one statement, then argue your position.' },
  { id: 'one-has-to-go', name: 'One Has To Go', icon: 'close', mechanic: 'eliminate', description: 'Four related choices. Remove one.' },
  { id: 'keep-one-forever', name: 'Keep One Forever', icon: 'bookmark', mechanic: 'keep', description: 'Keep one option and lose the rest.' },
  { id: 'rate-it', name: 'Rate It', icon: 'star', mechanic: 'rating', description: 'Give it a score from 1 to 10, then explain the number.' },
  { id: 'this-or-that', name: 'This or That', icon: 'route', mechanic: 'quick-choice', description: 'Fast, casual choices with no long moral dilemma.' },
  { id: 'red-green-depends', name: 'Red Flag, Green Flag or Depends?', icon: 'flag', mechanic: 'verdict', description: 'Judge one behaviour or situation without pretending every answer is obvious.' },
  { id: 'petty-or-valid', name: 'Petty or Valid?', icon: 'judge', mechanic: 'petty', description: 'Relatable situations where reasonable people will disagree.' },
  { id: 'tell-the-story', name: 'Tell The Story', icon: 'story', mechanic: 'story', description: 'A story starter built to keep someone talking for several minutes.' },
]

export const allCategories = [...conversationCategories, ...gameCategories]
export const categoryById = Object.fromEntries(allCategories.map(category => [category.id, category]))
export const conversationIds = new Set(conversationCategories.map(category => category.id))
export const gameIds = new Set(gameCategories.map(category => category.id))

export const GAME_RESPONSE_OPTIONS = {
  'agree-disagree': ['Agree', 'Disagree'],
  'red-green-depends': ['Red flag', 'Green flag', 'Depends'],
  'petty-or-valid': ['Petty', 'Valid', 'Depends'],
  'kiss-marry-avoid': ['Kiss', 'Marry', 'Avoid'],
}

export function isGameCategory(id) {
  return gameIds.has(id)
}
