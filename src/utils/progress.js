const KEY = 'ocp_exam_progress'

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultProgress()
    return { ...defaultProgress(), ...JSON.parse(raw) }
  } catch {
    return defaultProgress()
  }
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(progress))
  } catch {
    // storage full or unavailable — fail silently
  }
}

function defaultProgress() {
  return { topics: {}, totalAnswered: 0, totalCorrect: 0, sessions: 0 }
}
