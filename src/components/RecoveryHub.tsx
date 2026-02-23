import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, BookOpen, Gamepad2, Star, CheckCircle2, ArrowRight, Home, Briefcase, Users } from 'lucide-react';

const miniGames = [
  { id: '1', name: 'Mindful Match', description: 'A memory game to improve focus.', icon: Gamepad2 },
  { id: '2', name: 'Zen Flow', description: 'Connect the dots to create a path of peace.', icon: Star },
];

const coupons = [
  { id: 'c1', brand: 'Starbucks', offer: 'Free Coffee', requirement: '7 Day Streak', unlocked: false },
  { id: 'c2', brand: 'Planet Fitness', offer: '1 Month Free', requirement: '30 Day Streak', unlocked: false },
  { id: 'c3', brand: 'Whole Foods', offer: '$20 Discount', requirement: '14 Day Streak', unlocked: false },
];

const classes = [
  { id: '1', name: 'Relapse Prevention 101', duration: '45 mins', status: 'Available' },
  { id: '2', name: 'Cognitive Behavioral Skills', duration: '60 mins', status: 'In Progress' },
  { id: '3', name: 'Drug Court Orientation', duration: '30 mins', status: 'Completed' },
];

const incentives = [
  { day: 1, reward: 'Bronze Spirit Badge', unlocked: true },
  { day: 7, reward: 'Silver Resilience Medal', unlocked: false },
  { day: 30, reward: 'Gold Serenity Trophy', unlocked: false },
];

export const RecoveryHub = ({ onClose }: { onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState<'games' | 'classes' | 'incentives' | 'rewards'>('incentives');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="w-full max-w-4xl h-[80vh] bg-black/60 backdrop-blur-3xl border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl"
    >
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
        <div>
          <h2 className="text-xl font-light tracking-widest uppercase">Recovery Hub</h2>
          <p className="text-[10px] text-blue-400/60 uppercase tracking-widest font-bold">Your Daily Journey & Growth</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <Trophy className="w-6 h-6 text-white/40" />
        </button>
      </div>

      <div className="flex border-b border-white/5 bg-white/5">
        {(['incentives', 'rewards', 'games', 'classes'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 text-[10px] uppercase tracking-widest font-bold transition-all ${
              activeTab === tab ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-400/5' : 'text-white/40 hover:text-white/60'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
        <AnimatePresence mode="wait">
          {activeTab === 'rewards' && (
            <motion.div
              key="rewards"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40 mb-6">Real-World Rewards</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coupons.map((coupon) => (
                  <div key={coupon.id} className={`p-6 border rounded-2xl flex items-center justify-between group transition-all ${
                    coupon.unlocked ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/10 opacity-60'
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${coupon.unlocked ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/20'}`}>
                        <Trophy className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white/90">{coupon.brand}</h4>
                        <p className="text-xs text-white/60">{coupon.offer}</p>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">{coupon.requirement}</p>
                      </div>
                    </div>
                    <button className={`px-4 py-2 rounded-lg text-[10px] uppercase tracking-widest font-bold transition-all ${
                      coupon.unlocked ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-white/5 text-white/20 cursor-not-allowed'
                    }`}>
                      {coupon.unlocked ? 'Redeem' : 'Locked'}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          {activeTab === 'incentives' && (
            <motion.div
              key="incentives"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="p-6 bg-blue-600/10 border border-blue-500/20 rounded-2xl mb-8">
                <h3 className="text-lg font-light mb-2">Sobriety Streak: 3 Days</h3>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '40%' }}
                    className="bg-blue-500 h-full"
                  />
                </div>
                <p className="text-[10px] text-white/40 mt-2 uppercase tracking-widest">4 days until next reward</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {incentives.map((item) => (
                  <div key={item.day} className={`p-6 border rounded-2xl flex flex-col items-center text-center gap-4 ${
                    item.unlocked ? 'bg-white/5 border-white/20' : 'bg-black/20 border-white/5 opacity-50'
                  }`}>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${item.unlocked ? 'bg-amber-400/20 text-amber-400' : 'bg-white/5 text-white/20'}`}>
                      <Star className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-medium">Day {item.day}</h4>
                      <p className="text-xs text-white/40">{item.reward}</p>
                    </div>
                    {item.unlocked && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'games' && (
            <motion.div
              key="games"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {miniGames.map((game) => (
                <div key={game.id} className="p-8 bg-white/5 border border-white/10 rounded-3xl group hover:bg-white/10 transition-all cursor-pointer">
                  <div className="w-12 h-12 bg-blue-400/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <game.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-light mb-2">{game.name}</h3>
                  <p className="text-sm text-white/40 mb-6">{game.description}</p>
                  <button className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-blue-400 group-hover:gap-4 transition-all">
                    Play Now <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'classes' && (
            <motion.div
              key="classes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {classes.map((cls) => (
                <div key={cls.id} className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-6">
                    <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-white/40" />
                    </div>
                    <div>
                      <h4 className="font-medium">{cls.name}</h4>
                      <p className="text-xs text-white/40">{cls.duration} • {cls.status}</p>
                    </div>
                  </div>
                  <button className={`px-6 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${
                    cls.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}>
                    {cls.status === 'Completed' ? 'Review' : 'Start'}
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-6 bg-white/5 border-t border-white/5 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl">
          <Home className="w-6 h-6 text-emerald-400" />
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-white/40">Housing Support</p>
            <p className="text-xs">3 Local Listings Found</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl">
          <Briefcase className="w-6 h-6 text-blue-400" />
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-white/40">Employment</p>
            <p className="text-xs">2 New Job Matches</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
