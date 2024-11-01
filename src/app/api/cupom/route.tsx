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

export async function PUT(request: Request, { params }: { params: { id: number } }): Promise<NextResponse> {
  try {
    const { placa, id_cor, id_modelo } = await request.json(); // Recebe os dados do corpo da requisição
    const { rows } = await sql`
      UPDATE carros
      SET placa = ${placa}, id_cor = ${id_cor}, id_modelo = ${id_modelo}
      WHERE id = ${params.id};`;
    return NextResponse.json({ data: rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: number } }): Promise<NextResponse> {
  try {
    const { rows } = await sql`DELETE FROM carros WHERE id = ${params.id};`;
    return NextResponse.json({ data: rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
