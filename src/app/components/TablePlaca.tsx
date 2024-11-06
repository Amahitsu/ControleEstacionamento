"use client";

import React, { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { apiUrls } from '../config/config';

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
    const [pagina, setPagina] = useState(1);
    const itensPorPagina = 10;

    useEffect(() => {
        const fetchPlacas = async () => {
            try {
                const response = await fetch(`/api/placa?page=${pagina}&limit=${itensPorPagina}`);
                const data = await response.json();
                console.log("Placas:", data);
                setPlacas(data.data);
            } catch (error) {
                console.error("Erro ao buscar placas:", error);
            }
        };

        const fetchTiposVeiculo = async () => {
            try {
                const response = await fetch(apiUrls.tipoVeiculo);
                const data = await response.json();
                console.log("Tipos de Veículo:", data);
                setTiposVeiculo(data.data);
            } catch (error) {
                console.error("Erro ao buscar tipos de veículo:", error);
            }
        };

        const fetchModelos = async () => {
            try {
                const response = await fetch(apiUrls.modelos);
                const data = await response.json();
                console.log("Modelos:", data);
                setModelos(data.data);
            } catch (error) {
                console.error("Erro ao buscar modelos:", error);
            }
        };

        fetchPlacas();
        fetchTiposVeiculo();
        fetchModelos();
    }, [pagina]);

    const proximaPagina = () => setPagina((prev) => prev + 1);
    const paginaAnterior = () => setPagina((prev) => (prev > 1 ? prev - 1 : 1));

    // Função para obter o nome do tipo de veículo pelo ID
    const obterNomeTipoVeiculo = (id: number) => {
        // Verifica se 'tiposVeiculo' é um array e não está vazio
        if (Array.isArray(tiposVeiculo) && tiposVeiculo.length > 0) {
            const tipo = tiposVeiculo.find((tipo) => tipo.id === id);  // Comparação numérica
            return tipo ? tipo.veiculo : 'Desconhecido';
        }
        console.error("tiposVeiculo não é um array válido ou está vazio.");
        return 'Desconhecido';
    };

    // Função para obter o nome do modelo pelo ID
    const obterNomeModelo = (id: number) => {
        // Verifica se 'modelos' é um array e não está vazio
        if (Array.isArray(modelos) && modelos.length > 0) {
            const modelo = modelos.find((modelo) => modelo.id === id);  // Comparação numérica
            return modelo ? modelo.nomeModelo : 'Desconhecido';
        }
        console.error("modelos não é um array válido ou está vazio.");
        return 'Desconhecido';
    };

    return (
        <div className={styles.tableSection}>
            <table>
                <thead>
                    <tr>
                        <th>Placa</th>
                        <th>Tipo</th>
                        <th>Modelo</th>
                        <th>Cor</th>
                    </tr>
                </thead>
                <tbody>
                    {placas.map((placa) => (
                        <tr key={placa.id}>
                            <td>{placa.placa}</td>
                            <td>{obterNomeTipoVeiculo(placa.tipoVeiculoId)}</td>
                            <td>{obterNomeModelo(placa.modeloId)}</td>
                            <td>{placa.cor}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className={styles.pagination}>
                <button onClick={paginaAnterior} disabled={pagina === 1}>Anterior</button>
                <span>Página {pagina}</span>
                <button onClick={proximaPagina}>Próxima</button>
            </div>
        </div>
    );
};

export default TablePlaca;
