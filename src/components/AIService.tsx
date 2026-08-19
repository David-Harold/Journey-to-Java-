import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, BookOpen, Lightbulb, Youtube, Layout, Search, ArrowRight, Loader2 } from 'lucide-react';
import { getStudyRecommendations, exploreDocumentation, StudyRecommendation } from '../services/gemini';
import Markdown from 'react-markdown';

export default function AIService() {
  const [level, setLevel] = useState('beginner');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<StudyRecommendation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<string | null>(null);

  const handleConsult = async () => {
    if (!goal.trim()) return;
    setLoading(true);
    try {
      const results = await getStudyRecommendations(level, goal);
      setRecommendations(results);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const result = await exploreDocumentation(searchQuery);
      setSearchResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
          <Sparkles className="w-3 h-3 text-orange-500" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-orange-400">AI Powered Mentor</span>
        </div>
        <h2 className="text-4xl font-sans font-bold text-white tracking-tight leading-tight">
          Accelerate your Journey to Java with intelligent insights.
        </h2>
      </header>

      {/* Docs Search */}
      <section className="bg-zinc-950 border border-zinc-900 rounded-3xl p-8 space-y-6">
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-sans font-bold text-white">Explore Documentation</h3>
        </div>
        <form onSubmit={handleSearch} className="relative">
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for concepts, APIs, or behaviors..."
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-4 pl-6 pr-14 text-white placeholder-zinc-600 focus:border-orange-500/50 transition-all shadow-inner"
          />
          <button 
            type="submit"
            disabled={loading}
            className="absolute right-2 top-2 p-3 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4 text-white" />}
          </button>
        </form>
        <AnimatePresence>
          {searchResult && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-6 p-6 bg-zinc-900/30 rounded-2xl border border-zinc-900 border-zinc-800 text-zinc-300 text-sm leading-relaxed overflow-hidden"
            >
              <div className="markdown-body">
                <Markdown>{searchResult}</Markdown>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Mentor Prompt */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest text-zinc-600 font-bold">Your Level</label>
            <select 
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-900 rounded-xl p-3 text-zinc-300 focus:ring-1 focus:ring-orange-500/50"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest text-zinc-600 font-bold">Your Goal</label>
            <textarea 
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Master closures, build a weather app, learn TypeScript"
              rows={4}
              className="w-full bg-zinc-950 border border-zinc-900 rounded-xl p-4 text-zinc-300 focus:ring-1 focus:ring-orange-500/50 placeholder-zinc-700"
            />
          </div>
          <button 
            onClick={handleConsult}
            disabled={loading || !goal.trim()}
            className="w-full bg-orange-500 hover:bg-orange-400 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-orange-500/10 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 fill-current" />}
            Draft Study Plan
          </button>
        </div>

        <div className="md:col-span-2 space-y-6">
          {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {recommendations.map((rec, i) => (
                <motion.div
                  key={rec.type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 hover:border-zinc-800 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-zinc-900 rounded-xl text-orange-500">
                      {rec.type === 'doc' && <BookOpen className="w-5 h-5 text-blue-400" />}
                      {rec.type === 'project' && <Lightbulb className="w-5 h-5 text-purple-400" />}
                      {rec.type === 'video' && <Youtube className="w-5 h-5 text-red-500" />}
                      {rec.type === 'architecture' && <Layout className="w-5 h-5 text-green-400" />}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-600">{rec.type}</span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowRight className="w-4 h-4 text-zinc-600" />
                        </div>
                      </div>
                      <h4 className="text-white font-bold text-lg">{rec.title}</h4>
                      <p className="text-zinc-400 text-sm leading-relaxed">{rec.content}</p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {rec.links.map(link => (
                          <a 
                            key={link} 
                            href={link} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-[10px] font-mono text-zinc-500 hover:text-orange-500 transition-colors underline underline-offset-4"
                          >
                            Source Link
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center border border-dashed border-zinc-900 rounded-3xl p-12 text-center opacity-40">
              <Sparkles className="w-12 h-12 text-zinc-700 mb-6" />
              <p className="text-zinc-500 text-sm max-w-xs italic">
                Input your level and current goals to receive tailored study paths drafted by AI.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
