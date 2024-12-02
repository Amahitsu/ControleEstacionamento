import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  try {
    const { rows } = await sql`SELECT * FROM "tarifas"`;
    return NextResponse.json({ data: rows }, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar tarifas:', error);
    return NextResponse.json({ message: 'Erro ao buscar tarifas', error: error }, { status: 500 });
  }
}

/* export async function GET_BY_TYPE(request: NextRequest): Promise<NextResponse> {
  try {
    // Obtém o parâmetro 'tipoVeiculo' da query string
    const { searchParams } = new URL(request.url);
    const tipoVeiculo = searchParams.get('tipoVeiculo');  // "tipoVeiculo" passado como query string

    if (!tipoVeiculo) {
      return NextResponse.json({ message: 'Tipo de veículo não fornecido.' }, { status: 400 });
    }

    // Busca a tarifa associada ao tipo de veículo
    const { rows } = await sql`
      SELECT t."horaCobrada", t."valor", tv."veiculo"
      FROM "tarifas" t
      JOIN "tipoVeiculo" tv ON t."tipoVeiculoId" = tv."id"
      WHERE tv."veiculo" = ${tipoVeiculo}
    `;

    if (rows.length === 0) {
      return NextResponse.json({ message: 'Tarifa não encontrada para esse tipo de veículo.' }, { status: 404 });
    }

    return NextResponse.json({ data: rows[0] }, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar tarifa:', error);
    return NextResponse.json({ message: 'Erro ao buscar tarifa', error: error }, { status: 500 });
  }
}
 */

export async function POST(request: Request): Promise<NextResponse> {
  try {
    
    const { horaCobrada, tipoVeiculo, valor } = await request.json();

    
    if (!horaCobrada || !tipoVeiculo || valor === undefined) {
      return NextResponse.json(
        { message: "Campos faltando ou inválidos" },
        { status: 400 }
      );
    }

    
    const tipoVeiculoResult = await sql`
      SELECT id FROM "tipoVeiculo" WHERE "veiculo" = ${tipoVeiculo}
    `;
    if (tipoVeiculoResult.rowCount === 0) {
      return NextResponse.json({ message: "Tipo de veículo não encontrado." }, { status: 404 });
    }
    const tipoVeiculoId = tipoVeiculoResult.rows[0].id;

    
    const valorNumerico = parseFloat(valor);

    
    const { rows } = await sql`
      INSERT INTO tarifas ("horaCobrada", "tipoVeiculoId", "valor")
      VALUES (${horaCobrada}, ${tipoVeiculoId}, ${valorNumerico})
      RETURNING *;
    `;

    return NextResponse.json({ data: rows }, { status: 200 });
  } catch (error: unknown) {
    
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("Erro ao adicionar tarifa:", errorMessage);
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}


export async function PUT(request: Request): Promise<NextResponse> {
  try {
    const { id, horaCobrada, tipoVeiculoId, valor } = await request.json();

    const { rows } = await sql`
      UPDATE tarifas
      SET "horaCobrada" = ${horaCobrada}, "tipoVeiculoId" = ${tipoVeiculoId}, "valor" = ${valor}
      WHERE "id" = ${id}
      RETURNING *
    `;

    return NextResponse.json({ data: rows }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json({ data: errorMessage }, { status: 500 });
  }
}


export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
      const { searchParams } = new URL(request.url);
      const id = searchParams.get("id");

      if (!id) {
          return NextResponse.json({ message: 'ID não fornecido.' }, { status: 400 });
      }

      const { rowCount } = await sql`
          DELETE FROM tarifas WHERE id = ${id}
      `;

      if (rowCount === 0) {
          return NextResponse.json({ message: 'Tarifa não encontrada.' }, { status: 404 });
      }

      return NextResponse.json({ message: 'Tarifa excluída com sucesso.' }, { status: 200 });
  } catch (error) {
      console.error('Erro ao excluir tarifa:', error);
      return NextResponse.json({ message: 'Erro ao excluir a tarifa', error: error }, { status: 500 });
  }
}