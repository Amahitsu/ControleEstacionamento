// src/components/Header.tsx
import styles from '../styles/Home.module.css';

const Header: React.FC = () => {
    return (
        <div className={styles.header}>
            <div className={styles.dateTime}>24/10/2024 21:18</div>
            <div className={styles.statusIndicator}></div>
        </div>
    );
};

export default Header;
