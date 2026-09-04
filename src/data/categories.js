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
  { id: 'truth-dare', name: 'Truth & Dare', icon: '⚡', description: 'Pick Truth or Dare, then send it or say it on the call.' },
  { id: 'never-have-i-ever', name: 'Never Have I Ever', icon: '🙈', description: 'Statements that expose funny stories and hidden history.' },
  { id: 'two-truths-lie', name: 'Two Truths & A Lie', icon: '🃏', description: 'Ready-made statement sets. Choose what fits and make one the lie.' },
  { id: 'kiss-marry-avoid', name: 'Kiss, Marry, Avoid', icon: '💋', description: 'Three choices. One kiss, one marriage, one hard avoid.' },
  { id: 'what-would-you-do', name: 'What Would You Do?', icon: '🧠', description: 'Messy scenarios that reveal how each person thinks.' },
  { id: 'if-you-had-to-choose', name: 'If You Had To Choose', icon: '↔️', description: 'Two options. No escaping. Pick one and explain yourself.' },
  { id: 'who-is-more-likely', name: 'Who Is More Likely To?', icon: '👉', description: 'Point fingers, defend yourself and tell the story behind it.' },
  { id: 'how-well-do-you-know-me', name: 'How Well Do You Know Me?', icon: '🎯', description: 'Guess the answer before the other person reveals it.' },
  { id: 'finish-the-sentence', name: 'Finish the Sentence', icon: '✍️', description: 'A sentence starter that gives the other person somewhere to go.' },
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
