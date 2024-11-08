"use client";

import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { apiUrls } from '../config/config';

const FormSection: React.FC = () => {
    const [horaCobrada, setHoraCobrada] = useState('');
    const [tipoVeiculo, setTipoVeiculo] = useState('');
    const [valor, setValor] = useState('');
    const [tiposVeiculo, setTiposVeiculo] = useState<{ veiculo: string }[]>([]);

    useEffect(() => {
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

        fetchTiposVeiculo();
    }, []);

    const handleAddTarifa = async () => {
        if (!horaCobrada || !tipoVeiculo || !valor) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        try {
            const response = await fetch('/api/tarifa', { 
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({ horaCobrada, tipoVeiculo, valor }),
            });

            if (!response.ok) throw new Error('Erro ao adicionar a tarifa');

            const newTarifa = await response.json();
            console.log('Tarifa adicionada:', newTarifa);

            setHoraCobrada('');
            setTipoVeiculo('');
            setValor('');
        } catch (error) {
            console.error(error);
            alert('Não foi possível adicionar a tarifa');
        }
    };

    return (
        <div className={styles.formSection}>
            <input
                type="text"
                placeholder="Hora Cobrada"
                value={horaCobrada}
                onChange={(e) => setHoraCobrada(e.target.value)}
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
            <input
                type="text"
                placeholder="Valor"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
            />
            <button className={styles.confirmButton} onClick={handleAddTarifa}>
                Confirmar
            </button>
        </div>
    );
};

export default FormSection;
