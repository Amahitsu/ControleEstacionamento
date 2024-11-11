"use client";

import React, { useEffect, useState } from 'react';
import { apiUrls } from '../config/config';
import styles from '../styles/Home.module.css';

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

  //  const proximaPagina = () => setPagina((prev) => prev + 1);
  //  const paginaAnterior = () => setPagina((prev) => (prev > 1 ? prev - 1 : 1));

    const obterNomeTipoVeiculo = (id: number) => {
        const tipo = tiposVeiculo.find((tipo) => tipo.id === id);
        return tipo ? tipo.veiculo : 'Desconhecido';
    };

    return (
        <div className={styles.tableSection}>
            <table>
                <thead>
                    <tr className={styles.tableHeader}>
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
            {/*
            <ul className={styles.pagination}>
                <li><button className="mr-6" onClick={paginaAnterior} disabled={pagina === 1}>Anterior</button></li>
                <li><span className="mr-6">Página {pagina}</span></li>
                <li><button className="mr-6 underline decoration-1" onClick={proximaPagina}>Próxima</button></li>
            </ul>
            */}
        </div>
    );
};

export default TableTarifas;
