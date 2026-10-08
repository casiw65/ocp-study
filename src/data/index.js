// Import all question bank files
// NOTE: If running for the first time, download the JSON files from Google Drive
// Question Bank folder ID: 1qtJxae1OiOOwZq3NYX1nLLJHnLrY5LLM
// Place all 17 JSON files in this src/data/ directory before running npm install

import fc1 from './financial_calc_questions_1.json'
import fc2 from './financial_calc_questions_2.json'
import bbr1 from './bbr_questions_1.json'
import bbr2 from './bbr_questions_2.json'
import sec1 from './security_questions_1.json'
import dash1 from './dashboard_questions_1.json'
import dash2 from './dashboard_questions_2.json'
import osd1 from './os_slides_questions_1.json'
import osd2 from './os_slides_questions_2.json'
import oa1 from './os_admin_questions_1.json'
import oa2 from './os_admin_questions_2.json'
import oa3 from './os_admin_questions_3.json'
import impl1 from './impl_questions_1.json'
import impl2 from './impl_questions_2.json'

// Retake prep files (kept in their own section)
import rt1 from './retake_wf_tools_admin_questions_1.json'
import rt2 from './retake_other_sections_questions_1.json'
import rt3 from './retake_guide_gaps_questions_1.json'
import rt4 from './retake_handbook_questions_1.json'
import rt5 from './retake_wf_tools_admin_questions_2.json'

// Handle both array format and {metadata, questions} object format
function extractQuestions(data) {
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.questions)) return data.questions
  return []
}

// Retake questions get a "Retake: " topic prefix so they never mix with the
// original bank (both banks have a "Security" topic, for example).
const RETAKE_PREFIX = 'Retake: '
function asRetake(data) {
  return extractQuestions(data).map(q => ({ ...q, topic: RETAKE_PREFIX + q.topic }))
}
export const retakeQuestions = [...asRetake(rt1), ...asRetake(rt2), ...asRetake(rt3), ...asRetake(rt4)]

// Deep-dive file gets its own group so it can be studied separately
const DEEP_PREFIX = 'Deep Dive: '
export const deepQuestions = extractQuestions(rt5).map(q => ({ ...q, topic: DEEP_PREFIX + q.topic }))

export const allQuestions = [
  ...extractQuestions(fc1),
  ...extractQuestions(fc2),
  ...extractQuestions(bbr1),
  ...extractQuestions(bbr2),
  ...extractQuestions(sec1),
  ...extractQuestions(dash1),
  ...extractQuestions(dash2),
  ...extractQuestions(osd1),
  ...extractQuestions(osd2),
  ...extractQuestions(oa1),
  ...extractQuestions(oa2),
  ...extractQuestions(oa3),
  ...extractQuestions(impl1),
  ...extractQuestions(impl2),
  ...retakeQuestions,
  ...deepQuestions,
]

// Unique topics with display names and colors
const CORE_TOPICS = [
  {
    id: 'Financial Calculations',
    label: 'Financial Calculations',
    color: '#3b7fd4',
    count: allQuestions.filter(q => q.topic === 'Financial Calculations').length,
  },
  {
    id: 'Building Basic Reports',
    label: 'Building Basic Reports',
    color: '#8b5cf6',
    count: allQuestions.filter(q => q.topic === 'Building Basic Reports').length,
  },
  {
    id: 'Security',
    label: 'Security',
    color: '#ef4444',
    count: allQuestions.filter(q => q.topic === 'Security').length,
  },
  {
    id: 'Building Dashboards',
    label: 'Dashboards',
    color: '#f59e0b',
    count: allQuestions.filter(q => q.topic === 'Building Dashboards').length,
  },
  {
    id: 'OS Slides — Design & Architecture',
    label: 'OS Slides — Design & Architecture',
    color: '#10b981',
    count: allQuestions.filter(q =>
      q.topic === 'OS Slides — Design & Architecture' ||
      q.topic === 'OS_Slides - Design & Architecture' ||
      q.topic?.startsWith('OS Slides') ||
      q.topic === 'Data Volume and Storage Methods' ||
      q.topic === 'App Performance' ||
      q.topic === 'Security'
    ).length,
  },
  {
    id: 'OS Administration',
    label: 'OS Administration',
    color: '#06b6d4',
    count: allQuestions.filter(q => q.topic === 'OS Administration').length,
  },
  {
    id: 'Implementing OS Assessments',
    label: 'Implementing OS Assessments',
    color: '#ec4899',
    count: allQuestions.filter(q => q.topic === 'Implementing OS Assessments').length,
  },
].map(t => ({ ...t, group: 'core' }))

// Retake Prep section — one card per OS-201 exam section
const RETAKE_SECTIONS = [
  ['Workflow', '#2563eb'],
  ['Tools', '#7c3aed'],
  ['Administration', '#0891b2'],
  ['Cube', '#059669'],
  ['Data Collection', '#d97706'],
  ['Presentation', '#db2777'],
  ['Security', '#dc2626'],
  ['Rules', '#4b5563'],
]
const RETAKE_TOPICS = RETAKE_SECTIONS.map(([name, color]) => ({
  id: RETAKE_PREFIX + name,
  label: name,
  color,
  group: 'retake',
  count: retakeQuestions.filter(q => q.topic === RETAKE_PREFIX + name).length,
}))

const DEEP_TOPICS = [
  ['Workflow', '#1d4ed8'],
  ['Tools', '#6d28d9'],
  ['Administration', '#0e7490'],
].map(([name, color]) => ({
  id: DEEP_PREFIX + name,
  label: name,
  color,
  group: 'deep',
  count: deepQuestions.filter(q => q.topic === DEEP_PREFIX + name).length,
}))

export const TOPICS = [...CORE_TOPICS, ...RETAKE_TOPICS, ...DEEP_TOPICS]

export const TOPIC_GROUPS = [
  { id: 'core', label: 'Original Question Bank' },
  { id: 'retake', label: 'Retake Prep (Guide + Handbook)' },
  { id: 'deep', label: 'Deep Dive: Workflow, Tools, Administration' },
]

// Helper to get color for a topic
export function getTopicColor(topicId) {
  const t = TOPICS.find(t => t.id === topicId)
  return t ? t.color : '#3b7fd4'
}
