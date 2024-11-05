"use client";

import React, { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { apiUrls } from '../config/config';

interface Placa {
    id: number;
    placa: string;
    tipoVeiculoId: string;
    modeloId: string;
    cor: string;
}

interface TipoVeiculo {
    id: number;
    nome: string;
}

interface Modelo {
    id: number;
    nome: string;
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
                setPlacas(data.data);
            } catch (error) {
                console.error("Erro ao buscar placas:", error);
            }
        };

        const fetchTiposVeiculo = async () => {
            try {
                const response = await fetch(apiUrls.tipoVeiculo);
                const data = await response.json();
                setTiposVeiculo(data.data);  // Atualize o estado
                console.log("Tipos de Veículo após set:", tiposVeiculo); // Verifique o estado atualizado
            } catch (error) {
                console.error("Erro ao buscar tipos de veículo:", error);
            }
        };
        const fetchModelos = async () => {
            try {
                const response = await fetch(apiUrls.modelos);
                const data = await response.json();
                console.log("Resposta da API para modelos:", data); // Verifique a resposta completa
                setModelos(data.data); // Supondo que a estrutura seja data.data
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

    // Função para encontrar o nome do tipo de veículo pelo ID
    const obterNomeTipoVeiculo = (id: string) => {
        const tipo = tiposVeiculo.find((tipo) => tipo.id.toString() === id);  // Garantir que estamos comparando como string
        return tipo ? tipo.nome : 'Desconhecido';
    };

    // Função para encontrar o nome do modelo pelo ID
    const obterNomeModelo = (id: string) => {
        const modelo = modelos.find((modelo) => modelo.id.toString() === id);  // Garantir que estamos comparando como string
        return modelo ? modelo.nome : 'Desconhecido';
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
