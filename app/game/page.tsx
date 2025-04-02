import type { Metadata } from "next"
import GameBoard from "@/components/game-board"

export const metadata: Metadata = {
  title: "RAMI Game | Playing",
  description: "Track scores for your custom RAMI card game",
}

export default function GamePage() {
  return (
    <main className="container max-w-md mx-auto px-4 py-8">
      <GameBoard />
    </main>
  )
}

