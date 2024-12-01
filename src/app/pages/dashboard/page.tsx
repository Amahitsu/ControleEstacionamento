"use client";

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import Header from "../../components/Header";
import styles from "../../styles/Home.module.css";

// Registrar os componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  // Dados para o gráfico de barras (veículos estacionados por tipo)
  const barChartData = {
    labels: ["Carro", "Moto", "Caminhão"],
    datasets: [
      {
        label: "Veículos Estacionados",
        data: [30, 15, 5], // Substitua pelos dados reais
        backgroundColor: ["#3B82F6", "#10B981", "#F59E0B"],
      },
    ],
  };

  // Calcula o total de veículos estacionados
  const totalVeiculos = barChartData.datasets[0].data.reduce(
    (total, value) => total + value,
    0
  );

  // Dados para o gráfico de pizza (tarifas por tipo de veículo)
  const pieChartData = {
    labels: ["Carro", "Moto", "Caminhão"],
    datasets: [
      {
        label: "Distribuição de Tarifas",
        data: [500, 200, 300], // Substitua pelos dados reais
        backgroundColor: ["#3B82F6", "#10B981", "#F59E0B"],
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Para garantir que o gráfico se ajuste
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Para garantir que o gráfico se ajuste
  };

  return (
    <div className={styles.container}>
      <Header />
      <h1 className="px-5 pt-5 pb-0 font-bold">Dashboard</h1>
      <main className={styles.mainContent}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {/* Indicador de Total de Veículos Estacionados */}
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-center items-center">
            <h2 className="text-xl font-semibold mb-2">
              Total de Veículos Estacionados
            </h2>
            <p className="text-5xl font-bold">{totalVeiculos}</p>
          </div>

          <div className="bg-white shadow-md p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">
              Veículos Estacionados por Tipo
            </h2>
            <div className="chart-container h-[300px]">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </div>

          <div className="bg-white shadow-md p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">
              Distribuição de Tarifas
            </h2>
            <div className="chart-container h-[300px]">
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;