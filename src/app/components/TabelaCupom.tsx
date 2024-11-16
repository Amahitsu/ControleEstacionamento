"use client";

import React, { useEffect, useState } from 'react';
import { apiUrls } from '../config/config';
import styles from '../styles/Home.module.css';

interface Cupom {
    id: number;
    dataHoraEntrada: string;
    dataHoraSaida: string;
    placa: string;
    idTipoVeiculo: string;
    tipoVeiculo: string;
    modelo: string;
}

interface Tarifa {
    tipoVeiculo: string;
    valor: number;
}

const TableCupom: React.FC = () => {
    const [cupons, setCupons] = useState<Cupom[]>([]);
    const [modalAberta, setModalAberta] = useState(false);
    const [cupomSelecionado, setCupomSelecionado] = useState<Cupom | null>(null);
    const [tarifas, setTarifas] = useState<Tarifa[]>([]); // Inicializando como um array vazio

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
                
                setTarifas(data.data); // Armazena as tarifas no estado
            } catch (error) {
                debugger
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
        
        if (!tarifas.length) {
            return 0; // Retorna 0 se as tarifas não estiverem carregadas
        }
        const tarifa = tarifas.find(t => t.tipoVeiculoId === idTipoVeiculo);
        return tarifa ? tarifa.valor : 0; // Retorna a tarifa ou 0 se não encontrar
    };

    const calcularValorTotal = (
        dataHoraEntrada: string,
        dataHoraSaida: string | null,
        idTipoVeiculo: string
    ): number => {
        const valorTarifa = obterTarifaPorTipoVeiculo(idTipoVeiculo); // Busca a tarifa

        const dataAtual = new Date();
        const dataEntrada = new Date(dataAtual.toDateString() + ' ' + dataHoraEntrada);

        const dataSaida = dataHoraSaida ? new Date(dataAtual.toDateString() + ' ' + dataHoraSaida) : dataAtual;

        const diferencaEmMillis = dataSaida.getTime() - dataEntrada.getTime();
        const diferencaEmHoras = diferencaEmMillis / (1000 * 60 * 60);

        const horasCobrar = Math.ceil(diferencaEmHoras);

        return horasCobrar * valorTarifa;
    };

    const fecharModal = () => {
        setModalAberta(false);
        setCupomSelecionado(null);
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
                        <th>Tipo veículo</th>
                        <th>Modelo</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {cupons.map((cupom) => (
                        <tr key={cupom.id}>
                            <td>{cupom.id}</td>
                            <td>{cupom.dataHoraEntrada}</td>
                            <td>
                                {calcularValorTotal(
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
                            <p><strong>Valor Total:</strong> {calcularValorTotal(cupomSelecionado.dataHoraEntrada, cupomSelecionado.dataHoraSaida, cupomSelecionado.idTipoVeiculo).toFixed(2)}</p>

                            <p><strong>Hora Entrada:</strong> {cupomSelecionado.dataHoraEntrada}</p>
                            <p><strong>Hora Saída:</strong> {cupomSelecionado.dataHoraSaida ? new Date(cupomSelecionado.dataHoraSaida).toLocaleTimeString() : new Date().toLocaleTimeString()}</p>
                            
                        </div>

                        <div className="flex justify-end space-x-4 mt-6">
                            <button
                                onClick={fecharModal}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
                            >
                                Fechar
                            </button>
                            <button
                                onClick={() => {
                                    // Lógica para liberar o cupom
                                    console.log('Cupom liberado:', cupomSelecionado);
                                    fecharModal();
                                }}
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
