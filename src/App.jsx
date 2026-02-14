import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Calendar, BookOpen, Award, TrendingUp, Send } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState('Pan');
  const [selectedDate, setSelectedDate] = useState(null);
  const [journalText, setJournalText] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [isKyawUnlocked, setIsKyawUnlocked] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [aiInsight, setAiInsight] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  
  // Separate mood tracking for each user
  const [moodData, setMoodData] = useState(() => {
    const saved = localStorage.getItem('moodData');
    return saved ? JSON.parse(saved) : {
      Kyaw: {},
      Pan: {}
    };
  });

  // Activities
  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('activities');
    return saved ? JSON.parse(saved) : [];
  });

  // Journal entries
  const [journalEntries, setJournalEntries] = useState(() => {
    const saved = localStorage.getItem('journalEntries');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('moodData', JSON.stringify(moodData));
  }, [moodData]);

  useEffect(() => {
    localStorage.setItem('activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
  }, [journalEntries]);

  // Reverse text for journal input
  const handleJournalChange = (e) => {
    const input = e.target.value;
    setJournalText(input);
    // Reverse the text for display
    setDisplayText(input.split('').reverse().join(''));
  };

  // Get streaks for current user
  const getStreak = (user) => {
    const userMoods = moodData[user];
    const dates = Object.keys(userMoods).sort().reverse();
    let streak = 0;
    
    for (let i = 0; i < dates.length; i++) {
      const checkDate = new Date();
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
      
      if (userMoods[dateStr]) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  // Log mood for current user
  const logMood = (emoji) => {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    setMoodData(prev => ({
      ...prev,
      [currentUser]: {
        ...prev[currentUser],
        [dateStr]: emoji
      }
    }));

    setActivities(prev => [
      {
        icon: emoji,
        text: `${currentUser} logged mood: ${getMoodName(emoji)}`,
        time: 'Just now',
        color: currentUser === 'Kyaw' ? 'blue' : 'pink',
        timestamp: Date.now()
      },
      ...prev.slice(0, 9)
    ]);
  };

  const getMoodName = (emoji) => {
    const moods = {
      '😊': 'Happy',
      '😢': 'Sad',
      '😴': 'Tired',
      '😡': 'Angry',
      '🥰': 'Loved',
      '😎': 'Cool',
      '🤗': 'Excited',
      '😌': 'Peaceful'
    };
    return moods[emoji] || 'Good';
  };

  // Submit journal entry with reversed text
  const submitJournal = async () => {
    if (!journalText.trim()) return;

    const entry = {
      author: currentUser,
      text: displayText, // Store reversed text
      originalText: journalText, // Store original for reference
      date: new Date().toLocaleString(),
      timestamp: Date.now()
    };

    setJournalEntries(prev => [entry, ...prev]);
    
    setActivities(prev => [
      {
        icon: '📝',
        text: `${currentUser} wrote a journal entry`,
        time: 'Just now',
        color: currentUser === 'Kyaw' ? 'blue' : 'pink',
        timestamp: Date.now()
      },
      ...prev.slice(0, 9)
    ]);

    // Call Groq API for AI insights
    setIsLoadingAI(true);
    try {
      const response = await fetch('/api/groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: journalText,
          user: currentUser,
          type: 'journal'
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setAiInsight(data.insight || 'Thank you for sharing 💜');
        setShowAIInsights(true);
      }
    } catch (error) {
      console.log('AI insights not available:', error);
      setAiInsight('AI insights are currently unavailable. Your entry has been saved! 💜');
      setShowAIInsights(true);
    } finally {
      setIsLoadingAI(false);
    }

    setJournalText('');
    setDisplayText('');
  };

  // Render calendar
  const renderCalendar = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Empty cells before first day
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />);
    }

    // Days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const kyawMood = moodData.Kyaw[dateStr];
      const panMood = moodData.Pan[dateStr];
      const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      
      // Check if day has past moods
      const hasPastKyawMood = kyawMood && !isToday;
      const hasPastPanMood = panMood && !isToday;

      // Determine background color based on past moods
      let bgClass = '';
      if (hasPastKyawMood && hasPastPanMood) {
        bgClass = 'bg-gradient-to-br from-blue-500/10 to-pink-500/10';
      } else if (hasPastKyawMood) {
        bgClass = 'bg-blue-500/10';
      } else if (hasPastPanMood) {
        bgClass = 'bg-pink-500/10';
      }

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(dateStr)}
          className={`aspect-square p-1 rounded-lg cursor-pointer transition-all relative ${
            isToday ? 'bg-purple-500/20 ring-2 ring-purple-500' : bgClass || 'hover:bg-slate-800/50'
          } ${selectedDate === dateStr ? 'ring-2 ring-pink-500' : ''}`}
        >
          <div className="text-xs text-center mb-1">{day}</div>
          <div className="flex justify-center items-center gap-0.5">
            {kyawMood && (
              <div className="relative flex items-center justify-center w-5 h-5">
                <div className="absolute inset-0 border-2 border-blue-500 rounded-full"></div>
                <div className="text-[10px] z-10">{kyawMood}</div>
              </div>
            )}
            {panMood && (
              <div className="relative flex items-center justify-center w-5 h-5">
                <div className="absolute inset-0 border-2 border-pink-500 rounded-full"></div>
                <div className="text-[10px] z-10">{panMood}</div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="text-center text-xl font-bold mb-4">
          {today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs font-semibold text-slate-400">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">{days}</div>
        
        {/* Legend */}
        <div className="flex justify-center gap-6 mt-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-blue-500 bg-blue-500/20"></div>
            <span className="text-slate-400">Kyaw</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-pink-500 bg-pink-500/20"></div>
            <span className="text-slate-400">Pan</span>
          </div>
        </div>

        {/* Mood Logger */}
        <div className="mt-6 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
          <div className="text-center mb-3 text-sm font-medium">
            Log your mood for today, {currentUser}!
          </div>
          <div className="grid grid-cols-4 gap-2">
            {['😊', '😢', '😴', '😡', '🥰', '😎', '🤗', '😌'].map(emoji => (
              <button
                key={emoji}
                onClick={() => logMood(emoji)}
                className="text-xl p-2 rounded-lg bg-slate-900/50 hover:bg-slate-900/70 hover:scale-110 transition-all"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-4">
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              Mood Journey
            </h1>
            <p className="text-slate-400 mt-2">Track your feelings together.</p>
          </div>
          
          <div className="flex gap-3 items-center flex-wrap">
            <div className="flex gap-2 bg-slate-800/50 backdrop-blur-sm rounded-full p-1 border border-slate-700/50">
              <button 
                onClick={() => {
                  if (currentUser === 'Kyaw') {
                    setCurrentUser('Pan');
                    setIsKyawUnlocked(false);
                    return;
                  }
                  const password = prompt('Enter Kyaw\'s password:');
                  if (password === 'klk') {
                    setCurrentUser('Kyaw');
                    setIsKyawUnlocked(true);
                  } else if (password !== null) {
                    alert('Wrong password!');
                  }
                }}
                className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
                  currentUser === 'Kyaw'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/50'
                    : 'text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                Kyaw {currentUser !== 'Kyaw' && '🔒'}
              </button>
              <button 
                onClick={() => {
                  setCurrentUser('Pan');
                  setIsKyawUnlocked(false);
                }}
                className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
                  currentUser === 'Pan'
                    ? 'bg-gradient-to-r from-pink-500 to-pink-600 shadow-lg shadow-pink-500/50'
                    : 'text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                Pan
              </button>
            </div>
            
            <button 
              onClick={async () => {
                setIsLoadingAI(true);
                try {
                  const recentMoods = Object.entries(moodData[currentUser])
                    .slice(-7)
                    .map(([date, emoji]) => `${date}: ${emoji}`)
                    .join(', ');
                  
                  const response = await fetch('/api/groq', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                      text: recentMoods || 'No moods logged yet',
                      user: currentUser,
                      type: 'mood_analysis'
                    })
                  });
                  
                  if (response.ok) {
                    const data = await response.json();
                    setAiInsight(data.insight || 'Keep tracking your moods! 💜');
                  } else {
                    setAiInsight('AI insights are currently unavailable. Keep logging your moods! 💜');
                  }
                } catch (error) {
                  setAiInsight('AI insights are currently unavailable. Please check your API key in .env file 💜');
                }
                setShowAIInsights(true);
                setIsLoadingAI(false);
              }}
              disabled={isLoadingAI}
              className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2 rounded-full font-medium hover:shadow-lg hover:shadow-pink-500/50 transition-all text-sm disabled:opacity-50"
            >
              <Sparkles size={16} />
              {isLoadingAI ? 'Loading...' : 'AI Insights'}
            </button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: 'dashboard', icon: TrendingUp, label: 'Dashboard', color: 'pink' },
            { id: 'calendar', icon: Calendar, label: 'Calendar', color: 'purple' },
            { id: 'journal', icon: BookOpen, label: 'Journal', color: 'indigo' },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg font-medium transition-all text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-white border border-pink-500/30 shadow-lg'
                    : 'bg-slate-800/30 text-slate-400 hover:bg-slate-800/50 hover:text-white border border-transparent'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === 'dashboard' && (
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-4 md:p-6 border-2 border-blue-500/50 hover:border-blue-500 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="text-2xl">🔥</div>
                <div className="text-xl md:text-2xl font-bold text-blue-400">{getStreak('Kyaw')}</div>
              </div>
              <div className="text-slate-300 font-medium text-sm">Kyaw's Streak</div>
              <div className="text-xs text-slate-500 mt-1">Keep it up!</div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-4 md:p-6 border-2 border-pink-500/50 hover:border-pink-500 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="text-2xl">🔥</div>
                <div className="text-xl md:text-2xl font-bold text-pink-400">{getStreak('Pan')}</div>
              </div>
              <div className="text-slate-300 font-medium text-sm">Pan's Streak</div>
              <div className="text-xs text-slate-500 mt-1">Amazing!</div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <BookOpen size={20} className="text-purple-400" />
                <div className="text-xl md:text-2xl font-bold text-purple-400">{journalEntries.length}</div>
              </div>
              <div className="text-slate-300 font-medium text-sm">Journal Entries</div>
              <div className="text-xs text-slate-500 mt-1">Memories</div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-slate-700/50 hover:border-green-500/50 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <Heart size={20} className="text-green-400" />
                <div className="text-xl md:text-2xl font-bold text-green-400">92</div>
              </div>
              <div className="text-slate-300 font-medium text-sm">Health</div>
              <div className="text-xs text-slate-500 mt-1">Excellent!</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-slate-700/50">
              <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="text-pink-400" size={18} />
                Recent Activity
              </h2>
              <div className="space-y-2">
                {activities.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    No activities yet. Start logging moods! 💖
                  </div>
                ) : (
                  activities.slice(0, 5).map((activity, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/50 hover:bg-slate-900/70 transition-all">
                      <div className="text-xl">{activity.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium text-sm text-${activity.color}-400 truncate`}>{activity.text}</div>
                        <div className="text-xs text-slate-500">{activity.time}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-slate-700/50">
              <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
                <Award className="text-yellow-400" size={18} />
                Achievements
              </h2>
              <div className="space-y-2">
                {[
                  { emoji: '🔥', title: '7-Day Streak', sub: getStreak('Kyaw') >= 7 ? 'Kyaw Unlocked!' : `${7 - getStreak('Kyaw')} days to go`, unlocked: getStreak('Kyaw') >= 7 },
                  { emoji: '💖', title: '7-Day Streak', sub: getStreak('Pan') >= 7 ? 'Pan Unlocked!' : `${7 - getStreak('Pan')} days to go`, unlocked: getStreak('Pan') >= 7 },
                  { emoji: '📝', title: 'Writer', sub: journalEntries.length >= 10 ? 'Unlocked!' : `${10 - journalEntries.length} entries needed`, unlocked: journalEntries.length >= 10 },
                  { emoji: '💕', title: 'Perfect Week', sub: getStreak('Kyaw') >= 7 && getStreak('Pan') >= 7 ? 'Unlocked!' : 'Keep going!', unlocked: getStreak('Kyaw') >= 7 && getStreak('Pan') >= 7 },
                ].map((achievement, i) => (
                  <div key={i} className={`p-3 rounded-lg border transition-all ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30 shadow-sm' 
                      : 'bg-slate-900/30 border-slate-700/30 opacity-50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="text-xl">{achievement.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{achievement.title}</div>
                        <div className="text-xs text-slate-500">{achievement.sub}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-slate-700/50">
            <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2">
              <Calendar className="text-purple-500" />
              Mood Calendar
            </h2>
            {renderCalendar()}
          </div>
        </div>
      )}

      {activeTab === 'journal' && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-slate-700/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                <BookOpen className="text-purple-500" />
                Shared Journal
              </h2>
            </div>

            {/* Journal Input with Reversed Text */}
            <div className="mb-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
              <div className="mb-2 text-sm text-slate-400">
                Writing as <span className={currentUser === 'Kyaw' ? 'text-blue-400' : 'text-pink-400'}>{currentUser}</span>
              </div>
              <textarea
                value={journalText}
                onChange={handleJournalChange}
                placeholder="Type your thoughts... (text will appear reversed)"
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 text-slate-300 placeholder-slate-500 focus:border-purple-500 focus:outline-none resize-none"
                rows={4}
              />
              {displayText && (
                <div className="mt-3 p-3 bg-slate-800/30 rounded-lg border border-purple-500/30">
                  <div className="text-xs text-slate-500 mb-1">Preview (reversed):</div>
                  <div className="text-purple-300">{displayText}</div>
                </div>
              )}
              <button
                onClick={submitJournal}
                disabled={!journalText.trim()}
                className="mt-3 flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-full font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
                Submit Entry
              </button>
            </div>
            
            <div className="space-y-4">
              {journalEntries.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  No journal entries yet. Write your first one! ✨
                </div>
              ) : (
                journalEntries.map((entry, i) => (
                  <div key={i} className={`p-4 md:p-5 rounded-lg border transition-all ${
                    entry.author === 'Kyaw'
                      ? 'bg-blue-500/5 border-blue-500/30'
                      : 'bg-pink-500/5 border-pink-500/30'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className={`font-medium ${entry.author === 'Kyaw' ? 'text-blue-400' : 'text-pink-400'}`}>
                        {entry.author}
                      </div>
                      <div className="text-xs text-slate-500">{entry.date}</div>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed font-mono">{entry.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Insights Modal */}
      {showAIInsights && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowAIInsights(false)}>
          <div className="bg-slate-800 rounded-2xl border border-slate-700 max-w-lg w-full p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="text-purple-400" size={24} />
                AI Insights
              </h3>
              <button 
                onClick={() => setShowAIInsights(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/30">
              <p className="text-slate-200 leading-relaxed">{aiInsight}</p>
            </div>
            <button
              onClick={() => setShowAIInsights(false)}
              className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-full font-medium hover:shadow-lg transition-all"
            >
              Got it! 💜
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
