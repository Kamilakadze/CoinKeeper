import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import PrivateRoute from './components/PrivateRoute';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './assets/styles/index.css'; // Tailwind должен быть здесь
// Удалим import './App.css' — он не нужен

function App() {
    return (
        <Provider store={store}>
            <Router>
                {/* Глобальный фон и стиль */}
                <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white font-sans">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/dashboard"
                            element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/stats"
                            element={
                                <PrivateRoute>
                                    <Statistics />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/settings"
                            element={
                                <PrivateRoute>
                                    <Settings />
                                </PrivateRoute>
                            }
                        />
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>

                    <ToastContainer position="top-right" autoClose={3000} theme="dark" />
                </div>
            </Router>
        </Provider>
    );
}

export default App;
