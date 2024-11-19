"use client";

import React, { useEffect, useState } from 'react';
import { apiUrls } from '../config/config';
import styles from '../styles/Home.module.css';

interface Cupom {
    id: number;
    dataHoraEntrada: string;
    dataHoraSaida: string | null;
    placa: string;
    idTipoVeiculo: string;
    tipoVeiculo: string;
    modelo: string;
}

interface Tarifa {
    tipoVeiculoId: string;
    valor: number;
}

const TableCupom: React.FC = () => {
    const [cupons, setCupons] = useState<Cupom[]>([]); 
    const [modalAberta, setModalAberta] = useState(false);
    const [cupomSelecionado, setCupomSelecionado] = useState<Cupom | null>(null);
    const [tarifas, setTarifas] = useState<Tarifa[]>([]);

    useEffect(() => {
        const fetchCupons = async () => {
            try {
                const response = await fetch(apiUrls.cupons);
                const data = await response.json();
                setCupons(data.data);
            } catch (error) {
                console.error("Erro ao buscar cupons:", error);
            }
        };

        const fetchTarifas = async () => {
            try {
                const response = await fetch('/api/tarifas');
                const data = await response.json();
                setTarifas(data.data);
            } catch (error) {
                console.error("Erro ao buscar tarifas:", error);
            }
        };

        fetchCupons();
        fetchTarifas();
    }, []);

    const liberarCupom = (cupom: Cupom) => {
        setCupomSelecionado(cupom);
        setModalAberta(true);
    };

    // Função para obter a tarifa de um tipo de veículo
    const obterTarifaPorTipoVeiculo = (idTipoVeiculo: string): number => {
        const tarifa = tarifas.find(t => t.tipoVeiculoId === idTipoVeiculo);
        return tarifa ? tarifa.valor : 0;
    };

    const calcularValorTotal = (
        dataHoraEntrada: string,
        dataHoraSaida: string | null,
        idTipoVeiculo: string
    ): number => {
        const valorTarifa = obterTarifaPorTipoVeiculo(idTipoVeiculo);

        if (valorTarifa <= 0) {
            console.error("Tarifa inválida para o tipo de veículo");
            return 0;
        }

        const dataAtual = new Date();
        const dataEntrada = new Date(dataHoraEntrada);
        const dataSaida = dataHoraSaida ? new Date(dataHoraSaida) : dataAtual;

        const diferencaEmMillis = dataSaida.getTime() - dataEntrada.getTime();
        const diferencaEmHoras = diferencaEmMillis / (1000 * 60 * 60);

        if (diferencaEmHoras < 0) {
            console.error("A data de saída é anterior à data de entrada.");
            return 0;
        }

        const horasCobrar = Math.ceil(diferencaEmHoras);
        return horasCobrar * valorTarifa;
    };

    const formatarData = (data: string): string => {
        const dataObj = new Date(data);
        return dataObj.toLocaleString('pt-BR', {
            year: 'numeric', // Exibe o ano
            month: 'numeric', // Exibe o mês por extenso
            day: 'numeric', // Exibe o dia
            hour: 'numeric', // Exibe a hora
            minute: 'numeric', // Exibe os minutos
            second: 'numeric', // Exibe os segundos
        });
    };

    const formatarHora = (hora: string | null): string => {
        if (hora) {
            const horaObj = new Date(hora);
            return horaObj.toLocaleTimeString('pt-BR');
        }
        return new Date().toLocaleTimeString('pt-BR'); // Se a hora for null, retorna a hora atual
    };

    const fecharModal = () => {
        setModalAberta(false);
        setCupomSelecionado(null);
    };

    const liberarCupomNoBanco = async () => {
        if (!cupomSelecionado) return;

        try {
            const valorTotal = calcularValorTotal(
                cupomSelecionado.dataHoraEntrada,
                new Date().toISOString(),
                cupomSelecionado.idTipoVeiculo
            );

            const dataSaidaISO = new Date().toISOString();

            // Usar o valor total correto aqui para atualizar o cupom
            const resposta = await fetch(`/api/cupom?id=${cupomSelecionado.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    valorTotal: valorTotal, // Enviar o valor total calculado
                    dataHoraSaida: dataSaidaISO,
                }),
            });

            const data = await resposta.json();

            if (resposta.ok) {
                console.log('Data de saída e valor total atualizados:', data);
                fecharModal();
            } else {
                console.error('Erro ao atualizar dataHoraSaida e valor total:', data.message);
            }
        } catch (error) {
            console.error('Erro ao liberar cupom:', error);
        }
    };

    return (
        <div className={styles.tableSection}>
            <table>
                <thead>
                    <tr className={styles.tableHeader}>
                        <th>Cupom</th>
                        <th>Hora Entrada</th>
                        <th>Valor Total</th>
                        <th>Placa</th>
                        <th>Tipo Veículo</th>
                        <th>Modelo</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {cupons.map((cupom) => (
                        <tr key={cupom.id}>
                            <td>{cupom.id}</td>
                            <td>{formatarData(cupom.dataHoraEntrada)}</td>
                            <td>
                                R$ {calcularValorTotal(
                                    cupom.dataHoraEntrada,
                                    cupom.dataHoraSaida,
                                    cupom.idTipoVeiculo
                                ).toFixed(2)}
                            </td>
                            <td>{cupom.placa}</td>
                            <td>{cupom.tipoVeiculo}</td>
                            <td>{cupom.modelo}</td>
                            <td>
                                <button
                                    className="text-teal-600 underline decoration-1"
                                    onClick={() => liberarCupom(cupom)}
                                >
                                    Liberar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal */}
            {modalAberta && cupomSelecionado && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-lg font-bold mb-4">Cupom {cupomSelecionado.id}</h2>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <p><strong>Placa:</strong> {cupomSelecionado.placa}</p>
                            <p><strong>Valor Total: R$ </strong> {calcularValorTotal(cupomSelecionado.dataHoraEntrada, cupomSelecionado.dataHoraSaida, cupomSelecionado.idTipoVeiculo).toFixed(2)}</p>

                            <p><strong>Hora Entrada:</strong> {formatarData(cupomSelecionado.dataHoraEntrada)}</p>
                            <p><strong>Hora Saída:</strong> {formatarHora(cupomSelecionado.dataHoraSaida)}</p>
                        </div>

                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                onClick={fecharModal}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
                            >
                                Fechar
                            </button>
                            <button
                                onClick={liberarCupomNoBanco}
                                className="px-4 py-2 bg-green-600 text-white rounded"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TableCupom;
