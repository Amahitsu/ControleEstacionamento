"use client";

import React, { useEffect, useState } from 'react';
import { apiUrls } from '../config/config';
import styles from '../styles/Home.module.css';

interface Placa {
    id: number;
    placa: string;
    tipoVeiculoId: number;
    modeloId: number;
    cor: string;
}

interface TipoVeiculo {
    id: number;
    veiculo: string;
}

interface Modelo {
    id: number;
    nomeModelo: string;
}

const TablePlaca: React.FC = () => {
    const [placas, setPlacas] = useState<Placa[]>([]);
    const [tiposVeiculo, setTiposVeiculo] = useState<TipoVeiculo[]>([]);
    const [modelos, setModelos] = useState<Modelo[]>([]);

    useEffect(() => {
        const fetchPlacas = async () => {
            try {
                const response = await fetch(`/api/placa`);
                const data = await response.json();
                setPlacas(data.data);
            } catch (error) {
                console.error("Erro ao buscar placas:", error);
            }
        };

        const fetchTiposVeiculo = async () => {
            try {
                const response = await fetch(apiUrls.tipoVeiculo);
                const data = await response.json();
                setTiposVeiculo(data.data);
            } catch (error) {
                console.error("Erro ao buscar tipos de veículo:", error);
            }
        };

        const fetchModelos = async () => {
            try {
                const response = await fetch(apiUrls.modelos);
                const data = await response.json();
                setModelos(data.data);
            } catch (error) {
                console.error("Erro ao buscar modelos:", error);
            }
        };

        fetchPlacas();
        fetchTiposVeiculo();
        fetchModelos();
    }, []);

    const obterNomeTipoVeiculo = (id: number) => {
        const tipo = tiposVeiculo.find((tipo) => tipo.id === id);
        return tipo ? tipo.veiculo : 'Desconhecido';
    };

    const obterNomeModelo = (id: number) => {
        const modelo = modelos.find((modelo) => modelo.id === id);
        return modelo ? modelo.nomeModelo : 'Desconhecido';
    };

    const excluirPlaca = async (id: number) => {
        try {
            const response = await fetch(`/api/placa?id=${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setPlacas((prevPlacas) => prevPlacas.filter((placa) => placa.id !== id));
                console.log("Placa excluída com sucesso.");
            } else {
                console.error("Erro ao excluir placa:", await response.json());
            }
        } catch (error) {
            console.error("Erro ao fazer requisição de exclusão:", error);
        }
    };

    const estacionarPlaca = async (id: number) => {
        try {
            // Obtenha a data e hora de entrada no formato ISO
            const dataHoraEntrada = formatarDataHoraEntrada(new Date());

            console.log("Data e Hora de Entrada:", dataHoraEntrada);  // Verifique a data no console para debug

            const response = await fetch(apiUrls.cupons, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({
                    dataHoraEntrada: dataHoraEntrada,
                    placaID: id
                })
            });

            if (response.ok) {
                alert('Veículo estacionado com sucesso!');
            } else {
                throw new Error('Erro ao estacionar veículo');
            }
        } catch (error) {
            console.error(error);
            alert('Não foi possível estacionar o veículo');
        }
    }

    // Formata a data e hora para enviar para o banco (timestamp)
    const formatarDataHoraEntrada = (data: Date) => {
        // Exibe a data completa no formato local
        console.log("Data Original:", data);
    
        // Converte para o formato ISO 8601 local, sem UTC
        const dataLocal = new Date(data.getTime() - data.getTimezoneOffset() * 60000); // Ajusta para horário local
        return dataLocal.toISOString();  // Exemplo: '2024-11-18T12:34:56.789'
    };
    

    return (
        <div className={styles.tableSection}>
            <table>
                <thead>
                    <tr className={styles.tableHeader}>
                        <th>Placa</th>
                        <th>Tipo</th>
                        <th>Modelo</th>
                        <th>Cor</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {placas.map((placa) => (
                        <tr key={placa.id}>
                            <td>{placa.placa}</td>
                            <td>{obterNomeTipoVeiculo(placa.tipoVeiculoId)}</td>
                            <td>{obterNomeModelo(placa.modeloId)}</td>
                            <td>{placa.cor}</td>
                            <td>
                                <button
                                    className="text-teal-600 underline decoration-1 pr-3"
                                    onClick={() => estacionarPlaca(placa.id)}>
                                    Estacionar
                                </button>
                                <button
                                    className="text-teal-600 underline decoration-1"
                                    onClick={() => excluirPlaca(placa.id)}>
                                    Excluir
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TablePlaca;
