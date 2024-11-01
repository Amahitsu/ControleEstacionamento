"use client"; 

import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';

const Header: React.FC = () => {
    const [dateTime, setDateTime] = useState<string>(() => {
        const now = new Date();
        return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setDateTime(`${now.toLocaleDateString()} ${now.toLocaleTimeString()}`);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className={styles.header}>
            <div className={styles.dateTime}>{dateTime}</div>
            <div className={styles.statusIndicator}></div>
        </div>
    );
};

export default Header;
