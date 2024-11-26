"use client";

import moment from "moment-timezone";
import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";

interface Cupom {
    id: number;
    placa: string;
    modelo: string;
    tipoVeiculo: string;
    dataHoraEntrada: string;
    dataHoraSaida?: string;
    idTipoVeiculo: string;
}

interface Tarifa {
    tipoVeiculoId: string;
    valor: number;
}

const FormSection: React.FC = () => {
    const [placa, setPlaca] = useState("");
    const [resultado, setResultado] = useState<Cupom | null>(null);
    const [erro, setErro] = useState<string | null>(null);
    const [tarifas, setTarifas] = useState<Tarifa[]>([]);
    const [liberando, setLiberando] = useState(false);
    const [modalAberta, setModalAberta] = useState(false);
    const [cupomSelecionado, setCupomSelecionado] = useState<Cupom | null>(null);
    const [valorTotal, setValorTotal] = useState<number | null>(null);

    const fetchTarifas = async () => {
        try {
            const response = await fetch("/api/tarifas");
            if (!response.ok) throw new Error("Erro ao buscar tarifas");
            const data = await response.json();
            setTarifas(data.data);
        } catch (error) {
            console.error("Erro ao buscar tarifas:", error);
        }
    };

    const handleBuscarPlaca = async () => {
        if (!placa) {
            alert("Por favor, insira uma placa ou ID para buscar.");
            return;
        }

        try {
            const isId = /^\d+$/.test(placa);
            const queryParam = isId ? `id=${placa}` : `placa=${placa.toUpperCase()}`;
            const response = await fetch(`/api/cupom?${queryParam}`);

            if (!response.ok) {
                const errorResponse = await response.json();
                console.error("Erro ao buscar:", errorResponse);
                throw new Error(errorResponse.message || "Erro ao buscar.");
            }

            const data = await response.json();

            if (!data.data || data.data.length === 0) {
                setErro("Nenhum registro encontrado.");
                setResultado(null);
            } else {
                setErro(null);
                setResultado(data.data[0]);
            }
        } catch (error) {
            console.error("Erro no handleBuscarPlaca:", error);
            setErro("Não foi possível buscar os dados.");
            setResultado(null);
        }
    };

    const formatarDataMoment = (data: string): string => {
        return moment.utc(data).tz("America/Sao_Paulo").format("DD/MM/YYYY HH:mm:ss");
    };

    const calcularValorTotal = (
        dataHoraEntrada: string,
        dataHoraSaida: string | null,
        idTipoVeiculo: string
    ): number => {
        const valorTarifa = tarifas.find((t) => t.tipoVeiculoId === idTipoVeiculo)?.valor ?? 0;
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

    const obterHorarioLocal = () => {
        const agora = new Date();
        const offset = agora.getTimezoneOffset() * 60000;
        const horarioLocal = new Date(agora.getTime() - offset);
        return horarioLocal.toISOString().slice(0, 19).replace("T", " ");
    };

    const liberarCupomNoBanco = async () => {
        if (!cupomSelecionado || valorTotal === null) return;
        setLiberando(true);

        try {
            const dataHoraSaida = obterHorarioLocal();

            const response = await fetch(`/api/cupom?id=${cupomSelecionado.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ valorTotal, dataHoraSaida }),
            });

            const data = await response.json();

            if (response.ok) {
                setResultado(null);
                setModalAberta(false);
                window.location.reload();
            } else {
                console.error("Erro ao liberar cupom:", data.message);
                alert("Erro ao liberar o cupom.");
            }
        } catch (error) {
            console.error("Erro na liberação do cupom:", error);
            alert("Ocorreu um erro ao liberar o cupom.");
        } finally {
            setLiberando(false);
        }
    };

    const handleLiberarCupom = () => {
        if (resultado) {
            const valorCalculado = calcularValorTotal(resultado.dataHoraEntrada, null, resultado.idTipoVeiculo);
            setValorTotal(valorCalculado);
            setCupomSelecionado(resultado);
            setModalAberta(true);
        }
    };

    const fecharModal = () => {
        setModalAberta(false);
    };

    useEffect(() => {
        fetchTarifas();
    }, []);

    return (
        <div className={styles.formSection}>
            <input
                type="text"
                placeholder="Digite a placa ou ID do Cupom"
                value={placa}
                onChange={(e) => setPlaca(e.target.value)}
            />
            <button className={styles.confirmButton} onClick={handleBuscarPlaca}>
                Buscar
            </button>

            {erro && <p className={styles.error}>{erro}</p>}
            {resultado && (
                <div className={styles.resultado}>
                    <h3>Resultado:</h3>
                    <p><strong>Placa:</strong> {resultado.placa}</p>
                    <p><strong>Modelo:</strong> {resultado.modelo}</p>
                    <p><strong>Tipo de Veículo:</strong> {resultado.tipoVeiculo}</p>
                    <p><strong>Data e Hora de Entrada:</strong> {new Date(resultado.dataHoraEntrada).toLocaleString()}</p>
                    <div className={styles.buttonGroup}>
                        <button
                            className={styles.liberarButton}
                            onClick={handleLiberarCupom}
                            disabled={liberando}
                        >
                            {liberando ? "Liberando..." : "Liberar"}
                        </button>
                        <button
                            className={styles.cancelarButton}
                            onClick={() => {
                                setResultado(null);
                                setPlaca("");
                                setErro(null);
                            }}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {modalAberta && cupomSelecionado && valorTotal !== null && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-2/5">
                        <h2 className="text-lg font-bold mb-4">Cupom {cupomSelecionado.id}</h2>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <p><strong>Placa:</strong> {cupomSelecionado.placa}</p>
                            <p><strong>Valor Total: R$ </strong> {valorTotal.toFixed(2)}</p>
                            <p><strong>Hora Entrada:</strong> {formatarDataMoment(cupomSelecionado.dataHoraEntrada)}</p>
                            <p><strong>Hora Saída:</strong> {obterHorarioLocal()}</p>
                        </div>
                        <div className="flex justify-end space-x-4 mt-6">
                            <button onClick={fecharModal} className="px-4 py-2 bg-gray-300 text-gray-700 rounded">
                                Fechar
                            </button>
                            <button onClick={liberarCupomNoBanco} className="px-4 py-2 bg-green-600 text-white rounded">
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FormSection;
