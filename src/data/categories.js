export const conversationCategories = [
  { id: 'getting-to-know-you', name: 'Getting to Know You', icon: '👋', description: 'Easy questions that reveal the person behind the small talk.' },
  { id: 'deep-meaningful', name: 'Deep & Meaningful', icon: '🌒', description: 'Go beyond surface-level answers without making it feel forced.' },
  { id: 'fun-random', name: 'Fun & Random', icon: '🎲', description: 'Odd, playful and unexpected questions that keep things moving.' },
  { id: 'life-experience', name: 'Life & Experience', icon: '🧭', description: 'Stories, lessons, choices and moments that shaped you.' },
  { id: 'nigeria', name: 'Nigeria', icon: '🇳🇬', description: 'School, family, food, culture, Lagos stories and Nigerian life.' },
  { id: 'family', name: 'Family', icon: '🏠', description: 'The people, traditions and experiences you grew up around.' },
  { id: 'nostalgia', name: 'Nostalgia', icon: '📼', description: 'Old memories, forgotten favourites and things you miss.' },
  { id: 'growing-up', name: 'Growing Up', icon: '🛝', description: 'Childhood, teenage years, school and becoming who you are.' },
  { id: 'food', name: 'Food', icon: '🍜', description: 'Food opinions, cravings, memories and chaotic combinations.' },
  { id: 'everyday-life', name: 'Everyday Life', icon: '☕', description: 'The little routines and habits that say more than you think.' },
  { id: 'movies', name: 'Movies', icon: '🎬', description: 'Films, characters, endings, guilty pleasures and debates.' },
  { id: 'music', name: 'Music', icon: '🎧', description: 'Songs, artists, memories, moods and what stays on repeat.' },
  { id: 'hot-takes', name: 'Hot Takes', icon: '🔥', description: 'Opinions worth arguing about, without turning it into a fight.' },
  { id: 'faith-spirituality', name: 'Faith & Spirituality', icon: '✨', description: 'Faith, purpose, questions, convictions and spiritual life.' },
  { id: 'values-beliefs', name: 'Values & Beliefs', icon: '🧩', description: 'What matters to you, why it matters and where your lines are.' },
]

export const gameCategories = [
  { id: 'truth-dare', name: 'Truth & Dare', icon: '⚡', mechanic: 'truth-dare', description: 'Pick Truth or Dare, then send it or say it on the call.' },
  { id: 'never-have-i-ever', name: 'Never Have I Ever', icon: '🙈', mechanic: 'statement', description: 'Statements that expose funny stories and hidden history.' },
  { id: 'two-truths-lie', name: 'Two Truths & A Lie', icon: '🃏', mechanic: 'three-statements', description: 'Ready-made statement sets. Choose what fits and make one the lie.' },
  { id: 'kiss-marry-avoid', name: 'Kiss, Marry, Avoid', icon: '💋', mechanic: 'three-options', description: 'Three choices. One kiss, one marriage, one hard avoid.' },
  { id: 'what-would-you-do', name: 'What Would You Do?', icon: '🧠', mechanic: 'scenario', description: 'Messy scenarios that reveal how each person thinks.' },
  { id: 'if-you-had-to-choose', name: 'If You Had To Choose', icon: '↔️', mechanic: 'two-options', description: 'Two difficult options. Pick one and explain yourself.' },
  { id: 'who-is-more-likely', name: 'Who Is More Likely To?', icon: '👉', mechanic: 'open', description: 'Point fingers, defend yourself and tell the story behind it.' },
  { id: 'how-well-do-you-know-me', name: 'How Well Do You Know Me?', icon: '🎯', mechanic: 'guess', description: 'Guess the answer before the other person reveals it.' },
  { id: 'finish-the-sentence', name: 'Finish the Sentence', icon: '✍️', mechanic: 'open', description: 'A sentence starter that gives the other person somewhere to go.' },
  { id: 'guess-my-answer', name: 'Guess My Answer', icon: '🔮', mechanic: 'guess', description: 'Predict the other person’s answer first, then compare and explain.' },
  { id: 'rank-these', name: 'Rank These', icon: '📊', mechanic: 'rank', description: 'Put five options in order, then defend your ranking.' },
  { id: 'agree-disagree', name: 'Agree or Disagree', icon: '⚖️', mechanic: 'agree-disagree', description: 'Take a position on a statement, then explain why.' },
  { id: 'one-has-to-go', name: 'One Has To Go', icon: '🗑️', mechanic: 'four-options', description: 'Four options appear. Remove one permanently and explain yourself.' },
  { id: 'keep-one-forever', name: 'Keep One Forever', icon: '🔒', mechanic: 'four-options', description: 'Keep only one option forever. Everything else disappears.' },
  { id: 'rate-it', name: 'Rate It', icon: '🔟', mechanic: 'rating', description: 'Give it a score from 1 to 10, then tell the story behind the number.' },
  { id: 'this-or-that', name: 'This or That', icon: '↔️', mechanic: 'two-options-fast', description: 'Fast, casual choices that often turn into longer conversations.' },
  { id: 'red-green-depends', name: 'Red Flag, Green Flag or Depends?', icon: '🚦', mechanic: 'three-way', description: 'Call it a red flag, green flag or depends, then explain the context.' },
  { id: 'petty-or-valid', name: 'Petty or Valid?', icon: '🧾', mechanic: 'three-way', description: 'Decide whether the reaction is petty, valid or a bit of both.' },
  { id: 'tell-the-story', name: 'Tell The Story', icon: '📖', mechanic: 'story', description: 'Get a story prompt, then tell what really happened.' },
]

export const allCategories = [...conversationCategories, ...gameCategories]

export const relationshipStages = [
  'Talking Stage',
  'New Relationship',
  'Been Together a While',
  'Long-Term',
  'Married',
]

export const friendIntensities = ['Chill', 'Interesting', 'Deep', 'No Filter']
export const relationshipIntensities = ['Chill', 'Interesting', 'Deep', 'Flirty', 'Spicy', 'No Filter']
