import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft2,
  ArrowRight2,
  Book1,
  Bookmark,
  Briefcase,
  Clock,
  CloseCircle,
  Coffee,
  Copy,
  Edit2,
  Flag,
  Flash,
  Game,
  Global,
  Heart,
  Home2,
  Judge,
  MagicStar,
  Menu,
  MessageQuestion,
  MessageText1,
  Music,
  People,
  Refresh,
  SearchNormal1,
  Share,
  Shuffle,
  Sort,
  Star1,
  TickCircle,
  User,
  VideoPlay,
} from 'iconsax-react'
import {
  FRIEND_INTENSITIES,
  GAME_RESPONSE_OPTIONS,
  RELATIONSHIP_INTENSITIES,
  RELATIONSHIP_STAGES,
  allCategories,
  categoryById,
  conversationCategories,
  gameCategories,
  isGameCategory,
} from './data/catalog.js'
import {
  getCardById,
  getCards,
  librarySize,
  searchCards,
  serialiseCard,
} from './data/library.js'
import './styles.css'

const LS = {
  mode: 'stayup:v2:mode',
  favourites: 'stayup:v2:favourites',
  history: 'stayup:v2:history',
  resume: 'stayup:v2:resume',
  adult: 'stayup:v2:adult',
}
const SS_SEEN = 'stayup:v2:seen'

const iconMap = {
  profile: User,
  messages: MessageText1,
  magic: MagicStar,
  briefcase: Briefcase,
  global: Global,
  people: People,
  clock: Clock,
  book: Book1,
  coffee: Coffee,
  home: Home2,
  video: VideoPlay,
  music: Music,
  judge: Judge,
  lamp: MessageQuestion,
  shield: TickCircle,
  flash: Flash,
  tick: TickCircle,
  cards: MessageQuestion,
  heart: Heart,
  message: MessageText1,
  route: Shuffle,
  edit: Edit2,
  question: MessageQuestion,
  sort: Sort,
  close: CloseCircle,
  bookmark: Bookmark,
  star: Star1,
  flag: Flag,
  story: Book1,
}

