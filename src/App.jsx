import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  allCategories,
  conversationCategories,
  friendIntensities,
  gameCategories,
  relationshipIntensities,
  relationshipStages,
} from './data/categories'
import { getAllPrompts, getPrompts } from './data/prompts'
import { APP_NAME } from './config'

const LS = {
  favourites: 'stayup:favourites',
  history: 'stayup:history',
  resume: 'stayup:resume',
  seen: 'stayup:seen',
  mode: 'stayup:mode',
  audience: 'stayup:audience',
  visited: 'stayup:visited',
}

function readLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeLS(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Local storage is optional. The app still works without persistence.
  }
}

function Icon({ name, size = 20 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  const paths = {
    copy: <><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>,
    heart: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>,
    share: <><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.59 13.51 6.83 3.98M15.41 6.51 8.59 10.49"/></>,
    next: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    back: <><path d="M19 12H5"/><path d="m11 18-6-6 6-6"/></>,
    shuffle: <><path d="M16 3h5v5"/><path d="M4 20 21 3"/><path d="M21 16v5h-5"/><path d="m15 15 6 6"/><path d="M4 4l5 5"/></>,
    search: <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></>,
    home: <><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></>,
    game: <><path d="M8 9h8"/><path d="M12 5v8"/><circle cx="18" cy="15" r="1"/><circle cx="15" cy="18" r="1"/><path d="M6 19h12a4 4 0 0 0 3.9-4.9l-1.2-5A4 4 0 0 0 16.8 6H7.2a4 4 0 0 0-3.9 3.1l-1.2 5A4 4 0 0 0 6 19Z"/></>,
    spark: <><path d="m12 3-1.2 3.8L7 8l3.8 1.2L12 13l1.2-3.8L17 8l-3.8-1.2L12 3Z"/><path d="m5 14-.8 2.2L2 17l2.2.8L5 20l.8-2.2L8 17l-2.2-.8L5 14Z"/><path d="m19 13-.7 1.8-1.8.7 1.8.7L19 18l.7-1.8 1.8-.7-1.8-.7L19 13Z"/></>,
    history: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/></>,
    close: <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>,
    menu: <><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    phone: <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.28-1.28a2 2 0 0 1 2.11-.45c.9.33 1.84.56 2.8.69A2 2 0 0 1 22 16.92Z"/></>,
    message: <><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/><path d="M8 9h8M8 13h5"/></>,
  }
  return <svg {...common}>{paths[name]}</svg>
}

function ModeSwitch({ mode, onChange, compact = false }) {
  return (
    <div className={`mode-switch ${compact ? 'compact' : ''}`}>
      <button className={mode === 'friend' ? 'active' : ''} onClick={() => onChange('friend')}>Friends</button>
      <button className={mode === 'relationship' ? 'active' : ''} onClick={() => onChange('relationship')}>Relationship</button>
    </div>
  )
}

function Brand() {
  return (
    <div className="brand">
      <span className="brand-mark"><span /></span>
      <span>{APP_NAME}<span className="brand-dot">.</span></span>
    </div>
  )
}

function Landing({ onStart, onCategory }) {
  return (
    <main className="landing-shell">
      <div className="landing-orb orb-one" />
      <div className="landing-orb orb-two" />
      <nav className="landing-nav">
        <Brand />
        <button className="text-button" onClick={() => onStart('friend')}>Browse everything <Icon name="next" size={17}/></button>
      </nav>

      <section className="hero">
        <div className="eyebrow"><span className="live-dot"/> Made for texts, calls and late-night gist</div>
        <h1>Never run out of<br/><span>things to talk about.</span></h1>
        <p className="hero-copy">Open a prompt, copy it into your chat or say it on the call. Find something funny, deep, random, flirty or completely unexpected whenever the conversation needs somewhere new to go.</p>

        <div className="hero-how">
          <div><span>01</span> Pick who you are talking to</div>
          <div><span>02</span> Find a question or game</div>
          <div><span>03</span> Copy it or say it</div>
        </div>

        <div className="who-card">
          <div className="who-card-copy">
            <p className="mini-label">What are we doing tonight?</p>
            <h2>Who are you talking to?</h2>
          </div>
          <div className="who-options">
            <button className="who-option friends" onClick={() => onStart('friend')}>
              <span className="who-icon">✦</span>
              <span><strong>Friends</strong><small>New friends, close friends, someone you just met.</small></span>
              <Icon name="next"/>
            </button>
            <button className="who-option relationship" onClick={() => onStart('relationship')}>
              <span className="who-icon">♡</span>
              <span><strong>Relationship</strong><small>Talking stage, dating, long-term or married.</small></span>
              <Icon name="next"/>
            </button>
          </div>
        </div>
      </section>

      <section className="landing-categories">
        <div className="section-heading">
          <div><p className="mini-label">Jump straight in</p><h2>Pick a conversation</h2></div>
          <p>Start with a category and switch between Friends and Relationship inside it.</p>
        </div>
        <div className="landing-category-grid">
          {conversationCategories.slice(0, 8).map(category => (
            <button key={category.id} className="landing-category" onClick={() => onCategory(category.id)}>
              <span>{category.icon}</span>
              <strong>{category.name}</strong>
              <Icon name="next" size={16}/>
            </button>
          ))}
        </div>
      </section>

      <section className="landing-note">
        <Icon name="message" size={22}/>
        <p>No rooms. No invites. The other person does not need this site. StayUp gives you the next thing worth asking.</p>
        <Icon name="phone" size={22}/>
      </section>
    </main>
  )
}

function Sidebar({ view, setView, mode, setMode, closeMobile }) {
  const nav = [
    ['home', 'home', 'Explore'],
    ['games', 'game', 'Games'],
    ['favourites', 'heart', 'Favourites'],
    ['history', 'history', 'History'],
  ]
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <Brand />
        <button className="sidebar-close" onClick={closeMobile}><Icon name="close"/></button>
      </div>
      <ModeSwitch mode={mode} onChange={m => { setMode(m); closeMobile?.() }} />
      <div className="side-nav">
        {nav.map(([id, icon, label]) => (
          <button key={id} className={view === id ? 'active' : ''} onClick={() => { setView(id); closeMobile?.() }}>
            <Icon name={icon}/><span>{label}</span>
          </button>
        ))}
      </div>
      <div className="sidebar-tip">
        <span><Icon name="spark" size={17}/></span>
        <div><strong>Keep it simple.</strong><p>Find a prompt. Copy it. Go back to your conversation.</p></div>
      </div>
      <p className="device-note">Favourites and history stay on this device.</p>
    </aside>
  )
}

