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
    const [pagina, setPagina] = useState(1);
    const itensPorPagina = 10;

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
    }, [pagina]);

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
                                <button onClick={() => console.log('Estacionar', placa.id)}>Estacionar</button>
                                <button onClick={() => excluirPlaca(placa.id)}>Excluir</button>
                            </td>
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

export default TablePlaca;
