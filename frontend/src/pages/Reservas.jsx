import { useEffect, useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import api from '../services/api';

export default function Reservas() {
  const [calendario, setCalendario] = useState([]);
  const [misActivas, setMisActivas] = useState([]);
  const [historialList, setHistorialList] = useState([]);
  const [showHistorial, setShowHistorial] = useState(false);
  const [fechaCalendario, setFechaCalendario] = useState('');
  const [salaCalendario, setSalaCalendario] = useState('Sala 1');
  const [horasOcupadasMap, setHorasOcupadasMap] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalForm, setModalForm] = useState({
    sala: '',
    fecha: '',
    hora_inicio: '',
    hora_fin: '',
    tema: ''
  });
  const [horasFinDisponibles, setHorasFinDisponibles] = useState([]);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const horasEnteras = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
  const hoy = new Date().toISOString().slice(0, 10);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.rol === 'admin';

  // Cargar calendario (todas las reservas de sala+fecha)
  const cargarCalendario = async () => {
    if (!fechaCalendario) return;
    try {
      const res = await api.get(`/reservas?sala=${salaCalendario}&fecha=${fechaCalendario}`);
      setCalendario(res.data);
      const ocupadas = {};
      res.data.forEach(r => {
        const inicio = parseInt(r.hora_inicio.substring(0,2));
        const fin = parseInt(r.hora_fin.substring(0,2));
        for (let h = inicio; h < fin; h++) {
          ocupadas[`${h.toString().padStart(2,'0')}:00`] = r;
        }
      });
      setHorasOcupadasMap(ocupadas);
    } catch (error) {
      console.error(error);
    }
  };

  const cargarMisActivas = async () => {
    try {
      const res = await api.get('/reservas');
      let activas = res.data.filter(r => r.fecha >= hoy);
      setMisActivas(activas);
    } catch (error) {
      console.error(error);
    }
  };

  const cargarHistorial = async () => {
    try {
      const res = await api.get('/reservas');
      let pasado = res.data.filter(r => r.fecha < hoy);
      setHistorialList(pasado);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (fechaCalendario) cargarCalendario();
  }, [fechaCalendario, salaCalendario]);

  useEffect(() => {
    cargarMisActivas();
    cargarHistorial();
  }, []);

  const abrirModalReserva = (hora) => {
    setModalForm({
      sala: salaCalendario,
      fecha: fechaCalendario,
      hora_inicio: hora,
      hora_fin: '',
      tema: ''
    });
    setError('');
    setHorasFinDisponibles([]);
    setModalOpen(true);
  };

  // Calcular horas fin disponibles respetando la próxima reserva
  const actualizarHorasFinDisponibles = async (horaInicio) => {
    if (!modalForm.sala || !modalForm.fecha) return;
    try {
      const res = await api.get(`/reservas?sala=${modalForm.sala}&fecha=${modalForm.fecha}`);
      const reservas = res.data;
console.log('Reservas obtenidas:', reservas); 
      const horasInicioReservas = reservas.map(r => parseInt(r.hora_inicio.substring(0,2))).sort((a,b) => a - b);
      const horaInicioNum = parseInt(horaInicio);
      let proximaInicio = null;
      for (let h of horasInicioReservas) {
        if (h > horaInicioNum) {
          proximaInicio = h;
          break;
        }
      }
      const limite = proximaInicio !== null ? proximaInicio : 24;
      let posibles = [];
      for (let h = horaInicioNum + 1; h <= limite && h <= 23; h++) {
        posibles.push(`${h.toString().padStart(2, '0')}:00`);
      }
      setHorasFinDisponibles(posibles);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (modalOpen && modalForm.hora_inicio && modalForm.fecha && modalForm.sala) {
      actualizarHorasFinDisponibles(modalForm.hora_inicio);
    }
  }, [modalForm.hora_inicio, modalForm.fecha, modalForm.sala, modalOpen]);

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setModalForm(prev => ({ ...prev, [name]: value }));
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!modalForm.hora_fin) {
      setError('Debe seleccionar hora fin');
      return;
    }
    const idxInicio = horasEnteras.indexOf(modalForm.hora_inicio);
    const idxFin = horasEnteras.indexOf(modalForm.hora_fin);
    if (idxFin <= idxInicio) {
      setError('La hora fin debe ser posterior a la inicio');
      return;
    }
    setCargando(true);
    try {
      await api.post('/reservas', modalForm);
      alert('Reserva creada exitosamente');
      setModalOpen(false);
      cargarCalendario();
      cargarMisActivas();
      cargarHistorial();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear reserva');
    } finally {
      setCargando(false);
    }
  };

  const cancelar = async (id) => {
    if (window.confirm('¿Cancelar esta reserva?')) {
      await api.delete(`/reservas/${id}`);
      cargarMisActivas();
      cargarHistorial();
      if (fechaCalendario && salaCalendario) cargarCalendario();
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Reservas de Salas</h1>

      {/* CALENDARIO INTERACTIVO */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Calendario de reservas</h2>
        </div>
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">Sala</label>
            <select value={salaCalendario} onChange={(e) => setSalaCalendario(e.target.value)} className="w-full border rounded-lg px-3 py-2">
              <option>Sala 1</option><option>Sala 2</option><option>Sala 3</option><option>Sala 4</option>
            </select>
          </div>
          <div className="w-56">
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <input type="date" value={fechaCalendario} onChange={(e) => setFechaCalendario(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div className="flex items-end">
            <button onClick={() => setFechaCalendario(hoy)} className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg">Hoy</button>
          </div>
        </div>

        {!fechaCalendario ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-400">Selecciona una fecha</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {horasEnteras.map(hora => {
              const reserva = horasOcupadasMap[hora];
              const isOccupied = !!reserva;
              const isOwn = reserva && reserva.usuario_id === user.id; // <-- cualquier usuario, sus reservas en amarillo
              return (
                <div
                  key={hora}
                  onClick={() => !isOccupied && abrirModalReserva(hora)}
                  className={`text-center p-2 rounded-lg border transition cursor-pointer ${
                    isOccupied
                      ? (isOwn ? 'bg-yellow-100 border-yellow-300 cursor-default' : 'bg-red-50 border-red-200 cursor-not-allowed')
                      : 'bg-green-50 border-green-200 hover:bg-green-100 hover:shadow'
                  }`}
                  title={isOccupied ? `${reserva.tema} - ${reserva.usuario?.nombre}${isOwn ? ' (Tu reserva)' : ''}` : 'Click para reservar'}
                >
                  <div className="font-mono font-bold text-sm">{hora}</div>
                  {isOccupied && <div className="text-xs truncate mt-1">{reserva.tema.substring(0,12)}...</div>}
                </div>
              );
            })}
          </div>
        )}
        <div className="flex gap-4 mt-4 text-xs text-gray-500">
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div> Libre (click)</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-50 border border-red-200 rounded"></div> Ocupada por otro</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div> Tu reserva</div>
        </div>
      </div>

      {/* MODAL PARA NUEVA RESERVA */}
      <Transition appear show={modalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setModalOpen(false)}>
          <Transition.Child as={Fragment}><div className="fixed inset-0 bg-black/25" /></Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl">
                <Dialog.Title className="text-lg font-medium">Nueva reserva</Dialog.Title>
                <form onSubmit={handleModalSubmit} className="mt-4 space-y-4">
                  <div><label className="block text-sm font-medium">Sala</label><input type="text" value={modalForm.sala} disabled className="w-full border bg-gray-100 rounded p-2" /></div>
                  <div><label className="block text-sm font-medium">Fecha</label><input type="text" value={modalForm.fecha} disabled className="w-full border bg-gray-100 rounded p-2" /></div>
                  <div><label className="block text-sm font-medium">Hora inicio</label><input type="text" value={modalForm.hora_inicio} disabled className="w-full border bg-gray-100 rounded p-2" /></div>
                  <div>
                    <label className="block text-sm font-medium">Hora fin</label>
                    <select name="hora_fin" value={modalForm.hora_fin} onChange={handleModalChange} required className="w-full border rounded p-2">
                      <option value="">Seleccione</option>
                      {horasFinDisponibles.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Tema de la reunión</label>
                    <input type="text" name="tema" value={modalForm.tema} onChange={handleModalChange} required className="w-full border rounded p-2" placeholder="Ej: Planificación" />
                  </div>
                  {error && <p className="text-red-600 text-sm">{error}</p>}
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
                    <button type="submit" disabled={cargando} className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50">Reservar</button>
                  </div>
                </form>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Mis reservas activas */}
      <div className="bg-white p-5 rounded-xl shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-3">📌 Mis reservas activas</h2>
        {misActivas.length === 0 ? <p className="text-gray-500">No hay reservas activas.</p> : (
          <ul className="space-y-3">
            {misActivas.map(r => {
              const isOwn = r.usuario_id === user.id;
              return (
                <li key={r.id} className={`border rounded-lg p-3 flex justify-between items-center ${isOwn ? 'bg-yellow-50' : ''}`}>
                  <div>
                    <div><strong>{r.sala}</strong> – {r.fecha} de {r.hora_inicio} a {r.hora_fin}</div>
                    <div className="text-sm text-gray-600">{r.tema}</div>
                    {isAdmin && !isOwn && <div className="text-xs text-gray-500">Reservado por: {r.usuario?.nombre}</div>}
                  </div>
                  {isOwn && (
                    <button onClick={() => cancelar(r.id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Cancelar</button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Historial */}
      <div className="bg-white p-5 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">📜 Historial de reservas</h2>
          <button onClick={() => setShowHistorial(!showHistorial)} className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-lg hover:bg-indigo-200">
            {showHistorial ? 'Ocultar historial' : 'Ver historial'}
          </button>
        </div>
        {showHistorial && (
          <>
            {historialList.length === 0 ? <p className="text-gray-500">No hay reservas pasadas.</p> : (
              <ul className="space-y-2">
                {historialList.map(r => (
                  <li key={r.id} className="border p-3 rounded-lg text-gray-600">
                    <div><strong>{r.sala}</strong> – {r.fecha} de {r.hora_inicio} a {r.hora_fin}</div>
                    <div className="text-sm">{r.tema}</div>
                    {isAdmin && <div className="text-xs text-gray-500">Reservado por: {r.usuario?.nombre}</div>}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}