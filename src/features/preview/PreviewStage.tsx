import { useWorkspaceState } from '@/features/workspace'
import { summarizeSetup } from './describe'
import { Scene } from './Scene'

/** The live workspace preview: heading, a one-line summary, and the illustrated scene. */
export function PreviewStage() {
  const state = useWorkspaceState()

  return (
    <section
      aria-label="Workspace preview"
      className="relative flex min-h-80 flex-1 flex-col overflow-hidden rounded-3xl bg-gradient-to-b from-sunset-100 via-sand-50 to-sand-100 shadow-sm ring-1 ring-sand-200 lg:min-h-[32rem]"
    >
      <div className="px-6 pt-6">
        <p className="text-xs font-semibold tracking-widest text-sunset-600 uppercase">Your workspace</p>
        <h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">Create your perfect setup</h2>
        <p aria-live="polite" className="mt-1 text-sm text-ink-600">
          {summarizeSetup(state)}
        </p>
      </div>

      <div className="flex flex-1 items-end px-2 pb-2 sm:px-4">
        <Scene state={state} />
      </div>
    </section>
  )
}
