import { Scale, Menu, X } from "lucide-react"
import { Link, useNavigate } from "react-router"
import { useAuth } from "../context/AuthContext"
import { useState } from "react"

export default function Navbar() {
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="w-full border-b border-white/10 bg-black/40 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500">
            <Scale className="text-white" size={20} />
          </div>

          <div>
            <h1 className="font-semibold text-lg text-white">
              Vakeel Sahab
            </h1>
            <p className="text-xs text-gray-400">
              AI Legal Assistant for BNS
            </p>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/"
            className="px-4 py-2 text-sm text-gray-300 hover:text-white transition"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="px-4 py-2 text-sm text-gray-300 hover:text-white transition"
          >
            About
          </Link>
          <Link
            to="/roadmap"
            className="px-4 py-2 text-sm text-gray-300 hover:text-white transition"
          >
            Roadmap
          </Link>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/chat"
                className="px-5 py-2 border border-white/10 text-sm rounded-xl transition hover:border-indigo-500"
              >
                Open Assistant
              </Link>
              <button
                onClick={() => {
                  logout()
                  navigate("/")
                }}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-sm rounded-xl transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/signup"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-sm rounded-xl transition"
            >
              Get Started
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-3 border-t border-white/10">

          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="py-2 text-gray-300 hover:text-white"
          >
            Home
          </Link>

          <Link
            to="/about"
            onClick={() => setIsOpen(false)}
            className="py-2 text-gray-300 hover:text-white"
          >
            About
          </Link>

          <Link
            to="/roadmap"
            onClick={() => setIsOpen(false)}
            className="py-2 text-gray-300 hover:text-white"
          >
            Roadmap
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/chat"
                onClick={() => setIsOpen(false)}
                className="py-2 text-gray-300 hover:text-white"
              >
                Open Assistant
              </Link>

              <button
                onClick={() => {
                  logout()
                  navigate("/")
                  setIsOpen(false)
                }}
                className="py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/signup"
              onClick={() => setIsOpen(false)}
              className="py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm text-center transition"
            >
              Get Started
            </Link>
          )}

        </div>
      )}
    </nav>
  )
}