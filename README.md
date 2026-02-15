# Mood Journey 🌸

**Track your feelings together 💙💖**

## 🎨 Features

### ✨ What's New
- **Default User**: Opens as Pan (no password needed)
- **Password Protected**: Kyaw account locked with password 
- **AI Insights**: Get emotional insights from your moods and journal entries  
- **Reversed Journal**: Type normally, text appears backwards (fun feature!)
- **Separate Tracking**: Independent mood streaks for users.

### 🔒 User Access
- **Pan**: Default user, no password required
- **Kyaw**: Password protected (🔒)
  - Click "Kyaw 🔒" → Enter password → Unlock

### 🗓️ Mood Calendar
- **Visual Indicators**:
  - Blue circle = Kyaw logged mood
  - Pink circle = Pan logged mood
  - Both circles = Both logged moods
- **8 mood emojis** to choose from
- **Streak tracking** for each user independently
- **Purple highlight** for today's date

### 📝 Journal with Reversed Text
- Type normally in the input
- Text appears **reversed** when submitted
- Color-coded by user (Blue for Kyaw, Pink for Pan)
- All entries saved in localStorage
- **AI insights** after each entry via Groq API

### 🤖 AI Insights
- Click "AI Insights" button for mood pattern analysis
- Get insights after journal submissions
- Powered by Groq (llama-3.3-70b-versatile)
- Beautiful modal display

## 🚀 Quick Start

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Set Up Groq API (Required for AI Insights)
1. Get a free API key from [Groq Console](https://console.groq.com/keys)
2. Copy \`.env.example\` to \`.env\`
3. Add your API key:
\`\`\`env
GROQ_API_KEY=your_actual_groq_api_key_here
\`\`\`

### 3. Run Locally
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000)

### 4. Deploy to Vercel
\`\`\`bash
npm install -g vercel
vercel login
vercel
# Add GROQ_API_KEY environment variable in Vercel dashboard
\`\`\`

## 🎯 How to Use

### As Pan (Default):
1. Open the app - you're already logged in as Pan 💖
2. Go to Calendar → Pick a mood emoji
3. Go to Journal → Write your thoughts (text will reverse!)
4. Click "AI Insights" to get emotional analysis

### As Kyaw:
1. Click "Kyaw 🔒" button at top
2. Enter password: \`klk\`
3. Now you can log moods and write as Kyaw 💙
4. Click "Kyaw" again to lock it back

### AI Insights:
- **Button Method**: Click "AI Insights" button (top right)
- **Journal Method**: Submit a journal entry - AI automatically analyzes it

## 🐛 Troubleshooting

### Black Screen
- Make sure all dependencies are installed: \`npm install\`
- Check browser console for errors
- Try clearing localStorage: \`localStorage.clear()\` in console

### AI Insights Not Working
- Check if \`GROQ_API_KEY\` is set correctly in \`.env\`
- Verify API key is valid at console.groq.com
- Free tier limit: 14,400 requests/day

### Password Not Working
- Password is: \`klk\` (all lowercase)
- Try refreshing the page

## 🛠️ Tech Stack

- React 18 + Vite
- Tailwind CSS
- Groq AI (llama-3.3-70b)
- Vercel deployment
- localStorage for data

---

**Made with 💜**
