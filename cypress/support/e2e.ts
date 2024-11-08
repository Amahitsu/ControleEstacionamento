describe("Formulário de Cadastro de Placa", () => {
    beforeEach(() => {
      cy.visit("http://localhost:3000"); 
    });
  
    it("Deve preencher o formulário e adicionar uma nova placa", () => {
      
      cy.get('input[placeholder="Placa"]').type("XYZ1234");
  
      
      cy.get("select").eq(0).select("1"); 
  
      
      cy.get("select").eq(1).select("2"); 
  
      
      cy.get('input[placeholder="Cor"]').type("Azul");
  
    
      cy.get("button").contains("Confirmar").click();
  
      
      cy.wait(1000); 
  
      
      cy.get('input[placeholder="Placa"]').should('be.empty');
      cy.get('input[placeholder="Cor"]').should('be.empty');
    });
  });
  