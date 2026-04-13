import { Scale } from "lucide-react"
import { Link } from "react-router"

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-black/40 backdrop-blur-md mt-10">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between gap-8">

          {/* Brand */}
          <div className="max-w-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500">
                <Scale className="text-white" size={20} />
              </div>
              <h2 className="text-white font-semibold text-lg">
                Vakeel Saab
              </h2>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed">
              AI-powered legal assistant designed to simplify legal understanding,
              analyze documents, and provide context-aware insights.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row gap-8">

            {/* Navigation */}
            <div>
              <h3 className="text-white text-sm font-semibold mb-3">
                Navigation
              </h3>
              <div className="flex flex-col gap-2 text-sm text-gray-400">
                <Link to="/" className="hover:text-white transition">Home</Link>
                <Link to="/about" className="hover:text-white transition">About</Link>
                <Link to="/roadmap" className="hover:text-white transition">Roadmap</Link>
                <Link to="/chat" className="hover:text-white transition">Chat</Link>
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-white text-sm font-semibold mb-3">
                Features
              </h3>
              <div className="flex flex-col gap-2 text-sm text-gray-400">
                <span>AI Legal Chat</span>
                <span>Document Analysis</span>
                <span>Context Retrieval</span>
                <span>Secure Authentication</span>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-white text-sm font-semibold mb-3">
                Legal
              </h3>
              <div className="flex flex-col gap-2 text-sm text-gray-400">
                <span>Privacy Policy</span>
                <span>Terms of Service</span>
                <span>Disclaimer</span>
              </div>
            </div>

          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-6"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-gray-400">

          <p>
            © {new Date().getFullYear()} Vakeel Saab. All rights reserved.
          </p>

          <p className="text-xs text-gray-500">
            Built with AI for smarter legal assistance
          </p>

        </div>

      </div>
    </footer>
  )
}