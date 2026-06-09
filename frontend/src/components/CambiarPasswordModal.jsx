import { useState } from 'react';
import api from '../services/api';

export default function CambiarPasswordModal({ isOpen, onClose }) {
  const [passwordActual, setPasswordActual] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    if (nuevaPassword !== confirmar) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }
    if (nuevaPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setCargando(true);
    try {
      await api.put('/auth/cambiar-password', { passwordActual, nuevaPassword });
      setMensaje('Contraseña actualizada correctamente');
      setTimeout(() => {
        onClose();
        // Limpiar formulario
        setPasswordActual('');
        setNuevaPassword('');
        setConfirmar('');
        setMensaje('');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cambiar contraseña');
    } finally {
      setCargando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Cambiar contraseña</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Contraseña actual</label>
              <input type="password" value={passwordActual} onChange={(e) => setPasswordActual(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Nueva contraseña</label>
              <input type="password" value={nuevaPassword} onChange={(e) => setNuevaPassword(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Confirmar nueva contraseña</label>
              <input type="password" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
            </div>
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            {mensaje && <p className="text-green-500 text-sm mb-2">{mensaje}</p>}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancelar</button>
              <button type="submit" disabled={cargando} className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50">Cambiar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}