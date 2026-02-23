/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import { Send, MessageCircle, Heart, Shield, RefreshCw, Info, X, Menu, Wind, Timer, Play, Pause, RotateCcw, Users, Trophy, Star, UserCircle, MessageSquare } from 'lucide-react';
import Markdown from 'react-markdown';
import { Scene } from './components/Scene';
import { CareNetwork } from './components/CareNetwork';
import { RecoveryHub } from './components/RecoveryHub';
import { CommunityForum } from './components/CommunityForum';
import { getGeminiResponse } from './services/geminiService';
import confetti from 'canvas-confetti';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface UserProfile {
  name: string;
  goals: string[];
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello, I'm Serenity. I'm here to support you in your journey of mental well-being and recovery. How are you feeling today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [showBreathing, setShowBreathing] = useState(false);
  const [showCareNetwork, setShowCareNetwork] = useState(false);
  const [showRecoveryHub, setShowRecoveryHub] = useState(false);
  const [showCommunityForum, setShowCommunityForum] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({ name: '', goals: [] });
  
  // Meditation Timer State
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes default
  const [initialTime, setInitialTime] = useState(300);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4a90e2', '#9013fe', '#50e3c2']
      });
      setMessages(prev => [...prev, {
        id: `ai-timer-${Date.now()}-${Math.random()}`,
        text: "Well done. You've completed your meditation session. How do you feel now?",
        sender: 'ai',
        timestamp: new Date()
      }]);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}-${Math.random()}`,
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Convert current messages to Gemini history format
    const history = messages.map(msg => ({
      role: (msg.sender === 'user' ? 'user' : 'model') as "user" | "model",
      parts: [{ text: msg.text }]
    }));

    // Pass profile context to Gemini
    const profileContext = userProfile.name ? `[Context: The user's name is ${userProfile.name}. Their goals are: ${userProfile.goals.join(', ')}.]\n\n` : '';
    const responseText = await getGeminiResponse(`${profileContext}${input}`, history);
    
    const aiMessage: Message = {
      id: `ai-${Date.now()}-${Math.random()}`,
      text: responseText || "I'm here for you. Could you tell me more?",
      sender: 'ai',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsLoading(false);
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans text-white">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} />
          <Scene isLoading={isLoading} />
          <OrbitControls 
            enablePan={false} 
            enableZoom={false} 
            maxPolarAngle={Math.PI / 1.8} 
            minPolarAngle={Math.PI / 2.5}
          />
        </Canvas>
      </div>

      {/* Atmospheric Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-transparent via-black/20 to-black/60 z-10" />

      {/* Header */}
      <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-30">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center backdrop-blur-md">
            <Heart className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-light tracking-widest uppercase">Serenity</h1>
            <p className="text-[10px] text-blue-400/60 uppercase tracking-widest font-bold">AI Recovery Companion</p>
          </div>
        </motion.div>

        <div className="flex gap-4">
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className={`p-3 rounded-full border transition-all backdrop-blur-md ${showProfile ? 'bg-purple-500/20 border-purple-400/50 text-purple-400' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'}`}
            title="User Profile"
          >
            <UserCircle className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setShowCommunityForum(!showCommunityForum)}
            className={`p-3 rounded-full border transition-all backdrop-blur-md ${showCommunityForum ? 'bg-blue-500/20 border-blue-400/50 text-blue-400' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'}`}
            title="Community Forum"
          >
            <MessageSquare className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setShowRecoveryHub(!showRecoveryHub)}
            className={`p-3 rounded-full border transition-all backdrop-blur-md ${showRecoveryHub ? 'bg-amber-500/20 border-amber-400/50 text-amber-400' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'}`}
            title="Recovery Hub"
          >
            <Trophy className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setShowCareNetwork(!showCareNetwork)}
            className={`p-3 rounded-full border transition-all backdrop-blur-md ${showCareNetwork ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-400' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'}`}
            title="Care Network"
          >
            <Users className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setShowBreathing(!showBreathing)}
            className={`p-3 rounded-full border transition-all backdrop-blur-md ${showBreathing ? 'bg-blue-500/20 border-blue-400/50 text-blue-400' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'}`}
            title="Breathing Exercise"
          >
            <Wind className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfile && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md bg-black/60 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-light tracking-widest uppercase">Your Profile</h2>
                <button onClick={() => setShowProfile(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-5 h-5 text-white/40" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-2 block">Your Name</label>
                  <input 
                    type="text" 
                    value={userProfile.name}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="How should Serenity call you?"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-2 block">Your Goals</label>
                  <div className="flex flex-wrap gap-2">
                    {['Sobriety', 'Mindfulness', 'Career', 'Health'].map(goal => (
                      <button
                        key={goal}
                        onClick={() => {
                          setUserProfile(prev => ({
                            ...prev,
                            goals: prev.goals.includes(goal) ? prev.goals.filter(g => g !== goal) : [...prev.goals, goal]
                          }))
                        }}
                        className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${userProfile.goals.includes(goal) ? 'bg-purple-500/20 border-purple-400/50 text-purple-400' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => setShowProfile(false)}
                  className="w-full py-4 bg-purple-600 hover:bg-purple-500 rounded-2xl text-xs uppercase tracking-widest font-bold transition-all shadow-lg shadow-purple-600/20"
                >
                  Save Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sobriety Counter Widget */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-24 left-6 z-30"
      >
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center gap-4 shadow-2xl">
          <div className="w-10 h-10 rounded-full bg-amber-400/20 flex items-center justify-center">
            <Star className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Sobriety Streak</p>
            <p className="text-xl font-light">3 Days Clean</p>
          </div>
        </div>
      </motion.div>

      {/* Meditation Timer Widget */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-24 right-6 z-30 flex flex-col items-end gap-4"
      >
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center gap-4 shadow-2xl">
          <div className="flex flex-col">
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Meditation</span>
            <span className="text-2xl font-mono tracking-tighter text-blue-400">{formatTime(timeLeft)}</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setTimerActive(!timerActive)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              {timerActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button 
              onClick={() => {
                setTimerActive(false);
                setTimeLeft(initialTime);
              }}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Timer Presets */}
        {!timerActive && (
          <div className="flex gap-2">
            {[60, 300, 600].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setInitialTime(t);
                  setTimeLeft(t);
                }}
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${initialTime === t ? 'bg-blue-500/20 border-blue-400/50 text-blue-400' : 'bg-black/40 border-white/10 text-white/40 hover:bg-white/5'}`}
              >
                {t / 60}m
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Main Content */}
      <main className="relative z-20 h-full flex items-end justify-center p-6 pb-24 md:pb-12">
        <AnimatePresence>
          {showCareNetwork && (
            <div key="care-network-overlay" className="absolute inset-0 z-50 flex items-center justify-center p-6">
              <CareNetwork onClose={() => setShowCareNetwork(false)} />
            </div>
          )}
          {showRecoveryHub && (
            <div key="recovery-hub-overlay" className="absolute inset-0 z-50 flex items-center justify-center p-6">
              <RecoveryHub onClose={() => setShowRecoveryHub(false)} />
            </div>
          )}
          {showCommunityForum && (
            <div key="community-forum-overlay" className="absolute inset-0 z-50 flex items-center justify-center p-6">
              <CommunityForum onClose={() => setShowCommunityForum(false)} userName={userProfile.name} />
            </div>
          )}
          
          {isChatOpen && (
            <motion.div
              key="chat-window"
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              className="w-full max-w-2xl h-[60vh] md:h-[70vh] flex flex-col bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Chat Header */}
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-medium text-white/60 uppercase tracking-widest">Live Support</span>
                </div>
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-white/40" />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] p-4 rounded-2xl ${
                      msg.sender === 'user' 
                        ? 'bg-blue-600/20 border border-blue-500/30 text-blue-50' 
                        : 'bg-white/5 border border-white/10 text-white/90'
                    }`}>
                      <div className="prose prose-invert prose-sm max-w-none">
                        <Markdown>{msg.text}</Markdown>
                      </div>
                      <span className="text-[10px] opacity-30 mt-2 block">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex gap-1">
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white/5 border-t border-white/5">
                <div className="relative flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Share what's on your mind..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-white/20"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="p-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 rounded-2xl transition-all shadow-lg shadow-blue-600/20"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isChatOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => setIsChatOpen(true)}
            className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-600/40 hover:scale-110 transition-transform"
          >
            <MessageCircle className="w-8 h-8" />
          </motion.button>
        )}
      </main>

      {/* Breathing Exercise Overlay */}
      <AnimatePresence>
        {showBreathing && (
          <motion.div
            key="breathing-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xl"
          >
            <button 
              onClick={() => setShowBreathing(false)}
              className="absolute top-8 right-8 p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <motion.div
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              className="w-48 h-48 rounded-full border-4 border-blue-400/30 flex items-center justify-center relative"
            >
              <motion.div
                animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.2, 0.5, 0.2] }}
                transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                className="absolute inset-0 bg-blue-400 rounded-full blur-3xl"
              />
              <span className="text-2xl font-light tracking-widest uppercase text-blue-200">
                <BreathText />
              </span>
            </motion.div>
            
            <p className="mt-12 text-white/40 uppercase tracking-[0.3em] text-xs">Follow the circle to calm your mind</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Info */}
      <footer className="absolute bottom-6 left-0 w-full px-8 flex justify-between items-center z-30 pointer-events-none">
        <div className="flex gap-6 opacity-40 text-[10px] uppercase tracking-widest font-bold">
          <span className="flex items-center gap-2"><Shield className="w-3 h-3" /> Secure Session</span>
          <span className="flex items-center gap-2"><RefreshCw className="w-3 h-3" /> Real-time Support</span>
        </div>
        <div className="pointer-events-auto">
          <button className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold opacity-40 hover:opacity-100 transition-opacity">
            <Info className="w-3 h-3" /> Crisis Resources
          </button>
        </div>
      </footer>
    </div>
  );
}

function BreathText() {
  const [text, setText] = useState('Inhale');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setText(prev => prev === 'Inhale' ? 'Exhale' : 'Inhale');
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return <span>{text}</span>;
}
