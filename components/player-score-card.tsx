import { AlertCircle } from "lucide-react"
import "./player-score-card.css"

type PlayerProps = {
  player: {
    name: string
    score: number
    eliminated: boolean
  }
  eliminationScore: number
  colorIndex: number
}

export default function PlayerScoreCard({ player, eliminationScore, colorIndex }: PlayerProps) {
  const progressPercentage = Math.min(100, (player.score / eliminationScore) * 100)
  const dangerZone = progressPercentage >= 80
  const warningZone = progressPercentage >= 50 && progressPercentage < 80

  return (
    <div className={`player-card player-card-${colorIndex + 1} ${player.eliminated ? "eliminated" : ""}`}>
      <div className="player-card-content">
        <div className="player-card-header">
          <h3 className="player-name" title={player.name}>
            {player.name}
          </h3>
          {player.eliminated && <span className="eliminated-badge">Eliminated</span>}
        </div>

        <div className="player-score">
          {player.score}
          <span className="player-score-unit">pts</span>
        </div>

        <div className="progress-container">
          <div className="progress-bar">
            <div
              className={`progress-fill ${
                dangerZone ? "progress-danger" : warningZone ? "progress-warning" : "progress-safe"
              }`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          {dangerZone && !player.eliminated && (
            <div className="danger-warning">
              <AlertCircle className="danger-icon" />
              <span>Danger zone!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

