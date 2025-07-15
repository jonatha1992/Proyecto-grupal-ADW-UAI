import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar, ProtectedRoute } from './components';
import { Home, Login, CrearTurno, MisTurnos, Precios, ChatBot } from './pages';
import './App.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/precios" element={<Precios />} />
              <Route path="/chatbot" element={<ChatBot />} />
              <Route 
                path="/crear-turno" 
                element={
                  <ProtectedRoute>
                    <CrearTurno />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/mis-turnos" 
                element={
                  <ProtectedRoute>
                    <MisTurnos />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
