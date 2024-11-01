"use client"; 

import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';

const Header: React.FC = () => {
    const [dateTime, setDateTime] = useState<string>(''); 

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
            <div className={styles.dateTime}>{dateTime}</div>
            <div className={styles.statusIndicator}></div>
        </div>
    );
};

export default Header;
