"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Importa useRouter para navegação
import styles from '../styles/Home.module.css';
import { apiUrls } from '../config/config';

const FormSection: React.FC = () => {
    const router = useRouter(); // Instância do roteador para navegação
    const [placa, setPlaca] = useState('');
    const [tipoVeiculo, setTipoVeiculo] = useState('');
    const [modelo, setModelo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [color, setColor] = useState('');
    const [modelos, setModelos] = useState<{ nomeModelo: string }[]>([]);
    const [tiposVeiculo, setTiposVeiculo] = useState<{ veiculo: string }[]>([]);

    useEffect(() => {
        const fetchModelos = async () => {
            try {
                const response = await fetch(apiUrls.modelos);
                if (!response.ok) throw new Error('Erro ao buscar modelos');
                
                const data = await response.json();
                console.log('Modelos recebidos:', data);
                
                if (Array.isArray(data.data)) {
                    setModelos(data.data);
                } else {
                    console.warn('O retorno não é um array:', data.data);
                    setModelos([]);
                }
            } catch (error) {
                console.error(error);
                alert('Não foi possível carregar os modelos');
            }
        };

        const fetchTiposVeiculo = async () => {
            try {
                const response = await fetch(apiUrls.tipoVeiculo); 
                if (!response.ok) throw new Error('Erro ao buscar tipos de veículos');
                
                const data = await response.json();
                console.log('Tipos de veículos recebidos:', data);
                
                if (Array.isArray(data.data)) {
                    setTiposVeiculo(data.data);
                } else {
                    console.warn('O retorno não é um array:', data.data);
                    setTiposVeiculo([]);
                }
            } catch (error) {
                console.error(error);
                alert('Não foi possível carregar os tipos de veículos');
            }
        };

        fetchModelos();
        fetchTiposVeiculo();
    }, []);

    const handleAddCar = async () => {
        if (!placa || !tipoVeiculo || !modelo || !descricao || !color) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        try {
            const response = await fetch('/api/cupom', { 
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({ placa, tipoVeiculo, modelo, descricao, color }),
            });

            if (!response.ok) throw new Error('Erro ao adicionar o carro');

            const newCar = await response.json();
            console.log('Carro adicionado:', newCar);

            setPlaca('');
            setTipoVeiculo('');
            setModelo('');
            setDescricao('');
            setColor('');
        } catch (error) {
            console.error(error);
            alert('Não foi possível adicionar o carro');
        }
    };

    const handleNavigateToTarifa = () => {
        router.push('/tarifa'); 
    };

    return (
        <div className={styles.formSection}>
            <input
                type="text"
                placeholder="Placa"
                value={placa}
                onChange={(e) => setPlaca(e.target.value)}
            />
            <select
                value={tipoVeiculo}
                onChange={(e) => setTipoVeiculo(e.target.value)}
            >
                <option value="" disabled>Selecione o Tipo de Veículo</option>
                {tiposVeiculo.length > 0 ? (
                    tiposVeiculo.map((tipo, index) => (
                        <option key={index} value={tipo.veiculo}>
                            {tipo.veiculo}
                        </option>
                    ))
                ) : (
                    <option value="" disabled>Nenhum tipo disponível</option>
                )}
            </select>
            <select
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
            >
                <option value="" disabled>Selecione o Modelo</option>
                {modelos.length > 0 ? (
                    modelos.map((modelo, index) => (
                        <option key={index} value={modelo.nomeModelo}>
                            {modelo.nomeModelo}
                        </option>
                    ))
                ) : (
                    <option value="" disabled>Nenhum modelo disponível</option>
                )}
            </select>
            <input
                type="text"
                placeholder="Descrição"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
            />
            <input
                type="text"
                placeholder="Cor"
                value={color}
                onChange={(e) => setColor(e.target.value)}
            />
            <button className={styles.confirmButton} onClick={handleAddCar}>
                Confirmar
            </button>
            <button className={styles.navigateButton} onClick={handleNavigateToTarifa}>
                Cadastrar Tarifa
            </button>
        </div>
    );
};

export default FormSection;
