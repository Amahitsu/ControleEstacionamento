import React from 'react';
import CadastrarPlaca from '../../components/CadastrarPlaca';
import Header from '../../components/Header';
import TablePlaca from '../../components/TabelaPlaca';
import styles from '../../styles/Home.module.css';

const PlacaCadastro: React.FC = () => {
  return (
    <div className={styles.container}>
      <Header />
      <h1 className="px-5 pt-5 pb-0">Cadastrar Placa</h1>
      <main className={styles.mainContent}>
        <CadastrarPlaca />
        <TablePlaca />
      </main>
    </div>
  );
};

export default PlacaCadastro;
