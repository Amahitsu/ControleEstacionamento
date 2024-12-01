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
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
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
  interface VeiculoPorTipo {
    tipoVeiculo: string;
    quantidade: number;
  }

  interface TotalAReceberPorTipo {
    tipoVeiculo: string;
    totalAReceber: number;
  }

  interface DashboardData {
    veiculosPorTipo: VeiculoPorTipo[];
    totalAReceberPorTipo: TotalAReceberPorTipo[];
    totalVeiculosEstacionados: number | { totalVeiculosEstacionados: number }[];
  }

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/dashboard");
        const data = await response.json();

        console.log("Dados retornados da API:", data); // Verifique a estrutura

        if (data?.data) {
          setDashboardData(data.data);
        } else {
          console.error("Erro ao carregar dados", data?.error);
        }
      } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
      }
    };

    fetchData();
  }, []);

  if (!dashboardData) return (
    <div className={styles.container}>
      <Header />
      <h1 className="px-5 pt-5 pb-0 font-bold">Dashboard</h1>
      <main className={styles.mainContent}>Carregando...</main>
    </div>
  );

  // Acessando o totalVeiculosEstacionados corretamente
  const totalVeiculosEstacionados = Array.isArray(dashboardData.totalVeiculosEstacionados)
    ? dashboardData.totalVeiculosEstacionados[0]?.totalVeiculosEstacionados || 0
    : dashboardData.totalVeiculosEstacionados || 0;

  // Dados para o gráfico de barras (veículos estacionados por tipo)
  const barChartData = {
    labels: dashboardData.veiculosPorTipo.map(
      (item: VeiculoPorTipo) => item.tipoVeiculo
    ),
    datasets: [
      {
        label: "Veículos Estacionados",
        data: dashboardData.veiculosPorTipo.map(
          (item: VeiculoPorTipo) => item.quantidade
        ),
        backgroundColor: ["#3B82F6", "#10B981", "#F59E0B"],
      },
    ],
  };

  // Dados para o gráfico de barras (total a receber por tipo de veículo)
  const barChartDataReceber = {
    labels: dashboardData.totalAReceberPorTipo.map(
      (item: TotalAReceberPorTipo) => item.tipoVeiculo
    ),
    datasets: [
      {
        label: "Total a Receber",
        data: dashboardData.totalAReceberPorTipo.map(
          (item: TotalAReceberPorTipo) => item.totalAReceber
        ),
        backgroundColor: ["#3B82F6", "#10B981", "#F59E0B"],
      },
    ],
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
            <p className="text-5xl font-bold">
              {totalVeiculosEstacionados} {/* Exibe 0 se não houver veículos */}
            </p>
          </div>

          <div className="bg-white shadow-md p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">
              Veículos Estacionados por Tipo
            </h2>
            <div className="chart-container h-[300px]">
              <Bar
                data={barChartData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </div>

          <div className="bg-white shadow-md p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">
              Total a Receber por Tipo de Veículo
            </h2>
            <div className="chart-container h-[300px]">
              <Bar
                data={barChartDataReceber}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
