# Standalone Resume Builder

You have successfully extracted the Resume Builder from the Gaplytiq2.0 platform. 

## 🏗️ Folder Structure
- `/frontend`: Next.js application core.
- `/backend`: Node.js/Express API services for AI parsing and PDF generation.

## 🚀 Setup Instructions

### 1. Database (Supabase)
Create a new Supabase project and run the SQL for the following tables (refer to the full extraction report for exact columns):
- `profiles`
- `resumes`
- `builder_resumes`
- `resume_versions`
- `resume_styles`
- `ai_jobs`

Don't forget to create a storage bucket named `resumes`.

### 2. Environment Variables (.env)
Create a `.env.local` in `frontend` and a `.env` in `backend`.

**Frontend:**
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Backend:**
```env
SUPABASE_URL=your_url
SUPABASE_SERVICE_ROLE_KEY=your_service_key
OPENAI_API_KEY=your_openai_key
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Install Dependencies
Run `npm install` in both `frontend` and `backend` directories.

### 4. Run the Apps
- Frontend: `npm run dev` (starts on localhost:3000)
- Backend: `npm run dev` (starts on localhost:3001)

## ⚠️ Notes
- The `PlacementDriveGuard` component was copied to avoid broken imports, but it is not active. You can safely remove it and its imports from `FormPanel.jsx` if you wish to streamline the code further.
- All AI features will now use your own OpenAI API key.
