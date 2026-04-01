import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import MastersPage from './pages/MastersPage';
import SeatMatrixPage from './pages/SeatMatrixPage';
import ApplicantsPage from './pages/ApplicantsPage';
import AdmissionPage from './pages/AdmissionPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute roles={['ADMIN', 'ADMISSION_OFFICER', 'MANAGEMENT']}><Layout /></ProtectedRoute>}>
            <Route index element={<HomePage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="institution" element={<ProtectedRoute roles={['ADMIN']}><MastersPage type="Institution" /></ProtectedRoute>} />
            <Route path="campus" element={<ProtectedRoute roles={['ADMIN']}><MastersPage type="Campus" /></ProtectedRoute>} />
            <Route path="department" element={<ProtectedRoute roles={['ADMIN']}><MastersPage type="Department" /></ProtectedRoute>} />
            <Route path="program" element={<ProtectedRoute roles={['ADMIN']}><MastersPage type="Program" /></ProtectedRoute>} />
            <Route path="seat-matrix" element={<ProtectedRoute roles={['ADMIN']}><SeatMatrixPage /></ProtectedRoute>} />
            <Route path="applicants" element={<ProtectedRoute roles={['ADMISSION_OFFICER', 'ADMIN']}><ApplicantsPage /></ProtectedRoute>} />
            <Route path="admission" element={<ProtectedRoute roles={['ADMISSION_OFFICER', 'ADMIN']}><AdmissionPage /></ProtectedRoute>} />
          </Route>
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
