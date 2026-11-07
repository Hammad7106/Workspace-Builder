import { Check, Share2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { selectIsEmpty, useWorkspaceState } from '@/features/workspace'
import { buildShareUrl } from './share'

type Status = 'idle' | 'copied'

/**
 * Shares a link to the current setup: the native share sheet on touch devices,
 * otherwise copies the link to the clipboard (with a prompt as the last resort).
 */
export function ShareButton() {
  const state = useWorkspaceState()
  const [status, setStatus] = useState<Status>('idle')

  useEffect(() => {
    if (status !== 'copied') return
    const timer = setTimeout(() => setStatus('idle'), 2500)
    return () => clearTimeout(timer)
  }, [status])

  async function share() {
    const url = buildShareUrl(state, window.location)
    const prefersShareSheet = window.matchMedia?.('(pointer: coarse)').matches && typeof navigator.share === 'function'

    if (prefersShareSheet) {
      try {
        await navigator.share({ title: 'My monis.rent workspace', url })
        return
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return // user closed the sheet
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      setStatus('copied')
    } catch {
      window.prompt('Copy this link to share your setup:', url)
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      disabled={selectIsEmpty(state)}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold text-ink-900 shadow-sm ring-1 ring-sand-300 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      {status === 'copied' ? (
        <Check className="size-3.5 text-jungle-700" aria-hidden />
      ) : (
        <Share2 className="size-3.5" aria-hidden />
      )}
      <span aria-live="polite">{status === 'copied' ? 'Link copied' : 'Share setup'}</span>
    </button>
  )
}
