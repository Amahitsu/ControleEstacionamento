import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  try {
    const { rows } =
      await sql`SELECT* FROM tarifas`;
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

export async function DELETE(id: number): Promise<NextResponse> {
  try {
    const { rows } = await sql`DELETE FROM tarifas
      WHERE id = ${id}`;
      return NextResponse.json({ data: rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ data: error }, { status: 500 });
  }
}