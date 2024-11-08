import React from 'react';
import CadastrarTarifa from '../../components/CadastrarTarifa';
import TablePlaca from '../../components/TabelaPlaca';
import styles from '../../styles/Home.module.css';

const TarifaCadastro: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.mainContent}>Placa - Cadastrar Placa</h1>
      <main className={styles.mainContent}>
        <CadastrarTarifa />
        <TablePlaca />
      </main>
    </div>
  );
};

export default TarifaCadastro;
