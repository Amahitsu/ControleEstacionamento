"use client";

import React, { useEffect, useState } from "react";
import { apiUrls } from "../config/config";
import styles from "../styles/Home.module.css";

interface Placa {
  id: number;
  placa: string;
  tipoVeiculoId: number;
  modeloId: number;
  cor: string;
}

interface TipoVeiculo {
  id: number;
  veiculo: string;
}

interface Modelo {
  id: number;
  nomeModelo: string;
}

interface Cupom {
  id: number;
  dataHoraEntrada: string;
  dataHoraSaida: string | null;
  placa: string;
}

const TablePlaca: React.FC = () => {
  const [placas, setPlacas] = useState<Placa[]>([]);
  const [tiposVeiculo, setTiposVeiculo] = useState<TipoVeiculo[]>([]);
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [cuponsAtivos, setCuponsAtivos] = useState<string[]>([]); // Placas atualmente estacionadas
  const [modalAberta, setModalAberta] = useState(false);

  useEffect(() => {
    const fetchPlacas = async () => {
      try {
        const response = await fetch(`/api/placa`);
        const data = await response.json();
        setPlacas(data.data);
      } catch (error) {
        console.error("Erro ao buscar placas:", error);
      }
    };

    const fetchTiposVeiculo = async () => {
      try {
        const response = await fetch(apiUrls.tipoVeiculo);
        const data = await response.json();
        setTiposVeiculo(data.data);
      } catch (error) {
        console.error("Erro ao buscar tipos de veículo:", error);
      }
    };

    const fetchModelos = async () => {
      try {
        const response = await fetch(apiUrls.modelos);
        const data = await response.json();
        setModelos(data.data);
      } catch (error) {
        console.error("Erro ao buscar modelos:", error);
      }
    };

    const fetchCuponsAtivos = async () => {
      try {
        const response = await fetch(apiUrls.cupons);
        const data = await response.json();
        // Filtra placas que estão atualmente estacionadas (sem dataHoraSaida)
        const placasEstacionadas = data.data
          .filter((cupom: Cupom) => !cupom.dataHoraSaida)
          .map((cupom: Cupom) => cupom.placa);
        setCuponsAtivos(placasEstacionadas);
      } catch (error) {
        console.error("Erro ao buscar cupons:", error);
      }
    };

    fetchPlacas();
    fetchTiposVeiculo();
    fetchModelos();
    fetchCuponsAtivos();
  }, []);

  const obterNomeTipoVeiculo = (id: number) => {
    const tipo = tiposVeiculo.find((tipo) => tipo.id === id);
    return tipo ? tipo.veiculo : "Desconhecido";
  };

  const obterNomeModelo = (id: number) => {
    const modelo = modelos.find((modelo) => modelo.id === id);
    return modelo ? modelo.nomeModelo : "Desconhecido";
  };

  const obterHorarioLocal = () => {
    const agora = new Date();
    const offset = agora.getTimezoneOffset() * 60000; // Offset em milissegundos
    const horarioLocal = new Date(agora.getTime() - offset);
    return horarioLocal.toISOString().slice(0, 19).replace("T", " ");
  };

  const excluirPlaca = async (id: number) => {
    try {
      const response = await fetch(`/api/placa?id=${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setPlacas((prevPlacas) =>
          prevPlacas.filter((placa) => placa.id !== id)
      );
      window.location.reload();
        console.log("Placa excluída com sucesso.");
      } else {
        console.error("Erro ao excluir placa:", await response.json());
      }
    } catch (error) {
      console.error("Erro ao fazer requisição de exclusão:", error);
    }
  };

  const estacionarPlaca = async (id: number) => {
    try {
      const dataHoraEntrada = obterHorarioLocal();

      const response = await fetch(apiUrls.cupons, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          dataHoraEntrada,
          placaID: id,
        }),
      });

      if (response.ok) {
        setModalAberta(true); // Abre a modal
        const placaEstacionada = placas.find((placa) => placa.id === id)?.placa;
        if (placaEstacionada) {
          setCuponsAtivos((prev) => [...prev, placaEstacionada]); // Adiciona a placa à lista de cupons ativos
        }
      } else {
        throw new Error("Erro ao estacionar veículo");
      }
    } catch (error) {
      console.error(error);
      alert("Não foi possível estacionar o veículo");
    }
  };

  return (
    <div className={styles.tableSection}>
      <table>
        <thead>
          <tr className={styles.tableHeader}>
            <th>Placa</th>
            <th>Tipo</th>
            <th>Modelo</th>
            <th>Cor</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {placas.map((placa) => (
            <tr key={placa.id}>
              <td>{placa.placa}</td>
              <td>{obterNomeTipoVeiculo(placa.tipoVeiculoId)}</td>
              <td>{obterNomeModelo(placa.modeloId)}</td>
              <td>{placa.cor}</td>
              <td>
                <button
                  className="text-teal-600 underline decoration-1 pr-3"
                  onClick={() => estacionarPlaca(placa.id)}
                  disabled={cuponsAtivos.includes(placa.placa)} // Desabilita se o veículo já estiver estacionado
                  title={
                    cuponsAtivos.includes(placa.placa)
                      ? "Veículo já estacionado"
                      : "Estacionar veículo"
                  }
                >
                  Estacionar
                </button>
                <button
                  className="text-teal-600 underline decoration-1"
                  onClick={() => excluirPlaca(placa.id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {modalAberta && (
        <div
          className="modal-overlay"
          onClick={() => setModalAberta(false)} // Fecha ao clicar fora da modal
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // Evita fechar ao clicar na modal
          >
            <h2>Veículo estacionado com sucesso!</h2>
            <button
              onClick={() => setModalAberta(false)}
              className="close-button"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TablePlaca;
