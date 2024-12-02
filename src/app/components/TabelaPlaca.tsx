"use client";

import React, { useEffect, useState } from "react";
import { apiUrls } from "../config/config";
import styles from '../styles/Home.module.css';

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

interface ComprovanteProps {
  placa: string;
  tipoVeiculo: string;
  modelo: string;
  cor: string;
  dataHoraEntrada: string; 
  idCupom: number;
}

const Comprovante: React.FC<ComprovanteProps> = ({ placa, tipoVeiculo, modelo, cor, dataHoraEntrada, idCupom }) => {
  
  const formatarDataHora = (dataHora: string) => {
    const data = new Date(dataHora);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0'); 
    const ano = data.getFullYear();
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} - ${horas}:${minutos}`;
  };

  return (
    <div className="comprovante">
      <h3>Comprovante de Estacionamento</h3>
      <p><strong>Placa:</strong> {placa}</p>
      <p><strong>Veículo:</strong> {tipoVeiculo}</p>
      <p><strong>Modelo:</strong> {modelo}</p>
      <p><strong>Cor:</strong> {cor}</p>
      <p><strong>Data e Hora de Entrada:</strong> {formatarDataHora(dataHoraEntrada)}</p>
      <p><strong>ID do Cupom:</strong> {idCupom}</p>
    </div>
  );
};

const TablePlaca: React.FC = () => {
  const [placas, setPlacas] = useState<Placa[]>([]);
  const [tiposVeiculo, setTiposVeiculo] = useState<TipoVeiculo[]>([]);
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [cuponsAtivos, setCuponsAtivos] = useState<string[]>([]);
  const [modalAberta, setModalAberta] = useState(false);
  const [modalMensagem, setModalMensagem] = useState<string | null>(null);
  const [placaBusca, setPlacaBusca] = useState<string>("");
  const [resultadoBusca, setResultadoBusca] = useState<Placa[]>([]);
  const [comprovanteDados, setComprovanteDados] = useState<ComprovanteProps | null>(null);

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

  const ajustarHorario = () => {
    const agora = new Date();
    agora.setHours(agora.getHours() - 3);
    return agora.toISOString().slice(0, 19).replace("T", " ");
  };

  const buscarPlaca = () => {
    const resultado = placas.filter((placa) =>
      placa.placa.toLowerCase().includes(placaBusca.toLowerCase())
    );
    setResultadoBusca(resultado);
  };

  const limparBusca = () => {
    setPlacaBusca("");
    setResultadoBusca([]);
  };

  const estacionarPlaca = async (id: number) => {
    const placa = placas.find((placa) => placa.id === id);

    if (placa && cuponsAtivos.includes(placa.placa)) {
      alert("Este veículo já está estacionado.");
      return;
    }

    if (!placa) {
      console.error("Placa está indefinida");
      return;
    }

    try {
      const dataHoraEntrada = ajustarHorario();

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
        const responseData = await response.json(); 
        const idCupom = responseData.data.id;

        const placaEstacionada = placas.find((placa) => placa.id === id)?.placa;
        if (placaEstacionada) {
          setCuponsAtivos((prev) => [...prev, placaEstacionada]);
        }
        setModalMensagem("Veículo estacionado com sucesso!");
        setComprovanteDados({
          placa: placa.placa,
          tipoVeiculo: obterNomeTipoVeiculo(placa.tipoVeiculoId),
          modelo: obterNomeModelo(placa.modeloId),
          cor: placa.cor,
          dataHoraEntrada,
          idCupom,
        });
        setModalAberta(true);
      } else {
        throw new Error("Erro ao estacionar veículo");
      }
    } catch (error) {
      console.error(error);
      alert("Não foi possível estacionar o veículo");
    }
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
        setModalMensagem("Placa excluída com sucesso!");
        setModalAberta(true);
      } else {
        throw new Error("Erro ao excluir placa.");
      }
    } catch (error) {
      console.error("Erro ao excluir placa:", error);
      alert("Erro ao excluir placa.");
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4">
        <input
          type="text"
          className="rounded-md px-2 py-1 mr-2 w-full max-w-[300px]"
          placeholder="Buscar placa"
          value={placaBusca}
          onChange={(e) => setPlacaBusca(e.target.value)}
        />
        <button
          onClick={buscarPlaca}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Buscar
        </button>
        <button
          onClick={limparBusca}
          className="bg-gray-500 text-white px-4 py-2 rounded-md ml-2 hover:bg-gray-700"
        >
          Limpar busca
        </button>
      </div>

    <div className={styles.tableSection}>
      <table className="table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">Placa</th>
            <th className="px-4 py-2">Tipo</th>
            <th className="px-4 py-2">Modelo</th>
            <th className="px-4 py-2">Cor</th>
            <th className="px-4 py-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {resultadoBusca.length > 0 ? (
            resultadoBusca.map((placa) => (
              <tr key={placa.id}>
                <td className="px-4 py-2">{placa.placa}</td>
                <td className="px-4 py-2">{obterNomeTipoVeiculo(placa.tipoVeiculoId)}</td>
                <td className="px-4 py-2">{obterNomeModelo(placa.modeloId)}</td>
                <td className="px-4 py-2">{placa.cor}</td>
                <td className="px-4 py-2 flex gap-4">
                  <button
                    onClick={() => estacionarPlaca(placa.id)}
                    disabled={cuponsAtivos.includes(placa.placa)}
                    className={`${cuponsAtivos.includes(placa.placa)
                      ? "text-gray-500 cursor-not-allowed"
                      : "text-blue-600 underline"
                      }`}
                    title={
                      cuponsAtivos.includes(placa.placa)
                        ? "Este veículo já está estacionado."
                        : "Estacionar veículo"
                    }
                  >
                    Estacionar
                  </button>
                  <button
                    onClick={() => excluirPlaca(placa.id)}
                    className="text-red-600 underline"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          ) : (
            placas.map((placa) => (
              <tr key={placa.id}>
                <td className="px-4 py-2">{placa.placa}</td>
                <td className="px-4 py-2">{obterNomeTipoVeiculo(placa.tipoVeiculoId)}</td>
                <td className="px-4 py-2">{obterNomeModelo(placa.modeloId)}</td>
                <td className="px-4 py-2">{placa.cor}</td>
                <td className="px-4 py-2 flex gap-4">
                  <button
                    onClick={() => estacionarPlaca(placa.id)}
                    disabled={cuponsAtivos.includes(placa.placa)}
                    className={`${cuponsAtivos.includes(placa.placa)
                      ? "text-gray-500 cursor-not-allowed"
                      : "text-blue-600 underline"
                      }`}
                    title={
                      cuponsAtivos.includes(placa.placa)
                        ? "Este veículo já está estacionado."
                        : "Estacionar veículo"
                    }
                  >
                    Estacionar
                  </button>
                  <button
                    onClick={() => excluirPlaca(placa.id)}
                    className="text-red-600 underline"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>
      {/* Modal Sucesso */}
      {modalAberta && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">{modalMensagem}</h2>
            {comprovanteDados && (
              <Comprovante {...comprovanteDados} />
            )}
            <button
              onClick={() => setModalAberta(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-md mr-4 mt-2 hover:bg-gray-700"
            >
              Fechar
            </button>
            <button onClick={() => window.print()} className="bg-green-600 text-white px-4 py-2 mt-2 rounded-md hover:bg-green-700">
              Imprimir Comprovante
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TablePlaca;
