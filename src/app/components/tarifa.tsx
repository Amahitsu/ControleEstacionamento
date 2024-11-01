"use client";

import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';

const TarifaForm: React.FC = () => {
    const [tipoVeiculo, setTipoVeiculo] = useState('');
    const [valorHora, setValorHora] = useState('');
    const [tiposVeiculo, setTiposVeiculo] = useState<{ nomeTipo: string }[]>([]);

    useEffect(() => {
        const fetchTiposVeiculo = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/tipoVeiculo'); 
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
        if (!tipoVeiculo || !valorHora) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        try {
            const response = await fetch('/api/tarifa', { 
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({ tipoVeiculo, valorHora }),
            });

            if (!response.ok) throw new Error('Erro ao cadastrar a tarifa');

            const newTarifa = await response.json();
            console.log('Tarifa cadastrada:', newTarifa);

            setTipoVeiculo('');
            setValorHora('');
        } catch (error) {
            console.error(error);
            alert('Não foi possível cadastrar a tarifa');
        }
    };

    return (
        <div className={styles.formSection}>
            <h2>Cadastrar Tarifa</h2>
            <select
                value={tipoVeiculo}
                onChange={(e) => setTipoVeiculo(e.target.value)}
            >
                <option value="" disabled>Selecione o Tipo de Veículo</option>
                {tiposVeiculo.length > 0 ? (
                    tiposVeiculo.map((tipo, index) => (
                        <option key={index} value={tipo.nomeTipo}>
                            {tipo.nomeTipo}
                        </option>
                    ))
                ) : (
                    <option value="" disabled>Nenhum tipo disponível</option>
                )}
            </select>
            <input
                type="number"
                placeholder="Valor da Hora (R$)"
                value={valorHora}
                onChange={(e) => setValorHora(e.target.value)}
            />
            <button className={styles.confirmButton} onClick={handleAddTarifa}>
                Cadastrar Tarifa
            </button>
        </div>
    );
};

export default TarifaForm;
