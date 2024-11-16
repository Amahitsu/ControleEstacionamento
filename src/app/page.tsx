// src/app/page.tsx
import { Metadata } from 'next';
import FormSection from '../app/components/FormSection';
import Header from '../app/components/Header';
import styles from '../app/styles/Home.module.css';
import TableSection from './components/TabelaCupom';


export const metadata: Metadata = {
    title: 'Tela de Controle',
    description: 'Controle de entradas e saídas',
};

const Home: React.FC = () => {
    return (
        <div className={styles.container}>
            <Header />
            <h1 className="px-5 pt-5 pb-0">Veículos Estacionados</h1>
            <main className={styles.mainContent}>
                <FormSection />
                <TableSection />
            </main>
        </div>
    );
};

export default Home;
