import React from 'react';
import CadastrarTarifa from '../../components/CadastrarTarifa';
import styles from '../../styles/Home.module.css';
import TableTarifas from '@/app/components/TabelaTarifas';

const TarifaCadastro: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.mainContent}>Placa - Cadastrar Placa</h1>
      <main className={styles.mainContent}>
        <CadastrarTarifa />
        <TableTarifas />
      </main>
    </div>
  );
};

export default TarifaCadastro;
