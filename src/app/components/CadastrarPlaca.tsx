"use client";

import { useEffect, useState } from "react";
import { apiUrls } from "../config/config";
import styles from "../styles/Home.module.css";

const FormSection: React.FC = () => {
  const [placa, setPlaca] = useState("");
  const [tipoVeiculo, setTipoVeiculo] = useState("");
  const [modelo, setModelo] = useState("");
  const [color, setColor] = useState("");
  const [modelos, setModelos] = useState<{ nomeModelo: string }[]>([]);
  const [tiposVeiculo, setTiposVeiculo] = useState<{ veiculo: string }[]>([]);
  const [modalAberta, setModalAberta] = useState(false); // Estado para controlar a modal

  useEffect(() => {
    const fetchModelos = async () => {
      try {
        const response = await fetch(apiUrls.modelos);
        if (!response.ok) throw new Error("Erro ao buscar modelos");

        const data = await response.json();
        console.log("Modelos recebidos:", data);

        if (Array.isArray(data.data)) {
          setModelos(data.data);
        } else {
          console.warn("O retorno não é um array:", data.data);
          setModelos([]);
        }
      } catch (error) {
        console.error(error);
        alert("Não foi possível carregar os modelos");
      }
    };

    const fetchTiposVeiculo = async () => {
      try {
        const response = await fetch(apiUrls.tipoVeiculo);
        if (!response.ok) throw new Error("Erro ao buscar tipos de veículos");

        const data = await response.json();
        console.log("Tipos de veículos recebidos:", data);

        if (Array.isArray(data.data)) {
          setTiposVeiculo(data.data);
        } else {
          console.warn("O retorno não é um array:", data.data);
          setTiposVeiculo([]);
        }
      } catch (error) {
        console.error(error);
        alert("Não foi possível carregar os tipos de veículos");
      }
    };

    fetchModelos();
    fetchTiposVeiculo();
  }, []);

  const handleAddCar = async () => {
    if (!placa || !tipoVeiculo || !modelo || !color) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const response = await fetch(apiUrls.placas, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          placa,
          modeloId: modelo,
          tipoVeiculoId: tipoVeiculo,
          cor: color,
        }),
      });

      console.log("Dados a serem enviados:", {
        placa,
        modeloId: modelo,
        tipoVeiculoId: tipoVeiculo,
        cor: color,
      });

      if (!response.ok) throw new Error("Erro ao adicionar o veículo");

      const newCar = await response.json();
      console.log("Veículo adicionado:", newCar);
      setModalAberta(true); // Abre a modal de sucesso

      // Limpa os campos do formulário após o sucesso
      setPlaca("");
      setTipoVeiculo("");
      setModelo("");
      setColor("");
    } catch (error) {
      console.error(error);
      alert("Não foi possível adicionar o carro");
    }
  };

  return (
    <div className={styles.formSection}>
      <input
        type="text"
        placeholder="Placa"
        value={placa}
        onChange={(e) => setPlaca(e.target.value)}
        maxLength={7}
      />
      <select
        className="w-full mb-2.5"
        value={tipoVeiculo}
        onChange={(e) => setTipoVeiculo(e.target.value)}
      >
        <option value="" disabled>
          Selecione o Tipo de Veículo
        </option>
        {tiposVeiculo.length > 0 ? (
          tiposVeiculo.map((tipo, index) => (
            <option key={index} value={tipo.veiculo}>
              {tipo.veiculo}
            </option>
          ))
        ) : (
          <option value="" disabled>
            Nenhum tipo disponível
          </option>
        )}
      </select>
      <select
        className="w-full mb-2.5"
        value={modelo}
        onChange={(e) => setModelo(e.target.value)}
      >
        <option value="" disabled>
          Selecione o Modelo
        </option>
        {modelos.length > 0 ? (
          modelos.map((modelo, index) => (
            <option key={index} value={modelo.nomeModelo}>
              {modelo.nomeModelo}
            </option>
          ))
        ) : (
          <option value="" disabled>
            Nenhum modelo disponível
          </option>
        )}
      </select>
      <input
        type="text"
        placeholder="Cor"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
      <button className={styles.confirmButton} onClick={handleAddCar}>
        Salvar
      </button>

      {/* Modal de Sucesso */}
      {modalAberta && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setModalAberta(false)} // Fecha a modal ao clicar fora
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-96"
            onClick={(e) => e.stopPropagation()} // Impede o fechamento ao clicar no conteúdo da modal
          >
            <h2 className="text-xl font-semibold mb-4">
              Veículo Adicionado com Sucesso!
            </h2>
            <button
              onClick={() => {
                setModalAberta(false); // Fecha a modal
                window.location.reload(); // Recarrega a página
              }}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormSection;
