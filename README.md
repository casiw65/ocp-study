# OCP Exam Prep App

A self-contained exam prep app for the OneStream OCP certification exam.  
Original bank plus a separate Retake Prep section (8 exam sections), with explanations, progress tracking, and wrong-answer drills.

---

## Setup (one-time)

### Step 1 — Download question bank files from Google Drive

Open your Google Drive Question Bank folder (ID: `1qtJxae1OiOOwZq3NYX1nLLJHnLrY5LLM`)  
and download all 19 JSON files into the `src/data/` folder of this project:

| File | Questions |
|---|---|
| financial_calc_questions_1.json | FC_001–FC_050 |
| financial_calc_questions_2.json | FC_051–FC_100 |
| bbr_questions_1.json | BBR_001–BBR_050 |
| bbr_questions_2.json | BBR_051–BBR_100 |
| security_questions_1.json | SEC_001–SEC_018 |
| dashboard_questions_1.json | DASH_001–DASH_050 |
| dashboard_questions_2.json | DASH_051–DASH_100 |
| os_slides_questions_1.json | OSD_001–OSD_050 |
| os_slides_questions_2.json | OSD_051–OSD_075 |
| os_admin_questions_1.json | OA_001–OA_025 |
| os_admin_questions_2.json | OA_026–OA_050 |
| os_admin_questions_3.json | OA_051–OA_075 |
| impl_questions_1.json | IOA_001–IOA_025 |
| impl_questions_2.json | IOA_026–IOA_050 |
| retake_wf_tools_admin_questions_1.json | RT_W01–RT_A08 (Retake Prep section) |
| retake_other_sections_questions_1.json | RO_C01–RO_R14 (Retake Prep section) |
| retake_guide_gaps_questions_1.json | RG_W01–RG_BB08 (Retake Prep section) |
| retake_handbook_questions_1.json | FH_ questions from the Foundation Handbook (Retake Prep section) |
| retake_wf_tools_admin_questions_2.json | 684 deep-dive questions for Workflow, Tools, Administration (own "Deep Dive" section) |

All 19 files go in `src/data/` alongside `index.js`.

### Step 2 — Install and run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

### Step 3 — Deploy to Vercel (one-time)

1. Push this folder to a new GitHub repo
2. Go to vercel.com → New Project → Import your repo
3. Vercel auto-detects Vite — just click Deploy
4. You get a permanent URL you can bookmark on any device

---

## Features

- **Quiz by topic** — focus on weak areas
- **Difficulty filter** — easy / medium / hard
- **Random or sequential** order
- **Instant explanations** — why each answer is right and wrong
- **Wrong answer drill** — retry only what you missed
- **Progress tracking** — saves automatically in your browser
- **No login required** — fully self-contained

---

## Tech stack

- Vite + React 18
- Pure CSS (no framework)
- localStorage for progress persistence
- No backend, no auth, no external APIs
