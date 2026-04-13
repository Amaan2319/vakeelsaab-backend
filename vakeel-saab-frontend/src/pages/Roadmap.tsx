import { motion } from "framer-motion"
import {
  Mic,
  MessageCircle,
  BarChart3,
  History,
  Bookmark,
  FileDown,
  Lock,
  Smartphone,
  Lightbulb,
  Globe,
  Check,
  ArrowRight,
} from "lucide-react"
import Navbar from "../components/Navbar"
import BackgroundGlow from "../components/BackgroundGlow"

interface RoadmapItem {
  icon: React.ReactNode
  title: string
  description: string
}

export default function Roadmap() {
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

  const roadmapItems: RoadmapItem[] = [
    {
      icon: <Mic className="text-indigo-400" size={28} />,
      title: "Voice Interaction",
      description:
        "Ask legal questions using voice input and receive responses seamlessly. Improved accessibility and hands-free interaction.",
    },
    {
      icon: <MessageCircle className="text-indigo-400" size={28} />,
      title: "Multi-Chat System",
      description:
        "Create multiple chat sessions, organize conversations, and switch between different discussions easily.",
    },
    {
      icon: <BarChart3 className="text-indigo-400" size={28} />,
      title: "User Dashboard",
      description:
        "Centralized dashboard with overview of uploaded documents, access to previous queries, and quick navigation.",
    },
    {
      icon: <History className="text-indigo-400" size={28} />,
      title: "Chat History",
      description:
        "Structured history of interactions including past questions, answers, timestamps, and organized records.",
    },
    {
      icon: <Bookmark className="text-indigo-400" size={28} />,
      title: "Bookmark Responses",
      description:
        "Save important responses for future reference and quickly revisit critical legal insights.",
    },
    {
      icon: <FileDown className="text-indigo-400" size={28} />,
      title: "Download as PDF",
      description:
        "Download document summaries as PDF files for offline storage, sharing, and reference.",
    },
    {
      icon: <Lock className="text-indigo-400" size={28} />,
      title: "Enhanced Privacy",
      description:
        "Privacy-focused AI models, ensuring user data is not used for training and strengthened security measures.",
    },
    {
      icon: <Smartphone className="text-indigo-400" size={28} />,
      title: "Mobile Application",
      description:
        "Dedicated mobile app for iOS and Android, allowing access on-the-go with optimized experience.",
    },
    {
      icon: <Lightbulb className="text-indigo-400" size={28} />,
      title: "Advanced Intelligence",
      description:
        "Highlight important clauses, identify legal risks, and provide actionable suggestions for documents.",
    },
    {
      icon: <Globe className="text-indigo-400" size={28} />,
      title: "Multilingual Support",
      description:
        "Support for multiple languages to make legal assistance accessible to a broader global audience.",
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white relative">
      <BackgroundGlow />
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 mb-6">
            <ArrowRight className="text-white" size={32} />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Product Roadmap</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Exciting features and improvements coming to VakeelSaab. We're continuously innovating to deliver 
            a better experience for legal assistance.
          </p>
        </motion.div>

        {/* Roadmap Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-8 mb-20"
        >
          {roadmapItems.map((item, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="group border border-white/10 bg-white/5 backdrop-blur-xl rounded-2xl p-8 hover:border-indigo-500/40 hover:bg-white/10 transition duration-300"
            >
              <div className="flex gap-4">
                <div className="p-4 rounded-xl bg-indigo-500/20 group-hover:bg-indigo-500/30 transition h-fit">
                  {item.icon}
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-xl text-white mb-2 group-hover:text-indigo-400 transition">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 backdrop-blur-xl rounded-2xl p-12 text-center"
        >
          <Check className="text-indigo-400 mx-auto mb-4" size={40} />
          <h2 className="text-3xl font-bold text-white mb-4">We're Building the Future</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            These features are in active development. We're committed to making legal assistance 
            smarter, faster, and more accessible to everyone. Thank you for being part of this journey!
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition duration-300">
            Stay Updated
          </button>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid md:grid-cols-3 gap-6 mt-20"
        >
          {[
            { number: "10+", label: "Planned Features" },
            { number: "100%", label: "Committed to Excellence" },
            { number: "∞", label: "Possibilities Ahead" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="border border-white/10 bg-white/5 backdrop-blur-xl rounded-xl p-8 text-center hover:border-indigo-500/40 transition"
            >
              <div className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <p className="text-gray-400">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
