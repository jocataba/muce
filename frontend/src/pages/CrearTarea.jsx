import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import Select from 'react-select';   // 👈 IMPORTAR

export default function CrearTarea() {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [usuarios, setUsuarios] = useState([]);
  const [selectedResponsable, setSelectedResponsable] = useState(null);

  // Cargar usuarios y transformarlos para react-select
  useEffect(() => {
    api.get('/usuarios').then(res => {
      const opciones = res.data.map(u => ({
        value: u.id,
        label: `${u.nombre} `
      }));
      setUsuarios(opciones);
    });
  }, []);

  // Manejar cambio en el select
  const handleResponsableChange = (selected) => {
    setSelectedResponsable(selected);
    setValue('responsable_id', selected ? selected.value : '');
  };

  const onSubmit = async (data) => {
    // Validar que se haya seleccionado un responsable
    if (!selectedResponsable) {
      alert('Debes seleccionar un responsable');
      return;
    }
    try {
      await api.post('/compromisos', data);
      alert('Tarea creada');
      reset();
      setSelectedResponsable(null);
      setValue('responsable_id', '');
    } catch (error) {
      alert('Error al crear');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Asignar nuevo compromiso</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Fecha reunión */}
        <div>
          <label className="block font-medium">Fecha reunión</label>
          <input type="date" {...register('fecha_reunion')} className="w-full border rounded p-2" required />
        </div>

        {/* Tipo reunión */}
        <div>
          <label className="block font-medium">Tipo reunión</label>
          <select {...register('tipo_reunion')} className="w-full border rounded p-2" required>
            <option>Gabinete</option>
            <option>Estratégica</option>
            <option>Ejecutiva</option>
            <option>Alcalde-Subalcaldes</option>
          </select>
        </div>

        {/* Compromiso */}
        <div>
          <label className="block font-medium">Compromiso</label>
          <textarea {...register('compromiso')} rows={3} className="w-full border rounded p-2" required />
        </div>

        {/* Responsable con autocompletado */}
        <div>
          <label className="block font-medium">Responsable</label>
          <Select
            options={usuarios}
            value={selectedResponsable}
            onChange={handleResponsableChange}
            placeholder="Buscar por nombre o email..."
            isClearable
            noOptionsMessage={() => "No hay usuarios"}
            className="mt-1"
          />
          {/* Campo oculto para react-hook-form (opcional) */}
          <input type="hidden" {...register('responsable_id')} />
        </div>

        {/* Fecha compromiso */}
        <div>
          <label className="block font-medium">Fecha compromiso</label>
          <input type="date" {...register('fecha_compromiso')} className="w-full border rounded p-2" required />
        </div>

        {/* Fecha vencimiento */}
        <div>
          <label className="block font-medium">Fecha vencimiento</label>
          <input type="date" {...register('fecha_vencimiento')} className="w-full border rounded p-2" required />
        </div>

        {/* Evidencia */}
        <div>
          <label className="block font-medium">Evidencia (URL)</label>
          <input type="url" {...register('evidencia')} className="w-full border rounded p-2" />
        </div>

        <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700">
          Asignar tarea
        </button>
      </form>
    </div>
  );
}