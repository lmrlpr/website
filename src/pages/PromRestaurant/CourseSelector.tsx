interface CourseOption {
  id: string
  label: string
  vegan: boolean
}

interface CourseSelectorProps {
  title: string
  options: CourseOption[]
  selected: string
  onChange: (id: string) => void
}

export function CourseSelector({ title, options, selected, onChange }: CourseSelectorProps) {
  return (
    <div>
      <h3 className="text-xs tracking-[0.35em] uppercase text-resto-text/50 mb-4 font-medium">{title}</h3>
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 ${
              selected === option.id
                ? 'border-resto-accent bg-resto-accent/15 text-resto-text'
                : 'border-resto-border bg-resto-surface/50 text-resto-text/70 hover:border-resto-accent/40 hover:text-resto-text'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="text-sm leading-snug">{option.label}</span>
              {option.vegan && (
                <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-green-900/40 text-green-400 border border-green-800/50">
                  🌱 vegan
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
