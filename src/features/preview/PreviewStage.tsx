import { QuickStart } from '@/features/presets/QuickStart'
import { ShareButton } from '@/features/share/ShareButton'
import { useWorkspaceState } from '@/features/workspace'
import { summarizeSetup } from './describe'
import { Scene } from './Scene'

/**
 * The live workspace preview: heading, summary, quick-start setups, and the illustrated scene.
 * On portrait phones it pins to the top in a compact form, so the scene stays in view while
 * the user scrolls the picker below it.
 */
export function PreviewStage() {
  const state = useWorkspaceState()

  return (
    <section
      aria-label="Workspace preview"
      className="relative flex flex-col overflow-hidden rounded-3xl bg-gradient-to-b from-sunset-100 via-sand-50 to-sand-100 shadow-sm ring-1 ring-sand-200 pin-preview:sticky pin-preview:top-0 pin-preview:z-10 lg:min-h-[32rem] lg:flex-1"
    >
      <div className="grid grid-cols-[1fr_auto] items-start gap-x-3 px-4 pt-4 sm:px-6 sm:pt-6">
        {/* The page header already names the app, so phones skip this heading to save space. */}
        <div className="col-start-1 row-start-1 max-lg:hidden">
          <p className="text-xs font-semibold tracking-widest text-sunset-600 uppercase">Your workspace</p>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">Create your perfect setup</h2>
        </div>
        <div className="col-start-2 row-start-1">
          <ShareButton />
        </div>
        <p
          aria-live="polite"
          className="col-start-1 row-start-1 self-center text-xs text-ink-600 lg:col-span-2 lg:row-start-2 lg:mt-1 lg:text-sm"
        >
          {summarizeSetup(state)}
        </p>
      </div>

      <div className="px-4 sm:px-6">
        <QuickStart />
      </div>

      <div className="flex flex-1 items-end justify-center px-2 pb-2 sm:px-4">
        <Scene state={state} className="pin-preview:max-h-[30dvh]" />
      </div>
    </section>
  )
}
