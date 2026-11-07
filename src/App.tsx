import { Header } from '@/components/layout/Header'
import { BuilderPanel } from '@/features/builder/BuilderPanel'
import { SummaryBar } from '@/features/checkout/SummaryBar'
import { PreviewStage } from '@/features/preview/PreviewStage'

export default function App() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />

      <main className="mx-auto grid w-full max-w-7xl flex-1 gap-4 px-4 py-4 sm:px-6 sm:py-6 lg:grid-cols-[1fr_380px]">
        <PreviewStage />
        <BuilderPanel />
      </main>

      <SummaryBar />
    </div>
  )
}
