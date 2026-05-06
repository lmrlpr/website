import { TicketOptions } from './TicketOptions'
import { DJLineup } from './DJLineup'
import { PracticalInfo } from './PracticalInfo'
import { Gallery } from './Gallery'
import { Footer } from '../../components/layout/Footer'
import { Experience } from './experience/Experience'
import { SectionPortal } from './experience/overlay/SectionPortal'
import { ExperienceErrorBoundary } from './experience/ErrorBoundary'

/**
 * Gotham — cinematic 3D scroll experience.
 *
 * Phases 1–5 (landing → H portal → warp → laser grid) play out within the
 * Experience component while the user scrolls through a tall spacer. Once the
 * spacer ends, the existing content sections scroll past, each entering "from
 * depth" via SectionPortal so they feel like they're flying toward the camera.
 */
export default function PromGotham() {
  return (
    <ExperienceErrorBoundary>
    <Experience>
      <SectionPortal>
        <TicketOptions />
      </SectionPortal>
      <SectionPortal>
        <DJLineup />
      </SectionPortal>
      <SectionPortal>
        <Gallery />
      </SectionPortal>
      <SectionPortal>
        <PracticalInfo />
      </SectionPortal>

      <div className="[&_*]:!text-white/30 [&_p]:!text-white/30 [&_a]:!text-white/40">
        <Footer />
      </div>
    </Experience>
    </ExperienceErrorBoundary>
  )
}
