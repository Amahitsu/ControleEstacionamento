import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  try {
    const { rows } =
      await sql`SELECT* FROM "cupom"`;
      return NextResponse.json({ data: rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ data: error }, { status: 500 });
  }
}

// Função para registrar o momento de entrada
export async function POSTEntrada(
  placaId: number,
  descricao: string
): Promise<NextResponse> {
  try {
    const currentDate = new Date().toISOString();
    const { rows } = await sql`
      INSERT INTO cupom (dataHoraEntrada, descricao, placaID)
      VALUES (${currentDate}, ${descricao}, ${placaId})
      RETURNING *;
    `;
    return NextResponse.json({ data: rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ data: error }, { status: 500 });
  }
}

// Função para registrar o momento de saída
export async function POSTSaida(
  cupomId: number,
  valorTotal: number
): Promise<NextResponse> {
  try {
    const currentDate = new Date().toISOString();
    const { rows } = await sql`
      UPDATE cupom
      SET dataHoraSaida = ${currentDate}, valorTotal = ${valorTotal}
      WHERE id = ${cupomId}
      RETURNING *;
    `;
    return NextResponse.json({ data: rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ data: error }, { status: 500 });
  }
}

export async function PUT(
  id: number,
  descricao: string,
  placaId: number,
): Promise<NextResponse> {
  try {
    const { rows } = await sql`UPDATE cupom
      SET descricao = ${descricao}, placaId= ${placaId},
      WHERE id = ${id};`
      return NextResponse.json({ data: rows }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ data: error }, { status: 500 });
    }
}

export async function DELETE(id: number): Promise<NextResponse> {
  try {
    const { rows } = await sql`DELETE FROM cupom
      WHERE id = ${id}`;
      return NextResponse.json({ data: rows }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ data: error }, { status: 500 });
    }
}