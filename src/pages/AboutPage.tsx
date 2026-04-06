import { Link } from 'react-router-dom'

export function AboutPage() {
  return (
    <div className="max-w-[760px] mx-auto px-4 pb-12">
      {/* Hero */}
      <section className="text-center pt-12 pb-8 border-b border-border mb-10">
        <div className="text-2xl text-accent mb-3">&#10013;</div>
        <h1 className="text-2xl md:text-[1.6rem] text-geez font-semibold mb-2 leading-snug">
          About This Project
        </h1>
        <p className="text-[1.05rem] text-text-muted max-w-[520px] mx-auto">
          An open, free, and verifiable resource for the Ethiopian biblical canon.
        </p>
      </section>

      {/* ---- Section 1: Why This Exists ---- */}
      <section className="mb-12">
        <h2 className="text-xl text-accent font-semibold mb-4">Why This Exists</h2>

        <p className="mb-4 text-[0.95rem] leading-relaxed">
          There is no single, free, accessible resource for the Ethiopian biblical canon
          in English. That gap is the reason this project exists.
        </p>

        <p className="mb-4 text-[0.95rem] leading-relaxed">
          The Ethiopian Orthodox Tewahedo Church preserves <strong>81 books</strong> &mdash;
          more than any other Christian tradition. Some of these texts, including 1 Enoch
          and Jubilees, survive complete <em>only</em> in Ge'ez. The differences between
          the Ethiopian Bible and Western Bibles are profound and under-discussed.
        </p>

        <p className="mb-4 text-[0.95rem] leading-relaxed">
          This project exists to make that knowledge accessible to everyone &mdash;
          pastors, students, scholars, and curious readers who want to understand
          the oldest and most complete biblical canon in the world.
        </p>

        <div className="bg-surface border-l-[3px] border-accent pl-4 pr-4 py-3.5 rounded-r-md text-[0.9rem]">
          The Ethiopian canon was formed in the 4th&ndash;7th century CE, before the narrowing
          movements that reduced the Western canon. These texts were preserved by Ethiopian
          monks who copied them by hand for over 1,500 years while the rest of the world
          forgot them.
        </div>
      </section>

      {/* ---- Section 2: How We Verify ---- */}
      <section className="mb-12">
        <h2 className="text-xl text-accent font-semibold mb-4">How We Verify</h2>

        <p className="mb-4 text-[0.95rem] leading-relaxed">
          Every factual claim on this site is cited to a published scholarly source.
          We do not ask you to take our word for anything.
        </p>

        <h3 className="text-[0.95rem] font-semibold text-text mt-5 mb-2">Primary Sources</h3>
        <ul className="list-disc pl-5 mb-4 text-[0.9rem] leading-relaxed space-y-1.5">
          <li>Dead Sea Scrolls publications (DJD series)</li>
          <li>Critical editions: Knibb, Nickelsburg, VanderKam, Stone</li>
        </ul>

        <h3 className="text-[0.95rem] font-semibold text-text mt-5 mb-2">Secondary Sources</h3>
        <ul className="list-disc pl-5 mb-4 text-[0.9rem] leading-relaxed space-y-1.5">
          <li>Tov, <em>Textual Criticism of the Hebrew Bible</em></li>
          <li>Jobes &amp; Silva, <em>Invitation to the Septuagint</em></li>
          <li>Ullendorff, <em>Ethiopia and the Bible</em></li>
          <li>Cowley, <em>Ethiopian Biblical Canon</em></li>
          <li>Heiser, <em>The Unseen Realm</em></li>
        </ul>

        <h3 className="text-[0.95rem] font-semibold text-text mt-5 mb-2">Data Sources</h3>
        <ul className="list-disc pl-5 mb-4 text-[0.9rem] leading-relaxed space-y-1.5">
          <li>
            <a href="https://betamasaheft.eu/" target="_blank" rel="noopener noreferrer"
               className="text-accent hover:underline">Beta Masaheft</a> &mdash; Ge'ez texts
          </li>
          <li>Brenton 1851 &mdash; Septuagint (LXX) English translation</li>
          <li>King James Version &mdash; Masoretic tradition</li>
        </ul>

        <div className="bg-surface border-l-[3px] border-lxx pl-4 pr-4 py-3.5 rounded-r-md text-[0.9rem]">
          <strong className="text-accent">You don't have to trust us. Check the sources yourself.</strong>{' '}
          Our{' '}
          <Link to="/compare" className="text-accent hover:underline">
            comparison page
          </Link>{' '}
          includes a full bibliography with every citation linked to its source.
        </div>
      </section>

      {/* ---- Section 3: The Technology ---- */}
      <section className="mb-12">
        <h2 className="text-xl text-accent font-semibold mb-4">The Technology</h2>

        <p className="mb-4 text-[0.95rem] leading-relaxed">
          This project is open source. The code, the data pipeline, and the editorial
          decisions are all visible and verifiable.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-5">
          <div className="bg-surface rounded-lg p-4 border border-border">
            <div className="text-[0.82rem] text-text-muted uppercase tracking-wide mb-1">Built With</div>
            <div className="text-[0.9rem]">React, TypeScript, Vite, Tailwind CSS</div>
          </div>
          <div className="bg-surface rounded-lg p-4 border border-border">
            <div className="text-[0.82rem] text-text-muted uppercase tracking-wide mb-1">Data</div>
            <div className="text-[0.9rem]">Public domain &amp; CC BY-SA sources</div>
          </div>
        </div>

        <p className="mb-4 text-[0.9rem] leading-relaxed">
          <a
            href="https://github.com/LPettay/ethiopian-bible"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline inline-flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            View on GitHub
          </a>
        </p>

        <p className="text-[0.9rem] text-text-muted leading-relaxed">
          Contributions welcome &mdash; whether correcting a citation, improving
          translations, adding new texts, or enhancing the reading experience.
        </p>
      </section>

      {/* ---- Section 4: Credits ---- */}
      <section className="mb-12">
        <h2 className="text-xl text-accent font-semibold mb-4">Credits</h2>

        <div className="space-y-4">
          <div className="bg-surface rounded-lg p-5 border border-border">
            <h3 className="text-[0.95rem] font-semibold text-text mb-1.5">Ge'ez Texts</h3>
            <p className="text-[0.9rem] leading-relaxed">
              <a href="https://betamasaheft.eu/" target="_blank" rel="noopener noreferrer"
                 className="text-accent hover:underline">Beta Masaheft</a>{' '}
              project (Universitat Hamburg). Licensed{' '}
              <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer"
                 className="text-accent hover:underline">CC BY-SA 4.0</a>.
            </p>
          </div>

          <div className="bg-surface rounded-lg p-5 border border-border">
            <h3 className="text-[0.95rem] font-semibold text-text mb-1.5">Septuagint (LXX)</h3>
            <p className="text-[0.9rem] leading-relaxed">
              Brenton's English Translation of the Septuagint (1851). Public domain.
            </p>
          </div>

          <div className="bg-surface rounded-lg p-5 border border-border">
            <h3 className="text-[0.95rem] font-semibold text-text mb-1.5">King James Version</h3>
            <p className="text-[0.9rem] leading-relaxed">
              King James Version (1611/1769). Public domain.
            </p>
          </div>

          <div className="bg-surface rounded-lg p-5 border border-border">
            <h3 className="text-[0.95rem] font-semibold text-text mb-1.5">1 Enoch &amp; Jubilees</h3>
            <p className="text-[0.9rem] leading-relaxed">
              R.H. Charles translations. Public domain.
            </p>
          </div>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="mt-6 pt-6 pb-8 border-t border-border text-center text-[0.8rem] text-text-muted">
        <p className="mt-2">
          <Link to="/" className="text-accent no-underline hover:underline">
            &larr; Read the Ethiopian Bible
          </Link>
          <span className="mx-3">&middot;</span>
          <Link to="/compare" className="text-accent no-underline hover:underline">
            Compare translations
          </Link>
        </p>
      </footer>
    </div>
  )
}
