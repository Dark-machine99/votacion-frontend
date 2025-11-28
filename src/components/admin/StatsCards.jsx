// src/components/admin/StatsCards.jsx
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function StatsCards({ stats, elections = [], votesDistribution }) {
  // Valores seguros
  const participation = Number.isFinite(stats?.participation) ? Math.max(0, Math.min(100, stats.participation)) : 0;
  const users = stats?.totalUsers ?? 0;
  const totalElections = stats?.totalElections ?? 0;
  const totalVotes = stats?.totalVotes ?? 0;

  // Doughnut: participación vs no participación
  const doughnutData = {
    labels: ["Participación", "No participaron"],
    datasets: [
      {
        data: [Math.round(participation), 100 - Math.round(participation)],
        backgroundColor: ["#6C63FF", "#ff2ad480"],
        hoverOffset: 4,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { boxWidth: 14 } },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.parsed} %`,
        },
      },
    },
  };

  // Bar: estado de elecciones → métrica simple para visualizar mix de estados
  const labels = elections.map((e) => (e?.title || "").toString().slice(0, 18));
  const barValues = elections.map((e) =>
    e?.status === "Activa" ? 1 : e?.status === "Programada" ? 0.5 : 0
  );

  const barData = {
    labels,
    datasets: [
      {
        label: "Activa = 1 • Programada = 0.5 • Finalizada = 0",
        data: barValues,
        backgroundColor: "#ff2ad4",
        borderRadius: 8,
        barThickness: "flex",
        maxBarThickness: 48,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 0.5, max: 1 } },
      x: { ticks: { maxRotation: 0, autoSkip: true } },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const v = ctx.parsed.y;
            if (v === 1) return "Activa";
            if (v === 0.5) return "Programada";
            return "Finalizada";
          },
        },
      },
    },
  };

  return (
    <>
      <div className="grid grid-4" style={{ marginBottom: "1rem" }}>
        <div className="stat-card">
          <p className="small">Usuarios</p>
          <h2 style={{ margin: 0 }}>{users}</h2>
        </div>
        <div className="stat-card">
          <p className="small">Elecciones</p>
          <h2 style={{ margin: 0 }}>{totalElections}</h2>
        </div>
        <div className="stat-card">
          <p className="small">Votos emitidos</p>
          <h2 style={{ margin: 0 }}>{totalVotes}</h2>
        </div>
        <div className="stat-card">
          <p className="small">Participación</p>
          <h2 style={{ margin: 0 }}>{Math.round(participation)}%</h2>
        </div>
      </div>

      <div className="grid" style={{ alignItems: "stretch" }}>
        <div className="place-card" style={{ minHeight: 320 }}>
          <h4 style={{ marginTop: 0 }}>Distribución de participación</h4>
          {Number.isFinite(participation) ? (
            <div style={{ height: 260 }}>
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          ) : (
            <p className="empty">Sin datos de participación</p>
          )}
        </div>

        <div className="place-card" style={{ minHeight: 320 }}>
          <h4 style={{ marginTop: 0 }}>Estado de elecciones</h4>
          {labels.length > 0 ? (
            <div style={{ height: 260 }}>
              <Bar data={barData} options={barOptions} />
            </div>
          ) : (
            <p className="empty">Aún no hay elecciones para mostrar</p>
          )}
        </div>
      </div>
    </>
  );
}
