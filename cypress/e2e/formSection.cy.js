describe('Testando o Formulário de Tarifas', () => {
    beforeEach(() => {
      // Visita a página principal antes de cada teste
      cy.visit('/');
    });
  
    it('Deve carregar o formulário e validar os campos', () => {
      // Verifica se o campo de hora é exibido
      cy.get('input[type="time"]').should('be.visible');
  
      // Verifica se o dropdown de tipos de veículos é exibido
      cy.get('select').should('be.visible');
  
      // Verifica se o campo de valor é exibido
      cy.get('input[placeholder="Valor (R$)"]').should('be.visible');
  
      // Verifica se o botão "Salvar" é exibido
      cy.contains('button', 'Salvar').should('be.visible');
    });
  
    it('Deve preencher os campos e simular o envio', () => {
      // Preenche o campo de hora
      cy.get('input[type="time"]').type('08:00');
  
      // Seleciona um tipo de veículo (simulando que há opções disponíveis)
      cy.get('select').select('Carro');
  
      // Preenche o valor
      cy.get('input[placeholder="Valor (R$)"]').type('150');
  
      // Clica no botão de salvar
      cy.contains('button', 'Salvar').click();
  
      // Verifica se a tarifa foi salva com sucesso
      cy.on('window:alert', (text) => {
        expect(text).to.contains('Tarifa adicionada com sucesso!');
      });
    });
  
    it('Deve exibir uma mensagem de erro ao enviar com campos vazios', () => {
      // Clica no botão de salvar sem preencher os campos
      cy.contains('button', 'Salvar').click();
  
      // Verifica a mensagem de erro
      cy.on('window:alert', (text) => {
        expect(text).to.contains('Por favor, preencha todos os campos.');
      });
    });
  });
      