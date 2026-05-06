import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { Flip } from 'gsap/Flip'
import { TextPlugin } from 'gsap/TextPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Flip, TextPlugin)

export { gsap, ScrollTrigger, ScrollToPlugin, Flip, TextPlugin }
