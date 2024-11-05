import React from 'react';
import CadastrarTarifas from '../components/CadastrarTarifa'; // Ajuste o caminho conforme necessário
import styles from '../styles/Home.module.css';

const TarifaCadastrada: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.mainContent}>Segunda Tela - Cadastrar Tarifa</h1>
      <CadastrarTarifas />
    </div>
  );
};

export default TarifaCadastrada;
