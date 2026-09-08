const combinations = (items, size) => {
  const out = []
  const walk = (start, current) => {
    if (current.length === size) {
      out.push([...current])
      return
    }
    for (let i = start; i <= items.length - (size - current.length); i += 1) {
      current.push(items[i])
      walk(i + 1, current)
      current.pop()
    }
  }
  walk(0, [])
  return out
}

const friendPools = [
  ['Nigerian comfort foods', ['Jollof rice','Fried rice','Pounded yam','Amala','Eba','Suya','Pepper soup','Moi moi','Beans and plantain','Shawarma']],
  ['ways to spend a free Saturday', ['Sleep in','See a film','Visit friends','Try a new restaurant','Play games','Take a day trip','Stay home and binge-watch','Go to an event','Walk somewhere new','Do absolutely nothing']],
  ['things that make a friendship strong', ['Honesty','Loyalty','Humour','Reliability','Shared interests','Emotional support','Respect','Good communication','Showing up','Giving each other space']],
  ['things people spend fun money on', ['Food','Clothes','Tech','Travel','Concerts','Games','Beauty','Home stuff','Subscriptions','Gifts']],
  ['things you would miss on your phone', ['Camera','Maps','Music','Messaging','Social media','Mobile banking','Notes','YouTube','Ride-hailing','Browser']],
  ['small luxuries', ['Fast internet','Air conditioning','Food delivery','Ride-hailing','Good headphones','Premium streaming','A clean room','Fresh sheets','A quiet morning','A full tank']],
  ['holiday styles', ['Beach trip','City break','Road trip','Nature retreat','Staycation','Group trip','Solo trip','Luxury resort','Adventure trip','Food trip']],
  ['things that improve a hangout', ['Good food','Good music','Long gist','Nice location','Games','A small group','No time pressure','Good lighting','Inside jokes','Late-night energy']],
  ['school memories', ['Assembly','Inter-house sports','Excursions','Lunch break','Punishments','Class parties','Free periods','Results day','School trips','Graduation']],
  ['Nigerian party essentials', ['Jollof rice','Small chops','Good DJ','Cold drinks','Spraying money','Aso ebi','Photo booth','After-party','Live band','MC']],
  ['entertainment', ['Films','Music','Games','Books','Podcasts','YouTube','Football','Reality TV','Comedy','Anime']],
  ['social plans', ['Dinner','Cinema','House hangout','Beach','Concert','Games night','Road trip','Brunch','Football match','Late-night drive']],
  ['adult life headaches', ['Bills','Traffic','Work meetings','House chores','Bank issues','Unexpected expenses','Appointments','Family pressure','Deadlines','Poor sleep']],
  ['qualities you respect in people', ['Kindness','Discipline','Humour','Confidence','Patience','Ambition','Honesty','Loyalty','Self-awareness','Generosity']],
  ['things worth saving for', ['Travel','A car','A home','Emergency fund','Education','Business','Tech upgrade','Wedding','Investment','Family support']],
  ['ways people communicate', ['Text','Phone call','Voice note','Video call','Memes','Long messages','In-person talk','Photos','Links','Random check-ins']],
  ['things that make a good weekend', ['Rest','Good food','Friends','Sunshine','No work','A good film','Exercise','A new place','Music','A long drive']],
  ['things people are nostalgic about', ['Childhood TV','Old songs','School friends','Family holidays','Old phones','Neighbourhood games','First social media','Old snacks','School uniforms','Childhood birthdays']],
  ['personal style choices', ['Trainers','Watches','Perfume','Hoodies','Traditional wear','Caps','Jewellery','Denim','Slides','Sunglasses']],
  ['things people procrastinate', ['Laundry','Replying messages','Budgeting','Cleaning','Exercise','Booking appointments','Reading','Meal prep','Admin tasks','Sleep']],
  ['things that make travel easier', ['Good company','Money','A solid itinerary','Light luggage','Good weather','Direct flights','Good food','Reliable transport','A nice hotel','Flexible plans']],
  ['things people value at work', ['Good pay','Flexibility','Nice colleagues','Growth','Stability','Short commute','Recognition','Low stress','Interesting work','Good leadership']],
  ['simple pleasures', ['Cold water after a long day','Freshly made food','A clean bed','A favourite song','An empty road','A good laugh','Unexpected money','A cool evening','A long shower','Finishing work early']],
]

