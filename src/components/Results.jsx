import { useState } from 'react'

export default function Results({ results, onRetry, onReviewWrong, onNewQuiz, onHome, quizConfig }) {
  const [showReview, setShowReview] = useState(false)
  const { correct, total, wrongAnswers, byTopic, duration } = results
  const pct = Math.round((correct / total) * 100)
  const mins = Math.floor(duration / 60000)
  const secs = Math.floor((duration % 60000) / 1000)

  const scoreClass = pct >= 80 ? 'score-pass' : pct >= 65 ? 'score-warn' : 'score-fail'
  const scoreMsg = pct >= 80 ? 'Strong performance' : pct >= 65 ? 'Getting there' : 'Keep studying'

  if (showReview) {
    return (
      <main className="page">
        <div className="section-header">
          <h1 className="page-title">Wrong Answers</h1>
          <button className="btn btn-ghost" onClick={() => setShowReview(false)}>← Results</button>
        </div>
        <div className="review-list">
          {wrongAnswers.map((a, i) => (
            <div key={a.id} className="review-item">
              <div className="question-meta" style={{ marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{a.id}</span>
              </div>
              <div className="review-question">{a.question}</div>
              <div className="review-your-answer">
                Your answer: {Array.isArray(a.selected) ? a.selected.join(', ') : a.selected} —{' '}
                {typeof a.selected[0] === 'string' && a.options?.[a.selected[0]]
                  ? a.options[a.selected[0]]
                  : ''}
              </div>
              <div className="review-correct-answer">
                Correct: {Array.isArray(a.correctAnswer) ? a.correctAnswer.join(', ') : a.correctAnswer} —{' '}
                {Array.isArray(a.correctAnswer)
                  ? a.correctAnswer.map(l => a.options?.[l]).join('; ')
                  : a.options?.[a.correctAnswer] || ''}
              </div>
              {a.explanation && (
                <div className="review-explanation">{a.explanation}</div>
              )}
            </div>
          ))}
        </div>
      </main>
    )
  }

  return (
    <main className="page">
      <h1 className="page-title" style={{ marginBottom: '24px' }}>Quiz Results</h1>

      {/* Hero score */}
      <div className="results-hero">
        <div className={`results-score ${scoreClass}`}>{pct}%</div>
        <div className="results-label">{scoreMsg} — {correct} of {total} correct</div>
        <div className="results-detail">
          {mins > 0 ? `${mins}m ${secs}s` : `${secs}s`} &nbsp;·&nbsp; {total} questions
        </div>
      </div>

      {/* Topic breakdown */}
      {byTopic.length > 1 && (
        <div className="results-breakdown">
          <div className="breakdown-title">By Topic</div>
          {byTopic.map(({ topic, correct: c, total: t }) => {
            const p = Math.round((c / t) * 100)
            const fillColor = p >= 80 ? 'var(--green)' : p >= 65 ? 'var(--amber)' : 'var(--red)'
            return (
              <div key={topic} className="breakdown-row">
                <div className="breakdown-topic">{topic}</div>
                <div className="breakdown-bar-wrap">
                  <div className="breakdown-bar">
                    <div className="breakdown-fill" style={{ width: `${p}%`, background: fillColor }} />
                  </div>
                </div>
                <div className="breakdown-pct">{c}/{t}</div>
              </div>
            )
          })}
        </div>
      )}

      {/* Actions */}
      <div className="results-actions">
        <button className="btn btn-primary" onClick={onRetry}>Retry Same Quiz</button>
        {wrongAnswers.length > 0 && (
          <button className="btn btn-secondary" onClick={onReviewWrong}>
            Drill Wrong Answers ({wrongAnswers.length})
          </button>
        )}
        {wrongAnswers.length > 0 && (
          <button className="btn btn-ghost" onClick={() => setShowReview(true)}>
            Review Explanations
          </button>
        )}
        <button className="btn btn-ghost" onClick={onNewQuiz}>New Quiz</button>
        <button className="btn btn-ghost" onClick={onHome}>Dashboard</button>
      </div>
    </main>
  )
}
