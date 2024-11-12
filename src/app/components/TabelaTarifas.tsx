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

const TabelaTarifas: React.FC<{ onEdit: (tarifa: Tarifa) => void }> = ({ onEdit }) => {
    const [tarifas, setTarifas] = useState<Tarifa[]>([]);
    const [tiposVeiculo, setTiposVeiculo] = useState<TipoVeiculo[]>([]);
    const [pagina, setPagina] = useState(1);
    const itensPorPagina = 10;

    useEffect(() => {
        const fetchTarifas = async () => {
            try {
                const response = await fetch(`/api/tarifas?page=${pagina}&limit=${itensPorPagina}`);
                const data = await response.json();
                setTarifas(data.data);
            } catch (error) {
                console.error("Erro ao buscar tarifas:", error);
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

        fetchTarifas();
        fetchTiposVeiculo();
    }, [pagina]);

    const handleDeleteTarifa = async (id: number) => {
        try {
            const response = await fetch(`/api/tarifas/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Tarifa deletada com sucesso!');
                // Atualize a lista de tarifas após a exclusão
            } else if (response.status === 404) {
                alert('Tarifa não encontrada');
            } else {
                alert('Erro ao deletar a tarifa');
            }
        } catch (error) {
            console.error(error);
            alert('Erro ao tentar deletar a tarifa');
        }
    };

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
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {tarifas.map((tarifa) => (
                        <tr key={tarifa.id}>
                            <td>{tarifa.horaCobrada}</td>
                            <td>{obterNomeTipoVeiculo(tarifa.tipoVeiculoId)}</td>
                            <td>R$ {tarifa.valor}</td>
                            <td>
                                <button onClick={() => onEdit(tarifa)}>Editar</button>
                                <button onClick={() => handleDeleteTarifa(tarifa.id)}>Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TabelaTarifas;