const relationshipPools = [
  ['things that make a relationship strong', ['Trust','Communication','Attraction','Friendship','Respect','Faith','Financial compatibility','Humour','Quality time','Shared goals']],
  ['ways to feel loved', ['Words','Gifts','Touch','Quality time','Acts of service','Reassurance','Being listened to','Thoughtful plans','Physical presence','Support']],
  ['date ideas', ['Dinner','Cinema','Beach day','Road trip','Stay-in night','Games night','Museum','Concert','Cooking together','Brunch']],
  ['ways to communicate when apart', ['Texts','Calls','Voice notes','Video calls','Memes','Photos','Long messages','Quick check-ins','Shared playlists','Random updates']],
  ['romantic habits', ['Good morning texts','Date nights','Surprise gifts','Love notes','Random food delivery','Long calls','Holding hands','Checking in','Compliments','Planning ahead']],
  ['forms of affection', ['Hugs','Kisses','Cuddling','Hand holding','Forehead kisses','Back rubs','Sitting close','Playing with hair','Long embraces','Quick kisses goodbye']],
  ['things couples build together', ['Memories','Money','Traditions','A home','Friendships','Faith','Routines','Travel plans','Family relationships','Future goals']],
  ['relationship challenges', ['Distance','Busy schedules','Jealousy','Money stress','Family interference','Different routines','Poor communication','Work pressure','Social media','Different expectations']],
  ['things worth discussing early', ['Money','Faith','Marriage','Children','Career plans','Family boundaries','Sex','Where to live','Debt','Communication style']],
  ['things that make dates better', ['Good conversation','Good food','Privacy','A new experience','Music','No phones','Spontaneity','Thoughtful planning','Comfort','No time pressure']],
  ['things you might celebrate together', ['Birthdays','Anniversary','Promotion','New job','Big purchase','Graduation','Personal goal','Business win','Family milestone','Random good news']],
  ['couple memories', ['First date','First trip','First photo','First argument','First gift','First long call','First holiday','First surprise','First serious talk','First time meeting friends']],
  ['partner qualities', ['Kindness','Loyalty','Ambition','Humour','Patience','Confidence','Faith','Emotional maturity','Generosity','Discipline']],
  ['future plans', ['Travel','Own a home','Build wealth','Start traditions','Raise children','Move city','Start a business','Host family','Retire early','See the world']],
  ['things that keep attraction alive', ['Flirting','Compliments','Dates','Touch','Confidence','Mystery','Effort','Dressing up','Playfulness','Time apart']],
  ['relationship boundaries', ['Privacy','Exes','Friends','Family','Phones','Social media','Money','Time alone','Work','Going out']],
  ['things that make conflict easier', ['Calm tone','Honesty','Time to cool off','Apology','Humour','Clear boundaries','Listening','Taking responsibility','Reassurance','Picking the right time']],
  ['ways to spend a couple weekend', ['Stay in','Eat out','See friends','Take a trip','Go to church','Watch films','Cook together','Attend an event','Take a long drive','Do separate things']],
  ['things people notice in a partner', ['Smile','Voice','Style','Confidence','Kindness','Humour','Eyes','Manners','Energy','How they treat people']],
  ['things couples share', ['Passwords','Locations','Money goals','Calendars','Playlists','Food','Friends','Chores','Travel plans','Family events']],
  ['small romantic gestures', ['Buy their favourite snack','Send a thoughtful text','Plan a surprise date','Leave a note','Call unexpectedly','Send a song','Bring food','Remember a small detail','Take a nice photo','Handle an annoying task']],
  ['things that test compatibility', ['Money habits','Cleanliness','Sleep schedules','Social energy','Family expectations','Faith','Travel style','Conflict style','Career ambition','Food habits']],
  ['things that make long calls enjoyable', ['Gossip','Deep questions','Stories','Music','Silence','Flirting','Planning trips','Games','Watching something together','Random observations']],
]

const labelFor = (pool, mechanic) => {
  const [name] = pool
  if (mechanic === 'rank-these') return `Rank these ${name} from first choice to last.`
  if (mechanic === 'one-has-to-go') return `One has to go from these ${name}.`
  if (mechanic === 'keep-one-forever') return `You keep only one from these ${name}.`
  return ''
}

function buildCombinationGame(mode, mechanic, size) {
  const pools = mode === 'friend' ? friendPools : relationshipPools
  const cards = []
  let poolIndex = 0
  while (cards.length < 1000) {
    const pool = pools[poolIndex % pools.length]
    const combos = combinations(pool[1], size)
    const round = Math.floor(poolIndex / pools.length)
    const start = (round * 17 + (poolIndex % pools.length) * 7) % combos.length
    for (let i = 0; i < combos.length && cards.length < 1000; i += 1) {
      const combo = combos[(start + i * 13) % combos.length]
      const fingerprint = combo.slice().sort().join('|')
      if (!cards.some(card => card.fingerprint === fingerprint)) {
        cards.push({ text: labelFor(pool, mechanic), options: combo, fingerprint })
      }
      if (cards.length % Math.ceil(1000 / pools.length) === 0) break
    }
    poolIndex += 1
  }
  return cards.map(({ fingerprint, ...card }) => card)
}

function buildThisOrThat(mode) {
  const pools = mode === 'friend' ? friendPools : relationshipPools
  const cards = []
  for (const [name, items] of pools) {
    for (const pair of combinations(items, 2)) {
      cards.push({ text: `${pair[0]} or ${pair[1]}?`, options: pair, topic: name })
      if (cards.length === 1000) return cards
    }
  }
  return cards
}

export const structuredOptionGames = {
  'rank-these': {
    friend: buildCombinationGame('friend', 'rank-these', 5),
    relationship: buildCombinationGame('relationship', 'rank-these', 5),
  },
  'one-has-to-go': {
    friend: buildCombinationGame('friend', 'one-has-to-go', 4),
    relationship: buildCombinationGame('relationship', 'one-has-to-go', 4),
  },
  'keep-one-forever': {
    friend: buildCombinationGame('friend', 'keep-one-forever', 4),
    relationship: buildCombinationGame('relationship', 'keep-one-forever', 4),
  },
  'this-or-that': {
    friend: buildThisOrThat('friend'),
    relationship: buildThisOrThat('relationship'),
  },
}
