import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const placa = searchParams.get("placa");

    // Define consulta SQL com base nos parâmetros fornecidos
    let result;

    if (id) {
      // Consulta por ID
      result = await sql`
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
            c.id = ${id};
      `;
    } else if (placa) {
      // Consulta por placa
      result = await sql`
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
      `;
    } else {
      // Consulta geral
      result = await sql`
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
    }

    // Verifica se há registros
    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: "Nenhum registro encontrado." },
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
    const { placaID, dataHoraEntrada } = await request.json();
    const { rows } = await sql`
      INSERT INTO "cupom" ("dataHoraEntrada", "placaID")
      VALUES (${dataHoraEntrada}, ${placaID})
      RETURNING *;
    `;
    return NextResponse.json({ data: rows[0] }, { status: 201 });
  } catch (error) {
    console.error("Erro no POST:", error);
    return NextResponse.json(
      { error: "Erro ao criar o cupom." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "ID não fornecido." },
        { status: 400 }
      );
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
        { message: "Cupom não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: rows[0] }, { status: 200 });
  } catch (error) {
    console.error("Erro no PUT:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar o cupom." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request): Promise<NextResponse> {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: "ID não fornecido." },
        { status: 400 }
      );
    }

    const result = await sql`
      DELETE FROM "cupom"
      WHERE id = ${id};
    `;

    if (result.rowCount === 0) {
      return NextResponse.json(
        { message: "Cupom não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Cupom deletado com sucesso!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro no DELETE:", error);
    return NextResponse.json(
      { error: "Erro ao deletar o cupom." },
      { status: 500 }
    );
  }
}
