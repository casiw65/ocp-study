import { getTopicColor } from '../data/index.js'

export default function Home({ progress, topics, allQuestions, onGoSetup, onResetProgress }) {
  const totalAnswered = progress.totalAnswered || 0
  const totalCorrect = progress.totalCorrect || 0
  const overallPct = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0
  const sessions = progress.sessions || 0

  return (
    <main className="page-wide">
      <div className="section-header">
        <div>
          <h1 className="page-title">OneStream OCP Exam Prep</h1>
          <p className="page-subtitle">518 questions across 7 topics — track your progress toward passing on the first attempt</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-primary btn-lg" onClick={onGoSetup}>Start Quiz</button>
          {totalAnswered > 0 && (
            <button className="btn btn-ghost btn-sm" onClick={onResetProgress} style={{ alignSelf: 'center' }}>
              Reset Progress
            </button>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{overallPct}<span style={{ fontSize: '24px' }}>%</span></div>
          <div className="stat-label">Overall Score</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalAnswered}</div>
          <div className="stat-label">Questions Answered</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{sessions}</div>
          <div className="stat-label">Quiz Sessions</div>
        </div>
      </div>

      {/* Topic grid */}
      <div className="section-header">
        <span className="section-title">Study by Topic</span>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Click a topic to start a focused quiz</span>
      </div>

      <div className="topic-grid">
        {topics.map(topic => {
          const topicProgress = progress.topics?.[topic.id] || {}
          const answered = topicProgress.answered || 0
          const correct = topicProgress.correct || 0
          const bestPct = topicProgress.bestPct || 0
          const pct = answered > 0 ? Math.round((correct / answered) * 100) : 0
          const coverage = topic.count > 0 ? Math.round((answered / topic.count) * 100) : 0

          return (
            <div
              key={topic.id}
              className="topic-card"
              style={{ '--topic-color': topic.color }}
              onClick={onGoSetup}
            >
              <div className="topic-name">{topic.label}</div>
              <div className="topic-count">{topic.count} questions</div>

              <div className="topic-progress-bar">
                <div
                  className="topic-progress-fill"
                  style={{ width: `${coverage}%`, background: topic.color }}
                />
              </div>

              <div className="topic-score">
                <span>{answered > 0 ? `${coverage}% covered` : 'Not started'}</span>
                <span className="topic-score-val">
                  {answered > 0 ? `Best: ${bestPct}%` : '—'}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tips */}
      {totalAnswered === 0 && (
        <div className="card" style={{ marginTop: '8px', padding: '24px' }}>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
            <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>Getting started</strong>
            Hit <strong>Start Quiz</strong> to choose your topics, difficulty, and question count.
            Your progress saves automatically after every quiz — no login required.
            For deeper explanations on any question, come back here and ask Claude directly.
          </div>
        </div>
      )}
    </main>
  )
}
