import { Link } from 'react-router-dom'

export function WelcomePage() {
  return (
    <div className="max-w-2xl mx-auto px-4">
      {/* ---- Hero: The Hook ---- */}
      <section className="text-center pt-12 md:pt-20 pb-10">
        <div className="text-accent mb-4" aria-hidden="true">
          <svg className="w-12 h-12 mx-auto" viewBox="0 0 48 48" fill="none">
            <rect x="21" y="4" width="6" height="40" rx="1" fill="currentColor" opacity="0.9" />
            <rect x="8" y="14" width="32" height="6" rx="1" fill="currentColor" opacity="0.9" />
            <circle cx="24" cy="17" r="3" fill="currentColor" opacity="0.6" />
          </svg>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-text leading-tight">
          The Ethiopian Bible
        </h1>
        <p className="mt-2 text-text-muted text-sm md:text-base max-w-md mx-auto leading-relaxed">
          The oldest and most complete biblical canon in Christianity.
        </p>
      </section>

      {/* ---- The Live Comparison ---- */}
      <section className="mb-12">
        <div className="bg-surface rounded-xl border border-border p-5 md:p-7">
          <p className="text-text-muted text-sm mb-4 text-center">
            Open your Bible to Genesis 5:3. Now read it here:
          </p>

          {/* Ge'ez */}
          <p className="font-geez text-geez text-xl text-center mb-5 leading-relaxed" lang="gez">
            ወሐይወ ፡ አዳም ፡ ፪፻ወ፴ዓመተ ፡ ወወለደ
          </p>

          {/* Side by side */}
          <div className="space-y-3">
            <div className="border-l-[3px] border-lxx-border pl-4 py-2 rounded-r-md bg-lxx-bg">
              <span className="text-lxx text-xs font-semibold uppercase tracking-wide">
                Septuagint (3rd c. BCE)
              </span>
              <p className="text-text text-sm md:text-base mt-1 leading-relaxed">
                And Adam lived <strong className="text-lxx">two hundred and thirty years</strong>,
                and begot a son after his own form, and after his own image,
                and he called his name Seth.
              </p>
            </div>

            <div className="border-l-[3px] border-mt-border pl-4 py-2 rounded-r-md bg-mt-bg">
              <span className="text-mt text-xs font-semibold uppercase tracking-wide">
                King James (Masoretic)
              </span>
              <p className="text-text text-sm md:text-base mt-1 leading-relaxed">
                And Adam lived <strong className="text-mt">an hundred and thirty years</strong>,
                and begat a son in his own likeness, after his image;
                and called his name Seth:
              </p>
            </div>
          </div>

          {/* The punchline */}
          <p className="text-text-muted text-sm mt-5 text-center leading-relaxed">
            Same book. Same verse. One hundred years apart.
            <br />
            <span className="text-text">
              The Dead Sea Scrolls and the Gospel of Luke agree with the longer number.
            </span>
          </p>

          <div className="flex justify-center mt-5">
            <Link
              to="/discover"
              className="text-accent text-sm font-medium hover:text-accent-bright transition-colors"
            >
              See 4 more verses like this &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ---- Doors ---- */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
        <DoorCard
          title="Discover the Differences"
          desc="5 verses that change how you read your Bible."
          to="/discover"
          accent
        />
        <DoorCard
          title="Start Reading"
          desc="Begin with Genesis in Ge'ez with English translations."
          to="/read/Gen/1"
        />
        <DoorCard
          title="Explore All 36 Books"
          desc="Browse the library, including texts unique to the Ethiopian canon."
          action={() => window.dispatchEvent(new CustomEvent('open-book-picker'))}
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
  const cls = `flex flex-col gap-1.5 p-4 rounded-xl border transition-all group text-left
    ${accent
      ? 'bg-accent-dim border-accent/30 hover:border-accent'
      : 'bg-surface border-border hover:border-accent hover:bg-surface-hover'
    }`

  if (action) {
    return (
      <button onClick={action} className={cls + ' cursor-pointer'}>
        <h2 className="text-sm font-semibold text-text group-hover:text-accent-bright transition-colors">
          {title}
        </h2>
        <p className="text-xs text-text-muted leading-relaxed">{desc}</p>
      </button>
    )
  }

  return (
    <Link to={to!} className={cls}>
      <h2 className="text-sm font-semibold text-text group-hover:text-accent-bright transition-colors">
        {title}
      </h2>
      <p className="text-xs text-text-muted leading-relaxed">{desc}</p>
    </Link>
  )
}
