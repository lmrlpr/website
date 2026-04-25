import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BASE = import.meta.env.BASE_URL

function img(file: string) {
  return `${BASE}merch/${file}`
}

interface AlbumPhoto {
  src: string
  alt: string
}

const PHOTOS: AlbumPhoto[] = [
  { src: img('Trio.webp'),                                         alt: 'La team LMRL'                },
  { src: img('Lou_grey_crewneck_1.webp'),                          alt: 'Lou — Crewneck gris'         },
  { src: img('Zoe_tshirt_black_open_1.webp'),                      alt: 'Zoé — T-shirt noir'          },
  { src: img('Tabea_Zoe_main_PRIMANER.webp'),                       alt: 'Tabea & Zoé'                 },
  { src: img('Tabea_grey_crewneck-1.webp'),                        alt: 'Tabea — Crewneck gris'       },
  { src: img('Zoe_crewneck_black_2.webp'),                         alt: 'Zoé — Crewneck noir'         },
  { src: img('Lou_white_tshirt_2.webp'),                           alt: 'Lou — T-shirt blanc'         },
  { src: img('Tabea_white_tshirt_2.webp'),                         alt: 'Tabea — T-shirt blanc'       },
  { src: img('Lou_crewneck_black_2.webp'),                         alt: 'Lou — Crewneck noir'         },
  { src: img('Trio_2.webp'),                                       alt: 'La team LMRL'                },
  { src: img('Zoe_tshirt_black_back_1.webp'),                      alt: 'Zoé — T-shirt (dos)'        },
  { src: img('Lou_grey_cewneck_back_1.webp'),                      alt: 'Lou — Crewneck (dos)'       },
  { src: img('Tabea_white_tshirt_Zoe_back_black_tshirt.webp'),     alt: 'Tabea & Zoé — T-shirts'     },
  { src: img('Lou_black_crewneck_back_2.webp'),                    alt: 'Lou — Crewneck noir (dos)'  },
  { src: img('Tabea_totebag.webp'),                                alt: 'Tabea — Tote bag'            },
  { src: img('Tabea_totebag_second_version.webp'),                 alt: 'Tabea — Tote bag v2'         },
]

export function MerchAlbum() {
  const [lightbox, setLightbox] = useState<number | null>(null)

  const prev = () => setLightbox(i => (i === null ? null : (i - 1 + PHOTOS.length) % PHOTOS.length))
  const next = () => setLightbox(i => (i === null ? null : (i + 1) % PHOTOS.length))

  return (
    <section style={{ background: '#F5F0E8' }} className="py-20">
      <div className="max-w-6xl mx-auto px-6 md:px-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-[0.6rem] tracking-[0.5em] uppercase text-ink/40 mb-4">Galerie</p>
          <div className="flex items-end justify-between">
            <h2
              className="font-merch font-light text-ink leading-none"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '0.06em' }}
            >
              La Collection
            </h2>
            <p className="text-xs text-ink/30 hidden md:block tracking-[0.12em] uppercase">
              {PHOTOS.length} photos
            </p>
          </div>
          <div className="h-px bg-ink/10 mt-6" />
          <p className="mt-4 text-xs tracking-[0.25em] uppercase" style={{ color: '#8B5E3C' }}>
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
        </motion.div>

        {/* CSS columns masonry — every photo at full natural height, no cropping */}
        <div
          className="gap-3"
          style={{
            columnCount: 2,
            columnGap: '12px',
          }}
        >
          {PHOTOS.map((photo, i) => (
            <motion.div
              key={photo.src}
              className="break-inside-avoid cursor-pointer group relative overflow-hidden"
              style={{ marginBottom: '12px', borderRadius: '2px' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ delay: (i % 4) * 0.05, duration: 0.4 }}
              onClick={() => setLightbox(i)}
            >
              {/* Full photo — no height constraint, no cropping */}
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.03]"
                style={{ display: 'block' }}
              />
              {/* Hover overlay with caption */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-end p-3">
                <p className="text-white text-[0.6rem] tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                  {photo.alt}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] bg-black/95 flex items-center justify-center"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.22 }}
              className="relative flex items-center justify-center"
              style={{ maxWidth: '90vw', maxHeight: '90vh' }}
              onClick={e => e.stopPropagation()}
            >
              <img
                src={PHOTOS[lightbox].src}
                alt={PHOTOS[lightbox].alt}
                style={{ maxWidth: '88vw', maxHeight: '88vh', objectFit: 'contain', borderRadius: '2px' }}
              />
              <p className="absolute -bottom-7 left-0 right-0 text-center text-white/40 text-[0.6rem] tracking-[0.3em] uppercase">
                {PHOTOS[lightbox].alt}
              </p>
            </motion.div>

            {/* Prev */}
            <button
              onClick={e => { e.stopPropagation(); prev() }}
              className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors"
            >
              <svg width="18" height="18" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next */}
            <button
              onClick={e => { e.stopPropagation(); next() }}
              className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors"
            >
              <svg width="18" height="18" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Close */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors"
            >
              <svg width="16" height="16" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Counter */}
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/30 text-[0.6rem] tracking-[0.3em]">
              {lightbox + 1} / {PHOTOS.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
