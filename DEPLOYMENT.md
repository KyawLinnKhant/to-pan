# 🚀 Deployment Guide

## Option 1: Deploy to Vercel (Recommended)

### Method A: Using Vercel CLI

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
cd to-pan-complete
vercel
```

4. **Add Environment Variables**
```bash
vercel env add GROQ_API_KEY
# Paste your Groq API key when prompted
```

5. **Redeploy with Environment Variable**
```bash
vercel --prod
```

### Method B: Using GitHub + Vercel Integration (Easier)

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit - Our Little Garden"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/to-pan.git
git push -u origin main
```

2. **Connect to Vercel**
- Go to [vercel.com](https://vercel.com)
- Click "Add New" → "Project"
- Import your GitHub repository
- Vercel will auto-detect Vite settings

3. **Add Environment Variable**
- Go to Project Settings → Environment Variables
- Add: `GROQ_API_KEY` = `your_groq_api_key`
- Click "Save"

4. **Redeploy**
- Go to Deployments tab
- Click "Redeploy" on latest deployment

---

## Option 2: Deploy to Netlify

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Build the project**
```bash
npm run build
```

3. **Deploy**
```bash
netlify deploy
# Follow prompts, set dist as publish directory
netlify deploy --prod
```

4. **Add Environment Variables**
- Go to Netlify dashboard
- Site settings → Environment variables
- Add `GROQ_API_KEY`

---

## Getting Your Groq API Key

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up (it's free!)
3. Navigate to "API Keys"
4. Create new key
5. Copy the key (you won't see it again!)

**Free tier includes:**
- 14,400 requests per day
- Perfect for personal use

---

## Testing Locally

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# Run development server
npm run dev

# Open http://localhost:3000
```

---

## Vercel Environment Variables Setup

### Via Dashboard:
1. Go to your project in Vercel
2. Settings → Environment Variables
3. Add variable:
   - **Name**: `GROQ_API_KEY`
   - **Value**: Your Groq API key
   - **Environments**: Production, Preview, Development (select all)
4. Save

### Via CLI:
```bash
vercel env add GROQ_API_KEY production
# Paste your API key when prompted

vercel env add GROQ_API_KEY preview
vercel env add GROQ_API_KEY development
```

---

## Troubleshooting

### Issue: AI Insights not working
**Solution**: 
- Check if GROQ_API_KEY is set correctly
- Verify API key is valid at console.groq.com
- Check Vercel function logs

### Issue: Styles not loading
**Solution**:
```bash
npm install
npm run build
```

### Issue: Calendar dates not showing correctly
**Solution**: Clear localStorage
```javascript
// In browser console:
localStorage.clear()
location.reload()
```

### Issue: Reversed text not working
**Solution**: This is client-side only, check if JavaScript is enabled

---

## Custom Domain Setup (Optional)

### On Vercel:
1. Go to Project Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate (automatic)

### DNS Settings Example:
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## Updating the App

```bash
# Make changes to code
git add .
git commit -m "Update: description of changes"
git push

# If using Vercel GitHub integration, it will auto-deploy
# If using Vercel CLI:
vercel --prod
```

---

## Performance Tips

1. **Optimize Images**: Compress any images you add
2. **Code Splitting**: Already handled by Vite
3. **Lazy Loading**: Consider for future features
4. **Cache**: Vercel automatically handles caching

---

## Security Notes

1. **Never commit** `.env` file to git
2. **Rotate API keys** periodically
3. **Use environment variables** for all secrets
4. **Enable CORS** only for your domain (in production)

---

## Monitoring

### Check Deployment Status:
- Vercel: Dashboard → Deployments
- Netlify: Dashboard → Deploys

### View Logs:
```bash
# Vercel
vercel logs

# Or in dashboard: Deployments → Click deployment → Logs
```

---

## Backup Your Data

Since the app uses localStorage, data is saved per device. To backup:

```javascript
// In browser console:
const backup = {
  moodData: localStorage.getItem('moodData'),
  activities: localStorage.getItem('activities'),
  journalEntries: localStorage.getItem('journalEntries')
};
console.log(JSON.stringify(backup));
// Copy the output
```

To restore:
```javascript
// Paste your backup data
const backup = {"moodData": "...", ...};
localStorage.setItem('moodData', backup.moodData);
localStorage.setItem('activities', backup.activities);
localStorage.setItem('journalEntries', backup.journalEntries);
location.reload();
```

---

## Next Steps

After successful deployment:
1. ✅ Test all features (mood logging, journal, calendar)
2. ✅ Try AI insights
3. ✅ Share the link with Pan 💖
4. ✅ Start tracking moods together!

---

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- Groq Docs: https://console.groq.com/docs
- React Docs: https://react.dev

**Happy Deploying! 🚀💜**
