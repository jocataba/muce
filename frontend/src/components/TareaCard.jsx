import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import api from '../services/api';

export default function TareaCard({ tarea, onUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [avance, setAvance] = useState(tarea.avance);
  const [estado, setEstado] = useState(tarea.estado);
  const [observacion, setObservacion] = useState('');
// Formatea fecha YYYY-MM-DD a DD/MM/YYYY
const formatearFecha = (fecha) => {
  if (!fecha) return 'No definida';
  const partes = fecha.split('-');
  if (partes.length !== 3) return fecha;
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.put(`/compromisos/${tarea.id}`, { avance, estado, observacion });
    setIsOpen(false);
    onUpdate();
  };

  const getBgColor = () => {
    if (tarea.estado === 'Completado') return 'border-l-4 border-green-500';
    if (tarea.estado === 'Retrasado') return 'border-l-4 border-red-500';
    return 'border-l-4 border-blue-500';
  };

  return (
    <>
      <div className={`bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition ${getBgColor()}`} onClick={() => setIsOpen(true)}>
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">{tarea.compromiso.substring(0, 60)}...</h3>
          <span className="text-xs text-gray-500">ID #{tarea.id}</span>
        </div>
        <p className="text-sm text-gray-600 mt-2">Responsable: {tarea.responsable?.nombre || '?'}</p>

{/* Mostrar evidencia si existe */}
{tarea.evidencia && (
  <p className="text-sm text-gray-600 mt-1">
    📎 Evidencia:{' '}
    <a
      href={tarea.evidencia}
      target="_blank"
      rel="noopener noreferrer"
      className="text-indigo-600 hover:underline"
    >
      Ver documento
    </a>
  </p>
)}

<p className="text-sm text-gray-600">Vence: {formatearFecha(tarea.fecha_vencimiento)}</p>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${tarea.avance}%` }}></div>
        </div>
        <div className="flex justify-between mt-1 text-xs">
          <span>{tarea.avance}%</span>
          <span className={`font-medium ${tarea.estado === 'Retrasado' ? 'text-red-600' : 'text-green-600'}`}>{tarea.estado}</span>
        </div>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
          <Transition.Child as={Fragment}><div className="fixed inset-0 bg-black/25" /></Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl">
                <Dialog.Title className="text-lg font-medium">Actualizar avance</Dialog.Title>
                <p className="mt-1 text-sm text-gray-500">{tarea.compromiso}</p>
                <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium">% Avance</label>
                    <input type="number" min="0" max="100" value={avance} onChange={e => setAvance(e.target.value)} className="mt-1 w-full border rounded p-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Estado</label>
                    <select value={estado} onChange={e => setEstado(e.target.value)} className="mt-1 w-full border rounded p-2">
                      <option>Pendiente</option><option>En progreso</option><option>Completado</option><option>Retrasado</option><option>Bloqueado</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Observación (opcional)</label>
                    <textarea rows={3} value={observacion} onChange={e => setObservacion(e.target.value)} className="mt-1 w-full border rounded p-2" />
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm bg-gray-200 rounded">Cancelar</button>
                    <button type="submit" className="px-4 py-2 text-sm bg-indigo-600 text-white rounded">Guardar</button>
                  </div>
                </form>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}