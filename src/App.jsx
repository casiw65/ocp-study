import { useState, useEffect } from 'react'
import Home from './components/Home.jsx'
import QuizSetup from './components/QuizSetup.jsx'
import Quiz from './components/Quiz.jsx'
import Results from './components/Results.jsx'
import { loadProgress, saveProgress } from './utils/progress.js'
import { allQuestions, TOPICS } from './data/index.js'

export default function App() {
  const [view, setView] = useState('home') // home | setup | quiz | results | review
  const [progress, setProgress] = useState(loadProgress)
  const [quizConfig, setQuizConfig] = useState(null)
  const [quizQuestions, setQuizQuestions] = useState([])
  const [quizResults, setQuizResults] = useState(null)

  useEffect(() => { saveProgress(progress) }, [progress])

  function startQuiz(config) {
    let pool = allQuestions
    if (config.topics.length > 0) {
      pool = pool.filter(q => config.topics.includes(q.topic))
    }
    if (config.difficulty !== 'all') {
      pool = pool.filter(q => q.difficulty === config.difficulty)
    }
    if (config.wrongOnly && quizResults) {
      const wrongIds = new Set(quizResults.wrongAnswers.map(w => w.id))
      pool = pool.filter(q => wrongIds.has(q.id))
    }
    // Shuffle
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, Math.min(config.count, shuffled.length))
    setQuizQuestions(selected)
    setQuizConfig(config)
    setQuizResults(null)
    setView('quiz')
  }

  function finishQuiz(results) {
    setQuizResults(results)
    // Update progress
    setProgress(prev => {
      const next = { ...prev }
      results.byTopic.forEach(({ topic, correct, total }) => {
        if (!next.topics[topic]) next.topics[topic] = { answered: 0, correct: 0, bestPct: 0 }
        next.topics[topic].answered += total
        next.topics[topic].correct += correct
        const pct = Math.round((correct / total) * 100)
        if (pct > (next.topics[topic].bestPct || 0)) next.topics[topic].bestPct = pct
      })
      next.totalAnswered = (next.totalAnswered || 0) + results.total
      next.totalCorrect = (next.totalCorrect || 0) + results.correct
      next.sessions = (next.sessions || 0) + 1
      return next
    })
    setView('results')
  }

  function resetProgress() {
    if (window.confirm('Reset all progress? This cannot be undone.')) {
      const fresh = { topics: {}, totalAnswered: 0, totalCorrect: 0, sessions: 0 }
      setProgress(fresh)
      saveProgress(fresh)
    }
  }

  return (
    <div className="app-shell">
      <header className="top-bar">
        <span className="top-bar-logo">OCP Exam Prep</span>
        <span className="top-bar-badge">518 Questions</span>
        <div className="top-bar-spacer" />
        <nav className="top-bar-nav">
          <button className={`nav-btn ${view === 'home' ? 'active' : ''}`} onClick={() => setView('home')}>Dashboard</button>
          <button className={`nav-btn ${view === 'setup' ? 'active' : ''}`} onClick={() => setView('setup')}>New Quiz</button>
          {quizResults && (
            <button className={`nav-btn ${view === 'results' ? 'active' : ''}`} onClick={() => setView('results')}>Results</button>
          )}
        </nav>
      </header>

      {view === 'home' && (
        <Home
          progress={progress}
          topics={TOPICS}
          allQuestions={allQuestions}
          onStartQuiz={(topicFilter) => {
            setView('setup')
          }}
          onResetProgress={resetProgress}
          onGoSetup={() => setView('setup')}
        />
      )}

      {view === 'setup' && (
        <QuizSetup
          topics={TOPICS}
          allQuestions={allQuestions}
          onStart={startQuiz}
          onBack={() => setView('home')}
          hasResults={!!quizResults}
          quizResults={quizResults}
        />
      )}

      {view === 'quiz' && (
        <Quiz
          questions={quizQuestions}
          config={quizConfig}
          onFinish={finishQuiz}
          onQuit={() => setView('home')}
        />
      )}

      {view === 'results' && quizResults && (
        <Results
          results={quizResults}
          onRetry={() => startQuiz(quizConfig)}
          onReviewWrong={() => startQuiz({ ...quizConfig, wrongOnly: true, count: quizResults.wrongAnswers.length })}
          onNewQuiz={() => setView('setup')}
          onHome={() => setView('home')}
          quizConfig={quizConfig}
        />
      )}
    </div>
  )
}
