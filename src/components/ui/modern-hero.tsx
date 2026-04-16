import * as React from 'react'
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from 'framer-motion'
import { cn } from '../../utils/cn'

export interface ParallaxImageSpec {
  src: string
  alt?: string
  /** Initial translateY in px */
  start: number
  /** Final translateY in px */
  end: number
  /** Subtle editorial rotation in degrees, e.g. 1.8 or -2.2; defaults to 0 */
  rotation?: number
  /** Layout classes, e.g. 'w-1/3', 'mx-auto w-2/3', 'ml-auto w-1/3' */
  className?: string
}

export interface SmoothScrollHeroProps {
  centerImage: string
  centerAlt?: string
  /** CSS background-position for the center image, e.g. 'center top'; defaults to 'center' */
  centerImagePosition?: string
  parallaxImages: ParallaxImageSpec[]
  bgColor?: string
  sectionHeight?: number
  /** Top padding before the first parallax image appears (px); defaults to 200 */
  parallaxPaddingTop?: number
  /** Keep the image at full opacity after reveal instead of fading it out */
  keepImageVisible?: boolean
  children?: React.ReactNode
  className?: string
}

export function SmoothScrollHero({
  centerImage,
  centerImagePosition = 'center',
  parallaxImages,
  bgColor = '#EADFCC',
  sectionHeight = 1500,
  parallaxPaddingTop = 200,
  keepImageVisible = false,
  children,
  className,
}: SmoothScrollHeroProps) {
  return (
    <div className={cn('relative w-full', className)} style={{ backgroundColor: bgColor }}>
      <div
        style={{ height: `calc(${sectionHeight}px + 100vh)` }}
        className="relative w-full"
      >
        <CenterImage src={centerImage} imagePosition={centerImagePosition} sectionHeight={sectionHeight} keepImageVisible={keepImageVisible}>
          {children}
        </CenterImage>

        <ParallaxImages images={parallaxImages} paddingTop={parallaxPaddingTop} />

        {!keepImageVisible && (
          <div
            className="absolute bottom-0 left-0 right-0 h-[1000px] pointer-events-none"
            style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0), ${bgColor})` }}
          />
        )}
      </div>
    </div>
  )
}

function CenterImage({
  src,
  sectionHeight,
  imagePosition = 'center',
  keepImageVisible = false,
  children,
}: {
  src: string
  sectionHeight: number
  imagePosition?: string
  keepImageVisible?: boolean
  children?: React.ReactNode
}) {
  const { scrollY } = useScroll()

  const clip1 = useTransform(scrollY, [0, sectionHeight], [14, 0])
  const clip2 = useTransform(scrollY, [0, sectionHeight], [86, 100])

  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`

  const backgroundSize = useTransform(
    scrollY,
    [0, sectionHeight + 500],
    ['170%', '100%'],
  )
  const imageOpacity = useTransform(
    scrollY,
    [sectionHeight * 0.75, sectionHeight],
    [1, 0],
  )

  const overlayOpacity = useTransform(scrollY, [0, sectionHeight * 0.5], [1, 0])
  const overlayScale = useTransform(scrollY, [0, sectionHeight * 0.5], [1, 0.92])

  return (
    <div className="sticky top-0 h-screen w-full overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={{
          clipPath,
          backgroundSize,
          opacity: keepImageVisible ? 1 : imageOpacity,
          backgroundImage: `url(${src})`,
          backgroundPosition: imagePosition,
          backgroundRepeat: 'no-repeat',
          willChange: 'clip-path, background-size, opacity',
        }}
      />

      {children && (
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
          style={{
            opacity: overlayOpacity,
            scale: overlayScale,
            willChange: 'transform, opacity',
          }}
        >
          <div className="pointer-events-auto flex flex-col items-center">
            {children}
          </div>
        </motion.div>
      )}
    </div>
  )
}

function ParallaxImages({ images, paddingTop }: { images: ParallaxImageSpec[]; paddingTop: number }) {
  return (
    <div className="mx-auto max-w-5xl px-4 relative z-0 pb-[600px]" style={{ paddingTop }}>
      {images.map((img, i) => (
        <ParallaxImg key={`${img.src}-${i}`} {...img} />
      ))}
    </div>
  )
}

function ParallaxImg({ className, alt, src, start, end, rotation = 0 }: ParallaxImageSpec) {
  const ref = React.useRef<HTMLImageElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`${start}px end`, `end ${end * -1}px`],
  })

  const opacity = useTransform(scrollYProgress, [0.75, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0.75, 1], [1, 0.85])
  const y = useTransform(scrollYProgress, [0, 1], [start, end])
  const transform = useMotionTemplate`translateY(${y}px) scale(${scale}) rotate(${rotation}deg)`

  return (
    <motion.img
      src={src}
      alt={alt ?? ''}
      ref={ref}
      loading="lazy"
      className={className}
      style={{ transform, opacity, willChange: 'transform, opacity' }}
      draggable={false}
    />
  )
}
