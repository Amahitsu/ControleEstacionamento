// src/components/FormSection.tsx
import styles from '../styles/Home.module.css';

const FormSection: React.FC = () => {
    return (
        <div className={styles.formSection}>
            <input type="text" placeholder="Placa" disabled />
            <input type="text" placeholder="Modelo" disabled />
            <input type="text" placeholder="Descrição" disabled />
            <button className={styles.confirmButton}>Confirmar</button>
            <div className={styles.colorButtons}>
                <div className={`${styles.button} ${styles.blue}`}></div>
                <div className={`${styles.button} ${styles.yellow}`}></div>
                <div className={`${styles.button} ${styles.red}`}></div>
            </div>
        </div>
    );
};

export default FormSection;
