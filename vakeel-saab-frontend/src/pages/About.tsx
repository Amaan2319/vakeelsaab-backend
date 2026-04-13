import { motion } from "framer-motion"
import { Zap, Users, Shield, Sparkles, Rocket, BookOpen } from "lucide-react"
import Navbar from "../components/Navbar"
import BackgroundGlow from "../components/BackgroundGlow"

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      <BackgroundGlow />
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 mb-6">
            <BookOpen className="text-white" size={32} />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">About VakeelSaab</h1>
          <p className="text-gray-400 text-lg">
            Simplifying legal knowledge through AI-powered assistance
          </p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {/* What We Do */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-3xl font-bold text-white mb-6">What VakeelSaab Does</h2>
            <p className="text-gray-300 leading-relaxed">
              VakeelSaab combines natural language understanding, document processing, and contextual retrieval 
              to help users understand complex legal content quickly and efficiently.
            </p>
            
            <div className="grid md:grid-cols-3 gap-4 mt-8">
              <div className="border border-white/10 bg-white/5 backdrop-blur-xl rounded-xl p-6 hover:border-indigo-500/40 transition">
                <MessageSquareIcon className="text-indigo-400 mb-4" size={28} />
                <h3 className="font-semibold text-white mb-2">Ask Questions</h3>
                <p className="text-sm text-gray-400">Ask legal questions in natural language</p>
              </div>

              <div className="border border-white/10 bg-white/5 backdrop-blur-xl rounded-xl p-6 hover:border-indigo-500/40 transition">
                <Zap className="text-indigo-400 mb-4" size={28} />
                <h3 className="font-semibold text-white mb-2">Upload Documents</h3>
                <p className="text-sm text-gray-400">Upload documents for AI-powered summaries</p>
              </div>

              <div className="border border-white/10 bg-white/5 backdrop-blur-xl rounded-xl p-6 hover:border-indigo-500/40 transition">
                <Sparkles className="text-indigo-400 mb-4" size={28} />
                <h3 className="font-semibold text-white mb-2">Get Insights</h3>
                <p className="text-sm text-gray-400">Receive context-aware answers instantly</p>
              </div>
            </div>
          </motion.section>

          {/* Mission */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
            <div className="border-l-4 border-indigo-500 pl-6 py-2">
              <p className="text-gray-300 text-lg leading-relaxed italic">
                "Make legal knowledge accessible, understandable, and actionable for everyone — 
                without requiring deep legal expertise."
              </p>
            </div>
          </motion.section>

          {/* How It Works */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-3xl font-bold text-white mb-6">How It Works</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center font-bold text-white">
                  1
                </div>
                <div className="pt-2">
                  <h3 className="font-semibold text-white">User Interaction</h3>
                  <p className="text-gray-400 mt-1">Users interact with the system through chat or document upload</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center font-bold text-white">
                  2
                </div>
                <div className="pt-2">
                  <h3 className="font-semibold text-white">AI Processing</h3>
                  <p className="text-gray-400 mt-1">The system processes inputs using AI models and retrieval techniques</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center font-bold text-white">
                  3
                </div>
                <div className="pt-2">
                  <h3 className="font-semibold text-white">Context-Aware Response</h3>
                  <p className="text-gray-400 mt-1">Responses are generated with relevant context for better accuracy</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Technology Stack */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-3xl font-bold text-white mb-6">Technology Stack</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                "React + Vite - Frontend Framework",
                "FastAPI - Backend Server",
                "Supabase (PostgreSQL) - Database",
                "Gemini AI - Language Model",
                "FAISS - Retrieval System",
              ].map((tech, idx) => (
                <div
                  key={idx}
                  className="border border-white/10 bg-white/5 backdrop-blur-xl rounded-lg p-4 hover:border-indigo-500/40 transition"
                >
                  <p className="text-gray-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400" />
                    {tech}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Vision */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-3xl font-bold text-white mb-6">Our Vision</h2>
            <div className="border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 backdrop-blur-xl rounded-2xl p-8">
              <div className="flex gap-4">
                <Rocket className="text-indigo-400 flex-shrink-0" size={32} />
                <p className="text-gray-300 leading-relaxed">
                  To build a complete AI-driven legal ecosystem that assists users across platforms, 
                  making legal help faster, smarter, and universally accessible.
                </p>
              </div>
            </div>
          </motion.section>
        </motion.div>
      </div>
    </div>
  )
}

// Icon component for message square
function MessageSquareIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}
