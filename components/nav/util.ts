import Vue from 'vue'

let prev = Date.now()

function fallback(fn: FrameRequestCallback): number {
    const cur = Date.now()
    const ms = Math.max(0, 16 - (cur - prev))
    const id = setTimeout(fn, ms)
    prev = cur + ms
    return id
}
const isServer: boolean = Vue.prototype.$isServer
const root = <Window>(isServer ? global : window)
const iRaf = root.requestAnimationFrame || fallback
const raf = (fn: FrameRequestCallback): number => iRaf.call(root, fn)

export function scrollLeftTo(el: HTMLElement, to: number, duration: number): void {
    let count: number = 0
    const from = el.scrollLeft
    const frames = duration === 0 ? 1 : Math.round((duration * 1000) / 16)
    function animate(): void {
        el.scrollLeft += (to - from) / frames
        if (++count < frames) {
            raf(animate)
        }
    }
    animate()
}
