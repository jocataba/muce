import { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import api from '../services/api';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, completados: 0, retrasados: 0, enProgreso: 0 });

  useEffect(() => {
    api.get('/compromisos').then(res => {
      const tareas = res.data;
      const completados = tareas.filter(t => t.estado === 'Completado').length;
      const retrasados = tareas.filter(t => t.estado === 'Retrasado').length;
      const enProgreso = tareas.filter(t => t.estado === 'En progreso').length;
      setStats({
        total: tareas.length,
        completados,
        retrasados,
        enProgreso
      });
    });
  }, []);

  const dataPie = {
    labels: ['Completados', 'En progreso', 'Retrasados'],
    datasets: [{ data: [stats.completados, stats.enProgreso, stats.retrasados], backgroundColor: ['#22c55e', '#3b82f6', '#ef4444'] }]
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow"><div className="text-gray-500">Total tareas</div><div className="text-3xl font-bold">{stats.total}</div></div>
        <div className="bg-white p-4 rounded shadow"><div className="text-gray-500">Completadas</div><div className="text-3xl font-bold text-green-600">{stats.completados}</div></div>
        <div className="bg-white p-4 rounded shadow"><div className="text-gray-500">Retrasadas</div><div className="text-3xl font-bold text-red-600">{stats.retrasados}</div></div>
      </div>
      <div className="bg-white p-4 rounded shadow w-80">
        <Pie data={dataPie} />
      </div>
    </div>
  );
}