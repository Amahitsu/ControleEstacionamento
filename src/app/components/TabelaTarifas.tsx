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

interface ApiResponse<T> {
    data: T[];
}

const TabelaTarifas: React.FC<{ onEdit: (tarifa: Tarifa) => void }> = ({ onEdit }) => {
    const [tarifas, setTarifas] = useState<Tarifa[]>([]);
    const [tiposVeiculo, setTiposVeiculo] = useState<TipoVeiculo[]>([]);
    const [pagina] = useState(1);
    const itensPorPagina = 10;

    //
    useEffect(() => {
        const fetchTarifas = async () => {
            try {
                const response = await fetch(`/api/tarifas?page=${pagina}&limit=${itensPorPagina}`);
                const data: ApiResponse<Tarifa> = await response.json();

                // Convertendo id e tipoVeiculoId para números
                const tarifasConvertidas = data.data.map((tarifa) => ({
                    ...tarifa,
                    id: Number(tarifa.id),
                    tipoVeiculoId: Number(tarifa.tipoVeiculoId),
                }));

                setTarifas(tarifasConvertidas);
            } catch (error) {
                console.error("Erro ao buscar tarifas:", error);
            }
        };

        const fetchTiposVeiculo = async () => {
            try {
                const response = await fetch(apiUrls.tipoVeiculo);
                const data: ApiResponse<TipoVeiculo> = await response.json();

                // Convertendo id para número
                const tiposVeiculoConvertidos = data.data.map((tipo) => ({
                    ...tipo,
                    id: Number(tipo.id),
                }));

                setTiposVeiculo(tiposVeiculoConvertidos);
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
                setTarifas((prevTarifas) => prevTarifas.filter((tarifa) => tarifa.id !== id));
            } else if (response.status === 404) {
                alert('Tarifa não encontrada');
            } else {
                alert('Erro ao deletar a tarifa');
            }
        } catch (error) {
            console.error("Erro ao tentar deletar a tarifa:", error);
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

export default TabelaTarifas;
