export function Footer() {
  return (
    <footer className="py-12 px-6 md:px-10 border-t border-gray-100 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-ink">Primaner vum Michel Rodange</p>
        </div>
        <div className="text-xs text-gray-400 text-right">
          <p>© {new Date().getFullYear()} Comité des Premières du Lycée Michel Rodange</p>
        </div>
      </div>
    </footer>
  )
}
