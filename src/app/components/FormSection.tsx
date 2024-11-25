"use client";

import moment from "moment-timezone"; // Import para manipulação de datas
import { useState, useEffect } from "react";
import { apiUrls } from "../config/config";
import styles from "../styles/Home.module.css";

// Interfaces para os dados
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
    const [resultado, setResultado] = useState<Cupom | null>(null); // Estado para armazenar o resultado da busca
    const [erro, setErro] = useState<string | null>(null); // Estado para mensagens de erro
    const [tarifas, setTarifas] = useState<Tarifa[]>([]); // Lista de tarifas
    const [liberando, setLiberando] = useState(false); // Estado para controlar a liberação
    const [modalAberta, setModalAberta] = useState(false); // Estado para controlar a abertura da modal
    const [cupomSelecionado, setCupomSelecionado] = useState<Cupom | null>(null); // Estado para armazenar o cupom selecionado
    const [valorTotal, setValorTotal] = useState<number | null>(null); // Estado para armazenar o valor total calculado

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

    // Função para buscar a placa
    const handleBuscarPlaca = async () => {
        if (!placa) {
            alert("Por favor, insira uma placa para buscar.");
            return;
        }

        try {
            const response = await fetch(`/api/cupom?placa=${placa}`); // Atualizado para usar o endpoint correto

            if (!response.ok) {
                const errorResponse = await response.json();
                console.error("Erro ao buscar placa:", errorResponse);
                throw new Error(errorResponse.message || "Erro ao buscar a placa");
            }

            const data = await response.json();

            // Verificar se há dados no retorno
            if (data.data.length === 0) {
                setErro("Placa não encontrada ou não há veículos em estacionamento.");
                setResultado(null);
            } else {
                setErro(null);
                setResultado(data.data[0]); // Supondo que seja uma lista e queremos apenas o primeiro resultado
            }
        } catch (error) {
            console.error("Erro no handleBuscarPlaca:", error);
            setErro("Não foi possível buscar a placa.");
            setResultado(null);
        }
    };

    // Função para formatar datas usando moment-timezone
    const formatarDataMoment = (data: string): string => {
        return moment.utc(data).tz("America/Sao_Paulo").format("DD/MM/YYYY HH:mm:ss");
    };

    // Função para calcular o valor total com base nas tarifas
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

    // Função para obter o horário local
    const obterHorarioLocal = () => {
        const agora = new Date();
        const offset = agora.getTimezoneOffset() * 60000; // Offset em milissegundos
        const horarioLocal = new Date(agora.getTime() - offset);
        return horarioLocal.toISOString().slice(0, 19).replace("T", " ");
    };

    // Função para liberar o cupom
    const liberarCupomNoBanco = async () => {
        if (!cupomSelecionado || valorTotal === null) return;

        setLiberando(true);

        try {
            const dataHoraSaida = obterHorarioLocal();

            const response = await fetch(`/api/cupom?id=${cupomSelecionado.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    valorTotal,
                    dataHoraSaida,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setResultado(null); // Limpa o resultado após liberação
                setModalAberta(false); // Fecha a modal
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

    // Função para abrir a modal com os valores calculados
    const handleLiberarCupom = () => {
        if (resultado) {
            const valorCalculado = calcularValorTotal(resultado.dataHoraEntrada, null, resultado.idTipoVeiculo);
            setValorTotal(valorCalculado);
            setCupomSelecionado(resultado); // Define o cupom selecionado para exibir na modal
            setModalAberta(true); // Abre a modal
        }
    };

    // Função para fechar a modal
    const fecharModal = () => {
        setModalAberta(false);
    };

    useEffect(() => {
        fetchTarifas(); // Carregar as tarifas ao iniciar o componente
    }, []);

    return (
        <div className={styles.formSection}>
            <input
                type="text"
                placeholder="Digite a placa"
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
        
        {/* Botão Liberar, que só aparece quando o cupom for encontrado */}
        <button
            className={styles.liberarButton}
            onClick={handleLiberarCupom}
            disabled={liberando}  // Desabilita enquanto estiver liberando
        >
            {liberando ? "Liberando..." : "Liberar"}
        </button>
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

export default FormSection;
