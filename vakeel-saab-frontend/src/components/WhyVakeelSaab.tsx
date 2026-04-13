import { motion } from "framer-motion"
import { Shield, Zap, BookOpen, Users } from "lucide-react"

export default function WhyVakeelSaab() {
  const features = [
    {
      icon: <Shield className="text-indigo-400" size={40} />,
      title: "AI-Powered Legal Assistance",
      description: "Leverage advanced AI to get instant, accurate explanations of the Bharatiya Nyaya Sanhita (BNS) and other Indian laws."
    },
    {
      icon: <Zap className="text-blue-400" size={40} />,
      title: "Simplified Explanations",
      description: "Complex legal jargon is broken down into easy-to-understand language, making law accessible to everyone."
    },
    {
      icon: <BookOpen className="text-purple-400" size={40} />,
      title: "Comprehensive Coverage",
      description: "Access detailed insights on various legal topics, from criminal law to civil matters, all in one place."
    },
    {
      icon: <Users className="text-green-400" size={40} />,
      title: "Democratizing Legal Knowledge",
      description: "Empower citizens, students, and professionals by providing free, reliable legal information without barriers."
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-20 px-6 max-w-6xl mx-auto"
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Why Choose Vakeel Saab?
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          In a world where legal knowledge is often complex and intimidating, Vakeel Saab bridges the gap by providing AI-driven insights into Indian laws. Discover the features that make us indispensable for legal understanding.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-indigo-500 transition-colors"
          >
            <div className="mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-400">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-12 text-center"
      >
        <p className="text-gray-300 text-lg">
          Join thousands who are making informed decisions with Vakeel Saab. Your gateway to understanding Indian law, powered by AI.
        </p>
      </motion.div>
    </motion.div>
  )
}