function readJSON(storage, key, fallback) {
  try {
    const raw = storage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJSON(storage, key, value) {
  try {
    storage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage is optional. The active session still works without persistence.
  }
}

function useLocalState(key, fallback) {
  const [value, setValue] = useState(() => readJSON(localStorage, key, fallback))
  useEffect(() => writeJSON(localStorage, key, value), [key, value])
  return [value, setValue]
}

function classNames(...values) {
  return values.filter(Boolean).join(' ')
}

function CategoryIcon({ category, size = 22 }) {
  const Icon = iconMap[category?.icon] || MessageQuestion
  return <Icon size={size} variant="Linear" />
}

function Brand({ onClick }) {
  return (
    <button className="brand" onClick={onClick} aria-label="StayUp home">
      <span className="brand-symbol"><MessageText1 size="20" variant="Bold" /></span>
      <span className="brand-word">StayUp<span>.</span></span>
    </button>
  )
}

function ModeSwitch({ mode, onChange, compact = false }) {
  return (
    <div className={classNames('mode-switch', compact && 'compact')} aria-label="Conversation mode">
      <button className={mode === 'friend' ? 'active friend' : ''} onClick={() => onChange('friend')}>
        Friends
      </button>
      <button className={mode === 'relationship' ? 'active relationship' : ''} onClick={() => onChange('relationship')}>
        Relationship
      </button>
    </div>
  )
}

function Landing({ onStart, onBrowse }) {
  const sample = getCards({ categoryId: 'growing-up', mode: 'friend' })[0]
  return (
    <main className="landing">
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />
      <header className="landing-nav">
        <Brand onClick={() => {}} />
        <button className="quiet-link" onClick={() => onBrowse('explore')}>
          Browse prompts <ArrowRight2 size="17" />
        </button>
      </header>

      <section className="landing-hero">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Built for the conversation you already have</p>
          <h1>Something worth<br /><em>talking about.</em></h1>
          <p className="hero-description">
            Open StayUp while you text, call or sit together. Pick a prompt, send it or say it, then let the conversation go wherever it wants.
          </p>
          <div className="hero-points" aria-label="How StayUp works">
            <span><strong>01</strong> Pick who you are talking to</span>
            <span><strong>02</strong> Choose a category or game</span>
            <span><strong>03</strong> Keep the good conversations moving</span>
          </div>
        </div>

        <div className="hero-stage">
          <div className="sample-card">
            <div className="sample-card-top">
              <span className="sample-kicker">Growing Up</span>
              <span className="sample-dot" />
            </div>
            <p>{sample?.text || 'What is something your parents were strict about while you were growing up?'}</p>
            <div className="sample-actions">
              <span><Copy size="17" /> Copy</span>
              <span><Bookmark size="17" /> Save</span>
            </div>
          </div>
          <div className="sample-card ghost-card ghost-one" />
          <div className="sample-card ghost-card ghost-two" />
        </div>
      </section>

      <section className="who-section">
        <div className="section-intro">
          <p className="mini-label">Start here</p>
          <h2>Who are you talking to?</h2>
          <p>No room, invite or second account. One person opens StayUp and brings the prompt into the conversation.</p>
        </div>
        <div className="who-grid">
          <button className="who-choice friends" onClick={() => onStart('friend')}>
            <span className="who-icon"><People size="28" variant="Bold" /></span>
            <span className="who-text"><strong>Friends</strong><small>For gist, stories, opinions, memories and everything in between.</small></span>
            <ArrowRight2 size="22" />
          </button>
          <button className="who-choice relationship" onClick={() => onStart('relationship')}>
            <span className="who-icon"><Heart size="28" variant="Bold" /></span>
            <span className="who-text"><strong>Relationship</strong><small>From talking stage to married, with questions that fit where you are.</small></span>
            <ArrowRight2 size="22" />
          </button>
        </div>
      </section>
    </main>
  )
}

function DesktopSidebar({ page, mode, onMode, onNavigate }) {
  const items = [
    ['explore', Home2, 'Explore'],
    ['games', Game, 'Games'],
    ['favourites', Heart, 'Favourites'],
    ['history', Clock, 'History'],
  ]
  return (
    <aside className="desktop-sidebar">
      <Brand onClick={() => onNavigate('explore')} />
      <ModeSwitch mode={mode} onChange={onMode} />
      <nav className="sidebar-nav">
        {items.map(([id, Icon, label]) => (
          <button key={id} className={page === id ? 'active' : ''} onClick={() => onNavigate(id)}>
            <Icon size="21" /> <span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-note">
        <MessageQuestion size="20" />
        <div>
          <strong>One card at a time.</strong>
          <p>Stay on the prompt while the conversation develops.</p>
        </div>
      </div>
      <span className="sidebar-library">{librarySize.toLocaleString()} editorial cards currently live</span>
    </aside>
  )
}

function MobileHeader({ onMenu, onSearch, onHome }) {
  return (
    <header className="mobile-header">
      <button className="icon-button" onClick={onMenu} aria-label="Open menu"><Menu size="24" /></button>
      <Brand onClick={onHome} />
      <button className="icon-button" onClick={onSearch} aria-label="Search"><SearchNormal1 size="22" /></button>
    </header>
  )
}

function MobileNav({ page, onNavigate }) {
  const items = [
    ['explore', Home2, 'Explore'],
    ['games', Game, 'Games'],
    ['favourites', Heart, 'Saved'],
    ['history', Clock, 'History'],
  ]
  return (
    <nav className="mobile-nav">
      {items.map(([id, Icon, label]) => (
        <button key={id} className={page === id ? 'active' : ''} onClick={() => onNavigate(id)}>
          <Icon size="21" variant={page === id ? 'Bold' : 'Linear'} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}

function MobileDrawer({ open, mode, onMode, onClose, onNavigate }) {
  if (!open) return null
  return (
    <div className="drawer-layer" onClick={onClose}>
      <aside className="mobile-drawer" onClick={event => event.stopPropagation()}>
        <div className="drawer-top">
          <Brand onClick={() => { onNavigate('explore'); onClose() }} />
          <button className="icon-button" onClick={onClose}><CloseCircle size="23" /></button>
        </div>
        <p className="mini-label">Who are you talking to?</p>
        <ModeSwitch mode={mode} onChange={value => { onMode(value); onClose() }} />
        <button className="drawer-search" onClick={() => { onNavigate('search'); onClose() }}>
          <SearchNormal1 size="20" /> Search the library
        </button>
      </aside>
    </div>
  )
}

function AppTopbar({ mode, onMode, onSearch }) {
  return (
    <div className="desktop-topbar">
      <ModeSwitch mode={mode} onChange={onMode} compact />
      <button className="search-trigger" onClick={onSearch}>
        <SearchNormal1 size="19" />
        <span>Search money, secondary school, NYSC, church…</span>
        <kbd>/</kbd>
      </button>
    </div>
  )
}

function CategoryCard({ category, mode, onOpen }) {
  const available = getCards({ categoryId: category.id, mode, allow18: false }).length
  return (
    <button className="category-card" onClick={() => onOpen(category.id)}>
      <div className="category-icon"><CategoryIcon category={category} /></div>
      <div className="category-copy">
        <h3>{category.name}</h3>
        <p>{category.description}</p>
      </div>
      <div className="category-meta">
        <span>{available ? 'Open' : 'Editorial work in progress'}</span>
        <ArrowRight2 size="17" />
      </div>
    </button>
  )
}

function ExploreView({ mode, onOpen, onGames }) {
  const picks = mode === 'friend'
    ? ['getting-to-know-you', 'fun-random', 'growing-up', 'food']
    : ['getting-to-know-you', 'deep-meaningful', 'hot-takes', 'values-beliefs']
  return (
    <div className="view-shell">
      <header className="view-hero">
        <div>
          <p className="mini-label">{mode === 'friend' ? 'Friends mode' : 'Relationship mode'}</p>
          <h1>What do you feel like talking about?</h1>
          <p>Pick a direction, then stay with the card until you are ready for the next one.</p>
        </div>
        <button className={classNames('surprise-card', mode)} onClick={() => {
          const available = allCategories.filter(category => getCards({ categoryId: category.id, mode }).length)
          const pick = available[Math.floor(Math.random() * available.length)]
          if (pick) onOpen(pick.id, true)
        }}>
          <Shuffle size="25" />
          <span><strong>Surprise me</strong><small>Jump somewhere random</small></span>
        </button>
      </header>

      <section className="quick-section">
        <div className="section-heading">
          <div><p className="mini-label">Good places to start</p><h2>Pick a lane</h2></div>
        </div>
        <div className="quick-grid">
          {picks.map(id => {
            const category = categoryById[id]
            return (
              <button key={id} onClick={() => onOpen(id)}>
                <span className="quick-icon"><CategoryIcon category={category} size={20} /></span>
                <strong>{category.name}</strong>
                <ArrowRight2 size="16" />
              </button>
            )
          })}
        </div>
      </section>

      <section className="library-section">
        <div className="section-heading">
          <div><p className="mini-label">Conversation starters</p><h2>Talk about anything</h2></div>
          <span>{conversationCategories.length} categories</span>
        </div>
        <div className="category-grid">
          {conversationCategories.map(category => (
            <CategoryCard key={category.id} category={category} mode={mode} onOpen={onOpen} />
          ))}
        </div>
      </section>

      <button className="games-banner" onClick={onGames}>
        <span className="games-banner-icon"><Game size="28" variant="Bold" /></span>
        <span>
          <small>Change the rhythm</small>
          <strong>Turn the conversation into a game.</strong>
          <p>Different mechanics, same chat or call.</p>
        </span>
        <ArrowRight2 size="23" />
      </button>
    </div>
  )
}

function GamesView({ mode, onOpen }) {
  return (
    <div className="view-shell">
      <header className="view-hero single">
        <div>
          <p className="mini-label">Games</p>
          <h1>Less question list. More interaction.</h1>
          <p>Each game has its own mechanic. Nothing here needs a shared room or a second StayUp screen.</p>
        </div>
      </header>
      <section className="library-section no-gap">
        <div className="section-heading">
          <div><p className="mini-label">{mode === 'friend' ? 'Friends' : 'Relationship'}</p><h2>Pick a game</h2></div>
          <span>{gameCategories.length} games</span>
        </div>
        <div className="category-grid game-grid">
          {gameCategories.map(category => (
            <CategoryCard key={category.id} category={category} mode={mode} onOpen={onOpen} />
          ))}
        </div>
      </section>
    </div>
  )
}

function FilterBar({
  mode,
  intensity,
  onIntensity,
  stage,
  onStage,
  adult,
  onAdult,
  categoryId,
  subtype,
  onSubtype,
}) {
  const intensities = mode === 'friend' ? FRIEND_INTENSITIES : RELATIONSHIP_INTENSITIES
  return (
    <aside className="filter-rail">
      <div className="filter-group">
        <span className="filter-title">Intensity</span>
        <div className="filter-chips vertical">
          <button className={intensity === 'All' ? 'active' : ''} onClick={() => onIntensity('All')}>All</button>
          {intensities.map(value => (
            <button
              key={value}
              className={intensity === value ? 'active' : ''}
              onClick={() => value === 'Spicy' && !adult ? onAdult(true, value) : onIntensity(value)}
            >
              {value}{value === 'Spicy' && !adult ? <span className="lock-text">18+</span> : null}
            </button>
          ))}
        </div>
      </div>

      {mode === 'relationship' ? (
        <div className="filter-group">
          <span className="filter-title">Relationship stage</span>
          <select value={stage} onChange={event => onStage(event.target.value)}>
            <option>All</option>
            {RELATIONSHIP_STAGES.map(value => <option key={value}>{value}</option>)}
          </select>
        </div>
      ) : null}

      {categoryId === 'truth-dare' ? (
        <div className="filter-group">
          <span className="filter-title">Truth or Dare</span>
          <div className="truth-switch">
            {['Truth', 'Dare'].map(value => (
              <button key={value} className={subtype === value ? 'active' : ''} onClick={() => onSubtype(value)}>{value}</button>
            ))}
          </div>
        </div>
      ) : null}

      {mode === 'relationship' ? (
        <div className="filter-group adult-filter">
          <div>
            <span className="filter-title">18+ audience</span>
            <small>Explicitly intimate cards stay hidden by default.</small>
          </div>
          <button className={classNames('toggle', adult && 'on')} onClick={() => onAdult(!adult)}>
            <span />
          </button>
        </div>
      ) : null}
    </aside>
  )
}

function CompactMobileFilters({
  mode,
  intensity,
  onIntensity,
  stage,
  onStage,
  categoryId,
  subtype,
  onSubtype,
  adult,
  onAdult,
}) {
  const values = mode === 'friend' ? FRIEND_INTENSITIES : RELATIONSHIP_INTENSITIES
  return (
    <div className="mobile-filters">
      {categoryId === 'truth-dare' ? (
        <div className="truth-switch inline">
          {['Truth', 'Dare'].map(value => (
            <button key={value} className={subtype === value ? 'active' : ''} onClick={() => onSubtype(value)}>{value}</button>
          ))}
        </div>
      ) : null}
      <div className="horizontal-chips">
        <button className={intensity === 'All' ? 'active' : ''} onClick={() => onIntensity('All')}>All</button>
        {values.map(value => (
          <button
            key={value}
            className={intensity === value ? 'active' : ''}
            onClick={() => value === 'Spicy' && !adult ? onAdult(true, value) : onIntensity(value)}
          >
            {value}{value === 'Spicy' && !adult ? ' 18+' : ''}
          </button>
        ))}
      </div>
      {mode === 'relationship' ? (
        <select value={stage} onChange={event => onStage(event.target.value)}>
          <option>All</option>
          {RELATIONSHIP_STAGES.map(value => <option key={value}>{value}</option>)}
        </select>
      ) : null}
    </div>
  )
}

function sessionSeen() {
  return readJSON(sessionStorage, SS_SEEN, {})
}

function chooseUnseen(pool, poolKey, random = false) {
  if (!pool.length) return { card: null, exhausted: false }
  const allSeen = sessionSeen()
  const seen = new Set(allSeen[poolKey] || [])
  let available = pool.filter(card => !seen.has(card.id))
  let exhausted = false
  if (!available.length) {
    available = pool
    allSeen[poolKey] = []
    writeJSON(sessionStorage, SS_SEEN, allSeen)
    exhausted = true
  }
  const card = random
    ? available[Math.floor(Math.random() * available.length)]
    : available[0]
  return { card, exhausted }
}

function markSeen(poolKey, cardId) {
  if (!cardId) return
  const allSeen = sessionSeen()
  const current = new Set(allSeen[poolKey] || [])
  current.add(cardId)
  allSeen[poolKey] = [...current]
  writeJSON(sessionStorage, SS_SEEN, allSeen)
}

function copyText(text) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text)
  const area = document.createElement('textarea')
  area.value = text
  area.style.position = 'fixed'
  area.style.opacity = '0'
  document.body.appendChild(area)
  area.select()
  document.execCommand('copy')
  area.remove()
  return Promise.resolve()
}

function mechanicHint(card) {
  const hints = {
    'truth-dare': card?.subtype === 'Dare' ? 'Do it over the chat or call.' : 'Answer it properly.',
    statement: 'Say whether you have or have not.',
    'two-truths-lie': 'Privately choose your lie before you send the set.',
    'kiss-marry-avoid': 'Assign one choice to Kiss, one to Marry and one to Avoid.',
    scenario: 'Say what you would do, then explain why.',
    'hard-choice': 'Pick one. The explanation is the game.',
    who: 'Pick which of you is more likely, then defend it.',
    predict: 'The other person predicts first. Reveal the real answer after.',
    finish: 'Complete the sentence in your own words.',
    rank: 'Rank all five from first to last.',
    agree: 'Pick a side, then explain it.',
    eliminate: 'Remove one option.',
    keep: 'Keep one and lose the rest.',
    rating: 'Give it a score from 1 to 10.',
    'quick-choice': 'First answer wins. No long thinking.',
    verdict: 'Pick a verdict, then explain the context.',
    petty: 'Petty, valid or somewhere in between?',
    story: 'Tell the full version, not the short answer.',
  }
  return hints[card?.mechanic] || 'Let the answer turn into a conversation.'
}

function GameBody({ card }) {
  const [choice, setChoice] = useState(null)
  const [assignments, setAssignments] = useState({})
  const [ranked, setRanked] = useState([])
  useEffect(() => {
    setChoice(null)
    setAssignments({})
    setRanked([])
  }, [card?.id])
  if (!card) return null

  if (card.mechanic === 'two-truths-lie') {
    return (
      <div className="option-stack selectable">
        {card.options.map((option, index) => (
          <button key={option} className={choice === index ? 'selected-private' : ''} onClick={() => setChoice(index)}>
            <span>{index + 1}</span><strong>{option}</strong>
            {choice === index ? <small>Your lie</small> : null}
          </button>
        ))}
        <p className="private-note">Your lie selection stays on this screen and is not included when you copy or share.</p>
      </div>
    )
  }

  if (card.mechanic === 'kiss-marry-avoid') {
    const roles = ['Kiss', 'Marry', 'Avoid']
    const assign = (index, role) => {
      setAssignments(previous => {
        const next = { ...previous }
        Object.keys(next).forEach(key => {
          if (next[key] === role) delete next[key]
        })
        next[index] = role
        return next
      })
    }
    return (
      <div className="kma-stack">
        {card.options.map((option, index) => (
          <div className="kma-option" key={option}>
            <strong>{option}</strong>
            <div>
              {roles.map(role => (
                <button key={role} className={assignments[index] === role ? 'selected' : ''} onClick={() => assign(index, role)}>{role}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (card.mechanic === 'rank') {
    const toggleRank = index => {
      setRanked(previous => previous.includes(index)
        ? previous.filter(value => value !== index)
        : [...previous, index])
    }
    return (
      <div className="option-stack rank-stack">
        {card.options.map((option, index) => {
          const position = ranked.indexOf(index)
          return (
            <button key={option} className={position >= 0 ? 'selected' : ''} onClick={() => toggleRank(index)}>
              <span>{position >= 0 ? position + 1 : '–'}</span>
              <strong>{option}</strong>
              <small>{position >= 0 ? `Rank ${position + 1}` : 'Tap in order'}</small>
            </button>
          )
        })}
      </div>
    )
  }

  if (card.mechanic === 'rating') {
    return (
      <div className="rating-row" aria-label="Rating from 1 to 10">
        {Array.from({ length: 10 }, (_, index) => index + 1).map(value => (
          <button key={value} className={choice === value ? 'selected' : ''} onClick={() => setChoice(value)}>{value}</button>
        ))}
      </div>
    )
  }

  const responseOptions = GAME_RESPONSE_OPTIONS[card.categoryId]
  if (responseOptions) {
    return (
      <>
        {card.options?.length ? (
          <div className="option-grid">
            {card.options.map((option, index) => (
              <div className="game-option" key={option}><span>{index + 1}</span><strong>{option}</strong></div>
            ))}
          </div>
        ) : null}
        <div className="response-row">
          {responseOptions.map(value => (
            <button key={value} className={choice === value ? 'selected' : ''} onClick={() => setChoice(value)}>{value}</button>
          ))}
        </div>
      </>
    )
  }

  if (card.options?.length) {
    return (
      <div className={classNames('option-grid', card.options.length === 2 && 'two')}>
        {card.options.map((option, index) => (
          <button key={option} className={choice === index ? 'selected' : ''} onClick={() => setChoice(index)}>
            <span>{String.fromCharCode(65 + index)}</span>
            <strong>{option}</strong>
          </button>
        ))}
      </div>
    )
  }

  return null
}

function EmptyPool({ category, onClearFilters }) {
  return (
    <div className="empty-pool">
      <Refresh size="35" />
      <h2>No published card matches these filters yet.</h2>
      <p>{category?.name} still has editorial gaps in this combination. The app will not fill them with generated wording.</p>
      <button onClick={onClearFilters}>Clear filters</button>
    </div>
  )
}

function PlayView({
  categoryId,
  mode,
  intensity,
  onIntensity,
  stage,
  onStage,
  adult,
  onAdult,
  subtype,
  onSubtype,
  favourites,
  setFavourites,
  setHistory,
  initialCardId,
  clearInitialCard,
  onBack,
}) {
  const category = categoryById[categoryId]
  const effectiveSubtype = categoryId === 'truth-dare' ? subtype : 'All'
  const pool = useMemo(() => getCards({
    categoryId,
    mode,
    intensity,
    stage,
    allow18: adult,
    subtype: effectiveSubtype,
  }), [categoryId, mode, intensity, stage, adult, effectiveSubtype])

  const poolKey = `${categoryId}|${mode}|${intensity}|${stage}|${adult ? '18' : 'general'}|${effectiveSubtype}`
  const [trail, setTrail] = useState([])
  const [trailIndex, setTrailIndex] = useState(-1)
  const [toast, setToast] = useState('')
  const timer = useRef(null)

  const currentId = trail[trailIndex]
  const current = currentId && pool.some(card => card.id === currentId) ? getCardById(currentId) : null

  const notify = message => {
    setToast(message)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setToast(''), 2200)
  }

  useEffect(() => () => window.clearTimeout(timer.current), [])

  useEffect(() => {
    if (!pool.length) {
      setTrail([])
      setTrailIndex(-1)
      return
    }

    const target = initialCardId && pool.some(card => card.id === initialCardId)
      ? getCardById(initialCardId)
      : null
    const resume = readJSON(localStorage, LS.resume, {})
    const resumed = resume[poolKey] && pool.some(card => card.id === resume[poolKey])
      ? getCardById(resume[poolKey])
      : null
    const pick = target || resumed || chooseUnseen(pool, poolKey, false).card
    if (pick) {
      setTrail([pick.id])
      setTrailIndex(0)
    }
    clearInitialCard?.()
  }, [poolKey])

  useEffect(() => {
    if (!current) return
    markSeen(poolKey, current.id)
    const resume = readJSON(localStorage, LS.resume, {})
    resume[poolKey] = current.id
    writeJSON(localStorage, LS.resume, resume)

    setHistory(previous => [current.id, ...previous.filter(id => id !== current.id)].slice(0, 200))
  }, [current?.id, poolKey])

  const moveTo = card => {
    if (!card) return
    const prefix = trail.slice(0, trailIndex + 1)
    setTrail([...prefix, card.id])
    setTrailIndex(prefix.length)
  }

  const next = random => {
    if (trailIndex < trail.length - 1 && !random) {
      setTrailIndex(index => index + 1)
      return
    }
    const result = chooseUnseen(pool, poolKey, random)
    if (result.exhausted) notify('You reached the end of this pool. Starting a fresh round.')
    moveTo(result.card)
  }

  const previous = () => {
    if (trailIndex > 0) setTrailIndex(index => index - 1)
  }

  const toggleFavourite = () => {
    if (!current) return
    setFavourites(previous => previous.includes(current.id)
      ? previous.filter(id => id !== current.id)
      : [current.id, ...previous])
  }

  const copyCurrent = async () => {
    if (!current) return
    await copyText(serialiseCard(current))
    notify('Copied')
  }

  const shareCurrent = async () => {
    if (!current) return
    const text = serialiseCard(current)
    if (navigator.share) {
      try {
        await navigator.share({ text })
        return
      } catch {
        return
      }
    }
    await copyText(text)
    notify('Copied for sharing')
  }

  const clearFilters = () => {
    onIntensity('All')
    onStage('All')
    if (categoryId === 'truth-dare') onSubtype('Truth')
  }

  return (
    <div className="play-layout">
      <div className="play-main">
        <div className="play-topline">
          <button className="back-link" onClick={onBack}><ArrowLeft2 size="18" /> Back</button>
          <div className="play-title">
            <span className="play-icon"><CategoryIcon category={category} size={18} /></span>
            <strong>{category?.name}</strong>
          </div>
          <span className="pool-progress">{pool.length ? `${pool.length} in this filter` : 'No match'}</span>
        </div>

        <CompactMobileFilters
          mode={mode}
          intensity={intensity}
          onIntensity={onIntensity}
          stage={stage}
          onStage={onStage}
          categoryId={categoryId}
          subtype={subtype}
          onSubtype={onSubtype}
          adult={adult}
          onAdult={onAdult}
        />

        {!current ? (
          <EmptyPool category={category} onClearFilters={clearFilters} />
        ) : (
          <>
            <article className={classNames('prompt-card', mode, isGameCategory(categoryId) && 'game-card')}>
              <div className="prompt-card-head">
                <div className="card-labels">
                  <span>{current.intensity}</span>
                  {current.subtype ? <span>{current.subtype}</span> : null}
                  {current.audience === '18+' ? <span>18+</span> : null}
                </div>
                <button className={classNames('save-card', favourites.includes(current.id) && 'saved')} onClick={toggleFavourite} aria-label="Save card">
                  <Heart size="21" variant={favourites.includes(current.id) ? 'Bold' : 'Linear'} />
                </button>
              </div>

              <div className="prompt-card-body">
                {isGameCategory(categoryId) ? <p className="mechanic-label">{mechanicHint(current)}</p> : null}
                <h2>{current.text}</h2>
                <GameBody card={current} />
              </div>

              <div className="prompt-card-foot">
                <span>{mode === 'friend' ? 'Friends' : stage === 'All' ? 'Relationship' : stage}</span>
                <span>{category?.name}</span>
              </div>
            </article>

            <div className="primary-actions">
              <button className={classNames('copy-action', mode)} onClick={copyCurrent}>
                <Copy size="20" variant="Bold" /> Copy
              </button>
              <button onClick={shareCurrent}><Share size="20" /> <span>Share</span></button>
              <button className={favourites.includes(current.id) ? 'saved' : ''} onClick={toggleFavourite}>
                <Bookmark size="20" variant={favourites.includes(current.id) ? 'Bold' : 'Linear'} /> <span>Save</span>
              </button>
            </div>

            <div className="navigation-actions">
              <button onClick={previous} disabled={trailIndex <= 0}><ArrowLeft2 size="19" /> Previous</button>
              <button onClick={() => next(true)}><Shuffle size="19" /> Random</button>
              <button onClick={() => next(false)}>Next <ArrowRight2 size="19" /></button>
            </div>
          </>
        )}
        {toast ? <div className="toast"><TickCircle size="18" /> {toast}</div> : null}
      </div>

      <FilterBar
        mode={mode}
        intensity={intensity}
        onIntensity={onIntensity}
        stage={stage}
        onStage={onStage}
        adult={adult}
        onAdult={onAdult}
        categoryId={categoryId}
        subtype={subtype}
        onSubtype={onSubtype}
      />
    </div>
  )
}

function SearchView({ mode, stage, adult, query, setQuery, onOpenCard }) {
  const results = useMemo(() => searchCards(query, { mode, stage, allow18: adult }).slice(0, 120), [query, mode, stage, adult])
  const suggestions = ['money', 'secondary school', 'ex', 'marriage', 'childhood', 'music', 'family', 'NYSC', 'church']
  return (
    <div className="view-shell search-view">
      <header className="search-header">
        <p className="mini-label">Search StayUp</p>
        <h1>Find the conversation you have in mind.</h1>
        <div className="search-box">
          <SearchNormal1 size="22" />
          <input autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder="Try money, NYSC, childhood, church…" />
          {query ? <button onClick={() => setQuery('')}><CloseCircle size="20" /></button> : null}
        </div>
        <div className="suggestion-row">
          {suggestions.map(value => <button key={value} onClick={() => setQuery(value)}>{value}</button>)}
        </div>
      </header>

      {query ? (
        <section className="results-section">
          <div className="section-heading">
            <div><h2>{results.length ? `${results.length} result${results.length === 1 ? '' : 's'}` : 'No results yet'}</h2></div>
            <span>{mode === 'friend' ? 'Friends' : stage === 'All' ? 'Relationship' : stage}</span>
          </div>
          <div className="result-list">
            {results.map(card => {
              const category = categoryById[card.categoryId]
              return (
                <button key={card.id} className="result-card" onClick={() => onOpenCard(card)}>
                  <span className="result-icon"><CategoryIcon category={category} size={19} /></span>
                  <span className="result-copy">
                    <small>{category.name} · {card.intensity}</small>
                    <strong>{card.text}</strong>
                    {card.options?.length ? <em>{card.options.join(' · ')}</em> : null}
                  </span>
                  <ArrowRight2 size="18" />
                </button>
              )
            })}
          </div>
        </section>
      ) : null}
    </div>
  )
}

function SavedView({ title, ids, empty, onOpenCard, onClear }) {
  const cards = ids.map(getCardById).filter(Boolean)
  return (
    <div className="view-shell saved-view">
      <header className="view-hero single">
        <div>
          <p className="mini-label">Your device</p>
          <h1>{title}</h1>
          <p>{title === 'Favourites' ? 'The cards you wanted to keep.' : 'Recently opened cards, newest first.'}</p>
        </div>
        {cards.length && onClear ? <button className="clear-button" onClick={onClear}>Clear history</button> : null}
      </header>
      {cards.length ? (
        <div className="result-list saved-list">
          {cards.map(card => {
            const category = categoryById[card.categoryId]
            return (
              <button key={card.id} className="result-card" onClick={() => onOpenCard(card)}>
                <span className="result-icon"><CategoryIcon category={category} size={19} /></span>
                <span className="result-copy">
                  <small>{category.name} · {card.mode === 'friend' ? 'Friends' : 'Relationship'}</small>
                  <strong>{card.text}</strong>
                </span>
                <ArrowRight2 size="18" />
              </button>
            )
          })}
        </div>
      ) : (
        <div className="empty-state">
          {title === 'Favourites' ? <Heart size="36" /> : <Clock size="36" />}
          <h2>{empty}</h2>
          <p>{title === 'Favourites' ? 'Use Save on any card and it will appear here.' : 'Open a few prompts and your recent trail will show here.'}</p>
        </div>
      )}
    </div>
  )
}

function AgeGate({ open, onConfirm, onCancel }) {
  if (!open) return null
  return (
    <div className="modal-layer" role="dialog" aria-modal="true">
      <div className="age-modal">
        <span className="age-icon">18+</span>
        <h2>Adult audience</h2>
        <p>This opens tasteful relationship cards that discuss physical or sexual intimacy more directly. Continue only if you are 18 or older.</p>
        <div className="modal-actions">
          <button onClick={onCancel}>Keep hidden</button>
          <button className="confirm" onClick={onConfirm}>I am 18+</button>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState(() => readJSON(localStorage, 'stayup:v2:visited', false) ? 'explore' : 'landing')
  const [mode, setMode] = useLocalState(LS.mode, 'friend')
  const [favourites, setFavourites] = useLocalState(LS.favourites, [])
  const [history, setHistory] = useLocalState(LS.history, [])
  const [adult, setAdult] = useLocalState(LS.adult, false)
  const [categoryId, setCategoryId] = useState('getting-to-know-you')
  const [intensity, setIntensity] = useState('All')
  const [stage, setStage] = useState('All')
  const [subtype, setSubtype] = useState('Truth')
  const [query, setQuery] = useState('')
  const [drawer, setDrawer] = useState(false)
  const [ageGate, setAgeGate] = useState(false)
  const [pendingSpicy, setPendingSpicy] = useState(false)
  const [initialCardId, setInitialCardId] = useState(null)
  const [returnPage, setReturnPage] = useState('explore')

  const changeMode = nextMode => {
    setMode(nextMode)
    setIntensity('All')
    setStage('All')
    setSubtype('Truth')
    setInitialCardId(null)
  }

  const start = nextMode => {
    changeMode(nextMode)
    writeJSON(localStorage, 'stayup:v2:visited', true)
    setPage('explore')
  }

  const navigate = nextPage => {
    if (nextPage !== 'play') setInitialCardId(null)
    setPage(nextPage)
  }

  const openCategory = (id, random = false) => {
    setReturnPage(isGameCategory(id) ? 'games' : 'explore')
    setCategoryId(id)
    setIntensity('All')
    setStage('All')
    setSubtype('Truth')
    setInitialCardId(null)
    if (random) {
      const candidates = getCards({ categoryId: id, mode, allow18: adult })
      const card = candidates[Math.floor(Math.random() * candidates.length)]
      if (card) setInitialCardId(card.id)
    }
    setPage('play')
  }

  const openCard = card => {
    if (!card) return
    if (card.mode !== mode) changeMode(card.mode)
    setCategoryId(card.categoryId)
    setIntensity('All')
    setStage('All')
    setSubtype(card.subtype || 'Truth')
    setInitialCardId(card.id)
    setReturnPage(isGameCategory(card.categoryId) ? 'games' : 'explore')
    setPage('play')
  }

  const requestAdult = (value, source) => {
    if (!value) {
      setAdult(false)
      if (intensity === 'Spicy') setIntensity('All')
      return
    }
    if (adult) {
      setAdult(true)
      return
    }
    setPendingSpicy(source === 'Spicy')
    setAgeGate(true)
  }

  useEffect(() => {
    const handler = event => {
      if (event.key === '/' && page !== 'landing' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        event.preventDefault()
        setPage('search')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [page])

  if (page === 'landing') {
    return <Landing onStart={start} onBrowse={() => { writeJSON(localStorage, 'stayup:v2:visited', true); setPage('explore') }} />
  }

  return (
    <div className={classNames('app-shell', `mode-${mode}`)}>
      <DesktopSidebar page={page === 'play' ? returnPage : page} mode={mode} onMode={changeMode} onNavigate={navigate} />
      <MobileHeader onMenu={() => setDrawer(true)} onSearch={() => setPage('search')} onHome={() => setPage('explore')} />
      <MobileDrawer open={drawer} mode={mode} onMode={changeMode} onClose={() => setDrawer(false)} onNavigate={navigate} />

      <div className="app-content">
        <AppTopbar mode={mode} onMode={changeMode} onSearch={() => setPage('search')} />
        {page === 'explore' ? <ExploreView mode={mode} onOpen={openCategory} onGames={() => setPage('games')} /> : null}
        {page === 'games' ? <GamesView mode={mode} onOpen={openCategory} /> : null}
        {page === 'search' ? (
          <SearchView mode={mode} stage={stage} adult={adult} query={query} setQuery={setQuery} onOpenCard={openCard} />
        ) : null}
        {page === 'favourites' ? (
          <SavedView title="Favourites" ids={favourites} empty="Nothing saved yet." onOpenCard={openCard} />
        ) : null}
        {page === 'history' ? (
          <SavedView title="History" ids={history} empty="No recent cards yet." onOpenCard={openCard} onClear={() => setHistory([])} />
        ) : null}
        {page === 'play' ? (
          <PlayView
            categoryId={categoryId}
            mode={mode}
            intensity={intensity}
            onIntensity={setIntensity}
            stage={stage}
            onStage={setStage}
            adult={adult}
            onAdult={requestAdult}
            subtype={subtype}
            onSubtype={setSubtype}
            favourites={favourites}
            setFavourites={setFavourites}
            setHistory={setHistory}
            initialCardId={initialCardId}
            clearInitialCard={() => setInitialCardId(null)}
            onBack={() => setPage(returnPage)}
          />
        ) : null}
      </div>

      <MobileNav page={page === 'play' ? returnPage : page} onNavigate={navigate} />

      <AgeGate
        open={ageGate}
        onCancel={() => { setAgeGate(false); setPendingSpicy(false) }}
        onConfirm={() => {
          setAdult(true)
          setAgeGate(false)
          if (pendingSpicy) setIntensity('Spicy')
          setPendingSpicy(false)
        }}
      />
    </div>
  )
}
