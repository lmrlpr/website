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

function LeafIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  )
}

export function CourseSelector({ title, options, selected, onChange }: CourseSelectorProps) {
  return (
    <div>
      {/* Section header with blue accent underline */}
      <div className="flex items-center gap-3 mb-5">
        <div>
          <h3 className="font-resto text-xl text-resto-text" style={{ letterSpacing: '0.05em' }}>{title}</h3>
          <div className="mt-1 h-0.5 w-8 rounded-full bg-resto-accent opacity-60" />
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {options.map((option) => {
          const isSelected = selected === option.id
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className="w-full text-left rounded-xl border transition-all duration-200 cursor-pointer group"
              style={isSelected ? {
                background: 'linear-gradient(135deg, #2558C9 0%, #3B6FD4 100%)',
                borderColor: '#2558C9',
                boxShadow: '0 4px 16px rgba(37, 88, 201, 0.22), inset 0 0 0 1px rgba(255,255,255,0.15)',
                transform: 'scale(1)',
              } : {
                background: 'rgba(255,255,255,0.75)',
                borderColor: '#C3D1EC',
                boxShadow: '0 1px 4px rgba(37,88,201,0.06)',
              }}
              onMouseEnter={e => { if (!isSelected) { (e.currentTarget as HTMLButtonElement).style.borderColor = '#4B89E4'; (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.005)' } }}
              onMouseLeave={e => { if (!isSelected) { (e.currentTarget as HTMLButtonElement).style.borderColor = '#C3D1EC'; (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)' } }}
            >
              <div className="flex items-center justify-between gap-3 px-5 py-4">
                <span className={`text-sm leading-snug font-sans ${isSelected ? 'text-white' : 'text-resto-text/80'}`}>
                  {option.label}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  {option.vegan && (
                    <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-sans ${
                      isSelected
                        ? 'bg-white/20 text-white border-white/30'
                        : 'bg-green-50 text-green-700 border-green-200'
                    }`}>
                      <LeafIcon />
                      vegan
                    </span>
                  )}
                  {isSelected && (
                    <span className="text-white">
                      <CheckIcon />
                    </span>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
