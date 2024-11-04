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

        updateDateTime(); // Atualiza imediatamente após o componente ser montado
        const timer = setInterval(updateDateTime, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className={styles.header}>
            <div className={styles.dateTime}>{dateTime || "Carregando..."}</div>
            <div className={styles.statusIndicator}></div>
        </div>
    );
};

export default Header;

