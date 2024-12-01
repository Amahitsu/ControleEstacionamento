import React from 'react';
import Header from '../../components/Header';
import TableHistorico from '../../components/TabelaHistorico';
import styles from '../../styles/Home.module.css';

const Historico: React.FC = () => {
  return (
    <div className={styles.container}>
      <Header />
      <h1 className="px-5 pt-5 pb-0 font-bold">Histórico veículos estacionados</h1>
      <main className={styles.mainContent}>
        <TableHistorico />
      </main>
    </div>
  );
};

export default Historico;
