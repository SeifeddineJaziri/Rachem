"use client"

import { useState, useEffect } from "react"
import "./elimination-message.css"

type Player = {
  name: string
  score: number
  eliminated: boolean
}

type EliminationMessageProps = {
  player: Player
  onClose: () => void
}

const ELIMINATION_MESSAGES = [
  "Tahchelkom! {name} bhim el ga3da lamed {score} !",
  "El mnayek {name}! lam {score} el 3akba l ja3b 3amtek !",
  "BOOM! {name} tarcha9 b {score} ! el jeyin f ja3b khaltek!",
  "Bhim el ga3da! {name} bch yahbet ya3mel fom fom aal deyer !",
  "{name} bch nrawhou maah l dar naemloulou {score} !",
]

export default function EliminationMessage({ player, onClose }: EliminationMessageProps) {
  const [message, setMessage] = useState("")

  useEffect(() => {
    // Select a random elimination message
    const randomIndex = Math.floor(Math.random() * ELIMINATION_MESSAGES.length)
    const template = ELIMINATION_MESSAGES[randomIndex]

    // Replace placeholders with actual values
    const formattedMessage = template.replace("{name}", player.name).replace("{score}", player.score.toString())

    setMessage(formattedMessage)
  }, [player])

  return (
    <div className="elimination-message">
      <div className="elimination-card">
        <button className="elimination-close-btn" onClick={onClose}>
          ✕
        </button>

        <div className="text-center">
          <h2 className="elimination-title">Eliminated!</h2>
          <p className="elimination-message-text">{message}</p>
          <button className="elimination-continue-btn" onClick={onClose}>
            Continue Game
          </button>
        </div>
      </div>
    </div>
  )
}

