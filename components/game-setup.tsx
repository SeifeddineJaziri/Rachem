"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import "./game-setup.css"

export default function GameSetup() {
  const router = useRouter()
  const [players, setPlayers] = useState(["", "", "", ""])
  const [eliminationScore, setEliminationScore] = useState(500)
  const [error, setError] = useState("")

  const handlePlayerNameChange = (index: number, name: string) => {
    const newPlayers = [...players]
    newPlayers[index] = name
    setPlayers(newPlayers)
  }

  const startGame = () => {
    // Validate that at least 2 players have names
    const validPlayers = players.filter((name) => name.trim() !== "")

    if (validPlayers.length < 2) {
      setError("Please add at least 2 players to start the game")
      return
    }

    setError("")

    // Create player objects with names and starting scores
    const gameData = {
      players: validPlayers.map((name) => ({
        name,
        score: 0,
        eliminated: false,
      })),
      eliminationScore,
      currentRound: 1,
      history: [],
    }

    // Store game data in localStorage
    localStorage.setItem("ramiGameData", JSON.stringify(gameData))

    // Navigate to game screen
    router.push("/game")
  }

  return (
    <div className="game-setup-card">
      <div className="game-setup-header">
        <h2 className="game-setup-title">Game Setup</h2>
        <p className="game-setup-description">Add player names and set elimination score</p>
      </div>
      <div className="game-setup-content">
        <div className="game-setup-section">
          <h3 className="game-setup-section-title">Players (2-4)</h3>
          {players.map((player, index) => (
            <div key={index} className="player-input-group">
              <label className="player-input-label" htmlFor={`player-${index}`}>
                Player {index + 1}
              </label>
              <input
                id={`player-${index}`}
                className="player-input"
                placeholder={`Enter player ${index + 1} name`}
                value={player}
                onChange={(e) => handlePlayerNameChange(index, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="elimination-score-container">
          <label className="elimination-score-label">Elimination Score: {eliminationScore}</label>
          <input
            type="range"
            className="elimination-score-slider"
            min={100}
            max={1500}
            step={50}
            value={eliminationScore}
            onChange={(e) => setEliminationScore(Number(e.target.value))}
          />
          <p className="elimination-score-helper">First player to reach {eliminationScore} points will be eliminated</p>
        </div>

        {error && <p className="error-message">{error}</p>}
      </div>
      <div className="game-setup-footer">
        <button onClick={startGame} className="start-game-button">
          Start Game
        </button>
      </div>
    </div>
  )
}

