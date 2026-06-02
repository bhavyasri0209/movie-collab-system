import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import '../styles/home.css'

export default function Home() {
  const navigate = useNavigate()

  const handleLaunchProduction = () => {
    navigate('/login')
  }

  const handleExploreDashboard = () => {
    navigate('/dashboard')
  }

  return (
    <div className="hero">
      <div className="overlay"></div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="hero-content"
      >
        <span className="badge">Cinematic Production Suite</span>

        <h1>
          Collaborative Movie Production
          <br />
          & Crew Coordination System
        </h1>

        <p>
          Manage scripts, crew assignments, production timelines,
          approvals, locations, schedules, and real-time collaboration
          workflows inside a premium cinematic workspace.
        </p>

        <div className="buttons">
          <button onClick={handleLaunchProduction}>Launch Production</button>
          <button className="secondary" onClick={handleExploreDashboard}>Explore Dashboard</button>
        </div>
      </motion.div>

      <div className="glow glow1"></div>
      <div className="glow glow2"></div>
    </div>
  )
}