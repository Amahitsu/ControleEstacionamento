"use client";

import React, { useEffect, useState } from 'react';
import { apiUrls } from '../config/config';
import styles from '../styles/Home.module.css';

interface Tarifas {
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

const TabelaTarifas: React.FC = () => {
    const [tarifas, setTarifas] = useState<Tarifas[]>([]);
    const [tiposVeiculo, setTiposVeiculo] = useState<TipoVeiculo[]>([]);
    const [pagina] = useState(1);
    const itensPorPagina = 10;
    const [tarifaEditando, setTarifaEditando] = useState<Tarifas | null>(null);
    const [formEdicao, setFormEdicao] = useState<Partial<Tarifas>>({});

    useEffect(() => {
        const fetchTarifas = async () => {
            try {
                const response = await fetch(`/api/tarifas?page=${pagina}&limit=${itensPorPagina}`);
                const data: ApiResponse<Tarifas> = await response.json();
                setTarifas(data.data);
            } catch (error) {
                console.error("Erro ao buscar tarifas:", error);
            }
        };

        const fetchTiposVeiculo = async () => {
            try {
                const response = await fetch(apiUrls.tipoVeiculo);
                const data: ApiResponse<TipoVeiculo> = await response.json();
                setTiposVeiculo(data.data);
            } catch (error) {
                console.error("Erro ao buscar tipos de veículo:", error);
            }
        };

        fetchTarifas();
        fetchTiposVeiculo();
    }, [pagina]);

    const onEdit = (tarifa: Tarifas) => {
        setTarifaEditando(tarifa);
        setFormEdicao({ ...tarifa });
    };

    const handleDeleteTarifa = async (id: number) => {
        try {
            const response = await fetch(`/api/tarifas?id=${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Tarifa deletada com sucesso!');
                setTarifas((prevTarifas) => prevTarifas.filter((tarifa) => tarifa.id !== id));
            } else {
                alert('Erro ao deletar a tarifa');
            }
        } catch (error) {
            console.error("Erro ao tentar deletar a tarifa:", error);
        }
    };

    const obterNomeTipoVeiculo = (id: number) => {
        const tipo = tiposVeiculo.find((tipo) => tipo.id === id);
        return tipo ? tipo.veiculo : 'Desconhecido';
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormEdicao((prev) => ({ ...prev, [name]: value }));
    };

    const salvarEdicao = async () => {
        if (tarifaEditando) {
            try {
                const response = await fetch(`/api/tarifas?id=${tarifaEditando.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formEdicao),
                });

                if (response.ok) {
                    alert('Tarifa atualizada com sucesso!');
                    setTarifas((prev) =>
                        prev.map((t) =>
                            t.id === tarifaEditando.id ? { ...t, ...formEdicao } : t
                        )
                    );
                    setTarifaEditando(null);
                } else {
                    alert('Erro ao atualizar a tarifa');
                }
            } catch (error) {
                console.error("Erro ao salvar edição:", error);
            }
        }
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
                            {tarifaEditando?.id === tarifa.id ? (
                                <>
                                    <td>
                                        <input
                                            type="time"
                                            name="horaCobrada"
                                            value={formEdicao.horaCobrada || ''}
                                            onChange={handleChange}
                                        />
                                    </td>
                                    <td>
                                        <select
                                            name="tipoVeiculoId"
                                            value={formEdicao.tipoVeiculoId || ''}
                                            onChange={handleChange}
                                        >
                                            {tiposVeiculo.map((tipo) => (
                                                <option key={tipo.id} value={tipo.id}>
                                                    {tipo.veiculo}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name="valor"
                                            value={formEdicao.valor || ''}
                                            onChange={handleChange}
                                        />
                                    </td>
                                    <td>
                                        <button className="text-teal-600 underline decoration-1 pr-3"
                                            onClick={salvarEdicao}>
                                            Salvar
                                        </button>
                                        <button className="text-teal-600 underline decoration-1 pr-3"
                                            onClick={() => setTarifaEditando(null)}>
                                            Cancelar
                                        </button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{tarifa.horaCobrada}</td>
                                    <td>{obterNomeTipoVeiculo(tarifa.tipoVeiculoId)}</td>
                                    <td>R$ {tarifa.valor}</td>
                                    <td>
                                        <button className="text-teal-600 underline decoration-1 pr-3"
                                            onClick={() => onEdit(tarifa)}>
                                            Editar
                                        </button>
                                        <button className="text-teal-600 underline decoration-1"
                                            onClick={() => handleDeleteTarifa(tarifa.id)}>
                                            Excluir
                                        </button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TabelaTarifas;
