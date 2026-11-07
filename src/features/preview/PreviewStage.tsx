import { Sparkles } from 'lucide-react'

/**
 * The live workspace scene. For now it renders the empty "stage" (floor + backdrop);
 * the layered SVG furniture is drawn here once the catalog and store exist.
 */
export function PreviewStage() {
  return (
    <section
      aria-label="Workspace preview"
      className="relative flex min-h-80 flex-1 flex-col overflow-hidden rounded-3xl bg-gradient-to-b from-sunset-100 via-sand-50 to-sand-100 shadow-sm ring-1 ring-sand-200 lg:min-h-[32rem]"
    >
      <div className="px-6 pt-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-sunset-600">
          Your workspace
        </p>
        <h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
          Create your perfect setup
        </h2>
      </div>

      <div className="relative flex flex-1 items-end justify-center px-6 pb-10">
        {/* Floor */}
        <div className="absolute inset-x-8 bottom-8 h-24 rounded-[50%] bg-sand-200/80 ring-1 ring-sand-300" />

        <div className="relative z-10 mb-28 flex flex-col items-center gap-2 text-center text-ink-600">
          <Sparkles className="size-6 text-sunset-500" aria-hidden />
          <p className="max-w-xs text-sm">
            Pick a desk and a chair to start building — your setup comes to life right here.
          </p>
        </div>
      </div>
    </section>
  )
}
