import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../utils/gsap'

type GsapCallback = (context: gsap.Context) => void

export function useGsap(callback: GsapCallback, deps: React.DependencyList = []) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    // gsap.context(fn, scope) invokes `fn` synchronously with the new context
    // as its first argument. Wrapping it as `() => callback(ctx)` previously
    // captured `ctx` in the temporal dead zone of the same `const ctx = …`
    // expression, which threw at runtime. Pass `callback` straight through.
    //
    // Scope must be a DOM element (or selector) — passing the ref object
    // itself triggers GSAP's "Invalid scope" warning, so we resolve `.current`
    // here. By the time useEffect runs the element is attached.
    const ctx = gsap.context(callback, ref.current ?? undefined)

    return () => {
      ctx.revert()
      ScrollTrigger.refresh()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return ref
}