function CategoryCard({ category, onClick, game = false }) {
  return (
    <button className="category-card" onClick={() => onClick(category.id)}>
      <div className="category-card-top">
        <span className="category-emoji">{category.icon}</span>
        <span className="prompt-count">{category.id === 'truth-dare' ? '1,000' : '500'} prompts</span>
      </div>
      <div>
        <h3>{category.name}</h3>
        <p>{category.description}</p>
      </div>
      <div className="category-card-bottom">
        <span>{game ? 'Play from anywhere' : 'Open category'}</span>
        <span className="circle-arrow"><Icon name="next" size={17}/></span>
      </div>
    </button>
  )
}

function HomeView({ mode, onCategory, setView }) {
  const picks = mode === 'friend'
    ? ['getting-to-know-you', 'fun-random', 'nigeria', 'nostalgia']
    : ['getting-to-know-you', 'deep-meaningful', 'hot-takes', 'values-beliefs']
  return (
    <div className="page-view">
      <header className="page-hero compact-hero">
        <div>
          <p className="mini-label">{mode === 'friend' ? 'Friends mode' : 'Relationship mode'}</p>
          <h1>What do you feel like talking about?</h1>
          <p>Pick a category, then keep moving through prompts without leaving the conversation you are already having.</p>
        </div>
        <button className="random-hero" onClick={() => onCategory(allCategories[Math.floor(Math.random() * allCategories.length)].id, true)}>
          <Icon name="shuffle"/><span><strong>Surprise me</strong><small>Open something random</small></span>
        </button>
      </header>

      <section className="quick-picks">
        <div className="section-title-line"><h2>Good places to start</h2><span>Based on {mode === 'friend' ? 'friend' : 'relationship'} mode</span></div>
        <div className="quick-grid">
          {picks.map(id => {
            const category = allCategories.find(c => c.id === id)
            return <button key={id} onClick={() => onCategory(id)}><span>{category.icon}</span><strong>{category.name}</strong><Icon name="next" size={16}/></button>
          })}
        </div>
      </section>

      <section className="content-section">
        <div className="section-title-line"><div><p className="mini-label">Conversation library</p><h2>Talk about anything</h2></div><span>{conversationCategories.length * 500} prompts in this mode</span></div>
        <div className="category-grid">
          {conversationCategories.map(category => <CategoryCard key={category.id} category={category} onClick={onCategory}/>) }
        </div>
      </section>

      <section className="game-banner" onClick={() => setView('games')} role="button" tabIndex={0}>
        <div className="game-banner-icon">⚡</div>
        <div><p className="mini-label">Switch it up</p><h2>Turn the conversation into a game.</h2><p>Truth or Dare, Never Have I Ever, scenarios, impossible choices and more.</p></div>
        <span className="circle-arrow large"><Icon name="next"/></span>
      </section>
    </div>
  )
}

