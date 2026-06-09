import { useEffect, useState } from 'react';
import api from '../services/api';
import TareaCard from '../components/TareaCard';

export default function MisTareas() {
  const [tareas, setTareas] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    const res = await api.get('/compromisos');
    console.log('Datos recibidos:', res.data);
    setTareas(res.data);
  };

  // Filtrar: por estado y por texto (compromiso o responsable)
  const tareasFiltradas = tareas.filter(tarea => {
    // Filtro por estado
    if (filtroEstado !== 'todos' && tarea.estado !== filtroEstado) return false;
    
    // Filtro por texto de búsqueda
    if (busqueda.trim() !== '') {
      const texto = busqueda.trim().toLowerCase();
      const compromiso = tarea.compromiso?.toLowerCase() || '';
      const responsable = tarea.responsable?.nombre?.toLowerCase() || '';
      if (!compromiso.includes(texto) && !responsable.includes(texto)) return false;
    }
    return true;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mis Tareas Asignadas</h1>

      <div className="mb-6 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-gray-700 font-medium mb-1">
            🔍 Buscar por tarea o responsable:
          </label>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Escribe una palabra clave..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            📊 Filtrar por estado:
          </label>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="todos">📋 Todas las tareas</option>
            <option value="Pendiente">⏳ Pendiente</option>
            <option value="En progreso">🔄 En progreso</option>
            <option value="Completado">✅ Completado</option>
            <option value="Retrasado">⚠️ Retrasado</option>
            <option value="Bloqueado">🚫 Bloqueado</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tareasFiltradas.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-10 bg-white rounded-lg shadow">
            No hay tareas que coincidan con los filtros.
          </div>
        ) : (
          tareasFiltradas.map(tarea => (
            <TareaCard key={tarea.id} tarea={tarea} onUpdate={cargar} />
          ))
        )}
      </div>
    </div>
  );
}