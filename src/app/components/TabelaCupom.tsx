"use client";

import moment from "moment-timezone"; // Import para manipulação de datas
import React, { useEffect, useState } from "react";
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
    const timezone = process.env.NEXT_PUBLIC_CUSTOM_TIMEZONE || "America/Sao_Paulo";

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

    const obterTarifaPorTipoVeiculo = (idTipoVeiculo: string): number => {
        const tarifa = tarifas.find((t) => t.tipoVeiculoId === idTipoVeiculo);
        return tarifa ? tarifa.valor : 0;
    };

    const formatarDataMoment = (data: string): string => {
        const dataTimezone = setTimezone(data);
        return dataTimezone.format("DD/MM/YYYY HH:mm:ss")
    };

    const setTimezone = (data: string): moment.Moment => {
        return moment.tz(data, timezone);
    };
    
    // Função que calcula o valor total
    const calcularValorTotal = (
        dataHoraEntrada: string,
        idTipoVeiculo: string
    ): number => {
        const valorTarifa = obterTarifaPorTipoVeiculo(idTipoVeiculo);
    
        if (valorTarifa <= 0) {
            console.error("Tarifa inválida para o tipo de veículo");
            return 0;
        }
        
        // Obter os objetos Moment para data de entrada e saída
        const dataEntrada = setTimezone(dataHoraEntrada);
        const dataSaida = setTimezone(obterHorarioLocal());

        console.log("DataEntrada: " + dataEntrada.toString())
        console.log("DataSaida: " + dataSaida.toString())

        // Calcula a diferença entre as duas datas em horas
        const diferencaEmHoras = moment.duration(dataSaida.diff(dataEntrada)).asHours();
    
        // Verifica se a data de saída é anterior à data de entrada
        if (diferencaEmHoras < 0) {
            console.error("A data de saída é anterior à data de entrada.");
            return 0;
        }
    
        const horasCobrar = Math.ceil(diferencaEmHoras); // Arredonda para cima
        return horasCobrar * valorTarifa;
    };
    
    // Função que obtém o horário local atual no formato ISO
    const obterHorarioLocal = (): string => {
        const horarioLocal = moment().tz(timezone);
        return horarioLocal.format("YYYY-MM-DD HH:mm:ss");
    };

    const fecharModal = () => {
        setModalAberta(false);
        setCupomSelecionado(null);
    };

    // Função para abrir o modal ao liberar cupom
    const liberarCupom = (cupom: Cupom) => {
        setCupomSelecionado(cupom); // Define o cupom selecionado
        setModalAberta(true); // Abre o modal
    };

    const liberarCupomNoBanco = async () => {
        if (!cupomSelecionado) return;

        const dataHoraSaida = obterHorarioLocal()
        try {
            const valorTotal = calcularValorTotal(
                cupomSelecionado.dataHoraEntrada,
                cupomSelecionado.idTipoVeiculo
            );

            const resposta = await fetch(`/api/cupom?id=${cupomSelecionado.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    valorTotal: valorTotal,
                    dataHoraSaida: dataHoraSaida,
                }),
            });

            const data = await resposta.json();

            if (resposta.ok) {
                console.log("Data de saída e valor total atualizados:", data);
                fecharModal();
                window.location.reload();
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
                    <div className="bg-white p-6 rounded-lg shadow-lg w-2/5">
                        <h2 className="text-lg font-bold mb-4">Cupom {cupomSelecionado.id}</h2>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <p><strong>Placa:</strong> {cupomSelecionado.placa}</p>
                            <p><strong>Valor Total: R$ </strong> {calcularValorTotal(cupomSelecionado.dataHoraEntrada, cupomSelecionado.idTipoVeiculo).toFixed(2)}</p>
                            <p><strong>Hora Entrada:</strong> {formatarDataMoment(cupomSelecionado.dataHoraEntrada)}</p>
                            <p><strong>Hora Saída:</strong> {formatarDataMoment(obterHorarioLocal())}</p>
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