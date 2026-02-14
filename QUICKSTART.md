# 🌸 Our Little Garden - Quick Start Guide

## What You Got

A complete mood tracking app with:
- ✅ **Fixed mood tracking** - Kyaw and Pan have separate streaks now!
- ✅ **Blue/Pink visual circles** - TV Girl aesthetic on calendar
- ✅ **Reversed journal text** - Type normally, appears backwards (fun!)
- ✅ **Groq AI integration** - Get insights on your entries
- ✅ **Beautiful dark theme** - Blue for Kyaw, Pink for Pan

## 📦 What's in the ZIP

```
to-pan-complete/
├── src/
│   ├── App.jsx           ← Main app (all features here)
│   ├── main.jsx          ← Entry point
│   └── index.css         ← TV Girl styles
├── api/
│   └── groq.js           ← AI insights handler
├── public/
│   └── pansy.svg         ← Your app icon
├── README.md             ← Full documentation
├── DEPLOYMENT.md         ← Deployment guide
└── package.json          ← Dependencies
```

## 🚀 Get Started in 3 Steps

### Step 1: Extract & Install
```bash
# Extract the zip
unzip to-pan-complete.zip
cd to-pan-complete

# Install dependencies
npm install
```

### Step 2: Get Groq API Key (Free!)
1. Go to https://console.groq.com
2. Sign up (free)
3. Get API key from "API Keys" section
4. Copy `.env.example` to `.env`
5. Paste your key in `.env`

### Step 3: Run It!
```bash
npm run dev
```
Open http://localhost:3000

## 🌐 Deploy to Vercel

### Easy Way (GitHub):
1. Push to GitHub
2. Go to vercel.com
3. Import your repo
4. Add `GROQ_API_KEY` in settings
5. Done!

### Quick Way (CLI):
```bash
npm install -g vercel
vercel login
vercel
# Add GROQ_API_KEY when prompted
```

## 🎨 Key Features

### 1. Mood Calendar
- Click any date
- Choose emoji
- **Blue circle** appears for Kyaw
- **Pink circle** appears for Pan
- Both can log same day without interfering!

### 2. Journal with Reversed Text
- Type: "I love you"
- Shows: "uoy evol I"
- AI gives warm insights
- Color coded by user

### 3. Separate Streaks
- Kyaw's streak in **blue**
- Pan's streak in **pink**
- No more resets!

### 4. Dashboard
- Recent activities
- Achievements
- Stats for both users

## 🐛 Troubleshooting

**Moods resetting?**
- Not anymore! Now tracked separately ✅

**Styles not loading?**
```bash
npm install
npm run dev
```

**AI not working?**
- Check `.env` has correct `GROQ_API_KEY`
- Verify key at console.groq.com

**Text not reversing?**
- This is normal! Type in journal and submit to see reversed text

## 📱 How to Use

1. **Switch Users**: Click "Kyaw" or "Pan" button at top
2. **Log Mood**: Go to Calendar tab, pick emoji
3. **Write Journal**: Go to Journal tab, type entry
4. **See Stats**: Dashboard shows everything

## 🎯 What's Fixed

### Before ❌
- Pan logs mood → Kyaw's streak resets to 0
- No way to tell who logged what day
- Plain text journal

### After ✅
- Separate tracking for both users
- Blue/Pink circles show who logged
- Fun reversed text feature
- AI insights

## 💡 Tips

1. **Daily Routine**: Log moods every day for streaks
2. **Journal Together**: Take turns writing entries
3. **Check Dashboard**: See your progress
4. **Unlock Achievements**: 7-day streaks, 10 entries, etc.

## 📚 Files You Might Edit

- `src/App.jsx` - Main app logic
- `src/index.css` - Colors and styles
- `api/groq.js` - AI prompt customization

## 🎨 Color Palette

```
Kyaw:    Blue #60a5fa
Pan:     Pink #f472b6
Accent:  Purple #a855f7
Background: Dark #020617
```

## ⚡ Quick Commands

```bash
npm run dev      # Run locally
npm run build    # Build for production
vercel           # Deploy to Vercel
```

## 🤝 Need Help?

1. Check `README.md` for full docs
2. Check `DEPLOYMENT.md` for deploy help
3. Check browser console for errors

## 🎉 You're All Set!

Start logging moods and see your streaks grow! 

**Remember**: 
- Kyaw = Blue 💙
- Pan = Pink 💖
- Together = Purple 💜

---

Made with love for Valentine's Day 2026 🌸

*"Every mood is a flower in our little garden"*
