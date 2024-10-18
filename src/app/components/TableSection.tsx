// src/components/TableSection.tsx
import styles from '../styles/Home.module.css';

const TableSection: React.FC = () => {
    return (
        <div className={styles.tableSection}>
            <table>
                <thead>
                    <tr>
                        <th>Cupom</th>
                        <th>Hr Entrada</th>
                        <th>Placa</th>
                        <th>Modelo</th>
                        <th>Descrição</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className={styles.redText}>1023</td>
                        <td className={styles.redText}>21:25</td>
                        <td className={styles.redText}>FFF3520</td>
                        <td className={styles.redText}>HB20</td>
                        <td className={styles.redText}>Cinza</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default TableSection;
