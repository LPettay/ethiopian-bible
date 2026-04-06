import { Link } from 'react-router-dom'

const DOORS = [
  {
    title: 'Begin the Story',
    desc: 'Start reading from Genesis, the foundation of all scripture.',
    to: '/read/Gen/1',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    title: 'Explore a Text',
    desc: 'Browse all 81 books, including texts unique to the Ethiopian canon.',
    to: '#open-book-picker',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    title: 'Compare with Western Bibles',
    desc: 'See how the Septuagint and Masoretic traditions diverge.',
    to: '/compare',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
      </svg>
    ),
  },
  {
    title: 'What makes this different?',
    desc: 'The oldest and most complete biblical canon, preserved in Ethiopia for millennia.',
    to: '/compare',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
]

export function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 md:py-20 min-h-[80svh]">
      {/* Cross / Emblem */}
      <div className="text-accent mb-6">
        <svg className="w-14 h-14" viewBox="0 0 48 48" fill="none">
          <rect x="21" y="4" width="6" height="40" rx="1" fill="currentColor" opacity="0.9" />
          <rect x="8" y="14" width="32" height="6" rx="1" fill="currentColor" opacity="0.9" />
          <circle cx="24" cy="17" r="3" fill="currentColor" opacity="0.6" />
        </svg>
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-text text-center leading-tight">
        The Ethiopian Bible
      </h1>
      <p className="mt-3 text-text-muted text-center max-w-md leading-relaxed text-sm md:text-base">
        The oldest and most complete biblical canon in the world &mdash;
        81 books preserved by the Ethiopian Orthodox Tewahedo Church,
        read in Ge'ez with English translations.
      </p>

      {/* Ge'ez decorative text */}
      <p className="font-geez text-accent/40 text-xl mt-4 tracking-widest">
        መጽሐፍ ቅዱስ
      </p>

      {/* Four doors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-10 w-full max-w-lg">
        {DOORS.map(door => (
          <DoorCard key={door.title} {...door} />
        ))}
      </div>
    </div>
  )
}

function DoorCard({ title, desc, to, icon }: (typeof DOORS)[number]) {
  const isAction = to.startsWith('#')

  if (isAction) {
    return (
      <button
        onClick={() => window.dispatchEvent(new CustomEvent('open-book-picker'))}
        className="flex flex-col gap-2 p-4 rounded-xl bg-surface border border-border
                   hover:border-accent hover:bg-surface-hover transition-all group text-left cursor-pointer"
      >
        <div className="text-accent group-hover:text-accent-bright transition-colors">{icon}</div>
        <h3 className="text-sm font-semibold text-text group-hover:text-accent-bright transition-colors">
          {title}
        </h3>
        <p className="text-xs text-text-muted leading-relaxed">{desc}</p>
      </button>
    )
  }

  return (
    <Link
      to={to}
      className="flex flex-col gap-2 p-4 rounded-xl bg-surface border border-border
                 hover:border-accent hover:bg-surface-hover transition-all group"
    >
      <div className="text-accent group-hover:text-accent-bright transition-colors">{icon}</div>
      <h3 className="text-sm font-semibold text-text group-hover:text-accent-bright transition-colors">
        {title}
      </h3>
      <p className="text-xs text-text-muted leading-relaxed">{desc}</p>
    </Link>
  )
}
