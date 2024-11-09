"use client";

import { useEffect, useState } from 'react';
import { apiUrls } from '../config/config';
import styles from '../styles/Home.module.css';

const FormSection: React.FC = () => {
    const [horaCobrada, setHoraCobrada] = useState('');
    const [tipoVeiculo, setTipoVeiculo] = useState('');
    const [valor, setValor] = useState('');
    const [tiposVeiculo, setTiposVeiculo] = useState<{ veiculo: string }[]>([]);

    // Função para formatar o valor como moeda real
    const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    
        // Formata para duas casas decimais
        const formattedValue = (Number(value) / 100).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        setValor(formattedValue);
    }
    
    //função para puxar os tipos de Veiculos cadastrados.
    useEffect(() => {
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

        fetchTiposVeiculo();
    }, []);

    const handleAddTarifa = async () => {
        if (!horaCobrada || !tipoVeiculo || !valor) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        try {
            // Certifique-se de que estamos enviando o ID do tipoVeiculo (não o nome)
            const response = await fetch(apiUrls.tarifas, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({ horaCobrada, tipoVeiculo, valor }), // Envia o ID, não o nome
            });

            if (!response.ok) throw new Error('Erro ao adicionar a tarifa');

            const newTarifa = await response.json();
            console.log('Tarifa adicionada:', newTarifa);
            alert('Tarifa adicionada com sucesso!');

            // Limpa os campos após a adição
            setHoraCobrada('');
            setTipoVeiculo('');
            setValor('');
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert('Não foi possível adicionar a tarifa');
        }
    };

    return (
        <div className={styles.formSection}>
            <input
                type="time"
                placeholder="Hora Cobrada"
                value={horaCobrada}
                onChange={(e) => setHoraCobrada(e.target.value)}
                maxLength={5} // Limita a 5 caracteres
            />
            <select
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
            <input
                type="text"
                placeholder="Valor (R$)"
                value={valor}
                onChange={handleValorChange}
            />
            <button className={styles.confirmButton} onClick={handleAddTarifa}>
                Confirmar
            </button>
        </div>
    );
};

export default FormSection;