function GamesView({ mode, onCategory }) {
  return (
    <div className="page-view">
      <header className="page-hero compact-hero">
        <div>
          <p className="mini-label">Games</p>
          <h1>Less small talk. More chaos.</h1>
          <p>Open a prompt, then send it in your chat or say it on the call. Nothing here requires both people to open the site.</p>
        </div>
      </header>
      <section className="content-section no-top">
        <div className="section-title-line"><h2>Pick a game</h2><span>{gameCategories.reduce((n, c) => n + (c.id === 'truth-dare' ? 1000 : 500), 0)} prompts in {mode === 'friend' ? 'Friends' : 'Relationship'}</span></div>
        <div className="category-grid">
          {gameCategories.map(category => <CategoryCard key={category.id} category={category} onClick={onCategory} game/>) }
        </div>
      </section>
    </div>
  )
}

function EmptyState({ icon = '♡', title, text, action, actionLabel }) {
  return <div className="empty-state"><span>{icon}</span><h2>{title}</h2><p>{text}</p>{action && <button className="primary-btn" onClick={action}>{actionLabel}<Icon name="next" size={17}/></button>}</div>
}

function SavedView({ type, items, onOpen, onClear, setView }) {
  const isFav = type === 'favourites'
  if (!items.length) {
    return <EmptyState icon={isFav ? '♡' : '↺'} title={isFav ? 'Nothing saved yet.' : 'No prompt history yet.'} text={isFav ? 'Tap the heart on any prompt and it will appear here.' : 'Prompts you open will show up here on this device.'} action={() => setView('home')} actionLabel="Browse prompts" />
  }
  return (
    <div className="page-view">
      <header className="simple-page-header">
        <div><p className="mini-label">{isFav ? 'Your collection' : 'On this device'}</p><h1>{isFav ? 'Favourites' : 'History'}</h1><p>{isFav ? 'The questions you want to keep close.' : 'Pick up from something you opened earlier.'}</p></div>
        <button className="ghost-btn" onClick={onClear}>Clear {isFav ? 'favourites' : 'history'}</button>
      </header>
      <div className="saved-list">
        {items.map((item, i) => (
          <button className="saved-row" key={`${item.id}-${i}`} onClick={() => onOpen(item)}>
            <span className="saved-icon">{allCategories.find(c => c.id === item.categoryId)?.icon || '✦'}</span>
            <span className="saved-copy"><small>{item.categoryName} · {item.mode === 'friend' ? 'Friends' : 'Relationship'}</small><strong>{item.text.replaceAll('\n', ' · ')}</strong></span>
            <Icon name="next"/>
          </button>
        ))}
      </div>
    </div>
  )
}

