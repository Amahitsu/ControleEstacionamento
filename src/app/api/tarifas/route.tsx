import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  try {
    const { rows } =
      await sql`SELECT* FROM "tarifas"`;
      return NextResponse.json({ data: rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ data: error }, { status: 500 });
  }
}


export async function POST(
  horaCobrada: string,
  tipoVeiculoId: number,
  valor: number,

): Promise<NextResponse> {
  try {
    const { rows } =
      await sql`INSERT INTO tarifas (horaCobrada, tipoVeiculoId, valor)
      VALUES (${horaCobrada}, ${tipoVeiculoId}, ${valor};
      RETURNING`;
      return NextResponse.json({ data: rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ data: error }, { status: 500 });
  }
}


export async function PUT(
  id: number,
  horaCobrada: string,
  tipoVeiculoId: number,
  valor: number,
): Promise<NextResponse> {
  try {
    const { rows } = await sql`UPDATE tarifas
      SET horaCobrada = ${horaCobrada}, tipoVeiculoId = ${tipoVeiculoId}, valor = ${valor}
      WHERE id = ${id};`;
      return NextResponse.json({ data: rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ data: error }, { status: 500 });
  }
}

export async function DELETE(request: Request): Promise<NextResponse> {
  try {
    const { id } = await request.json(); // Lendo o ID do corpo da requisição

    // Executando o DELETE
    const result = await sql`
      DELETE FROM "tarifa"
      WHERE id = ${id}
    `;

    // Se result não tem rowCount, pode simplesmente verificar se houve erro
    if (result?.rowCount && result.rowCount > 0) {
      return NextResponse.json({ message: 'Tarifa deletada com sucesso!' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Tarifa não encontrada' }, { status: 404 });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json({ message: 'Erro ao deletar a tarifa', error: errorMessage }, { status: 500 });
  }
}