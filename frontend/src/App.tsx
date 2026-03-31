import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
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
          <Route path="/" element={<ProtectedRoute roles={['admin', 'admission_officer', 'management']}><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="masters" element={<ProtectedRoute roles={['admin']}><MastersPage /></ProtectedRoute>} />
            <Route path="seat-matrix" element={<ProtectedRoute roles={['admin']}><SeatMatrixPage /></ProtectedRoute>} />
            <Route path="applicants" element={<ProtectedRoute roles={['admin', 'admission_officer']}><ApplicantsPage /></ProtectedRoute>} />
            <Route path="admission" element={<ProtectedRoute roles={['admin', 'admission_officer']}><AdmissionPage /></ProtectedRoute>} />
          </Route>
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
