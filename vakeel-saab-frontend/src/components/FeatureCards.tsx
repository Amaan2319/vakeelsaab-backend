import { MessageSquare, Upload, BookOpen, Rocket, type LucideIcon } from "lucide-react"
import { useNavigate } from "react-router" // Or "react-router-dom" depending on your version
import { motion } from "framer-motion"

interface CardProps {
  icon: LucideIcon;
  title: string;
  desc: string;
  onClick: () => void;
}

const Card = ({ icon: Icon, title, desc, onClick }: CardProps) => (
  <motion.div
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="
      cursor-pointer
      border border-white/10
      bg-white/5
      backdrop-blur-xl
      rounded-2xl
      p-6
      transition
      hover:border-indigo-500/40
    "
  >
    <div className="flex gap-4">
      <div className="px-5 py-0 rounded-xl bg-indigo-500/20 flex items-center justify-center">
        <Icon className="text-indigo-400" size={26} />
      </div>

      <div>
        <h3 className="font-semibold text-white text-lg">{title}</h3>
        <p className="text-sm text-gray-400 mt-1">{desc}</p>
      </div>
    </div>
  </motion.div>
)

export default function FeatureCards() {
  const navigate = useNavigate()

  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mt-16 px-6">
      <Card
        icon={MessageSquare}
        title="Ask a Question"
        desc="Ask about crimes, punishments or legal procedures"
        onClick={() => navigate("/chat")}
      />

      <Card
        icon={Upload}
        title="Upload Document"
        desc="Upload legal documents for instant analysis"
        onClick={() => navigate("/upload")} 
      />

      <Card
        icon={BookOpen}
        title="Learn About Us"
        desc="Discover our mission, technology, and vision"
        onClick={() => navigate("/about")}
      />

      <Card
        icon={Rocket}
        title="Future Roadmap"
        desc="Explore upcoming features and improvements"
        onClick={() => navigate("/roadmap")}
      />
    </div>
  )
}
