import { useEffect } from 'react'

export const useFormGuard = (isDirty: boolean) => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        isDirty &&
        event.target instanceof Element &&
        event.target.closest('a:not([target="_blank"])')
      ) {
        if (!window.confirm('ページを離れても良いですか？')) {
          event.preventDefault()
          event.stopPropagation()
        }
      }
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault()
        return (event.returnValue = '')
      }
    }

    const handlePopState = (event: PopStateEvent) => {
      if (isDirty) {
        if (!window.confirm('ページを離れても良いですか？')) {
          event.preventDefault()
          window.history.pushState(null, '', window.location.href)
        } else {
          window.history.back() // もしキャンセルされた場合、元の状態に戻す
        }
      }
    }

    window.history.pushState(null, '', window.location.href) // 初期状態を保存
    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('click', handleClick, true)
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('click', handleClick, true)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [isDirty])
}
