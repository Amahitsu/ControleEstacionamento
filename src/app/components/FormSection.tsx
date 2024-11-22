"use client";

import { useState } from "react";
import styles from "../styles/Home.module.css";

const FormSection: React.FC = () => {
    const [placa, setPlaca] = useState("");
    const [resultado, setResultado] = useState<any>(null); // Estado para armazenar o resultado da busca
    const [erro, setErro] = useState<string | null>(null); // Estado para mensagens de erro

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
                </div>
            )}
        </div>
    );
};

export default FormSection;
