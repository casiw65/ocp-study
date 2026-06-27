import { useState, useEffect } from 'react'
import { getTopicColor } from '../data/index.js'

export default function Quiz({ questions, config, onFinish, onQuit }) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState([]) // array for multi-select support
  const [submitted, setSubmitted] = useState(false)
  const [answers, setAnswers] = useState([]) // {id, selected, correct, question}
  const [startTime] = useState(Date.now())

  const question = questions[index]
  const isMulti = Array.isArray(question?.correct_answer)
  const correctAnswer = question?.correct_answer
  const options = question?.options || {}

  // Reset state when question changes
  useEffect(() => {
    setSelected([])
    setSubmitted(false)
  }, [index])

  function toggleOption(letter) {
    if (submitted) return
    if (isMulti) {
      setSelected(prev =>
        prev.includes(letter) ? prev.filter(l => l !== letter) : [...prev, letter]
      )
    } else {
      setSelected([letter])
    }
  }

  function handleSubmit() {
    if (selected.length === 0) return
    setSubmitted(true)
  }

  function handleNext() {
    // Record answer
    const isCorrect = isMulti
      ? JSON.stringify([...selected].sort()) === JSON.stringify([...correctAnswer].sort())
      : selected[0] === correctAnswer

    const newAnswers = [...answers, {
      id: question.id,
      question: question.question,
      selected,
      correctAnswer,
      correct: isCorrect,
      topic: question.topic,
      options: question.options,
    }]

    if (index + 1 >= questions.length) {
      // Finish quiz
      const correct = newAnswers.filter(a => a.correct).length
      const total = newAnswers.length
      const wrongAnswers = newAnswers.filter(a => !a.correct).map(a => ({
        ...a,
        explanation: questions.find(q => q.id === a.id)?.explanation || '',
      }))

      // Group by topic
      const topicMap = {}
      newAnswers.forEach(a => {
        if (!topicMap[a.topic]) topicMap[a.topic] = { correct: 0, total: 0 }
        topicMap[a.topic].total++
        if (a.correct) topicMap[a.topic].correct++
      })
      const byTopic = Object.entries(topicMap).map(([topic, v]) => ({ topic, ...v }))

      onFinish({ correct, total, wrongAnswers, byTopic, duration: Date.now() - startTime })
    } else {
      setAnswers(newAnswers)
      setIndex(i => i + 1)
    }
  }

  function getOptionClass(letter) {
    if (!submitted) {
      return selected.includes(letter) ? 'option-btn selected' : 'option-btn'
    }
    const isCorrectOption = isMulti ? correctAnswer.includes(letter) : correctAnswer === letter
    const wasSelected = selected.includes(letter)
    if (isCorrectOption) return 'option-btn correct'
    if (wasSelected && !isCorrectOption) return 'option-btn incorrect'
    return 'option-btn'
  }

  // Determine if current answer is correct
  const currentCorrect = submitted && (
    isMulti
      ? JSON.stringify([...selected].sort()) === JSON.stringify([...correctAnswer].sort())
      : selected[0] === correctAnswer
  )

  const progress = (index / questions.length) * 100
  const topicColor = getTopicColor(question?.topic)

  return (
    <main className="page">
      {/* Header */}
      <div className="quiz-header">
        <span className="quiz-progress">{index + 1} / {questions.length}</span>
        <div className="quiz-progress-bar">
          <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <button className="btn btn-ghost btn-sm" onClick={onQuit}>Quit</button>
      </div>

      {/* Question metadata */}
      <div className="question-meta">
        <span className="badge badge-topic" style={{ background: topicColor + '22', color: topicColor, borderColor: topicColor }}>
          {question.topic}
        </span>
        <span className={`badge badge-${question.difficulty}`}>
          {question.difficulty}
        </span>
        {isMulti && <span className="badge badge-multi">Select all that apply</span>}
        <span className="question-id">{question.id}</span>
      </div>

      {/* Question text */}
      <div className="question-text">{question.question}</div>

      {/* Options */}
      <div className="options-list">
        {Object.entries(options).map(([letter, text]) => (
          <button
            key={letter}
            className={getOptionClass(letter)}
            onClick={() => toggleOption(letter)}
            disabled={submitted}
          >
            <span className="option-letter">{letter}</span>
            <span>{text}</span>
          </button>
        ))}
      </div>

      {/* Result + Explanation */}
      {submitted && (
        <>
          <div className={`result-indicator ${currentCorrect ? 'result-correct' : 'result-incorrect'}`}>
            {currentCorrect ? '✓ Correct' : '✗ Incorrect'}
            {!currentCorrect && (
              <span style={{ fontWeight: 400, marginLeft: '8px' }}>
                Correct: {isMulti ? correctAnswer.join(', ') : correctAnswer}
              </span>
            )}
          </div>
          <div className="explanation">
            <div className="explanation-header">Explanation</div>
            <div className="explanation-text">{question.explanation}</div>
          </div>
        </>
      )}

      {/* Navigation */}
      <div className="quiz-nav">
        {!submitted ? (
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={selected.length === 0}
          >
            Submit Answer
          </button>
        ) : (
          <button className="btn btn-primary" onClick={handleNext}>
            {index + 1 >= questions.length ? 'See Results' : 'Next Question →'}
          </button>
        )}
        <div className="quiz-nav-spacer" />
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {answers.filter(a => a.correct).length} correct so far
        </span>
      </div>
    </main>
  )
}
