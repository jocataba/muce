import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import MisTareas from './pages/MisTareas';
import CrearTarea from './pages/CrearTarea';
import Reservas from './pages/Reservas';   // 👈 Ya importado

function AppRoutes() {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="flex justify-center items-center h-screen">Cargando...</div>;

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="mis-tareas" element={<MisTareas />} />
        {user.rol === 'admin' && <Route path="crear-tarea" element={<CrearTarea />} />}
        <Route path="reservas" element={<Reservas />} />   {/* 👈 NUEVA RUTA (visible para todos los roles) */}
      </Route>
      <Route path="/login" element={<Navigate to="/dashboard" />} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}