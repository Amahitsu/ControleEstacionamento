"use client"; 

import { useEffect, useState } from 'react';
import { apiUrls } from '../config/config';
import styles from '../styles/Home.module.css';

const FormSection: React.FC = () => {
    const [placa, setPlaca] = useState('');
    const [tipoVeiculo, setTipoVeiculo] = useState('');
    const [modelo, setModelo] = useState('');
    const [color, setColor] = useState('');
    const [modelos, setModelos] = useState<{ nomeModelo: string }[]>([]);
    const [tiposVeiculo, setTiposVeiculo] = useState<{ veiculo: string }[]>([]);

    useEffect(() => {
        const fetchModelos = async () => {
            try {
                const response = await fetch(apiUrls.modelos);
                if (!response.ok) throw new Error('Erro ao buscar modelos');
                
                const data = await response.json();
                console.log('Modelos recebidos:', data);
                
                if (Array.isArray(data.data)) {
                    setModelos(data.data);
                } else {
                    console.warn('O retorno não é um array:', data.data);
                    setModelos([]);
                }
            } catch (error) {
                console.error(error);
                alert('Não foi possível carregar os modelos');
            }
        };

        const fetchTiposVeiculo = async () => {
            try {
                const response = await fetch(apiUrls.tipoVeiculo); 
                if (!response.ok) throw new Error('Erro ao buscar tipos de veículos');
                
                const data = await response.json();
                console.log('Tipos de veículos recebidos:', data);
                
                if (Array.isArray(data.data)) {
                    setTiposVeiculo(data.data);
                } else {
                    console.warn('O retorno não é um array:', data.data);
                    setTiposVeiculo([]);
                }
            } catch (error) {
                console.error(error);
                alert('Não foi possível carregar os tipos de veículos');
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
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({ 
                    placa, 
                    modeloId: modelo, 
                    tipoVeiculoId: tipoVeiculo, 
                    cor: color 
                }),
            });
    
            console.log('Dados a serem enviados:', { 
                placa, 
                modeloId: modelo, 
                tipoVeiculoId: tipoVeiculo, 
                cor: color,
            });

            if (!response.ok) throw new Error('Erro ao adicionar o veículo');

            const newCar = await response.json();
            console.log('Veículo adicionado:', newCar);
            alert('Veículo adicionado com sucesso!')

            setPlaca('');
            setTipoVeiculo('');
            setModelo('');
            setColor('');
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert('Não foi possível adicionar o carro');
        }
        
    };

    return (
        <div className={styles.formSection}>
            <input
                type="text"
                placeholder="Placa"
                value={placa}
                onChange={(e) => setPlaca(e.target.value)}
                maxLength={7} // Limita a 7 caracteres
            />
            <select
                className="w-full mb-2.5"
                value={tipoVeiculo}
                onChange={(e) => setTipoVeiculo(e.target.value)}
            >
                <option value="" disabled>Selecione o Tipo de Veículo</option>
                {tiposVeiculo.length > 0 ? (
                    tiposVeiculo.map((tipo, index) => (
                        <option key={index} value={tipo.veiculo}>
                            {tipo.veiculo}
                        </option>
                    ))
                ) : (
                    <option value="" disabled>Nenhum tipo disponível</option>
                )}
            </select>
            <select
                className="w-full mb-2.5"
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
            >
                <option value="" disabled>Selecione o Modelo</option>
                {modelos.length > 0 ? (
                    modelos.map((modelo, index) => (
                        <option key={index} value={modelo.nomeModelo}>
                            {modelo.nomeModelo}
                        </option>
                    ))
                ) : (
                    <option value="" disabled>Nenhum modelo disponível</option>
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
        </div>
    );
};

export default FormSection;
