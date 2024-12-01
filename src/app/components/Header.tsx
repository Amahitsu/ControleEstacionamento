"use client";

import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

const Header: React.FC = () => {
  const [dateTime, setDateTime] = useState<string | null>(null);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setDateTime(`${now.toLocaleDateString()} ${now.toLocaleTimeString()}`);
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.header}>
      <div className="flex flex-col md:flex-row items-center justify-between">
        {/* Data e hora */}
        <div className="text-gray-700 text-sm mb-2 md:mb-0">
          {dateTime || "Carregando..."}
        </div>

        {/* Menu */}
        <ul className="flex flex-wrap justify-center gap-4 text-sm text-teal-600 underline decoration-1">
          <li><a href="/pages/cadastrarPlaca">Placas</a></li>
          <li><a href="/">Veículos estacionados</a></li>
          <li><a href="/pages/historico">Histórico</a></li>
          <li><a href="/pages/cadastrarTarifa">Tarifas</a></li>
          <li><a href="/pages/dashboard">Dashboard</a></li>
        </ul>

        {/* Indicador de status */}
        <div className="hidden md:block h-4 w-4 rounded-full bg-green-600"></div>
      </div>
    </div>
  );
};

export default Header;
