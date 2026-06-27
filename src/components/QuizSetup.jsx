import { useState } from 'react'

export default function QuizSetup({ topics, allQuestions, onStart, onBack, hasResults, quizResults }) {
  const [selectedTopics, setSelectedTopics] = useState([])
  const [difficulty, setDifficulty] = useState('all')
  const [count, setCount] = useState(25)
  const [mode, setMode] = useState('random')

  function toggleTopic(topicId) {
    setSelectedTopics(prev =>
      prev.includes(topicId) ? prev.filter(t => t !== topicId) : [...prev, topicId]
    )
  }

  function selectAll() { setSelectedTopics(topics.map(t => t.id)) }
  function selectNone() { setSelectedTopics([]) }

  // Calculate available questions
  let available = allQuestions
  if (selectedTopics.length > 0) available = available.filter(q => selectedTopics.includes(q.topic))
  if (difficulty !== 'all') available = available.filter(q => q.difficulty === difficulty)
  const maxCount = available.length

  function handleStart() {
    if (maxCount === 0) return
    onStart({
      topics: selectedTopics,
      difficulty,
      count: Math.min(count, maxCount),
      mode,
      wrongOnly: false,
    })
  }

  function handleRetryWrong() {
    if (!quizResults?.wrongAnswers?.length) return
    onStart({
      topics: selectedTopics,
      difficulty,
      count: quizResults.wrongAnswers.length,
      mode: 'random',
      wrongOnly: true,
    })
  }

  return (
    <main className="page">
      <div className="section-header">
        <h1 className="page-title">Configure Quiz</h1>
        <button className="btn btn-ghost" onClick={onBack}>← Back</button>
      </div>

      <div className="setup-grid">
        {/* Left: Topics */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div className="setup-label" style={{ marginBottom: 0 }}>Topics</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-ghost btn-sm" onClick={selectAll}>All</button>
              <button className="btn btn-ghost btn-sm" onClick={selectNone}>None</button>
            </div>
          </div>
          <div className="topic-checkboxes">
            {topics.map(topic => (
              <label key={topic.id} className="topic-checkbox">
                <input
                  type="checkbox"
                  checked={selectedTopics.includes(topic.id)}
                  onChange={() => toggleTopic(topic.id)}
                />
                <span>
                  {topic.label}
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px', marginLeft: '6px' }}>
                    ({topic.count})
                  </span>
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Right: Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Difficulty */}
          <div className="card">
            <div className="setup-label">Difficulty</div>
            <div className="difficulty-pills">
              {['all', 'easy', 'medium', 'hard'].map(d => (
                <button
                  key={d}
                  className={`pill ${difficulty === d ? 'active' : ''}`}
                  onClick={() => setDifficulty(d)}
                >
                  {d === 'all' ? 'All levels' : d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Order */}
          <div className="card">
            <div className="setup-label">Order</div>
            <div className="difficulty-pills">
              <button
                className={`pill ${mode === 'random' ? 'active' : ''}`}
                onClick={() => setMode('random')}
              >
                Random
              </button>
              <button
                className={`pill ${mode === 'sequential' ? 'active' : ''}`}
                onClick={() => setMode('sequential')}
              >
                Sequential
              </button>
            </div>
          </div>

          {/* Question count */}
          <div className="card">
            <div className="setup-label">
              Questions
              <span style={{ color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none', fontSize: '12px', marginLeft: '8px' }}>
                ({maxCount} available)
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              {[10, 25, 50, 100].map(n => (
                <button
                  key={n}
                  className={`pill ${count === n ? 'active' : ''}`}
                  onClick={() => setCount(n)}
                  disabled={n > maxCount}
                  style={{ opacity: n > maxCount ? 0.4 : 1 }}
                >
                  {n}
                </button>
              ))}
              <button
                className={`pill ${count === maxCount && ![10,25,50,100].includes(maxCount) ? 'active' : ''}`}
                onClick={() => setCount(maxCount)}
              >
                All ({maxCount})
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="setup-actions">
        <button
          className="btn btn-primary btn-lg"
          onClick={handleStart}
          disabled={maxCount === 0}
        >
          {maxCount === 0 ? 'No questions match filters' : `Start ${Math.min(count, maxCount)} Questions`}
        </button>
        {hasResults && quizResults?.wrongAnswers?.length > 0 && (
          <button className="btn btn-secondary" onClick={handleRetryWrong}>
            Retry Wrong Answers ({quizResults.wrongAnswers.length})
          </button>
        )}
      </div>

      {maxCount === 0 && selectedTopics.length > 0 && (
        <div style={{ marginTop: '12px', fontSize: '13px', color: 'var(--text-muted)' }}>
          No questions match the current topic and difficulty combination. Try changing the difficulty filter.
        </div>
      )}
    </main>
  )
}
