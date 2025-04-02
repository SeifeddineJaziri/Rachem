import "./score-history.css"

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

type ScoreHistoryProps = {
  history: RoundScore[]
  players: Player[]
}

export default function ScoreHistory({ history, players }: ScoreHistoryProps) {
  if (history.length === 0) {
    return <div className="no-history-message">No rounds played yet</div>
  }

  return (
    <div className="history-container">
      <div className="history-card">
        <div className="history-header">
          <h2 className="history-title">Score History</h2>
        </div>
        <div className="history-content">
          <table className="history-table">
            <thead>
              <tr>
                {players.map((player) => (
                  <th key={player.name}>{player.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.map((round) => (
                <tr key={round.round}>
                  {players.map((player) => {
                    const playerScore = round.scores.find((s) => s.playerName === player.name)
                    return (
                      <td key={player.name}>
                        {playerScore ? (
                          <span
                            className={`score-badge ${
                              playerScore.score === 100
                                ? "score-badge-x"
                                : playerScore.score === 0
                                  ? "score-badge-zero"
                                  : "score-badge-normal"
                            }`}
                          >
                            {playerScore.score === 100 ? "X" : playerScore.score === 0 ? "-" : playerScore.score}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
