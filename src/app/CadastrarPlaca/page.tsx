import React from 'react';
import CadastrarPlaca from '../components/CadastrarPlaca';
import styles from '../styles/Home.module.css';
import TablePlaca from '../components/TablePlaca';

const PlacaCadastrada: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.mainContent}>Placa - Cadastrar Placa</h1>
      <CadastrarPlaca />
      <TablePlaca/>
    </div>
  );
};

export default PlacaCadastrada;
