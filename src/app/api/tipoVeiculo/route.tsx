import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  try {
    const { rows } =
      await sql`SELECT* FROM "tipoVeiculo"`;
      return NextResponse.json({ data: rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ data: error }, { status: 500 });
  }
}


/*
export async function POST(
  placa: string,
  id_cor: string,
  id_modelo: string,
): Promise<NextResponse> {
  try {
    const { rows } =
      await sql`INSERT INTO carros (placa, id_cor, id_modelo, data_cadastro)
      VALUES (${placa}, ${id_cor}, ${id_modelo}, ${DateUtils.GetCurrentDateAsString()});`;
      return NextResponse.json({ data: rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ data: error }, { status: 500 });
  }
}

export async function PUT(
  id: number,
  placa: string,
  id_cor: string,
  id_modelo: string,
): Promise<NextResponse> {
  try {
    const { rows } = await sql`UPDATE carros
      SET placa = ${placa}, id_cor = ${id_cor}, id_modelo = ${id_modelo}
      WHERE id = ${id};`;
    return ApiHandler.ResponseToJson(rows, 200);
  } catch (error) {
    return ApiHandler.ResponseToJson(error, 500);
  }
}

export async function DELETE(id: number): Promise<NextResponse> {
  try {
    const { rows } = await sql`DELETE FROM carros
      WHERE id = ${id}`;
    return ApiHandler.ResponseToJson(rows, 200);
  } catch (error) {
    return ApiHandler.ResponseToJson(error, 500);
  }
}*/