import { Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export default function Hero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mt-20 px-6"
    >

      <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 mb-6">
        <Sparkles className="text-white" size={32}/>
      </div>

      <h1 className="text-4xl md:text-5xl font-bold text-white">
        Welcome to Vakeel Sahab
      </h1>

      <p className="mt-4 max-w-xl mx-auto text-gray-400 text-lg">
        Your AI-powered legal assistant for understanding the
        Bharatiya Nyaya Sanhita (BNS).
        Get instant simplified explanations of Indian laws.
      </p>

    </motion.div>
  )
}