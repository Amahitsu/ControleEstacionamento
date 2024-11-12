import TabelaTarifas from '@/app/components/TabelaTarifas';
import React from 'react';
import CadastrarTarifa from '../../components/CadastrarTarifa';
import Header from '../../components/Header';
import styles from '../../styles/Home.module.css';

const TarifaCadastro: React.FC = () => {
  return (
    <div className={styles.container}>
      <Header />
      <h1 className="px-5 pt-5 pb-0">Cadastrar Tarifa</h1>
      <main className={styles.mainContent}>
        <CadastrarTarifa />
        <TabelaTarifas />
      
      </main>
    </div>
  );
};

export default TarifaCadastro;
