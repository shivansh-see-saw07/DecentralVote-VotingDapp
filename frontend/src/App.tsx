import { Routes, Route } from "react-router-dom"
import { InteractiveCursor } from "./components/interactive-cursor"
import { Toaster } from "./components/ui/toaster"
import Dashboard from "./pages/dashboard"
import Elections from "./pages/elections"
import CreateElection from "./pages/create-election"
import ElectionDetails from "./pages/electiondetails"
import VotePage from "./pages/votepage"
import AdminDashboard from "./pages/admin-dashboard"
import Candidates from "./pages/candidates"
import Results from "./pages/results"
import LandingPage from "../components/landing-page"
import "./index.css"

function App() {
  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 bg-background" />
      <InteractiveCursor />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/elections" element={<Elections />} />
        <Route path="/elections/create" element={<CreateElection />} />
        <Route path="/elections/:id" element={<ElectionDetails />} />
        <Route path="/elections/:id/vote" element={<VotePage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/candidates" element={<Candidates />} />
        <Route path="/results" element={<Results />} />
        <Route path="/results/:id" element={<Results />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
