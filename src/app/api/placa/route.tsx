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

export async function DELETE(id: number): Promise<NextResponse> {
  try {
    const { rows } = await sql`DELETE FROM placa
      WHERE id = ${id}`;
      return NextResponse.json({ data: rows }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ data: error }, { status: 500 });
    }
}