import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { AssessmentProvider } from './context/AssessmentContext'
import { LandingPage } from './pages/LandingPage'
import { AssessmentType } from './pages/AssessmentType'
import { IndividualWizard } from './pages/IndividualWizard'
import { ResultsDashboard } from './pages/ResultsDashboard'
import { SubsidyChecker } from './pages/SubsidyChecker'
import { Resources } from './pages/Resources'
import { FindInstallers } from './pages/FindInstallers'

function App() {
  return (
    <Router>
      <AssessmentProvider>
        <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/assessment" element={<AssessmentType />} />
              <Route path="/assessment/wizard" element={<IndividualWizard />} />
              <Route path="/results" element={<ResultsDashboard />} />
              <Route path="/subsidies" element={<SubsidyChecker />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/installers" element={<FindInstallers />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AssessmentProvider>
    </Router>
  )
}

export default App

