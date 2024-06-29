export function stopBodyScroll() {
  const body = document.querySelector('body')
  if (body) {
    body.style.cssText = `
    overflow: hidden;
    width: 100vw;
    touch-action: none;
    -webkit-overflow-scrolling: none;
    overscroll-behavior: none;
    `
  }
}

export function restartBodyScroll() {
  const body = document.querySelector('body')
  if (body) {
    body.style.cssText = `
    overflow:auto
    touch-action: auto;
    -webkit-overflow-scrolling: auto;
    overscroll-behavior: auto;
    `
  }
}
