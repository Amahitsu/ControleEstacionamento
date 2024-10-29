import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

// Função para registrar o momento de saída
export async function POST(
    cupomId: number,
    valorTotal: number
  ): Promise<NextResponse> {
    try {
      const currentDate = new Date().toISOString();
      const { rows } = await sql`
        UPDATE "cupom"
        SET dataHoraSaida = ${currentDate}, valorTotal = ${valorTotal}
        WHERE id = ${cupomId}
        RETURNING *;
      `;
      return NextResponse.json({ data: rows }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ data: error }, { status: 500 });
    }
  }