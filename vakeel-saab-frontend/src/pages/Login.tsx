import { motion } from "framer-motion"
import { Scale } from "lucide-react"
import { FormEvent, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router"
import { useAuth } from "../context/AuthContext"
import { ApiError, loginUser } from "../services/api"

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const redirectTo = location.state?.from?.pathname || "/chat"

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const response = await loginUser(email, password)
      login(response.user, response.access_token)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Unable to log in right now. Please try again."
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          w-full max-w-md
          bg-white/5
          border border-white/10
          backdrop-blur-xl
          rounded-2xl
          p-8
        "
      >

        {/* Logo */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500">
            <Scale className="text-white" size={20}/>
          </div>

          <h2 className="text-xl font-semibold">
            Login to Vakeel Saab
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="
              w-full mb-4 px-4 py-3
              bg-white/5
              border border-white/10
              rounded-xl
              outline-none
              focus:border-indigo-500
            "
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
            className="
              w-full mb-4 px-4 py-3
              bg-white/5
              border border-white/10
              rounded-xl
              outline-none
              focus:border-indigo-500
            "
          />

          {error && (
            <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="
              w-full py-3
              bg-indigo-600
              hover:bg-indigo-500
              rounded-xl
              font-medium
              transition
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-gray-400 text-sm mt-6 text-center">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-400 hover:text-indigo-300"
          >
            Sign up
          </Link>
        </p>

      </motion.div>

    </div>
  )
}
