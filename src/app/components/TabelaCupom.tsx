"use client";

import React, { useEffect, useState } from "react";
import moment from "moment-timezone"; // Import para manipulação de datas
import { apiUrls } from "../config/config";
import styles from "../styles/Home.module.css";

// Interfaces para os dados
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

const TabelaCupom: React.FC = () => {
    // Estados da tabela e do modal
    const [cupons, setCupons] = useState<Cupom[]>([]); // Lista de cupons
    const [tarifas, setTarifas] = useState<Tarifa[]>([]); // Lista de tarifas
    const [modalAberta, setModalAberta] = useState(false); // Controle do modal
    const [cupomSelecionado, setCupomSelecionado] = useState<Cupom | null>(null); // Cupom em foco no modal

    // Função para formatar datas usando moment-timezone
    const formatarDataMoment = (data: string): string => {
        return moment.utc(data).tz("America/Sao_Paulo").format("DD/MM/YYYY HH:mm:ss");
    };

    // Função para buscar cupons da API
    const fetchCupons = async () => {
        try {
            const response = await fetch(apiUrls.cupons); // Busca na API de cupons
            if (!response.ok) throw new Error("Erro ao buscar cupons");

            const data = await response.json();
            setCupons(data.data); // Atualiza a lista de cupons
        } catch (error) {
            console.error("Erro ao buscar cupons:", error);
        }
    };

    // Função para buscar tarifas da API
    const fetchTarifas = async () => {
        try {
            const response = await fetch("/api/tarifas"); // Busca na API de tarifas
            if (!response.ok) throw new Error("Erro ao buscar tarifas");

            const data = await response.json();
            setTarifas(data.data); // Atualiza a lista de tarifas
        } catch (error) {
            console.error("Erro ao buscar tarifas:", error);
        }
    };

    // useEffect para carregar os dados ao montar o componente
    useEffect(() => {
        fetchCupons();
        fetchTarifas();
    }, []);

    // Função para abrir o modal ao liberar cupom
    const liberarCupom = (cupom: Cupom) => {
        setCupomSelecionado(cupom); // Define o cupom selecionado
        setModalAberta(true); // Abre o modal
    };

    const obterTarifaPorTipoVeiculo = (idTipoVeiculo: string): number => {
        const tarifa = tarifas.find((t) => t.tipoVeiculoId === idTipoVeiculo);
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

        const dataEntrada = moment.utc(dataHoraEntrada);
        const dataSaida = dataHoraSaida ? moment.utc(dataHoraSaida) : moment.utc();

        const diferencaEmHoras = moment.duration(dataSaida.diff(dataEntrada)).asHours();

        if (diferencaEmHoras < 0) {
            console.error("A data de saída é anterior à data de entrada.");
            return 0;
        }

        const horasCobrar = Math.ceil(diferencaEmHoras);
        return horasCobrar * valorTarifa;
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

            const resposta = await fetch(`/api/cupom?id=${cupomSelecionado.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    valorTotal: valorTotal,
                    dataHoraSaida: dataSaidaISO,
                }),
            });

            const data = await resposta.json();

            if (resposta.ok) {
                console.log("Data de saída e valor total atualizados:", data);
                fecharModal();
            } else {
                console.error("Erro ao atualizar dataHoraSaida e valor total:", data.message);
            }
        } catch (error) {
            console.error("Erro ao liberar cupom:", error);
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
                            <td>{formatarDataMoment(cupom.dataHoraEntrada)}</td>
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

            {modalAberta && cupomSelecionado && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-lg font-bold mb-4">Cupom {cupomSelecionado.id}</h2>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <p><strong>Placa:</strong> {cupomSelecionado.placa}</p>
                            <p><strong>Valor Total: R$ </strong> {calcularValorTotal(cupomSelecionado.dataHoraEntrada, cupomSelecionado.dataHoraSaida, cupomSelecionado.idTipoVeiculo).toFixed(2)}</p>

                            <p><strong>Hora Entrada:</strong> {formatarDataMoment(cupomSelecionado.dataHoraEntrada)}</p>
                            <p><strong>Hora Saída:</strong> {cupomSelecionado.dataHoraSaida ? formatarDataMoment(cupomSelecionado.dataHoraSaida) : 'Ainda no estacionamento'}</p>
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

export default TabelaCupom;
