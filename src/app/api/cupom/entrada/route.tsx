import { sql } from "@vercel/postgres";
import { NextResponse, NextRequest } from "next/server";

// Função para registrar o momento de entrada
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { placaId, descricao } = await request.json();
    const currentDate = new Date().toISOString();
    
    const { rows } = await sql`
        INSERT INTO "cupom" (dataHoraEntrada, descricao, placaID)
        VALUES (${currentDate}, ${descricao}, ${placaId})
        RETURNING *;
    `;
    
    return NextResponse.json({ data: rows }, { status: 200 });
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json({ message: 'Ocorreu um erro ao criar o cupom', error: errorMessage }, { status: 500 });
  }
}
