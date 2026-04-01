import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import DiseaseDetection from './pages/DiseaseDetection';
import RiskAssessment from './pages/RiskAssessment';
import HealthMonitoring from './pages/HealthMonitoring';
import Profile from './pages/Profile';
import Reminders from './pages/Reminders';
import AICompanion from './pages/AICompanion';
import EmergencyAlert from './pages/EmergencyAlert';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="disease-detection" element={<DiseaseDetection />} />
              <Route path="risk-assessment" element={<RiskAssessment />} />
              <Route path="health-monitoring" element={<HealthMonitoring />} />
              <Route path="profile" element={<Profile />} />
              <Route path="reminders" element={<Reminders />} />
              <Route path="ai-companion" element={<AICompanion />} />
              <Route path="emergency" element={<EmergencyAlert />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;