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
  const [modalAberta, setModalAberta] = useState(false); // Modal de sucesso
  const [modalErroAberta, setModalErroAberta] = useState(false); // Modal de erro
  const [mensagemErro, setMensagemErro] = useState(""); // Mensagem para a modal de erro

  interface Carro {
    placa: string;
  }

  useEffect(() => {
    const fetchModelos = async () => {
      try {
        const response = await fetch(apiUrls.modelos);
        if (!response.ok) throw new Error("Erro ao buscar modelos");

        const data = await response.json();
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
      setMensagemErro("Por favor, preencha todos os campos.");
      setModalErroAberta(true);
      return;
    }

    try {
      const placaMaiuscula = placa.toUpperCase(); // Convertendo a placa para maiúscula

      // Verifica se a placa já existe
      const responseCheck = await fetch(`${apiUrls.placas}?placa=${placaMaiuscula}`);
      if (!responseCheck.ok) {
        throw new Error("Erro ao verificar a existência da placa");
      }

      const dataCheck = await responseCheck.json();
      console.log("Resultado da verificação:", dataCheck);

      // Valida se a placa já existe
      const placaExistente =
        dataCheck?.data && Array.isArray(dataCheck.data) && dataCheck.data.some((carro: Carro) => carro.placa === placaMaiuscula);

      if (placaExistente) {
        setMensagemErro("A placa já está cadastrada. Por favor, insira outra.");
        setModalErroAberta(true);
        return;
      }

      // Adiciona o veículo se a placa não existir
      const response = await fetch(apiUrls.placas, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          placa: placaMaiuscula, // Enviando a placa em maiúsculas
          modeloId: modelo,
          tipoVeiculoId: tipoVeiculo,
          cor: color,
        }),
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
      setMensagemErro("Não foi possível adicionar o carro.");
      setModalErroAberta(true);
    }
  };

  return (
    <div className={styles.formSection}>
      <input
        type="text"
        placeholder="Placa"
        value={placa}
        onChange={(e) => setPlaca(e.target.value.toUpperCase())} // Convertendo para maiúsculas enquanto digita
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">
              Veículo Adicionado com Sucesso!
            </h2>
            <button
              onClick={() => {
                setModalAberta(false);
                window.location.reload();
              }}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Modal de Erro */}
      {modalErroAberta && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4 text-red-500">Erro</h2>
            <p className="mb-4">{mensagemErro}</p>
            <button
              onClick={() => setModalErroAberta(false)}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
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
