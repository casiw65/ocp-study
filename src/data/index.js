// Import all question bank files
// NOTE: If running for the first time, download the JSON files from Google Drive
// Question Bank folder ID: 1qtJxae1OiOOwZq3NYX1nLLJHnLrY5LLM
// Place all 14 JSON files in this src/data/ directory before running npm install

import fc1 from './financial_calc_questions_1.json'
import fc2 from './financial_calc_questions_2.json'
import fc3 from './financial_calc_questions_3.json'
import fc4 from './financial_calc_questions_4.json'
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

// Handle both array format and {metadata, questions} object format
function extractQuestions(data) {
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.questions)) return data.questions
  return []
}

export const allQuestions = [
  ...extractQuestions(fc1),
  ...extractQuestions(fc2),
  ...extractQuestions(fc3),
  ...extractQuestions(fc4),
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
]

// Unique topics with display names and colors
export const TOPICS = [
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
]

// Helper to get color for a topic
export function getTopicColor(topicId) {
  const t = TOPICS.find(t => t.id === topicId)
  return t ? t.color : '#3b7fd4'
}
