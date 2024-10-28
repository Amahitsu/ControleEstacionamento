import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

// Função para registrar o momento de entrada
export async function POST(
    placaId: number,
    descricao: string
  ): Promise<NextResponse> {
    try {
      const currentDate = new Date().toISOString();
      const { rows } = await sql`
        INSERT INTO "cupom" (dataHoraEntrada, descricao, placaID)
        VALUES (${currentDate}, ${descricao}, ${placaId})
        RETURNING *;
      `;
      return NextResponse.json({ data: rows }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ data: error }, { status: 500 });
    }
  }