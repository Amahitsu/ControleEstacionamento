"use client";

import React, { useEffect, useState } from 'react';
import { apiUrls } from '../config/config';
import styles from '../styles/Home.module.css';

interface Cupom {
    id: number;
    dataHoraEntrada: string;
    dataHoraSaida: string;
    descricao: string;
    valorTotal: number;
    placaID: number;
}

interface TipoVeiculo {
    id: number;
    veiculo: string;
}

interface Modelo {
    id: number;
    nomeModelo: string;
}

const TableCupom: React.FC = () => {
    const [cupons, setCupons] = useState<Cupom[]>([]);
    const [tiposVeiculo, setTiposVeiculo] = useState<TipoVeiculo[]>([]);
    const [modelos, setModelos] = useState<Modelo[]>([]);
    const [pagina] = useState(1);
   // const itensPorPagina = 10;

    useEffect(() => {
        const fetchCupons = async () => {
            try {
                const response = await fetch(apiUrls.cupons);
                const data = await response.json();
                setCupons(data.data);
            } catch (error) {
                console.error("Erro ao buscar cupom:", error);
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

        fetchCupons();
        //fetchTiposVeiculo();
        //fetchModelos();
    }, [pagina]);

    const obterNomeTipoVeiculo = (id: number) => {
        const tipo = tiposVeiculo.find((tipo) => tipo.id === id);  
        return tipo ? tipo.veiculo : 'Desconhecido';
    };

    const obterNomeModelo = (id: number) => {
        const modelo = modelos.find((modelo) => modelo.id === id);  
        return modelo ? modelo.nomeModelo : 'Desconhecido';
    };

    const excluirCupom = async (id: number) => {
        try {
            const response = await fetch(`/api/cupom?id=${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setCupons((prevCupons) => prevCupons.filter((cupom) => cupom.id !== id));
                console.log("Cupom excluída com sucesso.");
            } else {
                console.error("Erro ao excluir cupom:", await response.json());
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
                        <th>Cupom</th>
                        <th>Hora entrada</th>
                        <th>Valor total</th>
                        <th>Placa</th>
                        <th>Modelo</th>
                        <th>Cor</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {cupons.map((cupom) => (
                        <tr key={cupom.id}>
                            <td>{cupom.id}</td>
                            <td>{cupom.dataHoraEntrada}</td>
                            <td>{cupom.valorTotal}</td>
                            <td>{cupom.placaID}</td>
                            <td>Modelo</td>
                            <td>Cor</td>
                            <td>
                                <button
                                    className="pr-3"
                                    onClick={() => console.log('Estacionar', cupom.id)}>
                                        Liberar
                                </button>
                                <button 
                                    className="text-teal-600 mr-6 underline decoration-1"
                                    onClick={() => excluirCupom(cupom.id)}>
                                    Excluir
                                </button>
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

export default TableCupom;
