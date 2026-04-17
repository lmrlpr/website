import { motion } from 'framer-motion'

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
  courseNumber?: string
}

function LeafIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
    </svg>
  )
}

export function CourseSelector({ title, options, selected, onChange, courseNumber }: CourseSelectorProps) {
  return (
    <div className="relative">
      {/* Large watermark course number */}
      {courseNumber && (
        <div
          className="absolute -top-3 -left-2 font-resto text-[5rem] leading-none pointer-events-none select-none"
          style={{ color: '#EBF0FA', zIndex: 0 }}
        >
          {courseNumber}
        </div>
      )}

      {/* Section header */}
      <div className="relative flex items-center gap-4 mb-5" style={{ zIndex: 1 }}>
        <div>
          <h3 className="font-resto text-2xl text-resto-text" style={{ letterSpacing: '0.05em' }}>{title}</h3>
          <div className="mt-1.5 h-0.5 w-10 rounded-full" style={{ background: 'linear-gradient(90deg, #2558C9, #F5C640)' }} />
        </div>
      </div>

      <div className="relative flex flex-col gap-2" style={{ zIndex: 1 }}>
        {options.map((option, i) => {
          const isSelected = selected === option.id
          return (
            <motion.button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              layout
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              whileHover={isSelected ? {} : { y: -1 }}
              className="w-full text-left rounded-xl border transition-colors duration-200 cursor-pointer overflow-hidden"
              style={isSelected ? {
                background: 'linear-gradient(135deg, #1B2D52 0%, #2558C9 100%)',
                borderColor: '#2558C9',
                boxShadow: '0 6px 24px rgba(37,88,201,0.28), inset 0 0 0 1px rgba(255,255,255,0.12)',
              } : {
                background: '#FFFFFF',
                borderColor: '#C3D1EC',
                boxShadow: '0 1px 4px rgba(37,88,201,0.06)',
              }}
              onMouseEnter={e => {
                if (!isSelected) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#4B89E4'
                  ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(37,88,201,0.13)'
                }
              }}
              onMouseLeave={e => {
                if (!isSelected) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#C3D1EC'
                  ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 1px 4px rgba(37,88,201,0.06)'
                }
              }}
            >
              {/* Selected accent bar */}
              {isSelected && (
                <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, #F5C640, rgba(245,198,64,0.3))' }} />
              )}

              <div className="flex items-center justify-between gap-3 px-5 py-4">
                <span className={`text-sm leading-snug font-sans ${isSelected ? 'text-white font-medium' : 'text-resto-text/80'}`}>
                  {option.label}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  {option.vegan && (
                    <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-sans font-medium ${
                      isSelected
                        ? 'bg-white/15 text-white border-white/25'
                        : 'bg-green-50 text-green-700 border-green-200'
                    }`}>
                      <LeafIcon />
                      vegan
                    </span>
                  )}
                  {isSelected && (
                    <span style={{ color: '#F5C640' }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
