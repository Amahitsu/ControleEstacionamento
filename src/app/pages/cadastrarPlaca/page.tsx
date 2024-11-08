import React from 'react';
import CadastrarPlaca from '../../components/CadastrarPlaca';
import TablePlaca from '../../components/TabelaPlaca';
import styles from '../../styles/Home.module.css';

const PlacaCadastro: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.mainContent}>Placa - Cadastrar Placa</h1>
      <main className={styles.mainContent}>
        <CadastrarPlaca />
        <TablePlaca />
      </main>
    </div>
  );
};

export default PlacaCadastro;