function SearchView({ mode, audience, onOpen }) {
  const [query, setQuery] = useState('')
  const all = useMemo(() => getAllPrompts(mode), [mode])
  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return all.filter(p => {
      const audiencePass = audience === '18+' || p.audience === 'General'
      if (!audiencePass) return false
      const hay = `${p.text} ${p.categoryName} ${p.tags.join(' ')}`.toLowerCase()
      return hay.includes(q)
    }).slice(0, 80)
  }, [query, all, audience])

  return (
    <div className="page-view search-view">
      <header className="simple-page-header search-header">
        <div><p className="mini-label">Search the whole library</p><h1>What are you already talking about?</h1><p>Try school, money, ex, Lagos, marriage, music, food, trust or anything else.</p></div>
      </header>
      <div className="big-search">
        <Icon name="search" size={22}/>
        <input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Search prompts..." />
        {query && <button onClick={() => setQuery('')}><Icon name="close" size={18}/></button>}
      </div>
      {!query ? (
        <div className="search-suggestions"><span>Try:</span>{['secondary school', 'money', 'childhood', 'ex', 'Lagos', 'faith', 'marriage', 'music'].map(x => <button key={x} onClick={() => setQuery(x)}>{x}</button>)}</div>
      ) : (
        <div className="search-meta">{results.length ? `${results.length}${results.length === 80 ? '+' : ''} results` : 'No matches yet'}</div>
      )}
      <div className="search-results">
        {results.map(item => (
          <button key={item.id} className="search-result" onClick={() => onOpen(item)}>
            <span>{allCategories.find(c => c.id === item.categoryId)?.icon}</span>
            <span><small>{item.categoryName} · {item.intensity}</small><strong>{item.text.replaceAll('\n', ' · ')}</strong></span>
            <Icon name="next"/>
          </button>
        ))}
      </div>
    </div>
  )
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <label className="filter-select">
      <span>{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)}>
        {options.map(option => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  )
}

