# TDC Matchmaker Dashboard - Internal CRM Portal

A premium, psychology-driven internal CRM portal designed for the matchmakers at **The Date Crew (TDC)**. This system helps matchmakers manage customer profiles, review weighted AI-assisted compatibility calculations, write call logs, schedule sessions, and preview/send personalized introductions to potential matches.

---

## 🛠️ Technology Stack

* **Frontend**: React 19, Vite, Lucide React (for premium iconography), Vanilla CSS (premium dark-purple and coral accents).
* **Backend**: Node.js, Express.js (REST API endpoints).
* **Database**: Mock JSON database (`db.json`) with persistent reads/writes.
* **AI Engine**: OpenAI API (`gpt-4o-mini`) for custom match summaries and introduction drafts, backed by a robust local rules-based fallback generator.

---

## 🧬 Matching Compatibility Rules

The portal calculates a compatibility score out of **100%** based on weighted, psychology-focused criteria:

| Category | Weight | Evaluation Criteria |
| :--- | :---: | :--- |
| **Life Goals** | **30%** | Children plans alignment, marriage timeline proximity, and family values (Traditional/Moderate/Modern) matching. |
| **Lifestyle** | **20%** | Social schedule (Active/Balanced/Quiet), fitness consistency, drinking habits, and pet preferences. |
| **Location** | **15%** | Current city proximity, state overlap, and willingness to relocate. |
| **Personality & Values** | **15%** | Introvert/Extrovert alignment and focal orientation (Career-Oriented/Family-Oriented/Balanced). |
| **Career & Education** | **10%** | Academic levels, income comparisons, and designation alignment. |
| **Shared Interests** | **10%** | Overlap of common hobbies (e.g., photography, traveling, reading) calculated via Jaccard intersection logic. |

### ⚠️ Deal Breaker Detection
Severe lifestyle mismatches are flagged in orange warnings within the drawer:
1. **Children Conflict**: One partner wants children, while the other does not.
2. **Relocation Deadlock**: Profiles reside in different cities and both have relocation status set to `"Not Open to Relocate"`.
3. **Smoking habits Mismatch**: One profile is a smoker and the other does not tolerate smoking.

---

## 🚀 Core Features

* **Interactive CRM Counters**: Total customers, active journeys, matches sent, and meetings scheduled.
* **Customers Directory Table**: Sort and filter clients by name, city, marital status, or journey stage. Click a row to load full matching profiles.
* **Journey Phase Timeline**: Change and set matchmaking phases (e.g. *Profile Verification*, *In Matching*, *Shortlisted*, *Match Sent*, *Meeting Scheduled*).
* **Call Logs & Meeting observations**: Matchmakers can add call logs directly from the profile drawer (persisted in `db.json`).
* **Suggested Matches**: Shows the top 3 compatible opposite-gender profiles with instant match percentage meters.
* **AI Compatibility Slider**: Explores compatibility factors, potential concerns, and a psychology-based compatibility summary.
* **Send Match Workflow**: Preview, edit, and send the AI-generated personal introduction email. Confirming automatically pushes the customer to the next journey phase.
* **Performance Funnel Reports**: SVG-powered analytical funnel showing customer distribution by stage.
* **Portal Settings**: Edit matchmaker profiles, toggle notification rules, and change login settings.

---

## ⚙️ Local Development Setup

### 1. Prerequisite Installations
Make sure you have [Node.js](https://nodejs.org/) installed.

### 2. Install Dependencies
Clone the repository, open a terminal in the folder, and run:
```bash
npm install
```

### 3. Environment Secret Variables
To enable live OpenAI generation, create a `.env` file in the root folder and add your key:
```env
PORT=5000
OPENAI_API_KEY=your_actual_openai_api_key_here
```
*(If no `.env` file or API key is provided, the backend automatically falls back to the local text generator).*

### 4. Run Development Servers
Start both the React web application and Express API server concurrently:
```bash
npm run dev
```

* **Vite Web UI**: [http://localhost:5173/](http://localhost:5173/)
* **Express API backend**: [http://localhost:5000/api](http://localhost:5000)
