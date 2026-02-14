// api/groq.js - Vercel Serverless Function
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, user, type = 'journal' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    let prompt = '';
    
    if (type === 'journal') {
      prompt = `You are analyzing a journal entry from ${user}. The text might be reversed (it's a fun feature). 
      
Journal entry: "${text}"

Provide a brief, warm, and insightful response (2-3 sentences) that:
1. Acknowledges their feelings
2. Offers a gentle perspective or encouragement
3. Maintains the intimate, personal tone of "Our Little Garden"

Keep it short, sweet, and supportive. Use emojis sparingly (1-2 max).`;
    } else if (type === 'mood_analysis') {
      prompt = `Analyze the mood patterns for ${user} based on their recent emoji logs.

Recent moods: ${text}

Provide a brief insight (2-3 sentences) about:
1. Overall emotional patterns
2. One positive observation
3. One gentle suggestion for wellbeing

Keep it warm, non-judgmental, and encouraging.`;
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a warm, empathetic AI companion for a couple's mood tracking app called 'Our Little Garden'. You provide gentle insights, encouragement, and emotional support. Keep responses brief, warm, and personal."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 200,
    });

    const insight = chatCompletion.choices[0]?.message?.content || "Thank you for sharing 💜";

    return res.status(200).json({
      success: true,
      insight,
      user,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Groq API Error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate insight',
      message: error.message 
    });
  }
}
