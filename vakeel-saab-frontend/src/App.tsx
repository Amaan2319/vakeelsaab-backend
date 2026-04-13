import { Routes, Route } from "react-router"
import Home from "./pages/Home"
import Chat from "./components/Chat"
import UploadBox from "./components/UploadBox"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import DocumentAnalysis from "./pages/DocumentAnalysis"
import About from "./pages/About"
import Roadmap from "./pages/Roadmap"
import ProtectedRoute from "./components/ProtectedRoute"



function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/about" element={<About />} />
      <Route path="/roadmap" element={<Roadmap />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/chat" element={<Chat />} />
        <Route path="/upload" element={<UploadBox />} />
        <Route path="/analysis" element={<DocumentAnalysis />} />
      </Route>
    </Routes>
  )
}

export default App
