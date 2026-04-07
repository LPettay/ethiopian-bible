import { Link } from 'react-router-dom'

export function WelcomePage() {
  return (
    <div className="max-w-2xl mx-auto px-4">
      {/* ---- Hero: The Hook ---- */}
      <section className="text-center pt-14 md:pt-24 pb-10">
        <div className="text-accent mb-6" aria-hidden="true">
          <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto">
            <path d="M28 4h8v16h16v8H36v16h16v8H36v8h-8v-8H12v-8h16V28H12v-8h16V4z" fill="currentColor" opacity="0.85"/>
            <circle cx="32" cy="32" r="4" fill="currentColor" opacity="0.5"/>
          </svg>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-text leading-tight font-body">
          The Ethiopian Bible
        </h1>
        <p className="mt-3 text-text-muted text-sm md:text-base max-w-md mx-auto leading-relaxed font-body italic">
          The oldest and most complete biblical canon in Christianity.
        </p>
      </section>

      {/* ---- The Live Comparison ---- */}
      <section className="mb-12">
        <div className="bg-surface/60 rounded-sm p-6 md:p-8"
             style={{ boxShadow: '0 2px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(200,149,42,0.06)' }}>
          <p className="text-text-muted text-sm mb-5 text-center font-body italic">
            Open your Bible to Genesis 5:3. Now read it here:
          </p>

          {/* Ge'ez */}
          <p className="font-geez text-geez text-xl text-center mb-6 leading-relaxed geez-glow" lang="gez">
            ወሐይወ ፡ አዳም ፡ ፪፻ወ፴ዓመተ ፡ ወወለደ
          </p>

          {/* Side by side */}
          <div className="space-y-4">
            <div className="border-l border-lxx-border/50 pl-4 py-1">
              <span className="text-lxx/50 text-[0.65rem] font-body italic tracking-wide">
                Septuagint (3rd c. BCE)
              </span>
              <p className="verse-text text-text text-sm md:text-base mt-1">
                And Adam lived <strong className="text-lxx">two hundred and thirty years</strong>,
                and begot a son after his own form, and after his own image,
                and he called his name Seth.
              </p>
            </div>

            <div className="border-l border-mt-border/50 pl-4 py-1">
              <span className="text-mt/50 text-[0.65rem] font-body italic tracking-wide">
                King James (Masoretic)
              </span>
              <p className="verse-text text-text text-sm md:text-base mt-1">
                And Adam lived <strong className="text-mt">an hundred and thirty years</strong>,
                and begat a son in his own likeness, after his image;
                and called his name Seth:
              </p>
            </div>
          </div>

          {/* The punchline */}
          <p className="text-text-muted text-sm mt-6 text-center leading-relaxed font-body">
            Same book. Same verse. One hundred years apart.
            <br />
            <span className="text-text italic">
              The Dead Sea Scrolls and the Gospel of Luke agree with the longer number.
            </span>
          </p>

          <div className="flex justify-center mt-5">
            <Link
              to="/discover"
              className="text-accent text-sm font-body italic hover:text-accent-bright transition-colors"
            >
              See 4 more verses like this &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ---- Cross divider ---- */}
      <div className="cross-divider" aria-hidden="true">
        <svg viewBox="0 0 64 64" className="w-5 h-5 flex-shrink-0">
          <path d="M28 4h8v16h16v8H36v16h16v8H36v8h-8v-8H12v-8h16V28H12v-8h16V4z" fill="currentColor" opacity="0.85"/>
        </svg>
      </div>

      {/* ---- Doors ---- */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-14">
        <DoorCard
          title="Discover the Differences"
          desc="5 verses that change how you read your Bible."
          to="/discover"
          accent
        />
        <DoorCard
          title="Open the Bible"
          desc="All 36 books, organized by section. Tap a book to start reading."
          to="/bible"
        />
        <DoorCard
          title="Start with Genesis"
          desc="Begin at the beginning — dual Septuagint and KJV translations."
          to="/read/Gen/1"
        />
        <DoorCard
          title="Scholarly Comparison"
          desc="12 documented variants with cited sources. Every claim verifiable."
          to="/compare"
        />
      </section>

      {/* ---- Bottom line ---- */}
      <footer className="text-center pb-12 text-text-muted text-xs leading-relaxed">
        <p>
          Ge'ez texts from{' '}
          <a href="https://betamasaheft.eu/" target="_blank" rel="noopener" className="text-accent hover:underline">
            Beta Masaheft
          </a>{' '}
          (CC BY-SA 4.0). English from Brenton (1851) and KJV (1611), public domain.
        </p>
        <p className="mt-2">
          <Link to="/about" className="text-accent hover:underline">About this project</Link>
          {' '}&middot;{' '}
          <a href="https://github.com/LPettay/ethiopian-bible" target="_blank" rel="noopener" className="text-accent hover:underline">
            Source code
          </a>
        </p>
      </footer>
    </div>
  )
}

function DoorCard({
  title,
  desc,
  to,
  action,
  accent,
}: {
  title: string
  desc: string
  to?: string
  action?: () => void
  accent?: boolean
}) {
  const cls = `flex flex-col gap-1.5 px-5 py-4 rounded-sm transition-all group text-left
    ${accent
      ? 'bg-accent-dim/60 hover:bg-accent-dim'
      : 'hover:bg-surface-hover/50'
    }`

  if (action) {
    return (
      <button onClick={action} className={cls + ' cursor-pointer'}>
        <h2 className="text-sm font-body font-semibold text-text group-hover:text-accent transition-colors">
          {title}
        </h2>
        <p className="text-xs font-body text-text-muted leading-relaxed">{desc}</p>
      </button>
    )
  }

  return (
    <Link to={to!} className={cls}>
      <h2 className="text-sm font-body font-semibold text-text group-hover:text-accent transition-colors">
        {title}
      </h2>
      <p className="text-xs font-body text-text-muted leading-relaxed">{desc}</p>
    </Link>
  )
}
