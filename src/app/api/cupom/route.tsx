import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  try {
    const { rows } = await sql`SELECT * FROM "cupom"`;
    return NextResponse.json({ data: rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { placa, id_modelo } = await request.json(); // Extrai os dados do corpo da requisição
    const currentDate = new Date().toISOString(); // Data atual no formato ISO
    const { rows } = await sql`
      INSERT INTO cupom (dataHoraEntrada, placa, id_modelo)
      VALUES (${currentDate}, ${placa}, ${id_modelo})
      RETURNING *;`; // Retorna todos os campos do novo registro
    return NextResponse.json({ data: rows[0] }, { status: 201 }); // Retorna o registro inserido
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function PUT(
  id: number,
  descricao: string,
  placaId: number,
): Promise<NextResponse> {
  try {
    const { rows } = await sql`UPDATE "cupom"
      SET descricao = ${descricao}, placaId= ${placaId},
      WHERE id = ${id};`
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
      DELETE FROM "cupom"
      WHERE id = ${id}
    `;

    // Se result não tem rowCount, pode simplesmente verificar se houve erro
    if (result?.rowCount && result.rowCount > 0) {
      return NextResponse.json({ message: 'Cupom deletado com sucesso!' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Cupom não encontrado' }, { status: 404 });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json({ message: 'Erro ao deletar o cupom', error: errorMessage }, { status: 500 });
  }
}