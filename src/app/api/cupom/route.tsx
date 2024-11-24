import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Obter o parâmetro "placa" da URL
    const { searchParams } = new URL(req.url);
    const placa = searchParams.get("placa");

    // Se o parâmetro "placa" foi fornecido, adicionar a cláusula WHERE com segurança
    const result = placa
      ? await sql`
          SELECT 
              c.id AS "id",
              c."dataHoraEntrada",
              c."dataHoraSaida",
              p."placa" AS "placa",
              tv."id" AS "idTipoVeiculo",
              tv."veiculo" AS "tipoVeiculo",
              m."nomeModelo" AS "modelo"
          FROM 
              "cupom" c
          JOIN 
              "placa" p ON p.id = c."placaID"
          JOIN 
              "tipoVeiculo" tv ON tv.id = p."tipoVeiculoId"
          JOIN
              "modelo" m ON m.id = p."modeloId"
          WHERE
              c."dataHoraSaida" IS NULL
              AND p."placa" = ${placa};
        `
      : await sql`
          SELECT 
              c.id AS "id",
              c."dataHoraEntrada",
              c."dataHoraSaida",
              p."placa" AS "placa",
              tv."id" AS "idTipoVeiculo",
              tv."veiculo" AS "tipoVeiculo",
              m."nomeModelo" AS "modelo"
          FROM 
              "cupom" c
          JOIN 
              "placa" p ON p.id = c."placaID"
          JOIN 
              "tipoVeiculo" tv ON tv.id = p."tipoVeiculoId"
          JOIN
              "modelo" m ON m.id = p."modeloId"
          WHERE
              c."dataHoraSaida" IS NULL;
        `;

    // Acessar `rows` do resultado e verificar se há registros
    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: "Nenhum registro encontrado para a placa especificada." },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: result.rows }, { status: 200 });
  } catch (error) {
    console.error("Erro no GET:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { placaID, dataHoraEntrada } = await request.json(); // Extrai os dados do corpo da requisição
    const { rows } = await sql`
      INSERT INTO cupom ("dataHoraEntrada", "placaID")
      VALUES (${dataHoraEntrada}, ${placaID})
      RETURNING *;`; // Retorna todos os campos do novo registro
    return NextResponse.json({ data: rows[0] }, { status: 201 }); // Retorna o registro inserido
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "ID não fornecido." }, { status: 400 });
    }

    const { dataHoraSaida, valorTotal } = await request.json();

    if (!dataHoraSaida || valorTotal === undefined) {
      return NextResponse.json(
        { message: "Campos obrigatórios faltando." },
        { status: 400 }
      );
    }

    const { rows } = await sql`
      UPDATE "cupom"
      SET "dataHoraSaida" = ${dataHoraSaida}, "valorTotal" = ${valorTotal}
      WHERE id = ${id}
      RETURNING *;
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Cupom não encontrado para o ID fornecido." },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: rows[0] }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido.";
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
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
      return NextResponse.json(
        { message: "Cupom deletado com sucesso!" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Cupom não encontrado" },
        { status: 404 }
      );
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json(
      { message: "Erro ao deletar o cupom", error: errorMessage },
      { status: 500 }
    );
  }
}
