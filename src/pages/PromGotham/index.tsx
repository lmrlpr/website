import { TicketOptions } from './TicketOptions'
import { DJLineup } from './DJLineup'
import { PracticalInfo } from './PracticalInfo'
import { Gallery } from './Gallery'
import { Footer } from '../../components/layout/Footer'
import { Experience } from './experience/Experience'
import { PinnedSlide } from './experience/overlay/PinnedSlide'
import { ExperienceErrorBoundary } from './experience/ErrorBoundary'

/**
 * Gotham — cinematic 3D scroll experience.
 *
 * The intro spacer (700vh, configured in Experience.tsx) drives the
 * cinematic phases: GOTHAM landing → camera approach → H doorway opens →
 * portal flash → laser stage forms with the city silhouette on the horizon.
 *
 * After the spacer, each content section is wrapped in a PinnedSlide. The
 * slide pins to the viewport for ~2 viewport-heights of scroll. During the
 * pin, scroll drives a 3D depth tween: the card emerges tiny in the
 * distance, grows toward the camera, holds in focus, then continues forward
 * past the viewer while the next slide approaches from depth behind.
 *
 * The 3D laser stage stays alive and the camera slowly drifts forward
 * through the venue while content slides traverse the foreground.
 */
export default function PromGotham() {
  return (
    <ExperienceErrorBoundary>
      <Experience>
        <PinnedSlide>
          <TicketOptions />
        </PinnedSlide>
        <PinnedSlide>
          <DJLineup />
        </PinnedSlide>
        <PinnedSlide>
          <Gallery />
        </PinnedSlide>
        <PinnedSlide>
          <PracticalInfo />
        </PinnedSlide>

        <div className="[&_*]:!text-white/30 [&_p]:!text-white/30 [&_a]:!text-white/40">
          <Footer />
        </div>
      </Experience>
    </ExperienceErrorBoundary>
  )
}