function PromptView({
  categoryId,
  mode,
  setMode,
  audience,
  setAudience,
  favouriteIds,
  toggleFavourite,
  initialPromptId,
  onBack,
  onShowPrompt,
  seenMap,
  setSeenMap,
}) {
  const category = allCategories.find(c => c.id === categoryId)
  const [intensity, setIntensity] = useState('All')
  const [stage, setStage] = useState('All stages')
  const [faithType, setFaithType] = useState('All faith perspectives')
  const [subtype, setSubtype] = useState(categoryId === 'truth-dare' ? 'Truth' : 'All')
  const [currentId, setCurrentId] = useState(initialPromptId || null)
  const [stack, setStack] = useState(initialPromptId ? [initialPromptId] : [])
  const [stackIndex, setStackIndex] = useState(initialPromptId ? 0 : -1)
  const [focusMode, setFocusMode] = useState(false)
  const [toast, setToast] = useState('')
  const toastTimer = useRef(null)

  const rawPrompts = useMemo(() => getPrompts(categoryId, mode), [categoryId, mode])
  const filtered = useMemo(() => rawPrompts.filter(p => {
    if (audience !== '18+' && p.audience === '18+') return false
    if (intensity !== 'All' && p.intensity !== intensity) return false
    if (mode === 'relationship' && stage !== 'All stages' && p.stage !== stage) return false
    if (categoryId === 'faith-spirituality' && faithType !== 'All faith perspectives' && p.faithType !== faithType) return false
    if (categoryId === 'truth-dare' && subtype !== 'All' && p.subtype !== subtype) return false
    return true
  }), [rawPrompts, audience, intensity, mode, stage, faithType, subtype, categoryId])

  const current = filtered.find(p => p.id === currentId) || rawPrompts.find(p => p.id === currentId) || filtered[0]

  const showToast = text => {
    setToast(text)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 1600)
  }

  const pushPrompt = prompt => {
    if (!prompt) return
    const newStack = stack.slice(0, stackIndex + 1)
    newStack.push(prompt.id)
    setStack(newStack)
    setStackIndex(newStack.length - 1)
    setCurrentId(prompt.id)
    const key = `${categoryId}:${mode}`
    const nextSeen = { ...seenMap, [key]: [...new Set([...(seenMap[key] || []), prompt.id])].slice(-1500) }
    setSeenMap(nextSeen)
    onShowPrompt(prompt)
  }

  const pickNext = () => {
    if (!filtered.length) return
    const key = `${categoryId}:${mode}`
    const seen = new Set(seenMap[key] || [])
    let candidates = filtered.filter(p => !seen.has(p.id) && p.id !== current?.id)
    if (!candidates.length) {
      candidates = filtered.filter(p => p.id !== current?.id)
      setSeenMap({ ...seenMap, [key]: current ? [current.id] : [] })
    }
    const next = candidates[Math.floor(Math.random() * Math.max(candidates.length, 1))] || filtered[0]
    pushPrompt(next)
  }

  const previous = () => {
    if (stackIndex <= 0) return
    const nextIndex = stackIndex - 1
    const id = stack[nextIndex]
    setStackIndex(nextIndex)
    setCurrentId(id)
    const p = rawPrompts.find(x => x.id === id)
    if (p) onShowPrompt(p, false)
  }

  useEffect(() => {
    setIntensity('All')
    setStage('All stages')
    setFaithType('All faith perspectives')
    setSubtype(categoryId === 'truth-dare' ? 'Truth' : 'All')
    const first = initialPromptId ? rawPrompts.find(p => p.id === initialPromptId) : null
    const fallback = first || rawPrompts.find(p => audience === '18+' || p.audience === 'General') || rawPrompts[0]
    if (fallback) {
      setCurrentId(fallback.id)
      setStack([fallback.id])
      setStackIndex(0)
      onShowPrompt(fallback)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, mode])

  useEffect(() => {
    if (!filtered.length) return
    if (!filtered.some(p => p.id === currentId)) {
      const first = filtered[0]
      setCurrentId(first.id)
      setStack([first.id])
      setStackIndex(0)
      onShowPrompt(first)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intensity, stage, faithType, subtype, audience])

  useEffect(() => () => clearTimeout(toastTimer.current), [])

  const copy = async () => {
    if (!current) return
    try {
      await navigator.clipboard.writeText(current.copyText)
    } catch {
      const el = document.createElement('textarea')
      el.value = current.copyText
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      el.remove()
    }
    showToast('Copied')
  }

  const share = async () => {
    if (!current) return
    if (navigator.share) {
      try { await navigator.share({ text: current.copyText }) } catch { return }
    } else {
      await copy()
    }
  }

  const isFavourite = current ? favouriteIds.includes(current.id) : false
  const intensities = mode === 'friend' ? friendIntensities : relationshipIntensities

  if (!category) return null

  return (
    <div className={`prompt-page ${focusMode ? 'focus-mode' : ''}`}>
      <div className="prompt-topbar">
        <button className="back-link" onClick={onBack}><Icon name="back" size={18}/> Back</button>
        <ModeSwitch mode={mode} onChange={setMode} compact/>
        <button className="focus-link" onClick={() => setFocusMode(v => !v)}>{focusMode ? 'Exit focus' : 'Keep it going'}</button>
      </div>

      <div className="prompt-heading">
        <div className="prompt-category-icon">{category.icon}</div>
        <div><p className="mini-label">{categoryId === 'truth-dare' ? 'Game' : gameCategories.some(c => c.id === categoryId) ? 'Game' : 'Conversation starter'}</p><h1>{category.name}</h1><p>{category.description}</p></div>
      </div>

      {!focusMode && (
        <div className="filters-wrap">
          {categoryId === 'truth-dare' && (
            <div className="truth-switch">
              {['Truth', 'Dare'].map(x => <button key={x} className={subtype === x ? 'active' : ''} onClick={() => setSubtype(x)}>{x}</button>)}
            </div>
          )}
          <FilterSelect label="Intensity" value={intensity} options={['All', ...intensities]} onChange={setIntensity}/>
          {mode === 'relationship' && <FilterSelect label="Relationship stage" value={stage} options={['All stages', ...relationshipStages]} onChange={setStage}/>} 
          <FilterSelect label="Audience" value={audience} options={['General', '18+']} onChange={value => {
            setAudience(value)
            if (value === 'General' && intensity === 'Spicy') setIntensity('All')
          }}/>
          {categoryId === 'faith-spirituality' && <FilterSelect label="Faith" value={faithType} options={['All faith perspectives', 'General Spirituality', 'Christian']} onChange={setFaithType}/>} 
        </div>
      )}

      <div className="prompt-stage">
        <div className="prompt-card">
          <div className="prompt-card-meta">
            <span>{mode === 'friend' ? 'FRIENDS' : 'RELATIONSHIP'}</span>
            <span>{current?.intensity || 'All'}</span>
            {current?.stage && <span>{current.stage.toUpperCase()}</span>}
          </div>

          {filtered.length ? (
            <>
              <div className={`prompt-text ${current?.statements ? 'statements' : ''}`}>
                {current?.statements ? (
                  <div className="statement-list">
                    <p className="statement-helper">Pick two that are true for you. Make one the lie.</p>
                    {current.statements.map((statement, i) => <div key={statement}><span>{i + 1}</span><p>{statement}</p></div>)}
                  </div>
                ) : (
                  <p>{current?.text}</p>
                )}
              </div>

              <div className="prompt-primary-actions">
                <button className="copy-btn" onClick={copy}><Icon name="copy"/><span>Copy question</span></button>
                <button className={`icon-action ${isFavourite ? 'saved' : ''}`} onClick={() => toggleFavourite(current)} aria-label="Save prompt"><Icon name="heart"/></button>
                <button className="icon-action" onClick={share} aria-label="Share prompt"><Icon name="share"/></button>
              </div>
            </>
          ) : (
            <div className="no-filter-results"><span>◌</span><h3>No prompts match these filters.</h3><p>Change the intensity, audience or relationship stage.</p></div>
          )}
        </div>

        {filtered.length > 0 && (
          <div className="prompt-navigation">
            <button onClick={previous} disabled={stackIndex <= 0}><Icon name="back"/> Previous</button>
            <button className="random-btn" onClick={pickNext}><Icon name="shuffle"/> Random</button>
            <button className="next-btn" onClick={pickNext}>Give me another one <Icon name="next"/></button>
          </div>
        )}
        {!focusMode && <p className="prompt-footnote">{categoryId === 'truth-dare' && subtype !== 'All' ? '500' : categoryId === 'truth-dare' ? '1,000' : '500'} prompts in this category · prompts avoid repeats until the pool cycles</p>}
      </div>

      {toast && <div className="toast"><Icon name="check" size={17}/>{toast}</div>}
    </div>
  )
}

export default function App() {
  const savedResume = readLS(LS.resume, null)
  const hasVisited = readLS(LS.visited, false)
  const [view, setViewState] = useState(hasVisited && savedResume?.view ? savedResume.view : 'landing')
  const [mode, setModeState] = useState(readLS(LS.mode, 'friend'))
  const [audience, setAudienceState] = useState(readLS(LS.audience, 'General'))
  const [categoryId, setCategoryId] = useState(savedResume?.categoryId || null)
  const [initialPromptId, setInitialPromptId] = useState(savedResume?.promptId || null)
  const [favourites, setFavourites] = useState(readLS(LS.favourites, []))
  const [history, setHistory] = useState(readLS(LS.history, []))
  const [seenMap, setSeenMapState] = useState(readLS(LS.seen, {}))
  const [mobileMenu, setMobileMenu] = useState(false)

  const setView = next => {
    setViewState(next)
    if (next !== 'category') {
      setCategoryId(null)
      setInitialPromptId(null)
    }
  }

  const setMode = next => {
    setModeState(next)
    writeLS(LS.mode, next)
  }

  const setAudience = next => {
    setAudienceState(next)
    writeLS(LS.audience, next)
  }

  const setSeenMap = next => {
    setSeenMapState(next)
    writeLS(LS.seen, next)
  }

  const start = nextMode => {
    setMode(nextMode)
    writeLS(LS.visited, true)
    setView('home')
  }

  const openCategory = (id, random = false) => {
    writeLS(LS.visited, true)
    setCategoryId(id)
    const prompts = getPrompts(id, mode).filter(p => audience === '18+' || p.audience === 'General')
    const chosen = random ? prompts[Math.floor(Math.random() * prompts.length)] : prompts[0]
    setInitialPromptId(chosen?.id || null)
    setViewState('category')
  }

  const openItem = item => {
    setMode(item.mode)
    setCategoryId(item.categoryId)
    setInitialPromptId(item.id)
    setViewState('category')
  }

  const onShowPrompt = (prompt, addHistory = true) => {
    if (!prompt) return
    setInitialPromptId(prompt.id)
    if (addHistory) {
      setHistory(prev => {
        if (prev[0]?.id === prompt.id) return prev
        const next = [prompt, ...prev.filter(p => p.id !== prompt.id)].slice(0, 100)
        writeLS(LS.history, next)
        return next
      })
    }
  }

  const toggleFavourite = prompt => {
    if (!prompt) return
    setFavourites(prev => {
      const exists = prev.some(p => p.id === prompt.id)
      const next = exists ? prev.filter(p => p.id !== prompt.id) : [prompt, ...prev]
      writeLS(LS.favourites, next)
      return next
    })
  }

  useEffect(() => {
    if (view === 'landing') return
    writeLS(LS.resume, { view, categoryId, promptId: initialPromptId, mode, audience })
  }, [view, categoryId, initialPromptId, mode, audience])

  useEffect(() => {
    const onKeyDown = event => {
      const tag = document.activeElement?.tagName?.toLowerCase()
      const typing = tag === 'input' || tag === 'textarea' || tag === 'select'
      if (event.key === '/' && !typing && view !== 'category') {
        event.preventDefault()
        setView('search')
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [view])

  const favouriteIds = useMemo(() => favourites.map(p => p.id), [favourites])

  if (view === 'landing') {
    return <Landing onStart={start} onCategory={id => { writeLS(LS.visited, true); setMode('friend'); setCategoryId(id); setInitialPromptId(null); setViewState('category') }} />
  }

  if (view === 'category' && categoryId) {
    return (
      <div data-mode={mode} className="app-root">
        <PromptView
          categoryId={categoryId}
          mode={mode}
          setMode={setMode}
          audience={audience}
          setAudience={setAudience}
          favouriteIds={favouriteIds}
          toggleFavourite={toggleFavourite}
          initialPromptId={initialPromptId}
          onBack={() => setView(gameCategories.some(c => c.id === categoryId) ? 'games' : 'home')}
          onShowPrompt={onShowPrompt}
          seenMap={seenMap}
          setSeenMap={setSeenMap}
        />
      </div>
    )
  }

  return (
    <div data-mode={mode} className="app-root workspace">
      <div className={`mobile-scrim ${mobileMenu ? 'show' : ''}`} onClick={() => setMobileMenu(false)} />
      <div className={`sidebar-wrap ${mobileMenu ? 'open' : ''}`}>
        <Sidebar view={view} setView={setView} mode={mode} setMode={setMode} closeMobile={() => setMobileMenu(false)} />
      </div>

      <main className="workspace-main">
        <header className="mobile-topbar">
          <button onClick={() => setMobileMenu(true)}><Icon name="menu"/></button>
          <Brand />
          <button onClick={() => setView('search')}><Icon name="search"/></button>
        </header>
        <div className="desktop-topbar">
          <div className="mode-context"><span className="mode-dot"/> {mode === 'friend' ? 'Friends' : 'Relationship'} mode</div>
          <button className="search-trigger" onClick={() => setView('search')}><Icon name="search" size={18}/><span>Search questions, topics, games...</span><kbd>/</kbd></button>
          <FilterSelect label="Audience" value={audience} options={['General', '18+']} onChange={setAudience}/>
        </div>

        {view === 'home' && <HomeView mode={mode} onCategory={openCategory} setView={setView}/>} 
        {view === 'games' && <GamesView mode={mode} onCategory={openCategory}/>} 
        {view === 'favourites' && <SavedView type="favourites" items={favourites} onOpen={openItem} onClear={() => { setFavourites([]); writeLS(LS.favourites, []) }} setView={setView}/>} 
        {view === 'history' && <SavedView type="history" items={history} onOpen={openItem} onClear={() => { setHistory([]); writeLS(LS.history, []) }} setView={setView}/>} 
        {view === 'search' && <SearchView mode={mode} audience={audience} onOpen={openItem}/>} 
      </main>

      <nav className="mobile-bottom-nav">
        <button className={view === 'home' ? 'active' : ''} onClick={() => setView('home')}><Icon name="home"/><span>Explore</span></button>
        <button className={view === 'games' ? 'active' : ''} onClick={() => setView('games')}><Icon name="game"/><span>Games</span></button>
        <button className={view === 'search' ? 'active' : ''} onClick={() => setView('search')}><Icon name="search"/><span>Search</span></button>
        <button className={view === 'favourites' ? 'active' : ''} onClick={() => setView('favourites')}><Icon name="heart"/><span>Saved</span></button>
      </nav>
    </div>
  )
}
