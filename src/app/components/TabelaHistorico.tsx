"use client";

import moment from "moment-timezone"; 
import React, { useEffect, useState } from "react";
import { apiUrls } from "../config/config";
import styles from "../styles/Home.module.css";


interface Historico {
    id: number;
    dataHoraEntrada: string;
    dataHoraSaida: string;
    placa: string;
    valorTotal: number;
    idTipoVeiculo: string;
    tipoVeiculo: string;
    modelo: string;
}

const TabelaHistorico: React.FC = () => {
    
    const [historico, setHistorico] = useState<Historico[]>([]); 

    const timezone = process.env.NEXT_PUBLIC_CUSTOM_TIMEZONE || "America/Sao_Paulo";
    const formatarDataMoment = (data: string): string => {
        return moment(data).tz(timezone).format("DD/MM/YYYY HH:mm:ss");
    };  

    const fetchHistorico = async () => {
        try {
            const response = await fetch(apiUrls.historico); 
            if (!response.ok) throw new Error("Erro ao buscar histórico");

            const data = await response.json();
            setHistorico(data.data); 
        } catch (error) {
            console.error("Erro ao buscar histórico:", error);
        }
    };



    useEffect(() => {
        fetchHistorico();
    }, []);

    return (
        <div className={styles.tableSection}>
            <table>
                <thead>
                    <tr className={styles.tableHeader}>
                        <th>Cupom</th>
                        <th>Hora Entrada</th>
                        <th>Hora Saída</th>
                        <th>Valor Total</th>
                        <th>Placa</th>
                        <th>Tipo Veículo</th>
                        <th>Modelo</th>
                    </tr>
                </thead>
                <tbody>
                    {historico.map((veiculo) => (
                        <tr key={veiculo.id}>
                            <td>{veiculo.id}</td>
                            <td>{formatarDataMoment(veiculo.dataHoraEntrada)}</td>
                            <td>{formatarDataMoment(veiculo.dataHoraSaida)}</td>
                            <td>R$ {veiculo.valorTotal}</td>
                            <td>{veiculo.placa}</td>
                            <td>{veiculo.tipoVeiculo}</td>
                            <td>{veiculo.modelo}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TabelaHistorico;
