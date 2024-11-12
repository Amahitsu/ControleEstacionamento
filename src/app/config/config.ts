// src/config/config.ts

const baseApiUrl =
  process.env.NODE_ENV === "production"
    ? "https://controle-estacionamento-lovat.vercel.app/api"
    : "http://localhost:3000/api";

export const apiUrls = {
  cupons: `${baseApiUrl}/cupom`,
  modelos: `${baseApiUrl}/modelo`,
  tipoVeiculo: `${baseApiUrl}/tipoVeiculo`,
  placas: `${baseApiUrl}/placa`,
  tarifas: `${baseApiUrl}/tarifas`

  // Adicione outros endpoints conforme necessário
};
