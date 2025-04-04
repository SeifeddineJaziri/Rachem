import type { Metadata } from "next"
import GameSetup from "@/components/game-setup"

export const metadata: Metadata = {
  title: "RAMI Score Tracker",
  description: "Track scores for your custom RAMI card game",
}

export default function Home() {
  return (
    <main className="container max-w-md mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">RAMI Score Tracker</h1>
      <GameSetup />
    </main>
  )
}

