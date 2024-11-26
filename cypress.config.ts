const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000/pages/cadastrarTarifa", // Substitua pela URL da sua aplicação
  },
});
