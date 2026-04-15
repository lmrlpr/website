export function Footer() {
  return (
    <footer className="py-12 px-6 md:px-10 border-t border-gray-100 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-ink">Primaner vum Michel Rodange</p>
          <p className="text-xs text-gray-400 mt-1">Lycée Michel Rodange Luxembourg (LMRL)</p>
        </div>
        <div className="text-xs text-gray-400 text-right">
          <p>© {new Date().getFullYear()} Primaner ASBL</p>
          <p className="mt-1 text-xs tracking-[0.15em] uppercase" style={{ color: '#8B5E3C' }}>
            Pictures by{' '}
            <a
              href="https://www.instagram.com/jamie.forman_/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium transition-opacity hover:opacity-70"
              style={{ color: '#8B5E3C' }}
            >
              Jamie Forman
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
