import type {
  AiInsight,
  Benchmark,
  JobRecommendation,
  SkillGapResult,
} from '@/types/seeker.types'

/**
 * Demo fallback for the Data Analyst track. Shown when the career-data service
 * (microservices) is unreachable so the dashboard still looks complete. Tuned to
 * a python/excel/figma profile so the numbers read believably.
 */

export const MOCK_EMPLOYABILITY = 72

export const MOCK_BENCHMARK: Benchmark = {
  role: 'Data Analyst',
  bars: [
    { skill: 'Python', marketDemand: 0.88, yourScore: 0.72 },
    { skill: 'SQL', marketDemand: 0.92, yourScore: 0.45 },
    { skill: 'Data Analytics', marketDemand: 0.88, yourScore: 0.6 },
    { skill: 'Excel', marketDemand: 0.7, yourScore: 0.9 },
    { skill: 'Tableau', marketDemand: 0.65, yourScore: 0.35 },
    { skill: 'Statistics', marketDemand: 0.72, yourScore: 0.5 },
  ],
  potentialSkill: { skill: 'Excel', score: 0.9 },
  developmentArea: { skill: 'Tableau', score: 0.35 },
}

export const MOCK_SKILL_GAPS: SkillGapResult = {
  role: 'Data Analyst',
  totalGapHours: 1000,
  gaps: [
    {
      skill: 'SQL',
      priority: 'high',
      currentHours: 360,
      targetHours: 800,
      gapHours: 440,
      course: {
        title: 'SQL for Data Analysis',
        provider: 'Udacity',
        url: 'https://learn.example/sql-for-data-analysis',
        cost: 'free',
      },
    },
    {
      skill: 'Statistics',
      priority: 'medium',
      currentHours: 300,
      targetHours: 600,
      gapHours: 300,
      course: {
        title: 'Statistics with Python',
        provider: 'Coursera',
        url: 'https://learn.example/statistics-with-python',
        cost: 'paid',
      },
    },
    {
      skill: 'Tableau',
      priority: 'medium',
      currentHours: 140,
      targetHours: 400,
      gapHours: 260,
      course: {
        title: 'Tableau A-Z',
        provider: 'Udemy',
        url: 'https://learn.example/tableau-a-z',
        cost: 'paid',
      },
    },
  ],
}

const emptyBreakdown = {
  skill: 0,
  education: 0,
  experience: 0,
  location: 0,
  preference: 0,
  oceanBonus: 0,
  riasecBonus: 0,
}

export const MOCK_JOBS: JobRecommendation[] = [
  {
    jobId: 'mock-1',
    title: 'Junior Data Analyst',
    company: 'Tokopedia',
    totalScore: 0.88,
    status: 'matched',
    autoApplied: true,
    breakdown: emptyBreakdown,
    shap: {},
  },
  {
    jobId: 'mock-2',
    title: 'Data Analyst',
    company: 'Bank Mandiri',
    totalScore: 0.81,
    status: 'matched',
    autoApplied: false,
    breakdown: emptyBreakdown,
    shap: {},
  },
  {
    jobId: 'mock-3',
    title: 'Business Intelligence Analyst',
    company: 'Gojek',
    totalScore: 0.74,
    status: 'rise',
    autoApplied: false,
    breakdown: emptyBreakdown,
    shap: {},
  },
  {
    jobId: 'mock-4',
    title: 'Data Analyst',
    company: 'Bukalapak',
    totalScore: 0.69,
    status: 'rise',
    autoApplied: false,
    breakdown: emptyBreakdown,
    shap: {},
  },
]

export const MOCK_INSIGHT: AiInsight = {
  narrative:
    'Status kamu saat ini "Market Ready" untuk peran Data Analyst dengan Employability Score 72%. ' +
    'Kekuatan utama ada di Excel, Python, dan Data Analytics. Posisi paling cocok adalah Junior Data Analyst ' +
    '(match 88%). Untuk naik level, fokus perkuat SQL (prioritas tinggi, ~440 jam).',
  marketReady: true,
  source: 'mock',
}
