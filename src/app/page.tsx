// src/app/page.tsx
import { Metadata } from 'next';
import Header from '../app/components/Header'; 
import FormSection from '../app/components/FormSection'; 
import TableSection from '../app/components/TableSection';
import styles from '../app/styles/Home.module.css'; 


export const metadata: Metadata = {
    title: 'Tela de Controle',
    description: 'Controle de entradas e saídas',
};

const Home: React.FC = () => {
    return (
        <div className={styles.container}>
            <Header />
            <main className={styles.mainContent}>
                <FormSection />
                <TableSection />
            </main>
        </div>
    );
};

export default Home;
