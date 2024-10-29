
Para corrigir seu código, precisamos ajustar a função POST para receber um NextRequest como argumento, em vez de números diretamente, já que o Next.js espera que a função API tenha essa estrutura. Você também precisará ler os dados do corpo da requisição usando request.json().

Aqui está o código corrigido:

typescript
Copiar código
import { sql } from "@vercel/postgres";
import { NextResponse, NextRequest } from "next/server";

// Função para registrar o momento de saída
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Lê os dados do corpo da requisição
    const { cupomId, valorTotal } = await request.json();
    
    const currentDate = new Date().toISOString();

    // Atualiza o cupom com a data de saída e valor total
    const { rows } = await sql`
      UPDATE "cupom"
      SET dataHoraSaida = ${currentDate}, valorTotal = ${valorTotal}
      WHERE id = ${cupomId}
      RETURNING *;
    `;

    // Retorna os dados atualizados
    return NextResponse.json({ data: rows }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json({ message: 'Erro ao registrar a saída', error: errorMessage }, { status: 500 });
  }
}