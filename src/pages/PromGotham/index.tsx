import { GothamHero } from './Hero'
import { TicketOptions } from './TicketOptions'
import { DJLineup } from './DJLineup'
import { PracticalInfo } from './PracticalInfo'
import { Gallery } from './Gallery'
import { Footer } from '../../components/layout/Footer'

export default function PromGotham() {
  return (
    <div className="bg-gotham-bg min-h-screen">
      <GothamHero />
      <TicketOptions />
      <DJLineup />
      <Gallery />
      <PracticalInfo />
      <div className="border-t border-white/5">
        <div className="[&_*]:!text-white/30 [&_p]:!text-white/30 [&_a]:!text-white/40">
          <Footer />
        </div>
      </div>
    </div>
  )
}
