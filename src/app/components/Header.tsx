"use client";

import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';

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
            <div className={styles.dateTime}>{dateTime || "Carregando..."}</div>
            <ul className={styles.menu}>
                <li className="text-teal-600 mr-6 underline decoration-1"><a href="/">Veículos estacionados</a></li>
                <li className="text-teal-600 mr-6 underline decoration-1"><a href="/pages/historico">Histórico</a></li>
                <li className="text-teal-600 mr-6 underline decoration-1"><a href="/pages/cadastrarTarifa">Tarifas</a></li>
                <li className="text-teal-600 underline decoration-1"><a href="/pages/cadastrarPlaca">Placas</a></li>
            </ul>
            <div className={styles.statusIndicator}></div>
        </div>
    );
};

export default Header;

