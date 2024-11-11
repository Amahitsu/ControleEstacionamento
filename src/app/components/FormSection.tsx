// src/app/components/FormSection.tsx
"use client";

import { useEffect, useState } from 'react';
import { apiUrls } from '../config/config';
import styles from '../styles/Home.module.css';

const FormSection: React.FC = () => {
    const [placa, setPlaca] = useState('');
    const [modeloId, setModeloId] = useState<number | ''>(''); 
    const [tipoVeiculoId, setTipoVeiculoId] = useState<number | ''>(''); 
    const [cor, setCor] = useState(''); 
 //   const [modelos, setModelos] = useState<{ id: number; nomeModelo: string }[]>([]);
 //   const [tiposVeiculo, setTiposVeiculo] = useState<{ id: number; veiculo: string }[]>([]);

   {/* useEffect(() => {
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
    }, []); */}
    const handleAddPlaca = async () => {
        if (!placa || !modeloId || !tipoVeiculoId || !cor) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        console.log('Tentando adicionar placa:', { placa, modeloId, tipoVeiculoId, cor });

        try {
            const response = await fetch('/api/placa', {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({ placa, modeloId, tipoVeiculoId, cor }),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                console.error('Erro ao adicionar placa:', errorResponse);
                throw new Error('Erro ao adicionar a placa');
            }

            const newPlaca = await response.json();
            console.log('Placa adicionada:', newPlaca);

            setPlaca('');
            setModeloId('');
            setTipoVeiculoId('');
            setCor('');
        } catch (error) {
            console.error('Erro no handleAddPlaca:', error);
            alert('Não foi possível adicionar a placa');
        }
    };

    return (
        <div className={styles.formSection}>
            <input
                type="text"
                placeholder="Placa"
                value={placa}
                onChange={(e) => setPlaca(e.target.value)}
            />
            {/*
            <select
                className="w-full mb-2.5"
                value={modeloId}
                onChange={(e) => setModeloId(Number(e.target.value))}
            >
                <option value="" disabled>Selecione o Modelo</option>
                {modelos.length > 0 ? (
                    modelos.map((modelo) => (
                        <option key={modelo.id} value={modelo.id}>
                            {modelo.nomeModelo}
                        </option>
                    ))
                ) : (
                    <option value="" disabled>Nenhum modelo disponível</option>
                )}
            </select>
            <select
                className="w-full mb-2.5"
                value={tipoVeiculoId}
                onChange={(e) => setTipoVeiculoId(Number(e.target.value))}
            >
                <option value="" disabled>Selecione o Tipo de Veículo</option>
                {tiposVeiculo.length > 0 ? (
                    tiposVeiculo.map((tipo) => (
                        <option key={tipo.id} value={tipo.id}>
                            {tipo.veiculo}
                        </option>
                    ))
                ) : (
                    <option value="" disabled>Nenhum tipo disponível</option>
                )}
            </select>
            <input
                type="text"
                placeholder="Cor"
                value={cor}
                onChange={(e) => setCor(e.target.value)}
            />*/}
            <button className={styles.confirmButton} onClick={handleAddPlaca}>
                Confirmar
            </button>
        </div>
    );
};

export default FormSection;
