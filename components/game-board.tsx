"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, RotateCcw } from "lucide-react"
import ScoreHistory from "@/components/score-history"
import PlayerScoreCard from "@/components/player-score-card"
import EliminationMessage from "@/components/elimination-message"
import "./game-board.css"

type Player = {
  name: string
  score: number
  eliminated: boolean
}

type RoundScore = {
  round: number
  scores: {
    playerName: string
    score: number
  }[]
}

type GameData = {
  players: Player[]
  eliminationScore: number
  currentRound: number
  history: RoundScore[]
}

export default function GameBoard() {
  const router = useRouter()
  const [gameData, setGameData] = useState<GameData | null>(null)
  const [roundScores, setRoundScores] = useState<{ [key: string]: string }>({})
  const [showEliminationMessage, setShowEliminationMessage] = useState(false)
  const [eliminatedPlayer, setEliminatedPlayer] = useState<Player | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("game")

  useEffect(() => {
    // Load game data from localStorage
    const savedGameData = localStorage.getItem("ramiGameData")

    if (savedGameData) {
      setGameData(JSON.parse(savedGameData))
    } else {
      // Redirect to setup if no game data exists
      router.push("/")
    }

    setIsLoading(false)
  }, [router])

  const handleScoreChange = (playerName: string, value: string) => {
    setRoundScores({
      ...roundScores,
      [playerName]: value,
    })
  }

  const submitRound = () => {
    if (!gameData) return

    const newGameData = { ...gameData }
    const roundScoreEntry: RoundScore = {
      round: newGameData.currentRound,
      scores: [],
    }

    // Process scores for each player
    newGameData.players.forEach((player) => {
      if (player.eliminated) return

      let scoreValue = 0
      const inputScore = roundScores[player.name]

      if (inputScore === "X" || inputScore === "x") {
        scoreValue = 100
      } else if (inputScore === "-") {
        scoreValue = 0
      } else {
        scoreValue = Number.parseInt(inputScore) || 0
      }

      // Add to player's total score
      player.score += scoreValue

      // Check for elimination
      if (player.score >= newGameData.eliminationScore && !player.eliminated) {
        player.eliminated = true
        setEliminatedPlayer(player)
        setShowEliminationMessage(true)
      }

      // Add to round history
      roundScoreEntry.scores.push({
        playerName: player.name,
        score: scoreValue,
      })
    })

    // Add round to history
    newGameData.history.push(roundScoreEntry)
    newGameData.currentRound += 1

    // Update game data
    setGameData(newGameData)
    localStorage.setItem("ramiGameData", JSON.stringify(newGameData))

    // Clear round scores
    setRoundScores({})
  }

  const resetGame = () => {
    localStorage.removeItem("ramiGameData")
    router.push("/")
  }

  if (isLoading) {
    return <div className="loading-message">Loading game...</div>
  }

  if (!gameData) {
    return (
      <div className="no-data-message">
        No game data found.
        <button onClick={() => router.push("/")} className="btn mt-4">
          Start New Game
        </button>
      </div>
    )
  }

  const activePlayers = gameData.players.filter((player) => !player.eliminated)
  const allEliminated = activePlayers.length <= 1

  return (
    <>
      {showEliminationMessage && eliminatedPlayer && (
        <EliminationMessage player={eliminatedPlayer} onClose={() => setShowEliminationMessage(false)} />
      )}

      <div className="game-board-header">
        <button className="nav-button" onClick={() => router.push("/")}>
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="round-title">Round {gameData.currentRound}</h1>
        <button className="nav-button" onClick={resetGame}>
          <RotateCcw className="h-5 w-5" />
        </button>
      </div>

      <div className="tabs">
        <button className={`tab-button ${activeTab === "game" ? "active" : ""}`} onClick={() => setActiveTab("game")}>
          Game
        </button>
        <button
          className={`tab-button ${activeTab === "history" ? "active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          History
        </button>
      </div>

      {activeTab === "game" ? (
        <div className="game-board-container">
          <div className="player-grid">
            {gameData.players.map((player, index) => (
              <PlayerScoreCard
                key={player.name}
                player={player}
                eliminationScore={gameData.eliminationScore}
                colorIndex={index}
              />
            ))}
          </div>

          {!allEliminated ? (
            <div className="score-entry-card">
              <div className="score-entry-header">
                <h2 className="score-entry-title">Enter Round Scores</h2>
              </div>
              <div className="score-entry-content">
                {activePlayers.map((player) => (
                  <div key={player.name} className="score-input-group">
                    <label className="score-input-label" htmlFor={`score-${player.name}`}>
                      {player.name}
                    </label>
                    <div className="score-input-container">
                      <input
                        id={`score-${player.name}`}
                        className="score-input"
                        placeholder="Score, X (100) or - (0)"
                        value={roundScores[player.name] || ""}
                        onChange={(e) => handleScoreChange(player.name, e.target.value)}
                      />
                      <button
                        className="score-button score-button-x"
                        onClick={() => handleScoreChange(player.name, "X")}
                      >
                        X
                      </button>
                      <button
                        className="score-button score-button-zero"
                        onClick={() => handleScoreChange(player.name, "-")}
                      >
                        -
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="score-entry-footer">
                <button
                  onClick={submitRound}
                  className="submit-button"
                  disabled={activePlayers.some((p) => !roundScores[p.name])}
                >
                  Submit Round
                </button>
              </div>
            </div>
          ) : (
            <div className="winner-card">
              <div className="trophy-icon">🏆</div>
              <h3 className="winner-title">Game Over!</h3>
              <p className="winner-text">
                {gameData.players.find((p) => !p.eliminated)?.name || "No one"} is the winner!
              </p>
              <button onClick={resetGame} className="new-game-button">
                Start New Game
              </button>
            </div>
          )}
        </div>
      ) : (
        <ScoreHistory history={gameData.history} players={gameData.players} />
      )}
    </>
  )
}

