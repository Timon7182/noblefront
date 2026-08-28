import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const noHover = () => window.matchMedia('(hover: none)').matches

/* ---------- v-reveal / v-reveal="1..3" — появление главы при скролле ---------- */

let io = null

function getObserver() {
  if (!io) {
    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            if (entry.target.__revealFallback) clearTimeout(entry.target.__revealFallback)
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
  }
  return io
}

export const reveal = {
  mounted(el, binding) {
    // Контент виден по умолчанию: скрываем только то, что сейчас ниже экрана,
    // и всегда держим страховочный таймер — глава не может остаться пустой.
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) return

    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight) return

    el.classList.add('reveal')
    const delay = Number(binding.value)
    if (delay >= 1 && delay <= 3) {
      el.classList.add(`reveal-delay-${delay}`)
    }

    getObserver().observe(el)
    el.__revealFallback = setTimeout(() => el.classList.add('in'), 2500)
  },
  unmounted(el) {
    if (io) io.unobserve(el)
    if (el.__revealFallback) clearTimeout(el.__revealFallback)
  },
}

/* ---------- v-tilt / v-tilt="6" — 3D-наклон карточки за курсором ---------- */

export const tilt = {
  mounted(el, binding) {
    if (prefersReducedMotion() || noHover()) return
    const max = Number(binding.value) || 5
    el.classList.add('tilt')

    const move = (e) => {
      const rect = el.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width - 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5
      el.style.transform = `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg)`
    }
    const leave = () => {
      el.style.transform = ''
    }

    el.__tiltMove = move
    el.__tiltLeave = leave
    el.addEventListener('mousemove', move)
    el.addEventListener('mouseleave', leave)
  },
  unmounted(el) {
    if (el.__tiltMove) el.removeEventListener('mousemove', el.__tiltMove)
    if (el.__tiltLeave) el.removeEventListener('mouseleave', el.__tiltLeave)
  },
}

/* ---------- v-parallax / v-parallax="10" — вертикальный параллакс при скролле ----------
   Элемент двигается на ±N yPercent, пока его рамка проходит через вьюпорт.
   Рамка — ближайший [data-parallax-frame] или родитель (должен быть overflow-hidden). */

export const parallax = {
  mounted(el, binding) {
    if (prefersReducedMotion()) return
    const value = binding.value
    const y = typeof value === 'object' ? Number(value.y) || 0 : Number(value) || 8
    const x = typeof value === 'object' ? Number(value.x) || 0 : 0
    const frame = el.closest('[data-parallax-frame]') || el.parentElement

    const from = {}
    const to = { ease: 'none' }
    if (y) { from.yPercent = -y; to.yPercent = y }
    if (x) { from.xPercent = -x; to.xPercent = x }
    to.scrollTrigger = {
      trigger: frame,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    }

    el.__parallaxTween = gsap.fromTo(el, from, to)

    if (el.tagName === 'IMG' && !el.complete) {
      el.addEventListener('load', () => ScrollTrigger.refresh(), { once: true })
    }
  },
  unmounted(el) {
    if (el.__parallaxTween) {
      if (el.__parallaxTween.scrollTrigger) el.__parallaxTween.scrollTrigger.kill()
      el.__parallaxTween.kill()
    }
  },
}

export { gsap, ScrollTrigger }
