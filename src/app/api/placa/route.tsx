import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  try {
    const { rows } =
      await sql`SELECT* FROM "placa"`;
      return NextResponse.json({ data: rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ data: error }, { status: 500 });
  }
}

export async function POST(
  placa: string,
  modeloId: number,
  tipoVeiculoId: number,

): Promise<NextResponse> {
  try {
    const { rows } =
      await sql`INSERT INTO placa (modeloId, placa, tipoVeiculoId)
      VALUES (${modeloId}, ${placa}), ${tipoVeiculoId};`;
      return NextResponse.json({ data: rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ data: error }, { status: 500 });
  }
}

export async function PUT(
  id: number,
  placa: string,
  modeloId: number,
  tipoVeiculoId: number,
): Promise<NextResponse> {
  try {
    const { rows } = await sql`UPDATE placa
      SET placa = ${modeloId}, ${placa}, ${tipoVeiculoId}
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
      DELETE FROM "placa"
      WHERE id = ${id}
    `;

    // Se result não tem rowCount, pode simplesmente verificar se houve erro
    if (result?.rowCount && result.rowCount > 0) {
      return NextResponse.json({ message: 'Placa deletado com sucesso!' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Placa não encontrada' }, { status: 404 });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json({ message: 'Erro ao deletar a placa', error: errorMessage }, { status: 500 });
  }
}