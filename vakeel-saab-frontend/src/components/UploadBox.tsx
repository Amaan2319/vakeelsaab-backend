import { UploadCloud } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import { useNavigate } from "react-router"
import { useAuth } from "../context/AuthContext"
import { ApiError, uploadLegalDocument } from "../services/api"

export default function UploadBox() {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { token, logout } = useAuth()

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!token) {
      navigate("/login")
      return
    }

    setError("")
    setIsUploading(true)

    try {
      const response = await uploadLegalDocument(file, token)
      sessionStorage.setItem("latestDocumentSummary", response.summary)
      sessionStorage.setItem("latestDocumentUrl", response.file_url)
      navigate("/analysis", {
        state: {
          summary: response.summary,
          fileUrl: response.file_url,
          fileName: file.name,
        },
      })
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout()
        navigate("/login")
        return
      }

      setError(err instanceof ApiError ? err.message : "Unable to upload this document right now.")
    } finally {
      setIsUploading(false)
      event.target.value = ""
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          max-w-xl
          mx-auto
          border border-white/10
          bg-white/5
          backdrop-blur-xl
          rounded-2xl
          p-10
          text-center
          transition
          hover:border-indigo-500/40
        "
      >

      {/* Icon */}
      <div className="
        inline-flex
        p-4
        rounded-xl
        bg-indigo-500/20
        mb-5
      ">
        <UploadCloud className="text-indigo-400" size={32} />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-white">
        Upload Legal Document
      </h3>

      {/* Description */}
      <p className="text-gray-400 text-sm mt-2 max-w-sm mx-auto">
        Upload a notice, FIR, or legal document to analyze
        using Vakeel Sahab AI.
      </p>

      {error && (
        <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}

      {/* Hidden Input */}
      <input
        type="file"
        id="fileUpload"
        className="hidden"
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={handleFileChange}
      />

      {/* Upload Button */}
      <label
        htmlFor="fileUpload"
        className="
          inline-block
          mt-6
          px-6 py-2.5
          text-sm
          font-medium
          bg-indigo-600
          hover:bg-indigo-500
          text-white
          rounded-xl
          cursor-pointer
          transition
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
        style={{ pointerEvents: isUploading ? 'none' : 'auto' }}
      >
        {isUploading ? 'Uploading...' : 'Choose File'}
      </label>

      {/* Helper text */}
      <p className="text-xs text-gray-500 mt-4">
        Supported formats: JPG, PNG, PDF, DOCX, TXT
      </p>

      </motion.div>
    </div>
  )
}
