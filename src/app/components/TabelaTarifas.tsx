"use client";

import React, { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { apiUrls } from '../config/config';

interface Tarifa {
    id: number;
    horaCobrada: string;
    tipoVeiculoId: number;
    valor: string;
}

interface TipoVeiculo {
    id: number;
    veiculo: string;
}

const TableTarifas: React.FC = () => {
    const [tarifas, setTarifas] = useState<Tarifa[]>([]);
    const [tiposVeiculo, setTiposVeiculo] = useState<TipoVeiculo[]>([]);
    const [pagina, setPagina] = useState(1);
    const itensPorPagina = 10;

    useEffect(() => {
        const fetchTarifas = async () => {
            try {
                const response = await fetch(`/api/tarifas?page=${pagina}&limit=${itensPorPagina}`);
                const data = await response.json();
                console.log("Tarifas:", data);
                setTarifas(data.data);
            } catch (error) {
                console.error("Erro ao buscar tarifas:", error);
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

        fetchTarifas();
        fetchTiposVeiculo();
    }, [pagina]);

    const proximaPagina = () => setPagina((prev) => prev + 1);
    const paginaAnterior = () => setPagina((prev) => (prev > 1 ? prev - 1 : 1));

    const obterNomeTipoVeiculo = (id: number) => {
        const tipo = tiposVeiculo.find((tipo) => tipo.id === id);
        return tipo ? tipo.veiculo : 'Desconhecido';
    };

    return (
        <div className={styles.tableSection}>
            <table>
                <thead>
                    <tr>
                        <th>Hora Cobrada</th>
                        <th>Tipo de Veículo</th>
                        <th>Valor</th>
                    </tr>
                </thead>
                <tbody>
                    {tarifas.map((tarifa) => (
                        <tr key={tarifa.id}>
                            <td>{tarifa.horaCobrada}</td>
                            <td>{obterNomeTipoVeiculo(tarifa.tipoVeiculoId)}</td>
                            <td>R$ {tarifa.valor}</td>
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

export default TableTarifas;
